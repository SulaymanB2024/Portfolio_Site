import test from 'node:test'
import assert from 'node:assert/strict'
import { includeStudyScissor } from '../src/personal/work-study-composition.ts'

test('the shared postpass covers every model without changing its full viewport coordinates', () => {
  const bounds = { x: 0, y: 0, width: 0, height: 0 }
  includeStudyScissor(bounds, 762, 141, 701, 589)
  assert.deepEqual(bounds, { x: 762, y: 141, width: 701, height: 589 })
  includeStudyScissor(bounds, 85, 0, 584, 84)
  assert.deepEqual(bounds, { x: 85, y: 0, width: 1378, height: 730 })
  const same = { ...bounds }
  includeStudyScissor(bounds, 900, 300, 200, 200)
  assert.deepEqual(bounds, same, 'overlapping regions must retain one postpass')
})

test('scrolling offscreen leaves an empty postpass and resets stale model bounds', () => {
  const bounds = { x: 0, y: 0, width: 0, height: 0 }
  includeStudyScissor(bounds, 50, 0, 200, 0)
  includeStudyScissor(bounds, 0, 50, 0, 200)
  assert.deepEqual(bounds, { x: 0, y: 0, width: 0, height: 0 })
  includeStudyScissor(bounds, 0, 0, 390, 280)
  bounds.width = bounds.height = 0
  includeStudyScissor(bounds, 40, 550, 200, 120)
  assert.deepEqual(bounds, { x: 40, y: 550, width: 200, height: 120 })
})

test('phone, desktop and adaptive backing sizes never omit a clipped model pixel', () => {
  for (const [width, height] of [[390, 844], [468, 1012], [1280, 720], [1549, 871], [1239, 696]]) {
    for (let count = 1; count <= 4; count++) {
      const bounds = { x: 0, y: 0, width: 0, height: 0 }
      const regions = []
      for (let i = 0; i < count; i++) {
        const x = Math.floor(width * (i % 2 ? .08 : .52))
        const y = Math.floor(height * i / 5)
        const region = { x, y, width: Math.min(width - x, Math.ceil(width * .43)), height: Math.min(height - y, Math.ceil(height * .4)) }
        regions.push(region)
        includeStudyScissor(bounds, region.x, region.y, region.width, region.height)
      }
      assert(bounds.x >= 0 && bounds.y >= 0)
      assert(bounds.x + bounds.width <= width && bounds.y + bounds.height <= height)
      for (const region of regions) {
        assert(bounds.x <= region.x && bounds.y <= region.y)
        assert(bounds.x + bounds.width >= region.x + region.width)
        assert(bounds.y + bounds.height >= region.y + region.height)
      }
      assert(bounds.width * bounds.height <= width * height)
    }
  }
})
