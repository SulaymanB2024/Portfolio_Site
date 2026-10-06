import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyContextTransition, changeContextObject, advanceContextTransition } from '../src/personal/context-transition.ts'

test('the first GLB reveals through its ink, then replacements clear before revealing', () => {
  let state = changeContextObject(emptyContextTransition(), 'bass')
  assert.equal(state.phase, 'in')
  assert.equal(state.reveal, 0)
  let ink = 0
  for (let frame = 0; frame < 9; frame++) {
    state = advanceContextTransition(state, .03)
    assert.ok(state.reveal >= ink)
    ink = state.reveal
  }
  assert.equal(state.phase, 'hold')
  assert.equal(state.reveal, 1)
  state = changeContextObject(state, 'score')
  for (let frame = 0; frame < 15; frame++) {
    state = advanceContextTransition(state, .01)
    assert.equal(state.shown, 'bass')
  }
  state = advanceContextTransition(state, .01)
  assert.equal(state.shown, 'score')
  assert.equal(state.phase, 'in')
  assert.ok(state.reveal < .001)
  for (let frame = 0; frame < 25; frame++) state = advanceContextTransition(state, .01)
  assert.equal(state.phase, 'hold')
  assert.equal(state.reveal, 1)
})

test('an interrupted replacement preserves current ink and honors the latest object', () => {
  let state = changeContextObject(emptyContextTransition(), 'bass', true)
  state = advanceContextTransition(changeContextObject(state, 'score'), .08)
  const before = state.reveal
  state = changeContextObject(state, 'knight')
  assert.equal(state.reveal, before)
  assert.equal(state.shown, 'bass')
  for (let frame = 0; frame < 40; frame++) state = advanceContextTransition(state, .01)
  assert.equal(state.shown, 'knight')
  assert.equal(state.phase, 'hold')
})

test('returning to the visible object reverses cleanly, including while another asset loads', () => {
  let state = changeContextObject(emptyContextTransition(), 'bass', true)
  state = advanceContextTransition(changeContextObject(state, 'score'), .08)
  const before = state.reveal
  state = changeContextObject(state, 'bass')
  assert.equal(state.reveal, before)
  assert.equal(state.phase, 'in')
  for (let frame = 0; frame < 20; frame++) state = advanceContextTransition(state, .01)
  assert.equal(state.shown, 'bass')
  assert.equal(state.reveal, 1)
})

test('reduced motion resolves to the final GLB without a dissolve', () => {
  const first = changeContextObject(emptyContextTransition(), 'bass')
  const immediate = changeContextObject(first, 'knight', true)
  assert.deepEqual({shown:immediate.shown,phase:immediate.phase,reveal:immediate.reveal}, {shown:'knight',phase:'hold',reveal:1})
  const interrupted = advanceContextTransition(changeContextObject(first, 'score'), .01, true)
  assert.equal(interrupted.shown, 'score')
  assert.equal(interrupted.reveal, 1)
})

test('invalid deltas cannot advance the handoff and hidden gaps are bounded', () => {
  const state = changeContextObject(changeContextObject(emptyContextTransition(), 'bass', true), 'score')
  for (const delta of [0,-1,NaN,Infinity]) assert.equal(advanceContextTransition(state, delta), state)
  const after = advanceContextTransition(state, 100)
  assert.equal(after.shown, 'bass')
  assert.equal(after.phase, 'out')
})
