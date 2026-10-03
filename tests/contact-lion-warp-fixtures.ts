// Independent numerical oracle for a GPU probe of the exported GLSL. This keeps
// the original deformation equations, without a CPU copy of the Jacobian.
export type Vector = [number, number, number]
export type LionWarpFixture = {
  label: string
  position: Vector
  normal: Vector
  field: number
  released: number
  warped: Vector
  centralNormal: Vector
  legacyNormal: Vector
}

const addScaled = (a: Vector, b: Vector, scale: number): Vector => [a[0] + b[0] * scale, a[1] + b[1] * scale, a[2] + b[2] * scale]
const subtract = (a: Vector, b: Vector): Vector => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: Vector, b: Vector): Vector => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const normalize = (v: Vector): Vector => {
  const length = Math.hypot(...v)
  if (!(length > 0)) throw new Error('Reference normal is degenerate')
  return [v[0] / length, v[1] / length, v[2] / length]
}

export function referenceErosion([x, y, z]: Vector) {
  return (.34 - y) * .78 + (x + 1) * .09
    + Math.sin(x * 3.5 + z * 4) * .055 + Math.sin(y * 11 + z * 7) * .018
    - Math.exp(-x * x * 8 - ((y + .1) * 4) ** 2) * .22
}

export function referenceRelease(position: Vector, field: number) {
  const front = .91 - field * .91, lower = front - .055, upper = front + .055
  const t = Math.max(0, Math.min(1, (referenceErosion(position) - lower) / (upper - lower)))
  return t * t * (3 - 2 * t)
}

export function referenceWarp(position: Vector, field: number): Vector {
  const [x, y, z] = position, bend = field * field * referenceRelease(position, field)
  return [x + Math.sin(y * 5 + z * 3) * .13 * bend,
    y + Math.sin(x * 3 - z * 2) * .09 * bend,
    z + Math.sin(y * 4 + x * 3) * .07 * bend]
}

export function referenceTangentPair(normal: Vector): [Vector, Vector] {
  const tangent = normalize(cross(normal, Math.abs(normal[1]) < .9 ? [0, 1, 0] : [1, 0, 0]))
  return [tangent, cross(normal, tangent)]
}

export function referenceNormal(position: Vector, normal: Vector, field: number, epsilon = 1e-6, central = true): Vector {
  const [tangent, bitangent] = referenceTangentPair(normal)
  const origin = referenceWarp(position, field)
  const derivative = (direction: Vector) => subtract(referenceWarp(addScaled(position, direction, epsilon), field),
    central ? referenceWarp(addScaled(position, direction, -epsilon), field) : origin)
  return normalize(cross(derivative(tangent), derivative(bitangent)))
}

function fixture(label: string, position: Vector, normal: Vector, field: number): LionWarpFixture {
  return { label, position, normal, field, released: referenceRelease(position, field),
    warped: referenceWarp(position, field), centralNormal: referenceNormal(position, normal, field),
    legacyNormal: referenceNormal(position, normal, field, .001, false) }
}

const samples: [Vector, Vector][] = [
  [[-.81, .42, .23], normalize([.25, .73, .62])],
  [[.58, -.38, -.17], normalize([-.34, .19, .92])],
  [[-.18, -.11, .04], normalize([.86, -.43, .28])],
  [[.08, .71, -.32], [0, 1, 0]],
  [[-.45, -.62, .51], [0, -1, 0]],
  [[.93, .13, -.56], normalize([.96, .12, -.25])],
]
const fields = [0, .06, .3, .6, .88, 1]
const releasePosition: Vector = [.19, -.27, .14]
const releaseNormal = normalize([.38, .51, .77])
const switchPosition: Vector = [.52, -.22, .31]

export const lionWarpFixtures: LionWarpFixture[] = [
  ...fields.flatMap(field => samples.map(([position, normal], i) => fixture(`surface-${i}-field-${field}`, position, normal, field))),
  ...[-.0001, 0, .001, .25, .5, .75, .999, 1, 1.0001].map(phase => fixture(`release-phase-${phase}`, releasePosition, releaseNormal,
    (.855 + .11 * phase - referenceErosion(releasePosition)) / .91)),
  ...[.899999, .9, .900001, -.899999, -.9, -.900001].map(y => fixture(`tangent-switch-${y}`,
    switchPosition, [Math.sqrt(1 - y * y), y, 0], .88)),
]
