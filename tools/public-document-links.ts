import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { articleSection } from '../src/personal/editorial/library.ts'
import { canonicalPath, siteOrigin } from '../src/personal/public-pages.ts'
import { escapeMetadata } from '../src/personal/search-metadata.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

export function documentHref(href: string) {
  if (href.startsWith('#/')) {
    const route = resolveRoute(href, '/', catalog as ArticleSummary[])
    const path = canonicalPath(route)
    if (!path) throw new Error(`Unresolved public link: ${href}`)
    const section = articleSection(href)
    return `${path}${section ? `#${encodeURIComponent(section)}` : ''}`
  }
  // Publish a direct destination without rewriting historical manuscripts or
  // redirecting retained, noindex source artifacts to unrelated documents.
  if (!(href.startsWith('/') && !href.startsWith('//')) && !href.startsWith(`${siteOrigin}/`)) return href
  const url = new URL(href, siteOrigin)
  const path = canonicalPath(resolveRoute('', url.pathname, catalog as ArticleSummary[]))
  if (!path) return href
  const fragment = url.hash || (url.pathname === '/atlas/sample-crawl' ? '#study-section-3' : '')
  return `${path}${url.search}${fragment}`
}

export function withDocumentLinks(html: string) {
  return html.replace(/<a\b[^>]*>/gi, tag => tag.replace(/\bhref="([^\"]*)"/g, (match, href: string) => {
    const decoded = href.replaceAll('&amp;', '&')
    const destination = documentHref(decoded)
    return destination === decoded ? match : `href="${escapeMetadata(destination)}"`
  }))
}
