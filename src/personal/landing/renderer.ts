import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { CHAPTERS, sceneSequence, textSequence, advanceScrollMotion, railProgress, type LandingChapter, type TextSequence } from './sequence.ts'
import { thresholdMotion, sculpturePose, createScaleSampler } from './motion-curves.ts'
import { createDitheredText, textDitherShader, type DitheredTextUniforms } from './dithered-text.ts'
import { scrollInkShader, scrollInkStrength } from './scroll-dither.ts'
import { isStackedLanding, mobileSculptureFrame } from './mobile-layout.ts'

export interface LandingElements {
  rail: HTMLElement
  stage: HTMLElement
  canvas: HTMLCanvasElement
  headline: HTMLHeadingElement
  loading: HTMLElement
  copyContent: HTMLElement
  title: HTMLAnchorElement
  links: HTMLElement
  project: HTMLAnchorElement
  article: HTMLAnchorElement
  category: HTMLElement
  count: HTMLElement
  cue: HTMLElement
}
type Disposable = { dispose(): void }
type Part = { node: THREE.Object3D; quaternion: THREE.Quaternion; axis: THREE.Vector3; order: number }
type Portal = {
  wrapper: THREE.Group
  frames: THREE.Mesh[]
  openings: THREE.Mesh[]
  animated: THREE.Object3D
  sampleScale: ReturnType<typeof createScaleSampler>
  scaleValues: Float64Array
  duration: number
}
const rotations: readonly [number, number, number][] = [[0, -.12, 0], [.08, -.28, 0], [-.04, .4, -.1], [.09, -.16, 0], [.08, .3, 0]]
const screenFragmentShader = `
uniform sampler2D a;uniform sampler2D b;uniform sampler2D portalMask;uniform sampler2D portalFrame;uniform float portalEnabled;uniform vec3 framePaper;uniform vec3 frameInk;
uniform vec2 scenePixels;uniform vec3 paperA;uniform vec3 inkA;uniform vec3 paperB;uniform vec3 inkB;varying vec2 vUv;
${scrollInkShader}
${textDitherShader}
float bayer2(vec2 p){vec2 q=mod(p,2.);return q.x*2.+q.y*3.-q.x*q.y*4.;}
vec3 printedSculpture(sampler2D source,vec2 uv,vec3 paper,vec3 ink){
  // Retain the study's RGB-sum luminance and /17 Bayer thresholds at rest.
  vec2 pixel=floor(uv*scenePixels);
  float luminance=dot(texture2D(source,pixel/scenePixels).rgb,vec3(1.));
  float visibleInk=step(sculptureThreshold(pixel),luminance)*clamp(luminance,0.,1.);
  return mix(ink,paper,visibleInk);
}
void main(){
  vec3 color=printedSculpture(a,vUv,paperA,inkA);
  if(portalEnabled>.5){
    float mask=texture2D(portalMask,vUv).r;
    vec4 frame=texture2D(portalFrame,vUv);
    vec2 pixel=floor(gl_FragCoord.xy);
    float threshold=mix((4.*bayer2(pixel)+bayer2(floor(pixel/2.))+.5)/16.,sculptureThreshold(pixel),scrollInk*.35);
    float luminance=clamp(dot(frame.rgb,vec3(.2126,.7152,.0722))*.85,0.,1.);
    frame.rgb=mix(frameInk,framePaper,step(threshold,luminance));
    color=mix(color,printedSculpture(b,vUv,paperB,inkB),mask);
    color=mix(color,frame.rgb,frame.a);
  }
  gl_FragColor=vec4(color,1.);
  #include <colorspace_fragment>
  gl_FragColor.rgb=mix(gl_FragColor.rgb,1.-gl_FragColor.rgb,printedText(vUv));
}`

