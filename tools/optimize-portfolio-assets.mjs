/** Portfolio-only derivatives. Originals and standalone study assets stay immutable. */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { draco as compress, getBounds, reorder } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import draco from 'draco3dgltf'
import sharp from 'sharp'
import validator from 'gltf-validator'

export const root = resolve(import.meta.dirname, '..')
const manifestPath = 'public/portfolio-models/manifest.json'
const urlsPath = 'public/portfolio-models/urls.json'
const evidencePath = 'evidence/portfolio-rendering/assets/validation.json'
export const dracoSettings = {
  method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5,
  quantizePosition: 18, quantizeNormal: 14, quantizeTexcoord: 16,
}
// Restore small color edges lost during downsampling, within the same texture budget.
const baseColorDetail = { sigma: .55, m1: .35, m2: .7 }
export const definitions = [
  { id: 'helmet', source: 'public/helmet-balanced.glb', path: 'public/portfolio-models/helmet.glb', mode: 'texture-only', size: 2048, lossless: false, baseColorDetail },
  { id: 'headrest', source: 'public/models/headrest-three-lions-balanced.glb', path: 'public/portfolio-models/headrest.glb', mode: 'texture-only', size: 1024, lossless: true, baseColorDetail },
  { id: 'globe', source: 'public/models/wireframe-globe.glb', path: 'public/models/wireframe-globe-balanced.glb', mode: 'existing-balanced' },
  { id: 'crystal', source: 'public/models/crystal-cluster.glb', path: 'public/models/crystal-cluster.glb', mode: 'unchanged' },
  ...['internshipdeadlines', 'sapien', 'investing-markets', 'miscellaneous'].map(id => ({
    id: `work-${id}`, source: `public/work-studies/${id}.glb`, path: `public/portfolio-models/work-${id}.glb`, mode: 'draco-only',
  })),
  ...['bass', 'knight', 'score'].map(id => ({
    id: `about-${id}`, source: `public/about-objects/${id}.glb`, path: `public/portfolio-models/about-${id}.glb`, mode: 'draco-only',
  })),
]
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')

function packGLB(json, binary) {
  let encoded = Buffer.from(JSON.stringify(json))
  encoded = Buffer.concat([encoded, Buffer.alloc((4 - encoded.length % 4) % 4, 32)])
  const header = Buffer.alloc(20), binaryHeader = Buffer.alloc(8)
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + encoded.length + binary.length, 8)
  header.writeUInt32LE(encoded.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
  binaryHeader.writeUInt32LE(binary.length, 0); binaryHeader.writeUInt32LE(0x004e4942, 4)
  return Buffer.concat([header, encoded, binaryHeader, binary])
}

function attributionAndExtras(json) {
  const result = {}
  function visit(value, path = '') {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      if (key === 'extras' || key === 'copyright') result[`${path}/${key}`] = child
      else visit(child, `${path}/${key}`)
    }
  }
  visit(json)
  return result
}

/** Read the two GLB chunks without decoding or re-encoding its compressed geometry. */
export function readGLB(bytes) {
  const data = Buffer.from(bytes)
  assert.ok(data.length >= 28, 'Truncated GLB')
  assert.equal(data.readUInt32LE(0), 0x46546c67, 'Invalid GLB magic')
  assert.equal(data.readUInt32LE(4), 2, 'Expected GLB version 2')
  assert.equal(data.readUInt32LE(8), data.length, 'Incorrect GLB length')
  const length = data.readUInt32LE(12)
  assert.equal(data.readUInt32LE(16), 0x4e4f534a, 'Missing JSON chunk')
  assert.ok(length % 4 === 0 && 28 + length <= data.length, 'Invalid JSON chunk length')
  const json = JSON.parse(data.subarray(20, 20 + length).toString('utf8'))
  assert.equal(data.readUInt32LE(24 + length), 0x004e4942, 'Missing binary chunk')
  assert.equal(data.readUInt32LE(20 + length), data.length - 28 - length, 'Incorrect binary chunk length')
  assert.equal(json.buffers?.length, 1, 'Expected one embedded buffer')
  assert.ok(!json.buffers[0].uri, 'External GLB buffers are unsupported')
  const binary = data.subarray(28 + length)
  for (const view of json.bufferViews ?? []) {
    assert.equal(view.buffer, 0, 'Unexpected external buffer view')
    assert.ok(Number.isInteger(view.byteLength) && view.byteLength >= 0, 'Invalid buffer view length')
    const offset = view.byteOffset ?? 0
    assert.ok(Number.isInteger(offset) && offset >= 0 && offset + view.byteLength <= binary.length, 'Buffer view exceeds GLB bounds')
  }
  return { json, binary }
}

