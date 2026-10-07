import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { createPortfolioModelLoader } from '../portfolio-model-loader'
import { PORTFOLIO_DITHER_GLSL } from '../dither-kernel'
import { readPrintPalette, printPixelRatio } from '../print-palette'
import { readPortfolioRenderPolicy, touchOrbitIntent } from '../mobile-render-policy'
import { disposeModel, frameModel } from '../../model-resources'
import { createResumeTransition } from './resume-scene-transition'
import { createResumeSurfaceSampler, orderResumeSurface, RESUME_DITHER_SIZE, resumeDitherTile, resumeMorphPhase } from './resume-surface'
import { resumeSculptureAssets } from './resume-sculpture-assets'
import { resumeKnightAsset } from './resume-knight-asset'
import type { ResumeChapterId } from './resume-chapters'

type SceneKey = ResumeChapterId | 'knight'
type Sculpture = {
  group: THREE.Group
  mixer: THREE.AnimationMixer | null
  clips: THREE.AnimationClip[]
  cut: { value: number }
  fitPoints: Float32Array
  seconds: number
  sample: ReturnType<typeof createResumeSurfaceSampler>
  arrivals: Map<number, ReturnType<typeof orderResumeSurface>>
  arrivalFit: { aspect: number; distance: number } | null
}

const printedFragment = /* glsl */ `
uniform sampler2D image;
uniform sampler2D printThresholds;
uniform vec3 ink;
uniform float dark;
varying vec2 vUv;
${PORTFOLIO_DITHER_GLSL}
void main() {
  vec4 surface = texture2D(image, vUv);
  vec3 color = portfolioStraightColor(surface);
  // Every sculpture uses the opening helmet's screen and chrome response.
  // Partial coverage preserves lit metal between marks instead of reducing
  // entire cast surfaces to the binary grey screen used by the Work studies.
  vec2 cell = (mod(floor(gl_FragCoord.xy), vec2(${RESUME_DITHER_SIZE}.0)) + .5) / ${RESUME_DITHER_SIZE}.0;
  float threshold = texture2D(printThresholds, cell).r;
  float luminance = dot(color, vec3(1.0));
  float chrome = 1.0 - step(threshold, luminance) * clamp(luminance, 0.0, 1.0);
  chrome = mix(chrome, 1.0 - chrome, dark);
  gl_FragColor = vec4(ink, surface.a * chrome);
  #include <colorspace_fragment>
}
`

const particleVertex = /* glsl */ `
attribute vec3 destination;
attribute vec3 targetNormal;
attribute float seed;
uniform float travel;
uniform float amount;
uniform float pointRatio;
varying float shade;
varying float opacity;
void main() {
  float local = clamp((travel - seed * .08) / .92, 0.0, 1.0);
  float t = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
  float arch = sin(t * 3.14159265);
  float angle = seed * 6.2831853 + t * .65;
  vec3 drift = vec3(cos(angle) * .035, sin(angle) * .04, .03 + seed * .04);
  vec3 point = mix(position, destination, t) + drift * arch;
  vec3 direction = normalize(mix(normal, targetNormal, t));
  shade = .14 + .36 * max(0.0, dot(direction, normalize(vec3(-.5, .8, 1.0))));
  opacity = amount;
  vec4 view = modelViewMatrix * vec4(point, 1.0);
  gl_Position = projectionMatrix * view;
  gl_PointSize = pointRatio * (.85 + seed * .55);
}
`

