/** Two original abstractions: a collective covenant and a branching proof organism. */
import { THREE, ribbon, pipe, seam, sampleCurve } from './parametric.mjs'
import { TAU, vec, group, put, bevelBox, jewel } from '../work-models/geometry.mjs'

const Z = vec(0, 0, 1)
const lerp = (a, b, t) => a + (b - a) * t

function surfaceNormal(sample, u, v) {
  const h = .0001
  return sample(u + h, v).sub(sample(u - h, v))
    .cross(sample(u, v + h).sub(sample(u, v - h))).normalize()
}

function payrollCovenant() {
  const pale = group('Covenant — uninterrupted porcelain weave', 'porcelain')
  const dark = group('Covenant — folded pewter weave', 'pewter')
  const edge = group('Covenant — double edge channels and curved approval spines', 'steel')
  const joints = group('Covenant — fitted approval ferrules', 'silver')
  const inscription = group('Covenant — transverse commitment marks', 'ink')
  const pivot = vec(0, 0, .02)
  const core = group('hover-Covenant — terraced inner trust', 'porcelain', pivot, vec(0, 1, 0))
  core.motion = { kind: 'continuous', angularVelocity: .12, ratio: 1 }
  const coreMetal = group('Covenant — fitted core seams', 'silver', pivot.clone())
  coreMetal.parent = core.name
  const ends = [[], []]

  // Three long open clasps pass on opposite sides of the same inner junction.
  // Their width rolls independently of the curve, so each lobe has a broad
  // shoulder, a narrow waist and a deliberate over/under spatial crossing.
  // Each has separated front/back ends; no coincident caps occupy the core.
  for (let lobe = 0; lobe < 3; lobe++) {
    const a = Math.PI / 2 - .11 + lobe * TAU / 3
    const radial = vec(Math.cos(a), Math.sin(a), 0)
    const lateral = vec(-Math.sin(a), Math.cos(a), 0)
    const center = u => {
      const t = (u * 2 - 1) * (Math.PI - .55)
      return radial.clone().multiplyScalar(.83 + .52 * Math.cos(t))
        .addScaledVector(lateral, .415 * Math.sin(t))
        .addScaledVector(Z, .44 * Math.cos(Math.PI * u) + .09 * Math.sin(TAU * u) + .027 * (lobe - 1))
    }
    const width = u => {
      const t = (u * 2 - 1) * (Math.PI - .55)
      const tangent = radial.clone().multiplyScalar(-.52 * Math.sin(t))
        .addScaledVector(lateral, .415 * Math.cos(t)).normalize()
      const across = vec(-tangent.y, tangent.x, 0)
      const roll = .16 + .75 * Math.sin(TAU * u - .30) + .11 * lobe
      return across.multiplyScalar(Math.cos(roll))
        .addScaledVector(Z, Math.sin(roll))
        .multiplyScalar(.245 + .125 * Math.pow(Math.sin(Math.PI * u), 2))
    }
    const sample = (u, v) => center(u).addScaledVector(width(u), v - .5)
    ribbon(lobe === 1 ? dark : pale, center, width, 144, 9, .045)
    for (const v of [.09, .91]) seam(edge, sample, v, .0065, 144, .018, .982, .027)
    // The paired strokes are a physical encoding of repeated commitments.
    // Their spacing opens up across the broad crown instead of filling the face.
    for (let i = 0; i < 16; i++) {
      const u = .06 + i * .88 / 15
      const length = i % 4 === 0 ? .63 : (i % 2 === 0 ? .37 : .20)
      for (const delta of [0, .008]) {
        const at = v => {
          const p = sample(u + delta, v)
          return p.addScaledVector(surfaceNormal(sample, u + delta, v), .027)
        }
        pipe(inscription, sampleCurve(at, 9, .5 - length / 2, .5 + length / 2), .0048, 16, 5)
      }
    }
    // A second line occupies the reverse face: the art remains authored in orbit.
    seam(edge, sample, .5, .0048, 128, .06, .94, -.027)
    for (const end of [0, 1]) {
      const position = center(end), x = width(end).normalize()
      const along = center(end + .0001).sub(center(end - .0001))
      const y = along.addScaledVector(x, -along.dot(x)).normalize()
      const z = x.clone().cross(y).normalize()
      const euler = new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
      const rotation = [euler.x, euler.y, euler.z]
      // A close-fitted ferrule overlaps the real capped ribbon and both rails;
      // the lobes belong to one physical assembly rather than floating nearby.
      bevelBox(joints, .263, .067, .071, position, rotation, .009)
      for (const side of [-1, 1]) {
        bevelBox(inscription, .211, .004, .0025, position.clone().addScaledVector(y, side * .016).addScaledVector(z, .040), rotation, .0007)
      }
      ends[end].push(position)
    }
  }

  // Two softly triangular spines join the actual end triplets. Each loop spans
  // the front and rear spines, so six modest curved members make a coherent
  // cage without filling its opening with spokes or adding a pedestal.
  for (const triplet of ends) for (let i = 0; i < triplet.length; i++) {
    const a = triplet[i], b = triplet[(i + 1) % triplet.length]
    const outward = a.clone().add(b).multiplyScalar(.5); outward.z = 0; outward.normalize()
    const bend = t => a.clone().lerp(b, t).addScaledVector(outward, .115 * Math.sin(t * Math.PI))
    pipe(edge, [a.clone(), bend(.24), bend(.5), bend(.76), b.clone()], .019, 56, 8)
  }

  // The protected centre is an open terraced crystal rather than a safe or coin.
  // Every plate has a different cut depth; air and the inner spindle remain visible.
  for (let i = 0; i < 6; i++) {
    const y = -.30 + i * .120
    const width = .335 + .040 * Math.sin(i / 5 * Math.PI)
    const turn = Math.PI / 4
    bevelBox(core, width, .047, width * .82, vec(0, y, .02), [0, turn, 0], .009)
    for (const side of [-1, 1]) {
      bevelBox(coreMetal, .255, .0065, .009, vec(side * .021, y + .029, .02), [0, turn + side * .22, 0], .0015)
    }
  }
  // These narrow cross-braces join the stack without closing its negative space.
  bevelBox(coreMetal, .043, .70, .043, vec(0, 0, .02), [0, Math.PI / 4, 0], .007)
  for (const y of [-.385, .385]) jewel(coreMetal, vec(0, y, .02), .060, 0, [1, .72, 1])
  return [pale, dark, edge, inscription, core, coreMetal, joints]
}

