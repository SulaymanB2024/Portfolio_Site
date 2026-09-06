import {
  ATLAS_SOFTWARE_ID,
  PERSON_ID,
  SITE_NAME,
  SITE_URL,
  VOID_AGENCY_ID,
  WEBSITE_ID,
  absoluteUrl,
} from './site';

type JsonLd = Record<string, unknown>;

export interface AuthorityRouteContract {
  path: string;
  aliases: string[];
  title: string;
  description: string;
  h1: string;
  pageType: 'website' | 'profile' | 'project' | 'service' | 'research' | 'article';
  priority: number;
  includeInSitemap: boolean;
  generateStatic?: boolean;
  noindex?: boolean;
  redirectTarget?: string | null;
  portfolioRoute?: {
    lifecycle: string;
    redirectTarget: string | null;
  };
  lastmod?: string;
  staticSummary: string;
  jsonLd?: JsonLd;
}

export const CRAWLER_POLICY_REVIEWED = '2026-07-30';

export const CRAWLER_POLICY_GROUPS = [
  {
    label: 'Default public-web policy',
    purpose: 'Public discovery',
    agents: ['*'],
    robotsExpectation: 'applies',
  },
  {
    label: 'Conventional search crawlers',
    purpose: 'Search discovery',
    agents: ['Googlebot', 'Bingbot', 'DuckDuckBot'],
    robotsExpectation: 'applies',
  },
  {
    label: 'AI answer-search crawlers',
    purpose: 'Automated answer-search discovery',
    agents: ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'],
    robotsExpectation: 'provider-documented',
  },
  {
    label: 'User-triggered retrieval agents',
    purpose: 'Retrieval initiated by a user',
    agents: ['ChatGPT-User', 'Claude-User', 'Perplexity-User'],
    robotsExpectation: 'provider-dependent',
  },
  {
    label: 'Model-development crawlers',
    purpose: 'Potential model-development collection',
    agents: ['GPTBot', 'ClaudeBot'],
    robotsExpectation: 'provider-documented',
  },
] as const;

export const LLMS_TXT_LIMITS = [
  'This voluntary context file is not access control, a formal indexing directive, a ranking signal, or a guarantee that any system will use or cite it.',
  'Crawler allowance only expresses a public crawl preference. It does not prove a crawl, indexing, ranking, model inclusion, answer inclusion, or citation.',
  'The XML sitemap is the indexable-route inventory. Aliases and noindex pages are intentionally omitted; noindex is not a privacy or authorization boundary.',
  'Structured data identifies public entities and relationships. It does not independently prove biographical, product, client, performance, or outcome claims.',
] as const;

export const CANONICAL_ENTITY_CONTRACT = {
  person: PERSON_ID,
  website: WEBSITE_ID,
  atlasSoftware: ATLAS_SOFTWARE_ID,
  voidAgency: VOID_AGENCY_ID,
} as const;

export function buildRobotsText() {
  assertCrawlerPolicyContract();
  const groups = CRAWLER_POLICY_GROUPS.map(
    (group) => `# ${group.label}: ${group.purpose}.
${group.agents.map((agent) => `User-agent: ${agent}`).join('\n')}
Allow: /`,
  ).join('\n\n');

  return `# Public crawl policy for ${SITE_URL}.
# Intent: allow crawling of public routes. robots.txt is advisory, not access control.
# Indexability is declared in page metadata and the XML sitemap; private data requires server-side controls.
# Crawler role references reviewed: ${CRAWLER_POLICY_REVIEWED}.

${groups}

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Machine-readable authority contract failed: ${message}`);
  }
}

export function assertCrawlerPolicyContract() {
  const agents = CRAWLER_POLICY_GROUPS.flatMap((group) => [...group.agents]);
  const today = new Date().toISOString().slice(0, 10);

  assert(CRAWLER_POLICY_GROUPS.length === 5, 'crawler policy must preserve five distinct purpose groups');
  assert(CRAWLER_POLICY_GROUPS[0].agents.length === 1 && CRAWLER_POLICY_GROUPS[0].agents[0] === '*', 'wildcard crawler policy must be first');
  assert(new Set(agents).size === agents.length, 'crawler User-agent tokens must be unique');
  assert(
    agents.every((agent) => agent === '*' || /^[A-Za-z][A-Za-z0-9-]*$/.test(agent)),
    'crawler policy contains an invalid User-agent token',
  );
  assert(isIsoDate(CRAWLER_POLICY_REVIEWED), 'crawler policy review date must be ISO-8601');
  assert(CRAWLER_POLICY_REVIEWED <= today, 'crawler policy review date is in the future');
  assert(LLMS_TXT_LIMITS.length >= 4, 'llms.txt interpretation limits are incomplete');
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function asTypes(value: unknown) {
  return Array.isArray(value) ? value : [value];
}

function graphItems(value: JsonLd | undefined): JsonLd[] {
  if (!value) return [];
  const graph = value['@graph'];
  return Array.isArray(graph) ? graph as JsonLd[] : [value];
}

function exactInternalReference(value: unknown, target: string): boolean {
  if (value === target) return true;
  if (Array.isArray(value)) return value.some((item) => exactInternalReference(item, target));
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => exactInternalReference(item, target));
  }
  return false;
}

