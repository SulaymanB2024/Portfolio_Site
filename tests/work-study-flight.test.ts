import assert from 'node:assert/strict'
import { test } from 'node:test'
import { studyFlightAccent, studyFlightProgress, studyFlightRect, STUDY_EXPAND_MS, STUDY_DOCK_MS } from '../src/personal/work-study-flight.ts'

const source = { left: 730, top: 241, width: 500, height: 390 }
const viewport = { left: 0, top: 0, width: 1440, height: 900 }
const destination = { left: 710, top: 156, width: 610, height: 550 }

test('the expansion and docking join at the identical viewport and end at the actual slot', () => {
  assert.deepEqual(studyFlightRect(source, viewport, studyFlightProgress(0, STUDY_EXPAND_MS)), source)
  const expanded = studyFlightRect(source, viewport, studyFlightProgress(STUDY_EXPAND_MS, STUDY_EXPAND_MS))
  assert.deepEqual(expanded, viewport)
  assert.deepEqual(studyFlightRect(viewport, destination, studyFlightProgress(0, STUDY_DOCK_MS)), expanded)
  assert.deepEqual(studyFlightRect(viewport, destination, studyFlightProgress(STUDY_DOCK_MS, STUDY_DOCK_MS)), destination)
})

test('both legs ease monotonically without overshooting their screen bounds', () => {
  for (const [from, to] of [[source, viewport], [viewport, destination]]) {
    let previous = 0
    for (let ms = 0; ms <= 560; ms += 10) {
      const progress = studyFlightProgress(ms, 560)
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

test('the join has zero endpoint velocity and suspended frames reach the exact destination', () => {
  assert.ok(studyFlightProgress(1, 560) < 1e-6)
  assert.ok(1 - studyFlightProgress(559, 560) < 1e-6)
  assert.equal(studyFlightProgress(-10, 560), 0)
  assert.equal(studyFlightProgress(5000, 480), 1)
  assert.equal(studyFlightProgress(NaN, 480), 0)
  const mobile = { left: 24, top: 640, width: 342, height: 330 }
  assert.deepEqual(studyFlightRect(viewport, mobile, studyFlightProgress(1000, 480)), mobile)
})

test('the dither accent leaves both endpoints untouched and cannot jump or exceed its budget', () => {
  assert.equal(studyFlightAccent(0), 0)
  assert.equal(studyFlightAccent(1), 0)
  assert.equal(studyFlightAccent(NaN), 0)
  assert.equal(studyFlightAccent(Infinity), 0)
  assert.equal(studyFlightAccent(-1), 0)
  assert.equal(studyFlightAccent(2), 0)
  assert(studyFlightAccent(.001) < .00001)
  assert(studyFlightAccent(.999) < .00001)
  let previous = 0
  for (let i = 0; i <= 100; i++) {
    const progress = i / 100
    const accent = studyFlightAccent(progress)
    assert(accent >= 0 && accent <= 1)
    assert(Math.abs(accent - studyFlightAccent(1 - progress)) < 1e-10)
    assert(Math.abs(accent - previous) < .032)
    previous = accent
  }
})
