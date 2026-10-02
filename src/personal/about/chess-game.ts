import { Chess, type Move, type PieceSymbol } from './vendor/chess.js'

export { Chess }
export const pieceNames = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' } as const
const values = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }

export function gameCaption(game: Chess) {
  const side = game.turn() === 'w' ? 'White' : 'Black'
  if (game.isCheckmate()) return `Checkmate. ${side === 'White' ? 'Black' : 'White'} wins.`
  if (game.isStalemate()) return 'Stalemate. A draw.'
  if (game.isThreefoldRepetition()) return 'Draw by repetition.'
  if (game.isInsufficientMaterial()) return 'Draw. Not enough material to give mate.'
  if (game.isDraw()) return 'Draw by the fifty-move rule.'
  return `${side} to move.${game.isCheck() ? ' In check.' : ''}`
}

function evaluate(game: Chess) {
  if (game.isCheckmate()) return game.turn() === 'w' ? -100000 : 100000
  if (game.isDraw()) return 0
  let score = 0
  for (const rank of game.board()) for (const piece of rank) {
    if (!piece) continue
    const file = piece.square.charCodeAt(0) - 97, row = Number(piece.square[1]) - 1
    const center = 3.5 - (Math.abs(file - 3.5) + Math.abs(row - 3.5)) / 2
    const advance = piece.color === 'w' ? row : 7 - row
    score += (piece.color === 'w' ? 1 : -1) * (values[piece.type] + (piece.type === 'p' ? advance * 8 : piece.type === 'n' || piece.type === 'b' ? center * 15 : 0))
  }
  return score
}
const ordered = (moves: Move[]) => moves.sort((a, b) => (b.captured ? values[b.captured] : 0) - (a.captured ? values[a.captured] : 0) + (b.promotion ? 800 : 0) - (a.promotion ? 800 : 0))

/** Small local practice opponent, deliberately bounded and run in a worker. */
export function computerMove(fen: string, depth = 2, maxNodes = 5000) {
  const game = new Chess(fen)
  let nodes = 0
  function search(remaining: number, alpha: number, beta: number): number {
    nodes++
    if (remaining === 0 || game.isGameOver() || nodes >= maxNodes) return evaluate(game)
    const maximize = game.turn() === 'w'
    let value = maximize ? -Infinity : Infinity
    for (const move of ordered(game.moves({ verbose: true }))) {
      game.move(move)
      const score = search(remaining - 1, alpha, beta)
      game.undo()
      value = maximize ? Math.max(value, score) : Math.min(value, score)
      if (maximize) alpha = Math.max(alpha, value); else beta = Math.min(beta, value)
      if (beta <= alpha || nodes >= maxNodes) break
    }
    return value
  }
  const maximize = game.turn() === 'w'
  let best: Move | null = null, bestScore = maximize ? -Infinity : Infinity
  for (const move of ordered(game.moves({ verbose: true }))) {
    game.move(move)
    const score = search(Math.max(0, Math.min(2, depth - 1)), -Infinity, Infinity)
    game.undo()
    if (!best || (maximize ? score > bestScore : score < bestScore)) { best = move; bestScore = score }
    if (nodes >= maxNodes) break
  }
  return best ? { from: best.from, to: best.to, promotion: best.promotion as PieceSymbol | undefined } : null
}
