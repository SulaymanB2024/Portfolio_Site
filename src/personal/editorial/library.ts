import type { ArticleSummary } from './types.ts'
import { consolidatedDestination, consolidatedHref } from './curation.ts'

export type WritingFilters = { query: string; category: string }

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
  if (hash.startsWith('#/')) return parameters(hash).get('section') || consolidatedDestination(hash)?.section || null
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

const connections: Record<string, string[]> = {
  'the-first-ai-managers': ['viralbench-codex-agent-harness', 'atlas-building-an-evidence-console'],
  'viralbench-codex-agent-harness': ['the-first-ai-managers', 'atlas-building-an-evidence-console'],
  'atlas-building-an-evidence-console': ['viralbench-codex-agent-harness', 'who-owns-texas-toll-roads'],
  'who-owns-texas-toll-roads': ['atlas-building-an-evidence-console', 'the-first-ai-managers'],
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
