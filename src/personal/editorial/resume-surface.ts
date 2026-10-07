import { Matrix3, Mesh, Object3D, Vector3 } from 'three'

export const RESUME_DITHER_SIZE = 4
// The opening helmet's authored 4×4 print screen, encoded exactly in a byte.
// 255 / 17 = 15: sampling this texture recovers each original rank / 17.
const printTile = new Uint8Array([16, 8, 14, 6, 5, 12, 2, 10, 13, 4, 15, 7, 1, 9, 3, 11].map(rank => rank * 15))

/** Keep the résumé's printing aligned with the engraved helmet on Home. */
export function resumeDitherTile() { return printTile }

/** Match coarse surface regions so a transfer keeps its volume instead of crossing its center. */
export function orderResumeSurface(surface: { points: Float32Array; normals: Float32Array }) {
  const count = surface.points.length / 3
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let source = 0; source < surface.points.length; source += 3) {
    const x = surface.points[source], y = surface.points[source + 1], z = surface.points[source + 2]
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
  }
  const scaleX = 8 / Math.max(1e-6, maxX - minX), scaleY = 8 / Math.max(1e-6, maxY - minY), scaleZ = 8 / Math.max(1e-6, maxZ - minZ)
  const bins = new Uint16Array(count), counts = new Uint32Array(512), offsets = new Uint32Array(512)
  for (let point = 0; point < count; point++) {
    const source = point * 3
    const x = Math.min(7, Math.floor((surface.points[source] - minX) * scaleX))
    const y = Math.min(7, Math.floor((surface.points[source + 1] - minY) * scaleY))
    const z = Math.min(7, Math.floor((surface.points[source + 2] - minZ) * scaleZ))
    const bin = y * 64 + x * 8 + z
    bins[point] = bin; counts[bin]++
  }
  for (let bin = 1; bin < counts.length; bin++) offsets[bin] = offsets[bin - 1] + counts[bin - 1]
  const points = new Float32Array(surface.points.length), normals = new Float32Array(surface.normals.length)
  for (let point = 0; point < count; point++) {
    const target = offsets[bins[point]]++ * 3, source = point * 3
    points[target] = surface.points[source]; points[target + 1] = surface.points[source + 1]; points[target + 2] = surface.points[source + 2]
    normals[target] = surface.normals[source]; normals[target + 1] = surface.normals[source + 1]; normals[target + 2] = surface.normals[source + 2]
  }
  return { points, normals }
}

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
    outgoingCut: smooth(.02, .50, p),
    incomingCut: 1 - smooth(.34, .93, p),
    particles: .8 * smooth(.03, .21, p) * (1 - smooth(.66, .94, p)),
    // The vertex shader eases each staggered journey once, including its arrival.
    travel: Math.max(0, Math.min(1, (p - .06) / .82)),
    pullback: smooth(0, .22, p) * (1 - smooth(.64, 1, p)),
  }
}
