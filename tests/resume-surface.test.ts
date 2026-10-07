import test from 'node:test'
import assert from 'node:assert/strict'
import { BufferGeometry, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial } from 'three'
import { createResumeSurfaceSampler, orderResumeSurface, RESUME_DITHER_SIZE, resumeDitherTile, sampleResumeSurface, resumeMorphPhase } from '../src/personal/editorial/resume-surface.ts'

test('the engraved print screen retains balanced coverage without changing between scenes', () => {
  const tile = resumeDitherTile()
  assert.equal(tile.length, RESUME_DITHER_SIZE * RESUME_DITHER_SIZE)
  assert.deepEqual(resumeDitherTile(), tile)
  const ranks = [...tile].map(value => value / 15).sort((a, b) => a - b)
  assert.deepEqual(ranks, Array.from({ length: 16 }, (_, i) => i + 1))
  // Mid-grey must retain equal ink and paper coverage rather than biasing a tone.
  assert.equal(tile.filter(threshold => threshold < 128).length, tile.length / 2)
  for (let y = 0; y < RESUME_DITHER_SIZE; y++) {
    assert.equal(tile.subarray(y * RESUME_DITHER_SIZE, (y + 1) * RESUME_DITHER_SIZE).filter(value => value < 128).length, 2)
  }
})

test('spatial transfer ordering preserves every sample with its own surface normal', () => {
  const points = new Float32Array([2, 3, -1, -4, 0, 2, 0, 7, 1, 5, -2, 0, 0, 0, 0])
  const normals = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, -1, 0])
  const beforePoints = points.slice(), beforeNormals = normals.slice()
  const ordered = orderResumeSurface({ points, normals })
  const pairs = (p: Float32Array, n: Float32Array) => Array.from({ length: p.length / 3 }, (_, i) => [...p.subarray(i * 3, i * 3 + 3), ...n.subarray(i * 3, i * 3 + 3)].join(',')).sort()
  assert.deepEqual(pairs(ordered.points, ordered.normals), pairs(points, normals))
  assert.deepEqual(points, beforePoints); assert.deepEqual(normals, beforeNormals)
  const flat = orderResumeSurface({ points: new Float32Array([1, 1, 1, 1, 1, 1]), normals: new Float32Array([0, 1, 0, 0, 0, 1]) })
  assert.deepEqual(Array.from(flat.points), [1, 1, 1, 1, 1, 1])
  assert.deepEqual(Array.from(flat.normals), [0, 1, 0, 0, 0, 1])
})

test('surface samples honor the current GLB hierarchy and triangle area', () => {
  const root = new Group(), small = new BufferGeometry(), large = new BufferGeometry()
  small.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3))
  large.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 2, 0, 0, 0, 2, 0], 3))
  const left = new Mesh(small, new MeshBasicMaterial()), right = new Mesh(large, new MeshBasicMaterial())
  left.position.x = -10; right.position.x = 10; root.position.y = 3; root.add(left, right)
  const first = sampleResumeSurface(root, 6000, 42), second = sampleResumeSurface(root, 6000, 42)
  assert.deepEqual(first.points, second.points)
  let largeCount = 0
  for (let i = 0; i < first.points.length; i += 3) {
    const [x, y, z] = first.points.subarray(i, i + 3)
    assert.ok(y >= 3 && y <= 5 && z === 0)
    assert.ok(Math.abs(Math.hypot(...first.normals.subarray(i, i + 3)) - 1) < 1e-6)
    if (x > 0) largeCount++
  }
  assert.ok(largeCount / 6000 > .78 && largeCount / 6000 < .82)
  right.position.z = 4
  const moved = sampleResumeSurface(root, 6000, 42)
  assert.ok(moved.points.some((value, i) => i % 3 === 2 && value === 4))
  small.dispose(); large.dispose(); left.material.dispose(); right.material.dispose()
})

test('degenerate geometry is rejected instead of generating nonfinite particle paths', () => {
  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0], 3))
  const mesh = new Mesh(geometry, new MeshBasicMaterial())
  assert.throws(() => sampleResumeSurface(mesh, 20), /sampleable surface/)
  assert.throws(() => sampleResumeSurface(mesh, Infinity), /sample count/)
  geometry.dispose(); mesh.material.dispose()
})

test('a prepared sampler follows a subsequently animated joint and its normals', () => {
  const geometry = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0], 3))
  const mesh = new Mesh(geometry, new MeshBasicMaterial()), root = new Group(), joint = new Group()
  joint.add(mesh); root.add(joint)
  const sample = createResumeSurfaceSampler(root), initial = sample(400, 17)
  root.position.set(4, 2, 0); joint.rotation.x = Math.PI / 2
  const posed = sample(400, 17)
  for (let offset = 0; offset < posed.points.length; offset += 3) {
    assert.ok(Math.abs(posed.points[offset] - initial.points[offset] - 4) < 1e-6)
    assert.ok(Math.abs(posed.points[offset + 1] - 2) < 1e-6)
    assert.ok(Math.abs(posed.points[offset + 2] - initial.points[offset + 1]) < 1e-6)
    assert.ok(Math.abs(posed.normals[offset]) < 1e-6)
    assert.ok(Math.abs(posed.normals[offset + 1] + 1) < 1e-6)
    assert.ok(Math.abs(posed.normals[offset + 2]) < 1e-6)
  }
  geometry.dispose(); mesh.material.dispose()
})

test('solid endpoints and overlapping particles keep the entire transformation visible', () => {
  assert.deepEqual(resumeMorphPhase(0), { outgoingCut: 0, incomingCut: 1, particles: 0, travel: 0, pullback: 0 })
  const end = resumeMorphPhase(1)
  assert.equal(end.outgoingCut, 1); assert.equal(end.incomingCut, 0); assert.equal(end.particles, 0); assert.equal(end.travel, 1)
  let old = resumeMorphPhase(0)
  for (let step = 1; step <= 100; step++) {
    const phase = resumeMorphPhase(step / 100)
    assert.ok(phase.outgoingCut >= old.outgoingCut && phase.incomingCut <= old.incomingCut && phase.travel >= old.travel)
    assert.ok(1 - phase.outgoingCut + 1 - phase.incomingCut + phase.particles > .7)
    old = phase
  }
  assert.deepEqual(resumeMorphPhase(NaN), resumeMorphPhase(0))
})
