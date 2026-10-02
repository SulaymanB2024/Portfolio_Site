import test from 'node:test'
import assert from 'node:assert/strict'
import { createInterestAudio, prepareSustainLoop, resolveBassSample } from '../src/personal/about/interest-audio.ts'
import { phraseSchedule } from '../src/personal/about/music-phrase.ts'
import { bassSamples } from '../src/personal/about/double-bass-samples.ts'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
class Parameter {
  value = 0
  points: Array<[number, number]> = []
  setValueAtTime(value: number, time: number) { this.value = value; this.points.push([value, time]) }
  linearRampToValueAtTime(value: number, time: number) { this.points.push([value, time]) }
  cancelAndHoldAtTime() {}
}
class Gain {
  gain = new Parameter()
  disconnected = false
  connect() { return this }
  disconnect() { this.disconnected = true }
}
class Source {
  buffer: { duration: number; file: string } | null = null
  playbackRate = new Parameter()
  startTime = -1
  stops: Array<number | undefined> = []
  disconnected = false
  onended: (() => void) | null = null
  loop = false
  loopStart = 0
  loopEnd = 0
  connect(node: Gain) { return node }
  start(time: number) { this.startTime = time }
  stop(time?: number) { this.stops.push(time) }
  disconnect() { this.disconnected = true }
  finish() { this.onended?.() }
}
class MockAudioContext {
  state = 'running'
  currentTime = 10
  destination = {}
  sources: Source[] = []
  gains: Gain[] = []
  decoded = 0
  closes = 0
  resumes = 0
  resumeGate: ReturnType<typeof deferred<void>> | null = null
  decodeGate: ReturnType<typeof deferred<void>> | null = null
  createDynamicsCompressor() {
    return { threshold: new Parameter(), knee: new Parameter(), ratio: new Parameter(), attack: new Parameter(), release: new Parameter(), connect() {}, disconnect() {} }
  }
  async resume() { this.resumes++; if (this.resumeGate) await this.resumeGate.promise; this.state = 'running' }
  async decodeAudioData(bytes: ArrayBuffer) {
    this.decoded++
    if (this.decodeGate) await this.decodeGate.promise
    const data = new Float32Array(3400)
    return { duration: 3.4, sampleRate: 1000, numberOfChannels: 1, getChannelData: () => data, file: new TextDecoder().decode(bytes) }
  }
  createBufferSource() { const source = new Source(); this.sources.push(source); return source }
  createGain() { const gain = new Gain(); this.gains.push(gain); return gain }
  async close() { this.closes++; this.state = 'closed' }
}

async function withAudio(run: (context: MockAudioContext, requests: Array<{ url: string; signal: AbortSignal }>) => Promise<void>, configure?: (context: MockAudioContext) => void, fetcher?: (url: string, signal: AbortSignal) => Promise<Response>) {
  const originalContext = globalThis.AudioContext, originalFetch = globalThis.fetch
  const context = new MockAudioContext()
  configure?.(context)
  const requests: Array<{ url: string; signal: AbortSignal }> = []
  globalThis.AudioContext = class { constructor() { return context } } as unknown as typeof AudioContext
  globalThis.fetch = ((url: string, init: { signal: AbortSignal }) => {
    requests.push({ url, signal: init.signal })
    if (fetcher) return fetcher(url, init.signal)
    return Promise.resolve({ ok: true, arrayBuffer: async () => new TextEncoder().encode(url.split('/').at(-1)).buffer } as Response)
  }) as unknown as typeof fetch
  try { await run(context, requests) }
  finally {
    globalThis.fetch = originalFetch
    if (originalContext) globalThis.AudioContext = originalContext
    else delete (globalThis as { AudioContext?: unknown }).AudioContext
  }
}
const tick = () => new Promise<void>(resolve => setImmediate(resolve))

