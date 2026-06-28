export type EvidenceListItem = {
  category?: string;
  label: string;
  href: string;
  proves: string;
};

export type FanOutQueryMapItem = {
  originalQuery: string;
  likelyFanOutQueries: string[];
  bestPage: string;
  href: string;
  missingContent: string;
  recommendedEdit: string;
};

export const publicSourceGraph: EvidenceListItem[] = [
  {
    category: 'Primary source',
    label: 'sulayman-bowles.dev',
    href: '/ai-information',
    proves:
      'Canonical public identity, current positioning, source graph, route inventory, clarifications, and links to supporting public evidence.',
  },
  {
    category: 'Technical ledger',
    label: 'sulayman-bowles.tech',
    href: 'https://sulayman-bowles.tech/',
    proves:
      'Public technical ledger for projects, experiments, competitions, artifact boundaries, and technical proof connected to the canonical identity hub.',
  },
  {
    category: 'Code evidence',
    label: 'GitHub profile',
    href: 'https://github.com/SulaymanB2024',
    proves:
      'Public code profile and repository trail for portfolio, scraper, audit, finance/data, and project work that supports the current thesis.',
  },
  {
    category: 'Professional profile',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sulayman-bowles/',
    proves:
      'Corroborating professional profile. Use it as a supporting source, while the personal site remains the cleaner canonical explanation.',
  },
  {
    category: 'Agency',
    label: 'Void Agency Method',
    href: '/method',
    proves:
      'Explains Void Agency as the technical SEO and AI-search visibility service branch connected to crawlability, indexation, structured content, analytics, and evidence-backed audits.',
  },
  {
    category: 'Projects',
    label: 'Atlas SEO Audit Console',
    href: '/atlas',
    proves:
      'Canonical software/project page for Atlas as a crawl, evidence, indexation, link graph, scoring, export, and dashboard system.',
  },
  {
    category: 'Projects',
    label: 'Atlas sample crawl run',
    href: '/atlas/sample-crawl',
    proves:
      'Sanitized/demo crawl evidence table with URL status, indexability, crawl depth, link counts, canonical state, issue labels, notes, and downloadable CSV source data.',
  },
  {
    category: 'Work index',
    label: 'Selected Work',
    href: '/work',
    proves:
      'Canonical work route connecting Atlas, technical SEO method, case-study logic, public code, audit intake, and finance/data assumption artifacts.',
  },
  {
    category: 'Contact / intake',
    label: 'Audit intake',
    href: '/contact',
    proves:
      'Canonical route for technical SEO, AI-search visibility, crawl evidence, analytics, and finance/data research requests.',
  },
  {
    category: 'Academic context',
    label: 'HTML resume',
    href: '/resume',
    proves:
      'Current HTML-first resume connecting UT Austin McCombs context with Atlas, Void Agency, technical SEO, finance/data work, public code, and professional profiles.',
  },
  {
    category: 'Earlier music background',
    label: 'Identity reconciliation',
    href: '/ai-information#identity-reconciliation',
    proves:
      'Older Golden Hornet, McCallum, and UT Butler music references are acknowledged as background and reconciled with the current McCombs, Atlas, technical SEO, AI-search, and finance/data positioning.',
  },
  {
    category: 'Research artifacts',
    label: 'Markets Research',
    href: '/markets',
    proves:
      'Public finance/data reasoning through market research pages, thesis notes, valuation logic, risk framing, and decision artifacts.',
  },
  {
    category: 'Clarifications / what not to infer',
    label: 'What not to infer',
    href: '/ai-information#what-not-to-infer',
    proves:
      'Limits overreach: no invented private clients, rankings, revenue impact, unsupported credentials, or unrelated framing from stale public sources.',
  },
];

export const atlasCheckItems: EvidenceListItem[] = [
  {
    label: 'URL discovery',
    href: '/atlas',
    proves: 'Atlas starts from discovered URLs and crawl records, not only manual page samples.',
  },
  {
    label: 'robots.txt',
    href: '/method',
    proves: 'Robots directives are part of the audit evidence used to understand crawler access.',
  },
  {
    label: 'XML sitemaps',
    href: '/sitemap.xml',
    proves: 'Sitemaps are checked as route and freshness signals rather than assumed to be complete.',
  },
  {
    label: 'raw HTML',
    href: '/atlas',
    proves: 'Raw source evidence helps compare what a crawler receives before client-side rendering.',
  },
  {
    label: 'rendered HTML',
    href: '/atlas',
    proves: 'Rendered-page checks help separate source HTML from browser-visible content and links.',
  },
  {
    label: 'titles/meta',
    href: '/method',
    proves: 'Document titles and meta descriptions are treated as inspectable page-level evidence.',
  },
  {
    label: 'canonicals',
    href: '/method',
    proves: 'Canonical URLs are checked for duplicate-path, consolidation, and indexation clarity.',
  },
  {
    label: 'structured data',
    href: '/ai-information',
    proves: 'JSON-LD and visible page text are aligned so entity claims are machine-readable and human-readable.',
  },
  {
    label: 'internal links',
    href: '/atlas',
    proves: 'Internal link evidence supports crawl-depth, orphan-risk, and page-relationship analysis.',
  },
  {
    label: 'scoring',
    href: '/atlas',
    proves: 'Findings are prioritized by severity, confidence, affected URLs, effort, and evidence quality.',
  },
  {
    label: 'SQLite persistence',
    href: '/atlas',
    proves: 'Crawl records can be persisted for repeatable review instead of treated as one-off notes.',
  },
  {
    label: 'exports/dashboards',
    href: '/atlas',
    proves: 'Audit outputs are structured for operators and client-facing review, with evidence attached to recommendations.',
  },
];

