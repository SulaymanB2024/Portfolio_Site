import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess } from '../src/personal/about/vendor/chess.js'
import type { SearchTrace } from '../src/personal/about/ChessSearch'
import { parseEngineInfo } from '../src/personal/about/chess-analysis.ts'
import { createChessWorlds, worldMoveLine, worldPieceKeyframes } from '../src/personal/about/chess-worlds-model.ts'

const root = new Chess(); root.move('e4')
const fen = root.fen()
const report = (depth: number, pv: string) => parseEngineInfo(`info depth ${depth} nodes ${depth * 100} pv ${pv}`, fen)!
const trace = (samples: ReturnType<typeof report>[], latest = samples.at(-1)!): SearchTrace => ({fen,samples,latest,complete:false})

test('worlds replay actual distinct reported lines legally from the same immutable root', () => {
  const samples = [report(8,'e7e5 g1f3 b8c6'),report(9,'c7c5 g1f3 d7d6'),report(10,'e7e5 g1f3 b8c6'),report(11,'e7e6 d2d4 d7d5')]
  const model = createChessWorlds(trace(samples))
  assert.equal(model.worlds.length, 3)
  assert.deepEqual(model.worlds.map(world => world.depth), [11,10,9])
  assert.deepEqual(model.worlds.map(world => world.current), [true,false,false])
  for (const world of model.worlds) {
    const replay = new Chess(fen)
    for (const move of world.moves) assert.equal(replay.move(move).san, move.san)
    assert.equal(replay.fen(), world.fen)
    assert.deepEqual(world.pieces, replay.board().flatMap(row => row.flatMap(piece => piece ? [{square:piece.square,type:piece.type,color:piece.color}] : [])))
    const stepwise = new Chess(fen)
    assert.equal(world.frames.length, world.moves.length + 1)
    assert.equal(world.frames[0].fen, fen)
    world.moves.forEach((move,index) => { stepwise.move(move); assert.equal(world.frames[index + 1].fen,stepwise.fen()) })
    assert.equal(world.frames.at(-1)?.fen, world.fen)
  }
  assert.equal(root.fen(), fen)
  assert.match(worldMoveLine(model.worlds[0],fen), /^1… e6 2\. d4 d5$/)
})

test('six-ply cap and three-world cap cannot invent a continuation or per-world evaluation', () => {
  const latest = report(12,'e7e5 g1f3 b8c6 f1c4 g8f6 d2d3 f8c5')
  const samples = [report(6,'d7d5 e4d5'),report(7,'g8f6 e4e5'),report(8,'e7e6 d2d4'),report(9,'c7c6 d2d4'),latest]
  const model = createChessWorlds(trace(samples))
  assert.equal(model.worlds.length, 3)
  const world = model.worlds[0]
  assert.equal(world.moves.length, 6)
  assert.equal(world.frames.length, 7)
  assert.equal(world.continues, true)
  assert.equal(new Chess(world.fen).get('f8')?.type, 'b')
  assert.equal(new Chess(world.fen).get('c5'), undefined)
  assert.equal('score' in world, false)
  assert.match(worldMoveLine(world,fen), / …$/)
})

test('illegal input retains only its legal reported prefix and recalculates SAN', () => {
  const valid = report(5,'e7e5 g1f3')
  const malformed = {...valid,pv:[{...valid.pv![0],san:'Invented'}, {from:'b8',to:'b7',san:'Invented'} as const, valid.pv![1]]}
  const model = createChessWorlds(trace([malformed]))
  assert.equal(model.worlds.length, 1)
  assert.equal(model.worlds[0].moves.length, 1)
  assert.equal(model.worlds[0].moves[0].san, 'e5')
  assert.equal(model.worlds[0].partial, true)
  assert.equal(new Chess(model.worlds[0].fen).get('g1')?.type, 'n')
  assert.equal(createChessWorlds({...trace([valid]),fen:'invalid'}).worlds.length, 0)
})

