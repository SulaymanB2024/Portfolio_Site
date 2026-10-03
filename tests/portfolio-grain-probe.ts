import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'
import { LiveDitherEffect as BeforeDither } from './fixtures/sculpture-craft-live-dither-before.ts'

const width = 256, height = 128
const canvas = document.createElement('canvas'); document.body.append(canvas)
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: false })
renderer.setClearColor(0, 0); renderer.setSize(width, height)
const gl = renderer.getContext() as WebGL2RenderingContext
const data = new Float32Array(width * height * 4)
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = (y * width + x) * 4, tone = Math.floor(x / 16) / 45
  data[i] = tone; data[i + 1] = tone * (y < 64 ? 1 : .55); data[i + 2] = tone * (y < 64 ? 1 : 1.5)
  data[i + 3] = Math.min(1, Math.max(0, (x + y - 80) / 4))
}
const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType); texture.needsUpdate = true
const geometry = new THREE.PlaneGeometry(2, 2), material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry, material))
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10); camera.position.z = 1
const rows: { binary: boolean; palette: string; ratio: number; seconds: number; differingBytes: number; glError: number }[] = []
const timings: { variant: string; cpuMs: number; gpuMs: number | null; disjoint: boolean }[] = []
const median = (values: number[]) => values.length ? [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] : null

for (const binary of [true, false]) {
  const effects = [new BeforeDither({ binary }), new LiveDitherEffect({ binary })]
  const composers = effects.map(effect => {
    effect.setView(width, height)
    const composer = new EffectComposer(renderer, { multisampling: 0 })
    composer.addPass(new RenderPass(scene, camera)); composer.addPass(new EffectPass(camera, effect)); return composer
  })
  for (const palette of [['light', '#f3f3f0', '#191a17'], ['dark', '#111210', '#efefe8']]) {
    effects.forEach(effect => effect.setPalette(new THREE.Color(palette[1]), new THREE.Color(palette[2])))
    for (const ratio of [.6, .8, 1, 1.25, 2]) {
      renderer.setPixelRatio(ratio); renderer.setSize(width, height); composers.forEach(composer => composer.setSize(width, height))
      const size = renderer.getDrawingBufferSize(new THREE.Vector2()), count = size.x * size.y * 4
      const before = new Uint8Array(count), after = new Uint8Array(count)
      for (const seconds of [0, 4.5, 19]) {
        effects.forEach(effect => effect.setTime(seconds, true))
        composers[0].render(); gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, before)
        composers[1].render(); gl.readPixels(0, 0, size.x, size.y, gl.RGBA, gl.UNSIGNED_BYTE, after)
        let differingBytes = 0
        for (let i = 0; i < count; i++) if (before[i] !== after[i]) differingBytes++
        rows.push({ binary, palette: palette[0], ratio, seconds, differingBytes, glError: gl.getError() })
      }
    }
  }
  if (binary) {
    renderer.setPixelRatio(1); renderer.setSize(768, 384)
    composers.forEach(composer => composer.setSize(768, 384))
    const ext = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    // Alternating order and separate CPU/GPU measures avoid a one-sided warm run.
    for (let batch = 0; batch < 5; batch++) for (const index of batch % 2 ? [1, 0] : [0, 1]) {
      const composer = composers[index], effect = effects[index]
      for (let frame = 0; frame < 3; frame++) composer.render()
      const query = ext ? gl.createQuery() : null
      if (query) gl.beginQuery(ext.TIME_ELAPSED_EXT, query)
      const start = performance.now(), frames = 20
      for (let frame = 0; frame < frames; frame++) { effect.setTime(batch + frame / 30, true); composer.render() }
      const cpuMs = (performance.now() - start) / frames
      if (query) gl.endQuery(ext.TIME_ELAPSED_EXT)
      gl.flush()
      let gpuMs: number | null = null, disjoint = false
      if (query) {
        for (let poll = 0; poll < 45 && !gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE); poll++) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
        disjoint = !!gl.getParameter(ext.GPU_DISJOINT_EXT)
        if (!disjoint && gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) gpuMs = gl.getQueryParameter(query, gl.QUERY_RESULT) / frames / 1e6
        gl.deleteQuery(query)
      }
      timings.push({ variant: index ? 'after' : 'before', cpuMs, gpuMs, disjoint })
    }
  }
  composers.forEach(composer => composer.dispose())
}
geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose()
const timingSummary = ['before', 'after'].map(variant => ({
  variant,
  medianCpuMs: median(timings.filter(t => t.variant === variant).map(t => t.cpuMs)),
  medianGpuMs: median(timings.filter(t => t.variant === variant && t.gpuMs !== null).map(t => t.gpuMs!)),
}))
const passed = rows.every(row => row.differingBytes === 0 && row.glError === 0)
document.getElementById('result')!.textContent = JSON.stringify({ passed, cases: rows.length, rows, timings, timingSummary })
document.body.dataset.passed = String(passed)
