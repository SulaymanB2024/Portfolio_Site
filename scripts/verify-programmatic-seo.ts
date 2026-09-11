import {
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
  programmaticPageWordCount,
} from '../src/content/programmaticSeo';
import { getArticleByPath } from '../src/content/articleRegistry';
import { getArticleSearchTarget } from '../src/seo/articleSearchTargets';
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
const programmaticPaths = new Set(
  [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => item.path),
);
assert(
  canonicalRoutes.filter((route) => programmaticPaths.has(route.path)).length === programmaticPaths.size,
  'One or more programmatic routes are missing from the canonical inventory',
);
const sitemap = buildSitemapXml();


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
  assert(words >= 350 && words <= 1000, `${page.path}: ${words} words; expected a bounded 350-1000-word diagnostic`);
  assert(getArticleByPath(page.foundationalPath), `${page.path}: foundation article does not exist`);
  assert(page.relatedPaths.every((path) => getSeoRoute(path)), `${page.path}: related destination does not exist`);
  assert(new Set(page.relatedPaths).size === page.relatedPaths.length && !page.relatedPaths.includes(page.path), `${page.path}: self/duplicate related link`);
  assert(getArticleSearchTarget(page.foundationalPath)?.relatedPaths.includes(page.path), `${page.path}: foundation does not link back`);
  assert(page.falsePositiveBoundary.length > 30, `${page.path}: missing meaningful false-positive boundary`);
  assert(page.sections.some((section) => section.id === 'false-positive-boundary' && section.paragraphs.includes(page.falsePositiveBoundary)), `${page.path}: false-positive guidance is not rendered`);
  assert(page.sections.some((section) => section.id === 'rerun-gate'), `${page.path}: no acceptance section`);
  assert(!narrative(page).includes(page.slug.replaceAll('-', '').toUpperCase()), `${page.path}: generated uppercase keyword marker`);
  for (const example of page.sections.flatMap((section) => section.codeExamples ?? [])) {
    assert(!/^\+/m.test(example.code), `${page.path}: diff marker in copyable command`);
    assert(example.code.includes('--max-time'), `${page.path}: request lacks a time bound`);
  }
  const staticHtml = buildRouteStaticHtml(route);
  const first150 = normalizedWords(staticHtml).slice(0, 150).join(' ');
  const answerLead = normalizedWords(page.directAnswer).slice(0, 16).join(' ');
  assert(first150.includes(answerLead), `${page.path}: direct answer is not present in the first 150 static words`);
  assert(page.relatedPaths.every((path) => staticHtml.includes(`href="${path}"`)), `${page.path}: missing a related-page link`);
  assert(staticHtml.includes('href="/method"') && staticHtml.includes('href="/contact"'), `${page.path}: method/contact intent links are missing`);


}

for (const hub of PROGRAMMATIC_SEO_HUBS) {
  const route = getSeoRoute(hub.path);
  assert(route?.includeInSitemap && !route.noindex, `${hub.path}: hub is not indexable`);
  assert(hub.indexabilityState === 'indexable', `${hub.path}: non-indexable hub entered the release`);
  assert(sitemap.includes(`<loc>https://sulayman-bowles.dev${hub.path}</loc>`), `${hub.path}: hub missing from sitemap`);
}

// Shared safety instructions may repeat; each page's actual diagnosis and repair must differ.
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => normalizedWords(page.directAnswer).join(' ')), 'Diagnostic answer');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.falsePositiveBoundary), 'False-positive boundary');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.repairSteps[1]), 'Topic-specific repair');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.rerunAcceptanceCheck[0]), 'Topic-specific acceptance check');

const programmaticRoutes = [...PROGRAMMATIC_SEO_HUBS, ...PROGRAMMATIC_SEO_PAGES].map((item) => getSeoRoute(item.path)!);
assertUnique(programmaticRoutes.map((route) => route.path), 'Canonical path');
assertUnique(programmaticRoutes.map((route) => route.title), 'Title');
assertUnique(programmaticRoutes.map((route) => route.description), 'Description');
assertUnique(programmaticRoutes.map((route) => route.h1), 'H1');
assertUnique(PROGRAMMATIC_SEO_PAGES.map((page) => page.primaryQuery.toLowerCase()), 'Primary query');
assertUnique(programmaticRoutes.map((route) => JSON.stringify(route.jsonLd)), 'JSON-LD schema');

console.log(
  `Programmatic SEO verification passed: 36 leaf pages, 4 hubs, ${canonicalRoutes.length} canonical URLs, bounded useful diagnostics, two or more sources, distinct topic-specific diagnosis/repair/acceptance, valid foundations, and reciprocal links.`,
);
