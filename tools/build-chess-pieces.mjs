/** Bake the playable chess companions once; the browser only clones GLB templates. */
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { Document, NodeIO } from '@gltf-transform/core'
import { weld, getBounds } from '@gltf-transform/functions'
import validator from 'gltf-validator'

export function chessPieceDocument() {
  const doc = new Document(), buffer = doc.createBuffer('Original chess companion templates')
  const scene = doc.createScene('Playable Staunton companions')
  doc.getRoot().setDefaultScene(scene)
  doc.getRoot().getAsset().generator = 'Sulayman Bowles · original chess companions'
  const finishes = {
    body: doc.createMaterial('Ivory body').setBaseColorFactor([.79, .77, .71, 1]).setMetallicFactor(.04).setRoughnessFactor(.48),
    contrast: doc.createMaterial('Graphite detail').setBaseColorFactor([.13, .135, .14, 1]).setMetallicFactor(.04).setRoughnessFactor(.44),
  }
  for (const type of ['p', 'b', 'r', 'q', 'k']) {
    const height = type === 'p' ? .24 : type === 'r' ? .30 : type === 'b' ? .36 : type === 'q' ? .40 : .43
    const groups = { body: [], contrast: [] }
    const put = (geometry, finish = 'body', position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) => {
      geometry.deleteAttribute('uv'); geometry.scale(...scale)
      geometry.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)))
      geometry.translate(...position)
      if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.getAttribute('position').count }, (_, i) => i))
      groups[finish].push(geometry)
    }
    const neck = type === 'p' ? .028 : type === 'r' ? .048 : type === 'b' ? .030 : .032
    // Distinct turned silhouettes: broad rook column, slender bishop shaft,
    // and tall royal shoulders. Rounded foot, scotia and collar share material
    // draws with the carved crown instead of adding per-ring browser meshes.
    const profile = [[0, 0], [.090, 0], [.097, .004], [.101, .011], [.101, .019], [.097, .027], [.088, .033], [.084, .040], [.086, .046], [.095, .052], [.093, .058], [.088, .064], [.077, .077], [.059, .097], [neck + .012, height * .47], [neck, height * .60], [neck + .003, height * .67], [.047, height * .73], [.061, height * .77], [.063, height * .79], [.059, height * .82], [.051, height * .85], [0, height * .85]].map(point => new THREE.Vector2(...point))
    put(new THREE.LatheGeometry(profile, 44))
    put(new THREE.TorusGeometry(.085, .0017, 4, 40), 'contrast', [0, .041, 0], [Math.PI / 2, 0, 0])
    put(new THREE.TorusGeometry(.060, .0013, 4, 32), 'contrast', [0, height * .786, 0], [Math.PI / 2, 0, 0])
    if (type === 'p') {
      put(new THREE.SphereGeometry(.0445, 24, 16), 'body', [0, height * .915, 0])
      put(new THREE.TorusGeometry(.033, .003, 4, 24), 'body', [0, height * .833, 0], [Math.PI / 2, 0, 0])
    }
    if (type === 'b') {
      // The mitre has a genuine open diagonal cut, not a dark box on a sphere.
      const mitre = new THREE.Shape()
      mitre.moveTo(0, -.047)
      mitre.bezierCurveTo(.040, -.044, .052, -.005, .033, .028)
      mitre.lineTo(-.002, .000); mitre.lineTo(-.009, .008); mitre.lineTo(.025, .039)
      mitre.quadraticCurveTo(.010, .060, 0, .064)
      mitre.bezierCurveTo(-.046, .026, -.056, -.026, 0, -.047)
      put(new THREE.ExtrudeGeometry(mitre, { depth: .040, bevelEnabled: true, bevelSize: .005, bevelThickness: .004, bevelSegments: 3, curveSegments: 12 }), 'body', [0, height * .92, -.020])
      put(new THREE.SphereGeometry(.012, 16, 10), 'body', [0, height * 1.09, 0])
    }
    if (type === 'r') {
      const ring = new THREE.Shape()
      ring.absarc(0, 0, .067, 0, Math.PI * 2, false)
      const hollow = new THREE.Path(); hollow.absarc(0, 0, .040, 0, Math.PI * 2, true); ring.holes.push(hollow)
      put(new THREE.ExtrudeGeometry(ring, { depth: .035, bevelEnabled: true, bevelSize: .0015, bevelThickness: .0015, bevelSegments: 2, curveSegments: 12 }), 'body', [0, height * .835, 0], [-Math.PI / 2, 0, 0])
      put(new THREE.CylinderGeometry(.039, .039, .002, 24), 'contrast', [0, height * .850, 0])
      for (let i = 0; i < 6; i++) {
        const angle = i / 6 * Math.PI * 2, half = Math.PI / 9
        const tower = new THREE.Shape()
        tower.absarc(0, 0, .067, angle - half, angle + half, false)
        tower.absarc(0, 0, .041, angle + half, angle - half, true); tower.closePath()
        put(new THREE.ExtrudeGeometry(tower, { depth: .025, bevelEnabled: true, bevelSize: .0012, bevelThickness: .0012, bevelSegments: 1, curveSegments: 6 }), 'body', [0, height * .946, 0], [-Math.PI / 2, 0, 0])
      }
    }
    if (type === 'q') {
      put(new THREE.CylinderGeometry(.057, .038, .050, 32), 'body', [0, height * .90, 0])
      for (let i = 0; i < 8; i++) {
        const angle = i / 8 * Math.PI * 2
        const tooth = new THREE.Shape()
        tooth.moveTo(-.011, 0); tooth.lineTo(.011, 0); tooth.lineTo(.006, .034); tooth.quadraticCurveTo(0, .038, -.006, .034); tooth.closePath()
        put(new THREE.ExtrudeGeometry(tooth, { depth: .008, bevelEnabled: true, bevelSize: .0009, bevelThickness: .0009, bevelSegments: 1, curveSegments: 3 }), 'body', [Math.sin(angle) * .048, height * .916, Math.cos(angle) * .048], [0, angle, 0])
        put(new THREE.SphereGeometry(.009, 12, 8), 'body', [Math.sin(angle) * .048, height * .98, Math.cos(angle) * .048])
      }
      put(new THREE.SphereGeometry(.017, 16, 10), 'body', [0, height * 1.02, 0])
    }
    if (type === 'k') {
      put(new THREE.SphereGeometry(.037, 24, 16), 'body', [0, height * .90, 0])
      const cross = new THREE.Shape()
      cross.moveTo(-.0075, -.032); cross.lineTo(.0075, -.032); cross.lineTo(.0075, -.001)
      cross.lineTo(.0245, -.001); cross.lineTo(.0245, .014); cross.lineTo(.0075, .014)
      cross.lineTo(.0075, .032); cross.lineTo(-.0075, .032); cross.lineTo(-.0075, .014)
      cross.lineTo(-.0245, .014); cross.lineTo(-.0245, -.001); cross.lineTo(-.0075, -.001); cross.closePath()
      put(new THREE.ExtrudeGeometry(cross, { depth: .011, bevelEnabled: true, bevelSize: .0018, bevelThickness: .0018, bevelSegments: 2 }), 'body', [0, height * 1.03, -.0055])
    }
    const root = doc.createNode(`piece-template-${type}`).setExtras({ chessPiece: type, origin: 'base center', units: 'same as about-knight.glb' })
    scene.addChild(root)
    for (const [finish, parts] of Object.entries(groups)) {
      const geometry = mergeGeometries(parts, false), positions = geometry.getAttribute('position'), normals = geometry.getAttribute('normal')
      const valid = []
      for (let i = 0; i < geometry.index.count; i += 3) {
        const indices = [geometry.index.getX(i), geometry.index.getX(i + 1), geometry.index.getX(i + 2)]
        const [a, b, c] = indices.map(index => new THREE.Vector3().fromBufferAttribute(positions, index))
        if (b.sub(a).cross(c.sub(a)).lengthSq() > 1e-15) valid.push(...indices)
      }
      const position = doc.createAccessor().setType('VEC3').setArray(positions.array).setBuffer(buffer)
      const normal = doc.createAccessor().setType('VEC3').setArray(normals.array).setBuffer(buffer)
      const indices = doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(valid)).setBuffer(buffer)
      const primitive = doc.createPrimitive().setAttribute('POSITION', position).setAttribute('NORMAL', normal).setIndices(indices).setMaterial(finishes[finish])
      const name = `piece-${type}-${finish}`
      root.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(primitive)).setExtras({ finish }))
      geometry.dispose(); parts.forEach(part => part.dispose())
    }
  }
  return doc
}

