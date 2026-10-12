/** Roles and implementation states from the retained project narratives and source records. */
export const workContributions: Record<string, {
  role: string; status: string; decision: string; summary: string
  searchTitle: string; searchDescription: string
  proofs: { label: string; href: string }[]
}> = {
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

export const featuredWorkSlugs = ['internshipdeadlines', 'atlas', 'sapien'] as const

/** Continue through the same selection shown on Work; retain other case-study exits. */
export function curatedNextProject(slug: string) {
  const sequence = [
    { slug: 'internshipdeadlines', name: 'InternshipDeadlines', category: 'Product' },
    { slug: 'atlas', name: 'Atlas', category: 'Product & systems' },
    { slug: 'sapien', name: 'Sapien', category: 'AI' },
    { slug: 'investing-markets', name: 'Investing & Markets', category: 'Markets' },
    { slug: 'miscellaneous', name: 'Experiments', category: 'Experiments' },
  ]
  const index = sequence.findIndex(project => project.slug === slug)
  return index < 0 ? undefined : sequence[(index + 1) % sequence.length]
}
