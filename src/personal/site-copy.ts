import type { ArticleSummary } from './editorial/types'
import { recruiterCopy } from './recruiter-copy.ts'

// Page copy lives separately from the published research and its source records.
export const siteCopy = {
  home: {
    title: 'The frontier is all that matters',
    headline: ['The frontier', 'is all that', 'matters'],
    description: recruiterCopy.opening,
    contact: 'I’m open to internships and full-time roles in product, growth and AI. Send me a note.',
    action: 'Explore my work',
  },
  work: {
    selectedLabel: '01 / Selected work',
    heading: ['What I’m building.', 'What I’m studying.'],
    introduction: 'Product work at Chegg, growth at Sapien, systems through VOID, and experiments in light and motion.',
    kicker: 'Products, research & experiments',
    title: 'Selected work',
    description: 'Products, research, and experiments.',
    explore: 'Explore project',
    all: 'View all work',
  },
  about: {
    paragraphs: [
      recruiterCopy.introduction,
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
    description: recruiterCopy.contact,
    label: 'Start with a note',
  },
  footer: {
    title: 'Get in touch.',
    description: recruiterCopy.contact,
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
  description: recruiterCopy.description,
  pages: {
    work: 'Selected work by Sulayman Bowles: Chegg product development, Sapien growth, VOID strategy and engineering, and creative experiments.',
    writing: 'Selected essays by Sulayman Bowles on AI-operated businesses, agent evaluation, website audits, and Texas toll road economics.',
    about: 'Sulayman Bowles studies finance at UT Austin, works in product and growth at Chegg and Sapien, and builds AI tools, InternshipDeadlines and Atlas.',
    resume: 'Experience, education, and selected work by Sulayman Bowles across Chegg, Sapien, VOID, and independent products.',
    contact: 'Contact Sulayman Bowles about product, growth and AI internships, full-time roles, research and collaborations.',
  } as Record<string, string>,
}

// Short homepage introductions; article titles, decks, and source records stay intact.
export const homeWritingDecks: Record<string, string> = {
  'who-owns-texas-toll-roads': 'The contracts and cash flows behind Texas toll roads.',
  'atlas-building-an-evidence-console': 'A website audit console built around captured evidence.',
  'the-first-ai-managers': 'Can an AI manager keep a business on course?',
}

// Reader and discovery copy share the reviewed article record. Keep this adapter
// for existing callers; separate overlays must not hide later editorial edits.
export function withWritingCopy<T extends ArticleSummary>(article: T): T {
  return article
}
