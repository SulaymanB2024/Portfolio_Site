export interface ArticleSummary {
  slug: string
  path: string
  aliases?: string[]
  title: string
  displayTitle?: string
  category: string
  subtitle: string
  searchTerms?: string[]
  date: string
  dateModified?: string
  readTime: string
  image?: string
  kind: string
}

export interface ArticleSource {
  id?: string
  label?: string
  href?: string
  hrefs?: string[]
  markdown?: string
  publisher?: string
  date?: string
  type?: string
  note?: string
  limitation?: string
}

export interface ArticleTable {
  id?: string
  title?: string
  caption?: string
  columns: string[]
  rows: string[][]
  note?: string
}

export interface ArticleSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  markdown?: string
  table?: ArticleTable
  codeExamples?: { title: string; description: string; language: string; code: string }[]
  blocks?: ({ kind: 'markdown'; markdown: string } | { kind: 'table'; tableId: string })[]
}

export interface ArticleCase {
  name: string
  grade: string
  kind: string
  form: string
  geography: string
  authority: string
  humanLayer: string
  economics: string
  caveat: string
  href: string
}

export interface WritingArticle extends ArticleSummary {
  author?: string
  content?: string[]
  sections?: ArticleSection[]
  markdown?: string
  lede?: string
  ledeMarkdown?: string
  markdownSections?: ArticleSection[]
  sources?: ArticleSource[]
  thesis?: string
  evidenceBoundary?: string
  risks?: string
  recommendationBoundary?: string
  valuationFrame?: string
  assumptions?: string[]
  cases?: ArticleCase[]
  faqs?: { question: string; answer: string }[]
  openQuestions?: string[]
  tables?: ArticleTable[]
  factGaps?: { title: string; items: string[] }[]
  supportingAssets?: { label: string; href: string }[]
  researchAssets?: { name: string; href: string; supportingAssets?: { label: string; href: string }[] }[]
  pageContent?: {
    hero?: { image?: { src: string; alt: string; caption?: string } }
    boundary?: { text: string; label: string }
    callouts?: { label: string; title: string; markdown: string }[]
    metrics?: { value: string; label: string; note: string }[]
    caseFilters?: { value: string; label: string }[]
    endnotes?: { markdown: string; links: { href: string; label: string }[] }[]
    metricGroups?: { dfwMetrics?: { project: string; revenue: string; ebitda: string; margin: string; leverage: string; revenuePerTransaction: string }[] }
  }
}

export function displayDate(value: string) {
  const date = new Date(`${value.replaceAll('.', '-')}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
