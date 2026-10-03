import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Document, NodeIO } from '@gltf-transform/core'
import validator from 'gltf-validator'

// Self-contained geometry derived from the original Threshold builder. The new
// asset has a thinner optical bezel and preserves its opening aspect ratio.
const assetURL = new URL('../public/landing/threshold-lens.glb', import.meta.url)
const receiptURL = new URL('../evidence/landing-studio-20261003/', import.meta.url)
const keys = [[0, [.001, .001, .001]], [.2, [.7, .7, .7]], [.55, [2.2, 2.2, 1.25]], [1, [21, 21, 1.3]]]
const io = new NodeIO()

function geometry(positions, indices) {
  const result = new THREE.BufferGeometry()
  result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  result.setIndex(indices)
  result.computeVertexNormals()
  result.computeBoundingBox()
  return result
}

// Offset contours have corresponding vertices. Rounded corners and subdivided
// straight spans produce a continuous silhouette along the shallow bowed face.
function contour(offset = 0) {
  const width = 1.5 + offset, height = .325 + offset, radius = .24 + offset
  const corners = [[width - radius, height - radius], [-width + radius, height - radius], [-width + radius, -height + radius], [width - radius, -height + radius]]
  const points = []
  for (let side = 0; side < 4; side++) {
    const [cx, cy] = corners[side]
    for (let step = 0; step < 20; step++) {
      const angle = (side * .5 + step / 20 * .5) * Math.PI
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius])
    }
    const angle = (side + 1) * .5 * Math.PI
    const start = [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]
    const [nx, ny] = corners[(side + 1) % 4]
    const end = [nx + Math.cos(angle) * radius, ny + Math.sin(angle) * radius]
    const steps = side % 2 === 0 ? 28 : 4
    for (let step = 0; step < steps; step++) {
      const t = step / steps
      points.push([start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t])
    }
  }
  return points
}

const bow = x => .035 * (1 - (x / 1.59) ** 2)

// Closed profile: inner wall, front bevel, face, outer bevel, rear wall. Indexed
// vertices share smooth normals around both the contour and real 3D bevels.
function frame(profile) {
  const positions = [], indices = [], count = contour().length
  for (const [offset, depth] of profile) {
    for (const [x, y] of contour(offset * .3)) positions.push(x, y, depth * .55 + bow(x))
  }
  for (let p = 0; p < profile.length; p++) {
    const next = (p + 1) % profile.length
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count
      const a = p * count + i, b = p * count + j, c = next * count + j, d = next * count + i
      indices.push(a, c, b, a, d, c)
    }
  }
  return geometry(positions, indices)
}

function opening() {
  // A .009-unit hidden overlap under the inner frame avoids projection cracks.
  const edge = contour(.009), count = edge.length, front = .017 * .55, back = -.055 * .55
  const positions = [0, 0, front + bow(0), 0, 0, back + bow(0)], indices = []
  // Cap/wall vertices remain separate so cap normals do not acquire wall normals.
  for (const z of [front, back, front, back]) for (const [x, y] of edge) positions.push(x, y, z + bow(x))
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count
    indices.push(0, 2 + i, 2 + j, 1, 2 + count + j, 2 + count + i)
    const a = 2 + 2 * count + i, b = 2 + 2 * count + j, c = 2 + 3 * count + j, d = 2 + 3 * count + i
    indices.push(a, c, b, a, d, c)
  }
  return geometry(positions, indices)
}

function checkGeometry(name, shape) {
  const position = shape.getAttribute('position'), normal = shape.getAttribute('normal'), index = shape.getIndex()
  if (!index || index.count % 3 || position.count !== normal.count) throw Error(`${name}: invalid indexed geometry`)
  for (const attribute of [position, normal]) for (const value of attribute.array) if (!Number.isFinite(value)) throw Error(`${name}: non-finite attribute`)
  let minimumTriangleArea = Infinity, maximumNormalLengthError = 0
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  for (let i = 0; i < normal.count; i++) maximumNormalLengthError = Math.max(maximumNormalLengthError, Math.abs(a.fromBufferAttribute(normal, i).length() - 1))
  for (let i = 0; i < index.count; i += 3) {
    for (let j = 0; j < 3; j++) if (index.getX(i + j) < 0 || index.getX(i + j) >= position.count) throw Error(`${name}: index out of bounds`)
    a.fromBufferAttribute(position, index.getX(i)); b.fromBufferAttribute(position, index.getX(i + 1)); c.fromBufferAttribute(position, index.getX(i + 2))
    minimumTriangleArea = Math.min(minimumTriangleArea, b.sub(a).cross(c.sub(a)).length() / 2)
  }
  if (minimumTriangleArea <= 1e-10 || maximumNormalLengthError > 1e-5) throw Error(`${name}: degenerate geometry or normals`)
  return { name, vertices: position.count, triangles: index.count / 3, indexed: true, minimumTriangleArea, maximumNormalLengthError, bounds: { minimum: shape.boundingBox.min.toArray(), maximum: shape.boundingBox.max.toArray(), dimensions: shape.boundingBox.getSize(new THREE.Vector3()).toArray() } }
}