async function withClock(context: MockAudioContext, run: (advance: (milliseconds: number) => void) => Promise<void>) {
  const originalSet = globalThis.setTimeout, originalClear = globalThis.clearTimeout
  const origin = context.currentTime
  let milliseconds = 0, serial = 0
  const queue = new Map<number, { due: number; callback: () => void }>()
  globalThis.setTimeout = ((callback: () => void, delay = 0) => {
    const id = ++serial
    queue.set(id, { due: milliseconds + Math.max(0, delay), callback })
    return id
  }) as unknown as typeof setTimeout
  globalThis.clearTimeout = ((id: number) => { queue.delete(id) }) as unknown as typeof clearTimeout
  const setClock = (time: number) => {
    milliseconds = time
    context.currentTime = origin + time / 1000
    for (const source of context.sources) if (!source.disconnected && (source.stops.at(-1) ?? Infinity) <= context.currentTime) source.finish()
  }
  const advance = (amount: number) => {
    const target = milliseconds + amount
    let iterations = 0
    while (true) {
      const next = [...queue.entries()].filter(([, value]) => value.due <= target).sort((a, b) => a[1].due - b[1].due)[0]
      if (!next) break
      if (++iterations > 20000) throw new Error('Unbounded audio scheduling')
      queue.delete(next[0]); setClock(next[1].due); next[1].callback()
    }
    setClock(target)
  }
  try { await run(advance) }
  finally { globalThis.setTimeout = originalSet; globalThis.clearTimeout = originalClear }
}

test('closing or silencing an interest cancels audio waiting for browser activation', async () => {
  await withAudio(async (context, requests) => {
    const audio = createInterestAudio()
    const pending = audio.play(55)
    audio.silence()
    context.resumeGate!.resolve()
    await pending
    assert.equal(context.sources.length, 0)
    assert.equal(requests.length, 0)
    audio.dispose()
    assert.equal(context.closes, 1)
  }, context => { context.state = 'suspended'; context.resumeGate = deferred<void>() })
  await withAudio(async (context, requests) => {
    const audio = createInterestAudio()
    const pending = audio.play(55)
    audio.dispose()
    context.resumeGate!.resolve()
    await pending
    await audio.play(55)
    assert.equal(context.sources.length, 0)
    assert.equal(requests.length, 0)
    assert.equal(context.closes, 1)
  }, context => { context.state = 'suspended'; context.resumeGate = deferred<void>() })
})

test('concurrent preparation and notes share one fetch/decode per actual sample', async () => {
  await withAudio(async (context, requests) => {
    const states: string[] = []
    const audio = createInterestAudio(state => states.push(state))
    assert.equal(requests.length, 0, 'creating the instrument must not eagerly download audio')
    await Promise.all([audio.prepare(), audio.prepare(), audio.play(41.203), audio.play(55)])
    assert.equal(requests.length, bassSamples.length)
    assert.equal(new Set(requests.map(request => request.url)).size, bassSamples.length)
    assert.equal(context.decoded, bassSamples.length)
    assert.deepEqual(states, ['loading', 'ready'])
    assert.equal(context.sources.length, 2)
    assert.equal(context.sources[0].buffer!.file, 'pizzicato-E1.wav')
    assert.equal(context.sources[1].buffer!.file, 'pizzicato-G1.wav')
    await audio.play(97.999, 0, 'arco')
    assert.equal(context.sources.at(-1)!.buffer!.file, 'arco-A2.wav')
    assert.equal(requests.length, bassSamples.length)
    audio.dispose()
    assert.ok(context.sources.every(source => source.disconnected))
    assert.ok(context.gains.every(gain => gain.disconnected))
  })
})

test('silence aborts downloads and a later gesture can retry without late sound', async () => {
  let first = true
  await withAudio(async (context, requests) => {
    const states: string[] = []
    const audio = createInterestAudio(state => states.push(state))
    const pending = audio.play(55)
    await tick()
    assert.equal(requests.length, bassSamples.length)
    audio.silence()
    await pending
    assert.ok(requests.every(request => request.signal.aborted))
    assert.equal(context.sources.length, 0)
    assert.deepEqual(states, ['loading', 'idle'])
    first = false
    await audio.play(55)
    assert.equal(context.sources.length, 1)
    assert.equal(states.at(-1), 'ready')
    audio.dispose()
  }, undefined, (url, signal) => first ? new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })) : Promise.resolve({ ok: true, arrayBuffer: async () => new TextEncoder().encode(url.split('/').at(-1)).buffer } as Response))
})

