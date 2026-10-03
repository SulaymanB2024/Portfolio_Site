import * as THREE from 'three'
import { WORK_STUDY_VERTEX, WORK_STUDY_FRAGMENT } from '../src/personal/work-study-shader.ts'
import { WORK_STUDY_FRAGMENT as BEFORE_FRAGMENT } from './fixtures/work-grain-before.ts'
import { REFERENCE_FRAGMENT } from './fixtures/work-grain-reference.ts'

// Exercise the exported production shader in a real WebGL pipeline. The frozen
// fixture reproduces scroll drift; the full-cost reference isolates the fastpath.
const canvas = document.createElement('canvas'); document.body.append(canvas)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: false })
renderer.setClearColor(0, 0)
const gl = renderer.getContext() as WebGL2RenderingContext
const geometry = new THREE.PlaneGeometry(2, 2), camera = new THREE.Camera()
const surface = new THREE.DataTexture(new Uint8Array([0, 0, 0, 128]), 1, 1)
surface.needsUpdate = true
type Rect = { x: number; y: number; width: number; height: number }
type Settings = { seconds: number; hover: number; burst: number; flight: number | null; palette: string }
const settings: Settings = { seconds: 0, hover: 0, burst: 0, flight: null, palette: '#191a17' }
const materials = [BEFORE_FRAGMENT, WORK_STUDY_FRAGMENT, REFERENCE_FRAGMENT].map(fragmentShader => new THREE.ShaderMaterial({
  vertexShader: WORK_STUDY_VERTEX, fragmentShader, transparent: true, blending: THREE.NoBlending,
  depthTest: false, depthWrite: false,
  uniforms: {
    studyColor: { value: null }, studySurface: { value: surface }, studyInk: { value: new THREE.Color() },
    studyRegions: { value: Array.from({ length: 4 }, () => new THREE.Vector4()) },
    studyHover: { value: new THREE.Vector4() }, studyBursts: { value: new THREE.Vector4() },
    studyTime: { value: 0 }, studyFlight: { value: new THREE.Vector2() },
    studyResolution: { value: new THREE.Vector3() }, studyCssResolution: { value: new THREE.Vector2() },
  },
}))
const scenes = materials.map(material => { const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry, material)); return scene })
let width = 1, height = 1, cssWidth = 1, cssHeight = 1
const alphas = [0, 32, 128, 255]
const tones = [0, .1, .25, .5, .75, .9, 1]
const linear = (tone: number) => tone <= .04045 ? tone / 12.92 : ((tone + .055) / 1.055) ** 2.4
function resize(cssX: number, cssY: number, ratio: number) {
  cssWidth = cssX; cssHeight = cssY; width = Math.round(cssX * ratio); height = Math.round(cssY * ratio)
  renderer.setSize(width, height, false)
}
function model(rect: Rect, tone?: number) {
  const data = new Uint8Array(width * height * 4)
  for (let y = Math.max(0, rect.y); y < Math.min(height, rect.y + rect.height); y++) {
    for (let x = Math.max(0, rect.x); x < Math.min(width, rect.x + rect.width); x++) {
      const localX = x - rect.x, localY = y - rect.y, i = (y * width + x) * 4
      const value = Math.round(255 * linear(tone ?? tones[Math.floor(localX * tones.length / rect.width)]))
      data[i] = value; data[i + 1] = value; data[i + 2] = value
      data[i + 3] = tone === undefined ? alphas[Math.floor(localY * alphas.length / rect.height)] : 255
    }
  }
  const texture = new THREE.DataTexture(data, width, height)
  texture.minFilter = THREE.NearestFilter; texture.magFilter = THREE.NearestFilter; texture.needsUpdate = true
  return texture
}
function draw(index: number, rect: Rect, texture: THREE.DataTexture, matched = true) {
  const uniform = materials[index].uniforms
  uniform.studyColor.value = texture; uniform.studyInk.value.set(settings.palette)
  uniform.studyRegions.value[0].set(matched ? rect.x : 0, matched ? rect.y : 0, matched ? rect.width : 0, matched ? rect.height : 0)
  uniform.studyHover.value.set(settings.hover, 0, 0, 0); uniform.studyBursts.value.set(settings.burst, 0, 0, 0)
  uniform.studyTime.value = settings.seconds
  uniform.studyFlight.value.set(settings.flight ?? 0, settings.flight === null ? 0 : 1)
  uniform.studyResolution.value.set(width, height, width / cssWidth); uniform.studyCssResolution.value.set(cssWidth, cssHeight)
  renderer.render(scenes[index], camera)
  const pixels = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
  return pixels
}
function differences(a: Uint8Array, b: Uint8Array) {
  let count = 0
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) count++
  return count
}
function translatedDifferences(a: Uint8Array, aRect: Rect, b: Uint8Array, bRect: Rect) {
  let differingBytes = 0, comparedPixels = 0
  for (let y = 0; y < aRect.height; y++) for (let x = 0; x < aRect.width; x++) {
    const ax = aRect.x + x, ay = aRect.y + y, bx = bRect.x + x, by = bRect.y + y
    if (ax < 0 || ay < 0 || bx < 0 || by < 0 || ax >= width || bx >= width || ay >= height || by >= height) continue
    comparedPixels++
    const ai = (ay * width + ax) * 4, bi = (by * width + bx) * 4
    for (let c = 0; c < 4; c++) if (a[ai + c] !== b[bi + c]) differingBytes++
  }
  return { differingBytes, comparedPixels }
}

