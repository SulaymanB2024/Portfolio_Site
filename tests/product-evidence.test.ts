import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateBudget, exampleOffers } from '../src/personal/projects/internship-offer-example.ts'

test('the original repository examples compare whole-placement balances', () => {
  const a = calculateBudget(exampleOffers[0])
  const b = calculateBudget(exampleOffers[1])
  assert.equal(a.income, 12000)
  assert.equal(b.income, 9600)
  assert.ok(Math.abs(a.balance! - 6615.384615384615) < 1e-8)
  assert.ok(Math.abs(b.balance! - 4569.230769230769) < 1e-8)
  assert.ok(a.balance! > b.balance!)
})

test('a missing or invalid amount remains unknown without becoming zero', () => {
  for (const [key, value] of [['rate', ''], ['monthly', ''], ['rate', '-1'], ['monthly', 'Infinity'], ['weeks', '0'], ['weeks', '105']] as const) {
    assert.equal(calculateBudget({ ...exampleOffers[0], [key]: value }).balance, null, `${key}: ${value}`)
  }
})

test('explicit zero cost is valid and placement costs use the original weekly proration', () => {
  const result = calculateBudget({ ...exampleOffers[0], monthly: '0', setup: '0' })
  assert.equal(result.balance, 12000)
  assert.ok(Math.abs(calculateBudget({ ...exampleOffers[0], weeks: '1' }).living! - 1800 * 12 / 52) < 1e-8)
})

test('editing one example does not mutate the retained repository defaults', () => {
  const changed = calculateBudget({ ...exampleOffers[0], rate: '40' })
  assert.equal(changed.income, 19200)
  assert.equal(exampleOffers[0].rate, '25')
  assert.equal(exampleOffers[1].rate, '30')
})
