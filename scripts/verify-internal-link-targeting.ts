import { getCanonicalRoutes, getSeoRoute, type SeoRoute } from '../src/seo/routes';
import { ARTICLE_SEARCH_TARGETS } from '../src/seo/articleSearchTargets';
import { PROGRAMMATIC_SEARCH_TARGETS } from '../src/seo/programmaticSearchTargets';
import { buildRouteStaticHtml, buildSitemapStaticHtml } from '../src/seo/staticContent';

type InternalLink = {
  source: string;
  target: string;
  label: string;
};

const DESCRIPTIVE_ANCHOR_EXPECTATIONS = [
  ['/work', 'technical SEO portfolio'],
  ['/atlas', 'technical SEO audit software'],
  ['/method', 'technical SEO audit services'],
  ['/contact', 'technical SEO consultant'],
  ['/austin-technical-seo', 'Austin technical SEO consultant'],
  ['/research', 'technical SEO research'],
  ['/markets/who-owns-texas-toll-roads', 'Texas toll road ownership'],
] as const;
const TEXAS_TOLL_PATH = '/markets/who-owns-texas-toll-roads';
const TEXAS_TOLL_REQUIRED_HUB_SOURCES = ['/', '/work', '/markets', '/research'] as const;
const TEXAS_TOLL_REQUIRED_ARTICLE_SOURCES = [
  '/research/search-console/technical-seo-public-data-infrastructure',
  '/research/financial-systems/where-online-returns-actually-go',
  '/research/financial-systems/how-airlines-borrow-against-loyalty-programs',
  '/research/financial-systems/hidden-financing-hardware-startups',
  '/research/financial-systems/waymo-hardware-financing',
] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeText(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function containsAllWords(value: string, phrase: string) {
  const words = new Set(normalizeText(value).split(' ').filter(Boolean));
  return normalizeText(phrase).split(' ').filter(Boolean).every((word) => words.has(word));
}

function staticHtmlFor(route: SeoRoute, routes: SeoRoute[]) {
  return route.path === '/sitemap'
    ? buildSitemapStaticHtml(routes)
    : buildRouteStaticHtml(route);
}

function canonicalTarget(href: string, canonicalPaths: Set<string>) {
  if (!href.startsWith('/') || href.startsWith('//')) return undefined;
  const pathname = href.split(/[?#]/)[0] || '/';
  const route = getSeoRoute(pathname);
  return route && canonicalPaths.has(route.path) ? route.path : undefined;
}

function extractInternalLinks(source: SeoRoute, html: string, canonicalPaths: Set<string>) {
  const links: InternalLink[] = [];
  const anchorPattern = /<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const target = canonicalTarget(match[1], canonicalPaths);
    if (!target) continue;
    links.push({
      source: source.path,
      target,
      label: normalizeText(match[2]),
    });
  }

  return links;
}

const routes = getCanonicalRoutes();
const canonicalPaths = new Set(routes.map((route) => route.path));
const links = routes.flatMap((route) => extractInternalLinks(route, staticHtmlFor(route, routes), canonicalPaths));
const adjacency = new Map(routes.map((route) => [route.path, new Set<string>()]));
const inboundSources = new Map(routes.map((route) => [route.path, new Set<string>()]));

for (const link of links) {
  adjacency.get(link.source)?.add(link.target);
  if (link.source !== link.target) inboundSources.get(link.target)?.add(link.source);
}

const depths = new Map<string, number>([['/', 0]]);
const queue = ['/'];

while (queue.length > 0) {
  const source = queue.shift()!;
  const nextDepth = depths.get(source)! + 1;

  for (const target of adjacency.get(source) ?? []) {
    if (depths.has(target)) continue;
    depths.set(target, nextDepth);
    queue.push(target);
  }
}

for (const route of routes) {
  if (route.path !== '/') {
    assert((inboundSources.get(route.path)?.size ?? 0) > 0, `${route.path}: canonical route is orphaned`);
  }
  assert(depths.has(route.path), `${route.path}: canonical route is not reachable from home`);
  assert(depths.get(route.path)! <= 2, `${route.path}: crawl depth exceeds two hops (${depths.get(route.path)})`);
}

for (const [target, phrase] of DESCRIPTIVE_ANCHOR_EXPECTATIONS) {
  const matchingLinks = links.filter(
    (link) =>
      link.target === target
      && link.source !== target
      && link.source !== '/sitemap'
      && containsAllWords(link.label, phrase),
  );
  assert(matchingLinks.length > 0, `${target}: no contextual inbound anchor covers "${phrase}"`);
}

for (const articleTarget of ARTICLE_SEARCH_TARGETS) {
  const contextualInbound = new Set(
    links
      .filter(
        (link) =>
          link.target === articleTarget.path
          && link.source !== articleTarget.path
          && link.source !== '/sitemap',
      )
      .map((link) => link.source),
  );
  assert(
    contextualInbound.size >= 3,
    `${articleTarget.path}: only ${contextualInbound.size} contextual inbound sources; expected at least 3`,
  );

  const route = getSeoRoute(articleTarget.path)!;
  const staticHtml = staticHtmlFor(route, routes);
  assert(
    articleTarget.relatedPaths.every((relatedPath) => staticHtml.includes(`href="${relatedPath}"`)),
    `${articleTarget.path}: one or more contracted related-article links are missing`,
  );
}

for (const target of PROGRAMMATIC_SEARCH_TARGETS) {
  const contextualInbound = new Set(
    links
      .filter((link) => link.target === target.path && link.source !== target.path && link.source !== '/sitemap')
      .map((link) => link.source),
  );
  assert(
    contextualInbound.size >= 3,
    `${target.path}: only ${contextualInbound.size} contextual inbound sources; expected at least 3`,
  );
  const route = getSeoRoute(target.path)!;
  const staticHtml = staticHtmlFor(route, routes);
  assert(
    target.relatedPaths.every((relatedPath) => staticHtml.includes(`href="${relatedPath}"`)),
    `${target.path}: one or more contracted related-page links are missing`,
  );
}

const texasTollInbound = links.filter(
  (link) => link.target === TEXAS_TOLL_PATH && link.source !== TEXAS_TOLL_PATH && link.source !== '/sitemap',
);
const texasTollInboundSources = new Set(texasTollInbound.map((link) => link.source));
assert(
  TEXAS_TOLL_REQUIRED_HUB_SOURCES.every((source) => texasTollInboundSources.has(source)),
  'Texas toll-road article is missing a contextual link from home, work, markets, or research',
);
assert(
  TEXAS_TOLL_REQUIRED_ARTICLE_SOURCES.every((source) => texasTollInboundSources.has(source)),
  'Texas toll-road article is missing one or more finance/infrastructure article links',
);
assert(
  new Set(texasTollInbound.map((link) => link.label)).size >= 5,
  'Texas toll-road inbound anchors are not sufficiently varied',
);

const maxDepth = Math.max(...depths.values());
console.log(
  `Internal-link verification passed for ${routes.length} canonical routes: zero orphans, maximum depth ${maxDepth}, ${DESCRIPTIVE_ANCHOR_EXPECTATIONS.length} descriptive anchor targets, and at least three contextual inbound sources for all ${ARTICLE_SEARCH_TARGETS.length} articles and ${PROGRAMMATIC_SEARCH_TARGETS.length} programmatic guides.`,
);
