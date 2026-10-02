import test from 'node:test'
import assert from 'node:assert/strict'
import { navigationMotionPolicy, navInkBounds, type NavigationActivation } from '../src/personal/refinements/navigation-policy.ts'

const activation: NavigationActivation = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, reduced: false, busy: false, from: 'writing', to: 'about' }

test('ordinary section activation animates, with modifiers and motion preferences preserving native navigation', () => {
  assert.equal(navigationMotionPolicy(activation), 'page')
  for (const change of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { defaultPrevented: true }, { reduced: true }, { busy: true }]) {
    assert.equal(navigationMotionPolicy({ ...activation, ...change }), 'native')
  }
})

test('nested routes and article travel use their actual route instead of active navigation labels', () => {
  assert.equal(navigationMotionPolicy({ ...activation, from: 'work/atlas', to: 'work' }), 'page')
  assert.equal(navigationMotionPolicy({ ...activation, from: 'writing/authority', to: 'writing' }), 'native')
  assert.equal(navigationMotionPolicy({ ...activation, from: 'writing', to: 'writing/authority' }), 'native')
  assert.equal(navigationMotionPolicy({ ...activation, from: 'writing', to: 'writing' }), 'native')
  assert.equal(navigationMotionPolicy({ ...activation, from: 'writing/authority', to: 'contact' }), 'page')
})

test('navigation ink follows the text rather than its number and stays inside the link', () => {
  const link = { left: 430, right: 490, bottom: 72 }
  const nav = { left: 400, top: 24 }
  assert.deepEqual(navInkBounds(link, nav, 451), { x: 51, y: 42, width: 39 })
  assert.deepEqual(navInkBounds(link, nav, 430), { x: 30, y: 42, width: 60 })
  assert.deepEqual(navInkBounds(link, nav, 999), { x: 90, y: 42, width: 0 })
  assert.deepEqual(navInkBounds(link, nav, -1), { x: 30, y: 42, width: 60 })
})
