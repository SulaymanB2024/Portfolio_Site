import * as THREE from 'three'
import { PORTFOLIO_DITHER_GLSL } from '../dither-kernel'
import { readPrintPalette } from '../print-palette'
import { portfolioAssetUrl } from '../portfolio-assets'
import { createPortfolioModelLoader } from '../portfolio-model-loader'
import { disposeModel } from '../../model-resources'
import type { ResumeChapterId } from './resume-chapters'

export const resumeWorkForms: Record<ResumeChapterId, readonly [string, string, string]> = {
  chegg: ['records', 'cluster', 'dialogue'],
  sapien: ['cluster', 'compare', 'report'],
  void: ['plan', 'network', 'audit'],
  'internship-deadlines': ['records', 'search', 'calendar'],
  'creative-trace': ['film', 'cluster', 'frames'],
  'venture-labs': ['cluster', 'matrix', 'route'],
  'ai-venture': ['plan', 'network', 'image'],
}

/** Baked GLB work templates; the only native mesh is the postprocessing quad. */
export function mountResumeWorkObjects(canvas: HTMLCanvasElement, chapter: ResumeChapterId, status: (state: 'loading' | 'ready' | 'error') => void = () => {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setClearColor(0, 0)
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-4, 4, 1.7, -1.7, .1, 50)
  camera.position.set(0, 0, 12)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.2))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-3, 5, 8); scene.add(light)
  const target = new THREE.WebGLRenderTarget(800, 340)
  const post = new THREE.Scene(), postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const themeRoot = canvas.closest('[data-appearance]') ?? document.documentElement
  const palette = () => readPrintPalette(canvas, themeRoot.getAttribute('data-appearance') === 'dark')
  const shader = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms: { image: { value: target.texture }, ink: { value: palette().ink }, cssSize: { value: new THREE.Vector2(800, 340) } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: [
      'uniform sampler2D image;uniform vec3 ink;uniform vec2 cssSize;varying vec2 vUv;',
      PORTFOLIO_DITHER_GLSL,
      'void main(){vec4 s=texture2D(image,vUv);if(s.a<.001){gl_FragColor=vec4(0.);return;}float tone=portfolioDisplayLuminance(portfolioStraightColor(s));float a=s.a*(1.-step(portfolioBayer8(floor(vUv*cssSize)),tone));gl_FragColor=vec4(ink,a);',
      '#include <colorspace_fragment>',
      '}',
    ].join('\n'),
  })
  const quad = new THREE.PlaneGeometry(2, 2)
  post.add(new THREE.Mesh(quad, shader))
  const loader = createPortfolioModelLoader(), request = new AbortController()
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const groups: THREE.Group[] = []
  let assetState: 'loading' | 'ready' | 'error' = 'loading'
  let source: THREE.Group | null = null, disposed = false, lost = false, visible = true, selected = 0, frame = 0, last: number | undefined
  let drawnFrames = 0
  const url = portfolioAssetUrl('resume-work-areas')
  canvas.dataset.assets = 'glb'; canvas.dataset.modelAsset = url; canvas.dataset.state = 'loading'
  status('loading')

  function draw() {
    if (disposed || lost || !visible || document.hidden || !source) return
    renderer.setRenderTarget(target); renderer.render(scene, camera)
    renderer.setRenderTarget(null); renderer.render(post, postCamera)
    canvas.dataset.renderFrames = String(++drawnFrames)
    canvas.dataset.selectedStage = String(selected)
  }
  function cancel() { cancelAnimationFrame(frame); frame = 0; last = undefined }
  function paint(now: number) {
    frame = 0
    if (disposed || lost || !visible || document.hidden || !source) return
    if (last !== undefined && now - last < 1000 / 30) { frame = requestAnimationFrame(paint); return }
    const dt = last === undefined ? 1 / 30 : Math.min(.08, (now - last) / 1000)
    last = now
    let moving = false
    groups.forEach((group, index) => {
      const yaw = index === selected ? -.22 : -.50
      group.rotation.y = motion.matches ? yaw : group.rotation.y + (yaw - group.rotation.y) * (1 - Math.exp(-dt * 9))
      moving ||= Math.abs(yaw - group.rotation.y) > .002
    })
    draw()
    if (moving) frame = requestAnimationFrame(paint)
  }
  function wake() { cancel(); if (!disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(paint) }
  const resize = new ResizeObserver(() => {
    if (disposed) return
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight), ratio = Math.min(devicePixelRatio, 1.5, 900 / width)
    renderer.setSize(Math.round(width * ratio), Math.round(height * ratio), false)
    target.setSize(renderer.domElement.width, renderer.domElement.height)
    shader.uniforms.cssSize.value.set(width, height); wake()
  })
  resize.observe(canvas)
  const theme = new MutationObserver(() => { shader.uniforms.ink.value.copy(palette().ink); wake() })
  theme.observe(themeRoot, { attributes: true, attributeFilter: ['data-appearance'] })
  const viewport = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; visible ? wake() : cancel() })
  viewport.observe(canvas)
  const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancel(); canvas.dataset.state = 'context-lost' }
  const contextRestored = () => { lost = false; canvas.dataset.state = assetState; wake() }
  canvas.addEventListener('webglcontextlost', contextLost)
  canvas.addEventListener('webglcontextrestored', contextRestored)
  document.addEventListener('visibilitychange', wake)
  motion.addEventListener('change', wake)

  void loader.load(url, request.signal).then(gltf => {
    if (disposed) { disposeModel(gltf.scene); return }
    source = gltf.scene
    for (const [index, form] of resumeWorkForms[chapter].entries()) {
      const template = source.getObjectByName('resume-form-' + form)
      if (!template) throw new Error('Missing résumé GLB template: ' + form)
      const group = new THREE.Group()
      group.name = 'selected-work-' + form; group.position.x = (index - 1) * 2.55; group.rotation.set(.18, -.35, .025)
      group.add(template.clone(true)); groups.push(group); scene.add(group)
    }
    assetState = 'ready'; canvas.dataset.state = lost ? 'context-lost' : assetState; canvas.dataset.loadedForms = String(groups.length)
    status('ready'); wake()
  }).catch(error => {
    if (disposed || error?.name === 'AbortError') return
    assetState = 'error'; canvas.dataset.state = lost ? 'context-lost' : assetState; status('error')
  })

  return {
    select(index: number) { if (!Number.isInteger(index) || index < 0 || index > 2) return; selected = index; wake() },
    dispose() {
      if (disposed) return
      disposed = true; cancel(); request.abort(); loader.dispose()
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored)
      document.removeEventListener('visibilitychange', wake); motion.removeEventListener('change', wake)
      viewport.disconnect(); resize.disconnect(); theme.disconnect()
      if (source) disposeModel(source)
      groups.forEach(group => scene.remove(group))
      target.dispose(); quad.dispose(); shader.dispose(); renderer.dispose(); renderer.forceContextLoss()
      canvas.dataset.state = 'disposed'
    },
  }
}
