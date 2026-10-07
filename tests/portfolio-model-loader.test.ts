import test from 'node:test'
import assert from 'node:assert/strict'
import { BufferGeometry, Group, Mesh, MeshBasicMaterial } from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { createPortfolioModelLoader } from '../src/personal/portfolio-model-loader.ts'

function glbHeader() {
  const bytes = new Uint8Array(28), header = new DataView(bytes.buffer)
  header.setUint32(0, 0x46546c67, true); header.setUint32(4, 2, true)
  header.setUint32(8, bytes.length, true); header.setUint32(12, 8, true)
  header.setUint32(16, 0x4e4f534a, true)
  return bytes
}

test('non-GLB paths and invalid binary responses never reach the decoder', async context => {
  let fetches = 0, parses = 0
  let response = new Uint8Array(2)
  context.mock.method(globalThis, 'fetch', async () => { fetches++; return new Response(response) })
  context.mock.method(GLTFLoader.prototype, 'parseAsync', async () => { parses++; return {} as GLTF })
  const loader = createPortfolioModelLoader('/')
  await assert.rejects(loader.load('/model.gltf'), /must be GLB/)
  assert.equal(fetches, 0)
  await assert.rejects(loader.load('/model.glb?v=123'), /Truncated GLB/)
  assert.equal(fetches, 1); assert.equal(parses, 0)
  response = glbHeader(); response[0] = 0
  await assert.rejects(loader.load('/model.glb?v=123'), /Invalid binary glTF/)
  assert.equal(fetches, 2); assert.equal(parses, 0)
  loader.dispose()
})

test('superseded fetches abort without starting a decode', async context => {
  let parses = 0
  context.mock.method(GLTFLoader.prototype, 'parseAsync', async () => { parses++; return {} as GLTF })
  context.mock.method(globalThis, 'fetch', (_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
    init.signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
  }))
  const loader = createPortfolioModelLoader('/')
  const controller = new AbortController()
  const pending = loader.load('/test.glb', controller.signal)
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal(parses, 0)
  loader.dispose()
})

test('renderer disposal aborts the download and rejects a response arriving afterward', async context => {
  let respond!: (response: Response) => void
  let signal!: AbortSignal
  let parses = 0, decoderDisposals = 0
  context.mock.method(globalThis, 'fetch', (_url: string, init: RequestInit) => {
    signal = init.signal!
    // Simulate a response already queued when the renderer leaves the page.
    return new Promise<Response>(resolve => { respond = resolve })
  })
  context.mock.method(GLTFLoader.prototype, 'parseAsync', async () => { parses++; return {} as GLTF })
  context.mock.method(DRACOLoader.prototype, 'dispose', () => { decoderDisposals++ })
  const loader = createPortfolioModelLoader('/')
  const pending = loader.load('/helmet.glb')
  loader.dispose()
  assert.equal(signal.aborted, true)
  respond(new Response(glbHeader()))
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal(parses, 0)
  assert.equal(decoderDisposals, 1)
  loader.dispose()
  assert.equal(decoderDisposals, 1)
})

test('a decoder is released only after all active parses settle during departure', async context => {
  const finish: ((model: GLTF) => void)[] = []
  let ready!: () => void, decoderDisposals = 0
  const bothParsing = new Promise<void>(resolve => { ready = resolve })
  context.mock.method(globalThis, 'fetch', async () => new Response(glbHeader()))
  context.mock.method(GLTFLoader.prototype, 'parseAsync', () => new Promise<GLTF>(resolve => {
    finish.push(resolve)
    if (finish.length === 2) ready()
  }))
  context.mock.method(DRACOLoader.prototype, 'dispose', () => { decoderDisposals++ })
  const loader = createPortfolioModelLoader('/')
  const helmet = loader.load('/helmet.glb'), portal = loader.load('/portal.glb')
  await bothParsing
  loader.dispose()
  assert.equal(decoderDisposals, 0)
  finish[0]({ scene: new Group() } as GLTF)
  await assert.rejects(helmet, { name: 'AbortError' })
  assert.equal(decoderDisposals, 0)
  finish[1]({ scene: new Group() } as GLTF)
  await assert.rejects(portal, { name: 'AbortError' })
  assert.equal(decoderDisposals, 1)
})

test('a decode completing after teardown releases shared resources exactly once', async context => {
  const geometry = new BufferGeometry(), material = new MeshBasicMaterial(), scene = new Group()
  scene.add(new Mesh(geometry, material), new Mesh(geometry, material))
  let releasedGeometry = 0, releasedMaterial = 0
  geometry.addEventListener('dispose', () => releasedGeometry++)
  material.addEventListener('dispose', () => releasedMaterial++)
  let finish!: (gltf: GLTF) => void
  let began!: () => void
  const started = new Promise<void>(resolve => { began = resolve })
  context.mock.method(globalThis, 'fetch', async () => new Response(glbHeader()))
  context.mock.method(GLTFLoader.prototype, 'parseAsync', () => { began(); return new Promise<GLTF>(resolve => { finish = resolve }) })
  const loader = createPortfolioModelLoader('/')
  const pending = loader.load('/test.glb')
  await started
  loader.dispose()
  loader.dispose()
  finish({ scene } as GLTF)
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal(releasedGeometry, 1)
  assert.equal(releasedMaterial, 1)
  await assert.rejects(loader.load('/test.glb'), { name: 'AbortError' })
})
