import test from 'node:test'
import assert from 'node:assert/strict'
import { lionWarpFixtures, referenceNormal, referenceRelease, referenceTangentPair, referenceWarp, type Vector } from './contact-lion-warp-fixtures.ts'

const dot = (a: Vector, b: Vector) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const addScaled = (a: Vector, b: Vector, scale: number): Vector => [a[0] + b[0] * scale, a[1] + b[1] * scale, a[2] + b[2] * scale]
const subtract = (a: Vector, b: Vector): Vector => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

test('numerical GPU reference covers release boundaries and both tangent basis branches with finite unit normals', () => {
  assert.equal(lionWarpFixtures.length, 51)
  for (const fixture of lionWarpFixtures) {
    assert.ok(fixture.field >= 0 && fixture.field <= 1, fixture.label)
    assert.ok([...fixture.warped, ...fixture.centralNormal, ...fixture.legacyNormal].every(Number.isFinite), fixture.label)
    assert.ok(Math.abs(Math.hypot(...fixture.centralNormal) - 1) < 1e-12, fixture.label)
  }
  const boundaries = lionWarpFixtures.filter(fixture => fixture.label.startsWith('release-phase'))
  assert.equal(boundaries[0].released, 0)
  assert.equal(boundaries.at(-1)?.released, 1)
  assert.ok(Math.abs(boundaries[4].released - .5) < 1e-12)
})

test('centered numerical normals converge and are orthogonal to the warped tangent plane', () => {
  for (const { label, position, normal, field, centralNormal } of lionWarpFixtures) {
    const finer = referenceNormal(position, normal, field, 5e-7)
    assert.ok(dot(centralNormal, finer) > 1 - 1e-10, label)
    for (const tangent of referenceTangentPair(normal)) {
      const difference = subtract(referenceWarp(addScaled(position, tangent, 1e-6), field), referenceWarp(addScaled(position, tangent, -1e-6), field))
      assert.ok(Math.abs(dot(centralNormal, difference)) < 1e-14, label)
    }
  }
})

test('zero deformation retains source positions and normals, and a fully released field still deforms', () => {
  for (const { position, normal } of lionWarpFixtures.filter(fixture => fixture.field === 0)) {
    assert.deepEqual(referenceWarp(position, 0), position)
    assert.ok(dot(referenceNormal(position, normal, 0), normal) > 1 - 1e-12)
  }
  const position: Vector = [.58, -.38, -.17]
  assert.equal(referenceRelease(position, 1), 1)
  assert.notDeepEqual(referenceWarp(position, 1), position)
})