function build() {
  const document = new Document(), buffer = document.createBuffer('Geometry')
  const scene = document.createScene('ThresholdScene'), threshold = document.createNode('Threshold')
  scene.addChild(threshold)
  document.getRoot().setDefaultScene(scene)
  const body = document.createMaterial('Satin pewter bezel').setBaseColorFactor([.48, .50, .53, 1]).setMetallicFactor(.92).setRoughnessFactor(.27)
  const groove = document.createMaterial('Narrow graphite machining groove').setBaseColorFactor([.06, .065, .075, 1]).setMetallicFactor(.72).setRoughnessFactor(.35)
  const lip = document.createMaterial('Polished inner lip').setBaseColorFactor([.64, .65, .66, 1]).setMetallicFactor(.97).setRoughnessFactor(.17)
  const mask = document.createMaterial('Opening mask placeholder').setBaseColorFactor([.02, .02, .02, 1]).setMetallicFactor(0).setRoughnessFactor(1)
  const parts = [
    ['FrameBody', frame([[.014, -.045], [0, -.021], [0, .020], [.006, .032], [.015, .040], [.072, .040], [.084, .032], [.09, .017], [.09, -.028], [.078, -.05], [.021, -.05]]), body],
    ['FrameGroove', frame([[.050, .0405], [.052, .0435], [.056, .0435], [.058, .0405]]), groove],
    ['FrameInnerLip', frame([[0, .022], [0, .033], [.005, .040], [.012, .045], [.019, .043], [.019, .036], [.012, .028]]), lip],
    ['Opening', opening(), mask],
  ]
  const meshes = []
  for (const [name, shape, material] of parts) {
    meshes.push(checkGeometry(name, shape))
    const position = document.createAccessor(`${name} position`).setType('VEC3').setArray(shape.getAttribute('position').array).setBuffer(buffer)
    const normal = document.createAccessor(`${name} normal`).setType('VEC3').setArray(shape.getAttribute('normal').array).setBuffer(buffer)
    const indices = document.createAccessor(`${name} index`).setType('SCALAR').setArray(shape.getIndex().array).setBuffer(buffer)
    const primitive = document.createPrimitive().setAttribute('POSITION', position).setAttribute('NORMAL', normal).setIndices(indices).setMaterial(material)
    threshold.addChild(document.createNode(name).setMesh(document.createMesh(name).addPrimitive(primitive)))
    shape.dispose()
  }
  const time = document.createAccessor('Open time').setType('SCALAR').setArray(new Float32Array(keys.map(key => key[0]))).setBuffer(buffer)
  const scale = document.createAccessor('Open scale').setType('VEC3').setArray(new Float32Array(keys.flatMap(key => key[1]))).setBuffer(buffer)
  const sampler = document.createAnimationSampler().setInput(time).setOutput(scale).setInterpolation('LINEAR')
  const channel = document.createAnimationChannel().setTargetNode(threshold).setTargetPath('scale').setSampler(sampler)
  document.createAnimation('Open').addSampler(sampler).addChannel(channel)
  return { document, meshes }
}

