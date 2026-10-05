import * as THREE from 'three'
import { TAU, vec, group, put, machinedRing, finishBevel } from './geometry.mjs'

// A population considering a tangible A/B product comparison. The cast is
// sculpted as busts, with complete facial volumes and substantial shoulders.
// Every component belongs to one compact, continuous sculptural base.
const UP = vec(0, 1, 0)
const bell = (x, center, width) => Math.exp(-(((x - center) / width) ** 2))
const signedPower = (x, power) => Math.sign(x) * Math.abs(x) ** power

/** Closed elliptical loft. Each section is [height, half-width, half-depth]. */
function loft(part, sections, origin, { sides = 48, yaw = 0, exponent = 1, zOffset = 0 } = {}) {
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw)
  const positions = [], indices = []
  const at = (x, y, z) => vec(x, y, z + zOffset).applyQuaternion(q).add(origin)
  for (const [y, width, depth] of sections) {
    for (let j = 0; j < sides; j++) {
      const angle = j / sides * TAU
      positions.push(...at(width * signedPower(Math.sin(angle), exponent), y, depth * signedPower(Math.cos(angle), exponent)).toArray())
    }
  }
  for (let row = 0; row < sections.length - 1; row++) {
    for (let j = 0; j < sides; j++) {
      const a = row * sides + j, b = row * sides + (j + 1) % sides
      const c = a + sides, d = b + sides
      indices.push(a, b, d, a, d, c)
    }
  }
  for (const end of [0, 1]) {
    const row = end ? sections.length - 1 : 0, center = positions.length / 3
    positions.push(...at(0, sections[row][0], 0).toArray())
    for (let j = 0; j < sides; j++) {
      const a = row * sides + j, b = row * sides + (j + 1) % sides
      indices.push(...(end ? [center, a, b] : [center, b, a]))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  put(part, geometry)
}

/** Original head sculpture: jaw, cheekbones, sockets, brows, nose, lips, chin. */
function face(part, origin, yaw, width = 1, height = 1, character = 0) {
  const profile = [
    [0, .028, .036, .052], [.014, .047, .047, .068],
    [.030, .061, .058, .072], [.050, .072, .068, .071],
    [.068, .079, .077, .072], [.082, .084, .082, .071],
    [.101, .088, .087, .072], [.119, .091, .091, .074],
    [.137, .092, .094, .072], [.151, .092, .096, .072],
    [.165, .093, .097, .073], [.183, .094, .095, .080],
    [.202, .093, .091, .083], [.224, .089, .084, .081],
    [.245, .082, .074, .072], [.267, .067, .061, .058],
    [.287, .046, .043, .041], [.301, .025, .025, .022],
    [.309, .009, .010, .009],
  ]
  const sides = 64, positions = [], indices = []
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw)
  const at = (x, y, z) => vec(x * width, y * height, z).applyQuaternion(q).add(origin)
  for (const [y, halfWidth, back, front] of profile) {
    for (let j = 0; j < sides; j++) {
      const angle = j / sides * TAU, c = Math.cos(angle)
      const x = halfWidth * signedPower(Math.sin(angle), .88)
      let z = (c >= 0 ? front : back) * signedPower(c, c >= 0 ? .58 : 1)
      if (c > 0) {
        const frontal = c ** 3
        const nose = (.035 + character * .002) * bell(x, 0, .019) * bell(y, .120, .021)
          + .020 * bell(x, 0, .013) * bell(y, .155, .034)
        const eyeSockets = -.018 * (bell(x, -.044, .021) + bell(x, .044, .021)) * bell(y, .159, .016)
        const brow = .012 * (bell(x, -.043, .032) + bell(x, .043, .032)) * bell(y, .186, .013)
        const cheek = .010 * (bell(x, -.061, .025) + bell(x, .061, .025)) * bell(y, .122, .023)
        const lips = .005 * bell(x, 0, .035) * bell(y, .081, .007)
          - .008 * bell(x, 0, .037) * bell(y, .069, .005)
        const chin = .012 * bell(x, 0, .041) * bell(y, .028, .018)
        z += frontal * (nose + eyeSockets + brow + cheek + lips + chin)
      }
      positions.push(...at(x, y, z).toArray())
    }
  }
  for (let row = 0; row < profile.length - 1; row++) {
    for (let j = 0; j < sides; j++) {
      const a = row * sides + j, b = row * sides + (j + 1) % sides
      const c = a + sides, d = b + sides
      indices.push(a, b, d, a, d, c)
    }
  }
  for (const end of [0, 1]) {
    const row = end ? profile.length - 1 : 0, center = positions.length / 3
    positions.push(...at(0, profile[row][0], 0).toArray())
    for (let j = 0; j < sides; j++) {
      const a = row * sides + j, b = row * sides + (j + 1) % sides
      indices.push(...(end ? [center, a, b] : [center, b, a]))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  put(part, geometry)
  // Ears are low, broad volumes partly sunk into the cranial side planes.
  for (const side of [-1, 1]) {
    const ear = new THREE.SphereGeometry(.015, 18, 12)
    ear.scale(.85, 1.68 * height, .85)
    ear.applyQuaternion(q)
    put(part, ear, at(side * .091, .154, -.012))
  }
}

function bust(part, fittings, origin, index) {
  const shoulderYaw = Math.atan2(-origin.x, .73 - origin.z)
  const headYaw = Math.atan2(-origin.x, .34 - origin.z)
  const breadth = [1.03, .95, 1.04, 1.01, .97][index]
  const faceWidth = [.98, 1.055, .955, 1.04, 1][index]
  const faceHeight = [1.02, .98, 1.04, 1, .99][index]
  loft(part, [
    [0, .174 * breadth, .104], [.018, .198 * breadth, .116],
    [.045, .205 * breadth, .119], [.080, .201 * breadth, .116],
    [.116, .175 * breadth, .109], [.152, .130 * breadth, .092],
    [.180, .086 * breadth, .070], [.209, .061, .054],
    [.236, .056, .052], [.272, .056, .052],
  ], origin, { sides: 56, yaw: shoulderYaw, exponent: .87, zOffset: -.021 })
  // The bottom edge reads as a carved bust truncation, fitted into the base.
  loft(fittings, [[-.026, .181 * breadth, .109], [-.012, .191 * breadth, .115], [0, .180 * breadth, .109]], origin,
    { sides: 40, yaw: shoulderYaw, exponent: .88, zOffset: -.021 })
  face(part, origin.clone().add(vec(0, .238, -.022)), headYaw, faceWidth, faceHeight, index - 2)
}

function sculpturalBase(part, rim) {
  // A single continuous kidney-shaped platform, with a generous chamfer. It
  // joins the audience's crescent to the two comparison sockets in the front.
  const shape = new THREE.Shape()
  shape.moveTo(0, -.790)
  shape.bezierCurveTo(-.59, -.790, -.99, -.350, -1.015, -.016)
  shape.bezierCurveTo(-1.040, .254, -.792, .450, -.420, .428)
  shape.bezierCurveTo(-.204, .496, .204, .496, .420, .428)
  shape.bezierCurveTo(.792, .450, 1.040, .254, 1.015, -.016)
  shape.bezierCurveTo(.99, -.350, .59, -.790, 0, -.790)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .166, bevelEnabled: true, bevelSize: .018, bevelThickness: .018,
    bevelSegments: 3, curveSegments: 32, steps: 1,
  })
  put(part, finishBevel(geometry), vec(0, -.498, 0), [Math.PI / 2, 0, 0])
  // The same outline forms a fitted bright shoulder on the top, not a railing.
  const top = new THREE.ExtrudeGeometry(shape, {
    depth: .018, bevelEnabled: true, bevelSize: .010, bevelThickness: .005,
    bevelSegments: 2, curveSegments: 32, steps: 1,
  })
  put(rim, finishBevel(top), vec(0, -.483, 0), [Math.PI / 2, 0, 0])
}

