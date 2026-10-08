import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioRuntimeAssets } from './tools/portfolio-runtime-assets.mjs'
import hosting from './vercel.json' with { type: 'json' }
import { publicPages } from './src/personal/public-pages'
import { outreachPreview } from './tools/outreach-preview'
const previewHeaders = Object.fromEntries(Object.entries(hosting.routes.find(route => route.headers?.['Content-Security-Policy'])?.headers || {}).filter(([, value]) => typeof value === 'string')) as Record<string, string>
export default defineConfig({
  cacheDir: '.cache/vite',
  plugins: [react(), portfolioRuntimeAssets(), outreachPreview(), {
    name: 'preview-canonical-documents',
    configurePreviewServer(server) {
      const pages = new Set(publicPages.map(page => page.path))
      server.middlewares.use((request, _response, next) => {
        const incoming = request as typeof request & { url?: string }
        const url = new URL(incoming.url || '/', 'http://localhost')
        if (url.pathname !== '/' && pages.has(url.pathname)) incoming.url = `${url.pathname}.html${url.search}`
        next()
      })
    },
  }],
  worker: { format: 'es' },
  preview: { headers: previewHeaders },
  build: { rolldownOptions: { input: { main: 'index.html', shader: 'shader.html', models: 'models.html' } } }
})
