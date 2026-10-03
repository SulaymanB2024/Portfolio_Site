import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { assertTextureOnlyChange, definitions, readGLB, replaceBufferViews, root, sha256 } from '../tools/optimize-portfolio-assets.mjs'

function fixture() {
  const json = Buffer.from(JSON.stringify({
    asset: { version: '2.0' }, buffers: [{ byteLength: 12 }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: 4 }, { buffer: 0, byteOffset: 4, byteLength: 4 }, { buffer: 0, byteOffset: 8, byteLength: 4 }],
    images: [{ bufferView: 1, mimeType: 'image/webp' }],
    meshes: [{ primitives: [{ extensions: { KHR_draco_mesh_compression: { bufferView: 0, attributes: { POSITION: 0 } } } }] }],
    nodes: [{ name: 'hover-shaft', extras: { articulationAxis: [0, 1, 0] } }],
  }))
  const padded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)])
  const header = Buffer.alloc(20), binaryHeader = Buffer.alloc(8)
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + padded.length + 12, 8); header.writeUInt32LE(padded.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
  binaryHeader.writeUInt32LE(12, 0); binaryHeader.writeUInt32LE(0x004e4942, 4)
  return Buffer.concat([header, padded, binaryHeader, Buffer.from('MESHTEX!ATTR')])
}

test('resizing an image preserves Draco data and following attributes when offsets move', () => {
  const original = fixture(), output = replaceBufferViews(original, new Map([[1, Buffer.from('new longer texture')]]))
  assert.doesNotThrow(() => assertTextureOnlyChange(original, output))
  const { json, binary } = readGLB(output)
  assert.equal(binary.subarray(json.bufferViews[0].byteOffset, json.bufferViews[0].byteOffset + 4).toString(), 'MESH')
  assert.equal(binary.subarray(json.bufferViews[2].byteOffset, json.bufferViews[2].byteOffset + 4).toString(), 'ATTR')
  assert.notEqual(json.bufferViews[2].byteOffset, 8)
})

test('texture-only validation rejects damaged geometry and changed interaction metadata', () => {
  const original = fixture()
  assert.throws(() => assertTextureOnlyChange(original, replaceBufferViews(original, new Map([[0, Buffer.from('BAD!')]]))), /changed geometry buffer view/)
  const metadataDrift = Buffer.from(original)
  const position = metadataDrift.indexOf(Buffer.from('hover-shaft'))
  Buffer.from('other-shaft').copy(metadataDrift, position)
  assert.throws(() => assertTextureOnlyChange(original, metadataDrift), /metadata or material bindings/)
})

test('the GLB reader rejects truncated files and invalid buffer ranges', () => {
  const original = fixture()
  assert.throws(() => readGLB(original.subarray(0, original.length - 1)), /Incorrect GLB length/)
  const malformed = Buffer.from(original)
  const position = malformed.indexOf(Buffer.from('"byteOffset":8'))
  malformed[position + '"byteOffset":'.length] = '9'.charCodeAt(0)
  assert.throws(() => readGLB(malformed), /exceeds GLB bounds/)
})

async function snapshot() {
  const paths = new Set<string>(definitions.map((definition: { source: string }) => definition.source))
  for (const definition of definitions) paths.add(definition.path)
  paths.add('tools/optimize-portfolio-assets.mjs')
  async function collect(directory: string) {
    for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`
      if (entry.isDirectory()) await collect(path)
      else paths.add(path)
    }
  }
  await collect('public/portfolio-models')
  // Local optimization receipts are optional in a clean checkout. If present,
  // their hashes still participate in the before/after immutability check.
  await collect('evidence/portfolio-rendering/assets').catch(error => {
    if (error.code !== 'ENOENT') throw error
  })
  const result: Record<string, { bytes: number; sha256: string; modifiedNs: string }> = {}
  for (const path of [...paths].sort()) {
    const file = resolve(root, path), metadata = await stat(file, { bigint: true })
    result[path] = { bytes: Number(metadata.size), sha256: sha256(await readFile(file)), modifiedNs: metadata.mtimeNs.toString() }
  }
  return result
}

test('verify-only validates shipped models without changing sources, assets, manifests or evidence', async () => {
  const before = await snapshot()
  const { stdout } = await promisify(execFile)(process.execPath, ['tools/optimize-portfolio-assets.mjs', '--verify-only'], { cwd: root, timeout: 300_000 })
  assert.match(stdout, /verified about-score:/)
  const manifest = JSON.parse(await readFile(resolve(root, 'public/portfolio-models/manifest.json'), 'utf8'))
  assert.deepEqual(await snapshot(), before)
  assert.equal(Object.keys(manifest.assets).length, 11)
  assert.ok(manifest.assets.helmet.bytes < 1_900_000)
  assert.equal(manifest.assets.helmet.stats.textureBytesRGBA, 2048 * 2048 * 4)
  assert.ok(manifest.assets.headrest.bytes < 3_500_000)
  assert.equal(manifest.assets.headrest.stats.textureBytesRGBA, 3 * 1024 * 1024 * 4)
  assert.equal(manifest.assets.globe.path, 'public/models/wireframe-globe-balanced.glb')
  for (const [id, entry] of Object.entries(manifest.assets) as [string, any][]) {
    assert.match(entry.url, new RegExp(`\\?v=${entry.sha256.slice(0, 12)}$`))
    if (id.startsWith('work-') || id.startsWith('about-')) assert.ok(entry.bytes < entry.source.bytes, `${id}: compression must reduce transfer bytes`)
    assert.deepEqual(entry.validation, { compressed: { errors: 0, warnings: 0 }, decoded: { errors: 0, warnings: 0 } })
    assert.equal(entry.preservation.attributionAndAllExtras, true)
    if (entry.strategy !== 'existing-balanced') {
      assert.deepEqual(readGLB(await readFile(resolve(root, entry.path))).json.asset, readGLB(await readFile(resolve(root, entry.source.path))).json.asset)
    }
  }
})
