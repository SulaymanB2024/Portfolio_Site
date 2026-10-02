export const caseStudies = [
  {
    slug: 'atlas', number: '01', name: 'Atlas', category: 'Product & systems',
    title: 'From a crawl to a defensible decision.',
    summary: 'A technical SEO console that keeps every recommendation connected to the page, the observation, and the evidence behind it.',
    role: 'Founder · Product & engineering', period: '2026',
    status: 'Core workflow shipped', medium: 'Python / SQLite / Web',
    caption: 'Source → observation → review. The evidence travels with the finding.',
    chapters: ['The question', 'The system', 'Inspect the evidence', 'Decisions & tradeoffs', 'Source material'],
    source: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
  },
  {
    slug: 'payrollpro', number: '02', name: 'PayrollPro', category: 'Hackathon prototype',
    title: 'Private pay. Shared control.',
    summary: 'A Solana payroll prototype exploring how confidential transfers, collective treasury approval, and audit visibility can work together.',
    role: 'Team lead · Three-person team', period: 'June 2025',
    status: 'Hackathon prototype', medium: 'Solana / Token-2022',
    caption: 'Three responsibilities: protect the amount, authorize the transfer, retain the record.',
    chapters: ['The question', 'The architecture', 'What the prototype establishes', 'Source material'],
    source: 'https://sulayman-bowles.tech/competitions/oniondao-payrollpro',
  },
  {
    slug: 'viralbench', number: '03', name: 'ViralBench + Codex', category: 'AI systems research',
    title: 'Make the agent better. Keep the experiment honest.',
    summary: 'An engineering design for a bounded improvement loop: inspect an agent’s trace, propose a change, replay the evidence, and review the result.',
    role: 'Code audit · Evaluation design', period: 'July 2026',
    status: 'Published engineering design', medium: 'Agent traces / Replay / Evaluation',
    caption: 'A candidate returns to review. The engineering agent does not approve its own release.',
    chapters: ['The question', 'The improvement loop', 'Design boundaries', 'Source material'],
    source: '#/writing/viralbench-codex-agent-harness',
  },
] as const

export type CaseStudy = typeof caseStudies[number]
export type CaseStudySlug = CaseStudy['slug']
export const findCaseStudy = (route: string) => caseStudies.find(study => route === `work/${study.slug}`)

export const chapterId = (index: number) => `study-section-${index + 1}`
