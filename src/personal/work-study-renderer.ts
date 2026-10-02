import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clampStudy, settleWorkStudy, workStudyPose, workStudyRenderSize, workStudyScroll } from './work-study-motion'
import type { WorkStudyPose } from './work-study-motion'
import { boundedStudyInput, studyMoveBounds, studyTouchIntent, studyYaw } from './work-study-interaction'
import type { StudyMoveBounds } from './work-study-interaction'
import { STUDY_DOCK_MS, STUDY_EXPAND_MS, studyFlightAccent, studyFlightProgress, studyFlightRect, type StudyRect } from './work-study-flight'
import { workStudyCameraDistance, workStudyFraming } from './work-study-framing'

export type WorkStudyFlight = { canvas: HTMLCanvasElement; handle: WorkStudyHandle; playing: boolean }

export interface WorkStudyHandle {
  setPlaying(playing: boolean): void
  reset(slug: string): void
  setSpinning(slug: string, spinning: boolean): void
  beginTransition(slug: string, onExpanded: (flight: WorkStudyFlight) => void): boolean
  dock(root: HTMLElement, onComplete: () => void): boolean
  finishTransition(): void
  refresh(): void
  dispose(): void
}

const STUDIES: Record<string, { yaw: number; pitch: number; phase: number }> = {
  internshipdeadlines: { yaw: -.32, pitch: .12, phase: .3 },
  sapien: { yaw: -.32, pitch: -.05, phase: 1.8 },
  'investing-markets': { yaw: -.16, pitch: .09, phase: 3.1 },
  miscellaneous: { yaw: .3, pitch: .08, phase: 4.4 },
}

type Study = {
  element: HTMLElement
  slug: string
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  object: THREE.Group | null
  source: THREE.Object3D | null
  materials: { material: THREE.Material; opacity: number }[]
  definition: typeof STUDIES[string]
  pose: WorkStudyPose
  loading: boolean
  failed: boolean
  painted: boolean
  visible: boolean
  near: boolean
  top: number
  left: number
  width: number
  height: number
  radius: number
  scroll: number
  scrollTarget: number
  manualYaw: number
  manualPitch: number
  manualX: number
  manualY: number
  moveBounds: StudyMoveBounds
  orbit: number
  spinning: boolean
  frames: number
  fadeStart: number
  hover: number
  hoverTarget: number
  hoverStart: number
  parts: { node: THREE.Object3D; rotation: THREE.Euler; position: THREE.Vector3; axis: THREE.Vector3; phase: number }[]
  inputCleanups: (() => void)[]
}

const VERTEX = /* glsl */ `
  varying vec2 studyUv;
  void main() {
    studyUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAGMENT = /* glsl */ `
  uniform sampler2D studyColor;
  uniform vec3 studyInk;
  uniform vec4 studyRegions[4];
  uniform vec4 studyHover;
  uniform vec4 studyBursts;
  uniform float studyTime;
  uniform float studyOpening;
  varying vec2 studyUv;
  float bayer2(vec2 p) {
    return p.x * 2.0 + p.y * 3.0 - p.x * p.y * 4.0;
  }
  void main() {
    vec4 model = texture2D(studyColor, studyUv);
    float hover = 0.0;
    float burst = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 r = studyRegions[i];
      if (gl_FragCoord.x >= r.x && gl_FragCoord.y >= r.y && gl_FragCoord.x < r.x + r.z && gl_FragCoord.y < r.y + r.w) { hover = studyHover[i]; burst = studyBursts[i]; }
    }
    vec2 pixel = floor(gl_FragCoord.xy);
    vec2 cell = mod(pixel, 4.0);
    float fine = (4.0 * bayer2(mod(cell, 2.0)) + bayer2(floor(cell / 2.0)) + .5) / 16.0;
    vec2 coarse = mod(floor(pixel / 2.0), 4.0);
    float dots = (4.0 * bayer2(mod(coarse, 2.0)) + bayer2(floor(coarse / 2.0)) + .5) / 16.0;
    float grain = fract(sin(dot(floor(pixel / 2.0), vec2(127.1, 311.7)) + floor(studyTime * 10.0)) * 43758.5453);
    float sweep = .5 + .5 * sin(studyUv.y * 12.0 - studyTime * 1.8);
    float threshold = mix(fine, mix(dots, grain, .55), clamp(hover * (.7 + .3 * sweep) + studyOpening * .65, 0.0, 1.0));
    float gray = pow(clamp(dot(model.rgb, vec3(.2126, .7152, .0722)), 0.0, 1.0), 1.0 / 2.2);
    float scatter = max(burst, studyOpening * .7);
    float coverage = model.a * (1.0 - step(threshold, gray)) * step(scatter * .45, grain);
    gl_FragColor = vec4(studyInk, coverage);
    #include <colorspace_fragment>
  }
