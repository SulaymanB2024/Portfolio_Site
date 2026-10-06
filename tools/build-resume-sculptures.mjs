/** Original, self-contained résumé sculpture GLBs with standard articulated animation. */
import * as THREE from 'three'
import { toCreasedNormals, mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Document, NodeIO } from '@gltf-transform/core'
import { weld } from '@gltf-transform/functions'
import validator from 'gltf-validator'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { group as ringPart, machinedRing, channelRing, vec } from './work-models/geometry.mjs'

const TAU = Math.PI * 2
const gaussian = value => Math.exp(-(value * value))
const ROOT = resolve(import.meta.dirname, '..')
const IDS = ['chegg', 'sapien', 'void', 'internship-deadlines', 'creative-trace', 'venture-labs', 'ai-venture']
const finishes = {
  silver: new THREE.MeshStandardMaterial({ color: 0xaaa69b, metalness: .60, roughness: .32 }),
  pewter: new THREE.MeshStandardMaterial({ color: 0x797b73, metalness: .48, roughness: .40 }),
  graphite: new THREE.MeshStandardMaterial({ color: 0x343630, metalness: .20, roughness: .49 }),
  pearl: new THREE.MeshStandardMaterial({ color: 0xc9c7bc, metalness: .25, roughness: .30 }),
}
for (const [name, finish] of Object.entries(finishes)) finish.name = name

function mesh(parent, name, geometry, finish = 'silver', position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, finishes[finish])
  object.name = name; object.position.fromArray(position); object.rotation.set(...rotation)
  parent.add(object); return object
}
function joint(parent, name, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const object = new THREE.Group(); object.name = name
  object.position.fromArray(position); object.rotation.set(...rotation); parent.add(object); return object
}
function roundedShape(width, height, radius = .06) {
  const shape = new THREE.Shape(), w = width / 2, h = height / 2, r = Math.min(radius, w * .45, h * .45)
  shape.moveTo(-w + r, -h); shape.lineTo(w - r, -h); shape.quadraticCurveTo(w, -h, w, -h + r)
  shape.lineTo(w, h - r); shape.quadraticCurveTo(w, h, w - r, h); shape.lineTo(-w + r, h)
  shape.quadraticCurveTo(-w, h, -w, h - r); shape.lineTo(-w, -h + r); shape.quadraticCurveTo(-w, -h, -w + r, -h)
  return shape
}
function extrusion(shape, depth, bevel = .025, curves = 12, bevelSegments = 3) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, steps: 1, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments, curveSegments: curves })
  geometry.translate(0, 0, -depth / 2)
  const smooth = toCreasedNormals(geometry, Math.PI / 4)
  geometry.dispose(); return smooth
}
function rounded(parent, name, dimensions, finish, position, rotation = [0, 0, 0], radius = .06, bevel = .025) {
  return mesh(parent, name, extrusion(roundedShape(dimensions[0], dimensions[1], radius), dimensions[2], bevel), finish, position, rotation)
}
function ring(parent, name, radius, width, depth, finish, position = [0, 0, 0], rotation = [0, 0, 0], grooved = false, segments = 72) {
  const part = ringPart(name, finish)
  ;(grooved ? channelRing : machinedRing)(part, radius, width, depth, 0, TAU, vec(0, 0, 0), [0, 0, 0], segments)
  const geometry = mergeGeometries(part.geometries, false)
  part.geometries.forEach(item => item.dispose())
  return mesh(parent, name, geometry, finish, position, rotation)
}
function rod(parent, name, a, b, radius, finish = 'silver', sides = 12) {
  const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b), delta = to.clone().sub(from)
  const object = mesh(parent, name, new THREE.CylinderGeometry(radius, radius, delta.length(), sides), finish)
  object.position.copy(from).add(to).multiplyScalar(.5)
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize())
  return object
}
function lathe(parent, name, profile, finish, position = [0, 0, 0], rotation = [0, 0, 0], sides = 64) {
  return mesh(parent, name, new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), sides), finish, position, rotation)
}

