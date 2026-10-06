import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { portfolioRuntimeAssets } from '../tools/portfolio-runtime-assets.mjs'

const root = resolve(import.meta.dirname, '..')
const watches = { addWatchFile(_path: string) {} }
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')

test('production runtime assets have immutable names and preserve every validated byte', async () => {
  const plugin = portfolioRuntimeAssets() as any
  plugin.configResolved({ root, command: 'build', build: {} })
  const emitted: any[] = []
  const code = await plugin.load.call({ ...watches, emitFile(asset: any) { emitted.push(asset) } }, plugin.resolveId('virtual:portfolio-runtime-urls'))
  const module = await import(`data:text/javascript,${encodeURIComponent(code)}`)
  const manifest = JSON.parse(await readFile(resolve(root, 'public/portfolio-models/manifest.json'), 'utf8'))
  for (const [id, entry] of Object.entries(manifest.assets) as [string, any][]) {
    const file = emitted.find(asset => asset.fileName === module.default[id])
    assert.ok(file)
    assert.match(file.fileName, new RegExp(`^assets/portfolio/${id}-${entry.sha256}\\.glb$`))
    assert.equal(hash(file.source), entry.sha256)
    assert.deepEqual(file.source, await readFile(resolve(root, entry.path)))
  }
  for (const name of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js', 'LICENSE']) {
    const file = emitted.find(asset => asset.fileName === module.decoderPath + name)
    assert.deepEqual(file.source, await readFile(resolve(root, 'public/draco', name)))
  }
  assert.match(module.decoderPath, /^assets\/draco-[a-f0-9]{64}\/$/)
  const count = emitted.length
  assert.equal(await plugin.load.call({ ...watches, emitFile() { assert.fail('Duplicate runtime emission') } }, resolve(root, 'src/portfolio-decoder-path.ts')), code)
  assert.equal(emitted.length, count)
})

test('development and server rendering retain canonical paths without emitting models', async () => {
  for (const config of [{ command: 'serve', build: {} }, { command: 'build', build: { ssr: true } }]) {
    const plugin = portfolioRuntimeAssets() as any
    plugin.configResolved({ root, ...config })
    const watched: string[] = []
    const code = await plugin.load.call({ addWatchFile(path: string) { watched.push(path) }, emitFile() { assert.fail('No server or development emission') } }, plugin.resolveId('virtual:portfolio-runtime-urls'))
    assert.deepEqual(watched.sort(), ['manifest.json', 'urls.json'].map(name => resolve(root, 'public/portfolio-models', name)).sort())
    const module = await import(`data:text/javascript,${encodeURIComponent(code)}`)
    assert.deepEqual(module.default, JSON.parse(await readFile(resolve(root, 'public/portfolio-models/urls.json'), 'utf8')))
    assert.equal(module.decoderPath, 'draco/')
  }
})


test('a stale validation hash blocks production delivery before model emission', async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), 'portfolio-stale-runtime-'))
  try {
    await mkdir(resolve(temporary, 'public/portfolio-models'), { recursive: true })
    await writeFile(resolve(temporary, 'public/portfolio-models/helmet.glb'), 'changed bytes')
    const url = 'portfolio-models/helmet.glb?v=old'
    await writeFile(resolve(temporary, 'public/portfolio-models/urls.json'), JSON.stringify({ helmet: url }))
    await writeFile(resolve(temporary, 'public/portfolio-models/manifest.json'), JSON.stringify({ assets: { helmet: { path: 'public/portfolio-models/helmet.glb', url, sha256: hash(Buffer.from('validated bytes')) } } }))
    const plugin = portfolioRuntimeAssets() as any
    plugin.configResolved({ root: temporary, command: 'build', build: {} })
    await assert.rejects(plugin.load.call({ ...watches, emitFile() { assert.fail('Stale asset emitted') } }, plugin.resolveId('virtual:portfolio-runtime-urls')), /runtime bytes differ/)
  } finally { await rm(temporary, { recursive: true, force: true }) }
})
