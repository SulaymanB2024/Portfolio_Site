import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

const script = readFileSync(new URL('../public/site-startup.js', import.meta.url), 'utf8')

function startup(preference: string | null = null, blockedStorage = false) {
  const events = new Map<string, Set<(event: any) => void>>()
  const timers = new Map<number, { callback: () => void; delay: number }>()
  let nextTimer = 1
  const page = { dataset: {} as Record<string, string>, style: {} as Record<string, string> }
  let themeColor = ''
  let hasRoot = false
  let app = ''
  let readyState = 'loading'
  const staticNode = { className: 'static-site' }
  let staticAttached = false
  const microtasks: (() => void)[] = []
  let observe: (() => void) | undefined
  let disconnected = false
  const target = (prefix: string) => ({
    addEventListener(name: string, listener: (event: any) => void) {
      const key = prefix + name
      if (!events.has(key)) events.set(key, new Set())
      events.get(key)!.add(listener)
    },
    removeEventListener(name: string, listener: (event: any) => void) { events.get(prefix + name)?.delete(listener) },
  })
  class ScriptElement {}
  class ScriptError {}
  const root = {
    querySelector: (selector: string) => selector === ':scope > .static-site' ? staticAttached ? staticNode : null : ['personal-site', 'art-export'].includes(app) ? {} : null,
    contains: (node: unknown) => node === staticNode && staticAttached,
    replaceChildren: (node: unknown) => { assert.equal(node, staticNode); staticAttached = true; app = 'static-site' },
  }
  runInNewContext(script, {
    document: {
      ...target('document:'), documentElement: page,
      get readyState() { return readyState },
      querySelector: () => ({ setAttribute: (_name: string, value: string) => { themeColor = value } }),
      getElementById: () => hasRoot ? root : null,
    },
    window: target('window:'),
    localStorage: { getItem: () => { if (blockedStorage) throw new Error('Storage disabled'); return preference } },
    setTimeout: (callback: () => void, delay: number) => { const id = nextTimer++; timers.set(id, { callback, delay }); return id },
    clearTimeout: (id: number) => timers.delete(id),
    queueMicrotask: (callback: () => void) => microtasks.push(callback),
    ErrorEvent: ScriptError, HTMLScriptElement: ScriptElement,
    MutationObserver: class {
      constructor(callback: () => void) { observe = callback }
      observe() { disconnected = false }
      disconnect() { disconnected = true }
    },
  })
  return {
    page, timers, themeColor,
    fireTimer(delay: number) {
      const timer = [...timers].find(([, item]) => item.delay === delay)
      assert(timer, 'expected a pending deadline')
      timers.delete(timer[0]); timer[1].callback()
    },
    parsed(content = 'static-site') { hasRoot = true; app = content; staticAttached = content === 'static-site'; readyState = 'interactive'; this.emit('document:readystatechange'); this.emit('document:DOMContentLoaded') },
    mounted(content = 'personal-site') { app = content; staticAttached = false; if (!disconnected) observe?.() },
    cleared() { app = ''; staticAttached = false; if (!disconnected) observe?.() },
    hasReadableFallback: () => staticAttached,
    flushMicrotasks() { while (microtasks.length) microtasks.shift()!() },
    emit(name: string, event: any = {}) { for (const listener of [...events.get(name) || []]) listener(event) },
    scriptError() { this.emit('window:error', { target: new ScriptElement(), type: 'error' }); this.flushMicrotasks() },
    runtimeError() { this.emit('window:error', new ScriptError()) },
    observerDisconnected: () => disconnected,
    remainingListeners: () => [...events.values()].reduce((count, listeners) => count + listeners.size, 0),
  }
}

test('startup selects the saved palette and suppresses only the static document before body parsing', () => {
  for (const [preference, appearance, color] of [['dark', 'dark', '#111210'], ['light', 'light', '#f5f2ea'], ['invalid', 'light', '#f5f2ea'], [null, 'light', '#f5f2ea']]) {
    const state = startup(preference)
    assert.equal(state.page.dataset.appearance, appearance)
    assert.equal(state.page.style.colorScheme, appearance)
    assert.equal(state.themeColor, color)
    assert.equal(state.page.dataset.siteBoot, 'pending')
    assert.equal(state.timers.size, 2)
  }
})

test('unavailable preference storage still suppresses the startup flash', () => {
  const state = startup(null, true)
  assert.equal(state.page.dataset.appearance, 'light')
  assert.equal(state.page.dataset.siteBoot, 'pending')
  state.parsed()
  assert.equal(state.page.dataset.siteBoot, 'pending')
})

