import { Chess } from './vendor/chess.js'

export { Chess }
export const pieceNames = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' } as const

export function gameCaption(game: Chess) {
  const side = game.turn() === 'w' ? 'White' : 'Black'
  if (game.isCheckmate()) return `Checkmate. ${side === 'White' ? 'Black' : 'White'} wins.`
  if (game.isStalemate()) return 'Stalemate. A draw.'
  if (game.isThreefoldRepetition()) return 'Draw by repetition.'
  if (game.isInsufficientMaterial()) return 'Draw. Not enough material to give mate.'
  if (game.isDraw()) return 'Draw by the fifty-move rule.'
  return `${side} to move.${game.isCheck() ? ' In check.' : ''}`
}
