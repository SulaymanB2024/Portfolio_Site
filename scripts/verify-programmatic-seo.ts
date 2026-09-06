import {
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
  programmaticPageWordCount,
} from '../src/content/programmaticSeo';
import { PROGRAMMATIC_SEARCH_TARGETS } from '../src/seo/programmaticSearchTargets';
import { getCanonicalRoutes, getSeoRoute } from '../src/seo/routes';
import { buildSitemapXml } from '../src/seo/generatedPublicFiles';

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
const programmaticPaths = new Set(
  [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => item.path),
);
assert(
  canonicalRoutes.every((route) => !programmaticPaths.has(route.path)),
  'A frozen programmatic route remains in the canonical inventory',
);
const sitemap = buildSitemapXml();
const phraseIndex = new Map<string, string>();

for (const page of PROGRAMMATIC_SEO_PAGES) {
  const route = getSeoRoute(page.path);
  assert(route, `${page.path}: missing SEO route`);
  assert(route.portfolioRoute?.lifecycle === 'merge', `${page.path}: missing merged lifecycle decision`);
  assert(route.portfolioRoute.ownerDomain === 'www.void-agency.com', `${page.path}: VOID is not the owner`);
  assert(route.includeInSitemap === false && route.noindex === true, `${page.path}: merged source remains indexable`);
  assert(route.generateStatic !== true, `${page.path}: merged source still emits duplicate HTML`);
  assert(!sitemap.includes(`<loc>https://sulayman-bowles.dev${page.path}</loc>`), `${page.path}: merged source remains in sitemap`);
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
  assert(route?.portfolioRoute?.lifecycle === 'merge', `${hub.path}: hub lacks a merged lifecycle decision`);
  assert(route.portfolioRoute.ownerDomain === 'www.void-agency.com', `${hub.path}: hub owner is not VOID`);
  assert(route.includeInSitemap === false && route.generateStatic !== true, `${hub.path}: merged hub still publishes duplicate HTML`);
  assert(!sitemap.includes(`<loc>https://sulayman-bowles.dev${hub.path}</loc>`), `${hub.path}: merged hub remains in sitemap`);
}

const programmaticRoutes = [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => getSeoRoute(item.path)!);
assertUnique(programmaticRoutes.map((route) => route.path), 'Canonical path');
assertUnique(programmaticRoutes.map((route) => route.title), 'Title');
assertUnique(programmaticRoutes.map((route) => route.description), 'Description');
assertUnique(programmaticRoutes.map((route) => route.h1), 'H1');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.primaryQuery.toLowerCase()), 'Primary query');
assertUnique(programmaticRoutes.map((route) => JSON.stringify(route.jsonLd)), 'JSON-LD schema');

console.log(
  `Programmatic SEO migration verification passed: 36 leaf pages and 4 hubs are frozen, source-preserved, omitted from generated HTML and sitemap, and assigned to direct VOID destinations; ${canonicalRoutes.length} retained canonical URLs remain.`,
);
