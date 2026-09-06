export const SEO_PORTFOLIO_ROUTE_VERSION = 'SeoPortfolioRouteV1' as const;

export const SEO_PORTFOLIO_DOMAINS = [
  'sulayman-bowles.dev',
  'www.void-agency.com',
  'sulayman-bowles.tech',
] as const;

export type SeoPortfolioDomain = typeof SEO_PORTFOLIO_DOMAINS[number];
export type SeoPortfolioLifecycle = 'protect' | 'refresh' | 'merge' | 'noindex';

export interface SeoPortfolioRouteV1 {
  schemaVersion: typeof SEO_PORTFOLIO_ROUTE_VERSION;
  domain: SeoPortfolioDomain;
  path: string;
  intentCluster: string;
  audience: string;
  ownerDomain: SeoPortfolioDomain;
  lifecycle: SeoPortfolioLifecycle;
  canonical: string;
  redirectTarget: string | null;
  publishedAt: string;
  lastMeaningfulUpdate: string;
}

export interface SeoPortfolioRouteInput {
  path: string;
  section: string;
  noindex?: boolean;
  publishedAt: string;
  lastMeaningfulUpdate: string;
}

export const SEO_PORTFOLIO_DOMAIN_ROLES = Object.freeze({
  'sulayman-bowles.dev': 'Canonical identity, original research, datasets, markets, and authored evidence.',
  'www.void-agency.com': 'Commercial technical SEO, AI search, measurement, vertical services, definitions, and audit utilities.',
  'sulayman-bowles.tech': 'Engineering projects, Atlas implementation, visual systems, competitions, datasets, and technical experiments.',
} satisfies Record<SeoPortfolioDomain, string>);

export const PROGRAMMATIC_ROUTE_EXPANSION = Object.freeze({
  frozen: true,
  reason: 'Every July 2026 commodity technical-SEO route has an explicit VOID owner and migration decision.',
  admittedLeafCount: 36,
  admittedHubCount: 4,
  changedAt: '2026-09-03',
});

const DEV_ORIGIN = 'https://sulayman-bowles.dev';
const VOID_ORIGIN = 'https://www.void-agency.com';

const VOID_INSIGHT_BY_ISSUE = Object.freeze({
  'missing-canonical': 'choose-a-canonical-url-representative',
  'multiple-canonical-tags': 'choose-a-canonical-url-representative',
  'canonical-to-redirect': 'choose-a-canonical-url-representative',
  'canonical-noindex-conflict': 'choose-a-canonical-url-representative',
  'redirect-chain': 'redirect-chain-and-loop-qa',
  'redirect-loop': 'redirect-chain-and-loop-qa',
  'soft-404': 'client-side-soft-404-detection',
  'robots-blocked-indexable-url': 'crawlability-audit-before-indexing-diagnosis',
  'noindex-in-sitemap': 'xml-sitemap-canonical-consistency-audit',
  'sitemap-redirects': 'xml-sitemap-canonical-consistency-audit',
  'orphan-page': 'orphan-url-discovery-and-disposition',
  'excessive-crawl-depth': 'internal-link-evidence-report',
  'broken-internal-link': 'crawlable-internal-links-in-react',
  'javascript-only-link': 'crawlable-internal-links-in-react',
  'raw-rendered-content-mismatch': 'raw-html-rendered-dom-parity-audit',
  'structured-data-content-drift': 'structured-data-drift-audit',
  'duplicate-title-tag': 'hydrated-head-metadata-parity',
  'duplicate-meta-description': 'hydrated-head-metadata-parity',
  'faceted-navigation-crawl-trap': 'faceted-navigation-indexing-policy',
  'parameter-url-duplication': 'parameter-url-duplication-control',
  'pagination-infinite-scroll-indexing': 'pagination-and-infinite-scroll-search-paths',
  'hreflang-return-tag-error': 'technical-audits',
  'mobile-desktop-content-mismatch': 'raw-html-rendered-dom-parity-audit',
  'lazy-loaded-primary-content': 'lazy-loaded-primary-content-release-check',
} satisfies Record<string, string>);

export function getPortfolioRedirectTarget(path: string): string | null {
  if (path === '/method') return `${VOID_ORIGIN}/tools/technical-seo-audit-checklist`;
  if (path === '/austin-technical-seo') return `${VOID_ORIGIN}/services/technical-seo-ai-search-visibility`;
  if (path === '/research/technical-seo') return `${VOID_ORIGIN}/insights/technical-audits`;
  if (path === '/research/technical-seo/issues') return `${VOID_ORIGIN}/insights/technical-audits`;
  if (path === '/research/technical-seo/platforms') return `${VOID_ORIGIN}/insights/technical-audits`;
  if (path === '/research/technical-seo/checklists') return `${VOID_ORIGIN}/tools/technical-seo-audit-checklist`;

  const issuePrefix = '/research/technical-seo/issues/';
  if (path.startsWith(issuePrefix)) {
    const slug = path.slice(issuePrefix.length);
    const destination = VOID_INSIGHT_BY_ISSUE[slug as keyof typeof VOID_INSIGHT_BY_ISSUE];
    return destination
      ? `${VOID_ORIGIN}/insights/${destination}`
      : `${VOID_ORIGIN}/insights/technical-audits`;
  }

  if (path.startsWith('/research/technical-seo/platforms/')) {
    return `${VOID_ORIGIN}/insights/technical-audits`;
  }

  if (path.startsWith('/research/technical-seo/checklists/')) {
    return `${VOID_ORIGIN}/tools/technical-seo-audit-checklist`;
  }

  return null;
}

