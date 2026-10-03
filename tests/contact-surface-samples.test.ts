import test from 'node:test'
import assert from 'node:assert/strict'
import { BufferAttribute, InterleavedBuffer, InterleavedBufferAttribute, Vector3 } from 'three'
import { sampleSurface, type SurfaceBuffer } from '../src/personal/contact/surface-samples.ts'

function random(seed = 7183) {
  let calls = 0
  return {
    next() { calls++; seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 },
    get calls() { return calls }, get seed() { return seed },
  }
}

/** Independent reference retained from the Vector3 implementation. */
function legacy(position: BufferAttribute | InterleavedBufferAttribute, normal: BufferAttribute | InterleavedBufferAttribute, index: BufferAttribute | null, count: number, random: () => number) {
  const triangles = Math.floor((index?.count ?? position.count) / 3), areas = new Float64Array(triangles)
  const a = new Vector3(), b = new Vector3(), c = new Vector3(), ab = new Vector3(), ac = new Vector3()
  const vertex = (i: number) => index ? index.getX(i) : i
  let area = 0
  for (let i = 0; i < triangles; i++) {
    a.fromBufferAttribute(position, vertex(i * 3)); b.fromBufferAttribute(position, vertex(i * 3 + 1)); c.fromBufferAttribute(position, vertex(i * 3 + 2))
    area += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * .5; areas[i] = area
  }
  const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3), seeds = new Float32Array(count)
  const na = new Vector3(), nb = new Vector3(), nc = new Vector3()
  for (let i = 0; i < count; i++) {
    const selection = random() * area
    let low = 0, high = triangles - 1
    while (low < high) { const middle = (low + high) >>> 1; if (areas[middle] < selection) low = middle + 1; else high = middle }
    a.fromBufferAttribute(position, vertex(low * 3)); b.fromBufferAttribute(position, vertex(low * 3 + 1)); c.fromBufferAttribute(position, vertex(low * 3 + 2))
    const u = Math.sqrt(random()), v = random()
    a.multiplyScalar(1 - u).addScaledVector(b, u * (1 - v)).addScaledVector(c, u * v).toArray(positions, i * 3)
    na.fromBufferAttribute(normal, vertex(low * 3)); nb.fromBufferAttribute(normal, vertex(low * 3 + 1)); nc.fromBufferAttribute(normal, vertex(low * 3 + 2))
    na.multiplyScalar(1 - u).addScaledVector(nb, u * (1 - v)).addScaledVector(nc, u * v).normalize().toArray(normals, i * 3)
    seeds[i] = random()
  }
  return { positions, normals, seeds }
}

test('42,000 indexed samples are bit-identical to the original area-weighted positions, normals and random stream', () => {
  const position = new BufferAttribute(new Float32Array([-3,.12,.5, -2,.2,-.4, -3,1,.7, 1,-.2,.3, 3,.4,.6, 1,2,-.8]), 3)
  const normal = new BufferAttribute(new Float32Array([.4,.3,.9, -.3,.8,.4, .1,.3,.9, -.2,.4,.8, .1,.9,.1, .2,.1,.8]), 3)
  const index = new BufferAttribute(new Uint16Array([0,1,2, 3,4,5, 0,0,0]), 1)
  const sourcePositions = position.array.slice(), sourceNormals = normal.array.slice(), sourceIndices = index.array.slice()
  const expectedRandom = random(), actualRandom = random()
  const expected = legacy(position, normal, index, 42000, expectedRandom.next)
  const actual = sampleSurface({ array: position.array, count: position.count }, { array: normal.array, count: normal.count }, index.array, 42000, actualRandom.next)
  assert.deepEqual(actual, expected)
  assert.equal(actualRandom.calls, 42000 * 4)
  assert.equal(actualRandom.seed, expectedRandom.seed)
  assert.deepEqual(position.array, sourcePositions); assert.deepEqual(normal.array, sourceNormals); assert.deepEqual(index.array, sourceIndices)
})

test('strided nonindexed buffers and zero normals retain the original sampling order', () => {
  const array = new Float32Array([99,-1,0,.1,0,0,0,77, 99,1,.2,-.3,0,0,0,77, 99,0,2,.7,0,0,0,77])
  const data = new InterleavedBuffer(array, 8)
  const position = new InterleavedBufferAttribute(data, 3, 1), normal = new InterleavedBufferAttribute(data, 3, 4)
  const buffer = (offset: number): SurfaceBuffer => ({ array, count: data.count, stride: 8, offset })
  const expected = legacy(position, normal, null, 256, random().next)
  assert.deepEqual(sampleSurface(buffer(1), buffer(4), null, 256, random().next), expected)
})

test('an all-degenerate or nonfinite surface fails before allocating particles or consuming randomness', () => {
  const rng = random(), normal = { array: new Float32Array(9), count: 3 }
  assert.throws(() => sampleSurface(normal, normal, null, 42000, rng.next), /no finite nondegenerate triangles/)
  assert.throws(() => sampleSurface({ array: new Float32Array([0,0,0, 1,0,0, 0,Infinity,0]), count: 3 }, normal, null, 42000, rng.next), /no finite nondegenerate triangles/)
  assert.equal(rng.calls, 0)
})
