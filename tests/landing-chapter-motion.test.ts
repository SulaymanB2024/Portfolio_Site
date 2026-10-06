import test from 'node:test'
import assert from 'node:assert/strict'
import { sculptureRestWeight, sculptureLivingPose, sculptureAnimationActive, mechanicalMotion, mechanicalAngle } from '../src/personal/landing/chapter-motion.ts'
import { thresholdMotion } from '../src/personal/landing/motion-curves.ts'
import { requiredScene } from '../src/personal/landing/sequence.ts'
import { PortfolioRuntime } from '../src/personal/portfolio-runtime.ts'

test('each readable chapter permits manipulation that resolves before its outgoing portal', () => {
  for (const [index, progress] of [0, .21, .46, .71, .96].map((p, i) => [i, p])) assert.ok(Math.abs(sculptureRestWeight(progress, index) - 1) < 1e-12)
  for (let index = 0; index < 4; index++) for (let step = 0; step < 100; step++) {
    const local = step / 100
    if (thresholdMotion(local).travel > 0) assert.equal(sculptureRestWeight((index + local) / 4, index), 0)
  }
  for (let step = 0; step <= 100; step++) {
    const p = step / 100
    const weights = Array.from({ length: 5 }, (_, index) => sculptureRestWeight(p, index, true))
    assert.equal(weights.filter(Boolean).length, 1, 'reduced motion leaves one direct manipulation target')
  }
  assert.equal(sculptureRestWeight(NaN, 0), 0)
  assert.equal(sculptureRestWeight(.5, NaN), 0)
})

test('both visible GLBs keep moving through all four transitions on one retained clock', () => {
  const runtime = new PortfolioRuntime()
  runtime.advance(0, true)
  for (let leg = 0; leg < 4; leg++) for (let frame = 1; frame <= 60; frame++) {
    const progress = (leg + .13 + frame / 60 * .48) / 4
    const visible = requiredScene(progress).indexes
    assert.equal(visible.length, 2)
    const before = visible.map(index => sculptureLivingPose(runtime.seconds, index))
    const nextTime = (leg * 60 + frame) * 1000 / 30
    runtime.advance(nextTime, sculptureAnimationActive(false, true, false, false, false))
    for (const [slot, index] of visible.entries()) {
      const after = sculptureLivingPose(runtime.seconds, index)
      assert.notDeepEqual(after, before[slot], `Chapter ${index} froze in transition ${leg}, frame ${frame}`)
      assert.ok(Object.values(after).every(Number.isFinite))
    }
  }
})

test('living poses stay bounded on phones, and suspending the clock preserves the resume pose', () => {
  for (let index = 0; index < 5; index++) for (let seconds = 0; seconds < 180; seconds += .1) {
    const desktop = sculptureLivingPose(seconds, index), phone = sculptureLivingPose(seconds, index, true)
    assert.ok(Math.abs(desktop.yaw) <= .1 && Math.abs(desktop.pitch) <= .018 && Math.abs(desktop.roll) <= .005)
    for (const axis of ['yaw', 'pitch', 'roll'] as const) assert.ok(Math.abs(phone[axis]) <= Math.abs(desktop[axis]))
    assert.deepEqual(sculptureLivingPose(seconds, index, false, true), { yaw: 0, pitch: 0, roll: 0 })
  }
  for (const flags of [[true,true,false,false,false,true], [false,false,false,false,false,true], [false,true,true,false,false,true], [false,true,false,true,false,true], [false,true,false,false,true,true], [false,true,false,false,false,false]]) {
    assert.equal(sculptureAnimationActive(...flags as [boolean,boolean,boolean,boolean,boolean,boolean]), false)
  }
  assert.equal(sculptureAnimationActive(false, true, false, false, false, true, false), false, 'an unready incoming GLB cannot advance the clock')
  const runtime = new PortfolioRuntime()
  runtime.advance(0,true);runtime.advance(100,true)
  const pose = sculptureLivingPose(runtime.seconds, 4), gear = mechanicalAngle({ angularVelocity: .46, ratio: -1.8 }, runtime.seconds)
  runtime.suspend();runtime.advance(60000,true)
  assert.deepEqual(sculptureLivingPose(runtime.seconds,4),pose)
  assert.equal(mechanicalAngle({angularVelocity:.46,ratio:-1.8},runtime.seconds),gear)
  runtime.advance(60034,true)
  assert.notDeepEqual(sculptureLivingPose(runtime.seconds,4),pose)
})

test('authored gear ratios stay meshed across complete driver revolutions and clock suspension', () => {
  const driver = mechanicalMotion({ kind: 'continuous', angularVelocity: .46, ratio: 1 })!
  const driven = mechanicalMotion({ kind: 'continuous', angularVelocity: .46, ratio: -36 / 20 })!
  for (const seconds of [0, 3, 2 * Math.PI / .46 - .001, 2 * Math.PI / .46 + .001, 600, 7200]) {
    const expected = seconds * .46 * (-36 / 20)
    assert.ok(Math.abs(Math.sin(mechanicalAngle(driven, seconds)) - Math.sin(expected)) < 1e-11)
    assert.ok(Math.abs(Math.cos(mechanicalAngle(driven, seconds)) - Math.cos(expected)) < 1e-11)
    assert.ok(Math.abs(Math.cos(mechanicalAngle(driver, seconds)) - Math.cos(seconds * .46)) < 1e-11)
    assert.equal(mechanicalAngle(driven, seconds, true), 0)
  }
  assert.equal(mechanicalAngle(driven, Infinity), 0)
  assert.equal(mechanicalMotion({ kind: 'continuous', angularVelocity: Infinity }), undefined)
  assert.equal(mechanicalMotion({ kind: 'continuous', angularVelocity: .46, ratio: NaN }), undefined)
  assert.equal(mechanicalMotion({ kind: 'hover', angularVelocity: .46 }), undefined)
})
