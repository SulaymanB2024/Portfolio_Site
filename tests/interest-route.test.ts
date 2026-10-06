import test from 'node:test'
import assert from 'node:assert/strict'
import { interestFromHash, interestHref } from '../src/personal/about/interest-route.ts'

test('each homepage interest link arrives at the correct About object', () => {
  for (const id of ['bass', 'score', 'knight'] as const) assert.equal(interestFromHash(interestHref(id)), id)
  assert.equal(interestFromHash('#/about?review=home&interest=score'), 'score')
})

test('unknown interest values and unrelated routes keep the original About overview', () => {
  for (const hash of ['#/about', '#/about?interest=', '#/about?interest=board', '#/work?interest=bass', '#/about/other?interest=score', '#/about?interest=%3Cscript%3E']) assert.equal(interestFromHash(hash), null)
})
