import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { ALL_ARTICLES, getArticleByPath } from './articleRegistry';
import { PROGRAMMATIC_SEO_PAGES } from './programmaticSeo';
import { getArticleSearchTarget } from '../seo/articleSearchTargets';
import { buildRouteStaticHtml } from '../seo/staticContent';
import { getSeoRoute } from '../seo/routes';
import { PROFILE_FACTS } from './profileFacts';

test('every guide has an existing foundation and a rendered reciprocal link', () => {
  for (const page of PROGRAMMATIC_SEO_PAGES) {
    assert.ok(getArticleByPath(page.foundationalPath), page.path);
    assert.ok(getArticleSearchTarget(page.foundationalPath)?.relatedPaths.includes(page.path));
    assert.ok(buildRouteStaticHtml(getSeoRoute(page.foundationalPath)!).includes(`href="${page.path}"`));
  }
});
test('related diagnostic selection is semantic and excludes itself', () => {
  for (const page of PROGRAMMATIC_SEO_PAGES) {
    const related = page.relatedPaths.map((path) => PROGRAMMATIC_SEO_PAGES.find((item) => item.path === path)).filter(Boolean);
    assert.equal(related.length, 3);
    if (PROGRAMMATIC_SEO_PAGES.some((item) => item.path !== page.path && item.foundationalPath === page.foundationalPath)) {
      assert.ok(related.some((item) => item!.foundationalPath === page.foundationalPath));
    } else {
      assert.ok(related.some((item) => item!.sources.some((source) => page.sources.some((own) => own.href === source.href))));
    }
    assert.ok(related.every((item) => item!.path !== page.path));
  }
});
test('search titles describe evidence without flattening uncertainty', () => {
  const ai = ALL_ARTICLES.find((article) => article.slug === 'the-first-ai-managers')!;
  assert.match(ai.seoTitle!, /30 AI Manager Cases/);
  const austin = ALL_ARTICLES.find((article) => article.slug === 'who-owns-austin-home-service-companies')!;
  assert.match(austin.subtitle!, /unresolved/); assert.doesNotMatch(austin.subtitle!, /verified map/i);
  const magnet = ALL_ARTICLES.find((article) => article.slug === 'us-rare-earth-magnet-manufacturing-capacity')!;
  assert.doesNotMatch(JSON.stringify(magnet), /37,750 (?:metric tonnes|tonnes)|37,750-tonne/);
  assert.match(JSON.stringify(magnet), /37,584–38,048/);
  assert.ok(fs.existsSync('public/research/us-rare-earth-magnet-methodology.md'));
});
test('profile facts and public pages no longer claim a Music degree or obsolete Chegg title', () => {
  assert.equal(PROFILE_FACTS.education.expectedGraduation, 'May 2028');
  assert.deepEqual(PROFILE_FACTS.education.degrees.map((d) => d.field), ['Finance']);
  assert.equal(PROFILE_FACTS.experience[0].title, 'Growth & Product Intern');
  assert.equal(PROFILE_FACTS.experience[0].dates, 'May 2026 — Present');
  for (const path of ['/', '/about', '/resume']) {
    const html = buildRouteStaticHtml(getSeoRoute(path)!);
    assert.doesNotMatch(html, /second degree|BA in Music|AI Product Manager Intern/);
  }
});
