import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const SOURCE_LAYER = 31

function visibleInHierarchy(object: THREE.Object3D) {
  let node: THREE.Object3D | null = object
  while (node) { if (!node.visible) return false; node = node.parent }
  return true
}

/** Merge only static tile draws; named source meshes keep their geometry and pivots. */
export function batchBoardTiles(board: THREE.Object3D) {
  const sources: THREE.Mesh[] = []
  const groups = new Map<THREE.Material, THREE.Mesh[]>()
  const batches: THREE.Mesh[] = []
  const savedLayers = new Map<THREE.Mesh, number>()
  let disposed = false
  board.updateWorldMatrix(true, true)
  const inverseBoard = board.matrixWorld.clone().invert()
  const transform = new THREE.Matrix4()
  board.traverse(node => {
    if (!(node instanceof THREE.Mesh) || !/^tile-[a-h][1-8]$/.test(node.name)) return
    sources.push(node)
    const geometry = node.geometry
    if (node instanceof THREE.SkinnedMesh || node.children.length || Array.isArray(node.material) || node.layers.mask !== 1
      || geometry.groups.length || geometry.drawRange.start !== 0 || Number.isFinite(geometry.drawRange.count)
      || Object.keys(geometry.morphAttributes).length > 0) return
    transform.multiplyMatrices(inverseBoard, node.matrixWorld)
    if (transform.determinant() <= 0) return
    const list = groups.get(node.material) ?? []
    list.push(node)
    groups.set(node.material, list)
  })
  for (const [material, list] of groups) {
    if (list.length < 2) continue
    const copies: THREE.BufferGeometry[] = []
    let merged: THREE.BufferGeometry | null = null
    try {
      for (const source of list) {
        transform.multiplyMatrices(inverseBoard, source.matrixWorld)
        copies.push(source.geometry.clone().applyMatrix4(transform))
      }
      merged = mergeGeometries(copies, false)
    } catch {
      // Unexpected geometry remains in its original draw/pick path.
      merged = null
    } finally {
      for (const copy of copies) copy.dispose()
    }
    if (!merged) continue
    merged.computeBoundingBox()
    merged.computeBoundingSphere()
    const batch = new THREE.Mesh(merged, material)
    batch.name = `board-tiles-${batches.length}`
    // Delegating to original tiles preserves exact face indices, normals and
    // names, with the same per-tile bounds checks as the unbatched board.
    batch.raycast = (raycaster, hits) => {
      if (!visibleInHierarchy(batch)) return
      for (const source of list) if (visibleInHierarchy(source)) source.raycast(raycaster, hits)
    }
    for (const source of list) { savedLayers.set(source, source.layers.mask); source.layers.set(SOURCE_LAYER) }
    board.add(batch)
    batches.push(batch)
  }
  return {
    meshes: batches,
    sourceCalls: sources.length,
    tileCalls: sources.length - savedLayers.size + batches.length,
    dispose() {
      if (disposed) return
      disposed = true
      for (const [source, layers] of savedLayers) source.layers.mask = layers
      for (const batch of batches) { board.remove(batch); batch.geometry.dispose() }
      savedLayers.clear()
    },
  }
}

/** The original sixteen 64px glyphs and planes share one transparent atlas draw. */
export function createBoardLabels(board: THREE.Object3D, canvasFactory: () => HTMLCanvasElement = () => document.createElement('canvas')) {
  const surface = canvasFactory()
  surface.width = 256
  surface.height = 256
  const context = surface.getContext('2d')
  if (!context) throw new Error('Board labels require a 2D canvas')
  context.fillStyle = '#ffffff'
  context.font = '38px Courier New'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  const template = new THREE.PlaneGeometry(.075, .064)
  const parts: THREE.BufferGeometry[] = []
  const glyphs = 'ABCDEFGH12345678'
  let geometry: THREE.BufferGeometry | null = null
  try {
    for (let index = 0; index < glyphs.length; index++) {
      const column = index % 4
      const row = Math.floor(index / 4)
      context.fillText(glyphs[index], column * 64 + 32, row * 64 + 32)
      const part = template.clone()
      const uv = part.getAttribute('uv')
      for (let vertex = 0; vertex < uv.count; vertex++) uv.setXY(vertex, (uv.getX(vertex) + column) / 4, (uv.getY(vertex) + 3 - row) / 4)
      const x = index < 8 ? (index - 3.5) * .28 : -1.145
      const z = index < 8 ? 1.145 : (3.5 - (index - 8)) * .28
      part.rotateX(-Math.PI / 2).translate(x, .033, z)
      parts.push(part)
    }
    geometry = mergeGeometries(parts, false)
  } finally {
    template.dispose()
    for (const part of parts) part.dispose()
  }
  if (!geometry) throw new Error('Board label geometry could not be merged')
  geometry.computeBoundingSphere()
  const texture = new THREE.CanvasTexture(surface)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false })
  // Flat glyph planes need only one transparent pass, including from below.
  material.forceSinglePass = true
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'board-labels'
  board.add(mesh)
  let disposed = false
  return {
    mesh, texture, material, geometry,
    dispose() {
      if (disposed) return
      disposed = true
      board.remove(mesh)
      geometry.dispose()
      material.dispose()
      texture.dispose()
    },
  }
}
