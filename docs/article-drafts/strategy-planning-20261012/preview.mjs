// Task-owned, temporary preview: no shared catalog, route, or asset mutations.
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioRuntimeAssets } from '../../../tools/portfolio-runtime-assets.mjs'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const lane = dirname(fileURLToPath(import.meta.url))
const root = resolve(lane, '../../..')
const proposed = JSON.parse(await readFile(resolve(lane, 'catalog-entry.json'), 'utf8'))
const allowedFigures = new Set(['strategy-growth-channel-cash-capacity.svg', 'strategy-growth-channel-cash-paths.svg', 'strategy-growth-price-counterfactual.svg', 'toast-entry-price-return.svg', 'harvey-time-to-contribution.svg', 'harvey-return-hurdle.svg', 'vanta-cash-capture.svg', 'vanta-cohort-growth.svg', 'ramp-card-software-contribution.svg', 'flock-installed-cohort-cash.svg', 'elevenlabs-accepted-audio-cost.svg', 'elevenlabs-agent-cash-capture.svg'])
const notebookResources = new Map([['/article.md', 'article.md'], ['/SOURCES.md', 'SOURCES.md'], ['/HANDOFF.md', 'HANDOFF.md'], ['/pitches/inputs.json', 'pitches/inputs.json']])
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${proposed.title}</title><style>html,body{margin:0;padding:0;background:#f5f2ea}*{box-sizing:border-box}</style></head><body><div id="root"></div><script type="module" src="/docs/article-drafts/strategy-planning-20261012/preview-entry.tsx"></script></body></html>`
const server = await createServer({
  root, configFile: false, cacheDir: resolve(lane, '.cache/vite'),
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'] },
  plugins: [
    {
      name: 'writer-native-section-preview',
      enforce: 'pre',
      transform(code, id) {
        if (id.split('?')[0] === resolve(root, 'src/personal/editorial/ArticlePage.tsx')) {
          return `${code}\nexport { Section as DraftNativeSection };\n`
        }
      },
    },
    {
      name: 'strategy-lane-preview', enforce: 'pre',
      configureServer(vite) {
        vite.middlewares.use(async (req, res, next) => {
          const path = (req.url || '/').split('?')[0]
          if (path === '/') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(await vite.transformIndexHtml('/', html))
          } else if (path.startsWith('/images/research/') && allowedFigures.has(path.split('/').pop())) {
            res.setHeader('Content-Type', 'image/svg+xml')
            res.end(await readFile(resolve(lane, 'figures', path.split('/').pop())))
          } else if (path === '/notebook-preview.html') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(await readFile(resolve(lane, 'notebook-preview.html')))
          } else if (path === '/pitches/notebook-preview.html') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(await readFile(resolve(lane, 'pitches/notebook-preview.html')))
          } else if (notebookResources.has(path)) {
            res.setHeader('Content-Type', path.endsWith('.json') ? 'application/json' : 'text/markdown; charset=utf-8')
            res.end(await readFile(resolve(lane, notebookResources.get(path))))
          } else next()
        })
      },
    },
    react(),
    portfolioRuntimeAssets(),
  ],
  clearScreen: false,
  server: { host: '127.0.0.1', port: 0, strictPort: true, watch: { ignored: ['**/.cache/**', '**/.venv/**', '**/preview-evidence/**'] } },
})
await server.listen()
const port = server.httpServer.address().port
console.log(`Strategy preview: http://127.0.0.1:${port}/`)
async function close() { await server.close(); process.exit(0) }
process.once('SIGINT', close)
process.once('SIGTERM', close)
