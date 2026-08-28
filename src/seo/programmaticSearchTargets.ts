import { PROGRAMMATIC_SEO_PAGES, type ProgrammaticPageFamily } from '../content/programmaticSeo';

export type ProgrammaticSearchTarget = {
  path: string;
  family: ProgrammaticPageFamily;
  primaryQuery: string;
  supportingQueries: readonly string[];
  directAnswer: string;
  evidenceArtifact: string;
  falsePositiveBoundary: string;
  relatedPaths: readonly string[];
};

export const PROGRAMMATIC_SEARCH_TARGETS: readonly ProgrammaticSearchTarget[] = PROGRAMMATIC_SEO_PAGES.map((page) => ({
  path: page.path,
  family: page.family,
  primaryQuery: page.primaryQuery,
  supportingQueries: page.supportingQueries,
  directAnswer: page.directAnswer,
  evidenceArtifact: page.evidenceArtifact.label,
  falsePositiveBoundary: page.falsePositiveBoundary,
  relatedPaths: page.relatedPaths,
}));

export function getProgrammaticSearchTarget(path: string): ProgrammaticSearchTarget | undefined {
  return PROGRAMMATIC_SEARCH_TARGETS.find((target) => target.path === path);
}
