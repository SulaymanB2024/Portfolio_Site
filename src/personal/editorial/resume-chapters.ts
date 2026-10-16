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
// (reviewed October 12, 2026). Role titles, dates, and current bullets stay in that source.
export const resumeChapters: { [Id in ResumeChapterId]: ResumeChapter & { id: Id } } = {
  chegg: {
    id: 'chegg',
    shortName: 'Chegg',
    indexLabel: 'Product Intern · Internships.com',
    discipline: 'Product & growth',
    headline: 'Reliable data for internship search.',
    introduction: 'At Chegg’s Internships.com, I work on the data, search and content that help students find internships and prepare to apply.',
    practice: [
      { label: 'Internship data', text: 'Built scrapers and recruiting-data pipelines that validate sources, normalize listings and retain provenance. I work across product, engineering, data science and marketing.' },
      { label: 'Search & SEO', text: 'Develop SEO strategy around student questions and application content. I use embeddings and machine learning to analyze public posts and inform growth experiments.' },
      { label: 'Interview practice', text: 'Built an AI mock interviewer with adaptive follow-ups, conversation memory, failure recovery and feedback after each session.' },
    ],
    links: [{ label: 'Internships.com', href: 'https://www.internships.com/' }],
  },
  sapien: {
    id: 'sapien',
    shortName: 'Sapien',
    indexLabel: 'Growth Manager',
    discipline: 'Research & positioning',
    headline: 'Connecting research to buyer decisions.',
    introduction: 'I lead growth and positioning for Sapien, translating its simulated-audience research into concrete uses for buyers.',
    practice: [
      { label: 'Buyer use cases', text: 'Develop use cases for pricing, concept testing, messaging and consumer research with simulated audiences.' },
      { label: 'Content & SEO', text: 'Built the editorial and SEO function across articles, category pages, ad creative and sales material.' },
      { label: 'Research into positioning', text: 'Review research and validation studies, then explain the findings, appropriate use cases and limits in buyer-facing material.' },
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
    headline: 'From operating decisions to working software.',
    introduction: 'At VOID, I combine growth strategy, financial analysis and software for small businesses and technology clients.',
    practice: [
      { label: 'Strategy & planning', text: 'Develop operating plans that connect growth priorities with financial analysis and practical next steps.' },
      { label: 'Client systems', text: 'Build web systems, software tools and AI workflows for client operations.' },
      { label: 'Atlas', text: 'Built a Python and SQLite audit console that links each recommendation to its captured page, link or measurement. Findings remain traceable through review and export.' },
    ],
    links: [
      { label: 'Explore Atlas', href: '#/work/atlas' },
      { label: 'Visit VOID', href: 'https://www.void-agency.com/' },
    ],
    proof: { value: '$50K+', label: 'Collected revenue' },
  },
  'internship-deadlines': {
    id: 'internship-deadlines',
    shortName: 'Chegg · Internships.com',
    indexLabel: 'Product Intern · Internships.com',
    discipline: 'Product & search',
    headline: 'From internship search to application planning.',
    introduction: 'My internship-data and search work belongs to my product role at Chegg, working on Internships.com.',
    practice: [
      { label: 'Recruiting records', text: 'I designed the data pipeline to validate sources, normalize listings, remove duplicates, and retain record provenance.' },
      { label: 'Search & classification', text: 'I combine local language models for role classification and query understanding with ranking across roles, employers, and locations.' },
      { label: 'Application planning', text: 'Students can research employers, prepare applications, and compare costs and offers alongside their internship search.' },
    ],
    links: [
      { label: 'The project in detail', href: '#/work/internshipdeadlines' },
      { label: 'Internships.com', href: 'https://www.internships.com/' },
    ],
  },
  'creative-trace': {
    id: 'creative-trace',
    shortName: 'CreativeTrace',
    indexLabel: 'Creator · AI experimentation',
    discipline: 'Creative experimentation',
    headline: 'Creative concepts with a traceable starting point.',
    introduction: 'I use AI to develop creative concepts from patterns in public posts and video.',
    practice: [
      { label: 'Source research', text: 'Study recurring creative choices and audience engagement patterns in public posts and video.' },
      { label: 'Creative development', text: 'Turn those observations into hypotheses and draft concepts, keeping each idea linked to its source material.' },
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
    headline: 'Testing a young company’s commercial assumptions.',
    introduction: 'At Texas Venture Labs, I research markets, pricing and unit economics to inform early-stage companies’ positioning and routes to market.',
    practice: [
      { label: 'Market models', text: 'Build market models to examine the opportunity and recommend positioning and routes to market.' },
      { label: 'Pricing & financial models', text: 'Model pricing and financial assumptions, then examine the unit economics of the proposed offering.' },
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
    headline: 'Product, pricing and launch for AI images.',
    introduction: 'I co-founded an image-generation venture on Bittensor and owned product requirements, technical architecture, pricing and go-to-market materials.',
    practice: [
      { label: 'Product & architecture', text: 'Defined the product requirements and technical architecture for the image-generation offering.' },
      { label: 'Pricing & launch', text: 'Developed pricing and go-to-market materials for launch.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Venture revenue' },
  },
}
