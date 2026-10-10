import { outreachMetaName, outreachNameMeta, outreachSlugPattern, validOutreachCompanyName } from '../../src/personal/outreach-context.ts'
import { escapeMetadata, withSearchHead } from '../../src/personal/search-metadata.ts'
import { recruiterMetadata, renderRecruiterDocument } from '../../src/personal/recruiter/landing.ts'
import { parseRegistry, type OutreachRegistry } from './registry.ts'

export function outreachDocument(html: string, slug: string, name: string) {
  if (!outreachSlugPattern.test(slug) || slug.length > 96) throw new Error('Invalid document context')
  if (!validOutreachCompanyName(name)) throw new Error('Invalid company label')
  if (!html.includes('</head>') || !html.includes('<!--public-page:start-->') || !html.includes('<!--public-page:end-->')) throw new Error('Homepage template is unavailable')
  const company = { slug, name }
  return withSearchHead(html, recruiterMetadata(company))
    .replace(/<!--public-page:start-->([^]*?)<!--public-page:end-->/, (_, body: string) => `<!--public-page:start-->${renderRecruiterDocument(body, company)}<!--public-page:end-->`)
    .replace('</head>', () => `<meta name="${outreachMetaName}" content="${slug}"><meta name="${outreachNameMeta}" content="${escapeMetadata(name)}"></head>`)
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
      const html = found ? outreachDocument(await document(false), slug, registry.companies[slug].name) : await document(true)
      return new Response(request.method === 'HEAD' ? null : html, { status: found ? 200 : 404, headers })
    } catch {
      console.warn('[outreach] company document is temporarily unavailable')
      return new Response('This link is temporarily unavailable. Please try again shortly.', { status: 503, headers: { ...headers, 'Retry-After': '30' } })
    }
  }
}
