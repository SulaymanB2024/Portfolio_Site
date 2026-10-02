import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import './model-library.css'

interface Model {
  slug: string
  name: string
  viewerUrl?: string
  creator: { displayName: string; profileUrl?: string }
  license: { label: string; url?: string; slug: string }
  attribution?: string
  origin?: string
  profiles: Record<string, { bytes: number }>
}
const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const canvas = element<HTMLCanvasElement>('model-canvas')
const status = element('load-status')
const selection = element<HTMLSelectElement>('model')
const quality = element<HTMLSelectElement>('quality')
try {
  initializeLibrary()
} catch (error) {
  status.textContent = 'This preview needs WebGL. Open it in a browser with WebGL enabled.'
  for (const button of document.querySelectorAll('button')) button.disabled = true
  console.error(error)
}
function initializeLibrary() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#202328')
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100)
  const controls = new OrbitControls(camera, canvas)
  controls.minDistance = 1
  controls.maxDistance = 15
  controls.listenToKeyEvents(canvas)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room)
  room.dispose()
  pmrem.dispose()
  scene.environment = environment.texture
  const draco = new DRACOLoader().setDecoderPath(`${import.meta.env.BASE_URL}draco/`)
  draco.setWorkerLimit(2)
  const loader = new GLTFLoader().setDRACOLoader(draco)
  let current: THREE.Group | null = null
  let pending = 0
  let loadSequence = 0
  let autoOrbit = false
  let frames = 0
  let previousTime = 0
  let models: Model[] = []
  let fitDistance = 3.4

  function requestRender() {
    if (!pending && !document.hidden) pending = requestAnimationFrame(render)
  }
  function render(time: number) {
    pending = 0
    if (document.hidden) return
    controls.autoRotate = autoOrbit
    controls.update(previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0)
    previousTime = time
    renderer.render(scene, camera)
    canvas.dataset.frames = String(++frames)
    canvas.dataset.triangles = String(renderer.info.render.triangles)
    canvas.dataset.geometries = String(renderer.info.memory.geometries)
    canvas.dataset.textures = String(renderer.info.memory.textures)
    canvas.dataset.drawCalls = String(renderer.info.render.calls)
    if (autoOrbit) requestRender()
  }
  controls.addEventListener('change', requestRender)
  function reset() {
    fitDistance = fittedDistance()
    camera.position.set(0, fitDistance * 0.1, fitDistance)
    controls.target.set(0, 0, 0)
    controls.update()
    requestRender()
  }
  function fittedDistance() {
    if (!current) return 3.4
    const size = new THREE.Box3().setFromObject(current).getSize(new THREE.Vector3())
    const extent = Math.max(size.y, size.x / camera.aspect)
    return (extent / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) * 1.25 + size.z / 2
  }
  function dispose(object: THREE.Object3D) {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    object.traverse((node) => {
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
  function creditLink(title: string, url?: string): Node {
    if (!url) return document.createTextNode(title)
    const link = document.createElement('a')
    link.textContent = title
    link.href = url
    link.target = '_blank'
    link.rel = 'noreferrer'
    return link
  }
  async function loadModel() {
    const sequence = ++loadSequence
    const model = models.find((model) => model.slug === selection.value)
    const profile = quality.value
    if (!model?.profiles?.[profile]) {
      status.textContent = 'This model is not available in the collection yet.'
      canvas.dataset.state = 'error'
      return
    }
    const url = `${import.meta.env.BASE_URL}models/${model.slug}-${profile}.glb`
    status.textContent = `Loading ${model.name}…`
    canvas.dataset.state = 'loading'
    try {
      const gltf = await loader.loadAsync(url)
      if (sequence !== loadSequence) {
        dispose(gltf.scene)
        return
      }
      if (current) {
        scene.remove(current)
        dispose(current)
      }
      const bounds = new THREE.Box3().setFromObject(gltf.scene)
      const size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      gltf.scene.position.sub(center)
      current = new THREE.Group()
      current.add(gltf.scene)
      current.scale.setScalar(1.9 / Math.max(size.x, size.y, size.z))
      // Display-only starting views; source hierarchy and transforms stay intact.
      if (model.slug === 'king-erik-xiv') current.rotation.y = -Math.PI / 3
      if (model.slug === 'farnese-atlas') current.rotation.y = Math.PI / 3
      scene.add(current)
      renderer.renderLists.dispose()
      reset()
      // Commit attribution and download alongside the object actually displayed.
      element('asset-title').textContent = model.name
      element('asset-stats').textContent =
        `${(model.profiles[profile].bytes / 1e6).toFixed(2)} MB · ${model.origin === 'user-provided' ? 'Full geometry · procedural materials' : `${profile === 'studio' ? '4K' : '2K'} textures`}`
      element('asset-credit').replaceChildren(
        creditLink(model.name, model.viewerUrl),
        model.origin === 'user-provided' ? ' · ' : ' by ',
        creditLink(model.creator.displayName, model.creator.profileUrl),
        ' · ',
        creditLink(model.license.label, model.license.url)
      )
      element('license-note').textContent = model.license.slug === 'by-nc' ? 'Non-commercial use only. Attribution required.' : (model.attribution ?? '')
      element<HTMLAnchorElement>('asset-download').href = url
      canvas.dataset.model = model.slug
      canvas.dataset.quality = profile
      canvas.dataset.state = 'ready'
      status.textContent = `${model.name} · ${profile === 'studio' ? 'Studio' : 'Balanced'}`
    } catch (error) {
      if (sequence !== loadSequence) return
      canvas.dataset.state = 'error'
      status.textContent = 'This model could not load. Select it again to retry.'
      console.error(error)
    }
  }
  selection.addEventListener('change', loadModel)
  quality.addEventListener('change', loadModel)
  element('reset').addEventListener('click', reset)
  element('orbit').addEventListener('click', (event) => {
    autoOrbit = !autoOrbit
    ;(event.currentTarget as HTMLElement).setAttribute('aria-pressed', String(autoOrbit))
    previousTime = 0
    requestRender()
  })
  element('background').addEventListener('click', (event) => {
    const button = event.currentTarget as HTMLElement
    const light = button.getAttribute('aria-pressed') !== 'true'
    button.setAttribute('aria-pressed', String(light))
    button.textContent = light ? 'Dark backdrop' : 'Light backdrop'
    canvas.parentElement!.classList.toggle('light', light)
    scene.background = new THREE.Color(light ? '#f6f5f1' : '#202328')
    requestRender()
  })
  const resize = new ResizeObserver(() => {
    const { width, height } = canvas.parentElement!.getBoundingClientRect()
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    if (current) {
      const nextDistance = fittedDistance()
      camera.position
        .sub(controls.target)
        .multiplyScalar(nextDistance / fitDistance)
        .add(controls.target)
      fitDistance = nextDistance
      controls.update()
    }
    requestRender()
  })
  resize.observe(canvas.parentElement!)
  document.addEventListener('visibilitychange', () => {
    previousTime = 0
    if (document.hidden) {
      cancelAnimationFrame(pending)
      pending = 0
    } else requestRender()
  })
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) return
    ++loadSequence
    cancelAnimationFrame(pending)
    resize.disconnect()
    controls.dispose()
    if (current) dispose(current)
    environment.dispose()
    draco.dispose()
    renderer.dispose()
  })
  fetch(`${import.meta.env.BASE_URL}models/manifest.json`)
    .then(async (response) => {
      if (!response.ok) throw new Error('Missing collection manifest')
      models = (await response.json()).models
      for (const option of selection.options) option.disabled = !models.some((model) => model.slug === option.value && model.profiles?.studio && model.profiles?.balanced)
      selection.disabled = false
      quality.disabled = false
      await loadModel()
    })
    .catch((error) => {
      status.textContent = 'The collection could not load.'
      console.error(error)
    })
}
