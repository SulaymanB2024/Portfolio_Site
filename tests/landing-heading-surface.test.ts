import test from 'node:test'
import assert from 'node:assert/strict'
import { headingSurface } from '../src/personal/landing/heading-surface.ts'
import { textSequence, requiredScene } from '../src/personal/landing/sequence.ts'

test('all five settled chapters use native type without changing the render budget', () => {
  for (const progress of [0, .25, .5, .75, 1]) {
    assert.equal(headingSurface(textSequence(progress), false), 'native')
  }
})

test('portal occlusion and partial text stay in the shader in both scroll directions', () => {
  for (const mobile of [false, true]) {
    const positions = Array.from({ length: 4001 }, (_, index) => index / 4000)
    const surfaces = positions.map(progress => {
      const sequence = textSequence(progress, 'threshold', false, mobile)
      const portal = requiredScene(progress).portal
      const surface = headingSurface(sequence, portal)
      if (portal) assert.equal(surface, 'shader')
      if (surface === 'native') {
        assert.deepEqual(sequence.states[sequence.active], { reveal: 1, erase: 0 })
        assert.equal(sequence.states.filter(state => state.reveal > 0 && state.erase < 1).length, 1)
      }
      return surface
    })
    assert.deepEqual(surfaces, positions.reverse().map(progress => headingSurface(textSequence(progress, 'threshold', false, mobile), requiredScene(progress).portal)).reverse())
    assert.ok(surfaces.includes('shader') && surfaces.includes('native'))
  }
})

test('reduced motion always shows native type, and overlapping ink never paints twice', () => {
  for (let index = 0; index <= 100; index++) assert.equal(headingSurface(textSequence(index / 100, 'threshold', true), false), 'native')
  assert.equal(headingSurface({ active: 0, states: [{ reveal: 1, erase: 0 }, { reveal: .1, erase: 0 }] }, false), 'shader')
})
