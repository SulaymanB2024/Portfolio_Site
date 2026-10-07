import * as THREE from 'three'
import { createPortfolioModelLoader } from './portfolio-model-loader'
import { portfolioAssetUrl } from './portfolio-assets'
import { PortfolioRuntime } from './portfolio-runtime'
import { PORTFOLIO_DITHER_GLSL } from './dither-kernel'
import { readPrintPalette } from './print-palette'
import { disposeModel } from '../model-resources'
import type { InterestId } from './about/about-content'
import { emptyContextTransition, changeContextObject, advanceContextTransition } from './context-transition'
import { subscribeMenuMotion } from './menu-motion'
import { createStudyActivationGate } from './work-entry-activation'

type Specimen = { source: THREE.Group; group: THREE.Group; size: THREE.Vector3; yaw: number; pitch: number; id: InterestId }

/** One deferred, bounded GLB renderer for the personal introduction. */
export function mountContextObject(canvas: HTMLCanvasElement, status: (value: 'loading' | 'ready' | 'error') => void, displayed: (id: InterestId) => void = () => {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setClearColor(0, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .9
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 1, .01, 50)
  const key = new THREE.DirectionalLight(0xffffff, 3.1), rim = new THREE.DirectionalLight(0xffffff, 1.8)
  key.position.set(-3, 5, 6); rim.position.set(4, 2, -3)
  scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x444444, .65))
  const target = new THREE.WebGLRenderTarget(1, 1), post = new THREE.Scene(), postCamera = new THREE.Camera()
  const themeRoot = canvas.closest('[data-appearance]') ?? document.documentElement
  const palette = () => readPrintPalette(canvas, themeRoot.getAttribute('data-appearance') === 'dark')
  const shader = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    uniforms: { image: { value: target.texture }, ink: { value: palette().ink }, cssSize: { value: new THREE.Vector2(1, 1) }, reveal: { value: 1 }, motionSeconds: { value: 0 } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `uniform sampler2D image;uniform vec3 ink;uniform vec2 cssSize;uniform float reveal;uniform float motionSeconds;varying vec2 vUv;
      ${PORTFOLIO_DITHER_GLSL}
      void main(){vec4 s=texture2D(image,vUv);if(s.a<.0001){gl_FragColor=vec4(0.);return;}
      float tone=portfolioDisplayLuminance(portfolioStraightColor(s));float printTone=mix(1.,tone,reveal);
      vec2 pixel=floor(vUv*cssSize);
      float marks=1.-portfolioDitherMark(printTone,portfolioBayer8(pixel),pixel,motionSeconds,.025);
      // Fine moving grain sits over continuous carving, preserving strings and highlights.
      float coverage=mix(marks,1.-printTone,.58);gl_FragColor=vec4(ink,s.a*coverage);
      #include <colorspace_fragment>
      }`,
  })
  const quad = new THREE.PlaneGeometry(2, 2); post.add(new THREE.Mesh(quad, shader))
  const loader = createPortfolioModelLoader(), abort = new AbortController(), runtime = new PortfolioRuntime()
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  const controls: HTMLElement = canvas.closest('a') ?? canvas
  const activation = createStudyActivationGate()
  const specimens = new Map<InterestId, Specimen>(), requests = new Map<InterestId, Promise<void>>()
  let selected: InterestId = 'bass', reported: InterestId | null = null, disposed = false, visible = true, lost = false, playing = true, urgent = true
  let transition = emptyContextTransition()
  let raf = 0, timer = 0, frames = 0
  let backingWidth = 0, backingHeight = 0, backingRatio = 0
  let menuOpen = false
  let drag: { id: number; x: number; y: number; previousX: number; previousY: number; intent: 'pending' | 'horizontal' | 'vertical' } | null = null
  canvas.dataset.assets = 'glb'; canvas.dataset.state = 'loading'; canvas.dataset.interacting = 'false'
  const active = () => !disposed && visible && !lost && !document.hidden && !menuOpen
  function cancel() { cancelAnimationFrame(raf); clearTimeout(timer); raf = timer = 0; runtime.suspend(); canvas.dataset.liveMotion = 'false' }
  function schedule(now = performance.now()) {
    if (!active() || raf || timer) return
    const delay = urgent ? 0 : runtime.paintDelay(now)
    if (delay > 3) timer = window.setTimeout(() => { timer = 0; if (active()) raf = requestAnimationFrame(paint) }, delay)
    else raf = requestAnimationFrame(paint)
  }
  function wake() { urgent = true; if (timer) { clearTimeout(timer); timer = 0 } schedule() }
  function show(id: InterestId) {
    transition = changeContextObject(transition, id, media.matches || !visible || document.hidden)
    // Controls and captions remain useful below the canvas without waking the GPU.
    if (!active() && reported !== id) { reported = id; displayed(id) }
    measure()
  }
  function measure() {
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight), ratio = Math.min(devicePixelRatio || 1, 1.25, 720 / width) * runtime.scale
    if (width !== backingWidth || height !== backingHeight || ratio !== backingRatio) {
      if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio)
      renderer.setSize(width, height, false)
      target.setSize(renderer.domElement.width, renderer.domElement.height)
      backingWidth = width; backingHeight = height; backingRatio = ratio
    }
    camera.aspect = width / height
    const size = specimens.get(transition.shown ?? selected)?.size
    // Fit each sculpture's proportions instead of shrinking a tall bass to a cube on phones.
    const fit = size ? Math.max(size.y / 2.8, Math.hypot(size.x, size.z) / (2.8 * camera.aspect)) : Math.max(1, 1 / camera.aspect)
    camera.position.set(0, 0, 5.4 * fit); camera.updateProjectionMatrix()
    shader.uniforms.cssSize.value.set(renderer.domElement.width, renderer.domElement.height); canvas.dataset.renderPixels = String(renderer.domElement.width * renderer.domElement.height)
    wake()
  }
  function load(id: InterestId) {
    if (requests.has(id) || specimens.has(id)) return
    const request = loader.load(portfolioAssetUrl('about-' + id), abort.signal).then(gltf => {
      if (disposed) { disposeModel(gltf.scene); return }
      const source = gltf.scene, view = (id === 'knight' ? source.getObjectByName('knight') ?? source : source).clone(true)
      const bounds = new THREE.Box3().setFromObject(view), center = bounds.getCenter(new THREE.Vector3()), size = bounds.getSize(new THREE.Vector3())
      const scale = 2.8 / Math.max(size.x, size.y, size.z)
      const normalized = new THREE.Group(), group = new THREE.Group()
      view.position.sub(center); normalized.add(view); normalized.scale.setScalar(scale); group.add(normalized); group.visible = false
      specimens.set(id, { source, group, size: size.multiplyScalar(scale), yaw: 0, pitch: 0, id }); scene.add(group)
      if (selected === id) show(id)
      wake()
    }).catch(error => { requests.delete(id); if (!disposed && error?.name !== 'AbortError' && selected === id) { canvas.dataset.state = 'error'; status('error') } })
    requests.set(id, request)
  }
  function paint(now: number) {
    raf = 0
    if (!active()) { runtime.suspend(); return }
    if (!runtime.canPaint(now, urgent)) { schedule(now); return }
    urgent = false
    const live = playing && !media.matches && transition.shown !== null
    if (runtime.advance(now, live, !!drag || transition.phase !== 'hold')) measure()
    const dt = runtime.delta || 1 / 30, time = runtime.seconds
    shader.uniforms.motionSeconds.value = time
    const previous = transition.shown
    transition = advanceContextTransition(transition, dt, media.matches)
    if (previous !== transition.shown) measure()
    shader.uniforms.reveal.value = transition.reveal
    for (const item of specimens.values()) {
      item.group.visible = transition.shown === item.id && transition.reveal > 0
      const baseYaw = item.id === 'bass' ? -.24 : item.id === 'score' ? .18 : -.6
      item.group.rotation.set((item.id === 'score' ? -.1 : 0) + item.pitch, baseYaw + item.yaw + (media.matches ? 0 : Math.sin(time * .38) * .07), item.id === 'bass' ? -.045 : 0)
      item.group.position.set(0, media.matches ? 0 : Math.sin(time * .55) * .018, 0)
    }
    renderer.setRenderTarget(target); renderer.render(scene, camera)
    renderer.setRenderTarget(null); renderer.render(post, postCamera)
    const current = transition.shown ? specimens.get(transition.shown) : null
    canvas.dataset.frames = String(++frames); canvas.dataset.yaw = String(current?.yaw ?? 0); canvas.dataset.pitch = String(current?.pitch ?? 0)
    canvas.dataset.liveMotion = String(live); canvas.dataset.selection = selected
    canvas.dataset.grainSeconds = String(time)
    canvas.dataset.transitionPhase = transition.phase; canvas.dataset.inkReveal = String(transition.reveal)
    canvas.dataset.shownSelection = transition.shown ?? ''; canvas.dataset.visibleModels = String([...specimens.values()].filter(item => item.group.visible).length)
    if (transition.shown) canvas.dataset.modelAsset = portfolioAssetUrl('about-' + transition.shown)
    if (transition.shown && reported !== transition.shown) { reported = transition.shown; displayed(reported) }
    if (transition.shown === selected && transition.phase === 'hold' && canvas.dataset.state !== 'ready') { canvas.dataset.state = 'ready'; status('ready') }
    if (live || transition.phase !== 'hold') schedule(now); else runtime.suspend()
  }
  const resize = new ResizeObserver(measure); resize.observe(canvas)
  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; visible ? wake() : cancel() }); observer.observe(canvas)
  const theme = new MutationObserver(() => { shader.uniforms.ink.value.copy(palette().ink); wake() }); theme.observe(themeRoot, { attributes: true, attributeFilter: ['data-appearance'] })
  const stopMenu = subscribeMenuMotion(open => { menuOpen = open; canvas.dataset.menuSuspended = String(open); open ? cancel() : wake() })
  document.addEventListener('visibilitychange', () => document.hidden ? cancel() : wake(), { signal: abort.signal })
  media.addEventListener('change', () => { cancel(); wake() }, { signal: abort.signal })
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; cancel(); canvas.dataset.state = 'context-lost'; status('error') }, { signal: abort.signal })
  canvas.addEventListener('webglcontextrestored', () => { lost = false; canvas.dataset.state = 'loading'; wake() }, { signal: abort.signal })
  controls.addEventListener('pointerdown', event => { if (event.isPrimary && event.button === 0) { activation.start(event.pointerId, event.clientX, event.clientY, event.pointerType); drag = event.target === canvas ? { id: event.pointerId, x: event.clientX, y: event.clientY, previousX: event.clientX, previousY: event.clientY, intent: 'pending' } : null } }, { signal: abort.signal })
  controls.addEventListener('pointermove', event => {
    activation.move(event.pointerId, event.clientX, event.clientY)
    if (!drag || drag.id !== event.pointerId) return
    const current = transition.shown ? specimens.get(transition.shown) : null
    if (!current || transition.phase !== 'hold') return
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y
    if (drag.intent === 'pending' && Math.hypot(dx, dy) > 7) drag.intent = event.pointerType !== 'touch' || Math.abs(dx) > Math.abs(dy) * 1.2 ? 'horizontal' : 'vertical'
    if (drag.intent === 'horizontal') { if (canvas.dataset.interacting !== 'true') canvas.dataset.interacting = 'true'; canvas.setPointerCapture(event.pointerId); current.yaw = THREE.MathUtils.clamp(current.yaw + (event.clientX - drag.previousX) * .005, -.8, .8); current.pitch = THREE.MathUtils.clamp(current.pitch + (event.clientY - drag.previousY) * .003, -.15, .15); wake() }
    drag.previousX = event.clientX; drag.previousY = event.clientY
  }, { signal: abort.signal })
  const release = (event: PointerEvent) => { if (drag?.id !== event.pointerId) { if (event.type === 'pointerup') activation.end(event.pointerId, false); return } if (event.type === 'pointerup') activation.end(event.pointerId, drag.intent === 'horizontal'); else activation.interrupt(); drag = null; canvas.dataset.interacting = 'false'; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId); wake() }
  controls.addEventListener('pointerup', release, { signal: abort.signal }); controls.addEventListener('pointercancel', release, { signal: abort.signal }); controls.addEventListener('lostpointercapture', release, { signal: abort.signal })
  controls.addEventListener('click', event => { if (event.detail > 0 && activation.blocked) event.preventDefault() }, { signal: abort.signal })
  controls.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) { event.preventDefault(); const current = transition.shown ? specimens.get(transition.shown) : null; if (!current || transition.phase !== 'hold') return; if (event.key === 'Home') current.yaw = current.pitch = 0; else { current.yaw = THREE.MathUtils.clamp(current.yaw + (event.key === 'ArrowLeft' ? -.1 : event.key === 'ArrowRight' ? .1 : 0), -.8, .8); current.pitch = THREE.MathUtils.clamp(current.pitch + (event.key === 'ArrowUp' ? -.04 : event.key === 'ArrowDown' ? .04 : 0), -.15, .15) } wake() } }, { signal: abort.signal })
  measure()
  return {
    select(id: InterestId) { if (disposed || selected === id && specimens.has(id)) return; selected = id; canvas.dataset.state = 'loading'; status('loading'); if (specimens.has(id)) show(id); else { if (transition.shown) transition = changeContextObject(transition, transition.shown, media.matches); load(id) } wake() },
    setPlaying(value: boolean) { playing = value; cancel(); wake() },
    dispose() { if (disposed) return; disposed = true; cancel(); stopMenu(); abort.abort(); resize.disconnect(); observer.disconnect(); theme.disconnect(); loader.dispose(); for (const item of specimens.values()) { scene.remove(item.group); disposeModel(item.source) } specimens.clear(); target.dispose(); quad.dispose(); shader.dispose(); renderer.dispose(); queueMicrotask(() => { if (!canvas.isConnected) renderer.forceContextLoss() }); canvas.dataset.state = 'disposed' },
  }
}
