import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { buildSitemapXml } from './generatedPublicFiles';
import {
  PROGRAMMATIC_ROUTE_EXPANSION,
  getPortfolioRedirectTarget,
  isIndexableSeoPortfolioRoute,
  validateSeoPortfolioRoutes,
} from './portfolioRoutes';
import { SEO_PORTFOLIO_ROUTES, SEO_ROUTES } from './routes';

test('every registered route has one versioned portfolio decision', () => {
  assert.equal(SEO_ROUTES.length, 80);
  assert.equal(SEO_PORTFOLIO_ROUTES.length, SEO_ROUTES.length);
  assert.equal(SEO_PORTFOLIO_ROUTES.filter(isIndexableSeoPortfolioRoute).length, 35);
  assert.equal(SEO_PORTFOLIO_ROUTES.filter((route) => route.lifecycle === 'merge').length, 42);
  assert.equal(SEO_PORTFOLIO_ROUTES.filter((route) => route.lifecycle === 'noindex').length, 3);
  assert.equal(PROGRAMMATIC_ROUTE_EXPANSION.frozen, true);
  validateSeoPortfolioRoutes(SEO_PORTFOLIO_ROUTES);
});

test('commodity technical SEO routes have direct VOID owners and leave the sitemap', () => {
  const sitemap = buildSitemapXml();
  const moved = SEO_PORTFOLIO_ROUTES.filter((route) => (
    route.path === '/method'
    || route.path === '/austin-technical-seo'
    || getPortfolioRedirectTarget(route.path) !== null
  ));

  assert.equal(moved.length, 42);
  for (const route of moved) {
    assert.equal(route.lifecycle, 'merge');
    assert.equal(route.ownerDomain, 'www.void-agency.com');
    assert.match(route.redirectTarget ?? '', /^https:\/\/www\.void-agency\.com\/(?!$)/);
    assert.ok(!sitemap.includes(`<loc>https://sulayman-bowles.dev${route.path}</loc>`));
  }
});

test('sitemap is human-readable but noindex and excluded from XML', () => {
  const route = SEO_PORTFOLIO_ROUTES.find((candidate) => candidate.path === '/sitemap');
  assert.equal(route?.lifecycle, 'noindex');
  assert.equal(route?.canonical, 'https://sulayman-bowles.dev/sitemap');
  assert.ok(!buildSitemapXml().includes('<loc>https://sulayman-bowles.dev/sitemap</loc>'));
});

test('original rendering research keeps its date and indexable owner', () => {
  const route = SEO_ROUTES.find((candidate) => candidate.path === '/research/technical-seo/raw-html-rendered-dom-evidence');
  assert.ok(route);
  assert.equal(route.redirectTarget, null);
  assert.equal(route.includeInSitemap, true);
  assert.equal(route.portfolioRoute?.ownerDomain, 'sulayman-bowles.dev');
  assert.notEqual(route.lastmod, '2026-09-03');
});

test('Vercel has a permanent one-hop rule for every merged route and alias', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8')) as {
    routes: Array<{ src?: string; status?: number; headers?: { Location?: string } }>;
  };
  const permanentRedirects = new Map(
    config.routes
      .filter((route) => route.status === 308 && route.src && route.headers?.Location)
      .map((route) => [route.src as string, route.headers?.Location as string]),
  );

  for (const route of SEO_PORTFOLIO_ROUTES.filter((candidate) => candidate.lifecycle === 'merge')) {
    assert.equal(permanentRedirects.get(route.path), route.redirectTarget, `${route.path}: redirect mismatch`);
  }
  assert.equal(permanentRedirects.get('/austin-seo'), 'https://www.void-agency.com/services/technical-seo-ai-search-visibility');
  assert.equal(permanentRedirects.get('/technical-seo-case-study'), 'https://www.void-agency.com/tools/technical-seo-audit-checklist');
  assert.equal(permanentRedirects.get('/case-studies/technical-seo-audit'), 'https://www.void-agency.com/tools/technical-seo-audit-checklist');
});

test('duplicate indexable intent owners are rejected', () => {
  const first = SEO_PORTFOLIO_ROUTES.find(isIndexableSeoPortfolioRoute)!;
  const second = SEO_PORTFOLIO_ROUTES.find((route) => isIndexableSeoPortfolioRoute(route) && route.path !== first.path)!;
  assert.throws(
    () => validateSeoPortfolioRoutes([first, { ...second, intentCluster: first.intentCluster }]),
    /already belongs/,
  );
});
