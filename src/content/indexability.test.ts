import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { INDEXABLE_ARTICLES, getArticlePath } from './articleRegistry';
import { PUBLICATION_INDEX } from './publicationIndex';
import { PROGRAMMATIC_SEO_HUBS, PROGRAMMATIC_SEO_PAGES } from './programmaticSeo';
import { DIAGNOSTIC_EXAMPLES } from './diagnosticExamples';
import { PROFILE_FACTS } from './profileFacts';
import { researchNav } from './siteNavigation';
import { SOFTWARE_BUYOUT_COHORT_ARTICLE } from './softwareBuyoutCohortArticle';
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
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    assert.equal(headings.length, 1, `${route.path}: exactly one primary heading`);
    // Typography can contain emphasis and line breaks; compare rendered text,
    // not the literal spelling of the opening tag.
    const normalize = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.equal(normalize(headings[0][1]), normalize(escape(route.h1)), route.path);
  }
});


test('priority research is one native homepage link away in the initial document and browser navigation', () => {
  const html = buildRouteStaticHtml(getSeoRoute('/')!);
  const footer = fs.readFileSync('src/components/InternalFooter.tsx', 'utf8');
  assert.match(footer, /items: utilityNav/);
  assert.match(footer, /href=\{item\.href\}/);
  assert.equal(new Set(researchNav.map((item) => item.href)).size, 3);
  for (const item of researchNav) {
    const route = getSeoRoute(item.href)!;
    assert.ok(route?.includeInSitemap && !route.noindex, item.href);
    assert.ok(PUBLICATION_INDEX.some((entry) => entry.href === item.href), item.href);
    assert.ok(html.includes(`href="${item.href}"`), item.href);
    assert.ok(html.includes(escape(item.label)), item.label);
    assert.ok(html.includes(escape(item.description!)), item.description);
  }
});

test('the canonical buyout article exposes all dated CSV records without changing their evidence', () => {
  const article = SOFTWARE_BUYOUT_COHORT_ARTICLE;
  const section = article.sections!.find((section) => section.id === 'deal-by-deal-control-inventory')!;
  const csv = fs.readFileSync('public/research/software-buyout-cohort-2020-2022.csv', 'utf8').trim();
  // This fixture deliberately has no quoted fields. Reject a format change rather than misparse it.
  assert.doesNotMatch(csv, /"/);
  const [headers, ...records] = csv.split(/\r?\n/).map((line) => line.split(','));
  assert.ok(records.every((record) => record.length === headers.length));
  const fields = ['company', 'announcement_year', 'headline_transaction_value_usd_billions', 'sponsor_group', 'outcome_category', 'current_control_summary', 'classification_note'];
  assert.ok(fields.every((field) => headers.includes(field)));
  const expected = records.map((record) => fields.map((field) => record[headers.indexOf(field)]));
  assert.deepEqual(section.table!.rows, expected);
  assert.equal(expected.length, 25);
  assert.equal(new Set(expected.map((row) => row[0])).size, 25);
  assert.equal(expected.reduce((sum, row) => sum + Math.round(Number(row[2]) * 10), 0), 1712);
  assert.equal(article.date, '2026.08.17');
  assert.equal(article.lastVerified, '2026.08.17');
  assert.match(section.paragraphs.join(' '), /not a new verification/);
  const html = buildRouteStaticHtml(getSeoRoute('/research/financial-systems/software-buyout-boom-2020-2022-exit-audit')!);
  for (const row of expected) for (const cell of row) assert.ok(html.includes(escape(cell)), cell);
  assert.match(html, /The 25-deal control inventory/);
});
