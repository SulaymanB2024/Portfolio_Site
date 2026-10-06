import { Chess, type PieceSymbol, type Square } from './vendor/chess.js'

export type EngineProgress =
  | { phase: 'loading'; percent: number | null }
  | { phase: 'thinking'; depth: number; nodes: number }
export type EngineMove = { from: Square; to: Square; promotion?: PieceSymbol }
export type EngineWorker = Pick<Worker, 'postMessage' | 'terminate' | 'onmessage' | 'onerror' | 'onmessageerror'>
type Search = {
  game: Chess; moves: readonly string[]; milliseconds: number; progress?: (value: EngineProgress) => void
  resolve: (move: EngineMove | null) => void; reject: (error: Error) => void; detach: () => void
}
type EngineOptions = {
  url: string; hashMb?: number; createWorker?: (url: string) => EngineWorker
  createProgressChannel?: (() => MessageChannel) | null
  startupTimeoutMs?: number; searchGraceMs?: number
}

const movePattern = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/
export function parseEngineMove(value: string): EngineMove | null {
  if (value === '(none)' || value === '0000') return null
  const match = movePattern.exec(value)
  if (!match) throw new Error('Stockfish returned an invalid move.')
  return { from: match[1] as Square, to: match[2] as Square, ...(match[3] ? { promotion: match[3] as PieceSymbol } : {}) }
}
const cancelled = () => new DOMException('Chess search cancelled.', 'AbortError')

/** Full-strength UCI engine. Keep its transposition table between turns; release it off-screen. */
export class StockfishEngine {
  private worker: EngineWorker | null = null
  private ready = false
  private searching = false
  private pending: Search | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private progressPort: MessagePort | null = null
  private lastProgress = 0
  private disposed = false
  private options: EngineOptions

  constructor(options: EngineOptions) { this.options = options }

  search({ moves, fen, milliseconds, signal, onProgress }: {
    moves: readonly string[]; fen: string; milliseconds: number; signal?: AbortSignal
    onProgress?: (value: EngineProgress) => void
  }): Promise<EngineMove | null> {
    if (this.disposed) return Promise.reject(new Error('Chess engine was disposed.'))
    if (signal?.aborted) return Promise.reject(cancelled())
    if (this.pending) return Promise.reject(new Error('A chess search is already running.'))
    const game = new Chess()
    try {
      for (const value of moves) {
        const move = parseEngineMove(value)
        if (!move) throw new Error('Invalid chess history.')
        game.move(move)
      }
      if (game.fen() !== fen) throw new Error('Chess history does not match the board.')
    } catch (error) { return Promise.reject(error instanceof Error ? error : new Error('Invalid chess history.')) }
    if (game.isGameOver()) return Promise.resolve(null)
    return new Promise((resolve, reject) => {
      const abort = () => this.release(cancelled())
      signal?.addEventListener('abort', abort, { once: true })
      this.pending = {
        game, moves: [...moves], milliseconds: Math.round(Math.min(60_000, Math.max(250, Number.isFinite(milliseconds) ? milliseconds : 10_000))),
        progress: onProgress, resolve, reject, detach: () => signal?.removeEventListener('abort', abort),
      }
      this.lastProgress = 0
      if (this.ready) this.beginSearch()
      else {
        onProgress?.({ phase: 'loading', percent: null })
        this.loadingWatchdog()
        if (this.worker) this.send('isready')
        else this.initialize()
      }
    })
  }

  private initialize() {
    try {
      const worker = (this.options.createWorker ?? (url => new Worker(url)))(this.options.url)
      this.worker = worker
      worker.onmessage = event => {
        if (this.worker !== worker || typeof event.data !== 'string') return
        for (const line of event.data.split('\n')) this.receive(line.trim())
      }
      worker.onerror = worker.onmessageerror = () => {
        if (this.worker === worker) this.release(new Error('Stockfish could not run. Retry, or choose two players.'))
      }
      const createChannel = this.options.createProgressChannel === undefined
        ? typeof MessageChannel === 'undefined' ? null : () => new MessageChannel()
        : this.options.createProgressChannel
      if (createChannel) {
        const channel = createChannel()
        this.progressPort = channel.port1
        channel.port1.onmessage = event => {
          if (this.worker !== worker || !this.pending || this.ready) return
          const percent = event.data?.percent
          if (typeof percent !== 'number' || !Number.isFinite(percent)) return
          const now = Date.now()
          if (percent < 1 && now - this.lastProgress < 250) return
          this.lastProgress = now
          this.loadingWatchdog() // A slow download can continue while bytes are still arriving.
          this.pending.progress?.({ phase: 'loading', percent: Math.max(0, Math.min(1, percent)) })
          if (percent >= 1) this.closeProgress()
        }
        worker.postMessage({ progressPort: channel.port2 }, [channel.port2])
      }
      this.send('uci')
    } catch { this.release(new Error('Stockfish could not start. Retry, or choose two players.')) }
  }

