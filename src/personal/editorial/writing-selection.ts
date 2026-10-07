import type { ArticleSummary } from './types.ts'

// Editorial order is independent of publication date and search filters.
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

export function writingSelection(articles: ArticleSummary[]) {
  const selected = selectedWritingSlugs.flatMap(slug => articles.filter(article => article.slug === slug))
  const rest = articles.filter(article => !selectedWritingSlugs.includes(article.slug))
  return { selected, more: rest.filter(article => !noteSlugs.has(article.slug)), notes: rest.filter(article => noteSlugs.has(article.slug)) }
}
