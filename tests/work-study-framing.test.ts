import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { STUDY_PAN_LIMIT, workStudyCameraDistance, workStudyFraming } from '../src/personal/work-study-framing.ts'
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
    for (let sample = 0; sample <= 100; sample++) {
      const ms = STUDY_DOCK_MS * sample / 100
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

test('every audited sculpture remains inside the detail frustum at full movement and bob', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/work-studies/manifest.json', import.meta.url), 'utf8'))
  // Read the actual generated envelopes, including continuous gear shafts.
  const radii = manifest.models.map(model => {
    assert(model.framing.paddingRequired <= .16)
    return model.framing.rest
  })
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

test('free movement reaches its full viewport travel while containing every rotating sculpture', () => {
  const vertical = 34 * Math.PI / 360
  for (const radius of [1.056262, 1.128842, 1.069691, 1.161470, 1.3]) {
    for (const aspect of [.45, .8, 1, 1.8, 2.4]) for (const detail of [false, true]) {
      const horizontal = Math.atan(Math.tan(vertical) * aspect)
      for (const x of [-STUDY_PAN_LIMIT, -.07, 0, .07, STUDY_PAN_LIMIT]) {
        for (const y of [-STUDY_PAN_LIMIT, -.07, 0, .07, STUDY_PAN_LIMIT]) {
          const distance = workStudyCameraDistance(radius, aspect, vertical, workStudyFraming(detail), x, y)
          const worldHeight = 2 * distance * Math.tan(vertical)
          const worldWidth = worldHeight * aspect
          assert(distance * Math.sin(horizontal) - Math.abs(x * worldWidth) * Math.cos(horizontal) >= radius + .16 - 1e-10)
          assert(distance * Math.sin(vertical) - (Math.abs(y * worldHeight) + .067) * Math.cos(vertical) >= radius + .16 - 1e-10)
          const bounds = studyMoveBounds(radius + .16, distance, vertical, aspect)
          assert(bounds.x >= Math.abs(x) - 1e-10 && bounds.y >= Math.abs(y) - 1e-10, 'camera fitting must not clamp the requested move back to the small resting clearance')
          assert(Math.abs((x * worldWidth) / (distance * Math.tan(horizontal)) / 2 - x) < 1e-12, 'projection must preserve a drag as a viewport fraction')
        }
      }
    }
  }
})

test('panning keeps the resting camera until clearance is needed and invalid offsets remain bounded', () => {
  const radius = 1.16, aspect = .8, angle = 34 * Math.PI / 360
  const resting = workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false))
  assert.equal(workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false), 0, 0), resting)
  let previous = resting
  for (let offset = 0; offset <= STUDY_PAN_LIMIT; offset += .002) {
    const distance = workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false), offset, offset)
    assert(distance >= previous - 1e-12 && Number.isFinite(distance))
    previous = distance
  }
  assert.equal(workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false), 99, -99), workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false), STUDY_PAN_LIMIT, -STUDY_PAN_LIMIT))
  assert.equal(workStudyCameraDistance(radius, aspect, angle, workStudyFraming(false), NaN, Infinity), resting)
})
