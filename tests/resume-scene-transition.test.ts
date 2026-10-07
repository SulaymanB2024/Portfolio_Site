import test from 'node:test'
import assert from 'node:assert/strict'
import { createResumeTransition, RESUME_DISSOLVE_MS } from '../src/personal/editorial/resume-scene-transition.ts'

test('the knight stays visible until the requested experience is loaded', () => {
  const scene = createResumeTransition('knight')
  const ticket = scene.request('sapien')
  assert.equal(scene.advance(5000).current, 'knight')
  assert.equal(scene.advance(0).waiting, true)
  scene.ready(ticket)
  assert.deepEqual(scene.advance(0), { from: 'knight', to: 'sapien', progress: 0, current: 'knight', desired: 'sapien', waiting: false, moving: true })
  const end = scene.advance(RESUME_DISSOLVE_MS)
  assert.equal(end.current, 'sapien')
  assert.equal(end.progress, 1)
  assert.equal(end.moving, false)
})

test('a stale load cannot replace the latest selection', () => {
  const scene = createResumeTransition('knight')
  const first = scene.request('sapien'), second = scene.request('chegg')
  assert.equal(scene.ready(first), false)
  assert.equal(scene.advance(0).moving, false)
  assert.equal(scene.ready(second), true)
  assert.equal(scene.advance(0).to, 'chegg')
})

test('an experience that loads before the knight waits for its first paint', () => {
  const scene = createResumeTransition('knight', false)
  scene.ready(scene.request('chegg'))
  assert.equal(scene.advance(5000).moving, false)
  assert.equal(scene.advance(0).current, 'knight')
  scene.boot(true)
  assert.equal(scene.advance(0).from, 'knight')
  assert.equal(scene.advance(0).progress, 0)
  assert.equal(scene.advance(RESUME_DISSOLVE_MS).current, 'chegg')
})

test('a failed knight load shows the ready experience directly instead of dissolving empty space', () => {
  const scene = createResumeTransition('knight', false)
  scene.ready(scene.request('chegg'))
  scene.boot(false)
  assert.equal(scene.advance(0).current, 'chegg')
  assert.equal(scene.advance(0).moving, false)
})

test('rapid input finishes the visible dissolve and then takes only the newest loaded role', () => {
  const scene = createResumeTransition('knight')
  scene.ready(scene.request('sapien'))
  scene.advance(RESUME_DISSOLVE_MS / 2)
  const old = scene.request('chegg'), latest = scene.request('void')
  scene.ready(latest)
  assert.equal(scene.ready(old), false)
  const next = scene.advance(RESUME_DISSOLVE_MS / 2)
  assert.equal(next.current, 'sapien')
  assert.equal(next.from, 'sapien')
  assert.equal(next.to, 'void')
  assert.equal(next.progress, 0)
})

test('suspended visible time preserves a partial dissolve and returning reforms the knight', () => {
  const scene = createResumeTransition('knight')
  scene.ready(scene.request('sapien'))
  const partial = scene.advance(400)
  assert.equal(scene.advance(0).progress, partial.progress)
  for (const gap of [-100, NaN, Infinity]) assert.equal(scene.advance(gap).progress, partial.progress)
  scene.advance(RESUME_DISSOLVE_MS)
  scene.ready(scene.request('knight'))
  assert.equal(scene.advance(0).from, 'sapien')
  assert.equal(scene.advance(RESUME_DISSOLVE_MS).current, 'knight')
})

test('reduced motion commits the latest ready model without scheduling a dissolve', () => {
  const scene = createResumeTransition('knight')
  scene.ready(scene.request('sapien'), true)
  assert.equal(scene.advance(0, true).current, 'sapien')
  assert.equal(scene.advance(0, true).moving, false)
  scene.ready(scene.request('chegg'))
  assert.equal(scene.advance(0, true).current, 'chegg')
})
