import test from 'node:test'
import assert from 'node:assert/strict'
import { headingFitWidth, layoutHeading } from '../src/personal/landing/heading-typography.ts'
import { withLandingOpening } from '../src/personal/landing/opening-copy.ts'
import { CHAPTERS } from '../src/personal/landing/sequence.ts'

const opening = withLandingOpening({ lines: ['I built Atlas around', 'checkable evidence.', 'I like Google linking AI Overviews', 'back to sources.'], category: '', href: '/resume', linkLabel: 'Résumé', article: { label: 'Explore the site', href: '/' } })[0]

test('customized tall and square desktop openings fit before the original sculpture band', () => {
  for (const [width, height] of [[840, 977], [840, 840], [1024, 1366]]) {
    const allowance = headingFitWidth(opening, width * .53, width, height)
    const layout = layoutHeading(opening, 60, allowance, () => 480)
    assert(layout.fit * 480 <= width * .45)
    assert.deepEqual(layout.rows.map(row => row.text), opening.lines)
    assert.equal(headingFitWidth(opening, 200, width, height), 200)
  }
})

test('standard home, phone, wide desktop and subsequent chapters retain their measurements', () => {
  assert.equal(headingFitWidth(CHAPTERS[0], 445, 840, 977), 445)
  assert.equal(headingFitWidth(opening, 343, 390, 844), 343)
  assert.equal(headingFitWidth(opening, 371, 700, 900), 371)
  assert.equal(headingFitWidth(opening, 678, 1280, 720), 678)
  for (const chapter of CHAPTERS.slice(1)) assert.equal(headingFitWidth(chapter, 445, 840, 977), 445)
})

test('a same-width viewport change selects a distinct fit allowance across the tall boundary', () => {
  assert.notEqual(headingFitWidth(opening, 445, 840, 840), headingFitWidth(opening, 445, 840, 839))
})
