import test from 'node:test'
import assert from 'node:assert/strict'
import { createResumeFocus } from '../src/personal/editorial/resume-focus.ts'

function fixture(reduced = false) {
  function style(value = '', priority = '') {
    const values = new Map<string, [string, string]>(value ? [['overflow', [value, priority]]] : [])
    return {
      getPropertyValue: (name: string) => values.get(name)?.[0] ?? '',
      getPropertyPriority: (name: string) => values.get(name)?.[1] ?? '',
      setProperty: (name: string, value: string, priority = '') => values.set(name, [value, priority]),
      removeProperty: (name: string) => values.delete(name),
    }
  }
  const root = { style: style('auto') }, body = { style: style('clip', 'important') }
  const records: { element: object; cancelled: boolean; finish: () => void }[] = []
  function animate(this: object) {
    let finish!: () => void, reject!: (error: Error) => void
    const finished = new Promise<void>((resolve, no) => { finish = resolve; reject = no })
    void finished.catch(() => {})
    const record = { element: this, cancelled: false, finish }
    records.push(record)
    return { finished, cancel() { record.cancelled = true; reject(new Error('Cancelled')) } } as unknown as Animation
  }
  const map = { style: style(), animate, getBoundingClientRect: () => ({ left: 20, top: 90 }) }
  const focusCalls: unknown[] = []
  const heading = { animate, focus: (options: unknown) => focusCalls.push(options) }
  const dialog = {
    style: style(), dataset: {} as Record<string, string>, open: false, scrollTop: 40,
    ownerDocument: { documentElement: root, body }, animate, querySelectorAll: () => [],
    showModal() { this.open = true }, close() { this.open = false },
  }
  const scene = createResumeFocus(dialog as unknown as HTMLDialogElement, map as unknown as HTMLElement, () => reduced)
  const enter = () => scene.enter(heading as unknown as HTMLElement, null)
  const finishMap = () => records.filter(record => record.element === map).at(-1)!.finish()
  return { scene, enter, finishMap, records, root, body, map, dialog, focusCalls }
}

test('closing reverses the scene and restores the exact prior overflow styles', async () => {
  const f = fixture()
  f.enter()
  assert.equal(f.dialog.open, true)
  assert.equal(f.dialog.scrollTop, 0)
  assert.deepEqual(f.focusCalls, [{ preventScroll: true }])
  assert.equal(f.root.style.getPropertyValue('overflow'), 'hidden')
  assert.equal(f.body.style.getPropertyValue('overflow'), 'hidden')
  let closed = 0
  f.scene.exit(null, null, () => closed++)
  assert.equal(f.dialog.open, true, 'the GLB view must remain mounted throughout the return')
  f.finishMap(); await Promise.resolve()
  assert.equal(closed, 1)
  assert.equal(f.dialog.open, false)
  assert.equal(f.root.style.getPropertyValue('overflow'), 'auto')
  assert.equal(f.body.style.getPropertyValue('overflow'), 'clip')
  assert.equal(f.body.style.getPropertyPriority('overflow'), 'important')
  f.scene.dispose()
})

test('a resolved but queued close cannot dismiss a newer role or steal its focus', async () => {
  const f = fixture()
  f.enter()
  let closed = 0
  f.scene.exit(null, null, () => closed++)
  f.finishMap()
  f.enter()
  await Promise.resolve()
  assert.equal(closed, 0)
  assert.equal(f.dialog.open, true)
  assert.equal(f.root.style.getPropertyValue('overflow'), 'hidden')
  assert.equal(f.focusCalls.length, 2)
  assert.equal((f.map.style as unknown as CSSStyleDeclaration).visibility, 'hidden', 'a role change during entry must still pause the overview')
  f.scene.dispose()
})

test('route disposal cancels every animation and prevents a queued close from updating the old page', async () => {
  const f = fixture()
  f.enter()
  let closed = 0
  f.scene.exit(null, null, () => closed++)
  f.finishMap()
  f.scene.dispose()
  await Promise.resolve()
  assert.equal(closed, 0)
  assert.equal(f.dialog.open, false)
  assert(f.records.every(record => record.cancelled))
  assert.equal(f.root.style.getPropertyValue('overflow'), 'auto')
  assert.equal(f.body.style.getPropertyPriority('overflow'), 'important')
  f.enter()
  assert.equal(f.dialog.open, false)
})

test('reduced motion opens and returns immediately without scheduling an animation', () => {
  const f = fixture(true)
  f.enter()
  assert.equal(f.dialog.dataset.phase, 'focused')
  assert.equal(f.records.length, 0)
  let closed = 0
  f.scene.exit(null, null, () => closed++)
  assert.equal(closed, 1)
  assert.equal(f.dialog.open, false)
  assert.equal(f.records.length, 0)
  assert.equal(f.root.style.getPropertyValue('overflow'), 'auto')
  f.scene.dispose()
})
