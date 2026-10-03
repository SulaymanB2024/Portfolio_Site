import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'
import { PORTFOLIO_DITHER_GLSL } from '../src/personal/dither-kernel.ts'

// The real postprocessing pass: one-pixel rims, partial coverage, and live grain.
const width = 64, height = 32
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true })
document.body.append(renderer.domElement)
renderer.setClearColor(0, 0)
const data = new Float32Array(width * height * 4)
const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType)
texture.minFilter = texture.magFilter = THREE.NearestFilter
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NoBlending, toneMapped: false })
const geometry = new THREE.PlaneGeometry(2, 2)
const scene = new THREE.Scene()
scene.add(new THREE.Mesh(geometry, material))
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10)
camera.position.z = 1
const effect = new LiveDitherEffect({ gridSize: 2, binary: true, live: true })
if (new URLSearchParams(location.search).has('before')) {
  const source = await fetch('/evidence/portfolio-refinement/live-dither-before.txt').then(r => r.text())
  const fragment = source.match(/const fragment = \/\* glsl \*\/ `([\s\S]*?)`/)?.[1]
  if (!fragment) throw new Error('Saved baseline shader missing')
  effect.setFragmentShader(fragment.replace('${PORTFOLIO_DITHER_GLSL}', PORTFOLIO_DITHER_GLSL))
}
effect.setView(width, height)
effect.setPalette(new THREE.Color('white'), new THREE.Color('black'))
const composer = new EffectComposer(renderer, { multisampling: 0 })
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new EffectPass(camera, effect))
function fill(tone: number, alpha: (x: number, y: number) => number) {
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, a = alpha(x, y)
    data[i] = data[i + 1] = data[i + 2] = tone * a
    data[i + 3] = a
  }
  texture.needsUpdate = true
}
function read() {
  composer.render()
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const pixels = new Uint8Array(size.x * size.y * 4), gl = renderer.getContext()
  gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  return { pixels, size, error: gl.getError() }
}
function sourceAlpha() {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const target = new THREE.WebGLRenderTarget(size.x, size.y)
  renderer.setRenderTarget(target); renderer.render(scene, camera)
  const pixels = new Uint8Array(size.x * size.y * 4)
  renderer.readRenderTargetPixels(target, 0, 0, size.x, size.y, pixels)
  renderer.setRenderTarget(null); target.dispose()
  return pixels
}
const edge = (x: number, y: number) => x % 8 === 0 || x === y ? 1 : 0
const ratios = [1, 2, .8].map(ratio => {
  renderer.setPixelRatio(ratio); renderer.setSize(width, height); composer.setSize(width, height)
  fill(.08, edge)
  const source = sourceAlpha()
  const { pixels, size, error } = read()
  let expected = 0, present = 0, outside = 0, hiddenRgb = 0
  // Compare with the same input mask at each physical sample, including .8x.
  for (let y = 0; y < size.y; y++) for (let x = 0; x < size.x; x++) {
    const i = (y * size.x + x) * 4
    const a = source[i + 3]
    if (a) { expected++; if (pixels[i + 3] === 255) present++ }
    else { if (pixels[i + 3]) outside++; if (pixels[i] || pixels[i + 1] || pixels[i + 2]) hiddenRgb++ }
  }
  return { ratio, backing: size.toArray(), expected, present, outside, hiddenRgb, error, passed: expected === present && outside === 0 && hiddenRgb === 0 && error === 0 }
})
renderer.setPixelRatio(1); renderer.setSize(width, height); composer.setSize(width, height)
fill(.16, () => 1)
effect.uniforms.get('printGrain')!.value = 0
effect.setTime(2, true)
const full = read().pixels
fill(.16, () => .5)
const partial = read().pixels
let partialToneMatches = true, partialAlphaMatches = true
for (let i = 0; i < full.length; i += 4) {
  partialToneMatches &&= full[i] === partial[i]
  partialAlphaMatches &&= Math.abs(partial[i + 3] - 128) <= 1
}
effect.uniforms.get('printGrain')!.value = .025
const live = read().pixels
effect.setTime(100, false)
const paused = read().pixels
const grainFrozen = live.every((value, i) => value === paused[i])
effect.setTime(8, true)
const resumed = read().pixels
const grainResumes = live.some((value, i) => value !== resumed[i])
const result = { ratios, partialToneMatches, partialAlphaMatches, grainFrozen, grainResumes, passed: ratios.every(r => r.passed) && partialToneMatches && partialAlphaMatches && grainFrozen && grainResumes }
document.getElementById('result')!.textContent = JSON.stringify(result)
document.body.dataset.passed = String(result.passed)
composer.dispose(); texture.dispose(); material.dispose(); geometry.dispose(); renderer.dispose()
