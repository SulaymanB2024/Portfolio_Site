/** Recompress one validated work study while preserving every other manifest entry. */
import assert from 'node:assert/strict'
import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { reorder, draco as compress } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import draco from 'draco3dgltf'
import { root, definitions, dracoSettings, readGLB, packGLB, record, sha256 } from './optimize-portfolio-assets.mjs'

const id = process.argv[2]
assert.match(id ?? '', /^work-(internshipdeadlines|sapien|investing-markets|miscellaneous)$/, 'Pass one original work study ID')
const definition = definitions.find((d) => d.id === id)
assert.equal(definition.mode, 'draco-only')
const manifestPath = resolve(root, 'public/portfolio-models/manifest.json'),
  urlsPath = resolve(root, 'public/portfolio-models/urls.json')
const originalManifest = await readFile(manifestPath),
  originalUrls = await readFile(urlsPath)
const manifest = JSON.parse(originalManifest),
  urls = JSON.parse(originalUrls)
const authored = JSON.parse(await readFile(resolve(root, 'public/work-studies/manifest.json'), 'utf8')).models.find((m) => `work-${m.id}` === id)
assert.equal(authored.validation.errors, 0)
assert.equal(authored.validation.warnings, 0)
const source = await readFile(resolve(root, definition.source)),
  previous = await readFile(resolve(root, definition.path))
assert.equal(sha256(source), authored.sha256)
assert.equal(sha256(previous), manifest.assets[id].sha256, 'Runtime asset drifted before refresh')
await MeshoptEncoder.ready
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'draco3d.decoder': await draco.createDecoderModule(), 'draco3d.encoder': await draco.createEncoderModule() })
const document = await io.readBinary(new Uint8Array(source))
await document.transform(reorder({ encoder: MeshoptEncoder, target: 'performance' }), compress(dracoSettings))
const encoded = readGLB(await io.writeBinary(document))
encoded.json.asset = readGLB(source).json.asset
const output = packGLB(encoded.json, encoded.binary)
const entry = await record(definition, source, output, io)
assert.equal(sha256(await readFile(manifestPath)), sha256(originalManifest), 'Manifest changed during refresh')
assert.equal(sha256(await readFile(urlsPath)), sha256(originalUrls), 'URLs changed during refresh')
assert.equal(sha256(await readFile(resolve(root, definition.source))), authored.sha256)
assert.equal(sha256(await readFile(resolve(root, definition.path))), sha256(previous), 'Runtime asset changed during refresh')
manifest.assets[id] = entry
urls[id] = entry.url
const target = resolve(root, definition.path),
  temporary = `${target}.preparing-${process.pid}`
await writeFile(temporary, output)
await rename(temporary, target)
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
await writeFile(urlsPath, JSON.stringify(urls, null, 2) + '\n')
assert.equal(sha256(await readFile(target)), entry.sha256)
console.log(JSON.stringify({ id, ...entry }, null, 2))
