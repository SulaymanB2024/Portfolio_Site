export const RESEARCH_ASSETS = {
  atlasSampleCsv: '/research/atlas-sanitized-crawl-sample.csv',
  appianAssumptionsCsv: '/research/appian-assumptions-table.csv',
  appianMemoPdf: '/research/appian-enterprise-software-durability-memo.pdf',
};

export const contextualProofLinks = [
  {
    label: 'See an Atlas sample crawl run',
    href: '/atlas/sample-crawl',
    description: 'A sanitized crawl table showing URL status, indexability, links, canonicals, and issue notes.',
  },
  {
    label: 'Read the technical SEO audit method',
    href: '/method',
    description: 'The process page for crawl, diagnose, repair, and measure work.',
  },
  {
    label: 'View the GitHub repo for the audit CLI',
    href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
    description: 'Public scraper and audit-system code evidence.',
  },
  {
    label: 'Request an audit',
    href: '/contact',
    description: 'Technical SEO, AI-search visibility, and site-systems intake.',
  },
  {
    label: 'Read the finance/data memo with assumptions',
    href: '/markets#appian-assumptions',
    description: 'Educational research artifacts with source-table and claim-boundary notes.',
  },
];

export const workProofCards = [
  {
    eyebrow: 'Project',
    title: 'Atlas SEO Audit Console',
    href: '/atlas',
    copy:
      'Crawl evidence, raw and rendered HTML, indexability checks, internal-link logic, structured data review, and export-ready audit records.',
    cta: 'See an Atlas sample crawl run',
    ctaHref: '/atlas/sample-crawl',
  },
  {
    eyebrow: 'Method',
    title: 'Technical SEO Audit Method',
    href: '/method',
    copy:
      'A crawl-first process for mapping search visibility problems into evidence, priorities, and implementation work.',
    cta: 'Read the technical SEO audit method',
    ctaHref: '/method',
  },
  {
    eyebrow: 'Method walkthrough',
    title: 'Illustrative Technical SEO Audit',
    href: '/case-studies/technical-seo-audit',
    copy:
      'An illustrative walkthrough showing how site evidence can become findings without presenting a completed client result.',
    cta: 'View the audit method walkthrough',
    ctaHref: '/case-studies/technical-seo-audit',
  },
  {
    eyebrow: 'Research',
    title: 'Markets Research and Assumptions',
    href: '/markets#appian-assumptions',
    copy:
      'Finance/data artifacts with an assumptions table, memo PDF, and explicit educational-use boundaries.',
    cta: 'Read the finance/data memo with assumptions',
    ctaHref: '/markets#appian-assumptions',
  },
];

export const atlasSampleRows = [
  {
    url: 'https://example.com/',
    status: '200',
    indexability: 'indexable',
    depth: '0',
    inlinks: '1240',
    outlinks: '56',
    canonical: 'self-canonical',
    issue: 'none',
    note: 'Homepage retained as crawl root',
  },
  {
    url: 'https://example.com/blog',
    status: '200',
    indexability: 'indexable',
    depth: '1',
    inlinks: '340',
    outlinks: '48',
    canonical: 'self-canonical',
    issue: 'thin hub copy',
    note: 'Blog hub needs stronger internal context',
  },
  {
    url: 'https://example.com/services',
    status: '200',
    indexability: 'indexable',
    depth: '1',
    inlinks: '290',
    outlinks: '32',
    canonical: 'self-canonical',
    issue: 'slow lcp',
    note: 'Hero image lacks priority and stable dimensions',
  },
  {
    url: 'https://example.com/resources/seo-tools',
    status: '200',
    indexability: 'indexable',
    depth: '2',
    inlinks: '18',
    outlinks: '14',
    canonical: 'missing',
    issue: 'missing canonical',
    note: 'Canonical target not declared in source HTML',
  },
  {
    url: 'https://example.com/pricing/plans',
    status: '200',
    indexability: 'indexable',
    depth: '2',
    inlinks: '24',
    outlinks: '18',
    canonical: 'missing',
    issue: 'duplicate candidate',
    note: 'Similar pricing templates require canonical review',
  },
  {
    url: 'https://example.com/search?q=audit',
    status: '200',
    indexability: 'noindex',
    depth: '3',
    inlinks: '4',
    outlinks: '96',
    canonical: 'parameterized',
    issue: 'soft 404 risk',
    note: 'Search result page returns thin body for empty states',
  },
];

