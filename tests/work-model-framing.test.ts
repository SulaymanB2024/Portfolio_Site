import test from 'node:test'
import assert from 'node:assert/strict'
import { Vector3 } from 'three'
import { shaftVertexRadius } from '../tools/work-models/framing.mjs'

test('a full-turn envelope contains the far side of an off-center shaft that hover bounds omit', () => {
  const vertex = new Vector3(-.5, 0, 0), pivot = new Vector3(1, 0, 0), axis = new Vector3(0, 1, 0)
  assert.equal(shaftVertexRadius(vertex, pivot, axis, true), 1.5)
  assert(shaftVertexRadius(vertex, pivot, axis) < .52)
})

test('analytical hinge and full-turn envelopes bound sampled physical rotations on oblique axes', () => {
  for (let i = 1; i <= 18; i++) {
    const vertex = new Vector3(Math.sin(i * 3), Math.cos(i * 5), Math.sin(i * 7)).multiplyScalar(.8)
    const pivot = new Vector3(Math.cos(i * 2), Math.sin(i * 4), Math.cos(i * 6)).multiplyScalar(.7)
    const axis = new Vector3(Math.sin(i), Math.cos(i), .5).normalize()
    for (const continuous of [false, true]) {
      const bound = shaftVertexRadius(vertex, pivot, axis, continuous)
      let sampled = 0
      for (let step = 0; step <= 1440; step++) {
        const angle = continuous ? step / 1440 * Math.PI * 2 : -.18 + step / 1440 * .36
        const radius = vertex.clone().applyAxisAngle(axis, angle).add(pivot).length()
        assert(radius <= bound + 1e-12)
        sampled = Math.max(sampled, radius)
      }
      assert(bound - sampled < .00001)
    }
  }
})
