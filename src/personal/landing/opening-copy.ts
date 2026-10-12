import { CHAPTERS, type LandingChapter } from './sequence.ts'

/** Only copy and the existing two destinations can vary at a company arrival. */
export interface LandingOpeningCopy {
  lines: readonly [string, string, string, string]
  category: string
  href: string
  linkLabel: string
  article: { label: string; href: string }
}

export function withLandingOpening(opening?: LandingOpeningCopy): readonly LandingChapter[] {
  if (!opening) return CHAPTERS
  return [{ ...CHAPTERS[0], lines: opening.lines, category: opening.category, href: opening.href, linkLabel: opening.linkLabel, article: opening.article }, ...CHAPTERS.slice(1)]
}
