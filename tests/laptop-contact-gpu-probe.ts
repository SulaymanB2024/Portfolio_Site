import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { createLionStudy } from '../src/personal/contact/lion-study.ts'
import { createLionStudy as createBeforeStudy } from './fixtures/laptop-contact-before.ts'
import { lionWarpGLSL } from '../src/personal/contact/lion-warp.ts'
import { createPortfolioModelLoader } from '../src/personal/portfolio-model-loader.ts'
import { portfolioAssetUrl } from '../src/personal/portfolio-assets.ts'
import { disposeModel } from '../src/model-resources.ts'
import { LiveDitherEffect } from '../src/personal/live-dither.ts'
import { lionWarpFixtures, referenceNormal, referenceRelease, referenceWarp, type Vector } from './contact-lion-warp-fixtures.ts'

const result = document.getElementById('result')!
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
const median = (values: number[]) => {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b), mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function verifyKernel(gl: WebGL2RenderingContext, positions: THREE.BufferAttribute, normals: THREE.BufferAttribute) {
  const fixtures = lionWarpFixtures.map(f => ({ label: f.label, position: f.position, normal: f.normal, field: f.field }))
  // Include decoded, transformed scan vertices, rather than only hand-picked cases.
  for (let i = 0; i < positions.count; i += 503) for (const field of [.06, .3, .6, .88, 1]) fixtures.push({
    label: `scan-${i}-${field}`, position: [positions.getX(i), positions.getY(i), positions.getZ(i)],
    normal: [normals.getX(i), normals.getY(i), normals.getZ(i)], field,
  })
  const input = new Float32Array(fixtures.length * 7)
  fixtures.forEach((f, i) => input.set([...f.position, ...f.normal, f.field], i * 7))
  const output = new Float32Array(input.length)
  const shader = (type: number, code: string) => {
    const compiled = gl.createShader(type)!
    gl.shaderSource(compiled, code); gl.compileShader(compiled)
    if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(compiled) ?? 'GPU probe shader failed')
    return compiled
  }
  const vertex = shader(gl.VERTEX_SHADER, `#version 300 es
    precision highp float;
    layout(location=0) in vec3 p; layout(location=1) in vec3 n; layout(location=2) in float field;
    out vec3 warped; out vec3 facing; out float released;
    ${lionWarpGLSL}
    void main() { lionDeform(p, n, field, warped, facing, released); gl_Position=vec4(0,0,0,1); }
  `)
  const fragment = shader(gl.FRAGMENT_SHADER, '#version 300 es\nprecision highp float; out vec4 color; void main(){ color=vec4(0); }')
  const program = gl.createProgram()!
  gl.attachShader(program, vertex); gl.attachShader(program, fragment)
  gl.transformFeedbackVaryings(program, ['warped', 'facing', 'released'], gl.INTERLEAVED_ATTRIBS)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'GPU probe link failed')
  const vao = gl.createVertexArray()!, inputs = gl.createBuffer()!, outputs = gl.createBuffer()!, feedback = gl.createTransformFeedback()!
  try {
    gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, inputs); gl.bufferData(gl.ARRAY_BUFFER, input, gl.STATIC_DRAW)
    for (const [location, count, offset] of [[0, 3, 0], [1, 3, 12], [2, 1, 24]]) {
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, count, gl.FLOAT, false, 28, offset)
    }
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, feedback)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, outputs)
    gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, output.byteLength, gl.STREAM_READ)
    gl.useProgram(program); gl.enable(gl.RASTERIZER_DISCARD)
    gl.beginTransformFeedback(gl.POINTS); gl.drawArrays(gl.POINTS, 0, fixtures.length); gl.endTransformFeedback()
    gl.disable(gl.RASTERIZER_DISCARD)
    gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, output)
    let positionError = 0, releaseError = 0, normalError = 0, legacyNormalAngle = 0
    const failures: string[] = []
    for (let i = 0; i < fixtures.length; i++) {
      // The oracle sees exactly the float inputs submitted to the real shader.
      const p = Array.from(input.slice(i * 7, i * 7 + 3)) as Vector
      const n = Array.from(input.slice(i * 7 + 3, i * 7 + 6)) as Vector
      const field = input[i * 7 + 6]
      const warped = referenceWarp(p, field), released = referenceRelease(p, field)
      const facing = referenceNormal(p, n, field), legacy = referenceNormal(p, n, field, .001, false)
      const actual = output.slice(i * 7, i * 7 + 7)
      const pe = Math.hypot(...warped.map((v, j) => v - actual[j]))
      const re = Math.abs(released - actual[6])
      const ne = Math.hypot(...facing.map((v, j) => v - actual[j + 3]))
      const length = Math.hypot(...actual.slice(3, 6))
      const dot = legacy.reduce((sum, v, j) => sum + v * actual[j + 3] / length, 0)
      positionError = Math.max(positionError, pe); releaseError = Math.max(releaseError, re); normalError = Math.max(normalError, ne)
      legacyNormalAngle = Math.max(legacyNormalAngle, Math.acos(Math.max(-1, Math.min(1, dot))) * 180 / Math.PI)
      if (![pe, re, ne].every(Number.isFinite) || pe > 2e-6 || re > 5e-6 || ne > 3e-5) failures.push(fixtures[i].label)
    }
    const error = gl.getError()
    return { cases: fixtures.length, positionError, releaseError, normalError, legacyNormalAngle, failures, error, passed: failures.length === 0 && error === 0 }
  } finally {
    gl.disable(gl.RASTERIZER_DISCARD); gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null); gl.bindVertexArray(null); gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
    gl.deleteTransformFeedback(feedback); gl.deleteVertexArray(vao); gl.deleteBuffer(inputs); gl.deleteBuffer(outputs)
    gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment)
  }
}

