import { useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from 'react'
import { bassStrings } from './about-content'
import { midiFrequency, midiLabel } from './music-phrase'
import type { AudioArticulation, AudioState, createInterestAudio, LiveBassNote } from './interest-audio'
import type { PerformanceBowingSource } from './performance-bowing'
import BassRepertoirePlayer, { type BassRepertoireHandle } from './BassRepertoirePlayer'
import './bass-instrument.css'

export type BassInstrumentHandle = { tap(index: number): void }
type Props = {
  ref: Ref<BassInstrumentHandle>
  articulation: AudioArticulation
  position: number
  audioState: AudioState
  getAudio(): ReturnType<typeof createInterestAudio>
  onTechnique(value: AudioArticulation): void
  onPosition(value: number): void
  onSound(index: number, midi: number): void
  onPlaying(sounding: boolean): void
  onRecordingStart(): void
  onBowing(source: PerformanceBowingSource | null): void
  onError(): void
}
const landmarks = [{ position: 0, label: 'Open' }, { position: 5, label: 'Fourth' }, { position: 7, label: 'Fifth' }, { position: 12, label: 'Octave' }]
const positionLabel = (position: number) => landmarks.find(item => item.position === position)?.label ?? `+${position} semitone${position === 1 ? '' : 's'}`

export default function BassInstrument({ ref, articulation, position, audioState, getAudio, onTechnique, onPosition, onSound, onPlaying, onRecordingStart, onBowing, onError }: Props) {
  const [active, setActive] = useState<Set<number>>(() => new Set())
  const [pending, setPending] = useState<Set<number>>(() => new Set())
  const [lastPitch, setLastPitch] = useState<number | null>(null)
  const [mode, setMode] = useState<'play' | 'listen'>('play')
  const [soloSounding, setSoloSounding] = useState(false)
  const repertoire = useRef<BassRepertoireHandle>(null)
  const notes = useRef(new Map<number, { id: number; note?: LiveBassNote }>())
  const holds = useRef(new Map<string, LiveBassNote>())
  const serial = useRef(0)
  const alive = useRef(true)
  const stop = useCallback(() => {
    const sounding = [...notes.current.values()]
    notes.current.clear()
    holds.current.clear()
    sounding.forEach(item => item.note?.release())
    if (alive.current) { setActive(new Set()); setPending(new Set()) }
  }, [])
  const play = useCallback((index: number, sustain = false, token?: string) => {
    if (!bassStrings[index]) return
    repertoire.current?.pause()
    setMode('play')
    const previous = notes.current.get(index)
    const id = ++serial.current
    notes.current.set(index, { id })
    previous?.note?.release()
    const midi = bassStrings[index].midi + position
    setPending(value => new Set(value).add(index))
    setActive(value => { const next = new Set(value); next.delete(index); return next })
    const note = getAudio().playLive(midiFrequency(midi), articulation, {
      sustain,
      onStart() {
        if (!alive.current || notes.current.get(index)?.id !== id) return
        setPending(value => { const next = new Set(value); next.delete(index); return next })
        setActive(value => new Set(value).add(index))
        setLastPitch(midi)
        onSound(index, midi)
      },
      onEnd() {
        if (!alive.current || notes.current.get(index)?.id !== id) return
        notes.current.delete(index)
        setPending(value => { const next = new Set(value); next.delete(index); return next })
        setActive(value => { const next = new Set(value); next.delete(index); return next })
      },
    })
    const current = notes.current.get(index)
    if (current?.id === id) current.note = note
    if (token && articulation === 'arco') holds.current.set(token, note)
    void note.ready.catch(() => { if (alive.current) onError() })
  }, [articulation, position, getAudio, onSound, onError])
  const lift = useCallback((token: string) => {
    const note = holds.current.get(token)
    holds.current.delete(token)
    note?.release()
  }, [])
  const beforeRecording = useCallback(() => { stop(); getAudio().silence() }, [stop, getAudio])
  useImperativeHandle(ref, () => ({ tap: index => play(index) }), [play])
  useEffect(() => { stop(); setLastPitch(null) }, [articulation, position, stop])
  useEffect(() => {
    alive.current = true
    const hide = () => { if (document.hidden) stop() }
    window.addEventListener('blur', stop)
    document.addEventListener('visibilitychange', hide)
    return () => { alive.current = false; stop(); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', hide) }
  }, [stop])
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as Element
      if (!target.closest('.about-object-reveal') || target.closest('input,select,textarea,[contenteditable="true"],summary,a')) return
      const key = event.key.toLowerCase()
      const index = ['a', 's', 'd', 'f'].indexOf(key)
      if (index < 0) return
      event.preventDefault()
      if (!event.repeat) play(index, true, `key:${key}`)
    }
    const up = (event: KeyboardEvent) => lift(`key:${event.key.toLowerCase()}`)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [play, lift])
  const sounding = active.size > 0
  useEffect(() => { onPlaying(sounding || soloSounding) }, [sounding, soloSounding, onPlaying])
  useEffect(() => () => onPlaying(false), [onPlaying])
  const instruction = articulation === 'arco' ? 'Hold a string to bow. Release to lift the bow.' : 'Tap a string. Let it ring.'
  function chooseMode(next: 'play' | 'listen') {
    if (next === mode) return
    stop()
    if (next === 'play') repertoire.current?.pause()
    setMode(next)
  }
  return <div className="bass-instrument" data-technique={articulation} data-playing={sounding} data-mode={mode}>
    <div className="bass-mode-switch mono" role="group" aria-label="Explore the double bass">
      <button aria-pressed={mode === 'play'} aria-controls="bass-play-panel" onClick={() => chooseMode('play')}>Play<span className="sr-only">The four strings</span></button>
      <button aria-pressed={mode === 'listen'} aria-controls="bass-listen-panel" onClick={() => chooseMode('listen')}>Listen<span className="sr-only">Concert recordings</span></button>
    </div>
    <div id="bass-listen-panel" hidden={mode !== 'listen'}>
      <BassRepertoirePlayer ref={repertoire} beforePlay={beforeRecording} onStart={onRecordingStart} onSounding={setSoloSounding} onBowing={onBowing}/>
    </div>
    <div id="bass-play-panel" className="bass-hands-on" hidden={mode !== 'play'}>
    <div className="bass-techniques mono" role="group" aria-label="Bass playing technique">
      <span className="bass-technique-label" aria-hidden="true">Technique</span>
      <button aria-pressed={articulation === 'pizzicato'} onClick={() => { repertoire.current?.pause(); stop(); onTechnique('pizzicato') }}><span className="bass-technique-name">Pizzicato</span><span className="sr-only">Pluck & release</span></button>
      <button aria-pressed={articulation === 'arco'} onClick={() => { repertoire.current?.pause(); stop(); onTechnique('arco') }}><span className="bass-technique-name">Arco</span><span className="sr-only">Hold to bow</span></button>
    </div>
    <div className="bass-strings" role="group" aria-label="Play a bass string" aria-describedby="bass-playing-help">
      <svg className="bass-bridge-study" viewBox="0 0 320 220" preserveAspectRatio="none" aria-hidden="true"><path d="M40 24H280 M12 179C74 156 246 156 308 179"/><path d="M12 182C74 159 246 159 308 182"/></svg>
      {bassStrings.map((string, index) => {
        // A stopped string shortens by the actual equal-tempered pitch ratio.
        const fingerY = 12 + 130 * (1 - 2 ** (-position / 12))
        const length = 142 - fingerY
        return <button key={string.label} aria-label={`${articulation === 'arco' ? 'Bow' : 'Pluck'} ${string.label} string, ${midiLabel(string.midi + position)}`} data-string={index} data-sounding={active.has(index)} data-pending={pending.has(index)} style={{ '--string-weight': `${2 - index * .38}px`, '--resonance-time': `${100 + index * 23}ms` } as CSSProperties}
        onPointerDown={event => {
          if (event.button !== 0 || !event.isPrimary) return
          event.currentTarget.setPointerCapture(event.pointerId)
          play(index, true, `pointer:${event.pointerId}`)
        }}
        onPointerUp={event => lift(`pointer:${event.pointerId}`)}
        onPointerCancel={event => lift(`pointer:${event.pointerId}`)}
        onLostPointerCapture={event => lift(`pointer:${event.pointerId}`)}
        onClick={event => { if (event.detail === 0) play(index) }}
      ><span className="bass-string-number" aria-hidden="true">{string.label}</span><svg key={notes.current.get(index)?.id ?? 0} className="bass-string-study" viewBox="0 0 80 156" aria-hidden="true" focusable="false">
        <path className="bass-string-anchor" d="M 29 8 L 51 8 M 16 148 Q 40 139 64 148"/>
        <path className="bass-string-core" d="M 40 12 L 40 142"/>
        <path className="bass-string-resonance" d={`M 40 ${fingerY} C 45 ${fingerY + length * .25} 45 ${fingerY + length * .75} 40 142`}/>
        <circle className="bass-string-contact" cx="40" cy={fingerY} r={position ? 3.2 : 2}/>
        <path className="bass-string-bow" d={`M 15 ${fingerY + length * .55 + 4} L 65 ${fingerY + length * .55 - 4}`}/>
      </svg><span className="bass-string-pitch">{midiLabel(string.midi + position)}</span><kbd>{string.key}</kbd></button>
      })}
    </div>
    <div className="bass-listening mono" aria-live="off">
      <span className="bass-listening-dot" aria-hidden="true"/>
      <span>{pending.size ? 'Preparing…' : sounding ? articulation === 'arco' ? 'Bowing' : 'Ringing' : lastPitch !== null ? 'Last note' : 'E · A · D · G'}</span>
      {lastPitch !== null && <span className="bass-pitch-reading">{midiLabel(lastPitch)} <span>{midiFrequency(lastPitch).toFixed(1)} Hz</span></span>}
      <button onClick={stop} disabled={!sounding && !pending.size} aria-label="Silence the bass">Stop</button>
    </div>
    <p id="bass-playing-help" className="bass-help mono">{instruction}<span>{articulation === 'arco' ? 'Hold' : 'Keys'} A · S · D · F</span>{articulation === 'arco' && <span className="sr-only">Enter or Space on a string plays a short bow.</span>}</p>
    <div className="bass-fingerboard">
      <label htmlFor="bass-finger-position" className="mono">Fingerboard<span>{position === 0 ? 'Open strings' : positionLabel(position)}</span></label>
      <input id="bass-finger-position" aria-label="Bass finger position" aria-valuetext={position === 0 ? 'Open strings' : `${positionLabel(position)}, ${position} semitones above the open strings`} type="range" min={0} max={12} step={1} value={position} onChange={event => { repertoire.current?.pause(); stop(); onPosition(Number(event.target.value)) }}/>
      <div className="bass-landmarks mono" role="group" aria-label="Choose an interval above the open strings">{landmarks.map(item => <button key={item.position} aria-pressed={position === item.position} aria-label={item.position === 0 ? 'Use open strings' : `Move ${item.position === 12 ? 'an octave' : `a perfect ${item.label.toLowerCase()}`} above the open strings`} onClick={() => { repertoire.current?.pause(); stop(); onPosition(item.position) }}><span>{item.label}</span><span aria-hidden="true">{item.position === 0 ? '0' : `+${item.position}`}</span></button>)}</div>
    </div>
    {(audioState === 'loading' || audioState === 'error') && <p className="bass-library-status mono" role="status">{audioState === 'loading' ? 'Loading recorded double bass…' : 'Sound couldn’t load. Play a string to retry.'}</p>}
    </div>
  </div>
}
