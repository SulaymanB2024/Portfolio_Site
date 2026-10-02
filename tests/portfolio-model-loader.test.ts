import test from 'node:test'
import assert from 'node:assert/strict'
import { BufferGeometry, Group, Mesh, MeshBasicMaterial } from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { createPortfolioModelLoader } from '../src/personal/portfolio-model-loader.ts'

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

test('a decode completing after teardown releases shared resources exactly once', async context => {
  const geometry = new BufferGeometry(), material = new MeshBasicMaterial(), scene = new Group()
  scene.add(new Mesh(geometry, material), new Mesh(geometry, material))
  let releasedGeometry = 0, releasedMaterial = 0
  geometry.addEventListener('dispose', () => releasedGeometry++)
  material.addEventListener('dispose', () => releasedMaterial++)
  let finish!: (gltf: GLTF) => void
  let began!: () => void
  const started = new Promise<void>(resolve => { began = resolve })
  context.mock.method(globalThis, 'fetch', async () => new Response(new Uint8Array(4)))
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
