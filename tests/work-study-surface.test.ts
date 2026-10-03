import test from 'node:test'
import assert from 'node:assert/strict'
import { anchorWorkStudySurface } from '../src/personal/work-study-surface.ts'

function surface() {
  const rect = { left: 70.25, top: 320.625 }
  const parent = { clientLeft: 0, clientTop: 0, scrollLeft: 0, scrollTop: 0, getBoundingClientRect: () => rect }
  let writes = 0
  const style = new Proxy({ position: '', left: '', top: '', width: '', height: '' }, {
    set(target, key, value) { writes++; Reflect.set(target, key, value); return true },
  })
  const canvas = { style, offsetParent: parent } as unknown as HTMLCanvasElement
  return { rect, parent, canvas, style, writes: () => writes }
}

test('cached sculpture pixels stay attached to their slots before another GPU paint', () => {
  const { rect, canvas, style } = surface()
  anchorWorkStudySurface(canvas, false, 1280, 720)
  const slot = { x: 762.125, y: 410.5 }
  // The cached image has viewport coordinates from its most recent paint.
  const imagePixel = { x: rect.left + slot.x, y: rect.top + slot.y }
  const cachedLeft = parseFloat(style.left), cachedTop = parseFloat(style.top)
  for (const scroll of [0, .25, 1.5, 120, 600, 27.75, -40, 0]) {
    rect.top = 320.625 - scroll
    const canvasTop = rect.top + cachedTop
    assert.equal(canvasTop + imagePixel.y, rect.top + slot.y)
    assert.equal(rect.left + cachedLeft + imagePixel.x, rect.left + slot.x)
    assert.equal(style.top, `${cachedTop}px`, 'scrolling must not reset the bitmap origin before painting')
  }
})

test('each accepted paint resets the viewport origin without moving the rendered sculpture', () => {
  const { rect, parent, canvas, style } = surface()
  parent.clientLeft = 2; parent.clientTop = 3; parent.scrollLeft = 14; parent.scrollTop = 25
  for (const scroll of [0, .5, 200, 750.25, 100, 0]) {
    rect.top = 320.625 - scroll
    anchorWorkStudySurface(canvas, false, 390, 844)
    const parentOriginY = rect.top + parent.clientTop - parent.scrollTop
    const parentOriginX = rect.left + parent.clientLeft - parent.scrollLeft
    assert.equal(parentOriginY + parseFloat(style.top), 0)
    assert.equal(parentOriginX + parseFloat(style.left), 0)
    assert.equal(style.width, '390px'); assert.equal(style.height, '844px')
  }
})

test('depart, hold and dock stay fixed, then use the newly attached containing block', () => {
  const { rect, canvas, style } = surface()
  anchorWorkStudySurface(canvas, false, 1280, 720)
  for (const top of [-600, 0, 420]) {
    rect.top = top
    anchorWorkStudySurface(canvas, true, 1280, 720)
    assert.equal(style.position, 'fixed'); assert.equal(style.top, '0px'); assert.equal(style.left, '0px')
  }
  const destination = { clientLeft: 0, clientTop: 0, scrollLeft: 0, scrollTop: 0, getBoundingClientRect: () => ({ left: 26, top: 140.75 }) }
  Object.defineProperty(canvas, 'offsetParent', { value: destination })
  anchorWorkStudySurface(canvas, false, 390, 844)
  assert.equal(style.position, 'absolute'); assert.equal(style.left, '-26px'); assert.equal(style.top, '-140.75px')
})

test('stable frames avoid redundant style writes while viewport resize updates CSS dimensions', () => {
  const { canvas, style, writes } = surface()
  anchorWorkStudySurface(canvas, false, 390, 844)
  const first = writes()
  anchorWorkStudySurface(canvas, false, 390, 844)
  assert.equal(writes(), first)
  anchorWorkStudySurface(canvas, false, 844, 390)
  assert.equal(writes(), first + 2)
  assert.equal(style.width, '844px'); assert.equal(style.height, '390px')
})
