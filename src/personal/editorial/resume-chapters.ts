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
  indexLabel: string
  discipline: string
  headline: string
  introduction: string
  practice: readonly ResumePracticeItem[]
  links: readonly { label: string; href: string }[]
  proof?: { value: string; label: string }
}

// Editorial context drawn from resumeProfile and resumeReview in profile-copy.ts
// (September 30, 2026). Role titles, dates, and original bullets stay in that source.
export const resumeChapters: { [Id in ResumeChapterId]: ResumeChapter & { id: Id } } = {
  chegg: {
    id: 'chegg',
    shortName: 'Chegg',
    indexLabel: 'Product Intern · Internships.com',
    discipline: 'Product & growth',
    headline: 'Internship search and interview practice.',
    introduction: 'I develop internship-search tools and growth experiments at Internships.com, drawing on student research.',
    practice: [
      { label: 'Recruiting data', text: 'I work with product, engineering, data science, and marketing to build and validate the data pipelines behind internship search.' },
      { label: 'Student growth', text: 'I use embeddings and machine learning to find patterns in public social posts and inform growth experiments for students.' },
      { label: 'Interview practice', text: 'I built an AI mock interviewer with adaptive follow-ups, conversation memory, failure recovery, and feedback after the session.' },
    ],
    links: [],
  },
  sapien: {
    id: 'sapien',
    shortName: 'Sapien',
    indexLabel: 'Growth Manager',
    discipline: 'Research & positioning',
    headline: 'Buyer use cases for simulated research.',
    introduction: 'I lead growth and positioning for a market research platform that uses simulated audiences.',
    practice: [
      { label: 'Buyer use cases', text: 'I develop buyer use cases for pricing, concept testing, messaging, and consumer research.' },
      { label: 'Editorial & SEO', text: 'I built the SEO and content function: articles, category pages, ad creative, and sales material.' },
      { label: 'Research review', text: 'I review research and validation studies to explain what they found, where they apply, and what the evidence cannot establish.' },
    ],
    links: [
      { label: 'My work at Sapien', href: '#/work/sapien' },
      { label: 'Explore Sapien', href: 'https://www.asksapien.ai/' },
    ],
  },
  void: {
    id: 'void',
    shortName: 'VOID',
    indexLabel: 'Founder',
    discipline: 'Consulting & systems',
    headline: 'Growth strategy, from plan to software.',
    introduction: 'My consulting practice combines growth strategy, financial analysis, and software for small businesses and technology clients.',
    practice: [
      { label: 'Operating plans', text: 'I develop operating plans that cover growth strategy and financial analysis.' },
      { label: 'Web & AI systems', text: 'I build software tools, web systems, and AI workflows for client operations.' },
      { label: 'Atlas', text: 'I built Atlas, a Python and SQLite console connecting website crawls, audit findings, and their supporting evidence.' },
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
    indexLabel: 'Founder & Product Lead',
    discipline: 'Product & search',
    headline: 'From internship search to application planning.',
    introduction: 'I built and launched a student product that brings internship search and application planning together.',
    practice: [
      { label: 'Recruiting records', text: 'I designed the data pipeline to validate sources, normalize listings, remove duplicates, and retain record provenance.' },
      { label: 'Search & classification', text: 'I combine local language models for role classification and query understanding with ranking across roles, employers, and locations.' },
      { label: 'Application planning', text: 'Students can research employers, prepare applications, and compare costs and offers alongside their internship search.' },
    ],
    links: [
      { label: 'The project in detail', href: '#/work/internshipdeadlines' },
      { label: 'Visit InternshipDeadlines', href: 'https://internshipdeadlines.com/' },
    ],
  },
  'creative-trace': {
    id: 'creative-trace',
    shortName: 'CreativeTrace',
    indexLabel: 'Creator · AI experimentation',
    discipline: 'Creative experimentation',
    headline: 'Creative ideas grounded in source material.',
    introduction: 'I develop AI creative concepts from patterns in public posts and video.',
    practice: [
      { label: 'Pattern research', text: 'I study public posts and video for recurring creative choices and audience engagement patterns.' },
      { label: 'Concept development', text: 'I develop hypotheses and draft concepts, linking each idea to its sources and keeping that reference material alongside it.' },
    ],
    links: [
      { label: 'Explore creative experiments', href: '#/work/miscellaneous' },
    ],
  },
  'venture-labs': {
    id: 'venture-labs',
    shortName: 'Texas Venture Labs',
    indexLabel: 'Student Associate',
    discipline: 'Commercial research',
    headline: 'Markets, pricing, and routes to market.',
    introduction: 'I research markets, pricing, and unit economics for early-stage companies.',
    practice: [
      { label: 'Market & positioning', text: 'I build market models and use the findings to recommend positioning and routes to market.' },
      { label: 'Pricing & unit economics', text: 'I build pricing and financial models, examining the unit economics of the proposed offering.' },
    ],
    links: [
      { label: 'Related markets research', href: '#/work/investing-markets' },
    ],
  },
  'ai-venture': {
    id: 'ai-venture',
    shortName: 'AI Image Venture',
    indexLabel: 'Co-founder · Product & launch',
    discipline: 'Product & launch',
    headline: 'An image-generation venture on Bittensor.',
    introduction: 'I co-founded an AI image-generation venture on Bittensor, working across product, pricing, architecture, and launch.',
    practice: [
      { label: 'Product & architecture', text: 'I defined product requirements and owned the technical architecture.' },
      { label: 'Pricing & launch', text: 'I developed pricing and the go-to-market materials for launch.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Revenue' },
  },
}