const first = build(), bytes = await io.writeBinary(first.document)
const repeated = await io.writeBinary(build().document)
if (!Buffer.from(bytes).equals(Buffer.from(repeated))) throw Error('Independent builds produced different GLB bytes')
if (bytes.length > 150_000) throw Error(`Asset exceeds 150 KB budget: ${bytes.length}`)
const validation = await validator.validateBytes(bytes, { uri: 'threshold-lens.glb', maxIssues: 100 })
if (validation.issues.numErrors || validation.issues.numWarnings) throw Error(`GLB validation failed: ${JSON.stringify(validation.issues)}`)
const loaded = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
const threshold = loaded.scene.getObjectByName('Threshold'), clip = loaded.animations.find(candidate => candidate.name === 'Open')
const expectedNodes = ['FrameBody', 'FrameGroove', 'FrameInnerLip', 'Opening']
if (!threshold || !clip || clip.duration !== 1 || loaded.animations.length !== 1) throw Error('Runtime hierarchy or clip mismatch')
if (threshold.children.map(node => node.name).join('|') !== expectedNodes.join('|') || threshold.children.some(node => !node.isMesh)) throw Error('Runtime mesh names mismatch')
if (clip.tracks.length !== 1 || clip.tracks[0].name !== 'Threshold.scale') throw Error('Runtime scale channel mismatch')
const mixer = new THREE.AnimationMixer(loaded.scene), action = mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1)
action.clampWhenFinished = true; action.play()
for (const [time, values] of keys) {
  mixer.setTime(time)
  if (threshold.scale.toArray().some((value, index) => Math.abs(value - values[index]) > 1e-5)) throw Error(`Runtime key mismatch at ${time}`)
}
// Test the continuous interpolated track, not only its equal-XY authored keys.
action.reset().play()
let maximumAspectRatioError = 0
for (let i = 0; i <= 1000; i++) {
  mixer.setTime(i / 1000)
  maximumAspectRatioError = Math.max(maximumAspectRatioError, Math.abs(threshold.scale.x / threshold.scale.y - 1))
}
if (maximumAspectRatioError > 1e-7) throw Error('Opening aspect ratio changed during animation')
mixer.stopAllAction(); mixer.uncacheRoot(loaded.scene)
const bounds = new THREE.Box3().setFromObject(loaded.scene)
const report = {
  asset: 'public/landing/threshold-lens.glb', bytes: bytes.length,
  sha256: createHash('sha256').update(bytes).digest('hex'), independentBuildsIdentical: true,
  scene: 'ThresholdScene', root: 'Threshold', children: expectedNodes,
  frameOuterOffset: .027, geometricOpening: [3, .65], maskOverlap: .009, bowDepth: .035,
  bounds: { minimum: bounds.min.toArray(), maximum: bounds.max.toArray(), dimensions: bounds.getSize(new THREE.Vector3()).toArray() },
  meshes: first.meshes, triangles: first.meshes.reduce((sum, mesh) => sum + mesh.triangles, 0), vertices: first.meshes.reduce((sum, mesh) => sum + mesh.vertices, 0),
  animation: { name: 'Open', duration: 1, target: 'Threshold.scale', interpolation: 'LINEAR', keys, maximumAspectRatioError, sampledPositions: 1001 },
  validation: { errors: validation.issues.numErrors, warnings: validation.issues.numWarnings, infos: validation.issues.numInfos, hints: validation.issues.numHints },
  runtimeLoader: 'Three.js GLTFLoader hierarchy/mesh checks and AnimationMixer key/continuous-aspect sampling passed',
}
await mkdir(new URL('../public/landing/', import.meta.url), { recursive: true })
await mkdir(receiptURL, { recursive: true })
await writeFile(assetURL, bytes)
await writeFile(new URL('bezel-validation.json', receiptURL), JSON.stringify(validation, null, 2) + '\n')
await writeFile(new URL('bezel-geometry.json', receiptURL), JSON.stringify(report, null, 2) + '\n')
await writeFile(new URL('bezel-review.md', receiptURL), `# Fine optical bezel\n\nRun: \`node tools/build-landing-bezel.mjs\`.\n\nNew asset: \`public/landing/threshold-lens.glb\`, ${report.bytes} bytes, ${report.vertices} vertices and ${report.triangles} indexed triangles across four meshes. Root \`Threshold\` has \`FrameBody\`, \`FrameGroove\`, \`FrameInnerLip\` and \`Opening\`. All geometry faces +Z and is centered in X/Y. The visor has a 3 × .65 geometric opening, .027-unit outer offset, shallow .035 bow, real front/back bevels, a narrow dark groove and a polished inner lip. The opaque mask overlaps .009 beneath the inner bevel, approximately 3.018 × .668. No textures, external buffers, extensions or network inputs.\n\nThe one-second \`Open\` scale track uses equal X/Y scales throughout; the 1,001-position continuous check reports aspect-ratio error ${report.animation.maximumAspectRatioError}. Authored keys are ${JSON.stringify(keys)}. Z stays at or below 1.3 to avoid the previous depth expansion.\n\nChecks passed: finite positions/normals, normalized normals, index bounds and nonzero triangle areas; Khronos validator ${report.validation.errors} errors/${report.validation.warnings} warnings; actual Three.js loader hierarchy and animation checks; independent reconstruction yields identical GLB bytes. SHA-256: \`${report.sha256}\`. Full mesh bounds/checks are in \`bezel-geometry.json\`; full validator output is in \`bezel-validation.json\`.\n\nOnly this builder, new lens asset and bezel receipts were written. Existing assets and application/prototype files are unchanged. Visual acceptance belongs to root's actual landing rendering.\n`)
console.log(JSON.stringify(report, null, 2))
