import {
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
  programmaticPageWordCount,
} from '../src/content/programmaticSeo';
import { PROGRAMMATIC_SEARCH_TARGETS } from '../src/seo/programmaticSearchTargets';
import { getCanonicalRoutes, getSeoRoute } from '../src/seo/routes';
import { buildSitemapXml } from '../src/seo/generatedPublicFiles';
import { buildRouteStaticHtml } from '../src/seo/staticContent';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizedWords(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/g, ' ')
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function assertUnique(values: string[], label: string) {
  assert(new Set(values).size === values.length, `${label} values are not unique`);
}

function narrative(page: (typeof PROGRAMMATIC_SEO_PAGES)[number]) {
  return [
    page.directAnswer,
    ...page.sections.flatMap((section) => [
      ...section.paragraphs,
      ...(section.bullets ?? []),
      ...(section.table?.rows.flat() ?? []),
      ...(section.codeExamples?.flatMap((example) => [example.title, example.description]) ?? []),
    ]),
  ].join(' ');
}

assert(PROGRAMMATIC_SEO_PAGES.length === 36, `Expected 36 programmatic leaf pages; found ${PROGRAMMATIC_SEO_PAGES.length}`);
assert(PROGRAMMATIC_SEO_HUBS.length === 4, `Expected four programmatic hubs; found ${PROGRAMMATIC_SEO_HUBS.length}`);
assert(PROGRAMMATIC_SEARCH_TARGETS.length === 36, 'Programmatic search-target count drifted from the page registry');
assert(PROGRAMMATIC_SEO_PAGES.filter((page) => page.family === 'issue').length === 24, 'Expected 24 issue guides');
assert(PROGRAMMATIC_SEO_PAGES.filter((page) => page.family === 'platform').length === 8, 'Expected eight platform guides');
assert(PROGRAMMATIC_SEO_PAGES.filter((page) => page.family === 'checklist').length === 4, 'Expected four audit checklists');

const canonicalRoutes = getCanonicalRoutes();
assert(canonicalRoutes.length === 68, `Expected exactly 68 indexable canonical URLs; found ${canonicalRoutes.length}`);
const sitemap = buildSitemapXml();
const phraseIndex = new Map<string, string>();

for (const page of PROGRAMMATIC_SEO_PAGES) {
  const route = getSeoRoute(page.path);
  assert(route, `${page.path}: missing SEO route`);
  assert(page.indexabilityState === 'indexable', `${page.path}: draft, noindex, or failed-quality page entered the release`);
  assert(route.includeInSitemap && !route.noindex, `${page.path}: passed page is not indexable`);
  assert(sitemap.includes(`<loc>https://sulayman-bowles.dev${page.path}</loc>`), `${page.path}: missing from sitemap`);
  assert(page.sources.length >= 2, `${page.path}: fewer than two authoritative sources`);
  assert(page.sources.every((source) => source.href.startsWith('https://') && source.lastVerified), `${page.path}: source ledger is incomplete`);
  assert(page.diagnosticProcedure.length >= 4, `${page.path}: diagnostic procedure is incomplete`);
  assert(page.repairSteps.length >= 4, `${page.path}: repair sequence is incomplete`);
  assert(page.rerunAcceptanceCheck.length >= 3, `${page.path}: rerun gate is incomplete`);
  assert(page.relatedPaths.length >= 3, `${page.path}: related-page contract is incomplete`);
  assert(page.evidenceArtifact.kind === 'atlas-compatible-fixture', `${page.path}: evidence artifact is not explicitly a fixture`);
  assert(page.evidenceArtifact.fields.length >= 8, `${page.path}: evidence artifact lacks reproducibility fields`);

  const words = programmaticPageWordCount(page);
  assert(words >= 800 && words <= 1200, `${page.path}: ${words} words; expected 800-1200`);
  const staticHtml = buildRouteStaticHtml(route);
  const first150 = normalizedWords(staticHtml).slice(0, 150).join(' ');
  const answerLead = normalizedWords(page.directAnswer).slice(0, 16).join(' ');
  assert(first150.includes(answerLead), `${page.path}: direct answer is not present in the first 150 static words`);
  assert(page.relatedPaths.every((path) => staticHtml.includes(`href="${path}"`)), `${page.path}: missing a related-page link`);
  assert(staticHtml.includes('href="/method"') && staticHtml.includes('href="/contact"'), `${page.path}: method/contact intent links are missing`);

  const wordsForPhrases = normalizedWords(narrative(page));
  const seen = new Set<string>();
  for (let index = 0; index <= wordsForPhrases.length - 16; index += 1) {
    seen.add(wordsForPhrases.slice(index, index + 16).join(' '));
  }
  for (const phrase of seen) {
    const priorPath = phraseIndex.get(phrase);
    assert(!priorPath, `${page.path}: repeats a 16-word passage from ${priorPath}: "${phrase}"`);
    phraseIndex.set(phrase, page.path);
  }
}

for (const hub of PROGRAMMATIC_SEO_HUBS) {
  const route = getSeoRoute(hub.path);
  assert(route?.includeInSitemap && !route.noindex, `${hub.path}: hub is not indexable`);
  assert(hub.indexabilityState === 'indexable', `${hub.path}: non-indexable hub entered the release`);
  assert(sitemap.includes(`<loc>https://sulayman-bowles.dev${hub.path}</loc>`), `${hub.path}: hub missing from sitemap`);
}

const programmaticRoutes = [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => getSeoRoute(item.path)!);
assertUnique(programmaticRoutes.map((route) => route.path), 'Canonical path');
assertUnique(programmaticRoutes.map((route) => route.title), 'Title');
assertUnique(programmaticRoutes.map((route) => route.description), 'Description');
assertUnique(programmaticRoutes.map((route) => route.h1), 'H1');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.primaryQuery.toLowerCase()), 'Primary query');
assertUnique(programmaticRoutes.map((route) => JSON.stringify(route.jsonLd)), 'JSON-LD schema');

console.log(
  `Programmatic SEO verification passed: 36 leaf pages, 4 hubs, ${canonicalRoutes.length} canonical URLs, 800-1200 words per leaf, two or more sources, unique route/search/schema fields, and zero repeated 16-word passages.`,
);
