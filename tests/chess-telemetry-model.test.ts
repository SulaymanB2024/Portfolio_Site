import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess } from '../src/personal/about/chess-game.ts'
import { parseEngineInfo, type EngineThinkingProgress } from '../src/personal/about/chess-analysis.ts'
import { chessTelemetryMap } from '../src/personal/about/chess-telemetry-model.ts'
import type { SearchTrace } from '../src/personal/about/ChessSearch'

const fen = new Chess().fen()
const report = (depth: number, pv = 'e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 d2d3') => parseEngineInfo(`info depth ${depth} nodes ${depth*1000} pv ${pv}`,fen)!
const trace = (samples: EngineThinkingProgress[]): SearchTrace => ({fen,latest:samples.at(-1)!,samples,complete:false})

test('spatial paths use only legal, actually reported PV moves, with original board coordinates', () => {
  const samples = [report(3),report(4,'d2d4 d7d5 c2c4')]
  const source = JSON.stringify(samples)
  const map = chessTelemetryMap(trace(samples))
  assert.equal(map.routes.length,9)
  assert.deepEqual(map.routes.filter(route=>route.current).map(route=>route.san),['d4','d5','c4'])
  assert.equal(map.routes[0].path.startsWith('M124 172Q'),true)
  assert.equal(map.routes[0].path.endsWith(' 124 124'),true)
  assert.equal(map.squares.find(square=>square.square==='d4')?.current,true)
  assert.equal(map.squares.find(square=>square.square==='e4')?.current,false)
  assert.equal(JSON.stringify(samples),source)
})

test('controller startup, missing reports, invalid FEN and illegal tails produce no invented moves', () => {
  assert.deepEqual(chessTelemetryMap(null),{routes:[],squares:[]})
  assert.deepEqual(chessTelemetryMap(trace([{phase:'thinking',depth:0,nodes:0}])),{routes:[],squares:[]})
  const source = trace([report(3)])
  assert.deepEqual(chessTelemetryMap({...source,fen:'invalid'}),{routes:[],squares:[]})
  const invalid: EngineThinkingProgress = {phase:'thinking',depth:3,nodes:100,pv:[{from:'e2',to:'e4',san:'wrong'},{from:'e7',to:'e4',san:'fake'}]}
  const map = chessTelemetryMap(trace([invalid]))
  assert.equal(map.routes.length,1)
  assert.equal(map.routes[0].san,'e4')
})

test('history and drawing costs remain bounded across long searches', () => {
  const samples = Array.from({length:60},(_,i)=>report(i+1))
  const map = chessTelemetryMap(trace(samples))
  assert.equal(map.routes.length,48)
  assert.ok(map.squares.length<=64)
  assert.deepEqual([...new Set(map.routes.map(route=>route.depth))],[53,54,55,56,57,58,59,60])
  assert.ok(map.routes.every(route=>route.ply<=6&&!route.path.includes('NaN')))
})

test('completed bestmove differs from the last reported line without claiming that line is current', () => {
  const source = trace([report(5)])
  const map = chessTelemetryMap({...source,complete:true,played:'d4'})
  assert.equal(map.routes.length,6)
  assert.equal(map.routes.some(route=>route.current),false)
  assert.equal(map.routes.some(route=>route.san==='d4'),false)
})
