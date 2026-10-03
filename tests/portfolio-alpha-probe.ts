import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'
import { WaterFlowEffect } from '../src/personal/water-flow.ts'

// Verify the final canvas contract, which readPixels-only shader probes miss.
// Canvas2D's source-over composition uses the browser's canvas presentation.
const width = 256, height = 64, alphas = [.125, .25, .5, 1]
const palettes = [
  { name: 'Light', paper: '#f3f3f0', ink: '#191a17' },
  { name: 'Dark', paper: '#111210', ink: '#efefe8' },
]
const bytes = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
const results: { palette: string; premultipliedAlpha: boolean; phases: { progress: number; maxError: number; meanError: number; partialPixels: number; glError: number }[] }[] = []

for (const palette of palettes) for (const premultipliedAlpha of [true, false]) {
  const section = document.createElement('section')
  section.style.background = palette.paper; section.style.color = palette.ink
  section.innerHTML = `<h2>${palette.name}: ${premultipliedAlpha ? 'previous context' : 'straight-alpha context'}</h2>`
  const canvas = document.createElement('canvas'); section.append(canvas)
  const reference = document.createElement('div'); reference.className = 'reference'
  const ink = bytes(palette.ink), paper = bytes(palette.paper)
  for (const alpha of alphas) {
    const block = document.createElement('span')
    block.style.background = `rgba(${ink.join(',')},${alpha})`; reference.append(block)
  }
  section.append(reference); document.getElementById('cases')!.append(section)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1); renderer.setSize(width, height); renderer.setClearColor(0, 0)
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) data[(y * width + x) * 4 + 3] = Math.round(alphas[Math.floor(x / 64)] * 255)
  const texture = new THREE.DataTexture(data, width, height)
  texture.needsUpdate = true
  const geometry = new THREE.PlaneGeometry(2, 2)
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
  const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry, material))
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10); camera.position.z = 1
  const dither = new LiveDitherEffect({ binary: true, live: false })
  dither.setView(width, height); dither.setPalette(new THREE.Color(palette.paper), new THREE.Color(palette.ink))
  const flow = new WaterFlowEffect()
  flow.setResolution(width, height)
  flow.uniforms.get('flowOrigin')!.value.set(.5, .5)
  flow.uniforms.get('flowSourceWidth')!.value = 1
  flow.uniforms.get('flowSourceHeight')!.value = 1
  const composer = new EffectComposer(renderer, { multisampling: 0 })
  composer.addPass(new RenderPass(scene, camera)); composer.addPass(new EffectPass(camera, dither)); composer.addPass(new EffectPass(camera, flow))
  const flat = document.createElement('canvas'); flat.width = width; flat.height = height
  const context = flat.getContext('2d')!
  const gl = renderer.getContext(), pixels = new Uint8Array(width * height * 4)
  const phases = []
  for (const progress of [0, .35, .65]) {
    flow.setProgress(progress); composer.render()
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    context.globalCompositeOperation = 'source-over'; context.fillStyle = palette.paper; context.fillRect(0, 0, width, height); context.drawImage(canvas, 0, 0)
    const composed = context.getImageData(0, 0, width, height).data
    let maxError = 0, totalError = 0, partialPixels = 0
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const input = ((height - 1 - y) * width + x) * 4, output = (y * width + x) * 4, alpha = pixels[input + 3] / 255
      if (alpha > 0 && alpha < 1) partialPixels++
      for (let channel = 0; channel < 3; channel++) {
        const expected = Math.round(pixels[input + channel] * alpha + paper[channel] * (1 - alpha))
        const error = Math.abs(composed[output + channel] - expected)
        maxError = Math.max(maxError, error); totalError += error
      }
    }
    phases.push({ progress, maxError, meanError: totalError / (width * height * 3), partialPixels, glError: gl.getError() })
  }
  flow.setProgress(0); composer.render()
  results.push({ palette: palette.name, premultipliedAlpha: gl.getContextAttributes()!.premultipliedAlpha === true, phases })
  composer.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose()
}
const corrected = results.filter(r => !r.premultipliedAlpha), previous = results.filter(r => r.premultipliedAlpha)
const passed = corrected.every(r => r.phases.every(p => p.maxError <= 3 && p.partialPixels > 0 && p.glError === 0)) && previous.some(r => r.phases.some(p => p.maxError > 20))
document.getElementById('result')!.textContent = JSON.stringify({ passed, results }, null, 2)
document.body.dataset.passed = String(passed)
