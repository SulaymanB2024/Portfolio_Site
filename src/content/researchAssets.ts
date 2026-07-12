export type ResearchAsset = {
  name: string;
  href: string;
  type: string;
  description: string;
  topics: string[];
  published?: string;
  featured?: boolean;
  claimBoundary: string;
  supportingAssets: Array<{
    label: string;
    href: string;
  }>;
};

export const researchClaimBoundaries = [
  'Each entry distinguishes observed evidence, sourced interpretation, and open questions. A method or model is not an independently verified outcome.',
  'Private client names and private outcomes are intentionally excluded.',
  'Crawler access, static fallbacks, source tables, and machine-readable files help discovery and review; they do not guarantee rankings, indexing, traffic, or AI citations.',
  'Demo, sanitized, and pilot datasets are labeled as such. Missing, blocked, or failed coverage is a measurement gap rather than evidence of site quality.',
  'Markets materials are educational research, not investment advice, a price target, or a live recommendation.',
];

export const publicResearchAssets: ResearchAsset[] = [
  {
    name: 'Who Owns the Toll Roads in Texas?',
    href: '/markets/who-owns-texas-toll-roads',
    type: 'long_form_research',
    description:
      'A source-led ownership map separating state title, public authorities, private concession rights, sponsor equity, project debt, billing, and residual control across Texas toll roads.',
    topics: ['Texas infrastructure', 'project finance', 'public records'],
    published: '2026-07-11',
    featured: true,
    claimBoundary:
      'Concession-company percentages are not ownership of state land. Dated cap tables, analyst calculations, and unresolved disclosures are identified in the article.',
    supportingAssets: [{ label: 'Markets research index', href: '/markets' }],
  },
  {
    name: 'Beyond the Leaderboard: ViralBench + Codex',
    href: '/viralbench-codex-agent-harness',
    type: 'engineering_research_note',
    description:
      'A code-audit-backed design note for adding immutable traces, replay, independent evaluation, and bounded Codex engineering loops around a live marketing agent.',
    topics: ['AI agent evaluation', 'harness engineering', 'controlled experimentation'],
    published: '2026-07-09',
    featured: true,
    claimBoundary:
      'The article describes an audited baseline and a proposed improvement architecture. It does not claim that the proposed harness, experiments, or performance improvements are already deployed.',
    supportingAssets: [
      { label: 'ViralBench repository', href: 'https://github.com/JibranK12345/Viral-Bench' },
    ],
  },
  {
    name: 'AI Search Crawler Policy',
    href: '/markets/ai-search-crawler-policy',
    type: 'research_note',
    description:
      'A source-backed map of search, training, and user-requested retrieval crawlers, with practical guidance for public websites.',
    topics: ['crawler policy', 'AI search', 'technical SEO'],
    published: '2026-06-19',
    featured: true,
    claimBoundary:
      'Crawler access is a discovery condition. It does not guarantee ranking, indexing, model inclusion, AI citation, or answer-system trust.',
    supportingAssets: [{ label: 'Crawler policy source map', href: '/research/ai-search-crawler-policy-sources.csv' }],
  },
  {
    name: 'Technical SEO as Public Data Infrastructure',
    href: '/markets/technical-seo-public-data-infrastructure',
    type: 'research_note',
    description:
      'An editorial bridge between crawlability, structured data, provenance, source consistency, and machine-readable public records.',
    topics: ['technical SEO', 'data infrastructure', 'provenance'],
    published: '2026-06-19',
    featured: true,
    claimBoundary:
      'The public-data analogy is a working framework. A portfolio is not a regulated disclosure system, and better infrastructure does not guarantee distribution.',
    supportingAssets: [],
  },
  {
    name: 'Canonical Identity for Personal SEO',
    href: '/markets/canonical-identity-personal-seo',
    type: 'research_note',
    description:
      'A reconciliation checklist for profile pages, stale PDFs, sameAs links, source pages, and external bio consistency.',
    topics: ['canonical identity', 'structured data', 'profile hygiene'],
    published: '2026-06-19',
    claimBoundary:
      'External profiles can drift or block crawlers. The checklist improves record consistency without promising search visibility or entity recognition.',
    supportingAssets: [],
  },
  {
    name: 'Atlas Sample Crawl Run',
    href: '/atlas/sample-crawl',
    type: 'evidence_artifact',
    description:
      'A sanitized crawl example showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and reviewable CSV rows.',
    topics: ['crawl evidence', 'indexability', 'audit workflow'],
    claimBoundary:
      'The public rows are a small fictional demonstration. They show the output contract, not real-site coverage, production scale, or client outcomes.',
    supportingAssets: [{ label: 'Sanitized crawl CSV', href: '/research/atlas-sanitized-crawl-sample.csv' }],
  },
  {
    name: 'Atlas SEO Audit Console',
    href: '/atlas',
    type: 'project_page',
    description:
      'A crawl evidence system for indexation, internal links, canonicals, structured data, rendered HTML, and audit exports.',
    topics: ['technical SEO', 'crawler systems', 'evidence review'],
    claimBoundary:
      'The project page documents system behavior and implementation. It should not be read as third-party validation, complete provider coverage, or proof of client impact.',
    supportingAssets: [{ label: 'Audit CLI repository', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-' }],
  },
  {
    name: 'Technical SEO Audit Method Walkthrough',
    href: '/case-studies/technical-seo-audit',
    type: 'method_walkthrough',
    description:
      'An illustrative explanation of how crawl evidence can become findings, priorities, and review artifacts without presenting a completed client result.',
    topics: ['audit method', 'crawl evidence', 'client reporting'],
    claimBoundary:
      'This is an illustrative method walkthrough. Its examples do not establish rankings, traffic movement, revenue impact, or a named client result.',
    supportingAssets: [{ label: 'Sanitized crawl CSV', href: '/research/atlas-sanitized-crawl-sample.csv' }],
  },
  {
    name: 'Austin Crawlability Benchmark Pilot',
    href: '/research/austin-crawlability-benchmark-pilot.csv',
    type: 'public_dataset',
    description:
      'A bounded sample of homepage, robots.txt, and sitemap signals for Austin-area technology and business websites.',
    topics: ['Austin', 'crawlability', 'public web infrastructure'],
    claimBoundary:
      'Challenge pages, failed fetches, and blocked requests are access limitations. The pilot does not score overall site health or represent all Austin businesses.',
    supportingAssets: [
      { label: 'Benchmark summary', href: '/research/austin-crawlability-benchmark-summary.json' },
      { label: 'Austin technical SEO page', href: '/austin-technical-seo' },
    ],
  },
  {
    name: 'Markets Research',
    href: '/markets',
    type: 'research_collection',
    description:
      'A public finance and data-reasoning archive with research notes, assumption tables, source links, and explicit uncertainty boundaries.',
    topics: ['markets', 'finance', 'data reasoning'],
    claimBoundary:
      'Markets materials are educational research samples. They are not investment advice, a price target, an allocation recommendation, or an offer to transact.',
    supportingAssets: [
      { label: 'Appian educational memo', href: '/research/appian-enterprise-software-durability-memo.pdf' },
      { label: 'Appian assumptions table', href: '/research/appian-assumptions-table.csv' },
    ],
  },
];

export const publicDataDownloads = [
  {
    label: 'Research index JSON',
    href: '/research/authority-assets.json',
    description: 'Machine-readable bibliography of public research pages, topics, supporting files, and claim boundaries.',
  },
  {
    label: 'AI-search crawler policy source map',
    href: '/research/ai-search-crawler-policy-sources.csv',
    description: 'Source table for crawler roles, robots directives, IndexNow, and visibility-boundary claims.',
  },
  {
    label: 'Austin crawlability benchmark pilot',
    href: '/research/austin-crawlability-benchmark-pilot.csv',
    description: 'Bounded public homepage, robots.txt, and sitemap signal sample for Austin-area sites.',
  },
  {
    label: 'Austin crawlability benchmark summary',
    href: '/research/austin-crawlability-benchmark-summary.json',
    description: 'Aggregate counts, methodology, and measurement limits for the Austin benchmark pilot.',
  },
  {
    label: 'Atlas sanitized crawl sample',
    href: '/research/atlas-sanitized-crawl-sample.csv',
    description: 'Demo URL-level crawl evidence for indexability, canonical, link, and issue-field examples.',
  },
  {
    label: 'Appian educational research memo',
    href: '/research/appian-enterprise-software-durability-memo.pdf',
    description: 'Finance research sample with educational-use and investment-advice boundaries.',
  },
  {
    label: 'Appian assumptions table',
    href: '/research/appian-assumptions-table.csv',
    description: 'CSV assumptions table supporting the Appian educational research memo.',
  },
];
