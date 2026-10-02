import test from 'node:test'
import assert from 'node:assert/strict'
import { printPalette, printPixelRatio } from '../src/personal/print-palette.ts'
import { WaterFlowEffect } from '../src/personal/water-flow.ts'

test('CSS paper and ink round-trip through the linear shader working space in both themes', () => {
  for (const [paper, ink] of [['#f3f3f0', '#191a17'], ['#111210', '#efefe8']]) {
    const colors = printPalette(paper, ink)
    assert.equal(`#${colors.paper.getHexString()}`, paper)
    assert.equal(`#${colors.ink.getHexString()}`, ink)
    assert.ok(colors.paper.r !== Number.parseInt(paper.slice(1,3),16)/255)
  }
})

test('falling strips update both colors in place when the theme changes', () => {
  const effect = new WaterFlowEffect()
  const paperUniform = effect.uniforms.get('flowPaper')!
  const inkUniform = effect.uniforms.get('flowInk')!
  const paperColor = paperUniform.value
  const colors = printPalette('#111210', '#efefe8')
  effect.setPalette(colors.paper, colors.ink)
  assert.equal(effect.uniforms.get('flowPaper'), paperUniform)
  assert.equal(effect.uniforms.get('flowInk'), inkUniform)
  assert.equal(paperUniform.value, paperColor)
  assert.equal(paperUniform.value.getHexString(), '111210')
  assert.equal(inkUniform.value.getHexString(), 'efefe8')
  effect.dispose()
})

test('fractional zoom densities cannot create fractional dot cells or exceed the raster budget', () => {
  for (const [width,height] of [[390,844],[1280,800],[1710,1017],[3840,2160]]) {
    for (const density of [.75,1,1.25,1.5,2,2.5,3]) {
      const ratio = printPixelRatio(width,height,density)
      assert.ok(width*height*ratio*ratio <= 2_200_000)
      assert.ok(Math.abs(density/ratio - Math.round(density/ratio)) < .000001)
    }
  }
  assert.equal(printPixelRatio(390,844,2),2)
  assert.equal(printPixelRatio(1280,800,1.25),1.25)
})
