export type EvidenceListItem = {
  category?: string;
  label: string;
  href: string;
  proves: string;
};

export const atlasCheckItems: EvidenceListItem[] = [
  { label: 'URL discovery', href: '/atlas', proves: 'Atlas starts from discovered URLs and crawl records, not only manual page samples.' },
  { label: 'robots.txt', href: '/method', proves: 'Robots directives are part of the audit evidence used to understand crawler access.' },
  { label: 'XML sitemaps', href: '/method', proves: 'Sitemaps are checked as route and freshness signals rather than assumed to be complete.' },
  { label: 'raw HTML', href: '/atlas/sample-crawl', proves: 'The public demonstration keeps source capture separate from rendered-page observations.' },
  { label: 'rendered HTML', href: '/atlas/sample-crawl', proves: 'Rendered checks show when browser-visible page content differs from the initial source response.' },
  { label: 'titles/meta', href: '/method', proves: 'Document titles and meta descriptions are treated as inspectable page-level evidence.' },
  { label: 'canonicals', href: '/method', proves: 'Canonical URLs are checked for duplicate-path, consolidation, and indexation clarity.' },
  { label: 'structured data', href: '/about', proves: 'JSON-LD and visible page text are aligned so entity claims are structured and readable.' },
  { label: 'internal links', href: '/atlas', proves: 'Internal link evidence supports crawl-depth, orphan-risk, and page-relationship analysis.' },
  { label: 'scoring', href: '/atlas', proves: 'Findings are prioritized by severity, confidence, affected URLs, effort, and evidence quality.' },
  { label: 'SQLite persistence', href: '/atlas', proves: 'Crawl records can be persisted for repeatable review instead of treated as one-off notes.' },
  { label: 'exports/dashboards', href: '/atlas', proves: 'Audit outputs are structured for operators and client-facing review, with evidence attached to recommendations.' },
];

export const aiSearchAuditChecklist: EvidenceListItem[] = [
  { label: 'crawlability', href: '/method', proves: 'Search systems need access to public pages before they can interpret them.' },
  { label: 'indexability', href: '/method', proves: 'Indexation directives, canonicals, and response behavior are checked before content recommendations.' },
  { label: 'internal links', href: '/atlas', proves: 'Internal links show which pages the site itself treats as important and reachable.' },
  { label: 'structured data', href: '/about', proves: 'Schema helps connect entities, pages, projects, and source claims when it matches visible text.' },
  { label: 'source-page clarity', href: '/about', proves: 'Clear source pages make identity, projects, services, and support links easy to verify.' },
  { label: 'entity consistency', href: '/about', proves: 'Consistent names and descriptions reduce confusion between Sulayman Bowles, Atlas, Void Agency, and related sources.' },
  { label: 'public work', href: '/resume', proves: 'Public work such as GitHub, LinkedIn, project pages, resume entries, and research pages supports claims without inventing private outcomes.' },
  { label: 'sitemap freshness', href: '/method', proves: 'Fresh sitemap lastmod values help crawlers find current canonical pages and avoid stale route assumptions.' },
];
