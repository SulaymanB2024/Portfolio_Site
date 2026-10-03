import test from 'node:test'
import assert from 'node:assert/strict'
import { READING_STOPS, nextReadingStop, nearbyReadingStop, guideProgress } from '../src/personal/landing/scroll-guide.ts'
import { sceneSequence, textSequence } from '../src/personal/landing/sequence.ts'
import { cinematicShot, sculpturePose, thresholdMotion } from '../src/personal/landing/motion-curves.ts'

test('continuation completes an interrupted passage or advances a held chapter, ending in Writing', () => {
  assert.equal(nextReadingStop(0), .21)
  assert.equal(nextReadingStop(.1), .21)
  assert.equal(nextReadingStop(.18), .21)
  assert.equal(nextReadingStop(.21), .46)
  assert.equal(nextReadingStop(.25), .46)
  assert.equal(nextReadingStop(.71), .96)
  assert.equal(nextReadingStop(.96), null)
  assert.equal(nextReadingStop(1), null)
  for (const mobile of [false, true]) for (const stop of READING_STOPS) {
    const type = textSequence(stop, 'threshold', false, mobile)
    assert.deepEqual(type.states[type.active], { reveal: 1, erase: 0 })
    assert.deepEqual(cinematicShot(sceneSequence(stop).local, stop > 0), cinematicShot(0, false))
  }
})

test('soft alignment stays within48px and only occurs with a fully settled readable sculpture', () => {
  for (const distance of [2400, 2954, 4388, 4800]) for (let step = 0; step <= 10000; step++) {
    const p = step / 10000, stop = nearbyReadingStop(p, distance)
    if (stop === null) continue
    assert.ok(Math.abs(stop - p) * distance <= 48)
    const scene = sceneSequence(p), state = textSequence(p).states[textSequence(p).active]
    assert.deepEqual(state, { reveal: 1, erase: 0 })
    assert.deepEqual(sculpturePose(scene.local, true), sculpturePose(0, false))
    assert.equal(thresholdMotion(scene.local).incomingLinks, 1)
  }
  assert.equal(nearbyReadingStop(.12, 4800), null)
  assert.equal(nearbyReadingStop(.21, 4800), null)
  assert.equal(nearbyReadingStop(NaN, 4800), null)
  assert.equal(nearbyReadingStop(.21, 0), null)
})

test('guidance progress follows the aperture, holds quietly and retraces on reverse scroll', () => {
  for (let leg = 0; leg < 4; leg++) {
    assert.equal(guideProgress((leg + .1) / 4), leg)
    assert.equal(guideProgress((leg + .85) / 4), leg + 1)
  }
  const positions = Array.from({ length: 1001 }, (_, index) => index / 1000)
  const forward = positions.map(p => guideProgress(p))
  assert.deepEqual(forward, [...positions].reverse().map(p => guideProgress(p)).reverse())
  assert.ok(forward.every((value, index) => value >= 0 && value <= 4 && (!index || value >= forward[index - 1])))
  for (const p of positions) assert.equal(guideProgress(p, true), textSequence(p, 'threshold', true).active)
})