/** A curved solid folio has a front, back and four closed thickness returns. */
function solidSheet(sample, columns = 30, rows = 18, thickness = .06) {
  const positions = [], indices = [], width = columns + 1, layer = width * (rows + 1)
  for (const side of [0, 1]) for (let j = 0; j <= rows; j++) for (let i = 0; i <= columns; i++) {
    const point = sample(i / columns, j / rows); positions.push(point.x, point.y, point.z - side * thickness)
  }
  const forward = sample(.01, 0).sub(sample(0, 0)).cross(sample(0, .01).sub(sample(0, 0))).z > 0
  const triangle = (a, b, c) => indices.push(...(forward ? [a, b, c] : [a, c, b]))
  for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
    const a = j * width + i, b = a + 1, c = a + width, d = c + 1
    triangle(a, b, d); triangle(a, d, c); triangle(a + layer, d + layer, b + layer); triangle(a + layer, c + layer, d + layer)
  }
  const edges = [Array.from({ length: columns + 1 }, (_, i) => i), Array.from({ length: rows + 1 }, (_, j) => j * width + columns), Array.from({ length: columns + 1 }, (_, i) => rows * width + columns - i), Array.from({ length: rows + 1 }, (_, j) => (rows - j) * width)]
  for (const edge of edges) for (let i = 0; i < edge.length - 1; i++) {
    const a = edge[i], b = edge[i + 1]; triangle(a, a + layer, b + layer); triangle(a, b + layer, b)
  }
  const source = new THREE.BufferGeometry(); source.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); source.setIndex(indices); source.computeVertexNormals()
  const geometry = toCreasedNormals(source, Math.PI / 3); source.dispose(); return geometry
}
function animate(model, object, axis, sample) {
  model.motion.push({ object, axis: new THREE.Vector3(...axis).normalize(), sample, base: object.quaternion.clone() })
}
function structure(id, title, concept, duration, pose = [.08, -.12, 0]) {
  const root = new THREE.Group(); root.name = id + '-sculpture'; root.rotation.set(...pose)
  return { id, title, concept, duration, root, motion: [] }
}

function chegg() {
  const model = structure('chegg', 'Living folio', 'A substantial curved open book. One bound folio turns across the gutter while the two page blocks remain grounded.', 7.2, [.18, -.31, -.025])
  const book = model.root
  for (const sign of [-1, 1]) {
    const sample = (u, v) => vec(sign * (.04 + u * 1.12), (v - .5) * 1.67, .05 + .28 * Math.sin(u * Math.PI / 2) + .025 * Math.sin(v * Math.PI))
    mesh(book, (sign < 0 ? 'left' : 'right') + '-curved-page-block', solidSheet(sample, 30, 18, .19), 'pearl')
    const cover = (u, v) => vec(sign * (.025 + u * 1.18), (v - .5) * 1.78, -.16 + .28 * Math.sin(u * Math.PI / 2))
    mesh(book, (sign < 0 ? 'left' : 'right') + '-rolled-book-cover', solidSheet(cover, 30, 18, .055), 'pewter')
    for (let i = 0; i < 4; i++) {
      const curve = new THREE.CatmullRomCurve3(Array.from({ length: 17 }, (_, j) => vec(sign * 1.162, (j / 16 - .5) * 1.64, .324 - .036 * i + .025 * Math.sin(j / 16 * Math.PI))))
      mesh(book, 'bound-page-edge-' + sign + '-' + i, new THREE.TubeGeometry(curve, 24, .005, 5), 'silver')
    }
  }
  lathe(book, 'rounded-book-spine', [[0, -.88], [.058, -.88], [.074, -.81], [.074, .81], [.058, .88], [0, .88]], 'graphite', [0, 0, -.02], [0, 0, 0], 28)
  const folio = joint(book, 'turning-folio', [.025, 0, .075], [0, -.08, 0])
  mesh(folio, 'thick-living-folio', solidSheet((u, v) => vec(.012 + u * 1.08, (v - .5) * 1.62, .07 + .27 * Math.sin(u * Math.PI / 2) + .08 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI)), 32, 20, .025), 'silver')
  animate(model, folio, [0, 1, 0], q => -2.80 * (.5 - .5 * Math.cos(TAU * q)))
  return model
}

