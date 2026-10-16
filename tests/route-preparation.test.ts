import test from 'node:test'
import assert from 'node:assert/strict'
import { completeRoutePreparation, prepareRouteResources } from '../src/personal/route-preparation.ts'

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

test('a failed page download preserves the source instead of committing a broken lazy page', async () => {
  const events: string[] = []
  const resources = prepareRouteResources('contact', () => Promise.reject(new TypeError('Failed to fetch dynamically imported module')), () => assert.fail('no manuscript'))
  await completeRoutePreparation(resources, () => true, () => { events.push('replace page') }, () => { events.push('offer retry') })
  assert.deepEqual(events, ['offer retry'])
})

test('successful page code still commits when its article data needs the article retry UI', async () => {
  const events: string[] = []
  const resources = prepareRouteResources('writing/cold', async () => 'page', async () => { throw new Error('data offline') })
  await completeRoutePreparation(resources, () => true, () => { events.push('open article') }, () => { events.push('page retry') })
  assert.deepEqual(events, ['open article'])
})

test('an obsolete failed request cannot replace the newer page or show a stale retry', async () => {
  const page = deferred()
  let current = true
  const resources = prepareRouteResources('about', () => page.promise, async () => {})
  const done = completeRoutePreparation(resources, () => current, () => assert.fail('stale commit'), () => assert.fail('stale failure'))
  current = false
  page.reject(new Error('late failure'))
  await done
})

test('navigation waits for the actual page commit before completing', async () => {
  const commit = deferred()
  let completed = false
  const resources = prepareRouteResources('about', async () => 'page', async () => {})
  const done = completeRoutePreparation(resources, () => true, () => commit.promise.then(() => {}), () => assert.fail('ready page'))
  void done.then(() => { completed = true })
  await resources
  await Promise.resolve()
  assert.equal(completed, false)
  commit.resolve()
  await done
  assert.equal(completed, true)
})