export function replaceBufferViews(bytes, replacements) {
  const { json, binary } = readGLB(bytes)
  const blocks = []
  let offset = 0
  for (const [index, view] of (json.bufferViews ?? []).entries()) {
    const data = replacements.get(index) ?? binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)
    view.byteOffset = offset
    view.byteLength = data.length
    blocks.push(data)
    offset += data.length
    const padding = (4 - offset % 4) % 4
    if (padding) { blocks.push(Buffer.alloc(padding)); offset += padding }
  }
  json.buffers[0].byteLength = offset
  let jsonBytes = Buffer.from(JSON.stringify(json))
  jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc((4 - jsonBytes.length % 4) % 4, 32)])
  const header = Buffer.alloc(20)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + jsonBytes.length + offset, 8)
  header.writeUInt32LE(jsonBytes.length, 12)
  header.writeUInt32LE(0x4e4f534a, 16)
  const binaryHeader = Buffer.alloc(8)
  binaryHeader.writeUInt32LE(offset, 0)
  binaryHeader.writeUInt32LE(0x004e4942, 4)
  return Buffer.concat([header, jsonBytes, binaryHeader, ...blocks])
}

/** Texture resizing must never alter a compressed mesh, its bindings or metadata. */
export function assertTextureOnlyChange(source, output) {
  const before = readGLB(source), after = readGLB(output)
  const images = new Set((before.json.images ?? []).map(image => image.bufferView))
  const metadata = parsed => {
    const copy = structuredClone(parsed.json)
    delete copy.buffers[0].byteLength
    for (const [index, view] of (copy.bufferViews ?? []).entries()) {
      delete view.byteOffset
      if (images.has(index)) delete view.byteLength
    }
    return copy
  }
  assert.deepEqual(metadata(after), metadata(before), 'Texture resize changed GLB metadata or material bindings')
  for (const [index, view] of (before.json.bufferViews ?? []).entries()) {
    if (images.has(index)) continue
    const next = after.json.bufferViews[index]
    assert.deepEqual(
      after.binary.subarray(next.byteOffset ?? 0, (next.byteOffset ?? 0) + next.byteLength),
      before.binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength),
      `Texture resize changed geometry buffer view ${index}`,
    )
  }
}

async function resizeTextures(bytes, definition) {
  const { json, binary } = readGLB(bytes)
  const replacements = new Map()
  const colorImages = new Set((json.materials ?? []).flatMap(material => {
    const index = material.pbrMetallicRoughness?.baseColorTexture?.index
    if (index === undefined) return []
    const texture = json.textures[index]
    return [texture.extensions?.EXT_texture_webp?.source ?? texture.source]
  }))
  for (const [index, image] of (json.images ?? []).entries()) {
    assert.equal(image.mimeType, 'image/webp', 'Portfolio source must already use compatible embedded WebP')
    assert.ok(Number.isInteger(image.bufferView), 'External textures are unsupported')
    const view = json.bufferViews[image.bufferView]
    const resized = sharp(binary.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength))
      .resize({ width: definition.size, height: definition.size, fit: 'inside', withoutEnlargement: true })
    if (definition.baseColorDetail && colorImages.has(index)) resized.sharpen(definition.baseColorDetail)
    const encoded = await resized
      .webp(definition.lossless ? { lossless: true, effort: 4 } : { quality: 90, effort: 4 })
      .toBuffer()
    replacements.set(image.bufferView, encoded)
  }
  const output = replaceBufferViews(bytes, replacements)
  assertTextureOnlyChange(bytes, output)
  return output
}

function hierarchy(document) {
  const nodes = document.getRoot().listNodes(), meshes = document.getRoot().listMeshes()
  return {
    scenes: document.getRoot().listScenes().map(scene => ({ name: scene.getName(), children: scene.listChildren().map(node => nodes.indexOf(node)) })),
    nodes: nodes.map(node => ({ name: node.getName(), translation: node.getTranslation(), rotation: node.getRotation(), scale: node.getScale(), extras: node.getExtras(), children: node.listChildren().map(child => nodes.indexOf(child)), mesh: meshes.indexOf(node.getMesh()) })),
  }
}

