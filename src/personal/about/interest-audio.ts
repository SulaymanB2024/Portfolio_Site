import { bassSamples } from './double-bass-samples.ts'
import { bassSoloSamples } from './bass-solo-samples.ts'

export type AudioArticulation = 'pizzicato' | 'arco'
export type AudioState = 'idle' | 'loading' | 'ready' | 'error'
export type AudioSequenceEvent = { frequency: number | null; delay: number; duration?: number }
export type LiveBassNote = { ready: Promise<void>; release(): void }
export type LiveBassOptions = { sustain?: boolean; onStart?(): void; onEnd?(): void }

/** Crossfade recorded sustain into itself; preserve attack and avoid a discontinuous loop. */
export function prepareSustainLoop(buffer: AudioBuffer) {
  const start = Math.round(.8 * buffer.sampleRate)
  const end = Math.round((buffer.duration - .3) * buffer.sampleRate)
  const fade = Math.round(.06 * buffer.sampleRate)
  if (end <= start + fade || start <= fade) return null
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel)
    for (let frame = 0; frame < fade; frame++) {
      const amount = frame / (fade - 1)
      data[end - fade + frame] = data[end - fade + frame] * (1 - amount) + data[start - fade + frame] * amount
    }
  }
  return { start: start / buffer.sampleRate, end: end / buffer.sampleRate }
}

/** Match sounding pitch, not the library's octave labels. Limited to E1–G3. */
export function resolveBassSample(frequency: number, articulation: AudioArticulation = 'pizzicato') {
  const midi = 69 + 12 * Math.log2(frequency / 440)
  if (!Number.isFinite(midi) || midi < 27.99 || midi > 55.01) throw new RangeError('Double-bass notes must lie between E1 and G3')
  const available = bassSamples.filter(sample => sample.articulation === articulation)
  const sample = available.reduce((nearest, candidate) => Math.abs(candidate.midi - midi) < Math.abs(nearest.midi - midi) ? candidate : nearest)
  return { sample, playbackRate: frequency / sample.frequency }
}

/** Solo literature keeps its true sounding register; the composer range stays E1–G3. */
export function resolveBassSoloSample(frequency: number) {
  const midi = 69 + 12 * Math.log2(frequency / 440)
  if (!Number.isFinite(midi) || midi < 27.99 || midi > 62.01) throw new RangeError('Double-bass solo notes must lie between E1 and D4')
  const available = [...bassSamples.filter(sample => sample.articulation === 'arco'), ...bassSoloSamples]
  const sample = available.reduce((nearest, candidate) => Math.abs(candidate.midi - midi) < Math.abs(nearest.midi - midi) ? candidate : nearest)
  return { sample, playbackRate: frequency / sample.frequency }
}

type Voice = { source: AudioBufferSourceNode; gain: GainNode; start: number; stopping?: boolean; startTimer?: ReturnType<typeof setTimeout>; onEnd?(): void }
const MAX_VOICES = 12
const baseUrl = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'

