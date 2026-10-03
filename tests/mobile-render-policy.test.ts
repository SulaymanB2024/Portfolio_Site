import test from 'node:test'
import assert from 'node:assert/strict'
import { portfolioRenderPolicy, touchOrbitIntent } from '../src/personal/mobile-render-policy.ts'
import { printPixelRatio } from '../src/personal/print-palette.ts'

test('phone portrait, landscape and coarse tablets start with bounded optional motion', () => {
  for (const [width, height, coarse] of [[390,844,true], [320,568,false], [932,430,false], [1024,1366,true]] as const) {
    const policy = portfolioRenderPolicy(width, height, coarse)
    assert.equal(policy.autoplay, false)
    for (const dpr of [1, 2, 3, 4]) {
      const ratio = printPixelRatio(width, height, dpr, policy.pixels, policy.maxRatio)
      assert.ok(width * height * ratio * ratio <= 400_000)
      assert.ok(ratio <= 1.5)
      assert.ok(Math.abs(dpr / ratio - Math.round(dpr / ratio)) < 1e-6)
    }
  }
  assert.equal(portfolioRenderPolicy(1280,800,false).autoplay, true)
  assert.equal(printPixelRatio(390,354,3), 3)
  const phone = portfolioRenderPolicy(390,844,true)
  assert.equal(printPixelRatio(390,354,3,phone.pixels,phone.maxRatio), 1.5)
})

test('small touch jitter and vertical or diagonal swipes cannot start rotation', () => {
  assert.equal(touchOrbitIntent(7,7), 'pending')
  for (const [x,y] of [[1,20],[-2,-30],[10,10],[12,11]]) assert.equal(touchOrbitIntent(x,y), 'scroll')
  assert.equal(touchOrbitIntent(20,2), 'orbit')
  assert.equal(touchOrbitIntent(-20,-2), 'orbit')
})
