import fs from 'node:fs';
import path from 'node:path';

import { SEARCH_INTENT_CLUSTERS } from '../src/seo/keywordStrategy';
import { getSeoRoute } from '../src/seo/routes';
import { buildRouteStaticHtml } from '../src/seo/staticContent';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAllWords(haystack: string, phrase: string) {
  const words = normalize(phrase).split(' ').filter(Boolean);
  const wordSet = new Set(normalize(haystack).split(' ').filter(Boolean));
  return words.every((word) => wordSet.has(word));
}

const primaryTargets = new Set<string>();

for (const cluster of SEARCH_INTENT_CLUSTERS) {
  const route = getSeoRoute(cluster.path);
  assert(route, `${cluster.path}: keyword strategy route is missing`);

  const staticHtml = buildRouteStaticHtml(route);
  const primarySurface = `${route.title} ${route.h1}`;
  const fullSurface = `${primarySurface} ${route.description} ${route.staticSummary} ${staticHtml}`;
  const primaryKey = normalize(cluster.primary);

  assert(!primaryTargets.has(primaryKey), `${cluster.path}: duplicate primary target ${cluster.primary}`);
  primaryTargets.add(primaryKey);
  assert(containsAllWords(primarySurface, cluster.primary), `${cluster.path}: title/H1 does not cover primary target ${cluster.primary}`);
  assert(route.title.length <= 65, `${cluster.path}: title exceeds 65 characters (${route.title.length})`);
  assert(route.description.length >= 110, `${cluster.path}: description is too short (${route.description.length})`);
  assert(route.description.length <= 170, `${cluster.path}: description exceeds 170 characters (${route.description.length})`);

  const supportingCoverage = cluster.supporting.filter((term) => containsAllWords(fullSurface, term));
  assert(
    supportingCoverage.length >= 2,
    `${cluster.path}: only ${supportingCoverage.length} supporting keyword phrases are covered`,
  );

  const structuredData = JSON.stringify(route.jsonLd ?? {});
  assert(structuredData.includes(cluster.primary), `${cluster.path}: structured data is missing primary keyword ${cluster.primary}`);
}

const homeStatic = buildRouteStaticHtml(getSeoRoute('/')!);
assert(homeStatic.includes('href="/method">Evidence-led technical SEO audit method</a>'), 'home: missing descriptive audit-method anchor');
assert(homeStatic.includes('href="https://www.void-agency.com/services/technical-seo-ai-search-visibility">Void Agency technical SEO services</a>'), 'home: missing Void Agency commercial handoff');

const methodStatic = buildRouteStaticHtml(getSeoRoute('/method')!);
assert(methodStatic.includes('href="https://www.void-agency.com/services/technical-seo-ai-search-visibility">Review Void Agency technical SEO services</a>'), 'method: missing Void Agency commercial handoff');

for (const file of ['index.html', 'src/utils/seo.ts', 'scripts/generate-static-routes.ts']) {
  const contents = fs.readFileSync(path.resolve(file), 'utf8');
  assert(!/<meta\s+name=["']keywords["']/i.test(contents), `${file}: obsolete meta keywords tag must not be added`);
}

console.log(`Keyword targeting verification passed for ${SEARCH_INTENT_CLUSTERS.length} route clusters.`);
