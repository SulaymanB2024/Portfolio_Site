import { canonicalEntitySchemas, websiteSchema, type JsonLd } from './schema';
import type { SeoRoute } from './routes';
import { WORK_STUDIES, WORK_STUDIES_UPDATED, workStudyPath } from '../content/workStudies';
import { renderWorkStudy, workStudyJsonLd, renderWorkIndex, workIndexJsonLd, WORK_INDEX_DESCRIPTION, WORK_INDEX_TITLE } from '../content/workStudyView';


function withIdentity(schema: JsonLd): JsonLd {
  const identities = [...canonicalEntitySchemas(), websiteSchema()]
    .map(({ '@context': _context, ...node }) => node);
  return { ...schema, '@graph': [...identities, ...(schema['@graph'] as JsonLd[])] };
}

export const WORK_STUDY_ROUTES: SeoRoute[] = WORK_STUDIES.map(study => ({
  path: workStudyPath(study), aliases: [],
  title: `${study.name} | Sulayman Bowles`,
  description: study.description,
  h1: study.headline.join(' '),
  section: 'project', pageType: 'project', priority: .7,
  includeInSitemap: true, lastmod: WORK_STUDIES_UPDATED,
  staticSummary: study.description,
  staticHtml: renderWorkStudy(study),
  image: '/images/social/og-work.png',
  jsonLd: withIdentity(workStudyJsonLd(study)),
}));

/** Shared static and hydrated metadata; the old six-card fallback must not survive the expansion. */
export function withWorkIndexMetadata(route: SeoRoute): SeoRoute {
  if (route.path !== '/work') return route;
  return { ...route, title: WORK_INDEX_TITLE, description: WORK_INDEX_DESCRIPTION,
    h1: 'Ideas, built. Decisions, explained.', displayH1: 'Ideas, built. Decisions, explained.',
    staticSummary: WORK_INDEX_DESCRIPTION, staticHtml: renderWorkIndex(),
    lastmod: WORK_STUDIES_UPDATED, jsonLd: withIdentity(workIndexJsonLd()) };
}
