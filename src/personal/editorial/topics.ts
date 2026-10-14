import catalog from './data/catalog.json' with { type: 'json' }
import type { ArticleSummary } from './types.ts'

export interface ReadingTopic {
  slug: string
  title: string
  seoTitle: string
  description: string
  introduction: string[]
  readings: { slug: string; reason: string }[]
  questions: { question: string; slug: string; section: string }[]
  questionsUpdated: string
  relatedTopics?: string[]
  sourceDownload?: { label: string; href: string }
  featuredPath?: { slug: string; label: string }
}

export const readingTopics: ReadingTopic[] = [
{
  "slug": "texas-autonomy",
  "title": "Autonomy in Texas.",
  "seoTitle": "Texas Autonomous Vehicles: Robotaxis & Driverless Trucking",
  "questionsUpdated": "2026-10-13",
  "description": "Waymo, Zoox and the wider Texas AV market, explained through usable rides, freight capacity, operating authority and complete-route costs.",
  "introduction": [
    "Start with the work the business needs done: an employee arriving on time, a guest reaching the hotel, a shipment accepted at the dock or a depot ready for service. These six investigations compare the documented operating stage with the evidence needed for that commitment.",
    "The passenger research separates rider access, booking channels, vehicle rules and paid exceptions. The freight research separates industrial driverless deliveries, public-road service, supervised customer work and future launches. Neither a city announcement nor an autonomous-mile total supplies a buyer-specific service promise.",
    "Primary sources were checked October 12–13, 2026, with each article retaining its own cutoff and source dates. Operator performance is attributed; fleet, travel and freight calculations are declared hypotheticals. Follow the source links, replace the model inputs with actual evidence and use the update triggers when the operating conditions change."
  ],
  "readings": [
    {
      "slug": "texas-robotaxi-business-service-map",
      "reason": "Compare admitted riders, current service guidance and booking channels before choosing a passenger AV pilot."
    },
    {
      "slug": "texas-waymo-business-travel",
      "reason": "Verify the actual Waymo itinerary, airport leg and payment workflow; price walking, waiting and fallback time."
    },
    {
      "slug": "texas-zoox-market-entry-business",
      "reason": "Separate Zoox testing and rider stages from its conditional commercial exemption and a supplier or property commitment."
    },
    {
      "slug": "texas-autonomous-trucking-operators",
      "reason": "Compare eight freight participants by documented domain, platform, onboard role and customer operation."
    },
    {
      "slug": "texas-driverless-freight-route-economics",
      "reason": "Price direct and transfer routes with load acceptance, setup, inspection, recovery and conventional backup."
    },
    {
      "slug": "texas-automated-vehicle-authorization",
      "reason": "Match the legal holder and vehicle, maintain responder and operating records, and budget continuity work."
    }
  ],
  "questions": [
    {
      "question": "Which Texas robotaxi services can a business use?",
      "slug": "texas-robotaxi-business-service-map",
      "section": "operating-evidence"
    },
    {
      "question": "How does Waymo access differ across Texas cities?",
      "slug": "texas-waymo-business-travel",
      "section": "texas-access"
    },
    {
      "question": "Does Zoox’s Texas arrival mean public rides are available?",
      "slug": "texas-zoox-market-entry-business",
      "section": "texas-stages"
    },
    {
      "question": "Which autonomous truck programs have current customer freight?",
      "slug": "texas-autonomous-trucking-operators",
      "section": "operating-comparison"
    },
    {
      "question": "When does a driverless freight quote save money?",
      "slug": "texas-driverless-freight-route-economics",
      "section": "quote-comparison"
    },
    {
      "question": "What does Texas require for commercial driverless operation?",
      "slug": "texas-automated-vehicle-authorization",
      "section": "commercial-scope"
    }
  ],
  "relatedTopics": [
    "texas-business",
    "financial-systems",
    "industrial-capacity"
  ],
  "sourceDownload": {
    "label": "Download the eighteen-article source and decision ledger (JSON)",
    "href": "/research/texas-research-library-2026-10-13.json"
  }
},
  {
    slug: 'texas-business', title: 'Texas business research.',
    seoTitle: 'Texas Business Research: Infrastructure, Taxes, Hiring & Trade',
    questionsUpdated: '2026-10-12',
    description: 'Deep research on Texas developments that change operating costs, investment timing, compliance, and commercial risk.',
    introduction: [
      'Choose the decision closest to your next commitment: a facility site, tax budget, hiring plan, supplier route, technology purchase or commercial contract. These twelve core investigations connect Texas developments to operating costs, usable capacity, timing and cash at risk. Six additional investigations in the autonomy reading path cover robotaxis, driverless freight and commercial vehicle authorization.',
      'The research starts with primary legislation, agency records, official datasets, published decisions and company disclosures. Each article preserves its evidence cutoff, separates an announcement from completion and a forecast from an observation, and gives the reader a concrete comparison and decision checklist. Scenario inputs are labeled so they can be replaced with the business’s actual evidence.',
      'The twelve core investigations were researched on October 12, 2026; the autonomy path retains its own October 12–13 source checks. For related Texas investigations, the financial-systems reading path also contains the original toll-road ownership and financing research, Austin home-service ownership, and West Campus housing. Those manuscripts retain their own evidence dates.',
    ],
    questions: [
      { question: 'What evidence makes a Texas power commitment financeable?', slug: 'texas-power-large-load-business-diligence', section: 'investment-decision' },
      { question: 'Which Texas AI-law duties apply to a private business?', slug: 'texas-ai-law-business-compliance', section: 'duties-by-operator' },
      { question: 'Does a $5 million contract automatically qualify for the Texas Business Court?', slug: 'texas-business-court-contract-decisions', section: 'two-thresholds' },
      { question: 'Can sufficient annual water supply conceal a daily constraint?', slug: 'texas-water-facility-site-diligence', section: 'peak-and-storage' },
      { question: 'What changes a Texas commercial property-tax budget?', slug: 'texas-property-tax-business-underwriting', section: 'worked-tax-sensitivity' },
      { question: 'Which Texas data-center tax route covers local sales tax?', slug: 'texas-data-center-sales-tax-project-economics', section: 'two-certification-routes' },
      { question: 'Does JETI cut a project’s entire tax bill in half?', slug: 'texas-jeti-incentives-project-underwriting', section: 'tax-stack' },
      { question: 'Does no Texas franchise tax due mean no annual filing?', slug: 'texas-franchise-tax-reporting-business-decisions', section: 'threshold-and-report' },
      { question: 'How should a hiring plan price wages against ramp delay?', slug: 'texas-hiring-labor-cost-planning', section: 'pay-versus-delay' },
      { question: 'When does a higher freight quote improve landed cost?', slug: 'texas-cross-border-logistics-business-planning', section: 'route-economics' },
      { question: 'What evidence makes new Texas manufacturing capacity usable?', slug: 'texas-manufacturing-capacity-procurement', section: 'buyer-checklist' },
      { question: 'What will a commercial policy pay during a facility shutdown?', slug: 'texas-commercial-property-insurance-diligence', section: 'business-income' },
    ],
    readings: [
      { slug: 'texas-power-large-load-business-diligence', reason: 'Assess connection evidence, the October large-load rules, financial security, and interruption exposure before committing capital.' },
      { slug: 'texas-water-facility-site-diligence', reason: 'Trace source authority, supplier obligations, peak delivery, storage recovery and drought exposure before approving the site.' },
      { slug: 'texas-property-tax-business-underwriting', reason: 'Reconstruct the tax stack, temporary appraisal limitation, equipment exemption and lease allocation before buying or expanding.' },
      { slug: 'texas-data-center-sales-tax-project-economics', reason: 'Separate standard and large-project tax treatment, resolve the investment clock and price qualifying purchases and repayment exposure.' },
      { slug: 'texas-jeti-incentives-project-underwriting', reason: 'Model the school M&O benefit alongside competing-site evidence, jobs, wages and the compliance tail.' },
      { slug: 'texas-franchise-tax-reporting-business-decisions', reason: 'Distinguish no tax due from information-report obligations, then compare computation methods and current research-credit treatment.' },
      { slug: 'texas-hiring-labor-cost-planning', reason: 'Use dated metro and occupational evidence to test role-specific pay, recruiting and the cost of an unfilled ramp.' },
      { slug: 'texas-cross-border-logistics-business-planning', reason: 'Qualify the customs basis, commercial schedule and receiving route; compare freight with inventory and failure cost.' },
      { slug: 'texas-manufacturing-capacity-procurement', reason: 'Separate announced investment, production starts, qualification and the output actually allocated to a buyer.' },
      { slug: 'texas-commercial-property-insurance-diligence', reason: 'Test perils, settlement, deductibles and business-income terms against the same facility-loss scenario.' },
      { slug: 'texas-ai-law-business-compliance', reason: 'Separate private-business, government, healthcare, and privacy duties, then turn them into an AI procurement review.' },
      { slug: 'texas-business-court-contract-decisions', reason: 'Use September court decisions to distinguish transaction value, pleaded claims, and the promises preserved in signed contracts.' },
    ],
    relatedTopics: ['texas-autonomy', 'financial-systems', 'industrial-capacity'],
    sourceDownload: { label: 'Download the eighteen-article source and decision ledger (JSON)', href: '/research/texas-research-library-2026-10-13.json' },
    featuredPath: { slug: 'texas-autonomy', label: 'Explore robotaxis and driverless freight in Texas' },
  },
  {
    slug: 'financial-systems', title: 'Who owns the cash flow?',
    seoTitle: 'Texas Toll-Road & Airline Loyalty Research',
    questionsUpdated: '2026-10-06',
    description: 'Toll roads, airline miles, software buyouts and other businesses where title, control and cash belong to different people.',
    introduction: [
      'Start with the right being sold. Owning a road, collecting its tolls, lending to its operator and sending a bill are different positions. The same distinction appears in airline loyalty programs, hardware financing and private equity.',
      'These investigations trace contracts and payment obligations before drawing conclusions from an ownership label. Read the toll-road pair together, then follow the financing structure into a different industry. Each essay retains its source dates, disclosed figures and unresolved questions.',
    ],
    questions: [
      { question: 'Who owns Texas toll roads?', slug: 'who-owns-texas-toll-roads', section: 'question-who-owns-the-toll-roads-in-texas' },
      { question: 'Why do tolls continue after a road is paid off?', slug: 'why-texas-toll-roads-stay-tolled', section: 'answer-paid-off-road' },
      { question: 'What do airlines pledge when borrowing against loyalty programs?', slug: 'how-airlines-borrow-against-loyalty-programs', section: 'answer-loyalty-collateral' },
      { question: 'Can different Austin contractor brands share an investment platform?', slug: 'who-owns-austin-home-service-companies', section: 'answer-different-brands-owner' },
    ],
    readings: [
      { slug: 'chegg-cash-flow-turnaround', reason: 'Reconcile Chegg’s cash-flow improvement and test whether legacy cash generation can finance a skilling transition.' },
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
    seoTitle: 'Robots.txt, AI Crawlers & Technical SEO',
    questionsUpdated: '2026-10-06',
    description: 'Robots rules, crawl queues, rendered pages, canonical identity and release checks, connected through evidence rather than dashboard labels.',
    introduction: [
      'A useful crawl records what was requested, what came back and which interpretation produced a finding. It also states what those observations cannot establish. A user-agent string does not prove identity; a robots rule does not protect private content; a canonical declaration does not prove Google selected it.',
      'Begin with the control you need, then follow the implementation through capture, storage, interpretation and release. Atlas provides the worked system; the individual essays explain its engineering decisions and their limits.',
    ],
    questions: [
      { question: 'Can robots.txt make private files secure?', slug: 'robots-txt-courtesy-not-access-control', section: 'answer-robots-private' },
      { question: 'Can I allow ChatGPT search while blocking a training crawler?', slug: 'ai-search-crawler-policy', section: 'answer-search-versus-training' },
      { question: 'Does a canonical tag force Google to choose a URL?', slug: 'canonicalization-graph-consistency', section: 'answer-canonical-hint' },
      { question: 'Why do raw HTML and rendered content disagree?', slug: 'raw-html-rendered-dom-evidence', section: 'answer-source-versus-dom' },
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
    seoTitle: 'AI Agent Evaluation & Solver Verification',
    questionsUpdated: '2026-10-06',
    description: 'Agent evaluation, workflow design and exact search, with explicit tasks, replayable records and independent verification.',
    introduction: [
      'A plausible result needs a way to be checked. For agents, that means retaining the task, tool actions, observations and failure conditions. For an exact search, it means distinguishing a candidate from an independently verified solution.',
      'Start with the workflow question in The first AI managers. Follow it into the ViralBench harness and replayable traces, then compare those checks with a solver whose output has a precise verification condition.',
    ],
    questions: [
      { question: 'What evidence must an agent trial retain?', slug: 'replayable-traces-ai-agent-evaluation', section: 'task-trial-trace' },
      { question: 'How should a grader check the result and the path?', slug: 'replayable-traces-ai-agent-evaluation', section: 'layered-graders' },
      { question: 'How do I independently verify a search solver’s answer?', slug: 'jane-street-exact-search-solver-verification', section: 'verifier' },
      { question: 'How do repeated attempts change a reliability claim?', slug: 'replayable-traces-ai-agent-evaluation', section: 'repeated-trials' },
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
    seoTitle: 'AI Power & U.S. Rare-Earth Magnet Capacity',
    questionsUpdated: '2026-10-06',
    description: 'AI power demand and rare-earth magnet manufacturing, with careful boundaries between announced capacity and operating systems.',
    introduction: [
      'An announcement, a factory nameplate and usable output measure different things. Physical systems also depend on inputs, infrastructure, timing and the boundary used to count capacity.',
      'These two investigations apply that question to AI infrastructure and rare-earth magnets. Read the evidence inventories alongside the estimates; neither essay treats an announced project as proof that all of its output is available.',
    ],
    questions: [
      { question: 'Does a gigawatt mean grid power, facility power, or IT power?', slug: 'the-ai-megawatt', section: 'capacity-dictionary' },
      { question: 'How does rack power become a facility-capacity estimate?', slug: 'the-ai-megawatt', section: 'facility-conversion' },
      { question: 'Does announced magnet nameplate equal saleable supply?', slug: 'us-rare-earth-magnet-manufacturing-capacity', section: 'classification' },
      { question: 'Which fields should a magnet-capacity disclosure contain?', slug: 'us-rare-earth-magnet-manufacturing-capacity', section: 'scorecard' },
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

export function topicQuestions(topic: ReadingTopic, articles: ArticleSummary[] = catalog) {
  return topic.questions.map(question => {
    const article = articles.find(item => item.slug === question.slug)
    if (!article || !topic.readings.some(reading => reading.slug === article.slug)) throw new Error(`Question outside reading path: ${question.slug}`)
    return { ...question, article }
  })
}

export function nextTopicReading(topic: ReadingTopic, slug: string) {
  const index = topic.readings.findIndex(reading => reading.slug === slug)
  if (index < 0 || index === topic.readings.length - 1) return undefined
  return { ...topicReadings(topic)[index + 1], position: index + 2, total: topic.readings.length }
}
