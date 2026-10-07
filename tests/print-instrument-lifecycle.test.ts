import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultPrint } from '../src/personal/refinements/print-instrument.ts'
import { mountPrintInstrument } from '../src/personal/refinements/print-instrument-renderer.ts'

test('the print clock suspends without jumps and releases recurring work when closed', () => {
  const page = Object.assign(new EventTarget(), { hidden: false })
  const media = Object.assign(new EventTarget(), { matches: false })
  const callbacks = new Map<number, FrameRequestCallback>()
  const observers = new Set<unknown>()
  let clock = 100, ticket = 0, draws = 0
  const context = { fillRect() { draws++ }, fill() {} }
  const canvas = {
    width: 0, height: 0, dataset: {} as Record<string, string>,
    getContext: () => context,
    getBoundingClientRect: () => ({ width: 312 }),
  }
  const globals: Record<string, unknown> = {
    document: page, matchMedia: () => media, devicePixelRatio: 2,
    requestAnimationFrame: (callback: FrameRequestCallback) => { callbacks.set(++ticket, callback); return ticket },
    cancelAnimationFrame: (id: number) => { callbacks.delete(id) },
    Path2D: class { moveTo() {} arc() {} },
    ResizeObserver: class { observe() { observers.add(this) } disconnect() { observers.delete(this) } },
  }
  const original = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value })
  function advance(milliseconds: number) {
    clock += milliseconds
    const pending = [...callbacks.values()]
    callbacks.clear()
    pending.forEach(callback => callback(clock))
  }
  try {
    const player = mountPrintInstrument(canvas as unknown as HTMLCanvasElement, defaultPrint)!
    assert.equal(callbacks.size, 1)
    assert.equal(canvas.width, 624)
    for (let n = 0; n < 20; n++) advance(17)
    assert(player.snapshot().phase > defaultPrint.phase)

    player.setHeld(true)
    const held = player.snapshot().phase, heldDraws = draws
    advance(60000)
    assert.equal(callbacks.size, 0)
    assert.equal(player.snapshot().phase, held)
    assert.equal(draws, heldDraws)
    player.update({ ...defaultPrint, grain: 90, phase: 0 })
    assert.equal(player.snapshot().phase, held, 'parameter edits retain the captured pose')
    assert(draws > heldDraws, 'a still study remains directly editable')

    player.setHeld(false)
    page.hidden = true; page.dispatchEvent(new Event('visibilitychange'))
    const hidden = player.snapshot().phase
    advance(600000)
    assert.equal(callbacks.size, 0)
    assert.equal(player.snapshot().phase, hidden)
    page.hidden = false; page.dispatchEvent(new Event('visibilitychange'))
    advance(17)
    assert.equal(player.snapshot().phase, hidden, 'returning does not add the hidden interval')
    advance(34)
    assert(player.snapshot().phase > hidden && player.snapshot().phase - hidden < .01)

    media.matches = true; media.dispatchEvent(new Event('change'))
    const reduced = player.snapshot().phase
    advance(600000)
    assert.equal(callbacks.size, 0)
    assert.equal(player.snapshot().phase, reduced)
    media.matches = false; media.dispatchEvent(new Event('change'))
    advance(17)
    assert.equal(player.snapshot().phase, reduced)
    advance(34)
    assert(player.snapshot().phase > reduced)

    const finalPose = player.snapshot()
    player.dispose()
    const closedDraws = draws
    page.dispatchEvent(new Event('visibilitychange')); media.dispatchEvent(new Event('change'))
    advance(600000)
    assert.equal(callbacks.size, 0)
    assert.equal(observers.size, 0)
    assert.equal(draws, closedDraws)
    assert.equal(canvas.dataset.state, 'closed')
    const reopened = mountPrintInstrument(canvas as unknown as HTMLCanvasElement, finalPose)!
    assert(Math.abs(reopened.snapshot().phase - finalPose.phase) < 1e-12)
    assert.equal(callbacks.size, 1, 'reopening owns one clock')
    reopened.dispose()
    assert.equal(callbacks.size, 0)
    assert.equal(observers.size, 0)
  } finally {
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else Reflect.deleteProperty(globalThis, key)
    }
  }
})
