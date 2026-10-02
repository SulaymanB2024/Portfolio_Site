import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess, computerMove, gameCaption } from '../src/personal/about/chess-game.ts'

test('full game enforces check, castling, en passant and all four promotions', () => {
  const pinned = new Chess('4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1')
  assert.ok(pinned.moves({ square: 'e2', verbose: true }).every(move => move.to[0] === 'e'))
  const castle = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
  castle.move('O-O'); assert.equal(castle.get('f1')?.type, 'r'); assert.equal(castle.get('g1')?.type, 'k')
  const ep = new Chess(); for (const move of ['e4', 'a6', 'e5', 'd5', 'exd6']) ep.move(move)
  assert.equal(ep.get('d5'), undefined); assert.equal(ep.get('d6')?.type, 'p')
  const promotion = new Chess('7k/P7/8/8/8/8/8/7K w - - 0 1')
  assert.deepEqual(promotion.moves({ square: 'a7', verbose: true }).map(move => move.promotion).sort(), ['b','n','q','r'])
})
test('game status distinguishes mate and stalemate; undo restores a played move', () => {
  const game = new Chess(); const before = game.fen(); game.move('e4'); game.undo(); assert.equal(game.fen(), before)
  for (const move of ['f3','e5','g4','Qh4#']) game.move(move)
  assert.equal(gameCaption(game), 'Checkmate. Black wins.')
  assert.equal(gameCaption(new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1')), 'Stalemate. A draw.')
})
test('the bounded local opponent returns a legal move without changing its input', () => {
  const game = new Chess(); game.move('e4'); const fen = game.fen()
  const move = computerMove(fen,2,600)
  assert.ok(move); assert.doesNotThrow(()=>new Chess(fen).move(move!)); assert.equal(game.fen(),fen)
  assert.equal(computerMove('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1'),null)
})
