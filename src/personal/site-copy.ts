import type { ArticleSummary } from './editorial/types'

// Page copy lives separately from the published research and its source records.
export const siteCopy = {
  home: {
    title: 'The frontier is all that matters',
    headline: ['The frontier', 'is all that', 'matters'],
    description: 'I build software and study AI and markets.',
    action: 'Explore my work',
  },
  work: {
    selectedLabel: '01 / Selected work',
    heading: ['What I’m building.', 'What I’m studying.'],
    introduction: 'Internship search, AI research, market analysis, and experiments in light and motion.',
    kicker: 'Products, research & experiments',
    title: 'Selected work',
    description: 'Products, research, and experiments.',
    explore: 'Explore project',
    all: 'View all work',
  },
  about: {
    paragraphs: [
      'I’m Sulayman, a finance student at UT Austin. I build software and write about AI and markets.',
      'I founded InternshipDeadlines for internship search and application planning. At Chegg, I work on Internships.com, student research, and AI tools. I lead growth and positioning at Sapien, which uses simulated audiences for market research.',
      'I run VOID, a consultancy for growth strategy, financial analysis, AI workflows, and web development. I also built Atlas, a website audit console that traces findings to captured pages.',
      'I compose and play double bass, with performances at UT Austin and Texas All-State.',
    ],
    interestsLabel: 'Work & interests',
    interests: [
      ['Building', 'Product & growth', 'AI tools & workflows', 'Data systems', 'Search & discovery', 'Web development'],
      ['Research', 'Consumer behavior', 'Energy markets', 'Digital assets', 'Venture & business models', 'Technology & infrastructure'],
      ['Making', 'Writing', 'Video & storytelling', 'Design', 'Double bass & composition', 'Logic puzzles'],
    ],
    resumeAction: 'Experience & education',
    contactAction: 'Get in touch',
  },
  contact: {
    headline: ['Have a question', 'worth working', 'on?'],
    description: 'For product work, research, or collaboration, send me a note.',
    label: 'Start with a note',
  },
  footer: {
    title: 'Get in touch.',
    description: 'For product work, research, or collaboration, send me a note.',
    colophon: 'Set in Syne and Newsreader. React, TypeScript, and Three.js. Light and motion, rendered as ink on paper.',
    top: 'Back to top',
  },
  writing: {
    homeKicker: '/ Selected writing',
    read: 'Read essay',
    kicker: '/ Essays, research & working notes',
    introduction: 'How software behaves, how businesses make decisions, and how infrastructure gets financed.',
    all: 'All writing',
    search: 'Search essays',
    empty: 'No matching essays.',
    reset: 'Show all writing',
    downloads: 'Data & supporting research',
  },
  reader: {
    loading: 'Opening the article…',
    error: 'The article couldn’t load.',
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
  description: 'Software, AI, and markets by Sulayman Bowles, a finance student at UT Austin.',
  pages: {
    work: 'Products, research, and experiments by Sulayman Bowles, including InternshipDeadlines, Sapien, Atlas, and independent market research.',
    writing: 'Selected essays by Sulayman Bowles on AI-operated businesses, agent evaluation, website audits, and Texas toll road economics.',
    about: 'Sulayman Bowles is a finance student at UT Austin working in software, product, and growth. He also composes and plays double bass.',
    resume: 'Experience, education, and selected work by Sulayman Bowles across Chegg, Sapien, VOID, and independent products.',
    contact: 'Contact Sulayman Bowles about product work, research, and collaborations.',
  } as Record<string, string>,
}

// Short homepage introductions; article titles, decks, and source records stay intact.
export const homeWritingDecks: Record<string, string> = {
  'who-owns-texas-toll-roads': 'Who owns the pavement, who collects the tolls, and who gets paid first?',
  'atlas-building-an-evidence-console': 'Building a website audit console, from capture to review.',
  'the-first-ai-managers': 'Can an AI manager keep a business on course?',
}

// Reader and discovery copy share the reviewed article record. Keep this adapter
// for existing callers; separate overlays must not hide later editorial edits.
export function withWritingCopy<T extends ArticleSummary>(article: T): T {
  return article
}
