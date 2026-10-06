import { Matrix3, Mesh, Object3D, Vector3 } from 'three'

/** Rigid GLB joints keep their triangle areas; prepare the table before painting. */
export function createResumeSurfaceSampler(root: Object3D) {
  root.updateWorldMatrix(true, true)
  const meshes: Mesh[] = []
  const meshIds: number[] = [], triangles: number[] = [], areas: number[] = []
  const a = new Vector3(), b = new Vector3(), c = new Vector3()
  let total = 0
  root.traverse(node => {
    if (!(node instanceof Mesh)) return
    const position = node.geometry.getAttribute('position'), index = node.geometry.index
    if (!position) return
    const id = meshes.push(node) - 1
    for (let offset = 0; offset + 2 < (index?.count ?? position.count); offset += 3) {
      a.fromBufferAttribute(position, index ? index.getX(offset) : offset).applyMatrix4(node.matrixWorld)
      b.fromBufferAttribute(position, index ? index.getX(offset + 1) : offset + 1).applyMatrix4(node.matrixWorld)
      c.fromBufferAttribute(position, index ? index.getX(offset + 2) : offset + 2).applyMatrix4(node.matrixWorld)
      const area = b.sub(a).cross(c.sub(a)).length() / 2
      if (!(area > 1e-12) || !Number.isFinite(area)) continue
      total += area; meshIds.push(id); triangles.push(offset); areas.push(total)
    }
  })
  if (!areas.length) throw new Error('GLB has no sampleable surface')
  return (count: number, seed = 1) => {
    if (!Number.isInteger(count) || count < 1) throw new Error('Invalid surface sample count')
    root.updateWorldMatrix(true, true)
    const normalMatrices = meshes.map(mesh => new Matrix3().getNormalMatrix(mesh.matrixWorld))
    let state = seed >>> 0
    const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296 }
    const points = new Float32Array(count * 3), normals = new Float32Array(count * 3)
    const normal = new Vector3(), na = new Vector3(), nb = new Vector3(), nc = new Vector3()
    for (let sample = 0; sample < count; sample++) {
      const weight = random() * total
      let lo = 0, hi = areas.length - 1
      while (lo < hi) { const middle = (lo + hi) >>> 1; if (areas[middle] < weight) lo = middle + 1; else hi = middle }
      const mesh = meshes[meshIds[lo]], offset = triangles[lo]
      const position = mesh.geometry.getAttribute('position'), index = mesh.geometry.index, surfaceNormal = mesh.geometry.getAttribute('normal')
      const i0 = index ? index.getX(offset) : offset, i1 = index ? index.getX(offset + 1) : offset + 1, i2 = index ? index.getX(offset + 2) : offset + 2
      a.fromBufferAttribute(position, i0); b.fromBufferAttribute(position, i1); c.fromBufferAttribute(position, i2)
      const u = Math.sqrt(random()), v = random(), wa = 1 - u, wb = u * (1 - v), wc = u * v
      if (surfaceNormal) {
        na.fromBufferAttribute(surfaceNormal, i0); nb.fromBufferAttribute(surfaceNormal, i1); nc.fromBufferAttribute(surfaceNormal, i2)
        normal.copy(na).multiplyScalar(wa).addScaledVector(nb, wb).addScaledVector(nc, wc)
      } else normal.copy(b).sub(a).cross(nc.copy(c).sub(a))
      normal.applyMatrix3(normalMatrices[meshIds[lo]]).normalize().toArray(normals, sample * 3)
      a.multiplyScalar(wa).addScaledVector(b, wb).addScaledVector(c, wc).applyMatrix4(mesh.matrixWorld).toArray(points, sample * 3)
    }
    return { points, normals }
  }
}

/** Area-weighted samples of a posed hierarchy; caller owns its geometry. */
export function sampleResumeSurface(root: Object3D, count: number, seed = 1) {
  if (!Number.isInteger(count) || count < 1) throw new Error('Invalid surface sample count')
  return createResumeSurfaceSampler(root)(count, seed)
}

const smooth = (low: number, high: number, value: number) => { const t = Math.max(0, Math.min(1, (value - low) / (high - low))); return t * t * (3 - 2 * t) }

/** Overlap solid breakup, spatial transfer and solid assembly; never an empty gap. */
export function resumeMorphPhase(progress: number) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
  return {
    outgoingCut: smooth(.08, .46, p),
    incomingCut: 1 - smooth(.56, .94, p),
    particles: smooth(.08, .25, p) * (1 - smooth(.76, .96, p)),
    travel: smooth(.15, .84, p),
    pullback: Math.sin(p * Math.PI),
  }
}