export async function buildChessPieces() {
  const doc = chessPieceDocument(), io = new NodeIO()
  await doc.transform(weld())
  const bytes = await io.writeBinary(doc)
  const validation = await validator.validateBytes(bytes, { uri: 'chess-pieces.glb', maxIssues: 100 })
  if (validation.issues.numErrors || validation.issues.numWarnings) throw new Error(JSON.stringify(validation.issues))
  let triangles = 0, vertices = 0, degenerateTriangles = 0
  for (const mesh of doc.getRoot().listMeshes()) for (const primitive of mesh.listPrimitives()) {
    const position = primitive.getAttribute('POSITION'), normal = primitive.getAttribute('NORMAL'), ids = primitive.getIndices().getArray()
    const ps = position.getArray(), ns = normal.getArray()
    if (![ps, ns, ids].every(array => array.every(Number.isFinite))) throw new Error('Nonfinite chess geometry')
    for (let i = 0; i < ns.length; i += 3) if (Math.abs(Math.hypot(ns[i], ns[i + 1], ns[i + 2]) - 1) > .001) throw new Error('Invalid chess normal')
    for (let i = 0; i < ids.length; i += 3) {
      const [a, b, c] = Array.from(ids.slice(i, i + 3), index => new THREE.Vector3(...ps.slice(index * 3, index * 3 + 3)))
      if (b.sub(a).cross(c.sub(a)).lengthSq() <= 1e-15) degenerateTriangles++
    }
    triangles += ids.length / 3; vertices += position.getCount()
  }
  if (degenerateTriangles || bytes.byteLength > 600000 || triangles > 20000) throw new Error(`Chess GLB exceeds geometry budget: ${bytes.byteLength} bytes / ${triangles} triangles / ${degenerateTriangles} degenerate triangles`)
  const model = { id: 'chess-pieces', path: 'about-objects/chess-pieces.glb', bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex'), triangles, vertices, meshes: doc.getRoot().listMeshes().length, bounds: getBounds(doc.getRoot().getDefaultScene()), validation: { errors: 0, warnings: 0, degenerateTriangles } }
  const directory = resolve(import.meta.dirname, '../public/about-objects')
  await mkdir(directory, { recursive: true }); await writeFile(resolve(directory, 'chess-pieces.glb'), bytes)
  await writeFile(resolve(directory, 'chess-pieces-manifest.json'), JSON.stringify({ version: 1, generator: 'tools/build-chess-pieces.mjs', ownership: 'Original site-owned geometry; no external inputs.', models: [model] }, null, 2) + '\n')
  console.log(JSON.stringify(model))
  return model
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await buildChessPieces()
