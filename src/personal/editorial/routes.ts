import type { ArticleSummary } from './types.ts'
import { consolidatedDestination } from './curation.ts'

export function resolveRoute(hash: string, pathname: string, catalog: ArticleSummary[], outreachSlug?: string) {
  const raw = hash.startsWith('#/') ? hash.slice(1) : pathname
  const path = raw.split('?')[0].replace(/^\/+|\/+$/g, '')
  if (outreachSlug && !hash.startsWith('#/') && path === outreachSlug) return 'recruiter'
  const destination = consolidatedDestination(raw)
  if (destination) return destination.slug ? `writing/${destination.slug}` : 'writing'
  const article = catalog.find(item => item.path.replace(/^\//, '') === path || item.aliases?.some(alias => alias.replace(/^\//, '') === path))
  if (article) return `writing/${article.slug}`
  if (path === 'research' || path === 'markets') return 'writing'
  if (path === 'atlas' || path === 'atlas/sample-crawl') return 'work/atlas'
  return path
}