/** Closed portrait surface with a shaped brow, nose, cheek and chin. */
function portraitGeometry(columns = 44, rows = 30) {
  const positions = [], indices = []
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= columns; i++) {
    const theta = i / columns * TAU - Math.PI, phi = -Math.PI / 2 + j / rows * Math.PI
    const y = Math.sin(phi) * .51, width = .32 * (1 - .17 * gaussian((y + .32) / .12)), x = Math.sin(theta) * Math.cos(phi) * width
    let z = Math.cos(theta) * Math.cos(phi) * .33
    const face = Math.exp(-((theta / .72) ** 4))
    const nose = .13 * gaussian((y + .015) / .10) * gaussian(theta / .16)
    const brow = .055 * gaussian((y - .13) / .07) * gaussian(theta / .65)
    const eye = -.055 * gaussian((y - .08) / .048) * gaussian((Math.abs(theta) - .38) / .13)
    const lip = .032 * gaussian((y + .19) / .04) * gaussian(theta / .39)
    const cheek = .055 * gaussian((y + .12) / .12) * gaussian((Math.abs(theta) - .58) / .22)
    const chin = .046 * gaussian((y + .33) / .075) * gaussian(theta / .45)
    z += face * (nose + brow + eye + lip + cheek + chin); positions.push(x, y, z)
  }
  for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
    const a = j * (columns + 1) + i, b = a + 1, c = a + columns + 1, d = c + 1
    indices.push(a, b, c, b, d, c)
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry
}
function sapien() {
  const model = structure('sapien', 'Audience crescent', 'Three cast portrait forms share a composed crescent and gently turn toward one another, expressing attention and comparison.', 8.4, [.04, -.08, 0])
  const base = model.root
  const curve = new THREE.CatmullRomCurve3(Array.from({ length: 31 }, (_, i) => { const x = (i / 30 - .5) * 1.95; return vec(x, -.64, .11 + .27 * (x / .98) ** 2) }))
  mesh(base, 'continuous-crescent-plinth', new THREE.TubeGeometry(curve, 60, .14, 12), 'pewter')
  for (const [i, x] of [-.65, 0, .65].entries()) {
    const y = i === 1 ? .02 : -.07, z = i === 1 ? -.06 : .20, inward = -Math.sign(x) * .31
    const portrait = joint(base, 'portrait-attention-' + i, [x, y, z], [0, inward, 0])
    mesh(portrait, 'cast-portrait-' + i, portraitGeometry(), i === 1 ? 'pewter' : 'silver', [0, .07, 0])
    lathe(portrait, 'portrait-shoulder-' + i, [[0, -.57], [.21, -.57], [.235, -.52], [.20, -.43], [.105, -.34], [.09, -.20], [0, -.20]], 'silver', [0, 0, -.018], [0, 0, 0], 36)
    animate(model, portrait, [0, 1, 0], q => .15 * (Math.sin(TAU * q + i * .7) - Math.sin(i * .7)))
  }
  return model
}

function internship() {
  const model = structure('internship-deadlines', 'Perpetual calendar', 'A cast calendar instrument with a thick indexed day wheel, a grounded cradle, and a living day indicator.', 9.6, [.10, -.16, 0])
  const root = model.root
  rounded(root, 'cast-calendar-foot', [1.54, .17, .64], 'pewter', [0, -1.03, -.09], [0, 0, 0], .09, .035)
  const cradle = new THREE.Shape()
  cradle.moveTo(-.80, -.82); cradle.bezierCurveTo(-1.11, -.43, -1.14, .53, -.73, .91)
  cradle.lineTo(-.61, .81); cradle.bezierCurveTo(-.91, .47, -.90, -.31, -.65, -.66)
  cradle.lineTo(.65, -.66); cradle.bezierCurveTo(.90, -.31, .91, .47, .61, .81)
  cradle.lineTo(.73, .91); cradle.bezierCurveTo(1.14, .53, 1.11, -.43, .80, -.82); cradle.closePath()
  mesh(root, 'solid-calendar-cradle', extrusion(cradle, .28, .03, 14), 'silver', [0, .04, -.21])
  const wheel = joint(root, 'indexed-day-wheel', [0, .10, -.02])
  ring(wheel, 'perpetual-calendar-body', .76, .22, .29, 'pewter', [0, 0, 0], [0, 0, 0], true, 96)
  ring(wheel, 'day-wheel-front-shoulder', .65, .045, .06, 'silver', [0, 0, .19])
  for (let i = 0; i < 31; i++) {
    const a = i / 31 * TAU
    mesh(wheel, 'calendar-day-detent-' + i, extrusion(roundedShape(.032, .087, .008), .035, .004, 2, 1), i % 7 === 0 ? 'graphite' : 'silver', [.76 * Math.sin(a), .76 * Math.cos(a), .18], [0, 0, -a])
  }
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU
    rod(wheel, 'calendar-week-spoke-' + i, [.11 * Math.sin(a), .11 * Math.cos(a), -.01], [.64 * Math.sin(a), .64 * Math.cos(a), -.01], .027, 'silver')
  }
  ring(root, 'calendar-axle-cap', .08, .065, .10, 'graphite', [0, .10, .12], [0, 0, 0], false, 40)
  const indicator = joint(root, 'moving-day-indicator', [0, .10, .20], [0, 0, -.22])
  const hand = new THREE.Shape(); hand.moveTo(-.035, -.11); hand.lineTo(.035, -.11); hand.lineTo(.037, .54); hand.lineTo(.10, .63); hand.lineTo(0, .72); hand.lineTo(-.10, .63); hand.lineTo(-.037, .54); hand.closePath()
  mesh(indicator, 'cast-day-pointer', extrusion(hand, .045, .010, 6), 'pearl')
  animate(model, indicator, [0, 0, 1], q => .50 * Math.sin(TAU * q))
  animate(model, wheel, [0, 0, 1], q => .12 * Math.sin(TAU * q))
  return model
}

