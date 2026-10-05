import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { Color, Mesh, Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

test('the shipped résumé GLB contains compact cloneable work forms with the original paper and graphite finishes', async () => {
  const bytes = await readFile(new URL('../public/resume-objects/work-areas.glb', import.meta.url))
  const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')
  assert.equal(scene.children.length, 15)
  for (const template of scene.children) {
    assert(template.name.startsWith('resume-form-'))
    assert.equal(template.userData.resumeForm, template.name.slice('resume-form-'.length))
    const size = new Box3().setFromObject(template).getSize(new Vector3())
    assert(size.x > .5 && size.x < 2 && size.y > .5 && size.y < 2 && size.z > 0 && size.z < 1)
    const clone = template.clone(true)
    template.traverse(original => {
      if (!(original instanceof Mesh)) return
      const copy = clone.getObjectByName(original.name) as Mesh
      assert.equal(copy.geometry, original.geometry, 'instances must share the baked buffers')
      assert.equal(copy.material, original.material, 'instances must share their authored finish')
      const material = original.material as any
      const hex = original.userData.finish === 'paper' ? 0x96968f : 0x191b17
      const expected = new Color(hex)
      for (const channel of ['r', 'g', 'b'] as const) assert(Math.abs(material.color[channel] - expected[channel]) < 1e-7)
      assert.equal(material.metalness, 0)
      assert.equal(material.roughness, 1)
    })
  }
})
