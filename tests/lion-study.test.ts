import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { createLionStudy } from '../src/personal/contact/lion-study.ts'

function fixture() {
  const geometry = new THREE.BufferGeometry()
  // Two disjoint triangles: the right one has four times the left one's area.
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([-3,0,0, -2,0,0, -3,1,0, 1,0,0, 3,0,0, 1,2,0], 3))
  geometry.computeVertexNormals()
  const material = new THREE.MeshStandardMaterial({ roughness: .2, metalness: .3 })
  const mesh = new THREE.Mesh(geometry, material)
  const source = new THREE.Group()
  source.position.set(9, 3, -5)
  source.add(mesh)
  return { source, geometry, material }
}

function dispose(group: THREE.Object3D) {
  group.traverse(node => {
    if (!(node instanceof THREE.Mesh || node instanceof THREE.Points)) return
    node.geometry.dispose()
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) material.dispose()
  })
}

test('ink samples preserve the transformed surface and follow triangle area, without altering the original scan', () => {
  const { source, geometry, material } = fixture()
  const original = Array.from(geometry.getAttribute('position').array)
  const study = createLionStudy(source)
  const mesh = study.group.children.find(node => node instanceof THREE.Mesh) as THREE.Mesh
  const points = study.group.children.find(node => node instanceof THREE.Points) as THREE.Points
  const positions = points.geometry.getAttribute('position')
  const normals = points.geometry.getAttribute('normal')
  let right = 0
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i)
    assert.ok(x >= -1 && x <= 1 && y >= -1 / 3 - 1e-6 && y <= 1 / 3 + 1e-6)
    assert.ok(Math.abs(positions.getZ(i)) < 1e-6)
    assert.ok(Math.abs(normals.getZ(i) - 1) < 1e-6)
    if (x > 0) right++
  }
  assert.ok(right / positions.count > .79 && right / positions.count < .81)
  assert.notEqual(mesh.geometry, geometry)
  assert.notEqual(mesh.material, material)
  assert.deepEqual(Array.from(geometry.getAttribute('position').array), original)
  assert.equal(material.roughness, .2)
  assert.equal(material.metalness, .3)
  dispose(study.group)
  dispose(source)
})

test('dispersion clamps, settles to a finite target, and jumps directly under reduced motion', () => {
  const { source } = fixture()
  const study = createLionStudy(source)
  study.setField(5)
  let frames = 0
  while (study.advance(1 / 60, false)) { assert.ok(++frames < 100); assert.ok(Number.isFinite(study.value)) }
  assert.equal(study.value, 1)
  assert.equal(study.advance(1 / 60, false), false)
  study.setField(-1)
  assert.equal(study.advance(1 / 60, true), false)
  assert.equal(study.value, 0)
  dispose(study.group)
  dispose(source)
})

test('autoplay repeatedly dissolves and reforms, while pause, manual input and reduced motion freeze its clock', () => {
  const { source } = fixture()
  const study = createLionStudy(source)
  const samples: number[] = []
  for (let i = 0; i < 32 * 30; i++) {
    assert.equal(study.advance(1 / 30, false), true)
    samples.push(study.value)
  }
  assert.ok(Math.max(...samples) > .97)
  assert.ok(Math.min(...samples) < .09)
  assert.ok(samples[200] > samples[0])
  assert.ok(samples[600] < samples[400])
  assert.ok(samples[950] > samples[750])
  study.setPlaying(false)
  const paused = { value: study.value, time: study.elapsed }
  for (let i = 0; i < 90; i++) assert.equal(study.advance(1 / 30, false), false)
  assert.equal(study.value, paused.value)
  assert.equal(study.elapsed, paused.time)
  study.setPlaying(true)
  study.advance(1 / 30, false)
  assert.ok(Math.abs(study.value - paused.value) < .01)
  const beforeReduced = { value: study.value, time: study.elapsed }
  assert.equal(study.advance(1 / 30, true), false)
  assert.equal(study.playing, false)
  assert.equal(study.value, beforeReduced.value)
  assert.equal(study.elapsed, beforeReduced.time)
  study.setPlaying(true)
  study.setField(.7)
  assert.equal(study.playing, false)
  study.advance(1 / 30, true)
  assert.equal(study.value, .7)
  dispose(study.group)
  dispose(source)
})
