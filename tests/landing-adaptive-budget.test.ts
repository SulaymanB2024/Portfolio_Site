import test from 'node:test'
import assert from 'node:assert/strict'
import { PortfolioRuntime } from '../src/personal/portfolio-runtime.ts'
import { landingRenderBudget } from '../src/personal/landing/render-budget.ts'

test('slow visible rendering reduces the four scene buffers while preserving the text canvas', () => {
  const runtime = new PortfolioRuntime()
  const full = landingRenderBudget(390, 844, 3, true, runtime.scale)
  for (let time = 0; time <= 5_000; time += 50) runtime.advance(time, true)
  assert.equal(runtime.scale, .8)
  const reduced = landingRenderBudget(390, 844, 3, true, runtime.scale)
  assert.equal(reduced.canvasRatio, full.canvasRatio, 'heading atlas and output canvas stay sharp')
  assert.ok(Math.abs(reduced.sceneRatio ** 2 / full.sceneRatio ** 2 - .64) < 1e-12)
  for (let time = 5_033; time < 17_000; time += 33) runtime.advance(time, true)
  assert.equal(runtime.scale, 1)
  assert.deepEqual(landingRenderBudget(390, 844, 3, true, runtime.scale), full)
})

test('recovery and malformed scale values remain within the phone and laptop pixel budgets', () => {
  for (const [width, height, coarse] of [[390, 844, true], [844, 390, true], [1440, 900, false]] as const) {
    const full = landingRenderBudget(width, height, 2, coarse)
    for (const scale of [-1, 0, .8, 1, 10, NaN, Infinity]) {
      const budget = landingRenderBudget(width, height, 2, coarse, scale)
      assert.equal(budget.canvasRatio, full.canvasRatio)
      assert.ok(budget.sceneRatio >= full.sceneRatio * .8 && budget.sceneRatio <= full.sceneRatio)
      assert.ok(width * height * budget.sceneRatio ** 2 <= (coarse ? 230_000 : 1_200_000) + 1e-6)
    }
  }
})
