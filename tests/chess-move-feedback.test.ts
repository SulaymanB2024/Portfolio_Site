import test from 'node:test'
import assert from 'node:assert/strict'
import { Chess } from '../src/personal/about/chess-game.ts'
import { pieceTravel, travelOffset } from '../src/personal/about/chess-move-feedback.ts'

test('castling carries the king and rook to their actual final squares', () => {
  const kingside = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1')
  const white = pieceTravel(kingside.move('O-O'))
  assert.deepEqual(white, [{from:'e1',to:'g1'},{from:'h1',to:'f1'}])
  assert.deepEqual(white.map(move => travelOffset(move, false)), [{x:-200,y:0},{x:200,y:0}])
  const black = pieceTravel(kingside.move('O-O-O'))
  assert.deepEqual(black, [{from:'e8',to:'c8'},{from:'a8',to:'d8'}])
  assert.deepEqual(black.map(move => travelOffset(move, true)), [{x:-200,y:0},{x:300,y:0}])
})

test('piece travel follows the visual orientation for a pawn and knight', () => {
  const game = new Chess()
  const pawn = pieceTravel(game.move('e4'))[0]
  assert.deepEqual(travelOffset(pawn, false), {x:0,y:200})
  assert.deepEqual(travelOffset(pawn, true), {x:0,y:-200})
  game.move('e5')
  const knight = pieceTravel(game.move('Nf3'))[0]
  assert.deepEqual(travelOffset(knight, false), {x:100,y:200})
  assert.deepEqual(travelOffset(knight, true), {x:-100,y:-200})
})

test('captures and promotion animate only the moving piece', () => {
  const game = new Chess()
  for (const move of ['e4','a6','e5','d5']) game.move(move)
  assert.deepEqual(pieceTravel(game.move('exd6')), [{from:'e5',to:'d6'}])
  const promotion = new Chess('7k/P7/8/8/8/8/8/7K w - - 0 1')
  assert.deepEqual(pieceTravel(promotion.move({from:'a7',to:'a8',promotion:'n'})), [{from:'a7',to:'a8'}])
})
