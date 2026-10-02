import test from 'node:test'
import assert from 'node:assert/strict'
import { workStudyCameraDistance, workStudyFraming } from '../src/personal/work-study-framing.ts'
import { studyMoveBounds } from '../src/personal/work-study-interaction.ts'
import { studyFlightProgress, STUDY_DOCK_MS } from '../src/personal/work-study-flight.ts'

test('detail docking starts at the collection camera and reaches its tighter resting frame', () => {
  const radius = 1.16147
  const vertical = 34 * Math.PI / 360
  for (const aspect of [.5, .8, 1, 1.8, 2.4]) {
    const collection = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(false))
    const start = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(true, 0))
    const finish = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(true))
    assert.equal(start, collection, 'adopting the retained sculpture must not jump its camera')
    assert(finish < start, 'the detail object must occupy more of its available frame')
    let previous = start
    for (let ms = 0; ms <= STUDY_DOCK_MS; ms += 8) {
      const distance = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(true, studyFlightProgress(ms, STUDY_DOCK_MS)))
      assert(distance <= previous + 1e-12 && distance >= finish - 1e-12)
      previous = distance
    }
    assert.equal(previous, finish)
    const firstStep = workStudyFraming(true, studyFlightProgress(1, STUDY_DOCK_MS))
    const lastStep = workStudyFraming(true, studyFlightProgress(STUDY_DOCK_MS - 1, STUDY_DOCK_MS))
    assert(Math.abs(firstStep - workStudyFraming(true, 0)) < 1e-7)
    assert(Math.abs(lastStep - workStudyFraming(true, 1)) < 1e-7)
  }
})

test('every audited sculpture remains inside the detail frustum at full movement and bob', () => {
  // Conservative rest radii from all vertices of the four v4 GLBs. The extra
  // .16 sphere margin also contains their complete articulation/hover burst.
  const radii = [1.12994, 1.05642, 1.06969, 1.16147]
  const vertical = 34 * Math.PI / 360
  for (const radius of radii) for (const aspect of [.5, .8, 1, 1.8, 2.4]) {
    for (const progress of [0, .25, .5, .75, 1]) {
      const distance = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(true, progress))
      const bounds = studyMoveBounds(radius + .16, distance, vertical, aspect)
      const horizontal = Math.atan(Math.tan(vertical) * aspect)
      for (const sign of [-1, 1]) {
        const x = sign * bounds.x * bounds.worldWidth
        const y = sign * bounds.y * bounds.worldHeight
        assert(distance * Math.sin(horizontal) - Math.abs(x) * Math.cos(horizontal) >= radius + .16 - 1e-10, 'side-plane clearance')
        assert(distance * Math.sin(vertical) - (Math.abs(y) + .067) * Math.cos(vertical) >= radius + .16 - 1e-10, 'top/bottom clearance including bob')
      }
    }
  }
})

test('collection framing stays fixed and invalid measurements remain finite and conservative', () => {
  for (const progress of [-2, 0, .5, 1, 2, NaN, Infinity]) {
    assert.equal(workStudyFraming(false, progress), 1.18)
    const detail = workStudyFraming(true, progress)
    assert(detail >= 1.05 && detail <= 1.18)
  }
  for (const values of [[0, 0, 0, 0], [-1, -2, -3, -4], [NaN, Infinity, NaN, Infinity]]) {
    const distance = workStudyCameraDistance(...values as [number, number, number, number])
    assert(Number.isFinite(distance) && distance > 0)
  }
})
