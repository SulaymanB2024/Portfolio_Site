import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess } from '../src/personal/about/vendor/chess.js'
import { parseEngineInfo } from '../src/personal/about/chess-analysis.ts'
import { createChessWorlds } from '../src/personal/about/chess-worlds-model.ts'
import { continuationPieceKeyframes, continuationTiming } from '../src/personal/about/chess-continuation-animation.ts'

const world = (fen: string, pv: string) => {
  const latest = parseEngineInfo(`info depth 12 nodes 4000 pv ${pv}`, fen)!
  return createChessWorlds({ fen, latest, samples: [latest], complete: true }).worlds[0]
}

test('castling moves both king and rook on the same clock into actual board cells', () => {
  const line = world('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1', 'e1g1 e8c8')
  const king = continuationPieceKeyframes(line.tracks.find((track) => track.id === 'wk@e1')!)
  const rook = continuationPieceKeyframes(line.tracks.find((track) => track.id === 'wr@h1')!)
  assert.deepEqual(
    king.map((frame) => frame.percent),
    rook.map((frame) => frame.percent)
  )
  assert.deepEqual(king[0], { percent: 0, x: 208, y: 352, opacity: 1, promoted: 0 })
  assert.deepEqual(rook[0], { percent: 0, x: 352, y: 352, opacity: 1, promoted: 0 })
  assert.deepEqual(king.at(-1), { percent: 100, x: 304, y: 352, opacity: 1, promoted: 0 })
  assert.deepEqual(rook.at(-1), { percent: 100, x: 256, y: 352, opacity: 1, promoted: 0 })
  const timing = continuationTiming(line.moves.length)
  const landing = ((timing.lead + timing.step) / timing.duration) * 100
  assert.ok(king.some((frame) => frame.percent === landing && frame.x === 304))
  assert.ok(rook.some((frame) => frame.percent === landing && frame.x === 256))
})

test('an en-passant victim fades at its actual square and stays absent through the final hold', () => {
  const game = new Chess()
  for (const san of ['e4', 'a6', 'e5', 'd5']) game.move(san)
  const line = world(game.fen(), 'e5d6 e7d6')
  const victim = continuationPieceKeyframes(line.tracks.find((track) => track.id === 'bp@d5')!)
  assert.ok(victim.every((frame) => frame.x === 160 && frame.y === 160))
  assert.equal(victim[0].opacity, 1)
  const timing = continuationTiming(line.moves.length)
  const capture = ((timing.lead + timing.step) / timing.duration) * 100
  assert.ok(victim.filter((frame) => frame.percent >= capture).every((frame) => frame.opacity === 0))
  const attacker = continuationPieceKeyframes(line.tracks.find((track) => track.id === 'wp@e5')!)
  assert.equal(attacker[0].opacity, 1)
  assert.deepEqual(attacker.at(-1), { percent: 100, x: 160, y: 112, opacity: 0, promoted: 0 })
})

test('promotion retains the pawn identity and switches its silhouette only after arrival', () => {
  const line = world('7k/5P2/6K1/8/8/8/8/8 w - - 0 1', 'f7f8q')
  const pawn = line.tracks.find((track) => track.id === 'wp@f7')!
  const frames = continuationPieceKeyframes(pawn)
  assert.equal(pawn.finalType, 'q')
  assert.equal(frames[0].promoted, 0)
  const promoted = frames.find((frame) => frame.promoted === 1)!
  assert.deepEqual({ x: promoted.x, y: promoted.y, opacity: promoted.opacity }, { x: 256, y: 16, opacity: 1 })
  assert.equal(frames.at(-1)?.promoted, 1)
  assert.ok(frames.filter((frame) => frame.y > 16).every((frame) => frame.promoted === 0))
})

test('six reported plies have bounded, ordered frames with a readable final hold', () => {
  const line = world(new Chess().fen(), 'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4')
  assert.equal(line.moves.length, 6)
  const timing = continuationTiming(line.moves.length)
  const settledAt = ((timing.lead + timing.count * timing.step) / timing.duration) * 100
  assert.ok(timing.hold >= timing.step)
  for (const track of line.tracks) {
    const frames = continuationPieceKeyframes(track)
    assert.ok(
      frames.every((frame, index) => Number.isFinite(frame.percent) && frame.percent >= 0 && frame.percent <= 100 && (index === 0 || frame.percent >= frames[index - 1].percent))
    )
    const final = frames.at(-1)!
    assert.ok(final.x >= 16 && final.x <= 352 && final.y >= 16 && final.y <= 352)
    assert.ok(
      frames
        .filter((frame) => frame.percent >= settledAt)
        .every((frame) => frame.x === final.x && frame.y === final.y && frame.opacity === final.opacity && frame.promoted === final.promoted)
    )
  }
})
