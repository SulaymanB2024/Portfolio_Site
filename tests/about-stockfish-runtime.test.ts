import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { Chess } from '../src/personal/about/chess-game.ts'

const enginePath = fileURLToPath(new URL('../public/engines/stockfish/stockfish-19-single.js', import.meta.url))
const foolHistory = ['f2f3', 'e7e5', 'g2g4']
const scholarHistory = ['e2e4', 'e7e5', 'f1c4', 'b8c6', 'd1h5', 'g8f6']
const promotionFen = '7k/5P2/6K1/8/8/8/8/8 w - - 0 1'
const positions = [
  'position startpos',
  `position startpos moves ${foolHistory.join(' ')}`,
  `position startpos moves ${scholarHistory.join(' ')}`,
  `position fen ${promotionFen}`,
]

// The upstream factory uses CommonJS while this site's .js files inherit ESM.
// Run its unchanged factory in a subprocess to isolate engine memory, global
// fetch overrides and process listeners from the remaining test suite.
const runtimeProbe = String.raw`
const { readFileSync } = require('node:fs');
const { createRequire } = require('node:module');
const { dirname } = require('node:path');
const { compileFunction } = require('node:vm');
const enginePath = process.argv[1];
const positions = JSON.parse(process.argv[2]);
const upstreamModule = { exports: {} };
compileFunction(readFileSync(enginePath, 'utf8'),
  ['exports', 'require', 'module', '__filename', '__dirname'], { filename: enginePath }
)(upstreamModule.exports, createRequire(enginePath), upstreamModule, enginePath, dirname(enginePath));

async function probe() {
  const lines = [];
  let waiting;
  let engine;
  const priorListeners = new Map(['uncaughtException', 'unhandledRejection'].map(
    event => [event, new Set(process.listeners(event))]
  ));
  try {
    engine = await upstreamModule.exports()({
      locateFile: name => name.includes('.wasm') ? enginePath.replace(/\.js$/, '.wasm') : enginePath,
      listener: text => {
        for (const line of String(text).split(/\r?\n/).filter(Boolean)) {
          lines.push(line);
          if (waiting && waiting.matches(line)) waiting.resolve();
        }
      },
      onDoneSearching: () => {},
    });

    async function command(text, matches) {
      const firstLine = lines.length;
      const output = matches ? new Promise(resolve => { waiting = { matches, resolve }; }) : Promise.resolve();
      try {
        // Upstream requires Asyncify's async flag for every go command.
        const completed = engine.ccall('command', null, ['string'], [text], { async: /^go\b/.test(text) });
        await Promise.all([output, completed]);
        return lines.slice(firstLine);
      } finally {
        waiting = undefined;
      }
    }

    const uci = await command('uci', line => line === 'uciok');
    for (const option of [
      'Threads value 1', 'Hash value 32', 'Skill Level value 20',
      'UCI_LimitStrength value false', 'MultiPV value 1',
    ]) await command('setoption name ' + option);
    await command('isready', line => line === 'readyok');

    const searches = [];
    for (const position of positions) {
      await command('ucinewgame');
      await command('isready', line => line === 'readyok');
      await command(position);
      searches.push(await command('go movetime 500', line => line.startsWith('bestmove ')));
    }
    return { uci, searches };
  } finally {
    waiting = undefined;
    if (engine) {
      engine.listener = () => {};
      engine.ccall('command', null, ['string'], ['quit']);
      engine.terminate();
    }
    for (const [event, retained] of priorListeners) {
      for (const listener of process.listeners(event)) {
        if (!retained.has(listener)) process.removeListener(event, listener);
      }
    }
  }
}

probe().then(
  result => process.stdout.write(JSON.stringify(result) + '\n', () => process.exit(0)),
  error => { console.error(error); process.exit(1); }
);
`

function playUci(game: Chess, uci: string) {
  assert.match(uci, /^[a-h][1-8][a-h][1-8][qrbn]?$/)
  return game.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), ...(uci[4] ? { promotion: uci[4] } : {}) })
}

function bestmove(lines: string[]) {
  const result = lines.find(line => line.startsWith('bestmove '))
  assert.ok(result, 'the actual engine must finish its bounded search')
  return result.split(' ')[1]
}

test('vendored full NNUE Stockfish plays legal moves, mating tactics and promotion', { timeout: 25_000 }, async () => {
  const { stdout } = await promisify(execFile)(process.execPath,
    ['--input-type=commonjs', '--eval', runtimeProbe, enginePath, JSON.stringify(positions)],
    { timeout: 20_000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 })
  const { uci, searches } = JSON.parse(stdout) as { uci: string[], searches: string[][] }
  assert.ok(uci.includes('id name Stockfish 19 WASM'))
  assert.ok(uci.includes('option name Threads type spin default 1 min 1 max 1'))
  assert.ok(uci.includes('option name Skill Level type spin default 20 min 0 max 20'))
  assert.ok(uci.includes('option name UCI_LimitStrength type check default false'))
  assert.ok(uci.includes('option name EvalFile type string default nn-1a298aa575a0.nnue'))
  assert.equal(searches.length, 4)
  assert.ok(searches[0].some(line => line.startsWith('info string NNUE evaluation using nn-1a298aa575a0.nnue')))

  const opening = new Chess()
  assert.ok(playUci(opening, bestmove(searches[0])), 'opening search must choose a legal move')

  const fool = new Chess()
  for (const move of foolHistory) playUci(fool, move)
  assert.equal(playUci(fool, bestmove(searches[1])).san, 'Qh4#')
  assert.equal(fool.isCheckmate(), true)

  const scholar = new Chess()
  for (const move of scholarHistory) playUci(scholar, move)
  assert.equal(playUci(scholar, bestmove(searches[2])).san, 'Qxf7#')
  assert.equal(scholar.isCheckmate(), true)

  const promotion = new Chess(promotionFen)
  const promoted = playUci(promotion, bestmove(searches[3]))
  assert.ok(promoted.promotion, 'engine must include the promotion piece in its UCI move')
  assert.equal(promotion.isCheckmate(), true)
})
