export type ResearchAsset = {
  priority: 1 | 2 | 3;
  name: string;
  href: string;
  type: string;
  preferredAnchor: string;
  audiences: string[];
  pitchAngle: string;
  supportingAssets: Array<{
    label: string;
    href: string;
  }>;
};

export const researchClaimBoundaries = [
  'These assets do not claim rankings, indexing, traffic movement, revenue impact, AI citations, backlinks, or Ahrefs Domain Rating movement.',
  'Private client names and private outcomes are intentionally excluded.',
  'Crawler access, static fallbacks, source maps, and machine-readable files are discovery aids, not authority or visibility guarantees.',
  'Links should be earned editorially; paid, exchanged, automated, or low-quality placements should not be counted as wins.',
];

export const publicResearchAssets: ResearchAsset[] = [
  {
    priority: 1,
    name: 'Research Asset Index',
    href: '/research',
    type: 'research_hub',
    preferredAnchor: 'technical SEO research assets',
    audiences: ['technical SEO', 'AI search', 'web developers', 'student founder profiles'],
    pitchAngle:
      'A browsable index of source-backed technical SEO, AI-search, Atlas, local crawlability, identity, and finance/data proof assets.',
    supportingAssets: [
      { label: 'Authority asset JSON', href: '/research/authority-assets.json' },
      { label: 'AI information source graph', href: '/ai-information' },
    ],
  },
  {
    priority: 2,
    name: 'Project Work Index',
    href: '/work',
    type: 'project_collection',
    preferredAnchor: 'Sulayman Bowles project work',
    audiences: ['project reviewers', 'student profiles', 'software builders', 'technical portfolio readers'],
    pitchAngle:
      'Current project surface for public engineering, research, markets, and technical SEO work without implying external validation.',
    supportingAssets: [
      { label: 'Research asset index', href: '/research' },
      { label: 'AI information source graph', href: '/ai-information' },
    ],
  },
  {
    priority: 1,
    name: 'AI Search Crawler Policy',
    href: '/markets/ai-search-crawler-policy',
    type: 'research_note',
    preferredAnchor: 'AI search crawler policy',
    audiences: ['technical SEO', 'AI search', 'web developers', 'search policy writers'],
    pitchAngle:
      'Source-backed map of search, training, and user-requested retrieval crawlers with conservative visibility boundaries.',
    supportingAssets: [{ label: 'Crawler policy source map', href: '/research/ai-search-crawler-policy-sources.csv' }],
  },
  {
    priority: 1,
    name: 'Atlas Sample Crawl Run',
    href: '/atlas/sample-crawl',
    type: 'evidence_artifact',
    preferredAnchor: 'Atlas sample crawl run',
    audiences: ['technical SEO', 'crawlability', 'open-source SEO tooling', 'audit workflow writers'],
    pitchAngle:
      'Sanitized crawl evidence showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and CSV evidence.',
    supportingAssets: [{ label: 'Sanitized crawl CSV', href: '/research/atlas-sanitized-crawl-sample.csv' }],
  },
  {
    priority: 1,
    name: 'Atlas SEO Audit Console',
    href: '/atlas',
    type: 'project_page',
    preferredAnchor: 'Atlas SEO Audit Console',
    audiences: ['technical SEO', 'software builders', 'student founders', 'web audit teams'],
    pitchAngle:
      'Crawl evidence system for indexation, internal links, canonicals, structured data, rendered HTML, and audit exports.',
    supportingAssets: [{ label: 'Audit CLI repository', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-' }],
  },
  {
    priority: 2,
    name: 'Technical SEO as Public Data Infrastructure',
    href: '/markets/technical-seo-public-data-infrastructure',
    type: 'research_note',
    preferredAnchor: 'technical SEO as public data infrastructure',
    audiences: ['technical SEO', 'data infrastructure', 'AI discovery', 'structured data'],
    pitchAngle:
      'Editorial bridge between crawlability, structured data, provenance, source consistency, and machine-readable public records.',
    supportingAssets: [],
  },
  {
    priority: 2,
    name: 'Canonical Identity for Personal SEO',
    href: '/markets/canonical-identity-personal-seo',
    type: 'research_note',
    preferredAnchor: 'canonical identity for personal SEO',
    audiences: ['personal SEO', 'founder profiles', 'structured data', 'profile cleanup'],
    pitchAngle:
      'Reconciliation checklist for profile pages, stale PDFs, sameAs links, source pages, and external bio consistency.',
    supportingAssets: [],
  },
  {
    priority: 2,
    name: 'Technical SEO Audit Case Study',
    href: '/case-studies/technical-seo-audit',
    type: 'case_study',
    preferredAnchor: 'technical SEO audit case study',
    audiences: ['technical SEO', 'client reporting', 'crawl evidence', 'web teams'],
    pitchAngle:
      'Sanitized explanation of how crawl evidence becomes findings, priorities, and review artifacts without private client claims.',
    supportingAssets: [{ label: 'Sanitized crawl CSV', href: '/research/atlas-sanitized-crawl-sample.csv' }],
  },
  {
    priority: 3,
    name: 'Austin Technical SEO',
    href: '/austin-technical-seo',
    type: 'local_service_page',
    preferredAnchor: 'Austin technical SEO',
    audiences: ['Austin startups', 'local business', 'student entrepreneurship', 'B2B web teams'],
    pitchAngle:
      'Local technical SEO and AI-search visibility page for crawlability, indexation, source clarity, and implementation evidence.',
    supportingAssets: [
      { label: 'Austin benchmark CSV', href: '/research/austin-crawlability-benchmark-pilot.csv' },
      { label: 'Austin benchmark summary', href: '/research/austin-crawlability-benchmark-summary.json' },
    ],
  },
  {
    priority: 3,
    name: 'Austin Crawlability Benchmark Pilot',
    href: '/research/austin-crawlability-benchmark-pilot.csv',
    type: 'public_data_asset',
    preferredAnchor: 'Austin crawlability benchmark pilot',
    audiences: ['Austin startups', 'local business media', 'technical SEO', 'public web infrastructure'],
    pitchAngle:
      'Bounded public crawlability signal sample for Austin-area technology and business websites with explicit measurement-gap boundaries.',
    supportingAssets: [
      { label: 'Austin benchmark summary', href: '/research/austin-crawlability-benchmark-summary.json' },
      { label: 'Austin technical SEO page', href: '/austin-technical-seo' },
    ],
  },
  {
    priority: 3,
    name: 'AI Information Source Graph',
    href: '/ai-information',
    type: 'source_graph',
    preferredAnchor: 'Sulayman Bowles source graph',
    audiences: ['profile pages', 'AI retrieval', 'identity reconciliation', 'external bios'],
    pitchAngle:
      'Canonical public source page for current identity, source roles, project evidence, and what not to infer.',
    supportingAssets: [{ label: 'LLMs text file', href: '/llms.txt' }],
  },
  {
    priority: 3,
    name: 'Markets Research',
    href: '/markets',
    type: 'research_collection',
    preferredAnchor: 'Markets Research',
    audiences: ['finance/data research', 'student profiles', 'markets writing', 'research portfolios'],
    pitchAngle:
      'Public finance and data reasoning archive with market research notes, thesis framing, source tables, and explicit limits.',
    supportingAssets: [
      { label: 'Appian research memo PDF', href: '/research/appian-enterprise-software-durability-memo.pdf' },
      { label: 'Appian assumptions table', href: '/research/appian-assumptions-table.csv' },
    ],
  },
  {
    priority: 3,
    name: 'HTML Resume',
    href: '/resume',
    type: 'profile_page',
    preferredAnchor: 'Sulayman Bowles resume',
    audiences: ['academic profiles', 'professional profiles', 'speaker bios', 'student founder profiles'],
    pitchAngle:
      'Current HTML-first resume connecting UT Austin McCombs, Atlas, Void Agency, technical SEO, finance/data work, public code, and professional profiles.',
    supportingAssets: [{ label: 'Current PDF resume', href: '/Sulayman_Bowles_Resume.pdf' }],
  },
];

export const publicDataDownloads = [
  {
    label: 'Authority asset JSON',
    href: '/research/authority-assets.json',
    description: 'Machine-readable index of citation targets, anchor suggestions, audiences, and claim boundaries.',
  },
  {
    label: 'AI-search crawler policy source map',
    href: '/research/ai-search-crawler-policy-sources.csv',
    description: 'Source table for crawler policy, robots, IndexNow, DR, and visibility-boundary claims.',
  },
  {
    label: 'Austin crawlability benchmark pilot',
    href: '/research/austin-crawlability-benchmark-pilot.csv',
    description: 'Bounded public homepage, robots.txt, and sitemap signal sample for Austin-area sites.',
  },
  {
    label: 'Austin crawlability benchmark summary',
    href: '/research/austin-crawlability-benchmark-summary.json',
    description: 'Aggregate counts, methodology, and claim boundaries for the Austin benchmark pilot.',
  },
  {
    label: 'Atlas sanitized crawl sample',
    href: '/research/atlas-sanitized-crawl-sample.csv',
    description: 'Demo URL-level crawl evidence for indexability, canonical, link, and issue-field examples.',
  },
  {
    label: 'Appian educational research memo',
    href: '/research/appian-enterprise-software-durability-memo.pdf',
    description: 'Finance/data research sample with educational-use boundaries.',
  },
  {
    label: 'Appian assumptions table',
    href: '/research/appian-assumptions-table.csv',
    description: 'CSV assumptions table that supports the finance/data memo.',
  },
];
