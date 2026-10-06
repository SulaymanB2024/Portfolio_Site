import * as THREE from 'three'
import { TAU, vec, group, put, machinedRing, finishBevel } from './geometry.mjs'

// Three substantial cast portraits attend to two tangible product specimens. Anatomy,
// coiffure and cloth are carved into broad connected surfaces, so their detail
// reads as sculpture even when the live dot screen removes the smallest cuts.
const UP = vec(0, 1, 0)
const bell = (x, center, width) => Math.exp(-(((x - center) / width) ** 2))
const signedPower = (x, power) => Math.sign(x) * Math.abs(x) ** power

/** Capped section surface. The ring order runs from front through the right. */
function sectionSurface(part, levels, sides, point, center) {
  const angles = Array.isArray(sides) ? sides : Array.from({ length: sides }, (_, i) => i / sides * TAU)
  sides = angles.length
  const positions = [], indices = []
  for (const level of levels) for (let j = 0; j < sides; j++) {
    positions.push(...point(level, angles[j]).toArray())
  }
  for (let row = 0; row < levels.length - 1; row++) for (let j = 0; j < sides; j++) {
    const a = row * sides + j, b = row * sides + (j + 1) % sides
    const c = a + sides, d = b + sides
    indices.push(a, b, d, a, d, c)
  }
  for (const end of [0, 1]) {
    const row = end ? levels.length - 1 : 0, middle = positions.length / 3
    positions.push(...center(levels[row]).toArray())
    for (let j = 0; j < sides; j++) {
      const a = row * sides + j, b = row * sides + (j + 1) % sides
      indices.push(...(end ? [middle, a, b] : [middle, b, a]))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  put(part, geometry)
}

/** Closed elliptical loft. Each section is [height, half-width, half-depth]. */
function loft(part, sections, origin, { sides = 48, yaw = 0, exponent = 1, zOffset = 0, carve = null } = {}) {
  const q = new THREE.Quaternion().setFromAxisAngle(UP, yaw)
  const at = (x, y, z) => vec(x, y, z + zOffset).applyQuaternion(q).add(origin)
  sectionSurface(part, sections, sides, ([y, width, depth], angle) => {
    let x = width * signedPower(Math.sin(angle), exponent)
    let z = depth * signedPower(Math.cos(angle), exponent)
    if (carve) [x, z] = carve(x, y, z, angle)
    return at(x, y, z)
  }, ([y]) => at(0, y, 0))
}

// The cheek, temple and domed cranium have separate proportions. Monotone
// cubic interpolation removes the horizontal section bands of the first cast.
const headProfile = [
  [0, .026, .038, .039], [.014, .045, .049, .054],
  [.032, .062, .060, .063], [.050, .075, .072, .066],
  [.071, .082, .083, .066], [.091, .088, .090, .067],
  [.118, .096, .094, .067], [.145, .097, .098, .068],
  [.170, .094, .099, .070], [.197, .092, .095, .076],
  [.224, .091, .088, .081], [.242, .087, .081, .079],
  [.260, .078, .071, .070], [.276, .063, .057, .056],
  [.286, .045, .040, .040], [.292, .027, .024, .024],
  [.295, .010, .009, .009], [.296, .004, .004, .004],
]

function sectionAt(sections, y) {
  let row = 0
  while (row < sections.length - 2 && sections[row + 1][0] < y) row++
  const a = sections[row], b = sections[row + 1], span = b[0] - a[0]
  const t = THREE.MathUtils.clamp((y - a[0]) / span, 0, 1)
  const tangent = (i, axis) => {
    if (i === 0) return (sections[1][axis] - sections[0][axis]) / (sections[1][0] - sections[0][0])
    if (i === sections.length - 1) return (sections[i][axis] - sections[i - 1][axis]) / (sections[i][0] - sections[i - 1][0])
    const leftSpan = sections[i][0] - sections[i - 1][0], rightSpan = sections[i + 1][0] - sections[i][0]
    const left = (sections[i][axis] - sections[i - 1][axis]) / leftSpan
    const right = (sections[i + 1][axis] - sections[i][axis]) / rightSpan
    if (left * right <= 0) return 0
    const leftWeight = 2 * rightSpan + leftSpan, rightWeight = rightSpan + 2 * leftSpan
    return (leftWeight + rightWeight) / (leftWeight / left + rightWeight / right)
  }
  return a.slice(1).map((value, i) => {
    const axis = i + 1
    return (2 * t ** 3 - 3 * t ** 2 + 1) * value + (t ** 3 - 2 * t ** 2 + t) * span * tangent(row, axis)
      + (-2 * t ** 3 + 3 * t ** 2) * b[axis] + (t ** 3 - t ** 2) * span * tangent(row + 1, axis)
  })
}

function denseSections(sections, step) {
  const start = sections[0][0], end = sections.at(-1)[0], count = Math.ceil((end - start) / step)
  return Array.from({ length: count + 1 }, (_, i) => {
    const y = THREE.MathUtils.lerp(start, end, i / count)
    return [y, ...sectionAt(sections, y)]
  })
}

// Spend samples on eyelids, the nasal edge and mouth planes. The long rear
// cranial surface needs fewer angular samples than the front of a portrait.
const faceLevels = [[0, .055, 17], [.055, .140, 28], [.140, .204, 33], [.204, .296, 28]]
  .flatMap(([a, b, count], band) => Array.from({ length: count }, (_, i) => THREE.MathUtils.lerp(a, b, i / (count - 1))).slice(band ? 1 : 0))
const headAngles = [
  ...Array.from({ length: 67 }, (_, i) => -1.04 + i / 66 * 2.08),
  ...Array.from({ length: 45 }, (_, i) => 1.04 + (i + 1) / 46 * (TAU - 2.08)),
].map(a => (a + TAU) % TAU).sort((a, b) => a - b)
const profileAt = y => sectionAt(headProfile, y)
// The shared shallow crown joins three separately shaped lower crania. The
// differences belong to jaw, maxilla, forehead and face depth, not accessories.
const portraitProfiles = [
  [
    [0, .025, .039, .042], [.014, .042, .050, .058], [.032, .061, .062, .065],
    [.050, .079, .073, .065], [.071, .085, .082, .061], [.091, .087, .090, .060],
    [.118, .094, .096, .064], [.145, .094, .099, .068], [.170, .091, .099, .069], [.197, .090, .095, .076],
  ],
  [
    [0, .032, .041, .043], [.014, .049, .052, .057], [.032, .068, .064, .064],
    [.050, .081, .076, .067], [.071, .088, .086, .068], [.091, .093, .093, .069],
    [.118, .100, .097, .072], [.145, .100, .098, .072], [.170, .096, .098, .073], [.197, .095, .095, .078],
  ],
  [
    [0, .022, .036, .041], [.014, .039, .047, .055], [.032, .056, .058, .062],
    [.050, .068, .070, .064], [.071, .077, .080, .065], [.091, .084, .088, .066],
    [.118, .093, .094, .068], [.145, .092, .097, .068], [.170, .089, .098, .068], [.197, .091, .095, .075],
  ],
].map(lower => [...lower, ...headProfile.slice(10)])
const portraitProfileAt = (y, index) => sectionAt(portraitProfiles[index], y)
const cap = value => Math.abs(value) >= 1 ? 0 : .5 + .5 * Math.cos(value * Math.PI)
const portraits = [
  { eyes: .1715, spacing: .0435, eyeWidth: .0225, eyeHeight: .017, cavity: .0135, browRise: .023,
    browArch: .0065, browTilt: -.0020, brow: .0060, lid: .0047, eyeAsym: .0014,
    malarX: .063, malarY: .134, malar: .0110, hollow: .0075, chin: .0105, chinWidth: .030,
    mouth: .0800, lips: .030, lipTilt: -.014, noseWidth: .0142,
    nasal: [[.090, 0], [.106, .025], [.120, .036], [.138, .031], [.159, .019], [.181, .004], [.190, 0]] },
  { eyes: .1675, spacing: .0440, eyeWidth: .0250, eyeHeight: .018, cavity: .0105, browRise: .024,
    browArch: .0040, browTilt: .0010, brow: .0048, lid: .0040, eyeAsym: -.0009,
    malarX: .064, malarY: .130, malar: .0125, hollow: .0040, chin: .0080, chinWidth: .038,
    mouth: .0770, lips: .034, lipTilt: .008, noseWidth: .0163,
    nasal: [[.089, 0], [.105, .025], [.118, .034], [.137, .030], [.158, .016], [.179, .003], [.190, 0]] },
  { eyes: .1720, spacing: .0415, eyeWidth: .0220, eyeHeight: .016, cavity: .0108, browRise: .024,
    browArch: .0080, browTilt: .0015, brow: .0051, lid: .0042, eyeAsym: .0007,
    malarX: .061, malarY: .138, malar: .0085, hollow: .0031, chin: .0090, chinWidth: .025,
    mouth: .0815, lips: .0285, lipTilt: .005, noseWidth: .0130,
    nasal: [[.093, 0], [.108, .022], [.124, .032], [.143, .026], [.163, .016], [.183, .003], [.192, 0]] },
]
const mouthLine = (x, index) => portraits[index].mouth + x * portraits[index].lipTilt - .00035 * cap(x / .012)

/** Compact supported planes keep separate orbital rims from forming a band. */
function facialRelief(x, y, index) {
  const t = portraits[index], ax = Math.abs(x)
  const nasal = sectionAt(t.nasal, y)[0]
  const nasalCross = sectionAt([[0, 1], [.28, .90], [.69, .40], [1, 0]], Math.min(1, ax / t.noseWidth))[0]
  let relief = nasal * nasalCross
  relief += .0045 * (cap((x - .019) / .010) + cap((x + .019) / .010)) * cap((y - .108) / .013)
    - .0038 * (cap((x - .019) / .0048) + cap((x + .019) / .0048)) * cap((y - .104) / .0050)
  const cheekLine = t.malarY + (ax - .050) * .20
  relief += t.malar * cap((ax - t.malarX) / .031) * cap((y - cheekLine) / .033)
    - t.hollow * cap((ax - .058) / .030) * cap((y - .099) / .026)
    + [.0050, .0035, .0022][index] * cap((ax - .065) / .027) * cap((y - .051) / .022)
    + t.chin * cap(x / t.chinWidth) * cap((y - .029) / .028)
  for (const side of [-1, 1]) {
    const eye = side * t.spacing, eyeY = t.eyes + side * t.eyeAsym
    const u = (x - eye) / t.eyeWidth, v = (y - eyeY) / t.eyeHeight
    const orbitalRadius = Math.sqrt(u * u + v * v)
    relief -= t.cavity * cap(orbitalRadius / 1.28)
    if (Math.abs(u) < 1.18) {
      const span = Math.max(0, 1 - (u / 1.18) ** 2)
      const almond = Math.max(0, 1 - u * u)
      const cant = side * u * [.0015, -.0010, .0020][index]
      const upper = eyeY + .0065 * almond + cant, lower = eyeY - .0030 * almond + cant
      relief += t.lid * cap((y - upper) / .0042) * almond
        + t.lid * .62 * cap((y - lower) / .0040) * almond
        + .0025 * cap((y - eyeY) / .006) * almond
        - .0035 * cap((y - eyeY - .0008 * almond - cant) / .0028) * almond
      const browLine = eyeY + t.browRise + t.browArch * span + side * u * t.browTilt
      relief += t.brow * cap((y - browLine) / .011) * span ** 1.35
    }
    const foldX = side * (.025 + (.117 - y) * .32)
    relief -= [.0029, .0020, .0015][index] * cap((x - foldX) / .0068) * cap((y - .100) / .023)
  }
  const seam = mouthLine(x, index), lip = cap(x / t.lips)
  relief += .0018 * (cap((x - .006) / .0045) + cap((x + .006) / .0045)) * cap((y - .095) / .012)
    + .0038 * lip * cap((y - seam - .0038 - .0009 * cap(x / .010)) / .0052)
    + .0043 * lip * cap((y - seam + .0045) / .0057)
    - .0038 * lip * cap((y - seam) / .0020)
    - .0034 * cap(x / (t.lips * 1.05)) * cap((y - seam + .014) / .0075)
  return relief
}

/** A folded ear shell, with a buried root, helix rim, concha and lower lobe. */
function earShell(part, at, side) {
  const radii = [.10, .22, .34, .46, .58, .68, .77, .84, .91, .97, 1], sides = 28
  const positions = [], indices = []
  const local = (r, angle, back = false) => {
    const c = Math.cos(angle), s = Math.sin(angle)
    const y = .154 + .025 * r * c * (1 + .11 * s)
    const z = -.010 + .014 * r * s
    const x = back ? .086 : .088 + .005 * (1 - r * r)
      + .010 * bell(r, .83, .12) + .003 * s * s * bell(r, .43, .16)
      - .003 * bell(s, .1, .5) * bell(r, .32, .18)
    return at(side * x, y, z)
  }
  const triangle = (a, b, c) => indices.push(...(side > 0 ? [a, b, c] : [a, c, b]))
  for (const r of radii) for (let j = 0; j < sides; j++) positions.push(...local(r, j / sides * TAU).toArray())
  for (let row = 0; row < radii.length - 1; row++) for (let j = 0; j < sides; j++) {
    const a = row * sides + j, b = row * sides + (j + 1) % sides
    const c = a + sides, d = b + sides
    triangle(a, c, d); triangle(a, d, b)
  }
  const middle = positions.length / 3
  positions.push(...local(0, 0).toArray())
  for (let j = 0; j < sides; j++) triangle(middle, j, (j + 1) % sides)
  const back = positions.length / 3
  for (let j = 0; j < sides; j++) positions.push(...local(1, j / sides * TAU, true).toArray())
  const backCenter = positions.length / 3
  positions.push(...local(0, 0, true).toArray())
  for (let j = 0; j < sides; j++) {
    const next = (j + 1) % sides, a = (radii.length - 1) * sides + j, b = (radii.length - 1) * sides + next
    triangle(a, b, back + next); triangle(a, back + next, back + j)
    triangle(backCenter, back + next, back + j)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  put(part, geometry)
}

function hairline(angle, index) {
  const c = Math.cos(angle), frontalAngle = Math.acos(THREE.MathUtils.clamp(c, -1, 1))
  const front = [.231, .223, .216][index], side = [.180, .171, .149][index], back = [.138, .136, .106][index]
  const line = c >= 0 ? side + (front - side) * c ** 1.4 : side + (back - side) * -c
  const recession = [.035, .022, .007][index] * bell(frontalAngle, .88, .34) * Math.max(0, c) ** .45
  return line + recession + .006 * Math.sin(angle * 3 + index) * (1 - Math.abs(c))
    + (index === 1 ? .012 * Math.sin(angle - .30) * Math.max(0, c) : 0)
}

const hairPartAngle = (y, index) => [-.52, -.38, .22][index] + (y - .225) * [2.0, 2.7, -2.5][index]
function hairPhase(y, angle, index) {
  const [width, back, front] = profileAt(y), c = Math.cos(angle)
  const x = width * Math.sin(angle), z = (c >= 0 ? front : back) * c
  const partX = width * Math.sin(hairPartAngle(y, index))
  const side = THREE.MathUtils.smoothstep(x, partX - .013, partX + .013)
  const fall = THREE.MathUtils.lerp([-.36, -.40, .67][index], [.72, .82, -.38][index], side)
  // Oblique contours cross the broad crown and turn at the part. Cartesian
  // flow stays calm at the crown pole, where longitude stripes used to converge.
  const flow = x - partX + (.296 - y) * fall + z * [.22, .29, -.24][index]
    + (x - partX) * z * 2.1
  return flow / [.038, .043, .041][index] * TAU
}

/** Broad cast locks and incised flow channels, shaped into the cranium itself. */
function hairRelief(y, angle, index, width) {
  const line = hairline(angle, index), c = Math.cos(angle)
  const mask = THREE.MathUtils.smoothstep(y, line - .023, line + .036)
  const channelMask = THREE.MathUtils.smoothstep(y, line + .002, line + .031)
  const phase = hairPhase(y, angle, index)
  const lock = (.5 - .5 * Math.cos(phase)) ** .8
  const channel = bell(Math.sin(phase / 2), 0, .27 + .17 * (1 - Math.max(0, c)))
  const locks = .0022 + .0046 * lock - .0036 * channel * channelMask
  const forelock = [.0045, .0060, .0048][index] * bell(Math.sin(angle - [.30, .33, -.20][index]), 0, .34)
    * Math.max(0, c) ** 2 * bell(y, .251, .032)
  const rearSweep = index === 2 ? .005 * (1 - Math.max(0, c)) * bell(y, .173, .055) : 0
  const part = .0042 * bell(Math.sin(angle - hairPartAngle(y, index)), 0, .085)
    * Math.max(0, c) ** 1.5 * channelMask
  const templeTaper = .56 + .44 * Math.abs(c) ** .8
  return mask * templeTaper * Math.max(-.0020, locks + forelock + rearSweep - part)
    * THREE.MathUtils.clamp(width / .031, 0, 1)
}

/** Thin dark inlays occupy modeled eye and lip incisions, without pupils. */
function incision(part, at, path, width, segments = 32) {
  const positions = [], indices = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, [x, y] = path(t), w = width(t)
    positions.push(...at(x, y - w).toArray(), ...at(x, y + w).toArray())
    if (i < segments) { const a = i * 2; indices.push(a, a + 2, a + 3, a, a + 3, a + 1) }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  put(part, geometry)
}

function face(part, grooves, origin, yaw, index, size) {
  const width = [.965, 1.015, .95][index] * size
  const height = [1.02, 1, 1.035][index] * size
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(.040, yaw, [-.024, -.004, .022][index]))
  const at = (x, y, z) => vec(x * width, y * height, z * size).applyQuaternion(q).add(origin)
  const halfWidthAt = y => portraitProfileAt(y, index)[0]
  const point = (y, angle, inset = 0) => {
    const [_, back, front] = portraitProfileAt(y, index), c = Math.cos(angle), s = Math.sin(angle)
    let x = halfWidthAt(y) * signedPower(s, .98)
    let z = (c >= 0 ? front : back) * signedPower(c, c >= 0 ? .88 + .12 * THREE.MathUtils.smoothstep(y, .20, .28) : 1)
    if (c > 0) z += c ** 1.7 * facialRelief(x, y, index)
    const hair = hairRelief(y, angle, index, portraitProfileAt(y, index)[0])
    x += hair * s
    z += hair * c + inset
    return at(x, y, z)
  }
  sectionSurface(part, faceLevels, headAngles, point, y => at(0, y, 0))
  for (const side of [-1, 1]) earShell(part, at, side)
  if (index !== 0) {
    const start = Math.max(.226, hairline(hairPartAngle(.24, index), index) + .008)
    const positions = [], indices = [], segments = 40
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, y = THREE.MathUtils.lerp(start, headProfile.at(-1)[0] - .012, t), angle = hairPartAngle(y, index)
      const w = .003 + .006 * Math.sin(t * Math.PI)
      positions.push(...point(y, angle - w, .0010).toArray(), ...point(y, angle + w, .0010).toArray())
      if (i < segments) { const a = i * 2; indices.push(a, a + 1, a + 3, a, a + 3, a + 2) }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setIndex(indices); geometry.computeVertexNormals(); put(grooves, geometry)
  }

}

function bust(part, grooves, origin, index, proportions) {
  const { shoulders, torso, head } = proportions
  const shoulderYaw = Math.atan2(-origin.x, .73 - origin.z), headYaw = Math.atan2(-origin.x, .34 - origin.z)
  const q = new THREE.Quaternion().setFromAxisAngle(UP, shoulderYaw)
  const neckline = x => index === 0 ? .164 + x * .31 : index === 1 ? .145 + Math.abs(x) * .43
    : .166 + Math.abs(x) * .20 - .009 * bell(x, -.02, .07)
  const sections = [
    [(-.485 - origin.y) / torso, .170, .102], [0, .174, .104],
    [.018, .193, .114], [.043, .205, .116], [.074, .201, .108],
    [.103, .188, .099], [.130, .163, .092], [.153, .130, .079],
    [.176, .097, .065], [.194, .071, .055], [.216, .058, .050],
    [.240, .054, .047], [.268, .053, .046],
  ].map(([y, w, d]) => [y * torso, w * shoulders, d * shoulders])
  const carve = (x, y, z, angle) => {
    const X = x / shoulders, Y = y / torso, c = Math.cos(angle)
    const frontal = Math.max(0, c) ** 1.6, edge = neckline(X)
    const cloth = 1 - THREE.MathUtils.smoothstep(Y, edge - .009, edge + .010)
    const leftFold = -.029 - (.188 - Y) * [.85, .78, .64][index] - .009 * bell(Y, .070, .044)
    const rightFold = .033 + (.184 - Y) * [.56, .65, .81][index]
    const folds = .028 * bell(X, leftFold, .022)
      + .023 * bell(X, rightFold, .022)
      - .014 * bell(X, leftFold - .030, .012)
      - .012 * bell(X, rightFold + .029, .013)
    const crossLine = index === 0 ? .065 + X * .39 : index === 1 ? .052 + Math.abs(X) * .29 : .074 - X * .36
    const crossFold = .017 * bell(Y, crossLine, .012) - .010 * bell(Y, crossLine - .017, .008)
    const hem = .016 * bell(Y, edge + .001, .0065) - .0105 * bell(Y, edge - .013, .0055)
    const tendon = .010 * (bell(X, -.038 - (.237 - Y) * .12, .009) + bell(X, .038 + (.237 - Y) * .12, .009)) * bell(Y, .224, .036)
    const clavicle = .008 * bell(Y, .189 - Math.abs(X) * .14, .007) * bell(X, 0, .097)
    const sternum = -.010 * bell(X, 0, .012) * bell(Y, .188, .009) - .004 * bell(X, 0, .016) * bell(Y, .165, .027)
    const skin = tendon + clavicle + sternum
    const rear = -.008 * Math.max(0, -c) ** 2 * (bell(X, -.060 + (.15 - Y) * .22, .016)
      + bell(X, .054 - (.15 - Y) * .18, .017)) * bell(Y, .109, .092)
    return [x, z + shoulders * (frontal * (cloth * (folds * bell(Y, .090, .091) + crossFold) + hem + (1 - cloth) * skin) + rear)]
  }
  // Three garment cuts: oblique mantle, open V drape, and a softer folded cowl.
  // Raised hem shoulders border genuine cut valleys; skin above shows the neck,
  // suprasternal notch and collarbones, and the cloth continues into the plinth.
  loft(part, denseSections(sections, .008), origin, {
    sides: 88, yaw: shoulderYaw, exponent: .94, zOffset: -.021, carve,
  })
  const front = (x, y) => {
    const [width, depth] = sectionAt(sections, y)
    const angle = Math.asin(signedPower(THREE.MathUtils.clamp(x / width, -.98, .98), 1 / .94))
    const z = depth * Math.cos(angle) ** .94
    const [X, Z] = carve(x, y, z, angle)
    return vec(X, y, Z - .021 + .0009).applyQuaternion(q).add(origin)
  }
  incision(grooves, front, t => {
    const x = (t * 2 - 1) * .074
    return [x * shoulders, (neckline(x) - .013) * torso]
  }, t => shoulders * (.00025 + .0006 * Math.sin(t * Math.PI)), 40)
  face(part, grooves, origin.clone().add(vec(0, .221 * torso, -.022)), headYaw, index, head)
}

function plinthOutline(scale = 1, path = new THREE.Shape()) {
  path.moveTo(0, -.790 * scale)
  path.bezierCurveTo(-.59 * scale, -.790 * scale, -.99 * scale, -.350 * scale, -1.015 * scale, -.016 * scale)
  path.bezierCurveTo(-1.040 * scale, .254 * scale, -.792 * scale, .450 * scale, -.420 * scale, .428 * scale)
  path.bezierCurveTo(-.204 * scale, .496 * scale, .204 * scale, .496 * scale, .420 * scale, .428 * scale)
  path.bezierCurveTo(.792 * scale, .450 * scale, 1.040 * scale, .254 * scale, 1.015 * scale, -.016 * scale)
  path.bezierCurveTo(.99 * scale, -.350 * scale, .59 * scale, -.790 * scale, 0, -.790 * scale)
  return path
}

function sculpturalBase(part, rim) {
  const shape = plinthOutline()
  put(part, finishBevel(new THREE.ExtrudeGeometry(shape, {
    depth: .166, bevelEnabled: true, bevelSize: .016, bevelThickness: .016,
    bevelSegments: 3, curveSegments: 24, steps: 1,
  })), vec(0, -.498, 0), [Math.PI / 2, 0, 0])
  // A narrow inset shoulder follows the outline, leaving the quiet dark floor
  // visible. The edge belongs to the plinth rather than enclosing it as a rail.
  const inset = plinthOutline(.983)
  inset.holes.push(plinthOutline(.950, new THREE.Path()))
  put(rim, finishBevel(new THREE.ExtrudeGeometry(inset, {
    depth: .012, bevelEnabled: true, bevelSize: .004, bevelThickness: .004,
    bevelSegments: 2, curveSegments: 24, steps: 1,
  })), vec(0, -.482, 0), [Math.PI / 2, 0, 0])
}

function specimenLetter(part, pivot, rounded) {
  const shape = new THREE.Shape()
  if (rounded) {
    shape.moveTo(-.024, -.033); shape.lineTo(-.006, .033); shape.lineTo(.006, .033)
    shape.lineTo(.024, -.033); shape.lineTo(.014, -.033); shape.lineTo(.009, -.017)
    shape.lineTo(-.009, -.017); shape.lineTo(-.014, -.033); shape.closePath()
    const aperture = new THREE.Path()
    aperture.moveTo(-.006, -.006); aperture.lineTo(0, .017); aperture.lineTo(.006, -.006); aperture.closePath()
    shape.holes.push(aperture)
  } else {
    shape.moveTo(-.021, -.033); shape.lineTo(-.021, .033); shape.lineTo(.003, .033)
    shape.bezierCurveTo(.029, .033, .028, .010, .013, .003)
    shape.bezierCurveTo(.033, -.003, .030, -.033, .004, -.033); shape.closePath()
    for (const y of [-.016, .017]) {
      const aperture = new THREE.Path()
      aperture.absellipse(.001, y, .010, .008, 0, TAU, true, 0)
      shape.holes.push(aperture)
    }
  }
  put(part, finishBevel(new THREE.ExtrudeGeometry(shape, {
    depth: .0015, bevelEnabled: true, bevelSize: .0005, bevelThickness: .0005,
    bevelSegments: 1, curveSegments: 6, steps: 1,
  })), pivot.clone().add(vec(0, .222, rounded ? .096 : .095)))
}

/** Two original product prototypes: oval vessel and softly faceted vessel. */
function comparison(part, inlays, pivot, rounded) {
  if (rounded) {
    loft(part, [
      [0, .112, .079], [.014, .139, .091], [.036, .148, .096],
      [.089, .151, .096], [.270, .151, .094], [.347, .145, .091],
      [.384, .132, .083], [.417, .106, .070], [.441, .068, .054],
      [.453, .058, .046], [.498, .058, .046],
    ], pivot, { sides: 64, exponent: .94 })
  } else {
    loft(part, [
      [0, .107, .074], [.016, .131, .091], [.033, .139, .094],
      [.304, .139, .094], [.357, .137, .093], [.390, .124, .087],
      [.422, .093, .069], [.438, .055, .047], [.497, .055, .047],
    ], pivot, { sides: 64, exponent: .32 })
  }
  const width = rounded ? .075 : .073, depth = rounded ? .058 : .061
  loft(part, [
    [.490, width - .006, depth - .003], [.499, width - .001, depth],
    [.507, width - .001, depth], [.513, width, depth],
    [.553, width, depth], [.562, width - .002, depth - .001],
    [.574, width - .009, depth - .007],
  ], pivot, {
    sides: 72, exponent: rounded ? .92 : .36,
    carve: (x, y, z, angle) => {
      const cut = .0012 * (.5 + .5 * Math.cos(angle * 24)) * bell(y, .534, .027)
      return [x - cut * Math.sin(angle), z - cut * Math.cos(angle)]
    },
  })
  loft(inlays, [[.499, width - .0005, depth + .0005], [.501, width - .0005, depth + .0005]], pivot,
    { sides: 48, exponent: rounded ? .92 : .36 })
  specimenLetter(inlays, pivot, rounded)
}

export function audienceTheatre() {
  const base = group('Continuous carved comparison base', 'steel')
  const fittings = group('Inset plinth shoulder and comparison socket seats', 'silver')
  const people = group('Three substantial cast portraits with continuous coiffure and drapery', 'pewter')
  const portraitGrooves = group('Incised coiffure parts and fitted cloth hems', 'ink')
  const socketInlays = group('Recessed graphite comparison sockets', 'ink')
  const leftPivot = vec(-.205, -.422, .208), rightPivot = vec(.205, -.422, .208)
  const roundSample = group('hover-oval-product-prototype', 'silver', leftPivot, UP.clone())
  const facetedSample = group('hover-faceted-product-prototype', 'porcelain', rightPivot, UP.clone())
  // A quieter enamel value keeps the faceted specimen's planes visible beside
  // the silver sample, including under the homepage's strong key light.
  facetedSample.surfaceTone = .76
  const leftInlays = group('oval-specimen-inlays', 'ink', leftPivot.clone(), UP.clone())
  const rightInlays = group('faceted-specimen-inlays', 'ink', rightPivot.clone(), UP.clone())
  leftInlays.parent = roundSample.name
  rightInlays.parent = facetedSample.name
  sculpturalBase(base, fittings)
  const sitters = [
    { origin: vec(-.67, -.430, -.170), shoulders: 1.43, torso: 1.37, head: 1.54 },
    { origin: vec(0, -.385, -.505), shoulders: 1.67, torso: 1.49, head: 1.72 },
    { origin: vec(.67, -.430, -.170), shoulders: 1.40, torso: 1.35, head: 1.49 },
  ]
  for (const [index, sitter] of sitters.entries()) bust(people, portraitGrooves, sitter.origin, index, sitter)
  for (const pivot of [leftPivot, rightPivot]) {
    loft(fittings, [[-.483 - pivot.y, .179, .139], [-.021, .181, .141], [-.005, .168, .130]], pivot,
      { sides: 48, exponent: .80 })
    machinedRing(socketInlays, .068, .036, .028, 0, TAU, pivot.clone().add(vec(0, -.012, 0)), [Math.PI / 2, 0, 0], 48)
  }
  comparison(roundSample, leftInlays, leftPivot, true)
  comparison(facetedSample, rightInlays, rightPivot, false)
  for (const sample of [roundSample, facetedSample]) {
    put(sample, new THREE.CylinderGeometry(.047, .047, .046, 32, 1), sample.pivot.clone().add(vec(0, -.021, 0)))
  }
  return [base, fittings, people, portraitGrooves, socketInlays, roundSample, facetedSample, leftInlays, rightInlays]
}
