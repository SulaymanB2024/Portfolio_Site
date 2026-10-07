import { createPortalMaskTarget } from './portal-mask.ts'
import * as THREE from 'three'
import { createPortfolioModelLoader } from '../portfolio-model-loader.ts'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { CHAPTERS, sceneSequence, textSequence, advanceScrollMotion, railProgress, requiredScene, type LandingChapter, type TextSequence } from './sequence.ts'
import { thresholdMotion, sculpturePose, cinematicShot, portalPose, cinematicPhase, portalFrameOpacity, createScaleSampler, createApertureSampler } from './motion-curves.ts'
import { portfolioAssetUrl } from '../portfolio-assets.ts'
import { createDitheredText, textDitherShader, type DitheredTextUniforms } from './dithered-text.ts'
import { HEADING_RESERVE_EM, layoutHeading, renderHeading } from './heading-typography.ts'
import { scrollInkShader, scrollInkStrength, advanceScrollInk, scrollDitherPassage } from './scroll-dither.ts'
import { isStackedLanding, mobileSculptureFrame } from './mobile-layout.ts'
import { landingRenderBudget } from './render-budget.ts'
import { LANDING_ART, desktopSculptureFrame } from './art-direction.ts'
import { sculptureRestWeight, sculptureLivingPose, sculptureAnimationActive, mechanicalMotion, mechanicalAngle, type MechanicalMotion } from './chapter-motion.ts'
import { PortfolioRuntime } from '../portfolio-runtime.ts'
import { dragHelmet, helmetGesture, helmetKey, settleHelmet, type HelmetTurn, type HelmetGesture } from './helmet-interaction.ts'
import { setDestinationLabel } from '../link-arrow.ts'
import { openingInkReveal } from './opening-motion.ts'
import { PORTFOLIO_DITHER_GLSL } from '../dither-kernel.ts'

export interface LandingElements {
  rail: HTMLElement
  stage: HTMLElement
  canvas: HTMLCanvasElement
  helmetControl: HTMLButtonElement
  headline: HTMLHeadingElement
  loading: HTMLElement
  copyContent: HTMLElement
  title: HTMLAnchorElement
  links: HTMLElement
  project: HTMLAnchorElement
  article: HTMLAnchorElement
  category: HTMLElement
}
type Disposable = { dispose(): void }
type Part = { node: THREE.Object3D; quaternion: THREE.Quaternion; axis: THREE.Vector3; motion?: MechanicalMotion }
type Portal = {
  wrapper: THREE.Group
  frames: THREE.Mesh[]
  openings: THREE.Mesh[]
  animated: THREE.Object3D
  sampleScale: ReturnType<typeof createScaleSampler>
  sampleAperture: ReturnType<typeof createApertureSampler>
  openingSize: THREE.Vector3
  scaleValues: Float64Array
  duration: number
}
const rotations = LANDING_ART.map(art => art.rotation)
const screenFragmentShader = `
uniform sampler2D a;uniform sampler2D b;uniform sampler2D portalMask;uniform sampler2D portalFrame;uniform float portalEnabled;uniform float portalTextLeg;uniform float portalRim;uniform vec3 framePaper;uniform vec3 frameInk;
uniform vec2 scenePixels;uniform float outputRatio;uniform float sculptureReveal;uniform float sculptureSeconds;uniform float sculptureGrain;uniform vec3 paperA;uniform vec3 inkA;uniform vec3 paperB;uniform vec3 inkB;uniform float exposureA;uniform float exposureB;uniform float darkA;uniform float darkB;varying vec2 vUv;
${PORTFOLIO_DITHER_GLSL}
${scrollInkShader}
${textDitherShader}
float bayer2(vec2 p){vec2 q=mod(p,2.);return q.x*2.+q.y*3.-q.x*q.y*4.;}
vec3 printedSculpture(sampler2D source,vec2 uv,vec3 paper,vec3 ink,float exposure,float dark){
  vec2 pixel=floor(uv*scenePixels);
  vec4 sampleColor=texture2D(source,(pixel+.5)/scenePixels);
  if(sampleColor.a<.0001)return paper;
  float threshold=portfolioLiveThreshold(sculptureThreshold(pixel,uv),pixel,sculptureSeconds,sculptureGrain);
  float mark;
  if(exposure<0.){
    // Keep the approved opening's engraved chrome treatment.
    float luminance=dot(sampleColor.rgb,vec3(1.));
    mark=1.-step(threshold,luminance)*clamp(luminance,0.,1.);
    // Silver highlights retain the same engraving when the paper turns charcoal.
    mark=mix(mark,1.-mark,dark);
  }else{
    // Positive silver on charcoal preserves the project's physical volume.
    float luminance=pow(clamp(dot(sampleColor.rgb,vec3(.2126,.7152,.0722))*exposure,0.,1.),.9);
    mark=step(threshold,mix(1.-luminance,luminance,dark));
  }
  return mix(paper,ink,mark*sampleColor.a*sculptureReveal);
}
void main(){
  vec3 color=printedSculpture(a,vUv,paperA,inkA,exposureA,darkA);
  if(portalEnabled>.5){
    float mask=texture2D(portalMask,vUv).r;
    vec4 frame=texture2D(portalFrame,vUv);
    vec2 pixel=floor(gl_FragCoord.xy);
    float threshold=mix((4.*bayer2(pixel)+bayer2(floor(pixel/2.))+.5)/16.,sculptureThreshold(pixel,vUv),inkSweep(vUv)*.35);
    float luminance=clamp(dot(frame.rgb,vec3(.2126,.7152,.0722))*.85,0.,1.);
    frame.rgb=mix(frameInk,framePaper,step(threshold,luminance));
    color=mix(color,printedSculpture(b,vUv,paperB,inkB,exposureB,darkB),mask);
    // The optical rim passes behind the quiet navigation margins.
    float chrome=smoothstep(44.*outputRatio,70.*outputRatio,gl_FragCoord.y)*smoothstep(44.*outputRatio,70.*outputRatio,scenePixels.y-gl_FragCoord.y);
    color=mix(color,frame.rgb,frame.a*chrome*portalRim);
  }
  gl_FragColor=vec4(color,1.);
  #include <colorspace_fragment>
  gl_FragColor.rgb=mix(gl_FragColor.rgb,1.-gl_FragColor.rgb,printedText(vUv));
}`