const equivalence: { ratio: number; palette: string; seconds: number; hover: number; burst: number; flight: number | null; differingBytes: number }[] = []
const translations: { ratio: number; clipped: boolean; palette: string; hover: number; burst: number; before: number; after: number; comparedPixels: number }[] = []
const coverage: { tone: number; density: number; error: number }[] = []
let glErrors = 0, alphaErrors = 0, doubledCellErrors = 0, flightEndpointErrors = 0
for (const palette of ['#191a17', '#efefe8']) for (const ratio of [.6, .8, 1, 1.25, 2]) {
  resize(192, 128, ratio)
  const rect = { x: 0, y: 0, width, height }, texture = model(rect)
  for (const seconds of [0, 4.5, 19]) for (const [hover, burst] of [[0, 0], [.6, 0], [0, .5], [.6, .5]]) {
    Object.assign(settings, { palette, seconds, hover, burst })
    for (const flight of [null, 0, .12, .5, .9, 1]) {
      settings.flight = flight
      const before = draw(2, rect, texture), after = draw(1, rect, texture)
      equivalence.push({ ratio, palette, seconds, hover, burst, flight, differingBytes: differences(before, after) })
      if (gl.getError() !== 0) glErrors++
    }
  }
  texture.dispose()

  // Unequal rounding on X/Y, fractional CSS origins, and partially clipped
  // regions all use the exact rounded model viewport. Translation must preserve
  // local marks while paused, including the hover sweep and release burst.
  resize(321, 239, ratio)
  for (const clipped of [false, true]) {
    const first = { x: Math.round((clipped ? -13.375 : 24.375) * width / cssWidth), y: Math.round((clipped ? -9.625 : 32.625) * height / cssHeight), width: Math.round(176 * width / cssWidth), height: Math.round(128 * height / cssHeight) }
    const second = { ...first, x: first.x + 17, y: first.y + 13 }
    const one = model(first), two = model(second)
    for (const [hover, burst] of [[0, 0], [.6, 0], [0, .5], [.6, .5]]) {
      Object.assign(settings, { palette, seconds: 4.5, hover, burst, flight: null })
      const before = translatedDifferences(draw(0, first, one), first, draw(0, second, two), second)
      const after = translatedDifferences(draw(1, first, one), first, draw(1, second, two), second)
      translations.push({ ratio, clipped, palette, hover, burst, before: before.differingBytes, after: after.differingBytes, comparedPixels: after.comparedPixels })
    }
    one.dispose(); two.dispose()
  }
}

resize(128, 128, 1)
Object.assign(settings, { palette: '#191a17', seconds: 4.5, hover: 0, burst: 0, flight: null })
const full = { x: 0, y: 0, width, height }
const faded = model(full), fadedPixels = draw(1, full, faded)
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = (y * width + x) * 4, expectedAlpha = alphas[Math.floor(y * 4 / height)]
  if (fadedPixels[i + 3] !== 0 && fadedPixels[i + 3] !== expectedAlpha) alphaErrors++
  if (expectedAlpha === 0 && fadedPixels.slice(i, i + 4).some(channel => channel !== 0)) alphaErrors++
}
const opaqueData = (faded.image.data as Uint8Array).slice()
for (let i = 3; i < opaqueData.length; i += 4) opaqueData[i] = 255
const opaque = new THREE.DataTexture(opaqueData, width, height); opaque.needsUpdate = true
const opaquePixels = draw(1, full, opaque)
for (let i = 3; i < fadedPixels.length; i += 4) {
  const inputAlpha = (faded.image.data as Uint8Array)[i]
  if (fadedPixels[i] !== (opaquePixels[i] === 0 ? 0 : inputAlpha)) alphaErrors++
}
settings.flight = 1
flightEndpointErrors = differences(opaquePixels, draw(1, full, opaque))
settings.flight = null
const fallbackErrors = differences(draw(0, full, opaque, false), draw(1, full, opaque, false))
faded.dispose(); opaque.dispose()

for (const tone of tones) {
  const texture = model(full, tone), pixels = draw(1, full, texture)
  let marked = 0
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) marked++
  const density = marked / (width * height)
  coverage.push({ tone, density, error: Math.abs(density - (1 - tone)) })
  texture.dispose()
}

// At DPR2 each CSS cell must occupy one identical 2x2 backing block.
resize(128, 128, 2)
const doubledRect = { x: 0, y: 0, width, height }, doubled = model(doubledRect, .5), doubledPixels = draw(1, doubledRect, doubled)
for (let y = 0; y < height; y += 2) for (let x = 0; x < width; x += 2) {
  const alpha = doubledPixels[(y * width + x) * 4 + 3]
  for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) if (doubledPixels[((y + dy) * width + x + dx) * 4 + 3] !== alpha) doubledCellErrors++
}
doubled.dispose()
if (gl.getError() !== 0) glErrors++
const passed = equivalence.every(row => row.differingBytes === 0)
  && translations.every(row => row.after === 0 && row.before > 0 && row.comparedPixels > 0)
  && coverage.every(row => row.error < .035)
  && alphaErrors === 0 && doubledCellErrors === 0 && flightEndpointErrors === 0 && fallbackErrors === 0 && glErrors === 0
materials.forEach(material => material.dispose()); surface.dispose(); geometry.dispose(); renderer.dispose()
document.getElementById('result')!.textContent = JSON.stringify({ passed, equivalenceCases: equivalence.length, translationCases: translations.length, equivalence, translations, coverage, alphaErrors, doubledCellErrors, flightEndpointErrors, fallbackErrors, glErrors })
document.body.dataset.passed = String(passed)
