import fs from 'node:fs';
import path from 'node:path';

import { INDEXABLE_ARTICLES, getArticlePath } from '../src/content/articleRegistry';
import {
  ARTICLE_SEARCH_TARGETS,
  ARTICLE_TOP_TEN_MAX_POSITION,
  ARTICLE_TOP_TEN_MIN_IMPRESSIONS,
  ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS,
} from '../src/seo/articleSearchTargets';
import { buildSitemapXml } from '../src/seo/generatedPublicFiles';
import { getSeoRoute } from '../src/seo/routes';
import { buildRouteStaticHtml } from '../src/seo/staticContent';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:amp|quot|#39);/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(value: string) {
  return normalize(value).split(' ').filter(Boolean).length;
}

const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'can', 'for', 'in', 'is', 'of', 'the', 'to', 'vs']);

function meaningfulTokens(value: string) {
  return normalize(value).split(' ').filter((token) => token && !STOP_WORDS.has(token));
}

function titleCoversQuery(titleAndH1: string, query: string) {
  const surface = new Set(meaningfulTokens(titleAndH1));
  const queryTokens = meaningfulTokens(query);
  const covered = queryTokens.filter((token) => surface.has(token)).length;
  return covered >= Math.max(2, Math.ceil(queryTokens.length * 0.66));
}

function firstWordsFromHtml(html: string, count: number) {
  return normalize(html).split(' ').slice(0, count).join(' ');
}

function duplicateValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

const expectedPaths = [
  ...INDEXABLE_ARTICLES.map(getArticlePath),
  '/viralbench-codex-agent-harness',
].sort();
const targetPaths = ARTICLE_SEARCH_TARGETS.map((target) => target.path).sort();
const targetPathSet = new Set<string>(targetPaths);

assert(expectedPaths.length === 16, `expected 16 indexable article routes, found ${expectedPaths.length}`);
assert(
  expectedPaths.join('\n') === targetPaths.join('\n'),
  `article target registry does not match indexable routes:\nexpected ${expectedPaths.join(', ')}\nreceived ${targetPaths.join(', ')}`,
);
assert(
  duplicateValues(ARTICLE_SEARCH_TARGETS.map((target) => normalize(target.primaryQuery))).length === 0,
  'primary article queries must be unique',
);
assert(
  ARTICLE_TOP_TEN_MAX_POSITION === 10
    && ARTICLE_TOP_TEN_MIN_IMPRESSIONS === 10
    && ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS === 3,
  'ranking gate constants do not match the approved top-10 contract',
);

const sitemap = buildSitemapXml();
const titles: string[] = [];
const descriptions: string[] = [];

for (const target of ARTICLE_SEARCH_TARGETS) {
  const route = getSeoRoute(target.path);
  assert(route, `${target.path}: SEO route is missing`);
  assert(route.pageType === 'article', `${target.path}: route is not typed as an article`);
  assert(route.includeInSitemap && !route.noindex, `${target.path}: article is not indexable`);
  assert(target.supportingQueries.length >= 2, `${target.path}: fewer than two supporting queries`);
  assert(target.relatedPaths.length >= 3, `${target.path}: fewer than three related article links`);
  assert(new Set(target.relatedPaths).size === target.relatedPaths.length, `${target.path}: duplicate related article link`);
  assert(!target.relatedPaths.some((relatedPath) => relatedPath === target.path), `${target.path}: related links include self`);
  assert(target.relatedPaths.every((relatedPath) => targetPathSet.has(relatedPath)), `${target.path}: related path is not targeted`);
  assert(wordCount(target.directAnswer) >= 25, `${target.path}: direct answer is too thin`);
  assert(wordCount(target.serpGap) >= 12, `${target.path}: SERP gap is too thin`);
  assert(wordCount(target.originalArtifact) >= 8, `${target.path}: original artifact is too thin`);
  assert(wordCount(target.cannibalizationBoundary) >= 12, `${target.path}: cannibalization boundary is too thin`);
  assert(!/\bsulayman(?:-bowles)?\b/i.test(target.primaryQuery), `${target.path}: primary query is branded`);
  assert(titleCoversQuery(`${route.title} ${route.h1}`, target.primaryQuery), `${target.path}: title/H1 does not naturally cover "${target.primaryQuery}"`);

  const staticHtml = buildRouteStaticHtml(route);
  const first150Words = firstWordsFromHtml(staticHtml, 150);
  assert(
    meaningfulTokens(target.directAnswer).slice(0, 12).every((token) => first150Words.includes(token)),
    `${target.path}: direct answer is not present in the first 150 static words`,
  );
  assert(staticHtml.includes(target.originalArtifact), `${target.path}: original artifact is not visible in static HTML`);
  assert(
    target.relatedPaths.every((relatedPath) => staticHtml.includes(`href="${relatedPath}"`)),
    `${target.path}: static HTML is missing a contracted related-article link`,
  );
  assert(sitemap.includes(`https://sulayman-bowles.dev${target.path}`), `${target.path}: missing from sitemap`);

  const structuredData = JSON.stringify(route.jsonLd ?? {});
  assert(structuredData.includes('"Article"'), `${target.path}: Article JSON-LD is missing`);
  assert(structuredData.includes('"BreadcrumbList"'), `${target.path}: Breadcrumb JSON-LD is missing`);
  assert(structuredData.includes(`https://sulayman-bowles.dev${target.path}`), `${target.path}: JSON-LD lacks canonical URL`);

  titles.push(normalize(route.title));
  descriptions.push(normalize(route.description));
}

assert(duplicateValues(titles).length === 0, 'article titles are not unique');
assert(duplicateValues(descriptions).length === 0, 'article descriptions are not unique');

const vercelConfig = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf8')) as {
  routes: Array<{ src?: string; headers?: { Location?: string }; status?: number }>;
};
for (const target of ARTICLE_SEARCH_TARGETS) {
  const route = getSeoRoute(target.path)!;
  for (const alias of route.aliases) {
    const redirect = vercelConfig.routes.find(
      (candidate) => candidate.src === alias && candidate.headers?.Location === target.path,
    );
    assert(redirect?.status === 308, `${alias}: missing permanent 308 redirect to ${target.path}`);
  }
}

console.log(
  `Article ranking verification passed for 16 unique page/query contracts, ${ARTICLE_TOP_TEN_MIN_IMPRESSIONS}+ impressions, position ${ARTICLE_TOP_TEN_MAX_POSITION} or better, and ${ARTICLE_TOP_TEN_SUSTAINED_SNAPSHOTS} sustained snapshots.`,
);
