/** Original, self-contained résumé sculpture GLBs with standard articulated animation. */
import * as THREE from 'three'
import { buildAiVenture } from './resume-sculptures/plate-camera.mjs'
import { buildVenture } from './resume-sculptures/merchant-balance.mjs'
import { cabinetSurface } from './resume-sculptures/cabinet-geometry.mjs'
import { buildChegg, buildVoid } from './resume-sculptures/evidence-voice.mjs'
import { buildInternship, buildCreative } from './resume-sculptures/time-trace.mjs'
import { buildSapien } from './resume-sculptures/audience-optics.mjs'
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
  silver: new THREE.MeshStandardMaterial({ color: 0xaaa69b, metalness: .86, roughness: .34 }),
  pewter: new THREE.MeshStandardMaterial({ color: 0x797b73, metalness: .82, roughness: .40 }),
  graphite: new THREE.MeshStandardMaterial({ color: 0x343630, metalness: .52, roughness: .43 }),
  pearl: new THREE.MeshStandardMaterial({ color: 0xc9c7bc, metalness: .72, roughness: .30 }),
  paper: new THREE.MeshStandardMaterial({ color: 0x9c998c, metalness: .02, roughness: .76 }),
  sheet: new THREE.MeshStandardMaterial({ color: 0x76786d, metalness: .02, roughness: .76 }),
  ink: new THREE.MeshStandardMaterial({ color: 0x24251f, metalness: .02, roughness: .78 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x5f6259, metalness: .10, roughness: .72 }),
}
// Author a restrained reflective finish directly into every standard GLB,
// retaining broad curved relief under the site's engraved print screen.
for (const [name, finish] of Object.entries(finishes)) { finish.name = name; finish.color.multiplyScalar(.72) }

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
function rounded(parent, name, dimensions, finish, position, rotation = [0, 0, 0], radius = .06, bevel = .025, curves = 4, bevelSegments = 2) {
  return mesh(parent, name, extrusion(roundedShape(dimensions[0], dimensions[1], radius), dimensions[2], bevel, curves, bevelSegments), finish, position, rotation)
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
  model.motion.push({ object, path: 'rotation', axis: new THREE.Vector3(...axis).normalize(), sample, base: object.quaternion.clone() })
}
/** Physical controls and prints travel along their local axis, without rotating the whole object. */
function translate(model, object, axis, sample) {
  model.motion.push({ object, path: 'translation', axis: new THREE.Vector3(...axis).normalize(), sample, base: object.position.clone() })
}
function structure(id, title, concept, duration, pose = [.08, -.12, 0]) {
  const root = new THREE.Group(); root.name = id + '-sculpture'; root.rotation.set(...pose)
  return { id, title, concept, duration, root, motion: [] }
}

/** Recessed openings are real negative space, with a substantial machined lip. */
function pierced(parent, name, dimensions, openings, finish, position = [0, 0, 0], rotation = [0, 0, 0], radius = .08, bevel = .025) {
  const shape = roundedShape(dimensions[0], dimensions[1], radius)
  for (const opening of openings) {
    const [x, y, width, height, corner = .04] = opening
    const left = x - width / 2, right = x + width / 2, bottom = y - height / 2, top = y + height / 2, r = Math.min(corner, width / 4, height / 4)
    const hole = new THREE.Path()
    hole.moveTo(left + r, bottom); hole.quadraticCurveTo(left, bottom, left, bottom + r)
    hole.lineTo(left, top - r); hole.quadraticCurveTo(left, top, left + r, top)
    hole.lineTo(right - r, top); hole.quadraticCurveTo(right, top, right, top - r)
    hole.lineTo(right, bottom + r); hole.quadraticCurveTo(right, bottom, right - r, bottom)
    hole.closePath(); shape.holes.push(hole)
  }
  return mesh(parent, name, extrusion(shape, dimensions[2], bevel, 7), finish, position, rotation)
}
const cycle = q => .5 - .5 * Math.cos(TAU * q)

const builders = { chegg: () => buildChegg(sculptureGeometry), sapien: () => buildSapien(sculptureGeometry), void: () => buildVoid(sculptureGeometry), 'internship-deadlines': () => buildInternship(sculptureGeometry), 'creative-trace': () => buildCreative(sculptureGeometry), 'venture-labs': () => buildVenture(sculptureGeometry), 'ai-venture': () => buildAiVenture(sculptureGeometry) }

