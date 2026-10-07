import test from 'node:test'
import assert from 'node:assert/strict'
import { createChessFocus } from '../src/personal/about/chess-focus.ts'

function fixture() {
  const doc = new EventTarget() as EventTarget & Record<string, any>
  const element = (tagName = 'DIV') => {
    const attrs = new Map<string, string>(), styles = new Map<string, [string, string]>()
    const el: Record<string, any> = {
      tagName, ownerDocument: doc, parentElement: null, children: [], inert: false, isConnected: true, tabIndex: 0,
      getAttribute: (name: string) => attrs.get(name) ?? null,
      setAttribute: (name: string, value: string) => attrs.set(name, value),
      removeAttribute: (name: string) => attrs.delete(name),
      getClientRects: () => [{}], closest: () => null, visibility: 'visible',
      querySelectorAll: () => el.children,
      contains: (node: unknown) => node === el || el.children.includes(node),
      focus: () => { doc.activeElement = el },
      style: {
        getPropertyValue: (name: string) => styles.get(name)?.[0] ?? '',
        getPropertyPriority: (name: string) => styles.get(name)?.[1] ?? '',
        setProperty: (name: string, value: string, priority = '') => styles.set(name, [value, priority]),
        removeProperty: (name: string) => styles.delete(name),
      },
    }
    return el
  }
  const link = (parent: Record<string, any>, ...children: Record<string, any>[]) => {
    parent.children = children
    children.forEach(child => { child.parentElement = parent })
  }
  const html = element('HTML'), body = element('BODY'), section = element(), stage = element(), sibling = element(), header = element(), script = element('SCRIPT')
  const trigger = element('BUTTON'), last = element('BUTTON'), canvas = element('CANVAS')
  canvas.tabIndex = -1
  link(html, body); link(body, header, section, script); link(section, stage, sibling); link(stage, canvas, trigger, last)
  doc.defaultView = { getComputedStyle: (el: Record<string, any>) => ({ visibility: el.visibility }) }
  doc.body = body; doc.documentElement = html; doc.fullscreenElement = null; doc.fullscreenEnabled = true; doc.activeElement = trigger
  let exits = 0
  doc.exitFullscreen = async () => { exits++; doc.fullscreenElement = null; doc.dispatchEvent(new Event('fullscreenchange')) }
  const changes: boolean[] = []
  const controller = createChessFocus(stage as HTMLElement, value => changes.push(value))
  const key = (key: string, shiftKey = false, target = trigger) => {
    const event = new Event('keydown', { cancelable: true })
    Object.defineProperties(event, { key: { value: key }, shiftKey: { value: shiftKey }, target: { value: target } })
    doc.dispatchEvent(event)
    return event
  }
  return { doc, html, body, stage, sibling, header, script, trigger, last, canvas, changes, controller, key, exits: () => exits }
}

test('viewport fallback retains the live board and restores outside focus, attributes and scroll locks', () => {
  const f = fixture(), children = f.stage.children
  f.stage.setAttribute('role', 'region'); f.stage.setAttribute('aria-label', 'Original board')
  f.header.inert = true
  f.body.style.setProperty('overflow', 'scroll', 'important')
  f.controller.enter(f.trigger as HTMLElement)
  assert.equal(f.stage.getAttribute('aria-modal'), 'true')
  assert.equal(f.stage.children, children, 'expansion must not replace the live game or canvas')
  assert.equal(f.sibling.inert, true); assert.equal(f.script.inert, false)
  assert.equal(f.body.style.getPropertyValue('overflow'), 'hidden')
  f.doc.activeElement = f.last
  f.controller.close()
  assert.deepEqual(f.changes, [true, false])
  assert.equal(f.stage.getAttribute('role'), 'region'); assert.equal(f.stage.getAttribute('aria-label'), 'Original board')
  assert.equal(f.stage.getAttribute('data-chess-expanded'), null); assert.equal(f.stage.getAttribute('aria-modal'), null)
  assert.equal(f.sibling.inert, false); assert.equal(f.header.inert, true)
  assert.equal(f.body.style.getPropertyValue('overflow'), 'scroll'); assert.equal(f.body.style.getPropertyPriority('overflow'), 'important')
  assert.equal(f.html.style.getPropertyValue('overflow'), '')
  assert.equal(f.doc.activeElement, f.trigger)
  f.controller.dispose()
})

