export const caseStudies = [
  {
    slug: 'atlas', number: '01', name: 'Atlas', category: 'Product & systems',
    title: 'See the page behind the finding.',
    summary: 'A website audit console connecting findings to pages, measurements, and rules.',
    role: 'Founder · Product & engineering', period: '2026',
    status: 'Core workflow shipped', medium: 'Python / SQLite / Web',
    caption: 'Capture the page. Inspect the finding. Review the recommendation.',
    chapters: ['The question', 'The system', 'Inspect the evidence', 'Decisions & tradeoffs', 'Source material'],
    source: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
  },
  {
    slug: 'payrollpro', number: '02', name: 'PayrollPro', category: 'Hackathon prototype',
    title: 'Private pay. Shared control.',
    summary: 'A Solana prototype combining confidential payroll, collective treasury approval, and audit visibility.',
    role: 'Team lead · Three-person team', period: 'June 2025',
    status: 'Hackathon prototype', medium: 'Solana / Token-2022',
    caption: 'Protect the amount. Authorize the transfer. Retain the record.',
    chapters: ['The question', 'The architecture', 'What the prototype establishes', 'Source material'],
    source: 'https://sulayman-bowles.tech/competitions/oniondao-payrollpro',
  },
  {
    slug: 'viralbench', number: '03', name: 'ViralBench + Codex', category: 'AI systems research',
    title: 'Improve the agent. Test the change.',
    summary: 'A proposed workflow for agent trace review, replay, and independent evaluation.',
    role: 'Code audit · Evaluation design', period: 'July 2026',
    status: 'Published engineering design', medium: 'Agent traces / Replay / Evaluation',
    caption: 'The engineering agent proposes changes; independent reviewers approve release.',
    chapters: ['The question', 'The improvement loop', 'Design boundaries', 'Source material'],
    source: '#/writing/viralbench-codex-agent-harness',
  },
] as const

export type CaseStudy = typeof caseStudies[number]
export type CaseStudySlug = CaseStudy['slug']
export const findCaseStudy = (route: string) => caseStudies.find(study => route === `work/${study.slug}`)

export const chapterId = (index: number) => `study-section-${index + 1}`