`

/** One context, one target and one scheduler for every model in the collection. */
export function mountWorkStudies(canvas: HTMLCanvasElement, root: HTMLElement): WorkStudyHandle {
  let disposed = false
  let contextLost = false
  let playing = true
  let raf = 0
  let urgent = true
  let boundsDirty = true
  let lastPaint = 0
  let lastTick = 0
  let motionSeconds = 0
  let frames = 0
  let averageMs = 0
  let lastStats = -Infinity
  let opening: { study: Study; start: number; phase: 'expand' | 'hold' | 'dock'; from: StudyRect; onExpanded: (flight: WorkStudyFlight) => void; onComplete?: () => void } | null = null
  const regions = Array.from({ length: 4 }, () => new THREE.Vector4())
  const hoverSignals = new THREE.Vector4()
  const burstSignals = new THREE.Vector4()
  let paintedSurface = false
  let cssWidth = Math.max(1, window.innerWidth)
  let cssHeight = Math.max(1, window.innerHeight)
  let size = workStudyRenderSize(cssWidth, cssHeight, window.devicePixelRatio || 1)
  let renderer: THREE.WebGLRenderer | null = null
  let target: THREE.WebGLRenderTarget | null = null
  let dither: THREE.ShaderMaterial | null = null
  let quad: THREE.Mesh | null = null
  let nearObserver: IntersectionObserver | null = null
  let resizeObserver: ResizeObserver | null = null
  const cleanups: (() => void)[] = []
  const studies: Study[] = []
  const controller = new AbortController()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const loader = new GLTFLoader()
  const postScene = new THREE.Scene()
  const postCamera = new THREE.Camera()
  const ink = new THREE.Color()

  canvas.dataset.state = 'loading'
  canvas.dataset.frames = '0'
  canvas.dataset.activeStudies = '0'
  canvas.dataset.loadedStudies = '0'
  canvas.dataset.liveMotion = 'false'
  canvas.dataset.effectPasses = '1'
  canvas.dataset.rendererInstance = crypto.randomUUID()

  function releaseObject(object: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return
      geometries.add(node.geometry)
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        materials.add(material)
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
      }
    })
    for (const geometry of geometries) geometry.dispose()
    for (const material of materials) material.dispose()
    for (const texture of textures) {
      texture.dispose()
      if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close()
    }
  }

  function cancelFrame() {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  function requestRender(immediate = true) {
    urgent ||= immediate
    if (!disposed && !contextLost && !document.hidden && !raf) raf = requestAnimationFrame(render)
  }

  function stats(live = false, force = false) {
    const now = performance.now()
    if (!force && now - lastStats < 750) return
    lastStats = now
    let loaded = 0
    let active = 0
    for (const study of studies) {
      if (study.object && !study.failed) loaded++
      if (study.visible && study.object && !study.failed) active++
      study.element.dataset.renderFrames = String(study.frames)
      study.element.dataset.hover = study.hover.toFixed(3)
      study.element.dataset.idleYaw = study.pose.idleYaw.toFixed(4)
      study.element.dataset.scrollProgress = ((study.scroll + 1) / 2).toFixed(4)
      inputStats(study)
    }
    canvas.dataset.frames = String(frames)
    canvas.dataset.loadedStudies = String(loaded)
    canvas.dataset.activeStudies = String(active)
    canvas.dataset.renderPixels = String(size.width * size.height)
    canvas.dataset.drawCalls = String(renderer?.info.render.calls ?? 0)
    canvas.dataset.renderAverageMs = averageMs.toFixed(3)
    canvas.dataset.liveMotion = String(live)
    if (!contextLost) canvas.dataset.state = studies.some(study => study.painted) ? 'ready' : studies.length && studies.every(study => study.failed) ? 'error' : 'loading'
  }

  function fit(study: Study, time = performance.now()) {
    if (study.width <= 0 || study.height <= 0) return
    study.camera.aspect = study.width / study.height
    const vertical = THREE.MathUtils.degToRad(study.camera.fov) / 2
    const dockProgress = opening?.study === study
      ? opening.phase === 'dock' ? studyFlightProgress(time - opening.start, STUDY_DOCK_MS) : 0
      : 1
    const framing = workStudyFraming(study.element.dataset.workFraming === 'detail', dockProgress)
    const distance = workStudyCameraDistance(study.radius, study.camera.aspect, vertical, framing)
    study.camera.position.set(0, 0, distance)
    study.camera.near = Math.max(.01, distance - study.radius * 2)
    study.camera.far = distance + study.radius * 3
    study.camera.updateProjectionMatrix()
    study.moveBounds = studyMoveBounds(study.radius + .16, distance, vertical, study.camera.aspect)
    study.manualX = boundedStudyInput(study.manualX, study.moveBounds.x)
    study.manualY = boundedStudyInput(study.manualY, study.moveBounds.y)
  }

  function measure(time = performance.now()) {
    boundsDirty = false
    for (const study of studies) {
      const targetRect = study.element.getBoundingClientRect()
      let rect: StudyRect = targetRect
      if (opening?.study === study) {
        const full = { left: 0, top: 0, width: cssWidth, height: cssHeight }
        rect = opening.phase === 'expand'
          ? studyFlightRect(opening.from, full, studyFlightProgress(time - opening.start, STUDY_EXPAND_MS))
          : opening.phase === 'dock'
            ? studyFlightRect(full, targetRect, studyFlightProgress(time - opening.start, STUDY_DOCK_MS))
            : full
        canvas.dataset.flightRect = JSON.stringify(rect)
      }
      study.top = rect.top
      study.left = rect.left
      study.width = rect.width
      study.height = rect.height
      study.visible = (!opening || opening.study === study) && rect.width > 1 && rect.height > 1 && rect.top + rect.height > 0 && rect.top < cssHeight && rect.left + rect.width > 0 && rect.left < cssWidth
      study.near = rect.width > 1 && rect.height > 1 && rect.top + rect.height > -700 && rect.top < cssHeight + 700 && rect.left + rect.width > -300 && rect.left < cssWidth + 300
      if (!opening) study.scrollTarget = reducedMotion.matches ? 0 : workStudyScroll(rect.top, rect.height, cssHeight)
      fit(study, time)
      if (study.near) void load(study)
    }
  }

  async function load(study: Study) {
    if (disposed || study.loading || study.object || study.failed) return
    study.loading = true
    try {
      const base = `${import.meta.env.BASE_URL}work-studies/`
      const response = await fetch(`${base}${study.slug}.glb?v=4-refined`, { signal: controller.signal })
      if (!response.ok) throw new Error(`Study request returned ${response.status}`)
      const gltf = await loader.parseAsync(await response.arrayBuffer(), base)
      if (disposed || !studies.includes(study)) { releaseObject(gltf.scene); return }
      const bounds = new THREE.Box3().setFromObject(gltf.scene)
      const center = bounds.getCenter(new THREE.Vector3())
      // Box corners overestimate open sculptures and make them look tiny.
      // Measure the actual vertices once; this sphere remains valid at every rotation.
      gltf.scene.updateMatrixWorld(true)
      const point = new THREE.Vector3()
      let radius = 0
      gltf.scene.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return
        const positions = node.geometry.getAttribute('position')
        for (let i = 0; i < positions.count; i++) {
          point.fromBufferAttribute(positions, i).applyMatrix4(node.matrixWorld).sub(center)
          radius = Math.max(radius, point.length())
        }
      })
      if (!Number.isFinite(radius) || radius <= 0) { releaseObject(gltf.scene); throw new Error('Study has no usable bounds') }
      gltf.scene.position.sub(center)
      const materials = new Set<THREE.Material>()
      gltf.scene.traverse(node => {
        if (node instanceof THREE.Mesh) for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material)
      })
      gltf.scene.traverse(node => {
        if (node.name.startsWith('hover-')) {
          const declaredAxis = node.userData.articulationAxis
          const axis = Array.isArray(declaredAxis) && declaredAxis.length === 3 && declaredAxis.every(Number.isFinite)
            ? new THREE.Vector3(...declaredAxis as [number, number, number]) : new THREE.Vector3(0, 1, 0)
          if (axis.lengthSq() < .001) axis.set(0, 1, 0)
          study.parts.push({ node, rotation: node.rotation.clone(), position: node.position.clone(), axis: axis.normalize(), phase: study.parts.length * 1.4 })
        }
      })
      for (const material of materials) {
        study.materials.push({ material, opacity: material.opacity })
        // Write straight color and coverage into the shared target, without a
        // second blend or dither pass. Depth remains solid during the reveal.
        material.transparent = true
        material.forceSinglePass = true
        material.blending = THREE.NoBlending
        material.opacity = 0
      }
      study.source = gltf.scene
      study.object = new THREE.Group()
      study.object.add(gltf.scene)
      study.radius = radius
      study.scene.add(study.object)
      fit(study)
      requestRender()
    } catch (error) {
      if (disposed) return
      study.failed = true
      study.element.dataset.state = 'error'
      console.warn(`Could not load ${study.slug} study`, error)
      stats(false, true)
      requestRender()
    } finally {
      study.loading = false
    }
  }

  function render(time: number) {
    raf = 0
    if (disposed || contextLost || document.hidden || !renderer || !target || !dither) return
    if (boundsDirty || opening) measure(time)
    let hasModels = false
    for (const study of studies) if (study.visible && study.object && !study.failed) { hasModels = true; break }
    if (!hasModels && !paintedSurface && !opening) { stats(false, true); return }
    if (!urgent && time - lastPaint < 1000 / 30 - 1) { requestRender(false); return }
    urgent = false
    const elapsed = lastTick ? clampStudy((time - lastTick) / 1000, 0, .1) : 1 / 30
    lastTick = time
    lastPaint = time
    const live = hasModels && playing && !reducedMotion.matches
    if (live) motionSeconds += elapsed
    let settling = false
    let fading = false
    const started = performance.now()
    renderer.info.reset()
    renderer.setRenderTarget(target)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear(true, true, false)
    renderer.setScissorTest(true)
    regions.forEach(region => region.set(0, 0, 0, 0))
    hoverSignals.set(0, 0, 0, 0)
    burstSignals.set(0, 0, 0, 0)
    const openingProgress = opening ? clampStudy((time - opening.start) / (opening.phase === 'dock' ? STUDY_DOCK_MS : STUDY_EXPAND_MS), 0, 1) : 0
    dither.uniforms.studyTime.value = motionSeconds
    dither.uniforms.studyOpening.value = opening?.phase === 'expand' ? studyFlightAccent(openingProgress) * 1.12 : 0
    for (const study of studies) {
      if (!study.visible || !study.object || study.failed) continue
      if (study.fadeStart < 0) study.fadeStart = time
      const reveal = reducedMotion.matches ? 1 : clampStudy((time - study.fadeStart) / 300, 0, 1)
      const coverage = Math.max(.02, reveal * reveal * (3 - 2 * reveal))
      if (reveal < 1) fading = true
      for (const { material, opacity } of study.materials) material.opacity = opacity * coverage
      study.hover = reducedMotion.matches ? study.hoverTarget : settleWorkStudy(study.hover, study.hoverTarget, elapsed)
      if (study.hover !== study.hoverTarget) settling = true
      const hoverAge = clampStudy((time - study.hoverStart) / 1100, 0, 1)
      const burst = live ? Math.sin(hoverAge * Math.PI) * study.hover : 0
      if (live && hoverAge < 1) settling = true
      for (const part of study.parts) {
        part.node.position.copy(part.position)
        part.node.position.x += Math.sin(part.phase + .6) * burst * .07
        part.node.position.y += Math.cos(part.phase + .6) * burst * .07
        part.node.position.z += Math.sin(part.phase * .6) * burst * .04
        part.node.rotation.copy(part.rotation)
        const articulationPhase = study.slug === 'sapien' ? study.definition.phase : part.phase
        part.node.rotateOnAxis(part.axis, study.hover * .18 * Math.sin(motionSeconds * .65 + articulationPhase))
      }
      study.scroll = reducedMotion.matches ? 0 : settleWorkStudy(study.scroll, study.scrollTarget, elapsed)
      if (study.scroll !== study.scrollTarget) settling = true
      if (live && study.spinning) study.orbit = (study.orbit + elapsed * .13) % (Math.PI * 2)
      workStudyPose(motionSeconds, study.definition.phase, study.scroll, !reducedMotion.matches, study.pose)
      study.object.rotation.set(study.definition.pitch + study.pose.pitch + study.manualPitch, study.definition.yaw + study.pose.yaw + study.manualYaw + study.orbit, study.pose.roll)
      study.object.position.set(study.manualX * study.moveBounds.worldWidth, study.pose.y - study.manualY * study.moveBounds.worldHeight, 0)
      const x = Math.round(study.left * size.scaleX)
      const y = Math.round((cssHeight - study.top - study.height) * size.scaleY)
      const width = Math.max(1, Math.round(study.width * size.scaleX))
      const height = Math.max(1, Math.round(study.height * size.scaleY))
      const index = studies.indexOf(study)
      if (index < 4) { regions[index].set(x, y, width, height); hoverSignals.setComponent(index, study.hover); burstSignals.setComponent(index, burst) }
      const clipX = Math.max(0, x)
      const clipY = Math.max(0, y)
      const clipWidth = Math.max(0, Math.min(size.width, x + width) - clipX)
      const clipHeight = Math.max(0, Math.min(size.height, y + height) - clipY)
      renderer.setViewport(x, y, width, height)
      renderer.setScissor(clipX, clipY, clipWidth, clipHeight)
      renderer.clearDepth()
      renderer.render(study.scene, study.camera)
      study.frames++
    }
    renderer.setRenderTarget(null)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear(true, true, false)
    renderer.render(postScene, postCamera)
    paintedSurface = hasModels
    frames++
    const duration = performance.now() - started
    averageMs = frames === 1 ? duration : averageMs * .94 + duration * .06
    let firstPaint = false
    for (const study of studies) {
      if (!study.visible || !study.object || study.failed || study.painted) continue
      study.painted = true
      study.element.dataset.state = 'ready'
      firstPaint = true
    }
    stats(live, firstPaint || !hasModels || (!live && !settling && !fading))
    if (opening && openingProgress >= 1 && opening.phase !== 'hold') {
      if (opening.phase === 'expand') {
        opening.phase = 'hold'
        opening.onExpanded({ canvas, handle, playing })
      } else {
        const complete = opening.onComplete
        opening = null
        boundsDirty = true
        delete canvas.dataset.flight
        complete?.()
      }
    }
    if (live || settling || fading || opening) requestRender(false)
  }

  function resize() {
    if (disposed || !renderer || !target) return
    cssWidth = Math.max(1, window.innerWidth)
    cssHeight = Math.max(1, window.innerHeight)
    size = workStudyRenderSize(cssWidth, cssHeight, window.devicePixelRatio || 1)
    renderer.setSize(size.width, size.height, false)
    target.setSize(size.width, size.height)
    boundsDirty = true
    requestRender()
  }

  function refresh() {
    if (disposed) return
    const value = getComputedStyle(root).getPropertyValue('--ink').trim() || '#191a17'
    ink.set(value)
    boundsDirty = true
    requestRender()
  }

  function listen(target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions, disposers = cleanups) {
    target.addEventListener(type, handler, options)
    disposers.push(() => target.removeEventListener(type, handler, options))
  }

  function interactive(study: Study) {
    const bind = (target: EventTarget, type: string, handler: EventListener, options?: AddEventListenerOptions) => listen(target, type, handler, options, study.inputCleanups)
    const element = study.element
    const entry = element.closest('.work-study-entry') || element
    let pointerInside = false
    let focusInside = false
    function highlight() {
      const next = pointerInside || focusInside ? 1 : 0
      if (next && !study.hoverTarget) study.hoverStart = performance.now()
      study.hoverTarget = next
      element.dataset.hovered = String(study.hoverTarget === 1)
      requestRender()
    }
    bind(entry, 'pointerenter', () => { pointerInside = true; highlight() })
    bind(entry, 'pointerleave', () => { pointerInside = false; highlight() })
    bind(entry, 'focusin', () => { focusInside = true; highlight() })
    bind(entry, 'focusout', raw => {
      focusInside = (raw as FocusEvent).relatedTarget instanceof Node && entry.contains((raw as FocusEvent).relatedTarget as Node)
      highlight()
    })
    const previousTouchAction = element.style.touchAction
    const previousTabIndex = element.getAttribute('tabindex')
    element.style.touchAction = 'pan-y'
    if (previousTabIndex === null) element.tabIndex = 0
    study.inputCleanups.push(() => {
      element.style.touchAction = previousTouchAction
      if (previousTabIndex === null) element.removeAttribute('tabindex')
    })
    let drag: { id: number; x: number; y: number; yaw: number; pitch: number; offsetX: number; offsetY: number; move: boolean; started: boolean; touch: boolean } | null = null
    function end() {
      if (drag && element.hasPointerCapture(drag.id)) element.releasePointerCapture(drag.id)
      drag = null
      element.dataset.dragging = 'false'
    }
    study.inputCleanups.push(end)
    bind(element, 'pointerdown', raw => {
      const event = raw as PointerEvent
      const control = event.target instanceof Element ? event.target.closest('a,button,input,textarea,select') : null
      if (!event.isPrimary || event.button !== 0 || (control && control !== element)) return
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: study.manualYaw, pitch: study.manualPitch, offsetX: study.manualX, offsetY: study.manualY, move: element.dataset.workGesture === 'move', started: false, touch: event.pointerType === 'touch' }
    })
    bind(element, 'pointermove', raw => {
      const event = raw as PointerEvent
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (!drag.started) {
        if (drag.touch) {
          const intent = studyTouchIntent(dx, dy)
          if (intent === 'scroll') { end(); return }
          if (intent !== 'drag') return
        } else if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return
        drag.started = true
        element.dataset.dragging = 'true'
        element.setPointerCapture(event.pointerId)
        element.focus({ preventScroll: true })
        study.spinning = false
        element.dataset.spinning = 'false'
      }
      event.preventDefault()
      if (drag.move) {
        study.manualX = boundedStudyInput(drag.offsetX + dx / Math.max(1, study.width), study.moveBounds.x)
        study.manualY = boundedStudyInput(drag.offsetY + dy / Math.max(1, study.height), study.moveBounds.y)
      } else {
        study.manualYaw = studyYaw(drag.yaw + dx * .007)
        study.manualPitch = boundedStudyInput(drag.pitch + dy * .005, .55)
      }
      inputStats(study)
      requestRender()
    }, { passive: false })
    bind(element, 'pointerup', end)
    bind(element, 'pointercancel', end)
    bind(element, 'lostpointercapture', () => { drag = null; element.dataset.dragging = 'false' })
    bind(element, 'dblclick', raw => {
      const event = raw as MouseEvent
      const control = event.target instanceof Element ? event.target.closest('a,button,input,textarea,select') : null
      if (control && control !== element) return
      event.preventDefault()
      resetStudy(study)
    })
    bind(element, 'keydown', raw => {
      const event = raw as KeyboardEvent
      if (event.target !== element) return
      if (event.key === 'Home') { event.preventDefault(); resetStudy(study); return }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
      event.preventDefault()
      const dx = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
      const dy = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0
      if (element.dataset.workGesture === 'move') {
        study.manualX = boundedStudyInput(study.manualX + dx * .025, study.moveBounds.x)
        study.manualY = boundedStudyInput(study.manualY + dy * .025, study.moveBounds.y)
      } else {
        study.manualYaw = studyYaw(study.manualYaw + dx * .12)
        study.manualPitch = boundedStudyInput(study.manualPitch + dy * .08, .55)
      }
      study.spinning = false
      element.dataset.spinning = 'false'
      inputStats(study)
      requestRender()
    })
  }

  function inputStats(study: Study) {
    study.element.dataset.manualYaw = study.manualYaw.toFixed(4)
    study.element.dataset.manualPitch = study.manualPitch.toFixed(4)
    study.element.dataset.manualX = study.manualX.toFixed(4)
    study.element.dataset.manualY = study.manualY.toFixed(4)
  }

  function resetStudy(study: Study) {
    study.manualYaw = 0
    study.manualPitch = 0
    study.manualX = 0
    study.manualY = 0
    study.orbit = 0
    study.spinning = false
    study.element.dataset.spinning = 'false'
    inputStats(study)
    requestRender()
  }

  function dispose() {
    if (disposed) return
    disposed = true
    opening = null
    controller.abort()
    cancelFrame()
    nearObserver?.disconnect()
    resizeObserver?.disconnect()
    for (const cleanup of cleanups) cleanup()
    cleanups.length = 0
    for (const study of studies) {
      for (const cleanup of study.inputCleanups) cleanup()
      study.inputCleanups.length = 0
    }
    for (const study of studies) if (study.source) releaseObject(study.source)
    quad?.geometry.dispose()
    dither?.dispose()
    target?.dispose()
    renderer?.dispose()
    canvas.dataset.state = 'disposed'
    canvas.dataset.liveMotion = 'false'
    canvas.style.visibility = 'hidden'
  }

  const handle: WorkStudyHandle = {
    setPlaying(next) {
      if (disposed || playing === next) return
      playing = next
      lastTick = 0
      cancelFrame()
      requestRender()
    },
    reset(slug) { if (!disposed) for (const study of studies) if (study.slug === slug) resetStudy(study) },
    setSpinning(slug, next) {
      if (disposed) return
      for (const study of studies) if (study.slug === slug) {
        study.spinning = next && !reducedMotion.matches
        study.element.dataset.spinning = String(study.spinning)
      }
      requestRender()
    },
    beginTransition(slug, onExpanded) {
      const study = studies.find(study => study.slug === slug)
      if (disposed || contextLost || reducedMotion.matches || opening || !study?.painted) return false
      opening = { study, start: performance.now(), phase: 'expand', from: study.element.getBoundingClientRect(), onExpanded }
      canvas.dataset.flight = 'expand'
      requestRender()
      return true
    },
    dock(nextRoot, onComplete) {
      if (disposed || contextLost || !opening) return false
      const study = opening.study
      const slot = nextRoot.querySelector<HTMLElement>(`[data-work-study="${study.slug}"]`)
      if (!slot) return false
      nearObserver?.disconnect()
      resizeObserver?.disconnect()
      for (const other of studies) {
        for (const cleanup of other.inputCleanups) cleanup()
        other.inputCleanups.length = 0
        if (other !== study && other.source) {
          releaseObject(other.source)
          other.scene.clear()
          other.source = null
          other.object = null
          other.materials.length = 0
          other.parts.length = 0
        }
      }
      studies.splice(0, studies.length, study)
      root = nextRoot
      study.element = slot
      study.hoverTarget = 0
      slot.dataset.state = 'ready'
      slot.dataset.spinning = String(study.spinning)
      inputStats(study)
      interactive(study)
      resizeObserver?.observe(root)
      resizeObserver?.observe(slot)
      opening.phase = 'dock'
      opening.start = performance.now() - (reducedMotion.matches ? STUDY_DOCK_MS : 0)
      opening.onComplete = onComplete
      canvas.dataset.flight = 'dock'
      refresh()
      return true
    },
    finishTransition() {
      if (!opening) return
      const complete = opening.onComplete
      opening = null
      delete canvas.dataset.flight
      boundsDirty = true
      complete?.()
      requestRender()
    },
    refresh,
    dispose,
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(1)
    renderer.setClearColor(0x000000, 0)
    renderer.autoClear = false
    renderer.info.autoReset = false
    // A filtered collection reuses its canvas. Clear the previous drawing
    // before revealing this renderer, including while its GLBs are loading.
    renderer.setSize(size.width, size.height, false)
    renderer.setRenderTarget(null)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear(true, true, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = .95
    target = new THREE.WebGLRenderTarget(size.width, size.height, { depthBuffer: true, stencilBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter })
    dither = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms: { studyColor: { value: target.texture }, studyInk: { value: ink }, studyRegions: { value: regions }, studyHover: { value: hoverSignals }, studyBursts: { value: burstSignals }, studyTime: { value: 0 }, studyOpening: { value: 0 } }, depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending })
    quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dither)
    quad.frustumCulled = false
    postScene.add(quad)
    for (const element of root.querySelectorAll<HTMLElement>('[data-work-study]')) {
      const slug = element.dataset.workStudy || ''
      const definition = STUDIES[slug]
      element.dataset.state = 'loading'
      element.dataset.spinning = 'false'
      if (!definition) { element.dataset.state = 'error'; continue }
      const scene = new THREE.Scene()
      const key = new THREE.DirectionalLight(0xffffff, 3.3)
      key.position.set(-3, 5, 5)
      const fill = new THREE.DirectionalLight(0xffffff, .8)
      fill.position.set(4, 0, 3)
      const rim = new THREE.DirectionalLight(0xffffff, 2.2)
      rim.position.set(2, 3, -4)
      scene.add(key, fill, rim, new THREE.HemisphereLight(0xffffff, 0x252525, .35))
      const study: Study = {
        element, slug, scene, camera: new THREE.PerspectiveCamera(34, 1, .01, 20), object: null, source: null, materials: [], definition,
        pose: { yaw: 0, pitch: 0, roll: 0, y: 0, idleYaw: 0 }, loading: false, failed: false, painted: false, visible: false, near: false,
        top: 0, left: 0, width: 0, height: 0, radius: 1.2, scroll: 0, scrollTarget: 0, manualYaw: 0, manualPitch: 0, manualX: 0, manualY: 0, moveBounds: { x: 0, y: 0, worldWidth: 1, worldHeight: 1 }, orbit: 0, spinning: false, frames: 0, fadeStart: -1, hover: 0, hoverTarget: 0, hoverStart: -1e9, parts: [], inputCleanups: [],
      }
      studies.push(study)
      if (element.dataset.workInteractive === 'true') interactive(study)
    }
    listen(window, 'scroll', () => { boundsDirty = true; requestRender() }, { passive: true, capture: true })
    listen(window, 'resize', resize)
    listen(document, 'visibilitychange', () => {
      cancelFrame()
      lastTick = 0
      if (document.hidden) { stats(false, true); return }
      boundsDirty = true
      requestRender()
    })
    listen(reducedMotion, 'change', () => {
      cancelFrame()
      lastTick = 0
      if (reducedMotion.matches) {
        for (const study of studies) { study.spinning = false; study.element.dataset.spinning = 'false' }
        if (opening?.phase === 'expand') {
          opening.phase = 'hold'
          opening.onExpanded({ canvas, handle, playing })
        } else handle.finishTransition()
      }
      boundsDirty = true
      requestRender()
    })
    listen(canvas, 'webglcontextlost', event => {
      event.preventDefault()
      contextLost = true
      cancelFrame()
      canvas.dataset.state = 'error'
      canvas.dataset.liveMotion = 'false'
      canvas.style.visibility = 'hidden'
      for (const study of studies) study.element.dataset.state = 'error'
      if (opening) {
        if (opening.phase === 'expand') {
          opening.phase = 'hold'
          opening.onExpanded({ canvas, handle, playing })
        } else handle.finishTransition()
      }
    })
    listen(canvas, 'webglcontextrestored', () => {
      if (disposed) return
      contextLost = false
      lastTick = 0
      canvas.style.visibility = ''
      for (const study of studies) if (!study.failed) { study.painted = false; study.fadeStart = -1; study.element.dataset.state = 'loading' }
      resize()
      refresh()
    })
    resizeObserver = new ResizeObserver(() => { boundsDirty = true; requestRender() })
    resizeObserver.observe(root)
    for (const study of studies) resizeObserver.observe(study.element)
    nearObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const study = studies.find(study => study.element === entry.target)
        if (study) void load(study)
      }
    }, { rootMargin: '700px 300px' })
    for (const study of studies) nearObserver.observe(study.element)
    canvas.style.visibility = ''
    resize()
    refresh()
    measure()
    stats(false, true)
  } catch (error) {
    console.warn('Could not initialize work studies', error)
    dispose()
    canvas.dataset.state = 'error'
    for (const element of root.querySelectorAll<HTMLElement>('[data-work-study]')) element.dataset.state = 'error'
  }
  return handle
}
