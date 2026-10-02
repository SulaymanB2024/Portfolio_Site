import test from 'node:test'
import assert from 'node:assert/strict'
import { WORK_STUDY_PIXEL_BUDGET, settleWorkStudy, workStudyPose, workStudyRenderSize, workStudyScroll } from '../src/personal/work-study-motion.ts'

test('work rendering stays inside its shared pixel budget on phone, Retina and ultrawide displays', () => {
  for (const [width, height, dpr] of [[390, 844, 3], [1440, 900, 2], [3420, 2214, 2], [7680, 4320, 3], [1920, 1080, 1]]) {
    const size = workStudyRenderSize(width, height, dpr)
    assert(size.width * size.height <= WORK_STUDY_PIXEL_BUDGET)
    assert(size.scaleX <= 1.25 && size.scaleY <= 1.25)
    assert(size.width > 0 && size.height > 0)
    assert(Math.abs(size.scaleX - size.scaleY) <= 1 / Math.min(width, height))
  }
})

test('transient invalid viewport measurements cannot allocate a huge or nonfinite target', () => {
  for (const [width, height, dpr] of [[0, 0, 0], [-1, -10, -2], [NaN, Infinity, NaN], [1e8, 1e8, 20], [1, 1e12, 2], [1e12, 1, 2]]) {
    const size = workStudyRenderSize(width, height, dpr)
    assert(Number.isFinite(size.width) && Number.isFinite(size.height))
    assert(size.width >= 1 && size.height >= 1)
    assert(size.width * size.height <= WORK_STUDY_PIXEL_BUDGET)
  }
})

test('scroll tracking is centered and bounded even far outside the viewport', () => {
  assert.equal(workStudyScroll(300, 300, 900), 0)
  assert.equal(workStudyScroll(900, 300, 900), -1)
  assert.equal(workStudyScroll(-300, 300, 900), 1)
  assert.equal(workStudyScroll(1e7, 300, 900), -1)
  assert.equal(workStudyScroll(-1e7, 300, 900), 1)
  assert(Number.isFinite(workStudyScroll(NaN, Infinity, 0)))
})

test('scroll settling converges monotonically and ends, so paused studies do not retain a RAF', () => {
  for (const [start, target] of [[-1, 1], [1, -1], [-.2, .7]]) {
    let current = start
    let steps = 0
    while (current !== target && steps < 100) {
      const next = settleWorkStudy(current, target, 1 / 30)
      assert(next >= Math.min(current, target) && next <= Math.max(current, target))
      assert(Math.abs(target - next) <= Math.abs(target - current))
      current = next
      steps++
    }
    assert.equal(current, target, 'finite settling must finish at the exact target')
    assert(steps < 40, 'a paused scroll should finish settling within roughly a second')
  }
})

test('a long suspension cannot fling scroll motion or overshoot the target', () => {
  const longGap = settleWorkStudy(-1, 1, 60 * 60)
  assert.equal(longGap, settleWorkStudy(-1, 1, .1))
  assert(longGap > -1 && longGap < 1)
  assert.equal(settleWorkStudy(.2, .7, -1), .2)
  assert.equal(settleWorkStudy(.2, .7, NaN), .2)
})

test('scroll settling is independent of refresh cadence', () => {
  let at30 = -1
  let at60 = -1
  for (let frame = 0; frame < 15; frame++) at30 = settleWorkStudy(at30, .8, 1 / 30)
  for (let frame = 0; frame < 30; frame++) at60 = settleWorkStudy(at60, .8, 1 / 60)
  assert(Math.abs(at30 - at60) < 1e-10)
})

test('idle and scroll poses cannot accumulate turns, large tilts or large translations', () => {
  const pose = { yaw: 0, pitch: 0, roll: 0, y: 0, idleYaw: 0 }
  for (let time = 0; time < 1500; time += .7) {
    for (const track of [-10, -.5, 0, .5, 10]) {
      workStudyPose(time, time % 5, track, true, pose)
      assert(Math.abs(pose.yaw) <= .421)
      assert(Math.abs(pose.pitch) <= .121)
      assert(Math.abs(pose.roll) <= .021)
      assert(Math.abs(pose.y) <= .067)
      assert(Math.abs(pose.idleYaw) <= .171)
    }
  }
})

test('reduced motion removes every time-dependent component while retaining bounded demand input', () => {
  const first = { yaw: 0, pitch: 0, roll: 0, y: 0, idleYaw: 0 }
  const later = { ...first }
  workStudyPose(0, .3, .4, false, first)
  workStudyPose(1e9, 4.4, .4, false, later)
  assert.deepEqual(first, later)
  assert.equal(first.idleYaw, 0)
  assert.equal(first.roll, 0)
})
