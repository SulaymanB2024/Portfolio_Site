import { WORK_STUDIES, workStudyPath } from './workStudies';

// Compatibility surface for consumers of the first eight-project release.
// All public copy is authored once, in workStudies.ts.
export const additionalWorkProofCards = WORK_STUDIES.map(study => ({
  id: study.legacyId,
  eyebrow: study.discipline,
  title: study.name,
  href: workStudyPath(study),
  problem: study.premise,
  role: study.role,
  built: study.description,
  constraints: study.scope,
  status: study.result,
  statusLabel: study.status,
  projectLabel: 'Read the case study',
  evidenceLabel: study.links[0]?.label ?? null,
  evidenceHref: study.links[0]?.href ?? null,
  notPublic: study.scope,
}));
