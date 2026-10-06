import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { bassRecordings, DEFAULT_BASS_RECORDING, recordingTime } from './bass-recordings'
import { createPerformanceBowing, type PerformanceBowingSource } from './performance-bowing'
import { createRecordingPlayer, type RecordingState } from './recording-player'

export type BassRepertoireHandle = { stop(): void; pause(): void }
type Props = { ref: Ref<BassRepertoireHandle>; beforePlay(): void; onStart(): void; onSounding(value: boolean): void; onBowing(source: PerformanceBowingSource | null): void }
const initial: RecordingState = { phase: 'idle', position: 0, duration: 0 }
const baseUrl = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'

export default function BassRepertoirePlayer({ ref, beforePlay, onStart, onSounding, onBowing }: Props) {
  const [choice, setChoice] = useState(DEFAULT_BASS_RECORDING)
  const [state, setState] = useState(initial)
  const media = useRef<HTMLAudioElement>(null)
  const bowing = useRef<ReturnType<typeof createPerformanceBowing> | null>(null)
  const player = useRef<ReturnType<typeof createRecordingPlayer> | null>(null)
  const recording = bassRecordings.find(item => item.id === choice) ?? bassRecordings[0]
  const url = `${baseUrl}audio/bass-recordings/${recording.file}`
  const stop = useCallback(() => { player.current?.stop(); bowing.current?.reset() }, [])
  const pause = useCallback(() => {
    if (state.phase === 'playing' || state.phase === 'loading') player.current?.pause()
  }, [state.phase])
  useImperativeHandle(ref, () => ({ stop, pause }), [stop, pause])
  useEffect(() => {
    if (!media.current) return
    const meter = createPerformanceBowing(media.current)
    bowing.current = meter; onBowing(meter.sample)
    const instance = createRecordingPlayer(media.current, setState, value => {
      if (value) onStart()
      onSounding(value)
    })
    player.current = instance
    const hide = () => { if (document.hidden) instance.stop() }
    document.addEventListener('visibilitychange', hide)
    return () => { instance.dispose(); meter.dispose(); bowing.current = null; onBowing(null); player.current = null; document.removeEventListener('visibilitychange', hide) }
  }, [onStart, onSounding, onBowing])
  function play() { beforePlay(); void bowing.current?.prepare(); player.current?.play(url) }
  const running = state.phase === 'playing'
  const loading = state.phase === 'loading'
  const started = state.phase !== 'idle' && state.phase !== 'error'
  return <div className="bass-repertoire" data-excerpt={choice} data-phase={state.phase} data-playback="recording">
    <audio ref={media} preload="none" aria-label={`${recording.composer}, ${recording.title}, performed by ${recording.performer}`}/>
    <label className="bass-solo-choice mono" htmlFor="bass-solo-choice">Repertoire<select id="bass-solo-choice" aria-label="Choose a bass solo" value={choice} onChange={event => { stop(); bowing.current?.reset(); setChoice(event.target.value) }}>{bassRecordings.map(item => <option key={item.id} value={item.id}>{item.composer.split(' ').at(-1)} · {item.title}</option>)}</select></label>
    <header className="bass-recording-heading"><p className="bass-solo-composer mono">{recording.composer}</p><h3>{recording.title}</h3><p className="bass-solo-passage mono">{recording.movement} · concert recording</p></header>
    <div className="bass-solo-actions mono">
      <button className="bass-solo-play" onClick={loading ? stop : running ? () => player.current?.pause() : play} aria-label={loading ? 'Cancel recording' : running ? 'Pause recording' : `Play ${recording.composer.split(' ').at(-1)} recording`}><span aria-hidden="true">{loading ? '□' : running ? 'Ⅱ' : '▷'}</span>{loading ? 'Cancel' : running ? 'Pause' : state.phase === 'paused' ? 'Resume' : state.phase === 'ended' ? 'Play again' : state.phase === 'error' ? 'Try again' : 'Play recording'}</button>
      {started && <button className="bass-recording-stop" onClick={stop} aria-label="Stop recording">Stop</button>}
      <span>{loading ? 'Loading recording…' : state.phase === 'error' ? 'Recording couldn’t load.' : `${recordingTime(state.position)} / ${state.duration ? recordingTime(state.duration) : '—:—'}`}</span>
    </div>
    <input className="bass-recording-seek" type="range" min={0} max={state.duration || 1} step={.1} value={Math.min(state.position, state.duration || 1)} disabled={!state.duration} aria-label="Recording position" aria-valuetext={`${recordingTime(state.position)} of ${recordingTime(state.duration)}`} onChange={event => player.current?.seek(Number(event.target.value))}/>
    <p className="bass-recording-performer mono">{recording.performer}</p>
    <p className="sr-only" role="status">{running ? `Playing ${recording.composer}, ${recording.title}, performed by ${recording.performer}.` : state.phase === 'ended' ? 'Recording finished.' : state.phase === 'error' ? 'The recording could not play. Try again.' : loading ? 'Loading the concert recording.' : state.phase === 'paused' ? 'Recording paused.' : ''}</p>
    <details className="bass-excerpt-source"><summary className="mono">Recording & credits<span aria-hidden="true">+</span></summary><p>{recording.credit}</p><p>Original recording, unmodified. <a href={recording.licenseUrl} target="_blank" rel="noreferrer">{recording.license}</a>.</p><a className="mono" href={recording.source} target="_blank" rel="noreferrer">{recording.sourceLabel}<span aria-hidden="true">↗</span></a>{recording.id === 'koussevitzky' && <a className="mono" href={recording.licenseEvidence} target="_blank" rel="noreferrer">Recording listing · IMSLP<span aria-hidden="true">↗</span></a>}<a className="mono" href={url} download={recording.file}>Download recording<span aria-hidden="true">↓</span></a></details>
  </div>
}
