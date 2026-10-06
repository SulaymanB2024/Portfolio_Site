import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const id = 'virtual:portfolio-runtime-urls'
const resolvedId = `\0${id}`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

/** Ship exact verified bytes at immutable addresses; public source paths remain available. */
export function portfolioRuntimeAssets() {
  let config
  let delivery
  return {
    name: 'portfolio-runtime-assets',
    configResolved(value) { config = value; delivery = undefined },
    resolveId(source) { if (source === id) return resolvedId },
    async load(source) {
      if (source !== resolvedId && source !== resolve(config.root, 'src/portfolio-decoder-path.ts')) return
      const root = config.root
      this.addWatchFile(resolve(root, 'public/portfolio-models/urls.json'))
      this.addWatchFile(resolve(root, 'public/portfolio-models/manifest.json'))
      const urls = JSON.parse(await readFile(resolve(root, 'public/portfolio-models/urls.json'), 'utf8'))
      if (config.command !== 'build' || config.build.ssr) {
        return `export default ${JSON.stringify(urls)}; export const decoderPath = 'draco/';`
      }
      if (delivery) return delivery
      delivery = (async () => {
        const manifest = JSON.parse(await readFile(resolve(root, 'public/portfolio-models/manifest.json'), 'utf8'))
        assert.deepEqual(Object.keys(urls).sort(), Object.keys(manifest.assets).sort(), 'Runtime asset set differs from manifest')
        const shipped = {}
        for (const [name, entry] of Object.entries(manifest.assets)) {
          assert.equal(urls[name], entry.url, `${name}: stale runtime URL`)
          const bytes = await readFile(resolve(root, entry.path))
          assert.equal(hash(bytes), entry.sha256, `${name}: runtime bytes differ from validated model`)
          const fileName = `assets/portfolio/${name}-${entry.sha256}.glb`
          this.emitFile({ type: 'asset', fileName, source: bytes })
          shipped[name] = fileName
        }
        const decoderFiles = ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js', 'LICENSE']
        const decoder = await Promise.all(decoderFiles.map(async name => ({ name, bytes: await readFile(resolve(root, 'public/draco', name)) })))
        const digest = createHash('sha256')
        for (const file of decoder) { digest.update(file.name); digest.update(hash(file.bytes)) }
        const decoderPath = `assets/draco-${digest.digest('hex')}/`
        for (const file of decoder) this.emitFile({ type: 'asset', fileName: decoderPath + file.name, source: file.bytes })
        return `export default ${JSON.stringify(shipped)}; export const decoderPath = ${JSON.stringify(decoderPath)};`
      })()
      return delivery
    },
  }
}
