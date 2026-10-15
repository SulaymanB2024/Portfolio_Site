import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import vm from 'node:vm'

const base = 'public/research/hyperliquid-valuation/'
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'))
const inputs = read(base + 'inputs.json')
const expected = read(base + 'results.json')
const article = read('src/personal/editorial/data/articles/hyperliquid-valuation.json')
const scope: any = {}
vm.runInNewContext(readFileSync(base + 'model.js', 'utf8'), scope)
const M = scope.HypeValuation
const close = (a: number, b: number) => assert(Math.abs(a - b) < Math.max(1e-9, Math.abs(b) * 1e-10), `${a} != ${b}`)

test('browser inputs exactly match the reviewed input record', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(M.inputs)), inputs)
})
test('three browser scenarios reproduce independent Python results', () => {
  for (const key of ['bear', 'base', 'bull']) {
    const flows = M.explicit(inputs.cases[key], inputs.reserveShare).map((s: any) => Object.values(s).reduce((a: any, b: any) => a + b, 0))
    const got = M.value(flows, inputs.discountRate, inputs.terminalGrowth, inputs.supplyM)
    close(got.perToken, expected.cases[key].perToken)
    got.flows.forEach((v: number, i: number) => close(v, expected.cases[key].flowsB[i]))
    close(got.terminalShare, expected.cases[key].terminalShare)
  }
  close(expected.cases.base.perToken, 29.964894021693826)
  close(expected.cases.base.periods[4].totalB, 4.24)
})
test('inverse valuation and discount sensitivities reproduce the article', () => {
  const first = expected.cases.base.flowsB.slice(0, 5)
  for (const s of expected.sensitivity) close(M.value(first, s.r, s.g, inputs.supplyM).perToken, s.perToken)
  const start = inputs.observed.allProductHolderReceipts30dM / 1000 * 365 / 30
  const c = M.growthNeeded(start, inputs.referencePrice * inputs.supplyM / 1000, inputs.discountRate, inputs.terminalGrowth)
  close(c, expected.inverse.growth)
  close(M.value(first, .12, .03, 707).perToken, expected.baseAt12PercentAnd707M)
})
test('invalid financial assumptions do not produce a displayed valuation', () => {
  assert.throws(() => M.value([1, 2, 3, 4, 5], .03, .03, 955))
  assert.throws(() => M.value([1, 2, 3, 4, 5], .18, .03, 0))
  assert.throws(() => M.value([1, 2, 3, 4, NaN], .18, .03, 955))
})
test('mixed-product receipts and unreconciled historical fields remain labeled', () => {
  assert.equal(expected.diagnostics.notAPureTradingTakeRate, true)
  close(expected.diagnostics.q3UnreconciledDifferenceM, 4.84)
  const text = JSON.stringify(article)
  assert(text.includes('mixed-product'))
  assert(text.includes('not a liquidation floor'))
  assert(text.includes('not a measured public-company WACC'))
})
test('every source citation and article asset resolves', () => {
  const ids = new Set(article.sources.map((s: any) => s.id.toLowerCase()))
  for (const [, id] of JSON.stringify(article).matchAll(/#source-(s\d+)/g)) assert(ids.has(id), id)
  for (const s of article.sections) for (const f of s.figures || []) {
    assert(existsSync('public' + f.src), f.src)
    assert(f.alt.length > 50)
    const svg = readFileSync('public' + f.src, 'utf8')
    assert(svg.includes('<title'))
    assert(svg.includes('<desc'))
  }
  for (const r of article.resources) assert(existsSync('public' + r.href), r.href)
})