  private receive(line: string) {
    if (!this.worker) return
    if (line === 'uciok') {
      // Full NNUE, no Elo cap, no handicap, and one principal variation.
      for (const command of [
        'setoption name Threads value 1',
        `setoption name Hash value ${Math.min(256, Math.max(16, Math.round(this.options.hashMb ?? 128)))}`,
        'setoption name Skill Level value 20', 'setoption name UCI_LimitStrength value false',
        'setoption name MultiPV value 1', 'setoption name Ponder value false', 'ucinewgame', 'isready',
      ]) this.send(command)
    } else if (line === 'readyok') {
      this.ready = true
      this.closeProgress()
      if (this.pending) this.beginSearch()
    } else if (line.startsWith('bestmove ') && this.pending && this.ready) {
      try {
        const move = parseEngineMove(line.split(/\s+/)[1])
        if (!move) throw new Error('Stockfish returned no move for a playable position.')
        this.pending.game.move(move) // Reject illegal or stale engine output before touching the live board.
        this.finish(move)
      } catch { this.release(new Error('Stockfish could not return a legal move. Try again.')) }
    } else if (line.startsWith('info depth ') && this.pending && this.ready) {
      // currmove-only notifications omit nodes; they must not reset the completed search statistics.
      const nodeCount = /\bnodes (\d+)/.exec(line)
      if (!nodeCount) return
      const now = Date.now()
      if (now - this.lastProgress < 250) return
      const depth = Number(/\bdepth (\d+)/.exec(line)?.[1] ?? 0)
      const nodes = Number(nodeCount[1])
      this.lastProgress = now
      this.pending.progress?.({ phase: 'thinking', depth, nodes })
    }
  }

  private beginSearch() {
    const search = this.pending
    if (!search || this.searching) return
    this.searching = true
    this.lastProgress = 0
    search.progress?.({ phase: 'thinking', depth: 0, nodes: 0 })
    this.watchdog(search.milliseconds + (this.options.searchGraceMs ?? 5_000), 'Stockfish took too long to respond. Try again.')
    this.send(`position startpos${search.moves.length ? ` moves ${search.moves.join(' ')}` : ''}`)
    this.send(`go movetime ${search.milliseconds}`)
  }
  private send(command: string) {
    try { this.worker?.postMessage(command) }
    catch { this.release(new Error('Stockfish stopped responding. Try again.')) }
  }
  private watchdog(milliseconds: number, message: string) {
    this.clearTimer()
    this.timer = setTimeout(() => this.release(new Error(message)), milliseconds)
  }
  private loadingWatchdog() { this.watchdog(this.options.startupTimeoutMs ?? 120_000, 'Stockfish could not finish loading. Try again.') }
  private clearTimer() { if (this.timer !== null) clearTimeout(this.timer); this.timer = null }
  private closeProgress() { this.progressPort?.close(); this.progressPort = null }
  private finish(move: EngineMove) {
    const search = this.pending
    this.pending = null
    this.searching = false
    this.clearTimer()
    search?.detach()
    search?.resolve(move)
  }
  newGame() {
    if (this.pending) this.release()
    else if (this.worker) { this.ready = false; this.send('ucinewgame') }
  }
  release(error: Error = cancelled()) {
    const search = this.pending
    this.pending = null
    const worker = this.worker
    this.worker = null
    this.ready = false
    this.searching = false
    this.clearTimer()
    this.closeProgress()
    worker?.terminate() // Interrupts a WASM search immediately, even while its event loop is busy.
    search?.detach()
    search?.reject(error)
  }
  dispose() { this.release(); this.disposed = true }
}