test('dispose during unabortable decoding never retains buffers or starts a note', async () => {
  await withAudio(async (context) => {
    const states: string[] = []
    const audio = createInterestAudio(state => states.push(state))
    const pending = audio.play(55)
    await tick()
    assert.equal(context.decoded, bassSamples.length)
    audio.dispose()
    context.decodeGate!.resolve()
    await pending
    assert.equal(context.sources.length, 0)
    assert.equal(context.closes, 1)
    assert.deepEqual(states, ['loading'])
  }, context => { context.decodeGate = deferred<void>() })
})

test('a phrase waits for readiness, then shares one clock and cancels visual callbacks', async () => {
  await withAudio(async (context) => {
    const audio = createInterestAudio()
    const seen: number[] = []
    const pending = audio.playSequence([{ frequency: 55, delay: 0, duration: .5 }, { frequency: 82.4069, delay: .5, duration: .4 }], 'arco', .8, index => seen.push(index))
    await tick()
    assert.equal(context.sources.length, 0)
    context.currentTime = 25
    context.decodeGate!.resolve()
    await pending
    assert.equal(context.sources.length, 1, 'future note must not consume a live voice')
    assert.equal(context.sources[0].startTime, 25.018)
    context.currentTime = 25.4
    await new Promise(resolve => setTimeout(resolve, 35))
    assert.equal(context.sources.length, 2)
    assert.equal(context.sources[1].startTime, 25.518)
    assert.equal(context.sources[0].stops[0], 25.518)
    audio.silence()
    await new Promise(resolve => setTimeout(resolve, 35))
    assert.deepEqual(seen, [0], 'pending next-note callback was cancelled')
    for (const source of context.sources) source.finish() // Simulate the browser's onended after the short fade.
    assert.ok(context.sources.every(source => source.disconnected))
    audio.dispose()
  }, context => { context.decodeGate = deferred<void>() })
})

test('rapid playing has bounded voices and releases ended and stolen nodes', async () => {
  await withAudio(async (context) => {
    const audio = createInterestAudio()
    await audio.prepare()
    for (let i = 0; i < 20; i++) await audio.play(55)
    assert.equal(context.sources.filter(source => !source.disconnected).length, 12)
    assert.ok(context.sources.slice(0, 8).every(source => source.disconnected))
    for (const source of context.sources) source.finish()
    assert.ok(context.sources.every(source => source.disconnected))
    assert.ok(context.gains.every(gain => gain.disconnected))
    audio.dispose()
  })
})

test('failed sample fetch reports error, retries, and never synthesizes a substitute', async () => {
  let fail = true
  await withAudio(async (context) => {
    const states: string[] = []
    const audio = createInterestAudio(state => states.push(state))
    await assert.rejects(audio.play(55), /could not be loaded/)
    assert.equal(context.sources.length, 0)
    assert.equal(states.at(-1), 'error')
    fail = false
    await audio.play(55)
    assert.equal(context.sources.length, 1)
    assert.equal(states.at(-1), 'ready')
    audio.dispose()
  }, undefined, (url) => Promise.resolve({ ok: !fail, status: fail ? 404 : 200, arrayBuffer: async () => new TextEncoder().encode(url.split('/').at(-1)).buffer } as Response))
})

test('the complete chromatic E1–G3 range uses bounded tuning from measured real pitches', () => {
  for (const articulation of ['pizzicato', 'arco'] as const) {
    for (let midi = 28; midi <= 55; midi++) {
      const frequency = 440 * 2 ** ((midi - 69) / 12)
      const resolved = resolveBassSample(frequency, articulation)
      assert.equal(resolved.sample.articulation, articulation)
      assert.ok(Math.abs(12 * Math.log2(resolved.playbackRate)) < 3.1)
      assert.ok(Math.abs(resolved.sample.frequency * resolved.playbackRate - frequency) < .000001)
    }
  }
  assert.throws(() => resolveBassSample(0), RangeError)
  assert.throws(() => resolveBassSample(20.6), RangeError)
  assert.throws(() => resolveBassSample(440), RangeError)
})

