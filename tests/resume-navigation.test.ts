import test from 'node:test'
import assert from 'node:assert/strict'
import { resumeSections, resumeSectionFromHash, resumeSectionHref, withoutResumeSection } from '../src/personal/editorial/resume-navigation.ts'

test('each résumé contents URL retains its destination on arrival', () => {
  const links = resumeSections.map(([id]) => resumeSectionHref(id))
  assert.equal(new Set(links).size, 5)
  assert.deepEqual(links.map(resumeSectionFromHash), ['experience', 'selected-work', 'education', 'recognition', 'skills'])
})

test('unrelated routes and unknown sections do not open the full résumé', () => {
  for (const hash of ['#/work?section=education', '#/resume/other?section=education', '#/resume?section=missing', '#/resume?section=', '#/resume', '']) assert.equal(resumeSectionFromHash(hash), null)
  assert.equal(resumeSectionFromHash('#/resume?q=research&section=education'), 'education')
})

test('returning to the overview clears only the section destination', () => {
  assert.equal(withoutResumeSection('#/resume?section=skills'), '#/resume')
  assert.equal(withoutResumeSection('#/resume?q=AI&section=skills&from=work'), '#/resume?q=AI&from=work')
  assert.equal(resumeSectionFromHash(withoutResumeSection('#/resume?section=skills')), null)
})