/** Batch static descendants in their nearest moving part's space, preserving pivots. */
function batchFixedMeshes(anchor, movingParts) {
  const buckets = new Map()
  const visit = (object, transform) => {
    for (const child of [...object.children]) {
      child.updateMatrix()
      const relative = transform.clone().multiply(child.matrix)
      if (child instanceof THREE.Mesh) {
        const bucket = buckets.get(child.material) ?? []
        bucket.push({ object: child, transform: relative }); buckets.set(child.material, bucket)
      } else if (movingParts.has(child)) batchFixedMeshes(child, movingParts)
      else visit(child, relative)
    }
  }
  visit(anchor, new THREE.Matrix4())
  for (const [material, meshes] of buckets) {
    const geometries = meshes.map(({ object, transform }) => {
      const geometry = object.geometry.clone().applyMatrix4(transform)
      for (const attribute of Object.keys(geometry.attributes)) if (!['position', 'normal'].includes(attribute)) geometry.deleteAttribute(attribute)
      if (!geometry.index) geometry.setIndex(Array.from({ length: geometry.getAttribute('position').count }, (_, i) => i))
      return geometry
    })
    const merged = mergeGeometries(geometries, false)
    if (!merged) throw new Error('Could not batch fixed sculpture castings')
    geometries.forEach(item => item.dispose())
    meshes.forEach(({ object }) => { object.removeFromParent(); object.geometry.dispose() })
    const combined = new THREE.Mesh(cabinetSurface(merged, material), material); combined.name = anchor.name + '-' + material.name + '-castings'; anchor.add(combined)
  }
}

/** Drop only zero-area source triangles, compact unused vertices, normalize normals. */
function cleanGeometry(source, name) {
  const position = source.getAttribute('position'), normal = source.getAttribute('normal'), color = source.getAttribute('color'), input = source.index?.array ?? Array.from({ length: position.count }, (_, i) => i)
  const kept = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  for (let i = 0; i < input.length; i += 3) {
    a.fromBufferAttribute(position, input[i]); b.fromBufferAttribute(position, input[i + 1]); c.fromBufferAttribute(position, input[i + 2])
    if (b.sub(a).cross(c.sub(a)).lengthSq() > 1e-16) kept.push(input[i], input[i + 1], input[i + 2])
  }
  const remap = new Map(), ps = [], ns = [], cs = [], ids = []
  for (const original of kept) {
    let index = remap.get(original)
    if (index === undefined) {
      index = remap.size; remap.set(original, index)
      const p = vec(position.getX(original), position.getY(original), position.getZ(original)), n = vec(normal.getX(original), normal.getY(original), normal.getZ(original))
      if (!p.toArray().every(Number.isFinite) || !n.toArray().every(Number.isFinite) || n.lengthSq() < 1e-12) throw new Error('Invalid generated position or normal: ' + name + ' vertex ' + original + ' normal ' + n.toArray())
      ps.push(...p.toArray()); ns.push(...n.normalize().toArray())
      if (color) cs.push(...[color.getX(original), color.getY(original), color.getZ(original)].map(value => Math.round(value * 255)))
    }
    ids.push(index)
  }
  return { position: new Float32Array(ps), normal: new Float32Array(ns), color: color ? new Uint8Array(cs) : null, index: remap.size > 65535 ? new Uint32Array(ids) : new Uint16Array(ids) }
}

