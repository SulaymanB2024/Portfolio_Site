import type { ArticleSummary } from './types.ts'
import { consolidatedDestination, consolidatedHref } from './curation.ts'

export type WritingFilters = { query: string; category: string }

// Treat typographic punctuation and accents as their plain keyboard equivalents.
const searchText = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '')
  .toLowerCase().replace(/['’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

export function filterWritingArticles(catalog: ArticleSummary[], filters: WritingFilters) {
  const terms = searchText(filters.query).split(/\s+/).filter(Boolean)
  return catalog.filter(article => {
    if (filters.category !== 'All' && article.category !== filters.category) return false
    const text = searchText(`${article.title} ${article.displayTitle || ''} ${article.subtitle} ${article.seoTitle || ''} ${article.seoDescription || ''} ${article.category} ${(article.searchTerms || []).join(' ')}`)
    return terms.every(term => text.includes(term))
  })
}

const parameters = (hash: string) => new URLSearchParams(hash.split('?').slice(1).join('?'))

export function readWritingFilters(hash: string, categories: string[]): WritingFilters {
  const params = parameters(hash)
  const category = params.get('category') || 'All'
  return { query: params.get('q') || '', category: categories.includes(category) ? category : 'All' }
}

export function writingHref(filters: WritingFilters, selected?: string) {
  const params = new URLSearchParams()
  if (filters.category !== 'All') params.set('category', filters.category)
  if (filters.query.trim()) params.set('q', filters.query)
  if (selected) params.set('at', selected)
  return `#/writing${params.size ? `?${params}` : ''}`
}

export function articleReturnHref(hash: string, catalog: ArticleSummary[]) {
  const from = parameters(hash).get('from') || ''
  if (!/^#\/writing(?:\?|$)/.test(from)) return '#/writing'
  const filters = readWritingFilters(from, ['All', ...catalog.map(article => article.category)])
  const selected = parameters(from).get('at') || ''
  return writingHref(filters, catalog.some(article => article.slug === selected) ? selected : undefined)
}

export function articleSection(hash: string, pathname = '') {
  if (hash.startsWith('#/')) return consolidatedDestination(hash)?.section || parameters(hash).get('section') || null
  const destination = consolidatedDestination(pathname)
  if (destination?.section) return destination.section
  try { return decodeURIComponent(hash.slice(1)) || null }
  catch { return null }
}

export function sectionHref(hash: string, id: string) {
  if (!hash.startsWith('#/')) return `#${encodeURIComponent(id)}`
  const params = parameters(hash)
  params.set('section', id)
  const canonical = consolidatedHref(hash) || hash
  return `${canonical.split('?')[0]}?${params}`
}

/** Keep native section/citation links on the reader when the site uses hash routes. */
export function readerFragmentHref(hash: string, href: string) {
  if (!/^#\/writing\/[^?]+(?:\?|$)/.test(hash) || !href.startsWith('#') || href.startsWith('#/')) return href
  const id = articleSection(href)
  return id ? sectionHref(hash, id) : href
}

const connections: Record<string, string[]> = {
  'the-first-ai-managers': ['viralbench-codex-agent-harness', 'replayable-traces-ai-agent-evaluation'],
  'viralbench-codex-agent-harness': ['replayable-traces-ai-agent-evaluation', 'the-first-ai-managers'],
  'atlas-building-an-evidence-console': ['raw-html-rendered-dom-evidence', 'crawl-frontier-state-machine'],
  'who-owns-texas-toll-roads': ['why-texas-toll-roads-stay-tolled', 'how-airlines-borrow-against-loyalty-programs'],
  'why-texas-toll-roads-stay-tolled': ['who-owns-texas-toll-roads', 'how-airlines-borrow-against-loyalty-programs'],
  'how-airlines-borrow-against-loyalty-programs': ['hidden-financing-hardware-startups', 'waymo-hardware-financing'],
  'hidden-financing-hardware-startups': ['waymo-hardware-financing', 'how-airlines-borrow-against-loyalty-programs'],
  'waymo-hardware-financing': ['hidden-financing-hardware-startups', 'how-airlines-borrow-against-loyalty-programs'],
  'what-happens-when-an-index-decides-a-company-matters': ['software-buyout-boom-2020-2022-exit-audit', 'how-airlines-borrow-against-loyalty-programs'],
  'software-buyout-boom-2020-2022-exit-audit': ['what-happens-when-an-index-decides-a-company-matters', 'who-owns-austin-home-service-companies'],
  'where-online-returns-actually-go': ['hidden-financing-hardware-startups', 'us-rare-earth-magnet-manufacturing-capacity'],
  'west-campus-student-housing': ['who-owns-austin-home-service-companies', 'why-texas-toll-roads-stay-tolled'],
  'who-owns-austin-home-service-companies': ['software-buyout-boom-2020-2022-exit-audit', 'west-campus-student-housing'],
  'the-ai-megawatt': ['us-rare-earth-magnet-manufacturing-capacity', 'hidden-financing-hardware-startups'],
  'us-rare-earth-magnet-manufacturing-capacity': ['the-ai-megawatt', 'where-online-returns-actually-go'],
  'jane-street-exact-search-solver-verification': ['replayable-traces-ai-agent-evaluation', 'audit-findings-derived-records'],
  'crawl-frontier-state-machine': ['sqlite-crawl-pipelines', 'robots-txt-courtesy-not-access-control'],
  'sqlite-crawl-pipelines': ['crawl-frontier-state-machine', 'audit-findings-derived-records'],
  'raw-html-rendered-dom-evidence': ['structured-data-without-content-drift', 'audit-findings-derived-records'],
  'canonicalization-graph-consistency': ['technical-seo-migration-release-gates', 'internal-links-directed-retrieval-graph'],
  'internal-links-directed-retrieval-graph': ['canonicalization-graph-consistency', 'crawl-frontier-state-machine'],
  'robots-txt-courtesy-not-access-control': ['ai-search-crawler-policy', 'crawl-frontier-state-machine'],
  'ai-search-crawler-policy': ['robots-txt-courtesy-not-access-control', 'raw-html-rendered-dom-evidence'],
  'structured-data-without-content-drift': ['raw-html-rendered-dom-evidence', 'canonicalization-graph-consistency'],
  'audit-findings-derived-records': ['atlas-building-an-evidence-console', 'replayable-traces-ai-agent-evaluation'],
  'replayable-traces-ai-agent-evaluation': ['viralbench-codex-agent-harness', 'jane-street-exact-search-solver-verification'],
  'technical-seo-migration-release-gates': ['canonicalization-graph-consistency', 'structured-data-without-content-drift'],
  'technical-seo-public-data-infrastructure': ['atlas-building-an-evidence-console', 'audit-findings-derived-records'],
  'canonical-identity-personal-seo': ['canonicalization-graph-consistency', 'technical-seo-migration-release-gates'],
}

export function relatedArticles(article: ArticleSummary, catalog: ArticleSummary[]) {
  const parent = article.path.slice(0, article.path.lastIndexOf('/'))
  const curated = (connections[article.slug] || []).flatMap(slug => catalog.filter(item => item.slug === slug))
  const siblings = catalog.filter(item => item.path.slice(0, item.path.lastIndexOf('/')) === parent)
  const peers = catalog.filter(item => item.category === article.category)
  return [...curated, ...siblings, ...peers, ...catalog].filter((item, index, list) =>
    item.slug !== article.slug && list.findIndex(other => other.slug === item.slug) === index,
  ).slice(0, 2)
}
