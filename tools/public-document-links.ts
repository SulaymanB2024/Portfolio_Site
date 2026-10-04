import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { articleSection } from '../src/personal/editorial/library.ts'
import { canonicalPath } from '../src/personal/public-pages.ts'
import { escapeMetadata } from '../src/personal/search-metadata.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

export function documentHref(href: string) {
  if (!href.startsWith('#/')) return href
  const route = resolveRoute(href, '/', catalog as ArticleSummary[])
  const path = canonicalPath(route)
  if (!path) throw new Error(`Unresolved public link: ${href}`)
  const section = articleSection(href)
  return `${path}${section ? `#${encodeURIComponent(section)}` : ''}`
}

export function withDocumentLinks(html: string) {
  return html.replace(/href="(#\/[^\"]*)"/g, (_match, href: string) => `href="${escapeMetadata(documentHref(href.replaceAll('&amp;', '&')))}"`)
}
