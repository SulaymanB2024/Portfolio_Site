import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scrollFlowProgress, settleFlow, textFlowFront } from '../src/personal/flow-timing.ts'

test('sticky-stage entry, midpoint, exit, and reverse scroll stay bounded', () => {
  assert.equal(scrollFlowProgress(120, 1680, 800), 0)
  assert.equal(scrollFlowProgress(0, 1680, 800), 0)
  assert.equal(scrollFlowProgress(-440, 1680, 800), .5)
  assert.equal(scrollFlowProgress(-880, 1680, 800), 1)
  assert.equal(scrollFlowProgress(-1200, 1680, 800), 1)
  assert.equal(scrollFlowProgress(0, 1680, 800), 0)
})
test('reduced motion preserves the complete model at every scroll position', () => {
  for (const top of [0, -100, -900, -5000]) assert.equal(scrollFlowProgress(top, 1680, 800, true), 0)
  assert.equal(settleFlow(.8, 0, 1 / 60, true), 0)
})
test('resizing to a stage shorter than the viewport never creates NaN or an unbounded progress', () => {
  assert.equal(scrollFlowProgress(0, 600, 800), 0)
  assert.equal(scrollFlowProgress(-20, 600, 800), 1)
})
test('settling converges monotonically and does not overshoot a sudden reversal', () => {
  let value = 0
  for (let i = 0; i < 30; i++) { const next = settleFlow(value, .8, 1 / 60); assert.ok(next >= value && next <= .8); value = next }
  assert.equal(value, .8)
  for (let i = 0; i < 30; i++) { const next = settleFlow(value, .1, 1 / 60); assert.ok(next <= value && next >= .1); value = next }
  assert.equal(value, .1)
})
test('text release front crosses the entire block and returns cleanly after reversal', () => {
  assert.ok(textFlowFront(0, 400) < 0)
  assert.ok(textFlowFront(.5, 400) > 0 && textFlowFront(.5, 400) < 400)
  assert.ok(textFlowFront(1, 400) > 400)
  assert.equal(textFlowFront(-1, 400), textFlowFront(0, 400))
  assert.equal(textFlowFront(2, 400), textFlowFront(1, 400))
  assert.equal(textFlowFront(.8, 0), 0)
})
