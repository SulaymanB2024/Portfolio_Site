import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createStudyActivationGate, STUDY_CLICK_DELAY } from '../src/personal/work-entry-activation.ts'

function fixture() {
  const tasks = new Map<number, { callback: () => void; due: number }>()
  let id = 0
  let now = 0
  let navigations = 0
  const gate = createStudyActivationGate({
    set(callback, delay) { tasks.set(++id, { callback, due: now + delay }); return id },
    clear(id) { tasks.delete(id) },
  })
  return { gate, tasks, navigate: () => navigations++, get navigations() { return navigations }, advance(ms: number) { now += ms; for (const [id, task] of tasks) if (task.due <= now) { tasks.delete(id); task.callback() } }, flush() { this.advance(STUDY_CLICK_DELAY) } }
}

test('a single stationary sculpture click opens once after the double-click window', () => {
  const f = fixture()
  f.gate.start(1, 100, 100, 'mouse')
  f.gate.end(1, false)
  f.gate.queue(f.navigate)
  assert.equal(f.navigations, 0)
  f.flush()
  f.flush()
  assert.equal(f.navigations, 1)
})

test('a second pointer press cancels navigation so double-click can reset the sculpture', () => {
  for (const interval of [80, 350, 490]) {
    const f = fixture()
    f.gate.start(1, 100, 100, 'mouse')
    f.gate.end(1, false)
    f.gate.queue(f.navigate)
    f.advance(interval)
    assert.equal(f.navigations, 0, `must not navigate before a ${interval} ms double-click`)
    f.gate.start(1, 100, 100, 'mouse')
    f.gate.end(1, false)
    f.gate.cancel()
    f.flush()
    assert.equal(f.navigations, 0)
  }
})

test('dragging blocks the following click even when the pointer returns to its starting point', () => {
  const f = fixture()
  f.gate.start(3, 100, 100, 'mouse')
  f.gate.move(3, 126, 100)
  f.gate.move(3, 100, 100)
  f.gate.end(3, false)
  f.gate.queue(f.navigate)
  f.flush()
  assert.equal(f.navigations, 0)
  f.gate.start(4, 100, 100, 'mouse')
  f.gate.end(4, false)
  f.gate.queue(f.navigate)
  f.flush()
  assert.equal(f.navigations, 1)
})

test('vertical touch scrolling, cancellation, and a renderer-started drag cannot open a project', () => {
  for (const action of ['scroll', 'cancel', 'renderer']) {
    const f = fixture()
    f.gate.start(5, 100, 100, 'touch')
    if (action === 'scroll') f.gate.move(5, 101, 160)
    if (action === 'cancel') f.gate.interrupt()
    f.gate.end(5, action === 'renderer')
    f.gate.queue(f.navigate)
    f.flush()
    assert.equal(f.navigations, 0, action)
  }
})

test('unrelated pointers do not cancel a tap and small touch jitter is tolerated', () => {
  const f = fixture()
  f.gate.start(6, 100, 100, 'touch')
  f.gate.move(7, 300, 400)
  f.gate.move(6, 103, 104)
  f.gate.end(7, true)
  f.gate.end(6, false)
  f.gate.queue(f.navigate)
  f.flush()
  assert.equal(f.navigations, 1)
})

test('cleanup cancels a pending route change', () => {
  const f = fixture()
  f.gate.queue(f.navigate)
  f.gate.cancel()
  assert.equal(f.tasks.size, 0)
  f.flush()
  assert.equal(f.navigations, 0)
})
