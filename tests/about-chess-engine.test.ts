import test from 'node:test'
import assert from 'node:assert/strict'
import { StockfishEngine, parseEngineMove, type EngineProgress, type EngineWorker } from '../src/personal/about/chess-engine.ts'
import { Chess } from '../src/personal/about/vendor/chess.js'

class FakeWorker {
  commands: unknown[] = []
  terminated = false
  onmessage: EngineWorker['onmessage'] = null
  onerror: EngineWorker['onerror'] = null
  onmessageerror: EngineWorker['onmessageerror'] = null
  postMessage(command: unknown) { this.commands.push(command) }
  terminate() { this.terminated = true }
  emit(data: string) { this.onmessage?.({ data } as MessageEvent) }
  ready() { this.emit('uciok'); this.emit('readyok') }
}
function harness(options: { startupTimeoutMs?: number; searchGraceMs?: number } = {}) {
  const workers: FakeWorker[] = []
  const engine = new StockfishEngine({ url: '/engines/stockfish/stockfish-19-single.js', createProgressChannel: null,
    createWorker: () => { const worker = new FakeWorker(); workers.push(worker); return worker as EngineWorker }, ...options })
  return { engine, workers }
}
function position(san: string[] = ['e4']) {
  const game = new Chess()
  for (const move of san) game.move(move)
  return { moves: game.history({ verbose: true }).map(move => `${move.from}${move.to}${move.promotion ?? ''}`), fen: game.fen(), milliseconds: 1000 }
}

test('engine loads only on a playable search, then initializes the full-strength UCI settings', async () => {
  const { engine, workers } = harness()
  assert.equal(workers.length, 0)
  const result = engine.search(position())
  const worker = workers[0]
  assert.deepEqual(worker.commands, ['uci'])
  worker.emit('bestmove e7e5'); assert.deepEqual(worker.commands, ['uci'])
  worker.emit('uciok')
  assert.deepEqual(worker.commands.slice(1), [
    'setoption name Threads value 1', 'setoption name Hash value 128', 'setoption name Skill Level value 20',
    'setoption name UCI_LimitStrength value false', 'setoption name MultiPV value 1',
    'setoption name Ponder value false', 'ucinewgame', 'isready',
  ])
  assert.equal(worker.commands.some(command => String(command).startsWith('go ')), false)
  worker.emit('readyok')
  assert.deepEqual(worker.commands.slice(-2), ['position startpos moves e2e4', 'go movetime 1000'])
  worker.emit('readyok') // An extra readiness notification cannot start a duplicate search.
  assert.equal(worker.commands.filter(command => String(command).startsWith('go ')).length, 1)
  worker.emit('bestmove e7e5 ponder g1f3')
  assert.deepEqual(await result, { from: 'e7', to: 'e5' })
  assert.equal(worker.terminated, false)
  engine.dispose()
})

test('success retains one worker and its hash between turns; new games clear it before searching', async () => {
  const { engine, workers } = harness()
  const first = engine.search(position()); workers[0].ready(); workers[0].emit('bestmove e7e5'); await first
  const next = engine.search(position(['e4','e5','Nf3']))
  assert.equal(workers.length, 1)
  assert.equal(workers[0].commands.at(-2), 'position startpos moves e2e4 e7e5 g1f3')
  workers[0].emit('bestmove b8c6'); await next
  engine.newGame()
  assert.equal(workers[0].commands.at(-1), 'ucinewgame')
  const restarted = engine.search(position(['d4']))
  assert.equal(workers[0].commands.at(-1), 'isready')
  workers[0].emit('readyok'); assert.equal(workers[0].commands.at(-2), 'position startpos moves d2d4')
  workers[0].emit('bestmove d7d5'); await restarted
  engine.dispose()
})

test('full repetition history reaches UCI; finished games never load the engine', async () => {
  const { engine, workers } = harness()
  const repeated = position(['Nf3','Nf6','Ng1','Ng8','Nf3','Nf6','Ng1'])
  const result = engine.search(repeated); workers[0].ready()
  assert.equal(workers[0].commands.at(-2), 'position startpos moves g1f3 g8f6 f3g1 f6g8 g1f3 g8f6 f3g1')
  workers[0].emit('bestmove f6g8'); await result
  engine.dispose()
  const other = harness()
  for (const game of [position(['f3','e5','g4','Qh4#']), position(['Nf3','Nf6','Ng1','Ng8','Nf3','Nf6','Ng1','Ng8'])]) {
    assert.equal(await other.engine.search(game), null)
  }
  assert.equal(other.workers.length, 0); other.engine.dispose()
})

test('cancellation during loading or search terminates the worker; obsolete output cannot answer a new search', async () => {
  const { engine, workers } = harness()
  const controller = new AbortController()
  const first = engine.search({ ...position(), signal: controller.signal })
  const rejected = assert.rejects(first, { name: 'AbortError' })
  controller.abort(); await rejected
  assert.equal(workers[0].terminated, true)
  const secondController = new AbortController()
  const next = engine.search({ ...position(['d4']), signal: secondController.signal })
  workers[0].emit('uciok'); workers[0].emit('readyok'); workers[0].emit('bestmove e7e5')
  assert.deepEqual(workers[1].commands, ['uci'])
  workers[1].ready()
  const secondRejected = assert.rejects(next, { name: 'AbortError' })
  secondController.abort(); await secondRejected
  assert.equal(workers[1].terminated, true)
  engine.dispose()
})

test('abort listeners detach after a completed move, preserving the idle engine', async () => {
  const { engine, workers } = harness()
  const controller = new AbortController()
  const result = engine.search({ ...position(), signal: controller.signal })
  workers[0].ready(); workers[0].emit('bestmove e7e5'); await result
  controller.abort(); assert.equal(workers[0].terminated, false)
  engine.release(); assert.equal(workers[0].terminated, true)
  engine.dispose()
})