function validateSchema(route: AuthorityRouteContract) {
  const canonicalUrl = absoluteUrl(route.path);
  const schema = route.jsonLd;
  assert(schema, `${route.path}: route has no JSON-LD`);
  assert(schema['@context'] === 'https://schema.org', `${route.path}: JSON-LD context must be schema.org`);

  const graph = graphItems(schema);
  const ids = graph
    .map((item) => item['@id'])
    .filter((id): id is string => typeof id === 'string');
  assert(new Set(ids).size === ids.length, `${route.path}: duplicate JSON-LD @id values`);

  const personNodes = graph.filter(
    (item) => asTypes(item['@type']).includes('Person') && item['@id'] === PERSON_ID,
  );
  assert(personNodes.length === 1, `${route.path}: expected one canonical Person node`);
  const person = personNodes[0];
  assert(person.name === SITE_NAME, `${route.path}: canonical Person name drifted`);
  assert(person.mainEntityOfPage === absoluteUrl('/about'), `${route.path}: Person mainEntityOfPage drifted`);
  const sameAs = person.sameAs;
  assert(Array.isArray(sameAs) && sameAs.length >= 3, `${route.path}: Person sameAs evidence is incomplete`);
  assert(
    sameAs.every((url) => typeof url === 'string' && url.startsWith('https://')),
    `${route.path}: Person sameAs entries must be HTTPS URLs`,
  );
  assert(new Set(sameAs).size === sameAs.length, `${route.path}: duplicate Person sameAs entries`);

  const websiteNodes = graph.filter(
    (item) => asTypes(item['@type']).includes('WebSite') && item['@id'] === WEBSITE_ID,
  );
  assert(websiteNodes.length === 1, `${route.path}: expected one canonical WebSite node`);
  assert(
    (websiteNodes[0].publisher as JsonLd | undefined)?.['@id'] === PERSON_ID,
    `${route.path}: WebSite publisher must resolve to the canonical Person`,
  );

  const pageNodes = graph.filter(
    (item) => asTypes(item['@type']).includes('WebPage') && item.url === canonicalUrl,
  );
  assert(pageNodes.length === 1, `${route.path}: expected one canonical WebPage node`);
  const page = pageNodes[0];
  assert(page['@id'] === `${canonicalUrl}#webpage`, `${route.path}: WebPage @id drifted`);
  assert(
    (page.isPartOf as JsonLd | undefined)?.['@id'] === WEBSITE_ID,
    `${route.path}: WebPage isPartOf must resolve to the canonical WebSite`,
  );

  const mainEntityId = (page.mainEntity as JsonLd | undefined)?.['@id'];
  if (typeof mainEntityId === 'string') {
    assert(ids.includes(mainEntityId), `${route.path}: WebPage mainEntity does not resolve inside its graph`);
  }

  assert(
    !exactInternalReference(schema, `${SITE_URL}/ai-information#sulayman-bowles`),
    `${route.path}: retired Person ID returned`,
  );
  for (const alias of route.aliases) {
    assert(
      !exactInternalReference(schema, absoluteUrl(alias)),
      `${route.path}: JSON-LD references alias ${alias} instead of the canonical URL`,
    );
  }

  if (route.pageType === 'article') {
    const articles = graph.filter((item) => asTypes(item['@type']).includes('Article'));
    assert(articles.length === 1, `${route.path}: expected one Article node`);
    const article = articles[0];
    assert(article['@id'] === `${canonicalUrl}#article`, `${route.path}: Article @id drifted`);
    assert(article.url === canonicalUrl, `${route.path}: Article URL drifted`);
    assert(article.dateModified === route.lastmod, `${route.path}: Article dateModified and sitemap lastmod differ`);
    assert(isIsoDate(article.datePublished), `${route.path}: Article datePublished is not ISO-8601`);
    assert(isIsoDate(article.dateModified), `${route.path}: Article dateModified is not ISO-8601`);
    assert(article.dateModified >= article.datePublished, `${route.path}: Article dateModified predates publication`);
    assert(
      (article.author as JsonLd | undefined)?.['@id'] === PERSON_ID,
      `${route.path}: Article author must resolve to the canonical Person`,
    );
    assert(
      (article.publisher as JsonLd | undefined)?.['@id'] === PERSON_ID,
      `${route.path}: Article publisher must resolve to the canonical Person`,
    );
  }
}

