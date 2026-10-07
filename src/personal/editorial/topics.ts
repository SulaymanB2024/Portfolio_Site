import catalog from './data/catalog.json' with { type: 'json' }
import type { ArticleSummary } from './types.ts'

export interface ReadingTopic {
  slug: string
  title: string
  description: string
  introduction: string[]
  readings: { slug: string; reason: string }[]
}

export const readingTopics: ReadingTopic[] = [
  {
    slug: 'financial-systems', title: 'Who owns the cash flow?',
    description: 'Toll roads, airline miles, software buyouts and other businesses where title, control and cash belong to different people.',
    introduction: [
      'Start with the right being sold. Owning a road, collecting its tolls, lending to its operator and sending a bill are different positions. The same distinction appears in airline loyalty programs, hardware financing and private equity.',
      'These investigations trace contracts and payment obligations before drawing conclusions from an ownership label. Read the toll-road pair together, then follow the financing structure into a different industry. Each essay retains its source dates, disclosed figures and unresolved questions.',
    ],
    readings: [
      { slug: 'who-owns-texas-toll-roads', reason: 'Separate public title, concession rights, shareholders, creditors and toll collection. Start here for the ownership question.' },
      { slug: 'why-texas-toll-roads-stay-tolled', reason: 'Follow the pledged system and its obligations to understand why repaying one road does not necessarily end its tolls.' },
      { slug: 'how-airlines-borrow-against-loyalty-programs', reason: 'Trace bank receipts, deferred awards and lender-controlled collections without treating miles as customer deposits.' },
      { slug: 'hidden-financing-hardware-startups', reason: 'Identify which party funds inventory, equipment and customer deployment before revenue arrives.' },
      { slug: 'waymo-hardware-financing', reason: 'Use autonomous vehicles to examine the boundary between a technology platform and the assets needed to operate it.' },
      { slug: 'where-online-returns-actually-go', reason: 'Follow returned inventory through disposition decisions and distinguish recovery value from the original sale price.' },
      { slug: 'software-buyout-boom-2020-2022-exit-audit', reason: 'Evaluate the buyout vintage using observed exits, valuation bases and the deals still unresolved.' },
      { slug: 'what-happens-when-an-index-decides-a-company-matters', reason: 'Separate an index membership decision from the buying that may follow it.' },
      { slug: 'who-owns-austin-home-service-companies', reason: 'Distinguish the local service brand, operating company and investment platform in an ownership search.' },
      { slug: 'west-campus-student-housing', reason: 'Connect property ownership, development capital and the economics of a particular Austin housing market.' },
    ],
  },
  {
    slug: 'crawler-evidence', title: 'Build search systems you can verify',
    description: 'Robots rules, crawl queues, rendered pages, canonical identity and release checks, connected through evidence rather than dashboard labels.',
    introduction: [
      'A useful crawl records what was requested, what came back and which interpretation produced a finding. It also states what those observations cannot establish. A user-agent string does not prove identity; a robots rule does not protect private content; a canonical declaration does not prove Google selected it.',
      'Begin with the control you need, then follow the implementation through capture, storage, interpretation and release. Atlas provides the worked system; the individual essays explain its engineering decisions and their limits.',
    ],
    readings: [
      { slug: 'robots-txt-courtesy-not-access-control', reason: 'Choose the right control for crawling, indexing, private access and expensive requests.' },
      { slug: 'ai-search-crawler-policy', reason: 'Distinguish crawler purposes and claimed identities before deciding on a policy.' },
      { slug: 'atlas-building-an-evidence-console', reason: 'See how capture records, derived findings and a reader-facing interface fit together in a working project.' },
      { slug: 'crawl-frontier-state-machine', reason: 'Design scheduling, retries and terminal states so a crawl can resume without losing its history.' },
      { slug: 'sqlite-crawl-pipelines', reason: 'Keep queue state and observations in a storage model that supports inspection and replay.' },
      { slug: 'raw-html-rendered-dom-evidence', reason: 'Compare a response body with the rendered document while keeping each observation attributable.' },
      { slug: 'canonicalization-graph-consistency', reason: 'Resolve declarations and redirects as a graph instead of checking isolated tags.' },
      { slug: 'internal-links-directed-retrieval-graph', reason: 'Use internal links to examine reachable documents and retrieval paths.' },
      { slug: 'structured-data-without-content-drift', reason: 'Keep machine-readable claims aligned with the content visitors can actually read.' },
      { slug: 'audit-findings-derived-records', reason: 'Make findings reproducible from observations, rule versions and explicit evidence.' },
      { slug: 'technical-seo-migration-release-gates', reason: 'Check routes, redirects and discovery before a migration becomes a search regression.' },
      { slug: 'technical-seo-public-data-infrastructure', reason: 'Understand the boundary between public technical observations and private Search Console measurements.' },
      { slug: 'canonical-identity-personal-seo', reason: 'Keep a person’s identity consistent across URLs, metadata and visible biography.' },
    ],
  },
  {
    slug: 'ai-and-verification', title: 'Make AI results inspectable',
    description: 'Agent evaluation, workflow design and exact search, with explicit tasks, replayable records and independent verification.',
    introduction: [
      'A plausible result needs a way to be checked. For agents, that means retaining the task, tool actions, observations and failure conditions. For an exact search, it means distinguishing a candidate from an independently verified solution.',
      'Start with the workflow question in The first AI managers. Follow it into the ViralBench harness and replayable traces, then compare those checks with a solver whose output has a precise verification condition.',
    ],
    readings: [
      { slug: 'the-first-ai-managers', reason: 'Examine how people assign, supervise and evaluate AI work inside a workflow.' },
      { slug: 'viralbench-codex-agent-harness', reason: 'Inspect the harness, task records and evaluation boundaries behind an agent experiment.' },
      { slug: 'replayable-traces-ai-agent-evaluation', reason: 'Turn an agent result into a record that another evaluator can inspect and replay.' },
      { slug: 'jane-street-exact-search-solver-verification', reason: 'Follow an exact search from constraints and candidates to a separately checked answer.' },
    ],
  },
  {
    slug: 'industrial-capacity', title: 'What constrains physical capacity?',
    description: 'AI power demand and rare-earth magnet manufacturing, with careful boundaries between announced capacity and operating systems.',
    introduction: [
      'An announcement, a factory nameplate and usable output measure different things. Physical systems also depend on inputs, infrastructure, timing and the boundary used to count capacity.',
      'These two investigations apply that question to AI infrastructure and rare-earth magnets. Read the evidence inventories alongside the estimates; neither essay treats an announced project as proof that all of its output is available.',
    ],
    readings: [
      { slug: 'the-ai-megawatt', reason: 'Examine the physical and financial boundaries behind an AI power-demand number.' },
      { slug: 'us-rare-earth-magnet-manufacturing-capacity', reason: 'Separate project announcements, manufacturing stages and demonstrated output in the U.S. capacity inventory.' },
    ],
  },
]

export function findReadingTopic(slug: string) {
  return readingTopics.find(topic => topic.slug === slug)
}

export function topicReadings(topic: ReadingTopic, articles: ArticleSummary[] = catalog) {
  return topic.readings.map(reading => {
    const article = articles.find(item => item.slug === reading.slug)
    if (!article) throw new Error(`Missing reading: ${reading.slug}`)
    return { ...reading, article }
  })
}

export function articleTopic(slug: string) {
  return readingTopics.find(topic => topic.readings.some(reading => reading.slug === slug))
}
