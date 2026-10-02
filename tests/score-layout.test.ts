import test from 'node:test'
import assert from 'node:assert/strict'
import { layoutScore, scorePitch } from '../src/personal/about/score-layout.ts'
import { PHRASE_BEATS, type PhraseNote } from '../src/personal/about/music-phrase.ts'

test('double-bass notation writes an octave above sounding pitch on the bass stave', () => {
  const low = scorePitch(28)
  assert.equal(low.writtenMidi, 40)
  assert.equal(low.letter, 'E')
  assert.equal(low.octave, 2)
  assert.equal(low.staffStep, -2)
  assert.deepEqual(low.ledgerLines, [-2])
  assert.equal(scorePitch(31).staffStep, 0, 'sounding G1 writes G2, bottom bass-clef line')
  assert.equal(scorePitch(43).staffStep, 7, 'sounding G2 writes G3')
  assert.equal(scorePitch(55).staffStep, 14)
  assert.deepEqual(scorePitch(55).ledgerLines, [10, 12, 14])
  assert.throws(() => scorePitch(56), RangeError)
})

test('durations crossing 4/4 bars split into conventional tied notes with stable source ownership', () => {
  const notes: PhraseNote[] = [{ midi: null, beats: 2 }, { midi: null, beats: 1 }, { midi: null, beats: .5 }, { midi: 33, beats: 4 }]
  const score = layoutScore(notes)
  assert.equal(score.totalMeasures, 2)
  assert.equal(score.totalBeats, 7.5)
  assert.deepEqual(score.measures.map(measure => [measure.beats, measure.complete]), [[4, true], [3.5, false]])
  const tied = score.events.filter(event => event.sourceIndex === 3)
  assert.deepEqual(tied.map(event => [event.measure, event.beat, event.beats, event.tieIn, event.tieOut]), [[0, 3.5, .5, false, true], [1, 0, 2, true, true], [1, 2, 1, true, true], [1, 3, .5, true, false]])
  assert.equal(tied.reduce((sum, event) => sum + event.beats, 0), 4)
  assert.ok(score.events.every(event => (PHRASE_BEATS as readonly number[]).includes(event.beats)))
  for (const measure of score.measures) {
    assert.equal(measure.events.reduce((sum, event) => sum + event.beats, 0), measure.beats)
    assert.ok(measure.events.every(event => event.beat + event.beats <= 4))
  }
})

test('rests split across bars without ties, pitch, ledger lines or accidentals', () => {
  const score = layoutScore([{ midi: 28, beats: 2 }, { midi: 28, beats: 1 }, { midi: 28, beats: .5 }, { midi: null, beats: 4 }])
  const rests = score.events.filter(event => event.sourceIndex === 3)
  assert.equal(rests.reduce((sum, event) => sum + event.beats, 0), 4)
  assert.ok(rests.every(event => event.kind === 'rest' && event.staffStep === null && !event.tieIn && !event.tieOut && event.accidental === null && event.ledgerLines.length === 0))
})

test('sharps apply within a measure, naturals cancel them, and ties carry their pitch across bars', () => {
  const score = layoutScore([{ midi: 42, beats: 1 }, { midi: 42, beats: 1 }, { midi: 41, beats: 1 }, { midi: 42, beats: 2 }, { midi: 41, beats: 1 }, { midi: 42, beats: 1 }])
  assert.deepEqual(score.events.map(event => event.accidental), ['♯', null, '♮', '♯', null, '♮', '♯'])
  assert.equal(score.events[3].tieOut, true)
  assert.equal(score.events[4].tieIn, true)
  assert.equal(score.events[3].staffStep, score.events[2].staffStep)
  assert.equal(score.events[3].writtenMidi, 54)
})

test('full-capacity pieces keep all measures and events available for score pages', () => {
  const notes = Array.from({ length: 64 }, (_, index) => ({ midi: index % 3 ? 43 : null, beats: 2 }))
  const score = layoutScore(notes)
  assert.equal(score.totalMeasures, 32)
  assert.equal(score.events.length, 64)
  assert.ok(score.measures.every(measure => measure.complete && measure.beats === 4))
  assert.deepEqual(layoutScore([]), { measures: [], events: [], totalBeats: 0, totalMeasures: 0 })
})
