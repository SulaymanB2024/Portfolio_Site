import type { SearchTrace } from './ChessSearch'
import type { EnginePvMove, EngineThinkingProgress } from './chess-analysis'

export type ThinkingNode = {
  id: string; parent: string | null; move: EnginePvMove; ply: number
  current: boolean; reportDepths: number[]; endDepths: number[]; newest: number; hasMore: boolean
}
export type ThinkingLine = { depth: number; ids: string[]; current: boolean }
export type ThinkingModel = {
  nodes: ThinkingNode[]; lines: ThinkingLine[]; currentIds: string[]
  move: string | undefined; moveLabel: 'Candidate' | 'Played' | 'Searched move'
  reportKey: string; firstMove: number; blackFirst: boolean
}
export type ThinkingLayout = {
  width: number; height: number; plies: number
  nodes: (ThinkingNode & { x: number; y: number; continues: boolean })[]
  edges: { id: string; path: string; current: boolean }[]
  currentPath: string
}

const uci = (move: EnginePvMove) => `${move.from}${move.to}${move.promotion ?? ''}`
const idsFor = (moves: readonly EnginePvMove[]) => {
  let prefix = ''
  return moves.slice(0, 6).map(move => (prefix += `/${uci(move)}`))
}

/** This is a trie of reported best lines, with no inferred sibling moves. */
export function createThinkingModel(trace: SearchTrace | null): ThinkingModel {
  const latest = trace?.latest
  let reports: EngineThinkingProgress[] = (trace?.samples ?? []).filter(sample => sample.depth > 0).slice(-8)
  if (latest && latest.depth > 0) reports = [...reports.filter(sample => sample.depth !== latest.depth), latest].slice(-8)
  const candidate = latest?.pv?.[0]?.san
  const played = trace?.complete ? trace.played : undefined
  // A final bestmove can differ from the last info PV. Keep that distinction visible.
  const currentIds = played && played !== candidate ? [] : idsFor(latest?.pv ?? [])
  const currentSet = new Set(currentIds)
  const nodes = new Map<string, ThinkingNode>()
  const lines: ThinkingLine[] = []
  reports.forEach((report, index) => {
    const moves = (report.pv ?? []).slice(0, 6)
    const ids = idsFor(moves)
    if (!ids.length) return
    lines.push({ depth: report.depth, ids, current: report === latest && currentIds.length > 0 })
    moves.forEach((move, ply) => {
      const id = ids[ply]
      const existing = nodes.get(id)
      if (existing) {
        if (!existing.reportDepths.includes(report.depth)) existing.reportDepths.push(report.depth)
        if (ply === moves.length - 1 && !existing.endDepths.includes(report.depth)) existing.endDepths.push(report.depth)
        existing.newest = index
        existing.hasMore ||= ply === 5 && (report.pv?.length ?? 0) > 6
      } else nodes.set(id, {
        id, parent: ply ? ids[ply - 1] : null, move, ply: ply + 1,
        current: currentSet.has(id), reportDepths: [report.depth],
        endDepths: ply === moves.length - 1 ? [report.depth] : [], newest: index,
        hasMore: ply === 5 && (report.pv?.length ?? 0) > 6,
      })
    })
  })
  const fields = trace?.fen.split(/\s+/)
  return {
    nodes: [...nodes.values()], lines, currentIds,
    move: played ?? candidate, moveLabel: played ? 'Played' : trace?.complete ? 'Searched move' : 'Candidate',
    reportKey: `${trace?.fen ?? ''}/${latest?.depth ?? ''}/${latest?.nodes ?? ''}/${latest?.timeMs ?? ''}/${currentIds.join(',')}`,
    firstMove: Number(fields?.[5]) || 1, blackFirst: fields?.[1] === 'b',
  }
}

/** Stable prefix identity; newest/current branches appear first without fake tree expansion. */
export function layoutThinkingGraph(model: ThinkingModel, compact = false): ThinkingLayout {
  const plies = compact ? 4 : 6
  const width = compact ? 320 : 720
  const xFor = (ply: number) => compact ? 43 + (ply - 1) * 76 : 64 + (ply - 1) * 120
  const visible = model.nodes.filter(node => node.ply <= plies)
  const children = new Map<string | null, ThinkingNode[]>()
  for (const node of visible) children.set(node.parent, [...(children.get(node.parent) ?? []), node])
  for (const siblings of children.values()) siblings.sort((a, b) => Number(b.current) - Number(a.current) || b.newest - a.newest || a.id.localeCompare(b.id))
  const positions = new Map<string, number>()
  let leaves = 0
  const place = (node: ThinkingNode): number => {
    const branch = children.get(node.id) ?? []
    const y = branch.length ? branch.map(place).reduce((sum, value) => sum + value, 0) / branch.length : 44 + leaves++ * 28
    positions.set(node.id, y)
    return y
  }
  const roots = children.get(null) ?? []
  roots.forEach(place)
  const height = Math.max(116, 44 + Math.max(0, leaves - 1) * 28 + 27)
  const shift = leaves === 1 ? 18 : 0
  const nodes = visible.map(node => ({ ...node, x: xFor(node.ply), y: positions.get(node.id)! + shift, continues: node.hasMore || model.nodes.some(child => child.parent === node.id && child.ply > plies) }))
  const byId = new Map(nodes.map(node => [node.id, node]))
  const rootY = roots.length ? roots.reduce((sum, node) => sum + positions.get(node.id)! + shift, 0) / roots.length : 62
  const halfLabel = compact ? 28 : 36
  const edges = nodes.map(node => {
    const parent = node.parent ? byId.get(node.parent)! : undefined
    const fromX = parent ? parent.x + halfLabel : 5
    const fromY = parent ? parent.y : rootY
    const toX = node.x - halfLabel
    const bend = fromX + (toX - fromX) / 2
    return { id: node.id, current: node.current, path: `M${fromX} ${fromY}H${bend}V${node.y}H${toX}` }
  })
  // One continuous activity route follows only the current reported PV.
  const current = model.currentIds.map(id => byId.get(id)).filter((node): node is NonNullable<typeof node> => !!node)
  let currentPath = current.length ? `M5 ${rootY}` : ''
  let previousX = 5
  for (const [index, node] of current.entries()) {
    const toX = node.x - halfLabel
    const bend = previousX + (toX - previousX) / 2
    currentPath += `H${bend}V${node.y}H${toX}H${index === current.length - 1 ? node.x : node.x + halfLabel}`
    previousX = node.x + halfLabel
  }
  // Keep the route's last reported endpoint; no extrapolated continuation.
  return { width, height, plies, nodes, edges, currentPath }
}

export function thinkingMoveNumber(model: ThinkingModel, ply: number) {
  const offset = ply - 1 + Number(model.blackFirst)
  return `${model.firstMove + Math.floor(offset / 2)}${offset % 2 ? '…' : '.'}`
}
