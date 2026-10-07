/** Preserve the engraved source scan; embed a looping inspection pose in a new GLB. */
import * as THREE from 'three'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { getBounds, prune } from '@gltf-transform/functions'
import draco from 'draco3dgltf'
import validator from 'gltf-validator'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..'), source = resolve(root, 'public/portfolio-models/helmet.glb')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const sourceBytes = await readFile(source), sourceHash = hash(sourceBytes)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco.createDecoderModule(), 'draco3d.encoder': await draco.createEncoderModule() })
const doc = await io.readBinary(new Uint8Array(sourceBytes)), helmet = doc.getRoot().listNodes().find(node => node.getName() === 'Object_2')
if (!helmet?.getMesh()) throw new Error('Original helmet mesh missing')
const quaternion = angles => new THREE.Quaternion().setFromEuler(new THREE.Euler(...angles)).toArray()
helmet.getParentNode()?.removeChild(helmet)
helmet.setTranslation([-2.016, -.06, 1.381]).setRotation(quaternion([-1.601, .068, 2.296])).setScale([.038, .038, .038])
const pose = doc.createNode('engraved-source-pose').setRotation(quaternion([0, -Math.PI / 3.5, -.25])).addChild(helmet)
const scene = doc.createScene('Animated knight study').addChild(pose)
doc.getRoot().setDefaultScene(scene)
for (const previous of doc.getRoot().listScenes()) if (previous !== scene) previous.dispose()
const bounds = getBounds(scene), center = bounds.min.map((value, i) => (value + bounds.max[i]) / 2), extent = Math.max(...bounds.max.map((value, i) => value - bounds.min[i]))
scene.removeChild(pose)
const offset = doc.createNode('engraved-source-centering').setTranslation(center.map(value => -value)).addChild(pose)
const frame = doc.createNode('engraved-source-scale').setScale([2.5 / extent, 2.5 / extent, 2.5 / extent]).addChild(offset)
const joint = doc.createNode('knight-inspection-joint').addChild(frame)
scene.addChild(joint)
const duration = 10.8, samples = 73, times = new Float32Array(samples), rotations = new Float32Array(samples * 4)
for (let i = 0; i < samples; i++) {
  const phase = i / (samples - 1) * Math.PI * 2
  times[i] = i / (samples - 1) * duration
  rotations.set(quaternion([.045 * Math.sin(phase), .26 * Math.sin(phase), .014 * Math.sin(phase * 2)]), i * 4)
}
// Exactly equal endpoints avoid a seam in the standalone looping animation.
rotations.set(rotations.subarray(0, 4), rotations.length - 4)
const buffer = doc.getRoot().listBuffers()[0] ?? doc.createBuffer()
const input = doc.createAccessor('Inspection times').setType('SCALAR').setArray(times).setBuffer(buffer)
const output = doc.createAccessor('Inspection poses').setType('VEC4').setArray(rotations).setBuffer(buffer)
const sampler = doc.createAnimationSampler().setInput(input).setOutput(output).setInterpolation('LINEAR')
doc.createAnimation('idle').addSampler(sampler).addChannel(doc.createAnimationChannel().setTargetNode(joint).setTargetPath('rotation').setSampler(sampler))
doc.getRoot().getAsset().generator = 'Sulayman Bowles · animated inspection study of the preserved Jousting Helmet scan'
doc.getRoot().getAsset().copyright = 'Jousting Helmet by The Royal Armoury, CC BY 4.0. Display pose and idle animation added; source engraving and textures retained.'
joint.setExtras({ credit: 'The Royal Armoury · Jousting Helmet · CC BY 4.0', source: 'https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54', modification: 'Centered display pose and a looping inspection animation. Original engraved geometry and textures retained.' })
await doc.transform(prune({ keepExtras: true }))
const bytes = await io.writeBinary(doc), decoded = await io.readBinary(bytes)
decoded.getRoot().listExtensionsUsed().find(extension => extension.extensionName === KHRDracoMeshCompression.EXTENSION_NAME)?.dispose()
const validation = await validator.validateBytes(await io.writeBinary(decoded), { uri: 'animated-knight.glb', maxIssues: 100 })
if (validation.issues.numErrors) throw new Error(JSON.stringify(validation.issues))
if (hash(await readFile(source)) !== sourceHash) throw new Error('Original knight changed')
const digest = hash(bytes), path = `resume-knight/knight-${digest.slice(0, 12)}.glb`
const directory = resolve(root, 'public/resume-knight'); await mkdir(directory, { recursive: true }); await writeFile(resolve(root, 'public', path), bytes)
const record = { path, sha256: digest, bytes: bytes.byteLength, source: 'public/portfolio-models/helmet.glb', sourceSha256: sourceHash, credit: doc.getRoot().getAsset().copyright, clips: [{ name: 'idle', duration, articulatedNodes: ['knight-inspection-joint'] }], validation: { errors: validation.issues.numErrors, warnings: validation.issues.numWarnings }, sourcePreserved: true }
await writeFile(resolve(directory, 'manifest.json'), JSON.stringify(record, null, 2) + '\n')
await writeFile(resolve(root, 'src/personal/editorial/resume-knight-asset.ts'), `/** Generated by tools/build-resume-knight.mjs; engraved source retained. */\nexport const resumeKnightAsset = ${JSON.stringify(record, null, 2)} as const\n`)
console.log(JSON.stringify({ path, bytes: bytes.byteLength, errors: validation.issues.numErrors, warnings: validation.issues.numWarnings, sourcePreserved: true }))
