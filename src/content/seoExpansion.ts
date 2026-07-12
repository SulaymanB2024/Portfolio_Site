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
    eyebrow: 'Product',
    title: 'Atlas SEO Audit Console',
    href: '/atlas',
    problem: 'Technical audits lose credibility when recommendations cannot be traced back to URL-level evidence.',
    role: 'Founder; product, crawler, evidence policy, and interface design.',
    built: 'Native crawl records, raw/render comparison, indexability and canonical checks, link graphs, issue review, persistence, and export paths.',
    constraints: 'Provider gaps, failed fetches, challenge pages, and contaminated renders remain measurement gaps—not site-health findings.',
    status: 'Core crawl and evidence workflow shipped; provider mesh and scoring policy remain active development.',
    evidenceLabel: 'Inspect the sanitized crawl run',
    evidenceHref: '/atlas/sample-crawl',
    notPublic: 'Private targets, client records, credentials, and unreviewed provider output.',
  },
  {
    eyebrow: 'Infrastructure research',
    title: 'Who Owns the Toll Roads in Texas?',
    href: '/markets/who-owns-texas-toll-roads',
    problem: '“Who owns the road?” collapses public title, concession rights, creditors, operators, billing, and residual value into one misleading answer.',
    role: 'Research design, source ledger, ownership model, calculations, writing, and visual explanation.',
    built: 'A statewide ownership map, toll-dollar waterfall, project comparison, finite-life DCF screen, fact-gap ledger, and primary-source index.',
    constraints: 'Public/private distinctions, dated cap tables, analyst estimates, and missing disclosures stay labeled throughout.',
    status: 'Published July 11, 2026; evidence cutoff is explicit in the article.',
    evidenceLabel: 'Open the source-led article',
    evidenceHref: '/markets/who-owns-texas-toll-roads#source-ledger',
    notPublic: 'No private diligence, bids, carrying values, or current security recommendations.',
  },
  {
    eyebrow: 'AI systems',
    title: 'ViralBench + Codex Improvement Harness',
    href: '/viralbench-codex-agent-harness',
    problem: 'A leaderboard score does not explain why an agent succeeded, failed, regressed, or improved across controlled trials.',
    role: 'Code-level audit, evaluation architecture, experiment design, and technical writing.',
    built: 'A proposed trace schema, replay layer, controlled-trial loop, evidence boundary, and bounded Codex engineering workflow.',
    constraints: 'The article separates implemented repository behavior from proposed harness work and unverified production coverage.',
    status: 'Published engineering design; not represented as a deployed evaluation service.',
    evidenceLabel: 'Read the architecture and limits',
    evidenceHref: '/viralbench-codex-agent-harness',
    notPublic: 'Credentials, live campaign data, and any production experiments not evidenced in the public repository.',
  },
  {
    eyebrow: 'Technical SEO research',
    title: 'Austin Crawlability Pilot',
    href: '/austin-technical-seo',
    problem: 'Local-service SEO advice is often published without a bounded sample, inspectable rows, or a distinction between access gaps and negative findings.',
    role: 'Study design, public collection, measurement-gap policy, analysis, and publication.',
    built: 'A 12-site homepage/robots/sitemap pilot, aggregate summary, public CSV, methodology, and cutoff-aware reporting.',
    constraints: 'The pilot is not representative and makes no ranking, traffic, conversion, revenue, citation, or site-health claim.',
    status: 'Published pilot generated June 25, 2026.',
    evidenceLabel: 'Open the public CSV',
    evidenceHref: '/research/austin-crawlability-benchmark-pilot.csv',
    notPublic: 'No private analytics, Search Console data, client identity, or broader Austin-market inference.',
  },
  {
    eyebrow: 'Operating practice',
    title: 'Void Agency',
    href: '/void-agency',
    problem: 'Teams need a bounded route from crawl evidence to implementation work without a generic growth retainer or opaque audit deck.',
    role: 'Founder and operator across scoping, audit systems, implementation, analytics, and client delivery.',
    built: 'A technical SEO and web-systems practice with a four-stage method, explicit inputs and exclusions, and Atlas-backed evidence paths.',
    constraints: 'Private client names and outcome data remain private; the public site shows method and artifacts instead.',
    status: 'Operating; $50K+ collected revenue as of May 31, 2026.',
    evidenceLabel: 'Read the scoped audit method',
    evidenceHref: '/method',
    notPublic: 'Client identities, credentials, unreleased deliverables, and unsupported outcome claims.',
  },
  {
    eyebrow: 'Technical record',
    title: 'Sulayman Bowles Technical Ledger',
    href: 'https://sulayman-bowles.tech/',
    problem: 'Code, experiments, competition work, and technical notes become hard to inspect when scattered across repositories and old portfolio surfaces.',
    role: 'Builder, editor, and maintainer of the public proof layer.',
    built: 'A separate artifact domain for projects, source links, technical notes, and durable records that support—rather than duplicate—the identity site.',
    constraints: 'The ledger stays artifact-first and routes canonical identity context back to this site.',
    status: 'Live public proof layer; reviewed July 12, 2026.',
    evidenceLabel: 'Open the technical ledger',
    evidenceHref: 'https://sulayman-bowles.tech/',
    notPublic: 'Private repositories, abandoned experiments without learning value, and secrets or local machine state.',
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
      'Collect raw URLs, rendered content, robots and sitemap signals, canonical tags, indexability directives, internal links, and template patterns before writing fixes. The first output is evidence, not advice.',
  },
  {
    title: 'Separate observations from interpretation',
    copy:
      'A missing canonical, low inlink count, or noindex directive is recorded as an observation first. Impact and priority are added only after the pattern is reviewed across templates, depth, traffic access, and business role.',
  },
  {
    title: 'Prioritize implementation paths',
    copy:
      'Findings become a short action list with owners and acceptance checks: consolidate duplicate templates, repair canonical targets, strengthen hubs, preserve crawl paths, and rerun the crawl to confirm the field changed.',
  },
  {
    title: 'Keep limits visible',
    copy:
      'The case study describes the method and sample files. It does not claim private traffic movement, rankings, revenue impact, or answer placement. Missing provider access remains a measurement gap, not a negative finding.',
  },
];

