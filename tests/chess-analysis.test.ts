import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess } from '../src/personal/about/vendor/chess.js'
import {
  appendDepthSample, formatEngineScore, formatPrincipalVariation, parseEngineInfo,
  type EngineThinkingProgress,
} from '../src/personal/about/chess-analysis.ts'

const whiteFen = new Chess().fen()
const black = new Chess(); black.move('e4')
const blackFen = black.fen()

test('main-PV info preserves reported statistics and converts scores to White perspective', () => {
  const white = parseEngineInfo('info score cp 37 depth 18 seldepth 25 multipv 1 nodes 240001 nps 120000 time 2000 pv e2e4 e7e5 g1f3', whiteFen)
  assert.deepEqual(white, {
    phase: 'thinking', depth: 18, nodes: 240001, seldepth: 25, timeMs: 2000, nps: 120000,
    score: { kind: 'cp', value: 37 },
    pv: [{ from:'e2',to:'e4',san:'e4' },{ from:'e7',to:'e5',san:'e5' },{ from:'g1',to:'f3',san:'Nf3' }],
  })
  assert.deepEqual(parseEngineInfo('info depth 10 nodes 1000 score cp 42 upperbound', blackFen)?.score,
    { kind:'cp',value:-42,bound:'lower' })
  assert.deepEqual(parseEngineInfo('info depth 10 nodes 1000 score cp -75 lowerbound', blackFen)?.score,
    { kind:'cp',value:75,bound:'upper' })
  assert.deepEqual(parseEngineInfo('info depth 10 nodes 1000 score cp -75 lowerbound', whiteFen)?.score,
    { kind:'cp',value:-75,bound:'lower' })
})

test('mate distances and their bounds change perspective without becoming centipawns or plies', () => {
  assert.deepEqual(parseEngineInfo('info depth 5 nodes 999 score mate 3 lowerbound', whiteFen)?.score,
    { kind:'mate',value:3,bound:'lower' })
  assert.deepEqual(parseEngineInfo('info depth 5 nodes 999 score mate 3 lowerbound', blackFen)?.score,
    { kind:'mate',value:-3,bound:'upper' })
  assert.deepEqual(parseEngineInfo('info depth 5 nodes 999 score mate -2 upperbound', blackFen)?.score,
    { kind:'mate',value:2,bound:'lower' })
  assert.deepEqual(parseEngineInfo('info depth 5 nodes 999 score mate 0', blackFen)?.score,
    { kind:'mate',value:0 })
})

test('missing or malformed data stays absent; currmove, string and alternate-PV lines are ignored', () => {
  const statistics = { phase:'thinking',depth:4,nodes:100 }
  assert.deepEqual(parseEngineInfo('info depth 4 nodes 100', whiteFen), statistics)
  assert.deepEqual(parseEngineInfo('info depth 4 nodes 100 score cp NaN time -2 nps 2.5 seldepth Infinity', whiteFen), statistics)
  assert.deepEqual(parseEngineInfo('info depth 4 nodes 100 score cp 20 lowerbound upperbound', whiteFen), statistics)
  assert.deepEqual(parseEngineInfo('info depth 4 nodes 100 time 0 nps 0 seldepth 0', whiteFen),
    {...statistics,timeMs:0,nps:0,seldepth:0})
  for (const line of [
    'info depth 4 currmove e2e4 currmovenumber 1', 'info depth -1 nodes 100',
    'info depth 4 nodes 9007199254740993', 'info depth 4 nodes 100 multipv 2 score cp 20 pv e2e4',
    'info depth 4 nodes 100 multipv NaN', 'info string depth 4 nodes 100 score cp 10',
    'info depth 4 nodes 100 string score cp 10', 'bestmove e2e4',
  ]) assert.equal(parseEngineInfo(line, whiteFen), null, line)
  assert.equal(parseEngineInfo('info depth 1 nodes 20', 'invalid FEN'), null)
})