test('settled actual bestmove is metadata and never fabricated into a different reported world', () => {
  const source = trace([report(8,'e7e5 g1f3 b8c6')])
  const settled = createChessWorlds({...source,complete:true,played:'c5'})
  assert.equal(settled.played, 'c5')
  assert.equal(settled.settled, true)
  assert.equal(settled.worlds[0].current, false)
  assert.equal(settled.worlds[0].moves[0].san, 'e5')
  assert.equal(new Chess(settled.worlds[0].fen).get('c7')?.type, 'p')
  assert.equal(createChessWorlds({...source,complete:true,played:'e5'}).worlds[0].current, true)
})

test('empty and invalid first moves produce no fake worlds', () => {
  assert.deepEqual(createChessWorlds(null).worlds, [])
  assert.equal(createChessWorlds(trace([report(1,'e2e4')])).worlds.length, 0)
  assert.equal(createChessWorlds(trace([report(1,'')])).worlds.length, 0)
})

test('world piece snapshots preserve legal castling and promotion from custom roots', () => {
  for (const [rootFen, pv] of [
    ['r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1g1'],
    ['7k/5P2/6K1/8/8/8/8/8 w - - 0 1', 'f7f8q'],
  ]) {
    const latest = parseEngineInfo(`info depth 8 nodes 1000 pv ${pv}`, rootFen)!
    const world = createChessWorlds({fen:rootFen,latest,samples:[latest],complete:false}).worlds[0]
    const position = new Chess(world.fen)
    if (pv === 'e1g1') {
      assert.equal(position.get('g1')?.type,'k'); assert.equal(position.get('f1')?.type,'r'); assert.equal(position.get('h1'),undefined)
      assert.deepEqual(world.tracks.find(track => track.id === 'wk@e1')?.squares,['e1','g1'])
      assert.deepEqual(world.tracks.find(track => track.id === 'wr@h1')?.squares,['h1','f1'])
    } else {
      assert.equal(position.get('f8')?.type,'q'); assert.equal(position.get('f7'),undefined); assert.equal(world.moves[0].san,'f8=Q#')
      const pawn = world.tracks.find(track => track.id === 'wp@f7')!
      assert.deepEqual(pawn.squares,['f7','f8']); assert.equal(pawn.initialType,'p'); assert.equal(pawn.finalType,'q'); assert.equal(pawn.promotionAt,1)
      assert.equal(worldPieceKeyframes(pawn)[0].promoted,0); assert.equal(worldPieceKeyframes(pawn).at(-1)?.promoted,1)
    }
  }
})

test('en-passant identities remove the captured pawn and CSS motion ends at the legal final snapshot', () => {
  const game = new Chess()
  for (const san of ['e4','a6','e5','d5']) game.move(san)
  const rootFen = game.fen()
  const latest = parseEngineInfo('info depth 8 nodes 1000 pv e5d6',rootFen)!
  const world = createChessWorlds({fen:rootFen,latest,samples:[latest],complete:false}).worlds[0]
  const pawn = world.tracks.find(track => track.id === 'wp@e5')!
  const captured = world.tracks.find(track => track.id === 'bp@d5')!
  assert.deepEqual(pawn.squares,['e5','d6'])
  assert.deepEqual(captured.squares,['d5',null])
  const motion = worldPieceKeyframes(pawn)
  assert.deepEqual(motion[0],{percent:0,x:400,y:300,opacity:1,promoted:0})
  assert.deepEqual(motion.at(-1),{percent:100,x:300,y:200,opacity:1,promoted:0})
  assert.equal(worldPieceKeyframes(captured).at(-1)?.opacity,0)
  assert.ok(world.frames.at(-1)?.pieces.every(piece => piece.id !== captured.id))
  assert.equal(world.tracks.find(track => track.id === 'wk@e1')?.moving,false)
})

test('depth-only reports preserve preview identity and exact trajectories', () => {
  const first = report(8,'e7e5 g1f3 b8c6')
  const next = {...first,depth:9,nodes:2000}
  const before = createChessWorlds(trace([first])).worlds[0]
  const after = createChessWorlds(trace([first,next])).worlds[0]
  assert.equal(before.id,after.id)
  assert.deepEqual(before.frames,after.frames)
  assert.deepEqual(before.tracks,after.tracks)
  assert.equal(after.depth,9)
})
