import test from 'node:test'
import assert from 'node:assert/strict'
import { pricingChange, sapienPricing } from '../src/personal/projects/sapien-pricing.ts'

test('the published rates fit the shared scale and retain distinct audience bases', () => {
  assert.equal(new URL(sapienPricing.source).hostname, 'www.asksapien.ai')
  assert.equal(new Set(sapienPricing.cohorts.map((cohort) => cohort.id)).size, 2)
  for (const cohort of sapienPricing.cohorts) {
    assert.ok(Number.isInteger(cohort.profiles) && cohort.profiles > 0)
    for (const rate of cohort.qualification) assert.ok(rate >= 0 && rate <= sapienPricing.maximum)
  }
})

test('pricing changes are percentage-point differences, including unchanged and declining results', () => {
  assert.equal(pricingChange(5.52, 11.27), '5.75')
  assert.equal(pricingChange(6.18, 12.5), '6.32')
  assert.equal(pricingChange(20, 25), '5.00')
  assert.equal(pricingChange(10, 10), '0.00')
  assert.equal(pricingChange(30, 25), '-5.00')
})
