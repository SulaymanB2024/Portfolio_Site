import test, { type TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { installTableOverflowHints } from '../src/personal/refinements/table-overflow.ts'

// Model only the DOM boundaries this observer uses. Layout dimensions are
// supplied independently, so content can overflow without resizing its wrapper.
class ElementFixture {
  parent: ElementFixture | null = null
  children: ElementFixture[] = []
  attributes = new Map<string, string>()
  dataset: Record<string, string> = {}
  clientWidth = 320
  scrollWidth = 320
  kind: 'root' | 'article' | 'work' | 'table'

  constructor(kind: ElementFixture['kind']) { this.kind = kind }
  getAttribute(name: string) { return this.attributes.get(name) ?? null }
  setAttribute(name: string, value: string) { this.attributes.set(name, value) }
  removeAttribute(name: string) { this.attributes.delete(name) }
  append(child: ElementFixture) { child.remove(); child.parent = this; this.children.push(child) }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this)
    this.parent = null
  }
  contains(element: ElementFixture): boolean {
    return element === this || this.children.some(child => child.contains(element))
  }
  querySelectorAll(selector: string): ElementFixture[] {
    const matches = (element: ElementFixture) => selector === 'table'
      ? element.kind === 'table'
      : element.kind === 'article' || element.kind === 'work'
    return this.children.flatMap(child => [...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)])
  }
  querySelector(selector: string) { return this.querySelectorAll(selector)[0] ?? null }
  closest(_selector: string): ElementFixture | null {
    return this.kind === 'article' || this.kind === 'work' ? this : this.parent?.closest(_selector) ?? null
  }
}

function fixture(t: TestContext, initial: ElementFixture[] = []) {
  const root = new ElementFixture('root')
  initial.forEach(element => root.append(element))
  let resolveFontReady!: () => void
  const fonts = Object.assign(new EventTarget(), {
    ready: new Promise<void>(resolve => { resolveFontReady = resolve }),
  })
  const resizeTargets = new Set<ElementFixture>()
  const unobserved: ElementFixture[] = []
  let resizeCallback!: ResizeObserverCallback
  let mutationCallback!: MutationCallback
  let mutationOptions: MutationObserverInit | undefined
  let resizeDisconnected = false
  let mutationDisconnected = false
  class ResizeFixture {
    constructor(callback: ResizeObserverCallback) { resizeCallback = callback }
    observe(element: ElementFixture) { resizeTargets.add(element) }
    unobserve(element: ElementFixture) { resizeTargets.delete(element); unobserved.push(element) }
    disconnect() { resizeDisconnected = true; resizeTargets.clear() }
  }
  class MutationFixture {
    constructor(callback: MutationCallback) { mutationCallback = callback }
    observe(_element: ElementFixture, options: MutationObserverInit) { mutationOptions = options }
    disconnect() { mutationDisconnected = true }
  }
  const replacements = { document: { fonts }, ResizeObserver: ResizeFixture, MutationObserver: MutationFixture }
  const descriptors = Object.fromEntries(Object.keys(replacements).map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]))
  for (const [name, value] of Object.entries(replacements)) Object.defineProperty(globalThis, name, { value, configurable: true })
  const dispose = installTableOverflowHints(root as unknown as HTMLElement)
  t.after(() => {
    dispose()
    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else Reflect.deleteProperty(globalThis, name)
    }
  })
  return {
    root, fonts, dispose, resolveFontReady, resizeTargets, unobserved,
    mutations: () => mutationCallback([], {} as MutationObserver),
    resize: (...elements: ElementFixture[]) => resizeCallback(elements.map(target => ({ target })) as unknown as ResizeObserverEntry[], {} as ResizeObserver),
    options: () => mutationOptions,
    disconnected: () => ({ resize: resizeDisconnected, mutation: mutationDisconnected }),
  }
}

function viewport(kind: 'article' | 'work' = 'article', description?: string) {
  const element = new ElementFixture(kind)
  const table = new ElementFixture('table')
  element.append(table)
  if (description !== undefined) element.setAttribute('aria-description', description)
  return { element, table }
}

test('hints require real overflow beyond browser rounding, and restore authored descriptions when columns fit', t => {
  const { element } = viewport('article', 'Quarterly revenue by company.')
  element.scrollWidth = 321
  const f = fixture(t, [element])
  assert.equal(element.dataset.tableOverflow, 'false')
  assert.equal(element.getAttribute('aria-description'), 'Quarterly revenue by company.')
  element.scrollWidth = 480
  f.resize(element)
  assert.equal(element.dataset.tableOverflow, 'true')
  assert.equal(element.getAttribute('aria-description'), 'Scroll horizontally to compare all columns.')
  element.clientWidth = 480
  f.resize(element)
  assert.equal(element.dataset.tableOverflow, 'false')
  assert.equal(element.getAttribute('aria-description'), 'Quarterly revenue by company.')
})

