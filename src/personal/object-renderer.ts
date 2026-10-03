import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { WaterFlowEffect } from './water-flow'
import { LiveDitherEffect } from './live-dither'
import { printPixelRatio, readPrintPalette } from './print-palette'
import { createLionStudy } from './contact/lion-study'
import { PortfolioRuntime } from './portfolio-runtime.ts'
import { createPortfolioModelLoader } from './portfolio-model-loader.ts'
import { portfolioAssetUrl } from './portfolio-assets.ts'

export type ObjectKind = 'helmet' | 'crystal' | 'ribbon' | 'globe' | 'cross' | 'headrest'
export interface ObjectHandle {
  setDark(dark: boolean): void
  setSpinning(spinning: boolean): void
  reset(): void
  invalidate(): void
  setFlow(progress: number, drift?: number): void
  setField?(value: number): void
  setFieldPlaying?(value: boolean): void
  getField?(): number
  dispose(): void
}

/** A single renderer; helmet studies animate only while their output is visible. */
export function mountObject(canvas: HTMLCanvasElement, kind: ObjectKind, dark: boolean, onStatus: (status: 'ready' | 'error') => void, onRendered?: (time: number) => void, flowMode = false, cameraDistanceScale = 1): ObjectHandle {
  canvas.dataset.kind = kind
  canvas.dataset.state = 'loading'
  canvas.dataset.frames = '0'
  let disposed = false
  let teardown = () => {}
  const fallback: ObjectHandle = {
    setDark: () => {},
    setSpinning: () => {},
    reset: () => {},
    invalidate: () => {},
    setFlow: () => {},
    dispose() {
      disposed = true
      teardown()
      canvas.dataset.state = 'disposed'
    }
  }
  try {
    return initialize()
  } catch (error) {
    teardown()
    canvas.dataset.state = 'error'
    queueMicrotask(() => {
      if (!disposed) onStatus('error')
    })
    console.warn(`Could not initialize ${kind} study`, error)
    return fallback
  }

  function initialize(): ObjectHandle {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    function own(object: THREE.Object3D) {
      object.traverse((node) => {
        if (!(node instanceof THREE.Mesh) && !(node instanceof THREE.Points)) return
        geometries.add(node.geometry)
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material)
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture) textures.add(value)
          }
        }
      })
    }
    function releaseResources() {
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      for (const texture of textures) {
        texture.dispose()
        if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close()
      }
      geometries.clear()
      materials.clear()
      textures.clear()
    }

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.info.autoReset = false
    teardown = () => {
      releaseResources()
      renderer.dispose()
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = kind === 'headrest' ? 0.45 : 0.8
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100)
    camera.position.set(0, 0, 4)
    const previousTouchAction = canvas.style.touchAction
    const controls = new OrbitControls(camera, canvas)
    teardown = () => {
      controls.dispose()
      releaseResources()
      renderer.dispose()
    }
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = false
    controls.autoRotateSpeed = 0.7
    // Keep vertical touch scrolling available; horizontal dragging still orbits.
    canvas.style.touchAction = 'pan-y'
    const room = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    let environment: THREE.WebGLRenderTarget
    try {
      environment = pmrem.fromScene(room, 0.04)
    } finally {
      room.dispose()
      pmrem.dispose()
    }
    scene.environment = environment.texture
    scene.environmentIntensity = kind === 'headrest' ? .65 : 1.1
    const keyLight = new THREE.DirectionalLight(0xffffff, kind === 'headrest' ? 2.2 : 3)
    keyLight.position.set(-3, 5, 4)
    scene.add(keyLight, new THREE.AmbientLight(0xffffff, 0.15))
    const loader = createPortfolioModelLoader()
    const requests = new AbortController()
    teardown = () => {
      controls.dispose()
      requests.abort()
      loader.dispose()
      environment.dispose()
      releaseResources()
      renderer.dispose()
    }
    const composer = new EffectComposer(renderer, { multisampling: 0 })
    const animatedHelmet = kind === 'helmet'
    // Fine print retains engraved edges without increasing the render target.
    const dither = new LiveDitherEffect({ gridSize: 1, binary: flowMode || animatedHelmet, live: flowMode || animatedHelmet })
    composer.addPass(new RenderPass(scene, camera))
    // Palette mapping and dither share a pass; flow samples that processed output.
    composer.addPass(new EffectPass(camera, dither))
    const flowEffect = flowMode ? new WaterFlowEffect() : null
    if (flowEffect) composer.addPass(new EffectPass(camera, flowEffect))
    canvas.dataset.flow = '0.0000'
    canvas.dataset.effectPasses = flowMode ? '3' : '2'
    let object: THREE.Group | null = null
    let lionStudy: ReturnType<typeof createLionStudy> | null = null
    let fieldTarget = .06
    let fieldPlaying = true
    let frame = 0
    let printFrame = 0
    let frames = 0
    const runtime = new PortfolioRuntime()
    let painting = false
    let dragging = false
    let lastStats = -Infinity
    let averageCpuMs = 0
    let urgent = true
    let spinning = false
    let flowProgress = 0
    let loadFailed = false
    const initialRect = canvas.getBoundingClientRect()
    let visible = initialRect.bottom > 0 && initialRect.top < window.innerHeight && initialRect.right > 0 && initialRect.left < window.innerWidth
    let contextLost = false
    let fitDistance = 4
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    canvas.dataset.spinning = 'false'

    function active() {
      return !disposed && visible && !document.hidden && !contextLost && !loadFailed
    }
    function requestRender(force: unknown = true) {
      urgent ||= !painting && Boolean(force)
      if (active() && !frame) frame = requestAnimationFrame(render)
    }
    function render(time: number) {
      frame = 0
      if (!active()) return
      const flowComplete = flowMode && flowProgress >= .9999
      const living = (flowMode || animatedHelmet) && !reducedMotion.matches && !flowComplete && !loadFailed
      const fieldMoving = Boolean(lionStudy?.playing) && !reducedMotion.matches
      if (!runtime.canPaint(time, urgent)) { requestRender(false); return }
      urgent = false
      painting = true
      controls.autoRotate = spinning && !reducedMotion.matches && !flowComplete
      if (runtime.advance(time, living || fieldMoving || controls.autoRotate, dragging)) resize(true)
      const delta = runtime.delta
      const seconds = runtime.seconds
      if ((flowMode || animatedHelmet) && object) {
        object.rotation.x = reducedMotion.matches ? 0 : Math.sin(seconds * .55) * .075
        object.rotation.y = reducedMotion.matches ? 0 : Math.sin(seconds * .46) * .19
        object.rotation.z = reducedMotion.matches ? 0 : Math.sin(seconds * .38 + .7) * .035
        object.position.y = reducedMotion.matches ? 0 : Math.sin(seconds * .85) * .052
      }
      dither.setTime(seconds, living)
      flowEffect?.setTime(seconds)
      const changingStudy = lionStudy?.advance(delta, reducedMotion.matches) ?? false
      controls.update(delta)
      const started = import.meta.env.DEV ? performance.now() : 0
      renderer.info.reset()
      composer.render(delta)
      onRendered?.(seconds * 1000)
      if (import.meta.env.DEV) averageCpuMs = averageCpuMs * .94 + (performance.now() - started) * .06
      frames++
      painting = false
      const live = controls.autoRotate || living || changingStudy
      stats(live, frames === 1 || !live)
      if (live) requestRender(false)
      else runtime.suspend()
    }
    function stats(live: boolean, force = false) {
      if (!import.meta.env.DEV) return
      const now = performance.now()
      if (force) canvas.dataset.liveMotion = String(live)
      if (now - lastStats < 750) return
      lastStats = now
      canvas.dataset.renderAverageMs = averageCpuMs.toFixed(3)
      canvas.dataset.renderCpuMs = averageCpuMs.toFixed(3)
      canvas.dataset.frameAverageMs = runtime.averageFrameMs.toFixed(3)
      canvas.dataset.fps = runtime.fps.toFixed(2)
      canvas.dataset.motionSeconds = runtime.seconds.toFixed(4)
      canvas.dataset.qualityScale = String(runtime.scale)
      canvas.dataset.drawCalls = String(renderer.info.render.calls)
      canvas.dataset.triangles = String(renderer.info.render.triangles)
      canvas.dataset.points = String(renderer.info.render.points)
      canvas.dataset.geometries = String(renderer.info.memory.geometries)
      canvas.dataset.textures = String(renderer.info.memory.textures)
      canvas.dataset.programs = String(renderer.info.programs?.length ?? 0)
      canvas.dataset.liveMotion = String(live)
      if (lionStudy) {
        canvas.dataset.field = lionStudy.value.toFixed(3)
        canvas.dataset.fieldPlaying = String(lionStudy.playing)
      }
      canvas.dataset.idleYaw = (object?.rotation.y || 0).toFixed(4)
      canvas.dataset.idlePitch = (object?.rotation.x || 0).toFixed(4)
      canvas.dataset.idleBob = (object?.position.y || 0).toFixed(4)
      canvas.dataset.azimuth = controls.getAzimuthalAngle().toFixed(4)
      canvas.dataset.polar = controls.getPolarAngle().toFixed(4)
      canvas.dataset.frames = String(frames)
    }
    function pause() {
      cancelAnimationFrame(frame)
      frame = 0
      runtime.suspend()
      stats(false, true)
    }
    function fittedDistance() {
      if (!object) return 4
      const size = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3())
      const extent = Math.max(size.y, size.x / Math.max(camera.aspect, 0.1))
      return ((extent / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) * 1.15 + size.z / 2) * (flowMode ? .69 : 1) * cameraDistanceScale
    }
    function reset() {
      if (disposed) return
      fitDistance = fittedDistance()
      camera.position.set(0, fitDistance * 0.04, fitDistance)
      controls.target.set(0, 0, 0)
      controls.update()
      requestRender()
    }
    function resize(qualityOnly = false) {
      if (disposed) return
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      // A viewport-wide surface must not multiply the former sculpture's GPU allocation.
      // Integer display-pixel subdivisions avoid a fractionally resampled dot screen.
      const pixelRatio = printPixelRatio(width, height, window.devicePixelRatio || 1) * runtime.scale
      lionStudy?.setPixelRatio(pixelRatio)
      lionStudy?.setDetail(width < 700)
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
      composer.setSize(width, height)
      canvas.dataset.renderPixels = String(canvas.width * canvas.height)
      dither.setView(width, height)
      flowEffect?.setResolution(width, height)
      canvas.dataset.ditherGrid = '1'
      canvas.dataset.pixelRatio = String(pixelRatio)
      if (qualityOnly) return
      const core = flowMode ? canvas.closest('.home-flow-scene')?.getBoundingClientRect() : null
      if (core) {
        camera.setViewOffset(core.width, core.height, rect.left - core.left, rect.top - core.top, width, height)
        flowEffect?.setView((core.left - rect.left + core.width / 2) / width, 1 - (core.top - rect.top + core.height / 2) / height, core.width / width, core.height / height)
      } else {
        camera.clearViewOffset()
        camera.aspect = width / height
      }
      camera.updateProjectionMatrix()
      const nextDistance = fittedDistance()
      camera.position
        .sub(controls.target)
        .multiplyScalar(nextDistance / fitDistance)
        .add(controls.target)
      fitDistance = nextDistance
      controls.update()
      requestRender()
    }
    function setDark(value: boolean) {
      if (disposed) return
      dark = value
      const colors = readPrintPalette(canvas, dark)
      dither.setPalette(colors.paper, colors.ink)
      canvas.dataset.paper = `#${colors.paper.getHexString()}`
      canvas.dataset.ink = `#${colors.ink.getHexString()}`
      canvas.style.backgroundColor = flowMode ? 'transparent' : `#${colors.paper.getHexString()}`
      canvas.dataset.dark = String(dark)
      // Lighting remains physical; only paper and ink swap with the CSS theme.
      requestRender()
    }
    function onVisibility() {
      if (document.hidden) pause()
      else {
        runtime.suspend()
        requestRender()
      }
    }
    function onAfterPrint() {
      cancelAnimationFrame(printFrame)
      // Print hides the interactive scene. Refresh visibility after screen layout returns.
      printFrame = requestAnimationFrame(() => {
        printFrame = 0
        if (disposed) return
        const rect = canvas.getBoundingClientRect()
        visible = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
        resize()
        requestRender()
      })
    }
    function onMotionChange() {
      canvas.dataset.spinning = String(spinning && !reducedMotion.matches)
      pause()
      requestRender()
    }
    function onKey(event: KeyboardEvent) {
      if (disposed || event.altKey || event.ctrlKey || event.metaKey) return
      switch (event.key) {
        case 'ArrowLeft':
          controls.rotateLeft(0.14)
          break
        case 'ArrowRight':
          controls.rotateLeft(-0.14)
          break
        case 'ArrowUp':
          controls.rotateUp(0.14)
          break
        case 'ArrowDown':
          controls.rotateUp(-0.14)
          break
        case 'Home':
          reset()
          break
        default:
          return
      }
      event.preventDefault()
      controls.update()
      requestRender()
    }
    function onContextLost(event: Event) {
      event.preventDefault()
      contextLost = true
      pause()
      canvas.dataset.state = 'error'
      if (!disposed) onStatus('error')
    }
    function onContextRestored() {
      if (disposed) return
      contextLost = false
      canvas.dataset.state = object ? 'ready' : 'loading'
      if (object) onStatus('ready')
      requestRender()
    }
    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(canvas)
    // Copy reflow can change the model's grid cell without resizing the wide canvas.
    const framingCell = flowMode ? canvas.closest('.home-flow-scene') : null
    if (framingCell) resizeObserver.observe(framingCell)
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false
      if (visible) requestRender()
      else pause()
    })
    intersectionObserver.observe(canvas)
    controls.addEventListener('change', requestRender)
    const dragStart = () => { dragging = true }
    const dragEnd = () => { dragging = false; requestRender() }
    controls.addEventListener('start', dragStart)
    controls.addEventListener('end', dragEnd)
    canvas.addEventListener('keydown', onKey)
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('afterprint', onAfterPrint)
    reducedMotion.addEventListener('change', onMotionChange)

    teardown = () => {
      pause()
      cancelAnimationFrame(printFrame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('keydown', onKey)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('afterprint', onAfterPrint)
      reducedMotion.removeEventListener('change', onMotionChange)
      controls.removeEventListener('change', requestRender)
      controls.removeEventListener('start', dragStart)
      controls.removeEventListener('end', dragEnd)
      controls.dispose()
      scene.clear()
      composer.dispose()
      environment.dispose()
      requests.abort()
      loader.dispose()
      releaseResources()
      renderer.renderLists.dispose()
      renderer.dispose()
      canvas.style.touchAction = previousTouchAction
    }
    setDark(dark)
    resize()
    void load()

    async function load() {
      try {
        const group = new THREE.Group()
        if (kind === 'ribbon') group.add(createRibbon())
        else if (kind === 'cross') group.add(createCross())
        else {
          const gltf = await loader.load(portfolioAssetUrl(kind), requests.signal)
          if (disposed) {
            own(gltf.scene)
            releaseResources()
            return
          }
          own(gltf.scene)
          if (kind === 'helmet') {
            const mesh = gltf.scene.getObjectByName('Object_2')
            if (!(mesh instanceof THREE.Mesh)) throw new Error('Helmet mesh Object_2 missing')
            mesh.position.set(-2.016, -0.06, 1.381)
            mesh.rotation.set(-1.601, 0.068, 2.296)
            mesh.scale.setScalar(0.038)
            for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
              if (material instanceof THREE.MeshStandardMaterial) material.roughness = 0.23
            }
            group.add(mesh)
            group.rotation.set(0, -Math.PI / 3.5, -0.25)
          } else {
            if (kind === 'headrest') {
              lionStudy = createLionStudy(gltf.scene)
              lionStudy.setField(fieldTarget)
              lionStudy.setPlaying(fieldPlaying && !reducedMotion.matches)
              lionStudy.setPixelRatio(renderer.getPixelRatio())
              lionStudy.setDetail(canvas.getBoundingClientRect().width < 700)
              group.add(lionStudy.group)
            } else group.add(gltf.scene)
            group.rotation.set(kind === 'headrest' ? .04 : kind === 'crystal' ? 0.12 : 0, kind === 'headrest' ? -.32 : kind === 'crystal' ? 0.4 : -0.4, kind === 'headrest' ? -.04 : kind === 'crystal' ? -0.08 : 0.1)
          }
        }
        own(group)
        if (disposed) {
          releaseResources()
          return
        }
        const bounds = new THREE.Box3().setFromObject(group)
        const center = bounds.getCenter(new THREE.Vector3())
        const extent = bounds.getSize(new THREE.Vector3())
        if (bounds.isEmpty() || !Number.isFinite(extent.length())) throw new Error('Object bounds are invalid')
        group.position.sub(center)
        object = new THREE.Group()
        object.add(group)
        object.scale.setScalar(2 / Math.max(extent.x, extent.y, extent.z))
        scene.add(object)
        reset()
        canvas.dataset.state = 'ready'
        onStatus('ready')
      } catch (error) {
        if (disposed) return
        loadFailed = true
        pause()
        canvas.dataset.liveMotion = 'false'
        canvas.dataset.state = 'error'
        onStatus('error')
        console.warn(`Could not load ${kind} study`, error)
      }
    }
    return {
      setDark,
      setSpinning(value) {
        if (disposed) return
        spinning = value
        canvas.dataset.spinning = String(value && !reducedMotion.matches)
        pause()
        requestRender()
      },
      reset,
      invalidate: requestRender,
      setFlow(progress, drift = 0) {
        if (disposed || !flowEffect) return
        const value = reducedMotion.matches ? 0 : Math.max(0, Math.min(1, progress))
        flowProgress = value
        const nextDrift = value > 0 ? drift : 0
        const changed = Math.abs(Number(canvas.dataset.flow) - value) > .00001 || Math.abs(Number(canvas.dataset.flowDrift || 0) - nextDrift) > .00001
        flowEffect.setProgress(value, nextDrift)
        canvas.dataset.flow = value.toFixed(4)
        canvas.dataset.flowDrift = nextDrift.toFixed(4)
        canvas.dataset.effectPasses = '3'
        if (changed) requestRender()
      },
      setField(value) {
        if (disposed || kind !== 'headrest') return
        fieldPlaying = false
        fieldTarget = Math.min(1, Math.max(0, value))
        lionStudy?.setField(fieldTarget)
        requestRender()
      },
      setFieldPlaying(value) {
        if (disposed || kind !== 'headrest') return
        fieldPlaying = value && !reducedMotion.matches
        lionStudy?.setPlaying(fieldPlaying)
        requestRender()
      },
      getField() { return lionStudy?.value ?? fieldTarget },
      dispose() {
        if (disposed) return
        disposed = true
        teardown()
        canvas.dataset.state = 'disposed'
      }
    }
  }
}

function chromeMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.2, envMapIntensity: 3, side: THREE.DoubleSide })
}

/** A broad strip with three open helical turns rather than a round tube. */
function createRibbon(): THREE.Group {
  const group = new THREE.Group()
  const positions: number[] = []
  const indices: number[] = []
  const segments = 240
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const angle = t * Math.PI * 5.8
    const radius = 0.65 + 0.09 * Math.sin(t * Math.PI)
    const y = (t - 0.5) * 2.1
    // A slight taper makes the loose ends read like cut metal.
    const width = 0.51 * (0.85 + 0.15 * Math.sin(t * Math.PI))
    for (const edge of [-1, 1]) {
      const r = radius + edge * 0.045
      positions.push(Math.cos(angle) * r, y + edge * width / 2, Math.sin(angle) * r)
    }
    if (i < segments) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  group.add(new THREE.Mesh(geometry, chromeMaterial()))
  group.rotation.set(0.18, -0.3, -0.32)
  return group
}

function createCross(): THREE.Group {
  const group = new THREE.Group()
  const geometry = new THREE.BoxGeometry(0.62, 0.62, 0.62)
  const material = chromeMaterial()
  const cells = [
    [0, 0, 0],
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1]
  ]
  for (const [x, y, z] of cells) {
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(x * 0.615, y * 0.615, z * 0.615)
    group.add(cube)
  }
  group.rotation.set(0.45, 0.63, -0.18)
  return group
}
