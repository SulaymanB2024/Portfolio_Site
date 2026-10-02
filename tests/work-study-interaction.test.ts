import test from 'node:test'
import { PerspectiveCamera } from 'three'
import assert from 'node:assert/strict'
import { createStudyOrbit, fitStudyOrbit, resetStudyOrbit, rotateStudyKey, rotateStudyPointer, boundedStudyInput, studyMoveBounds, studyTouchIntent, studyYaw } from '../src/personal/work-study-interaction.ts'

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


test('project orbit uses helmet drag sensitivity regardless of slot size', () => {
  const a = createStudyOrbit(new PerspectiveCamera())
  const b = createStudyOrbit(new PerspectiveCamera())
  rotateStudyPointer(a, 60, 30, 600)
  rotateStudyPointer(b, 30, 15, 300)
  assert.ok(Math.abs(a.getAzimuthalAngle() + Math.PI / 5) < 1e-12)
  assert.ok(Math.abs(a.getAzimuthalAngle() - b.getAzimuthalAngle()) < 1e-12)
  assert.ok(Math.abs(a.getPolarAngle() - b.getPolarAngle()) < 1e-12)
  const before = a.object.position.clone()
  rotateStudyPointer(a, Infinity, 4, 600)
  rotateStudyPointer(a, 4, 4, 0)
  assert.ok(a.object.position.equals(before))
  assert.equal(a.enablePan, false)
  assert.equal(a.enableZoom, false)
  assert.equal(a.domElement, null)
})

test('orbit survives resizing and docking; reset retains the fitted distance', () => {
  const controls = createStudyOrbit(new PerspectiveCamera())
  rotateStudyPointer(controls, 120, 45, 500)
  const direction = controls.object.position.clone().normalize()
  for (const distance of [12, 4, 8, 5.5]) {
    fitStudyOrbit(controls, distance)
    assert.ok(controls.object.position.clone().normalize().distanceTo(direction) < 1e-12)
    assert.ok(Math.abs(controls.object.position.length() - distance) < 1e-12)
  }
  resetStudyOrbit(controls)
  assert.ok(Math.abs(controls.getAzimuthalAngle()) < 1e-12)
  assert.ok(Math.abs(controls.getPolarAngle() - Math.atan2(1, .04)) < 1e-12)
  assert.ok(Math.abs(controls.object.position.length() - 5.5) < 1e-12)
})

test('arrow keys match helmet steps and polar motion stays finite at the poles', () => {
  const controls = createStudyOrbit(new PerspectiveCamera())
  const polar = controls.getPolarAngle()
  assert.equal(rotateStudyKey(controls, 'ArrowRight'), true)
  assert.ok(Math.abs(controls.getAzimuthalAngle() - .14) < 1e-12)
  rotateStudyKey(controls, 'ArrowUp')
  assert.ok(Math.abs(controls.getPolarAngle() - polar + .14) < 1e-12)
  assert.equal(rotateStudyKey(controls, 'Enter'), false)
  rotateStudyPointer(controls, 0, 10000, 300)
  assert.ok(controls.getPolarAngle() > 0)
  rotateStudyPointer(controls, 0, -20000, 300)
  assert.ok(controls.getPolarAngle() < Math.PI)
  assert.ok(controls.object.position.toArray().every(Number.isFinite))
})