export function assertSeoAuthorityContract(routes: readonly AuthorityRouteContract[]) {
  assertCrawlerPolicyContract();
  assert(routes.length > 0, 'route registry is empty');

  const canonicalPaths = new Set<string>();
  const claimedPaths = new Map<string, string>();
  const today = new Date().toISOString().slice(0, 10);

  for (const route of routes) {
    assert(route.path === '/' || /^\/[a-z0-9][a-z0-9./-]*$/.test(route.path), `${route.path}: invalid canonical path`);
    assert(route.path === '/' || !route.path.endsWith('/'), `${route.path}: canonical path has a trailing slash`);
    assert(!route.path.includes('//'), `${route.path}: canonical path contains an empty segment`);
    assert(!route.path.split('/').some((segment) => segment === '.' || segment === '..'), `${route.path}: canonical path contains a dot segment`);
    assert(!canonicalPaths.has(route.path), `${route.path}: duplicate canonical path`);
    canonicalPaths.add(route.path);
    claimedPaths.set(route.path, route.path);

    assert(route.title.trim().length >= 10 && route.title.length <= 70, `${route.path}: title length is outside 10-70`);
    assert(
      route.description.trim().length >= 70 && route.description.length <= 190,
      `${route.path}: description length is outside 70-190`,
    );
    assert(route.h1.trim().length > 0, `${route.path}: H1 is empty`);
    assert(route.staticSummary.trim().length >= 40, `${route.path}: static summary is too thin`);
    assert(route.priority >= 0 && route.priority <= 1, `${route.path}: sitemap priority is outside 0-1`);
    assert(isIsoDate(route.lastmod), `${route.path}: lastmod must be an ISO-8601 date`);
    assert(route.lastmod <= today, `${route.path}: lastmod is in the future`);

    if (route.portfolioRoute?.lifecycle === 'merge') {
      assert(route.includeInSitemap === false, `${route.path}: merged route entered the sitemap`);
      assert(route.noindex === true, `${route.path}: merged route lacks a defensive noindex state`);
      assert(route.generateStatic !== true, `${route.path}: merged route must not emit duplicate HTML`);
      assert(route.redirectTarget === route.portfolioRoute.redirectTarget, `${route.path}: redirect target drifted from the portfolio contract`);
    } else if (route.includeInSitemap) {
      assert(route.noindex !== true, `${route.path}: sitemap route is marked noindex`);
      validateSchema(route);
    } else {
      assert(route.noindex === true, `${route.path}: route omitted from the sitemap without explicit noindex`);
      assert(route.generateStatic === true, `${route.path}: noindex route must generate static metadata`);
      if (route.jsonLd && Object.keys(route.jsonLd).length > 0) validateSchema(route);
    }
  }

  for (const route of routes) {
    const aliases = new Set<string>();
    for (const alias of route.aliases) {
      assert(alias !== route.path, `${route.path}: canonical path is repeated as an alias`);
      assert(alias === '/' || /^\/[A-Za-z0-9][A-Za-z0-9_./-]*$/.test(alias), `${route.path}: invalid alias ${alias}`);
      assert(alias === '/' || !alias.endsWith('/'), `${route.path}: alias has a trailing slash: ${alias}`);
      assert(!alias.includes('//'), `${route.path}: alias contains an empty segment: ${alias}`);
      assert(!alias.split('/').some((segment) => segment === '.' || segment === '..'), `${route.path}: alias contains a dot segment: ${alias}`);
      assert(!aliases.has(alias), `${route.path}: duplicate alias ${alias}`);
      aliases.add(alias);

      const previousOwner = claimedPaths.get(alias);
      assert(!previousOwner, `${route.path}: alias ${alias} collides with ${previousOwner}`);
      claimedPaths.set(alias, route.path);
    }
  }

  assert(PERSON_ID === `${absoluteUrl('/about')}#sulayman-bowles`, 'canonical Person ID must stay on /about');
  assert(WEBSITE_ID === `${SITE_URL}/#website`, 'canonical WebSite ID drifted');
  assert(ATLAS_SOFTWARE_ID === `${absoluteUrl('/atlas')}#software`, 'Atlas entity ID drifted');
  assert(VOID_AGENCY_ID === `${SITE_URL}/#void-agency`, 'Void Agency entity ID drifted');
}
