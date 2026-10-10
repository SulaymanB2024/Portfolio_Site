import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { outreachDocument } from '../lib/outreach/home.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import companies from './outreach/recruiter-companies.json' with { type: 'json' }

/** Local fixtures only; never read production credentials or initialize analytics. */
export function outreachPreview(): Plugin {
  const reserved = reservedOutreachSlugs()
  const names = new Map(companies.map(company => [company.slug, company.name]))
  return {
    name: 'outreach-preview-documents',
    configurePreviewServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url || '/', 'http://localhost').pathname.slice(1)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path) || reserved.has(path) || !['GET','HEAD'].includes(request.method || '')) return next()
        try {
          const name = names.get(path)
          const found = Boolean(name)
          const html = await readFile(join(server.config.root, 'dist', found ? 'index.html' : '404/index.html'), 'utf8')
          response.statusCode = found ? 200 : 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.setHeader('X-Robots-Tag', 'noindex, follow')
          response.end(request.method === 'HEAD' ? undefined : name ? outreachDocument(html, path, name) : html)
        } catch (error) { next(error) }
      })
    },
  }
}
