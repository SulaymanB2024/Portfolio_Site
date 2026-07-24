import { TEXAS_TOLL_DIRECT_ANSWER } from '../content/texasTollRoadOwnership';

export type ArticleSearchIntent =
  | 'definition'
  | 'comparison'
  | 'implementation'
  | 'ownership'
  | 'evaluation';

export type ArticleSearchCohort = 1 | 2 | 3;

export type ArticleSearchTarget = {
  path: string;
  primaryQuery: string;
  supportingQueries: readonly string[];
  intent: ArticleSearchIntent;
  cohort: ArticleSearchCohort;
  directAnswer: string;
  serpGap: string;
  originalArtifact: string;
  cannibalizationBoundary: string;
  relatedPaths: readonly string[];
  rankingGoal?: {
    country: 'USA';
    device: 'MOBILE';
    targetPosition: 1;
    sustainedSnapshots: 3;
  };
};

export const ARTICLE_RANKING_DEADLINE = '2027-01-20';
export const ARTICLE_TOP_TEN_MIN_IMPRESSIONS = 10;
export const ARTICLE_TOP_TEN_MAX_POSITION = 10;
export const ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS = 3;
export const TEXAS_TOLL_RANK_ONE_TARGET_POSITION = 1;
export const TEXAS_TOLL_RANK_ONE_SUSTAINED_SNAPSHOTS = 3;
const TEXAS_TOLL_SEARCH_PATH = '/markets/who-owns-texas-toll-roads';
const TEXAS_TOLL_RELATED_LABELS: Readonly<Record<string, string>> = {
  '/research/ai-systems/the-first-ai-managers': 'Texas infrastructure ownership',
  '/research/search-console/technical-seo-public-data-infrastructure': 'Texas toll-road ownership evidence',
  '/research/personal-seo/canonical-identity-personal-seo': 'public and private Texas toll-road ownership',
  '/research/financial-systems/where-online-returns-actually-go': 'Texas toll-road operators and billing',
  '/research/financial-systems/how-airlines-borrow-against-loyalty-programs': 'Texas toll-road revenue claims',
  '/research/financial-systems/hidden-financing-hardware-startups': 'Texas toll-road concession financing',
  '/research/financial-systems/waymo-hardware-financing': 'who owns Texas toll roads',
};

