import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import context from './model-context.mjs'
import { harveyBuyer, vantaBuyer } from './scenario-math.mjs'

const cases = JSON.parse(readFileSync(new URL('./parity-cases.json', import.meta.url)))
for (const [i, fixture] of cases.entries()) {
  test(`${fixture.company} browser/Python parity ${i + 1}`, () => {
    const calculate = fixture.company === 'harvey' ? harveyBuyer : vantaBuyer
    const actual = calculate(context[fixture.company], fixture.knobs)
    for (const [key, expected] of Object.entries(fixture.expected)) {
      if (expected === null) assert.equal(actual[key], null, key)
      else assert.ok(Math.abs(actual[key] - expected) < 1e-7, `${key}: ${actual[key]} != ${expected}`)
    }
  })
}
test('browser inputs reject non-finite and impossible values', () => {
  for (const adoption of [-1, 1.01, Infinity, NaN]) {
    assert.throws(() => harveyBuyer(context.harvey, { adoption, review: .2, capture: .25 }), RangeError)
  }
  for (const weeks of [-1, 53, NaN]) {
    assert.throws(() => vantaBuyer(context.vanta, { weeks, questionnaires: 10, capture: .5 }), RangeError)
  }
})
test('first-year and renewal economics differ only by implementation cost', () => {
  const before = JSON.stringify(context)
  const h = harveyBuyer(context.harvey, { adoption: .6, review: .2, capture: .25 })
  const v = vantaBuyer(context.vanta, { weeks: 16, questionnaires: 10, capture: .5 })
  assert.equal(h.recurringBenefit - h.firstBenefit, 50000)
  assert.equal(v.recurringBenefit - v.firstBenefit, 5000)
  assert.equal(JSON.stringify(context), before)
})
