import test from 'node:test'
import assert from 'node:assert/strict'
import { installRouteScroll } from '../src/personal/refinements/route-scroll.ts'

function fixture(state: unknown = { retained: 'foreign router state' }) {
  const events = new EventTarget()
  const entries: unknown[] = [state]
  let index = 0, serial = 0
  const frames = new Map<number, FrameRequestCallback>()
  const calls: ScrollToOptions[] = []
  const history = {
    get state() { return entries[index] },
    scrollRestoration: 'auto',
    replaceState(value: unknown) { entries[index] = value },
  }
  const host = Object.assign(events, {
    history, scrollX: 0, scrollY: 0,
    requestAnimationFrame(callback: FrameRequestCallback) { const id = ++serial; frames.set(id, callback); return id },
    cancelAnimationFrame(id: number) { frames.delete(id) },
    scrollTo(value: ScrollToOptions) { calls.push(value); host.scrollX = value.left ?? 0; host.scrollY = value.top ?? 0 },
  })
  let scroll = installRouteScroll(host as unknown as Window)
  const move = (top: number) => { host.scrollY = top; events.dispatchEvent(new Event('scroll')) }
  const push = () => { entries.splice(index + 1); entries.push(null); index++; events.dispatchEvent(new Event('popstate')); return scroll.begin() }
  const back = () => { index--; events.dispatchEvent(new Event('popstate')); return scroll.begin() }
  const forward = () => { index++; events.dispatchEvent(new Event('popstate')); return scroll.begin() }
  const paint = () => { for (const [id, callback] of [...frames]) { frames.delete(id); callback(0) } }
  const remount = () => { scroll.dispose(); scroll = installRouteScroll(host as unknown as Window) }
  return { entries, host, history, get scroll() { return scroll }, move, push, back, forward, paint, frames, calls, remount }
}

test('Back and Forward restore each entry while a new destination starts at the top', () => {
  const f = fixture()
  f.move(780)
  const project = f.push(); f.scroll.commit(project); f.paint()
  assert.equal(f.host.scrollY, 0)
  f.move(460)
  const collection = f.back(); f.scroll.commit(collection); f.paint()
  assert.equal(f.host.scrollY, 780)
  const revisit = f.forward(); f.scroll.commit(revisit); f.paint()
  assert.equal(f.host.scrollY, 460)
  assert.equal((f.entries[0] as { retained: string }).retained, 'foreign router state')
  f.scroll.dispose()
})

test('scrolling the old page while a route loads cannot overwrite its saved destination', () => {
  const f = fixture()
  f.move(780); f.scroll.commit(f.push()); f.paint(); f.move(320)
  const collection = f.back()
  f.move(15)
  f.scroll.commit(collection); f.paint()
  assert.equal(f.host.scrollY, 780)
  f.scroll.commit(f.forward()); f.paint()
  assert.equal(f.host.scrollY, 320)
  f.scroll.dispose()
})

test('a rapid second navigation cancels and settles the stale page-position frame', async () => {
  const f = fixture()
  f.move(780); f.scroll.commit(f.push()); f.paint()
  const abandoned = f.scroll.commit(f.back())
  f.scroll.commit(f.push()); f.paint()
  await abandoned
  assert.equal(f.host.scrollY, 0)
  assert.equal(f.frames.size, 0)
  f.scroll.dispose()
})

test('same-page contents navigation remains with its reader and keeps later scroll capture', () => {
  const f = fixture()
  f.move(220)
  f.scroll.samePage(f.push())
  assert.equal(f.host.scrollY, 220)
  assert.equal(f.calls.length, 0)
  f.move(1400)
  f.scroll.commit(f.push()); f.paint()
  f.scroll.commit(f.back()); f.paint()
  assert.equal(f.host.scrollY, 1400)
  f.scroll.dispose()
})

test('disposal restores native policy and removes pending frames and event work', () => {
  const f = fixture()
  assert.equal(f.history.scrollRestoration, 'manual')
  f.scroll.commit(f.push())
  f.scroll.dispose(); f.paint(); f.move(500)
  assert.equal(f.history.scrollRestoration, 'auto')
  assert.equal(f.frames.size, 0)
  assert.equal(f.calls.length, 0)
})

test('primitive foreign history state stays intact and native restoration remains available', () => {
  const f = fixture('external state')
  assert.equal(f.history.state, 'external state')
  assert.equal(f.history.scrollRestoration, 'auto')
  f.scroll.dispose()
})

test('a remount within one clock tick cannot reuse the previous history-entry marker', () => {
  const clock = Date.now
  Date.now = () => 123
  try {
    const f = fixture()
    f.remount(); f.move(780)
    f.scroll.commit(f.push()); f.paint()
    assert.equal(f.host.scrollY, 0)
    f.scroll.commit(f.back()); f.paint()
    assert.equal(f.host.scrollY, 780)
    f.scroll.dispose()
  } finally { Date.now = clock }
})
