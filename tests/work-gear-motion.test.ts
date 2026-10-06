import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { Vector3 } from 'three'
import { readGLB } from '../tools/optimize-portfolio-assets.mjs'

test('the actual GLB gear pivots mesh at their pitch circles and preserve opposed tooth speeds', async () => {
  const { json } = readGLB(await readFile(new URL('../public/work-studies/miscellaneous.glb', import.meta.url)))
  const gears = json.nodes.filter(node => node.extras?.articulationMotion?.teeth)
  assert.equal(gears.length, 5)
  const drive = gears.find(node => node.extras.articulationMotion.ratio === 1)
  const toothSpeed = drive.extras.articulationMotion.angularVelocity * drive.extras.articulationMotion.teeth
  const axis = new Vector3(...drive.extras.articulationAxis)
  let contacts = 0
  const neighbours = gears.map(() => new Set<number>())
  for (const node of gears) {
    const motion = node.extras.articulationMotion
    assert.equal(motion.kind, 'continuous')
    assert.equal(motion.driver, drive.name)
    assert.equal(motion.angularVelocity, drive.extras.articulationMotion.angularVelocity)
    assert(Math.abs(Math.abs(motion.angularVelocity * motion.ratio * motion.teeth) - toothSpeed) < 1e-10)
    assert(new Vector3(...node.extras.articulationAxis).distanceTo(axis) < 1e-10)
    assert(Math.abs(new Vector3(...node.translation).sub(new Vector3(...drive.translation)).dot(axis)) < 1e-10)
  }
  for (let i = 0; i < gears.length; i++) for (let j = i + 1; j < gears.length; j++) {
    const a = gears[i].extras.articulationMotion, b = gears[j].extras.articulationMotion
    const separation = new Vector3(...gears[i].translation).distanceTo(new Vector3(...gears[j].translation))
    const pitchContact = a.module * (a.teeth + b.teeth) / 2
    if (Math.abs(separation - pitchContact) > 1e-7) continue
    contacts++
    neighbours[i].add(j); neighbours[j].add(i)
    assert(a.ratio * b.ratio < 0, 'touching teeth must turn in opposite directions')
  }
  assert.equal(contacts, 4, 'the five gears must form one connected train')
  const visited = new Set<number>(), pending = [0]
  while (pending.length) {
    const node = pending.pop()!
    if (visited.has(node)) continue
    visited.add(node); pending.push(...neighbours[node])
  }
  assert.equal(visited.size, gears.length)
})
