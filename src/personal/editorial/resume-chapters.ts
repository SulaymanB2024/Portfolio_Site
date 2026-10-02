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
    headline: 'Understand the student. Build the next step.',
    introduction: 'At Chegg, I work on internship discovery and AI tools for students. I connect research into student needs with recruiting data and product experiments, working across product, engineering, data science, and marketing. I also built an AI mock interviewer that adapts its follow-up questions, remembers the conversation, and provides feedback.',
    practice: [
      { label: 'Recruiting data', text: 'Build and validate pipelines with the teams using recruiting information in the product.' },
      { label: 'Student research', text: 'Use embeddings and machine learning to study public posts and develop growth experiments around student needs.' },
      { label: 'Interview practice', text: 'Build adaptive follow-ups, conversation memory, failure recovery, and feedback into an AI mock interviewer.' },
    ],
    links: [],
  },
  sapien: {
    id: 'sapien',
    shortName: 'Sapien',
    discipline: 'Research & positioning',
    headline: 'Give the research a useful question.',
    introduction: 'I lead growth and positioning at Sapien, an AI market-research platform built around simulated populations. My work connects its capabilities to decisions about pricing, products, and messaging. I turn research and validation studies into examples, editorial work, and commercial narratives that help buyers understand what they could investigate.',
    practice: [
      { label: 'Buyer use cases', text: 'Connect the platform to pricing decisions, concept testing, messaging, and consumer research.' },
      { label: 'Research synthesis', text: 'Read research and validation studies, then develop clear claims and examples around the questions buyers ask.' },
      { label: 'Content function', text: 'Build editorial work, search and category pages, ad creative, and sales narratives around those use cases.' },
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
    headline: 'Turn a business problem into working tools.',
    introduction: 'I founded VOID to work across the commercial and technical parts of a business problem. The practice covers growth strategy, financial analysis, AI workflows, and website systems for SMB and technology clients. Atlas grew from that work: a Python and SQLite console connecting website crawls to technical findings and their evidence.',
    practice: [
      { label: 'Operating plans', text: 'Translate client problems into plans and working tools, drawing on growth strategy and financial analysis.' },
      { label: 'Website systems', text: 'Build web systems and AI workflows around the work a client needs to accomplish.' },
      { label: 'Atlas console', text: 'Connect crawled pages, technical findings, and supporting evidence in a Python and SQLite audit console.' },
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
    headline: 'Bring the search and the plan together.',
    introduction: 'I founded and launched InternshipDeadlines to connect finding an internship with preparing for it. I work on the information underneath the product as well as the student workflow: validating sources, organizing role records, improving search, and bringing employer research, preparation, and offer comparisons into the same place.',
    practice: [
      { label: 'Source validation', text: 'Validate sources, normalize role records, remove duplicates, and preserve where the information came from.' },
      { label: 'Role search', text: 'Use local language models for classification and query understanding alongside ranking and relevance work.' },
      { label: 'Application planning', text: 'Connect discovery with employer research, preparation resources, and tools for comparing costs and offers.' },
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
    headline: 'Follow a pattern toward something worth testing.',
    introduction: 'With CreativeTrace, I explore how public posts and video can inform new creative ideas. I look for recurring creative and engagement patterns, group what I find, and turn those observations into hypotheses and draft concepts. Keeping a path back to the source material gives each idea something concrete to examine.',
    practice: [
      { label: 'Post analysis', text: 'Combine analysis of public posts with video understanding to examine creative and engagement patterns.' },
      { label: 'Pattern grouping', text: 'Group recurring observations so they can inform specific creative hypotheses.' },
      { label: 'Concept development', text: 'Turn observations into draft concepts while retaining a path back to the material that informed them.' },
    ],
    links: [
      { label: 'Explore creative experiments', href: '#/work/miscellaneous' },
    ],
  },
  'venture-labs': {
    id: 'venture-labs',
    shortName: 'Texas Venture Labs',
    discipline: 'Commercial research',
    headline: 'Make the commercial question concrete.',
    introduction: 'At Texas Venture Labs, I research commercial questions for early-stage companies. I use market research, pricing work, and financial models to examine positioning, unit economics, and routes to market. The work becomes recommendations a founder can use when considering the business and its next decisions.',
    practice: [
      { label: 'Market research', text: 'Investigate a company’s market and positioning in the context of its commercial question.' },
      { label: 'Pricing models', text: 'Examine pricing and unit economics through financial models.' },
      { label: 'Founder recommendations', text: 'Synthesize the research into recommendations about positioning and routes to market.' },
    ],
    links: [
      { label: 'Related markets research', href: '#/work/investing-markets' },
    ],
  },
  'ai-venture': {
    id: 'ai-venture',
    shortName: 'AI Image Venture',
    discipline: 'Product & launch',
    headline: 'Shape the product and how it reaches people.',
    introduction: 'I co-founded an AI image-generation venture on Bittensor, working across what the product needed to do and how we would bring it to market. I owned product requirements, pricing, technical architecture, and launch materials. That work joined decisions about the software with decisions about the offer.',
    practice: [
      { label: 'Product requirements', text: 'Define the requirements for the image-generation product.' },
      { label: 'Technical architecture', text: 'Own the technical architecture of the venture built on Bittensor.' },
      { label: 'Pricing and launch', text: 'Develop pricing and go-to-market materials for the venture.' },
    ],
    links: [],
    proof: { value: '$100K', label: 'Revenue' },
  },
}
