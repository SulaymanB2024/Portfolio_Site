import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import { DitheringEffect } from '../dithering-shader/DitheringEffect.ts'
import { WaterFlowEffect } from './water-flow'
import { LiveDitherEffect } from './live-dither'
import { printPixelRatio, readPrintPalette } from './print-palette'
import { createLionStudy } from './contact/lion-study'

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
    const draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`).setWorkerLimit(1)
    teardown = () => {
      controls.dispose()
      draco.dispose()
      environment.dispose()
      releaseResources()
      renderer.dispose()
    }
    const loader = new GLTFLoader().setDRACOLoader(draco)
    const composer = new EffectComposer(renderer, { multisampling: 0 })
    const animatedHelmet = kind === 'helmet'
    const dither = (flowMode || animatedHelmet) ? new LiveDitherEffect() : new DitheringEffect({ gridSize: 1, grayscaleOnly: true })
    // Finish in the same ink and paper as the surrounding editorial layout.
    const palette = new Effect(
      'EditorialPalette',
      /* glsl */ `
      uniform vec3 printInk;
      uniform vec3 printPaper;
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        float tone = clamp(inputColor.r, 0.0, 1.0);
        outputColor = vec4(mix(printInk, printPaper, tone), inputColor.a);
      }
    `,
      { uniforms: new Map([['printInk', new THREE.Uniform(new THREE.Color())], ['printPaper', new THREE.Uniform(new THREE.Color())]]) }
    )
    composer.addPass(new RenderPass(scene, camera))
    // Separate passes preserve the existing shader's monochrome output before palette mapping.
    composer.addPass(new EffectPass(camera, dither))
    const flowEffect = flowMode ? new WaterFlowEffect() : null
    // Fuse the flow with palette mapping: no extra full-screen pass or target allocation.
    composer.addPass(new EffectPass(camera, palette, ...(flowEffect ? [flowEffect] : [])))
    canvas.dataset.flow = '0.0000'
    canvas.dataset.effectPasses = '3'
    let object: THREE.Group | null = null
    let lionStudy: ReturnType<typeof createLionStudy> | null = null
    let fieldTarget = .42
    let fieldPlaying = true
    let frame = 0
    let printFrame = 0
    let frames = 0
    let lastTime = 0
    let lastPaint = 0
    let urgent = true
    let spinning = false
    let flowProgress = 0
    let loadFailed = false
    const initialRect = canvas.getBoundingClientRect()
    let visible = initialRect.bottom > 0 && initialRect.top < window.innerHeight && initialRect.right > 0 && initialRect.left < window.innerWidth
    let contextLost = false
    let fitDistance = 4
    const renderTimes: number[] = []
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    canvas.dataset.spinning = 'false'

    function active() {
      return !disposed && visible && !document.hidden && !contextLost && !loadFailed
    }
    function requestRender(force: unknown = true) {
      urgent = urgent || Boolean(force)
      if (active() && !frame) frame = requestAnimationFrame(render)
    }
    function render(time: number) {
      frame = 0
      if (!active()) return
      const flowComplete = flowMode && flowProgress >= .9999
      const living = (flowMode || animatedHelmet) && !reducedMotion.matches && !flowComplete && !loadFailed
      const fieldMoving = Boolean(lionStudy?.playing) && !reducedMotion.matches
      // Continuous sculpture motion runs at 30 Hz; direct input can request an immediate frame.
      // Allow sub-millisecond RAF jitter so a 60 Hz display does not skip a third refresh.
      if ((living || fieldMoving) && !urgent && time - lastPaint < 1000 / 30 - 1) { requestRender(false); return }
      urgent = false
      lastPaint = time
      if ((flowMode || animatedHelmet) && object) {
        object.rotation.x = living ? Math.sin(time * .00055) * .075 : 0
        object.rotation.y = living ? Math.sin(time * .00046) * .19 : 0
        object.rotation.z = living ? Math.sin(time * .00038 + .7) * .035 : 0
        object.position.y = living ? Math.sin(time * .00085) * .052 : 0
      }
      if (dither instanceof LiveDitherEffect) dither.setTime(time / 1000, living)
      flowEffect?.setTime(time / 1000)
      controls.autoRotate = spinning && !reducedMotion.matches && !flowComplete
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60
      const changingStudy = lionStudy?.advance(delta, reducedMotion.matches) ?? false
      if (lionStudy) {
        canvas.dataset.field = lionStudy.value.toFixed(3)
        canvas.dataset.fieldPlaying = String(lionStudy.playing)
      }
      controls.update(lastTime ? delta : 0)
      lastTime = time
      const started = performance.now()
      composer.render()
      onRendered?.(time)
      const duration = performance.now() - started
      renderTimes.push(duration)
      if (renderTimes.length > 120) renderTimes.shift()
      canvas.dataset.renderCpuMs = duration.toFixed(3)
      canvas.dataset.renderAverageMs = (renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length).toFixed(3)
      canvas.dataset.drawCalls = String(renderer.info.render.calls)
      canvas.dataset.triangles = String(renderer.info.render.triangles)
      canvas.dataset.liveMotion = String(living || fieldMoving)
      canvas.dataset.idleYaw = (object?.rotation.y || 0).toFixed(4)
      canvas.dataset.idlePitch = (object?.rotation.x || 0).toFixed(4)
      canvas.dataset.idleBob = (object?.position.y || 0).toFixed(4)
      canvas.dataset.azimuth = controls.getAzimuthalAngle().toFixed(4)
      canvas.dataset.polar = controls.getPolarAngle().toFixed(4)
      canvas.dataset.frames = String(++frames)
      if (controls.autoRotate || living || changingStudy) requestRender(false)
    }
    function pause() {
      cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
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
    function resize() {
      if (disposed) return
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      // A viewport-wide surface must not multiply the former sculpture's GPU allocation.
      // Integer display-pixel subdivisions avoid a fractionally resampled dot screen.
      const pixelRatio = printPixelRatio(width, height, window.devicePixelRatio || 1)
      lionStudy?.setPixelRatio(pixelRatio)
      if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio)
      renderer.setSize(width, height, false)
      composer.setSize(width, height)
      canvas.dataset.renderPixels = String(canvas.width * canvas.height)
      canvas.dataset.ditherGrid = '2'
      canvas.dataset.pixelRatio = String(pixelRatio)
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
      palette.uniforms.get('printInk')!.value.copy(colors.ink)
      palette.uniforms.get('printPaper')!.value.copy(colors.paper)
      flowEffect?.setPalette(colors.paper, colors.ink)
      canvas.dataset.paper = `#${colors.paper.getHexString()}`
      canvas.dataset.ink = `#${colors.ink.getHexString()}`
      canvas.style.backgroundColor = flowMode ? 'transparent' : dark ? '#111210' : '#f3f3f0'
      canvas.dataset.dark = String(dark)
      // Lighting remains physical; only paper and ink swap with the CSS theme.
      requestRender()
    }
    function onVisibility() {
      if (document.hidden) pause()
      else {
        lastTime = 0
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
    const resizeObserver = new ResizeObserver(resize)
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
      controls.dispose()
      scene.clear()
      composer.dispose()
      environment.dispose()
      draco.dispose()
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
          const path = kind === 'helmet' ? 'helmet-balanced.glb' : kind === 'headrest' ? 'models/headrest-three-lions-balanced.glb' : `models/${kind === 'crystal' ? 'crystal-cluster' : 'wireframe-globe'}.glb`
          const version = kind === 'helmet' ? '?v=4-surface' : ''
          const gltf = await loader.loadAsync(`${import.meta.env.BASE_URL}${path}${version}`)
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
              group.add(lionStudy.group)
            } else group.add(gltf.scene)
            group.rotation.set(kind === 'headrest' ? .16 : kind === 'crystal' ? 0.12 : 0, kind === 'headrest' ? -.45 : kind === 'crystal' ? 0.4 : -0.4, kind === 'headrest' ? -.04 : kind === 'crystal' ? -0.08 : 0.1)
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