function bindings(document) {
  const materials = document.getRoot().listMaterials()
  return document.getRoot().listMeshes().map(mesh => ({
    name: mesh.getName(), primitives: mesh.listPrimitives().map(primitive => ({
      material: materials.indexOf(primitive.getMaterial()), mode: primitive.getMode(), attributes: primitive.listSemantics().sort(),
      triangles: (primitive.getIndices()?.getCount() ?? primitive.getAttribute('POSITION').getCount()) / 3,
    })),
  }))
}

function assertInteractionNodes(document, id) {
  const nodes = new Map(document.getRoot().listNodes().map(node => [node.getName(), node]))
  const require = names => { for (const name of names) assert.ok(nodes.has(name), `${id}: missing interaction node ${name}`) }
  if (id === 'helmet') require(['Object_2'])
  if (id.startsWith('work-')) for (const [name, node] of nodes) if (name.startsWith('hover-')) {
    const { articulationAxis: axis, articulationPivot: pivot } = node.getExtras()
    assert.ok(Array.isArray(axis) && axis.length === 3 && axis.every(Number.isFinite) && Math.abs(Math.hypot(...axis) - 1) < 1e-6, `${id}: invalid ${name} articulation axis`)
    assert.deepEqual(pivot, node.getTranslation(), `${id}: changed ${name} articulation pivot`)
  }
  if (id === 'about-bass') {
    require(['bass', 'string-e', 'string-a', 'string-d', 'string-g', 'bow', 'bow-hair', 'bow-metal'])
    for (const name of ['bow-hair', 'bow-metal']) assert.equal(nodes.get(name).getParentNode(), nodes.get('bow'), `${id}: changed bow hierarchy`)
  }
  if (id === 'about-knight') {
    require(['board', 'knight', 'knight-carving', 'knight-relief', 'knight-base-trim', ...Array.from({ length: 64 }, (_, index) => `tile-${'abcdefgh'[index % 8]}${Math.floor(index / 8) + 1}`)])
    assert.equal([...nodes.keys()].filter(name => /^tile-[a-h][1-8]$/.test(name)).length, 64, 'Expected exactly 64 chess squares')
    const knight = nodes.get('knight'), a1 = nodes.get('tile-a1').getTranslation()
    assert.equal(knight.getTranslation()[0], a1[0], 'Knight moved from A1')
    assert.equal(knight.getTranslation()[2], a1[2], 'Knight moved from A1')
    for (const name of ['knight-carving', 'knight-relief', 'knight-base-trim']) assert.equal(nodes.get(name).getParentNode(), knight, `${id}: changed movable knight hierarchy`)
  }
  if (id === 'about-score') require(['score', 'score-paper', 'note-0', 'note-1', 'note-2', 'note-3', 'pen'])
}

