import type { OutreachCompanyContext } from '../outreach-context.ts'
import type { LandingOpeningCopy } from '../landing/opening-copy.ts'
import { escapeMetadata, searchMetadata, type SearchMetadata } from '../search-metadata.ts'
import { recruiterCompanyProfile } from './company-profiles.ts'

export function recruiterOpening(company: OutreachCompanyContext): LandingOpeningCopy {
  const profile = recruiterCompanyProfile(company.slug, company.name)
  return {
    lines: profile.lines,
    category: '',
    href: '/resume',
    linkLabel: 'Résumé',
    article: { label: 'Explore the site', href: '/' },
  }
}

export function recruiterMetadata(company: OutreachCompanyContext, route = 'recruiter'): SearchMetadata {
  if (route !== 'recruiter') return { ...searchMetadata(route), robots: 'noindex, follow' }
  return { ...searchMetadata(''), route, title: `${company.name} — Sulayman Bowles`, description: recruiterOpening(company).lines.join(' '), robots: 'noindex, follow', schema: null }
}

/** Change only the existing opening text in the ordinary readable homepage. */
export function renderRecruiterDocument(homeBody: string, company: OutreachCompanyContext) {
  const opening = /(<main\b[^>]*>\s*<h1\b[^>]*>)[^]*?(<\/h1>\s*<p\b[^>]*>)[^]*?(<\/p>)/
  if (!opening.test(homeBody)) throw new Error('Homepage opening is unavailable')
  return homeBody.replace(opening, (_, title: string, description: string, end: string) => `${title}${escapeMetadata(company.name)}${description}${escapeMetadata(recruiterOpening(company).lines.join(' '))}${end}`)
}
