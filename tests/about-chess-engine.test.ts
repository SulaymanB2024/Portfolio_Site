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
function harness(options: { startupTimeoutMs?: number; searchGraceMs?: number; hashMb?: number } = {}) {
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
  assert.deepEqual(progress, [{ phase:'loading',percent:null },{ phase:'thinking',depth:0,nodes:0 },
    { phase:'thinking',depth:10,nodes:15000,nps:15000,score:{kind:'cp',value:0},pv:[{from:'e7',to:'e5',san:'e5'}] }])
  workers[0].emit('bestmove e7e5'); await result
  assert.equal(progress.at(-1)?.phase, 'thinking')
  assert.deepEqual(progress.at(-1), { phase:'thinking',depth:11,nodes:30000,nps:15000,score:{kind:'cp',value:0},pv:[{from:'e7',to:'e5',san:'e5'}] })
  workers[0].emit('info depth 12 nodes 40000'); assert.equal(progress.length, 4)
  engine.dispose()
})

test('latest actual info inside the throttle flushes before resolution without accepting invalid replacements', async t => {
  let now = 1000
  t.mock.method(Date, 'now', () => now)
  const { engine, workers } = harness()
  const progress: EngineProgress[] = [], order: string[] = []
  const result = engine.search({ ...position(), onProgress: value => {
    progress.push(value)
    if (value.phase === 'thinking') order.push(`depth ${value.depth}`)
  } }).then(move => { order.push('resolved'); return move })
  workers[0].ready()
  workers[0].emit('info depth 10 seldepth 15 nodes 15000 nps 75000 time 200 score cp 25 pv e7e5 g1f3')
  now += 20
  workers[0].emit('info depth 11 seldepth 17 nodes 30000 nps 120000 time 250 score cp 50 lowerbound pv c7c5 g1f3')
  workers[0].emit('info depth 12 currmove c7c5 currmovenumber 1')
  workers[0].emit('info depth 12 nodes invalid score cp 99 pv e7e5')
  workers[0].emit('info depth 99 multipv 2 nodes 999 score mate 1 pv d8h4')
  assert.equal(progress.length, 3)
  workers[0].emit('bestmove c7c5')
  assert.deepEqual(await result, {from:'c7',to:'c5'})
  assert.deepEqual(order, ['depth 0','depth 10','depth 11','resolved'])
  assert.deepEqual(progress.at(-1), {
    phase:'thinking',depth:11,nodes:30000,seldepth:17,nps:120000,timeMs:250,
    score:{kind:'cp',value:-50,bound:'upper'},pv:[{from:'c7',to:'c5',san:'c5'},{from:'g1',to:'f3',san:'Nf3'}],
  })
  workers[0].emit('info depth 12 nodes 40000 score cp 20 pv e7e5')
  assert.equal(progress.length, 4)
  engine.dispose()
})

test('bestmove never fabricates analysis or re-emits a record already delivered', async () => {
  const { engine, workers } = harness()
  const progress: EngineProgress[] = []
  const empty = engine.search({...position(),onProgress: value => progress.push(value)})
  workers[0].ready(); workers[0].emit('bestmove e7e5'); await empty
  assert.deepEqual(progress, [{phase:'loading',percent:null},{phase:'thinking',depth:0,nodes:0}])
  progress.length = 0
  const reported = engine.search({...position(),onProgress: value => progress.push(value)})
  workers[0].emit('info depth 4 nodes 1000 score cp 10 pv e7e5')
  const count = progress.length
  workers[0].emit('bestmove e7e5'); await reported
  assert.equal(progress.length, count)
  engine.dispose()
})

