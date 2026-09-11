import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { INDEXABLE_ARTICLES, getArticlePath } from './articleRegistry';
import { PUBLICATION_INDEX } from './publicationIndex';
import { PROGRAMMATIC_SEO_HUBS, PROGRAMMATIC_SEO_PAGES } from './programmaticSeo';
import { DIAGNOSTIC_EXAMPLES } from './diagnosticExamples';
import { PROFILE_FACTS } from './profileFacts';
import { SEO_ROUTES, getSeoRoute, getCanonicalRoutes } from '../seo/routes';
import { buildRouteStaticHtml, buildSitemapStaticHtml } from '../seo/staticContent';
import { latestContentDate, normalizePublicationDate } from '../utils/publicationDate';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

test('each published article is discoverable in the Research browser with current title and date', () => {
  for (const article of INDEXABLE_ARTICLES) {
    const matches = PUBLICATION_INDEX.filter((item) => item.href === getArticlePath(article));
    assert.equal(matches.length, 1, getArticlePath(article));
    assert.equal(matches[0].title, article.title);
    assert.equal(normalizePublicationDate(matches[0].date), normalizePublicationDate(article.dateModified ?? article.date));
    assert.ok(buildRouteStaticHtml(getSeoRoute('/research')!).includes(`href="${getArticlePath(article)}"`));
  }
});
test('each diagnostic has its own visible worked example with observed and intended states', () => {
  assert.deepEqual(Object.keys(DIAGNOSTIC_EXAMPLES).sort(), PROGRAMMATIC_SEO_PAGES.map((p) => p.slug).sort());
  assert.equal(new Set(Object.values(DIAGNOSTIC_EXAMPLES).map((e) => e.scenario)).size, PROGRAMMATIC_SEO_PAGES.length);
  for (const page of PROGRAMMATIC_SEO_PAGES) {
    const example = DIAGNOSTIC_EXAMPLES[page.slug];
    assert.equal(example.checks.length, 3);
    const rendered = buildRouteStaticHtml(getSeoRoute(page.path)!);
    assert.ok(rendered.includes(escape(example.scenario)), page.path);
    assert.ok(rendered.includes(escape(example.decision)), page.path);
    for (const row of example.checks) for (const value of row) assert.ok(rendered.includes(escape(value)), value);
  }
});
test('collection and profile lastmod values follow content records, not a build timestamp', () => {
  for (const hub of PROGRAMMATIC_SEO_HUBS) {
    const children = PROGRAMMATIC_SEO_PAGES.filter((page) => hub.family === 'all' || page.family === hub.family);
    assert.equal(getSeoRoute(hub.path)!.lastmod, latestContentDate(children.map((p) => p.dateModified)));
  }
  for (const path of ['/', '/about', '/resume']) assert.equal(getSeoRoute(path)!.lastmod, PROFILE_FACTS.lastReviewed);
  assert.equal(getSeoRoute('/research')!.lastmod, latestContentDate(PUBLICATION_INDEX.map((p) => p.date)));
  assert.equal(getSeoRoute('/markets')!.lastmod, latestContentDate(PUBLICATION_INDEX.filter((p) => p.category === 'Markets and investing').map((p) => p.date)));
  assert.equal(getSeoRoute('/sitemap')!.lastmod, latestContentDate(SEO_ROUTES.filter((r) => r.includeInSitemap && r.path !== '/sitemap').map((r) => r.lastmod!)));
});
test('deliberate prototype and archive exclusions are not converted into index targets', () => {
  assert.deepEqual(SEO_ROUTES.filter((r) => r.noindex).map((r) => r.path).sort(), ['/atlas/celestial-parallax', '/markets/archived-research-methodology']);
  for (const route of SEO_ROUTES.filter((r) => r.noindex)) assert.equal(route.includeInSitemap, false);
});
test('public-page repair does not prescribe removal from search', () => {
  const page = PROGRAMMATIC_SEO_PAGES.find((p) => p.slug === 'robots-blocked-indexable-url')!;
  assert.match(page.repairSteps.join(' '), /public page intended for search/);
  assert.doesNotMatch(page.rerunAcceptanceCheck.join(' '), /leaves index coverage/);
});
test('latestContentDate accepts declared ISO/dotted dates and rejects impossible or missing dates', () => {
  assert.equal(latestContentDate(['2026.07.20', '2026-09-10', '2026-08-31']), '2026-09-10');
  for (const input of [[], ['2026-02-30'], ['2026-13-01'], ['not-a-date'], ['2026-9-1']]) assert.throws(() => latestContentDate(input));
});
test('the HTML generator never hides the server document merely because JavaScript is supported', () => {
  const source = fs.readFileSync('scripts/generate-static-routes.ts', 'utf8');
  assert.doesNotMatch(source, /seo-static-client-shell|js-pending|buildClientShell/);
  assert.match(source, /app-mounted #seo-static-summary/);
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.match(app, /function RouteReady[\s\S]*?useLayoutEffect/);
});

test('canonical heading records match the server document on every published route', () => {
  for (const route of getCanonicalRoutes()) {
    const html = route.path === '/sitemap' ? buildSitemapStaticHtml(getCanonicalRoutes()) : route.staticHtml ?? buildRouteStaticHtml(route);
    assert.ok(html.includes(`<h1>${escape(route.h1)}</h1>`), route.path);
  }
});