test('every PV starts from the immutable root; only the legal prefix receives SAN', () => {
  const first = parseEngineInfo('info depth 5 nodes 999 pv e7e5 g1f3 b8c6', blackFen)
  assert.deepEqual(first?.pv?.map(move => move.san), ['e5','Nf3','Nc6'])
  const next = parseEngineInfo('info depth 6 nodes 1999 pv c7c5 g1f3 d7d6', blackFen)
  assert.deepEqual(next?.pv?.map(move => move.san), ['c5','Nf3','d6'])
  assert.equal(black.fen(), blackFen)
  for (const invalid of ['b8b7','garbage','0000']) {
    const parsed = parseEngineInfo(`info depth 7 nodes 3000 pv e2e4 e7e5 g1f3 ${invalid} f1c4`, whiteFen)
    assert.deepEqual(parsed?.pv?.map(move => move.san), ['e4','e5','Nf3'])
    assert.equal(parsed?.pvTruncated, true)
  }
  assert.deepEqual(parseEngineInfo('info depth 1 nodes 20 pv e7e5 e2e4', whiteFen)?.pv, [])
  assert.equal(parseEngineInfo('info depth 1 nodes 20 pv e7e5 e2e4', whiteFen)?.pvTruncated, true)
  assert.equal(parseEngineInfo('info depth 1 nodes 20', whiteFen)?.pv, undefined)
})

test('PV SAN respects castling, en passant, promotions and mate', () => {
  const castleFen = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1'
  assert.deepEqual(parseEngineInfo('info depth 5 nodes 1000 pv e1g1 e8c8', castleFen)?.pv?.map(move => move.san), ['O-O','O-O-O'])
  const ep = new Chess()
  for (const san of ['e4','a6','e5','d5']) ep.move(san)
  assert.equal(parseEngineInfo('info depth 5 nodes 1000 pv e5d6', ep.fen())?.pv?.[0].san, 'exd6')
  const promotion = parseEngineInfo('info depth 5 nodes 1000 score mate 1 pv f7f8q', '7k/5P2/6K1/8/8/8/8/8 w - - 0 1')
  assert.deepEqual(promotion?.pv, [{from:'f7',to:'f8',promotion:'q',san:'f8=Q#'}])
})

test('depth samples are immutable, bounded, replace the same depth and exclude controller startup', () => {
  const samples: EngineThinkingProgress[] = []
  let retained = samples
  for (let depth = 1; depth <= 40; depth++) retained = appendDepthSample(retained, {phase:'thinking',depth,nodes:depth * 100}, 4)
  assert.deepEqual(samples, [])
  assert.deepEqual(retained.map(sample => sample.depth), [37,38,39,40])
  const replaced = appendDepthSample(retained, {phase:'thinking',depth:39,nodes:9999,score:{kind:'cp',value:25}}, 4)
  assert.deepEqual(replaced.map(sample => sample.depth), [37,38,39,40])
  assert.equal(replaced[2].nodes, 9999)
  assert.equal(retained[2].nodes, 3900)
  assert.equal(retained[2].score, undefined)
  assert.deepEqual(appendDepthSample([], {phase:'thinking',depth:0,nodes:0}), [])
  assert.deepEqual(appendDepthSample(retained, retained[0], 0), [])
})

test('score and SAN formatting preserves perspective, bounds and root move numbers', () => {
  assert.equal(formatEngineScore(undefined), '—')
  assert.equal(formatEngineScore({kind:'cp',value:37}), '+0.37')
  assert.equal(formatEngineScore({kind:'cp',value:-25,bound:'upper'}), '≤ -0.25')
  assert.equal(formatEngineScore({kind:'cp',value:0}), '+0.00')
  assert.equal(formatEngineScore({kind:'mate',value:-3,bound:'lower'}), '≥ -M3')
  assert.equal(formatEngineScore({kind:'mate',value:2}), 'M2')
  const whitePv = parseEngineInfo('info depth 5 nodes 1000 pv e2e4 e7e5 g1f3', whiteFen)?.pv
  const blackPv = parseEngineInfo('info depth 5 nodes 1000 pv e7e5 g1f3 b8c6', blackFen)?.pv
  assert.equal(formatPrincipalVariation(whitePv, whiteFen), '1. e4 e5 2. Nf3')
  assert.equal(formatPrincipalVariation(blackPv, blackFen), '1... e5 2. Nf3 Nc6')
  assert.equal(formatPrincipalVariation(blackPv, blackFen.replace(/1$/, '27')), '27... e5 28. Nf3 Nc6')
  assert.equal(formatPrincipalVariation(whitePv, whiteFen, 2), '1. e4 e5 …')
  assert.equal(formatPrincipalVariation(undefined, whiteFen), '—')
})
