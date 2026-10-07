import { Chess } from './chess-game.ts'
import { createThinkingModel } from './chess-thinking-model.ts'
import type { SearchTrace } from './ChessSearch'

const point = (square: string) => ({ x: 16 + (square.charCodeAt(0) - 97 + .5) * 24, y: 16 + (8 - Number(square[1]) + .5) * 24 })

/** Spatial traces of reported PV moves, never inferred engine search branches. */
export function chessTelemetryMap(trace: SearchTrace | null) {
  const model = createThinkingModel(trace)
  const routes: { id: string; from: string; to: string; san: string; depth: number; ply: number; current: boolean; path: string }[] = []
  const squares = new Map<string, { square: string; x: number; y: number; visits: number; current: boolean }>()
  if (!trace || !model.lines.length) return { routes, squares: [] }
  const nodes = new Map(model.nodes.map(node => [node.id, node]))
  for (const line of model.lines) {
    let position: Chess
    try { position = new Chess(trace.fen) } catch { return { routes: [], squares: [] } }
    for (const [index, id] of line.ids.entries()) {
      const node = nodes.get(id)
      if (!node) break
      let move
      try { move = position.move(node.move) } catch { break }
      const from = point(move.from), to = point(move.to)
      const bend = (index % 2 ? -1 : 1) * .22
      const cx = (from.x + to.x) / 2 + (to.y - from.y) * bend
      const cy = (from.y + to.y) / 2 - (to.x - from.x) * bend
      routes.push({ id: `${line.depth}:${id}`, from: move.from, to: move.to, san: move.san, depth: line.depth, ply: index + 1, current: line.current, path: `M${from.x} ${from.y}Q${cx} ${cy} ${to.x} ${to.y}` })
      for (const square of [move.from, move.to]) {
        const entry = squares.get(square) ?? { square, ...point(square), visits: 0, current: false }
        entry.visits++; entry.current ||= line.current
        squares.set(square, entry)
      }
    }
  }
  return { routes, squares: [...squares.values()] }
}