/** A thick curved membrane with real pierced windows and exact smooth face normals. */
function piercedMembrane(part, length, width, sample, thickness = .029) {
  const half = x => width * (.105 + .395 * Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, x / length))), .70))
  const outer = []
  for (let i = 0; i <= 32; i++) { const x = length * i / 32; outer.push(new THREE.Vector2(x, -half(x))) }
  for (let i = 32; i >= 0; i--) { const x = length * i / 32; outer.push(new THREE.Vector2(x, half(x))) }
  const holes = []
  for (const xRatio of [.40, .70]) for (const side of [-1, 1]) {
    const hole = []
    for (let i = 0; i < 28; i++) {
      const t = -i / 28 * TAU
      hole.push(new THREE.Vector2(length * (xRatio + .080 * Math.cos(t)), width * (side * .245 + .115 * Math.sin(t))))
    }
    holes.push(hole)
  }
  const contour = outer.concat(...holes)
  const faces = THREE.ShapeUtils.triangulateShape(outer, holes)
  const positions = [], normals = [], indices = []
  const nAt = (x, y) => {
    const h = .0001
    return sample(x + h, y).sub(sample(x - h, y)).cross(sample(x, y + h).sub(sample(x, y - h))).normalize()
  }
  const vertex = (p, n) => { const i = positions.length / 3; positions.push(...p.toArray()); normals.push(...n.toArray()); return i }
  const face = (a, b, c, side) => {
    const points = [a, b, c]
    // Earcut's planar orientation is made explicit before the nonlinear mapping.
    if ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) < 0) points.reverse()
    const tri = points.map(p => {
      const n = nAt(p.x, p.y)
      if (n.lengthSq() < .9) throw new Error(`${part.name}: singular membrane`)
      return vertex(sample(p.x, p.y).addScaledVector(n, side * thickness / 2), n.multiplyScalar(side))
    })
    indices.push(...(side === 1 ? tri : tri.reverse()))
  }
  const subdivide = (a, b, c, depth, side) => {
    if (!depth) return face(a, b, c, side)
    const ab = a.clone().lerp(b, .5), bc = b.clone().lerp(c, .5), ca = c.clone().lerp(a, .5)
    subdivide(a, ab, ca, depth - 1, side); subdivide(ab, b, bc, depth - 1, side)
    subdivide(ca, bc, c, depth - 1, side); subdivide(ab, bc, ca, depth - 1, side)
  }
  for (const side of [1, -1]) for (const [a, b, c] of faces) subdivide(contour[a], contour[b], contour[c], 2, side)
  for (const boundary of [outer, ...holes]) for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i], b = boundary[(i + 1) % boundary.length]
    const p = sample(a.x, a.y), q = sample(b.x, b.y), na = nAt(a.x, a.y), nb = nAt(b.x, b.y)
    const topP = p.clone().addScaledVector(na, thickness / 2), bottomP = p.clone().addScaledVector(na, -thickness / 2)
    const topQ = q.clone().addScaledVector(nb, thickness / 2), bottomQ = q.clone().addScaledVector(nb, -thickness / 2)
    const n = bottomP.clone().sub(topP).cross(topQ.clone().sub(topP)).normalize()
    const k = vertex(topP, n); vertex(bottomP, n); vertex(topQ, n); vertex(bottomQ, n)
    indices.push(k, k + 1, k + 2, k + 2, k + 1, k + 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3)); g.setIndex(indices)
  put(part, g)
  return { outer, holes, half, nAt }
}

