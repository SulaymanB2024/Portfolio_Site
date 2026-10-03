import test from 'node:test'
import assert from 'node:assert/strict'
import { homeTextTokens, homeWordDelay, homeWordInfluence } from '../src/personal/home-text-policy.ts'

test('word composition preserves exact punctuation, Unicode and whitespace', () => {
  for (const text of ['What I’m building.\nWhat I’m studying.', '  The state owns the pavement. Who owns the cash flow? ', 'Résumé\u00a0—\t2026', 'sybatx@gmail.com', '']) {
    assert.equal(homeTextTokens(text).join(''), text)
  }
})
test('long headings retain a bounded composition instead of a long delay sequence', () => {
  assert.equal(homeWordDelay(0), 0)
  assert.equal(homeWordDelay(1), .035)
  assert.equal(homeWordDelay(1000), .26)
  assert.equal(homeWordDelay(NaN), 0)
})
test('cursor influence is local, smoothly bounded, and returns exactly to rest', () => {
  assert.equal(homeWordInfluence(0, 0, 0, 0, 1), 1)
  assert.equal(homeWordInfluence(0, 0, 1, 1, 1), 0)
  assert.equal(homeWordInfluence(0, 0, 0, 0, 0), 0)
  assert.equal(homeWordInfluence(NaN, 0, 0, 0, 1), 0)
  assert.equal(homeWordInfluence(0, 0, 0, 0, 100), 1)
  assert.ok(homeWordInfluence(0, 0, .1, .1, 1) > homeWordInfluence(0, 0, .5, .1, 1))
  assert.equal(homeWordInfluence(.3, 0, 0, 0, .5), homeWordInfluence(0, 0, .3, 0, .5))
})