test('late Suspense wrappers and subsequently attached tables receive live observation', t => {
  const f = fixture(t)
  const element = new ElementFixture('work')
  element.scrollWidth = 640
  f.root.append(element)
  f.mutations()
  assert.equal(element.dataset.tableOverflow, 'true')
  assert(f.resizeTargets.has(element))
  const table = new ElementFixture('table')
  element.append(table)
  f.mutations()
  assert(f.resizeTargets.has(table))
  element.scrollWidth = 320
  f.resize(table)
  assert.equal(element.dataset.tableOverflow, 'false')
  assert.equal(element.getAttribute('aria-description'), null)
})

test('responsive wrapper resizing and intrinsic table resizing update the same viewport', t => {
  const { element, table } = viewport('work')
  const f = fixture(t, [element])
  element.clientWidth = 240
  f.resize(element)
  assert.equal(element.dataset.tableOverflow, 'true')
  element.clientWidth = 320
  f.resize(element)
  assert.equal(element.dataset.tableOverflow, 'false')
  element.scrollWidth = 500
  f.resize(table)
  assert.equal(element.dataset.tableOverflow, 'true')
  assert.equal(table.dataset.tableOverflow, undefined)
  element.scrollWidth = 320
  f.resize(table)
  assert.equal(element.dataset.tableOverflow, 'false')
})

test('replacing a table retires its observer without giving a detached table its own hint', t => {
  const { element, table } = viewport()
  const f = fixture(t, [element])
  table.remove()
  const replacement = new ElementFixture('table')
  element.append(replacement)
  f.mutations()
  assert(f.unobserved.includes(table))
  assert(!f.resizeTargets.has(table))
  assert(f.resizeTargets.has(replacement))
  element.scrollWidth = 500
  f.resize(table)
  assert.equal(element.dataset.tableOverflow, 'false')
  f.resize(replacement)
  assert.equal(element.dataset.tableOverflow, 'true')
})

test('text-only content changes refresh overflow even when no observed box resizes', t => {
  const { element } = viewport()
  const f = fixture(t, [element])
  assert.deepEqual(f.options(), { childList: true, characterData: true, subtree: true })
  element.scrollWidth = 500
  f.mutations()
  assert.equal(element.dataset.tableOverflow, 'true')
  element.scrollWidth = 320
  f.mutations()
  assert.equal(element.getAttribute('aria-description'), null)
})

test('detached and reinserted wrappers retain their original accessibility description', t => {
  const { element, table } = viewport('work', 'Application timeline.')
  element.scrollWidth = 500
  const f = fixture(t, [element])
  element.remove()
  f.mutations()
  assert.equal(element.dataset.tableOverflow, undefined)
  assert.equal(element.getAttribute('aria-description'), 'Application timeline.')
  assert(!f.resizeTargets.has(element))
  assert(!f.resizeTargets.has(table))
  f.root.append(element)
  f.mutations()
  assert.equal(element.dataset.tableOverflow, 'true')
  f.dispose()
  assert.equal(element.dataset.tableOverflow, undefined)
  assert.equal(element.getAttribute('aria-description'), 'Application timeline.')
})

test('font readiness and subsequent font loads refresh width-dependent hints', async t => {
  const { element } = viewport()
  const f = fixture(t, [element])
  element.scrollWidth = 500
  f.resolveFontReady()
  await f.fonts.ready
  assert.equal(element.dataset.tableOverflow, 'true')
  element.scrollWidth = 320
  f.fonts.dispatchEvent(new Event('loadingdone'))
  assert.equal(element.dataset.tableOverflow, 'false')
  assert.equal(element.getAttribute('aria-description'), null)
})

test('disposal restores empty or absent descriptions and ignores already queued observer/font callbacks', async t => {
  const empty = viewport('article', '').element
  const absent = viewport('work').element
  empty.scrollWidth = absent.scrollWidth = 500
  const f = fixture(t, [empty, absent])
  f.dispose()
  assert.deepEqual(f.disconnected(), { resize: true, mutation: true })
  assert.equal(empty.getAttribute('aria-description'), '')
  assert.equal(absent.getAttribute('aria-description'), null)
  f.mutations()
  f.resize(empty, absent)
  f.fonts.dispatchEvent(new Event('loadingdone'))
  f.resolveFontReady()
  await f.fonts.ready
  assert.equal(empty.dataset.tableOverflow, undefined)
  assert.equal(absent.dataset.tableOverflow, undefined)
  assert.equal(empty.getAttribute('aria-description'), '')
  assert.equal(absent.getAttribute('aria-description'), null)
})
