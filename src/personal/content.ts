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
  email: 'sybatx@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sulayman-bowles',
  location: 'Austin, TX',
}
export const projects: Project[] = [
  {
    slug: 'internshipdeadlines', number: '01', name: 'InternshipDeadlines', kind: 'crystal', category: 'Product',
    tags: ['Product', 'Search', 'Data systems'],
    summary: 'I built a place to find internships, research employers, and plan what comes next.',
    headline: ['A clearer path', 'to the next step.'],
    overview: 'Internship recruiting is scattered across employer sites, job boards, and deadlines that are easy to miss. I founded InternshipDeadlines to bring that information into a useful workflow: discover roles, understand the requirements, build a shortlist, and prepare. Underneath the interface is a data pipeline for validating sources, organizing listings, and keeping a path back to the employer’s original posting.',
    areas: [
      { title: 'From sources to usable records', description: 'Validate employer and recruiting sources, standardize role information, and remove duplicates while retaining provenance.' },
      { title: 'Search that understands the role', description: 'Combine classification, query understanding, and ranking to help students find roles by work, company, and location.' },
      { title: 'Dates that keep their meaning', description: 'Keep application deadlines, start dates, and missing information distinct. Dated records point back to the original source.' },
      { title: 'A plan beyond the search', description: 'Bring saved roles, employer research, application preparation, and cost and offer comparisons into the same workflow.' },
    ],
    link: { label: 'Find internships', href: 'https://internshipdeadlines.com/' },
  },
  {
    slug: 'sapien', number: '02', name: 'Sapien', kind: 'ribbon', category: 'AI',
    tags: ['AI research', 'Growth', 'Storytelling'],
    summary: 'I lead growth at Sapien, helping people understand what simulated audiences can tell them.',
    headline: ['From simulated choices', 'to useful questions.'],
    overview: 'Sapien uses synthetic populations to explore how people might respond to products, prices, and messages. My work is to make that capability understandable and useful: clarify the product’s positioning, develop buyer use cases, and turn research into articles, videos, and sales narratives. That means paying close attention to both the result and the claim it can support.',
    areas: [
      { title: 'A product people can understand', description: 'Connect the platform’s capabilities to specific decisions about pricing, concepts, messaging, and customers.' },
      { title: 'Research behind the story', description: 'Read academic work, validation studies, and competing methods to understand the findings and the questions they leave open.' },
      { title: 'Ideas people can see', description: 'Turn research into clear articles, recorded explainers, creative briefs, and examples with a concrete question at their center.' },
      { title: 'Growth with a clear purpose', description: 'Build search and editorial content, ad creative, and sales narratives around the problems buyers are trying to solve.' },
    ],
    link: { label: 'See how Sapien works', href: 'https://www.asksapien.ai/' },
  },
  {
    slug: 'investing-markets', number: '03', name: 'Investing & Markets', kind: 'globe', category: 'Markets',
    tags: ['Finance', 'Energy', 'Research'],
    summary: 'Following the incentives, contracts, and cash flows behind a market story.',
    headline: ['Follow the incentives.', 'Read the fine print.'],
    overview: 'I study finance at UT Austin and research markets through coursework, venture work, and independent writing. I’m interested in the mechanisms behind a thesis: who makes the decision, who receives the cash flow, and who bears the risk. My work ranges from Texas toll-road contracts to digital assets and energy markets, with a focus on the assumptions that can change the conclusion.',
    areas: [
      { title: 'Infrastructure & cash flows', description: 'Read the contracts behind physical assets to understand ownership, revenue rights, financing, and risk.' },
      { title: 'Energy markets', description: 'Study how infrastructure, prices, and physical constraints shape opportunities in the energy economy.' },
      { title: 'Digital assets', description: 'Examine protocols, market structure, valuation, and the assumptions behind an investment thesis.' },
      { title: 'Early-stage businesses', description: 'Connect customer research, pricing, financial models, and unit economics to decisions a founder has to make.' },
    ],
  },
  {
    slug: 'miscellaneous', number: '04', name: 'Experiments', kind: 'cross', category: 'Experiments',
    tags: ['Creative research', 'Graphics', 'Tools'],
    summary: 'Small tools, moving images, and ideas I understand better by building them.',
    headline: ['Try the idea.', 'See what happens.'],
    overview: 'Some projects start with a practical problem; others start with a texture, a pattern, or a question I can’t leave alone. This is where I explore creative research, interactive graphics, and small tools. The site itself is part of that practice: historical objects, ordered dithering, and generative artwork used to make a digital page feel more tactile.',
    areas: [
      { title: 'CreativeTrace', description: 'Study patterns in public posts and video, then turn observations into creative hypotheses and concepts to test.' },
      { title: 'Light, texture & movement', description: 'Explore ordered dithering, 3D rendering, and the way a moving image changes the feel of a page.' },
      { title: 'Objects worth looking at', description: 'A collection of historical objects and material studies, with interactive controls and source attribution.' },
      { title: 'Tools for the recurring task', description: 'Build small research and automation workflows that make repeated work easier to inspect and improve.' },
    ],
    link: { label: 'Try the shader study', href: './shader.html' },
  },
]
