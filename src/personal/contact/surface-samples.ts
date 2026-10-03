export type SurfaceBuffer = { array: ArrayLike<number>; count: number; stride?: number; offset?: number }

/** Scalar sampling preserves the original cumulative areas and four random draws per point. */
export function sampleSurface(position: SurfaceBuffer, normal: SurfaceBuffer, indices: ArrayLike<number> | null, count: number, random: () => number) {
  if (!Number.isSafeInteger(count) || count < 0 || normal.count !== position.count) throw new Error('Invalid surface sample buffers')
  const ps = position.array, ns = normal.array
  const positionStride = position.stride ?? 3, positionOffset = position.offset ?? 0
  const normalStride = normal.stride ?? 3, normalOffset = normal.offset ?? 0
  const triangles = Math.floor((indices?.length ?? position.count) / 3)
  const areas = new Float64Array(triangles)
  let area = 0
  for (let triangle = 0; triangle < triangles; triangle++) {
    const element = triangle * 3
    const a = (indices ? indices[element] : element) * positionStride + positionOffset
    const b = (indices ? indices[element + 1] : element + 1) * positionStride + positionOffset
    const c = (indices ? indices[element + 2] : element + 2) * positionStride + positionOffset
    const abx = ps[b] - ps[a], aby = ps[b + 1] - ps[a + 1], abz = ps[b + 2] - ps[a + 2]
    const acx = ps[c] - ps[a], acy = ps[c + 1] - ps[a + 1], acz = ps[c + 2] - ps[a + 2]
    const x = aby * acz - abz * acy, y = abz * acx - abx * acz, z = abx * acy - aby * acx
    area += Math.sqrt(x * x + y * y + z * z) * .5
    areas[triangle] = area
  }
  if (!Number.isFinite(area) || area <= 0) throw new Error('Surface has no finite nondegenerate triangles')

  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let sample = 0; sample < count; sample++) {
    const selection = random() * area
    let low = 0, high = triangles - 1
    while (low < high) {
      const middle = (low + high) >>> 1
      if (areas[middle] < selection) low = middle + 1
      else high = middle
    }
    const element = low * 3
    const ai = indices ? indices[element] : element
    const bi = indices ? indices[element + 1] : element + 1
    const ci = indices ? indices[element + 2] : element + 2
    const a = ai * positionStride + positionOffset, b = bi * positionStride + positionOffset, c = ci * positionStride + positionOffset
    const an = ai * normalStride + normalOffset, bn = bi * normalStride + normalOffset, cn = ci * normalStride + normalOffset
    const u = Math.sqrt(random()), v = random()
    const wa = 1 - u, wb = u * (1 - v), wc = u * v
    const target = sample * 3
    positions[target] = ps[a] * wa + ps[b] * wb + ps[c] * wc
    positions[target + 1] = ps[a + 1] * wa + ps[b + 1] * wb + ps[c + 1] * wc
    positions[target + 2] = ps[a + 2] * wa + ps[b + 2] * wb + ps[c + 2] * wc
    const nx = ns[an] * wa + ns[bn] * wb + ns[cn] * wc
    const ny = ns[an + 1] * wa + ns[bn + 1] * wb + ns[cn + 1] * wc
    const nz = ns[an + 2] * wa + ns[bn + 2] * wb + ns[cn + 2] * wc
    // Vector3.normalize uses the reciprocal of length (or 1 for a zero vector).
    const inverseLength = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1)
    normals[target] = nx * inverseLength
    normals[target + 1] = ny * inverseLength
    normals[target + 2] = nz * inverseLength
    seeds[sample] = random()
  }
  return { positions, normals, seeds }
}
