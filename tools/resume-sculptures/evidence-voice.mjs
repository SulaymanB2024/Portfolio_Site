/** Evidence and conversation, made in the site's cast-metal sculpture family. */
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js'
import { cabinetGeometry, gesture, screw } from './cabinet-geometry.mjs'

const section = [[1, 0], [.78, 1], [-.78, 1], [-1, 0], [-.78, -1], [.78, -1]]

function frontNormal(api, sample, x, y) {
  const n = sample(x + .0001, y).sub(sample(x - .0001, y)).cross(sample(x, y + .0001).sub(sample(x, y - .0001))).normalize()
  if (n.z < 0) n.negate()
  return n
}

/** Closed curved stock with rounded corners and a separate beveled edge return. */
function boundLeaf(api, sample, width, height, thickness, radius = .045, columns = 16, rows = 24) {
  const { THREE } = api
  const positions = [], indices = [], surface = [], normals = [], rowWidth = columns + 1
  for (let j = 0; j <= rows; j++) {
    // End rows are closer together, giving the rounded corners actual curvature.
    const y = -height / 2 * Math.cos(j / rows * Math.PI)
    const corner = Math.max(0, Math.abs(y) - height / 2 + radius)
    const span = width / 2 - radius + Math.sqrt(Math.max(0, radius * radius - corner * corner))
    for (let i = 0; i <= columns; i++) {
      const x = width / 2 + (i / columns - .5) * span * 2
      surface.push(sample(x, y)); normals.push(frontNormal(api, sample, x, y))
    }
  }
  for (const side of [0, 1]) for (let i = 0; i < surface.length; i++) positions.push(...surface[i].clone().addScaledVector(normals[i], -side * thickness).toArray())
  const count = surface.length
  const forward = sample(width * .51, 0).sub(sample(width * .49, 0)).cross(sample(width * .5, .01).sub(sample(width * .5, -.01))).z > 0
  const triangle = (a, b, c) => indices.push(...(forward ? [a, b, c] : [a, c, b]))
  for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
    const a = j * rowWidth + i, b = a + 1, c = a + rowWidth, d = c + 1
    triangle(a, b, d); triangle(a, d, c)
    triangle(a + count, d + count, b + count); triangle(a + count, c + count, d + count)
  }
  const boundary = []
  for (let i = 0; i <= columns; i++) boundary.push(i)
  for (let j = 1; j <= rows; j++) boundary.push(j * rowWidth + columns)
  for (let i = columns - 1; i >= 0; i--) boundary.push(rows * rowWidth + i)
  for (let j = rows - 1; j > 0; j--) boundary.push(j * rowWidth)
  const start = positions.length / 3, bevel = Math.min(.012, thickness * .24)
  for (let k = 0; k < boundary.length; k++) {
    const index = boundary[k], p = surface[index], n = normals[index]
    const tangent = surface[boundary[(k + 1) % boundary.length]].clone().sub(surface[boundary[(k + boundary.length - 1) % boundary.length]])
    const outward = tangent.cross(n).normalize().multiplyScalar(forward ? 1 : -1)
    for (const [across, depth] of [[0, 0], [bevel, bevel], [bevel, thickness - bevel], [0, thickness]]) positions.push(...p.clone().addScaledVector(outward, across).addScaledVector(n, -depth).toArray())
  }
  for (let k = 0; k < boundary.length; k++) for (let r = 0; r < 3; r++) {
    const a = start + k * 4 + r, b = start + ((k + 1) % boundary.length) * 4 + r
    triangle(a, a + 1, b); triangle(b, a + 1, b + 1)
  }
  const source = new THREE.BufferGeometry()
  source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
  const geometry = toCreasedNormals(source, Math.PI / 3); source.dispose(); return geometry
}