/** Real recorded CC0 instrument samples. Nothing plays until a visitor's gesture. */
export function createInterestAudio(onState?: (state: AudioState) => void) {
  let context: AudioContext | null = null
  let limiter: DynamicsCompressorNode | null = null
  let stopped = false
  let generation = 0
  let loadRevision = 0
  let state: AudioState = 'idle'
  let loading: Promise<void> | null = null
  let activation: Promise<void> | null = null
  let controller: AbortController | null = null
  const buffers = new Map<string, AudioBuffer>()
  const sustainLoops = new Map<string, { start: number; end: number }>()
  const voices = new Set<Voice>()
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const liveNotes = new Set<() => void>()

  function setState(next: AudioState) {
    if (stopped || state === next) return
    state = next
    onState?.(next)
  }

  function audioContext() {
    if (context) return context
    try {
      context = new AudioContext()
      limiter = context.createDynamicsCompressor()
      limiter.threshold.value = -6
      limiter.knee.value = 8
      limiter.ratio.value = 8
      limiter.attack.value = .005
      limiter.release.value = .12
      limiter.connect(context.destination)
      return context
    }
    catch (error) { setState('error'); throw error }
  }

  async function prepare(solo = false) {
    if (stopped) return
    const required = solo ? [...bassSamples, ...bassSoloSamples] : bassSamples
    if (required.every(sample => buffers.has(sample.file))) { setState('ready'); return }
    if (loading) {
      const revision = loadRevision
      await loading
      if (stopped || revision !== loadRevision) return
      return prepare(solo)
    }
    const activeContext = audioContext()
    const revision = ++loadRevision
    const abort = new AbortController()
    controller = abort
    setState('loading')
    const request = (async () => {
      try {
        await Promise.all(required.map(async sample => {
          if (buffers.has(sample.file)) return
          const response = await fetch(`${baseUrl}audio/double-bass/${sample.file}`, { signal: abort.signal })
          if (!response.ok) throw new Error(`Double-bass sample could not be loaded (${response.status})`)
          const bytes = await response.arrayBuffer()
          if (abort.signal.aborted || stopped || revision !== loadRevision) return
          const decoded = await activeContext.decodeAudioData(bytes)
          // decodeAudioData cannot be aborted. Do not retain a result after cancellation.
          if (!abort.signal.aborted && !stopped && revision === loadRevision && context === activeContext) {
            if (sample.articulation === 'arco') {
              const loop = prepareSustainLoop(decoded)
              if (loop) sustainLoops.set(sample.file, loop)
            }
            buffers.set(sample.file, decoded)
          }
        }))
        if (!abort.signal.aborted && !stopped && revision === loadRevision) setState('ready')
      } catch (error) {
        if (!abort.signal.aborted && !stopped && revision === loadRevision) {
          abort.abort()
          setState('error')
          throw error
        }
      } finally {
        if (revision === loadRevision) { loading = null; controller = null }
      }
    })()
    loading = request
    return request
  }

  async function readyToPlay(request: number, needsSamples = true, cancelled: () => boolean = () => false, solo = false) {
    if (stopped || request !== generation || cancelled()) return null
    const activeContext = audioContext()
    // resume() is requested synchronously from the click/key handler, before any fetch.
    if (activeContext.state === 'suspended') {
      activation ??= activeContext.resume().finally(() => { activation = null })
      try { await activation } catch (error) {
        if (!stopped && request === generation) { setState('error'); throw error }
        return null
      }
    }
    if (stopped || request !== generation || context !== activeContext || cancelled()) return null
    if (needsSamples) await prepare(solo)
    if (stopped || request !== generation || context !== activeContext || activeContext.state !== 'running' || cancelled()) return null
    return activeContext
  }

  function release(voice: Voice) {
    if (!voices.delete(voice)) return
    if (voice.startTimer !== undefined) { clearTimeout(voice.startTimer); timers.delete(voice.startTimer) }
    voice.source.onended = null
    voice.source.disconnect()
    voice.gain.disconnect()
    voice.onEnd?.()
  }

  function stopVoice(voice: Voice, immediately = false) {
    if (voice.stopping && !immediately) return
    voice.stopping = true
    if (voice.startTimer !== undefined) { clearTimeout(voice.startTimer); timers.delete(voice.startTimer) }
    const now = context?.currentTime ?? 0
    try {
      if (!immediately && voice.start <= now && context?.state === 'running') {
        voice.gain.gain.cancelAndHoldAtTime(now)
        voice.gain.gain.linearRampToValueAtTime(0, now + .025)
        voice.source.stop(now + .03)
      } else { voice.source.stop(); release(voice) }
    } catch { release(voice) }
  }

  function schedule(activeContext: AudioContext, frequency: number, start: number, articulation: AudioArticulation, velocity: number, duration?: number, onEnd?: () => void, solo = false) {
    const { sample, playbackRate } = solo ? resolveBassSoloSample(frequency) : resolveBassSample(frequency, articulation)
    const buffer = buffers.get(sample.file)
    if (!buffer) return
    if (voices.size >= MAX_VOICES) stopVoice(voices.values().next().value!, true)
    const source = activeContext.createBufferSource()
    const gain = activeContext.createGain()
    source.buffer = buffer
    source.playbackRate.setValueAtTime(playbackRate, start)
    source.connect(gain).connect(limiter ?? activeContext.destination)
    const naturalDuration = buffer.duration / playbackRate
    const loop = sustainLoops.get(sample.file)
    const requestedDuration = Math.max(solo ? .025 : .08, Math.min(12, duration ?? (articulation === 'arco' ? 2.2 : naturalDuration)))
    const heldDuration = articulation === 'arco' && loop ? requestedDuration : Math.min(naturalDuration, requestedDuration)
    if (articulation === 'arco' && loop && heldDuration > naturalDuration) {
      source.loop = true
      source.loopStart = loop.start
      source.loopEnd = loop.end
    }
    const attack = Math.min(heldDuration / 3, articulation === 'arco' ? .04 : .005)
    const releaseDuration = Math.min(heldDuration / 2, articulation === 'arco' ? .18 : .045)
    const end = start + heldDuration
    const level = Math.max(.05, Math.min(1, velocity)) * .58
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(level, start + attack)
    gain.gain.setValueAtTime(level, end - releaseDuration)
    gain.gain.linearRampToValueAtTime(0, end)
    const voice: Voice = { source, gain, start, onEnd }
    voices.add(voice)
    source.onended = () => release(voice)
    try { source.start(start); source.stop(end) } catch (error) { release(voice); throw error }
    return voice
  }

  async function play(frequency: number, delay = 0, articulation: AudioArticulation = 'pizzicato', velocity = .8, duration?: number) {
    if (stopped) return
    resolveBassSample(frequency, articulation)
    const request = generation
    const activeContext = await readyToPlay(request)
    if (!activeContext) return
    schedule(activeContext, frequency, activeContext.currentTime + Math.max(0, Math.min(120, delay)) + .012, articulation, velocity, duration)
  }

  /** A gesture can be released even while activation or sample decoding is pending. */
  function playLive(frequency: number, articulation: AudioArticulation = 'pizzicato', options: LiveBassOptions = {}): LiveBassNote {
    const request = generation
    let voice: Voice | undefined
    let cancelled = false
    let ended = false
    const finish = () => {
      if (ended) return
      ended = true
      liveNotes.delete(cancel)
      options.onEnd?.()
    }
    const cancel = () => {
      if (cancelled || ended) return
      cancelled = true
      if (voice) stopVoice(voice)
      else finish()
    }
    liveNotes.add(cancel)
    const ready = (async () => {
      try {
        resolveBassSample(frequency, articulation)
        const activeContext = await readyToPlay(request, true, () => cancelled)
        if (!activeContext || cancelled || stopped || request !== generation) { finish(); return }
        // A held bow uses the prepared sustain loop, with a twelve-second safety limit.
        voice = schedule(activeContext, frequency, activeContext.currentTime + .012, articulation, .8, options.sustain && articulation === 'arco' ? 12 : undefined, finish)
        if (!voice) { finish(); return }
        const sounding = voice
        const timer = setTimeout(() => {
          timers.delete(timer)
          if (!cancelled && !ended && !stopped && request === generation && voices.has(sounding)) options.onStart?.()
        }, Math.max(0, (voice.start - activeContext.currentTime) * 1000))
        voice.startTimer = timer
        timers.add(timer)
      } catch (error) { finish(); throw error }
    })()
    return { ready, release: cancel }
  }

  async function scheduleSequence(events: AudioSequenceEvent[], articulation: AudioArticulation = 'pizzicato', velocity = .8, onNote?: (index: number) => void, solo = false) {
    if (stopped || events.length === 0) return
    if (events.length > 64) throw new RangeError('A piece may contain at most 64 notes and rests')
    for (const event of events) {
      if (event.frequency !== null) { if (solo) resolveBassSoloSample(event.frequency); else resolveBassSample(event.frequency, articulation) }
      if (!Number.isFinite(event.delay) || event.delay < 0 || event.delay > 192) throw new RangeError('Invalid note onset')
      if (event.duration !== undefined && (!Number.isFinite(event.duration) || event.duration <= 0 || event.duration > 12)) throw new RangeError('Invalid note duration')
    }
    const request = generation
    const activeContext = await readyToPlay(request, events.some(event => event.frequency !== null), () => false, solo)
    if (!activeContext) return
    const start = activeContext.currentTime + .018
    const ordered = events.map((event, index) => ({ event, index })).sort((a, b) => a.event.delay - b.event.delay)
    let next = 0
    const later = (callback: () => void, milliseconds: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback() }, milliseconds)
      timers.add(timer)
    }
    const pump = () => {
      if (stopped || request !== generation || context !== activeContext) return
      const now = activeContext.currentTime
      // Only create imminent sources; future notes never occupy or steal live voices.
      while (next < ordered.length && start + ordered[next].event.delay <= now + .15) {
        const { event, index } = ordered[next++]
        const onset = start + event.delay
        // A stalled or hidden page must not emit a burst of missed notes on return.
        if (onset + (event.duration ?? .2) < now) continue
        if (event.frequency !== null) schedule(activeContext, event.frequency, Math.max(onset, now + .002), articulation, velocity, event.duration, undefined, solo)
        if (onNote) later(() => { if (!stopped && request === generation) onNote(index) }, Math.max(0, (onset - activeContext.currentTime) * 1000))
      }
      if (next < ordered.length) later(pump, 25)
    }
    pump()
  }

  function playSequence(events: AudioSequenceEvent[], articulation: AudioArticulation = 'pizzicato', velocity = .8, onNote?: (index: number) => void) {
    return scheduleSequence(events, articulation, velocity, onNote)
  }
  function playSoloSequence(events: AudioSequenceEvent[], onNote?: (index: number) => void) {
    return scheduleSequence(events, 'arco', .8, onNote, true)
  }

  function silence() {
    generation++
    for (const cancel of liveNotes) cancel()
    for (const timer of timers) clearTimeout(timer)
    timers.clear()
    for (const voice of voices) stopVoice(voice)
    if (controller) {
      loadRevision++
      controller.abort()
      controller = null
      loading = null
      setState(bassSamples.every(sample => buffers.has(sample.file)) ? 'ready' : 'idle')
    }
  }

  function dispose() {
    if (stopped) return
    stopped = true
    silence()
    for (const voice of voices) stopVoice(voice, true)
    voices.clear()
    buffers.clear()
    sustainLoops.clear()
    const activeContext = context
    context = null
    limiter?.disconnect()
    limiter = null
    void activeContext?.close().catch(() => { /* Already closing. */ })
  }

  return { prepare, play, playLive, playSequence, playSoloSequence, silence, dispose }
}
