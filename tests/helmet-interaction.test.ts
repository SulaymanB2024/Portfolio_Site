import test from 'node:test'
import assert from 'node:assert/strict'
import { dragHelmet, helmetGesture, helmetKey, helmetTurn, settleHelmet } from '../src/personal/landing/helmet-interaction.ts'

test('touch rotation leaves vertical, diagonal, small and nonfinite movements to native scrolling', () => {
  assert.equal(helmetGesture(5, 2), 'pending')
  assert.equal(helmetGesture(2, 20), 'scroll')
  assert.equal(helmetGesture(20, 20), 'scroll')
  assert.equal(helmetGesture(-24, 6), 'rotate')
  assert.equal(helmetGesture(NaN, 20), 'pending')
  const start = { yaw: .2, pitch: -.1 }
  const touch = dragHelmet(start, 80, 300, 320, true)
  assert.equal(touch.pitch, start.pitch)
  assert.ok(touch.yaw > start.yaw)
  assert.equal(dragHelmet(start, 0, 300, 320).pitch, .48)
})

test('drag and keyboard allow the entire helmet to be inspected without overturning it', () => {
  const halfTurn = dragHelmet({ yaw: 0, pitch: 0 }, 300, 0, 300)
  assert.ok(Math.abs(halfTurn.yaw - Math.PI) < 1e-12)
  assert.equal(halfTurn.pitch, 0)
  assert.deepEqual(dragHelmet({ yaw: 0, pitch: 0 }, -10000, -10000, 0), { yaw: -Math.PI, pitch: -.48 })
  let turn = { yaw: 0, pitch: 0 }
  for (let index = 0; index < 50; index++) turn = helmetKey(turn, 'ArrowRight')!
  assert.equal(turn.yaw, Math.PI)
  assert.deepEqual(helmetKey(turn, 'Home'), { yaw: 0, pitch: 0 })
  assert.deepEqual(helmetKey(turn, 'Escape'), { yaw: 0, pitch: 0 })
  assert.equal(helmetKey(turn, 'Tab'), null, 'retain normal keyboard navigation')
  assert.deepEqual(helmetTurn({ yaw: NaN, pitch: Infinity }), { yaw: 0, pitch: 0 })
})

test('settling is stable across frame rates, while direct and reduced motion manipulation is immediate', () => {
  const target = { yaw: 1, pitch: .3 }
  const simulate = (fps: number) => {
    let current = { yaw: 0, pitch: 0 }
    for (let frame = 0; frame < fps / 2; frame++) current = settleHelmet(current, target, 1 / fps)
    return current
  }
  assert.ok(Math.abs(simulate(60).yaw - simulate(30).yaw) < .00001)
  assert.deepEqual(settleHelmet({ yaw: 0, pitch: 0 }, target, 0, true), target)
  assert.deepEqual(settleHelmet({ yaw: 0, pitch: 0 }, target, NaN), { yaw: 0, pitch: 0 })
  let current = { yaw: 0, pitch: 0 }
  for (let frame = 0; frame < 120; frame++) current = settleHelmet(current, target, 1 / 60)
  assert.deepEqual(current, target, 'the input settles so a paused scene can stop drawing')
})