test('denied fullscreen leaves a usable viewport expansion that Escape closes', async () => {
  const f = fixture()
  f.stage.requestFullscreen = () => Promise.reject(new Error('Not available'))
  f.controller.enter(f.trigger as HTMLElement)
  await Promise.resolve(); await Promise.resolve()
  assert.equal(f.stage.getAttribute('aria-modal'), 'true')
  assert.equal(f.key('Escape').defaultPrevented, true)
  assert.equal(f.stage.getAttribute('data-chess-expanded'), null)
  assert.deepEqual(f.changes, [true, false])
  f.controller.dispose()
})

test('browser fullscreen exit returns to the same board and restores focus', async () => {
  const f = fixture()
  f.stage.requestFullscreen = async () => { f.doc.fullscreenElement = f.stage; f.doc.dispatchEvent(new Event('fullscreenchange')) }
  f.controller.enter(f.trigger as HTMLElement)
  await Promise.resolve()
  f.doc.fullscreenElement = null
  f.doc.dispatchEvent(new Event('fullscreenchange'))
  assert.deepEqual(f.changes, [true, false])
  assert.equal(f.sibling.inert, false); assert.equal(f.doc.activeElement, f.trigger)
  assert.equal(f.exits(), 0, 'a browser exit needs no second exit request')
  f.controller.dispose()
})

test('a fullscreen request resolving after disposal cannot orphan a fullscreen stage', async () => {
  const f = fixture()
  let resolve!: () => void
  f.stage.requestFullscreen = () => new Promise<void>(finish => { resolve = finish })
  f.controller.enter(f.trigger as HTMLElement)
  f.controller.dispose()
  assert.equal(f.sibling.inert, false)
  f.doc.fullscreenElement = f.stage; resolve()
  await Promise.resolve(); await Promise.resolve()
  assert.equal(f.exits(), 1); assert.equal(f.doc.fullscreenElement, null)
  assert.deepEqual(f.changes, [true], 'disposal must not update an unmounted component')
  f.controller.enter(f.trigger as HTMLElement)
  assert.equal(f.stage.getAttribute('data-chess-expanded'), null)
})

test('fullscreen keyboard navigation stays within visible controls and preserves nested Escape', () => {
  const f = fixture()
  f.canvas.tabIndex = 0; f.canvas.visibility = 'hidden'
  f.controller.enter(f.trigger as HTMLElement)
  f.doc.activeElement = f.last
  assert.equal(f.key('Tab').defaultPrevented, true); assert.equal(f.doc.activeElement, f.trigger)
  assert.equal(f.key('Tab', true).defaultPrevented, true); assert.equal(f.doc.activeElement, f.last)
  const select = { closest: (selector: string) => selector === 'select' ? {} : null }
  assert.equal(f.key('Escape', false, select as any).defaultPrevented, false)
  assert.equal(f.stage.getAttribute('aria-modal'), 'true')
  const handled = new Event('keydown', { cancelable: true }); Object.defineProperty(handled, 'key', { value: 'Escape' }); handled.preventDefault()
  f.doc.dispatchEvent(handled)
  assert.equal(f.stage.getAttribute('aria-modal'), 'true')
  f.controller.dispose()
  assert.equal(f.key('Escape').defaultPrevented, false, 'disposed listeners are removed')
})

test('closing fallback does not exit fullscreen owned by another element', () => {
  const f = fixture()
  f.doc.fullscreenElement = f.header
  f.stage.requestFullscreen = () => { throw new Error('Must not request another fullscreen') }
  f.controller.enter(f.trigger as HTMLElement)
  f.controller.close()
  assert.equal(f.exits(), 0); assert.equal(f.doc.fullscreenElement, f.header)
  f.controller.dispose()
})


test('rapid close and reopen adopts an outstanding fullscreen request without closing the current board', async () => {
  const f = fixture(), finishes: (() => void)[] = []
  f.stage.requestFullscreen = () => new Promise<void>(resolve => finishes.push(resolve))
  f.controller.enter(f.trigger as HTMLElement)
  f.controller.close()
  f.controller.enter(f.trigger as HTMLElement)
  f.doc.fullscreenElement = f.stage
  finishes[0]()
  await Promise.resolve()
  assert.equal(f.exits(), 0)
  assert.equal(f.stage.getAttribute('aria-modal'), 'true')
  finishes[1]()
  await Promise.resolve()
  f.controller.close()
  assert.equal(f.exits(), 1)
  assert.deepEqual(f.changes, [true, false, true, false])
  f.controller.dispose()
})
