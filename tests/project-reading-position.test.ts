import test from 'node:test'
import assert from 'node:assert/strict'
import { projectReaderSection, requestedProjectChapter, projectChapterHref } from '../src/personal/projects/project-reading-position.ts'

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

test('public path bookmarks and hash bookmarks reach the same project chapter', () => {
  assert.equal(requestedProjectChapter('', '/work/sapien', '?chapter=system', 'sapien'), 'system')
  assert.equal(requestedProjectChapter('', '/work/sapien/', '?chapter=practice', 'sapien'), 'practice')
  assert.equal(requestedProjectChapter('#/work/sapien?chapter=question', '/work/atlas', '?chapter=system', 'sapien'), 'question')
  assert.equal(requestedProjectChapter('#/work/atlas?chapter=system', '/work/sapien', '?chapter=question', 'sapien'), null)
  assert.equal(requestedProjectChapter('', '/work/sapien-elsewhere', '?chapter=system', 'sapien'), null)
  assert.equal(requestedProjectChapter('#main-content', '/work/sapien', '?chapter=system', 'sapien'), null)
})

test('chapter selection retains bookmark context without borrowing another project’s query', () => {
  assert.equal(projectChapterHref('#/work/sapien?from=resume&chapter=question', '/', '', 'sapien', 'system'), '#/work/sapien?from=resume&chapter=system')
  assert.equal(projectChapterHref('', '/work/sapien', '?from=resume&chapter=question', 'sapien', 'system'), '/work/sapien?from=resume&chapter=system')
  assert.equal(projectChapterHref('#/work/atlas?from=resume', '/work/sapien', '?from=other', 'sapien', 'practice'), '#/work/sapien?chapter=practice')
})
