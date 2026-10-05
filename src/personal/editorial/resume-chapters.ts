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
      { label: 'Recruiting data', text: 'I build and validate recruiting-data pipelines with product, engineering, data science, and marketing teams, connecting the data work to internship-search workflows.' },
      { label: 'Student research', text: 'I analyze public social posts with embeddings and machine learning, using the patterns to inform growth experiments aimed at students.' },
      { label: 'Interview practice', text: 'I built an AI mock interviewer that remembers the conversation, asks adaptive follow-ups, recovers from failures, and gives feedback after the interview.' },
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
      { label: 'Buyer use cases', text: 'I turn pricing, concept-testing, and messaging questions into examples that show a buyer how simulated-audience research could be used.' },
      { label: 'Research synthesis', text: 'I review research and validation studies before explaining a finding, preserving the audience, comparison, and limits of what the results support.' },
      { label: 'Content function', text: 'I built Sapien’s SEO and content function: articles, category pages, ad creative, and sales material explaining the platform’s research applications.' },
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
      { label: 'Operating plans', text: 'I turn growth strategy and financial analysis into operating plans for small businesses and technology clients.' },
      { label: 'Website systems', text: 'I build web systems and AI workflows for client operations. My consulting work spans the business analysis and the software itself.' },
      { label: 'Atlas console', text: 'I built Atlas in Python and SQLite. Website crawls, internal-link maps, and audit findings stay connected to evidence that can be inspected.' },
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
      { label: 'Source validation', text: 'I validate sources, standardize listings, and remove duplicates while retaining provenance. Historical records, unconfirmed details, and recent source checks remain distinguishable.' },
      { label: 'Role search', text: 'I combine local language models for classification and query understanding with search ranking, matching a student’s search to roles, employers, and locations.' },
      { label: 'Application planning', text: 'I connect each saved role to a next action, personal target date, and notes. Employer research, preparation, and offer comparisons support the next decision.' },
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
      { label: 'Post analysis', text: 'I examine public posts and video for recurring creative and engagement patterns, retaining the source material for review.' },
      { label: 'Pattern grouping', text: 'I group recurring observations into creative hypotheses, making the connection between an observed pattern and a proposed concept explicit.' },
      { label: 'Concept development', text: 'I develop draft creative concepts linked to their sources, so the reference material remains available alongside the idea.' },
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
      { label: 'Market research', text: 'I investigate markets for early-stage companies and assess how each company could position itself.' },
      { label: 'Pricing models', text: 'I build pricing and financial models, using unit economics to examine the business behind a proposed offering.' },
      { label: 'Founder recommendations', text: 'I bring the market, pricing, and financial work together into recommendations on positioning and routes to market.' },
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
      { label: 'Product requirements', text: 'I co-founded an image-generation venture on Bittensor. I defined product requirements and owned the product and launch strategy.' },
      { label: 'Technical architecture', text: 'I owned the venture’s technical architecture, alongside product requirements, pricing, and go-to-market materials.' },
      { label: 'Pricing and launch', text: 'I developed pricing and go-to-market materials for the launch. The venture grew to $100K in revenue during my time as co-founder.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Revenue' },
  },
}
