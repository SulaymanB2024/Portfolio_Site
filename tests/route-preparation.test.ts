import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareRouteResources } from '../src/personal/route-preparation.ts'

function deferred() {
  let resolve!: (value?: unknown) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

test('cold article code and data start independently and both finish before preparation commits', async () => {
  const page = deferred(), article = deferred(), starts: string[] = []
  let finished = false
  const ready = prepareRouteResources('writing/cold', route => { starts.push(route); return page.promise }, slug => { starts.push(slug); return article.promise })
  ready.then(() => { finished = true })
  await Promise.resolve()
  assert.deepEqual(starts, ['writing/cold', 'cold'])
  article.resolve('data'); await Promise.resolve(); await Promise.resolve()
  assert.equal(finished, false)
  page.resolve('code'); await ready
  assert.equal(finished, true)
})

test('one resource failing does not race past the other, and failure remains available to its UI', async () => {
  const page = deferred(), problem = new Error('offline')
  let finished = false
  const ready = prepareRouteResources('writing/cold', () => page.promise, () => Promise.reject(problem))
  ready.then(() => { finished = true })
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
  assert.equal(finished, false)
  page.resolve()
  const result = await ready
  assert.equal(result[1].status, 'rejected')
  if (result[1].status === 'rejected') assert.equal(result[1].reason, problem)
})

test('ordinary routes load no manuscript and synchronous loader failures are contained', async () => {
  const result = await prepareRouteResources('contact', () => { throw new Error('page failed') }, () => assert.fail('no article job'))
  assert.equal(result[0].status, 'rejected')
  assert.equal(result[1].status, 'fulfilled')
})
