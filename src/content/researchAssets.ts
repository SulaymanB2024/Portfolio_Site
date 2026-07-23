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
  'Crawler access, static fallbacks, source tables, and reference files are discovery aids, not authority or visibility guarantees.',
  'Links should be earned editorially; paid, exchanged, automated, or low-quality placements should not be counted as wins.',
];

export const publicResearchAssets: ResearchAsset[] = [
  {
    priority: 1,
    name: 'Research Asset Index',
    href: '/research',
    type: 'research_hub',
    preferredAnchor: 'technical SEO research files',
    audiences: ['technical SEO', 'search visibility', 'web developers', 'student founder profiles'],
    pitchAngle:
      'A browsable index of technical SEO notes, Atlas samples, local crawlability work, identity context, and markets research files.',
    supportingAssets: [
      { label: 'Authority asset JSON', href: '/research/authority-assets.json' },
      { label: 'Article research briefs', href: '/research/article-research-briefs.json' },
      { label: 'About Sulayman Bowles', href: '/about' },
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
      'Current project index for public engineering, research, markets, and technical SEO work without implying outside validation.',
    supportingAssets: [
      { label: 'Research asset index', href: '/research' },
      { label: 'About Sulayman Bowles', href: '/about' },
    ],
  },
  {
    priority: 1,
    name: 'AI Crawler Robots.txt Guide',
    href: '/research/ai-crawlers/ai-search-crawler-policy',
    type: 'research_note',
    preferredAnchor: 'crawler policy for public websites',
    audiences: ['technical SEO', 'search visibility', 'web developers', 'search policy writers'],
    pitchAngle:
      'Map of search, training, and user-requested crawler behavior with conservative visibility limits.',
    supportingAssets: [{ label: 'Crawler policy sources', href: '/research/ai-search-crawler-policy-sources.csv' }],
  },
  {
    priority: 1,
    name: 'Who Owns the Toll Roads in Texas?',
    href: '/markets/who-owns-texas-toll-roads',
    type: 'long_form_research',
    preferredAnchor: 'Texas toll road ownership and economics',
    audiences: ['infrastructure investing', 'Texas transportation', 'public finance', 'project finance'],
    pitchAngle:
      'A source-led ownership map separating state title, public authorities, private concession rights, sponsor equity, project debt, billing, and residual control across Texas toll roads.',
    supportingAssets: [
      { label: 'Markets research index', href: '/markets' },
      { label: 'Source methodology', href: '/research/search-console/technical-seo-public-data-infrastructure' },
    ],
  },
  {
    priority: 1,
    name: 'The Hidden Financing Behind Hardware Startups',
    href: '/research/financial-systems/waymo-hardware-financing',
    type: 'long_form_research',
    preferredAnchor: 'Waymo hardware financing structure',
    audiences: ['hardware startups', 'autonomous vehicles', 'venture finance', 'asset finance'],
    pitchAngle:
      'A Waymo case study separating disclosed equity funding from modeled physical-asset capital, utilization, residual-value risk, and the party that absorbs downside.',
    supportingAssets: [
      { label: 'Full Waymo financing report', href: '/research/waymo-hardware-financing-report.pdf' },
      { label: 'Waymo hardware financing model', href: '/research/waymo-hardware-financing-model.xlsx' },
    ],
  },
  {
    priority: 1,
    name: 'Atlas Open-Corpus Demonstration',
    href: '/atlas/sample-crawl',
    type: 'sample_data',
    preferredAnchor: 'Atlas sample crawl run',
    audiences: ['technical SEO', 'crawlability', 'open-source SEO tooling', 'audit workflow writers'],
    pitchAngle:
      'Dated raw-versus-rendered capture with traceable findings, confidence states, and versioned CSV and JSON exports.',
    supportingAssets: [
      { label: 'Open-corpus CSV', href: '/research/atlas-open-corpus-run-2026-07-16.csv' },
      { label: 'Open-corpus capture manifest', href: '/research/atlas-open-corpus-run-2026-07-16.json' },
    ],
  },
  {
    priority: 1,
    name: 'Atlas SEO Audit Console',
    href: '/atlas',
    type: 'project_page',
    preferredAnchor: 'Atlas SEO Audit Console',
    audiences: ['technical SEO', 'software builders', 'student founders', 'web audit teams'],
    pitchAngle:
      'Crawl system for indexation, internal links, canonicals, structured data, rendered HTML, and audit exports.',
    supportingAssets: [{ label: 'Audit CLI repository', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-' }],
  },
  {
    priority: 2,
    name: 'Technical SEO as Public Data Infrastructure',
    href: '/research/search-console/technical-seo-public-data-infrastructure',
    type: 'research_note',
    preferredAnchor: 'technical SEO as public data infrastructure',
    audiences: ['technical SEO', 'data infrastructure', 'public discovery', 'structured data'],
    pitchAngle:
      'Editorial bridge between crawlability, structured data, provenance, source consistency, and public records.',
    supportingAssets: [],
  },
  {
    priority: 2,
    name: 'Canonical Identity for Personal SEO',
    href: '/research/personal-seo/canonical-identity-personal-seo',
    type: 'research_note',
    preferredAnchor: 'canonical identity for personal SEO',
    audiences: ['personal SEO', 'founder profiles', 'structured data', 'profile cleanup'],
    pitchAngle:
      'Reconciliation checklist for profile pages, stale PDFs, sameAs links, source pages, and external bio consistency.',
    supportingAssets: [],
  },
  {
    priority: 3,
    name: 'Austin Technical SEO',
    href: '/austin-technical-seo',
    type: 'local_service_page',
    preferredAnchor: 'Austin technical SEO',
    audiences: ['Austin startups', 'local business', 'student entrepreneurship', 'B2B web teams'],
    pitchAngle:
      'Local technical SEO page for crawlability, indexation, page clarity, and implementation detail.',
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
      'Bounded public crawlability signal sample for Austin-area technology and business websites with explicit measurement limits.',
    supportingAssets: [
      { label: 'Austin benchmark summary', href: '/research/austin-crawlability-benchmark-summary.json' },
      { label: 'Austin technical SEO page', href: '/austin-technical-seo' },
    ],
  },
  {
    priority: 3,
    name: 'About Sulayman Bowles',
    href: '/about',
    type: 'reference_page',
    preferredAnchor: 'Sulayman Bowles reference page',
    audiences: ['profile pages', 'profile reviewers', 'identity reconciliation', 'external bios'],
    pitchAngle:
      'Current identity, project context, public experience, and canonical links.',
    supportingAssets: [{ label: 'llms.txt reference file', href: '/llms.txt' }],
  },
  {
    priority: 3,
    name: 'Markets Research',
    href: '/markets',
    type: 'research_collection',
    preferredAnchor: 'Markets Research',
    audiences: ['finance research', 'student profiles', 'markets writing', 'research portfolios'],
    pitchAngle:
      'Public finance research archive with market research notes, thesis framing, source tables, and explicit limits.',
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
      'Current HTML-first resume connecting UT Austin McCombs, Atlas, Void Agency, technical SEO, finance research, public code, and professional profiles.',
    supportingAssets: [{ label: 'Current PDF resume', href: '/Sulayman_Bowles_Resume.pdf' }],
  },
];

export const publicDataDownloads = [
  {
    label: 'Article research briefs',
    href: '/research/article-research-briefs.json',
    description: 'Intent, direct-answer, original-artifact, scope-boundary, and related-reading contracts for 17 indexable articles.',
  },
  {
    label: 'Authority asset JSON',
    href: '/research/authority-assets.json',
    description: 'Reference index of public pages, anchor suggestions, audiences, and limits.',
  },
  {
    label: 'Crawler policy sources',
    href: '/research/ai-search-crawler-policy-sources.csv',
    description: 'Source table for crawler policy, robots, IndexNow, DR, and visibility-limit claims.',
  },
  {
    label: 'Austin crawlability benchmark pilot',
    href: '/research/austin-crawlability-benchmark-pilot.csv',
    description: 'Bounded public homepage, robots.txt, and sitemap signal sample for Austin-area sites.',
  },
  {
    label: 'Austin crawlability benchmark summary',
    href: '/research/austin-crawlability-benchmark-summary.json',
    description: 'Aggregate counts, methodology, and limits for the Austin benchmark pilot.',
  },
  {
    label: 'Atlas open-corpus demonstration CSV',
    href: '/research/atlas-open-corpus-run-2026-07-16.csv',
    description: 'Dated open-corpus URL-level capture with raw/render and confidence fields.',
  },
  {
    label: 'Appian educational research memo',
    href: '/research/appian-enterprise-software-durability-memo.pdf',
    description: 'Markets research sample with educational-use boundaries.',
  },
  {
    label: 'Appian assumptions table',
    href: '/research/appian-assumptions-table.csv',
    description: 'CSV assumptions table that supports the markets research memo.',
  },
  {
    label: 'Waymo hardware financing report',
    href: '/research/waymo-hardware-financing-report.pdf',
    description: 'Full source-led report with financing archetypes, methodology, appendices, and selected source register.',
  },
  {
    label: 'Waymo hardware financing model',
    href: '/research/waymo-hardware-financing-model.xlsx',
    description: 'Twenty-one-sheet scenario model covering funding, asset capital, utilization, debt service, residual value, and downside.',
  },
];
