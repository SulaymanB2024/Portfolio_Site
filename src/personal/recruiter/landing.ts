import type { OutreachCompanyContext } from '../outreach-context.ts'
import type { LandingOpeningCopy } from '../landing/opening-copy.ts'
import { escapeMetadata, searchMetadata, type SearchMetadata } from '../search-metadata.ts'

/** The original landing composition, with the short biography requested by Sulayman. */
export const recruiterIntroduction = 'I’m Sulayman Bowles, a Finance BBA student at McCombs, UT Austin, graduating in May 2028. Product and growth at Chegg, growth manager at Sapien, and founder of VOID.'

export function recruiterOpening(_company: OutreachCompanyContext): LandingOpeningCopy {
  return {
    lines: ['The', 'frontier', 'is all that', 'matters.'],
    introduction: recruiterIntroduction,
    category: '',
    href: '/resume',
    linkLabel: 'Résumé',
    article: { label: 'Explore the site', href: '/' },
  }
}

export function recruiterMetadata(company: OutreachCompanyContext, route = 'recruiter'): SearchMetadata {
  if (route !== 'recruiter') return { ...searchMetadata(route), robots: 'noindex, follow' }
  return { ...searchMetadata(''), route, title: `${company.name} — Sulayman Bowles`, description: recruiterIntroduction, robots: 'noindex, follow', schema: null }
}

/** Keep the complete ordinary homepage; change only its first introduction paragraph. */
export function renderRecruiterDocument(homeBody: string, _company: OutreachCompanyContext) {
  const opening = /(<main\b[^>]*>\s*<h1\b[^>]*>[^]*?<\/h1>\s*<p\b[^>]*>)[^]*?(<\/p>)/
  if (!opening.test(homeBody)) throw new Error('Homepage opening is unavailable')
  return homeBody.replace(opening, (_, start: string, end: string) => `${start}${escapeMetadata(recruiterIntroduction)}${end}`)
}
