import type { ArticleSummary } from './types.ts'
import { consolidatedHref } from './curation.ts'

/** Keep citations within the reader, and carry the existing article URLs forward. */
export function articleHref(href: string, catalog: ArticleSummary[], baseUrl = '/') {
  if (href.startsWith('#/')) return consolidatedHref(href) || href
  if (href.startsWith('#') || href.startsWith('mailto:')) return href
  let url: URL
  try { url = new URL(href, 'https://sulayman-bowles.dev') } catch { return href }
  if (url.origin !== 'https://sulayman-bowles.dev') return href
  const path = url.pathname.replace(/\/$/, '') || '/'
  const consolidated = consolidatedHref(path)
  if (consolidated) return consolidated
  const article = catalog.find(item => item.path === path || item.aliases?.includes(path))
  if (article) return `#/writing/${article.slug}${url.hash ? `?section=${encodeURIComponent(url.hash.slice(1))}` : ''}`
  const routes: Record<string, string> = { '/': '', '/work': 'work', '/about': 'about', '/contact': 'contact', '/resume': 'resume', '/research': 'writing', '/markets': 'writing' }
  if (path in routes) return `#/${routes[path]}`
  if (/\.(?:pdf|csv|json|xlsx|docx|md|webp|png|jpe?g|svg)$/i.test(path)) return `${baseUrl}${path.slice(1)}${url.search}${url.hash}`
  return url.href
}

export function safeHref(href: string) {
  return /^(?:https?:\/\/|mailto:|\/[^/]|#)/i.test(href)
}
