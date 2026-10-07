import test from 'node:test'
import assert from 'node:assert/strict'
import { openingMotionWeight, openingSculpturePose, openingInkReveal } from '../src/personal/landing/opening-motion.ts'
import { thresholdMotion } from '../src/personal/landing/motion-curves.ts'

const neutral = { yaw: 0, pitch: 0, roll: 0, x: 0, y: 0, lightX: 0, lightY: 0 }

test('first-paint ink has a visible entrance across the idle budget, with exact and reduced endpoints', () => {
  const frames = Array.from({ length: 25 }, (_, index) => openingInkReveal(index * 1000 / 30))
  assert.equal(frames[0], 0)
  assert.ok(frames.filter(value => value > 0 && value < 1).length >= 15)
  assert.ok(openingInkReveal(140) < .1, 'the old four-frame pop must remain near the start')
  assert.ok(frames.every((value, index) => value >= 0 && value <= 1 && (!index || value >= frames[index - 1])))
  assert.equal(openingInkReveal(640), 1)
  assert.equal(openingInkReveal(5000), 1)
  assert.equal(openingInkReveal(-100), 0)
  assert.equal(openingInkReveal(NaN), 0)
  assert.equal(openingInkReveal(0, true), 1)
})

test('idle movement resolves before the actual visor opens, including reverse scroll and reduced motion', () => {
  assert.deepEqual(openingSculpturePose(0, 0), neutral, 'retain the approved first pose without an entrance animation')
  assert.equal(openingMotionWeight(0), 1)
  const positions = Array.from({ length: 201 }, (_, index) => index / 200)
  const poses = positions.map(progress => openingMotionWeight(progress))
  assert.deepEqual(poses, [...positions].reverse().map(progress => openingMotionWeight(progress)).reverse())
  for (let index = 0; index <= 1000; index++) {
    const progress = index / 1000
    if (thresholdMotion(progress * 4).travel > 0 || progress >= .25) {
      assert.equal(openingMotionWeight(progress), 0)
      assert.deepEqual(openingSculpturePose(13, progress), neutral)
    }
    assert.ok(openingMotionWeight(progress) <= 1 && openingMotionWeight(progress) >= 0)
  }
  assert.deepEqual(openingSculpturePose(13, 0, false, true), neutral)
  assert.equal(openingMotionWeight(NaN), 0)
  assert.deepEqual(openingSculpturePose(Infinity, 0), neutral)
})

test('the GLB stays restrained through long sessions with a fixed light and a smaller turn on phones', () => {
  let moved = false
  for (let seconds = 0; seconds <= 1200; seconds += .5) {
    const desktop = openingSculpturePose(seconds, 0)
    const phone = openingSculpturePose(seconds, 0, true)
    assert.ok(Object.values(desktop).every(Number.isFinite))
    assert.ok(Math.abs(desktop.yaw) <= .16 && Math.abs(desktop.pitch) <= .027 && Math.abs(desktop.roll) <= .008)
    assert.ok(Math.abs(desktop.x) <= .025 && Math.abs(desktop.y) <= .055)
    assert.equal(desktop.lightX, 0)
    assert.equal(desktop.lightY, 0)
    for (const key of Object.keys(desktop) as (keyof typeof desktop)[]) assert.ok(Math.abs(phone[key]) <= Math.abs(desktop[key]))
    moved ||= Math.abs(desktop.yaw) > .04
  }
  assert.equal(moved, true)
})
