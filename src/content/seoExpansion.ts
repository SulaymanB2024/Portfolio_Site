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
    description: 'Public scraper and audit-system code.',
  },
  {
    label: 'Request an audit',
    href: '/contact',
    description: 'Audit intake for technical SEO, site systems, analytics, and markets research.',
  },
  {
    label: 'Read the markets research memo with assumptions',
    href: '/markets#appian-assumptions',
    description: 'Educational research memo with an assumptions table and clear limits.',
  },
];

export const workProofCards = [
  {
    eyebrow: 'Project',
    title: 'Atlas SEO Audit Console',
    href: '/atlas',
    copy:
      'Crawl records, raw and rendered HTML, indexability checks, internal-link logic, structured data review, and export-ready audit notes.',
    cta: 'See an Atlas sample crawl run',
    ctaHref: '/atlas/sample-crawl',
  },
  {
    eyebrow: 'Method',
    title: 'Technical SEO Audit Method',
    href: '/method',
    copy:
      'A crawl-first process for turning search visibility problems into priorities and implementation work.',
    cta: 'Read the technical SEO audit method',
    ctaHref: '/method',
  },
  {
    eyebrow: 'Case study',
    title: 'Sanitized Technical SEO Audit',
    href: '/case-studies/technical-seo-audit',
    copy:
      'A public case-study frame showing how site checks become findings without exposing private client data.',
    cta: 'View the audit case study',
    ctaHref: '/case-studies/technical-seo-audit',
  },
  {
    eyebrow: 'Research',
    title: 'Markets Research and Assumptions',
    href: '/markets#appian-assumptions',
    copy:
      'Markets research notes with an assumptions table, memo PDF, and explicit educational-use limits.',
    cta: 'Read the markets research memo with assumptions',
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
  'Atlas treats URL discovery, status code, canonical state, crawl depth, inlinks, outlinks, and indexability as reviewable crawl data.',
  'Issue labels remain tied to observed fields, not broad score claims.',
  'The CSV exists so reviewers can inspect the source table instead of relying only on page copy.',
];

export const auditCaseStudySteps = [
  {
    title: 'Crawl data before recommendations',
    copy:
      'Collect raw URLs, rendered content, robots and sitemap signals, canonical tags, indexability directives, internal links, and template patterns before writing fixes.',
  },
  {
    title: 'Separate observations from interpretation',
    copy:
      'A missing canonical, low inlink count, or noindex directive is recorded as an observation first. Impact and priority are added only after the pattern is reviewed across the crawl.',
  },
  {
    title: 'Prioritize implementation paths',
    copy:
      'Findings become a short action list: consolidate duplicate templates, repair canonical targets, strengthen hubs, preserve crawl paths, and document owner-ready tasks.',
  },
  {
    title: 'Keep limits visible',
    copy:
      'The case study describes the method and sample files. It does not claim private traffic movement, rankings, revenue impact, or answer placement.',
  },
];

export const auditExampleFindingChain = [
  {
    label: 'Observed field',
    value:
      '/resources/seo-tools is a sanitized demo URL with status 200, indexable state, crawl depth 2, 18 inlinks, and a missing canonical field.',
  },
  {
    label: 'Interpreted risk',
    value:
      'A missing canonical can fragment duplicate or template signals when similar pages exist, but the crawl row is still an observation before it becomes a priority.',
  },
  {
    label: 'Implementation action',
    value:
      'Choose the preferred canonical, update template output, confirm internal links point at the preferred URL, and rerun the crawl to verify the field changed.',
  },
  {
    label: 'Boundary',
    value:
      'This is a sanitized demo row, not a private client record, ranking claim, traffic claim, revenue result, or answer-placement claim.',
  },
];

export const austinSeoSignals = [
  'Crawlable service and location pages with stable canonical URLs',
  'Clear business identity, contact path, and service-area language',
  'Internal links from project pages to intake, method, and sample files',
  'Structured data that matches visible content instead of inventing credentials',
  'Clear copy for search review and human readers',
  'Google Business Profile, analytics, and Search Console review when access is available',
];

export const austinBenchmarkSnapshot = [
  { label: 'Generated', value: '2026-06-25' },
  { label: 'Sample', value: '12 Austin-area public homepages' },
  { label: 'Homepage fetches', value: '12 completed; 12 resolved to HTTPS' },
  { label: 'Robots sitemap declarations', value: '10 rows declared a sitemap URL' },
  { label: 'Sitemap fetches', value: '10 returned 2xx or 3xx' },
  { label: 'Measurement gaps', value: '6 rows carried access, timeout, or challenge notes' },
];

export const austinBenchmarkLimits = [
  'The pilot is not representative of all Austin companies.',
  'Rows do not claim rankings, traffic movement, revenue impact, AI citations, or site health.',
  'Access-limited, timed-out, or challenged fetches are measurement gaps, not negative findings.',
];

export const voidAgencyProofLinks = [
  {
    label: 'Void Agency website',
    href: 'https://www.void-agency.com/',
    role: 'Agency domain',
    copy: 'External agency site for the commercial branch of the technical SEO work.',
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
    role: 'Sample',
    copy: 'Sanitized crawl table showing the kind of data reviewed before audit recommendations.',
  },
  {
    label: 'Request an audit',
    href: '/contact',
    role: 'Intake',
    copy: 'Direct audit intake for technical SEO, site systems, analytics, and markets research work.',
  },
];

export const appianAssumptionRows = [
  {
    category: 'Thesis',
    variable: 'Core question',
    baseCase: 'Recurring workflow deployments may be more durable than the multiple implies',
    downsideCase: 'Revenue behaves more like short-cycle software demand',
    boundary: 'Educational research sample only; no price target or recommendation.',
  },
  {
    category: 'Market structure',
    variable: 'Buyer type',
    baseCase: 'Enterprise workflow and process automation buyers reduce churn risk',
    downsideCase: 'Budget scrutiny delays expansion and renewals',
    boundary: 'Validate against filings, customer concentration, and revenue commentary.',
  },
  {
    category: 'Margins',
    variable: 'Gross margin direction',
    baseCase: 'Software mix supports durable gross margin',
    downsideCase: 'Services or implementation costs pressure margin',
    boundary: 'Source-table rows are assumptions, not live market data.',
  },
  {
    category: 'Disclaimer',
    variable: 'Investment use',
    baseCase: 'Educational research sample only',
    downsideCase: 'Not a recommendation or price target',
    boundary: 'Verify assumptions and sources before relying on any thesis.',
  },
];
