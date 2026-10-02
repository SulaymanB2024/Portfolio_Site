import test from 'node:test'
import assert from 'node:assert/strict'
import { homeHeroProgress, homeRevealEase, homeRevealProgress, holdHomeReveal } from '../src/personal/home-scroll-timing.ts'

test('the opening finishes as work enters, with a complete static reduced-motion hero', () => {
  assert.equal(homeHeroProgress(0, 2100, 1000), 0)
  assert.ok(homeHeroProgress(-1100, 2100, 1000) < .7, 'retain the drawing when the next section is at the lower edge')
  assert.equal(homeHeroProgress(-1750, 2100, 1000), 1)
  assert.equal(homeHeroProgress(-2200, 2100, 1000), 1)
  assert.equal(homeHeroProgress(-1750, 2100, 1000, true), 0)
})

test('scroll reveals start near the lower edge and finish before the reading band', () => {
  for (const viewport of [600, 844, 1000]) {
    assert.equal(homeRevealProgress(viewport, viewport), 0)
    assert.ok(Math.abs(homeRevealProgress(viewport * .82, viewport) - .5) < .00001)
    assert.equal(homeRevealProgress(viewport * .60, viewport, .15), 1)
    assert.equal(homeRevealProgress(-100, viewport), 1)
  }
})
test('staggered copy follows the heading in a bounded scroll interval', () => {
  const lead = homeRevealProgress(650, 844)
  const body = homeRevealProgress(650, 844, .15)
  assert.ok(body < lead && body > 0)
  for (let top = 1000; top > -100; top -= 10) {
    const progress = homeRevealProgress(top, 844)
    assert.ok(progress >= 0 && progress <= 1)
    assert.ok(homeRevealEase(progress) >= progress)
  }
})
test('completed copy never conceals itself on reverse scroll or viewport resize', () => {
  assert.equal(holdHomeReveal(1, homeRevealProgress(900, 844)), 1)
  assert.equal(holdHomeReveal(.7, .2), .7)
  assert.equal(holdHomeReveal(.7, .9), .9)
  assert.equal(holdHomeReveal(-1, 2), 1)
})
test('unavailable viewport measurements fail open and easing remains bounded', () => {
  assert.equal(homeRevealProgress(100, 0), 1)
  assert.equal(homeRevealProgress(NaN, 844), 1)
  assert.equal(homeRevealEase(-1), 0)
  assert.equal(homeRevealEase(2), 1)
})