async function run() {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true })
  renderer.info.autoReset = false
  document.body.append(renderer.domElement)
  const gl = renderer.getContext() as WebGL2RenderingContext
  const timer = gl.getExtension('EXT_disjoint_timer_query_webgl2')
  renderer.setClearColor(0, 0); renderer.setPixelRatio(1)
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .45
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .01, 100)
  const room = new RoomEnvironment(), pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(room, .04)
  room.dispose(); pmrem.dispose(); scene.environment = environment.texture; scene.environmentIntensity = .65
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 5, 4)
  scene.add(key, new THREE.AmbientLight(0xffffff, .15))
  const loader = createPortfolioModelLoader()
  let source: THREE.Object3D | undefined
  const studies: ReturnType<typeof createLionStudy>[] = []
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  const composer = new EffectComposer(renderer, { multisampling: 0 })
  const dither = new LiveDitherEffect({ gridSize: 1, binary: true, live: false })
  dither.setPalette(new THREE.Color('#f5f2ea'), new THREE.Color('#24221e'))
  composer.addPass(new RenderPass(scene, camera)); composer.addPass(new EffectPass(camera, dither))
  try {
    source = (await loader.load(portfolioAssetUrl('headrest'))).scene
    const before = createBeforeStudy(source), after = createLionStudy(source)
    studies.push(before, after)
    const mesh = after.group.children.find(node => node instanceof THREE.Mesh) as THREE.Mesh
    const kernel = verifyKernel(gl, mesh.geometry.getAttribute('position') as THREE.BufferAttribute, mesh.geometry.getAttribute('normal') as THREE.BufferAttribute)
    renderer.resetState()
    const roots = studies.map(study => {
      const group = new THREE.Group(); group.add(study.group); group.rotation.set(.04, -.32, -.04)
      const bounds = new THREE.Box3().setFromObject(group), extent = bounds.getSize(new THREE.Vector3())
      group.position.sub(bounds.getCenter(new THREE.Vector3()))
      const root = new THREE.Group(); root.add(group); root.scale.setScalar(2 / Math.max(extent.x, extent.y, extent.z))
      scene.add(root)
      study.group.traverse(node => {
        if (node instanceof THREE.Mesh || node instanceof THREE.Points) {
          geometries.add(node.geometry); materials.add(node.material as THREE.Material)
        }
      })
      return root
    })
    function select(index: number, field: number, narrow: boolean) {
      roots.forEach((root, i) => root.visible = i === index)
      studies[index].setField(field); studies[index].advance(0, true); studies[index].setDetail(narrow)
    }
    function size(width: number, height: number) {
      renderer.setSize(width, height, false); composer.setSize(width, height); dither.setView(width, height)
      camera.aspect = width / height; camera.position.set(0, .12, (camera.aspect < 1 ? 4.1 : 3.5) * .86)
      camera.lookAt(0, 0, 0); camera.updateProjectionMatrix()
    }
    function readPixels() {
      const pixels = new Uint8Array(renderer.domElement.width * renderer.domElement.height * 4)
      composer.render(0); gl.readPixels(0, 0, renderer.domElement.width, renderer.domElement.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      return pixels
    }
    async function timed(index: number, field: number, narrow: boolean) {
      select(index, field, narrow)
      const frames = 32, query = timer ? gl.createQuery()! : null
      if (timer && query) gl.beginQuery(timer.TIME_ELAPSED_EXT, query)
      const start = performance.now()
      for (let i = 0; i < frames; i++) { renderer.info.reset(); composer.render(1 / 30) }
      const cpu = (performance.now() - start) / frames
      if (timer && query) gl.endQuery(timer.TIME_ELAPSED_EXT)
      if (!timer || !query) return { cpu, gpu: null, disjoint: false }
      try {
        const deadline = performance.now() + 10000
        while (!gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
          if (performance.now() > deadline) throw new Error('GPU query timeout')
          await nextFrame()
        }
        const disjoint = Boolean(gl.getParameter(timer.GPU_DISJOINT_EXT))
        return { cpu, gpu: disjoint ? null : gl.getQueryParameter(query, gl.QUERY_RESULT) / 1e6 / frames, disjoint }
      } finally { gl.deleteQuery(query) }
    }
    const comparisons = []
    for (const [width, height, narrow] of [[1216, 502, false], [358, 420, true]] as const) {
      size(width, height)
      for (const field of [0, .6, 1]) {
        for (let index = 0; index < 2; index++) { select(index, field, narrow); for (let i = 0; i < 6; i++) composer.render(0) }
        await nextFrame()
        select(0, field, narrow); const previous = readPixels()
        select(1, field, narrow); const current = readPixels()
        let alphaDifferences = 0, rgbDifferences = 0, alphaDelta = 0
        for (let i = 0; i < previous.length; i += 4) {
          if (previous[i + 3] !== current[i + 3]) alphaDifferences++
          alphaDelta += Math.abs(previous[i + 3] - current[i + 3])
          if (previous[i] !== current[i] || previous[i + 1] !== current[i + 1] || previous[i + 2] !== current[i + 2]) rgbDifferences++
        }
        const samples = [[], []] as { cpu: number; gpu: number | null; disjoint: boolean }[][]
        for (let pair = 0; pair < 4; pair++) for (const index of pair % 2 ? [1, 0] : [0, 1]) samples[index].push(await timed(index, field, narrow))
        const summarize = (values: typeof samples[number]) => ({ cpuMedianMs: median(values.map(v => v.cpu)), gpuMedianMs: timer ? median(values.filter(v => !v.disjoint && v.gpu !== null).map(v => v.gpu!)) : null, validSamples: values.filter(v => !v.disjoint).length, samples: values })
        const baseline = summarize(samples[0]), optimized = summarize(samples[1])
        const error = gl.getError()
        comparisons.push({ width, height, field, particles: narrow ? 24000 : 42000,
          calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
          alphaDifferences, alphaDelta, rgbDifferences, pixelCount: width * height,
          baseline, optimized, gpuReduction: baseline.gpuMedianMs ? 1 - optimized.gpuMedianMs! / baseline.gpuMedianMs : null,
          error, passed: alphaDifferences / (width * height) < .002 && error === 0,
        })
        result.textContent = JSON.stringify({ status: 'measuring', kernel, comparisons })
      }
    }
    const report = { kernel, timerAvailable: Boolean(timer), queryFrames: 32, pairedSamples: 4, renderer: gl.getParameter(gl.RENDERER), vendor: gl.getParameter(gl.VENDOR), comparisons, passed: kernel.passed && comparisons.every(c => c.passed) }
    result.textContent = JSON.stringify(report); document.body.dataset.passed = String(report.passed)
  } finally {
    for (const geometry of geometries) geometry.dispose()
    for (const material of materials) material.dispose()
    if (source) disposeModel(source)
    loader.dispose(); composer.dispose(); environment.dispose(); renderer.dispose()
    document.body.dataset.resourcesDisposed = 'true'
  }
}
run().catch(error => { result.textContent = JSON.stringify({ error: String(error) }); document.body.dataset.passed = 'false' })