/** The approved visor Threshold study, bounded to its own scroll rail. */
export function mountLandingSequence(elements: LandingElements): () => void {
  const { rail, stage, canvas, helmetControl, headline, loading, copyContent, title, links, project, article, category } = elements
  // An opaque context has an unpainted black buffer during setup and decoding.
  // Keep native copy on the stage paper until a complete composite is ready.
  canvas.hidden = true
  const resources = new Set<Disposable>(), observers: { disconnect(): void }[] = []
  const openingRuntime = new PortfolioRuntime()
  const events = new AbortController()
  const fallbackEvents = new AbortController()
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let dark = document.documentElement.dataset.appearance === 'dark'
  const assets = new Map<LandingChapter['id'], THREE.Group>(), actors: (THREE.Group | undefined)[] = []
  const assetSources = new Map<LandingChapter['id'], string>()
  const parts = new Map<THREE.Object3D, Part[]>()
  const actorBounds = new Map<THREE.Object3D, { size: THREE.Vector3; center: THREE.Vector3 }>()
  let frame = 0, wakeTimer = 0, last = 0, frames = 0, disposed = false, failed = false, ready = false, visible = true
  let progress = 0, velocity = 0, targetProgress = 0, scrollDistance = 1, width = 0, height = 0
  let recovering = false
  let movingInk = 0
  let pixelRatio = 0, sceneRatio = 0
  const headerNav = stage.closest('.personal-site')?.querySelector<HTMLElement>('.personal-header nav')
  let menuOpen = headerNav?.classList.contains('is-open') ?? false
  let copyTop = 0, safeBottom = 0
  let lastCategory = '', lastLinks = '', lastUsable: boolean | null = null
  const turns: HelmetTurn[] = CHAPTERS.map(() => ({ yaw: 0, pitch: 0 }))
  const targetTurns: HelmetTurn[] = CHAPTERS.map(() => ({ yaw: 0, pitch: 0 }))
  let interactionIndex = 0, revealStarted: number | undefined
  let keyboardFocus = false, suppressClick = false
  let pointer: { id: number; index: number; x: number; y: number; width: number; start: HelmetTurn; touch: boolean; gesture: HelmetGesture } | null = null
  const alive = () => !disposed && !failed && stage.isConnected
  function manage<T extends Disposable>(resource: T): T { resources.add(resource); return resource }
  function cancelHelmetPointer() {
    const id = pointer?.id
    pointer = null
    helmetControl.dataset.dragging = 'false'
    if (id !== undefined && helmetControl.hasPointerCapture(id)) helmetControl.releasePointerCapture(id)
  }
  function hideHelmetControl(continueFocus = false) {
    cancelHelmetPointer(); suppressClick = true
    if (document.activeElement === helmetControl) {
      helmetControl.blur()
      if (continueFocus && !document.hidden) stage.closest<HTMLElement>('main')?.focus({ preventScroll: true })
    }
    helmetControl.hidden = true
  }
  function stop() { cancelAnimationFrame(frame); clearTimeout(wakeTimer); frame = wakeTimer = 0; last = 0; openingRuntime.suspend(); cancelHelmetPointer() }
  function release(resource: Disposable) {
    if (resource instanceof THREE.Texture && typeof ImageBitmap !== 'undefined' && resource.image instanceof ImageBitmap) resource.image.close()
    resource.dispose()
  }
  function objectResources(object: THREE.Object3D) {
    const owned = new Set<Disposable>()
    object.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return
      owned.add(node.geometry)
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        owned.add(material)
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) owned.add(value)
      }
    })
    return owned
  }
  function own(object: THREE.Object3D) { for (const resource of objectResources(object)) resources.add(resource) }
  function releaseLate(object: THREE.Object3D) { for (const resource of objectResources(object)) release(resource) }
  function teardown() {
    stop(); events.abort()
    hideHelmetControl()
    observers.forEach(observer => observer.disconnect())
    // Release targets, meshes and textures before the renderer clears
    // its resource bookkeeping; disposal order matters for actual GPU deletion.
    for (const resource of [...resources].reverse()) { try { release(resource) } catch { /* Complete remaining cleanup after a lost context. */ } }
    resources.clear(); assets.clear(); assetSources.clear(); actors.length = 0; parts.clear(); actorBounds.clear()
  }
  function releaseCopyFocus() {
    const focused = document.activeElement
    if (!(focused instanceof HTMLElement) || !links.contains(focused) && !title.contains(focused)) return
    focused.blur()
    if (!document.hidden) stage.closest<HTMLElement>('main')?.focus({ preventScroll: true })
  }
  function showChapter(chapter: LandingChapter, index: number, headingHeight: number) {
    if (disposed || !stage.isConnected) return
    // A focused destination must not change underneath a keyboard user,
    // including when reduced motion or the fallback skips the transition.
    if (stage.dataset.chapter !== chapter.id) releaseCopyFocus()
    lastUsable = null
    stage.dataset.chapter = chapter.id
    canvas.dataset.chapter = chapter.id
    category.textContent = chapter.category
    links.hidden = false
    const linkedTitle = chapter.id !== 'helmet'
    title.toggleAttribute('data-linked', linkedTitle)
    title.tabIndex = linkedTitle ? 0 : -1
    if (linkedTitle) {
      title.href = chapter.href
      title.setAttribute('aria-label', `Explore ${chapter.label}`)
    } else {
      title.removeAttribute('href')
      title.removeAttribute('aria-label')
    }
    project.href = chapter.href
    project.setAttribute('aria-label', chapter.id === 'helmet' ? chapter.linkLabel : `Explore ${chapter.label}`)
    setDestinationLabel(project, chapter.linkLabel)
    article.hidden = !chapter.article
    if (chapter.article) {
      article.href = chapter.article.href
      setDestinationLabel(article, chapter.article.label)
    } else article.removeAttribute('href')
    // Keep the composition steady while the title's focus/click box follows
    // its actual lines rather than covering the links underneath.
    copyContent.style.minHeight = `${parseFloat(getComputedStyle(headline).fontSize) * HEADING_RESERVE_EM}px`
    headline.style.minHeight = `${headingHeight}px`
    copyContent.style.setProperty('--links-y', `${headingHeight + (isStackedLanding(stage.clientWidth, stage.clientHeight) ? 16 : 28)}px`)
  }
  const headingMeasure = document.createElement('canvas').getContext('2d')
  function staticCopy() {
    if (disposed || !stage.isConnected) return
    const index = textSequence(targetProgress, 'threshold', true).active, chapter = CHAPTERS[index]
    const style = getComputedStyle(headline)
    const fontSize = parseFloat(style.fontSize), tracking = parseFloat(style.letterSpacing) || 0
    const layout = layoutHeading(chapter, fontSize, headline.getBoundingClientRect().width, row => {
      if (!headingMeasure) return 0
      headingMeasure.font = `${style.fontWeight} ${fontSize * row.scale}px ${style.fontFamily}`
      const tracked = 'letterSpacing' in headingMeasure
      if (tracked) headingMeasure.letterSpacing = `${row.scale < 1 ? 0 : tracking}px`
      return headingMeasure.measureText(row.text).width + (tracked || row.scale < 1 ? 0 : (row.text.length - 1) * tracking)
    })
    renderHeading(headline, layout)
    showChapter(chapter, index, layout.height)
    category.style.opacity = links.style.opacity = '1'
    links.style.transform = 'none'
    links.style.pointerEvents = 'auto'
    links.setAttribute('aria-hidden', 'false')
    project.tabIndex = 0
    article.tabIndex = article.hidden ? -1 : 0
    title.style.pointerEvents = chapter.id === 'helmet' ? 'none' : 'auto'
    title.tabIndex = chapter.id === 'helmet' ? -1 : 0
    delete stage.dataset.textDither
    delete stage.dataset.textPhase
    delete stage.dataset.textSurface
  }
  let fallbackKey = ''
  function refreshFallback() {
    if (disposed || !stage.isConnected) return
    targetProgress = railProgress(scrollY, rail.getBoundingClientRect().top + scrollY, rail.clientHeight, stage.clientHeight)
    const style = getComputedStyle(headline)
    const key = [textSequence(targetProgress, 'threshold', true).active, headline.clientWidth,
      style.fontSize, style.fontWeight, style.fontFamily, style.letterSpacing,
      isStackedLanding(stage.clientWidth, stage.clientHeight)].join('|')
    if (key === fallbackKey) return
    fallbackKey = key
    staticCopy()
  }
  function refreshFallbackFont() { fallbackKey = ''; refreshFallback() }
  function fail() {
    if (disposed || failed) return
    failed = true; ready = false; teardown()
    if (!stage.isConnected) return
    canvas.hidden = true
    canvas.dataset.state = stage.dataset.state = 'error'
    loading.textContent = 'Sculpture unavailable'
    loading.hidden = false
    // GPU resources and their listeners are gone, but readable chapter links
    // still follow scrolling, font arrival and a change in viewport width.
    window.addEventListener('scroll', refreshFallback, { passive: true, signal: fallbackEvents.signal })
    window.addEventListener('resize', refreshFallback, { passive: true, signal: fallbackEvents.signal })
    document.fonts.addEventListener('loadingdone', refreshFallbackFont, { signal: fallbackEvents.signal })
    void document.fonts.ready.then(() => { if (!disposed) refreshFallbackFont() }).catch(() => {})
    refreshFallback()
  }
  function dispose() {
    if (disposed) return
    disposed = true; fallbackEvents.abort(); teardown()
    if (!stage.isConnected) return
    for (const name of ['renderPixels', 'canvasPixels', 'renderScale', 'textDither', 'textPhase', 'textSurface', 'mode', 'motionVariant', 'chapter', 'position', 'motionPhase', 'animatedActors', 'inkMotion', 'inkPassage', 'inkSweep', 'layout', 'state', 'atlasBuilds']) delete stage.dataset[name]
    for (const name of ['appearance', 'state', 'assets', 'assetCount', 'activeAsset', 'chapter', 'scrollFrames', 'firstPaintPosition', 'openingAsset', 'openingMotion', 'openingSeconds', 'helmetYaw', 'helmetPitch', 'helmetDither', 'sculptureYaw', 'sculpturePitch', 'mechanicalParts', 'sculptureMotion']) delete canvas.dataset[name]
  }
  const positionKey = 'personal-site:landing-scroll:v1'
  function restorePosition() {
    try {
      const saved = sessionStorage.getItem(positionKey)
      sessionStorage.removeItem(positionKey)
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (!saved || navigation?.type !== 'reload') return
      const value: unknown = JSON.parse(saved)
      if (!value || typeof value !== 'object' || !('progress' in value) || !('beyond' in value)) return
      const { progress: position, beyond } = value
      if (typeof position !== 'number' || !Number.isFinite(position) || position < 0 || position > 1 || typeof beyond !== 'number' || !Number.isFinite(beyond) || beyond < 0) return
      const top = rail.getBoundingClientRect().top + scrollY, distance = Math.max(1, rail.clientHeight - stage.clientHeight)
      window.scrollTo({ top: top + position * distance + beyond, behavior: 'instant' })
    } catch { /* Storage is optional; native scrolling and rendering remain available. */ }
  }
  window.addEventListener('pagehide', () => {
    if (!alive()) return
    try {
      const top = rail.getBoundingClientRect().top + scrollY, distance = Math.max(1, rail.clientHeight - stage.clientHeight)
      sessionStorage.setItem(positionKey, JSON.stringify({ progress: railProgress(scrollY, top, rail.clientHeight, stage.clientHeight), beyond: Math.max(0, scrollY - top - distance) }))
    } catch { /* Private browsing may disable session storage. */ }
  }, { signal: events.signal })

  try {
    const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
    const renderer = manage(new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' }))
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25))
    renderer.localClippingEnabled = true
    renderer.setClearColor('#eeeadd', 0)
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(32, 1, .05, 90)
    const key = new THREE.DirectionalLight(0xffffff, 3), fill = new THREE.DirectionalLight(0xffffff, .65)
    key.position.set(-3, 5, 5); fill.position.set(5, 2, -3)
    scene.add(key, fill, new THREE.AmbientLight(0xffffff, .2))
    const room = manage(new RoomEnvironment()), pmrem = manage(new THREE.PMREMGenerator(renderer))
    const environment = manage(pmrem.fromScene(room))
    scene.environment = environment.texture
    scene.environmentIntensity = 1.05
    room.dispose(); resources.delete(room)
    pmrem.dispose(); resources.delete(pmrem)
    const paper = new THREE.Uniform(new THREE.Color('#eeeadd')), ink = new THREE.Uniform(new THREE.Color('#24241f'))
    const targetA = manage(new THREE.WebGLRenderTarget(1, 1)), targetB = manage(new THREE.WebGLRenderTarget(1, 1))
    // Match the former composer's color-managed scene buffers. Dither, palette,
    // portal composition and type now share one final pass instead of six copies.
    for (const target of [targetA, targetB]) target.texture.colorSpace = THREE.SRGBColorSpace
    const targetMask = manage(createPortalMaskTarget(1, 1)), targetFrame = manage(new THREE.WebGLRenderTarget(1, 1))
    const portalScene = new THREE.Scene(), portalCamera = new THREE.PerspectiveCamera(32, 1, .05, 90)
    portalCamera.position.set(0, 0, 5.9); portalCamera.lookAt(0, 0, 0)
    portalScene.environment = environment.texture
    const portalKey = new THREE.DirectionalLight(0xffffff, 3), portalFill = new THREE.DirectionalLight(0xffffff, .7)
    portalKey.position.set(-3, 5, 5); portalFill.position.set(4, -1, 3)
    portalScene.add(portalKey, portalFill, new THREE.AmbientLight(0xffffff, .2))
    const openingMaterial = manage(new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false }))
    let portal: Portal | null = null
    const textUniforms: DitheredTextUniforms = {
      textEnabled: { value: 0 }, textAtlas: { value: null }, textBox: { value: new THREE.Vector4() },
      textState: { value: CHAPTERS.map(() => new THREE.Vector2()) }, textMeasure: { value: CHAPTERS.map(() => new THREE.Vector2()) },
      textPixels: { value: new THREE.Vector2() }, textGrid: { value: 1 },
      scrollInk: { value: 0 }, scrollPhase: { value: 0 }, scrollPassage: { value: 0 }, scrollSweep: { value: 0 },
    }
    const screenUniforms = {
      a: { value: targetA.texture }, b: { value: targetB.texture }, portalMask: { value: targetMask.texture }, portalFrame: { value: targetFrame.texture },
      portalEnabled: { value: 0 }, portalTextLeg: { value: 0 }, portalRim: { value: 0 }, framePaper: { value: paper.value }, frameInk: { value: ink.value },
      exposureA: { value: -1 }, exposureB: { value: -1 }, darkA: { value: 0 }, darkB: { value: 0 },
      outputRatio: { value: 1 }, sculptureReveal: { value: 0 }, sculptureSeconds: { value: 0 }, sculptureGrain: { value: 0 }, scenePixels: { value: new THREE.Vector2(1, 1) }, paperA: { value: paper.value.clone() }, inkA: { value: ink.value.clone() },
      paperB: { value: paper.value.clone() }, inkB: { value: ink.value.clone() }, ...textUniforms,
    }
    const screenScene = new THREE.Scene(), screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const screenMaterial = manage(new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: screenUniforms, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: screenFragmentShader }))
    const screenGeometry = manage(new THREE.PlaneGeometry(2, 2))
    screenScene.add(new THREE.Mesh(screenGeometry, screenMaterial))
    const printed = manage(createDitheredText({ headline, stage, uniforms: textUniforms, pixelRatio: () => renderer.getPixelRatio(), onChapter: showChapter, isAlive: alive }))
    // Abort unfinished downloads on departure and let an active decode settle
    // before terminating its worker. A late response must not restart Draco.
    const loader = manage(createPortfolioModelLoader())
    canvas.hidden = true
    canvas.dataset.state = stage.dataset.state = 'loading'
    stage.dataset.mode = 'threshold'
    stage.dataset.motionVariant = '1'

    async function asset(chapter: LandingChapter) {
      const sourceUrl = portfolioAssetUrl(chapter.assetId)
      const gltf = await loader.load(sourceUrl, events.signal)
      if (!alive()) { releaseLate(gltf.scene); return }
      own(gltf.scene)
      const group = new THREE.Group()
      if (chapter.id === 'helmet') {
        const mesh = gltf.scene.getObjectByName('Object_2')
        if (!(mesh instanceof THREE.Mesh)) throw Error('Helmet unavailable')
        mesh.position.set(-2.016, -.06, 1.381); mesh.rotation.set(-1.601, .068, 2.296); mesh.scale.setScalar(.038)
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) if (material instanceof THREE.MeshStandardMaterial) material.roughness = .23
        group.add(mesh); group.rotation.set(0, -Math.PI / 3.5, -.25)
      } else {
        group.add(gltf.scene)

      }
      const bounds = new THREE.Box3().setFromObject(group), extent = bounds.getSize(new THREE.Vector3())
      if (!Number.isFinite(extent.length()) || !Math.max(extent.x, extent.y, extent.z)) throw Error('Sculpture bounds unavailable')
      group.position.sub(bounds.getCenter(new THREE.Vector3()))
      const root = new THREE.Group()
      root.add(group); root.scale.setScalar(2 / Math.max(extent.x, extent.y, extent.z))
      assets.set(chapter.id, root)
      assetSources.set(chapter.id, sourceUrl)
    }
    async function loadPortal(): Promise<Portal | null> {
      const gltf = await loader.load(assetUrl('landing/threshold-lens.glb'), events.signal)
      if (!alive()) { releaseLate(gltf.scene); return null }
      own(gltf.scene)
      const frames: THREE.Mesh[] = [], openings: THREE.Mesh[] = [], clip = gltf.animations.find(animation => animation.name === 'Open')
      gltf.scene.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return
        if (node.name.startsWith('Frame')) frames.push(node)
        if (node.name === 'Opening') { openings.push(node); node.material = openingMaterial }
      })
      if (!clip || !frames.length || !openings.length) throw Error('Threshold GLB is incomplete')
      const track = clip.tracks.find(candidate => candidate.name.endsWith('.scale')), animated = track && gltf.scene.getObjectByName(track.name.slice(0, -6))
      if (!track || !animated) throw Error('Threshold scale track is unavailable')
      const wrapper = new THREE.Group()
      wrapper.add(gltf.scene); wrapper.visible = false; portalScene.add(wrapper)
      const sampleScale = createScaleSampler(track.times, track.values)
      openings[0].geometry.computeBoundingBox()
      const openingSize = openings[0].geometry.boundingBox!.getSize(new THREE.Vector3())
      const result = { wrapper, frames, openings, animated, sampleScale, sampleAperture: createApertureSampler(sampleScale, clip.duration, 1, 1), openingSize, scaleValues: new Float64Array(3), duration: clip.duration }
      retimePortal(result)
      await compileTo(wrapper, portalCamera, portalScene, targetFrame)
      return result
    }
    function actor(chapter: LandingChapter, index: number) {
      const source = assets.get(chapter.id)
      if (!source) throw Error('Sculpture is incomplete')
      const object = new THREE.Group(), articulated: Part[] = []
      object.add(source.clone(true))
      object.rotation.set(rotations[index][0], rotations[index][1], rotations[index][2])
      const bounds = new THREE.Box3().setFromObject(object, true)
      actorBounds.set(object, { size: bounds.getSize(new THREE.Vector3()), center: bounds.getCenter(new THREE.Vector3()) })
      object.rotation.set(0, 0, 0)
      object.traverse(node => {
        const motion = mechanicalMotion(node.userData.articulationMotion)
        if (!node.name.startsWith('hover-') && !motion) return
        const declared: unknown = node.userData.articulationAxis
        const axis = Array.isArray(declared) && declared.length === 3 && declared.every(Number.isFinite) ? new THREE.Vector3(declared[0], declared[1], declared[2]) : new THREE.Vector3(0, 1, 0)
        if (axis.lengthSq() < .001) axis.set(0, 1, 0)
        articulated.push({ node, quaternion: node.quaternion.clone(), axis: axis.normalize(), motion })
      })
      object.visible = false
      parts.set(object, articulated); scene.add(object)
      return object
    }
    const inFlight = new Map<number, Promise<void>>(), unavailable = new Set<number>()
    let portalRequest: Promise<void> | null = null, portalUnavailable = false, prefetchIndex = -1, screenReady = false
    const screenCompiled = renderer.compileAsync(screenScene, screenCamera)
    function compileTo(object: THREE.Object3D, view: THREE.Camera, targetScene: THREE.Scene, target: THREE.WebGLRenderTarget) {
      // Offscreen passes use a different output color space and shader cache key.
      renderer.setRenderTarget(target)
      try { return renderer.compileAsync(object, view, targetScene) }
      finally { renderer.setRenderTarget(null) }
    }
    function load(index: number): Promise<void> {
      const pending = inFlight.get(index)
      if (pending) return pending
      const promise = asset(CHAPTERS[index]).then(async () => {
        if (!alive()) return
        const object = actor(CHAPTERS[index], index)
        for (const resource of objectResources(object)) if (resource instanceof THREE.Texture) renderer.initTexture(resource)
        await compileTo(object, camera, scene, targetA)
        if (!alive()) return
        actors[index] = object
        canvas.dataset.assetCount = String(actors.filter(Boolean).length)
        available()
      }).catch(() => { if (alive()) { unavailable.add(index); available() } })
      inFlight.set(index, promise)
      return promise
    }
    function requestPortal() {
      if (!portalRequest) portalRequest = loadPortal().then(result => {
        if (!alive()) return
        portal = result
        if (portal) retimePortal(portal)
        available()
      }).catch(() => { if (alive()) { portalUnavailable = true; available() } })
      return portalRequest
    }
    function ensure(p: number) {
      const required = requiredScene(p, reduced.matches)
      if (required.indexes.some(index => unavailable.has(index)) || required.portal && portalUnavailable) { fail(); return false }
      for (const index of required.indexes) if (!actors[index]) void load(index)
      if (required.portal && !portal) void requestPortal()
      return required.indexes.every(index => actors[index]) && (!required.portal || Boolean(portal))
    }
    function available() {
      if (!alive() || !screenReady) return
      if (!ready) {
        if (!ensure(targetProgress)) return
        // A restored scroll position starts in its actual scene, with no opening traversal.
        progress = targetProgress; velocity = 0; ready = true
        canvas.dataset.assets = 'glb'
        canvas.dataset.openingAsset = portfolioAssetUrl('helmet')
      }
      request()
    }
    function prefetch() {
      const { local } = sceneSequence(progress), travel = thresholdMotion(local).travel
      if (!reduced.matches && travel !== 0 && travel !== 1) return
      const index = Math.min(textSequence(targetProgress, 'threshold', true).active + 1, CHAPTERS.length - 1)
      if (index === prefetchIndex) return
      prefetchIndex = index
      // Prepare one adjacent chapter, without decoding the entire collection at the opening.
      if (!reduced.matches) void requestPortal()
      void load(index)
    }
    function retimePortal(value: Portal) {
      const span = 2 * portalCamera.position.z * Math.tan(THREE.MathUtils.degToRad(portalCamera.fov / 2))
      const scale = isStackedLanding(width, height) ? .35 : .9
      value.sampleAperture = createApertureSampler(value.sampleScale, value.duration, value.openingSize.x * scale / (span * portalCamera.aspect), value.openingSize.y * scale / span)
    }
    function colors() { paper.value.set(dark ? '#111210' : '#eeeadd'); ink.value.set(dark ? '#efefe8' : '#24241f') }
    function articulate(object: THREE.Object3D, amount: number) {
      for (const part of parts.get(object) ?? []) {
        part.node.quaternion.copy(part.quaternion)
        part.node.rotateOnAxis(part.axis, part.motion ? mechanicalAngle(part.motion, openingRuntime.seconds, reduced.matches) : amount)
      }
    }
    function copyPresentation(sequence: TextSequence, motion: ReturnType<typeof thresholdMotion>, leg: number) {
      const incoming = sequence.active > leg, state = sequence.states[sequence.active]
      const categoryAlpha = reduced.matches ? 1 : incoming ? motion.incomingCategory : motion.outgoingCategory
      const linksAlpha = reduced.matches ? 1 : incoming ? motion.incomingLinks : motion.outgoingLinks
      const readable = state.reveal > .999 && state.erase < .001
      const usable = readable && linksAlpha > .98, titleUsable = usable && CHAPTERS[sequence.active].id !== 'helmet'
      const categoryValue = categoryAlpha.toFixed(3), linkValue = linksAlpha.toFixed(3)
      if (categoryValue !== lastCategory) { category.style.opacity = categoryValue; lastCategory = categoryValue }
      if (linkValue !== lastLinks) { links.style.opacity = linkValue; links.style.transform = `translateY(${((1 - linksAlpha) * 3).toFixed(2)}px)`; lastLinks = linkValue }
      if (usable !== lastUsable) {
        if (!usable) releaseCopyFocus()
        links.style.pointerEvents = usable ? 'auto' : 'none'
        links.setAttribute('aria-hidden', String(!usable))
        project.tabIndex = usable ? 0 : -1
        article.tabIndex = usable && !article.hidden ? 0 : -1
        title.style.pointerEvents = titleUsable ? 'auto' : 'none'
        title.tabIndex = titleUsable ? 0 : -1
        lastUsable = usable
      }
    }
    function pose() {
      const mobile = isStackedLanding(width, height), p = reduced.matches ? textSequence(targetProgress, 'threshold', true).active / 4 : progress
      for (const object of actors) if (object) { object.visible = false; object.position.set(0, 0, 0); object.rotation.set(0, 0, 0); object.scale.setScalar(1) }
      camera.position.set(0, 0, mobile ? 6.1 : 5.9); camera.lookAt(0, 0, 0)
      key.position.set(-3, 5, 5); colors()
      const sequence = sceneSequence(p), motion = thresholdMotion(sequence.local)
      textUniforms.scrollPhase.value = p * 52
      textUniforms.scrollInk.value = movingInk * (mobile ? .65 : 1)
      const grain = scrollDitherPassage(p, mobile, reduced.matches)
      textUniforms.scrollPassage.value = grain.strength
      textUniforms.scrollSweep.value = grain.sweep
      const typography = printed.update(p, reduced.matches)
      copyPresentation(typography, motion, sequence.leg)
      stage.dataset.position = p.toFixed(4)
      stage.dataset.motionPhase = reduced.matches ? 'held' : cinematicPhase(sequence.local)
      stage.dataset.inkMotion = textUniforms.scrollInk.value.toFixed(4)
      stage.dataset.inkPassage = grain.strength.toFixed(4)
      stage.dataset.inkSweep = grain.sweep.toFixed(4)
      stage.dataset.layout = mobile ? 'stacked' : 'wide'
      return { mobile, motion, ...sequence }
    }
    function screen(texture: THREE.Texture, index: number) {
      renderer.setRenderTarget(null)
      screenUniforms.a.value = screenUniforms.b.value = screenUniforms.portalMask.value = screenUniforms.portalFrame.value = texture
      screenUniforms.paperA.value.copy(paper.value); screenUniforms.inkA.value.copy(ink.value)
      screenUniforms.exposureA.value = LANDING_ART[index].exposure; screenUniforms.darkA.value = Number(dark)
      screenUniforms.portalEnabled.value = 0; printed.surface(false)
      renderer.render(screenScene, screenCamera); renderer.setRenderTarget(null)
    }
    function renderTo(target: THREE.WebGLRenderTarget) { renderer.setRenderTarget(target); renderer.render(scene, camera); renderer.setRenderTarget(null) }
    function renderPortal(amount: number, center: THREE.Vector2, local: number, leg: number) {
      if (!portal) return
      const span = 2 * portalCamera.position.z * Math.tan(THREE.MathUtils.degToRad(portalCamera.fov / 2))
      portal.wrapper.visible = amount > .001
      portal.sampleAperture(amount, portal.scaleValues)
      portal.animated.scale.fromArray(portal.scaleValues)
      const optical = portalPose(local, leg, isStackedLanding(width, height))
      const origin = center.clone().lerp(new THREE.Vector2(.5, .5), optical.center)
      portal.wrapper.position.set((origin.x - .5) * span * portalCamera.aspect, (origin.y - .5) * span, 0)
      portal.wrapper.rotation.set(optical.pitch, optical.yaw, optical.roll)
      portal.wrapper.scale.setScalar(isStackedLanding(width, height) ? .35 : .9)
      for (const mesh of portal.frames) mesh.visible = false
      for (const mesh of portal.openings) mesh.visible = true
      renderer.setClearColor(0x000000, 1); renderer.setRenderTarget(targetMask); renderer.render(portalScene, portalCamera); renderer.setRenderTarget(null)
      for (const mesh of portal.frames) mesh.visible = true
      for (const mesh of portal.openings) mesh.visible = false
      colors()
      renderer.setClearColor('#eeeadd', 0); renderer.setRenderTarget(targetFrame); renderer.render(portalScene, portalCamera); renderer.setRenderTarget(null); renderer.setClearColor('#eeeadd', 0)
      screenUniforms.a.value = targetA.texture; screenUniforms.b.value = targetB.texture
      screenUniforms.portalMask.value = targetMask.texture; screenUniforms.portalFrame.value = targetFrame.texture
      screenUniforms.portalEnabled.value = 1; printed.surface(true)
      screenUniforms.portalRim.value = portalFrameOpacity(local)
      renderer.setRenderTarget(null); renderer.render(screenScene, screenCamera)
    }
    function modelPose(object: THREE.Group, index: number, local: number, mobile: boolean, incoming = false) {
      const pose = sculpturePose(local, incoming, index, mobile), rotation = rotations[index], art = LANDING_ART[index]
      const bounds = actorBounds.get(object)!
      if (mobile) {
        const chapter = CHAPTERS[index]
        const frame = mobileSculptureFrame(width, height, copyTop, printed.blockHeight(chapter), 1, chapter.id !== 'helmet' && chapter.article ? 2 : 1, bounds.size, safeBottom)
        object.position.set(frame.x - bounds.center.x * frame.scale + pose.x, frame.y - bounds.center.y * frame.scale + pose.y, -bounds.center.z * frame.scale)
        object.scale.setScalar(frame.scale * pose.scale)
      } else {
        const frame = desktopSculptureFrame(width, height, index, bounds.size)
        object.position.set(frame.x - bounds.center.x * frame.scale + pose.x, frame.y - bounds.center.y * frame.scale + pose.y, -bounds.center.z * frame.scale)
        object.scale.setScalar(frame.scale * pose.scale)
      }
      object.rotation.set(rotation[0] + pose.pitch, rotation[1] + pose.yaw * art.turn, rotation[2] + pose.roll)
      const weight = sculptureRestWeight(progress, index, reduced.matches)
      object.rotation.x += turns[index].pitch * weight
      object.rotation.y += turns[index].yaw * weight
      const living = sculptureLivingPose(openingRuntime.seconds, index, mobile, reduced.matches)
      object.rotation.x += living.pitch
      object.rotation.y += living.yaw
      object.rotation.z += living.roll
      object.position.x += living.x
      object.position.y += living.y
      articulate(object, pose.articulation * art.turn)
    }
    function prepareShot(object: THREE.Group, index: number, local: number, mobile: boolean, incoming = false) {
      modelPose(object, index, local, mobile, incoming)
      const shot = cinematicShot(local, incoming, mobile, index)
      camera.position.set(shot.x, shot.y, (mobile ? 6.1 : 5.9) + shot.depth)
      camera.lookAt(shot.aimX, shot.aimY, 0)
      key.position.set(-3 + shot.lightX, 5 + shot.lightY, 5)
      key.intensity = index === 0 ? 2.4 : 3
      scene.environmentIntensity = index === 0 ? .75 : 1.05
    }
    function projectedAnchor(object: THREE.Group, index: number) {
      object.updateMatrixWorld(true)
      const anchor = new THREE.Vector3().copy(object.position).addScaledVector(actorBounds.get(object)!.center, object.scale.x)
      if (index === 0) anchor.y += .18 * object.scale.y
      anchor.project(camera)
      return new THREE.Vector2((anchor.x + 1) / 2, (anchor.y + 1) / 2)
    }
    function interactionRegion(mobile: boolean) {
      // A stable region, independent of the drag pose, keeps manipulation predictable.
      const index = textSequence(progress, 'threshold', reduced.matches, mobile).active
      const object = actors[index], bounds = object && actorBounds.get(object)
      if (!bounds) { hideHelmetControl(); return }
      if (index !== interactionIndex) { hideHelmetControl(true); interactionIndex = index }
      helmetControl.setAttribute('aria-label', index === 0 ? 'Rotate helmet' : `Rotate ${CHAPTERS[index].label} sculpture`)
      helmetControl.dataset.chapter = CHAPTERS[index].id
      let left: number, top: number, right: number, bottom: number
      if (mobile) {
        const chapter = CHAPTERS[index]
        const fit = mobileSculptureFrame(width, height, copyTop, printed.blockHeight(chapter), 1, chapter.id !== 'helmet' && chapter.article ? 2 : 1, bounds.size, safeBottom)
        left = width * .02; right = width * .98; top = fit.top; bottom = fit.bottom
      } else {
        const fit = desktopSculptureFrame(width, height, index, bounds.size)
        const focal = height / (2 * Math.tan(16 * Math.PI / 180))
        const depth = 5.9 - bounds.size.z * fit.scale / 2
        const x = width / 2 + fit.x * focal / 5.9, y = height / 2 - fit.y * focal / 5.9
        const halfX = bounds.size.x * fit.scale * focal / depth / 2, halfY = bounds.size.y * fit.scale * focal / depth / 2
        left = Math.max(width * .44, x - halfX - 24); right = Math.min(width * .99, x + halfX + 24)
        top = Math.max(72, y - halfY - 12); bottom = Math.min(height - 12, y + halfY + 35)
      }
      helmetControl.style.left = `${left}px`; helmetControl.style.top = `${top}px`
      helmetControl.style.width = `${Math.max(44, right - left)}px`; helmetControl.style.height = `${Math.max(44, bottom - top)}px`
      const active = !menuOpen && lastUsable === true && sculptureRestWeight(progress, index, reduced.matches) > .05 && sculptureRestWeight(targetProgress, index, reduced.matches) > .05
      if (!active && !helmetControl.hidden) {
        hideHelmetControl(true)
      }
      helmetControl.hidden = !active
    }
    function draw() {
      if (!alive() || !ready || !visible || !width || !height || document.hidden) return
      if (!ensure(reduced.matches ? targetProgress : progress)) return
      const { mobile, leg, local, motion } = pose()
      screenUniforms.sculptureSeconds.value = openingRuntime.seconds
      screenUniforms.sculptureGrain.value = reduced.matches ? 0 : .025
      if (reduced.matches) {
        for (const object of actors) if (object) object.visible = false
        const index = textSequence(targetProgress, 'threshold', true).active
        actors[index]!.visible = true
        prepareShot(actors[index]!, index, 0, mobile)
        colors(); renderTo(targetA); screen(targetA.texture, index)
      } else if (motion.travel === 0 || motion.travel === 1) {
        const destination = motion.travel === 1, index = leg + Number(destination), object = actors[index]!
        object.visible = true; prepareShot(object, index, local, mobile, destination)
        colors(); renderTo(targetA); screen(targetA.texture, index)
      } else {
        const from = actors[leg]!, to = actors[leg + 1]!
        from.visible = true; prepareShot(from, leg, local, mobile); colors(); renderTo(targetA)
        screenUniforms.exposureA.value = LANDING_ART[leg].exposure; screenUniforms.darkA.value = Number(dark)
        screenUniforms.paperA.value.copy(paper.value); screenUniforms.inkA.value.copy(ink.value)
        const anchor = projectedAnchor(from, leg)
        from.visible = false; to.visible = true; prepareShot(to, leg + 1, local, mobile, true); colors(); renderTo(targetB)
        screenUniforms.exposureB.value = LANDING_ART[leg + 1].exposure; screenUniforms.darkB.value = Number(dark)
        screenUniforms.paperB.value.copy(paper.value); screenUniforms.inkB.value.copy(ink.value)
        screenUniforms.portalTextLeg.value = leg
        renderPortal(motion.travel, anchor, local, leg)
      }
      if (!frames) canvas.dataset.firstPaintPosition = progress.toFixed(4)
      canvas.hidden = false; loading.hidden = true
      canvas.dataset.state = stage.dataset.state = 'ready'
      canvas.dataset.appearance = dark ? 'dark' : 'light'
      canvas.dataset.openingSeconds = openingRuntime.seconds.toFixed(4)
      const visibleIndexes = requiredScene(reduced.matches ? targetProgress : progress, reduced.matches).indexes
      const animated = sculptureAnimationActive(reduced.matches, visible, menuOpen, !!pointer, keyboardFocus, stage.dataset.motionPlaying !== 'false')
      stage.dataset.animatedActors = animated ? visibleIndexes.map(index => CHAPTERS[index].id).join(',') : ''
      canvas.dataset.openingMotion = reduced.matches ? 'reduced' : !visibleIndexes.includes(0) ? 'inactive' : animated ? 'playing' : 'paused'
      canvas.dataset.helmetYaw = turns[0].yaw.toFixed(4)
      canvas.dataset.helmetPitch = turns[0].pitch.toFixed(4)
      canvas.dataset.helmetDither = 'engraved-live'
      interactionRegion(mobile)
      canvas.dataset.activeAsset = assetSources.get(CHAPTERS[interactionIndex].id)!
      canvas.dataset.sculptureYaw = turns[interactionIndex].yaw.toFixed(4)
      canvas.dataset.sculpturePitch = turns[interactionIndex].pitch.toFixed(4)
      canvas.dataset.mechanicalParts = String((parts.get(actors[interactionIndex]!) ?? []).filter(part => part.motion).length)
      canvas.dataset.sculptureMotion = reduced.matches ? 'reduced' : animated ? 'playing' : 'paused'
      canvas.dataset.scrollFrames = String(++frames)
      if (screenUniforms.sculptureReveal.value === 1) prefetch()
    }
    function request(delay = 0) {
      if (!alive() || !ready || !visible || document.hidden || stage.dataset.covered === 'true' || frame) return
      if (wakeTimer) {
        if (delay > 0) return
        clearTimeout(wakeTimer); wakeTimer = 0
      }
      if (delay > 1) wakeTimer = window.setTimeout(() => { wakeTimer = 0; request() }, delay)
      else frame = requestAnimationFrame(tick)
    }
    function tick(time: number) {
      frame = 0
      if (stage.dataset.covered === 'true') { stop(); return }
      if (!alive() || !ready || !visible || document.hidden) return
      const seconds = last ? (time - last) / 1000 : 1 / 60
      last = time
      let motion = advanceScrollMotion({ progress, velocity }, targetProgress, seconds, reduced.matches, recovering ? height / scrollDistance * 1.25 : Infinity)
      if (Math.abs(motion.progress - targetProgress) * scrollDistance < .1 && Math.abs(motion.velocity) * scrollDistance < 2) motion = { progress: targetProgress, velocity: 0 }
      // Demand-load first; retain a living, fully painted scene while decoding.
      // A late asset must not consume the passage and appear at its final frame.
      const waiting = !ensure(reduced.matches ? targetProgress : motion.progress)
      if (!waiting) { progress = motion.progress; velocity = motion.velocity }
      else { velocity = 0; recovering = true }
      if (reduced.matches || Math.abs(progress - targetProgress) * scrollDistance < 2) recovering = false
      const scrolling = progress !== targetProgress || velocity !== 0
      movingInk = advanceScrollInk(movingInk, scrollInkStrength(velocity, scrollDistance, height, reduced.matches), seconds, reduced.matches)
      const inking = movingInk > 0
      let interacting = false
      for (let index = 0; index < turns.length; index++) {
        turns[index] = settleHelmet(turns[index], targetTurns[index], seconds, reduced.matches || pointer?.index === index && pointer.gesture === 'rotate')
        interacting ||= turns[index].yaw !== targetTurns[index].yaw || turns[index].pitch !== targetTurns[index].pitch
      }
      const sceneReady = ensure(reduced.matches ? targetProgress : progress)
      const living = sculptureAnimationActive(reduced.matches, visible, menuOpen, !!pointer, keyboardFocus, stage.dataset.motionPlaying !== 'false', sceneReady)
      if (!sceneReady) openingRuntime.suspend()
      if (sceneReady) revealStarted ??= time
      screenUniforms.sculptureReveal.value = openingInkReveal(revealStarted === undefined ? 0 : time - revealStarted, reduced.matches)
      const revealing = screenUniforms.sculptureReveal.value < 1
      // Keep native scroll responsive. Only the idle sculpture uses the shared 30 Hz budget.
      if (openingRuntime.canPaint(time, scrolling && !waiting || inking || interacting || revealing || !!pointer || !living)) {
        if (sceneReady && openingRuntime.advance(time, living, scrolling && !waiting || inking || interacting || revealing || !!pointer)) size()
        try { draw() } catch { fail(); return }
      }
      if (waiting && !inking && !interacting && !revealing) request(openingRuntime.paintDelay(time))
      else if (scrolling || inking || interacting || revealing) request()
      else if (living) request(openingRuntime.paintDelay(time))
      else { last = 0; openingRuntime.suspend() }
    }
    function measure() {
      if (!alive()) return
      scrollDistance = Math.max(1, rail.clientHeight - stage.clientHeight)
      targetProgress = railProgress(scrollY, rail.getBoundingClientRect().top + scrollY, rail.clientHeight, stage.clientHeight)
      if (stage.dataset.covered === 'true') { stop(); hideHelmetControl(); return }
      if (!helmetControl.hidden && sculptureRestWeight(targetProgress, interactionIndex, reduced.matches) < .05) hideHelmetControl(true)
      if (targetProgress > 0 && !portal && !reduced.matches) void requestPortal()
      ensure(targetProgress)
      request()
    }
    function size() {
      if (!alive()) return
      try {
        const nextWidth = stage.clientWidth, nextHeight = stage.clientHeight
        const budget = landingRenderBudget(nextWidth, nextHeight, devicePixelRatio, matchMedia('(pointer: coarse)').matches, openingRuntime.scale), nextRatio = budget.canvasRatio
        if (!nextWidth || !nextHeight) return
        const canvasChanged = nextWidth !== width || nextHeight !== height || nextRatio !== pixelRatio
        if (canvasChanged) {
          cancelHelmetPointer()
          width = nextWidth; height = nextHeight; pixelRatio = nextRatio
          renderer.setPixelRatio(pixelRatio)
          screenUniforms.outputRatio.value = pixelRatio
          renderer.setSize(width, height, false)
          screenUniforms.scenePixels.value.set(Math.round(width * pixelRatio), Math.round(height * pixelRatio))
          camera.aspect = width / height; camera.updateProjectionMatrix()
          portalCamera.aspect = width / height; portalCamera.updateProjectionMatrix()
          if (portal) retimePortal(portal)
        }
        if (canvasChanged || budget.sceneRatio !== sceneRatio) {
          sceneRatio = budget.sceneRatio
          targetA.setSize(Math.round(width * budget.sceneRatio), Math.round(height * budget.sceneRatio))
          stage.dataset.renderPixels = String(targetA.width * targetA.height)
          stage.dataset.canvasPixels = String(Math.round(width * pixelRatio) * Math.round(height * pixelRatio))
          for (const target of [targetB, targetMask, targetFrame]) target.setSize(targetA.width, targetA.height)
          stage.dataset.renderScale = String(budget.resolutionScale)
        }
        copyTop = headline.getBoundingClientRect().top - stage.getBoundingClientRect().top
        const linkBottom = parseFloat(getComputedStyle(links).bottom)
        safeBottom = Number.isFinite(linkBottom) ? Math.max(0, linkBottom - 50) : 0
        printed.resize(); measure()
        if (ready && !ensure(reduced.matches ? targetProgress : progress) && alive()) {
          canvas.hidden = true
          staticCopy()
        }
      } catch { fail() }
    }
    window.addEventListener('scroll', measure, { passive: true, signal: events.signal })
    window.addEventListener('resize', size, { passive: true, signal: events.signal })
    document.addEventListener('visibilitychange', () => { stop(); if (document.hidden) hideHelmetControl(); else measure() }, { signal: events.signal })
    reduced.addEventListener('change', () => { stop(); measure() }, { signal: events.signal })
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail() }, { signal: events.signal })
    helmetControl.addEventListener('pointerdown', event => {
      if (!event.isPrimary) { cancelHelmetPointer(); request(); return }
      if (event.button !== 0 || helmetControl.hidden) return
      keyboardFocus = false; suppressClick = false
      const touch = event.pointerType === 'touch'
      pointer = { id: event.pointerId, index: interactionIndex, x: event.clientX, y: event.clientY, width: helmetControl.clientWidth, start: { ...targetTurns[interactionIndex] }, touch, gesture: touch ? 'pending' : 'rotate' }
      if (!touch) { event.preventDefault(); helmetControl.setPointerCapture(event.pointerId); helmetControl.dataset.dragging = 'true' }
      request()
    }, { signal: events.signal })
    helmetControl.addEventListener('pointermove', event => {
      if (pointer?.id === event.pointerId) {
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y
        if (Math.hypot(dx, dy) > 4) suppressClick = true
        if (pointer.gesture === 'pending') pointer.gesture = helmetGesture(dx, dy)
        if (pointer.gesture === 'scroll') { cancelHelmetPointer(); request(); return }
        if (pointer.gesture === 'rotate') {
          if (!helmetControl.hasPointerCapture(event.pointerId)) helmetControl.setPointerCapture(event.pointerId)
          helmetControl.dataset.dragging = 'true'
          targetTurns[pointer.index] = dragHelmet(pointer.start, dx, dy, pointer.width, pointer.touch)
          request()
        }
      }
    }, { signal: events.signal })
    helmetControl.addEventListener('pointerup', event => { if (pointer?.id === event.pointerId) { cancelHelmetPointer(); request() } }, { signal: events.signal })
    for (const eventName of ['pointercancel', 'lostpointercapture']) helmetControl.addEventListener(eventName, () => { if (!pointer) return; suppressClick = true; cancelHelmetPointer(); request() }, { signal: events.signal })
    helmetControl.addEventListener('click', event => {
      if (suppressClick && event.detail) { suppressClick = false; return }
      const target = targetTurns[interactionIndex]
      targetTurns[interactionIndex] = helmetKey(target, target.yaw >= Math.PI - .18 ? 'Home' : 'ArrowRight')!
      request()
    }, { signal: events.signal })
    helmetControl.addEventListener('dblclick', () => { targetTurns[interactionIndex] = { yaw: 0, pitch: 0 }; request() }, { signal: events.signal })
    helmetControl.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const next = helmetKey(targetTurns[interactionIndex], event.key)
      if (!next) return
      event.preventDefault(); keyboardFocus = true
      targetTurns[interactionIndex] = next; request()
    }, { signal: events.signal })
    helmetControl.addEventListener('focus', () => { keyboardFocus = helmetControl.matches(':focus-visible'); request() }, { signal: events.signal })
    helmetControl.addEventListener('blur', () => { keyboardFocus = false; request() }, { signal: events.signal })
    // Repaint the current pose when the shared theme changes; retain all decoded assets.
    const appearanceObserver = new MutationObserver(() => {
      const next = document.documentElement.dataset.appearance === 'dark'
      if (next === dark) return
      dark = next
      request()
    })
    appearanceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-appearance'] })
    observers.push(appearanceObserver)
    const motionObserver = new MutationObserver(() => { stop(); measure() })
    motionObserver.observe(stage, { attributes: true, attributeFilter: ['data-motion-playing'] })
    observers.push(motionObserver)
    if (headerNav) {
      const menuObserver = new MutationObserver(() => {
        const next = headerNav.classList.contains('is-open')
        if (next === menuOpen) return
        menuOpen = next
        stop(); if (menuOpen) hideHelmetControl()
        measure()
      })
      menuObserver.observe(headerNav, { attributes: true, attributeFilter: ['class'] })
      observers.push(menuObserver)
    }
    const resizeObserver = new ResizeObserver(size)
    resizeObserver.observe(stage); resizeObserver.observe(rail); resizeObserver.observe(headline)
    observers.push(resizeObserver)
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (!visible) { stop(); hideHelmetControl() } else measure()
    })
    visibilityObserver.observe(stage); observers.push(visibilityObserver)
    document.fonts.addEventListener('loadingdone', event => {
      if (!alive()) return
      const family = getComputedStyle(headline).fontFamily
      if (event.fontfaces.some(face => family.includes(face.family.replace(/["']/g, '')))) printed.resize(true)
      size()
    }, { signal: events.signal })
    void document.fonts.ready.then(() => { if (alive()) size() }).catch(() => {})
    restorePosition(); measure(); staticCopy(); size()
    if (textUniforms.textAtlas.value) renderer.initTexture(textUniforms.textAtlas.value)
    void screenCompiled.then(() => { screenReady = true; available() }).catch(fail)
  } catch { fail() }
  return dispose
}
