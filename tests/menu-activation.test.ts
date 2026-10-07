import test from 'node:test'
import assert from 'node:assert/strict'
import { activateMenuLink } from '../src/personal/refinements/menu-activation.ts'

function fixture(initialHash = '#/work/internshipdeadlines') {
  let hash = initialHash
  const order: string[] = []
  const location = {
    get hash() { return hash },
    set hash(value: string) { order.push(`navigate:${value}`); hash = value },
  }
  const event = {
    button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true },
    currentTarget: {
      hash: '#/writing', target: '', hasAttribute: () => false,
      ownerDocument: { defaultView: { location } } as unknown as Document,
    },
  }
  const close = () => { order.push(`close:${location.hash}`) }
  return { event, location, order, close }
}

test('a touch or keyboard activation commits Writing before hiding the menu', () => {
  const f = fixture()
  assert.equal(activateMenuLink(f.event, f.close), true)
  assert.deepEqual(f.order, ['navigate:#/writing', 'close:#/writing'])
  assert.equal(f.event.defaultPrevented, true)
})

test('navigation motion can commit first without a duplicate history entry', () => {
  const f = fixture('#/writing')
  f.event.defaultPrevented = true
  assert.equal(activateMenuLink(f.event, f.close), true)
  assert.deepEqual(f.order, ['close:#/writing'])
})

test('selecting the current page dismisses without navigating again', () => {
  const f = fixture('#/writing')
  assert.equal(activateMenuLink(f.event, f.close), true)
  assert.deepEqual(f.order, ['close:#/writing'])
})

test('modified clicks keep their native destination and leave the menu open', () => {
  for (const props of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }]) {
    const f = fixture()
    Object.assign(f.event, props)
    assert.equal(activateMenuLink(f.event, f.close), false)
    assert.deepEqual(f.order, [])
    assert.equal(f.event.defaultPrevented, false)
  }
})

test('a canceled activation does not close the menu or override its handler', () => {
  const f = fixture()
  f.event.defaultPrevented = true
  assert.equal(activateMenuLink(f.event, f.close), false)
  assert.deepEqual(f.order, [])
  assert.equal(f.location.hash, '#/work/internshipdeadlines')
})

test('download and new-window links retain native activation', () => {
  for (const props of [{ target: '_blank' }, { hasAttribute: () => true }, { hash: '' }]) {
    const f = fixture()
    Object.assign(f.event.currentTarget, props)
    assert.equal(activateMenuLink(f.event, f.close), false)
    assert.deepEqual(f.order, [])
    assert.equal(f.event.defaultPrevented, false)
  }
})