test('a full 64-event piece preserves every onset including rests without evicting early voices', async () => {
  await withAudio(async (context) => {
    await withClock(context, async advance => {
      const audio = createInterestAudio()
      const events = phraseSchedule(Array.from({ length: 64 }, (_, index) => ({ midi: index % 2 ? null : 28, beats: 2 })), 40)
      const seen: number[] = []
      let maximumLive = 0
      await audio.playSequence(events, 'arco', .8, index => {
        seen.push(index)
        maximumLive = Math.max(maximumLive, context.sources.filter(source => !source.disconnected).length)
      })
      assert.equal(context.sources.length, 1)
      assert.equal(context.sources[0].stops.length, 1, 'the first note has only its musical release, never a stolen-voice stop')
      advance(192100)
      assert.deepEqual(seen, Array.from({ length: 64 }, (_, index) => index))
      assert.equal(context.sources.length, 32, 'rests never create BufferSources')
      assert.ok(maximumLive <= 2)
      assert.ok(context.sources.every(source => source.disconnected))
      for (let index = 0; index < context.sources.length; index++) assert.ok(Math.abs(context.sources[index].startTime - (10.018 + index * 6)) < .000001)
      audio.dispose()
    })
  })
})

test('silencing a long lookahead sequence cancels future sound and rest cursors', async () => {
  await withAudio(async (context) => {
    await withClock(context, async advance => {
      const audio = createInterestAudio()
      const seen: number[] = []
      await audio.playSequence(phraseSchedule(Array.from({ length: 64 }, (_, index) => ({ midi: index % 3 ? 43 : null, beats: .25 })), 120), 'pizzicato', .8, index => seen.push(index))
      assert.ok(context.sources.length <= 2, 'only imminent notes are allocated')
      advance(700)
      assert.ok(seen.length > 0 && seen.length < 64)
      audio.silence()
      const created = context.sources.length, callbacks = seen.length
      advance(10000)
      assert.equal(context.sources.length, created)
      assert.equal(seen.length, callbacks)
      assert.ok(context.sources.every(source => source.disconnected))
      audio.dispose()
    })
  })
})

test('an all-rest piece advances its complete visual rhythm without a sample download', async () => {
  await withAudio(async (context, requests) => {
    await withClock(context, async advance => {
      const audio = createInterestAudio()
      const seen: number[] = []
      await audio.playSequence(phraseSchedule([{ midi: null, beats: 1 }, { midi: null, beats: 4 }], 60), 'pizzicato', .8, index => seen.push(index))
      advance(5100)
      assert.deepEqual(seen, [0, 1])
      assert.equal(requests.length, 0)
      assert.equal(context.sources.length, 0)
      audio.dispose()
    })
  })
})

test('slow whole notes sustain the actual bowed recording until their musical release', async () => {
  await withAudio(async context => {
    const audio = createInterestAudio()
    await audio.playSequence(phraseSchedule([{ midi: 28, beats: 4 }], 40), 'arco')
    const source = context.sources[0]
    assert.equal(source.loop, true)
    assert.ok(source.loopStart > 0 && source.loopEnd < 3.4 && source.loopEnd > source.loopStart)
    assert.ok(Math.abs(source.stops[0]! - source.startTime - 6) < .000001)
    audio.dispose()
  })
})

test('sustain crossfade preserves the recorded attack and makes the loop boundary continuous', () => {
  const sampleRate = 1000
  const data = Float32Array.from({ length: 3400 }, (_, frame) => Math.sin(frame * .23) * .6)
  const original = data.slice()
  const buffer = { sampleRate, duration: 3.4, numberOfChannels: 1, getChannelData: () => data } as unknown as AudioBuffer
  const loop = prepareSustainLoop(buffer)!
  assert.deepEqual(data.slice(0, 800), original.slice(0, 800))
  const start = Math.round(loop.start * sampleRate), end = Math.round(loop.end * sampleRate)
  assert.equal(data[end - 1], data[start - 1])
  assert.equal(data[end - 1] - data[start], data[start - 1] - data[start], 'loop handoff follows the original adjacent recorded samples')
  assert.ok(data.subarray(end - 60, end).some(value => value !== 0))
})
