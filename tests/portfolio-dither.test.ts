import test from 'node:test'
import assert from 'node:assert/strict'
import { Color, WebGLRenderTarget, type WebGLRenderer } from 'three'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'
import { WaterFlowEffect } from '../src/personal/water-flow.ts'

test('CSS dot grid is retained when backing resolution changes independently', () => {
  const effect = new LiveDitherEffect()
  effect.setView(390, 844)
  const css = effect.uniforms.get('printCssSize')!.value
  const backing = effect.uniforms.get('printBufferSize')!.value
  const target = new WebGLRenderTarget(780, 1688)
  effect.update({} as WebGLRenderer, target)
  target.setSize(624, 1350)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('printCssSize')!.value, css)
  assert.equal(effect.uniforms.get('printBufferSize')!.value, backing)
  assert.deepEqual(css.toArray(), [390, 844])
  assert.deepEqual(backing.toArray(), [624, 1350])
  effect.setView(NaN, Infinity)
  assert.deepEqual(css.toArray(), [1, 1])
  target.dispose(); effect.dispose()
})

test('pause freezes grain phase and theme changes retain palette uniform ownership', () => {
  const effect = new LiveDitherEffect()
  const paper = effect.uniforms.get('printPaper')!.value
  const ink = effect.uniforms.get('printInk')!.value
  effect.setTime(4, true)
  effect.setTime(60, false)
  effect.setTime(NaN, true)
  assert.equal(effect.uniforms.get('printClock')!.value, 4)
  effect.setPalette(new Color('#111210'), new Color('#efefe8'))
  assert.equal(effect.uniforms.get('printPaper')!.value, paper)
  assert.equal(effect.uniforms.get('printInk')!.value, ink)
  assert.equal(paper.getHexString(), '111210')
  const still = new LiveDitherEffect({ gridSize: 1, binary: false, live: false })
  assert.equal(still.uniforms.get('printGrain')!.value, 0)
  effect.dispose(); still.dispose()
})

test('direct sampling is limited to exact one-to-one cells and follows resize', () => {
  const effect = new LiveDitherEffect()
  const target = new WebGLRenderTarget(390, 844)
  effect.setView(390, 844)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('printDirectSample')!.value, true)
  target.setSize(780, 1688)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('printDirectSample')!.value, false)
  target.setSize(312, 675)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('printDirectSample')!.value, false)
  target.setSize(390, 844)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('printDirectSample')!.value, true)
  const coarse = new LiveDitherEffect({ gridSize: 2 })
  coarse.setView(390, 844)
  coarse.update({} as WebGLRenderer, target)
  assert.equal(coarse.uniforms.get('printDirectSample')!.value, false)
  effect.dispose(); coarse.dispose(); target.dispose()
})

test('flow coverage retains CSS density when backing resolution changes', () => {
  const flow = new WaterFlowEffect()
  flow.setResolution(390, 844)
  const resolution = flow.uniforms.get('flowResolution')!.value
  flow.setResolution(NaN, 1)
  assert.equal(flow.uniforms.get('flowResolution')!.value, resolution)
  assert.deepEqual(resolution.toArray(), [390, 844])
  flow.dispose()
})
