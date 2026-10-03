import * as THREE from 'three'
import { PORTFOLIO_DITHER_GLSL } from '../dither-kernel'
import { PortfolioRuntime } from '../portfolio-runtime'
import { createPortfolioModelLoader } from '../portfolio-model-loader'
import { portfolioAssetUrl } from '../portfolio-assets'
import { disposeModel } from '../../model-resources'
import { readPrintPalette } from '../print-palette'
import { interestFraming, interestPixelRatio } from './interest-layout'
import type { InterestId } from './about-content'
import type { PhraseNote } from './music-phrase'
import type { ChessSceneState } from './ChessGame'
import { createChessSet } from './chess-scene'
import { drawScoreCanvas } from './score-engraving'
import { batchBoardTiles, createBoardLabels } from './board-batching'
import { cloneInterestBoardMaterial, composeInterestView, settleInterestValue, settleInterestView, writeKnightDestination, type InterestView } from './interest-motion'

export interface InterestScene {
  select(id: InterestId | null): void
  setPlaying(playing: boolean): void
  setDark(dark: boolean): void
  pluck(index: number): void
  setNotes(notes: number[]): void
  setPuzzle(square: string, legal: string[], goal?: string, path?: string[], blocked?: readonly string[], checkpoints?: readonly string[]): void
  setBass(articulation: 'pizzicato' | 'arco', position: number): void
  setScore(notes: PhraseNote[], title: string, tempo: number, page: number, activeIndex: number | null): void
  setGame(state: ChessSceneState | null): void
  resetView(): void
  dispose(): void
}

type Specimen = { id: InterestId; group: THREE.Group; model: THREE.Group; pose: THREE.Group; view: InterestView; bow?: THREE.Object3D; bowX: number; strings: THREE.Object3D[]; stringX: number[]; notes: THREE.Object3D[]; noteY: number[]; pen?: THREE.Object3D; notation?: THREE.Object3D; knight?: THREE.Object3D; knightStart?: THREE.Vector3; board?: THREE.Object3D; boardBatch?: ReturnType<typeof batchBoardTiles>; boardLabels?: ReturnType<typeof createBoardLabels>; chess?: ReturnType<typeof createChessSet>; scoreOverlay?: THREE.Mesh; boardOpacity: number; boardMaterials: THREE.MeshStandardMaterial[]; tiles: Map<string, THREE.Vector3>; opacity: number; materials: THREE.MeshStandardMaterial[] }
const ids: InterestId[] = ['bass', 'score', 'knight']
const VERTEX = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }'
const FRAGMENT = `
uniform sampler2D image; uniform vec3 ink; uniform vec2 cssResolution; uniform float motionSeconds; uniform float chessPolarity; varying vec2 vUv;
${PORTFOLIO_DITHER_GLSL}
void main(){
  vec4 model=texture2D(image,vUv);
  if(model.a<=.0001){gl_FragColor=vec4(0.0);return;}
  vec2 pixel=floor(vUv*cssResolution);
  float threshold=portfolioLiveThreshold(portfolioBayer4(pixel),pixel,motionSeconds,.008);
  // NormalBlending into transparent black stores premultiplied target color.
  vec3 straightColor=model.a>0.0001?model.rgb/model.a:vec3(0.0);
  float gray=portfolioDisplayLuminance(straightColor);
  // A playable board retains light/black piece identity in the dark palette.
  gray=mix(gray,1.0-gray,chessPolarity);
  // A continuous tonal curve carries the carving; grain recedes at fine highlights
  // and dark edges, where binary coverage previously erased the surface detail.
  float coverage=1.0-pow(clamp(gray,0.0,1.0),1.12);
  float grain=.16*smoothstep(.025,.20,coverage)*(1.0-smoothstep(.75,.98,coverage));
  float shade=mix(coverage,step(threshold,coverage),grain);
  gl_FragColor=vec4(ink,model.a*shade);
  #include <colorspace_fragment>
}`

