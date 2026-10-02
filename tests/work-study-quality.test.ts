import test from 'node:test'
import assert from 'node:assert/strict'
import { WORK_STUDY_PIXEL_BUDGET, workStudyRenderSize } from '../src/personal/work-study-motion.ts'

test('adaptive quality reduces the bounded backing size without altering CSS proportions', () => {
  for (const [width, height, dpr] of [[390, 844, 3], [1440, 900, 2], [3420, 2214, 2], [7680, 4320, 3]]) {
    const normal = workStudyRenderSize(width, height, dpr)
    const reduced = workStudyRenderSize(width, height, dpr, .8)
    assert(reduced.width * reduced.height <= WORK_STUDY_PIXEL_BUDGET)
    assert(reduced.width <= normal.width * .8 + 1)
    assert(reduced.height <= normal.height * .8 + 1)
    assert(Math.abs(reduced.scaleX - reduced.scaleY) <= 1 / Math.min(width, height))
    assert.deepEqual(workStudyRenderSize(width, height, dpr, 1), normal)
  }
})

test('invalid quality input cannot exceed the existing native/pixel ceilings or allocate a zero target', () => {
  const normal = workStudyRenderSize(1440, 900, 2)
  for (const quality of [NaN, Infinity, -1, 0, 20]) {
    const size = workStudyRenderSize(1440, 900, 2, quality)
    assert(Number.isFinite(size.width) && Number.isFinite(size.height))
    assert(size.width >= 1 && size.height >= 1)
    assert(size.width <= normal.width && size.height <= normal.height)
  }
})
