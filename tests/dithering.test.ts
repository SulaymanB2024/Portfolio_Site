import test from 'node:test'
import assert from 'node:assert/strict'
import { WebGLRenderTarget, type WebGLRenderer } from 'three'
import { DitheringEffect } from '../src/dithering-shader/DitheringEffect.ts'

test('interactive adjustments retain the GPU effect and uniform objects', () => {
  const effect = new DitheringEffect()
  const grid = effect.uniforms.get('gridSize')
  const pixel = effect.uniforms.get('pixelSizeRatio')
  for (let i = 1; i <= 20; i++) {
    effect.setGridSize(i)
    effect.setPixelSizeRatio(i / 2)
  }
  assert.equal(effect.uniforms.get('gridSize'), grid)
  assert.equal(effect.uniforms.get('pixelSizeRatio'), pixel)
  assert.equal(grid!.value, 20)
  assert.equal(pixel!.value, 10)
  effect.setGridSize(0)
  effect.setPixelSizeRatio(0)
  assert.equal(grid!.value, 1)
  assert.equal(pixel!.value, 1)
  effect.dispose()
})
test('sampling tracks the physical target after a resize or DPR change', () => {
  const effect = new DitheringEffect()
  const target = new WebGLRenderTarget(1280, 720)
  const resolution = effect.uniforms.get('resolution')!.value
  effect.update({} as WebGLRenderer, target)
  assert.deepEqual(resolution.toArray(), [1280, 720])
  target.setSize(780, 1688)
  effect.update({} as WebGLRenderer, target)
  assert.equal(effect.uniforms.get('resolution')!.value, resolution)
  assert.deepEqual(resolution.toArray(), [780, 1688])
  target.dispose()
  effect.dispose()
})
test('original defaults and comparison/color switches update shader flags', () => {
  const effect = new DitheringEffect({ grayscaleOnly: true })
  assert.equal(effect.uniforms.get('gridSize')!.value, 4)
  assert.equal(effect.uniforms.get('pixelSizeRatio')!.value, 1)
  assert.equal(effect.uniforms.get('grayscaleOnly')!.value, 1)
  effect.setGrayscaleOnly(false)
  effect.setInvertColor(true)
  effect.setEnabled(false)
  assert.equal(effect.uniforms.get('grayscaleOnly')!.value, 0)
  assert.equal(effect.uniforms.get('invertColor')!.value, 1)
  assert.equal(effect.uniforms.get('ditheringEnabled')!.value, 0)
  effect.dispose()
})