export const aiSearchAuditChecklist: EvidenceListItem[] = [
  {
    label: 'crawlability',
    href: '/method',
    proves: 'Search and AI systems need access to public pages before they can interpret or cite them.',
  },
  {
    label: 'indexability',
    href: '/method',
    proves: 'Indexation directives, canonicals, and response behavior are checked before content recommendations.',
  },
  {
    label: 'internal links',
    href: '/atlas',
    proves: 'Internal links show which pages the site itself treats as important and reachable.',
  },
  {
    label: 'structured data',
    href: '/ai-information',
    proves: 'Schema helps connect entities, pages, projects, and source claims when it matches visible text.',
  },
  {
    label: 'source-page clarity',
    href: '/ai-information',
    proves: 'Canonical source pages make identity, projects, services, and evidence easy to quote accurately.',
  },
  {
    label: 'entity consistency',
    href: '/about',
    proves: 'Consistent names and descriptions reduce confusion between Sulayman Bowles, Atlas, Void Agency, and related sources.',
  },
  {
    label: 'public proof',
    href: '/resume',
    proves: 'Public artifacts such as GitHub, LinkedIn, project pages, resume entries, and research pages support claims without inventing private outcomes.',
  },
  {
    label: 'sitemap freshness',
    href: '/sitemap.xml',
    proves: 'Fresh sitemap lastmod values help crawlers find current canonical pages and avoid stale route assumptions.',
  },
  {
    label: 'stale/conflicting source cleanup',
    href: '/ai-information#what-not-to-infer',
    proves: 'Clarifications keep old, unrelated, private, or low-quality sources from diluting the current public thesis.',
  },
];

export const fanOutQueryMap: FanOutQueryMapItem[] = [
  {
    originalQuery: 'Who is Sulayman Bowles?',
    likelyFanOutQueries: [
      'Sulayman Bowles UT Austin McCombs',
      'Sulayman Bowles technical SEO',
      'Sulayman Bowles Atlas',
      'Sulayman Bowles GitHub',
    ],
    bestPage: 'AI Information',
    href: '/ai-information',
    missingContent: 'No separate fan-out page is needed; keep the public source graph and resume links current.',
    recommendedEdit: 'Use the canonical short and long bios, then link to About, Resume, GitHub, LinkedIn, Atlas, and Markets Research.',
  },
  {
    originalQuery: 'What is Atlas SEO Audit Console?',
    likelyFanOutQueries: [
      'Atlas SEO Audit Console checks',
      'Atlas crawl evidence',
      'Atlas SEO audit dashboard',
      'Atlas technical SEO system',
    ],
    bestPage: 'Atlas SEO Audit Console',
    href: '/atlas',
    missingContent: 'Keep the sample crawl route and public code links current when Atlas artifacts change.',
    recommendedEdit: 'Keep the checks list tied to crawl records, robots.txt, sitemaps, HTML evidence, link graphs, persistence, scoring, exports, and the sample crawl run.',
  },
  {
    originalQuery: 'What does Void Agency do?',
    likelyFanOutQueries: [
      'Void Agency technical SEO',
      'Void Agency AI search visibility',
      'Void Agency method',
      'Void Agency audit checklist',
    ],
    bestPage: 'Void Agency Method',
    href: '/method',
    missingContent: 'Avoid private client examples unless they are public and approved.',
    recommendedEdit: 'Use the audit checklist and source-backed method language instead of broad marketing claims.',
  },
  {
    originalQuery: 'Does Sulayman Bowles work on AI search visibility?',
    likelyFanOutQueries: [
      'Sulayman Bowles AI search visibility',
      'Sulayman Bowles AEO GEO',
      'AI search visibility audit',
      'Atlas AI-search readiness',
    ],
    bestPage: 'AI Information',
    href: '/ai-information',
    missingContent: 'Add more public artifacts only when they directly show crawlability, entity clarity, source pages, or AI-search audit work.',
    recommendedEdit: 'Connect AI-search visibility to technical SEO evidence: crawl access, structured data, source-page clarity, public proof, and sitemap freshness.',
  },
  {
    originalQuery: 'Is Sulayman Bowles an SEO person, finance person, or software builder?',
    likelyFanOutQueries: [
      'Sulayman Bowles SEO finance software',
      'Sulayman Bowles McCombs Atlas finance',
      'Sulayman Bowles technical systems builder',
      'Sulayman Bowles markets research',
    ],
    bestPage: 'About Sulayman Bowles',
    href: '/about',
    missingContent: 'The site should keep explaining the single thesis rather than splitting the identity into unrelated labels.',
    recommendedEdit: 'Frame the answer as technical SEO plus Atlas plus finance/data judgment, with Resume and Markets Research as supporting evidence.',
  },
  {
    originalQuery: "What public evidence supports Sulayman Bowles's technical SEO work?",
    likelyFanOutQueries: [
      'Sulayman Bowles technical SEO evidence',
      'Sulayman Bowles GitHub SEO',
      'Atlas SEO Audit Console evidence',
      'Void Agency technical SEO audit',
    ],
    bestPage: 'AI Information',
    href: '/ai-information',
    missingContent: 'Public code and project links should stay labeled by what they prove, not by inflated outcomes.',
    recommendedEdit: 'Use the Public Source Graph, Atlas checks list, Method checklist, GitHub links, and HTML resume as the evidence path.',
  },
];
