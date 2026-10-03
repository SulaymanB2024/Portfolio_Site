import test from 'node:test'
import assert from 'node:assert/strict'
import { waitForObjectView } from '../src/personal/object-visibility.ts'

function fixture() {
  let entered = 0, disconnected = 0
  let callback!: IntersectionObserverCallback
  const element = {} as Element
  const observer = { observe(target: Element) { assert.equal(target, element) }, disconnect() { disconnected++ } } as IntersectionObserver
  const stop = waitForObjectView(element, () => { entered++ }, (next, options) => {
    callback = next
    assert.deepEqual(options, { rootMargin: '120px 0px', threshold: 0 })
    return observer
  })
  return { stop, get entered() { return entered }, get disconnected() { return disconnected }, update(visible: boolean) { callback([{ isIntersecting: visible } as IntersectionObserverEntry], observer) } }
}

test('an offscreen sculpture performs no initialization and entering initializes once across later scroll changes', () => {
  const f = fixture()
  f.update(false); f.update(false); assert.equal(f.entered, 0)
  f.update(true); f.update(false); f.update(true)
  assert.equal(f.entered, 1)
  assert.equal(f.disconnected, 1)
})

test('an unmounted deferred slot cannot initialize from an already queued observation', () => {
  const f = fixture()
  f.stop(); f.update(true)
  assert.equal(f.entered, 0)
  assert.equal(f.disconnected, 1)
})
