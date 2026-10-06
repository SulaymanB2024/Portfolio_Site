import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { batchBoardTiles, createBoardLabels } from '../src/personal/about/board-batching.ts'

function fixture() {
  const board = new THREE.Group()
  board.name = 'board'
  board.position.set(.2, -.1, .4)
  board.rotation.set(.31, -.18, .12)
  const materials = [new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })]
  const tiles: THREE.Mesh[] = []
  for (let rank = 0; rank < 8; rank++) for (let file = 0; file < 8; file++) {
    const geometry = new THREE.BoxGeometry(.274 + file * 1e-7, .024, .274)
    geometry.clearGroups()
    const tile = new THREE.Mesh(geometry, materials[(file + rank) % 2])
    tile.name = `tile-${'abcdefgh'[file]}${rank + 1}`
    tile.position.set((file - 3.5) * .28, .014, (3.5 - rank) * .28)
    tile.rotation.x = file * .002
    tile.userData.square = tile.name.slice(5)
    tile.userData.articulationPivot = tile.position.toArray()
    board.add(tile)
    tiles.push(tile)
  }
  board.updateMatrixWorld(true)
  return { board, materials, tiles }
}

function triangles(geometry: THREE.BufferGeometry) { return (geometry.index?.count ?? geometry.getAttribute('position').count) / 3 }
function closeVector(actual: THREE.Vector3, expected: THREE.Vector3) { assert(actual.distanceTo(expected) < 2e-7, `${actual.toArray()} versus ${expected.toArray()}`) }

test('64 tile draws merge into two exact-material draws, retaining triangles, world vertices and source hierarchy', () => {
  const { board, tiles } = fixture()
  const originals = tiles.map(tile => ({ position: tile.position.toArray(), rotation: tile.rotation.toArray(), extras: JSON.stringify(tile.userData), geometry: tile.geometry }))
  const batch = batchBoardTiles(board)
  assert.equal(batch.sourceCalls, 64)
  assert.equal(batch.tileCalls, 2)
  assert.equal(batch.meshes.length, 2)
  assert.equal(batch.meshes.reduce((sum, mesh) => sum + triangles(mesh.geometry), 0), tiles.reduce((sum, mesh) => sum + triangles(mesh.geometry), 0))
  board.updateMatrixWorld(true)
  for (const merged of batch.meshes) {
    const position = merged.geometry.getAttribute('position')
    let offset = 0
    for (const tile of tiles.filter(tile => tile.material === merged.material)) {
      const source = tile.geometry.getAttribute('position')
      for (let vertex = 0; vertex < source.count; vertex++) {
        closeVector(new THREE.Vector3().fromBufferAttribute(position, offset + vertex).applyMatrix4(merged.matrixWorld), new THREE.Vector3().fromBufferAttribute(source, vertex).applyMatrix4(tile.matrixWorld))
      }
      offset += source.count
    }
    assert.equal(offset, position.count)
  }
  tiles.forEach((tile, index) => {
    assert.equal(board.getObjectByName(tile.name), tile)
    assert.equal(tile.geometry, originals[index].geometry)
    assert.deepEqual(tile.position.toArray(), originals[index].position)
    assert.deepEqual(tile.rotation.toArray(), originals[index].rotation)
    assert.equal(JSON.stringify(tile.userData), originals[index].extras)
    assert.equal(tile.visible, true)
  })
  batch.dispose()
})

test('batched picks retain exact source objects, face indices, normals, points and square names', () => {
  const { board, tiles } = fixture()
  const baselines = tiles.map(tile => {
    const center = new THREE.Vector3().applyMatrix4(tile.matrixWorld)
    const up = new THREE.Vector3(0, 1, 0).transformDirection(board.matrixWorld)
    const ray = new THREE.Raycaster(center.clone().addScaledVector(up, 3), up.clone().negate())
    return { ray, hits: ray.intersectObject(tile, false) }
  })
  const batch = batchBoardTiles(board)
  board.updateMatrixWorld(true)
  tiles.forEach((tile, index) => {
    const { ray, hits } = baselines[index]
    const picked = ray.intersectObject(board, true).filter(hit => hit.object === tile)
    assert.equal(picked.length, hits.length)
    assert(picked.length > 0)
    picked.forEach((hit, item) => {
      const before = hits[item]
      assert.equal(hit.object.name, tile.name)
      assert.equal(hit.faceIndex, before.faceIndex)
      assert.equal(hit.face?.a, before.face?.a)
      assert.equal(hit.face?.b, before.face?.b)
      assert.equal(hit.face?.c, before.face?.c)
      assert.equal(hit.distance, before.distance)
      assert.deepEqual(hit.point.toArray(), before.point.toArray())
      assert.deepEqual(hit.face?.normal.toArray(), before.face?.normal.toArray())
      assert.deepEqual(hit.normal?.toArray(), before.normal?.toArray())
    })
  })
  board.visible = false
  assert.equal(baselines[0].ray.intersectObjects(batch.meshes, false).length, 0)
  batch.dispose()
})

test('fade materials stay borrowed, unsupported tiles keep their path, and disposal restores layers once', () => {
  const { board, tiles, materials } = fixture()
  tiles[0].geometry.setDrawRange(3, 6)
  let ownedDisposals = 0
  let sourceDisposals = 0
  let materialDisposals = 0
  for (const tile of tiles) tile.geometry.addEventListener('dispose', () => sourceDisposals++)
  for (const material of materials) material.addEventListener('dispose', () => materialDisposals++)
  const batch = batchBoardTiles(board)
  assert.equal(batch.tileCalls, 3)
  assert.equal(tiles[0].layers.mask, 1)
  for (const mesh of batch.meshes) {
    mesh.geometry.addEventListener('dispose', () => ownedDisposals++)
    assert(materials.includes(mesh.material as THREE.MeshStandardMaterial))
  }
  materials[0].opacity = .42
  assert(batch.meshes.some(mesh => mesh.material === materials[0] && (mesh.material as THREE.Material).opacity === .42))
  batch.dispose()
  batch.dispose()
  assert.equal(ownedDisposals, 2)
  assert.equal(sourceDisposals, 0)
  assert.equal(materialDisposals, 0)
  assert(tiles.every(tile => tile.layers.mask === 1))
  assert(batch.meshes.every(mesh => mesh.parent === null))
})

