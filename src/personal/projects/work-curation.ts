import { featuredProjectSlugs } from '../content.ts'

/** Roles and implementation states from the retained project narratives and public résumé. */
export const workContributions: Record<string, {
  role: string; status: string; decision: string; summary: string
  searchTitle: string; searchDescription: string
  proofs: { label: string; href: string }[]
}> = {
  chegg: {
    role: 'Product Intern, Growth · Internships.com',
    status: 'Product & research work',
    decision: 'Connect student research to internship-search workflows and AI tools.',
    summary: 'At Chegg, I develop internship-search workflows and AI tools for Internships.com, combining student research, recruiting data and cross-functional product work.',
    searchTitle: 'Chegg — Product & AI Tools at Internships.com — Sulayman Bowles',
    searchDescription: 'Sulayman Bowles’s product work at Chegg spans Internships.com, student research, recruiting-data pipelines, growth analysis and an AI mock interviewer.',
    proofs: [
      { label: 'Role & contributions', href: '/resume' },
      { label: 'Internships.com', href: 'https://www.internships.com/' },
    ],
  },
  void: {
    role: 'Founder · Strategy & engineering',
    status: 'Consultancy · Atlas local workflow shipped',
    decision: 'Connect a business decision to a system whose work can be inspected.',
    summary: 'I founded VOID to build operating plans, AI workflows and web systems. Atlas, a Python and SQLite audit console, connects website findings to the captured evidence behind them.',
    searchTitle: 'VOID — Strategy, AI Workflows & Atlas Engineering — Sulayman Bowles',
    searchDescription: 'Sulayman Bowles founded VOID, a consultancy for growth strategy, financial analysis, AI workflows and web systems, including the Atlas audit console.',
    proofs: [
      { label: 'VOID', href: 'https://www.void-agency.com/' },
      { label: 'Atlas implementation', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-/blob/ef3bad25ea0f43f7b4a854fa56c74af5a50fc8db/README.md' },
      { label: 'Role & contributions', href: '/resume' },
    ],
  },
  internshipdeadlines: {
    role: 'Founder & product lead',
    status: 'Public product',
    decision: 'Keep the employer’s record separate from the student’s application plan.',
    summary: 'Students need a source they can check and a plan they can maintain. I built the recruiting data pipeline and AI-assisted student product, from listing classification and search ranking to saved applications and preparation guides.',
    searchTitle: 'InternshipDeadlines — AI Product & Search — Sulayman Bowles',
    searchDescription: 'Sulayman Bowles built InternshipDeadlines: AI-assisted internship search, source validation, role classification and application planning.',
    proofs: [
      { label: 'Explore the product', href: 'https://internshipdeadlines.com/' },
      { label: 'Listing methodology', href: 'https://internshipdeadlines.com/methodology/' },
    ],
  },
  atlas: {
    role: 'Founder · Product & engineering',
    status: 'Local workflow shipped',
    decision: 'Keep each finding connected to the capture, rule, and measurements behind it.',
    summary: 'Website audit findings need a path back to captured evidence. I built Atlas’s Python crawler, SQLite evidence model and local review interface through VOID, with page, link, finding and measurement exports.',
    searchTitle: 'Atlas — Python & SQLite Audit Console — Sulayman Bowles',
    searchDescription: 'Sulayman Bowles built Atlas, a local Python and SQLite website audit console connecting crawls, findings, source evidence and exports.',
    proofs: [
      { label: 'Inspect the implementation', href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-/blob/ef3bad25ea0f43f7b4a854fa56c74af5a50fc8db/README.md' },
      { label: 'Read Building Atlas', href: '/writing/atlas-building-an-evidence-console' },
    ],
  },
  sapien: {
    role: 'Growth Manager',
    status: 'Published content & buyer guides',
    decision: 'Structure the explanation around the research question a buyer needs to answer.',
    summary: 'Research buyers need to see what simulated audiences can answer. As Growth Manager, I built positioning, buyer guides and the content function around pricing, concept testing and consumer research.',
    searchTitle: 'Sapien — Growth & AI Market Research — Sulayman Bowles',
    searchDescription: 'Sulayman Bowles leads growth and positioning at Sapien, building buyer guides and use cases for AI market research, pricing and consumer insights.',
    proofs: [
      { label: 'Buyer guide · Sapien Team', href: 'https://www.asksapien.ai/blog/market-research-services' },
      { label: 'AI research tools · Sapien Team', href: 'https://www.asksapien.ai/blog/ai-market-research-tools' },
    ],
  },
}

export const featuredWorkSlugs = featuredProjectSlugs
