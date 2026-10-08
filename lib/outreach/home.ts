import { outreachMetaName, outreachSlugPattern } from '../../src/personal/outreach-context.ts'
import { parseRegistry, type OutreachRegistry } from './registry.ts'

export function outreachDocument(html: string, slug: string) {
  if (!outreachSlugPattern.test(slug) || slug.length > 96) throw new Error('Invalid document context')
  if (!html.includes('</head>')) throw new Error('Homepage template is unavailable')
  return html.replace('</head>', `<meta name="${outreachMetaName}" content="${slug}"></head>`)
}

export function createOutreachHomeHandler(read: () => Promise<OutreachRegistry>, document: (notFound: boolean) => Promise<string>) {
  return async (request: Request) => {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
    const url = new URL(request.url)
    const slug = url.pathname.replace(/^\//, '')
    const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, follow' }
    if (!outreachSlugPattern.test(slug) || slug.length > 96) return new Response(request.method === 'HEAD' ? null : await document(true), { status: 404, headers })
    try {
      const registry = parseRegistry(await read())
      const found = Object.hasOwn(registry.companies, slug)
      const html = found ? outreachDocument(await document(false), slug) : await document(true)
      return new Response(request.method === 'HEAD' ? null : html, { status: found ? 200 : 404, headers })
    } catch {
      console.warn('[outreach] company document is temporarily unavailable')
      return new Response('This link is temporarily unavailable. Please try again shortly.', { status: 503, headers: { ...headers, 'Retry-After': '30' } })
    }
  }
}
