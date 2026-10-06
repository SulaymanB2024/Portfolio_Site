import test from 'node:test'
import assert from 'node:assert/strict'
import { validateUrlList } from '../scripts/submit-indexnow.mjs'

test('IndexNow submissions require bounded canonical HTTPS paths on the owned domain', () => {
  assert.doesNotThrow(() => validateUrlList(['https://sulayman-bowles.dev/', 'https://sulayman-bowles.dev/machine/profile.json']))
  for (const url of [
    'http://sulayman-bowles.dev/about', 'https://www.sulayman-bowles.dev/about',
    'https://other.example/about', 'https://sulayman-bowles.dev:8443/about',
    'https://user:password@sulayman-bowles.dev/about',
    'https://sulayman-bowles.dev/#/about', 'https://sulayman-bowles.dev/about?tracking=yes',
  ]) assert.throws(() => validateUrlList([url]), /canonical HTTPS path/)
  assert.throws(() => validateUrlList([]), /1–10,000/)
  assert.throws(() => validateUrlList(Array(10_001).fill('https://sulayman-bowles.dev/')), /1–10,000/)
})
