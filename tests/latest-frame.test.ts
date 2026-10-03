import test from 'node:test'
import assert from 'node:assert/strict'
import { createLatestFrame } from '../src/personal/latest-frame.ts'

function fixture() {
  let id = 0
  const queued = new Map<number, FrameRequestCallback>(), cancelled: number[] = []
  const action = createLatestFrame(callback => { const key = id++; queued.set(key, callback); return key }, key => { cancelled.push(key) })
  return { action, queued, cancelled }
}

test('new actions invalidate even an already queued stale frame and capture only the intended destination', () => {
  const f = fixture(), visited: string[] = []
  f.action.schedule(() => visited.push('overview'))
  f.action.schedule(() => visited.push('next role'))
  assert.deepEqual(f.cancelled, [0])
  f.queued.get(0)!(0); f.queued.get(1)!(0)
  assert.deepEqual(visited, ['next role'])
})

test('selection cancellation and route disposal leave no focus action that can run or restart', () => {
  const f = fixture(), visited: string[] = []
  f.action.schedule(() => visited.push('closed role'))
  f.action.cancel(); f.queued.get(0)!(0)
  f.action.schedule(() => visited.push('document toggle'))
  f.action.dispose(); f.queued.get(1)!(0)
  f.action.schedule(() => visited.push('after unmount'))
  assert.deepEqual(visited, [])
  assert.equal(f.queued.size, 2)
  assert.deepEqual(f.cancelled, [0, 1])
})