function creative() {
  const model = structure('creative-trace', 'Living aperture', 'A substantial photographic lens with a recessed iris. Six fitted metal blades articulate together to open and close the optical pupil.', 7.6, [.08, -.22, 0])
  const root = model.root
  ring(root, 'deep-lens-barrel', .79, .24, .63, 'pewter', [0, 0, -.10], [0, 0, 0], true, 96)
  ring(root, 'rolled-front-lens-rim', .79, .17, .085, 'silver', [0, 0, .28], [0, 0, 0], false, 96)
  ring(root, 'inner-graphite-optical-throat', .645, .040, .33, 'graphite', [0, 0, -.015])
  ring(root, 'rear-lens-seat', .72, .12, .08, 'silver', [0, 0, -.43])
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU, pivot = vec(Math.cos(a) * .61, Math.sin(a) * .61, .10 + i * .004)
    const iris = joint(root, 'iris-blade-pivot-' + i, pivot.toArray())
    const at = (r, angle) => new THREE.Vector2(r * Math.cos(angle) - pivot.x, r * Math.sin(angle) - pivot.y)
    const shape = new THREE.Shape()
    let p = at(.64, a - .10); shape.moveTo(p.x, p.y)
    for (let j = 1; j <= 10; j++) { p = at(.64, a - .10 + j / 10 * .99); shape.lineTo(p.x, p.y) }
    p = at(.23, a + 1.53); shape.lineTo(p.x, p.y)
    p = at(.20, a + .84); shape.quadraticCurveTo(p.x, p.y, ...at(.25, a + .25).toArray())
    shape.closePath()
    mesh(iris, 'fitted-iris-blade-' + i, extrusion(shape, .035, .010, 10), i % 2 ? 'silver' : 'pearl')
    animate(model, iris, [0, 0, 1], q => -.19 * (.5 - .5 * Math.cos(TAU * q)))
  }
  return model
}

function voidSculpture() {
  const model = structure('void', 'Structural knot', 'One continuous thick cast loop holds a smaller nested member. Its articulation reveals the structural relationship without breaking the knot silhouette.', 8.8, [.14, -.23, -.05])
  class KnotCurve extends THREE.Curve {
    getPoint(t, target = new THREE.Vector3()) { const a = t * TAU; return target.set((Math.sin(a) + 2 * Math.sin(2 * a)) * .36, (Math.cos(a) - 2 * Math.cos(2 * a)) * .36, -.29 * Math.sin(3 * a)) }
  }
  mesh(model.root, 'continuous-cast-knot', new THREE.TubeGeometry(new KnotCurve(), 168, .155, 14, true), 'silver')
  const member = joint(model.root, 'nested-structural-member', [0, 0, .015], [.20, -.18, .12])
  ring(member, 'nested-oval-loop', .39, .11, .13, 'pewter', [0, 0, 0], [0, 0, 0], false, 72).scale.set(1.08, .82, 1)
  animate(model, member, [.75, .45, 0], q => .38 * Math.sin(TAU * q))
  return model
}

