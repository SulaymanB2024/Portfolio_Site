import type { ArticleSummary } from './editorial/types'

// Page copy lives separately from the published research and its source records.
export const siteCopy = {
  home: {
    title: 'The frontier is all that matters',
    headline: ['The frontier', 'is all that', 'matters'],
    description: 'I build for what comes next: better tools, clearer decisions, and systems with a longer horizon.',
    action: 'Explore my work',
  },
  work: {
    selectedLabel: '01 / Selected work',
    heading: ['Questions worth asking.', 'Things worth building.'],
    introduction: 'Internship discovery, AI research, market analysis, and experiments that start with a question.',
    kicker: 'Built, studied, and still evolving',
    title: 'Work, in practice',
    description: 'Products I build, research I contribute to, and ideas I test by making them real.',
    explore: 'Explore the work',
    all: 'View all work',
  },
  about: {
    paragraphs: [
      'I’m Sulayman, a finance student at UT Austin. I build software, work on product and growth, and write about the systems behind everyday decisions.',
      'I founded InternshipDeadlines to make internship discovery and application planning easier to navigate. At Chegg, I work on Internships.com, student research, and AI tools. At Sapien, I lead growth, turning research on simulated audiences into clear positioning, useful content, and buyer use cases.',
      'Through VOID, I help businesses with growth strategy, financial analysis, AI workflows, and the web. I also built Atlas, a crawl and audit console for tracing website problems back to the evidence needed to fix them.',
      'Music has been part of my life for years: composing, playing double bass, and performing with UT’s University Orchestra. I’m drawn to work that rewards both close attention and experimentation. A research question, a piece of software, and a score each give me a different way to practice that.',
    ],
    interestsLabel: 'What I work on · What I return to',
    interests: [
      ['Building', 'Product & growth', 'AI tools & workflows', 'Data systems', 'Search & discovery', 'Web development'],
      ['Research', 'Consumer behavior', 'Energy markets', 'Digital assets', 'Venture & business models', 'Technology & infrastructure'],
      ['Making', 'Writing', 'Video & storytelling', 'Design', 'Double bass & composition', 'Logic puzzles'],
    ],
    resumeAction: 'Experience & education',
    contactAction: 'Start a conversation',
  },
  contact: {
    headline: ['Have a question', 'worth working', 'on?'],
    description: 'Tell me what you’re building, researching, or trying to figure out. I’m interested in product work, collaborations, and good questions.',
    label: 'Start with a note',
  },
  footer: {
    kicker: 'Keep the conversation going',
    headline: ['What are you', 'working on?'],
    description: 'A product idea, a research question, or a problem you haven’t quite defined yet—send it my way.',
    colophon: 'Built by Sulayman Bowles. A place for useful work, careful research, and a little play.',
    top: 'Back to top',
  },
  writing: {
    homeKicker: '/ Selected writing',
    kicker: '/ Essays, research & working notes',
    introduction: 'Products I build, AI systems I study, and the contracts behind infrastructure. Four selected pieces, with sources you can follow.',
    all: 'Browse all writing',
    search: 'Find an essay or topic',
    empty: 'Nothing here matches those filters yet.',
    reset: 'Show all writing',
    downloads: 'Data & supporting research',
  },
  reader: {
    loading: 'Opening the article…',
    error: 'The article didn’t load. Try opening it again.',
    retry: 'Try again',
    back: 'Back to writing',
    more: 'Read next',
  },
  notFound: {
    kicker: '404 / Page not found',
    headline: ['Nothing at', 'this address.'],
    action: 'Return home',
  },
} as const

export const siteMetadata = {
  homeTitle: 'The frontier is all that matters',
  description: 'Sulayman Bowles builds tools and studies systems for what comes next. Work, research, and experiments across technology, AI, and markets.',
  pages: {
    work: 'Products, research, and experiments by Sulayman Bowles, including InternshipDeadlines, Sapien, Atlas, and independent market research.',
    writing: 'Essays and research by Sulayman Bowles on AI systems, the web, energy, infrastructure, and markets.',
    about: 'Meet Sulayman Bowles: UT Austin finance student, builder, founder, researcher, and musician based in Austin, Texas.',
    resume: 'Experience, education, and selected work by Sulayman Bowles across Chegg, Sapien, VOID, and independent products.',
    contact: 'Contact Sulayman Bowles about product work, research, and collaborations.',
  } as Record<string, string>,
}

// These decks describe the existing essays; their bodies and titles stay sourced.
export const writingDecks: Record<string, string> = {
  'crawl-frontier-state-machine': 'What makes a crawler dependable: deciding which URLs to visit, when to wait, when to retry, and what to record.',
  'raw-html-rendered-dom-evidence': 'The page a server sends and the page a browser builds can tell different stories. Here’s how to keep both.',
  'canonicalization-graph-consistency': 'Canonicals, redirects, and sitemaps can disagree about which page counts. A method for finding and resolving those conflicts.',
  'internal-links-directed-retrieval-graph': 'A website’s links shape what people and crawlers can find. Follow the paths, identify the gaps, and plan the repairs.',
  'robots-txt-courtesy-not-access-control': 'What robots.txt asks crawlers to do, what indexing rules control, and where access protection has to begin.',
  'structured-data-without-content-drift': 'Keep what a page says consistent with its metadata, structured data, sitemap, and exports—even as the site changes.',
  'audit-findings-derived-records': 'An audit finding should trace back to an observation. A practical way to connect the evidence, the rule, and the recommendation.',
  'replayable-traces-ai-agent-evaluation': 'To evaluate an agent, keep more than its final answer. Record the actions, replay the task, and test the result.',
  'sqlite-crawl-pipelines': 'A practical guide to keeping crawl data consistent in SQLite, from URL identity and write transactions to checkpoints and exports.',
  'technical-seo-migration-release-gates': 'A site migration changes more than URLs. Turn redirects, canonicals, links, and rendered content into checks that can block a bad release.',
  'the-first-ai-managers': 'AI-operated shops, cafés, vending machines, and radio stations reveal what happens when an agent has a business to run.',
  'ai-search-crawler-policy': 'Understand the rules for eight AI crawler tokens, then check what your robots.txt actually permits.',
  'technical-seo-public-data-infrastructure': 'A URL is more than an address. How crawlability, rendering, attribution, and exports make the web’s records usable.',
  'canonical-identity-personal-seo': 'Make your domains, biographies, résumé, and profiles tell a consistent story about who you are and where your work lives.',
  'who-owns-texas-toll-roads': 'Who owns a toll road, who receives its revenue, and who bears the risk? The answers live in different parts of the contract.',
  'viralbench-codex-agent-harness': 'My design for improving a marketing agent through trace review, replay, controlled experiments, and clear release decisions.',
}

export function withWritingCopy<T extends ArticleSummary>(article: T): T {
  const subtitle = writingDecks[article.slug]
  return subtitle ? { ...article, subtitle } : article
}
