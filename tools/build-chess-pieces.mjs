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
      geometry.translate(...position); groups[finish].push(geometry)
    }
    const profile = [[0, 0], [.090, 0], [.101, .010], [.100, .025], [.086, .035], [.085, .045], [.095, .052], [.090, .067], [.067, .087], [.042, .12], [.035, height * .63], [.048, height * .74], [.063, height * .79], [.055, height * .85], [0, height * .85]].map(point => new THREE.Vector2(...point))
    put(new THREE.LatheGeometry(profile, 40))
    put(new THREE.TorusGeometry(.086, .0026, 6, 40), 'contrast', [0, .043, 0], [Math.PI / 2, 0, 0])
    if (type === 'p') put(new THREE.SphereGeometry(.045, 24, 16), 'body', [0, height * .90, 0])
    if (type === 'b') {
      put(new THREE.SphereGeometry(.050, 24, 18), 'body', [0, height * .90, 0], [0, 0, 0], [.75, 1.24, .75])
      put(new THREE.BoxGeometry(.006, .045, .013), 'contrast', [0, height * .94, .034], [0, 0, -.40])
      put(new THREE.SphereGeometry(.012, 16, 10), 'body', [0, height * 1.09, 0])
    }
    if (type === 'r') {
      put(new THREE.CylinderGeometry(.068, .055, .056, 32), 'body', [0, height * .88, 0])
      for (let i = 0; i < 6; i++) {
        const angle = i / 6 * Math.PI * 2
        put(new THREE.BoxGeometry(.029, .028, .020), 'body', [Math.sin(angle) * .055, height * .99, Math.cos(angle) * .055], [0, angle, 0])
      }
    }
    if (type === 'q') {
      put(new THREE.CylinderGeometry(.057, .038, .050, 32), 'body', [0, height * .90, 0])
      for (let i = 0; i < 8; i++) {
        const angle = i / 8 * Math.PI * 2
        put(new THREE.SphereGeometry(.009, 12, 8), 'body', [Math.sin(angle) * .048, height * .98, Math.cos(angle) * .048])
      }
      put(new THREE.SphereGeometry(.017, 16, 10), 'body', [0, height * 1.02, 0])
    }
    if (type === 'k') {
      put(new THREE.SphereGeometry(.037, 24, 16), 'body', [0, height * .90, 0])
      put(new THREE.BoxGeometry(.015, .064, .015), 'body', [0, height * 1.03, 0])
      put(new THREE.BoxGeometry(.049, .015, .015), 'body', [0, height * 1.045, 0])
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
  if (degenerateTriangles || bytes.byteLength > 600000 || triangles > 20000) throw new Error('Chess GLB exceeds geometry budget')
  const model = { id: 'chess-pieces', path: 'about-objects/chess-pieces.glb', bytes: bytes.byteLength, sha256: createHash('sha256').update(bytes).digest('hex'), triangles, vertices, meshes: doc.getRoot().listMeshes().length, bounds: getBounds(doc.getRoot().getDefaultScene()), validation: { errors: 0, warnings: 0, degenerateTriangles } }
  const directory = resolve(import.meta.dirname, '../public/about-objects')
  await mkdir(directory, { recursive: true }); await writeFile(resolve(directory, 'chess-pieces.glb'), bytes)
  await writeFile(resolve(directory, 'chess-pieces-manifest.json'), JSON.stringify({ version: 1, generator: 'tools/build-chess-pieces.mjs', ownership: 'Original site-owned geometry; no external inputs.', models: [model] }, null, 2) + '\n')
  console.log(JSON.stringify(model))
  return model
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await buildChessPieces()