function venture() {
  const model = structure('venture-labs', 'Cast balance', 'A sculpted commercial balance with a restrained moving beam. Weighted pans remain upright as the beam weighs alternatives.', 8.0, [.035, -.15, 0])
  const root = model.root
  lathe(root, 'cast-balance-foot', [[0, -.98], [.48, -.98], [.53, -.94], [.53, -.89], [.47, -.85], [.23, -.80], [.14, -.70], [0, -.70]], 'pewter', [0, 0, -.055], [0, 0, 0], 64)
  const column = new THREE.Shape(); column.moveTo(-.12, -.77); column.bezierCurveTo(-.11, -.37, -.08, .27, -.18, .53); column.quadraticCurveTo(0, .77, .18, .53); column.bezierCurveTo(.08, .27, .11, -.37, .12, -.77); column.closePath()
  mesh(root, 'tapered-cast-balance-column', extrusion(column, .22, .045, 15), 'silver', [0, 0, -.05])
  const beam = joint(root, 'balance-beam', [0, .56, .08])
  const beamShape = new THREE.Shape(); beamShape.moveTo(-1.08, .015); beamShape.bezierCurveTo(-.65, .16, -.29, .17, 0, .07); beamShape.bezierCurveTo(.29, .17, .65, .16, 1.08, .015); beamShape.lineTo(1.06, -.058); beamShape.bezierCurveTo(.62, .041, .24, .06, 0, -.015); beamShape.bezierCurveTo(-.24, .06, -.62, .041, -1.06, -.058); beamShape.closePath()
  mesh(beam, 'continuous-swelled-balance-beam', extrusion(beamShape, .16, .027, 14), 'silver')
  ring(root, 'balance-bearing', .075, .060, .072, 'graphite', [0, .56, .205], [0, 0, 0], false, 40)
  for (const sign of [-1, 1]) {
    const pan = joint(beam, sign < 0 ? 'left-weighted-pan' : 'right-weighted-pan', [sign * .94, .01, 0])
    lathe(pan, 'cast-weighing-bowl-' + sign, [[0, -.72], [.06, -.72], [.18, -.69], [.28, -.61], [.31, -.56], [.31, -.52], [.285, -.52], [.265, -.56], [.15, -.63], [0, -.65]], 'pewter', [0, 0, 0], [0, 0, 0], 48)
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; rod(pan, 'pan-stay-' + sign + '-' + i, [0, -.02, 0], [.26 * Math.cos(a), -.54, .26 * Math.sin(a)], .013, 'silver', 10) }
    animate(model, pan, [0, 0, 1], q => -.13 * Math.sin(TAU * q))
  }
  animate(model, beam, [0, 0, 1], q => .13 * Math.sin(TAU * q))
  return model
}

function aiVenture() {
  const model = structure('ai-venture', 'Folded light prism', 'Three substantial cast prism faces unfold around a central faceted light core. The volume changes from a closed prism to an open image-making instrument.', 8.6, [.06, -.20, 0])
  const root = model.root
  mesh(root, 'faceted-light-core', new THREE.ConeGeometry(.40, 1.49, 3, 1, false), 'pearl', [0, -.015, 0], [0, Math.PI / 3, 0])
  lathe(root, 'prismatic-cast-foot', [[0, -.86], [.52, -.86], [.57, -.82], [.56, -.76], [.50, -.71], [.29, -.66], [0, -.66]], 'pewter', [0, 0, 0], [0, 0, 0], 6)
  for (let i = 0; i < 3; i++) {
    const angle = i / 3 * TAU
    const radial = joint(root, 'prism-face-axis-' + i, [Math.sin(angle) * .35, -.70, Math.cos(angle) * .35], [0, angle, 0])
    const face = joint(radial, 'folding-prism-face-' + i, [0, 0, 0], [-.05, 0, 0])
    const triangle = new THREE.Shape(); triangle.moveTo(-.50, -.01); triangle.quadraticCurveTo(-.52, .02, -.48, .14); triangle.lineTo(-.055, 1.58); triangle.quadraticCurveTo(0, 1.69, .055, 1.58); triangle.lineTo(.48, .14); triangle.quadraticCurveTo(.52, .02, .50, -.01); triangle.closePath()
    const casting = extrusion(triangle, .14, .032, 10)
    const positions = casting.getAttribute('position')
    for (let j = 0; j < positions.count; j++) positions.setZ(j, positions.getZ(j) - positions.getY(j) * .19)
    casting.computeVertexNormals()
    mesh(face, 'substantial-folded-prism-casting-' + i, casting, i === 1 ? 'silver' : 'pewter')
    animate(model, face, [1, 0, 0], q => -.27 * (.5 - .5 * Math.cos(TAU * q)))
  }
  return model
}

