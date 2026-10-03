/** Original personal-interest specimens. Run: node tools/build-about-models.mjs [bass|knight|score] */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as THREE from 'three'
import { Document, NodeIO } from '@gltf-transform/core'
import { getBounds, weld } from '@gltf-transform/functions'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import validator from 'gltf-validator'

const output = resolve(import.meta.dirname, '../public/about-objects')
const io = new NodeIO()
const TAU = Math.PI * 2
const Y = new THREE.Vector3(0, 1, 0)
const v = (x, y, z) => new THREE.Vector3(x, y, z)
const styles = {
  ivory: { color: [.79, .77, .71, 1], metal: .06, roughness: .47 },
  silver: { color: [.45, .46, .46, 1], metal: .55, roughness: .33 },
  graphite: { color: [.13, .135, .14, 1], metal: .15, roughness: .49 },
  ink: { color: [.028, .032, .035, 1], metal: .18, roughness: .40 },
  paper: { color: [.88, .86, .80, 1], metal: .02, roughness: .71 },
}
function part(name, material = 'ivory', parent = null, pivot = null, extras = {}) {
  return { name, material, parent, pivot, extras, geometries: [] }
}
function put(p, geometry, position = v(0, 0, 0), rotation = [0, 0, 0], scale = [1, 1, 1]) {
  geometry.scale(...scale)
  geometry.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)))
  geometry.translate(position.x, position.y, position.z)
  geometry.deleteAttribute('uv')
  if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.getAttribute('position').count }, (_, i) => i))
  p.geometries.push(geometry)
}
function tube(p, points, radius = .005, segments = 48, sides = 8, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal')
  put(p, new THREE.TubeGeometry(curve, segments, radius, sides, closed))
}
function rod(p, a, b, radius = .008, sides = 12) {
  const delta = b.clone().sub(a)
  const geometry = new THREE.CylinderGeometry(radius, radius, delta.length(), sides)
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, delta.normalize()))
  put(p, geometry, a.clone().add(b).multiplyScalar(.5))
}
function ellipsoid(p, position, scale, radius = 1, longitude = 24, latitude = 16) {
  put(p, new THREE.SphereGeometry(radius, longitude, latitude), position, [0, 0, 0], scale)
}
function torus(p, radius, thickness, position, rotation = [0, 0, 0], sides = 8, segments = 48) {
  put(p, new THREE.TorusGeometry(radius, thickness, sides, segments), position, rotation)
}
function box(p, dimensions, position, rotation = [0, 0, 0]) {
  put(p, new THREE.BoxGeometry(...dimensions), position, rotation)
}
function extrude(shape, depth, bevel = .004, curveSegments = 18) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel,
    bevelSegments: bevel > 0 ? 2 : 0, curveSegments, steps: 1,
  })
  g.translate(0, 0, -depth / 2)
  return g
}
function warpZ(g, fn) {
  const pos = g.getAttribute('position'), normal = g.getAttribute('normal')
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i)
    const dx = (fn(x + .00001, y) - fn(x - .00001, y)) / .00002
    const dy = (fn(x, y + .00001) - fn(x, y - .00001)) / .00002
    pos.setZ(i, pos.getZ(i) + fn(x, y))
    const n = v(normal.getX(i) - dx * normal.getZ(i), normal.getY(i) - dy * normal.getZ(i), normal.getZ(i)).normalize()
    normal.setXYZ(i, ...n.toArray())
  }
  return g
}
// Split only long interior edges of the plate caps. Bevels, outline rims and
// hole boundaries keep their original samples; adjacent caps share every split.
// This gives the arch real interior geometry instead of warping a flat earcut fan.
function plateCapGrid(geometry, maximumEdge = .12) {
  geometry.deleteAttribute('uv')
  const g = mergeVertices(geometry, .000001)
  geometry.dispose()
  const pos = g.getAttribute('position'), normal = g.getAttribute('normal')
  const positions = Array.from(pos.array), normals = Array.from(normal.array), ids = Array.from(g.index.array)
  const key = (a, b) => a < b ? `${a}:${b}` : `${b}:${a}`
  const caps = new Set(), edges = new Map()
  for (let i = 0; i < ids.length; i += 3) {
    const triangle = ids.slice(i, i + 3)
    if (!triangle.every(a => Math.abs(normal.getZ(a)) > .9999)) continue
    caps.add(i)
    for (let j = 0; j < 3; j++) {
      const a = triangle[j], b = triangle[(j + 1) % 3], edge = key(a, b)
      const old = edges.get(edge)
      if (old) old.count++; else edges.set(edge, { a, b, count: 1 })
    }
  }
  const midpoints = new Map()
  for (const [edge, { a, b, count }] of edges) {
    if (count !== 2 || v(pos.getX(a), pos.getY(a), pos.getZ(a)).distanceTo(v(pos.getX(b), pos.getY(b), pos.getZ(b))) <= maximumEdge) continue
    const midpoint = positions.length / 3
    for (let axis = 0; axis < 3; axis++) {
      positions.push((positions[a * 3 + axis] + positions[b * 3 + axis]) / 2)
      normals.push((normals[a * 3 + axis] + normals[b * 3 + axis]) / 2)
    }
    midpoints.set(edge, midpoint)
  }
  const triangles = []
  for (let i = 0; i < ids.length; i += 3) {
    const [a, b, c] = ids.slice(i, i + 3)
    if (!caps.has(i)) { triangles.push(a, b, c); continue }
    const ab = midpoints.get(key(a, b)), bc = midpoints.get(key(b, c)), ca = midpoints.get(key(c, a))
    const mask = (ab === undefined ? 0 : 1) | (bc === undefined ? 0 : 2) | (ca === undefined ? 0 : 4)
    if (mask === 0) triangles.push(a, b, c)
    if (mask === 1) triangles.push(a, ab, c, ab, b, c)
    if (mask === 2) triangles.push(a, b, bc, a, bc, c)
    if (mask === 4) triangles.push(a, b, ca, ca, b, c)
    if (mask === 3) triangles.push(a, ab, c, ab, bc, c, ab, b, bc)
    if (mask === 5) triangles.push(a, ab, ca, ab, b, c, ab, c, ca)
    if (mask === 6) triangles.push(a, b, ca, b, bc, ca, bc, c, ca)
    if (mask === 7) triangles.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca)
  }
  const refined = new THREE.BufferGeometry()
  refined.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  refined.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  refined.setIndex(triangles)
  g.dispose()
  return refined
}
function tuningGear() {
  const shape = new THREE.Shape()
  for (let i = 0; i < 48; i++) {
    const angle = i / 48 * TAU, radius = i % 4 < 2 ? .023 : .0175
    const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  shape.closePath()
  const axle = new THREE.Path()
  axle.absarc(0, 0, .007, 0, TAU, true)
  shape.holes.push(axle)
  return extrude(shape, .005, .0007, 5)
}
function bassOutline() {
  const s = new THREE.Shape()
  s.moveTo(0, .57)
  s.bezierCurveTo(.18, .57, .20, .51, .27, .43)
  s.bezierCurveTo(.30, .39, .42, .33, .435, .22)
  s.bezierCurveTo(.448, .12, .39, .055, .385, .045)
  s.lineTo(.405, .035)
  s.bezierCurveTo(.29, .025, .244, -.035, .252, -.16)
  s.bezierCurveTo(.257, -.25, .302, -.31, .405, -.32)
  s.lineTo(.382, -.348)
  s.bezierCurveTo(.465, -.40, .545, -.52, .55, -.70)
  s.bezierCurveTo(.557, -.94, .435, -1.13, .245, -1.175)
  s.bezierCurveTo(.17, -1.195, .07, -1.20, 0, -1.20)
  s.bezierCurveTo(-.07, -1.20, -.17, -1.195, -.245, -1.175)
  s.bezierCurveTo(-.435, -1.13, -.557, -.94, -.55, -.70)
  s.bezierCurveTo(-.545, -.52, -.465, -.40, -.382, -.348)
  s.lineTo(-.405, -.32)
  s.bezierCurveTo(-.302, -.31, -.257, -.25, -.252, -.16)
  s.bezierCurveTo(-.244, -.035, -.29, .025, -.405, .035)
  s.lineTo(-.385, .045)
  s.bezierCurveTo(-.39, .055, -.448, .12, -.435, .22)
  s.bezierCurveTo(-.42, .33, -.30, .39, -.27, .43)
  s.bezierCurveTo(-.20, .51, -.18, .57, 0, .57)
  return s
}
function fHole(side) {
  const path = new THREE.Path()
  const M = (x, y) => path.moveTo(side * x, y)
  const B = (...a) => path.bezierCurveTo(side * a[0], a[1], side * a[2], a[3], side * a[4], a[5])
  M(.269, .139)
  B(.221, .149, .220, .215, .268, .225)
  B(.316, .233, .336, .173, .293, .145)
  B(.241, .107, .205, -.019, .220, -.133)
  B(.231, -.209, .264, -.275, .281, -.366)
  B(.287, -.410, .275, -.451, .252, -.486)
  B(.211, -.551, .244, -.603, .291, -.591)
  B(.341, -.579, .336, -.513, .290, -.508)
  B(.320, -.454, .326, -.390, .310, -.326)
  B(.294, -.251, .257, -.177, .249, -.112)
  B(.235, .020, .251, .092, .269, .139)
  return path
}
function doubleBass() {
  const body = part('bass-front', 'ivory', 'bass')
  const back = part('bass-back', 'ivory', 'bass')
  const ribs = part('bass-ribs', 'graphite', 'bass')
  const fittings = part('bass-fittings', 'silver', 'bass')
  const ebony = part('bass-ebony', 'ink', 'bass')
  const bridge = part('bass-bridge', 'ivory', 'bass')
  const binding = part('bass-purfling', 'ink', 'bass')
  const neck = part('bass-neck', 'graphite', 'bass')
  const outline = bassOutline(), samples = outline.getPoints(160)
  const widthAt = y => {
    let width = .01
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1], b = samples[i]
      if ((a.y <= y && b.y >= y) || (b.y <= y && a.y >= y)) {
        if (Math.abs(a.y - b.y) < 1e-10) continue
        width = Math.max(width, Math.abs(a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y)))
      }
    }
    return width
  }
  const arch = (x, y) => {
    const t = THREE.MathUtils.clamp((y + 1.20) / 1.77, 0, 1)
    return .085 * Math.max(0, 1 - (x / widthAt(y)) ** 2) * Math.sin(Math.PI * t) ** .7
  }
  const face = bassOutline()
  face.holes.push(fHole(1), fHole(-1))
  put(body, warpZ(plateCapGrid(extrude(face, .017, .005, 10)), arch), v(0, 0, .135))
  put(back, warpZ(plateCapGrid(extrude(bassOutline(), .021, .006, 12)), (x, y) => -arch(x, y) * .67), v(0, 0, -.135))
  // A real hollow rib ring, with front-only sound holes and an interior shadow cavity.
  const shell = bassOutline(), inner = new THREE.Path()
  const innerPoints = bassOutline().getPoints(12).map(p => new THREE.Vector2(p.x * .971, (p.y + .315) * .976 - .315))
  inner.moveTo(innerPoints[0].x, innerPoints[0].y)
  for (const p of innerPoints.slice(1)) inner.lineTo(p.x, p.y)
  shell.holes.push(inner)
  put(ribs, extrude(shell, .252, .002, 10))
  const innerCavity = bassOutline()
  put(ebony, extrude(innerCavity, .004, 0, 10), v(0, 0, .025), [0, 0, 0], [.96, .96, 1])
  const rim = bassOutline().getSpacedPoints(96).slice(0, -1)
  for (const inset of [.963, .951]) {
    tube(binding, rim.map(p => {
      const x = p.x * inset, y = (p.y + .315) * (inset + .008) - .315
      return v(x, y, .147 + arch(x, y))
    }), .0024, 96, 4, true)
  }
  tube(binding, rim.map(p => {
    const x = p.x * .963, y = (p.y + .315) * .971 - .315
    return v(x, y, -.150 - arch(x, y) * .67)
  }), .0028, 96, 4, true)
  for (const side of [-1, 1]) {
    const notch = v(side * .247, -.205, .135 + arch(side * .247, -.205))
    box(binding, [.022, .004, .005], notch, [0, 0, side * -.21])
  }
  // The neck slopes backward; its carved heel joins a cambered ebony fingerboard.
  const neckShape = new THREE.Shape()
  neckShape.moveTo(-.045, 1.315); neckShape.lineTo(.045, 1.315)
  neckShape.lineTo(.072, .485); neckShape.quadraticCurveTo(.075, .325, 0, .345)
  neckShape.quadraticCurveTo(-.075, .325, -.072, .485); neckShape.closePath()
  put(neck, warpZ(extrude(neckShape, .064, .010, 12), (x, y) => .035 + (1.32 - y) * .15))
  const finger = new THREE.Shape()
  finger.moveTo(-.046, 1.29); finger.lineTo(.046, 1.29)
  finger.lineTo(.074, -.405); finger.quadraticCurveTo(0, -.437, -.074, -.405); finger.closePath()
  put(ebony, warpZ(extrude(finger, .025, .003, 12), (x, y) => .110 + (1.29 - y) * .108 + .011 * Math.max(0, 1 - (x / .08) ** 2)))
  const heelShape = new THREE.Shape()
  heelShape.moveTo(-.075, .51); heelShape.lineTo(.075, .51)
  heelShape.lineTo(.064, .33); heelShape.quadraticCurveTo(0, .275, -.064, .33); heelShape.closePath()
  put(neck, extrude(heelShape, .14, .012, 12), v(0, 0, -.012))
  // Hollow pegbox with mechanical bass tuning pins and a three-dimensional scroll.
  const pegBox = new THREE.Shape()
  pegBox.moveTo(-.055, 1.27); pegBox.lineTo(.055, 1.27)
  pegBox.lineTo(.063, 1.54); pegBox.quadraticCurveTo(0, 1.60, -.063, 1.54); pegBox.closePath()
  const pegHole = new THREE.Path()
  pegHole.moveTo(-.031, 1.315); pegHole.lineTo(.031, 1.315); pegHole.lineTo(.037, 1.49); pegHole.lineTo(-.037, 1.49); pegHole.closePath()
  pegBox.holes.push(pegHole)
  put(neck, extrude(pegBox, .115, .007, 12), v(0, 0, .065))
  box(ebony, [.085, .20, .012], v(0, 1.405, .000))
  for (let i = 0; i < 4; i++) {
    const y = 1.322 + i * .045, side = i % 2 ? -1 : 1
    rod(fittings, v(-.075, y, .067), v(.075, y, .067), .013, 12)
    ellipsoid(fittings, v(side * .105, y, .067), [.021, .034, .012], 1, 16, 10)
    box(fittings, [.006, .046, .071], v(side * .066, y, .065))
    put(fittings, tuningGear(), v(side * .080, y, .067), [0, Math.PI / 2, 0])
    ellipsoid(ebony, v(side * .084, y, .067), [.0015, .004, .004], 1, 10, 6)
    rod(fittings, v(side * .079, y + .028, .037), v(side * .100, y + .028, .037), .0035, 8)
  }
  const scroll = part('bass-scroll', 'ivory', 'bass')
  // A solid volute carries the spiral carving, rather than two floating coils.
  ellipsoid(scroll, v(0, 1.54, .065), [.043, .085, .083], 1, 24, 16)
  for (const side of [-1, 1]) {
    const points = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100, angle = -Math.PI * .7 + t * TAU * 1.35, r = .080 * (1 - t) + .009
      points.push(v(side * (.040 + .009 * Math.sin(t * Math.PI)), 1.54 + r * Math.sin(angle), .065 + r * Math.cos(angle)))
    }
    tube(scroll, points, .008, 64, 6)
    ellipsoid(scroll, v(side * .048, 1.54, .066), [.006, .018, .018], 1, 16, 10)
  }
  // Carved bridge with two feet, arched openings and a rounded four-string crown.
  const bridgeShape = new THREE.Shape()
  bridgeShape.moveTo(-.126, -.478); bridgeShape.lineTo(-.126, -.407)
  bridgeShape.bezierCurveTo(-.116, -.344, -.073, -.318, 0, -.314)
  bridgeShape.bezierCurveTo(.073, -.318, .116, -.344, .126, -.407)
  bridgeShape.lineTo(.126, -.478); bridgeShape.lineTo(.073, -.478)
  bridgeShape.lineTo(.074, -.442); bridgeShape.quadraticCurveTo(0, -.389, -.074, -.442)
  bridgeShape.lineTo(-.073, -.478); bridgeShape.closePath()
  for (const side of [-1, 1]) {
    const opening = new THREE.Path()
    opening.moveTo(side * .085, -.405)
    opening.bezierCurveTo(side * .035, -.399, side * .034, -.356, side * .069, -.350)
    opening.bezierCurveTo(side * .089, -.348, side * .106, -.381, side * .085, -.405)
    bridgeShape.holes.push(opening)
  }
  const heart = new THREE.Path()
  heart.moveTo(0, -.383)
  heart.bezierCurveTo(-.027, -.363, -.018, -.342, 0, -.354)
  heart.bezierCurveTo(.018, -.342, .027, -.363, 0, -.383)
  bridgeShape.holes.push(heart)
  put(bridge, extrude(bridgeShape, .025, .003, 14), v(0, 0, .334))
  for (const side of [-1, 1]) {
    const foot = new THREE.Shape()
    foot.moveTo(-.039, -.008); foot.quadraticCurveTo(0, -.013, .039, -.008)
    foot.lineTo(.030, .007); foot.quadraticCurveTo(0, .015, -.030, .007); foot.closePath()
    put(bridge, extrude(foot, .045, .002, 7), v(side * .097, -.484, .285))
  }
  const tail = new THREE.Shape()
  tail.moveTo(-.105, -.75); tail.quadraticCurveTo(0, -.704, .105, -.75)
  tail.lineTo(.055, -1.05); tail.quadraticCurveTo(0, -1.10, -.055, -1.05); tail.closePath()
  put(ebony, extrude(tail, .038, .007, 12), v(0, 0, .257))
  // Raised saddle and nut give all four strings real bearing points.
  box(ebony, [.09, .010, .029], v(0, 1.281, .192), [0, 0, 0])
  box(ebony, [.105, .017, .023], v(0, -1.164, .181))
  for (const side of [-1, 1]) tube(binding, [v(side * .035, -1.04, .262), v(side * .043, -1.16, .183), v(side * .028, -1.215, .112)], .007, 24, 8)
  ellipsoid(fittings, v(0, -1.22, .020), [.038, .038, .038], 1, 20, 12)
  rod(fittings, v(0, -1.225, .020), v(0, -1.570, .020), .012, 14)
  ellipsoid(ebony, v(0, -1.572, .020), [.018, .022, .018], 1, 16, 10)
  const strings = ['e', 'a', 'd', 'g'].map((name, i) => {
    const x = (i - 1.5) * .041
    const p = part(`string-${name}`, 'silver', 'bass', v(x, .38, .27), { stringIndex: i, articulation: 'lateral string displacement', articulationAxis: [0, 0, 1] })
    const upperX = (i - 1.5) * .025
    const points = [v(x * .90, -.805, .285), v(x * 1.10, -.329, .357 - Math.abs(i - 1.5) * .008), v(upperX, 1.280, .205), v(upperX, 1.325 + i * .041, .085)]
    tube(p, points, [.0039, .0033, .0028, .0024][i], 48, 6)
    ellipsoid(fittings, v(x * .90, -.805, .284), [.009, .009, .009], 1, 12, 8)
    return p
  })
  // Bow hair crosses the bridge strings. The frog is the local animation pivot.
  const bowPivot = v(.79, -.377, .383)
  const bow = part('bow', 'graphite', 'bass', bowPivot, { articulation: 'bow stroke', articulationAxis: [0, 0, 1] })
  const bowHair = part('bow-hair', 'ivory', 'bow')
  const bowMetal = part('bow-metal', 'silver', 'bow')
  tube(bow, [v(-.615, -.395, .387), v(-.49, -.354, .387), v(.05, -.340, .387), v(.57, -.345, .387), v(.85, -.361, .387)], .0095, 72, 8)
  for (let i = 0; i < 5; i++) rod(bowHair, v(-.594, -.401, .379 + i * .003), v(.790, -.401, .379 + i * .003), .0019, 5)
  const frog = new THREE.Shape()
  frog.moveTo(.748, -.410); frog.lineTo(.841, -.410); frog.lineTo(.841, -.367); frog.quadraticCurveTo(.790, -.359, .748, -.367); frog.closePath()
  put(bow, extrude(frog, .040, .003, 8), v(0, 0, .385))
  const tip = new THREE.Shape()
  tip.moveTo(-.613, -.394); tip.lineTo(-.591, -.409); tip.lineTo(-.568, -.407)
  tip.quadraticCurveTo(-.584, -.391, -.588, -.372); tip.quadraticCurveTo(-.608, -.376, -.613, -.394)
  put(bowHair, extrude(tip, .021, .002, 7), v(0, 0, .386))
  box(bowMetal, [.040, .012, .043], v(.766, -.407, .385))
  ellipsoid(bowMetal, v(.790, -.386, .409), [.010, .010, .004], 1, 16, 8)
  rod(bowMetal, v(.840, -.374, .385), v(.898, -.374, .385), .007, 12)
  for (let i = 0; i < 14; i++) torus(bowMetal, .0105, .0018, v(.593 + i * .005, -.347, .387), [0, Math.PI / 2, 0], 5, 14)
  // The nested bow materials share the frog transform rather than independent floating pivots.
  return { groups: [{ name: 'bass' }], parts: [body, back, ribs, fittings, ebony, bridge, binding, neck, scroll, ...strings, bow, bowHair, bowMetal], maxSpan: 3.2 }
}

