import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const SOURCE_LAYER = 31
const SOURCE_INDICES = 'chessBatchSourceIndices'
const bindings = new WeakMap<THREE.BufferGeometry, Set<() => void>>()

function visibleInHierarchy(object: THREE.Object3D) {
  let node: THREE.Object3D | null = object
  while (node) { if (!node.visible) return false; node = node.parent }
  return true
}

function parts(root: THREE.Object3D) {
  const sources: THREE.Mesh[] = [], batches: THREE.Mesh[] = []
  root.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    if (Array.isArray(node.userData[SOURCE_INDICES])) batches.push(node)
    else sources.push(node)
  })
  return { sources, batches }
}

/** Mesh.clone copies metadata, but needs a fresh pick delegate for its own parts. */
export function bindChessBatchPicking(root: THREE.Object3D) {
  const { sources, batches } = parts(root)
  const releases: (() => void)[] = []
  for (const batch of batches) {
    const originals = (batch.userData[SOURCE_INDICES] as number[]).map(index => sources[index])
    if (originals.some(source => !source)) continue
    const ownedBindings = bindings.get(batch.geometry)
    if (!ownedBindings) continue
    const originalRaycast = batch.raycast
    batch.raycast = (raycaster, hits) => {
      if (!visibleInHierarchy(batch)) return
      // Keep the source part's exact face, local normal and chess-square ancestry.
      for (const source of originals) if (visibleInHierarchy(source)) source.raycast(raycaster, hits)
    }
    let released = false
    const release = () => {
      if (released) return
      released = true
      for (const source of originals) source.layers.set(0)
      batch.raycast = originalRaycast
      batch.removeFromParent()
      ownedBindings.delete(release)
    }
    ownedBindings.add(release)
    releases.push(release)
  }
  return () => { for (const release of releases) release() }
}

/** Exact static component merging, once per independently moving piece template. */
export function batchChessTemplate(root: THREE.Object3D, geometries: Set<THREE.BufferGeometry>) {
  const { sources } = parts(root)
  const groups = new Map<THREE.Material, THREE.Mesh[]>()
  const sourceIndex = new Map(sources.map((source, index) => [source, index]))
  root.updateWorldMatrix(true, true)
  const inverseRoot = root.matrixWorld.clone().invert()
  const transform = new THREE.Matrix4()
  for (const source of sources) {
    const geometry = source.geometry
    if (source instanceof THREE.SkinnedMesh || source instanceof THREE.InstancedMesh || source.children.length
      || Array.isArray(source.material) || source.material.transparent || source.layers.mask !== 1 || !source.visible
      || source.castShadow || source.receiveShadow || source.renderOrder !== 0 || !source.frustumCulled
      || geometry.drawRange.start !== 0 || Number.isFinite(geometry.drawRange.count)
      || Object.keys(geometry.morphAttributes).length > 0) continue
    transform.multiplyMatrices(inverseRoot, source.matrixWorld)
    if (transform.determinant() <= 0) continue
    const group = groups.get(source.material) ?? []
    group.push(source)
    groups.set(source.material, group)
  }
  let calls = sources.length
  for (const [material, group] of groups) {
    if (group.length < 2) continue
    const copies: THREE.BufferGeometry[] = []
    let merged: THREE.BufferGeometry | null = null
    try {
      for (const source of group) {
        transform.multiplyMatrices(inverseRoot, source.matrixWorld)
        copies.push(source.geometry.clone().applyMatrix4(transform))
      }
      // A single material already ignores Box/Cylinder face groups when drawing.
      merged = mergeGeometries(copies, false)
    } catch {
      // Leave unexpected geometry in its original rendering and picking path.
      merged = null
    } finally {
      for (const copy of copies) copy.dispose()
    }
    if (!merged) continue
    merged.computeBoundingBox()
    merged.computeBoundingSphere()
    const batch = new THREE.Mesh(merged, material)
    batch.name = `chess-parts-${root.children.length}`
    batch.userData[SOURCE_INDICES] = group.map(source => sourceIndex.get(source)!)
    for (const source of group) source.layers.set(SOURCE_LAYER)
    root.add(batch)
    geometries.add(merged)
    const liveBindings = new Set<() => void>()
    bindings.set(merged, liveBindings)
    merged.addEventListener('dispose', () => {
      for (const release of [...liveBindings]) release()
      bindings.delete(merged)
    })
    calls -= group.length - 1
  }
  const release = bindChessBatchPicking(root)
  return { sourceCalls: sources.length, calls, release }
}
