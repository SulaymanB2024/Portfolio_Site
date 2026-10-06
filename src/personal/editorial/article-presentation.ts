import type { ArticleSummary } from './types'

export type ArticleForm = 'essay' | 'ledger' | 'model' | 'survey' | 'notebook' | 'proof' | 'case-study'
export interface ArticlePresentation { form: ArticleForm; lines?: string[] }

// Art direction follows the manuscript, not its publication date or array index.
// Line breaks preserve the authored title; an edited title falls back to wrapping.
export const articlePresentations: Record<string, ArticlePresentation> = {
  'atlas-building-an-evidence-console': { form: 'case-study', lines: ['Building', 'Atlas'] },
  'jane-street-exact-search-solver-verification': { form: 'proof', lines: ['Verifying a 54-move', 'exact search.'] },
  'why-texas-toll-roads-stay-tolled': { form: 'ledger', lines: ['Why Texas toll roads', 'stay tolled.'] },
  'software-buyout-boom-2020-2022-exit-audit': { form: 'survey', lines: ['What happened to the', 'software buyout boom?'] },
  'us-rare-earth-magnet-manufacturing-capacity': { form: 'model', lines: ['The U.S. rare-earth', 'magnet buildout.'] },
  'the-ai-megawatt': { form: 'model', lines: ['An AI megawatt', 'is not a megawatt.'] },
  'who-owns-austin-home-service-companies': { form: 'survey', lines: ['Who owns Austin’s', 'home-service companies?'] },
  'what-happens-when-an-index-decides-a-company-matters': { form: 'essay', lines: ['When an index decides', 'a company matters.'] },
  'how-airlines-borrow-against-loyalty-programs': { form: 'ledger', lines: ['How airlines borrow', 'against loyalty programs.'] },
  'where-online-returns-actually-go': { form: 'model', lines: ['Where do', 'online returns go?'] },
  'hidden-financing-hardware-startups': { form: 'ledger', lines: ['Five capital stacks', 'for hardware startups.'] },
  'west-campus-student-housing': { form: 'ledger', lines: ['Who owns West Campus', 'student housing?'] },
  'waymo-hardware-financing': { form: 'ledger', lines: ['Who funds', 'Waymo’s hardware?'] },
  'crawl-frontier-state-machine': { form: 'notebook', lines: ['The crawl frontier', 'is a state machine.'] },
  'raw-html-rendered-dom-evidence': { form: 'notebook', lines: ['Raw HTML and rendered DOM', 'are separate evidence.'] },
  'replayable-traces-ai-agent-evaluation': { form: 'notebook', lines: ['Replayable traces', 'for AI agents.'] },
  'sqlite-crawl-pipelines': { form: 'notebook', lines: ['SQLite', 'for crawl pipelines.'] },
  'technical-seo-migration-release-gates': { form: 'notebook', lines: ['Executable gates', 'for SEO migrations.'] },
  'the-first-ai-managers': { form: 'essay', lines: ['The', 'Shopkeeper', 'in the', 'Machine'] },
  'who-owns-texas-toll-roads': { form: 'essay', lines: ['The state owns the pavement.', 'Who owns the cash flow?'] },
  'viralbench-codex-agent-harness': { form: 'case-study', lines: ['Beyond the', 'Leaderboard'] },
  'ai-search-crawler-policy': { form: 'notebook', lines: ['AI crawlers: search,', 'training, and access.'] },
  'technical-seo-public-data-infrastructure': { form: 'notebook', lines: ['Technical SEO', 'as public data infrastructure.'] },
  'canonical-identity-personal-seo': { form: 'notebook', lines: ['Canonical identity', 'beats more content.'] },
}

export function articlePresentation(article: Pick<ArticleSummary, 'slug' | 'title' | 'displayTitle'>): ArticlePresentation {
  const presentation = articlePresentations[article.slug] || { form: 'essay' }
  const title = article.displayTitle || article.title
  return presentation.lines?.join(' ') === title ? presentation : { form: presentation.form }
}
