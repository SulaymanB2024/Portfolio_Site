import type { Performance } from './performances'

export type PerformanceEntry = Omit<Performance, 'sourceNotes'>
export type PerformanceFilter = 'all' | Performance['series']

export function archiveEntries(entries: readonly PerformanceEntry[], filter: PerformanceFilter) {
  return entries.filter(entry => filter === 'all' || entry.series === filter)
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}

/** Opening one program leaves the others, and the reader's position, intact. */
export function toggleProgram(openIds: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(openIds)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function splitWork(work: string) {
  const divider = work.indexOf(' — ')
  return divider < 0
    ? { composer: '', title: work }
    : { composer: work.slice(0, divider), title: work.slice(divider + 3) }
}

/** Brief composer cues; complete composer and arranger credits stay in the program. */
export function repertoireComposers(works: readonly string[]) {
  const names = works.map(work => splitWork(work).composer.split(/, (?:arr|trans)\.\s+/)[0].trim()).filter(Boolean)
  return [...new Set(names)].map(name => ({ name, short: name.split(/\s+/).at(-1)! }))
}