/** Two original product prototypes: oval vessel and softly faceted vessel. */
function comparison(part, pivot, rounded) {
  if (rounded) {
    loft(part, [
      [0, .112, .079], [.014, .139, .091], [.036, .148, .096],
      [.089, .151, .096], [.270, .151, .094], [.347, .145, .091],
      [.384, .132, .083], [.417, .106, .070], [.441, .068, .054],
      [.453, .058, .046], [.498, .058, .046],
    ], pivot, { sides: 64, exponent: .94 })
    loft(part, [[.490, .069, .055], [.505, .075, .058], [.562, .075, .058], [.574, .066, .051]], pivot,
      { sides: 48, exponent: .92 })
  } else {
    loft(part, [
      [0, .107, .074], [.016, .131, .091], [.033, .139, .094],
      [.304, .139, .094], [.357, .137, .093], [.390, .124, .087],
      [.422, .093, .069], [.438, .055, .047], [.497, .055, .047],
    ], pivot, { sides: 64, exponent: .32 })
    loft(part, [[.490, .068, .058], [.505, .073, .061], [.562, .073, .061], [.574, .065, .054]], pivot,
      { sides: 48, exponent: .36 })
  }
}

// Preserve the public export so the coordinator can regenerate only Sapien.
export function audienceTheatre() {
  const base = group('Continuous carved comparison base', 'steel')
  const fittings = group('Fitted bust truncations and comparison socket shoulders', 'silver')
  const people = group('Five sculpted human audience busts', 'porcelain')
  const socketInlays = group('Recessed graphite comparison sockets', 'ink')
  const leftPivot = vec(-.205, -.422, .208), rightPivot = vec(.205, -.422, .208)
  const roundSample = group('hover-oval-product-prototype', 'silver', leftPivot, UP.clone())
  const facetedSample = group('hover-faceted-product-prototype', 'porcelain', rightPivot, UP.clone())
  sculpturalBase(base, fittings)
  const placements = [
    [-.789, -.436, -.039], [-.438, -.383, -.428],
    [0, -.346, -.585], [.438, -.383, -.428], [.789, -.436, -.039],
  ]
  for (const [index, [x, y, z]] of placements.entries()) {
    const origin = vec(x, y, z)
    // Low integral shoulders of the base accommodate the curved audience.
    loft(base, [[-.483 - y, .199, .123], [-.013, .194, .119], [0, .182, .109]], origin,
      { sides: 48, yaw: Math.atan2(-x, .73 - z), exponent: .88, zOffset: -.021 })
    bust(people, fittings, origin, index)
  }
  for (const pivot of [leftPivot, rightPivot]) {
    // The moving prototypes have short integral spigots seated inside fixed
    // socket bores. The vertical axis passes through each sample's own foot.
    loft(fittings, [[-.483 - pivot.y, .179, .139], [-.021, .181, .141], [-.005, .168, .130]], pivot,
      { sides: 48, exponent: .80 })
    machinedRing(socketInlays, .068, .036, .028, 0, TAU, pivot.clone().add(vec(0, -.012, 0)), [Math.PI / 2, 0, 0], 48)
  }
  comparison(roundSample, leftPivot, true)
  comparison(facetedSample, rightPivot, false)
  for (const sample of [roundSample, facetedSample]) {
    const shaft = new THREE.CylinderGeometry(.047, .047, .046, 32, 1)
    put(sample, shaft, sample.pivot.clone().add(vec(0, -.021, 0)))
  }
  return [base, fittings, people, socketInlays, roundSample, facetedSample]
}