async function inspect(bytes, io, id) {
  const compressed = await validator.validateBytes(new Uint8Array(bytes), { uri: `${id}.glb`, maxIssues: 100 })
  assert.equal(compressed.issues.numErrors, 0, `${id}: invalid GLB`)
  assert.equal(compressed.issues.numWarnings, 0, `${id}: GLB validation warnings`)
  const document = await io.readBinary(new Uint8Array(bytes))
  assertInteractionNodes(document, id)
  let triangles = 0, vertices = 0, primitives = 0
  for (const accessor of document.getRoot().listAccessors()) assert.ok(accessor.getArray()?.every(Number.isFinite), `${id}: nonfinite accessor`)
  for (const mesh of document.getRoot().listMeshes()) for (const primitive of mesh.listPrimitives()) {
    const position = primitive.getAttribute('POSITION'), indices = primitive.getIndices()
    assert.ok(position && position.getElementSize() === 3 && position.getCount() > 0, `${id}: missing positions`)
    assert.equal(primitive.getMode(), 4, `${id}: expected triangles`)
    for (const attribute of primitive.listAttributes()) assert.equal(attribute.getCount(), position.getCount(), `${id}: mismatched attributes`)
    if (indices) assert.ok(indices.getArray().every(index => Number.isInteger(index) && index >= 0 && index < position.getCount()), `${id}: invalid index range`)
    const count = indices?.getCount() ?? position.getCount()
    assert.equal(count % 3, 0, `${id}: incomplete triangles`)
    triangles += count / 3; vertices += position.getCount(); primitives++
  }
  const bounds = getBounds(document.getRoot().listScenes()[0])
  assert.ok([...bounds.min, ...bounds.max].every(Number.isFinite), `${id}: invalid bounds`)
  assert.ok(Math.max(...bounds.max.map((value, index) => value - bounds.min[index])) > 0, `${id}: empty bounds`)
  const textures = []
  for (const texture of document.getRoot().listTextures()) {
    const image = texture.getImage(), metadata = await sharp(image).metadata()
    textures.push({ name: texture.getName(), mimeType: texture.getMimeType(), width: metadata.width, height: metadata.height, bytes: image.byteLength, sha256: sha256(image) })
  }
  const stats = {
    triangles, vertices, primitives, meshes: document.getRoot().listMeshes().length,
    materials: document.getRoot().listMaterials().length, nodes: document.getRoot().listNodes().length,
    animations: document.getRoot().listAnimations().length, skins: document.getRoot().listSkins().length,
    bounds, textures, textureBytesRGBA: textures.reduce((sum, texture) => sum + texture.width * texture.height * 4, 0),
  }
  stats.textureBytesWithMipmapsEstimate = Math.ceil(stats.textureBytesRGBA * 4 / 3)
  const materialJSON = (await io.writeJSON(document)).json.materials ?? []
  const identity = { hierarchy: hierarchy(document), bindings: bindings(document), materials: materialJSON }
  document.getRoot().listExtensionsUsed().find(extension => extension.extensionName === KHRDracoMeshCompression.EXTENSION_NAME)?.dispose()
  const decoded = await validator.validateBytes(await io.writeBinary(document), { uri: `${id}-decoded.glb`, maxIssues: 100 })
  assert.equal(decoded.issues.numErrors, 0, `${id}: invalid decoded GLB`)
  assert.equal(decoded.issues.numWarnings, 0, `${id}: decoded validation warnings`)
  return { stats, identity, validation: {
    compressed: { errors: compressed.issues.numErrors, warnings: compressed.issues.numWarnings },
    decoded: { errors: decoded.issues.numErrors, warnings: decoded.issues.numWarnings },
  } }
}

function assertPreserved(source, output, definition, sourceBytes, outputBytes) {
  const rawSource = readGLB(sourceBytes).json, rawOutput = readGLB(outputBytes).json
  assert.deepEqual(attributionAndExtras(rawOutput), attributionAndExtras(rawSource), `${definition.id}: attribution, license or extras changed`)
  if (definition.mode !== 'existing-balanced') assert.deepEqual(rawOutput.asset, rawSource.asset, `${definition.id}: original asset authorship metadata changed`)
  assert.deepEqual(output.identity, source.identity, `${definition.id}: hierarchy, transforms, extras or material bindings changed`)
  for (const key of ['triangles', 'primitives', 'meshes', 'materials', 'nodes', 'animations', 'skins']) assert.equal(output.stats[key], source.stats[key], `${definition.id}: ${key} changed`)
  const span = Math.max(...source.stats.bounds.max.map((value, index) => value - source.stats.bounds.min[index]))
  const boundsError = Math.max(...['min', 'max'].flatMap(side => source.stats.bounds[side].map((value, index) => Math.abs(value - output.stats.bounds[side][index])))) / span
  assert.ok(boundsError < .0001, `${definition.id}: excessive bounds error ${boundsError}`)
  if (definition.mode === 'texture-only') assertTextureOnlyChange(sourceBytes, outputBytes)
  if (definition.mode === 'unchanged') assert.deepEqual(outputBytes, sourceBytes, `${definition.id}: original changed`)
  if (definition.mode === 'draco-only') assert.equal(output.stats.textures.length, 0, `${definition.id}: unexpected texture dependency`)
  return { hierarchy: true, localTransforms: true, nodeNamesAndExtras: true, attributionAndAllExtras: true, materialBindings: true, triangleCounts: true, compressedGeometryBytes: definition.mode === 'texture-only' || definition.mode === 'unchanged', normalizedBoundsError: boundsError }
}