// Shape-preserving cubic sections keep the horse's silhouette smooth without
// Catmull-Rom overshoot at the brow, muzzle, or narrow poll.
function knightSection(profiles, y) {
  const last = profiles.length - 1
  let i = 0
  while (i < last - 1 && y > profiles[i + 1][0]) i++
  const a = profiles[i], b = profiles[i + 1], span = b[0] - a[0]
  const t = THREE.MathUtils.clamp((y - a[0]) / span, 0, 1)
  return [y, ...a.slice(1).map((value, axis) => {
    const k = axis + 1, slope = (b[k] - a[k]) / span
    const tangent = row => {
      if (row === 0) return (profiles[1][k] - profiles[0][k]) / (profiles[1][0] - profiles[0][0])
      if (row === last) return (profiles[last][k] - profiles[last - 1][k]) / (profiles[last][0] - profiles[last - 1][0])
      const left = (profiles[row][k] - profiles[row - 1][k]) / (profiles[row][0] - profiles[row - 1][0])
      const right = (profiles[row + 1][k] - profiles[row][k]) / (profiles[row + 1][0] - profiles[row][0])
      return left * right > 0 ? 2 * left * right / (left + right) : 0
    }
    const m0 = slope === 0 ? 0 : tangent(i), m1 = slope === 0 ? 0 : tangent(i + 1)
    return (2 * t ** 3 - 3 * t ** 2 + 1) * value + (t ** 3 - 2 * t ** 2 + t) * span * m0
      + (-2 * t ** 3 + 3 * t ** 2) * b[k] + (t ** 3 - t ** 2) * span * m1
  })]
}
function knightClosedSurface(sections, sample, segments = 48) {
  const positions = [], indices = []
  for (const section of sections) for (let col = 0; col < segments; col++) {
    positions.push(...sample(section, col / segments * TAU).toArray())
  }
  for (let row = 0; row < sections.length - 1; row++) for (let col = 0; col < segments; col++) {
    const a = row * segments + col, b = row * segments + (col + 1) % segments, c = a + segments, d = b + segments
    indices.push(a, c, b, b, c, d)
  }
  // Both ends are closed: there are no open loft rims under the pedestal or poll.
  for (const row of [0, sections.length - 1]) {
    const center = new THREE.Vector3()
    for (let col = 0; col < segments; col++) center.add(v(...positions.slice((row * segments + col) * 3, (row * segments + col) * 3 + 3)))
    const cap = positions.length / 3
    positions.push(...center.multiplyScalar(1 / segments).toArray())
    for (let col = 0; col < segments; col++) {
      const a = row * segments + col, b = row * segments + (col + 1) % segments
      if (row === 0) indices.push(cap, a, b); else indices.push(cap, b, a)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals()
  return g
}
function knightSections(profiles, steps = 5) {
  const sections = []
  for (let i = 0; i < profiles.length - 1; i++) for (let j = 0; j < steps; j++) sections.push(knightSection(profiles, THREE.MathUtils.lerp(profiles[i][0], profiles[i + 1][0], j / steps)))
  sections.push(profiles.at(-1))
  return sections
}
function roundedTile(width, depth) {
  const half = width / 2, r = .004, shape = new THREE.Shape()
  shape.moveTo(-half + r, -half); shape.lineTo(half - r, -half)
  shape.quadraticCurveTo(half, -half, half, -half + r); shape.lineTo(half, half - r)
  shape.quadraticCurveTo(half, half, half - r, half); shape.lineTo(-half + r, half)
  shape.quadraticCurveTo(-half, half, -half, half - r); shape.lineTo(-half, -half + r)
  shape.quadraticCurveTo(-half, -half, -half + r, -half)
  return extrude(shape, depth, .002, 2)
}
function chessKnight() {
  const spacing = .28, a1 = v(-3.5 * spacing, 0, 3.5 * spacing)
  const board = part('board-frame', 'graphite', 'board')
  const rim = part('board-rim', 'silver', 'board')
  box(board, [2.4, .070, 2.4], v(0, -.040, 0))
  for (const side of [-1, 1]) {
    box(rim, [.015, .024, 2.38], v(side * 1.188, -.008, 0))
    box(rim, [2.38, .024, .015], v(0, -.008, side * 1.188))
  }
  // Each tile is a native mesh node, with a local center and algebraic name.
  const tiles = []
  for (let rank = 0; rank < 8; rank++) for (let file = 0; file < 8; file++) {
    const name = `tile-${'abcdefgh'[file]}${rank + 1}`, center = v((file - 3.5) * spacing, .014, (3.5 - rank) * spacing)
    const tile = part(name, (file + rank) % 2 === 0 ? 'ink' : 'ivory', 'board', center, { square: name.slice(5), file, rank, center: center.toArray() })
    put(tile, roundedTile(.274, .024), center, [-Math.PI / 2, 0, 0])
    tiles.push(tile)
  }
  const horse = part('knight-carving', 'ivory', 'knight')
  const detail = part('knight-relief', 'graphite', 'knight')
  const trim = part('knight-base-trim', 'silver', 'knight')
  // A denser turned profile gives the foot, scotia, bead and neck collar their
  // own continuous curves rather than a stack of angular cylinders.
  const profile = [
    [.022, .028], [.116, .028], [.131, .033], [.138, .039], [.140, .047], [.138, .056], [.133, .066],
    [.125, .074], [.114, .082], [.113, .087], [.119, .092], [.126, .098], [.126, .104], [.120, .113],
    [.108, .121], [.094, .130], [.083, .141], [.075, .152], [.071, .157],
  ].map(p => new THREE.Vector2(...p))
  put(horse, new THREE.LatheGeometry(profile, 64))
  put(horse, new THREE.CylinderGeometry(.121, .121, .007, 64), v(0, .030, 0))
  torus(trim, .130, .0034, v(0, .074, 0), [Math.PI / 2, 0, 0], 8, 72)
  torus(detail, .119, .0022, v(0, .090, 0), [Math.PI / 2, 0, 0], 6, 64)
  torus(horse, .077, .003, v(0, .147, 0), [Math.PI / 2, 0, 0], 6, 64)

  // One closed carved head/neck surface includes the throat, cheek, jaw,
  // muzzle, forehead and poll. Every profile lists y, back z, front z, width.
  const anatomy = [
    [.144, -.074, .062, .075], [.174, -.095, .061, .075], [.205, -.113, .056, .073],
    [.245, -.129, .048, .070], [.290, -.138, .043, .065], [.340, -.139, .047, .061],
    [.385, -.130, .057, .060], [.418, -.118, .075, .060], [.446, -.100, .133, .058],
    [.465, -.084, .201, .059], [.483, -.073, .226, .063], [.498, -.063, .218, .067],
    [.520, -.050, .178, .071], [.540, -.038, .138, .064], [.558, -.026, .102, .052],
    [.574, -.021, .066, .036], [.583, -.017, .041, .024],
    [.586, -.006, .028, .016], [.588, .004, .018, .007],
  ]
  const gaussian = (y, z, cy, cz, sy, sz) => Math.exp(-(((y - cy) / sy) ** 2) - ((z - cz) / sz) ** 2)
  const cheekOffset = (y, z) =>
    .0100 * gaussian(y, z, .481, .067, .029, .043)
    + .0030 * gaussian(y, z, .552, .068, .008, .029)
    - .0110 * gaussian(y, z, .539, .074, .010, .019)
    - .0120 * gaussian(y, z, .495, .182, .008, .017)
    - .0045 * gaussian(y, z, .464, .159, .0025, .040)
    + .0028 * gaussian(y, z, .458, .168, .003, .032)
    - .0035 * gaussian(y, z, .395, .018, .077, .026)
    + .0020 * gaussian(y, z, .239, .032, .049, .020)
  const bodySample = (section, angle) => {
    const [y, back, front, width] = section
    const z = (front + back) / 2 + Math.sin(angle) * (front - back) / 2
    const radial = Math.cos(angle), x = radial * (width + cheekOffset(y, z))
    return v(x, y, z)
  }
  const sideSurface = (side, y, z, offset = 0) => {
    const [, back, front, width] = knightSection(anatomy, y)
    const t = THREE.MathUtils.clamp((2 * z - front - back) / (front - back), -.9999, .9999)
    return v(side * ((width + cheekOffset(y, z)) * Math.sqrt(1 - t * t) + offset), y, z)
  }
  // Extra rings are concentrated in the sculpted skin. The turned foot and
  // dorsal crest give up redundant samples so this remains below the same cap.
  put(horse, knightClosedSurface(knightSections(anatomy, 5), bodySample, 64))
  for (const side of [-1, 1]) {
    // An inset eye within a real orbital depression, surrounded by carved lids.
    const eye = sideSurface(side, .539, .074, -.0003)
    ellipsoid(detail, eye, [.0027, .0043, .0070], 1, 20, 12)
    const iris = new THREE.TorusGeometry(.0054, .00075, 5, 16)
    iris.scale(.68, 1, 1); iris.rotateY(Math.PI / 2)
    put(horse, iris, eye.clone().add(v(side * .0027, 0, 0)))
    tube(horse, [[.535, .054], [.547, .064], [.548, .078], [.541, .091]].map(([y, z]) => sideSurface(side, y, z, .0010)), .0025, 22, 7)
    tube(horse, [[.535, .055], [.531, .074], [.536, .090]].map(([y, z]) => sideSurface(side, y, z, .0008)), .0017, 18, 6)
    tube(horse, [[.550, .049], [.558, .064], [.553, .084]].map(([y, z]) => sideSurface(side, y, z, .0001)), .0020, 20, 6)
    // Nostrils sink into the same muzzle instead of sitting on top of a sphere.
    const nostril = sideSurface(side, .495, .182, -.0001)
    ellipsoid(detail, nostril, [.0022, .0046, .0086], 1, 20, 12)
    tube(horse, [[.490, .172], [.500, .173], [.501, .184], [.495, .192]].map(([y, z]) => sideSurface(side, y, z, .0005)), .0019, 22, 6)
    // Fine mouth, jaw and tendon engravings follow the actual sculpted skin.
    tube(detail, [[.464, .122], [.463, .148], [.463, .173], [.468, .204]].map(([y, z]) => sideSurface(side, y, z, -.0001)), .0011, 30, 5)
    tube(horse, [[.445, .081], [.457, .109], [.453, .138]].map(([y, z]) => sideSurface(side, y, z, .0001)), .0016, 24, 6)
    tube(horse, [[.228, .035], [.300, .030], [.378, .037], [.434, .062]].map(([y, z]) => sideSurface(side, y, z, -.0007)), .0024, 38, 6)

    // Tapered, closed ears keep a sharp silhouette and a concave inset pinna.
    const earProfiles = [
      [.551, -.003, .023, .029], [.581, -.001, .020, .025], [.611, .002, .014, .018],
      [.638, .004, .008, .010], [.656, .005, .0015, .003],
    ]
    const ear = knightClosedSurface(knightSections(earProfiles, 4), (p, angle) => {
      const x = Math.cos(angle) * p[2], front = Math.max(0, Math.sin(angle))
      return v(x, p[0], p[1] + Math.sin(angle) * p[3] - .004 * gaussian(p[0], x, .607, 0, .030, .012) * front ** 5)
    }, 24)
    // Rotate each ear about its attachment, so the pinna stays joined to the poll.
    ear.translate(0, -.551, 0)
    put(horse, ear, v(side * .038, .551, 0), [0, 0, side * -.12])
    const innerEar = new THREE.Shape()
    innerEar.moveTo(-.008, .590); innerEar.quadraticCurveTo(0, .584, .008, .590)
    innerEar.quadraticCurveTo(.010, .615, 0, .641); innerEar.quadraticCurveTo(-.010, .615, -.008, .590)
    const pinna = warpZ(extrude(innerEar, .0010, .0004, 8), (x, y) => {
      const [, center, width, depth] = knightSection(earProfiles, y)
      const front = Math.sqrt(Math.max(0, 1 - (x / width) ** 2))
      return center + front * depth - .004 * gaussian(y, x, .607, 0, .030, .012) * front ** 5 + .0003
    })
    pinna.translate(0, -.551, 0)
    put(detail, pinna, v(side * .038, .551, 0), [0, 0, side * -.12])
  }
  // A continuous dorsal mane with carved scallops. The pale crest and fine
  // graphite incisions create detail at three-quarter angles without loose rods.
  const maneSections = Array.from({ length: 65 }, (_, i) => {
    const t = i / 64, y = .205 + t * .350, [, back] = knightSection(anatomy, y)
    const width = .035 - .013 * t, depth = .016 - .004 * t
    return [y, back + .004, width, depth, t]
  })
  put(horse, knightClosedSurface(maneSections, (p, angle) => {
    const [y, center, width, depth, t] = p
    const x = Math.cos(angle) * width, outward = Math.max(0, -Math.sin(angle))
    const groove = .0038 * Math.exp(-((Math.sin(t * Math.PI * 13 + (x / width) ** 2 * .42)) ** 2) / .065)
    return v(x, y, center + Math.sin(angle) * (depth - groove * outward))
  }, 24))
  for (let i = 1; i <= 12; i++) {
    const t = i / 13, y = .205 + t * .350, width = .035 - .013 * t
    const ridge = Array.from({ length: 9 }, (_, j) => {
      const x = (j / 8 * 2 - 1) * width * .90, yy = y - .0036 * (x / width) ** 2
      const [, back] = knightSection(anatomy, yy), depth = .016 - .004 * t
      return v(x, yy, back + .004 - Math.sqrt(1 - (x / width) ** 2) * (depth - .0024))
    })
    tube(detail, ridge, .00085, 20, 5)
  }
  // Geometries are placed at A1, then re-localized under the movable knight parent.
  for (const p of [horse, detail, trim]) for (const g of p.geometries) g.translate(a1.x, 0, a1.z)
  return {
    groups: [{ name: 'board', extras: { squareSize: spacing, files: 'abcdefgh', ranks: '12345678' } }, { name: 'knight', pivot: a1, extras: { initialSquare: 'a1', front: '+Z' } }],
    parts: [board, rim, ...tiles, horse, detail, trim], maxSpan: 2.4,
  }
}

function paperPoint(x, y, offset = 0) {
  let px = x, py = y
  let z = .033 * Math.cos(y * 2) + .036 * (x / .52) ** 2 + .033 * (y / .71) ** 2 + .028 * Math.sin(y * 3 + .3) * Math.sin(x * 2)
  // The diagonal corner rolls forward through almost a quarter turn.
  const distance = Math.max(0, (x + y - .83) / Math.SQRT2)
  if (distance > 0) {
    const radius = .19, angle = distance / radius, retreat = (distance - radius * Math.sin(angle)) / Math.SQRT2
    px -= retreat; py -= retreat; z += radius * (1 - Math.cos(angle))
  }
  const base = v(px, py, z)
  if (offset) base.add(paperNormal(x, y).multiplyScalar(offset))
  return base
}
function paperNormal(x, y) {
  const dx = paperPoint(x + .00001, y).sub(paperPoint(x - .00001, y))
  const dy = paperPoint(x, y + .00001).sub(paperPoint(x, y - .00001))
  return dx.cross(dy).normalize()
}
const paperHalfThickness = .0024
function sheetSurface(front, cols = 40, rows = 56) {
  const positions = [], indices = []
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= cols; col++) {
    const x = -.52 + col / cols * 1.04, y = -.71 + row / rows * 1.42
    positions.push(...paperPoint(x, y, front ? paperHalfThickness : -paperHalfThickness).toArray())
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const a = row * (cols + 1) + col, b = a + 1, c = a + cols + 1, d = c + 1
    if (front) indices.push(a, b, d, a, d, c); else indices.push(a, d, b, a, c, d)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals()
  return g
}
function sheetEdge(cols = 40, rows = 56) {
  const boundary = []
  for (let i = 0; i < cols; i++) boundary.push([-.52 + i / cols * 1.04, -.71])
  for (let i = 0; i < rows; i++) boundary.push([.52, -.71 + i / rows * 1.42])
  for (let i = 0; i < cols; i++) boundary.push([.52 - i / cols * 1.04, .71])
  for (let i = 0; i < rows; i++) boundary.push([-.52, .71 - i / rows * 1.42])
  // A tiny bevel has its own highlight rather than a thick rectangular slab.
  const positions = boundary.flatMap(([x, y]) => [
    ...paperPoint(x, y, paperHalfThickness).toArray(),
    ...paperPoint(x + Math.sign(x) * .0004, y + Math.sign(y) * .0004).toArray(),
    ...paperPoint(x, y, -paperHalfThickness).toArray(),
  ])
  const indices = []
  for (let i = 0; i < boundary.length; i++) for (let bevel = 0; bevel < 2; bevel++) {
    const a = i * 3 + bevel, b = ((i + 1) % boundary.length) * 3 + bevel
    indices.push(a, a + 1, b, b, a + 1, b + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals()
  return g
}
function scoreTube(p, points, radius = .0024, segments = 28, sides = 5) {
  tube(p, points.map(([x, y]) => paperPoint(x, y, .009)), radius, segments, sides)
}
function scoreRibbon(p, points, halfWidth = .005, segments = 32) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y]) => v(x, y, 0)), false, 'centripetal')
  const positions = [], indices = []
  const section = [[1, 0], [.78, 1], [-.78, 1], [-1, 0], [-.78, -1], [.78, -1]]
  for (let row = 0; row <= segments; row++) {
    const t = row / segments, center = curve.getPoint(t), tangent = curve.getTangent(t)
    const width = halfWidth * (.50 + .50 * Math.sin(Math.PI * t) ** .7)
    for (const [across, depth] of section) {
      const x = center.x - tangent.y * across * width, y = center.y + tangent.x * across * width
      positions.push(...paperPoint(x, y, .009 + depth * .0018).toArray())
    }
  }
  for (let row = 0; row < segments; row++) for (let col = 0; col < section.length; col++) {
    const a = row * section.length + col, b = row * section.length + (col + 1) % section.length
    const c = a + section.length, d = b + section.length
    indices.push(a, b, c, b, d, c)
  }
  for (const row of [0, segments]) {
    const center = curve.getPoint(row / segments), cap = positions.length / 3
    positions.push(...paperPoint(center.x, center.y, .009).toArray())
    for (let col = 0; col < section.length; col++) {
      const a = row * section.length + col, b = row * section.length + (col + 1) % section.length
      if (row === 0) indices.push(cap, b, a); else indices.push(cap, a, b)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); g.setIndex(indices); g.computeVertexNormals()
  put(p, g)
}
function scoreGlyph(g) {
  const pos = g.getAttribute('position'), normal = g.getAttribute('normal')
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
    const surface = paperPoint(x, y, z + .009)
    const dx = paperPoint(x + .00001, y).sub(paperPoint(x - .00001, y)).normalize()
    const dy = paperPoint(x, y + .00001).sub(paperPoint(x, y - .00001)).normalize()
    const n = paperNormal(x, y)
    const transformedNormal = dx.multiplyScalar(normal.getX(i)).add(dy.multiplyScalar(normal.getY(i))).add(n.multiplyScalar(normal.getZ(i))).normalize()
    pos.setXYZ(i, ...surface.toArray()); normal.setXYZ(i, ...transformedNormal.toArray())
  }
  return g
}
function embossedNote(p, x, y, stem = true, flag = false) {
  // A thin engraved almond has a precise slanted outline and beveled shoulders.
  const outline = new THREE.Shape()
  outline.moveTo(-.030, 0)
  outline.bezierCurveTo(-.027, .015, -.010, .019, .011, .014)
  outline.bezierCurveTo(.024, .011, .032, .003, .030, -.004)
  outline.bezierCurveTo(.025, -.018, .008, -.020, -.011, -.014)
  outline.bezierCurveTo(-.024, -.011, -.031, -.005, -.030, 0)
  const head = extrude(outline, .0045, .0012, 7)
  head.rotateZ(.28)
  head.translate(x, y, .005)
  put(p, scoreGlyph(head))
  if (stem) {
    scoreTube(p, [[x + .024, y], [x + .024, y + .138]], .0024, 8, 5)
    if (flag) scoreTube(p, [[x + .024, y + .139], [x + .057, y + .118], [x + .063, y + .077], [x + .047, y + .054]], .0035, 20, 5)
  }
}
function musicalScore() {
  const page = part('score-paper', 'paper', 'score')
  const edge = part('score-paper-edge', 'ivory', 'score')
  const notation = part('score-notation', 'ink', 'score')
  put(page, sheetSurface(true)); put(page, sheetSurface(false)); put(edge, sheetEdge())
  const centers = [.36, .00, -.36]
  for (const cy of centers) {
    for (let line = -2; line <= 2; line++) {
      const y = cy + line * .036
      scoreTube(notation, [[-.465, y], [-.31, y], [0, y], [.31, y], [.465, y]], .0021, 32, 5)
    }
    for (const x of [-.463, .456]) scoreTube(notation, [[x, cy - .073], [x, cy + .073]], .0028, 10, 5)
    // Bass clef: a solid curved hook, large initial dot and paired small dots.
    scoreRibbon(notation, [[-.436, cy + .030], [-.444, cy + .060], [-.420, cy + .080], [-.383, cy + .070], [-.379, cy + .025], [-.403, cy - .030], [-.438, cy - .063]], .0062, 36)
    const clefDot = new THREE.SphereGeometry(1, 14, 8)
    clefDot.scale(.0105, .0105, .005); clefDot.translate(-.436, cy + .032, .002); put(notation, scoreGlyph(clefDot))
    for (const dy of [.050, .014]) {
      const dot = new THREE.SphereGeometry(1, 12, 8)
      dot.scale(.0049, .0049, .004); dot.translate(-.355, cy + dy, .002); put(notation, scoreGlyph(dot))
    }
  }
  const notes = [-.265, -.085, .095, .275].map((x, i) => {
    const y = .36 + [-.054, -.018, .018, .071][i]
    const p = part(`note-${i}`, 'ink', 'score', paperPoint(x, y, .014), { noteIndex: i, originalGenericNotation: true, articulation: 'note lift', articulationAxis: [0, 0, 1] })
    embossedNote(p, x, y)
    return p
  })
  const second = [[-.275, -.054], [-.155, -.018], [-.015, .018], [.125, .036], [.290, -.018]]
  for (let i = 0; i < second.length; i++) embossedNote(notation, ...second[i], true, i === 0 || i === 3)
  scoreRibbon(notation, [[-.131, .120], [.009, .156]], .005, 12)
  const third = [[-.275, -.36 + .054], [-.095, -.36 + .018], [.085, -.36 - .018], [.275, -.36 - .054]]
  for (let i = 0; i < third.length; i++) embossedNote(notation, ...third[i], true, i === 1)
  scoreTube(notation, [[.443, -.434], [.443, -.287]], .0042, 10, 6)
  // A fountain pen rests alongside the page. Its nib is the renderer's pen pivot.
  const penPivot = v(.564, -.638, .143)
  const pen = part('pen', 'graphite', 'score', penPivot, { articulation: 'writing gesture', articulationAxis: [0, 0, 1] })
  const metal = part('pen-metal', 'silver', 'pen')
  const nib = part('pen-nib', 'silver', 'pen')
  const low = v(.584, -.507, .150), high = v(.750, .482, .190), delta = high.clone().sub(low)
  const axis = delta.clone().normalize(), orientation = new THREE.Quaternion().setFromUnitVectors(Y, axis)
  const length = delta.length()
  const barrelProfile = [[.022, 0], [.025, .018], [.025, .073], [.022, .112], [.020, .185], [.021, .55], [.022, .80], [.023, .84], [.022, 1]].map(([r, t]) => new THREE.Vector2(r, t * length))
  const barrel = new THREE.LatheGeometry(barrelProfile, 32)
  barrel.applyQuaternion(orientation)
  put(pen, barrel, low)
  const nibVector = low.clone().sub(penPivot)
  const nibLength = nibVector.length(), nibOrientation = new THREE.Quaternion().setFromUnitVectors(Y, nibVector.clone().normalize())
  const blank = new THREE.Shape()
  blank.moveTo(0, 0)
  blank.bezierCurveTo(-.008, .012, -.026, .065, -.024, nibLength * .80)
  blank.lineTo(-.021, nibLength); blank.lineTo(.021, nibLength)
  blank.lineTo(.024, nibLength * .80); blank.bezierCurveTo(.026, .065, .008, .012, 0, 0)
  const vent = new THREE.Path(), ventY = nibLength * .66, ventRadius = .0042, slitHalfWidth = .0008
  const ventAngle = Math.acos(slitHalfWidth / ventRadius)
  vent.moveTo(slitHalfWidth, .005); vent.lineTo(slitHalfWidth, ventY - Math.sin(ventAngle) * ventRadius)
  vent.absarc(0, ventY, ventRadius, -ventAngle, Math.PI + ventAngle, false)
  vent.lineTo(-slitHalfWidth, .005); vent.closePath()
  blank.holes.push(vent)
  const nibGeometry = warpZ(plateCapGrid(extrude(blank, .0014, .00045, 10), .020), (x, y) =>
    .004 * Math.max(0, 1 - (x / .025) ** 2) * Math.sin(Math.PI * y / nibLength))
  nibGeometry.applyQuaternion(nibOrientation)
  put(nib, nibGeometry, penPivot)
  const nibPoint = (x, y, z = .0018) => v(x, y, z + .004 * Math.max(0, 1 - (x / .025) ** 2) * Math.sin(Math.PI * y / nibLength)).applyQuaternion(nibOrientation).add(penPivot)
  // The actual split meets a pierced breather hole; paired engraving follows
  // the tapered shoulders and the cap has a true rounded terminal.
  for (const side of [-1, 1]) tube(pen, [nibPoint(side * .006, .040), nibPoint(side * .015, .072), nibPoint(side * .015, nibLength * .87)], .00065, 16, 5)
  for (const t of [.035, .065, .84, .88, .94]) {
    const point = low.clone().lerp(high, t)
    const ring = new THREE.TorusGeometry(t > .8 ? .022 : .025, .0024, 6, 24)
    ring.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(v(0, 0, 1), delta.clone().normalize()))
    put(metal, ring, point)
  }
  const capBase = low.clone().lerp(high, .84)
  rod(pen, capBase, high.clone().add(delta.clone().normalize().multiplyScalar(.037)), .0255, 24)
  const capEnd = new THREE.SphereGeometry(1, 24, 12)
  capEnd.scale(.0255, .008, .0255); capEnd.applyQuaternion(orientation)
  put(metal, capEnd, high.clone().add(axis.clone().multiplyScalar(.037)))
  tube(metal, [high.clone().add(v(0, .018, .026)), high.clone().add(v(.004, -.03, .037)), high.clone().add(v(-.020, -.17, .036)), high.clone().add(v(-.027, -.195, .029))], .004, 28, 7)
  return { groups: [{ name: 'score', extras: { notation: 'Original generic notes for interaction; not a reproduction or attribution to the site owner.' } }], parts: [page, edge, notation, ...notes, pen, metal, nib], maxSpan: 1.6 }
}

