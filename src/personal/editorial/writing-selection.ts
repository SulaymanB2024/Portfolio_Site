import type { ArticleSummary } from './types.ts'

// Curated membership and tie order are independent of search filters.
export const selectedWritingSlugs = [
  'the-first-ai-managers',
  'the-ai-megawatt',
  'how-airlines-borrow-against-loyalty-programs',
  'where-online-returns-actually-go',
  'who-owns-texas-toll-roads',
  'jane-street-exact-search-solver-verification',
  'who-owns-austin-home-service-companies',
]

const noteSlugs = new Set([
  'crawl-frontier-state-machine', 'raw-html-rendered-dom-evidence',
  'replayable-traces-ai-agent-evaluation', 'sqlite-crawl-pipelines',
  'technical-seo-migration-release-gates', 'technical-seo-public-data-infrastructure',
  'canonical-identity-personal-seo', 'ai-search-crawler-policy',
])

export function newestWritingFirst(articles: ArticleSummary[]) {
  // Retained manuscripts use both YYYY.MM.DD and ISO YYYY-MM-DD. Normalize
  // separators before sorting; stable ties retain curated/catalog order.
  const newestFirst = (a: ArticleSummary, b: ArticleSummary) => b.date.replaceAll('.', '-').localeCompare(a.date.replaceAll('.', '-'))
  return [...articles].sort(newestFirst)
}

export function writingSelection(articles: ArticleSummary[]) {
  const selected = selectedWritingSlugs.flatMap(slug => articles.filter(article => article.slug === slug))
  const rest = articles.filter(article => !selectedWritingSlugs.includes(article.slug))
  return {
    selected: newestWritingFirst(selected),
    more: newestWritingFirst(rest.filter(article => !noteSlugs.has(article.slug))),
    notes: newestWritingFirst(rest.filter(article => noteSlugs.has(article.slug))),
  }
}