const builders = { chegg, sapien, void: voidSculpture, 'internship-deadlines': internship, 'creative-trace': creative, 'venture-labs': venture, 'ai-venture': aiVenture }

/** Combine fixed castings by finish inside each articulated joint, retaining its pivot. */
function batchFixedMeshes(object) {
  const buckets = new Map()
  for (const child of [...object.children]) {
    if (child instanceof THREE.Mesh) {
      const bucket = buckets.get(child.material) ?? []
      bucket.push(child); buckets.set(child.material, bucket)
    } else batchFixedMeshes(child)
  }
  for (const [material, meshes] of buckets) {
    if (meshes.length < 2) continue
    const geometries = meshes.map(item => {
      item.updateMatrix()
      const geometry = item.geometry.clone().applyMatrix4(item.matrix)
      for (const attribute of Object.keys(geometry.attributes)) if (!['position', 'normal'].includes(attribute)) geometry.deleteAttribute(attribute)
      if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.getAttribute('position').count }, (_, i) => i))
      return geometry
    })
    const merged = mergeGeometries(geometries, false)
    if (!merged) throw new Error('Could not batch fixed sculpture castings')
    geometries.forEach(item => item.dispose())
    meshes.forEach(item => { object.remove(item); item.geometry.dispose() })
    const combined = new THREE.Mesh(merged, material); combined.name = object.name + '-' + material.name + '-castings'; object.add(combined)
  }
}

/** Drop only zero-area source triangles, compact unused vertices, normalize normals. */
function cleanGeometry(source, name) {
  const position = source.getAttribute('position'), normal = source.getAttribute('normal'), input = source.index?.array ?? Array.from({ length: position.count }, (_, i) => i)
  const kept = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  for (let i = 0; i < input.length; i += 3) {
    a.fromBufferAttribute(position, input[i]); b.fromBufferAttribute(position, input[i + 1]); c.fromBufferAttribute(position, input[i + 2])
    if (b.sub(a).cross(c.sub(a)).lengthSq() > 1e-16) kept.push(input[i], input[i + 1], input[i + 2])
  }
  const remap = new Map(), ps = [], ns = [], ids = []
  for (const original of kept) {
    let index = remap.get(original)
    if (index === undefined) {
      index = remap.size; remap.set(original, index)
      const p = vec(position.getX(original), position.getY(original), position.getZ(original)), n = vec(normal.getX(original), normal.getY(original), normal.getZ(original))
      if (!p.toArray().every(Number.isFinite) || !n.toArray().every(Number.isFinite) || n.lengthSq() < 1e-12) throw new Error('Invalid generated position or normal: ' + name + ' vertex ' + original + ' normal ' + n.toArray())
      ps.push(...p.toArray()); ns.push(...n.normalize().toArray())
    }
    ids.push(index)
  }
  return { position: new Float32Array(ps), normal: new Float32Array(ns), index: remap.size > 65535 ? new Uint32Array(ids) : new Uint16Array(ids) }
}

