import test from 'node:test'
import assert from 'node:assert/strict'
import { createDeferredModule } from '../src/personal/deferred-module.ts'

test('intent and navigation share a pending module and make it available before commit', async () => {
  let finish!: (value: { default: string }) => void
  let calls = 0
  const module = createDeferredModule(() => {
    calls++
    return new Promise<{ default: string }>(resolve => { finish = resolve })
  })
  const intent = module.prepare()
  assert.equal(module.read(), undefined)
  assert.equal(module.prepare(), intent)
  await Promise.resolve()
  finish({ default: 'destination' })
  const result = await intent
  // The live handoff can find its destination in the same synchronous commit.
  assert.equal(module.read(), result)
  assert.equal(module.prepare(), intent)
  assert.equal(calls, 1)
})

test('failed speculative loading leaves the next deliberate request retryable', async () => {
  let calls = 0
  const module = createDeferredModule(async () => {
    if (++calls === 1) throw new Error('offline')
    return { default: 'ready' }
  })
  await assert.rejects(module.prepare(), /offline/)
  assert.equal(module.read(), undefined)
  await module.prepare()
  assert.deepEqual(module.read(), { default: 'ready' })
  assert.equal(calls, 2)
})
