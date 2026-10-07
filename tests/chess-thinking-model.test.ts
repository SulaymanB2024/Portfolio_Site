import test from 'node:test'
import assert from 'node:assert/strict'
import type { SearchTrace } from '../src/personal/about/ChessSearch'
import type { EnginePvMove, EngineThinkingProgress } from '../src/personal/about/chess-analysis.ts'
import { createThinkingModel, layoutThinkingGraph, thinkingMoveNumber } from '../src/personal/about/chess-thinking-model.ts'

const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 17'
const move = (from: string, to: string, san: string): EnginePvMove => ({from:from as EnginePvMove['from'],to:to as EnginePvMove['to'],san})
const e5 = move('e7','e5','e5'), nf3 = move('g1','f3','Nf3'), nc6 = move('b8','c6','Nc6'), bc4 = move('f1','c4','Bc4'), d6 = move('d7','d6','d6')
const report = (depth: number, pv?: EnginePvMove[]): EngineThinkingProgress => ({phase:'thinking',depth,nodes:depth * 100,pv})
const trace = (samples: EngineThinkingProgress[], latest = samples.at(-1)!): SearchTrace => ({fen,samples,latest,complete:false})

test('reported PV prefixes merge, while actual divergent continuations remain distinct', () => {
  const samples = [report(5,[e5,nf3,nc6]),report(6,[e5,bc4,d6]),report(7,[e5,nf3,d6])]
  const model = createThinkingModel(trace(samples))
  assert.equal(model.nodes.length, 6)
  assert.equal(model.lines.length, 3)
  assert.deepEqual(model.nodes.find(node => node.id === '/e7e5')?.reportDepths, [5,6,7])
  assert.deepEqual(model.currentIds, ['/e7e5','/e7e5/g1f3','/e7e5/g1f3/d7d6'])
  assert.deepEqual(model.nodes.filter(node => node.current).map(node => node.move.san), ['e5','Nf3','d6'])
  assert.equal(model.nodes.filter(node => node.move.san === 'd6').length, 2)
  assert.deepEqual(samples[0].pv, [e5,nf3,nc6])
})

test('the graph is bounded to eight actual reports, six plies, and at most 48 move nodes', () => {
  const samples = Array.from({length:14}, (_, index) => report(index + 1, Array.from({length:10}, (_, ply) => move(`${String.fromCharCode(97 + index % 8)}${1 + ply % 7}`, `${String.fromCharCode(97 + (index + ply + 1) % 8)}${1 + (ply + 1) % 7}`, `r${index}p${ply}`))))
  const model = createThinkingModel(trace(samples))
  assert.equal(model.lines.length, 8)
  assert.deepEqual(model.lines.map(line => line.depth), [7,8,9,10,11,12,13,14])
  assert.ok(model.nodes.length <= 48)
  assert.ok(model.nodes.every(node => node.ply <= 6))
  const reportedMoves = new Set(samples.slice(-8).flatMap(sample => sample.pv!.slice(0,6).map(move => `${move.from}${move.to}`)))
  assert.ok(model.nodes.every(node => reportedMoves.has(`${node.move.from}${node.move.to}`)))
  assert.ok(model.nodes.every(node => !node.parent || model.nodes.some(parent => parent.id === node.parent)))
  assert.ok(layoutThinkingGraph(model).nodes.filter(node => node.ply === 6).every(node => node.continues))
})

test('empty or missing PV reports create no moves and do not borrow a stale current line', () => {
  const prior = report(5,[e5,nf3])
  const latest = report(6)
  const model = createThinkingModel(trace([prior,latest]))
  assert.equal(model.nodes.length, 2)
  assert.equal(model.lines.length, 1)
  assert.deepEqual(model.currentIds, [])
  assert.ok(model.nodes.every(node => !node.current))
  assert.equal(model.move, undefined)
  assert.deepEqual(createThinkingModel(null).nodes, [])
  assert.deepEqual(createThinkingModel(trace([report(0)])).nodes, [])
})

test('settled bestmove is displayed truthfully without manufacturing a PV when it differs', () => {
  const source = trace([report(8,[e5,nf3,nc6])])
  const settled = createThinkingModel({...source,complete:true,played:'c5'})
  assert.equal(settled.move, 'c5')
  assert.equal(settled.moveLabel, 'Played')
  assert.deepEqual(settled.currentIds, [])
  assert.ok(settled.nodes.every(node => node.move.san !== 'c5' && !node.current))
  const matching = createThinkingModel({...source,complete:true,played:'e5'})
  assert.equal(matching.moveLabel, 'Played')
  assert.equal(matching.currentIds.length, 3)
})

test('compact projection preserves actual topology, marks real omitted continuations and honors root numbering', () => {
  const source = trace([report(9,[e5,nf3,nc6,bc4,d6,move('d2','d3','d3')])])
  const model = createThinkingModel(source)
  const wide = layoutThinkingGraph(model)
  const narrow = layoutThinkingGraph(model, true)
  assert.equal(wide.nodes.length, 6)
  assert.equal(narrow.nodes.length, 4)
  assert.equal(narrow.nodes.at(-1)?.continues, true)
  assert.equal(wide.nodes.at(-1)?.continues, false)
  assert.ok(narrow.nodes.every(node => node.x >= 0 && node.x < narrow.width && node.y < narrow.height))
  assert.equal(narrow.edges.length, 4)
  assert.equal(narrow.currentPath.includes('NaN'), false)
  assert.deepEqual([1,2,3,4].map(ply => thinkingMoveNumber(model,ply)), ['17…','18.','18…','19.'])
})

test('promotion choices retain separate identities and a replacement report cannot leave a stale same-depth branch', () => {
  const queen: EnginePvMove = {from:'a7',to:'a8',promotion:'q',san:'a8=Q+'}
  const knight: EnginePvMove = {from:'a7',to:'a8',promotion:'n',san:'a8=N'}
  const samples = [report(6,[queen]),report(7,[knight])]
  const model = createThinkingModel(trace(samples))
  assert.deepEqual(model.nodes.map(node => node.id), ['/a7a8q','/a7a8n'])
  const latest = report(7,[queen])
  const replaced = createThinkingModel(trace(samples, latest))
  assert.equal(replaced.nodes.length, 1)
  assert.deepEqual(replaced.nodes[0].reportDepths, [6,7])
  assert.deepEqual(replaced.currentIds, ['/a7a8q'])
  assert.ok(replaced.nodes.every(node => node.move.promotion !== 'n'))
})
