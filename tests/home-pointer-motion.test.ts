import test from 'node:test'
import assert from 'node:assert/strict'
import { allowHomePointer, homePointerPose, homePointerRest, homePointerSettled, settleHomePointer } from '../src/personal/home-pointer-policy.ts'

const idleMouse = { fine: true, reduced: false, hidden: false, busy: false, dragging: false, focused: false, pointerType: 'mouse', buttons: 0, selection: false }
test('cursor motion is opt-out for accessibility and never joins touch, dragging or a handoff', () => {
  assert.equal(allowHomePointer(idleMouse), true)
  for (const change of [{ fine: false }, { reduced: true }, { hidden: true }, { busy: true }, { dragging: true }, { focused: true }, { pointerType: 'touch' }, { pointerType: 'pen' }, { buttons: 1 }, { selection: true }]) {
    assert.equal(allowHomePointer({ ...idleMouse, ...change }), false)
  }
})
test('coordinates use the fixed native area, remain bounded, and center at rest', () => {
  const rect = { left: 20, top: 50, width: 300, height: 500 }
  assert.deepEqual(homePointerPose(170, 300, rect), { x: 0, y: 0, engagement: 1 })
  assert.deepEqual(homePointerPose(-100, 900, rect), { x: -1, y: 1, engagement: 1 })
  assert.deepEqual(homePointerPose(320, 50, rect), { x: 1, y: -1, engagement: 1 })
})
test('missing and non-finite layout measurements fail to the neutral pose', () => {
  for (const rect of [{ left: 0, top: 0, width: 0, height: 100 }, { left: 0, top: 0, width: 100, height: -1 }, { left: NaN, top: 0, width: 100, height: 100 }]) assert.deepEqual(homePointerPose(20, 40, rect), homePointerRest)
  assert.deepEqual(homePointerPose(Infinity, 40, { left: 0, top: 0, width: 100, height: 100 }), homePointerRest)
})
test('response has the same pace on 30, 60 and 120Hz displays without overshoot', () => {
  const target = { x: 1, y: -1, engagement: 1 }
  const run = (fps: number) => {
    let pose = { ...homePointerRest }
    for (let n = 0; n < fps / 5; n++) pose = settleHomePointer(pose, target, 1 / fps)
    return pose
  }
  const baseline = run(30)
  for (const fps of [60, 120]) {
    const pose = run(fps)
    assert.ok(Math.abs(pose.x - baseline.x) < 1e-10)
    assert.ok(Math.abs(pose.y - baseline.y) < 1e-10)
    assert.ok(pose.engagement >= 0 && pose.engagement <= 1)
  }
})
test('leaving the area settles exactly to zero and a stalled frame stays bounded', () => {
  let pose = { x: 1, y: -1, engagement: 1 }
  const interrupted = settleHomePointer(pose, homePointerRest, 5)
  assert.ok(interrupted.x > 0 && interrupted.x < 1)
  for (let n = 0; n < 60; n++) pose = settleHomePointer(pose, homePointerRest, 1 / 60)
  assert.deepEqual(pose, homePointerRest)
  assert.equal(homePointerSettled(pose, homePointerRest), true)
  assert.equal(homePointerSettled(interrupted, homePointerRest), false)
})
