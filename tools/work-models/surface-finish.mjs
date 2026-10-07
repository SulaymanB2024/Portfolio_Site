import { BufferAttribute, Vector3 } from 'three'

// Small, continuous variation belongs to the surface, not the lighting or dot
// screen. These original fields use object-space coordinates, so the finish
// follows a shaft through rotation and never swims across the sculpture.
const fract = value => value - Math.floor(value)
const hash = (x, y, z) => fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123)
const smooth = value => value * value * (3 - 2 * value)
const mix = (a, b, t) => a + (b - a) * t
function noise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z)
  const u = smooth(x - ix), v = smooth(y - iy), w = smooth(z - iz)
  const plane = dz => mix(
    mix(hash(ix, iy, iz + dz), hash(ix + 1, iy, iz + dz), u),
    mix(hash(ix, iy + 1, iz + dz), hash(ix + 1, iy + 1, iz + dz), u), v,
  )
  return mix(plane(0), plane(1), w)
}
const field = (x, y, z) => noise(x * 7.3, y * 7.3, z * 7.3) * .64
  + noise(x * 23.1 + 8.2, y * 23.1 - 2.7, z * 23.1) * .25
  + noise(x * 61.7, y * 61.7 + 5.1, z * 61.7 - 3.6) * .11

/** Quiet cast-metal patina and carving grain; no texture, extra draw or shader. */
export function finishSurface(geometry, material, toneScale = 1) {
  const positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal')
  const colors = new Uint8Array(positions.count * 3)
  const amplitude = material === 'ink' ? .025 : material === 'porcelain' ? .025 : material === 'pewter' ? .085 : .05
  const grain = material === 'ink' ? .001 : material === 'porcelain' ? .0008 : material === 'pewter' ? .0028 : .0015
  const n = new Vector3(), g = new Vector3(), step = .002
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i)
    const tone = toneScale * (1 - amplitude * (.22 + .78 * field(x, y, z)))
    const value = Math.round(tone * 255)
    colors.set([value, value, value], i * 3)
    n.fromBufferAttribute(normals, i)
    g.set(
      field(x + step, y, z) - field(x - step, y, z),
      field(x, y + step, z) - field(x, y - step, z),
      field(x, y, z + step) - field(x, y, z - step),
    ).multiplyScalar(grain / (step * 2))
    g.addScaledVector(n, -g.dot(n))
    n.sub(g).normalize()
    normals.setXYZ(i, n.x, n.y, n.z)
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3, true))
  return geometry
}