export function sculptDocument(model) {
  batchFixedMeshes(model.root, new Set(model.motion.map(motion => motion.object)))
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
      const primitive = document.createPrimitive().setAttribute('POSITION', position).setAttribute('NORMAL', normal).setIndices(indices).setMaterial(material)
      if (values.color) primitive.setAttribute('COLOR_0', document.createAccessor(object.name + ' surface patina').setType('VEC3').setArray(values.color).setNormalized(true).setBuffer(buffer))
      node.setMesh(document.createMesh(object.name).addPrimitive(primitive))
    }
    object.children.forEach(child => add(child, node))
  }
  add(frame, scene)
  const animation = document.createAnimation('idle'), samples = 65
  const time = document.createAccessor('idle time').setType('SCALAR').setArray(new Float32Array(Array.from({ length: samples }, (_, i) => model.duration * i / (samples - 1)))).setBuffer(buffer)
  for (const motion of model.motion) {
    const values = [], path = motion.path ?? 'rotation'
    for (let i = 0; i < samples; i++) {
      const q = i === samples - 1 ? 0 : i / (samples - 1)
      const pose = path === 'translation'
        ? motion.base.clone().addScaledVector(motion.axis, motion.sample(q))
        : motion.base.clone().multiply(new THREE.Quaternion().setFromAxisAngle(motion.axis, motion.sample(q))).normalize()
      values.push(...pose.toArray())
    }
    const output = document.createAccessor(motion.object.name + ' ' + path).setType(path === 'translation' ? 'VEC3' : 'VEC4').setArray(new Float32Array(values)).setBuffer(buffer)
    const sampler = document.createAnimationSampler().setInput(time).setOutput(output).setInterpolation('LINEAR')
    animation.addSampler(sampler).addChannel(document.createAnimationChannel().setTargetNode(nodeMap.get(motion.object)).setTargetPath(path).setSampler(sampler))
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
  let triangles = 0, vertices = 0, draws = 0, minimumTriangleArea = Infinity, normalError = 0
  const a = vec(0, 0, 0), b = vec(0, 0, 0), c = vec(0, 0, 0)
  gltf.scene.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return
    const ps = node.geometry.getAttribute('position'), ns = node.geometry.getAttribute('normal'), indices = node.geometry.index
    draws++; vertices += ps.count; triangles += indices.count / 3
    if (!ps.array.every(Number.isFinite) || !ns.array.every(Number.isFinite)) throw new Error(id + ': nonfinite geometry')
    for (let i = 0; i < ns.count; i++) normalError = Math.max(normalError, Math.abs(a.fromBufferAttribute(ns, i).length() - 1))
    for (let i = 0; i < indices.count; i += 3) {
      a.fromBufferAttribute(ps, indices.getX(i)); b.fromBufferAttribute(ps, indices.getX(i + 1)); c.fromBufferAttribute(ps, indices.getX(i + 2))
      minimumTriangleArea = Math.min(minimumTriangleArea, b.sub(a).cross(c.sub(a)).length() / 2)
    }
  })
  if (normalError > .0001 || minimumTriangleArea <= 1e-9 || triangles > 25000 || bytes.byteLength > 800000 || draws > 12) throw new Error(id + ': geometry/resource budget failed ' + JSON.stringify({ normalError, minimumTriangleArea, triangles, draws, bytes: bytes.byteLength }))
  const mixer = new THREE.AnimationMixer(gltf.scene); mixer.clipAction(clip).play()
  const envelope = new THREE.Box3(), sampleBounds = [], animatedNodes = new Set()
  const initial = new Map()
  for (const track of clip.tracks) {
    const name = track.name.slice(0, track.name.lastIndexOf('.')), node = gltf.scene.getObjectByName(name)
    if (!node || name === 'display-frame' || name === id + '-sculpture') throw new Error(id + ': animation must articulate a named part')
    const translation = track.name.endsWith('.position'), components = translation ? 3 : 4
    initial.set(name, { translation, pose: translation ? node.position.clone() : node.quaternion.clone() })
    const values = track.values
    if (!values.every(Number.isFinite) || values.slice(0, components).some((value, i) => Math.abs(value - values[values.length - components + i]) > 1e-6)) throw new Error(id + ': nonfinite or discontinuous animation')
  }
  for (let i = 0; i <= 64; i++) {
    mixer.setTime(clip.duration * i / 64); gltf.scene.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(gltf.scene); envelope.union(bounds)
    if (i % 8 === 0) sampleBounds.push({ time: clip.duration * i / 64, min: bounds.min.toArray(), max: bounds.max.toArray() })
    for (const [name, initialPose] of initial) {
      const node = gltf.scene.getObjectByName(name)
      if (initialPose.translation ? node.position.distanceTo(initialPose.pose) > .012 : node.quaternion.angleTo(initialPose.pose) > .04) animatedNodes.add(name)
    }
  }
  if (animatedNodes.size !== initial.size) throw new Error(id + ': a declared physical part has no visible travel')
  mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene)
  const materials = new Set()
  gltf.scene.traverse(node => { if (node instanceof THREE.Mesh) { node.geometry.dispose(); for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material) } })
  for (const material of materials) material.dispose()
  return { triangles, vertices, draws, minimumTriangleArea, maximumNormalLengthError: normalError, bounds: sampleBounds[0], animationBounds: { min: envelope.min.toArray(), max: envelope.max.toArray() }, sampleBounds, clips: [{ name: clip.name, duration: clip.duration, articulatedNodes: [...animatedNodes].sort() }], validation: { errors: 0, warnings: 0 } }
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
/** Shared modeling contract; joints retain their local pivots through batching. */
export const sculptureGeometry = { THREE, TAU, gaussian, vec, finishes, mesh, joint, roundedShape, extrusion, rounded, ring, rod, lathe, solidSheet, animate, translate, structure, pierced, cycle }

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7)
  await buildResumeSculptures(only ? only.split(',') : IDS)
}
