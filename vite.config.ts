import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import hosting from './vercel.json' with { type: 'json' }
const previewHeaders = Object.fromEntries(Object.entries(hosting.routes.find(route => route.headers?.['Content-Security-Policy'])?.headers || {}).filter(([, value]) => typeof value === 'string')) as Record<string, string>
export default defineConfig({
  cacheDir: '.cache/vite',
  plugins: [react()],
  worker: { format: 'es' },
  preview: { headers: previewHeaders },
  build: { rolldownOptions: { input: { main: 'index.html', shader: 'shader.html', models: 'models.html' } } }
})
