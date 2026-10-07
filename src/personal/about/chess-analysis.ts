import { Chess, type PieceSymbol, type Square } from './vendor/chess.js'

export type EngineMove = { from: Square; to: Square; promotion?: PieceSymbol }
/** Scores and bounds use White's perspective. Mate distance is in moves, not plies. */
export type EngineScore = { kind: 'cp' | 'mate'; value: number; bound?: 'lower' | 'upper' }
export type EnginePvMove = EngineMove & { san: string }
export type EngineThinkingProgress = {
  phase: 'thinking'; depth: number; nodes: number
  seldepth?: number; timeMs?: number; nps?: number; score?: EngineScore
  pv?: EnginePvMove[]; pvTruncated?: true
}

const movePattern = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/
export function parseEngineMove(value: string): EngineMove | null {
  if (value === '(none)' || value === '0000') return null
  const match = movePattern.exec(value)
  if (!match) throw new Error('Stockfish returned an invalid move.')
  return { from: match[1] as Square, to: match[2] as Square, ...(match[3] ? { promotion: match[3] as PieceSymbol } : {}) }
}

function integer(value: string | undefined, signed = false): number | undefined {
  if (value === undefined || !(signed ? /^[+-]?\d+$/ : /^\d+$/).test(value)) return undefined
  const number = Number(value)
  return Number.isSafeInteger(number) ? number : undefined
}

/** Cheap UCI envelope. Its score still uses the root side's perspective. */
export type EngineInfoRecord = {
  depth: number; nodes: number; seldepth?: number; timeMs?: number; nps?: number
  uciScore?: EngineScore; pvTokens?: string[]
}

/** Read fields without replaying a PV that may be superseded inside the UI throttle. */
export function readEngineInfo(line: string): EngineInfoRecord | null {
  const tokens = line.trim().split(/\s+/)
  if (tokens[0] !== 'info' || tokens.includes('string')) return null
  const pvIndex = tokens.indexOf('pv')
  const fields = pvIndex < 0 ? tokens : tokens.slice(0, pvIndex)
  const field = (name: string) => {
    const index = fields.indexOf(name)
    return index < 0 ? undefined : integer(fields[index + 1])
  }
  const depth = field('depth'), nodes = field('nodes')
  if (depth === undefined || nodes === undefined) return null
  if (fields.includes('multipv') && field('multipv') !== 1) return null
  const record: EngineInfoRecord = { depth, nodes }
  const seldepth = field('seldepth'), timeMs = field('time'), nps = field('nps')
  if (seldepth !== undefined) record.seldepth = seldepth
  if (timeMs !== undefined) record.timeMs = timeMs
  if (nps !== undefined) record.nps = nps
  const scoreIndex = fields.indexOf('score')
  if (scoreIndex >= 0) {
    const kind = fields[scoreIndex + 1], value = integer(fields[scoreIndex + 2], true)
    const lower = fields.includes('lowerbound'), upper = fields.includes('upperbound')
    if ((kind === 'cp' || kind === 'mate') && value !== undefined && !(lower && upper)) {
      record.uciScore = { kind, value, ...(lower ? { bound: 'lower' } : upper ? { bound: 'upper' } : {}) }
    }
  }
  if (pvIndex >= 0) record.pvTokens = tokens.slice(pvIndex + 1)
  return record
}

/** Validate one selected record at its immutable root; only legal moves receive SAN. */
export function interpretEngineInfo(record: EngineInfoRecord, rootFen: string): EngineThinkingProgress | null {
  let root: Chess
  try { root = new Chess(rootFen) } catch { return null }
  const { uciScore, pvTokens, ...statistics } = record
  const progress: EngineThinkingProgress = { phase: 'thinking', ...statistics }
  if (uciScore) {
    const black = root.turn() === 'b'
    progress.score = {
      kind: uciScore.kind, value: uciScore.value === 0 ? 0 : black ? -uciScore.value : uciScore.value,
      ...(uciScore.bound ? { bound: black ? uciScore.bound === 'lower' ? 'upper' : 'lower' : uciScore.bound } : {}),
    }
  }
  if (pvTokens) {
    progress.pv = []
    for (const token of pvTokens) {
      try {
        const move = parseEngineMove(token)
        if (!move) throw new Error('Null move in principal variation.')
        const played = root.move(move)
        progress.pv.push({ ...move, san: played.san })
      } catch {
        progress.pvTruncated = true
        break
      }
    }
  }
  return progress
}

/** Parse an actual main-PV info record; never infer missing fields or a search tree.
 * https://official-stockfish.github.io/docs/stockfish-wiki/UCI-Protocol-and-Stockfish-Commands.html
 */
export function parseEngineInfo(line: string, rootFen: string): EngineThinkingProgress | null {
  const record = readEngineInfo(line)
  return record ? interpretEngineInfo(record, rootFen) : null
}

/** Actual samples per reported depth, sorted by depth; replace repeated depths and cap storage. */
export function appendDepthSample(samples: readonly EngineThinkingProgress[], progress: EngineThinkingProgress, limit = 32): EngineThinkingProgress[] {
  const capacity = Number.isFinite(limit) ? Math.max(0, Math.min(256, Math.floor(limit))) : 32
  if (capacity === 0) return []
  // depth 0 is the controller's startup state, not an engine search sample.
  const next = progress.depth > 0
    ? [...samples.filter(sample => sample.depth !== progress.depth), progress]
    : [...samples]
  return next.sort((a, b) => a.depth - b.depth).slice(-capacity)
}

export function formatEngineScore(score: EngineScore | undefined): string {
  if (!score) return '—'
  const value = score.kind === 'cp'
    ? `${score.value >= 0 ? '+' : ''}${(score.value / 100).toFixed(2)}`
    : `${score.value < 0 ? '-' : ''}M${Math.abs(score.value)}`
  return `${score.bound === 'lower' ? '≥ ' : score.bound === 'upper' ? '≤ ' : ''}${value}`
}

/** SAN numbering starts at the immutable search root, including a Black-to-move root. */
export function formatPrincipalVariation(pv: readonly EnginePvMove[] | undefined, rootFen: string, maxPlies = 12): string {
  if (!pv?.length) return '—'
  const fields = rootFen.split(/\s+/)
  let black = fields[1] === 'b', number = integer(fields[5])
  if ((fields[1] !== 'w' && fields[1] !== 'b') || number === undefined || number < 1) return '—'
  const limit = Number.isFinite(maxPlies) ? Math.max(0, Math.floor(maxPlies)) : 12
  const words: string[] = []
  for (const [index, move] of pv.slice(0, limit).entries()) {
    words.push(!black ? `${number}. ${move.san}` : index === 0 ? `${number}... ${move.san}` : move.san)
    if (black) number++
    black = !black
  }
  if (pv.length > limit) words.push('…')
  return words.join(' ')
}
