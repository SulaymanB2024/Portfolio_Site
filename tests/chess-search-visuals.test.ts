import test from 'node:test'
import assert from 'node:assert/strict'
import type { EnginePvMove, EngineScore, EngineThinkingProgress } from '../src/personal/about/chess-analysis.ts'
import { principalLineSteps, searchPlot } from '../src/personal/about/chess-search-visuals.ts'

const sample = (depth: number, score?: EngineScore): EngineThinkingProgress => ({ phase: 'thinking', depth, nodes: depth * 100, ...(score ? { score } : {}) })

test('the trace plots reported depths and breaks exact score lines at bounds, mates and absent scores', () => {
  const input = [sample(0), sample(2, {kind:'cp',value:25}), sample(5, {kind:'cp',value:-50}), sample(6, {kind:'cp',value:-70,bound:'upper'}), sample(7, {kind:'mate',value:-3}), sample(8), sample(9, {kind:'cp',value:10}), sample(10, {kind:'cp',value:15})]
  const plot = searchPlot(input)
  assert.equal(plot.firstDepth, 2)
  assert.equal(plot.lastDepth, 10)
  assert.equal(plot.ceiling, 70)
  assert.deepEqual(plot.points.map(point => point.kind), ['exact','exact','bound','mate','depth','exact','exact'])
  assert.equal(plot.points[0].x, 16)
  assert.equal(plot.points[1].x, 184)
  assert.equal(plot.points.at(-1)?.x, 464)
  assert.equal(plot.points[2].y, 50)
  assert.equal(plot.points[3].y, null)
  assert.equal(plot.points[4].y, null)
  assert.equal(plot.segments.length, 2)
  assert.ok(plot.segments[0].includes('L184,'))
  assert.ok(!plot.segments.some(segment => segment.includes(`L${plot.points[2].x},`)))
  assert.equal(input.length, 8)
})

test('empty and single-mate reports never invent iterations or a centipawn coordinate', () => {
  assert.deepEqual(searchPlot([sample(0)]), { points:[], segments:[], ceiling:50, firstDepth:null, lastDepth:null })
  const plot = searchPlot([sample(12, {kind:'mate',value:1})])
  assert.equal(plot.points.length, 1)
  assert.equal(plot.points[0].x, 240)
  assert.equal(plot.points[0].y, null)
  assert.equal(plot.points[0].kind, 'mate')
  assert.deepEqual(plot.segments, [])
  assert.equal(plot.firstDepth, 12)
  assert.equal(plot.lastDepth, 12)
})

test('principal-line numbering uses the root and animation keys retain only the unchanged prefix', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 17'
  const pv: EnginePvMove[] = [{from:'e7',to:'e5',san:'e5'},{from:'g1',to:'f3',san:'Nf3'},{from:'b8',to:'c6',san:'Nc6'}]
  const steps = principalLineSteps(pv, fen)
  assert.deepEqual(steps.map(step => step.number), ['17…','18.',''])
  assert.deepEqual(steps.map(step => step.key), ['/e7e5','/e7e5/g1f3','/e7e5/g1f3/b8c6'])
  const changed = principalLineSteps([pv[0], {from:'f1',to:'c4',san:'Bc4'}, pv[2]], fen)
  assert.equal(changed[0].key, steps[0].key)
  assert.notEqual(changed[1].key, steps[1].key)
  assert.notEqual(changed[2].key, steps[2].key)
  assert.equal(principalLineSteps(pv, fen, 2).length, 2)
  assert.deepEqual(principalLineSteps(undefined, fen), [])
})
