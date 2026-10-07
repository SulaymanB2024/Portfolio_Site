import test from 'node:test'
import assert from 'node:assert/strict'
import { closePrintUrl, defaultPrint, instrumentSvg, normalizePrint, printCompositionUrl, printForms, printPoints, projectPrint, readPrintComposition } from '../src/personal/refinements/print-instrument.ts'

test('the same composition is reproducible, with distinct forms and seeded variations', () => {
  assert.deepEqual(printPoints(defaultPrint), printPoints(defaultPrint))
  assert.notDeepEqual(printPoints(defaultPrint), printPoints({ ...defaultPrint, seed: 7583 }))
  assert.notDeepEqual(printPoints(defaultPrint), printPoints({ ...defaultPrint, form: 'orbit' }))
  assert.notDeepEqual(printPoints(defaultPrint), printPoints({ ...defaultPrint, tension: 100 }))
})

test('geometry and marks stay finite and inside the print at the control extremes', () => {
  for (const form of printForms) for (const tension of [0, 100]) for (const seed of [1, 999999]) {
    const c = normalizePrint({ ...defaultPrint, form, tension, seed, grain: 100, tilt: 1.3, turn: 2.4, phase: 5.8 })
    const points = printPoints(c), dots = projectPrint(points, c)
    assert.equal(points.length, 12000)
    for (const { x, y, r, opacity } of dots) {
      assert([x, y, r, opacity].every(Number.isFinite))
      assert(x - r > 0 && x + r < 640 && y - r > 0 && y + r < 640)
      assert(r > 0 && opacity > 0 && opacity <= 1)
    }
  }
})

test('vector export preserves the displayed marks, pose, and selected background', () => {
  const c = normalizePrint({ ...defaultPrint, form: 'bloom', seed: 7583, tension: 73, grain: 62, turn: 1.2, tilt: -.9, phase: 2.3, tone: 'ink' })
  const dots = projectPrint(printPoints(c), c), svg = instrumentSvg(c)
  assert.equal((svg.match(/<circle /g) || []).length, dots.length)
  const groups = [...svg.matchAll(/<g opacity="([\d.]+)">([\s\S]*?)<\/g>/g)]
  assert.equal(groups.length, 8)
  const exported = groups.flatMap((group, index) => {
    assert.equal(Number(group[1]), (index + .5) / 8)
    return [...group[2].matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"\/>/g)]
      .map(circle => ({ x: circle[1], y: circle[2], r: circle[3], opacity: Number(group[1]) }))
  })
  const marks = dots.map(dot => ({ x: dot.x.toFixed(4), y: dot.y.toFixed(4), r: dot.r.toFixed(4), opacity: dot.opacity }))
  const byMark = (a: { x: string; y: string; r: string; opacity: number }, b: typeof a) => JSON.stringify(a).localeCompare(JSON.stringify(b))
  assert.deepEqual(exported.sort(byMark), marks.sort(byMark))
  assert(!/<circle[^>]+opacity=/.test(svg), 'dots within an opacity group must composite as one layer')
  assert(svg.includes('width="1800" height="1980"'))
  assert(svg.includes('fill="#111210"'))
  assert(svg.includes('BLOOM / 007583'))
  assert(!/<script|href=|url\(/.test(svg))
})

test('sharing restores the entire held composition from hash and public routes', () => {
  const c = normalizePrint({ ...defaultPrint, seed: 993, turn: 2.41, tilt: -.7, phase: 4.11, tone: 'ink', grain: 88 })
  for (const base of ['https://sulayman-bowles.dev/#/work/miscellaneous?chapter=practice', 'https://sulayman-bowles.dev/work/miscellaneous?chapter=system', 'https://sulayman-bowles.dev/#/']) {
    const link = printCompositionUrl(base, c)
    assert.deepEqual(readPrintComposition(link), c)
    const clean = closePrintUrl(link)
    assert.equal(readPrintComposition(clean), null)
    assert(!clean.includes('print=') && !clean.includes('phase='))
    if (base.includes('chapter=')) assert.equal(new URLSearchParams(new URL(clean).hash.split('?')[1]).get('chapter'), base.split('chapter=')[1])
  }
  assert.deepEqual(readPrintComposition('https://sulayman-bowles.dev/work/miscellaneous?print=1&form=orbit&phase=1.7'), normalizePrint({ form: 'orbit', phase: 1.7 }))
  assert.equal(readPrintComposition('https://sulayman-bowles.dev/#/writing?print=1'), null)
  assert.equal(readPrintComposition('https://sulayman-bowles.dev/?print=1'), null)
})

test('invalid shared values cannot create unsafe forms, nonfinite geometry, or unbounded settings', () => {
  const c = readPrintComposition('https://sulayman-bowles.dev/#/work/miscellaneous?print=1&form=%3Cscript%3E&seed=Infinity&tension=100000&grain=-25&turn=NaN&tilt=999&phase=-2&tone=javascript')!
  assert.equal(c.form, 'ribbon'); assert.equal(c.seed, 173); assert.equal(c.tension, 100); assert.equal(c.grain, 0)
  assert.equal(c.tilt, 1.3); assert.equal(c.tone, 'paper'); assert(c.phase >= 0 && c.phase < Math.PI * 2)
  assert(Object.values(c).filter(value => typeof value === 'number').every(Number.isFinite))
  assert(!instrumentSvg(c).includes('<script>'))
})
