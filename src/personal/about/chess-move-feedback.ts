import type { Move, Square } from './vendor/chess.js'

export type PieceTravel = { from: Square; to: Square }

// A castling move carries two pieces; other moves carry only the moving piece.
export function pieceTravel(move: Move): PieceTravel[] {
  const travel = [{ from: move.from, to: move.to }]
  const rank = move.from[1]
  if (move.isKingsideCastle()) travel.push({ from: `h${rank}` as Square, to: `f${rank}` as Square })
  if (move.isQueensideCastle()) travel.push({ from: `a${rank}` as Square, to: `d${rank}` as Square })
  return travel
}

// Percentages follow the squares as the board resizes, without layout reads.
export function travelOffset(travel: PieceTravel, flipped: boolean) {
  const direction = flipped ? -1 : 1
  return {
    x: (travel.from.charCodeAt(0) - travel.to.charCodeAt(0)) * direction * 100 || 0,
    y: (Number(travel.to[1]) - Number(travel.from[1])) * direction * 100 || 0,
  }
}