function cleanGeometry(g) {
  const pos = g.getAttribute('position'), indices = g.index.array
  const valid = []
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = [indices[i], indices[i + 1], indices[i + 2]].map(index => v(pos.getX(index), pos.getY(index), pos.getZ(index)))
    if (b.sub(a).cross(c.sub(a)).lengthSq() > 1e-18) valid.push(indices[i], indices[i + 1], indices[i + 2])
  }
  g.setIndex(valid)
  return g
}
function documentFor(specimen) {
  const data = specimen.make()
  const parts = data.parts
  const geometries = parts.map(p => {
    if (!p.geometries.length) throw new Error(`Empty component ${p.name}`)
    const g = mergeGeometries(p.geometries, false)
    for (const item of p.geometries) item.dispose()
    if (!g) throw new Error(`Cannot merge ${p.name}`)
    const cleaned = cleanGeometry(g)
    const merged = mergeVertices(cleaned, .000001)
    cleaned.dispose()
    return merged
  })
  const bounds = new THREE.Box3()
  for (const g of geometries) { g.computeBoundingBox(); bounds.union(g.boundingBox) }
  const scale = data.maxSpan / Math.max(...bounds.getSize(new THREE.Vector3()).toArray())
  // Keep the chessboard origin and instrument construction origins; bounds are documented.
  const doc = new Document(), buffer = doc.createBuffer('Original personal interest specimens')
  const scene = doc.createScene(specimen.title)
  doc.getRoot().setDefaultScene(scene)
  doc.getRoot().getAsset().generator = 'Sulayman Bowles · original personal-interest specimens'
  const materials = Object.fromEntries(Object.entries(styles).map(([name, style]) => [name, doc.createMaterial(name).setBaseColorFactor(style.color).setMetallicFactor(style.metal).setRoughnessFactor(style.roughness).setDoubleSided(true)]))
  const nodes = new Map()
  const groupPivots = new Map(data.groups.map(group => [group.name, group.pivot ?? v(0, 0, 0)]))
  for (const group of data.groups) {
    const parentPivot = groupPivots.get(group.parent) ?? v(0, 0, 0)
    nodes.set(group.name, doc.createNode(group.name).setTranslation((group.pivot ?? v(0, 0, 0)).clone().sub(parentPivot).multiplyScalar(scale).toArray()).setExtras(group.extras ?? {}))
  }
  for (const [i, g] of geometries.entries()) {
    const p = parts[i], parentPivot = parts.find(item => item.name === p.parent)?.pivot ?? groupPivots.get(p.parent) ?? v(0, 0, 0)
    const pivot = p.pivot?.clone() ?? parentPivot.clone()
    g.translate(-pivot.x, -pivot.y, -pivot.z)
    g.scale(scale, scale, scale)
    const positions = doc.createAccessor(`${p.name} positions`).setType('VEC3').setArray(g.getAttribute('position').array).setBuffer(buffer)
    const normals = doc.createAccessor(`${p.name} normals`).setType('VEC3').setArray(g.getAttribute('normal').array).setBuffer(buffer)
    const indexArray = g.index.array
    const indices = doc.createAccessor(`${p.name} indices`).setType('SCALAR').setArray(g.getAttribute('position').count > 65535 ? new Uint32Array(indexArray) : new Uint16Array(indexArray)).setBuffer(buffer)
    const primitive = doc.createPrimitive().setAttribute('POSITION', positions).setAttribute('NORMAL', normals).setIndices(indices).setMaterial(materials[p.material])
    const node = doc.createNode(p.name).setMesh(doc.createMesh(p.name).addPrimitive(primitive))
    node.setTranslation(pivot.clone().sub(parentPivot).multiplyScalar(scale).toArray())
    node.setExtras({ ...p.extras, ...(p.pivot ? { articulationPivot: pivot.clone().multiplyScalar(scale).toArray() } : {}) })
    nodes.set(p.name, node)
    g.dispose()
  }
  for (const group of data.groups) (group.parent ? nodes.get(group.parent) : scene).addChild(nodes.get(group.name))
  for (const p of parts) (p.parent ? nodes.get(p.parent) : scene).addChild(nodes.get(p.name))
  return doc
}
async function inspect(path) {
  const bytes = await readFile(path)
  const validation = await validator.validateBytes(new Uint8Array(bytes), { uri: path.split('/').pop(), maxIssues: 100 })
  if (validation.issues.numErrors || validation.issues.numWarnings) throw new Error(`glTF validation failed: ${JSON.stringify(validation.issues)}`)
  const document = await io.read(path)
  let vertices = 0, triangles = 0, degenerateTriangles = 0, minimumNormalLength = Infinity, maximumNormalLength = 0
  for (const mesh of document.getRoot().listMeshes()) for (const primitive of mesh.listPrimitives()) {
    const positions = primitive.getAttribute('POSITION'), normals = primitive.getAttribute('NORMAL'), indices = primitive.getIndices()
    if (!positions || !normals || !indices || positions.getCount() !== normals.getCount() || indices.getCount() % 3) throw new Error('Missing or mismatched triangle attributes')
    const ps = positions.getArray(), ns = normals.getArray(), ids = indices.getArray()
    if (![ps, ns, ids].every(array => array.every(Number.isFinite))) throw new Error('Non-finite mesh values')
    if (!ids.every(id => Number.isInteger(id) && id >= 0 && id < positions.getCount())) throw new Error('Invalid mesh index')
    vertices += positions.getCount(); triangles += indices.getCount() / 3
    for (let i = 0; i < ns.length; i += 3) {
      const length = Math.hypot(ns[i], ns[i + 1], ns[i + 2])
      minimumNormalLength = Math.min(minimumNormalLength, length); maximumNormalLength = Math.max(maximumNormalLength, length)
    }
    for (let i = 0; i < ids.length; i += 3) {
      const [a, b, c] = [ids[i], ids[i + 1], ids[i + 2]].map(id => v(ps[id * 3], ps[id * 3 + 1], ps[id * 3 + 2]))
      if (b.sub(a).cross(c.sub(a)).lengthSq() < 1e-15) degenerateTriangles++
    }
  }
  if (degenerateTriangles || minimumNormalLength < .999 || maximumNormalLength > 1.001) throw new Error('Invalid mesh normals or degenerate triangles')
  if (bytes.byteLength >= 1500000 || triangles > 40000) throw new Error(`Asset exceeds 1.5 MB / 40,000 triangle budget: ${bytes.byteLength} bytes / ${triangles} triangles`)
  if (document.getRoot().listTextures().length || document.getRoot().listExtensionsRequired().length) throw new Error('Unexpected texture or decoder dependency')
  const byName = new Map(document.getRoot().listNodes().map(node => [node.getName(), node]))
  const id = path.split('/').pop().replace('.glb', '')
  const requireNames = names => { for (const name of names) if (!byName.has(name)) throw new Error(`Missing required node ${name}`) }
  if (id === 'bass') {
    requireNames(['bass', 'string-e', 'string-a', 'string-d', 'string-g', 'bow', 'bow-hair', 'bow-metal'])
    if (byName.get('bow-hair').getParentNode() !== byName.get('bow') || byName.get('bow-metal').getParentNode() !== byName.get('bow')) throw new Error('Bow assembly has inconsistent parent transforms')
  }
  if (id === 'knight') {
    requireNames(['board', 'knight', ...Array.from({ length: 64 }, (_, i) => `tile-${'abcdefgh'[i % 8]}${Math.floor(i / 8) + 1}`)])
    const knight = byName.get('knight'), a1 = byName.get('tile-a1').getTranslation()
    if (knight.getTranslation()[0] !== a1[0] || knight.getTranslation()[2] !== a1[2]) throw new Error('Knight initial position does not match A1')
    if (Array.from(byName.values()).filter(n => n.getName().startsWith('tile-')).length !== 64) throw new Error('Board must have exactly 64 tiles')
    for (const name of ['knight-carving', 'knight-relief', 'knight-base-trim']) if (byName.get(name).getParentNode() !== knight) throw new Error('Knight carving is not under its movable parent')
  }
  if (id === 'score') requireNames(['score', 'score-paper', 'note-0', 'note-1', 'note-2', 'note-3', 'pen'])
  const bounds = getBounds(document.getRoot().listScenes()[0])
  const spans = bounds.max.map((value, axis) => value - bounds.min[axis])
  if (!spans.every(value => Number.isFinite(value) && value > 0) || Math.abs(Math.max(...spans) - (id === 'bass' ? 3.2 : id === 'knight' ? 2.4 : 1.6)) > .000001) throw new Error('Incorrect model scale or bounds')
  return {
    bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex'), vertices, triangles,
    meshes: document.getRoot().listMeshes().length, bounds,
    nodes: document.getRoot().listNodes().map(n => ({ name: n.getName(), translation: n.getTranslation(), extras: n.getExtras() })),
    validation: { errors: 0, warnings: 0, degenerateTriangles, minimumNormalLength, maximumNormalLength },
  }
}
const specimens = [
  { id: 'bass', title: 'Double bass and bow', make: doubleBass, description: 'Original carved double bass with conforming interior arch samples, front-only f-hole apertures, hollow ribs, double purfling, ebony bearing saddles, a heart-pierced bridge and curved feet, toothed mechanical tuners, a solid spiral-carved volute, four separate strings and a nested bow with carved ivory tip and metal ferrule.' },
  { id: 'knight', title: 'Knight and board', make: chessKnight, description: 'Original Staunton-inspired knight with a continuously sampled carved head and neck: fuller cheekbones, recessed eye sockets with iris rings, shaped nasal and muzzle anatomy, a narrow incised mouth and raised lower lip, tapered inset ears, deeper scalloped mane, shoulder tendons and a finely turned pedestal. The preserved raised 64-tile board exposes native algebraic square nodes and the original movable A1 knight parent.' },
  { id: 'score', title: 'Score page and pen', make: musicalScore, description: 'Original fine curved sheet with front and back surfaces, a thin beveled edge and a smoothly sampled diagonal corner roll; tapered embossed bass-clef strokes and engraved almond noteheads. Four independent note nodes and a nib-pivot fountain pen retain visitor-created phrase interactions. The turned pen has a curved beveled nib with a real slit and pierced breather hole, paired shoulder engraving, cap rings and a sprung clip. Generic original notation, not the site owner’s composition.' },
]
const selected = new Set(process.argv.slice(2))
for (const id of selected) if (!specimens.some(item => item.id === id)) throw new Error(`Unknown specimen ${id}`)
await mkdir(output, { recursive: true })
const manifestPath = resolve(output, 'manifest.json')
let previous = null
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')) } catch {}
const reports = new Map(previous?.models?.map(item => [item.id, item]) ?? [])
for (const specimen of specimens) {
  if (selected.size && !selected.has(specimen.id)) continue
  const path = resolve(output, `${specimen.id}.glb`), document = documentFor(specimen)
  await document.transform(weld())
  await io.write(path, document)
  const report = await inspect(path)
  reports.set(specimen.id, { id: specimen.id, title: specimen.title, description: specimen.description, path: `about-objects/${specimen.id}.glb`, ...report })
  console.log(`${specimen.id}: ${report.triangles} triangles, ${report.bytes} bytes; validator 0 errors / 0 warnings`)
}
await writeFile(manifestPath, JSON.stringify({
  version: 1, generator: 'tools/build-about-models.mjs',
  ownership: 'All geometry authored procedurally for the personal website; no external model, image or texture inputs.',
  license: 'LicenseRef-Site-Owner', licenseNote: 'Original site assets; the site owner retains rights. No third-party geometry or texture licenses apply.',
  orientation: 'Y up; instrument and score fronts face +Z. Chessboard spans X/Z with A1 at negative X / positive Z. Origins and node pivots are preserved and listed per model.',
  material: 'Texture-free ivory, satin silver, graphite, ink and paper; monochrome tonal contrast survives print shading.',
  animation: 'Renderer-driven articulated named nodes; no embedded animation, texture or decoder dependency. Bow-hair and bow-metal are nested under the frog-pivot bow node.',
  models: [...reports.values()],
}, null, 2) + '\n')
