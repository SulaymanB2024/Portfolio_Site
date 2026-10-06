import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'

// Render the real effect against known linear tones, without a model or lighting.
const width = 128, height = 32
const canvas = document.createElement('canvas')
document.body.append(canvas)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true })
renderer.setSize(width, height)
renderer.setClearColor(0, 0)
const data = new Float32Array(width * height * 4)
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = (y * width + x) * 4
  const gray = Math.floor(x / 8) / 45
  data[i] = data[i + 1] = data[i + 2] = gray
  data[i + 3] = y < 4 ? 0 : 1
}
const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType)
texture.needsUpdate = true
const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, blending: THREE.NoBlending, toneMapped: false })
const scene = new THREE.Scene()
scene.add(new THREE.Mesh(geometry, material))
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10)
camera.position.z = 1
class ProbeDither extends LiveDitherEffect {
  reference = false
  override update(renderer: THREE.WebGLRenderer, buffer: THREE.WebGLRenderTarget) {
    super.update(renderer, buffer)
    if (this.reference) this.uniforms.get('printDirectSample')!.value = false
  }
}
const dither = new ProbeDither({ gridSize: 1, binary: true, live: false })
dither.setView(width, height)
dither.setPalette(new THREE.Color('#ffffff'), new THREE.Color('#000000'))
const composer = new EffectComposer(renderer, { multisampling: 0 })
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new EffectPass(camera, dither))
function probe(ratio: number) {
  renderer.setPixelRatio(ratio)
  renderer.setSize(width, height)
  composer.setSize(width, height)
  const size = renderer.getDrawingBufferSize(new THREE.Vector2())
  const pixels = new Uint8Array(size.x * size.y * 4)
  const gl = renderer.getContext()
  const coverage: number[] = []
  let transparent = 0, invalidAlpha = 0, transparentRGB = 0
  let samplerMismatch = 0
  const referencePixels = new Uint8Array(pixels.length)
  // Uniform fields measure tonal coverage on the same spatial grid. Small
  // adjacent strips otherwise compare different Bayer phases after resampling.
  for (let tone = 0; tone < 16; tone++) {
    for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = tone / 45
    texture.needsUpdate = true
    composer.render()
    gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    dither.reference = true
    composer.render()
    gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, referencePixels)
    for (let i = 0; i < pixels.length; i++) if (pixels[i] !== referencePixels[i]) samplerMismatch++
    dither.reference = false
    let white = 0
    // Read corresponding CSS pixel centers to compare density across DPR changes.
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const px = Math.min(size.x - 1, Math.floor((x + .5) * size.x / width))
      const py = Math.min(size.y - 1, Math.floor((y + .5) * size.y / height))
      const i = (py * size.x + px) * 4
      if (y < 4) {
        if (pixels[i + 3] === 0) transparent++; else invalidAlpha++
        if (pixels[i] === 0 && pixels[i + 1] === 0 && pixels[i + 2] === 0) transparentRGB++
      } else if (pixels[i + 3] !== 255) invalidAlpha++
      else if (pixels[i] > 127) white++
    }
    coverage.push(white)
  }
  return {
    ratio, backing: size.toArray(), coverage,
    monotonic: coverage.every((value, i) => i === 0 || value >= coverage[i - 1]),
    black: coverage[0] === 0, white: coverage[15] === width * 28,
    transparent: transparent === width * 4 * 16, transparentRGB: transparentRGB === width * 4 * 16,
    validAlpha: invalidAlpha === 0, samplerMismatch, glError: gl.getError(),
  }
}
const probes = [1, 2, .8].map(probe)
// Nonuniform tones, live grain and partial coverage exercise the thin-rim path.
function edgeProbe(ratio: number, time: number) {
  renderer.setPixelRatio(ratio); renderer.setSize(width, height); composer.setSize(width, height)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4, alpha = [0, .125, .5, 1][(x + y) % 4]
    const tone = ((x * 7 + y * 13) % 97) / 288
    data[i] = tone * alpha; data[i + 1] = tone * .7 * alpha; data[i + 2] = tone * .3 * alpha; data[i + 3] = alpha
  }
  texture.needsUpdate = true
  dither.uniforms.get('printGrain')!.value = .025
  dither.setTime(time, true)
  const size = renderer.getDrawingBufferSize(new THREE.Vector2()), gl = renderer.getContext()
  const actual = new Uint8Array(size.x * size.y * 4), reference = new Uint8Array(actual.length)
  dither.reference = false; composer.render(); gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, actual)
  dither.reference = true; composer.render(); gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, reference)
  dither.reference = false
  let mismatch = 0
  for (let i = 0; i < actual.length; i++) if (actual[i] !== reference[i]) mismatch++
  return { ratio, time, mismatch, glError: gl.getError() }
}
const edges = [1, 2, .8].flatMap(ratio => [0, 4, 18].map(time => edgeProbe(ratio, time)))
const result = {
  probes, edges,
  cssDensityStableAtDpr2: JSON.stringify(probes[0].coverage) === JSON.stringify(probes[1].coverage),
  passed: probes.every(p => p.monotonic && p.black && p.white && p.transparent && p.transparentRGB && p.validAlpha && p.samplerMismatch === 0 && p.glError === 0),
}
result.passed &&= result.cssDensityStableAtDpr2
result.passed &&= edges.every(edge => edge.mismatch === 0 && edge.glError === 0)
document.getElementById('result')!.textContent = JSON.stringify(result)
document.body.dataset.passed = String(result.passed)
composer.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose()