/** Fine closed strokes follow the physical sheet, including its curved surface. */
function engraving(api, parent, name, sample, points, width = .0024, finish = 'ink', segments = 12) {
  const { THREE, mesh } = api
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal')
  const positions = [], indices = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, p = curve.getPoint(t), tangent = curve.getTangent(t)
    for (const [across, depth] of section) {
      const x = p.x - tangent.y * across * width, y = p.y + tangent.x * across * width
      positions.push(...sample(x, y).addScaledVector(frontNormal(api, sample, x, y), .0025 + depth * .0009).toArray())
    }
  }
  for (let i = 0; i < segments; i++) for (let j = 0; j < section.length; j++) {
    const a = i * section.length + j, b = i * section.length + (j + 1) % section.length, c = a + section.length, d = b + section.length
    indices.push(a, b, c, b, d, c)
  }
  for (const end of [0, segments]) {
    const p = curve.getPoint(end / segments), cap = positions.length / 3
    positions.push(...sample(p.x, p.y).addScaledVector(frontNormal(api, sample, p.x, p.y), .0025).toArray())
    for (let j = 0; j < section.length; j++) {
      const a = end * section.length + j, b = end * section.length + (j + 1) % section.length
      indices.push(...(end === 0 ? [cap, b, a] : [cap, a, b]))
    }
  }
  const center = curve.getPoint(.5)
  const forward = sample(center.x + .001, center.y).sub(sample(center.x - .001, center.y)).cross(sample(center.x, center.y + .001).sub(sample(center.x, center.y - .001))).z > 0
  if (!forward) for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]]
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals()
  return mesh(parent, name, geometry, finish)
}

function folioSurface(api, side, width, height, base, curl = 0) {
  return (x, y) => {
    const t = x / 1.01, z = base + .16 * Math.max(0, t) ** 1.75 + .026 * Math.sin(Math.PI * t) * Math.max(0, 1 - (y / (height / 2)) ** 2)
    let px = x, py = y, pz = z
    if (curl) {
      const distance = Math.max(0, (x + y - width - height * .31) / Math.SQRT2)
      const angle = distance / curl, retreat = (distance - curl * Math.sin(angle)) / Math.SQRT2
      px -= retreat; py -= retreat; pz += curl * (1 - Math.cos(angle))
    }
    return new api.THREE.Vector3(side * (.055 + px), py, pz)
  }
}

export function buildVoid(source) {
  const api = cabinetGeometry(source)
  const { THREE, mesh, joint, lathe, animate, structure } = api
  const model = structure('void', 'Bound evidence folio', 'A substantial tooled pewter folio binds curved pale sheets. A source record sits beside a ruled working leaf, linking the consulting practice’s research and financial planning. One real evidence leaf lifts gently at its bound spine, while the firm cover remains seated.', 9.6, [.40, -.34, -.035])
  const root = model.root, width = .934, height = 1.410

  lathe(root, 'cast-bound-folio-spine', [[0, -.765], [.042, -.765], [.059, -.740], [.061, -.60], [.069, -.54], [.069, .54], [.061, .60], [.059, .740], [.042, .765], [0, .765]], 'steel', [0, 0, -.046], [0, 0, 0], 36)
  let leftSheet
  for (const side of [-1, 1]) {
    const cover = folioSurface(api, side, 1.01, 1.52, -.065)
    mesh(root, 'tooled-pewter-cover-' + side, boundLeaf(api, cover, 1.01, 1.52, .075, .055, 18, 24), 'pewter')
    // The cover border is tooling in the metal margin, not a detached decoration.
    engraving(api, root, 'tooled-cover-outer-return-' + side, cover, [[.990, -.696], [.990, -.30], [.990, .30], [.990, .696]], .0075, 'silver', 20)
    engraving(api, root, 'tooled-cover-upper-return-' + side, cover, [[.10, .728], [.45, .728], [.96, .728]], .0045, 'silver', 16)
    engraving(api, root, 'tooled-cover-lower-return-' + side, cover, [[.10, -.728], [.45, -.728], [.96, -.728]], .0045, 'silver', 16)
    const packet = folioSurface(api, side, width, height, -.025)
    mesh(root, 'seated-evidence-sheet-block-' + side, boundLeaf(api, packet, width, height, .030, .032, 14, 22), 'porcelain')
    if (side < 0) {
      leftSheet = folioSurface(api, side, width, height, -.010, .26)
      mesh(root, 'curved-source-leaf', boundLeaf(api, leftSheet, width, height, .012, .028, 18, 28), 'porcelain')
    }
  }

  // Read left to right on the left leaf, whose stock was mirrored about the spine.
  const leftMark = (x, y) => leftSheet(width - x, y)
  // A few substantial strokes suggest an archived record without tiny type.
  engraving(api, root, 'source-record-heading', leftMark, [[.170, .420], [.537, .420]], .0040, 'ink', 10)
  for (const [i, [y, end]] of [[.243, .731], [.150, .667], [.057, .710]].entries()) engraving(api, root, 'source-record-line-' + i, leftMark, [[.170, y], [end, y]], .0034, 'ink', 10)
  engraving(api, root, 'source-record-signature', leftMark, [[.210, -.305], [.310, -.232], [.290, -.335], [.420, -.260], [.486, -.285]], .0034, 'ink', 20)

  const pivot = new THREE.Vector3(.055, 0, -.010)
  const leaf = joint(root, 'Atlas-bound-evidence-leaf', pivot.toArray())
  const rightSurface = folioSurface(api, 1, width, height, -.010, .19)
  const rightSheet = (x, y) => rightSurface(x, y).sub(pivot)
  mesh(leaf, 'curved-evidence-leaf', boundLeaf(api, rightSheet, width, height, .012, .028, 18, 28), 'porcelain')
  // The opposite leaf is a working ledger, engraved as a single quiet grid.
  for (const [i, y] of [.407, .247, .087, -.073, -.233, -.393].entries()) engraving(api, leaf, 'ruled-ledger-row-' + i, rightSheet, [[.166, y], [.753, y]], .0030, 'ink', 12)
  for (const [i, x] of [.554, .753].entries()) engraving(api, leaf, 'ruled-ledger-column-' + i, rightSheet, [[x, .407], [x, -.393]], .0028, 'ink', 16)
  engraving(api, leaf, 'ledger-review-mark', rightSheet, [[.612, -.018], [.642, -.051], [.701, .025]], .0040, 'ink', 10)

  animate(model, leaf, [0, 1, 0], q => -.140 * gesture(q, .16, .39, .62, .88))
  return model
}

