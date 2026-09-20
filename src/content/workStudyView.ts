import { WORK_STUDIES, WORK_STUDIES_UPDATED, workStudyPath, workStudyUpdatedDate, type WorkStudy } from './workStudies';
import {
  WORK_ARCHIVE,
  WORK_INDEX_TITLE,
  escapeHtml,
  workStudyArt,
  renderWorkStudy as renderWorkStudyBase,
  renderWorkIndex,
  workStudyJsonLd as workStudyJsonLdBase,
} from './workStudyViewBase';

export {
  WORK_ARCHIVE,
  WORK_INDEX_TITLE,
  escapeHtml,
  workStudyArt,
  renderWorkIndex,
};

export const WORK_INDEX_DESCRIPTION = 'Technical SEO portfolio, AI systems, graphics engineering, and investment research by Sulayman Bowles. Explore twelve project case studies and six supporting works.';

const absolute = (path: string) => path.startsWith('http') ? path : `https://sulayman-bowles.dev${path}`;
const updatedLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});

export function renderWorkStudy(study: WorkStudy) {
  const html = renderWorkStudyBase(study);
  const updated = workStudyUpdatedDate(study);
  if (updated === WORK_STUDIES_UPDATED) return html;
  return html.replace(`Case study updated ${updatedLabel(WORK_STUDIES_UPDATED)}.`, `Case study updated ${updatedLabel(updated)}.`);
}

export function workStudyJsonLd(study: WorkStudy) {
  const schema = workStudyJsonLdBase(study) as { '@context': string; '@graph': Array<Record<string, unknown>> };
  const updated = workStudyUpdatedDate(study);
  if (updated === WORK_STUDIES_UPDATED) return schema;
  return {
    ...schema,
    '@graph': schema['@graph'].map(node => node.dateModified ? { ...node, dateModified: updated } : node),
  };
}

export function workIndexJsonLd() {
  const items = [...WORK_STUDIES.map(s => ({ name: s.name, href: workStudyPath(s) })), ...WORK_ARCHIVE];
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': ['WebPage', 'CollectionPage'], isPartOf: { '@id': 'https://sulayman-bowles.dev/#website' }, keywords: 'technical SEO portfolio, AI systems portfolio, financial research', '@id': 'https://sulayman-bowles.dev/work#webpage', url: absolute('/work'), name: WORK_INDEX_TITLE, description: WORK_INDEX_DESCRIPTION, mainEntity: { '@id': 'https://sulayman-bowles.dev/work#projects' } },
    { '@type': 'ItemList', '@id': 'https://sulayman-bowles.dev/work#projects', numberOfItems: items.length, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: absolute(item.href) })) }
  ] };
}