export function createDevSeoPortfolioRoute(input: SeoPortfolioRouteInput): SeoPortfolioRouteV1 {
  const redirectTarget = getPortfolioRedirectTarget(input.path);
  const lifecycle = getLifecycle(input.path, input.noindex === true, redirectTarget);
  const ownerDomain: SeoPortfolioDomain = redirectTarget
    ? 'www.void-agency.com'
    : 'sulayman-bowles.dev';

  return Object.freeze({
    schemaVersion: SEO_PORTFOLIO_ROUTE_VERSION,
    domain: 'sulayman-bowles.dev',
    path: input.path,
    intentCluster: getIntentCluster(input.path, redirectTarget),
    audience: getAudience(input.path, input.section),
    ownerDomain,
    lifecycle,
    canonical: redirectTarget ?? `${DEV_ORIGIN}${input.path === '/' ? '/' : input.path}`,
    redirectTarget,
    publishedAt: input.publishedAt,
    lastMeaningfulUpdate: input.lastMeaningfulUpdate,
  });
}

export function isIndexableSeoPortfolioRoute(route: SeoPortfolioRouteV1): boolean {
  return route.redirectTarget === null
    && route.ownerDomain === route.domain
    && (route.lifecycle === 'protect' || route.lifecycle === 'refresh');
}

export function robotsForSeoPortfolioRoute(route: SeoPortfolioRouteV1): string {
  return isIndexableSeoPortfolioRoute(route)
    ? 'index,follow'
    : 'noindex,follow';
}

export function validateSeoPortfolioRoutes(routes: readonly SeoPortfolioRouteV1[]): void {
  const paths = new Set<string>();
  const indexableIntentOwners = new Map<string, string>();

  for (const route of routes) {
    for (const field of [
      'schemaVersion',
      'domain',
      'path',
      'intentCluster',
      'audience',
      'ownerDomain',
      'lifecycle',
      'canonical',
      'publishedAt',
      'lastMeaningfulUpdate',
    ] as const) {
      if (!route[field]) throw new Error(`${route.path || 'unknown route'}: missing ${field}.`);
    }

    if (route.schemaVersion !== SEO_PORTFOLIO_ROUTE_VERSION) {
      throw new Error(`${route.path}: unsupported SEO portfolio route version.`);
    }
    if (!route.path.startsWith('/') || (route.path.length > 1 && route.path.endsWith('/'))) {
      throw new Error(`${route.path}: path must be canonical and must not have a trailing slash.`);
    }
    if (paths.has(route.path)) throw new Error(`${route.path}: duplicate route decision.`);
    paths.add(route.path);

    const canonical = new URL(route.canonical);
    if (canonical.protocol !== 'https:') throw new Error(`${route.path}: canonical must use HTTPS.`);
    if (route.lifecycle === 'merge' && route.redirectTarget !== route.canonical) {
      throw new Error(`${route.path}: merged route must canonicalize to its redirect target.`);
    }
    if (route.lifecycle !== 'merge' && route.redirectTarget !== null) {
      throw new Error(`${route.path}: only merged routes may define a redirect target.`);
    }

    if (isIndexableSeoPortfolioRoute(route)) {
      const priorOwner = indexableIntentOwners.get(route.intentCluster);
      if (priorOwner) {
        throw new Error(`${route.path}: intent cluster ${route.intentCluster} already belongs to ${priorOwner}.`);
      }
      indexableIntentOwners.set(route.intentCluster, `${route.domain}${route.path}`);
    }
  }
}

function getLifecycle(path: string, noindex: boolean, redirectTarget: string | null): SeoPortfolioLifecycle {
  if (redirectTarget) return 'merge';
  if (noindex || path === '/sitemap') return 'noindex';
  if (
    path === '/research'
    || path === '/markets'
    || path === '/markets/who-owns-texas-toll-roads'
    || path === '/research/ai-crawlers/ai-search-crawler-policy'
  ) return 'refresh';
  return 'protect';
}

function getIntentCluster(path: string, redirectTarget: string | null): string {
  if (redirectTarget) return `void:${new URL(redirectTarget).pathname}`;
  if (path === '/') return 'sulayman-bowles-canonical-identity';
  if (path === '/markets/who-owns-texas-toll-roads') return 'texas-toll-road-ownership-dataset';
  if (path === '/research/ai-crawlers/ai-search-crawler-policy') return 'ai-crawler-policy-evidence';
  return `dev:${path.slice(1).replaceAll('/', ':') || 'home'}`;
}

function getAudience(path: string, section: string): string {
  if (path === '/markets/who-owns-texas-toll-roads') return 'Texas transportation, public-finance, and infrastructure researchers';
  if (path === '/research/ai-crawlers/ai-search-crawler-policy') return 'Web operators choosing crawler access policies';
  if (path === '/sitemap') return 'Readers navigating the authored public archive';
  if (path.startsWith('/markets') || section === 'research-article') return 'Researchers, analysts, and technical practitioners';
  if (section === 'profile' || path === '/about' || path === '/resume') return 'Recruiters, collaborators, and profile researchers';
  if (section === 'project') return 'Technical collaborators and evaluators';
  return 'Readers evaluating Sulayman Bowles and his authored work';
}
