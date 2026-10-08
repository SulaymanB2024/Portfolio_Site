import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { outreachDocument } from '../lib/outreach/home.ts'
import { emptyRegistry, reconcileCompanies } from '../lib/outreach/registry.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import seed from './outreach/seed.json' with { type: 'json' }

/** Local fixtures only; never read production credentials or initialize analytics. */
export function outreachPreview(): Plugin {
  const reserved = reservedOutreachSlugs()
  const registry = reconcileCompanies(emptyRegistry(), seed.map((company, index) => ({ company, recordId: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}` })), reserved).registry
  return {
    name: 'outreach-preview-documents',
    configurePreviewServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url || '/', 'http://localhost').pathname.slice(1)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path) || reserved.has(path) || !['GET','HEAD'].includes(request.method || '')) return next()
        try {
          const found = Object.hasOwn(registry.companies, path)
          const html = await readFile(join(server.config.root, 'dist', found ? 'index.html' : '404/index.html'), 'utf8')
          response.statusCode = found ? 200 : 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.setHeader('X-Robots-Tag', 'noindex, follow')
          response.end(request.method === 'HEAD' ? undefined : found ? outreachDocument(html, path) : html)
        } catch (error) { next(error) }
      })
    },
  }
}
