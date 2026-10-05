import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { batchChessTemplate, bindChessBatchPicking } from '../src/personal/about/chess-batching.ts'
import { createChessSet } from '../src/personal/about/chess-scene.ts'
import { chessModel } from './fixtures/chess-model.ts'
import type { ChessSceneState } from '../src/personal/about/ChessGame.tsx'

function meshes(root: THREE.Object3D) {
  const result: THREE.Mesh[] = []
  root.traverse(node => { if (node instanceof THREE.Mesh) result.push(node) })
  return result
}
function triangles(mesh: THREE.Mesh) { return (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3 }
function squareOf(object: THREE.Object3D): string | undefined {
  let node: THREE.Object3D | null = object
  while (node) { if (node.userData.chessSquare) return node.userData.chessSquare; node = node.parent }
}
function state(pieces: ChessSceneState['pieces'], lastMove: string[] = []): ChessSceneState {
  return { pieces, lastMove, selected: null, legal: [], check: null, flipped: false }
}
function startingPieces() {
  const pieces: ChessSceneState['pieces'] = []
  const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'] as const
  for (const color of ['w', 'b'] as const) for (let file = 0; file < 8; file++) {
    pieces.push({ square: `${'abcdefgh'[file]}${color === 'w' ? 1 : 8}`, type: back[file], color })
    pieces.push({ square: `${'abcdefgh'[file]}${color === 'w' ? 2 : 7}`, type: 'p', color })
  }
  return pieces
}
async function setFixture() {
  const parent = new THREE.Group(), knight = new THREE.Group()
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
  for (let part = 0; part < 3; part++) {
    const geometry = new THREE.BoxGeometry(.05, .1, .05)
    const material = new THREE.MeshStandardMaterial()
    geometries.add(geometry)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = part === 2 ? 'knight-relief' : `knight-part-${part}`
    mesh.position.set(0, part * .08, 0)
    knight.add(mesh)
  }
  const tiles = new Map<string, THREE.Vector3>()
  for (let rank = 0; rank < 8; rank++) for (let file = 0; file < 8; file++) tiles.set(`${'abcdefgh'[file]}${rank + 1}`, new THREE.Vector3((file - 3.5) * .28, .025, (3.5 - rank) * .28))
  const set = createChessSet(parent, knight, tiles, geometries, materials, await chessModel())
  return { parent, tiles, geometries, materials, set }
}
function rayAbove(point: THREE.Vector3) { return new THREE.Raycaster(point.clone().add(new THREE.Vector3(0, 3, 0)), new THREE.Vector3(0, -1, 0)) }

test('starting chess position clones the baked GLB into68 draws and shared template buffers', async () => {
  const { parent, set, geometries, materials } = await setFixture()
  set.update(state(startingPieces()))
  parent.updateMatrixWorld(true)
  assert.equal(set.root.children.length, 32)
  const all = meshes(set.root)
  const sources = all.filter(mesh => !mesh.userData.chessBatchSourceIndices)
  const drawn = all.filter(mesh => mesh.layers.isEnabled(0))
  assert.equal(sources.length, 68)
  assert.equal(drawn.length, 68)
  assert.equal(drawn.reduce((sum, mesh) => sum + triangles(mesh), 0), sources.reduce((sum, mesh) => sum + triangles(mesh), 0))
  for (const group of set.root.children) {
    const kind = group.name.slice(-2)
    assert.equal(meshes(group).filter(mesh => mesh.layers.isEnabled(0)).length, kind[1] === 'n' ? 3 : 2)
  }
  const pawnA = meshes(set.root.getObjectByName('chess-a2-wp')!)
  const pawnB = meshes(set.root.getObjectByName('chess-b2-wp')!)
  assert.equal(pawnA[0].geometry, pawnB[0].geometry)
  assert.equal(pawnA[0].material, pawnB[0].material)
  assert(geometries.has(pawnA[0].geometry))
  assert.equal(materials.size, 8) // two companion inks and three carved-knight materials per color
  const allocationCount = geometries.size
  for (let update = 0; update < 10; update++) set.update(state(startingPieces()))
  assert.equal(geometries.size, allocationCount)
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
})

test('merging retains named local pivots, extras, material identity and exact transformed vertices', () => {
  const root = new THREE.Group()
  root.position.set(.3, -.2, .5); root.rotation.set(.2, .1, -.3)
  const material = new THREE.MeshStandardMaterial()
  const sources = [new THREE.Mesh(new THREE.BoxGeometry(.1, .2, .15), material), new THREE.Mesh(new THREE.BoxGeometry(.12, .13, .14), material)]
  sources.forEach((source, index) => {
    source.name = `piece-part-${index}`
    source.position.set(index * .23, .08 + index * .1, .06)
    source.rotation.set(.05 * index, .22 * index, -.1 * index)
    source.scale.set(.8 + index * .2, .7 + index * .4, .9)
    source.userData = { pivot: source.position.toArray(), author: 'retained' }
    root.add(source)
  })
  const before = sources.map(source => ({ geometry: source.geometry, position: source.position.toArray(), rotation: source.rotation.toArray(), scale: source.scale.toArray(), extras: JSON.stringify(source.userData) }))
  const geometries = new Set<THREE.BufferGeometry>()
  const batched = batchChessTemplate(root, geometries)
  assert.equal(batched.sourceCalls, 2); assert.equal(batched.calls, 1)
  const batch = meshes(root).find(mesh => mesh.userData.chessBatchSourceIndices)!
  assert.equal(batch.material, material)
  assert.equal(triangles(batch), sources.reduce((sum, source) => sum + triangles(source), 0))
  root.updateMatrixWorld(true)
  let offset = 0
  const merged = batch.geometry.getAttribute('position')
  sources.forEach((source, index) => {
    assert.equal(root.getObjectByName(source.name), source)
    assert.equal(source.geometry, before[index].geometry)
    assert.deepEqual(source.position.toArray(), before[index].position)
    assert.deepEqual(source.rotation.toArray(), before[index].rotation)
    assert.deepEqual(source.scale.toArray(), before[index].scale)
    assert.equal(JSON.stringify(source.userData), before[index].extras)
    const position = source.geometry.getAttribute('position')
    for (let vertex = 0; vertex < position.count; vertex++) {
      const actual = new THREE.Vector3().fromBufferAttribute(merged, offset + vertex).applyMatrix4(batch.matrixWorld)
      const expected = new THREE.Vector3().fromBufferAttribute(position, vertex).applyMatrix4(source.matrixWorld)
      assert(actual.distanceTo(expected) < 2e-7)
    }
    offset += position.count
  })
  let disposed = 0
  batch.geometry.addEventListener('dispose', () => disposed++)
  batch.geometry.dispose()
  batched.release()
  assert.equal(disposed, 1)
  assert(sources.every(source => source.layers.isEnabled(0)))
  assert.equal(batch.parent, null)
})

test('cloned batch picking returns the clone parts and exact original faces, even after piece movement', () => {
  const root = new THREE.Group()
  const material = new THREE.MeshStandardMaterial()
  for (let index = 0; index < 2; index++) {
    const part = new THREE.Mesh(new THREE.BoxGeometry(.15, .25, .15), material)
    part.name = `named-part-${index}`; part.position.x = index * .3; root.add(part)
  }
  const geometries = new Set<THREE.BufferGeometry>()
  batchChessTemplate(root, geometries)
  const clone = root.clone(true)
  clone.position.set(.2, .1, -.2); clone.userData.chessSquare = 'c4'
  const release = bindChessBatchPicking(clone)
  clone.updateMatrixWorld(true)
  const source = clone.getObjectByName('named-part-1') as THREE.Mesh
  const ray = rayAbove(source.getWorldPosition(new THREE.Vector3()))
  const baseline: THREE.Intersection[] = []
  source.raycast(ray, baseline)
  const hits = ray.intersectObject(clone, true).filter(hit => hit.object === source)
  assert(hits.length > 0); assert.equal(hits.length, baseline.length)
  hits.forEach((hit, index) => {
    assert.equal(hit.object, source)
    assert.equal(squareOf(hit.object), 'c4')
    assert.equal(hit.faceIndex, baseline[index].faceIndex)
    assert.deepEqual(hit.face, baseline[index].face)
    assert.deepEqual(hit.point.toArray(), baseline[index].point.toArray())
    assert.deepEqual(hit.normal?.toArray(), baseline[index].normal?.toArray())
  })
  clone.visible = false
  assert.equal(ray.intersectObject(clone, true).length, 0)
  release(); release()
  assert(meshes(clone).every(mesh => mesh.layers.isEnabled(0)))
  for (const geometry of geometries) geometry.dispose()
  assert(meshes(root).every(mesh => mesh.layers.isEnabled(0)))
})

test('captures, promotion, smooth movement and reduced-motion settling retain square picks without allocating buffers', async () => {
  const { parent, set, tiles, geometries } = await setFixture()
  set.update(state([{ square: 'a2', type: 'p', color: 'w' }, { square: 'b3', type: 'r', color: 'b' }, { square: 'g1', type: 'n', color: 'w' }]))
  const pawn = set.root.getObjectByName('chess-a2-wp')!
  const captured = set.root.getObjectByName('chess-b3-br')!
  const knight = set.root.getObjectByName('chess-g1-wn')!
  const allocationCount = geometries.size
  set.update(state([{ square: 'b3', type: 'p', color: 'w' }, { square: 'g1', type: 'n', color: 'w' }], ['a2', 'b3']))
  assert.equal(set.root.getObjectByName('chess-b3-wp'), pawn)
  assert.equal(captured.parent, null)
  assert(meshes(captured).every(mesh => mesh.layers.isEnabled(0)))
  assert.equal(set.tick(.18, false), true)
  assert(pawn.position.distanceTo(tiles.get('a2')!.clone().lerp(tiles.get('b3')!, .5)) < 1e-12)
  parent.updateMatrixWorld(true)
  assert(rayAbove(pawn.position).intersectObject(pawn, true).every(hit => squareOf(hit.object) === 'b3'))
  assert.equal(set.tick(0, true), false)
  assert.deepEqual(pawn.position.toArray(), tiles.get('b3')!.toArray())
  set.update(state([{ square: 'b3', type: 'p', color: 'w' }, { square: 'f3', type: 'n', color: 'w' }], ['g1', 'f3']))
  set.tick(.18, false)
  assert.equal(knight.userData.chessSquare, 'f3')
  assert(Math.abs(knight.position.y - tiles.get('f3')!.y - .14) < 1e-12)
  set.tick(0, true)
  assert.deepEqual(knight.position.toArray(), tiles.get('f3')!.toArray())
  set.update(state([{ square: 'b3', type: 'q', color: 'w' }, { square: 'f3', type: 'n', color: 'w' }]))
  const promoted = set.root.getObjectByName('chess-b3-wq')!
  assert(promoted); assert.notEqual(promoted, pawn); assert.equal(pawn.parent, null)
  assert(meshes(pawn).every(mesh => mesh.layers.isEnabled(0)))
  parent.updateMatrixWorld(true)
  const hits = rayAbove(promoted.position).intersectObject(promoted, true)
  assert(hits.length > 0); assert(hits.every(hit => squareOf(hit.object) === 'b3'))
  assert.equal(geometries.size, allocationCount)
  const geometriesDisposed = new Map<THREE.BufferGeometry, number>()
  for (const geometry of geometries) geometry.addEventListener('dispose', () => geometriesDisposed.set(geometry, (geometriesDisposed.get(geometry) ?? 0) + 1))
  for (const geometry of geometries) geometry.dispose()
  assert.equal(geometriesDisposed.size, allocationCount)
  assert([...geometriesDisposed.values()].every(count => count === 1))
  assert(meshes(set.root).every(mesh => mesh.layers.isEnabled(0)))
})

test('unsupported draw ranges, material arrays and mirrored parts keep their original draw and pick paths', () => {
  const root = new THREE.Group(), material = new THREE.MeshStandardMaterial()
  const sources: THREE.Mesh[] = Array.from({ length: 5 }, () => new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), material))
  sources[2].geometry.setDrawRange(3, 6)
  sources[3].material = [material]
  sources[4].scale.x = -1
  for (const source of sources) root.add(source)
  const geometries = new Set<THREE.BufferGeometry>()
  const batch = batchChessTemplate(root, geometries)
  assert.equal(batch.sourceCalls, 5); assert.equal(batch.calls, 4)
  assert(sources.slice(2).every(source => source.layers.isEnabled(0)))
  batch.release()
  assert(sources.every(source => source.layers.isEnabled(0)))
  for (const geometry of geometries) geometry.dispose()
})