function viralEvidenceBloom() {
  const membranes = group('Evidence bloom — folded porcelain lamellae', 'porcelain')
  const metal = group('Evidence bloom — flared silver lamellae', 'silver')
  const reverse = group('Evidence bloom — shadow-side lamellae', 'pewter')
  const arteries = group('Evidence bloom — capillary trunk and branching veins', 'steel')
  const relief = group('Evidence bloom — trace rims and anastomoses', 'silver')
  const seeds = group('Evidence bloom — nucleated proof folds', 'pewter')
  const spine = u => vec(.115 * Math.sin(u * 5.3) + .13 * u, -1.22 + 2.02 * u, .075 * Math.sin(u * 7.4))

  // Three unequal channels twist around a sinuous, open-backed trunk.
  for (let strand = 0; strand < 3; strand++) {
    const at = u => {
      const a = strand * TAU / 3 + u * TAU * .74
      return spine(u).add(vec(Math.cos(a) * .047, 0, Math.sin(a) * .047))
    }
    pipe(arteries, sampleCurve(at, 64), u => .029 - .017 * u, 112, 9)
  }
  ribbon(seeds, u => spine(u).add(vec(0, 0, -.015)), u => {
    const a = -.35 + u * 3.9
    return vec(Math.cos(a), .12, Math.sin(a)).normalize().multiplyScalar(.10 + .028 * Math.sin(u * Math.PI))
  }, 100, 4, .023)

  // The broad crown, two lateral gestures and lower counterweight are unequal.
  // Their windows follow the traced veins rather than repeating a card grid.
  const branches = [
    { u: .48, angle: .27, length: 1.30, width: .69, roll: -.10, depth: .13, curl: .31, part: metal },
    { u: .67, angle: 2.45, length: 1.11, width: .59, roll: .22, depth: -.11, curl: -.17, part: membranes },
    { u: .94, angle: 1.23, length: .84, width: .55, roll: -.29, depth: .06, curl: .20, part: membranes },
    { u: .34, angle: 3.48, length: .79, width: .46, roll: -.17, depth: .11, curl: .22, part: reverse },
    { u: .80, angle: .70, length: .76, width: .43, roll: .44, depth: -.16, curl: -.26, part: reverse },
  ]
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i], root = spine(b.u)
    const along = vec(Math.cos(b.angle), Math.sin(b.angle), 0)
    const across = vec(-along.y, along.x, 0)
    const sample = (x, y) => {
      const u = x / b.length, t = y / b.width
      const arch = b.curl * Math.sin(u * Math.PI) + .10 * u * u
      const fold = .12 * Math.sqrt(t * t + .003) + .060 * Math.sin(u * Math.PI * 2 + i * .8) * t
      return root.clone().addScaledVector(along, x)
        .addScaledVector(across, y + .09 * Math.sin(u * Math.PI) * b.length)
        .addScaledVector(Z, b.depth + arch + b.roll * y + fold)
    }
    const topology = piercedMembrane(b.part, b.length, b.width, sample, .029)
    const onFace = (x, y, lift = .019) => sample(x, y).addScaledVector(topology.nAt(x, y), lift)
    // A continuous branching vein connects each membrane to the common trunk.
    const throat = sample(0, 0)
    pipe(arteries, [root.clone().add(vec(0, -.07, -.01)), root.clone().lerp(throat, .55).add(vec(0, .018, .025)), throat], .024, 24, 9)
    pipe(relief, sampleCurve(u => onFace(u * b.length, 0, .024), 48), u => .018 - .008 * u, 96, 7)
    for (const side of [-1, 1]) {
      pipe(relief, sampleCurve(u => onFace(u * b.length, side * topology.half(u * b.length) * .90), 48), .0054, 96, 6)
    }
    // Pierced rims have actual edge walls. Raised outlines catch the ink screen.
    for (const hole of topology.holes) {
      const points = hole.map(p => onFace(p.x, p.y, .019)); points.push(points[0].clone())
      pipe(relief, points, .0052, 44, 6)
    }
    // Four tributaries split around the cutouts and return to the central vein.
    for (const xRatio of [.40, .70]) for (const side of [-1, 1]) {
      const points = [
        onFace((xRatio - .15) * b.length, 0),
        onFace((xRatio - .09) * b.length, side * b.width * .12),
        onFace(xRatio * b.length, side * b.width * .385),
        onFace((xRatio + .115) * b.length, side * b.width * .20),
        onFace((xRatio + .15) * b.length, 0),
      ]
      pipe(relief, points, .0063, 40, 6)
    }
    // Short reverse-side cuts keep the inspected back from becoming blank metal.
    for (let mark = 0; mark < 7; mark++) {
      const x = (.17 + mark * .105) * b.length
      const w = topology.half(x) * .73
      pipe(arteries, sampleCurve(t => onFace(x + t * .045, lerp(-w, w, t), -.019), 9), .0038, 16, 5)
    }
  }

  // A pair of curled root blades anchors the opening without adding a pedestal.
  for (let side of [-1, 1]) {
    const center = u => spine(.02).add(vec(side * (.10 + .25 * Math.sin(u * Math.PI)), -.02 + .31 * u, .16 * Math.sin(TAU * u) - .05))
    const width = u => vec(.09 * Math.cos(u * 2.5), .04, .10 * Math.sin(u * 2.5)).normalize().multiplyScalar(.095)
    ribbon(seeds, center, width, 64, 5, .026)
  }
  return [membranes, metal, reverse, arteries, relief, seeds]
}

export const caseSculptures = [
  {
    id: 'payrollpro', title: 'Covenant', rotation: [.13, -.25, -.025],
    concept: 'Three broad spatially interwoven commitments are joined by curved front and rear approval spines with fitted ferrules around an open terraced core. Paired edge channels and repeated physical marks connect collective approval, privacy and dependable distribution without depicting a safe or transaction screen.',
    make: payrollCovenant,
  },
  {
    id: 'viralbench', title: 'Evidence bloom', rotation: [.06, -.19, -.055],
    concept: 'An asymmetric proof organism branches through five folded, genuinely pierced lamellae. Capillary traces split around the windows and reunite with the spine, connecting evidence, review and propagation without depicting a magnifier or interface.',
    make: viralEvidenceBloom,
  },
]
