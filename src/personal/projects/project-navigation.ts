/** A reading journey through the seven existing project accounts. */
const projectJourney = [
  { slug: 'internshipdeadlines', name: 'InternshipDeadlines' },
  { slug: 'atlas', name: 'Atlas' },
  { slug: 'sapien', name: 'Sapien' },
  { slug: 'investing-markets', name: 'Investing & Markets' },
  { slug: 'miscellaneous', name: 'Experiments' },
  { slug: 'payrollpro', name: 'PayrollPro' },
  { slug: 'viralbench', name: 'ViralBench + Codex' },
] as const

export function nextProject(slug: string) {
  const index = projectJourney.findIndex(project => project.slug === slug)
  return index < 0 ? undefined : projectJourney[(index + 1) % projectJourney.length]
}
