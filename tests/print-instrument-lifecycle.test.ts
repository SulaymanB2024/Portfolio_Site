import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultPrint } from '../src/personal/refinements/print-instrument.ts'
import { mountPrintInstrument } from '../src/personal/refinements/print-instrument-renderer.ts'

test('the print clock suspends without jumps and releases recurring work when closed', () => {
  const page = Object.assign(new EventTarget(), { hidden: false })
  const media = Object.assign(new EventTarget(), { matches: false })
  const callbacks = new Map<number, FrameRequestCallback>()
  const observers = new Set<unknown>()
  const intersections = new Set<(visible: boolean) => void>()
  const resizes = new Set<() => void>()
  const resizeTargets = new Set<unknown>()
  const viewports: { options?: IntersectionObserverInit; targets: Set<unknown>; connected: boolean; notify(visible: boolean, ratio?: number): void }[] = []
  let headerHeight = 51
  const header = { getBoundingClientRect: () => ({ height: headerHeight }) }
  const dialog = { querySelector: () => header }
  let scrollport: typeof dialog | null = null
  let clock = 100, ticket = 0, draws = 0
  const context = { fillRect() { draws++ }, fill() {} }
  const canvas = {
    width: 0, height: 0, dataset: {} as Record<string, string>,
    getContext: () => context,
    getBoundingClientRect: () => ({ width: 312 }),
    closest: () => scrollport,
  }
  const globals: Record<string, unknown> = {
    document: page, matchMedia: () => media, devicePixelRatio: 2,
    requestAnimationFrame: (callback: FrameRequestCallback) => { callbacks.set(++ticket, callback); return ticket },
    cancelAnimationFrame: (id: number) => { callbacks.delete(id) },
    Path2D: class { moveTo() {} arc() {} },
    ResizeObserver: class {
      notify: () => void
      targets = new Set<unknown>()
      constructor(notify: () => void) { this.notify = notify }
      observe(target: unknown) { this.targets.add(target); resizeTargets.add(target); observers.add(this); resizes.add(this.notify) }
      disconnect() { for (const target of this.targets) resizeTargets.delete(target); this.targets.clear(); observers.delete(this); resizes.delete(this.notify) }
    },
    IntersectionObserver: class {
      notify: (visible: boolean, ratio?: number) => void
      options?: IntersectionObserverInit
      targets = new Set<unknown>()
      connected = true
      constructor(callback: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void, options?: IntersectionObserverInit) {
        this.options = options
        this.notify = (visible, ratio = Number(visible)) => callback([{ isIntersecting: visible, intersectionRatio: ratio }])
        viewports.push(this)
      }
      observe(target: unknown) { this.targets.add(target); observers.add(this); intersections.add(this.notify) }
      disconnect() { this.connected = false; this.targets.clear(); observers.delete(this); intersections.delete(this.notify) }
    },
  }
  const original = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value })
  function advance(milliseconds: number) {
    clock += milliseconds
    const pending = [...callbacks.values()]
    callbacks.clear()
    pending.forEach(callback => callback(clock))
  }
  function intersect(visible: boolean) { for (const notify of intersections) notify(visible) }
  try {
    const player = mountPrintInstrument(canvas as unknown as HTMLCanvasElement, defaultPrint)!
    assert.equal(callbacks.size, 1)
    assert.equal(canvas.width, 624)
    assert.equal(viewports[0].options?.root, null, 'a standalone canvas uses the native viewport')
    assert.equal(viewports[0].options?.rootMargin, '0px 0px 0px 0px')
    resizes.forEach(notify => notify())
    assert.equal(viewports.length, 1, 'an unchanged size retains its intersection observer')
    for (let n = 0; n < 20; n++) advance(17)
    assert(player.snapshot().phase > defaultPrint.phase)

    intersect(false)
    const clipped = player.snapshot().phase, clippedDraws = draws
    advance(600000)
    assert.equal(callbacks.size, 0, 'a canvas clipped by the dialog scrollport owns no recurring frame')
    assert.equal(player.snapshot().phase, clipped)
    assert.equal(draws, clippedDraws)
    player.update({ ...defaultPrint, grain: 80 })
    assert.equal(player.snapshot().phase, clipped, 'offscreen edits retain the visible playback phase')
    assert(draws > clippedDraws, 'explicit edits still paint once')
    player.setHeld(true); player.setHeld(false)
    assert.equal(callbacks.size, 0)
    intersect(true)
    assert.equal(callbacks.size, 1)
    advance(17)
    assert.equal(player.snapshot().phase, clipped, 'returning does not count the clipped interval')
    advance(34)
    assert(player.snapshot().phase > clipped && player.snapshot().phase - clipped < .01)

    player.setHeld(true)
    intersect(false); intersect(true)
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
    intersect(false); intersect(true)
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
    intersect(false); intersect(true)
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
    const staleIntersections = [...intersections]
    const staleResizes = [...resizes]
    player.dispose()
    const closedDraws = draws
    for (const notify of staleIntersections) { notify(false); notify(true) }
    staleResizes.forEach(notify => notify())
    player.setHeld(false); player.update(defaultPrint)
    page.dispatchEvent(new Event('visibilitychange')); media.dispatchEvent(new Event('change'))
    advance(600000)
    assert.equal(callbacks.size, 0)
    assert.equal(observers.size, 0)
    assert.equal(intersections.size, 0)
    assert.equal(resizes.size, 0)
    assert.equal(draws, closedDraws)
    assert.equal(canvas.dataset.state, 'closed')
    const reopened = mountPrintInstrument(canvas as unknown as HTMLCanvasElement, finalPose)!
    assert(Math.abs(reopened.snapshot().phase - finalPose.phase) < 1e-12)
    assert.equal(callbacks.size, 1, 'reopening owns one clock')
    reopened.dispose()
    assert.equal(callbacks.size, 0)
    assert.equal(observers.size, 0)

    scrollport = dialog
    const studio = mountPrintInstrument(canvas as unknown as HTMLCanvasElement, finalPose)!
    const clippedViewport = viewports.at(-1)!
    assert.equal(clippedViewport.options?.root, dialog, 'the drawing uses its exact dialog scrollport')
    assert.equal(clippedViewport.options?.rootMargin, '-51px 0px 0px 0px', 'the opaque sticky header is excluded from the visible area')
    assert(clippedViewport.targets.has(canvas))
    assert(resizeTargets.has(header), 'the existing resize observer follows responsive header height')
    clippedViewport.notify(true, .001)
    advance(17); advance(34)
    const partiallyVisible = studio.snapshot().phase
    assert(partiallyVisible > finalPose.phase, 'a small real intersection keeps the drawing playing')

    clippedViewport.notify(false)
    const occluded = studio.snapshot().phase, occludedDraws = draws
    advance(600000)
    assert.equal(callbacks.size, 0, 'a canvas hidden behind the header owns no frame')
    assert.equal(studio.snapshot().phase, occluded)
    assert.equal(draws, occludedDraws)
    const beforeResize = viewports.length
    resizes.forEach(notify => notify())
    assert.equal(viewports.length, beforeResize, 'canvas or dialog layout changes alone do not reconnect the observer')
    headerHeight = 73
    resizes.forEach(notify => notify())
    const resizedViewport = viewports.at(-1)!
    assert.equal(viewports.length, beforeResize + 1)
    assert.equal(resizedViewport.options?.root, dialog)
    assert.equal(resizedViewport.options?.rootMargin, '-73px 0px 0px 0px')
    assert.equal(clippedViewport.connected, false)
    assert.equal(clippedViewport.targets.size, 0)
    clippedViewport.notify(true)
    advance(600000)
    assert.equal(callbacks.size, 0, 'a stale replacement callback cannot restart an occluded drawing')
    assert.equal(studio.snapshot().phase, occluded)

    resizedViewport.notify(true, .001)
    assert.equal(callbacks.size, 1)
    advance(17)
    assert.equal(studio.snapshot().phase, occluded, 'a new observer resumes the retained phase')
    advance(34)
    assert(studio.snapshot().phase > occluded && studio.snapshot().phase - occluded < .01)
    studio.setHeld(true)
    const studioHeld = studio.snapshot().phase
    headerHeight = 45
    resizes.forEach(notify => notify())
    const finalViewport = viewports.at(-1)!
    assert.equal(finalViewport.options?.rootMargin, '-45px 0px 0px 0px')
    finalViewport.notify(true, .001)
    advance(600000)
    assert.equal(callbacks.size, 0, 'responsive re-observation does not override Hold')
    assert.equal(studio.snapshot().phase, studioHeld)
    studio.dispose()
    finalViewport.notify(false); finalViewport.notify(true)
    assert.equal(callbacks.size, 0)
    assert.equal(observers.size, 0)
    assert.equal(resizeTargets.size, 0)
    assert.equal(intersections.size, 0)
    assert.equal(resizes.size, 0)
  } finally {
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else Reflect.deleteProperty(globalThis, key)
    }
  }
})
