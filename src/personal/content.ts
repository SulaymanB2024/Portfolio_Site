export type ArtKind = 'helmet' | 'crystal' | 'ribbon' | 'globe' | 'cross'
export type ProjectCategory = 'Product' | 'AI' | 'Markets' | 'Experiments'
export interface Project {
  slug: string
  number: string
  name: string
  kind: ArtKind
  category: ProjectCategory
  tags: string[]
  summary: string
  headline: string[]
  overview: string
  areas: { title: string; description: string }[]
  link?: { label: string; href: string }
}
export const contact = {
  email: 'sulayman.bowles@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sulayman-bowles',
  location: 'Austin, TX',
}
export const projects: Project[] = [
  {
    slug: 'internshipdeadlines', number: '01', name: 'InternshipDeadlines', kind: 'crystal', category: 'Product',
    tags: ['Product', 'Search', 'Data systems'],
    summary: 'I built a place to find internships, research employers, and plan applications.',
    headline: ['Find the role.', 'Plan the application.'],
    overview: 'I built InternshipDeadlines and its data pipeline to connect role search, employer research, and application planning. Each listing retains its source.',
    areas: [
      { title: 'Source validation', description: 'Validate sources, standardize listings, and remove duplicates while preserving provenance.' },
      { title: 'Role search', description: 'Classify and rank listings by role, company, and location.' },
      { title: 'Dates & availability', description: 'Distinguish deadlines, start dates, and unknown dates. Retain the source for each record.' },
      { title: 'Application planning', description: 'Connect saved roles with employer research, preparation, and cost and offer comparisons.' },
    ],
    link: { label: 'Find internships', href: 'https://internshipdeadlines.com/' },
  },
  {
    slug: 'sapien', number: '02', name: 'Sapien', kind: 'ribbon', category: 'AI',
    tags: ['AI research', 'Growth', 'Storytelling'],
    summary: 'I lead growth and positioning for a market research platform using simulated audiences.',
    headline: ['Explaining', 'simulated audiences.'],
    overview: 'Sapien uses simulated populations to explore responses to products, prices, and messages. I develop buyer use cases, articles, videos, and sales material, distinguishing modeled responses from observed behavior.',
    areas: [
      { title: 'Positioning & use cases', description: 'Explain how the platform supports pricing, concept testing, messaging, and consumer research.' },
      { title: 'Research synthesis', description: 'Review academic work, validation studies, and competing methods to assess claims and limits.' },
      { title: 'Articles & explainers', description: 'Develop articles, recorded explainers, creative briefs, and examples from the research.' },
      { title: 'Content & growth', description: 'Build search content, ad creative, and sales material around buyer questions.' },
    ],
    link: { label: 'See how Sapien works', href: 'https://www.asksapien.ai/' },
  },
  {
    slug: 'investing-markets', number: '03', name: 'Investing & Markets', kind: 'globe', category: 'Markets',
    tags: ['Finance', 'Energy', 'Research'],
    summary: 'I study the contracts and cash flows behind infrastructure, energy, and digital assets.',
    headline: ['Rights, revenue,', 'and risk.'],
    overview: 'I study finance at UT Austin. My venture research and independent writing examine control, cash flow, and risk across Texas toll roads, energy markets, and digital assets.',
    areas: [
      { title: 'Infrastructure & cash flows', description: 'Trace ownership, revenue rights, financing, and risk through the contracts.' },
      { title: 'Energy markets', description: 'Study how infrastructure, prices, and physical constraints shape energy markets.' },
      { title: 'Digital assets', description: 'Examine protocols, market structure, valuation, and investment assumptions.' },
      { title: 'Early-stage businesses', description: 'Use customer research, pricing, and financial models to inform founder decisions.' },
    ],
  },
  {
    slug: 'miscellaneous', number: '04', name: 'Experiments', kind: 'cross', category: 'Experiments',
    tags: ['Creative research', 'Graphics', 'Tools'],
    summary: 'Tools and studies in light, texture, and motion.',
    headline: ['Light, texture,', 'motion.'],
    overview: 'This site combines historical objects, procedural sculptures, and credited generative artwork in a study of ink on paper. Other experiments explore creative research and small tools.',
    areas: [
      { title: 'CreativeTrace', description: 'Study public posts and video to develop creative hypotheses and concepts.' },
      { title: 'Light, texture & movement', description: 'Explore ordered dithering, 3D rendering, and motion.' },
      { title: 'Objects & materials', description: 'Historical objects and material studies, with controls and attribution.' },
      { title: 'Research & automation', description: 'Build research and automation tools for recurring tasks.' },
    ],
    link: { label: 'Try the shader study', href: './shader.html' },
  },
  {
    slug: 'chegg', number: '01', name: 'Chegg', kind: 'globe', category: 'Product',
    tags: ['Product', 'Student research', 'AI tools'],
    summary: 'Internship search and AI tools, built around the student journey at Internships.com.',
    headline: ['Research becomes', 'a useful product.'],
    overview: 'As Product Intern, Growth at Chegg, I develop internship-search workflows and AI tools for Internships.com through student research, recruiting-data pipelines and cross-functional product work.',
    areas: [
      { title: 'Student research', description: 'Connect student research with internship-search workflows and AI tools.' },
      { title: 'Recruiting data', description: 'Build and validate recruiting-data pipelines with product, engineering, data science and marketing.' },
      { title: 'AI mock interviewer', description: 'Adaptive follow-ups, conversation memory, failure recovery and feedback.' },
      { title: 'Growth research', description: 'Analyze public social posts with embeddings and machine learning to inform student-focused experiments.' },
    ],
    link: { label: 'Internships.com', href: 'https://www.internships.com/' },
  },
  {
    slug: 'void', number: '03', name: 'VOID', kind: 'crystal', category: 'Product',
    tags: ['Strategy', 'Engineering', 'AI workflows'],
    summary: 'A consultancy connecting business decisions with working software. Atlas is one of the systems I built.',
    headline: ['From a question', 'to a working system.'],
    overview: 'I founded VOID to build operating plans, financial analysis, AI workflows and web systems for small businesses and technology clients. Atlas, a Python and SQLite website audit console, makes the engineering work inspectable.',
    areas: [
      { title: 'Operating plans', description: 'Develop growth strategy, financial analysis and operating plans for client decisions.' },
      { title: 'Software delivery', description: 'Build AI workflows and web systems around the work a business needs to do.' },
      { title: 'Atlas', description: 'Connect website crawls, findings and measurements with retained evidence.' },
      { title: 'Reviewable records', description: 'Keep source captures, interpretation versions and collection gaps available for review.' },
    ],
    link: { label: 'VOID', href: 'https://www.void-agency.com/' },
  },
]

/** The primary Work journey; the full catalog above preserves existing routes. */
export const featuredProjectSlugs = ['chegg', 'sapien', 'void', 'miscellaneous'] as const
export const featuredProjects = featuredProjectSlugs.map(slug => projects.find(project => project.slug === slug)!)