test('new game or disposal during a search rejects it and cannot leave a late reply', async () => {
  const { engine, workers } = harness()
  const result = engine.search(position()); workers[0].ready()
  const rejected = assert.rejects(result, {name:'AbortError'})
  engine.newGame(); await rejected; assert.equal(workers[0].terminated, true)
  const restarted = engine.search(position(['d4']))
  workers[0].emit('bestmove e7e5'); workers[1].ready()
  const disposed = assert.rejects(restarted, {name:'AbortError'})
  engine.dispose(); await disposed; assert.equal(workers[1].terminated, true)
})

test('an already aborted request never loads the engine', async () => {
  const { engine, workers } = harness()
  const controller = new AbortController(); controller.abort()
  await assert.rejects(engine.search({...position(),signal:controller.signal}), {name:'AbortError'})
  assert.equal(workers.length, 0); engine.dispose()
})

test('illegal, malformed, and missing engine moves fail explicitly and allow retry', async () => {
  for (const badMove of ['e7e3','banana','0000','(none)']) {
    const { engine, workers } = harness()
    const result = engine.search(position()); const rejected = assert.rejects(result, /legal move/)
    workers[0].ready(); workers[0].emit(`bestmove ${badMove}`); await rejected
    assert.equal(workers[0].terminated, true)
    const retry = engine.search(position()); workers[1].ready(); workers[1].emit('bestmove e7e5'); await retry
    engine.dispose()
  }
})

test('invalid history and stale FEN cannot start a worker or alter a game', async () => {
  const { engine, workers } = harness()
  await assert.rejects(engine.search({ ...position(), moves: ['e2e5'] }), /Invalid move/)
  await assert.rejects(engine.search({ ...position(), moves: [] }), /does not match/)
  assert.equal(workers.length, 0)
  engine.dispose()
})

test('loading and search watchdogs release resources; transport errors are retryable', async () => {
  const { engine, workers } = harness({ startupTimeoutMs: 12, searchGraceMs: 2 })
  await assert.rejects(engine.search(position()), /finish loading/)
  assert.equal(workers[0].terminated, true)
  const transportFailure = engine.search(position()); const rejected = assert.rejects(transportFailure, /could not run/)
  workers[1].onerror?.({} as ErrorEvent); await rejected
  const stalled = engine.search({ ...position(), milliseconds: 250 }); workers[2].ready()
  await assert.rejects(stalled, /too long/)
  assert.equal(workers[2].terminated, true)
  engine.dispose()
})

test('a concurrent request cannot displace a running search; budgets stay bounded', async () => {
  const { engine, workers } = harness()
  const result = engine.search({ ...position(), milliseconds: Infinity }); workers[0].ready()
  assert.equal(workers[0].commands.at(-1), 'go movetime 10000')
  await assert.rejects(engine.search(position()), /already running/)
  workers[0].emit('bestmove e7e5'); await result
  for (const [input, expected] of [[-1,250],[1e9,60000]]) {
    const result = engine.search({ ...position(), milliseconds: input })
    assert.equal(workers[0].commands.at(-1), `go movetime ${expected}`)
    workers[0].emit('bestmove e7e5'); await result
  }
  engine.dispose(); await assert.rejects(engine.search(position()), /disposed/)
})

test('search progress is throttled, with separate download and thinking phases', async () => {
  const { engine, workers } = harness()
  const progress: EngineProgress[] = []
  const result = engine.search({ ...position(), onProgress: value => progress.push(value) })
  workers[0].ready()
  workers[0].emit('info depth 9 currmove e7e5 currmovenumber 1')
  workers[0].emit('info depth 10 nodes 15000 nps 15000 score cp 0 pv e7e5')
  workers[0].emit('info depth 11 nodes 30000 nps 15000 score cp 0 pv e7e5')
  assert.deepEqual(progress, [{ phase:'loading',percent:null },{ phase:'thinking',depth:0,nodes:0 },{ phase:'thinking',depth:10,nodes:15000 }])
  workers[0].emit('bestmove e7e5'); await result
  workers[0].emit('info depth 12 nodes 40000'); assert.equal(progress.length, 3)
  engine.dispose()
})

test('download progress registers before UCI, waits for readiness, and closes its port', async () => {
  const worker = new FakeWorker()
  let closed = 0
  const port = { onmessage: null as ((event: { data: { percent: number } }) => void) | null, close: () => closed++ }
  const engine = new StockfishEngine({ url:'/engine.js', createWorker:()=>worker as EngineWorker,
    createProgressChannel:()=>({port1:port,port2:{}} as unknown as MessageChannel) })
  const progress: EngineProgress[] = []
  const result = engine.search({ ...position(), onProgress:value=>progress.push(value) })
  assert.equal(typeof worker.commands[0], 'object'); assert.equal(worker.commands[1], 'uci')
  port.onmessage?.({data:{percent:.5}}); port.onmessage?.({data:{percent:1}})
  assert.deepEqual(progress.slice(-2), [{phase:'loading',percent:.5},{phase:'loading',percent:1}])
  assert.equal(closed, 1)
  assert.equal(worker.commands.some(command=>String(command).startsWith('go ')), false)
  worker.ready(); worker.emit('bestmove e7e5'); await result; engine.dispose()
  assert.equal(closed, 1)
})

test('UCI parser preserves promotion choices and rejects command injection', () => {
  for (const piece of ['q','r','b','n']) assert.deepEqual(parseEngineMove(`a7a8${piece}`), {from:'a7',to:'a8',promotion:piece})
  for (const invalid of ['a7a8k','e2e4\ngo infinite','i2e4','e2e','']) assert.throws(()=>parseEngineMove(invalid))
})
