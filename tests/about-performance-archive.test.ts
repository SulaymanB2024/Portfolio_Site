import test from 'node:test'
import assert from 'node:assert/strict'
import { archiveEntries, repertoireComposers, splitWork, toggleProgram } from '../src/personal/about/performance-archive.ts'
import { performances } from '../src/personal/about/performances.ts'

test('each series view retains its programs in concert-date order without mutating the archive', () => {
  const before = performances.map(entry => entry.id)
  const ut = archiveEntries(performances, 'ut-austin')
  const state = archiveEntries(performances, 'all-state')
  assert.equal(ut.length, 4)
  assert.equal(state.length, 2)
  assert.deepEqual(new Set([...ut, ...state].map(entry => entry.id)), new Set(before))
  for (const filter of ['all', 'ut-austin', 'all-state'] as const) {
    const rows = archiveEntries(performances, filter)
    assert.deepEqual(rows.map(entry => entry.date), rows.map(entry => entry.date).sort().reverse())
  }
  assert.deepEqual(performances.map(entry => entry.id), before)
})

test('programs open only by choice and can be compared without closing a previous program', () => {
  const initial: ReadonlySet<string> = new Set()
  const first = toggleProgram(initial, performances[0].id)
  const comparison = toggleProgram(first, performances[1].id)
  const closed = toggleProgram(comparison, performances[0].id)
  assert.equal(initial.size, 0)
  assert.deepEqual([...first], [performances[0].id])
  assert.deepEqual([...comparison], [performances[0].id, performances[1].id])
  assert.deepEqual([...closed], [performances[1].id])
  // Filtering is a view operation, not a command to open or close programs.
  archiveEntries(performances, 'all-state')
  assert.equal(comparison.size, 2)
})

test('the two-night Holiday program retains both dates and separate Anderson works', () => {
  const holiday = performances.find(entry => entry.id === 'ut-butler-holiday-concert-2024-12')!
  assert.equal(holiday.date, '2024-12-07')
  assert.equal(holiday.endDate, '2024-12-08')
  const anderson = holiday.repertoire.map(splitWork).filter(work => work.composer === 'LeRoy Anderson')
  assert.deepEqual(anderson.map(work => work.title), ['Christmas Festival', 'Sleigh Ride'])
})

test('work splitting keeps arranger credits intact and allows titles without a composer divider', () => {
  assert.deepEqual(splitWork('Robert Shaw, arr. Robert Russell Bennett — The Many Moods of Christmas'), {
    composer: 'Robert Shaw, arr. Robert Russell Bennett', title: 'The Many Moods of Christmas',
  })
  assert.deepEqual(splitWork('Concert program'), { composer: '', title: 'Concert program' })
})

test('brief composer cues deduplicate repeated works while retaining full accessible names', () => {
  assert.deepEqual(repertoireComposers([
    'LeRoy Anderson — Christmas Festival',
    'LeRoy Anderson — Sleigh Ride',
    'Robert Shaw, arr. Robert Russell Bennett — The Many Moods of Christmas',
    'Ludwig van Beethoven — Symphony No. 5',
    'Gustav Holst, trans. Merlin Patterson — The Planets: Mars; Jupiter',
  ]), [
    { name: 'LeRoy Anderson', short: 'Anderson' },
    { name: 'Robert Shaw', short: 'Shaw' },
    { name: 'Ludwig van Beethoven', short: 'Beethoven' },
    { name: 'Gustav Holst', short: 'Holst' },
  ])
  assert.deepEqual(repertoireComposers(['Concert program']), [])
})
