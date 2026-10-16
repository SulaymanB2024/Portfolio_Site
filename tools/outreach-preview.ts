import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { outreachDocument } from '../lib/outreach/home.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import companies from './outreach/recruiter-companies.json' with { type: 'json' }
import { personalizedOpeningId, personalizedOpeningIdPattern } from '../src/personal/recruiter/personalized-copy.ts'
import { reconcileOpenings, validateOpenings } from '../lib/outreach/openings.ts'
import { companyIdentity } from '../lib/outreach/registry.ts'

/** Local fixtures only; never read production credentials or initialize analytics. */
export function outreachPreview(): Plugin {
  const reserved = reservedOutreachSlugs()
  async function previewRegistry(root: string) {
    const fixturePath = process.env.OUTREACH_PREVIEW_FIXTURE || join(root, '.cache/recruiter-personalization-20261012/openings-preview.json')
    let rows: ReturnType<typeof validateOpenings> = []
    try { rows = validateOpenings(JSON.parse(await readFile(fixturePath, 'utf8'))) }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
    return reconcileOpenings({ version: 1, revision: 0, records: {}, companies: Object.fromEntries(companies.map(company => [company.slug, { name: company.name, identity: companyIdentity(company.name) }])) }, rows, reserved).registry
  }
  return {
    name: 'outreach-preview-documents',
    configurePreviewServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://localhost').pathname
        const path = pathname.slice(1)
        if (pathname.startsWith('/for/') && ['GET', 'HEAD'].includes(request.method || '')) {
          try {
            const id = personalizedOpeningId(pathname)
            const registry = await previewRegistry(server.config.root)
            const opening = id && personalizedOpeningIdPattern.test(id) ? registry.openings?.[id] : undefined
            const found = Boolean(opening?.enabled)
            const html = await readFile(join(server.config.root, 'dist', found ? 'index.html' : '404/index.html'), 'utf8')
            response.statusCode = found ? 200 : 404
            response.setHeader('Content-Type', 'text/html; charset=utf-8')
            response.setHeader('X-Robots-Tag', 'noindex, follow')
            response.setHeader('Cache-Control', 'private, no-store')
            response.end(request.method === 'HEAD' ? undefined : found ? outreachDocument(html, opening!.companySlug, registry.companies[opening!.companySlug].name, { id: id!, lines: opening!.lines }) : html)
          } catch (error) { next(error) }
          return
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path) || reserved.has(path) || !['GET','HEAD'].includes(request.method || '')) return next()
        try {
          const registry = await previewRegistry(server.config.root)
          const name = registry.companies[path]?.name
          const found = Boolean(name)
          const html = await readFile(join(server.config.root, 'dist', found ? 'index.html' : '404/index.html'), 'utf8')
          response.statusCode = found ? 200 : 404
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.setHeader('X-Robots-Tag', 'noindex, follow')
          response.setHeader('Cache-Control', 'private, no-store')
          response.end(request.method === 'HEAD' ? undefined : name ? outreachDocument(html, path, name) : html)
        } catch (error) { next(error) }
      })
    },
  }
}
