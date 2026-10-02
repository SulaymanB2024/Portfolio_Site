import test from 'node:test'
import assert from 'node:assert/strict'
import { advanceHiddenWord, printDots, printSvg } from '../src/personal/refinements/print-study.ts'

test('all print impressions remain inside their sheet with finite, visible dots', () => {
  for (const shape of ['orbit', 'field', 'drift'] as const) {
    for (const seed of [0, 1, 52, 999, NaN, Infinity, -10]) {
      const dots = printDots(shape, seed)
      assert.equal(dots.length, 256)
      for (const { x, y, r, opacity } of dots) {
        assert([x, y, r, opacity].every(Number.isFinite))
        assert(x - r > 0 && x + r < 400 && y - r > 0 && y + r < 400)
        assert(r > 0 && opacity > 0 && opacity <= 1)
      }
    }
  }
})

test('a downloaded print reproduces its displayed composition and is standalone SVG', () => {
  const dots = printDots('drift', 12)
  const svg = printSvg('drift', 12)
  assert.equal((svg.match(/<circle /g) || []).length, dots.length)
  for (const dot of dots) assert(svg.includes(`cx="${dot.x.toFixed(3)}" cy="${dot.y.toFixed(3)}" r="${dot.r.toFixed(3)}" opacity="${dot.opacity.toFixed(3)}"`))
  assert(svg.includes('xmlns="http://www.w3.org/2000/svg"'))
  assert(svg.includes('impression 13'))
  assert(!/<script|href=|url\(/.test(svg))
  assert.deepEqual(printDots('orbit', 4), printDots('orbit', 4))
  assert.notDeepEqual(printDots('orbit', 4), printDots('orbit', 5))
})

test('hidden words are bounded, case insensitive and reset after nonletter keys', () => {
  let buffer = ''
  let found: string | undefined
  for (const key of 'anordinaryCURIOUS') {
    const next = advanceHiddenWord(buffer, key)
    buffer = next.buffer; found = next.found
    assert(buffer.length <= 8)
  }
  assert.equal(found, 'curious')
  assert.equal(buffer, '')
  assert.deepEqual(advanceHiddenWord('curio', 'Escape'), { buffer: '' })
  assert.deepEqual(advanceHiddenWord('curio', ' '), { buffer: '' })
  assert.equal(advanceHiddenWord('stargaz', 'e').found, 'stargaze')
  assert.equal(advanceHiddenWord('curio', 'x').found, undefined)
})
