import { ARTICLE_SEARCH_TARGETS } from './articleSearchTargets';
import { PROGRAMMATIC_SEARCH_TARGETS } from './programmaticSearchTargets';

export const ALL_SEARCH_TARGETS = [
  ...ARTICLE_SEARCH_TARGETS,
  ...PROGRAMMATIC_SEARCH_TARGETS,
] as const;

export { ARTICLE_SEARCH_TARGETS, PROGRAMMATIC_SEARCH_TARGETS };
