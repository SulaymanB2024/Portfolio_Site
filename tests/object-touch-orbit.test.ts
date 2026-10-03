import test from 'node:test'
import assert from 'node:assert/strict'
import { installObjectTouchOrbit } from '../src/personal/object-touch-orbit.ts'

function fixture() {
  class Surface extends EventTarget {
    clientHeight = 300
    captured = new Set<number>()
    hasPointerCapture(id: number) { return this.captured.has(id) }
    setPointerCapture(id: number) { this.captured.add(id) }
    releasePointerCapture(id: number) { this.captured.delete(id) }
  }
  const canvas = new Surface()
  const turns: number[] = [], drag: boolean[] = []
  const orbit = { enabled: true, rotateLeft(angle: number) { turns.push(angle) }, update() {} }
  const dispose = installObjectTouchOrbit(canvas as unknown as HTMLCanvasElement, orbit, active => drag.push(active))
  function event(type: string, id: number, x: number, y: number) {
    const event = new Event(type)
    Object.assign(event, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y })
    canvas.dispatchEvent(event)
  }
  return { canvas, orbit, turns, drag, dispose, event }
}

test('vertical touch scroll never turns or captures the sculpture, and cancellation restores mouse controls', () => {
  const f = fixture()
  f.event('pointerdown', 1, 100, 100)
  assert.equal(f.orbit.enabled, false)
  f.event('pointermove', 1, 102, 130)
  f.event('pointermove', 1, 170, 150)
  assert.deepEqual(f.turns, [])
  assert.equal(f.canvas.captured.size, 0)
  f.event('pointercancel', 1, 170, 150)
  assert.equal(f.orbit.enabled, true)
  f.dispose()
})

test('horizontal intent turns once classified, then a second finger releases rotation for native pinch', () => {
  const f = fixture()
  f.event('pointerdown', 1, 100, 100)
  f.event('pointermove', 1, 104, 102)
  assert.deepEqual(f.turns, [])
  f.event('pointermove', 1, 130, 102)
  assert.equal(f.turns.length, 1)
  assert.equal(f.canvas.captured.has(1), true)
  assert.deepEqual(f.drag, [true])
  f.event('pointerdown', 2, 200, 100)
  assert.equal(f.canvas.captured.size, 0)
  assert.deepEqual(f.drag, [true, false])
  f.event('pointermove', 1, 150, 102)
  assert.equal(f.turns.length, 1)
  f.event('pointerup', 1, 150, 102)
  assert.equal(f.orbit.enabled, false)
  f.event('pointerup', 2, 200, 100)
  assert.equal(f.orbit.enabled, true)
  f.dispose()
})

test('disposal releases captured touch and removes handlers without a later control lock', () => {
  const f = fixture()
  f.event('pointerdown', 1, 100, 100)
  f.event('pointermove', 1, 120, 100)
  f.dispose()
  assert.equal(f.canvas.captured.size, 0)
  assert.equal(f.orbit.enabled, true)
  f.event('pointerdown', 2, 200, 100)
  f.event('pointermove', 2, 230, 100)
  assert.equal(f.turns.length, 1)
  assert.equal(f.orbit.enabled, true)
})
