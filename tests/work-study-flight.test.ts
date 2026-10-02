import assert from 'node:assert/strict'
import { test } from 'node:test'
import { studyFlightProgress, studyFlightRect, studyFlightInkProgress, studyFlightInkStrength, studyFlightInkMotion, STUDY_DEPART_MS, STUDY_DOCK_MS } from '../src/personal/work-study-flight.ts'

const source = { left: 730, top: 241, width: 500, height: 390 }
const destination = { left: 710, top: 156, width: 610, height: 550 }

test('the live artwork travels directly from its source to the actual destination', () => {
  assert.deepEqual(studyFlightRect(source, destination, studyFlightProgress(0, STUDY_DOCK_MS)), source)
  assert.deepEqual(studyFlightRect(source, destination, studyFlightProgress(STUDY_DOCK_MS, STUDY_DOCK_MS)), destination)
})

test('desktop and offscreen mobile flights stay between their endpoints without a fullscreen detour', () => {
  const mobile = { left: 24, top: -240, width: 342, height: 330 }
  const mobileTarget = { left: 24, top: 640, width: 342, height: 330 }
  for (const [from, to] of [[source, destination], [mobile, mobileTarget]]) {
    let previous = 0
    for (let ms = 0; ms <= STUDY_DOCK_MS; ms += 10) {
      const progress = studyFlightProgress(ms, STUDY_DOCK_MS)
      assert.ok(progress >= previous && progress <= 1)
      const rect = studyFlightRect(from, to, progress)
      for (const key of ['left', 'top', 'width', 'height'] as const) {
        assert.ok(rect[key] >= Math.min(from[key], to[key]) - 1e-9)
        assert.ok(rect[key] <= Math.max(from[key], to[key]) + 1e-9)
      }
      previous = progress
    }
  }
})

test('departure and arrival are at rest; delayed frames finish exactly in the destination', () => {
  assert.ok(studyFlightProgress(1, STUDY_DOCK_MS) < 1e-6)
  assert.ok(1 - studyFlightProgress(STUDY_DOCK_MS - 1, STUDY_DOCK_MS) < 1e-6)
  assert.equal(studyFlightProgress(-10, STUDY_DOCK_MS), 0)
  assert.equal(studyFlightProgress(5000, STUDY_DOCK_MS), 1)
  assert.equal(studyFlightProgress(NaN, STUDY_DOCK_MS), 0)
  assert.deepEqual(studyFlightRect(source, destination, studyFlightProgress(5000, STUDY_DOCK_MS)), destination)
})


test('ink remains continuous across departure, delayed handoff and docking', () => {
  const departed = studyFlightInkProgress('depart', STUDY_DEPART_MS)
  assert.equal(departed, studyFlightInkProgress('hold', 0))
  assert.equal(departed, studyFlightInkProgress('hold', 5000))
  assert.equal(departed, studyFlightInkProgress('dock', 0))
  assert.equal(studyFlightInkProgress('dock', STUDY_DOCK_MS), 1)
  assert.equal(studyFlightInkProgress('dock', 5000), 1)
  // The route handoff must preserve velocity as well as position.
  const before = departed - studyFlightInkProgress('depart', STUDY_DEPART_MS - 1)
  const after = studyFlightInkProgress('dock', 1) - departed
  assert.ok(Math.abs(before - after) < 1e-12)
})

test('de-inking leaves time for a visible spiral before the exact model returns', () => {
  assert.ok(STUDY_DEPART_MS + STUDY_DOCK_MS >= 3000)
  const start = studyFlightInkMotion(0)
  const dispersed = studyFlightInkMotion(.48)
  const returning = studyFlightInkMotion(.78)
  const end = studyFlightInkMotion(1)
  assert.equal(start.body, 1)
  assert.equal(start.particles, 0)
  assert.equal(start.release, 0)
  assert.ok(dispersed.body < .02 && dispersed.particles === 1)
  assert.equal(dispersed.release, 1)
  assert.equal(dispersed.gather, 0)
  assert.ok(returning.gather > .5 && returning.body > dispersed.body)
  assert.equal(end.body, 1)
  assert.equal(end.particles, 0)
  assert.equal(end.gather, 1)
  assert.deepEqual(studyFlightInkMotion(NaN), start)
  for (let i = 0; i <= 1000; i++) {
    const motion = studyFlightInkMotion(i / 1000)
    for (const key of ['release', 'gather', 'particles', 'body'] as const) assert.ok(motion[key] >= 0 && motion[key] <= 1)
  }
})

test('ink has a strong sustained peak but returns exactly to unchanged resting pixels', () => {
  assert.equal(studyFlightInkStrength(0), 0)
  assert.equal(studyFlightInkStrength(1), 0)
  assert.equal(studyFlightInkStrength(NaN), 0)
  assert.equal(studyFlightInkStrength(-1), 0)
  assert.equal(studyFlightInkStrength(5), 0)
  assert.ok(studyFlightInkStrength(.2) > .96)
  assert.equal(studyFlightInkStrength(.4), 1)
  let previous = 0
  for (let i = 0; i <= 1000; i++) {
    const strength = studyFlightInkStrength(i / 1000)
    assert.ok(strength >= 0 && strength <= 1)
    assert.ok(Math.abs(strength - previous) < .009)
    previous = strength
  }
})
