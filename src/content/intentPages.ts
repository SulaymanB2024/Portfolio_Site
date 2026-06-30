export type IntentPageTone = 'light' | 'dark';

export interface IntentPageContent {
  path: string;
  parent: 'atlas' | 'method' | 'markets';
  tone: IntentPageTone;
  label: string;
  title: string;
  deck: string;
  summary: string;
  proofLine: string;
  checks: string[];
  evidenceRows: Array<{
    item: string;
    evidence: string;
    action: string;
  }>;
  sections: Array<{
    title: string;
    copy: string;
    bullets: string[];
  }>;
  deliverables: string[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export const INTENT_PAGES: IntentPageContent[] = [
  {
    path: '/atlas/technical-seo-audit-console',
    parent: 'atlas',
    tone: 'light',
    label: 'Atlas Console',
    title: 'Technical SEO Audit Console',
    deck:
      'A crawl-based console for indexation, internal links, canonicals, schema, crawler access, and search evidence.',
    summary:
      'Atlas is built for audits that need source records, not generic scores. The console keeps URL-level crawl data, groups problems by template and path, then turns the evidence into exportable fix work.',
    proofLine:
      'Best fit for teams that need a technical audit interface, a reusable crawl record, and a prioritized issue backlog.',
    checks: [
      'Crawlable and indexable URL inventory',
      'Canonical, robots, noindex, redirect, and status-code checks',
      'Internal-link depth, inlink counts, and orphan-risk review',
      'Structured data, entity references, and visible source text',
      'Exportable evidence tables for engineering and content work',
    ],
    evidenceRows: [
      {
        item: 'URL coverage',
        evidence: 'Status code, canonical target, robots directive, noindex state, and crawl depth.',
        action: 'Separate indexable pages from blocked, duplicated, redirected, or weak paths.',
      },
      {
        item: 'Link graph',
        evidence: 'Inlinks, outlinks, anchor patterns, template links, and path depth.',
        action: 'Find orphan candidates, overburied pages, and links that fail to support priority URLs.',
      },
      {
        item: 'Search evidence',
        evidence: 'Export notes, source observations, screenshots, and issue severity.',
        action: 'Give teams the affected URLs and fix order instead of a presentation-only audit.',
      },
    ],
    sections: [
      {
        title: 'What the console answers',
        copy:
          'A useful technical SEO console answers whether the site can be crawled, whether important pages can be indexed, how link equity moves, and which findings are backed by observable records.',
        bullets: ['Which URLs are valuable enough to keep indexable', 'Which templates create crawl waste', 'Which fixes need engineering vs. content ownership'],
      },
      {
        title: 'How Atlas records proof',
        copy:
          'Findings are tied to crawl rows, directives, headers, rendered/source differences, link counts, and structured-data observations. That keeps recommendations bounded by what the crawl actually saw.',
        bullets: ['Affected URL lists', 'Evidence notes and confidence', 'Owner-ready issue summaries'],
      },
    ],
    deliverables: ['Audit console walkthrough', 'Sanitized crawl sample', 'Priority issue list', 'Implementation notes'],
    primaryCta: { label: 'View Atlas', href: '/atlas' },
    secondaryCta: { label: 'Discuss an audit', href: '/#contact' },
  },
  {
    path: '/method/technical-seo-audit',
    parent: 'method',
    tone: 'dark',
    label: 'Method',
    title: 'Technical SEO Audit',
    deck:
      'A technical SEO audit for crawl paths, indexation, canonicals, internal links, schema, page templates, and performance inputs.',
    summary:
      'This audit starts with the crawl and ends with a fix order. Each finding is mapped to the pages affected, the evidence observed, why it matters, and the likely implementation owner.',
    proofLine:
      'Built for site owners who need a searchable audit they can hand to engineering, content, or growth teams.',
    checks: [
      'Crawlability, robots rules, sitemaps, and status codes',
      'Indexability, canonicals, duplicate paths, and redirects',
      'Metadata, headings, schema, page templates, and source text',
      'Internal links, crawl depth, orphan candidates, and anchor patterns',
      'Performance inputs, analytics paths, and conversion-critical pages',
    ],
    evidenceRows: [
      {
        item: 'Crawl access',
        evidence: 'Robots.txt, sitemap paths, HTTP status, redirects, and fetchability.',
        action: 'Fix blocked or unstable paths before rewriting content.',
      },
      {
        item: 'Indexation',
        evidence: 'Canonical tags, noindex directives, duplicate pages, and template clusters.',
        action: 'Consolidate weak or conflicting URLs into a cleaner indexable set.',
      },
      {
        item: 'Priority',
        evidence: 'Severity, affected URL count, revenue/search relevance, and effort estimate.',
        action: 'Rank fixes so the first work shipped is the work most likely to matter.',
      },
    ],
    sections: [
      {
        title: 'What the audit includes',
        copy:
          'The audit reviews the technical surfaces that determine whether search engines and crawlers can discover, interpret, and trust the important pages on the site.',
        bullets: ['URL inventory and template groups', 'Indexation and canonical logic', 'Structured data and entity clarity'],
      },
      {
        title: 'What makes it useful',
        copy:
          'The output is not a vague health score. It is a prioritized implementation map with affected URLs, evidence, owner notes, and validation steps.',
        bullets: ['Engineering-ready issues', 'Content and architecture recommendations', 'Follow-up measurement plan'],
      },
    ],
    deliverables: ['Crawl export', 'Issue backlog', 'Page-group notes', 'Fix order', 'Validation checklist'],
    primaryCta: { label: 'View method', href: '/method' },
    secondaryCta: { label: 'Start an audit', href: '/#contact' },
  },
  {
    path: '/method/ai-crawler-access-audit',
    parent: 'method',
    tone: 'dark',
    label: 'Crawler Access',
    title: 'AI Crawler Access Audit',
    deck:
      'A crawler-access review for robots rules, source text, entity pages, schema, canonical URLs, and pages that answer systems need to parse.',
    summary:
      'The audit checks whether important business facts are available to crawlers in source HTML, internal links, structured data, and stable URLs. It does not claim AI visibility; it documents access and parseability.',
    proofLine:
      'Useful for founders, agencies, and companies that need crawler-facing evidence before making AI-search claims.',
    checks: [
      'Robots rules for Googlebot, Bingbot, and major AI crawler user agents',
      'Source HTML availability for brand, product, service, founder, and proof pages',
      'Structured data nodes, linked @id references, and visible-claim alignment',
      'Canonical and redirect behavior for entity-supporting pages',
      'Internal links to profile, proof, service, research, and contact pages',
    ],
    evidenceRows: [
      {
        item: 'Access policy',
        evidence: 'Robots.txt directives and fetch behavior by crawler category.',
        action: 'Clarify which crawlers can access which high-value pages.',
      },
      {
        item: 'Entity support',
        evidence: 'Person, Organization, WebSite, Service, Article, and breadcrumb schema.',
        action: 'Link schema nodes to visible profile, proof, service, and source pages.',
      },
      {
        item: 'Parseable proof',
        evidence: 'Server-rendered text, headings, links, source records, and citations.',
        action: 'Move important claims from decorative UI into crawlable page content.',
      },
    ],
    sections: [
      {
        title: 'What this audit proves',
        copy:
          'It proves what the site exposes: which pages are reachable, which facts appear in source text, which schema nodes are linked, and where access is blocked or ambiguous.',
        bullets: ['Crawler access matrix', 'Entity graph review', 'Source-text gap list'],
      },
      {
        title: 'What it does not prove',
        copy:
          'Crawler access is not the same as ranking, citation, or AI answer inclusion. The audit keeps claims limited to observed access, source clarity, and page evidence.',
        bullets: ['No AI visibility score', 'No ranking prediction', 'No answer-engine guarantee'],
      },
    ],
    deliverables: ['Crawler policy review', 'Entity-page map', 'Schema notes', 'Access blockers', 'Source-text fixes'],
    primaryCta: { label: 'View method', href: '/method' },
    secondaryCta: { label: 'Contact', href: '/#contact' },
  },
  {
    path: '/method/indexation-audit',
    parent: 'method',
    tone: 'dark',
    label: 'Indexation',
    title: 'Indexation Audit',
    deck:
      'An indexation audit for sitemap coverage, noindex directives, canonicals, redirects, duplicate templates, and pages that deserve search entry.',
    summary:
      'The audit separates pages that should rank from pages that should consolidate, redirect, noindex, or remain out of the sitemap until they are strong enough.',
    proofLine:
      'Best for sites with old URLs, stale PDFs, duplicated templates, thin pages, or Search Console coverage noise.',
    checks: [
      'Canonical URLs, aliases, redirects, and stale files',
      'Noindex, robots-blocked, redirect, soft-404, and duplicate states',
      'Sitemap eligibility and crawlable destination checks',
      'Page quality by template, search intent, and evidence depth',
      'Validation steps for Search Console after changes ship',
    ],
    evidenceRows: [
      {
        item: 'Indexable set',
        evidence: 'Canonical path, sitemap inclusion, noindex state, and page purpose.',
        action: 'Keep only real search-entry pages in the sitemap.',
      },
      {
        item: 'Old URL cleanup',
        evidence: 'Aliases, stale files, outdated PDFs, and duplicate route patterns.',
        action: 'Redirect legacy demand to current canonical pages.',
      },
      {
        item: 'Thin pages',
        evidence: 'Word count, proof depth, source links, tables, charts, and assumptions.',
        action: 'Expand the page or noindex it until it deserves indexation.',
      },
    ],
    sections: [
      {
        title: 'When indexation is the problem',
        copy:
          'Indexation work matters when Google sees old routes, thin URLs, stale assets, duplicate pages, or a sitemap full of pages that do not deserve to be search destinations.',
        bullets: ['Search Console URL cleanup', 'Sitemap pruning', 'Redirect and canonical fixes'],
      },
      {
        title: 'The desired end state',
        copy:
          'Every indexable URL should have a clear purpose, a canonical address, enough content to satisfy the search intent, and an internal-link path that proves it belongs.',
        bullets: ['One canonical page per intent', 'No stale PDF as primary result', 'Clear profile and service pages'],
      },
    ],
    deliverables: ['Indexation map', 'Redirect list', 'Sitemap changes', 'Noindex list', 'Validation notes'],
    primaryCta: { label: 'View method', href: '/method' },
    secondaryCta: { label: 'Discuss URL cleanup', href: '/#contact' },
  },
  {
    path: '/method/internal-link-audit',
    parent: 'method',
    tone: 'dark',
    label: 'Internal Links',
    title: 'Internal Link Audit',
    deck:
      'An internal-link audit for crawl depth, inlinks, anchor text, orphan candidates, navigational templates, and pages that need stronger paths.',
    summary:
      'The audit maps how authority and discovery move through the site. It finds pages that are buried, orphaned, overlinked from weak templates, or missing anchor context.',
    proofLine:
      'Useful when important service, research, product, or profile pages exist but crawlers and visitors do not get clear paths to them.',
    checks: [
      'Crawl depth and inlink counts for priority pages',
      'Navigation, footer, sidebar, card, and body-link templates',
      'Anchor text patterns and weak generic labels',
      'Orphan candidates from sitemap and discovered URL comparisons',
      'Link opportunities between service, proof, research, and contact pages',
    ],
    evidenceRows: [
      {
        item: 'Depth',
        evidence: 'Minimum click depth from home and section hubs.',
        action: 'Move priority URLs closer to crawl and user paths.',
      },
      {
        item: 'Context',
        evidence: 'Anchor text, surrounding copy, and page relationship.',
        action: 'Replace generic links with labels that describe the target intent.',
      },
      {
        item: 'Coverage',
        evidence: 'Sitemap URLs with low or zero incoming internal links.',
        action: 'Add hub, body, or proof links where pages need support.',
      },
    ],
    sections: [
      {
        title: 'What internal links should do',
        copy:
          'Internal links should make the site legible. They help crawlers discover priority URLs, help visitors move to the next useful page, and show which content supports which service or research theme.',
        bullets: ['Priority URL pathing', 'Search-intent hubs', 'Entity and proof support'],
      },
      {
        title: 'How the audit becomes action',
        copy:
          'The output is a list of pages that need links, pages that should link out, and anchor text that clarifies the relationship without stuffing keywords.',
        bullets: ['Add links from hubs', 'Repair orphan candidates', 'Improve anchor clarity'],
      },
    ],
    deliverables: ['Link graph summary', 'Orphan candidates', 'Anchor recommendations', 'Hub-page links', 'Validation crawl'],
    primaryCta: { label: 'View method', href: '/method' },
    secondaryCta: { label: 'Contact', href: '/#contact' },
  },
  {
    path: '/markets/valuation-research',
    parent: 'markets',
    tone: 'dark',
    label: 'Valuation Research',
    title: 'Valuation Research',
    deck:
      'Valuation research built from filings, scenario assumptions, peer checks, downside cases, and source-backed operating questions.',
    summary:
      'This page is the stronger search destination for valuation work. Individual market notes stay out of the sitemap until they have enough source depth, tables, assumptions, and charts to stand alone.',
    proofLine:
      'Published sample: Appian valuation memo and companion assumptions table. Educational research only, not investment advice.',
    checks: [
      'Filing and source review before model framing',
      'Revenue durability, retention, margin, and reinvestment assumptions',
      'Peer multiple sanity checks and downside scenarios',
      'Assumptions table that can be challenged or replaced',
      'Clear distinction between thesis, evidence, and open questions',
    ],
    evidenceRows: [
      {
        item: 'Assumptions',
        evidence: 'Scenario variables, source notes, and sensitivity ranges.',
        action: 'Make the model inspectable before drawing conclusions.',
      },
      {
        item: 'Peer check',
        evidence: 'Comparable companies, multiple ranges, and margin context.',
        action: 'Avoid single-point valuation claims without a reference set.',
      },
      {
        item: 'Risk case',
        evidence: 'Downside drivers, timing uncertainty, and broken-thesis triggers.',
        action: 'Separate attractive stories from assumptions that still need proof.',
      },
    ],
    sections: [
      {
        title: 'What belongs in a complete valuation page',
        copy:
          'A valuation page should show the source base, key assumptions, calculation logic, sensitivity ranges, and what would invalidate the thesis.',
        bullets: ['Source list and date', 'Assumptions table', 'Scenario ranges and downside case'],
      },
      {
        title: 'Current artifact status',
        copy:
          'The Appian memo is the current proof artifact. The lighter market notes remain accessible and indexed, but their status and TODO/source-needed fields make the evidence gaps explicit.',
        bullets: ['PDF memo available', 'CSV assumptions table available', 'Short thesis notes labeled by status and depth'],
      },
    ],
    deliverables: ['Valuation memo', 'Assumptions table', 'Scenario notes', 'Source checklist', 'Risk-case summary'],
    primaryCta: { label: 'View markets', href: '/markets' },
    secondaryCta: { label: 'Download memo', href: '/research/appian-enterprise-software-durability-memo.pdf' },
  },
  {
    path: '/markets/crypto-market-structure',
    parent: 'markets',
    tone: 'dark',
    label: 'Crypto Structure',
    title: 'Crypto Market Structure Research',
    deck:
      'Crypto market structure research for token incentives, liquidity routing, protocol fees, emissions, governance, and on-chain demand.',
    summary:
      'This page frames crypto research as a market-structure workflow rather than a set of thin thesis cards. It focuses on variables that can be checked against data, protocol docs, and on-chain records.',
    proofLine:
      'Built for research notes that need assumptions, mechanisms, failure cases, and visible evidence status.',
    checks: [
      'Token supply, emissions, unlocks, and incentive spend',
      'Protocol fees, real users, liquidity depth, and routing quality',
      'Governance design, concentration, custody, and smart-contract risk',
      'On-chain data sources and assumptions that need verification',
      'Bull case, bear case, and variables that would change the view',
    ],
    evidenceRows: [
      {
        item: 'Incentives',
        evidence: 'Emission schedule, reward decay, vote incentives, and fee capture.',
        action: 'Check whether demand survives after subsidy pressure changes.',
      },
      {
        item: 'Liquidity',
        evidence: 'TVL, depth, volume quality, slippage, and concentration.',
        action: 'Separate headline size from usable market structure.',
      },
      {
        item: 'Risk',
        evidence: 'Governance, smart-contract, custody, oracle, and regulatory exposure.',
        action: 'Keep protocol theses bounded by failure modes and data limits.',
      },
    ],
    sections: [
      {
        title: 'What a complete crypto research page needs',
        copy:
          'A complete page should define the mechanism, show the assumptions, list source data, and explain what breaks the thesis if incentives or liquidity change.',
        bullets: ['Mechanism map', 'Data-source list', 'Incentive and liquidity table'],
      },
      {
        title: 'How current notes are handled',
        copy:
          'Short protocol notes stay as reader-facing previews until they have evidence tables, charts, assumptions, and source links strong enough for sitemap inclusion.',
        bullets: ['Preview notes remain accessible', 'No sitemap listing for thin notes', 'Expansion path is explicit'],
      },
    ],
    deliverables: ['Mechanism map', 'Assumptions table', 'Source checklist', 'Risk matrix', 'Expansion outline'],
    primaryCta: { label: 'View markets', href: '/markets' },
    secondaryCta: { label: 'Contact', href: '/#contact' },
  },
];

export function getIntentPageByPath(path: string) {
  return INTENT_PAGES.find((page) => page.path === path);
}
