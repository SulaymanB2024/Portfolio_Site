import type { ArticleSummary } from './types'

export type ArticleForm = 'essay' | 'ledger' | 'model' | 'survey' | 'notebook' | 'proof' | 'case-study'
export interface ArticlePresentation { form: ArticleForm; lines?: string[] }

// Art direction follows the manuscript, not its publication date or array index.
// Line breaks preserve the authored title; an edited title falls back to wrapping.
export const articlePresentations: Record<string, ArticlePresentation> = {
  'hyperliquid-valuation': { form: 'model' },
  'choosing-a-growth-channel-under-a-capacity-limit': { form: 'model' },
  'toast-gross-profit-engine': { form: 'model' },
  'harvey-who-keeps-the-value-of-legal-ai': { form: 'model' },
  'vanta-after-the-audit': { form: 'model' },
  'ramp-saving-money-and-retaining-contribution': { form: 'model' },
  'elevenlabs-cost-of-accepted-work': { form: 'model' },
  'flock-safety-installed-cohort-cash': { form: 'model' },
  'texas-robotaxi-business-service-map': { form: 'essay' },
  'texas-waymo-business-travel': { form: 'essay' },
  'texas-zoox-market-entry-business': { form: 'essay' },
  'texas-autonomous-trucking-operators': { form: 'essay' },
  'texas-driverless-freight-route-economics': { form: 'essay' },
  'texas-automated-vehicle-authorization': { form: 'essay' },

  'texas-water-facility-site-diligence': { form: 'essay' },
  'texas-property-tax-business-underwriting': { form: 'essay' },
  'texas-data-center-sales-tax-project-economics': { form: 'essay' },
  'texas-jeti-incentives-project-underwriting': { form: 'essay' },
  'texas-franchise-tax-reporting-business-decisions': { form: 'essay' },
  'texas-hiring-labor-cost-planning': { form: 'essay' },
  'texas-cross-border-logistics-business-planning': { form: 'essay' },
  'texas-manufacturing-capacity-procurement': { form: 'essay' },
  'texas-commercial-property-insurance-diligence': { form: 'essay' },
  'texas-power-large-load-business-diligence': { form: 'essay' },
  'texas-ai-law-business-compliance': { form: 'essay' },
  'texas-business-court-contract-decisions': { form: 'essay' },
  'expedia-network-and-cash': { form: 'model', lines: ["Expedia: the network","beyond the booking."] },
  'crocs-cash-and-brand-test': { form: 'model', lines: ["Crocs: a cash engine","with a brand test."] },
  'paypal-margin-dollar-recovery': { form: 'model', lines: ["PayPal: a modest recovery","at $56."] },
  'adobe-paid-workflows': { form: 'model', lines: ["Adobe: paid workflows","at a price I like."] },
  'chegg-cash-flow-turnaround': { form: 'case-study', lines: ['Why I believe in', 'Chegg’s reinvention.'] },
  'kalshi-40-billion-question': { form: 'model', lines: ['Kalshi’s $40 billion', 'question'] },
  'anduril-valuation-capital-productivity': { form: 'model', lines: ['Anduril is building a prime.', 'The price assumes', 'a platform.'] },
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
  'canonicalization-graph-consistency': { form: 'notebook', lines: ['Canonicalization', 'is a graph problem.'] },
  'internal-links-directed-retrieval-graph': { form: 'notebook', lines: ['Internal links', 'are a retrieval graph.'] },
  'robots-txt-courtesy-not-access-control': { form: 'notebook', lines: ['Robots.txt', 'is not access control.'] },
  'structured-data-without-content-drift': { form: 'notebook', lines: ['Structured data', 'without content drift.'] },
  'audit-findings-derived-records': { form: 'notebook', lines: ['Audit findings', 'are derived records.'] },
}

export function articlePresentation(article: Pick<ArticleSummary, 'slug' | 'title' | 'displayTitle'>): ArticlePresentation {
  const presentation = articlePresentations[article.slug] || { form: 'essay' }
  const title = article.displayTitle || article.title
  return presentation.lines?.join(' ') === title ? presentation : { form: presentation.form }
}