test('atlas keeps the sixteen original glyph pixels, UV orientation and plane placement in one owned draw', () => {
  const calls: [string, number, number][] = []
  const context = { fillStyle: '', font: '', textAlign: '', textBaseline: '', fillText(text: string, x: number, y: number) { calls.push([text, x, y]) } }
  const canvas = { width: 0, height: 0, getContext() { return context } } as unknown as HTMLCanvasElement
  const board = new THREE.Group()
  const labels = createBoardLabels(board, () => canvas)
  assert.equal(canvas.width, 256)
  assert.equal(canvas.height, 256)
  assert.equal(context.font, '38px Courier New')
  assert.equal(context.fillStyle, '#ffffff')
  assert.equal(context.textAlign, 'center')
  assert.equal(context.textBaseline, 'middle')
  assert.equal(calls.map(call => call[0]).join(''), 'ABCDEFGH12345678')
  const uv = labels.geometry.getAttribute('uv')
  const position = labels.geometry.getAttribute('position')
  for (let index = 0; index < 16; index++) {
    const column = index % 4, row = Math.floor(index / 4)
    assert.deepEqual(calls[index].slice(1), [column * 64 + 32, row * 64 + 32])
    const x = index < 8 ? (index - 3.5) * .28 : -1.145
    const z = index < 8 ? 1.145 : (3.5 - (index - 8)) * .28
    for (let vertex = 0; vertex < 4; vertex++) {
      const offset = index * 4 + vertex
      assert(uv.getX(offset) >= column / 4 && uv.getX(offset) <= (column + 1) / 4)
      assert(uv.getY(offset) >= (3 - row) / 4 && uv.getY(offset) <= (4 - row) / 4)
      assert(Math.abs(position.getX(offset) - x) <= .0375001)
      assert(Math.abs(position.getY(offset) - .033) < 1e-7)
      assert(Math.abs(position.getZ(offset) - z) <= .0320001)
    }
  }
  assert.equal(triangles(labels.geometry), 32)
  assert.equal(labels.material.transparent, true)
  assert.equal(labels.material.depthWrite, false)
  assert.equal(labels.material.forceSinglePass, true)
  assert.equal(labels.texture.colorSpace, THREE.SRGBColorSpace)
  const disposals = [0, 0, 0]
  ;[labels.geometry, labels.material, labels.texture].forEach((resource, index) => resource.addEventListener('dispose', () => disposals[index]++))
  labels.dispose(); labels.dispose()
  assert.deepEqual(disposals, [1, 1, 1])
  assert.equal(labels.mesh.parent, null)
})

test('the decoded portfolio knight board batches64 tiles into2 draws without losing source triangles', async () => {
  const { NodeIO } = await import('@gltf-transform/core')
  const { ALL_EXTENSIONS } = await import('@gltf-transform/extensions')
  const { default: draco } = await import('draco3dgltf')
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco.createDecoderModule() })
  const document = await io.read(new URL('../public/portfolio-models/about-knight.glb', import.meta.url).pathname)
  const sourceBoard = document.getRoot().listNodes().find(node => node.getName() === 'board')!
  const board = new THREE.Group()
  const materials = new Map()
  for (const node of sourceBoard.listChildren().filter(node => /^tile-[a-h][1-8]$/.test(node.getName()))) {
    const primitive = node.getMesh()!.listPrimitives()[0]
    const geometry = new THREE.BufferGeometry()
    for (const [semantic, name] of [['POSITION', 'position'], ['NORMAL', 'normal']]) {
      const accessor = primitive.getAttribute(semantic)!
      geometry.setAttribute(name, new THREE.BufferAttribute(accessor.getArray()!, accessor.getElementSize(), accessor.getNormalized()))
    }
    const indices = primitive.getIndices()!
    geometry.setIndex(new THREE.BufferAttribute(indices.getArray()!, 1))
    const sourceMaterial = primitive.getMaterial()!
    let material = materials.get(sourceMaterial)
    if (!material) { material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }); materials.set(sourceMaterial, material) }
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = node.getName()
    mesh.userData = node.getExtras()
    mesh.position.fromArray(node.getTranslation())
    mesh.quaternion.fromArray(node.getRotation())
    mesh.scale.fromArray(node.getScale())
    board.add(mesh)
  }
  const sourceTriangles = board.children.reduce((sum, node) => sum + (node instanceof THREE.Mesh ? triangles(node.geometry) : 0), 0)
  const batch = batchBoardTiles(board)
  assert.equal(batch.sourceCalls, 64)
  assert.equal(batch.tileCalls, 2)
  assert(sourceTriangles > 0)
  assert.equal(batch.meshes.reduce((sum, mesh) => sum + triangles(mesh.geometry), 0), sourceTriangles)
  assert.equal(board.getObjectByName('tile-a1')?.userData.square, 'a1')
  assert.equal(board.getObjectByName('tile-h8')?.userData.square, 'h8')
  batch.dispose()
  for (const node of board.children) if (node instanceof THREE.Mesh) node.geometry.dispose()
  for (const material of materials.values()) material.dispose()
})
