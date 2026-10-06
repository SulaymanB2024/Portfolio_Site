import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readGLB } from '../tools/optimize-portfolio-assets.mjs'

test('A/B engraving inherits each specimen shaft instead of a separate hover clock', async () => {
  const { json } = readGLB(await readFile(new URL('../public/work-studies/sapien.glb', import.meta.url)))
  for (const [parentName, childName] of [
    ['hover-oval-product-prototype', 'oval-specimen-inlays'],
    ['hover-faceted-product-prototype', 'faceted-specimen-inlays'],
  ]) {
    const parent = json.nodes.find((node: { name: string }) => node.name === parentName)
    const childIndex = json.nodes.findIndex((node: { name: string }) => node.name === childName)
    assert(parent && childIndex >= 0)
    const child = json.nodes[childIndex]
    assert(parent.children.includes(childIndex), 'The engraving must physically inherit the specimen transform')
    assert.deepEqual(child.translation ?? [0, 0, 0], [0, 0, 0])
    assert.equal(child.extras?.articulationAxis, undefined, 'Attached markings must not have another articulation clock')
    assert.equal(child.extras?.articulationMotion, undefined)
    assert.notEqual(child.mesh, undefined)
  }
  assert.equal(json.nodes.filter((node: { name: string }) => node.name.startsWith('hover-')).length, 2)
})
