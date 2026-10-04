export type ResumeChapterId =
  | 'chegg'
  | 'sapien'
  | 'void'
  | 'internship-deadlines'
  | 'creative-trace'
  | 'venture-labs'
  | 'ai-venture'

export interface ResumePracticeItem {
  label: string
  text: string
}

export interface ResumeChapter {
  id: ResumeChapterId
  shortName: string
  discipline: string
  headline: string
  introduction: string
  practice: readonly [ResumePracticeItem, ResumePracticeItem, ResumePracticeItem]
  links: readonly { label: string; href: string }[]
  proof?: { value: string; label: string }
}

// Editorial context drawn from resumeProfile and resumeReview in profile-copy.ts
// (September 30, 2026). Role titles, dates, and original bullets stay in that source.
export const resumeChapters: { [Id in ResumeChapterId]: ResumeChapter & { id: Id } } = {
  chegg: {
    id: 'chegg',
    shortName: 'Chegg',
    discipline: 'Product & growth',
    headline: 'Internship search and AI tools.',
    introduction: 'At Chegg, I build internship-search workflows and AI tools with product, engineering, data science, and marketing teams.',
    practice: [
      { label: 'Recruiting data', text: 'Build and validate recruiting-data pipelines.' },
      { label: 'Student research', text: 'Analyze public posts with embeddings and machine learning to inform student-focused growth experiments.' },
      { label: 'Interview practice', text: 'An AI mock interviewer with adaptive follow-ups, memory, failure recovery, and feedback.' },
    ],
    links: [],
  },
  sapien: {
    id: 'sapien',
    shortName: 'Sapien',
    discipline: 'Research & positioning',
    headline: 'Positioning an AI research platform.',
    introduction: 'I lead growth and positioning for a market research platform using simulated audiences.',
    practice: [
      { label: 'Buyer use cases', text: 'Develop use cases for pricing, concept testing, messaging, and consumer research.' },
      { label: 'Research synthesis', text: 'Assess research and validation studies to explain findings and limits.' },
      { label: 'Content function', text: 'Build editorial and search content, category pages, ad creative, and sales material.' },
    ],
    links: [
      { label: 'My work at Sapien', href: '#/work/sapien' },
      { label: 'Explore Sapien', href: 'https://www.asksapien.ai/' },
    ],
  },
  void: {
    id: 'void',
    shortName: 'VOID',
    discipline: 'Consulting & systems',
    headline: 'Growth strategy, analysis, and software.',
    introduction: 'I founded a consulting practice for small businesses and technology clients.',
    practice: [
      { label: 'Operating plans', text: 'Develop operating plans through growth strategy and financial analysis.' },
      { label: 'Website systems', text: 'Build web systems and AI workflows for client operations.' },
      { label: 'Atlas console', text: 'A Python and SQLite website audit console that keeps findings traceable.' },
    ],
    links: [
      { label: 'Explore Atlas', href: '#/work/atlas' },
      { label: 'Visit VOID', href: 'https://www.void-agency.com/' },
    ],
    proof: { value: '$50K+', label: 'Collected revenue' },
  },
  'internship-deadlines': {
    id: 'internship-deadlines',
    shortName: 'Internship Deadlines',
    discipline: 'Product & search',
    headline: 'Find internships. Plan applications.',
    introduction: 'I founded and launched InternshipDeadlines, from the recruiting-data pipeline to the student interface.',
    practice: [
      { label: 'Source validation', text: 'Validate sources, normalize listings, remove duplicates, and retain provenance.' },
      { label: 'Role search', text: 'Combine local language models for classification and query understanding with search ranking.' },
      { label: 'Application planning', text: 'Connect role search with employer research, preparation, and cost and offer comparisons.' },
    ],
    links: [
      { label: 'Read the project story', href: '#/work/internshipdeadlines' },
      { label: 'Visit InternshipDeadlines', href: 'https://internshipdeadlines.com/' },
    ],
  },
  'creative-trace': {
    id: 'creative-trace',
    shortName: 'CreativeTrace',
    discipline: 'Creative experimentation',
    headline: 'From observed patterns to creative concepts.',
    introduction: 'I use public posts and video to develop creative hypotheses, retaining the sources for review.',
    practice: [
      { label: 'Post analysis', text: 'Analyze public posts and video for creative and engagement patterns.' },
      { label: 'Pattern grouping', text: 'Group recurring patterns into creative hypotheses.' },
      { label: 'Concept development', text: 'Develop draft concepts linked to their source material.' },
    ],
    links: [
      { label: 'Explore creative experiments', href: '#/work/miscellaneous' },
    ],
  },
  'venture-labs': {
    id: 'venture-labs',
    shortName: 'Texas Venture Labs',
    discipline: 'Commercial research',
    headline: 'Market research for early-stage companies.',
    introduction: 'At Texas Venture Labs, I research commercial questions for early-stage companies.',
    practice: [
      { label: 'Market research', text: 'Investigate the market and the company’s position within it.' },
      { label: 'Pricing models', text: 'Model pricing and unit economics.' },
      { label: 'Founder recommendations', text: 'Recommend positioning and routes to market.' },
    ],
    links: [
      { label: 'Related markets research', href: '#/work/investing-markets' },
    ],
  },
  'ai-venture': {
    id: 'ai-venture',
    shortName: 'AI Image Venture',
    discipline: 'Product & launch',
    headline: 'An image-generation venture on Bittensor.',
    introduction: 'I co-founded the venture and owned its product and launch strategy.',
    practice: [
      { label: 'Product requirements', text: 'Define the product requirements.' },
      { label: 'Technical architecture', text: 'Own the technical architecture.' },
      { label: 'Pricing and launch', text: 'Develop pricing and go-to-market materials.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Revenue' },
  },
}
