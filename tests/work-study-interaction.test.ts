import test from 'node:test'
import assert from 'node:assert/strict'
import { boundedStudyInput, studyMoveBounds, studyTouchIntent, studyYaw } from '../src/personal/work-study-interaction.ts'

test('translation keeps the rotating sphere and hover articulation inside portrait and landscape slots', () => {
  const vertical = 17 * Math.PI / 180
  for (const radius of [.4, 1.2, 4]) for (const aspect of [.45, .8, 1, 1.8, 3]) {
    const horizontal = Math.atan(Math.tan(vertical) * aspect)
    const distance = ((radius + .16) * 1.18 + .067) / Math.sin(Math.min(vertical, horizontal))
    const bounds = studyMoveBounds(radius + .16, distance, vertical, aspect)
    assert(bounds.x > 0 && bounds.y > 0, 'the object must have useful room to move')
    for (const request of [-100, -.1, 0, .1, 100]) {
      const x = boundedStudyInput(request, bounds.x) * bounds.worldWidth
      const y = boundedStudyInput(request, bounds.y) * bounds.worldHeight
      assert(distance * Math.sin(horizontal) - Math.abs(x) * Math.cos(horizontal) >= radius + .16 - 1e-10)
      assert(distance * Math.sin(vertical) - (Math.abs(y) + .067) * Math.cos(vertical) >= radius + .16 - 1e-10)
    }
  }
})

test('extreme and invalid movement inputs are bounded without poisoning the rendered pose', () => {
  assert.equal(boundedStudyInput(Infinity, .1), 0)
  assert.equal(boundedStudyInput(NaN, .1), 0)
  assert.equal(boundedStudyInput(10, .1), .1)
  assert.equal(boundedStudyInput(-10, .1), -.1)
  assert.equal(boundedStudyInput(10, -1), 0)
  assert.equal(boundedStudyInput(10, NaN), 0)
  for (const value of [1e8, -1e8, Infinity, NaN]) assert(Number.isFinite(studyYaw(value)) && Math.abs(studyYaw(value)) <= Math.PI)
  const invalid = studyMoveBounds(NaN, Infinity, NaN, Infinity)
  assert(Object.values(invalid).every(Number.isFinite))
})

test('touch motion claims horizontal dragging while leaving vertical scrolling and ambiguous motion to the browser', () => {
  assert.equal(studyTouchIntent(2, 15), 'scroll')
  assert.equal(studyTouchIntent(-5, -20), 'scroll')
  assert.equal(studyTouchIntent(20, 5), 'drag')
  assert.equal(studyTouchIntent(-12, -4), 'drag')
  assert.equal(studyTouchIntent(3, 2), 'pending')
  assert.equal(studyTouchIntent(10, 10), 'pending')
})
