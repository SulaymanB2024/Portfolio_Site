import { WORK_STUDIES, workStudyPath } from './workStudies';
import {
  WORK_ARCHIVE,
  WORK_INDEX_TITLE,
  escapeHtml,
  workStudyArt,
  renderWorkStudy,
  renderWorkIndex,
  workStudyJsonLd,
} from './workStudyViewBase';

export {
  WORK_ARCHIVE,
  WORK_INDEX_TITLE,
  escapeHtml,
  workStudyArt,
  renderWorkStudy,
  renderWorkIndex,
  workStudyJsonLd,
};

export const WORK_INDEX_DESCRIPTION = 'Technical SEO portfolio, AI systems, graphics engineering, and investment research by Sulayman Bowles. Explore eleven project case studies and six supporting works.';

const absolute = (path: string) => path.startsWith('http') ? path : `https://sulayman-bowles.dev${path}`;

export function workIndexJsonLd() {
  const items = [...WORK_STUDIES.map(s => ({ name: s.name, href: workStudyPath(s) })), ...WORK_ARCHIVE];
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': ['WebPage', 'CollectionPage'], isPartOf: { '@id': 'https://sulayman-bowles.dev/#website' }, keywords: 'technical SEO portfolio, AI systems portfolio, financial research', '@id': 'https://sulayman-bowles.dev/work#webpage', url: absolute('/work'), name: WORK_INDEX_TITLE, description: WORK_INDEX_DESCRIPTION, mainEntity: { '@id': 'https://sulayman-bowles.dev/work#projects' } },
    { '@type': 'ItemList', '@id': 'https://sulayman-bowles.dev/work#projects', numberOfItems: items.length, itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, url: absolute(item.href) })) }
  ] };
}
