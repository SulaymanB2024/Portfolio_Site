import { Chess } from './vendor/chess.js'
import { readEngineInfo, interpretEngineInfo, parseEngineMove, type EngineInfoRecord, type EngineMove, type EngineThinkingProgress } from './chess-analysis.ts'
export { parseEngineMove } from './chess-analysis.ts'
export type { EngineMove, EngineScore, EnginePvMove, EngineThinkingProgress } from './chess-analysis.ts'

export type EngineProgress =
  | { phase: 'loading'; percent: number | null }
  | EngineThinkingProgress
export type EngineWorker = Pick<Worker, 'postMessage' | 'terminate' | 'onmessage' | 'onerror' | 'onmessageerror'>
type Search = {
  game: Chess; rootFen: string; moves: readonly string[]; milliseconds: number; progress?: (value: EngineProgress) => void
  latestInfo?: EngineInfoRecord; deliveredInfo?: EngineInfoRecord
  resolve: (move: EngineMove | null) => void; reject: (error: Error) => void; detach: () => void
}
type EngineOptions = {
  url: string; hashMb?: number; createWorker?: (url: string) => EngineWorker
  createProgressChannel?: (() => MessageChannel) | null
  startupTimeoutMs?: number; searchGraceMs?: number
}

const cancelled = () => new DOMException('Chess search cancelled.', 'AbortError')

/** Full-strength UCI engine. Keep its transposition table between turns; release it off-screen. */
export class StockfishEngine {
  private worker: EngineWorker | null = null
  private ready = false
  private searching = false
  private stopping = false
  private pending: Search | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private infoTimer: ReturnType<typeof setTimeout> | null = null
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
      const search: Search = {
        game, rootFen: fen, moves: [...moves], milliseconds: Math.round(Math.min(60_000, Math.max(250, Number.isFinite(milliseconds) ? milliseconds : 10_000))),
        progress: onProgress, resolve, reject, detach: () => signal?.removeEventListener('abort', abort),
      }
      this.pending = search
      this.lastProgress = 0
      if (this.ready) this.beginSearch()
      else {
        onProgress?.({ phase: 'loading', percent: null })
        if (this.pending !== search) return
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
          const search = this.pending
          search.progress?.({ phase: 'loading', percent: Math.max(0, Math.min(1, percent)) })
          if (percent >= 1 && this.worker === worker && this.pending === search) this.closeProgress()
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
        `setoption name Hash value ${Math.min(256, Math.max(16, Math.round(Number.isFinite(this.options.hashMb) ? this.options.hashMb! : 128)))}`,
        'setoption name Skill Level value 20', 'setoption name UCI_LimitStrength value false',
        'setoption name MultiPV value 1', 'setoption name Ponder value false', 'ucinewgame', 'isready',
      ]) this.send(command)
    } else if (line === 'readyok') {
      this.ready = true
      this.closeProgress()
      if (this.pending) this.beginSearch()
    } else if (line.startsWith('bestmove ') && this.pending && this.ready && this.searching) {
      const search = this.pending
      try {
        const move = parseEngineMove(line.split(/\s+/)[1])
        if (!move) throw new Error('Stockfish returned no move for a playable position.')
        search.game.move(move) // Reject illegal or stale engine output before touching the live board.
        this.deliverInfo(search) // Flush the latest actual record, even if it fell inside the throttle.
        if (this.pending === search) this.finish(move)
      } catch { if (this.pending === search) this.release(new Error('Stockfish could not return a legal move. Try again.')) }
    } else if (line.startsWith('info ') && this.pending && this.ready && this.searching) {
      const info = readEngineInfo(line)
      if (!info) return
      this.pending.latestInfo = info
      const now = Date.now()
      if (now - this.lastProgress < 250) {
        const search = this.pending
        if (this.infoTimer === null) this.infoTimer = setTimeout(() => {
          this.infoTimer = null
          if (this.pending !== search || !this.searching) return
          this.lastProgress = Date.now()
          this.deliverInfo(search)
        }, Math.max(0, 250 - (now - this.lastProgress)))
        return
      }
      this.clearInfoTimer()
      this.lastProgress = now
      this.deliverInfo(this.pending)
    }
  }

  private deliverInfo(search: Search) {
    if (!search.latestInfo || search.latestInfo === search.deliveredInfo) return
    search.deliveredInfo = search.latestInfo
    if (!search.progress) return
    const info = interpretEngineInfo(search.latestInfo, search.rootFen)
    if (info) search.progress(info)
  }

  /** Ask UCI for its best move so far, keeping the worker and hash for the next turn. */
  playNow(): boolean {
    if (!this.worker || !this.pending || !this.ready || !this.searching || this.stopping) return false
    this.stopping = true
    this.watchdog(this.options.searchGraceMs ?? 5_000, 'Stockfish took too long to return its move. Try again.')
    this.send('stop')
    return this.worker !== null
  }

  private beginSearch() {
    const search = this.pending
    if (!search || this.searching) return
    this.searching = true
    this.stopping = false
    this.lastProgress = 0
    search.progress?.({ phase: 'thinking', depth: 0, nodes: 0 })
    if (this.pending !== search || !this.searching) return
    this.watchdog(search.milliseconds + (this.options.searchGraceMs ?? 5_000), 'Stockfish took too long to respond. Try again.')
    this.send(`position startpos${search.moves.length ? ` moves ${search.moves.join(' ')}` : ''}`)
    if (this.pending !== search) return
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
  private clearInfoTimer() { if (this.infoTimer !== null) clearTimeout(this.infoTimer); this.infoTimer = null }
  private closeProgress() { this.progressPort?.close(); this.progressPort = null }
  private finish(move: EngineMove) {
    const search = this.pending
    this.pending = null
    this.searching = false
    this.stopping = false
    this.clearTimer()
    this.clearInfoTimer()
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
    this.stopping = false
    this.clearTimer()
    this.clearInfoTimer()
    this.closeProgress()
    worker?.terminate() // Interrupts a WASM search immediately, even while its event loop is busy.
    search?.detach()
    search?.reject(error)
  }
  dispose() { this.release(); this.disposed = true }
}
