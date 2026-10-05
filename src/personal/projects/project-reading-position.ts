import type { ReaderPosition } from '../editorial/reader-position'

/** Hash routes take precedence; public path URLs keep their own query string. */
export function requestedProjectChapter(hash: string, pathname: string, search: string, slug: string) {
  if (hash && !hash.startsWith('#/')) return null
  const [address, query] = hash.startsWith('#/') ? hash.slice(1).split('?') : [pathname, search.replace(/^\?/, '')]
  if (address.replace(/\/+$/, '') !== `/work/${slug}`) return null
  return new URLSearchParams(query || '').get('chapter')
}

/** Retain address style and bookmark context when changing chapters in the same project. */
export function projectChapterHref(hash: string, pathname: string, search: string, slug: string, chapter: string) {
  const [address, query] = hash.startsWith('#/') ? hash.slice(1).split('?') : [pathname, search.replace(/^\?/, '')]
  const parameters = new URLSearchParams(address.replace(/\/+$/, '') === `/work/${slug}` ? query || '' : '')
  parameters.set('chapter', chapter)
  if (!hash.startsWith('#/') && address.replace(/\/+$/, '') === `/work/${slug}`) return `/work/${slug}?${parameters}`
  return `#/work/${slug}?${parameters}`
}

/** Reserve the index plus its 24px gap, with 1px for browser scroll rounding. */
export function projectReaderSection(positions: ReaderPosition[], scroll: number, height: number, indexHeight: number, fallback: string) {
  const line = scroll + Math.max(80, height * 0.16, indexHeight ? indexHeight + 25 : 0)
  let current = fallback
  for (const position of positions) if (position.top <= line) current = position.id
  return current
}