function sculptDocument(model) {
  batchFixedMeshes(model.root)
  model.root.updateWorldMatrix(true, true)
  const bounds = new THREE.Box3().setFromObject(model.root), center = bounds.getCenter(vec(0, 0, 0)), size = bounds.getSize(vec(0, 0, 0))
  const frame = new THREE.Group(); frame.name = 'display-frame'; frame.scale.setScalar(2.5 / Math.max(size.x, size.y, size.z))
  const offset = joint(frame, 'centered-sculpture', center.negate().toArray()); offset.add(model.root)
  const document = new Document(), buffer = document.createBuffer('Embedded sculpture and animation'), scene = document.createScene(model.title)
  document.getRoot().setDefaultScene(scene); document.getRoot().getAsset().generator = 'Sulayman Bowles · original animated résumé sculptures'
  const materialMap = new Map(), nodeMap = new Map()
  const add = (object, parent) => {
    const node = document.createNode(object.name).setTranslation(object.position.toArray()).setRotation(object.quaternion.toArray()).setScale(object.scale.toArray())
    nodeMap.set(object, node); parent.addChild(node)
    if (object instanceof THREE.Mesh) {
      const finish = object.material
      let material = materialMap.get(finish)
      if (!material) { material = document.createMaterial(finish.name).setBaseColorFactor([...finish.color.toArray(), 1]).setMetallicFactor(finish.metalness).setRoughnessFactor(finish.roughness); materialMap.set(finish, material) }
      const values = cleanGeometry(object.geometry, object.name)
      const position = document.createAccessor(object.name + ' positions').setType('VEC3').setArray(values.position).setBuffer(buffer)
      const normal = document.createAccessor(object.name + ' normals').setType('VEC3').setArray(values.normal).setBuffer(buffer)
      const indices = document.createAccessor(object.name + ' indices').setType('SCALAR').setArray(values.index).setBuffer(buffer)
      node.setMesh(document.createMesh(object.name).addPrimitive(document.createPrimitive().setAttribute('POSITION', position).setAttribute('NORMAL', normal).setIndices(indices).setMaterial(material)))
    }
    object.children.forEach(child => add(child, node))
  }
  add(frame, scene)
  const animation = document.createAnimation('idle'), samples = 65
  const time = document.createAccessor('idle time').setType('SCALAR').setArray(new Float32Array(Array.from({ length: samples }, (_, i) => model.duration * i / (samples - 1)))).setBuffer(buffer)
  for (const motion of model.motion) {
    const rotations = []
    for (let i = 0; i < samples; i++) {
      const q = i === samples - 1 ? 0 : i / (samples - 1)
      const rotation = motion.base.clone().multiply(new THREE.Quaternion().setFromAxisAngle(motion.axis, motion.sample(q))).normalize()
      rotations.push(...rotation.toArray())
    }
    const output = document.createAccessor(motion.object.name + ' rotation').setType('VEC4').setArray(new Float32Array(rotations)).setBuffer(buffer)
    const sampler = document.createAnimationSampler().setInput(time).setOutput(output).setInterpolation('LINEAR')
    animation.addSampler(sampler).addChannel(document.createAnimationChannel().setTargetNode(nodeMap.get(motion.object)).setTargetPath('rotation').setSampler(sampler))
  }
  model.root.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose() })
  return document
}

export async function inspectSculpture(bytes, id) {
  const result = await validator.validateBytes(bytes, { uri: id + '.glb', maxIssues: 100 })
  if (result.issues.numErrors || result.issues.numWarnings) throw new Error(id + ': ' + JSON.stringify(result.issues))
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  const clip = gltf.animations.find(clip => clip.name === 'idle')
  if (!clip || clip.tracks.length < 1) throw new Error(id + ': missing articulated idle clip')
  let triangles = 0, vertices = 0, minimumTriangleArea = Infinity, normalError = 0
  const a = vec(0, 0, 0), b = vec(0, 0, 0), c = vec(0, 0, 0)
  gltf.scene.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    const ps = node.geometry.getAttribute('position'), ns = node.geometry.getAttribute('normal'), indices = node.geometry.index
    vertices += ps.count; triangles += indices.count / 3
    if (!ps.array.every(Number.isFinite) || !ns.array.every(Number.isFinite)) throw new Error(id + ': nonfinite geometry')
    for (let i = 0; i < ns.count; i++) normalError = Math.max(normalError, Math.abs(a.fromBufferAttribute(ns, i).length() - 1))
    for (let i = 0; i < indices.count; i += 3) {
      a.fromBufferAttribute(ps, indices.getX(i)); b.fromBufferAttribute(ps, indices.getX(i + 1)); c.fromBufferAttribute(ps, indices.getX(i + 2))
      minimumTriangleArea = Math.min(minimumTriangleArea, b.sub(a).cross(c.sub(a)).length() / 2)
    }
  })
  if (normalError > .0001 || minimumTriangleArea <= 1e-9 || triangles > 25000 || bytes.byteLength > 800000) throw new Error(id + ': geometry/resource budget failed ' + JSON.stringify({ normalError, minimumTriangleArea, triangles, bytes: bytes.byteLength }))
  const mixer = new THREE.AnimationMixer(gltf.scene); mixer.clipAction(clip).play()
  const envelope = new THREE.Box3(), sampleBounds = [], animatedNodes = new Set()
  const initial = new Map()
  for (const track of clip.tracks) {
    const name = track.name.slice(0, track.name.lastIndexOf('.')), node = gltf.scene.getObjectByName(name)
    if (!node || name === 'display-frame' || name === id + '-sculpture') throw new Error(id + ': animation must articulate a named part')
    initial.set(name, node.quaternion.clone())
    const values = track.values
    if (!values.every(Number.isFinite) || values.slice(0, 4).some((value, i) => Math.abs(value - values[values.length - 4 + i]) > 1e-6)) throw new Error(id + ': nonfinite or discontinuous animation')
  }
  for (let i = 0; i <= 64; i++) {
    mixer.setTime(clip.duration * i / 64); gltf.scene.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(gltf.scene); envelope.union(bounds)
    if (i % 8 === 0) sampleBounds.push({ time: clip.duration * i / 64, min: bounds.min.toArray(), max: bounds.max.toArray() })
    for (const [name, rotation] of initial) if (gltf.scene.getObjectByName(name).quaternion.angleTo(rotation) > .04) animatedNodes.add(name)
  }
  if (animatedNodes.size !== initial.size) throw new Error(id + ': a declared articulation has no visible angular travel')
  mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene)
  const materials = new Set()
  gltf.scene.traverse(node => { if (node instanceof THREE.Mesh) { node.geometry.dispose(); for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material) } })
  for (const material of materials) material.dispose()
  return { triangles, vertices, minimumTriangleArea, maximumNormalLengthError: normalError, bounds: sampleBounds[0], animationBounds: { min: envelope.min.toArray(), max: envelope.max.toArray() }, sampleBounds, clips: [{ name: clip.name, duration: clip.duration, articulatedNodes: [...animatedNodes].sort() }], validation: { errors: 0, warnings: 0 } }
}

