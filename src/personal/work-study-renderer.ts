import * as THREE from 'three'
import { PORTFOLIO_DITHER_GLSL } from './dither-kernel'
import { PortfolioRuntime } from './portfolio-runtime'
import { createPortfolioModelLoader } from './portfolio-model-loader'
import { portfolioAssetUrl } from './portfolio-assets'
import { clampStudy, settleWorkStudy, workStudyPose, workStudyRenderSize, workStudyScroll } from './work-study-motion'
import type { WorkStudyPose } from './work-study-motion'
import { createStudyOrbit, fitStudyOrbit, resetStudyOrbit, rotateStudyKey, rotateStudyPointer, studyTouchIntent } from './work-study-interaction'
import { STUDY_DOCK_MS, STUDY_DEPART_MS, studyFlightProgress, studyFlightRect, studyFlightInkProgress, studyFlightInkStrength, type StudyRect } from './work-study-flight'
import { workStudyCameraDistance, workStudyFraming } from './work-study-framing'
import { createWorkStudyInk, STUDY_INK_GLSL } from './work-study-ink'
import { createStudyFrameReview } from './work-study-frame-review'

export type WorkStudyFlight = { canvas: HTMLCanvasElement; handle: WorkStudyHandle; playing: boolean }

export interface WorkStudyHandle {
  setPlaying(playing: boolean): void
  reset(slug: string): void
  setSpinning(slug: string, spinning: boolean): void
  beginTransition(slug: string, onDeparted: (flight: WorkStudyFlight) => void): boolean
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
  controls: ReturnType<typeof createStudyOrbit>
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
  uniform sampler2D studySurface;
  uniform vec3 studyInk;
  uniform vec4 studyRegions[4];
  uniform vec4 studyHover;
  uniform vec4 studyBursts;
  uniform float studyTime;
  uniform vec2 studyFlight;
  uniform vec3 studyResolution;
  uniform vec2 studyCssResolution;
  varying vec2 studyUv;
  ${PORTFOLIO_DITHER_GLSL}
  ${STUDY_INK_GLSL}
  float inkTone(vec4 model) {
    return portfolioDisplayLuminance(model.rgb);
  }
  void main() {
    vec4 model = texture2D(studyColor, studyUv);
    // Preserve coarse silhouette samples during flight; empty resting paper
    // needs neither ordered thresholds nor animated grain.
    if (model.a <= .0001 && studyFlight.y <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }
    float hover = 0.0;
    float burst = 0.0;
    vec4 region = vec4(0.0);
    for (int i = 0; i < 4; i++) {
      vec4 r = studyRegions[i];
      if (gl_FragCoord.x >= r.x && gl_FragCoord.y >= r.y && gl_FragCoord.x < r.x + r.z && gl_FragCoord.y < r.y + r.w) { hover = studyHover[i]; burst = studyBursts[i]; region = r; }
    }
    // The ordered grid is anchored to CSS pixels, independent of backing scale.
    vec2 pixel = floor(studyUv * studyCssResolution);
    float fine = portfolioLiveThreshold(portfolioBayer8(pixel), pixel, studyTime, .025);
    float grain = portfolioHash(floor(pixel / 2.0));
    float sweep = .5 + .5 * sin(studyUv.y * 12.0 - studyTime * 1.8);
    // Wrap the ordered pattern during interaction to retain its tonal range.
    // Blending threshold distributions makes bright bevels disappear on hover.
    float hoverPattern = fract(fine + hover * (.24 + .08 * sweep) * (grain - .5));
    float gray = inkTone(model);
    float coverage = model.a * (1.0 - step(hoverPattern, gray)) * step(burst * .45, grain);
    if (studyFlight.y > 0.0 && region.z > 0.0) {
      // A traveling band exposes coarse ink just before the surface releases it.
      // Final pixels and landed grains exchange ownership without an opacity dip.
      vec2 cell = floor((gl_FragCoord.xy - region.xy) / region.zw * inkGrid);
      vec2 uv = (cell + .5) / inkGrid;
      float mark = texture2D(studySurface, uv).a;
      float lifted = inkLifted(inkJourney(uv, studyFlight.x));
      float localGrain = inkEase((studyFlight.x - inkRelease(uv) + .045) / .045);
      float resting = coverage;
      coverage = mix(coverage, mark, localGrain) * (1.0 - lifted);
      coverage = mix(coverage, resting, inkHandoff(gl_FragCoord.xy, studyFlight.x));
    }
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
  const runtime = new PortfolioRuntime()
  let flightSuspendedAt: number | null = null
  let frames = 0
  let averageMs = 0
  let lastStats = -Infinity
  let opening: { study: Study; start: number; phase: 'depart' | 'hold' | 'dock'; from: StudyRect; distance: number; aspect: number; onDeparted: (flight: WorkStudyFlight) => void; onComplete?: () => void } | null = null
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
  let flightInk: ReturnType<typeof createWorkStudyInk> | null = null
  let nearObserver: IntersectionObserver | null = null
  let resizeObserver: ResizeObserver | null = null
  const cleanups: (() => void)[] = []
  const studies: Study[] = []
  const controller = new AbortController()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const loader = createPortfolioModelLoader()
  const postScene = new THREE.Scene()
  const postCamera = new THREE.Camera()
  const ink = new THREE.Color()

  canvas.dataset.state = 'loading'
  canvas.dataset.frames = '0'
  canvas.dataset.activeStudies = '0'
  canvas.dataset.loadedStudies = '0'
  canvas.dataset.liveMotion = 'false'
  canvas.dataset.effectPasses = '1'
  canvas.dataset.renderPasses = '2'
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

  function resumeFlight() {
    if (flightSuspendedAt === null || document.hidden || contextLost) return
    if (opening && !frameReview?.paused()) opening.start += performance.now() - flightSuspendedAt
    flightSuspendedAt = null
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
    if (!contextLost) {
      const state = studies.some(study => study.painted) ? 'ready' : studies.length && studies.every(study => study.failed) ? 'error' : 'loading'
      if (canvas.dataset.state !== state) canvas.dataset.state = state
    }
    if (!import.meta.env.DEV) return
    if (force) canvas.dataset.liveMotion = String(live)
    if (now - lastStats < 750) return
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
    canvas.dataset.triangles = String(renderer?.info.render.triangles ?? 0)
    canvas.dataset.renderAverageMs = averageMs.toFixed(3)
    canvas.dataset.cpuSubmissionMs = averageMs.toFixed(3)
    canvas.dataset.frameAverageMs = runtime.averageFrameMs.toFixed(3)
    canvas.dataset.fps = runtime.fps.toFixed(2)
    canvas.dataset.resolutionScale = String(runtime.scale)
    canvas.dataset.liveMotion = String(live)
    if (opening) {
      canvas.dataset.flightInk = String(dither?.uniforms.studyFlight.value.y ?? 0)
      canvas.dataset.flightProgress = String(dither?.uniforms.studyFlight.value.x ?? 0)
      canvas.dataset.flightParticles = String(flightInk?.points.visible ?? false)
      canvas.dataset.flightRect = JSON.stringify({ left: opening.study.left, top: opening.study.top, width: opening.study.width, height: opening.study.height })
    }
  }

  const frameReview = (import.meta.env.DEV || import.meta.env.MODE === 'flight-review') ? createStudyFrameReview(() => requestRender()) : null

  function fit(study: Study, time = frameReview?.now(performance.now()) ?? performance.now()) {
    if (study.width <= 0 || study.height <= 0) return
    const flight = opening?.study === study ? opening : null
    const inkProgress = flight ? studyFlightInkProgress(flight.phase, time - flight.start) : 1
    const resolve = flight ? studyFlightProgress(inkProgress - .20, .45) : 1
    study.camera.aspect = study.width / study.height
    const vertical = THREE.MathUtils.degToRad(study.camera.fov) / 2
    const dockProgress = opening?.study === study
      ? opening.phase === 'dock' ? studyFlightProgress(time - opening.start, STUDY_DOCK_MS) : 0
      : 1
    const framing = workStudyFraming(study.element.dataset.workFraming === 'detail', dockProgress)
    const distance = workStudyCameraDistance(study.radius, study.camera.aspect, vertical, framing)
    const fittedDistance = flight ? flight.distance + (distance - flight.distance) * resolve : distance
    fitStudyOrbit(study.controls, fittedDistance)
    study.camera.near = Math.max(.01, fittedDistance - study.radius * 2)
    study.camera.far = fittedDistance + study.radius * 3
    study.camera.updateProjectionMatrix()
  }

  function measure(time = performance.now()) {
    boundsDirty = false
    for (const study of studies) {
      const targetRect = study.element.getBoundingClientRect()
      let rect: StudyRect = targetRect
      if (opening?.study === study) {
        // Keep the actual source composition until the destination is mounted.
        // Read its bounds here, after the router has restored scroll position.
        rect = opening.phase === 'dock'
          ? studyFlightRect(opening.from, targetRect, studyFlightProgress(time - opening.start, STUDY_DOCK_MS))
          : opening.from
      }
      if (opening?.study === study) {
        const progress = studyFlightInkProgress(opening.phase, time - opening.start)
        const resolve = studyFlightProgress(progress - .20, .45)
        const width = Math.min(rect.width, rect.height * opening.aspect)
        const height = width / opening.aspect
        rect = {
          left: rect.left + (rect.width - width) * .5 * (1 - resolve),
          top: rect.top + (rect.height - height) * .5 * (1 - resolve),
          width: width + (rect.width - width) * resolve,
          height: height + (rect.height - height) * resolve,
        }
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
      const gltf = await loader.load(portfolioAssetUrl(`work-${study.slug}`), controller.signal)
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
    time = frameReview?.now(time) ?? time
    raf = 0
    if (disposed || contextLost || document.hidden || !renderer || !target || !dither) return
    if (boundsDirty || opening) measure(time)
    let hasModels = false
    for (const study of studies) if (study.visible && study.object && !study.failed) { hasModels = true; break }
    if (!hasModels && !paintedSurface && !opening) { runtime.suspend(); stats(false, true); return }
    if (!runtime.canPaint(time, urgent || !!frameReview?.paused())) { requestRender(false); return }
    urgent = false
    const live = hasModels && playing && !reducedMotion.matches && !opening
    const blocked = !!opening || studies.some(study => study.element.dataset.dragging === 'true')
    if (runtime.advance(time, live, blocked)) resize()
    const elapsed = runtime.delta
    const motionSeconds = runtime.seconds
    let settling = false
    let fading = false
    const started = import.meta.env.DEV ? performance.now() : 0
    renderer.info.reset()
    renderer.setRenderTarget(target)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear(true, true, false)
    renderer.setScissorTest(true)
    regions.forEach(region => region.set(0, 0, 0, 0))
    hoverSignals.set(0, 0, 0, 0)
    burstSignals.set(0, 0, 0, 0)
    const openingProgress = opening ? clampStudy((time - opening.start) / (opening.phase === 'dock' ? STUDY_DOCK_MS : STUDY_DEPART_MS), 0, 1) : 0
    const inkProgress = opening && !reducedMotion.matches ? studyFlightInkProgress(opening.phase, time - opening.start) : 0
    const inkStrength = studyFlightInkStrength(inkProgress)
    dither.uniforms.studyFlight.value.set(inkProgress, inkStrength)
    dither.uniforms.studyTime.value = motionSeconds
    for (const study of studies) {
      if ((!study.visible && opening?.study !== study) || !study.object || study.failed) continue
      if (study.fadeStart < 0) study.fadeStart = time
      const reveal = reducedMotion.matches ? 1 : clampStudy((time - study.fadeStart) / 300, 0, 1)
      const coverage = Math.max(.02, reveal * reveal * (3 - 2 * reveal))
      if (reveal < 1) fading = true
      for (const { material, opacity } of study.materials) {
        const nextOpacity = opacity * coverage
        if (material.opacity !== nextOpacity) material.opacity = nextOpacity
      }
      if (!opening) study.hover = reducedMotion.matches ? study.hoverTarget : settleWorkStudy(study.hover, study.hoverTarget, elapsed)
      if (study.hover !== study.hoverTarget) settling = true
      const hoverAge = clampStudy((motionSeconds - study.hoverStart) / 1.1, 0, 1)
      const burst = reducedMotion.matches ? 0 : Math.sin(hoverAge * Math.PI) * study.hover
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
      if (!opening) study.scroll = reducedMotion.matches ? 0 : settleWorkStudy(study.scroll, study.scrollTarget, elapsed)
      if (study.scroll !== study.scrollTarget) settling = true
      study.controls.autoRotate = live && study.spinning
      study.controls.update(elapsed)
      workStudyPose(motionSeconds, study.definition.phase, study.scroll, !reducedMotion.matches, study.pose)
      study.object.rotation.set(study.definition.pitch + study.pose.pitch, study.definition.yaw + study.pose.yaw, study.pose.roll)
      study.object.position.set(0, study.pose.y, 0)
      const x = Math.round(study.left * size.scaleX)
      const y = Math.round((cssHeight - study.top - study.height) * size.scaleY)
      const width = Math.max(1, Math.round(study.width * size.scaleX))
      const height = Math.max(1, Math.round(study.height * size.scaleY))
      const index = studies.indexOf(study)
      if (index < 4) { regions[index].set(x, y, width, height); hoverSignals.setComponent(index, study.hover); burstSignals.setComponent(index, burst) }
      if (!study.visible) continue
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
    // Capture actual surface positions once; moving marks keep their identity
    // while the live GLB and camera continue into the destination framing.
    if (opening?.study.object) {
      const study = opening.study
      const region = regions[studies.indexOf(study)]
      const firstMaterial = study.materials.find(({ opacity }) => opacity > 0)
      const reveal = firstMaterial ? firstMaterial.material.opacity / firstMaterial.opacity : 1
      flightInk?.capture(study.scene, study.camera, study.object!.position, study.radius, region.z, region.w, reveal)
    }
    flightInk?.update(inkProgress, opening ? regions[studies.indexOf(opening.study)] : undefined, opening?.study.camera, size.width, size.height, size.scaleX)
    renderer.setRenderTarget(null)
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, size.width, size.height)
    renderer.clear(true, true, false)
    renderer.render(postScene, postCamera)
    paintedSurface = hasModels
    frames++
    if (import.meta.env.DEV) {
      const duration = performance.now() - started
      averageMs = frames === 1 ? duration : averageMs * .94 + duration * .06
    }
    let firstPaint = false
    for (const study of studies) {
      if (!study.visible || !study.object || study.failed || study.painted) continue
      study.painted = true
      study.element.dataset.state = 'ready'
      firstPaint = true
    }
    stats(live, firstPaint || !hasModels || (!live && !settling && !fading))
    frameReview?.painted(canvas, opening?.phase ?? 'rest', opening ? time - opening.start : 0, inkProgress)
    if (opening && openingProgress >= 1 && opening.phase !== 'hold') {
      if (opening.phase === 'depart') {
        opening.phase = 'hold'
        opening.onDeparted({ canvas, handle, playing })
      } else {
        const complete = opening.onComplete
        opening = null
        flightInk?.clear()
        boundsDirty = true
        delete canvas.dataset.flight
        delete canvas.dataset.flightInk
        delete canvas.dataset.flightProgress
        delete canvas.dataset.flightBody
        delete canvas.dataset.flightParticles
        delete canvas.dataset.flightRect
        complete?.()
        requestRender()
      }
    }
    if (frameReview?.paused()) return
    if (live || settling || fading || opening) requestRender(false)
    else runtime.suspend()
  }

  function resize() {
    if (disposed || !renderer || !target) return
    cssWidth = Math.max(1, window.innerWidth)
    cssHeight = Math.max(1, window.innerHeight)
    size = workStudyRenderSize(cssWidth, cssHeight, window.devicePixelRatio || 1, runtime.scale)
    renderer.setSize(size.width, size.height, false)
    target.setSize(size.width, size.height)
    dither?.uniforms.studyResolution.value.set(size.width, size.height, size.scaleX)
    dither?.uniforms.studyCssResolution.value.set(cssWidth, cssHeight)
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
      if (next && !study.hoverTarget) study.hoverStart = runtime.seconds
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
    let drag: { id: number; x: number; y: number; started: boolean; touch: boolean } | null = null
    function end() {
      if (drag && element.hasPointerCapture(drag.id)) element.releasePointerCapture(drag.id)
      drag = null
      element.dataset.dragging = 'false'
    }
    study.inputCleanups.push(end)
    bind(element, 'pointerdown', raw => {
      const event = raw as PointerEvent
      const control = event.target instanceof Element ? event.target.closest('a,button,input,textarea,select') : null
      if (!event.isPrimary || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || (control && control !== element)) return
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, started: false, touch: event.pointerType === 'touch' }
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
      rotateStudyPointer(study.controls, dx, dy, element.clientHeight)
      drag.x = event.clientX
      drag.y = event.clientY
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
      if (event.target !== element || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'Home') { event.preventDefault(); resetStudy(study); return }
      if (!rotateStudyKey(study.controls, event.key)) return
      event.preventDefault()
      study.spinning = false
      element.dataset.spinning = 'false'
      requestRender()
    })
  }

  function inputStats(study: Study) {
    study.element.dataset.manualYaw = study.controls.getAzimuthalAngle().toFixed(4)
    study.element.dataset.manualPitch = (study.controls.getPolarAngle() - Math.atan2(1, .04)).toFixed(4)
  }

  function resetStudy(study: Study) {
    study.spinning = false
    study.element.dataset.spinning = 'false'
    resetStudyOrbit(study.controls)
    fit(study)
    requestRender()
  }

  function dispose() {
    if (disposed) return
    disposed = true
    frameReview?.dispose()
    opening = null
    stats(false, true)
    runtime.suspend()
    controller.abort()
    loader.dispose()
    cancelFrame()
    nearObserver?.disconnect()
    resizeObserver?.disconnect()
    for (const cleanup of cleanups) cleanup()
    cleanups.length = 0
    for (const study of studies) {
      for (const cleanup of study.inputCleanups) cleanup()
      study.inputCleanups.length = 0
      // These controls never connect to DOM or allocate GPU resources. Three's
      // disconnect assumes a non-null DOM element; there is nothing to detach.
      if (study.controls.domElement) study.controls.dispose()
    }
    for (const study of studies) if (study.source) releaseObject(study.source)
    flightInk?.dispose()
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
      runtime.suspend()
      stats(false, true)
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
    beginTransition(slug, onDeparted) {
      const study = studies.find(study => study.slug === slug)
      if (disposed || contextLost || reducedMotion.matches || opening || !study?.painted || !flightInk?.supported) return false
      opening = { study, start: frameReview?.begin(performance.now()) ?? performance.now(), phase: 'depart', from: study.element.getBoundingClientRect(), distance: study.camera.position.distanceTo(study.controls.target), aspect: study.camera.aspect, onDeparted }
      canvas.dataset.flight = 'depart'
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
      interactive(study)
      resizeObserver?.observe(root)
      resizeObserver?.observe(slot)
      opening.phase = 'dock'
      opening.start = (frameReview?.now(performance.now()) ?? performance.now()) - (reducedMotion.matches ? STUDY_DOCK_MS : 0)
      flightSuspendedAt = document.hidden || contextLost ? performance.now() : null
      opening.onComplete = onComplete
      canvas.dataset.flight = 'dock'
      refresh()
      return true
    },
    finishTransition() {
      if (!opening) return
      const complete = opening.onComplete
      opening = null
      flightInk?.clear()
      if (dither) { dither.uniforms.studyFlight.value.set(0, 0) }
      delete canvas.dataset.flight
      delete canvas.dataset.flightInk
      delete canvas.dataset.flightProgress
      delete canvas.dataset.flightBody
      delete canvas.dataset.flightParticles
      delete canvas.dataset.flightRect
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
    dither = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms: { studyColor: { value: target.texture }, studySurface: { value: null }, studyInk: { value: ink }, studyRegions: { value: regions }, studyHover: { value: hoverSignals }, studyBursts: { value: burstSignals }, studyTime: { value: 0 }, studyFlight: { value: new THREE.Vector2() }, studyResolution: { value: new THREE.Vector3(size.width, size.height, size.scaleX) }, studyCssResolution: { value: new THREE.Vector2(cssWidth, cssHeight) } }, depthTest: false, depthWrite: false, toneMapped: false, blending: THREE.NoBlending })
    quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), dither)
    quad.frustumCulled = false
    postScene.add(quad)
    flightInk = createWorkStudyInk(ink, renderer)
    dither.uniforms.studySurface.value = flightInk.surfaceTexture
    postScene.add(flightInk.points)
    // Compile the transient field while assets load, before the first activation.
    void renderer.compileAsync(postScene, postCamera).catch(() => {})
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
      const camera = new THREE.PerspectiveCamera(34, 1, .01, 20)
      const controls = createStudyOrbit(camera)
      const study: Study = {
        element, slug, scene, camera, controls, object: null, source: null, materials: [], definition,
        pose: { yaw: 0, pitch: 0, roll: 0, y: 0, idleYaw: 0 }, loading: false, failed: false, painted: false, visible: false, near: false,
        top: 0, left: 0, width: 0, height: 0, radius: 1.2, scroll: 0, scrollTarget: 0, spinning: false, frames: 0, fadeStart: -1, hover: 0, hoverTarget: 0, hoverStart: -1e9, parts: [], inputCleanups: [],
      }
      studies.push(study)
      if (element.dataset.workInteractive === 'true') interactive(study)
    }
    listen(window, 'scroll', () => { boundsDirty = true; requestRender() }, { passive: true, capture: true })
    listen(window, 'resize', resize)
    listen(document, 'visibilitychange', () => {
      cancelFrame()
      runtime.suspend()
      if (document.hidden) {
        flightSuspendedAt ??= performance.now()
        stats(false, true)
        return
      }
      resumeFlight()
      boundsDirty = true
      requestRender()
    })
    listen(reducedMotion, 'change', () => {
      cancelFrame()
      runtime.suspend()
      if (reducedMotion.matches) {
        for (const study of studies) { study.spinning = false; study.element.dataset.spinning = 'false' }
        if (opening?.phase === 'depart') {
          opening.phase = 'hold'
          opening.onDeparted({ canvas, handle, playing })
        } else handle.finishTransition()
      }
      boundsDirty = true
      requestRender()
    })
    listen(canvas, 'webglcontextlost', event => {
      event.preventDefault()
      contextLost = true
      runtime.suspend()
      flightSuspendedAt ??= performance.now()
      stats(false, true)
      cancelFrame()
      canvas.dataset.state = 'error'
      canvas.dataset.liveMotion = 'false'
      canvas.style.visibility = 'hidden'
      for (const study of studies) study.element.dataset.state = 'error'
      if (opening) {
        if (opening.phase === 'depart') {
          opening.phase = 'hold'
          opening.onDeparted({ canvas, handle, playing })
        } else handle.finishTransition()
      }
    })
    listen(canvas, 'webglcontextrestored', () => {
      if (disposed) return
      contextLost = false
      runtime.suspend()
      resumeFlight()
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