/** A closed beveled rib follows the microphone's elliptical acoustic envelope. */
function grilleRib(api, rx, rz, y, weight = 1) {
  const { THREE, TAU } = api
  const profile = [[-.015, -.024], [.012, -.024], [.022, -.014], [.022, .014], [.012, .024], [-.015, .024], [-.023, .014], [-.023, -.014]]
  const positions = [], indices = [], steps = 40
  for (let i = 0; i < steps; i++) {
    const angle = TAU * i / steps
    for (const [radial, vertical] of profile) positions.push((rx + radial * weight) * Math.sin(angle), y + vertical * weight, (rz + radial * weight) * Math.cos(angle))
  }
  for (let i = 0; i < steps; i++) for (let j = 0; j < profile.length; j++) {
    const a = i * profile.length + j, b = ((i + 1) % steps) * profile.length + j, c = ((i + 1) % steps) * profile.length + (j + 1) % profile.length, d = i * profile.length + (j + 1) % profile.length
    indices.push(a, b, c, a, c, d)
  }
  const source = new THREE.BufferGeometry()
  source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
  const geometry = toCreasedNormals(source, Math.PI / 3); source.dispose(); return geometry
}

/** A swept variable-section U support gives the arms a molded, seated transition. */
function moldedYoke(api) {
  const { THREE } = api
  const curve = new THREE.CatmullRomCurve3([[-.473, .483, 0], [-.470, .080, 0], [-.403, -.190, 0], [-.240, -.292, 0], [0, -.308, 0], [.240, -.292, 0], [.403, -.190, 0], [.470, .080, 0], [.473, .483, 0]].map(p => new THREE.Vector3(...p)), false, 'centripetal')
  const steps = 48, profile = [[1, 0], [.93, .55], [.55, .93], [0, 1], [-.55, .93], [-.93, .55], [-1, 0], [-.93, -.55], [-.55, -.93], [0, -1], [.55, -.93], [.93, -.55]]
  const positions = [], indices = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, p = curve.getPoint(t), tangent = curve.getTangent(t), width = .066 + .019 * Math.sin(Math.PI * t) ** 2
    for (const [across, depth] of profile) positions.push(p.x - tangent.y * width * across, p.y + tangent.x * width * across, depth * (.077 + .009 * Math.sin(Math.PI * t)))
  }
  for (let i = 0; i < steps; i++) for (let j = 0; j < profile.length; j++) {
    const a = i * profile.length + j, b = i * profile.length + (j + 1) % profile.length, c = a + profile.length, d = b + profile.length
    indices.push(a, b, c, b, d, c)
  }
  for (const end of [0, steps]) {
    const cap = positions.length / 3; positions.push(...curve.getPoint(end / steps).toArray())
    for (let j = 0; j < profile.length; j++) {
      const a = end * profile.length + j, b = end * profile.length + (j + 1) % profile.length
      indices.push(...(end === 0 ? [cap, b, a] : [cap, a, b]))
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals()
  return geometry
}

export function buildChegg(source) {
  const api = cabinetGeometry(source)
  const { THREE, TAU, mesh, joint, rounded, rod, lathe, animate, structure } = api
  const model = structure('chegg', 'Cast interview microphone', 'A classic desk interview microphone is carried by a molded pewter yoke and tapered cast stem. Its elliptical weighted foot, seated clamp bearings and restrained metal grille share the site’s sculpture family. The acoustic head makes one small held adjustment on its real bearing axis.', 9.2, [.045, -.24, -.015])
  const root = model.root

  const foot = lathe(root, 'elliptical-weighted-cast-foot', [[0, -.058], [.36, -.058], [.446, -.041], [.476, -.015], [.479, .013], [.464, .041], [.407, .067], [.205, .080], [.075, .091], [0, .091]], 'pewter', [0, -.958, 0], [0, 0, 0], 48)
  foot.scale.set(1, 1, .84)
  const sole = lathe(root, 'seated-weighted-foot-sole', [[0, -.012], [.400, -.012], [.423, -.003], [.423, .008], [0, .008]], 'steel', [0, -1.021, 0], [0, 0, 0], 40)
  sole.scale.set(1, 1, .84)
  lathe(root, 'tapered-cast-microphone-stem', [[0, 0], [.069, 0], [.075, .020], [.063, .080], [.047, .318], [.043, .421], [.067, .480], [0, .480]], 'pewter', [0, -.869, 0], [0, 0, 0], 36)
  lathe(root, 'seated-yoke-socket', [[0, -.025], [.067, -.025], [.074, -.011], [.073, .013], [.058, .027], [0, .027]], 'silver', [0, -.386, 0], [0, 0, 0], 32)
  mesh(root, 'molded-solid-U-yoke', moldedYoke(api), 'pewter')

  const head = joint(root, 'cast-microphone-acoustic-head', [0, .43, 0], [-.075, 0, 0])
  const core = mesh(head, 'recessed-acoustic-envelope', new THREE.CapsuleGeometry(.340, .56, 4, 28), 'ink')
  core.scale.set(1, .965, .715)
  for (const sign of [-1, 1]) {
    const cap = mesh(head, sign > 0 ? 'cast-upper-capsule-cap' : 'cast-lower-capsule-cap', new THREE.SphereGeometry(.376, 40, 8, 0, TAU, 0, Math.PI / 2), 'pewter', [0, sign * .328, 0], sign > 0 ? [0, 0, 0] : [Math.PI, 0, 0])
    cap.scale.set(1, .72, .735)
    rounded(head, 'cast-capsule-side-return-' + sign, [.065, .681, .118], 'pewter', [sign * .367, 0, 0], [0, 0, 0], .027, .008)
    lathe(head, 'moving-capsule-journal-' + sign, [[0, -.021], [.064, -.021], [.073, -.009], [.073, .014], [.063, .023], [0, .023]], 'pewter', [sign * .390, 0, 0], [0, 0, sign * Math.PI / 2], 28)
    rod(root, 'seated-microphone-bearing-shaft-' + sign, [sign * .352, .43, 0], [sign * .582, .43, 0], .046, 'steel', 24)
    lathe(root, 'cast-yoke-clamp-bearing-' + sign, [[0, -.019], [.057, -.019], [.085, -.010], [.090, .001], [.080, .021], [.056, .029], [0, .029]], 'pewter', [sign * .558, .43, 0], [0, 0, sign * Math.PI / 2], 28)
    const clamp = joint(root, 'seated-bearing-fastener-' + sign, [sign * .590, .43, 0], [0, sign * Math.PI / 2, 0])
    screw(api, clamp, 'bearing-clamp-screw-' + sign, [0, 0, 0], .027, 'steel')
    mesh(head, 'capsule-cap-assembly-return-' + sign, grilleRib(api, .370, .268, sign * .327, .36), 'silver')
  }
  for (const [i, y] of [-.292, -.206, -.121, -.039, .039, .121, .206, .292].entries()) {
    const taper = (Math.abs(y) / .292) ** 2
    mesh(head, 'cast-contoured-grille-rib-' + i, grilleRib(api, .369 - .010 * taper, .271 - .005 * taper, y, 1 - .17 * taper), 'silver')
  }
  rounded(head, 'restrained-front-grille-bridge', [.039, .679, .033], 'pewter', [0, 0, .290], [0, 0, 0], .017, .006)
  rounded(head, 'seated-rear-capsule-seam', [.038, .679, .034], 'steel', [0, 0, -.281], [0, 0, 0], .016, .006)
  animate(model, head, [1, 0, 0], q => .155 * gesture(q, .13, .38, .63, .89))
  return model
}