export const atlasSampleFindings = [
  'The sample is sanitized/demo data and does not identify a private client or claim a live ranking outcome.',
  'Atlas treats URL discovery, status code, canonical state, crawl depth, inlinks, outlinks, and indexability as reviewable evidence.',
  'Issue labels remain tied to observed fields, not broad score claims.',
  'The CSV exists so reviewers can inspect the source table instead of relying only on page copy.',
];

export const auditCaseStudySteps = [
  {
    title: 'Crawl evidence before recommendations',
    copy:
      'Collect raw URLs, rendered content, robots and sitemap signals, canonical tags, indexability directives, internal links, and template patterns before writing fixes.',
  },
  {
    title: 'Separate observations from interpretation',
    copy:
      'A missing canonical, low inlink count, or noindex directive is recorded as evidence first. Impact and priority are added only after the pattern is reviewed across the crawl.',
  },
  {
    title: 'Prioritize implementation paths',
    copy:
      'Findings become a short action list: consolidate duplicate templates, repair canonical targets, strengthen hubs, preserve crawl paths, and document owner-ready tasks.',
  },
  {
    title: 'Keep claim boundaries visible',
    copy:
      'The walkthrough describes a method and illustrative artifacts. It does not claim a completed client result, private traffic movement, rankings, revenue impact, or AI-search citation gains.',
  },
];

export const austinSeoSignals = [
  'Crawlable service and location pages with stable canonical URLs',
  'Clear business identity, contact path, and service-area language',
  'Internal links from proof pages to intake, method, and sample artifacts',
  'Structured data that matches visible content instead of inventing credentials',
  'Source-backed copy for AI-search retrieval and human review',
  'Google Business Profile, analytics, and Search Console review when access is available',
];

export const voidAgencyProofLinks = [
  {
    label: 'Void Agency website',
    href: 'https://www.void-agency.com/',
    role: 'Agency domain',
    copy: 'External agency site for the commercial branch of the technical SEO and AI-search visibility work.',
  },
  {
    label: 'Technical SEO audit method',
    href: '/method',
    role: 'Process',
    copy: 'Personal-site process page explaining crawlability, indexation, internal links, structured data, analytics, and implementation review.',
  },
  {
    label: 'Atlas sample crawl run',
    href: '/atlas/sample-crawl',
    role: 'Artifact',
    copy: 'Sanitized crawl table showing the kind of evidence used before audit recommendations.',
  },
  {
    label: 'Request an audit',
    href: '/contact',
    role: 'Intake',
    copy: 'Direct project intake for technical SEO, AI-search visibility, and site-systems work.',
  },
];

export const appianAssumptionRows = [
  {
    category: 'Revenue mix',
    variable: 'Observed fact',
    baseCase: 'FY2025 subscriptions revenue was $576.5M of $726.9M total revenue (about 79%).',
    downsideCase: 'Recurring revenue categories do not disclose customer-level durability.',
    boundary: 'Reported mix is separate from assumptions about retention.',
  },
  {
    category: 'Cloud growth',
    variable: 'Observed fact',
    baseCase: 'Q1 2026 cloud subscriptions revenue was $124.5M, up 25% year over year.',
    downsideCase: 'Full-year cloud guidance was 18%-19%; one quarter should not be annualized.',
    boundary: 'Tests whether recent growth persists.',
  },
  {
    category: 'Margins',
    variable: 'Observed fact',
    baseCase: 'FY2025 subscription gross margin was 85.4% versus 86.6% in 2024.',
    downsideCase: 'Hosting costs increased and margin declined 120 basis points.',
    boundary: 'Tests whether cloud growth scales efficiently.',
  },
  {
    category: 'Guidance',
    variable: 'Observed management outlook',
    baseCase: 'FY2026 guidance was $819M-$831M revenue and $97M-$105M adjusted EBITDA.',
    downsideCase: 'Guidance is not an audited outcome and still requires GAAP reconciliation.',
    boundary: 'Educational diligence framework; no price target or recommendation.',
  },
];