export async function buildResumeSculptures(selected = IDS) {
  const directory = resolve(ROOT, 'public/resume-sculptures'); await mkdir(directory, { recursive: true })
  let manifest = { version: 1, generator: 'tools/build-resume-sculptures.mjs', ownership: 'Original site-owned sculpture geometry and articulated glTF animation. No external inputs or resources.', models: [] }
  if (selected.length < IDS.length) { try { manifest = JSON.parse(await readFile(resolve(directory, 'manifest.json'), 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error } }
  for (const id of selected) {
    if (!builders[id]) throw new Error('Unknown résumé sculpture: ' + id)
    const model = builders[id](), document = sculptDocument(model)
    await document.transform(weld())
    const bytes = await new NodeIO().writeBinary(document), sha256 = createHash('sha256').update(bytes).digest('hex')
    const stats = await inspectSculpture(bytes, id), path = `resume-sculptures/${id}-${sha256.slice(0, 12)}.glb`
    await writeFile(resolve(ROOT, 'public', path), bytes)
    const record = { id, title: model.title, concept: model.concept, path, sha256, bytes: bytes.byteLength, ...stats }
    manifest.models = manifest.models.filter(entry => entry.id !== id).concat(record)
    console.log(JSON.stringify({ id, path, bytes: bytes.byteLength, triangles: stats.triangles, clips: stats.clips, validation: stats.validation }))
  }
  manifest.models.sort((a, b) => IDS.indexOf(a.id) - IDS.indexOf(b.id))
  await writeFile(resolve(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  if (IDS.every(id => manifest.models.some(record => record.id === id))) {
    const lookup = Object.fromEntries(manifest.models.map(record => [record.id, { path: record.path, title: record.title, description: record.concept, sha256: record.sha256, clips: record.clips, animationBounds: record.animationBounds }]))
    const code = "import type { ResumeChapterId } from './resume-chapters'\n\n/** Generated by tools/build-resume-sculptures.mjs; each model embeds its articulated idle clip. */\nexport const resumeSculptureAssets = " + JSON.stringify(lookup, null, 2) + " satisfies Record<ResumeChapterId, { path: string; title: string; description: string; sha256: string; clips: { name: string; duration: number; articulatedNodes: string[] }[]; animationBounds: { min: number[]; max: number[] } }>\n"
    await writeFile(resolve(ROOT, 'src/personal/editorial/resume-sculpture-assets.ts'), code)
  }
  return manifest
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7)
  await buildResumeSculptures(only ? only.split(',') : IDS)
}
