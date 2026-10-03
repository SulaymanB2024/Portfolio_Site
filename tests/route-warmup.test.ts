import test from 'node:test'
import assert from 'node:assert/strict'
import { allowsWarmup, createWarmCache, focusWithoutWarmup, isPlacedFocus } from '../src/personal/refinements/warmup-policy.ts'

test('automatic focus is marked only during placement, regardless of previous target', () => {
  const target = { focus() { assert.equal(isPlacedFocus(this as unknown as EventTarget), true) } } as unknown as HTMLElement
  assert.equal(isPlacedFocus(null), false)
  assert.equal(isPlacedFocus(target), false)
  focusWithoutWarmup(target)
  assert.equal(isPlacedFocus(target), false)
  focusWithoutWarmup(null)
})

test('failed focus placement clears its marker for later user focus', () => {
  const target = { focus() { throw new Error('focus failed') } } as unknown as HTMLElement
  assert.throws(() => focusWithoutWarmup(target), /focus failed/)
  assert.equal(isPlacedFocus(target), false)
})

test('speculative warmup respects data saving and slow connections; deliberate activation proceeds', () => {
  assert.equal(allowsWarmup('hover'), true)
  assert.equal(allowsWarmup('hover', true), false)
  assert.equal(allowsWarmup('focus', false, '2g'), false)
  assert.equal(allowsWarmup('hover', false, 'slow-2g'), false)
  assert.equal(allowsWarmup('activate', true, '2g'), true)
})

test('repeated intent shares one pending and completed load', async () => {
  const warm = createWarmCache()
  let calls = 0
  const load = async () => { calls++; return 'page' }
  const first = warm('about', load)
  assert.equal(warm('about', load), first)
  assert.equal(await first, 'page')
  assert.equal(await warm('about', load), 'page')
  assert.equal(calls, 1)
})

test('a failed warmup can retry without poisoning native navigation', async () => {
  const warm = createWarmCache()
  await assert.rejects(warm('resume', async () => { throw new Error('offline') }), /offline/)
  assert.equal(await warm('resume', async () => 'ready'), 'ready')
})