/** The approved visor Threshold study, bounded to its own scroll rail. */
export function mountLandingSequence(elements: LandingElements): () => void {
  const { rail, stage, canvas, headline, loading, copyContent, title, links, project, article, category, count, cue } = elements
  const resources = new Set<Disposable>(), observers: { disconnect(): void }[] = []
  const events = new AbortController()
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const assets = new Map<LandingChapter['id'], THREE.Group>(), actors: THREE.Group[] = []
  const parts = new Map<THREE.Object3D, Part[]>()
  const actorBounds = new Map<THREE.Object3D, { size: THREE.Vector3; center: THREE.Vector3 }>()
  let frame = 0, last = 0, frames = 0, disposed = false, failed = false, ready = false, visible = true
  let progress = 0, velocity = 0, targetProgress = 0, scrollDistance = 1, width = 0, height = 0
  let copyTop = 0, copyLineHeight = 0, safeBottom = 0
  let lastCategory = '', lastLinks = '', lastUsable: boolean | null = null
  const alive = () => !disposed && !failed && stage.isConnected
  function manage<T extends Disposable>(resource: T): T { resources.add(resource); return resource }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0 }
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
    observers.forEach(observer => observer.disconnect())
    // Release targets, meshes and textures before the renderer clears
    // its resource bookkeeping; disposal order matters for actual GPU deletion.
    for (const resource of [...resources].reverse()) { try { release(resource) } catch { /* Complete remaining cleanup after a lost context. */ } }
    resources.clear(); assets.clear(); actors.length = 0; parts.clear(); actorBounds.clear()
  }
  function showChapter(chapter: LandingChapter, index: number, lineHeight: number) {
    if (disposed || !stage.isConnected) return
    lastUsable = null
    stage.dataset.chapter = chapter.id
    canvas.dataset.chapter = chapter.id
    category.textContent = index ? `${String(index).padStart(2, '0')} / ${chapter.category}` : ''
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
    const arrow = document.createElement('span')
    arrow.textContent = '↗'
    arrow.setAttribute('aria-hidden', 'true')
    project.replaceChildren(document.createTextNode(chapter.linkLabel), arrow)
    article.hidden = !chapter.article
    if (chapter.article) {
      article.href = chapter.article.href
      article.textContent = `${chapter.article.label} ↗`
    } else article.removeAttribute('href')
    copyContent.style.setProperty('--links-y', `${chapter.lines.length * lineHeight + 28}px`)
    count.textContent = index ? `${String(index).padStart(2, '0')} / 04` : '00 / 04'
    cue.textContent = index === CHAPTERS.length - 1 ? 'Continue to writing ↓' : 'Scroll to continue ↓'
  }
  function staticCopy() {
    if (disposed || !stage.isConnected) return
    const index = textSequence(targetProgress, 'threshold', true).active, chapter = CHAPTERS[index]
    headline.replaceChildren(...chapter.lines.flatMap((line, row) => row ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]))
    const style = getComputedStyle(headline)
    showChapter(chapter, index, parseFloat(style.lineHeight) || parseFloat(style.fontSize) * .98)
    category.style.opacity = count.style.opacity = links.style.opacity = '1'
    links.style.transform = 'none'
    links.style.pointerEvents = 'auto'
    links.setAttribute('aria-hidden', 'false')
    project.tabIndex = 0
    article.tabIndex = article.hidden ? -1 : 0
    title.style.pointerEvents = chapter.id === 'helmet' ? 'none' : 'auto'
    title.tabIndex = chapter.id === 'helmet' ? -1 : 0
    delete stage.dataset.textDither
    delete stage.dataset.textPhase
  }
  function fail() {
    if (disposed || failed) return
    failed = true; ready = false; teardown()
    if (!stage.isConnected) return
    canvas.hidden = true
    canvas.dataset.state = stage.dataset.state = 'error'
    loading.textContent = 'Sculpture unavailable'
    loading.hidden = false
    staticCopy()
  }
  function dispose() {
    if (disposed) return
    disposed = true; teardown()
    if (!stage.isConnected) return
    for (const name of ['textDither', 'textPhase', 'mode', 'motionVariant', 'chapter', 'position', 'motionPhase', 'inkMotion', 'layout', 'state']) delete stage.dataset[name]
    for (const name of ['state', 'assets', 'assetCount', 'chapter', 'scrollFrames']) delete canvas.dataset[name]
  }

  try {
    const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
    const renderer = manage(new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' }))
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25))
    renderer.localClippingEnabled = true
    renderer.setClearColor('#eeeadd', 1)
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
    const targetMask = manage(new THREE.WebGLRenderTarget(1, 1)), targetFrame = manage(new THREE.WebGLRenderTarget(1, 1))
    const portalScene = new THREE.Scene(), portalCamera = new THREE.PerspectiveCamera(32, 1, .05, 90)
    portalCamera.position.set(0, 0, 5.9); portalCamera.lookAt(0, 0, 0)
    portalScene.environment = environment.texture
    const portalKey = new THREE.DirectionalLight(0xffffff, 3), portalFill = new THREE.DirectionalLight(0xffffff, .7)
    portalKey.position.set(-3, 5, 5); portalFill.position.set(4, -1, 3)
    portalScene.add(portalKey, portalFill, new THREE.AmbientLight(0xffffff, .2))
    const openingMaterial = manage(new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, toneMapped: false }))
    let portal: Portal | null = null
    const textUniforms: DitheredTextUniforms = {
      textAtlas: { value: null }, textBox: { value: new THREE.Vector4() },
      textState: { value: CHAPTERS.map(() => new THREE.Vector2()) }, textMeasure: { value: CHAPTERS.map(() => new THREE.Vector2()) },
      textPixels: { value: new THREE.Vector2() }, textGrid: { value: 1 },
      scrollInk: { value: 0 }, scrollPhase: { value: 0 },
    }
    const screenUniforms = {
      a: { value: targetA.texture }, b: { value: targetB.texture }, portalMask: { value: targetMask.texture }, portalFrame: { value: targetFrame.texture },
      portalEnabled: { value: 0 }, framePaper: { value: paper.value }, frameInk: { value: ink.value }, textEnabled: { value: 0 },
      scenePixels: { value: new THREE.Vector2(1, 1) }, paperA: { value: paper.value.clone() }, inkA: { value: ink.value.clone() },
      paperB: { value: paper.value.clone() }, inkB: { value: ink.value.clone() }, ...textUniforms,
    }
    const screenScene = new THREE.Scene(), screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const screenMaterial = manage(new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: screenUniforms, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: screenFragmentShader }))
    const screenGeometry = manage(new THREE.PlaneGeometry(2, 2))
    screenScene.add(new THREE.Mesh(screenGeometry, screenMaterial))
    const printed = manage(createDitheredText({ headline, stage, uniforms: textUniforms, pixelRatio: () => renderer.getPixelRatio(), onChapter: showChapter, isAlive: alive }))
    const loader = new GLTFLoader(), draco = manage(new DRACOLoader().setDecoderPath(assetUrl('draco/')).setWorkerLimit(1))
    loader.setDRACOLoader(draco)
    canvas.hidden = false
    canvas.dataset.state = stage.dataset.state = 'loading'
    stage.dataset.mode = 'threshold'
    stage.dataset.motionVariant = '1'

    async function asset(chapter: LandingChapter) {
      const gltf = await loader.loadAsync(assetUrl(chapter.asset))
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
        if (['sapien', 'markets', 'experiments'].includes(chapter.id)) gltf.scene.traverse(node => {
          if (!(node instanceof THREE.Mesh)) return
          for (const material of Array.isArray(node.material) ? node.material : [node.material]) if (material instanceof THREE.MeshStandardMaterial) material.color.multiplyScalar(chapter.id === 'sapien' ? .28 : .48)
        })
      }
      const bounds = new THREE.Box3().setFromObject(group), extent = bounds.getSize(new THREE.Vector3())
      if (!Number.isFinite(extent.length()) || !Math.max(extent.x, extent.y, extent.z)) throw Error('Sculpture bounds unavailable')
      group.position.sub(bounds.getCenter(new THREE.Vector3()))
      const root = new THREE.Group()
      root.add(group); root.scale.setScalar(2 / Math.max(extent.x, extent.y, extent.z))
      assets.set(chapter.id, root)
    }
    async function loadPortal(): Promise<Portal | null> {
      const gltf = await loader.loadAsync(assetUrl('landing/threshold-visor.glb'))
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
      return { wrapper, frames, openings, animated, sampleScale: createScaleSampler(track.times, track.values), scaleValues: new Float64Array(3), duration: clip.duration }
    }
    function actor(chapter: LandingChapter) {
      const source = assets.get(chapter.id)
      if (!source) throw Error('Sculpture is incomplete')
      const object = new THREE.Group(), articulated: Part[] = []
      object.add(source.clone(true))
      object.rotation.set(...rotations[actors.length])
      const bounds = new THREE.Box3().setFromObject(object, true)
      actorBounds.set(object, { size: bounds.getSize(new THREE.Vector3()), center: bounds.getCenter(new THREE.Vector3()) })
      object.rotation.set(0, 0, 0)
      object.traverse(node => {
        if (!node.name.startsWith('hover-')) return
        const declared: unknown = node.userData.articulationAxis
        const axis = Array.isArray(declared) && declared.length === 3 && declared.every(Number.isFinite) ? new THREE.Vector3(declared[0], declared[1], declared[2]) : new THREE.Vector3(0, 1, 0)
        if (axis.lengthSq() < .001) axis.set(0, 1, 0)
        articulated.push({ node, quaternion: node.quaternion.clone(), axis: axis.normalize(), order: articulated.length })
      })
      parts.set(object, articulated); scene.add(object); actors.push(object)
    }
    function colors(dark = false) { paper.value.set(dark ? '#20211e' : '#eeeadd'); ink.value.set(dark ? '#f2ecdf' : '#24241f') }
    function articulate(object: THREE.Object3D, amount: number) {
      for (const part of parts.get(object) ?? []) {
        part.node.quaternion.copy(part.quaternion)
        part.node.rotateOnAxis(part.axis, amount * (1 + (part.order % 3) * .2))
      }
    }
    function copyPresentation(sequence: TextSequence, motion: ReturnType<typeof thresholdMotion>, leg: number) {
      const incoming = sequence.active > leg, state = sequence.states[sequence.active]
      const categoryAlpha = reduced.matches ? 1 : incoming ? motion.incomingCategory : motion.outgoingCategory
      const linksAlpha = reduced.matches ? 1 : incoming ? motion.incomingLinks : motion.outgoingLinks
      const readable = state.reveal > .999 && state.erase < .001
      const usable = readable && linksAlpha > .98, titleUsable = usable && CHAPTERS[sequence.active].id !== 'helmet'
      const categoryValue = categoryAlpha.toFixed(3), linkValue = linksAlpha.toFixed(3)
      if (categoryValue !== lastCategory) { category.style.opacity = categoryValue; count.style.opacity = categoryValue; lastCategory = categoryValue }
      if (linkValue !== lastLinks) { links.style.opacity = linkValue; links.style.transform = `translateY(${((1 - linksAlpha) * 3).toFixed(2)}px)`; lastLinks = linkValue }
      if (usable !== lastUsable) {
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
      for (const object of actors) { object.visible = false; object.position.set(0, 0, 0); object.rotation.set(0, 0, 0); object.scale.setScalar(1) }
      camera.position.set(0, 0, mobile ? 6.1 : 5.9); camera.lookAt(0, 0, 0)
      key.position.set(-3, 5, 5); colors(false)
      const sequence = sceneSequence(p), motion = thresholdMotion(sequence.local)
      textUniforms.scrollPhase.value = p * 52
      textUniforms.scrollInk.value = scrollInkStrength(velocity, scrollDistance, height, reduced.matches)
      const typography = printed.update(p, reduced.matches)
      copyPresentation(typography, motion, sequence.leg)
      stage.dataset.position = p.toFixed(4)
      stage.dataset.motionPhase = motion.travel === 0 || motion.travel === 1 ? 'held' : 'transition'
      stage.dataset.inkMotion = textUniforms.scrollInk.value.toFixed(4)
      stage.dataset.layout = mobile ? 'stacked' : 'wide'
      return { mobile, motion, ...sequence }
    }
    function screen(texture: THREE.Texture) {
      renderer.setRenderTarget(null)
      screenUniforms.a.value = screenUniforms.b.value = screenUniforms.portalMask.value = screenUniforms.portalFrame.value = texture
      screenUniforms.paperA.value.copy(paper.value); screenUniforms.inkA.value.copy(ink.value)
      screenUniforms.portalEnabled.value = 0; screenUniforms.textEnabled.value = 1
      renderer.render(screenScene, screenCamera); renderer.setRenderTarget(null)
    }
    function renderTo(target: THREE.WebGLRenderTarget) { renderer.setRenderTarget(target); renderer.render(scene, camera); renderer.setRenderTarget(null) }
    function renderPortal(amount: number, center: THREE.Vector2, dark: boolean) {
      if (!portal) return
      const span = 2 * portalCamera.position.z * Math.tan(THREE.MathUtils.degToRad(portalCamera.fov / 2))
      portal.wrapper.visible = amount > .001
      portal.sampleScale(amount * portal.duration, portal.scaleValues)
      portal.animated.scale.fromArray(portal.scaleValues)
      const origin = center.clone().lerp(new THREE.Vector2(.5, .5), amount * .8)
      portal.wrapper.position.set((origin.x - .5) * span * portalCamera.aspect, (origin.y - .5) * span, 0)
      portal.wrapper.rotation.set(.045 * (1 - amount), .10 * (1 - amount), -.13 * (1 - amount))
      portal.wrapper.scale.setScalar(isStackedLanding(width, height) ? .35 : .9)
      for (const mesh of portal.frames) mesh.visible = false
      for (const mesh of portal.openings) mesh.visible = true
      renderer.setClearColor(0x000000, 1); renderer.setRenderTarget(targetMask); renderer.clear(); renderer.render(portalScene, portalCamera); renderer.setRenderTarget(null)
      for (const mesh of portal.frames) mesh.visible = true
      for (const mesh of portal.openings) mesh.visible = false
      colors(dark)
      renderer.setClearColor('#eeeadd', 0); renderer.setRenderTarget(targetFrame); renderer.clear(); renderer.render(portalScene, portalCamera); renderer.setRenderTarget(null); renderer.setClearColor('#eeeadd', 1)
      screenUniforms.a.value = targetA.texture; screenUniforms.b.value = targetB.texture
      screenUniforms.portalMask.value = targetMask.texture; screenUniforms.portalFrame.value = targetFrame.texture
      screenUniforms.portalEnabled.value = 1; screenUniforms.textEnabled.value = 1
      renderer.setRenderTarget(null); renderer.render(screenScene, screenCamera)
    }
    function modelPose(object: THREE.Group, index: number, local: number, mobile: boolean, incoming = false) {
      const pose = sculpturePose(local, incoming), rotation = rotations[index]
      if (mobile) {
        const bounds = actorBounds.get(object)!, chapter = CHAPTERS[index]
        const frame = mobileSculptureFrame(width, height, copyTop, copyLineHeight, chapter.lines.length, chapter.article ? 2 : 1, bounds.size, safeBottom)
        object.position.set(frame.x - bounds.center.x * frame.scale + pose.x, frame.y - bounds.center.y * frame.scale + pose.y, -bounds.center.z * frame.scale)
        object.scale.setScalar(frame.scale * pose.scale)
      } else {
        object.position.set(.95 + pose.x, pose.y, 0)
        object.scale.setScalar(1.4 * pose.scale)
      }
      object.rotation.set(rotation[0] + pose.pitch, rotation[1] + pose.yaw, rotation[2] + pose.roll)
      articulate(object, pose.articulation)
    }
    function draw() {
      if (!alive() || !ready || !visible || !width || !height || document.hidden) return
      const { mobile, leg, local, motion } = pose()
      if (reduced.matches) {
        for (const object of actors) object.visible = false
        const index = textSequence(targetProgress, 'threshold', true).active
        actors[index].visible = true
        modelPose(actors[index], index, 0, mobile)
        colors(Boolean(index % 2)); renderTo(targetA); screen(targetA.texture)
      } else if (motion.travel === 0 || motion.travel === 1) {
        const destination = motion.travel === 1, index = leg + Number(destination), object = actors[index]
        object.visible = true; modelPose(object, index, local, mobile, destination)
        colors(Boolean(index % 2)); renderTo(targetA); screen(targetA.texture)
      } else {
        const from = actors[leg], to = actors[leg + 1]
        from.visible = true; modelPose(from, leg, local, mobile); colors(Boolean(leg % 2)); renderTo(targetA)
        screenUniforms.paperA.value.copy(paper.value); screenUniforms.inkA.value.copy(ink.value)
        from.visible = false; to.visible = true; modelPose(to, leg + 1, local, mobile, true); colors(Boolean((leg + 1) % 2)); renderTo(targetB)
        screenUniforms.paperB.value.copy(paper.value); screenUniforms.inkB.value.copy(ink.value)
        const bounds = actorBounds.get(from)!, chapter = CHAPTERS[leg]
        const frame = mobile ? mobileSculptureFrame(width, height, copyTop, copyLineHeight, chapter.lines.length, chapter.article ? 2 : 1, bounds.size, safeBottom) : null
        renderPortal(motion.travel, new THREE.Vector2(mobile ? .50 : .66, frame ? 1 - frame.centerY / height : .55), Boolean(leg % 2))
      }
      canvas.dataset.state = stage.dataset.state = 'ready'
      canvas.dataset.scrollFrames = String(++frames)
    }
    function request() { if (alive() && ready && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick) }
    function tick(time: number) {
      frame = 0
      if (!alive() || !ready || !visible || document.hidden) return
      const seconds = last ? (time - last) / 1000 : 1 / 60
      last = time
      const motion = advanceScrollMotion({ progress, velocity }, targetProgress, seconds, reduced.matches)
      progress = motion.progress; velocity = motion.velocity
      if (Math.abs(progress - targetProgress) * scrollDistance < .1 && Math.abs(velocity) * scrollDistance < 2) { progress = targetProgress; velocity = 0 }
      try { draw() } catch { fail(); return }
      if (progress !== targetProgress || velocity !== 0) request(); else last = 0
    }
    function measure() {
      if (!alive()) return
      scrollDistance = Math.max(1, rail.clientHeight - stage.clientHeight)
      targetProgress = railProgress(scrollY, rail.getBoundingClientRect().top + scrollY, rail.clientHeight, stage.clientHeight)
      request()
    }
    function size() {
      if (!alive()) return
      try {
        width = stage.clientWidth; height = stage.clientHeight
        if (!width || !height) return
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25))
        renderer.setSize(width, height, false)
        targetA.setSize(Math.round(width * renderer.getPixelRatio()), Math.round(height * renderer.getPixelRatio()))
        for (const target of [targetB, targetMask, targetFrame]) target.setSize(targetA.width, targetA.height)
        screenUniforms.scenePixels.value.set(targetA.width, targetA.height)
        camera.aspect = width / height; camera.updateProjectionMatrix()
        portalCamera.aspect = width / height; portalCamera.updateProjectionMatrix()
        const style = getComputedStyle(headline)
        copyTop = headline.getBoundingClientRect().top - stage.getBoundingClientRect().top
        copyLineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize)
        const linkBottom = parseFloat(getComputedStyle(links).bottom)
        safeBottom = Number.isFinite(linkBottom) ? Math.max(0, linkBottom - 50) : 0
        printed.resize(); measure()
        draw()
      } catch { fail() }
    }
    window.addEventListener('scroll', measure, { passive: true, signal: events.signal })
    window.addEventListener('resize', size, { passive: true, signal: events.signal })
    document.addEventListener('visibilitychange', () => { stop(); if (!document.hidden) measure() }, { signal: events.signal })
    reduced.addEventListener('change', () => { stop(); measure() }, { signal: events.signal })
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fail() }, { signal: events.signal })
    const resizeObserver = new ResizeObserver(size)
    resizeObserver.observe(stage); resizeObserver.observe(rail); resizeObserver.observe(headline)
    observers.push(resizeObserver)
    const visibilityObserver = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (!visible) stop(); else measure()
    })
    visibilityObserver.observe(stage); observers.push(visibilityObserver)
    const fontsChanged = () => { if (alive()) size() }
    document.fonts.addEventListener('loadingdone', fontsChanged, { signal: events.signal })
    void document.fonts.ready.then(fontsChanged).catch(() => {})
    measure(); staticCopy(); size()
    void Promise.all([Promise.all(CHAPTERS.map(asset)), loadPortal()]).then(([, loadedPortal]) => {
      if (!alive()) return
      if (!loadedPortal) throw Error('Threshold unavailable')
      portal = loadedPortal
      for (const chapter of CHAPTERS) actor(chapter)
      ready = true
      canvas.dataset.assets = 'glb'; canvas.dataset.assetCount = String(CHAPTERS.length)
      loading.hidden = true
      size(); request()
    }).catch(fail)
  } catch { fail() }
  return dispose
}
