export const resumeSections = [
  ['experience', 'Experience'],
  ['selected-work', 'Selected work'],
  ['education', 'Education'],
  ['recognition', 'Awards & leadership'],
  ['skills', 'Skills & tools'],
] as const

export type ResumeSection = typeof resumeSections[number][0]

export function resumeSectionHref(section: ResumeSection) {
  return `#/resume?section=${section}`
}

/** A copied contents link opens only a known section of the full résumé. */
export function resumeSectionFromHash(hash: string): ResumeSection | null {
  if (hash.split('?')[0] !== '#/resume') return null
  const section = new URLSearchParams(hash.split('?')[1] || '').get('section')
  return resumeSections.find(([id]) => id === section)?.[0] ?? null
}

export function resumeDocumentFromHash(hash: string) {
  if (hash.split('?')[0] !== '#/resume') return false
  return !!resumeSectionFromHash(hash) || new URLSearchParams(hash.split('?')[1] || '').get('view') === 'full'
}

export function resumeDocumentHref(hash: string) {
  const query = new URLSearchParams(hash.split('?')[1] || '')
  query.delete('section')
  query.set('view', 'full')
  return `#/resume?${query}`
}

export function withoutResumeSection(hash: string) {
  const query = new URLSearchParams(hash.split('?')[1] || '')
  query.delete('section')
  return `#/resume${query.size ? `?${query}` : ''}`
}

export function withoutResumeDocument(hash: string) {
  const query = new URLSearchParams(withoutResumeSection(hash).split('?')[1] || '')
  query.delete('view')
  return `#/resume${query.size ? `?${query}` : ''}`
}