test('cancelled analysis cannot flush into a replacement search', async () => {
  const { engine, workers } = harness()
  const previous: EngineProgress[] = [], current: EngineProgress[] = []
  const controller = new AbortController()
  const first = engine.search({...position(),signal:controller.signal,onProgress:value=>previous.push(value)})
  const rejected = assert.rejects(first, {name:'AbortError'})
  workers[0].ready()
  workers[0].emit('info depth 10 nodes 15000 score cp 25 pv e7e5')
  workers[0].emit('info depth 11 nodes 30000 score cp 50 pv c7c5')
  controller.abort(); await rejected
  const previousCount = previous.length
  const next = engine.search({...position(['d4']),onProgress:value=>current.push(value)})
  workers[0].emit('info depth 12 nodes 40000 score cp 99 pv e7e5')
  workers[0].emit('bestmove e7e5')
  workers[1].ready(); workers[1].emit('bestmove d7d5'); await next
  assert.equal(previous.length, previousCount)
  assert.deepEqual(current, [{phase:'loading',percent:null},{phase:'thinking',depth:0,nodes:0}])
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

test('Play now requests one UCI stop, validates the reply, and retains the warm engine', async () => {
  const { engine, workers } = harness()
  assert.equal(engine.playNow(), false)
  const result = engine.search(position())
  assert.equal(engine.playNow(), false, 'loading cannot stop a search that has not started')
  workers[0].ready()
  assert.equal(engine.playNow(), true)
  assert.equal(engine.playNow(), false)
  assert.equal(workers[0].commands.filter(command => command === 'stop').length, 1)
  workers[0].emit('bestmove e7e5')
  assert.deepEqual(await result, { from: 'e7', to: 'e5' })
  assert.equal(workers[0].terminated, false)
  assert.equal(engine.playNow(), false)
  const next = engine.search(position(['e4','e5','Nf3']))
  assert.equal(workers.length, 1)
  workers[0].emit('bestmove b8c6'); await next
  engine.dispose()
})

test('a stopped search still rejects illegal replies and cannot survive cancellation', async () => {
  const { engine, workers } = harness()
  const first = engine.search(position())
  const failed = assert.rejects(first, /legal move/)
  workers[0].ready(); engine.playNow(); workers[0].emit('bestmove e7e3'); await failed
  const controller = new AbortController()
  const next = engine.search({...position(['d4']), signal:controller.signal})
  const aborted = assert.rejects(next, {name:'AbortError'})
  workers[1].ready(); engine.playNow(); controller.abort(); await aborted
  workers[1].emit('bestmove d7d5')
  assert.equal(engine.playNow(), false)
  engine.dispose()
})

test('newest coalesced report arrives after 250ms without another worker message', async t => {
  t.mock.timers.enable({apis:['setTimeout','Date'], now:1000})
  const { engine, workers } = harness()
  const depths: number[] = []
  const result = engine.search({...position(),onProgress:value=>{if(value.phase==='thinking') depths.push(value.depth)}})
  workers[0].ready()
  workers[0].emit('info depth 10 nodes 1000 score cp 20 pv e7e5')
  workers[0].emit('info depth 11 nodes 2000 score cp 30 pv c7c5')
  workers[0].emit('info depth 12 nodes 3000 score cp 40 pv c7c5')
  t.mock.timers.tick(249); assert.deepEqual(depths, [0,10])
  t.mock.timers.tick(1); assert.deepEqual(depths, [0,10,12])
  workers[0].emit('bestmove c7c5'); await result
  t.mock.timers.tick(250); assert.deepEqual(depths, [0,10,12], 'final flush cannot duplicate a delivered report')
  engine.dispose()
})

test('cancellation clears the trailing report before a replacement search', async t => {
  t.mock.timers.enable({apis:['setTimeout','Date'], now:1000})
  const { engine, workers } = harness()
  const controller = new AbortController(), previous: number[] = [], current: number[] = []
  const first = engine.search({...position(),signal:controller.signal,onProgress:value=>{if(value.phase==='thinking') previous.push(value.depth)}})
  const aborted = assert.rejects(first, {name:'AbortError'})
  workers[0].ready()
  workers[0].emit('info depth 10 nodes 1000 pv e7e5')
  workers[0].emit('info depth 11 nodes 2000 pv c7c5')
  controller.abort(); await aborted
  const next = engine.search({...position(['d4']),onProgress:value=>{if(value.phase==='thinking') current.push(value.depth)}})
  workers[1].ready()
  t.mock.timers.tick(250)
  assert.deepEqual(previous, [0,10]); assert.deepEqual(current, [0])
  workers[1].emit('bestmove d7d5'); await next; engine.dispose()
})

test('suppressed reports skip SAN replay; only delivered and final lines are interpreted', async t => {
  t.mock.timers.enable({apis:['setTimeout','Date'], now:1000})
  const { engine, workers } = harness()
  const reported: EngineProgress[] = []
  const result = engine.search({...position(),onProgress:value=>reported.push(value)})
  workers[0].ready()
  const replay = t.mock.method(Chess.prototype, 'move')
  workers[0].emit('info depth 10 nodes 1000 score cp 20 pv e7e5 g1f3 b8c6')
  assert.equal(replay.mock.callCount(), 3)
  for(let depth=11;depth<=40;depth++) workers[0].emit(`info depth ${depth} nodes ${depth*100} score cp 25 pv e7e5 g1f3 b8c6`)
  workers[0].emit('info depth 99 nodes invalid pv c7c5')
  assert.equal(replay.mock.callCount(), 3, 'coalescing must not replay the thirty suppressed lines')
  workers[0].emit('bestmove e7e5'); await result
  assert.equal(replay.mock.callCount(), 7, 'final bestmove validation plus one retained three-ply line')
  assert.equal(reported.at(-1)?.phase === 'thinking' && (reported.at(-1) as {depth:number}).depth, 40)
  engine.dispose()
})

test('callback-triggered replacement cannot receive an old bestmove', async t => {
  t.mock.timers.enable({apis:['setTimeout','Date'], now:1000})
  const { engine, workers } = harness()
  const controller = new AbortController()
  let replacement: ReturnType<StockfishEngine['search']> | undefined, replacementResolved = false
  const first = engine.search({...position(),signal:controller.signal,onProgress:value=>{
    if(value.phase==='thinking' && value.depth===11) {
      controller.abort()
      replacement = engine.search(position(['d4']))
      void replacement.then(()=>{replacementResolved=true})
    }
  }})
  const aborted = assert.rejects(first, {name:'AbortError'})
  workers[0].ready()
  workers[0].emit('info depth 10 nodes 1000 pv e7e5')
  workers[0].emit('info depth 11 nodes 2000 pv c7c5')
  workers[0].emit('bestmove e7e5'); await aborted
  assert.deepEqual(workers[1].commands, ['uci'])
  assert.equal(replacementResolved, false)
  workers[1].ready(); workers[1].emit('bestmove d7d5')
  assert.deepEqual(await replacement, {from:'d7',to:'d5'})
  engine.dispose()
})

test('loading and startup callbacks can cancel without commanding a replacement worker', async () => {
  for(const phase of ['loading','thinking']) {
    const { engine, workers } = harness(), controller = new AbortController()
    let replacement: ReturnType<StockfishEngine['search']> | undefined
    const first = engine.search({...position(),signal:controller.signal,onProgress:value=>{
      if(value.phase===phase) { controller.abort(); replacement=engine.search(position(['d4'])) }
    }})
    const aborted = assert.rejects(first, {name:'AbortError'})
    if(phase==='thinking') workers[0].ready()
    await aborted
    const own = workers.at(-1)!
    assert.deepEqual(own.commands, ['uci'])
    own.ready(); own.emit('bestmove d7d5'); await replacement; engine.dispose()
  }
})

test('hash memory stays finite and bounded for invalid or extreme configuration', async () => {
  for(const [input,expected] of [[NaN,128],[Infinity,128],[-100,16],[1e9,256],[32.4,32]]) {
    const { engine, workers } = harness({hashMb:input})
    const result=engine.search(position()); workers[0].ready()
    assert.ok(workers[0].commands.includes(`setoption name Hash value ${expected}`))
    workers[0].emit('bestmove e7e5'); await result; engine.dispose()
  }
})

test('a completed download callback cannot close a replacement search’s progress port', async () => {
  const workers: FakeWorker[] = []
  const ports: { onmessage: ((event:{data:{percent:number}})=>void) | null; close():void; closed:number }[] = []
  const engine = new StockfishEngine({url:'/engine.js',
    createWorker:()=>{const worker=new FakeWorker();workers.push(worker);return worker as EngineWorker},
    createProgressChannel:()=>{
      const port={onmessage:null as ((event:{data:{percent:number}})=>void)|null,closed:0,close(){this.closed++}}
      ports.push(port);return {port1:port,port2:{}} as unknown as MessageChannel
    },
  })
  const controller=new AbortController()
  let replacement: ReturnType<StockfishEngine['search']> | undefined
  const first=engine.search({...position(),signal:controller.signal,onProgress:value=>{
    if(value.phase==='loading' && value.percent===1) {
      controller.abort();replacement=engine.search(position(['d4']))
    }
  }})
  const aborted=assert.rejects(first,{name:'AbortError'})
  ports[0].onmessage?.({data:{percent:1}});await aborted
  assert.equal(ports[0].closed,1)
  assert.equal(ports[1].closed,0,'replacement download owns its own open port')
  workers[1].ready();assert.equal(ports[1].closed,1)
  workers[1].emit('bestmove d7d5');await replacement;engine.dispose()
})
