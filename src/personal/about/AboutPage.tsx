import { useCallback, useEffect, useRef, useState } from 'react'
import { bassStrings, personalObjects, type InterestId } from './about-content'
import { knightMoves, moveKnight, puzzleResult } from './knight-puzzle'
import { createInterestAudio } from './interest-audio'
import type { InterestScene } from './interest-renderer'
import './about.css'

export default function AboutPage({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<InterestId | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null)
  const [path, setPath] = useState(['a1'])
  const [phrase, setPhrase] = useState<number[]>([])
  const [lastString, setLastString] = useState<number | null>(null)
  const [audioError, setAudioError] = useState(false)
  const [notice, setNotice] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<InterestScene | null>(null)
  const audio = useRef<ReturnType<typeof createInterestAudio> | null>(null)
  const phraseTimers = useRef<number[]>([])
  const selectors = useRef<Record<string, HTMLButtonElement | null>>({})
  const interactions = useRef({ select: (_id: InterestId) => {}, pluck: (_index: number) => {}, move: (_square: string) => {} })
  const playing = motionChoice ?? !reduced
  const current = path[path.length - 1]
  const result = puzzleResult(path)
  const legal = result === 'playing' ? knightMoves(current) : []
  const object = personalObjects.find(item => item.id === selected)
  const viewState = useRef({ selected, playing, dark, phrase, current, legal })
  viewState.current = { selected, playing, dark, phrase, current, legal }

  const silence = useCallback(() => {
    audio.current?.silence()
    phraseTimers.current.forEach(clearTimeout)
    phraseTimers.current = []
  }, [])
  const choose = useCallback((id: InterestId) => { silence(); setSelected(id); setNotice(''); setLastString(null); setDetailOpen(false) }, [silence])
  const close = useCallback(() => {
    silence(); setSelected(null); setDetailOpen(false)
    if (selected) selectors.current[selected]?.focus({ preventScroll: true })
  }, [selected, silence])
  const sound = useCallback((index: number, delay = 0) => {
    audio.current ??= createInterestAudio()
    void audio.current.play(bassStrings[index].frequency, delay).catch(() => setAudioError(true))
  }, [])
  const pluck = useCallback((index: number) => {
    sound(index); scene.current?.pluck(index); setLastString(index)
    setNotice(`${bassStrings[index].label} string.`)
  }, [sound])
  const addNote = useCallback((index: number) => {
    pluck(index)
    setPhrase(notes => notes.length < 4 ? [...notes, index] : notes)
  }, [pluck])
  const move = useCallback((square: string) => {
    const next = moveKnight(path, square)
    if (next.length > path.length) {
      setPath(next)
      setNotice(`Knight on ${square.toUpperCase()}. ${next.length - 1} of 6 moves.${puzzleResult(next) === 'solved' ? ' You found a route.' : ''}`)
    }
  }, [path])
  interactions.current = { select: choose, pluck, move }

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(media.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])
  useEffect(() => {
    let stopped = false
    setStatus('loading')
    void import('./interest-renderer').then(({ mountInterestScene }) => {
      if (stopped || !canvas.current) return
      try {
        scene.current = mountInterestScene(canvas.current, dark, {
          choose: id => interactions.current.select(id), pluck: index => interactions.current.pluck(index), move: square => interactions.current.move(square),
        }, setStatus)
        const view = viewState.current
        scene.current.select(view.selected)
        scene.current.setPlaying(view.playing)
        scene.current.setDark(view.dark)
        scene.current.setNotes(view.phrase)
        scene.current.setPuzzle(view.current, view.legal)
      } catch (error) { console.warn('Could not open personal objects', error); setStatus('error') }
    }).catch(error => { if (!stopped) { console.warn('Could not load personal objects renderer', error); setStatus('error') } })
    return () => { stopped = true; scene.current?.dispose(); scene.current = null; audio.current?.dispose(); audio.current = null; phraseTimers.current.forEach(clearTimeout) }
  }, [])
  useEffect(() => { scene.current?.select(selected) }, [selected, status])
  useEffect(() => { scene.current?.setPlaying(playing) }, [playing, status])
  useEffect(() => { scene.current?.setDark(dark) }, [dark, status])
  useEffect(() => { scene.current?.setNotes(phrase) }, [phrase, status])
  useEffect(() => { scene.current?.setPuzzle(current, legal) }, [current, path.length, status])
  useEffect(() => {
    if (!selected) return
    document.getElementById('about-interest-title')?.focus({ preventScroll: true })
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); close() } }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [selected, close])
  useEffect(() => {
    const hide = () => { if (document.hidden) silence() }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [silence])

  function playPhrase() {
    silence()
    phrase.forEach((note, index) => {
      sound(note, index * .48)
      phraseTimers.current.push(window.setTimeout(() => { scene.current?.pluck(note); setLastString(note) }, index * 480))
    })
    setNotice('Playing your phrase.')
  }

  return <section className="about-objects" aria-labelledby="about-title" data-selected={selected ?? 'collection'} data-detail-open={detailOpen}>
    <h1 id="about-title" className="sr-only">About Sulayman Bowles — personal interests</h1>
    <div className="about-objects-toolbar mono">
      <span>Personal objects <span className="about-object-count">/ 03</span></span>
      <div>
        {selected && <button onClick={() => scene.current?.resetView()} aria-label="Reset object view">Reset view</button>}
        <button onClick={() => setMotionChoice(!playing)} aria-pressed={playing} aria-label={playing ? 'Pause animation' : 'Play animation'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause' : 'Play'}</button>
      </div>
    </div>
    <div className="about-object-stage">
      <canvas ref={canvas} className="about-object-canvas" aria-label="Three-dimensional double bass, score, and chess knight. Use the interest buttons to explore." role="img" />
      {status === 'loading' && <p className="about-object-status mono" role="status">Opening the collection…</p>}
      {status === 'error' && <p className="about-object-status mono" role="status">The objects couldn’t load. You can still explore each interest below.</p>}
      {!selected && status === 'ready' && <p className="about-object-invitation mono">Pick an object.</p>}
      {object && <aside key={object.id} className="about-object-reveal" role="region" aria-labelledby="about-interest-title">
        <div className="about-reveal-top mono"><span>{object.label}</span><button onClick={close} aria-label="Return to all objects">×</button></div>
        <h2 id="about-interest-title" tabIndex={-1}>{object.title}</h2>
        <p className="about-object-sentence">{object.sentence}</p>
        {selected === 'bass' && <div className="about-interest-play">
          <div className="about-string-buttons" aria-label="Pluck a bass string">
            {bassStrings.map((string, index) => <button key={string.label} onClick={() => pluck(index)} aria-label={`Pluck ${string.label} string`} data-sounding={lastString === index}><span>{string.label}</span><span className="mono">0{index + 1}</span></button>)}
          </div>
          <p className="about-interaction-note mono">Pluck a string · sound on click</p>
        </div>}
        {selected === 'score' && <div className="about-interest-play">
          <div className="about-phrase" aria-label="Your four-note phrase">{Array.from({ length: 4 }, (_, index) => <span key={index} data-filled={phrase[index] !== undefined}>{phrase[index] !== undefined ? bassStrings[phrase[index]].label : '·'}</span>)}</div>
          <div className="about-note-buttons" aria-label="Choose a note">{bassStrings.map((note, index) => <button key={note.label} onClick={() => addNote(index)} disabled={phrase.length === 4} aria-label={`Add ${note.label} note`}>{note.label}</button>)}</div>
          <div className="about-play-actions mono"><button onClick={playPhrase} disabled={!phrase.length}>▷ Hear it</button><button onClick={() => { silence(); setPhrase([]); setLastString(null) }} disabled={!phrase.length}>Start again</button></div>
          <p className="about-interaction-note mono">Choose four notes · a little sound sketch</p>
        </div>}
        {selected === 'knight' && <div className="about-interest-play">
          <div className="about-puzzle-position"><span>{current.toUpperCase()}</span><span className="mono">{path.length - 1} / 6 moves</span></div>
          <p className="about-puzzle-caption">{result === 'solved' ? 'You found a route.' : result === 'finished' ? 'Six moves. Another route?' : 'Two squares, then one across.'}</p>
          {result === 'playing' && <div className="about-move-buttons" aria-label="Legal knight moves">{legal.map(square => <button key={square} aria-label={`Move knight to ${square.toUpperCase()}`} onClick={() => move(square)}>{square.toUpperCase()}</button>)}</div>}
          <div className="about-play-actions mono"><button onClick={() => setPath(previous => previous.slice(0, -1))} disabled={path.length < 2}>Undo</button><button onClick={() => { setPath(['a1']); setNotice('New route. Knight on A1.') }} disabled={path.length < 2}>Start again</button></div>
          <p className="about-interaction-note mono">Reach the ring. Tap a dot, or choose a move here.</p>
        </div>}
        {audioError && <p className="about-interaction-note mono" role="status">Sound isn’t available in this browser.</p>}
        <details className="about-personal-detail" onToggle={event => setDetailOpen(event.currentTarget.open)}><summary>{object.detailLabel}<span aria-hidden="true">+</span></summary><p>{object.detail}</p><a href={object.source} target="_blank" rel="noreferrer">{object.sourceLabel} <span aria-hidden="true">↗</span></a></details>
      </aside>}
    </div>
    <div className="about-object-selectors" aria-label="Personal interests">
      {personalObjects.map((item, index) => <button key={item.id} ref={node => { selectors.current[item.id] = node }} onClick={() => selected === item.id ? close() : choose(item.id)} aria-pressed={selected === item.id}><span className="mono">0{index + 1}</span><span>{item.label}</span><span aria-hidden="true">{selected === item.id ? '−' : '↗'}</span></button>)}
    </div>
    <p className="sr-only" aria-live="polite">{notice}</p>
  </section>
}
