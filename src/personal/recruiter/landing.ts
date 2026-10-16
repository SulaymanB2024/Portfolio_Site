import type { OutreachCompanyContext } from '../outreach-context.ts'
import type { LandingOpeningCopy } from '../landing/opening-copy.ts'
import { escapeMetadata, searchMetadata, type SearchMetadata } from '../search-metadata.ts'
import { recruiterCompanyProfile } from './company-profiles.ts'

/** Selected worksheet copy occupies the original introduction, below the unchanged headline. */
export function recruiterOpening(company: OutreachCompanyContext): LandingOpeningCopy & { introduction: string } {
  const selected = company.opening?.lines || recruiterCompanyProfile(company.slug, company.name).lines
  return {
    lines: ['The', 'frontier', 'is all that', 'matters.'],
    introduction: selected.join(' '),
    category: '',
    href: '/resume',
    linkLabel: 'Résumé',
    article: { label: 'Explore the site', href: '/' },
  }
}

export function recruiterMetadata(company: OutreachCompanyContext, route = 'recruiter'): SearchMetadata {
  if (route !== 'recruiter') return { ...searchMetadata(route), robots: 'noindex, follow' }
  return { ...searchMetadata(''), route, title: `${company.name} — Sulayman Bowles`, description: recruiterOpening(company).introduction, robots: 'noindex, follow', schema: null }
}

/** Use the same selected opening as React, retaining the ordinary homepage continuation. */
export function renderRecruiterDocument(homeBody: string, company: OutreachCompanyContext) {
  const opening = /(<main\b[^>]*>\s*<h1\b[^>]*>[^]*?<\/h1>\s*<p\b[^>]*>)[^]*?(<\/p>)/
  if (!opening.test(homeBody)) throw new Error('Homepage opening is unavailable')
  return homeBody.replace(opening, (_, start: string, end: string) => `${start}${escapeMetadata(recruiterOpening(company).introduction)}${end}`)
}