/** Animated GLBs and a surface-to-surface particle bridge share one 3D stage. */
export function mountResumeScene(canvas: HTMLCanvasElement, initialDark: boolean, status: (value: 'loading' | 'ready' | 'error') => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: false })
  renderer.setClearColor(0, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .95
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .01, 100)
  const keyLight = new THREE.DirectionalLight(0xffffff, 3), fillLight = new THREE.DirectionalLight(0xffffff, .65)
  keyLight.position.set(-3, 5, 5); fillLight.position.set(5, 2, -3)
  scene.add(keyLight, fillLight, new THREE.AmbientLight(0xffffff, .2))
  function createEnvironment() {
    const room = new RoomEnvironment()
    let pmrem: THREE.PMREMGenerator | null = null
    try { pmrem = new THREE.PMREMGenerator(renderer); return pmrem.fromScene(room) }
    finally { room.dispose(); pmrem?.dispose() }
  }
  let environment: THREE.WebGLRenderTarget
  try { environment = createEnvironment() }
  catch (error) { renderer.dispose(); canvas.dataset.state = 'error'; throw error }
  scene.environment = environment.texture; scene.environmentIntensity = 1.05
  const target = new THREE.WebGLRenderTarget(1, 1)
  const printThresholds = new THREE.DataTexture(resumeDitherTile(), RESUME_DITHER_SIZE, RESUME_DITHER_SIZE, THREE.RedFormat)
  printThresholds.minFilter = THREE.NearestFilter; printThresholds.magFilter = THREE.NearestFilter
  printThresholds.generateMipmaps = false; printThresholds.needsUpdate = true
  const post = new THREE.Scene(), postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const material = new THREE.ShaderMaterial({
    blending: THREE.NoBlending, depthTest: false, depthWrite: false,
    uniforms: { image: { value: target.texture }, printThresholds: { value: printThresholds }, ink: { value: readPrintPalette(canvas, initialDark).ink }, dark: { value: Number(initialDark) } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: printedFragment,
  })
  const quad = new THREE.PlaneGeometry(2, 2)
  post.add(new THREE.Mesh(quad, material))
  const cloudMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { travel: { value: 0 }, amount: { value: 0 }, pointRatio: { value: 1 } },
    vertexShader: particleVertex,
    fragmentShader: 'varying float shade;varying float opacity;void main(){if(opacity<.01)discard;gl_FragColor=vec4(vec3(shade),opacity);}',
  })
  let cloudGeometry = new THREE.BufferGeometry()
  for (const name of ['position', 'destination']) cloudGeometry.setAttribute(name, new THREE.Float32BufferAttribute([0, 0, 0], 3))
  for (const name of ['normal', 'targetNormal']) cloudGeometry.setAttribute(name, new THREE.Float32BufferAttribute([0, 0, 1], 3))
  cloudGeometry.setAttribute('seed', new THREE.Float32BufferAttribute([.5], 1))
  const cloud = new THREE.Points(cloudGeometry, cloudMaterial)
  cloud.frustumCulled = false; cloud.visible = false; scene.add(cloud)
  const loader = createPortfolioModelLoader(), request = new AbortController()
  const sources = new Map<SceneKey, Promise<GLTF>>(), owned = new Set<THREE.Group>()
  const finishes = new Set<THREE.Material>(), sculptures = new Map<SceneKey, Sculpture>()
  const pending = new Map<SceneKey, Promise<Sculpture>>(), primed = new Map<SceneKey, Promise<void>>()
  const transition = createResumeTransition<SceneKey>('knight', false)
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let disposed = false, lost = false, visible = true, loaded = false, playing = true
  let frame = 0, last: number | null = null, nextPaint: number | null = null, generation = 0, renderFrames = 0, yaw = 0, pitch = 0, manual = false
  let cameraDistance = 6, fitDirty = true, current: SceneKey = 'knight'
  let morph: { from: SceneKey; to: SceneKey; distance: number; fromDistance: number; toDistance: number } | null = null
  let motionStats: { from: SceneKey; to: SceneKey; frames: number; duration: number; maxGap: number; maxDraw: number; done: boolean } | null = null
  let cadenceStats = { frames: 0, elapsed: 0, maxGap: 0, maxDraw: 0 }
  let pointer: { id: number; x: number; y: number; yaw: number; pitch: number; touch: boolean; intent: 'pending' | 'scroll' | 'orbit' } | null = null
  canvas.dataset.assets = 'animated-glb'; canvas.dataset.state = 'loading'; canvas.dataset.scene = 'resume'; canvas.dataset.transitionPhase = 'rest'
  status('loading')

  const assetUrl = (key: SceneKey) => `${import.meta.env.BASE_URL}${key === 'knight' ? resumeKnightAsset.path : resumeSculptureAssets[key].path}`
  function source(key: SceneKey) {
    let promise = sources.get(key)
    if (!promise) {
      promise = loader.load(assetUrl(key), request.signal).then(gltf => {
        if (disposed) { disposeModel(gltf.scene); throw new DOMException('Disposed', 'AbortError') }
        owned.add(gltf.scene); return gltf
      })
      sources.set(key, promise)
      void promise.catch(() => { if (sources.get(key) === promise) sources.delete(key) })
    }
    return promise
  }
  function dissolveFinish(original: THREE.Material, cut: { value: number }) {
    const finish = original.clone(); finishes.add(finish)
    finish.toneMapped = false
    finish.onBeforeCompile = shader => {
      shader.uniforms.resumeCut = cut
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 resumePosition;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nresumePosition = (modelMatrix * vec4(transformed, 1.0)).xyz;')
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float resumeCut;varying vec3 resumePosition;')
        .replace('#include <dithering_fragment>', `#include <dithering_fragment>
          if (resumeCut > 0.0) {
            vec3 cell = floor(resumePosition * 82.0);
            float noise = fract(sin(dot(cell, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
            float sweep = clamp((resumePosition.y + 1.5) / 3.0, 0.0, 1.0);
            if (resumeCut > noise * .55 + sweep * .45) discard;
          }`)
    }
    finish.customProgramCacheKey = () => 'resume-chrome-dissolve-v5'
    return finish
  }
  function model(key: SceneKey): Promise<Sculpture> {
    const cached = sculptures.get(key)
    if (cached) return Promise.resolve(cached)
    const loading = pending.get(key)
    if (loading) return loading
    const promise = source(key).then(async gltf => {
      if (disposed) throw new DOMException('Disposed', 'AbortError')
      const display = new THREE.Group()
      const animated = gltf.scene.clone(true)
      display.add(animated)
      const cut = { value: 0 }
      display.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return
        const original = Array.isArray(node.material) ? node.material : [node.material]
        const copies = original.map(finish => dissolveFinish(finish, cut))
        for (const finish of copies) if (finish instanceof THREE.MeshStandardMaterial) {
          if (key === 'knight') finish.roughness = .23
        }
        node.material = Array.isArray(node.material) ? copies : copies[0]
      })
      const group = frameModel(display, 2.7)
      group.name = key; group.visible = false; scene.add(group)
      const clips = gltf.animations
      if (!clips.length) throw new Error('Sculpture GLB has no animation')
      const mixer = clips.length ? new THREE.AnimationMixer(animated) : null
      for (const clip of clips) {
        const action = mixer!.clipAction(clip)
        // The engraved opening makes a slow, shallow inspection turn.
        if (key === 'knight') action.setEffectiveWeight(.38)
        action.play()
      }
      const duration = Math.max(0, ...clips.map(clip => clip.duration))
      const sample = createResumeSurfaceSampler(group)
      const fitPoints = new Float32Array(1800 * 13 * 3)
      const yieldPreparation = async () => {
        await new Promise<void>(resolve => setTimeout(resolve, 0))
        if (disposed) throw new DOMException('Disposed', 'AbortError')
      }
      await yieldPreparation()
      for (let step = 0; step <= 12; step++) {
        mixer?.setTime(duration * step / 12)
        group.rotation.set(0, 0, 0)
        fitPoints.set(sample(1800, 429).points, step * 1800 * 3)
        // Keep the visible knight responsive while a role's envelope is built.
        if (step % 2 === 1) await yieldPreparation()
      }
      mixer?.setTime(0); group.rotation.set(0, 0, 0)
      if (key !== 'knight') {
        // Center the complete physical action once. A developing print or an
        // opening page should use the canvas, without making the camera chase it.
        const center = new THREE.Box3().setFromArray(fitPoints).getCenter(new THREE.Vector3())
        group.children[0].position.addScaledVector(center, -1 / group.scale.x)
        for (let offset = 0; offset < fitPoints.length; offset += 3) {
          fitPoints[offset] -= center.x; fitPoints[offset + 1] -= center.y; fitPoints[offset + 2] -= center.z
        }
      }
      await yieldPreparation()
      // Assemble the canonical arrival while the asset is loading. The animated
      // departure still samples its live pose when the visible dissolve starts.
      const count = readPortfolioRenderPolicy().mobile ? 4000 : 8000
      const arrivals = new Map([[count, orderResumeSurface(sample(count, 719))]])
      const record: Sculpture = { group, mixer, clips, cut, fitPoints, seconds: 0, sample, arrivals, arrivalFit: null }
      sculptures.set(key, record); return record
    })
    pending.set(key, promise)
    void promise.finally(() => pending.delete(key)).catch(() => {})
    return promise
  }
  function cancel() { cancelAnimationFrame(frame); frame = 0; last = null; nextPaint = null; cadenceStats = { frames: 0, elapsed: 0, maxGap: 0, maxDraw: 0 } }
  function wake() {
    if (!frame && !disposed && !lost && visible && !document.hidden && loaded) frame = requestAnimationFrame(paint)
  }
  function show(keys: SceneKey[]) { for (const [key, record] of sculptures) record.group.visible = keys.includes(key) }
  function fit(record: Sculpture) {
    record.group.updateMatrix()
    const rotation = new THREE.Matrix4().makeRotationFromQuaternion(record.group.quaternion), point = new THREE.Vector3()
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    let distance = .1
    for (let offset = 0; offset < record.fitPoints.length; offset += 3) {
      point.fromArray(record.fitPoints, offset).applyMatrix4(rotation)
      distance = Math.max(distance, point.z + Math.max(Math.abs(point.y) / tangent, Math.abs(point.x) / (tangent * camera.aspect)) * 1.14)
    }
    return distance
  }
  function beginMorph(from: SceneKey, to: SceneKey) {
    cadenceStats = { frames: 0, elapsed: 0, maxGap: 0, maxDraw: 0 }
    if (import.meta.env.DEV) for (const field of ['visibleFps', 'visibleMaxGap', 'visibleMaxDraw', 'visibleModel']) delete canvas.dataset[field]
    const departing = sculptures.get(from)!, arriving = sculptures.get(to)!
    arriving.seconds = 0; arriving.mixer?.setTime(0); arriving.group.rotation.set(0, 0, 0)
    const count = readPortfolioRenderPolicy().mobile ? 4000 : 8000
    const a = orderResumeSurface(departing.sample(count, 107))
    let b = arriving.arrivals.get(count)
    if (!b) { b = orderResumeSurface(arriving.sample(count, 719)); arriving.arrivals.set(count, b) }
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) seeds[i] = (Math.imul(i + 1, 2654435761) >>> 0) / 4294967296
    const next = new THREE.BufferGeometry()
    next.setAttribute('position', new THREE.BufferAttribute(a.points, 3)); next.setAttribute('normal', new THREE.BufferAttribute(a.normals, 3))
    next.setAttribute('destination', new THREE.BufferAttribute(b.points, 3)); next.setAttribute('targetNormal', new THREE.BufferAttribute(b.normals, 3)); next.setAttribute('seed', new THREE.BufferAttribute(seeds, 1))
    cloud.geometry = next; cloudGeometry.dispose(); cloudGeometry = next
    const toDistance = arriving.arrivalFit?.aspect === camera.aspect ? arriving.arrivalFit.distance : fit(arriving)
    morph = { from, to, fromDistance: cameraDistance, toDistance, distance: Math.max(cameraDistance, toDistance) + .08 }
    canvas.dataset.particleCount = String(count)
    yaw = 0; pitch = 0; manual = false
  }
  function updateIdle(key: SceneKey, delta: number) {
    const record = sculptures.get(key)!
    if (playing && !motion.matches && !pointer) {
      record.seconds += delta / 1000
      record.mixer?.update(delta / 1000 * THREE.MathUtils.smoothstep(record.seconds, 0, key === 'knight' ? .9 : .32) * (key === 'knight' ? .42 : .72))
    }
    const t = record.seconds
    // Authored joints own the movement. The stage stays still until the user
    // rotates it, so a page turn or iris opening reads as a deliberate action.
    record.group.rotation.set(pitch, yaw, 0)
    record.cut.value = 0; show([key]); cloud.visible = false
    if (fitDirty) { cameraDistance = fit(record); fitDirty = false }
    if (import.meta.env.DEV) { canvas.dataset.clipTime = (record.mixer?.time ?? t).toFixed(3); canvas.dataset.animationClips = record.clips.map(clip => clip.name).join(',') }
  }
  function draw() {
    if (import.meta.env.DEV) canvas.dataset.cameraDistance = cameraDistance.toFixed(3)
    camera.position.set(0, 0, cameraDistance); camera.lookAt(0, 0, 0)
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, camera)
    renderer.setRenderTarget(null); renderer.render(post, postCamera)
  }
  function prime(key: SceneKey) {
    const cached = primed.get(key)
    if (cached) return cached
    const prepare = (async () => {
      const record = sculptures.get(key)!
      const before = [...sculptures.values()].map(item => [item, item.group.visible] as const)
      show([key]); record.cut.value = 0; cloud.visible = true
      try { await renderer.compileAsync(scene, camera); await renderer.compileAsync(post, postCamera) }
      finally { for (const [item, visibility] of before) item.group.visible = visibility; cloud.visible = false }
      if (disposed) throw new DOMException('Disposed', 'AbortError')
      const warmup = new THREE.WebGLRenderTarget(canvas.width, canvas.height)
      const savedDistance = cameraDistance
      try {
        show([key]); cameraDistance = fit(record)
        record.arrivalFit = { aspect: camera.aspect, distance: cameraDistance }
        camera.position.set(0, 0, cameraDistance); camera.lookAt(0, 0, 0)
        renderer.setRenderTarget(warmup); renderer.clear(); renderer.render(scene, camera)
      }
      finally { cameraDistance = savedDistance; renderer.setRenderTarget(null); warmup.dispose(); for (const [item, visibility] of before) item.group.visible = visibility }
    })()
    primed.set(key, prepare)
    void prepare.catch(() => { if (primed.get(key) === prepare) primed.delete(key) })
    return prepare
  }

  function paint(now: number) {
    frame = 0
    if (disposed || lost || !visible || document.hidden || !loaded) { last = null; return }
    const cadence = readPortfolioRenderPolicy().mobile ? 30 : 60
    if (nextPaint !== null && now + .8 < nextPaint) { frame = requestAnimationFrame(paint); return }
    nextPaint = nextPaint === null ? now + 1000 / cadence : Math.max(nextPaint + 1000 / cadence, now)
    const elapsed = last === null ? 0 : now - last, delta = Math.min(70, elapsed)
    last = now
    const started = performance.now()
    const state = transition.advance(playing ? delta : 0, motion.matches)
    current = state.current
    if (state.moving) {
      if (!morph || morph.from !== state.from || morph.to !== state.to) beginMorph(state.from, state.to)
      const stage = resumeMorphPhase(state.progress), from = sculptures.get(state.from)!, to = sculptures.get(state.to)!
      show([state.from, state.to]); from.cut.value = stage.outgoingCut; to.cut.value = stage.incomingCut
      cloud.visible = stage.particles > .01; cloudMaterial.uniforms.travel.value = stage.travel; cloudMaterial.uniforms.amount.value = stage.particles
      const distance = THREE.MathUtils.lerp(morph!.fromDistance, morph!.toDistance, THREE.MathUtils.smoothstep(state.progress, 0, 1))
      cameraDistance = THREE.MathUtils.lerp(distance, morph!.distance, stage.pullback)
      canvas.dataset.transitionPhase = state.progress < .42 ? 'dissolving' : state.progress < .65 ? 'transferring' : 'forming'
    } else {
      if (morph) { morph = null; fitDirty = true }
      updateIdle(state.current, delta)
      canvas.dataset.transitionPhase = 'rest'
    }
    draw()
    canvas.dataset.renderFrames = String(++renderFrames); canvas.dataset.progress = state.progress.toFixed(4)
    canvas.dataset.currentModel = state.current; canvas.dataset.modelAsset = assetUrl(state.to)
    if (import.meta.env.DEV) {
      const cost = performance.now() - started
      canvas.dataset.liveMotion = playing && !motion.matches && !pointer ? 'playing' : 'paused'
      canvas.dataset.drawMs = cost.toFixed(2)
      if (state.moving && (!motionStats || motionStats.done || motionStats.from !== state.from || motionStats.to !== state.to)) {
        motionStats = { from: state.from, to: state.to, frames: 0, duration: 0, maxGap: 0, maxDraw: 0, done: false }
      }
      if (motionStats && !motionStats.done) {
        motionStats.frames++; motionStats.duration += elapsed; motionStats.maxGap = Math.max(motionStats.maxGap, elapsed); motionStats.maxDraw = Math.max(motionStats.maxDraw, cost)
        canvas.dataset.motionFrames = String(motionStats.frames); canvas.dataset.motionDuration = motionStats.duration.toFixed(1)
        canvas.dataset.motionMaxGap = motionStats.maxGap.toFixed(1); canvas.dataset.motionMaxDraw = motionStats.maxDraw.toFixed(2); motionStats.done = !state.moving
      }
      if (!state.moving && playing && !motion.matches && elapsed > 0) {
        cadenceStats.frames++; cadenceStats.elapsed += elapsed; cadenceStats.maxGap = Math.max(cadenceStats.maxGap, elapsed); cadenceStats.maxDraw = Math.max(cadenceStats.maxDraw, cost)
        if (cadenceStats.frames >= 90) {
          canvas.dataset.visibleModel = state.current
          canvas.dataset.visibleCadence = String(cadence)
          canvas.dataset.visibleFps = (cadenceStats.frames / cadenceStats.elapsed * 1000).toFixed(1)
          canvas.dataset.visibleMaxGap = cadenceStats.maxGap.toFixed(1); canvas.dataset.visibleMaxDraw = cadenceStats.maxDraw.toFixed(2)
          cadenceStats = { frames: 0, elapsed: 0, maxGap: 0, maxDraw: 0 }
        }
      }
    }
    if (playing && !motion.matches) frame = requestAnimationFrame(paint)
    else { last = null; nextPaint = null }
  }
  function resize() {
    if (disposed || lost) return
    cadenceStats = { frames: 0, elapsed: 0, maxGap: 0, maxDraw: 0 }
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight), policy = readPortfolioRenderPolicy()
    // Match Home's display scale, keeping the print sharp without spending
    // four times the fragment work on a retina idle frame.
    const ratio = Math.min(1.25, printPixelRatio(width, height, devicePixelRatio, Math.min(policy.pixels, 1_200_000), Math.min(policy.maxRatio, 2)))
    renderer.setSize(Math.round(width * ratio), Math.round(height * ratio), false); target.setSize(canvas.width, canvas.height)
    cloudMaterial.uniforms.pointRatio.value = ratio
    camera.aspect = width / height; camera.updateProjectionMatrix(); fitDirty = true
    if (morph) { morph.fromDistance = fit(sculptures.get(morph.from)!); morph.toDistance = fit(sculptures.get(morph.to)!); morph.distance = Math.max(morph.fromDistance, morph.toDistance) + .08 }
    wake()
  }
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas)
  const viewport = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; visible ? wake() : cancel() }); viewport.observe(canvas)
  function visibility() { document.hidden ? cancel() : wake() }
  function changedMotion() { last = null; fitDirty = true; wake() }
  function contextLost(event: Event) { event.preventDefault(); lost = true; cancel(); canvas.dataset.state = 'context-lost' }
  function contextRestored() {
    try { lost = false; environment.dispose(); environment = createEnvironment(); scene.environment = environment.texture; primed.clear(); canvas.dataset.state = loaded ? 'ready' : 'loading'; status(loaded ? 'ready' : 'loading'); resize(); wake() }
    catch { lost = true; cancel(); canvas.dataset.state = 'error'; status('error') }
  }
  canvas.addEventListener('webglcontextlost', contextLost); canvas.addEventListener('webglcontextrestored', contextRestored)
  document.addEventListener('visibilitychange', visibility); motion.addEventListener('change', changedMotion)
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0 || morph) return
    if (!manual) { const view = sculptures.get(current)?.group.rotation; if (view) { yaw = view.y; pitch = view.x } manual = true }
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch, touch: event.pointerType !== 'mouse', intent: 'pending' }
    if (!pointer.touch) canvas.setPointerCapture(event.pointerId)
  }
  function pointerMove(event: PointerEvent) {
    if (!pointer || event.pointerId !== pointer.id) return
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y
    if (pointer.touch && pointer.intent === 'pending') pointer.intent = touchOrbitIntent(dx, dy)
    if (pointer.touch && pointer.intent !== 'orbit') return
    if (pointer.touch && !canvas.hasPointerCapture(event.pointerId)) canvas.setPointerCapture(event.pointerId)
    yaw = pointer.yaw + dx * .008; pitch = Math.max(-.45, Math.min(.45, pointer.pitch + dy * .005)); fitDirty = true; wake()
  }
  function pointerUp(event: PointerEvent) {
    if (pointer?.id !== event.pointerId) return
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    pointer = null; fitDirty = true; wake()
  }
  function keyDown(event: KeyboardEvent) {
    if (morph || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return
    event.preventDefault()
    if (!manual) { const view = sculptures.get(current)?.group.rotation; if (view) { yaw = view.y; pitch = view.x } manual = true }
    if (event.key === 'Home') { yaw = 0; pitch = 0; manual = false; const record = sculptures.get(current); if (record) { record.seconds = 0; record.mixer?.setTime(0) } }
    else if (event.key === 'ArrowLeft') yaw -= .12
    else if (event.key === 'ArrowRight') yaw += .12
    else pitch = Math.max(-.45, Math.min(.45, pitch + (event.key === 'ArrowUp' ? -.10 : .10)))
    fitDirty = true; wake()
  }
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove)
  canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerUp); canvas.addEventListener('keydown', keyDown)
  resize()
  const initialPaint = model('knight').then(async () => {
    await prime('knight')
    if (disposed) return false
    loaded = true; fitDirty = true
    if (!lost) { paint(performance.now()); canvas.dataset.state = 'ready'; status('ready') }
    transition.boot(true, motion.matches || !playing); wake(); return true
  }).catch(error => {
    transition.boot(false, motion.matches || !playing)
    if (!disposed && !loaded && error?.name !== 'AbortError') { canvas.dataset.state = 'error'; status('error') }
    return false
  })
  return {
    select(chapter: ResumeChapterId | null) {
      const key: SceneKey = chapter ?? 'knight', ticket = transition.request(key), selectedGeneration = ++generation
      canvas.dataset.requestedModel = key
      void model(key).then(async () => {
        await initialPaint
        if (disposed || selectedGeneration !== generation) return
        await prime(key)
        if (disposed || selectedGeneration !== generation || !transition.ready(ticket, motion.matches || !playing)) return
        fitDirty = true
        if (motion.matches || !playing) {
          yaw = 0; pitch = 0; manual = false
          const record = sculptures.get(key)!
          record.seconds = 0; record.mixer?.setTime(0)
        }
        if (!playing) transition.advance(0, true)
        loaded = true; last = null
        if (!lost) { canvas.dataset.state = 'ready'; status('ready') }
        wake()
      }).catch(error => { if (!disposed && selectedGeneration === generation && error?.name !== 'AbortError') { canvas.dataset.state = 'error'; status('error') } })
    },
    setDark(dark: boolean) { material.uniforms.ink.value.copy(readPrintPalette(canvas, dark).ink); material.uniforms.dark.value = Number(dark); wake() },
    setPlaying(next: boolean) { playing = next; last = null; nextPaint = null; wake() },
    dispose() {
      if (disposed) return
      disposed = true; cancel(); generation++; request.abort(); loader.dispose()
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored)
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerUp); canvas.removeEventListener('keydown', keyDown)
      document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', changedMotion)
      viewport.disconnect(); sizeObserver.disconnect()
      for (const record of sculptures.values()) { record.mixer?.stopAllAction(); if (record.mixer) record.mixer.uncacheRoot(record.mixer.getRoot()) }
      for (const asset of owned) disposeModel(asset)
      for (const finish of finishes) finish.dispose()
      sculptures.clear(); owned.clear(); sources.clear(); pending.clear(); primed.clear(); finishes.clear()
      target.dispose(); environment.dispose(); printThresholds.dispose(); material.dispose(); quad.dispose(); cloudGeometry.dispose(); cloudMaterial.dispose(); renderer.dispose()
      canvas.dataset.state = 'disposed'
    },
  }
}
