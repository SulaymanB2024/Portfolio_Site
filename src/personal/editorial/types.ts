import { topicLabel } from './topic-label'
export interface ArticleSummary {
  slug: string
  path: string
  aliases?: string[]
  title: string
  seoTitle?: string
  seoDescription?: string
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
  lastVerified?: string
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

export interface ArticleFigure {
  src: string
  alt: string
  label?: string
  caption: string
  width: number
  height: number
}

export interface ArticleSection {
  id: string
  title: string
  paragraphs?: string[]
  bullets?: string[]
  markdown?: string
  table?: ArticleTable
  figures?: ArticleFigure[]
  figuresPosition?: 'before-table'
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
  openingPresentation?: 'integrated'
  metricSection?: string
  htmlBody?: string
  outline?: { id: string; title: string }[]
  conclusion?: { title: string; content: string }
  metrics?: { label: string; value: string; note?: string }[]
  resources?: { label: string; href: string; description?: string; format?: string }[]
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

export function displayReadTime(value: string) {
  return value.replace(/\bMIN$/i, 'min read')
}

const writingTopicLabels: Record<string, string> = {
  All: 'All topics', 'PRODUCT & SYSTEMS': 'Product & systems',
  'ALGORITHMS / VERIFICATION': 'Algorithms & verification', 'FINANCIAL SYSTEMS': 'Financial systems',
  'PRIVATE EQUITY': 'Private equity', 'INDUSTRIAL SYSTEMS': 'Industrial systems', 'AI INFRASTRUCTURE': 'AI infrastructure',
  'CRAWLER ENGINEERING': 'Crawler engineering', 'RENDERING EVIDENCE': 'Rendering evidence', 'AI EVALUATION': 'AI evaluation',
  'DATA SYSTEMS': 'Data systems', 'SITE MIGRATIONS': 'Site migrations', 'AI SYSTEMS': 'AI systems',
  'INFRASTRUCTURE INVESTING': 'Infrastructure', 'ViralBench / Codex / agent evaluation': 'Agent evaluation',
  'CRAWLER POLICY': 'Crawler policy', 'DATA INFRASTRUCTURE': 'Data infrastructure', 'ENTITY CONSISTENCY': 'Entity consistency',
  'TECHNICAL SEO': 'Technical SEO', 'SITE ARCHITECTURE': 'Site architecture', 'STRUCTURED DATA': 'Structured data',
  'EVIDENCE SYSTEMS': 'Evidence systems',
}

export function displayWritingTopic(value: string) {
  return writingTopicLabels[value] || topicLabel(value)
}