test('the static document is not mistaken for a React commit; the first app commit removes all observers and timers', () => {
  for (const root of ['personal-site', 'art-export']) {
    const state = startup()
    state.parsed()
    assert.equal(state.page.dataset.siteBoot, 'pending')
    state.mounted(root)
    assert.equal(state.page.dataset.siteBoot, 'ready')
    assert.equal(state.timers.size, 0)
    assert.equal(state.observerDisconnected(), true)
    assert.equal(state.remainingListeners(), 0)
    state.runtimeError()
    state.flushMicrotasks()
    assert.equal(state.page.dataset.siteBoot, 'ready')
  }
})

test('an app which already committed before DOMContentLoaded is immediately ready', () => {
  const state = startup()
  state.parsed('personal-site')
  assert.equal(state.page.dataset.siteBoot, 'ready')
  assert.equal(state.timers.size, 0)
  assert.equal(state.remainingListeners(), 0)
})

test('failed or stalled startup restores readable content without leaving a watcher behind', () => {
  for (const fail of [
    (state: ReturnType<typeof startup>) => state.scriptError(),
    (state: ReturnType<typeof startup>) => state.runtimeError(),
    (state: ReturnType<typeof startup>) => state.emit('window:unhandledrejection', { type: 'unhandledrejection' }),
    (state: ReturnType<typeof startup>) => state.fireTimer(12000),
  ]) {
    const state = startup()
    state.parsed()
    fail(state)
    state.flushMicrotasks()
    assert.equal(state.page.dataset.siteBoot, 'fallback')
    assert.equal(state.timers.size, 0)
    assert.equal(state.observerDisconnected(), true)
    assert.equal(state.remainingListeners(), 0)
  }
})

test('an initial React failure restores the retained static DOM even if the container is cleared after the error event', () => {
  const state = startup()
  state.parsed()
  state.runtimeError()
  state.cleared()
  assert.equal(state.hasReadableFallback(), false)
  state.flushMicrotasks()
  assert.equal(state.page.dataset.siteBoot, 'fallback')
  assert.equal(state.hasReadableFallback(), true)
  assert.equal(state.timers.size, 0)
  assert.equal(state.observerDisconnected(), true)
  assert.equal(state.remainingListeners(), 0)
})

test('a slow module boot reveals readable text after one second while retaining late mount and failure recovery', () => {
  for (const lateFailure of [false, true]) {
    const state = startup('dark')
    state.parsed(); state.fireTimer(1000)
    assert.equal(state.page.dataset.siteBoot, 'waiting')
    assert.equal(state.hasReadableFallback(), true)
    assert.equal(state.observerDisconnected(), false)
    assert.equal(state.timers.size, 1)
    if (lateFailure) {
      state.runtimeError(); state.cleared(); state.flushMicrotasks()
      assert.equal(state.page.dataset.siteBoot, 'fallback')
      assert.equal(state.hasReadableFallback(), true)
    } else {
      state.mounted()
      assert.equal(state.page.dataset.siteBoot, 'ready')
    }
    assert.equal(state.timers.size, 0)
    assert.equal(state.observerDisconnected(), true)
    assert.equal(state.remainingListeners(), 0)
  }
})

test('waiting can precede HTML parsing, and a completely stalled boot still ends its observer', () => {
  const state = startup()
  state.fireTimer(1000); state.parsed()
  assert.equal(state.page.dataset.siteBoot, 'waiting')
  state.fireTimer(12000)
  assert.equal(state.page.dataset.siteBoot, 'fallback')
  assert.equal(state.remainingListeners(), 0)
  assert.equal(state.observerDisconnected(), true)
})

test('unrelated resource failures do not expose the fallback during startup', () => {
  const state = startup()
  state.emit('window:error', { target: { tagName: 'IMG' }, type: 'error' })
  assert.equal(state.page.dataset.siteBoot, 'pending')
})

test('the gate is opt-in, runs before the document body, and remains compatible with an external-script CSP', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const boot = html.indexOf('<script src="%BASE_URL%site-startup.js"></script>')
  assert(boot > 0 && boot < html.indexOf('<body>'))
  assert(html.includes("html[data-site-boot='pending'] #root > .static-site { display: none; }"))
  assert(!/<html\b[^>]*data-site-boot/.test(html), 'JavaScript-disabled readers must not inherit the pending gate')
  assert(!/<script\b(?![^>]*\bsrc=)(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/i.test(html))
})