export const auditCaseStudyAnswer = [
  {
    label: 'Problem observed',
    value:
      'A sanitized crawl row can show an indexable page with weak canonical data, shallow inlinks, or template risk. That is enough to investigate, not enough to claim a ranking loss.',
  },
  {
    label: 'Evidence used',
    value:
      'The review uses status code, indexability, crawl depth, inlinks, outlinks, canonical field, issue label, source notes, and the related sitemap or template context.',
  },
  {
    label: 'Recommended repair',
    value:
      'Pick the preferred canonical, update the affected template, strengthen internal links from relevant hubs, and document the owner and acceptance check.',
  },
  {
    label: 'Rerun check',
    value:
      'Run the crawl again after implementation and compare the new row against the expected field changes before calling the issue closed.',
  },
  {
    label: 'What it does not prove',
    value:
      'The public case study does not prove private traffic, ranking movement, revenue impact, answer placement, or site-health conclusions beyond the sanitized sample.',
  },
];

export const auditExampleFindingChain = [
  {
    label: 'Observed field',
    value:
      '/resources/seo-tools is a sanitized demo URL with status 200, indexable state, crawl depth 2, 18 inlinks, and a missing canonical field. The row is enough to inspect, not enough to claim performance impact.',
  },
  {
    label: 'Interpreted risk',
    value:
      'A missing canonical can fragment duplicate or template signals when similar pages exist, but it becomes a priority only after template duplication, internal links, and canonical intent are reviewed together.',
  },
  {
    label: 'Implementation action',
    value:
      'Choose the preferred canonical, update template output, confirm internal links point at the preferred URL, rerun the crawl, and compare the new row against the acceptance check.',
  },
  {
    label: 'Boundary',
    value:
      'This is a sanitized demo row, not a private client record, ranking claim, traffic claim, revenue result, or answer-placement claim.',
  },
];

export const austinSeoSignals = [
  'Crawlable Austin service, product, location, and proof pages with stable canonical URLs',
  'Short answer blocks that state who the page serves, what is offered, service-area limits, and the next step',
  'Internal links from service pages to proof assets, intake, method notes, and sample crawl data',
  'Structured data that matches visible content instead of inventing credentials, reviews, or coverage',
  'Local proof such as project examples, service boundaries, review themes, owner context, and measurement fields',
  'Google Business Profile, analytics, Search Console, and call/form data review only when access is available',
];

export const austinDiagnosticExamples = [
  {
    prompt: 'emergency HVAC repair Austin',
    review:
      'Check whether an emergency service page is crawlable, locally specific, linked from the main service hub, and connected to a tracked call path.',
  },
  {
    prompt: 'foundation repair estimate Austin',
    review:
      'Check estimate language, qualification criteria, proof photos or case notes, review themes, and whether form submissions preserve service intent.',
  },
  {
    prompt: 'dentist near Mueller',
    review:
      'Check whether location language is real, whether Google Business Profile categories match the site, and whether appointment CTAs preserve source context.',
  },
  {
    prompt: 'med spa consultation Austin',
    review:
      'Check service boundaries, consultation steps, credibility signals, visible disclaimers, and whether answer-style copy avoids medical overclaiming.',
  },
];

export const austinBenchmarkSnapshot = [
  { label: 'Evidence cutoff', value: 'June 25, 2026' },
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

export const austinPilotMethod = [
  'The pilot used 12 Austin-area public homepages generated on 2026-06-25.',
  'Each row started with one homepage fetch, one robots.txt fetch, and one sitemap declaration check where the public site exposed those files.',
  'The review recorded presence and access signals only; it did not score local rankings, conversions, site health, or business quality.',
  'Challenge pages, timeouts, blocked responses, and fetch gaps stay recorded as measurement gaps instead of negative SEO findings.',
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
