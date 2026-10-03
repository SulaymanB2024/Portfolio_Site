import test from 'node:test'
import assert from 'node:assert/strict'
import { installMenuDismissal } from '../src/personal/refinements/menu-dismissal.ts'

function fixture() {
  const host = new EventTarget()
  const media = Object.assign(new EventTarget(), { matches: true })
  const inside = new EventTarget(), outside = new EventTarget()
  const header = { contains: (target: unknown) => target === inside }
  const calls: boolean[] = []
  const dispose = installMenuDismissal(header as unknown as HTMLElement, restore => calls.push(restore), host as unknown as Document, media as unknown as MediaQueryList)
  const send = (type: string, target: EventTarget, props = {}) => {
    const event = new Event(type, { cancelable: true })
    Object.defineProperty(event, 'target', { value: target })
    Object.assign(event, props)
    host.dispatchEvent(event)
    return event
  }
  return { host, media, inside, outside, calls, send, dispose }
}

test('outside taps dismiss without preventing the destination input or scrolling', () => {
  const f = fixture()
  f.send('pointerdown', f.inside, { button: 0 })
  f.send('pointerdown', f.outside, { button: 2 })
  assert.deepEqual(f.calls, [])
  const tap = f.send('pointerdown', f.outside, { button: 0 })
  assert.deepEqual(f.calls, [false])
  assert.equal(tap.defaultPrevented, false)
  f.dispose()
})

test('focus leaving the header dismisses without moving focus back to the menu', () => {
  const f = fixture()
  f.send('focusin', f.inside)
  assert.deepEqual(f.calls, [])
  f.send('focusin', f.outside)
  assert.deepEqual(f.calls, [false])
  f.dispose()
})

test('Escape restores the menu button while other keys and handled Escape remain native', () => {
  const f = fixture()
  const tab = f.send('keydown', f.inside, { key: 'Tab' })
  assert.equal(tab.defaultPrevented, false)
  const handled = new Event('keydown', { cancelable: true })
  Object.assign(handled, { key: 'Escape' })
  handled.preventDefault()
  f.host.dispatchEvent(handled)
  assert.deepEqual(f.calls, [])
  const escape = f.send('keydown', f.inside, { key: 'Escape' })
  assert.deepEqual(f.calls, [true])
  assert.equal(escape.defaultPrevented, true)
  f.dispose()
})

test('crossing to desktop closes the menu and disposal removes every handler', () => {
  const f = fixture()
  f.media.dispatchEvent(new Event('change'))
  assert.deepEqual(f.calls, [])
  f.media.matches = false
  f.media.dispatchEvent(new Event('change'))
  assert.deepEqual(f.calls, [false])
  f.dispose()
  f.send('pointerdown', f.outside, { button: 0 })
  f.send('focusin', f.outside)
  f.send('keydown', f.inside, { key: 'Escape' })
  f.media.dispatchEvent(new Event('change'))
  assert.deepEqual(f.calls, [false])
})
