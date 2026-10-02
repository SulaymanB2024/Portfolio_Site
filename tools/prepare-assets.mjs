/** Reproducible Sketchfab GLB intake, validation and optional web quality tiers. */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { draco as compress, getBounds, reorder, simplify, textureCompress } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import draco from 'draco3dgltf'
import sharp from 'sharp'
import validator from 'gltf-validator'
import { createHash } from 'node:crypto'
import { readFile, writeFile, stat, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

const assets = resolve(import.meta.dirname, '../../assets')
const manifest = JSON.parse(await readFile(`${assets}/manifest.json`, 'utf8'))
await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready])
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco.createDecoderModule(),
  'draco3d.encoder': await draco.createEncoderModule()
})
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const triangleCount = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((m) => m.listPrimitives())
    .reduce((sum, p) => sum + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0)

async function inspect(file) {
  const bytes = await readFile(file)
  const validation = await validator.validateBytes(new Uint8Array(bytes), { uri: file.split('/').pop(), maxIssues: 100 })
  if (validation.issues.numErrors) throw new Error(`${file}: ${validation.issues.numErrors} glTF validation errors`)
  const doc = await io.read(file)
  for (const accessor of doc.getRoot().listAccessors()) {
    const array = accessor.getArray()
    if (!array?.every(Number.isFinite)) throw new Error(`${file}: missing or non-finite accessor`)
  }
  const layouts = doc
    .getRoot()
    .listMeshes()
    .map((mesh) =>
      mesh.listPrimitives().map((primitive) => {
        const position = primitive.getAttribute('POSITION')
        if (primitive.getMode() !== 4 || !position || position.getElementSize() !== 3 || !position.getCount()) throw new Error(`${file}: invalid triangle primitive`)
        const count = position.getCount()
        for (const attribute of primitive.listAttributes()) {
          if (attribute.getCount() !== count) throw new Error(`${file}: attribute count mismatch`)
        }
        const indices = primitive.getIndices()
        if ((indices?.getCount() ?? count) % 3) throw new Error(`${file}: incomplete triangle`)
        if (indices && !indices.getArray().every((index) => Number.isInteger(index) && index >= 0 && index < count)) throw new Error(`${file}: invalid index range`)
        return { attributes: primitive.listSemantics().sort(), material: doc.getRoot().listMaterials().indexOf(primitive.getMaterial()), mode: primitive.getMode() }
      })
    )
  const scene = doc.getRoot().listScenes()[0]
  if (!scene) throw new Error(`${file}: missing scene`)
  const bounds = getBounds(scene)
  if (![...bounds.min, ...bounds.max].every(Number.isFinite) || Math.max(...bounds.max.map((value, i) => value - bounds.min[i])) <= 0) throw new Error(`${file}: invalid bounds`)
  // The validator cannot inspect compressed Draco buffers. Validate again after
  // decoding, with the Draco extension removed and actual vertex/index buffers.
  let decodedValidation = null
  const dracoExtension = doc
    .getRoot()
    .listExtensionsUsed()
    .find((ext) => ext.extensionName === KHRDracoMeshCompression.EXTENSION_NAME)
  if (dracoExtension) {
    dracoExtension.dispose()
    decodedValidation = await validator.validateBytes(await io.writeBinary(doc), { uri: 'decoded.glb', maxIssues: 100 })
    if (decodedValidation.issues.numErrors) throw new Error(`${file}: invalid decoded mesh`)
  }
  const textures = await Promise.all(
    doc
      .getRoot()
      .listTextures()
      .map(async (texture) => {
        const metadata = await sharp(texture.getImage()).metadata()
        return {
          name: texture.getName(),
          format: texture.getMimeType(),
          width: metadata.width,
          height: metadata.height,
          bytes: texture.getImage().byteLength,
          sha256: hash(texture.getImage())
        }
      })
  )
  const json = await io.writeJSON(doc)
  return {
    doc,
    materials: json.json.materials ?? [],
    layouts,
    report: {
      bytes: bytes.byteLength,
      sha256: hash(bytes),
      triangles: triangleCount(doc),
      meshes: doc.getRoot().listMeshes().length,
      primitives: doc
        .getRoot()
        .listMeshes()
        .flatMap((m) => m.listPrimitives()).length,
      materials: doc.getRoot().listMaterials().length,
      animations: doc.getRoot().listAnimations().length,
      skins: doc.getRoot().listSkins().length,
      nodes: doc.getRoot().listNodes().length,
      bounds,
      textures,
      textureBytesRGBA: textures.reduce((sum, t) => sum + t.width * t.height * 4, 0),
      validation: { errors: validation.issues.numErrors, warnings: validation.issues.numWarnings, messages: validation.issues.messages },
      decodedValidation: decodedValidation
        ? { errors: decodedValidation.issues.numErrors, warnings: decodedValidation.issues.numWarnings, messages: decodedValidation.issues.messages }
        : null,
      decodedPrimitiveChecks: 'passed: finite accessors, triangle mode, index ranges, matching attribute counts, nonzero finite bounds',
      primitiveLayouts: layouts
    }
  }
}
const verifyOnly = process.argv.includes('--verify-only')
const requested = process.argv.slice(2).filter((arg) => arg !== '--verify-only')
for (const model of manifest.models) {
  if (requested.length && !requested.includes(model.slug)) continue
  const source = `${assets}/sources/${model.slug}/source.glb`
  if (!(await stat(source).catch(() => null))) {
    console.warn(`${model.slug}: source download missing; skipped`)
    continue
  }
  const original = await inspect(source)
  const report = { slug: model.slug, source: original.report, profiles: {} }
  for (const [profile, textureSize] of [
    ['studio', 4096],
    ['balanced', 2048]
  ]) {
    const destination = resolve(import.meta.dirname, `../public/models/${model.slug}-${profile}.glb`)
    // Preserve the complete hierarchy, materials, texture slots, animations and skins.
    // Only very dense, static scans get an OPTIONAL simplified Balanced mesh.
    const ratio =
      profile === 'balanced' && model.simplifyAllowed !== false && !original.report.animations && !original.report.skins && original.report.triangles > 250000
        ? 200000 / original.report.triangles
        : 1
    if (!verifyOnly) {
      const doc = await io.read(source)
      doc
        .getRoot()
        .listExtensionsUsed()
        .find((ext) => ext.extensionName === KHRDracoMeshCompression.EXTENSION_NAME)
        ?.dispose()
      if (ratio < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.0005, lockBorder: true }))
      await doc.transform(reorder({ encoder: MeshoptEncoder, target: 'performance' }))
      await doc.transform(
        // Lossy encoding is limited to color maps. Normal and PBR data maps use lossless WebP.
        textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [textureSize, textureSize], quality: 95, effort: 40, slots: /^(baseColorTexture|emissiveTexture)$/ }),
        textureCompress({
          encoder: sharp,
          targetFormat: 'webp',
          resize: [textureSize, textureSize],
          lossless: true,
          effort: 40,
          slots: /^(?!baseColorTexture$|emissiveTexture$).*$/
        }),
        compress({ method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5, quantizePosition: 20, quantizeNormal: 16, quantizeTexcoord: 18 })
      )
      await mkdir(dirname(destination), { recursive: true })
      await io.write(destination, doc)
    }
    const optimized = await inspect(destination)
    for (const key of ['meshes', 'primitives', 'materials', 'animations', 'skins', 'nodes']) {
      if (optimized.report[key] !== original.report[key]) throw new Error(`${model.slug}/${profile}: ${key} changed`)
    }
    if (profile === 'studio' && optimized.report.triangles !== original.report.triangles) throw new Error('Studio triangle count changed')
    // Texture indices and all scalar material properties must remain unchanged.
    if (JSON.stringify(optimized.materials) !== JSON.stringify(original.materials)) throw new Error(`${model.slug}/${profile}: material semantics changed`)
    if (JSON.stringify(optimized.layouts) !== JSON.stringify(original.layouts)) throw new Error(`${model.slug}/${profile}: primitive attributes or material bindings changed`)
    const originalBounds = original.report.bounds
    const span = Math.max(...originalBounds.max.map((v, i) => v - originalBounds.min[i]))
    const error = Math.max(...['min', 'max'].flatMap((key) => originalBounds[key].map((v, i) => Math.abs(v - optimized.report.bounds[key][i])))) / span
    if (error > 0.001) throw new Error(`${model.slug}/${profile}: excessive bounds error ${error}`)
    report.profiles[profile] = {
      ...optimized.report,
      url: `models/${model.slug}-${profile}.glb`,
      simplified: ratio < 1,
      textureMaxDimension: textureSize,
      normalizedBoundsError: error,
      fileReductionPercent: 100 * (1 - optimized.report.bytes / original.report.bytes),
      textureMemoryReductionPercent: original.report.textureBytesRGBA ? 100 * (1 - optimized.report.textureBytesRGBA / original.report.textureBytesRGBA) : null
    }
    console.log(`${model.slug}/${profile}: ${optimized.report.triangles.toLocaleString()} triangles; ${(optimized.report.bytes / 1e6).toFixed(2)} MB; zero glTF errors`)
  }
  await mkdir(`${assets}/reports`, { recursive: true })
  await writeFile(`${assets}/reports/${model.slug}.json`, JSON.stringify(report, null, 2) + '\n')
  model.downloadStatus = model.origin === 'user-provided' ? 'provided-and-optimized' : 'downloaded-and-optimized'
  model.sourceFile = `sources/${model.slug}/source.glb`
  model.sourceFormat ??= 'Sketchfab converted GLB, highest offered texture tier; unmodified download'
  model.report = `reports/${model.slug}.json`
  model.profiles = Object.fromEntries(
    Object.entries(report.profiles).map(([key, value]) => [key, { file: `../site/public/${value.url}`, bytes: value.bytes, sha256: value.sha256 }])
  )
  await writeFile(`${assets}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n')
}
const publicManifest = {
  models: manifest.models
    .filter((model) => model.profiles)
    .map(({ slug, name, viewerUrl, creator, license, attribution, origin, profiles }) => ({
      slug,
      name,
      viewerUrl,
      creator,
      license,
      attribution,
      origin,
      profiles: Object.fromEntries(
        Object.entries(profiles).map(([profile, value]) => [profile, { url: `models/${slug}-${profile}.glb`, bytes: value.bytes, sha256: value.sha256 }])
      )
    }))
}
await mkdir(resolve(import.meta.dirname, '../public/models'), { recursive: true })
await writeFile(resolve(import.meta.dirname, '../public/models/manifest.json'), JSON.stringify(publicManifest, null, 2) + '\n')
await writeFile(resolve(import.meta.dirname, '../src/collection.json'), JSON.stringify(publicManifest, null, 2) + '\n')