function settings(definition) {
  if (definition.mode === 'texture-only') return { textureMaxDimension: definition.size, format: 'webp', lossless: definition.lossless, ...(definition.lossless ? {} : { quality: 90 }), effort: 4, ...(definition.baseColorDetail ? { baseColorDetail: definition.baseColorDetail } : {}), geometry: 'original compressed buffers' }
  if (definition.mode === 'draco-only') return { reorder: 'performance', ...dracoSettings, simplification: false }
  return { geometry: definition.mode }
}

async function record(definition, sourceBytes, outputBytes, io) {
  const source = await inspect(sourceBytes, io, definition.id), output = await inspect(outputBytes, io, definition.id)
  const preservation = assertPreserved(source, output, definition, sourceBytes, outputBytes)
  const hash = sha256(outputBytes)
  return {
    url: `${definition.path.replace(/^public\//, '')}?v=${hash.slice(0, 12)}`,
    path: definition.path, bytes: outputBytes.byteLength, sha256: hash, strategy: definition.mode,
    source: { path: definition.source, bytes: sourceBytes.byteLength, sha256: sha256(sourceBytes), stats: source.stats, validation: source.validation },
    stats: output.stats, validation: output.validation, preservation, settings: settings(definition),
    reductionPercent: 100 * (1 - outputBytes.byteLength / sourceBytes.byteLength),
  }
}

/** Refresh only original, validated specimens from their authoritative builders. */
export function authoredSourceHashes(work, about) {
  const sources = new Map()
  for (const [manifest, directory, ids, generator] of [
    [work, 'work-studies', ['internshipdeadlines', 'sapien', 'investing-markets', 'miscellaneous'], 'tools/build-work-models.mjs'],
    [about, 'about-objects', ['bass', 'knight', 'score'], 'tools/build-about-models.mjs'],
  ]) {
    assert.equal(manifest.generator, generator, 'Unexpected authored asset generator')
    assert.deepEqual(manifest.models.map(model => model.id).sort(), [...ids].sort(), 'Authored asset set changed')
    for (const model of manifest.models) {
      const path = `${directory}/${model.id}.glb`
      assert.equal(model.path, path, 'Authored refresh cannot redirect a source path')
      assert.match(model.sha256, /^[0-9a-f]{64}$/, 'Invalid authored source hash')
      assert.equal(model.validation.errors, 0, 'Authored source has validation errors')
      assert.equal(model.validation.warnings, 0, 'Authored source has validation warnings')
      assert.equal(model.validation.degenerateTriangles, 0, 'Authored source has degenerate triangles')
      sources.set(`public/${path}`, model.sha256)
    }
  }
  return sources
}

