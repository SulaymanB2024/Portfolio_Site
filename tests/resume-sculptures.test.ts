import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { AnimationMixer, Box3, Matrix4, Mesh, Quaternion, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import validator from 'gltf-validator'
import { resumeSculptureAssets } from '../src/personal/editorial/resume-sculpture-assets.ts'

const manifest = JSON.parse(await readFile(new URL('../public/resume-sculptures/manifest.json', import.meta.url), 'utf8'))
const records = manifest.models as Array<{ id: keyof typeof resumeSculptureAssets; path: string; sha256: string; bytes: number; triangles: number; animationBounds: { min: number[]; max: number[] }; clips: { name: string; duration: number; articulatedNodes: string[] }[] }>

async function fixture(record: typeof records[number]) {
  const bytes = await readFile(new URL('../public/' + record.path, import.meta.url))
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  return { bytes, gltf }
}
function release(scene: any) {
  const materials = new Set<any>()
  scene.traverse((node: any) => {
    if (!(node instanceof Mesh)) return
    node.geometry.dispose()
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) materials.add(material)
  })
  for (const material of materials) material.dispose()
}

test('seven content-addressed sculptures are embedded, standard GLBs with bounded render cost', async () => {
  assert.equal(records.length, 7)
  assert.equal(new Set(records.map(record => record.id)).size, 7)
  assert.deepEqual(Object.keys(resumeSculptureAssets).sort(), records.map(record => record.id).sort())
  for (const record of records) {
    const { bytes, gltf } = await fixture(record)
    try {
      const sha256 = createHash('sha256').update(bytes).digest('hex')
      assert.equal(sha256, record.sha256)
      assert.equal(bytes.byteLength, record.bytes)
      assert(record.path.endsWith('-' + sha256.slice(0, 12) + '.glb'))
      assert.equal(resumeSculptureAssets[record.id].path, record.path)
      assert(bytes.byteLength < 800_000, record.id + ' transfer budget')
      const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString())
      assert(!json.buffers.some((buffer: any) => buffer.uri), 'geometry must be embedded')
      assert(!json.images?.length && !json.textures?.length, 'finish must stand alone without texture fetches')
      assert(!json.extensionsRequired?.length, 'any standard glTF viewer can play the clip')
      const result = await validator.validateBytes(bytes, { maxIssues: 100 })
      assert.equal(result.issues.numErrors, 0, record.id + ' glTF errors')
      assert.equal(result.issues.numWarnings, 0, record.id + ' glTF warnings')
      let triangles = 0, draws = 0
      const a = new Vector3(), b = new Vector3(), c = new Vector3()
      gltf.scene.traverse(node => {
        if (!(node instanceof Mesh)) return
        draws++
        const position = node.geometry.getAttribute('position'), normal = node.geometry.getAttribute('normal'), indices = node.geometry.index!
        triangles += indices.count / 3
        assert(position.array.every(Number.isFinite) && normal.array.every(Number.isFinite))
        for (let i = 0; i < normal.count; i++) assert(Math.abs(a.fromBufferAttribute(normal, i).length() - 1) < 1e-4, record.id + ' unit normals')
        for (let i = 0; i < indices.count; i += 3) {
          a.fromBufferAttribute(position, indices.getX(i)); b.fromBufferAttribute(position, indices.getX(i + 1)); c.fromBufferAttribute(position, indices.getX(i + 2))
          assert(b.sub(a).cross(c.sub(a)).lengthSq() > 4e-18, record.id + ' nonzero triangle area')
        }
      })
      assert.equal(triangles, record.triangles)
      assert(triangles < 25_000, record.id + ' triangle budget')
      assert(draws <= 12, record.id + ' draw budget')
      const dimensions = new Box3().setFromObject(gltf.scene).getSize(new Vector3())
      assert(Math.abs(Math.max(dimensions.x, dimensions.y, dimensions.z) - 2.5) < .001, record.id + ' consistent display scale')
    } finally { release(gltf.scene) }
  }
})

