import test from 'node:test'
import assert from 'node:assert/strict'
import { readerProgress, readerSection } from '../src/personal/editorial/reader-position.ts'

test('reader sections use the viewport threshold and preserve a fallback before the first heading', () => {
  const positions = [{ id: 'opening', top: 400 }, { id: 'evidence', top: 900 }, { id: 'sources', top: 1600 }]
  assert.equal(readerSection(positions, 0, 800, 'opening'), 'opening')
  assert.equal(readerSection(positions, 771, 800, 'opening'), 'opening')
  assert.equal(readerSection(positions, 772, 800, 'opening'), 'evidence')
  assert.equal(readerSection(positions, 1800, 800, 'opening'), 'sources')
  assert.equal(readerSection([], 0, 800), undefined)
})

test('reader tracking follows remeasured positions after disclosure or viewport changes', () => {
  assert.equal(readerSection([{ id: 'one', top: 80 }, { id: 'two', top: 600 }], 500, 400, 'one'), 'one')
  assert.equal(readerSection([{ id: 'one', top: 80 }, { id: 'two', top: 600 }], 520, 400, 'one'), 'two')
  assert.equal(readerSection([{ id: 'one', top: 80 }, { id: 'two', top: 900 }], 520, 400, 'one'), 'one')
})

test('reading progress stays finite and bounded for short, long, and moved articles', () => {
  assert.equal(readerProgress(400, 8000, 0, 800), 0)
  assert.equal(readerProgress(400, 8000, 9000, 800), 1)
  assert.equal(readerProgress(400, 100, 500, 800), 1)
  assert.equal(readerProgress(400, 8000, 400, 800), readerProgress(900, 8000, 900, 800))
})

test('a native chapter arrival stays current below compact sticky contents', () => {
  const positions = [{ id: 'opening', top: 400 }, { id: 'capture', top: 1000 }, { id: 'sources', top: 1600 }]
  for (const height of [320, 390, 500, 568, 740, 844]) {
    // The chapter stops 96px below the viewport top, including fractional scroll.
    assert.equal(readerSection(positions, 903.6, height, 'opening', 96), 'capture', `${height}px viewport`)
    assert.equal(readerSection(positions, 890, height, 'opening', 96), height > 680 ? 'capture' : 'opening')
  }
})

test('remeasuring a chapter arrival offset follows responsive layout changes', () => {
  const positions = [{ id: 'one', top: 400 }, { id: 'two', top: 1000 }]
  assert.equal(readerSection(positions, 904, 390, 'one', 96), 'two')
  assert.equal(readerSection(positions, 904, 390, 'one', 35), 'one')
  assert.equal(readerSection(positions, 965, 900, 'one', 35), 'two')
  assert.equal(readerSection([], 0, 390, undefined, 96), undefined)
})