/** A single bounded renderer for the three original GLB objects. */
export function mountInterestScene(canvas: HTMLCanvasElement, dark: boolean, events: { choose(id: InterestId): void; pluck(index: number): void; move(square: string): void; chess(square: string): void }, status: (value: 'ready' | 'error') => void): InterestScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .85
  renderer.info.autoReset = false
  const target = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, .01, 100)
  const key = new THREE.DirectionalLight(0xffffff, 3.1)
  key.position.set(-3, 5, 6)
  const rim = new THREE.DirectionalLight(0xffffff, 1.8)
  rim.position.set(4, 2, -3)
  // A quieter fill leaves carved recesses and embossed notation legible.
  scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x444444, .65))
  const palette = readPrintPalette(canvas, dark)
  const shader = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, uniforms: { image: { value: target.texture }, ink: { value: palette.ink }, cssResolution: { value: new THREE.Vector2(1, 1) }, motionSeconds: { value: 0 }, chessPolarity: { value: 0 } } })
  const quadGeometry = new THREE.PlaneGeometry(2, 2)
  const post = new THREE.Scene()
  post.add(new THREE.Mesh(quadGeometry, shader))
  const postCamera = new THREE.Camera()
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const drawingSize = new THREE.Vector2()
  const knightTarget = new THREE.Vector3()
  const specimens: Specimen[] = []
  const loader = createPortfolioModelLoader()
  const runtime = new PortfolioRuntime()
  const controller = new AbortController()
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  const stackedMedia = matchMedia('(max-width: 900px)')
  const touchMedia = matchMedia('(any-pointer: coarse), (max-width: 900px)')
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  const scoreCanvas = document.createElement('canvas'); scoreCanvas.width = 768; scoreCanvas.height = 1024
  const scoreContext = scoreCanvas.getContext('2d')!
  const scoreTexture = new THREE.CanvasTexture(scoreCanvas); scoreTexture.colorSpace = THREE.SRGBColorSpace; textures.add(scoreTexture)
  let scoreState = { notes: [] as PhraseNote[], title: 'Untitled', tempo: 88, page: 0, activeIndex: null as number | null }
  let scoreDirty = true
  let gameState: ChessSceneState | null = null
  const markerGeometry = new THREE.SphereGeometry(.027, 12, 8)
  const markerMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, roughness: .7 })
  const lightMarkerMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .7 })
  const goalGeometry = new THREE.TorusGeometry(.067, .007, 6, 24)
  const fingerGeometry = new THREE.SphereGeometry(.014, 12, 8)
  const finger = new THREE.Mesh(fingerGeometry, lightMarkerMaterial)
  finger.visible = false
  const goal = new THREE.Mesh(goalGeometry, lightMarkerMaterial)
  goal.rotation.x = Math.PI / 2
  goal.name = 'tile-h8'
  goal.visible = false
  const markers: THREE.Mesh[] = []
  const puzzleOverlay = new THREE.Group()
  const closureGeometry = new THREE.BoxGeometry(.12,.010,.013), checkpointGeometry = new THREE.TorusGeometry(.044,.006,6,20), trailGeometry = new THREE.SphereGeometry(.013,10,6)
  geometries.add(closureGeometry);geometries.add(checkpointGeometry);geometries.add(trailGeometry)
  let selected: InterestId | null = null
  let darkTheme = dark
  let playing = !media.matches
  let disposed = false
  let lost = false
  let visible = true
  let raf = 0
  let frameTimer = 0
  let urgent = true
  let width = 1
  let height = 1
  let galleryHeight = 1
  let lastStats = -Infinity
  let frames = 0
  let settling = true
  let averageMs = 0
  let manualYaw = 0
  let manualPitch = 0
  let square = 'a1'
  let destinationSquare = 'h8'
  let bassArticulation: 'pizzicato' | 'arco' = 'pizzicato'
  let bassPosition = 0
  let bassString = 0
  let puzzlePath: string[] = []
  let blockedSquares: readonly string[] = [], checkpoints: readonly string[] = []
  let legal: string[] = []
  let noteSequence: number[] = []
  let jumping: { from: THREE.Vector3; to: THREE.Vector3; elapsed: number } | null = null
  const pulses = [0, 0, 0, 0]
  let drag: { id: number; x: number; y: number; previousX: number; previousY: number; moved: boolean; intent: 'pending' | 'horizontal' | 'vertical' } | null = null
  canvas.dataset.state = 'loading'
  canvas.dataset.frames = '0'
  canvas.dataset.effectPasses = '1'
  canvas.dataset.renderPasses = '2'

  function active() { return !disposed && !lost && visible && !document.hidden }
  function idleCursor() { return !selected || selected === 'bass' || selected === 'knight' && gameState ? 'pointer' : 'grab' }
  function schedule(now = performance.now()) {
    if (!active() || raf || frameTimer) return
    const delay = urgent ? 0 : runtime.paintDelay(now)
    if (delay > 3) frameTimer = window.setTimeout(() => { frameTimer = 0; if (active()) raf = requestAnimationFrame(render) }, delay)
    else raf = requestAnimationFrame(render)
  }
  function cancelFrame() { cancelAnimationFrame(raf); clearTimeout(frameTimer); raf = frameTimer = 0 }
  function wake() { urgent = true; if (frameTimer) { clearTimeout(frameTimer); frameTimer = 0 } schedule() }
  function measure(shouldWake = true) {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, rect.width); height = Math.max(1, rect.height)
    if (!selected) galleryHeight = Math.max(1, canvas.parentElement?.clientHeight ?? height)
    const ratio = interestPixelRatio(width, height, devicePixelRatio || 1, touchMedia.matches) * runtime.scale
    renderer.setPixelRatio(ratio)
    renderer.setSize(width, height, false)
    const pixels = renderer.getDrawingBufferSize(drawingSize)
    target.setSize(pixels.x, pixels.y)
    shader.uniforms.cssResolution.value.set(width, height)
    camera.aspect = width / height
    camera.position.set(0, 0, interestFraming(width, height, stackedMedia.matches, selected).cameraZ)
    camera.updateProjectionMatrix()
    if (import.meta.env.DEV) canvas.dataset.renderPixels = String(pixels.x * pixels.y)
    settling = true
    if (shouldWake) wake()
  }
  function approach(value: number, goal: number, dt: number) {
    const next = settleInterestValue(value, goal, dt, media.matches)
    if (next !== goal) settling = true
    return next
  }
  function restoreMarkers() {
    for (const marker of markers) marker.visible = false
    goal.visible = false
    puzzleOverlay.clear()
    const specimen = specimens.find(item => item.id === 'knight')
    if (!specimen || selected !== 'knight') return
    if (!puzzleOverlay.parent) specimen.model.add(puzzleOverlay)
    if (gameState) {
      gameState.legal.forEach((tile,index)=>{
        let marker=markers[index]
        if(!marker){marker=new THREE.Mesh(markerGeometry,markerMaterial);markers.push(marker);specimen.model.add(marker)}
        marker.name=`tile-${tile}`;marker.material=((tile.charCodeAt(0)-97)+Number(tile[1])-1)%2===0?lightMarkerMaterial:markerMaterial
        const point=specimen.tiles.get(tile);if(point){marker.position.copy(point);marker.position.y+=.027;marker.visible=true}
      })
      const focus=gameState.check??gameState.selected
      const point=focus?specimen.tiles.get(focus):null
      if(point){if(!goal.parent)specimen.model.add(goal);goal.name=`tile-${focus}`;goal.position.copy(point);goal.position.y+=.030;goal.visible=true}
      return
    }
    const materialAt=(tile:string)=>((tile.charCodeAt(0)-97)+Number(tile[1])-1)%2===0?lightMarkerMaterial:markerMaterial
    for(const tile of blockedSquares){const point=specimen.tiles.get(tile);if(!point)continue;for(const angle of [-Math.PI/4,Math.PI/4]){const cross=new THREE.Mesh(closureGeometry,materialAt(tile));cross.position.copy(point);cross.position.y+=.018;cross.rotation.y=angle;puzzleOverlay.add(cross)}}
    for(const tile of checkpoints){const point=specimen.tiles.get(tile);if(!point)continue;const marker=new THREE.Mesh(puzzlePath.includes(tile)?trailGeometry:checkpointGeometry,materialAt(tile));marker.position.copy(point);marker.position.y+=.022;if(!puzzlePath.includes(tile))marker.rotation.x=Math.PI/2;puzzleOverlay.add(marker)}
    for(const tile of new Set(puzzlePath.slice(0,-1))){const point=specimen.tiles.get(tile);if(point){const trail=new THREE.Mesh(trailGeometry,materialAt(tile));trail.position.copy(point);trail.position.y+=.016;puzzleOverlay.add(trail)}}
    if (!goal.parent) specimen.model.add(goal)
    const end = specimen.tiles.get(destinationSquare)
    goal.name = `tile-${destinationSquare}`
    if (end && square !== destinationSquare) { goal.position.copy(end); goal.position.y += .028; goal.visible = true }
    legal.forEach((tile, index) => {
      let marker = markers[index]
      if (!marker) { marker = new THREE.Mesh(markerGeometry, markerMaterial); markers.push(marker); specimen.model.add(marker) }
      marker.name = `tile-${tile}`
      marker.material = ((tile.charCodeAt(0) - 97) + Number(tile[1]) - 1) % 2 === 0 ? lightMarkerMaterial : markerMaterial
      const point = specimen.tiles.get(tile)
      if (point) { marker.position.copy(point); marker.position.y += .025; marker.visible = true }
    })
  }
  function knightDestination(specimen: Specimen, next: string) {
    const source = specimen.tiles.get('a1'), destination = specimen.tiles.get(next)
    return writeKnightDestination(specimen.knightStart, source, destination, knightTarget) ? knightTarget : null
  }
  function render(now: number) {
    raf = 0
    if (!active()) { runtime.suspend(); stats(true); return }
    if (!runtime.canPaint(now, urgent)) { schedule(now); return }
    urgent = false
    const live = playing && !media.matches && specimens.length > 0
    if (runtime.advance(now, live, !!drag)) measure(false)
    const renderStart = import.meta.env.DEV ? performance.now() : 0
    const dt = runtime.delta
    const time = runtime.seconds
    shader.uniforms.motionSeconds.value = time
    settling = false
    shader.uniforms.chessPolarity.value = approach(shader.uniforms.chessPolarity.value, darkTheme && selected === 'knight' && gameState ? 1 : 0, dt)
    const narrow = stackedMedia.matches
    const framing = interestFraming(width, height, narrow, selected)
    camera.position.z = approach(camera.position.z, framing.cameraZ, dt)
    for (const item of specimens) {
      const index = ids.indexOf(item.id)
      const focus = selected === item.id
      const hidden = selected !== null && !focus
      const galleryX = (index - 1) * framing.columnSpacing
      const galleryY = item.id === 'bass' ? .08 : (narrow ? -.48 : -.04)
      const galleryScale = (item.id === 'bass' ? framing.bassScale : item.id === 'score' ? framing.scoreScale : framing.knightScale) * Math.min(1,galleryHeight/height)
      const desiredScale = hidden ? .42 : focus ? (item.id === 'knight' ? framing.focusedKnightScale : item.id === 'score' ? 1.38 : 1.10) : galleryScale
      const desiredX = hidden ? (index === 0 ? -framing.columnSpacing*3 : framing.columnSpacing*3) : focus ? framing.focusX : galleryX
      const desiredY = focus ? .04 : galleryY
      item.group.position.x = approach(item.group.position.x, desiredX, dt)
      item.group.position.y = approach(item.group.position.y, desiredY, dt)
      const scale = approach(item.group.scale.x, desiredScale, dt)
      item.group.scale.setScalar(scale)
      const previousOpacity = item.opacity
      const previousBoardOpacity = item.boardOpacity
      item.opacity = approach(item.opacity, hidden ? 0 : 1, dt)
      item.group.visible = item.opacity > .005
      if (item.opacity !== previousOpacity) for (const material of item.materials) material.opacity = item.opacity
      item.boardOpacity = approach(item.boardOpacity, focus ? 1 : 0, dt)
      if (item.board) item.board.visible = item.boardOpacity > .005
      if (item.opacity !== previousOpacity || item.boardOpacity !== previousBoardOpacity) {
        for (const material of item.boardMaterials) material.opacity = item.opacity * item.boardOpacity
      }
      const baseYaw = item.id === 'bass' ? -.24 : item.id === 'score' ? .18 : focus ? (gameState?.flipped?Math.PI-.22:-.22) : -.98
      const pitch = item.id === 'knight' ? (focus ? .67 + manualPitch : .02) : item.id === 'score' ? -.10 + (focus ? manualPitch : 0) : focus ? manualPitch : 0
      if (settleInterestView(item.view, baseYaw + (focus ? manualYaw : 0), pitch, dt, media.matches)) settling = true
      composeInterestView(item.view, index, time, media.matches, item.pose.rotation)
      // A live game keeps its squares steady enough to target without losing idle motion.
      if (focus && item.id === 'knight') item.pose.rotation.y = item.view.yaw + (item.pose.rotation.y - item.view.yaw) * .18
      item.pose.rotation.z = item.id === 'bass' ? -.055 : item.id === 'score' && !media.matches ? Math.sin(time * .44) * .025 : 0
      item.pose.position.y = item.id !== 'knight' && !media.matches ? Math.sin(time * .65 + index) * .035 : 0
      if (item.bow) item.bow.position.x = item.bowX + (!media.matches ? Math.sin(time * .9) * .10 : 0) + (bassArticulation === 'arco' && !media.matches ? Math.sin(time * 3.2) * Math.max(...pulses) * .18 : 0)
      if (item.id === 'bass') {
        finger.visible = focus && bassPosition > 0
        const fraction = 2 ** (-bassPosition / 12)
        const bridgeX = (bassString - 1.5) * .041 * 1.10
        const nutX = (bassString - 1.5) * .025
        const bridgeZ = .357 - Math.abs(bassString - 1.5) * .008
        finger.position.set(THREE.MathUtils.lerp(bridgeX, nutX, fraction), -.329 + 1.609 * fraction, THREE.MathUtils.lerp(bridgeZ, .205, fraction) + .012)
      }
      item.strings.forEach((string, index) => { string.position.x = item.stringX[index] + (!media.matches ? Math.sin(pulses[index] * 50) * pulses[index] * .012 : 0) })
      item.notes.forEach((note, index) => {
        const written = noteSequence[index] !== undefined
        note.scale.setScalar(written ? 1.35 : 1)
        note.position.y = approach(note.position.y, written ? item.noteY[0] + [0, .036, .072, .125][noteSequence[index]] : item.noteY[index], dt)
      })
      if (item.pen) item.pen.rotation.z = !media.matches ? Math.sin(time * .8) * .045 : 0
      if (item.knight) {
        item.knight.visible = !focus || !gameState
        if (item.chess) { item.chess.root.visible = focus && !!gameState; item.chess.setOpacity(item.opacity*item.boardOpacity); if (item.chess.root.visible && item.chess.tick(dt, media.matches)) settling = true }
        item.knight.scale.setScalar(approach(item.knight.scale.x, focus ? 1 : 3.1, dt))
        if (!focus) {
          item.knight.position.x = approach(item.knight.position.x, 0, dt)
          item.knight.position.y = approach(item.knight.position.y, -.45, dt)
          item.knight.position.z = approach(item.knight.position.z, 0, dt)
        } else if (!jumping) {
          const destination = knightDestination(item, square)
          if (destination) for (const axis of ['x', 'y', 'z'] as const) item.knight.position[axis] = approach(item.knight.position[axis], destination[axis], dt)
        }
      }
      if (item.id === 'score') {
        if (item.notation) item.notation.visible = !focus
        item.notes.forEach(note => { note.visible = !focus })
        if (item.scoreOverlay) item.scoreOverlay.visible = focus
        if (focus && scoreDirty) { drawScoreCanvas(scoreContext,scoreState.notes,scoreState);scoreTexture.needsUpdate=true;scoreDirty=false }
      }
      if (item.knight && jumping && focus) {
        jumping.elapsed += dt
        const t = media.matches ? 1 : Math.min(1, jumping.elapsed / .46)
        const eased = t * t * (3 - 2 * t)
        item.knight.position.lerpVectors(jumping.from, jumping.to, eased)
        item.knight.position.y += Math.sin(t * Math.PI) * .32
        if (t === 1) jumping = null
        else settling = true
      }
    }
    for (let i = 0; i < pulses.length; i++) { pulses[i] = Math.max(0, pulses[i] - dt); if (pulses[i] > 0 && !media.matches) settling = true }
    renderer.info.reset()
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, camera)
    renderer.setRenderTarget(null); renderer.clear(); renderer.render(post, postCamera)
    frames++
    if (import.meta.env.DEV) {
      const duration = performance.now() - renderStart
      averageMs = frames === 1 ? duration : averageMs * .94 + duration * .06
    }
    stats(frames === 1 || (!live && !settling))
    if (live || settling) schedule(now)
    else runtime.suspend()
  }

  function stats(force = false) {
    const now = performance.now()
    if (!import.meta.env.DEV) return
    if (force) canvas.dataset.liveMotion = String(active() && playing && !media.matches && specimens.length > 0)
    if (now - lastStats < 750) return
    lastStats = now
    canvas.dataset.frames = String(frames)
    canvas.dataset.drawCalls = String(renderer.info.render.calls)
    canvas.dataset.triangles = String(renderer.info.render.triangles)
    canvas.dataset.selection = selected ?? 'collection'
    canvas.dataset.playing = String(playing)
    canvas.dataset.square = square
    canvas.dataset.goal = destinationSquare
    canvas.dataset.route = puzzlePath.join(',')
    canvas.dataset.articulation = bassArticulation
    canvas.dataset.bassPosition = String(bassPosition)
    canvas.dataset.scoreEvents = String(scoreState.notes.length)
    canvas.dataset.scorePage = String(scoreState.page)
    canvas.dataset.chessMode = gameState ? 'game' : 'puzzle'
    canvas.dataset.chessPieces = String(gameState?.pieces.length ?? 0)
    canvas.dataset.chessSelection = gameState?.selected ?? ''
    canvas.dataset.legalMoves = legal.join(',')
    canvas.dataset.legalMarkers = String(markers.filter(marker => marker.visible).length)
    const boardBatch = specimens.find(item => item.id === 'knight')?.boardBatch
    if (boardBatch) {
      canvas.dataset.boardTileCallsBefore = String(boardBatch.sourceCalls)
      canvas.dataset.boardTileCalls = String(boardBatch.tileCalls)
      canvas.dataset.boardLabelCalls = '1'
    }
    canvas.dataset.renderAverageMs = averageMs.toFixed(3)
    canvas.dataset.cpuSubmissionMs = averageMs.toFixed(3)
    canvas.dataset.frameAverageMs = runtime.averageFrameMs.toFixed(3)
    canvas.dataset.fps = runtime.fps.toFixed(2)
    canvas.dataset.resolutionScale = String(runtime.scale)
    canvas.dataset.liveMotion = String(active() && playing && !media.matches && specimens.length > 0)
  }

  function intersections(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    return raycaster.intersectObjects(specimens.filter(item => item.group.visible && item.opacity > .5).map(item => item.group), true).filter(hit => {
      let node: THREE.Object3D | null = hit.object
      while (node) { if (!node.visible) return false; node = node.parent }
      return true
    })
  }
  function interact(event: PointerEvent) {
    const hits = intersections(event)
    for (const hit of hits) {
      let node: THREE.Object3D | null = hit.object
      while (node) {
        if (selected === 'knight' && gameState && node.userData.chessSquare) { events.chess(node.userData.chessSquare); return }
        const string = /^string-([eadg])$/.exec(node.name)
        const tile = /^tile-([a-h][1-8])$/.exec(node.name)
        if (selected === 'knight' && gameState && tile) { events.chess(tile[1]); return }
        if (selected === 'bass' && string) { events.pluck('eadg'.indexOf(string[1])); return }
        if (selected === 'knight' && tile && legal.includes(tile[1])) { events.move(tile[1]); return }
        if (node.userData.interest) { if (selected !== node.userData.interest) events.choose(node.userData.interest); return }
        node = node.parent
      }
    }
    // Each gallery column is a target, including the breathing room around its object.
    if (!selected) {
      const rect = canvas.getBoundingClientRect()
      const index = Math.max(0, Math.min(2, Math.floor((event.clientX - rect.left) / rect.width * 3)))
      events.choose(ids[index])
    }
  }
  canvas.addEventListener('pointerdown', event => { if (!event.isPrimary || event.button !== 0) return; drag = { id: event.pointerId, x: event.clientX, y: event.clientY, previousX: event.clientX, previousY: event.clientY, moved: false, intent: 'pending' } }, { signal: controller.signal })
  canvas.addEventListener('pointermove', event => {
    // Hover only changes the cursor. Exact triangle picking is reserved for a click.
    if (!drag) { canvas.style.cursor = idleCursor(); return }
    if (event.pointerId !== drag.id) return
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y
    if (Math.hypot(dx, dy) > 7) {
      drag.moved = true
      if (drag.intent === 'pending') drag.intent = event.pointerType !== 'touch' || Math.abs(dx) > Math.abs(dy) * 1.2 ? 'horizontal' : 'vertical'
    }
    if (drag.intent === 'horizontal' && selected) {
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
      manualYaw = THREE.MathUtils.clamp(manualYaw + (event.clientX - drag.previousX) * .005, -.7, .7)
      manualPitch = THREE.MathUtils.clamp(manualPitch + (event.clientY - drag.previousY) * .003, -.16, .16)
      wake()
    }
    drag.previousX = event.clientX; drag.previousY = event.clientY
  }, { signal: controller.signal })
  canvas.addEventListener('pointerup', event => { if (!drag || event.pointerId !== drag.id) return; if (!drag.moved) interact(event); drag = null; canvas.style.cursor = idleCursor(); if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId) }, { signal: controller.signal })
  canvas.addEventListener('pointercancel', event => { if (event.pointerId === drag?.id) { drag = null; canvas.style.cursor = idleCursor() } }, { signal: controller.signal })
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; runtime.suspend(); stats(true); cancelFrame(); canvas.dataset.state = 'error'; status('error') }, { signal: controller.signal })
  canvas.addEventListener('webglcontextrestored', () => { lost = false; runtime.suspend(); status('ready'); canvas.dataset.state = 'ready'; wake() }, { signal: controller.signal })
  document.addEventListener('visibilitychange', () => { runtime.suspend(); if (document.hidden) { cancelFrame(); stats(true) } else wake() }, { signal: controller.signal })
  media.addEventListener('change', () => { runtime.suspend(); wake() }, { signal: controller.signal })
  stackedMedia.addEventListener('change', () => measure(), { signal: controller.signal })
  touchMedia.addEventListener('change', () => measure(), { signal: controller.signal })
  const resize = new ResizeObserver(() => measure())
  resize.observe(canvas)
  const observer = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; runtime.suspend(); if (visible) wake(); else { cancelFrame(); stats(true) } })
  observer.observe(canvas)
  measure()

  let failed = 0
  for (const id of ids) {
    void loader.load(portfolioAssetUrl(`about-${id}`), controller.signal).then(gltf => {
      if (disposed) { disposeModel(gltf.scene); return }
      const model = gltf.scene
      const bounds = new THREE.Box3().setFromObject(model)
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3())
      const factor = (id === 'bass' ? 2.95 : id === 'knight' ? 2.4 : 1.95) / Math.max(size.x, size.y, size.z)
      const pose = new THREE.Group(), group = new THREE.Group()
      model.position.copy(center).multiplyScalar(-factor)
      model.scale.setScalar(factor)
      pose.add(model); group.add(pose); scene.add(group)
      group.userData.interest = id
      group.scale.setScalar(.01)
      const specimen: Specimen = { id, group, model, pose, view: { yaw: 0, pitch: 0 }, bowX: 0, strings: [], stringX: [], notes: [], noteY: [], tiles: new Map(), materials: [], boardMaterials: [], boardOpacity: 0, opacity: 1 }
      group.updateWorldMatrix(true, true)
      const boardCopies = new Map<THREE.Material, THREE.Material>()
      model.traverse(node => {
        if (node instanceof THREE.Mesh) {
          geometries.add(node.geometry)
          let parent: THREE.Object3D | null = node
          let onBoard = false
          while (parent) { if (parent.name === 'board') onBoard = true; parent = parent.parent }
          if (onBoard) {
            const original = Array.isArray(node.material) ? node.material : [node.material]
            original.forEach(material => materials.add(material))
            node.material = Array.isArray(node.material) ? node.material.map(material => cloneInterestBoardMaterial(material, boardCopies)) : cloneInterestBoardMaterial(node.material, boardCopies)
          }
          const list = Array.isArray(node.material) ? node.material : [node.material]
          for (const material of list) {
            materials.add(material)
            for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
            if (material instanceof THREE.MeshStandardMaterial) { material.transparent = true; material.forceSinglePass = true; material.opacity = onBoard ? 0 : 1; specimen.materials.push(material); if (onBoard) specimen.boardMaterials.push(material) }
          }
        }
        if (/^tile-[a-h][1-8]$/.test(node.name)) {
          const tileBounds = new THREE.Box3().setFromObject(node)
          const point = tileBounds.getCenter(new THREE.Vector3()); point.y = tileBounds.max.y
          specimen.tiles.set(node.name.slice(5), model.worldToLocal(point))
        }
      })
      specimen.boardMaterials = [...new Set(specimen.boardMaterials)]
      specimen.materials = [...new Set(specimen.materials)].filter(material => !specimen.boardMaterials.includes(material))
      specimen.pen = model.getObjectByName('pen')
      specimen.notation = model.getObjectByName('score-notation')
      specimen.bow = model.getObjectByName('bow'); specimen.bowX = specimen.bow?.position.x ?? 0
      for (const letter of ['e', 'a', 'd', 'g']) { const string = model.getObjectByName(`string-${letter}`); if (string) { specimen.strings.push(string); specimen.stringX.push(string.position.x) } }
      for (let i = 0; i < 4; i++) { const note = model.getObjectByName(`note-${i}`); if (note) { specimen.notes.push(note); specimen.noteY.push(note.position.y) } }
      specimen.knight = model.getObjectByName('knight')
      specimen.board = model.getObjectByName('board')
      specimen.knightStart = specimen.knight?.position.clone()
      if (id === 'knight' && specimen.knight) {
        if(gameState){specimen.chess=createChessSet(model,specimen.knight,specimen.tiles,geometries,materials);specimen.chess.update(gameState)}
        if (specimen.board) {
          specimen.boardBatch = batchBoardTiles(specimen.board)
          specimen.boardLabels = createBoardLabels(specimen.board)
        }
      }
      if (id === 'score') {
        const geometry = new THREE.PlaneGeometry(1.04,1.42,32,44)
        const positions=geometry.getAttribute('position')
        for(let i=0;i<positions.count;i++){
          const x=positions.getX(i),y=positions.getY(i)
          let px=x,py=y,z=.033*Math.cos(y*2)+.036*(x/.52)**2+.033*(y/.71)**2+.028*Math.sin(y*3+.3)*Math.sin(x*2)
          const distance=Math.max(0,(x+y-.83)/Math.SQRT2)
          if(distance>0){const radius=.19,angle=distance/radius,retreat=(distance-radius*Math.sin(angle))/Math.SQRT2;px-=retreat;py-=retreat;z+=radius*(1-Math.cos(angle))}
          positions.setXYZ(i,px,py,z+.013)
        }
        geometry.computeVertexNormals(); geometries.add(geometry)
        const material=new THREE.MeshBasicMaterial({map:scoreTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide})
        materials.add(material);specimen.scoreOverlay=new THREE.Mesh(geometry,material);specimen.scoreOverlay.renderOrder=10;specimen.scoreOverlay.visible=false;model.add(specimen.scoreOverlay)
      }
      if (specimen.knight) { const destination = knightDestination(specimen, square); if (destination) specimen.knight.position.copy(destination) }
      specimens.push(specimen)
      if (id === 'bass') model.add(finger)
      restoreMarkers(); settling = true; wake()
      canvas.dataset.loadedObjects = String(specimens.length)
      if (specimens.length + failed === ids.length) { canvas.dataset.state = failed ? 'error' : 'ready'; status(failed ? 'error' : 'ready') }
    }).catch(error => {
      if (disposed) return
      failed++; console.warn(`Could not load personal object ${id}`, error)
      if (specimens.length + failed === ids.length) { canvas.dataset.state = 'error'; status('error') }
    })
  }

  return {
    select(id) { selected = id; if(!id)galleryHeight=Math.max(1,canvas.parentElement?.clientHeight??height); jumping = null; manualYaw = 0; manualPitch = 0; canvas.style.cursor = idleCursor(); restoreMarkers(); settling = true; wake() },
    setPlaying(value) { if (playing === value) return; playing = value; runtime.suspend(); stats(true); wake() },
    setDark(value) { darkTheme = value; shader.uniforms.ink.value.copy(readPrintPalette(canvas, value).ink); wake() },
    pluck(index) { pulses[index] = .9; bassString = index; wake() },
    setNotes(notes) { noteSequence = notes; wake() },
    setPuzzle(next, moves, destination = 'h8', path = [], blocked = [], targets = []) {
      square = next; legal = moves; destinationSquare = destination; puzzlePath = path; blockedSquares=blocked;checkpoints=targets
      const specimen = specimens.find(item => item.id === 'knight')
      if (specimen?.knight) { const to = knightDestination(specimen, next); if (to) jumping = { from: specimen.knight.position.clone(), to: to.clone(), elapsed: 0 } }
      restoreMarkers(); wake()
    },
    setBass(articulation, position) { bassArticulation = articulation; bassPosition = position; wake() },
    setScore(notes,title,tempo,page,activeIndex) { scoreState={notes,title,tempo,page,activeIndex};scoreDirty=true;wake() },
    setGame(state) { gameState=state;const item=specimens.find(item=>item.id==='knight');if(state&&item?.knight){item.chess??=createChessSet(item.model,item.knight,item.tiles,geometries,materials);item.chess.update(state)}restoreMarkers();wake() },
    resetView() { manualYaw = 0; manualPitch = 0; wake() },
    dispose() {
      if (disposed) return
      stats(true); disposed = true; runtime.suspend(); cancelFrame(); controller.abort(); loader.dispose(); resize.disconnect(); observer.disconnect()
      for (const specimen of specimens) { specimen.boardBatch?.dispose(); specimen.boardLabels?.dispose() }
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      for (const texture of textures) {
        texture.dispose()
        if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close()
      }
      markerGeometry.dispose(); goalGeometry.dispose(); fingerGeometry.dispose(); markerMaterial.dispose(); lightMarkerMaterial.dispose(); target.dispose(); shader.dispose(); quadGeometry.dispose(); renderer.dispose()
      canvas.dataset.state = 'disposed'
    },
  }
}
