import test from 'node:test'
import assert from 'node:assert/strict'
import { MeshStandardMaterial, Texture, Vector3 } from 'three'
import { cloneInterestBoardMaterial, composeInterestView, settleInterestValue, settleInterestView, writeKnightDestination } from '../src/personal/about/interest-motion.ts'
import { PortfolioRuntime } from '../src/personal/portfolio-runtime.ts'

test('pausing retains the exact settled idle pose without an easing tail or hidden time', () => {
  const runtime = new PortfolioRuntime()
  const view = { yaw: 0, pitch: 0 }
  const rotation = { x: 0, y: 0 }
  for (let frame = 0; frame <= 240; frame++) {
    runtime.advance(frame * 1000 / 30, true)
    settleInterestView(view, -.24, -.10, runtime.delta)
    composeInterestView(view, 1, runtime.seconds, false, rotation)
  }
  assert.deepEqual(view, { yaw: -.24, pitch: -.10 })
  const paused = { ...rotation }
  const phase = runtime.seconds
  runtime.suspend()
  for (let frame = 0; frame < 90; frame++) {
    runtime.advance(9000 + frame * 1000 / 30, false)
    settleInterestView(view, -.24, -.10, runtime.delta)
    composeInterestView(view, 1, runtime.seconds, false, rotation)
    assert.deepEqual(rotation, paused)
  }
  runtime.suspend()
  runtime.advance(90_000, true)
  composeInterestView(view, 1, runtime.seconds, false, rotation)
  assert.deepEqual(rotation, paused)
  assert.equal(runtime.seconds, phase)
  runtime.advance(90_000 + 1000 / 30, true)
  composeInterestView(view, 1, runtime.seconds, false, rotation)
  assert(Math.abs(rotation.y - paused.y) < .002)
})

test('manual and selection views settle monotonically at the same rate across refresh cadences', () => {
  const at30 = { yaw: -.24, pitch: 0 }
  const at60 = { ...at30 }
  let previous = at30.yaw
  for (let frame = 0; frame < 20; frame++) {
    assert.equal(settleInterestView(at30, .70, .67, 1 / 30), true)
    assert(at30.yaw >= previous && at30.yaw < .70)
    previous = at30.yaw
  }
  for (let frame = 0; frame < 40; frame++) settleInterestView(at60, .70, .67, 1 / 60)
  assert(Math.abs(at30.yaw - at60.yaw) < 1e-12)
  assert(Math.abs(at30.pitch - at60.pitch) < 1e-12)
  for (let frame = 0; frame < 100; frame++) settleInterestView(at30, .70, .67, 1 / 30)
  assert.deepEqual(at30, { yaw: .70, pitch: .67 })
  assert.equal(settleInterestView(at30, .70, .67, 1 / 30), false)
  assert.equal(settleInterestValue(0, 1, 3600), settleInterestValue(0, 1, .1))
  assert.equal(settleInterestValue(.2, .7, NaN), .2)
})

test('reduced motion keeps the requested view and omits time-dependent idle offsets', () => {
  const view = { yaw: 0, pitch: 0 }
  const rotation = { x: 0, y: 0 }
  assert.equal(settleInterestView(view, Math.PI - .22, .67, 0, true), false)
  for (const seconds of [0, 50, 1e9]) {
    composeInterestView(view, 2, seconds, true, rotation)
    assert.deepEqual(rotation, { x: .67, y: Math.PI - .22 })
  }
})

test('knight destination reuses its output while retaining source pivots and tile coordinates', () => {
  const start = new Vector3(.1, -.3, .2)
  const source = new Vector3(-.98, .04, .98)
  const destination = new Vector3(.98, .04, -.98)
  const inputs = [start, source, destination].map(vector => vector.toArray())
  const output = new Vector3()
  for (let frame = 0; frame < 1000; frame++) {
    assert.equal(writeKnightDestination(start, source, destination, output), true)
    assert(Math.abs(output.x - 2.06) < 1e-12)
    assert(Math.abs(output.y + .3) < 1e-12)
    assert(Math.abs(output.z + 1.76) < 1e-12)
  }
  assert.deepEqual([start, source, destination].map(vector => vector.toArray()), inputs)
  const retained = output.toArray()
  assert.equal(writeKnightDestination(start, source, undefined, output), false)
  assert.deepEqual(output.toArray(), retained)
})

test('board fade clones are deduplicated and isolated from shared body material ownership', () => {
  const texture = new Texture()
  const originals = Array.from({ length: 4 }, (_, index) => new MeshStandardMaterial({ color: index * 0x111111, map: texture }))
  const copies = new Map()
  const assigned = Array.from({ length: 66 }, (_, index) => cloneInterestBoardMaterial(originals[index % 4], copies))
  assert.equal(copies.size, 4)
  assert.equal(new Set(assigned).size, 4)
  assert(assigned.every(material => material.opacity === 0), 'board fades start with their initial zero coverage')
  for (let index = 0; index < assigned.length; index++) {
    assert.notEqual(assigned[index], originals[index % 4])
    assert.equal((assigned[index] as MeshStandardMaterial).map, texture)
    assigned[index].opacity = .35
  }
  assert(originals.every(material => material.opacity === 1))
  assert(assigned.every(material => material.opacity === .35))
  const otherBoard = new Map()
  assert.notEqual(cloneInterestBoardMaterial(originals[0], otherBoard), assigned[0])
  for (const material of [...originals, ...copies.values(), ...otherBoard.values()]) material.dispose()
  texture.dispose()
})
