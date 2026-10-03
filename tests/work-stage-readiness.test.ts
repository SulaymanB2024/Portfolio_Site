import test from 'node:test'
import assert from 'node:assert/strict'
import { createWorkStageReadiness } from '../src/personal/work-stage-readiness.ts'

test('an import completing offscreen or hidden retains no renderer until visibility returns', () => {
  let mounts = 0
  const gate = createWorkStageReadiness(() => { mounts++ })
  gate.visible(true)
  gate.visible(false)
  gate.ready()
  assert.equal(mounts, 0)
  gate.visible(true)
  assert.equal(mounts, 1)
  gate.ready()
  gate.visible(false)
  gate.visible(true)
  assert.equal(mounts, 1, 'visibility changes must reuse the mounted renderer')
})

test('a ready module waits for its first eligible paint, including paused/reduced pages', () => {
  let mounts = 0
  const gate = createWorkStageReadiness(() => { mounts++ })
  gate.ready()
  assert.equal(mounts, 0)
  gate.visible(true)
  assert.equal(mounts, 1, 'motion preferences do not suppress a visible static sculpture')
})

test('route cancellation rejects every late import and visibility notification', () => {
  for (const readyFirst of [false, true]) {
    let mounts = 0
    const gate = createWorkStageReadiness(() => { mounts++ })
    if (readyFirst) gate.ready()
    else gate.visible(true)
    gate.dispose()
    gate.ready()
    gate.visible(true)
    assert.equal(mounts, 0)
  }
})

test('mounting is reentrancy safe', () => {
  let mounts = 0
  const gate = createWorkStageReadiness(() => { mounts++; gate.ready(); gate.visible(true) })
  gate.ready()
  gate.visible(true)
  assert.equal(mounts, 1)
})
