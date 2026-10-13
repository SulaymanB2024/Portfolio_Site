import test from 'node:test'
import assert from 'node:assert/strict'
import { headingFitWidth, layoutHeading } from '../src/personal/landing/heading-typography.ts'
import { withLandingOpening } from '../src/personal/landing/opening-copy.ts'
import { CHAPTERS } from '../src/personal/landing/sequence.ts'

const opening = withLandingOpening({ lines: ['I built Atlas around', 'checkable evidence.', 'I like Google linking AI Overviews', 'back to sources.'], category: '', href: '/resume', linkLabel: 'Résumé', article: { label: 'Explore the site', href: '/' } })[0]

test('customized desktop openings fit before the original sculpture band', () => {
  for (const width of [701, 840, 1024, 1280, 1440]) {
    const allowance = headingFitWidth(opening, width * .53, width)
    const layout = layoutHeading(opening, 60, allowance, () => 480)
    assert(layout.fit * 480 <= width * .45)
    assert.deepEqual(layout.rows.map(row => row.text), opening.lines)
    assert.equal(headingFitWidth(opening, 200, width), 200)
  }
})

test('standard home, phone and subsequent chapters retain their measurements', () => {
  assert.equal(headingFitWidth(CHAPTERS[0], 445, 840), 445)
  assert.equal(headingFitWidth(opening, 343, 390), 343)
  assert.equal(headingFitWidth(opening, 371, 700), 371)
  for (const chapter of CHAPTERS.slice(1)) assert.equal(headingFitWidth(chapter, 445, 840), 445)
})

test('crossing the phone boundary changes the fit allowance used by both text caches', () => {
  assert.equal(headingFitWidth(opening, 371, 700), 371)
  assert.equal(headingFitWidth(opening, 371, 701), 315.45)
})

test('a long display row leaves readable supporting copy on a narrow phone', () => {
  const widths = [240, 600, 480, 500]
  const layout = layoutHeading(opening, 50, 280, row => widths[opening.lines.indexOf(row.text)])
  const pixels = layout.rows.map(row => 50 * layout.fit * row.scale)
  assert(Math.abs(pixels[0] - 14) < 1e-9)
  assert(Math.abs(pixels[2] - 14) < 1e-9)
  assert(pixels[1] > pixels[0])
  assert(pixels[3] > pixels[2])
  for (const [index, row] of layout.rows.entries()) {
    const originalScale = index % 2 === 0 ? .49 : 1
    assert(widths[index] * row.scale / originalScale * layout.fit <= 278 + 1e-9)
  }
  assert.deepEqual(layout.rows.map(row => row.text), opening.lines)
})

test('a long supporting sentence does not shrink shorter display rows', () => {
  const widths = [200, 250, 800, 270]
  const layout = layoutHeading(opening, 60, 320, row => widths[opening.lines.indexOf(row.text)])
  assert.equal(layout.fit, 1)
  assert.equal(layout.rows[1].scale, 1)
  assert.equal(layout.rows[3].scale, 1)
  assert(widths[2] * layout.rows[2].scale / .49 <= 318 + 1e-9)
})

test('standard-home typography retains the shared original fit', () => {
  const layout = layoutHeading(CHAPTERS[0], 60, 320, () => 600)
  assert.equal(layout.fit, 318 / 600)
  assert.deepEqual(layout.rows.map(row => row.scale), [.49, 1, .49, 1])
})