export async function run({ verifyOnly = false, refreshAuthored = false } = {}) {
  assert.ok(!(verifyOnly && refreshAuthored), 'Verify-only cannot refresh authored sources')
  sharp.concurrency(1)
  await MeshoptEncoder.ready
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'draco3d.decoder': await draco.createDecoderModule(),
    'draco3d.encoder': await draco.createEncoderModule(),
  })
  let previous = null
  try { previous = JSON.parse(await readFile(resolve(root, manifestPath), 'utf8')) } catch (error) {
    if (verifyOnly || error.code !== 'ENOENT') throw error
  }
  if (previous) {
    assert.equal(previous.version, 1, 'Unknown portfolio manifest version')
    assert.deepEqual(Object.keys(previous.assets).sort(), definitions.map(definition => definition.id).sort(), 'Portfolio manifest asset set changed')
  }
  const baseline = JSON.parse(await readFile(resolve(root, 'evidence/portfolio-rendering/baseline.json'), 'utf8').catch(error => {
    if (error.code !== 'ENOENT') throw error
    return '{"files":[]}'
  }))
  const baselineHashes = new Map(baseline.files.map(file => [file.path, file.runtimeSha256]))
  const authored = refreshAuthored ? authoredSourceHashes(
    JSON.parse(await readFile(resolve(root, 'public/work-studies/manifest.json'), 'utf8')),
    JSON.parse(await readFile(resolve(root, 'public/about-objects/manifest.json'), 'utf8')),
  ) : new Map()
  const sources = new Map()
  // Fail before writing if any source drifted from the recorded baseline or manifest.
  for (const definition of definitions) {
    const bytes = await readFile(resolve(root, definition.source)), hash = sha256(bytes)
    const authoredRefresh = authored.has(definition.source)
    const originalSpecimen = definition.mode === 'draco-only'
    if (authoredRefresh) assert.equal(hash, authored.get(definition.source), `${definition.id}: source differs from authored manifest`)
    // Historical captures protect imported scans. Refined original specimens
    // are pinned by the current derivative manifest after an explicit refresh.
    if (!authoredRefresh && (!originalSpecimen || !previous) && baselineHashes.has(definition.source)) assert.equal(hash, baselineHashes.get(definition.source), `${definition.id}: source changed from baseline`)
    if (!authoredRefresh && previous) assert.equal(hash, previous.assets[definition.id].source.sha256, `${definition.id}: source hash changed`)
    if (!verifyOnly && previous) assert.equal(sha256(await readFile(resolve(root, definition.path))), previous.assets[definition.id].sha256, `${definition.id}: derivative changed before processing`)
    sources.set(definition.id, bytes)
  }
  const assets = {}
  const outputs = new Map()
  for (const definition of definitions) {
    const source = sources.get(definition.id)
    let output
    if (verifyOnly || definition.mode === 'unchanged' || definition.mode === 'existing-balanced') output = await readFile(resolve(root, definition.path))
    else if (definition.mode === 'texture-only') output = await resizeTextures(source, definition)
    else {
      const document = await io.readBinary(new Uint8Array(source))
      await document.transform(reorder({ encoder: MeshoptEncoder, target: 'performance' }), compress(dracoSettings))
      const encoded = readGLB(await io.writeBinary(document))
      // The procedural generator names their original artist. Retain that
      // authorship metadata instead of replacing it with the compressor name.
      encoded.json.asset = readGLB(source).json.asset
      output = packGLB(encoded.json, encoded.binary)
    }
    const entry = await record(definition, source, output, io)
    if (verifyOnly) assert.deepEqual(entry, previous.assets[definition.id], `${definition.id}: file or manifest verification failed`)
    else if (definition.mode === 'texture-only' || definition.mode === 'draco-only') outputs.set(definition.path, output)
    assets[definition.id] = entry
    console.log(`${verifyOnly ? 'verified' : 'prepared'} ${definition.id}: ${entry.bytes.toLocaleString()} bytes, ${entry.stats.triangles.toLocaleString()} triangles, ${entry.reductionPercent.toFixed(1)}% reduction; validation 0 errors / 0 warnings`)
  }
  for (const definition of definitions) assert.equal(sha256(await readFile(resolve(root, definition.source))), sha256(sources.get(definition.id)), `${definition.id}: original source changed during processing`)
  const manifest = { version: 1, generator: 'tools/optimize-portfolio-assets.mjs', assets }
  const urls = Object.fromEntries(Object.entries(assets).map(([id, entry]) => [id, entry.url]))
  if (verifyOnly) assert.deepEqual(JSON.parse(await readFile(resolve(root, urlsPath), 'utf8')), urls, 'Portfolio URL map verification failed')
  if (!verifyOnly) {
    // Complete validation before replacing any live derivative. A browser can
    // then request either complete version, never a partially written GLB.
    for (const [path, bytes] of outputs) {
      const file = resolve(root, path), temporary = `${file}.preparing-${process.pid}`
      await mkdir(dirname(file), { recursive: true })
      await writeFile(temporary, bytes)
      await rename(temporary, file)
    }
    await mkdir(dirname(resolve(root, manifestPath)), { recursive: true })
    await writeFile(resolve(root, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`)
    await writeFile(resolve(root, urlsPath), `${JSON.stringify(urls, null, 2)}\n`)
    await mkdir(dirname(resolve(root, evidencePath)), { recursive: true })
    await writeFile(resolve(root, evidencePath), `${JSON.stringify({ sourcePreserved: true, sequential: true, manifest }, null, 2)}\n`)
  }
  return manifest
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  assert.ok(process.argv.slice(2).every(argument => ['--verify-only', '--refresh-authored'].includes(argument)), 'Usage: node tools/optimize-portfolio-assets.mjs [--verify-only | --refresh-authored]')
  await run({ verifyOnly: process.argv.includes('--verify-only'), refreshAuthored: process.argv.includes('--refresh-authored') })
}