test('idle clips move actual articulated surfaces and return seamlessly while the sculpture frame stays fixed', async () => {
  for (const record of records) {
    const { gltf } = await fixture(record)
    const mixer = new AnimationMixer(gltf.scene)
    try {
      assert.equal(gltf.animations.length, 1)
      const clip = gltf.animations[0]
      assert.equal(clip.name, 'idle')
      assert(clip.duration >= 6 && clip.duration <= 11)
      assert(Math.abs(clip.duration - record.clips[0].duration) < 1e-5)
      const frame = gltf.scene.getObjectByName('display-frame')!
      gltf.scene.updateMatrixWorld(true)
      const framePose = frame.matrixWorld.clone()
      const samples: { name: string; mesh: Mesh; vertices: Vector3[]; baseline?: Vector3[]; moved: boolean }[] = []
      for (const track of clip.tracks) {
        const translation = track.name.endsWith('.position')
        assert(translation || track.name.endsWith('.quaternion'), 'physical parts use standard node translation or rotation')
        const name = track.name.slice(0, track.name.lastIndexOf('.'))
        const part = gltf.scene.getObjectByName(name)!
        assert(part && part !== frame && part.parent, 'clip must target a part rather than the root')
        assert(record.clips[0].articulatedNodes.includes(name))
        assert(track.times[0] === 0 && track.times.at(-1) === clip.duration)
        const values = track.values
        assert(values.every(Number.isFinite), record.id + ' finite motion')
        if (translation) {
          const first = new Vector3().fromArray(values, 0), last = new Vector3().fromArray(values, values.length - 3)
          assert(first.distanceTo(last) < 1e-6, record.id + ' translation loop endpoint continuity')
        } else {
          const first = new Quaternion().fromArray(values, 0).normalize(), last = new Quaternion().fromArray(values, values.length - 4).normalize()
          assert(first.angleTo(last) < 1e-6, record.id + ' rotation loop endpoint continuity')
          for (let i = 0; i < values.length; i += 4) assert(Math.abs(new Quaternion().fromArray(values, i).length() - 1) < 1e-5)
        }
        let surface: Mesh | undefined
        part.traverse(node => { if (!surface && node instanceof Mesh) surface = node })
        assert(surface, name + ' must contain a rendered surface')
        const position = surface!.geometry.getAttribute('position')
        const vertices = Array.from({ length: Math.min(48, position.count) }, (_, i) => new Vector3().fromBufferAttribute(position, Math.floor(i / 48 * position.count)))
        samples.push({ name, mesh: surface!, vertices, moved: false })
      }
      mixer.clipAction(clip).play()
      // Sample the full clip so brief physical actions, such as a shutter press,
      // cannot be missed by a few arbitrary poses.
      for (const fraction of Array.from({ length: 65 }, (_, i) => i / 64)) {
        mixer.setTime(clip.duration * fraction); gltf.scene.updateMatrixWorld(true)
        assert.deepEqual(frame.matrixWorld.toArray(), framePose.toArray(), record.id + ' frame cannot spin as a substitute for articulation')
        for (const sample of samples) {
          const world = sample.vertices.map(vertex => vertex.clone().applyMatrix4(sample.mesh.matrixWorld))
          if (!sample.baseline) sample.baseline = world
          else sample.moved ||= world.some((point, i) => sample.baseline![i].distanceTo(point) > .005)
        }
      }
      assert(samples.every(sample => sample.moved), record.id + ' every declared part must move a real surface')
      mixer.setTime(0); gltf.scene.updateMatrixWorld(true)
      const start = new Map<string, Matrix4>()
      samples.forEach(sample => start.set(sample.name, sample.mesh.matrixWorld.clone()))
      mixer.setTime(clip.duration); gltf.scene.updateMatrixWorld(true)
      samples.forEach(sample => sample.mesh.matrixWorld.elements.forEach((value, i) => assert(Math.abs(value - start.get(sample.name)!.elements[i]) < 1e-5, sample.name + ' visible loop seam')))
    } finally { mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene); release(gltf.scene) }
  }
})

test('exported animation envelopes contain every sampled articulated surface', async () => {
  for (const record of records) {
    const { gltf } = await fixture(record)
    const mixer = new AnimationMixer(gltf.scene), clip = gltf.animations[0], envelope = new Box3()
    const declared = new Box3(new Vector3(...record.animationBounds.min as [number, number, number]), new Vector3(...record.animationBounds.max as [number, number, number])).expandByScalar(.0001)
    try {
      mixer.clipAction(clip).play()
      for (let i = 0; i <= 128; i++) {
        mixer.setTime(clip.duration * i / 128); gltf.scene.updateMatrixWorld(true)
        const actual = new Box3().setFromObject(gltf.scene)
        assert(declared.containsBox(actual), record.id + ' animation must stay in its exported envelope')
        envelope.union(actual)
      }
      const extent = envelope.getSize(new Vector3())
      assert(Math.max(extent.x, extent.y, extent.z) < 3.7, record.id + ' controlled movement envelope')
    } finally { mixer.stopAllAction(); mixer.uncacheRoot(gltf.scene); release(gltf.scene) }
  }
})
