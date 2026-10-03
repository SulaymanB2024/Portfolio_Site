import test from 'node:test'
import assert from 'node:assert/strict'
import { projectReaderSection } from '../src/personal/projects/project-reading-position.ts'

const chapters = [
  { id: 'question', top: 900 },
  { id: 'system', top: 1600 },
  { id: 'evidence', top: 2300 }
]

test('a chapter reached below a wrapped sticky index stays current on a short screen', () => {
  // At arrival the chapter is 134px below the viewport top: 110px index + 24px gap.
  assert.equal(projectReaderSection(chapters, 1466, 600, 110, 'question'), 'system')
  assert.equal(projectReaderSection(chapters, 1465.93, 600, 110, 'question'), 'system')
  assert.equal(projectReaderSection(chapters, 1464, 600, 110, 'question'), 'question')
})

test('mobile reading uses the viewport line without reserving space for a static index', () => {
  assert.equal(projectReaderSection(chapters, 1479, 750, 0, 'question'), 'question')
  assert.equal(projectReaderSection(chapters, 1480, 750, 0, 'question'), 'system')
  assert.equal(projectReaderSection(chapters, 1520, 400, 0, 'question'), 'system')
})

test('backward navigation and measured reflow replace stale chapter state', () => {
  assert.equal(projectReaderSection(chapters, 2210, 900, 66, 'question'), 'evidence')
  assert.equal(projectReaderSection(chapters, 950, 900, 66, 'question'), 'question')
  const moved = chapters.map((c) => ({ ...c, top: c.top + 200 }))
  assert.equal(projectReaderSection(moved, 2210, 900, 66, 'question'), 'system')
  assert.equal(projectReaderSection([], 2210, 900, 66, 'question'), 'question')
})
