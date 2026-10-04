export type RecordingState = { phase: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'; position: number; duration: number }
export type RecordingMedia = Pick<HTMLAudioElement, 'src' | 'currentTime' | 'duration' | 'paused' | 'play' | 'pause' | 'load' | 'removeAttribute' | 'addEventListener' | 'removeEventListener'>

/** One native media stream; stopping invalidates pending play promises and frees its source. */
export function createRecordingPlayer(media: RecordingMedia, update: (state: RecordingState) => void, sounding: (value: boolean) => void) {
  let state: RecordingState = { phase: 'idle', position: 0, duration: 0 }
  let epoch = 0, disposed = false, wanted = false, source = ''
  const publish = (phase = state.phase) => {
    if (disposed) return
    state = { phase, position: Number.isFinite(media.currentTime) ? media.currentTime : 0, duration: Number.isFinite(media.duration) ? media.duration : 0 }
    update(state)
  }
  const playing = () => { if (wanted && !disposed) { publish('playing'); sounding(true) } }
  const waiting = () => { if (wanted && !disposed) { publish('loading'); sounding(false) } }
  const paused = () => {
    // Browser and system media controls can pause without using our button.
    // A queued pause from an old source must not interrupt an already resumed stream.
    if (!source || disposed || !wanted || !media.paused) return
    epoch++; wanted = false; publish('paused'); sounding(false)
  }
  const ended = () => { if (!source || disposed) return; wanted = false; epoch++; publish('ended'); sounding(false) }
  const error = () => { if (!wanted || disposed) return; wanted = false; epoch++; publish('error'); sounding(false) }
  const position = () => { if (source && !disposed) publish() }
  const listeners: [string, () => void][] = [['playing', playing], ['waiting', waiting], ['pause', paused], ['ended', ended], ['error', error], ['timeupdate', position], ['loadedmetadata', position], ['durationchange', position]]
  listeners.forEach(([event, handler]) => media.addEventListener(event, handler))
  function stop() {
    epoch++; wanted = false; source = ''
    media.pause(); media.removeAttribute('src'); media.load()
    sounding(false)
    state = { phase: 'idle', position: 0, duration: 0 }
    if (!disposed) update(state)
  }
  function play(url: string) {
    if (disposed) return
    const request = ++epoch
    if (source !== url || state.phase === 'error') { media.pause(); media.src = url; source = url; media.load() }
    else if (state.phase === 'ended') media.currentTime = 0
    wanted = true; publish('loading')
    // Call play directly in the visitor's gesture; no sample decoding or generated notes.
    void media.play().catch(() => { if (!disposed && request === epoch && wanted) error() })
  }
  function pause() { epoch++; wanted = false; media.pause(); sounding(false); publish('paused') }
  function seek(seconds: number) {
    if (!source || !Number.isFinite(seconds) || !Number.isFinite(media.duration) || media.duration <= 0) return
    media.currentTime = Math.max(0, Math.min(media.duration, seconds)); publish()
  }
  function dispose() { if (disposed) return; stop(); disposed = true; listeners.forEach(([event, handler]) => media.removeEventListener(event, handler)) }
  return { play, pause, stop, seek, dispose }
}