export const ARTICLE_SEARCH_TARGETS = [
  {
    path: '/research/ai-systems/the-first-ai-managers',
    primaryQuery: 'can AI run a business',
    supportingQueries: ['AI operated businesses', 'AI business manager'],
    intent: 'evaluation',
    cohort: 1,
    directAnswer:
      'AI can run bounded business actions such as scheduling, pricing, customer replies, purchasing, and promotion, but the strongest public cases still depend on humans for legal authority, capital, physical work, supervision, and recovery when state or policy fails.',
    serpGap:
      'Separate live businesses, pilots, simulations, and vendor claims instead of treating every autonomy demonstration as equivalent evidence.',
    originalArtifact:
      'A 30-case evidence table that grades operating reality, human involvement, economics, and source limitations.',
    cannibalizationBoundary:
      'This page evaluates whether AI can operate a business; the ViralBench and replayable-trace pages evaluate agent harnesses and test evidence.',
    relatedPaths: [
      '/viralbench-codex-agent-harness',
      '/research/ai-systems/replayable-traces-ai-agent-evaluation',
      '/markets/who-owns-texas-toll-roads',
    ],
  },
  {
    path: '/viralbench-codex-agent-harness',
    primaryQuery: 'AI agent evaluation harness',
    supportingQueries: ['AI agent testing harness', 'AI agent replay evaluation'],
    intent: 'implementation',
    cohort: 1,
    directAnswer:
      'An AI agent evaluation harness surrounds a model with versioned tasks, immutable traces, replay fixtures, independent graders, protected policies, and promotion gates so a proposed improvement can be reviewed without letting the agent redefine success or deploy itself.',
    serpGap:
      'Connect a live agent environment to concrete engineering controls rather than describing evaluation as a prompt-only scoring exercise.',
    originalArtifact:
      'A three-layer harness architecture and bounded Codex task contract derived from a code-level ViralBench audit.',
    cannibalizationBoundary:
      'This page covers the complete harness and improvement loop; the replayable-traces article focuses on trace schemas and evaluator evidence.',
    relatedPaths: [
      '/research/ai-systems/the-first-ai-managers',
      '/research/ai-systems/replayable-traces-ai-agent-evaluation',
      '/research/data-systems/audit-findings-derived-records',
    ],
  },
  {
    path: '/research/ai-crawlers/ai-search-crawler-policy',
    primaryQuery: 'robots.txt GPTBot OAI-SearchBot',
    supportingQueries: ['AI crawler robots.txt', 'GPTBot vs OAI-SearchBot'],
    intent: 'implementation',
    cohort: 1,
    directAnswer:
      'Robots.txt can express different crawl preferences for GPTBot, OAI-SearchBot, and other named agents, but those directives govern crawler access only; they do not guarantee indexing, rankings, citations, model inclusion, or retrieval by a user-requested tool.',
    serpGap:
      'Keep search, training, and user-requested retrieval agents distinct and tie every directive to provider documentation and a dated source map.',
    originalArtifact:
      'A maintained provider-agent matrix and public CSV source map for crawler identities, purposes, and policy boundaries.',
    cannibalizationBoundary:
      'This page compares named AI crawlers; the robots access-control article explains the protocol and security boundary for crawlers generally.',
    relatedPaths: [
      '/research/ai-crawlers/robots-txt-courtesy-not-access-control',
      '/research/crawler-engineering/crawl-frontier-state-machine',
      '/research/search-console/technical-seo-public-data-infrastructure',
    ],
  },
  {
    path: '/research/search-console/technical-seo-public-data-infrastructure',
    primaryQuery: 'SEO data pipeline',
    supportingQueries: ['technical SEO data pipeline', 'Search Console data infrastructure'],
    intent: 'implementation',
    cohort: 1,
    directAnswer:
      'An SEO data pipeline should preserve URL identity, collection time, raw observations, rendered evidence, source provenance, derived findings, and export state so Search Console metrics and crawler records can support reviewable decisions instead of becoming disconnected dashboard totals.',
    serpGap:
      'Treat technical SEO as a governed data system with provenance and failure states, not as a sequence of opaque exports and scores.',
    originalArtifact:
      'A URL-to-evidence pipeline model with public schema fields, source roles, and failure-state handling.',
    cannibalizationBoundary:
      'This page covers end-to-end SEO data infrastructure; the audit-findings article focuses on deriving one finding from immutable observations.',
    relatedPaths: [
      '/research/data-systems/audit-findings-derived-records',
      '/research/ai-crawlers/ai-search-crawler-policy',
      '/markets/who-owns-texas-toll-roads',
      '/research/financial-systems/where-online-returns-actually-go',
      '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/research/financial-systems/waymo-hardware-financing',
    ],
  },
  {
    path: '/research/personal-seo/canonical-identity-personal-seo',
    primaryQuery: 'personal SEO canonical identity',
    supportingQueries: ['canonical person identity SEO', 'personal website entity SEO'],
    intent: 'implementation',
    cohort: 2,
    directAnswer:
      'Personal SEO canonical identity starts with one current person page, consistent names and facts, redirected stale records, selective sameAs links, and controlled profiles that point back to the canonical source instead of multiplying thin biographies across the web.',
    serpGap:
      'Provide an operational identity-reconciliation method that distinguishes controlled sources, corroborating profiles, stale records, and unsupported sameAs claims.',
    originalArtifact:
      'A profile inventory template, canonical-host decision tree, sameAs rubric, and external-record reconciliation queue.',
    cannibalizationBoundary:
      'This page governs a person and profile graph; the canonicalization-graph article governs URL consolidation inside a website.',
    relatedPaths: [
      '/research/technical-seo/canonicalization-graph-consistency',
      '/research/technical-seo/internal-links-directed-retrieval-graph',
      '/markets/who-owns-texas-toll-roads',
    ],
  },
  {
    path: '/research/financial-systems/where-online-returns-actually-go',
    primaryQuery: 'where do online returns go',
    supportingQueries: [
      'what happens to online returns',
      'reverse logistics returns process',
      'do online returns get resold',
      'are online returns thrown away',
      'why do retailers issue returnless refunds',
    ],
    intent: 'definition',
    cohort: 1,
    directAnswer:
      'Where do online returns go? An online return can be restocked, sold open-box, refurbished, liquidated, donated, recycled, destroyed, held as fraud evidence, or never retrieved. The route depends on whether expected recovery after reverse freight, inspection, repair, fees, delay, and disposal exceeds the cost of retrieving the item.',
    serpGap:
      'Answer the cross-retailer question with product-level unit economics, ownership, resale eligibility, fraud controls, and environmental evidence instead of describing one retailer or one universal returns process.',
    originalArtifact:
      'A 36-sheet reverse-logistics model, nine product archetypes, route and condition engines, auction analysis, decision diagrams, and a 49-page source-led investigation.',
    cannibalizationBoundary:
      'This page studies reverse logistics and the return tax on consumer products; the hardware-financing pages study capital stacks, asset claims, and residual-value risk before a product is returned.',
    relatedPaths: [
      '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/research/financial-systems/waymo-hardware-financing',
      '/markets/who-owns-texas-toll-roads',
      '/research/data-systems/audit-findings-derived-records',
    ],
  },
  {
    path: '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
    primaryQuery: 'how airlines borrow against loyalty programs',
    supportingQueries: [
      'airline loyalty program financing',
      'airline loyalty-backed debt',
      'how do airlines make money from loyalty programs',
      'are airline miles a liability',
      'are airline loyalty programs worth more than airlines',
      'airline loyalty program securitization',
    ],
    intent: 'definition',
    cohort: 1,
    directAnswer:
      'How airlines borrow against loyalty programs: the card issuer pays cash under a commercial agreement; the airline records some consideration as current revenue and some as a contract liability; the member claims an award later; and a separate financing structure can give lenders first claim on designated partner and intercompany collections.',
    serpGap:
      'Separate consumer card spending, issuer partner payments, deferred-revenue accounting, award fulfillment, operating float, and the lender-controlled cash waterfall instead of calling airline miles deposits or treating every partner payment as debt.',
    originalArtifact:
      'A 22-page source-led investigation, nine full-resolution exhibits, a point-level cash model, and a lender-waterfall reconstruction.',
    cannibalizationBoundary:
      'This page explains loyalty-program cash, accounting, and secured financing; the hardware-financing articles compare physical-asset capital stacks, while the Texas toll-road article covers public and concession infrastructure claims.',
    relatedPaths: [
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/research/financial-systems/where-online-returns-actually-go',
      '/markets/who-owns-texas-toll-roads',
      '/research/financial-systems/waymo-hardware-financing',
    ],
  },
  {
    path: '/research/financial-systems/hidden-financing-hardware-startups',
    primaryQuery: 'hardware startup financing',
    supportingQueries: [
      'hardware financing structures',
      'asset financing for hardware startups',
      'how are hardware startups financed',
      'hardware startup funding options',
      'equipment financing for startups',
    ],
    intent: 'comparison',
    cohort: 1,
    directAnswer:
      'Hardware startup financing usually combines three layers: corporate equity or debt, asset-level debt or leases, and adjacent support such as customer prepayments, supplier terms, public incentives, or parent guarantees. The structure is only asset-light when fixed claims, recourse, and residual-value risk genuinely move away from the operator.',
    serpGap:
      'Replace generic funding-option lists with five real company capital stacks organized by asset owner, payment source, recourse, utilization exposure, and loss allocation.',
    originalArtifact:
      'A 29-sheet comparative model, five full-resolution capital-stack diagrams, a 19-page report, cross-case scenario tables, and an explicit evidence hierarchy.',
    cannibalizationBoundary:
      'This page compares five hardware-financing archetypes; the Waymo page is the company-specific deep dive into a parent-funded autonomous-vehicle platform.',
    relatedPaths: [
      '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
      '/research/financial-systems/where-online-returns-actually-go',
      '/research/financial-systems/waymo-hardware-financing',
      '/markets/who-owns-texas-toll-roads',
      '/research/data-systems/audit-findings-derived-records',
      '/research/search-console/technical-seo-public-data-infrastructure',
    ],
  },
  {
    path: '/research/financial-systems/waymo-hardware-financing',
    primaryQuery: 'Waymo financing structure',
    supportingQueries: ['how is Waymo funded', 'Waymo hardware financing'],
    intent: 'ownership',
    cohort: 1,
    directAnswer:
      'The supplied public evidence supports an equity-heavy, parent-funded Waymo financing structure: Alphabet and outside investors fund the platform, while no quantified fleet-debt facility, asset SPV, customer pre-funding program, supplier facility, or government financing instrument is established in the package.',
    serpGap:
      'Separate fundraising from physical-asset financing, legal ownership, residual value, utilization risk, and the party that absorbs losses.',
    originalArtifact:
      'A 21-sheet financing model, capital-stack diagram, downside waterfall, scenario tables, and instrument-by-instrument evidence map.',
    cannibalizationBoundary:
      'This page is the Waymo-specific deep dive; the five-company hardware-financing article compares parent funding with equipment finance, SPVs, customer capital, public support, and project debt.',
    relatedPaths: [
      '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
      '/research/financial-systems/where-online-returns-actually-go',
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/markets/who-owns-texas-toll-roads',
      '/research/data-systems/audit-findings-derived-records',
      '/research/search-console/technical-seo-public-data-infrastructure',
    ],
  },
  {
    path: '/markets/who-owns-texas-toll-roads',
    primaryQuery: 'are Texas toll roads privately owned',
    supportingQueries: [
      'are toll roads in Texas privately owned',
      'who owns Texas toll roads',
      'Texas toll road private operators',
    ],
    intent: 'ownership',
    cohort: 1,
    directAnswer: TEXAS_TOLL_DIRECT_ANSWER,
    serpGap:
      'Separate physical ownership from concession rights, operators, lenders, revenue claims, and residual control using project-level public records.',
    originalArtifact:
      'A project-by-project ownership, operator, concession, debt, revenue-rights, valuation, and source-gap table.',
    cannibalizationBoundary:
      'This is the only article targeting Texas toll-road ownership; supporting data-system articles discuss evidence methods rather than road ownership.',
    relatedPaths: [
      '/research/search-console/technical-seo-public-data-infrastructure',
      '/research/personal-seo/canonical-identity-personal-seo',
      '/research/data-systems/audit-findings-derived-records',
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/research/financial-systems/waymo-hardware-financing',
    ],
    rankingGoal: {
      country: 'USA',
      device: 'MOBILE',
      targetPosition: TEXAS_TOLL_RANK_ONE_TARGET_POSITION,
      sustainedSnapshots: TEXAS_TOLL_RANK_ONE_SUSTAINED_SNAPSHOTS,
    },
  },
  {
    path: '/research/crawler-engineering/crawl-frontier-state-machine',
    primaryQuery: 'crawl frontier design',
    supportingQueries: ['web crawler frontier state machine', 'crawler URL scheduling'],
    intent: 'implementation',
    cohort: 2,
    directAnswer:
      'Reliable crawl frontier design models each URL as a versioned state transition across discovery, admission, scheduling, fetching, retry, suppression, and completion while keeping URL identity, origin politeness, leases, budgets, and evidence records explicit and replayable.',
    serpGap:
      'Move beyond queue tutorials by defining identity, state invariants, host scheduling, crawl-trap bounds, and recovery evidence together.',
    originalArtifact:
      'A typed frontier-transition schema, lifecycle table, origin scheduler contract, and crawl-budget gap record.',
    cannibalizationBoundary:
      'This page covers crawler scheduling and lifecycle; the SQLite article covers persistence and the internal-link article covers the discovered graph.',
    relatedPaths: [
      '/research/ai-crawlers/robots-txt-courtesy-not-access-control',
      '/research/data-systems/sqlite-crawl-pipelines',
      '/research/technical-seo/internal-links-directed-retrieval-graph',
    ],
  },
  {
    path: '/research/technical-seo/raw-html-rendered-dom-evidence',
    primaryQuery: 'raw HTML vs rendered DOM',
    supportingQueries: ['raw HTML rendered DOM SEO', 'JavaScript SEO rendering evidence'],
    intent: 'comparison',
    cohort: 2,
    directAnswer:
      'Raw HTML is the response body returned by the server, while the rendered DOM is the browser-created document after parsing, scripts, dependent requests, and mutations; a technical SEO audit needs both artifacts plus an explicit render-completeness state.',
    serpGap:
      'Define a reproducible evidence envelope and failure taxonomy instead of reducing the comparison to screenshots or a binary JavaScript check.',
    originalArtifact:
      'A raw-versus-rendered capture contract, completeness taxonomy, field-level diff table, and triage sequence.',
    cannibalizationBoundary:
      'This page compares transport and browser evidence; the structured-data article addresses drift between visible content and JSON-LD.',
    relatedPaths: [
      '/research/technical-seo/structured-data-without-content-drift',
      '/research/technical-seo/technical-seo-migration-release-gates',
      '/research/crawler-engineering/crawl-frontier-state-machine',
    ],
  },
  {
    path: '/research/technical-seo/canonicalization-graph-consistency',
    primaryQuery: 'canonicalization graph SEO',
    supportingQueries: ['SEO canonical graph', 'canonical URL consistency'],
    intent: 'implementation',
    cohort: 2,
    directAnswer:
      'A canonicalization graph is consistent when redirects, HTML canonicals, sitemap entries, internal links, hreflang references, and structured data converge on the same indexable URL rather than sending search systems through cycles, splits, or contradictory targets.',
    serpGap:
      'Evaluate canonical signals as one directed graph and expose conflicts mechanically instead of checking each tag in isolation.',
    originalArtifact:
      'A canonical-signal edge model, conflict taxonomy, diagnostic table, and graph-level acceptance rules.',
    cannibalizationBoundary:
      'This page covers canonical URL signals inside a site; the personal-identity article covers external person and profile records.',
    relatedPaths: [
      '/research/technical-seo/internal-links-directed-retrieval-graph',
      '/research/technical-seo/technical-seo-migration-release-gates',
      '/research/personal-seo/canonical-identity-personal-seo',
    ],
  },
  {
    path: '/research/technical-seo/internal-links-directed-retrieval-graph',
    primaryQuery: 'internal linking graph',
    supportingQueries: ['SEO internal link graph', 'internal link crawl depth'],
    intent: 'implementation',
    cohort: 2,
    directAnswer:
      'An internal linking graph models pages as nodes and crawlable links as directed edges so teams can measure depth, orphan risk, inlink concentration, anchor context, cluster connectivity, and the actual retrieval paths supporting each important page.',
    serpGap:
      'Connect graph measures to user journeys and crawl evidence instead of presenting PageRank-like scores without inspectable edges.',
    originalArtifact:
      'A directed-edge schema, breadth-first depth calculation, orphan test, anchor audit, and cluster-connectivity checklist.',
    cannibalizationBoundary:
      'This page covers internal retrieval edges; the crawl-frontier article covers fetch scheduling and the canonical article covers signal convergence.',
    relatedPaths: [
      '/research/technical-seo/canonicalization-graph-consistency',
      '/research/crawler-engineering/crawl-frontier-state-machine',
      '/research/technical-seo/structured-data-without-content-drift',
    ],
  },
  {
    path: '/research/ai-crawlers/robots-txt-courtesy-not-access-control',
    primaryQuery: 'is robots.txt access control',
    supportingQueries: ['robots.txt security boundary', 'robots exclusion protocol access control'],
    intent: 'definition',
    cohort: 2,
    directAnswer:
      'Robots.txt is not access control: it is a publicly readable crawler-coordination protocol that cooperative agents may follow, while authentication, authorization, network policy, and server-side response controls must protect material that cannot be publicly retrieved.',
    serpGap:
      'Show the complete control stack and failure modes instead of repeating that robots.txt is voluntary without an implementation boundary.',
    originalArtifact:
      'A layered crawler-policy matrix separating discovery guidance, authentication, authorization, network controls, and response handling.',
    cannibalizationBoundary:
      'This page explains protocol and security boundaries; the AI crawler policy page compares named provider agents and their documented purposes.',
    relatedPaths: [
      '/research/ai-crawlers/ai-search-crawler-policy',
      '/research/crawler-engineering/crawl-frontier-state-machine',
      '/research/technical-seo/raw-html-rendered-dom-evidence',
    ],
  },
  {
    path: '/research/technical-seo/structured-data-without-content-drift',
    primaryQuery: 'structured data content drift',
    supportingQueries: ['JSON-LD content mismatch', 'structured data source of truth'],
    intent: 'implementation',
    cohort: 2,
    directAnswer:
      'Structured data content drift occurs when JSON-LD describes names, dates, prices, authors, availability, or claims that the visible page no longer supports; generating both surfaces from one typed source and testing their fields prevents silent divergence.',
    serpGap:
      'Treat structured-data accuracy as a source-of-truth and release-contract problem rather than a one-time schema markup task.',
    originalArtifact:
      'A typed single-source example, HTML-to-JSON-LD field map, drift tests, and release acceptance table.',
    cannibalizationBoundary:
      'This page focuses on visible-content and JSON-LD parity; the raw-rendered article focuses on browser execution and capture completeness.',
    relatedPaths: [
      '/research/technical-seo/raw-html-rendered-dom-evidence',
      '/research/technical-seo/technical-seo-migration-release-gates',
      '/research/data-systems/audit-findings-derived-records',
    ],
  },
  {
    path: '/research/data-systems/audit-findings-derived-records',
    primaryQuery: 'SEO audit provenance',
    supportingQueries: ['technical SEO finding provenance', 'SEO audit evidence model'],
    intent: 'implementation',
    cohort: 3,
    directAnswer:
      'SEO audit provenance means every finding can be regenerated from immutable observations, rule and policy versions, affected URLs, timestamps, confidence, and reviewer decisions while unknown or incomplete evidence remains a named measurement gap instead of becoming a claim.',
    serpGap:
      'Define a derivation and review contract for findings instead of presenting severity labels without their source records.',
    originalArtifact:
      'A finding-provenance schema, observation-to-finding lineage table, confidence states, and review transition contract.',
    cannibalizationBoundary:
      'This page focuses on one derived audit record; the SEO data-pipeline page covers collection and movement across the broader system.',
    relatedPaths: [
      '/research/search-console/technical-seo-public-data-infrastructure',
      '/research/ai-systems/replayable-traces-ai-agent-evaluation',
      '/research/data-systems/sqlite-crawl-pipelines',
      '/research/financial-systems/hidden-financing-hardware-startups',
      '/research/financial-systems/waymo-hardware-financing',
    ],
  },
  {
    path: '/research/ai-systems/replayable-traces-ai-agent-evaluation',
    primaryQuery: 'AI agent evaluation traces',
    supportingQueries: ['replayable AI agent traces', 'AI agent trajectory evaluation'],
    intent: 'evaluation',
    cohort: 3,
    directAnswer:
      'AI agent evaluation traces should preserve the task, messages, tool calls, tool results, state transitions, artifacts, policy versions, costs, timing, and grader evidence so a failure can be replayed without pretending a frozen test world predicts the live environment.',
    serpGap:
      'Join trace completeness, replay limits, independent grading, and promotion evidence in one inspectable evaluation contract.',
    originalArtifact:
      'A typed trace-event schema, replay-world manifest, evaluator separation matrix, and promotion evidence checklist.',
    cannibalizationBoundary:
      'This page covers trace and replay evidence; the ViralBench article covers the full improvement harness around a live agent.',
    relatedPaths: [
      '/viralbench-codex-agent-harness',
      '/research/ai-systems/the-first-ai-managers',
      '/research/data-systems/audit-findings-derived-records',
    ],
  },
  {
    path: '/research/data-systems/sqlite-crawl-pipelines',
    primaryQuery: 'SQLite web crawler',
    supportingQueries: ['SQLite crawl pipeline', 'SQLite crawler concurrency'],
    intent: 'implementation',
    cohort: 3,
    directAnswer:
      'SQLite can support a bounded web crawler when URL identity is unique, writes use short transactions and idempotent upserts, one process coordinates write pressure, WAL behavior is measured, leases are recoverable, and artifacts remain outside oversized database rows.',
    serpGap:
      'Specify the concurrency and recovery envelope where SQLite is useful instead of arguing that it is either universally sufficient or never production-ready.',
    originalArtifact:
      'A normalized crawl schema, idempotent UPSERT, transaction pattern, WAL checklist, and migration boundary table.',
    cannibalizationBoundary:
      'This page covers crawl persistence and concurrency; the frontier article covers scheduling and the provenance article covers derived findings.',
    relatedPaths: [
      '/research/data-systems/audit-findings-derived-records',
      '/research/crawler-engineering/crawl-frontier-state-machine',
      '/research/ai-systems/replayable-traces-ai-agent-evaluation',
    ],
  },
  {
    path: '/research/technical-seo/technical-seo-migration-release-gates',
    primaryQuery: 'technical SEO migration checklist',
    supportingQueries: ['SEO migration release checklist', 'technical SEO migration testing'],
    intent: 'implementation',
    cohort: 3,
    directAnswer:
      'A technical SEO migration checklist should be executable: inventory old and new URLs, validate redirect and canonical maps, render templates, compare indexability, preserve internal links and structured data, define rollback thresholds, and rerun the same checks after launch.',
    serpGap:
      'Turn migration advice into fail-closed release gates with artifacts, owners, tolerances, and rollback evidence.',
    originalArtifact:
      'A staged migration gate matrix covering URL mappings, redirects, canonicals, rendering, schema, sitemaps, monitoring, and rollback.',
    cannibalizationBoundary:
      'This page governs migration release decisions; the canonical, rendering, and structured-data pages provide deep checks for individual gates.',
    relatedPaths: [
      '/research/technical-seo/raw-html-rendered-dom-evidence',
      '/research/technical-seo/canonicalization-graph-consistency',
      '/research/technical-seo/structured-data-without-content-drift',
    ],
  },
] as const satisfies readonly ArticleSearchTarget[];

export function getArticleSearchTarget(path: string) {
  return ARTICLE_SEARCH_TARGETS.find((target) => target.path === path);
}

export function getArticleRelatedLinkLabel(sourcePath: string, relatedPath: string) {
  if (relatedPath === TEXAS_TOLL_SEARCH_PATH) {
    return TEXAS_TOLL_RELATED_LABELS[sourcePath] ?? 'Texas toll-road ownership guide';
  }

  return getArticleSearchTarget(relatedPath)?.primaryQuery ?? relatedPath;
}
