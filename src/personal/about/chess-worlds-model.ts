import { Chess, type Color, type PieceSymbol, type Square } from './vendor/chess.js'
import type { SearchTrace } from './ChessSearch'
import type { EnginePvMove, EngineThinkingProgress } from './chess-analysis'

export type ChessWorld = {
  id: string; depth: number; current: boolean; latest: boolean
  fen: string; moves: EnginePvMove[]; continues: boolean; partial: boolean
  pieces: { square: Square; type: PieceSymbol; color: Color }[]
  lastMove: { from: Square; to: Square }
  frames: WorldFrame[]; tracks: WorldPieceTrack[]
}
export type WorldFramePiece = { id: string; square: Square; type: PieceSymbol; color: Color }
export type WorldFrame = { fen: string; pieces: WorldFramePiece[] }
export type WorldPieceTrack = { id: string; color: Color; initialType: PieceSymbol; finalType: PieceSymbol; squares: (Square | null)[]; promotionAt: number | null; moving: boolean }
export type ChessWorldsModel = { worlds: ChessWorld[]; played?: string; settled: boolean; rootFen: string }

/** Replay only reported moves from the immutable root. No inferred continuations or scores. */
export function createChessWorlds(trace: SearchTrace | null): ChessWorldsModel {
  const model: ChessWorldsModel = { worlds: [], settled: !!trace?.complete, rootFen: trace?.fen ?? '', ...(trace?.complete && trace.played ? { played: trace.played } : {}) }
  if (!trace) return model
  try { new Chess(trace.fen) } catch { return model }
  const retained = trace.samples.filter(report => report.depth > 0).slice(-8)
  const reports: EngineThinkingProgress[] = [trace.latest, ...retained.slice().reverse().filter(report => report.depth !== trace.latest.depth)]
  const seen = new Set<string>()
  for (const report of reports.slice(0, 8)) {
    if (!report.pv?.length) continue
    const game = new Chess(trace.fen)
    const identities = new Map<Square, string>()
    game.board().flat().forEach(piece => { if (piece) identities.set(piece.square, `${piece.color}${piece.type}@${piece.square}`) })
    const snapshot = (): WorldFrame => ({fen:game.fen(),pieces:game.board().flatMap(row => row.flatMap(piece => piece ? [{id:identities.get(piece.square)!,square:piece.square,type:piece.type,color:piece.color}] : []))})
    const frames: WorldFrame[] = [snapshot()]
    const moves: EnginePvMove[] = []
    let partial = !!report.pvTruncated
    for (const proposed of report.pv.slice(0, 6)) {
      try {
        const played = game.move({ from: proposed.from, to: proposed.to, ...(proposed.promotion ? { promotion: proposed.promotion } : {}) })
        const identity = identities.get(played.from)!
        identities.delete(played.from)
        identities.delete(played.to)
        if (played.isEnPassant()) identities.delete(`${played.to[0]}${played.from[1]}` as Square)
        identities.set(played.to, identity)
        if (played.isKingsideCastle() || played.isQueensideCastle()) {
          const rank = played.from[1], rookFrom = `${played.isKingsideCastle() ? 'h' : 'a'}${rank}` as Square
          const rookTo = `${played.isKingsideCastle() ? 'f' : 'd'}${rank}` as Square
          const rook = identities.get(rookFrom)!
          identities.delete(rookFrom); identities.set(rookTo, rook)
        }
        moves.push({ from: played.from, to: played.to, san: played.san, ...(played.promotion ? { promotion: played.promotion } : {}) })
        frames.push(snapshot())
      } catch { partial = true; break }
    }
    if (!moves.length) continue
    const path = moves.map(move => `${move.from}${move.to}${move.promotion ?? ''}`).join('/')
    if (seen.has(path)) continue
    seen.add(path)
    const latest = report === trace.latest
    const current = latest && (!model.played || model.played === moves[0].san)
    const last = moves.at(-1)!
    const tracks = frames[0].pieces.map(piece => {
      const states = frames.map(frame => frame.pieces.find(state => state.id === piece.id))
      const squares = states.map(state => state?.square ?? null)
      const finalType = states.slice().reverse().find(state => !!state)?.type ?? piece.type
      const promoted = states.findIndex(state => !!state && state.type !== piece.type)
      return {id:piece.id,color:piece.color,initialType:piece.type,finalType,squares,promotionAt:promoted < 0 ? null : promoted,moving:squares.some(square => square !== squares[0]) || finalType !== piece.type}
    })
    model.worlds.push({
      id: `${trace.fen}/${path}`, depth: report.depth, current, latest,
      fen: game.fen(), moves, continues: !partial && report.pv.length > 6, partial,
      pieces: game.board().flatMap(row => row.flatMap(piece => piece ? [{ square: piece.square, type: piece.type, color: piece.color }] : [])),
      lastMove: { from: last.from, to: last.to },
      frames, tracks,
    })
    if (model.worlds.length === 3) break
  }
  return model
}

/** CSS endpoints come only from legal snapshots; holds make each reported ply readable. */
export function worldPieceKeyframes(track: WorldPieceTrack) {
  const count = track.squares.length - 1
  const position = (index: number) => {
    const square = track.squares[index] ?? track.squares.slice(0,index).reverse().find(value => value !== null) ?? track.squares[0]!
    return { x:'abcdefgh'.indexOf(square![0]) * 100, y:(8 - Number(square![1])) * 100, opacity:track.squares[index] ? 1 : 0, promoted:track.promotionAt !== null && index >= track.promotionAt ? 1 : 0 }
  }
  const result = [{percent:0,...position(0)}]
  for (let ply = 1; ply <= count; ply++) {
    const prior = position(ply - 1), next = position(ply)
    result.push({percent:(ply - .86) / count * 100,...prior})
    result.push({percent:(ply - .12) / count * 100,...next,opacity:prior.opacity,promoted:prior.promoted})
    result.push({percent:ply / count * 100,...next})
  }
  return result
}

export function worldMoveLine(world: ChessWorld, rootFen: string) {
  const fields = rootFen.split(/\s+/)
  const black = fields[1] === 'b', first = Number(fields[5]) || 1
  const sequence = world.moves.map((move, index) => {
    const offset = index + Number(black)
    const number = first + Math.floor(offset / 2)
    return `${offset % 2 === 0 ? `${number}. ` : index === 0 ? `${number}… ` : ''}${move.san}`
  }).join(' ')
  return `${sequence}${world.continues || world.partial ? ' …' : ''}`
}
