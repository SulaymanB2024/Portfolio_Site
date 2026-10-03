import test from 'node:test'
import assert from 'node:assert/strict'
import { PortfolioRuntime } from '../src/personal/portfolio-runtime.ts'

test('visible clock retains phase across suspension and pause, while delta remains bounded', () => {
  const runtime = new PortfolioRuntime()
  runtime.advance(100, true)
  runtime.advance(140, true)
  assert.equal(runtime.seconds, .04)
  runtime.suspend()
  runtime.advance(90_000, true)
  assert.equal(runtime.seconds, .04)
  runtime.advance(90_040, false)
  assert.equal(runtime.seconds, .04)
  assert.equal(runtime.delta, .04)
  runtime.advance(100_000, true)
  assert.equal(runtime.delta, .1)
  assert.equal(runtime.seconds, .14)
})

test('deadline scheduling paints thirty frames per second at 60, 90, 120 and 144 Hz', () => {
  for (const rate of [60, 90, 120, 144]) {
    const runtime = new PortfolioRuntime()
    let frames = 0
    for (let index = 0; index < rate * 10; index++) if (runtime.canPaint(index * 1000 / rate)) frames++
    assert.ok(Math.abs(frames - 300) <= 1, `${rate}Hz produced ${frames} frames`)
    assert.equal(runtime.canPaint(10_001, true), true)
    assert.equal(runtime.canPaint(NaN), false)
  }
})

test('sleeping until a paint deadline preserves cadence and urgent input bypasses the sleep', () => {
  for (const rate of [60, 90, 120, 144]) {
    const runtime = new PortfolioRuntime()
    let frames = 0, callbacks = 0, wakeAt = 0
    for (let index = 0; index < rate * 10; index++) {
      const now = index * 1000 / rate
      if (now < wakeAt) continue
      callbacks++
      if (runtime.canPaint(now)) frames++
      wakeAt = now + runtime.paintDelay(now)
    }
    assert.ok(Math.abs(frames - 300) <= 1, `${rate}Hz produced ${frames} paints`)
    assert.ok(callbacks <= 600, `${rate}Hz produced ${callbacks} callbacks`)
    assert.equal(runtime.canPaint(10_001, true), true)
    assert.ok(runtime.paintDelay(10_001) > 0)
    runtime.suspend()
    assert.equal(runtime.paintDelay(10_001), 0)
  }
  assert.equal(new PortfolioRuntime().paintDelay(NaN), 0)
})

test('two bad windows reduce pixels and eight good seconds restore resolution', () => {
  const runtime = new PortfolioRuntime()
  runtime.advance(0, true)
  for (let now = 50; now < 4000; now += 50) runtime.advance(now, true)
  assert.equal(runtime.scale, 1)
  assert.equal(runtime.advance(4000, true), true)
  assert.equal(runtime.scale, .8)
  let now = 4000
  for (let index = 0; index < 240; index++) { now += 1000 / 30; runtime.advance(now, true) }
  // Windows may cross their exact boundary by one display interval.
  for (let index = 0; index < 4; index++) { now += 1000 / 30; runtime.advance(now, true) }
  assert.equal(runtime.scale, 1)
})

test('gestures, stationary states and hidden gaps cannot trigger resolution changes', () => {
  for (const [moving, blocked] of [[true, true], [false, false]]) {
    const runtime = new PortfolioRuntime()
    for (let now = 0; now <= 12000; now += 50) runtime.advance(now, moving, blocked)
    assert.equal(runtime.scale, 1)
  }
  const runtime = new PortfolioRuntime()
  for (let now = 0; now <= 2000; now += 50) runtime.advance(now, true)
  runtime.suspend()
  for (let now = 10000; now <= 12000; now += 50) runtime.advance(now, true)
  assert.equal(runtime.scale, 1)
})
