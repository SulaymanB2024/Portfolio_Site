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
    introduction: 'Internships.com is Chegg’s internship-search platform. I work there as a product intern on growth, developing workflows and AI tools for students.',
    practice: [
      { label: 'Recruiting data', text: 'Build and validate recruiting-data pipelines with product, engineering, data science, and marketing teams for Internships.com’s internship-search workflows.' },
      { label: 'Growth experiments', text: 'Analyze public social posts with embeddings and machine learning, using recurring patterns to inform growth experiments focused on students.' },
      { label: 'Interview practice', text: 'Built an AI mock interviewer with adaptive follow-ups, conversation memory, failure recovery, and feedback after the session.' },
    ],
    links: [],
  },
  sapien: {
    id: 'sapien',
    shortName: 'Sapien',
    indexLabel: 'Growth Manager',
    discipline: 'Research & positioning',
    headline: 'Buyer use cases for simulated research.',
    introduction: 'At Sapien, I lead growth and positioning for a market research platform that uses simulated audiences.',
    practice: [
      { label: 'Buyer questions', text: 'Develop buyer use cases around pricing decisions, concept testing, messaging, and consumer research for the simulated-audience platform.' },
      { label: 'Editorial & SEO', text: 'Built the SEO and content function, including articles, category pages, ad creative, and sales material explaining the platform’s applications.' },
      { label: 'Evidence review', text: 'Review research and validation studies to explain use cases, specific findings, and the limits of what the evidence supports.' },
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
    introduction: 'VOID is my consulting practice for small businesses and technology clients.',
    practice: [
      { label: 'Operating plans', text: 'Develop operating plans for small businesses and technology clients, with work spanning growth strategy and financial analysis.' },
      { label: 'Web & AI systems', text: 'Build software tools, web systems, and AI workflows for small-business operations and technology clients.' },
      { label: 'Atlas', text: 'Built Atlas, a Python and SQLite console for website crawls, audit findings, and the evidence associated with them.' },
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
    introduction: 'I founded and launched InternshipDeadlines, a student product for internship search and application planning.',
    practice: [
      { label: 'Recruiting records', text: 'Designed a recruiting-data pipeline with source validation, listing normalization, deduplication, and provenance retained for the collected records.' },
      { label: 'Search & classification', text: 'Combine local language models for role classification and query understanding with search ranking across roles, employers, and locations.' },
      { label: 'Application decisions', text: 'The product includes employer research, application preparation, and cost and offer comparisons alongside internship search and planning.' },
    ],
    links: [
      { label: 'Read the project story', href: '#/work/internshipdeadlines' },
      { label: 'Visit InternshipDeadlines', href: 'https://internshipdeadlines.com/' },
    ],
  },
  'creative-trace': {
    id: 'creative-trace',
    shortName: 'CreativeTrace',
    indexLabel: 'Creator · AI experimentation',
    discipline: 'Creative experimentation',
    headline: 'Creative ideas grounded in source material.',
    introduction: 'I use public posts and video as reference material for AI creative experiments.',
    practice: [
      { label: 'Observe patterns', text: 'Analyze public posts and video, looking for recurring patterns in creative choices and audience engagement.' },
      { label: 'Develop concepts', text: 'Develop hypotheses and draft concepts linked to their source posts and video, retaining the reference material alongside each proposed idea.' },
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
    introduction: 'As a student associate at Texas Venture Labs, I research markets, pricing, and unit economics for early-stage companies.',
    practice: [
      { label: 'Market & positioning', text: 'Research markets and build models for early-stage companies, using the findings to recommend positioning and routes to market.' },
      { label: 'Pricing & unit economics', text: 'Build pricing and financial models for early-stage companies, including analysis of unit economics for the proposed offering.' },
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
    introduction: 'I co-founded the venture and owned its product and go-to-market work.',
    practice: [
      { label: 'Product & architecture', text: 'Defined product requirements and owned the technical architecture for the image-generation venture on Bittensor.' },
      { label: 'Pricing & launch', text: 'Developed pricing and go-to-market materials for the launch.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Revenue' },
  },
}
