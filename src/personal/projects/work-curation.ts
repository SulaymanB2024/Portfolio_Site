/** Roles and implementation states from the retained project narratives and source records. */
export const workContributions: Record<string, { role: string; status: string; decision: string }> = {
  internshipdeadlines: {
    role: 'Founder & product lead',
    status: 'Public product',
    decision: 'Keep the employer’s record separate from the student’s application plan.',
  },
  atlas: {
    role: 'Founder · Product & engineering',
    status: 'Local workflow shipped',
    decision: 'Keep each finding connected to the capture, rule, and measurements behind it.',
  },
  sapien: {
    role: 'Growth Manager',
    status: 'Published content & buyer guides',
    decision: 'Structure the explanation around the research question a buyer needs to answer.',
  },
}

export const featuredWorkSlugs = ['internshipdeadlines', 'atlas', 'sapien'] as const

/** Continue through the same selection shown on Work; retain other case-study exits. */
export function curatedNextProject(slug: string) {
  const sequence = [
    { slug: 'internshipdeadlines', name: 'InternshipDeadlines', category: 'Product' },
    { slug: 'atlas', name: 'Atlas', category: 'Product & systems' },
    { slug: 'sapien', name: 'Sapien', category: 'AI' },
    { slug: 'investing-markets', name: 'Investing & Markets', category: 'Markets' },
    { slug: 'miscellaneous', name: 'Experiments', category: 'Experiments' },
  ]
  const index = sequence.findIndex(project => project.slug === slug)
  return index < 0 ? undefined : sequence[(index + 1) % sequence.length]
}
