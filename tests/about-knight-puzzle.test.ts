import test from 'node:test'
import assert from 'node:assert/strict'
import { knightMoves, moveKnight, puzzleResult, squareCoordinates } from '../src/personal/about/knight-puzzle.ts'

test('all board moves are legal, reversible L jumps without wrapping edges', () => {
  for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) {
    const from = `${String.fromCharCode(97 + x)}${y + 1}`
    for (const to of knightMoves(from)) {
      const [nx, ny] = squareCoordinates(to)
      assert.deepEqual([Math.abs(nx - x), Math.abs(ny - y)].sort(), [1, 2])
      assert(knightMoves(to).includes(from))
    }
  }
  assert.deepEqual(knightMoves('a1'), ['b3', 'c2'])
  assert.deepEqual(knightMoves('h8'), ['f7', 'g6'])
})

test('the six-move challenge is solvable and rejects illegal and late moves', () => {
  let path = ['a1']
  assert.deepEqual(moveKnight(path, 'h8'), path)
  for (const square of ['b3', 'd4', 'f5', 'h6', 'f7', 'h8']) path = moveKnight(path, square)
  assert.equal(path.length, 7)
  assert.equal(puzzleResult(path), 'solved')
  assert.deepEqual(moveKnight(path, 'g6'), path)
  const spent = ['a1', 'b3', 'a1', 'b3', 'a1', 'b3', 'a1']
  assert.equal(puzzleResult(spent), 'finished')
  assert.deepEqual(moveKnight(spent, 'b3'), spent)
})

test('H8 cannot be reached in fewer than six moves', () => {
  let reachable = new Set(['a1'])
  for (let step = 1; step <= 6; step++) {
    reachable = new Set([...reachable].flatMap(knightMoves))
    assert.equal(reachable.has('h8'), step === 6)
  }
})
