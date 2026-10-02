import test from 'node:test'
import assert from 'node:assert/strict'
import { knightChallenges, knightMoves, shortestKnightRoute, moveKnight, puzzleResult } from '../src/personal/about/knight-puzzle.ts'
import { addPhraseNote, midiFrequency, midiLabel, phraseSchedule } from '../src/personal/about/music-phrase.ts'

test('each deeper challenge has a legal route matching its advertised minimum', () => {
  for (const challenge of knightChallenges) {
    const route = shortestKnightRoute(challenge.start, challenge.goal)
    assert.equal(route.length - 1, challenge.limit)
    let path = [challenge.start]
    for (const to of route.slice(1)) {
      assert(knightMoves(path[path.length - 1]).includes(to))
      path = moveKnight(path, to, challenge.goal, challenge.limit)
    }
    assert.equal(puzzleResult(path, challenge.goal, challenge.limit), 'solved')
    assert.deepEqual(moveKnight(path, knightMoves(challenge.goal)[0], challenge.goal, challenge.limit), path)
  }
})

test('hints solve arbitrary squares and cannot fabricate an illegal jump', () => {
  for (const start of ['a1', 'b3', 'd4', 'g7', 'h8']) for (const goal of ['a1', 'd4', 'f6', 'h8']) {
    const route = shortestKnightRoute(start, goal)
    assert.equal(route[0], start)
    assert.equal(route[route.length - 1], goal)
    for (let i = 1; i < route.length; i++) assert(knightMoves(route[i - 1]).includes(route[i]))
  }
  assert.throws(() => shortestKnightRoute('z9', 'h8'))
})

test('phrase rhythms schedule in order at the chosen tempo, including half notes', () => {
  const schedule = phraseSchedule([{ midi: 28, beats: .5 }, { midi: 33, beats: 2 }, { midi: 38, beats: 1 }], 120)
  assert.deepEqual(schedule.map(note => [note.delay, note.duration]), [[0, .25], [.25, 1], [1.25, .5]])
  assert(Math.abs(schedule[0].frequency - 41.2034) < .001)
  assert.equal(midiFrequency(33), 55)
  assert.equal(midiLabel(43), 'G2')
  assert.equal(midiLabel(42), 'F♯2')
})

test('phrase editing respects instrument range, supported rhythms and sixty-four-event capacity', () => {
  const phrase = Array.from({ length: 64 }, () => ({ midi: 43, beats: 1 }))
  assert.deepEqual(addPhraseNote(phrase, { midi: 28, beats: 1 }), phrase)
  assert.deepEqual(addPhraseNote([], { midi: 70, beats: 1 }), [])
  assert.deepEqual(addPhraseNote([], { midi: 43, beats: -1 }), [])
  assert.equal(addPhraseNote([], { midi: 28, beats: .5 }).length, 1)
})
