import test from 'node:test'
import assert from 'node:assert/strict'
import { addPhraseNote, clampedPhraseTempo, midiLabel, phraseSchedule, totalPhraseBeats, validatePhrase, type PhraseNote } from '../src/personal/about/music-phrase.ts'

test('sixteenth through whole notes and rests retain their exact rhythm and source index', () => {
  const phrase: PhraseNote[] = [{ midi: null, beats: .25 }, { midi: 28, beats: .5 }, { midi: null, beats: 1 }, { midi: 43, beats: 2 }, { midi: 55, beats: 4 }]
  const schedule = phraseSchedule(phrase, 120)
  assert.deepEqual(schedule.map(event => [event.sourceIndex, event.delay, event.duration]), [[0, 0, .125], [1, .125, .25], [2, .375, .5], [3, .875, 1], [4, 1.875, 2]])
  assert.equal(schedule[0].frequency, null)
  assert.equal(schedule[2].frequency, null)
  assert.ok(Math.abs(schedule[1].frequency! - 41.2034446) < .000001)
  assert.equal(totalPhraseBeats(phrase), 7.75)
  assert.equal(midiLabel(null), 'Rest')
})

test('composer capacity counts both notes and rests and bounds musical duration', () => {
  const sixtyFour = Array.from({ length: 64 }, (_, index) => ({ midi: index % 2 ? null : 28, beats: 2 }))
  assert.equal(totalPhraseBeats(sixtyFour), 128)
  assert.equal(validatePhrase(sixtyFour).valid, true)
  assert.equal(phraseSchedule(sixtyFour, 40).at(-1)!.delay, 189)
  assert.deepEqual(addPhraseNote(sixtyFour, { midi: 28, beats: .25 }), sixtyFour)
  const long = Array.from({ length: 32 }, () => ({ midi: 43, beats: 4 }))
  assert.equal(validatePhrase(long).valid, true)
  assert.deepEqual(addPhraseNote(long, { midi: null, beats: .25 }), long)
  assert.equal(addPhraseNote([], { midi: null, beats: 4 }).length, 1)
  assert.equal(addPhraseNote([{ midi: 28, beats: 1 }], { midi: 43, beats: 1 }, 1).length, 1)
})

test('invalid notes and durations cannot be appended or silently retimed', () => {
  for (const note of [{ midi: 27, beats: 1 }, { midi: 56, beats: 1 }, { midi: 28.5, beats: 1 }, { midi: NaN, beats: 1 }, { midi: null, beats: 0 }, { midi: 28, beats: .75 }, { midi: 28, beats: Infinity }]) {
    assert.equal(validatePhrase([note]).valid, false)
    assert.deepEqual(addPhraseNote([], note), [])
    assert.throws(() => phraseSchedule([note], 88), RangeError)
  }
  assert.equal(clampedPhraseTempo(20), 40)
  assert.equal(clampedPhraseTempo(250), 180)
  assert.equal(clampedPhraseTempo(NaN), 88)
  assert.equal(phraseSchedule([{ midi: null, beats: 4 }], 20)[0].duration, 6)
})
