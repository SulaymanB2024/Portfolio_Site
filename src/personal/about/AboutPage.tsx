import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { bassStrings, personalObjects, type InterestId } from './about-content'
import { allKnightChallenges, advanceChallenge, challengeMoves, challengeResult, challengeRoute } from './knight-puzzle'
import { addPhraseNote, midiFrequency, midiLabel, phraseSchedule, totalPhraseBeats, type PhraseNote } from './music-phrase'
import { createInterestAudio, type AudioArticulation, type AudioState } from './interest-audio'
import type { InterestScene } from './interest-renderer'
import PerformanceArchive from './PerformanceArchive'
import PhraseEditor from './PhraseEditor'
import PuzzleNotebook from './PuzzleNotebook'
import ChessGame, { type ChessSceneState } from './ChessGame'
import { performances, performanceArchiveNote } from './performances'
import './about.css'

type Notebook = 'performances' | 'phrase' | 'puzzle'

export default function AboutPage({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<InterestId | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null)
  const [path, setPath] = useState(['a1'])
  const [challengeId, setChallengeId] = useState('long')
  const [phrase, setPhrase] = useState<PhraseNote[]>([])
  const [pieceTitle, setPieceTitle] = useState('Untitled')
  const [scorePage, setScorePage] = useState(0)
  const [boardMode, setBoardMode] = useState<'puzzle'|'game'>('puzzle')
  const [tempo, setTempo] = useState(88)
  const [articulation, setArticulation] = useState<AudioArticulation>('pizzicato')
  const [position, setPosition] = useState(0)
  const [lastString, setLastString] = useState<number | null>(null)
  const [activeNote, setActiveNote] = useState<number | null>(null)
  const [sequencePlaying, setSequencePlaying] = useState(false)
  const [audioState, setAudioState] = useState<AudioState>('idle')
  const [notice, setNotice] = useState('')
  const [notebook, setNotebook] = useState<Notebook | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<InterestScene | null>(null)
  const audio = useRef<ReturnType<typeof createInterestAudio> | null>(null)
  const notesHistory = useRef({undo:[] as PhraseNote[][],redo:[] as PhraseNote[][]})
  const gameState = useRef<ChessSceneState | null>(null)
  const gameInput = useRef<((square:string)=>void)|null>(null)
  const phraseTimers = useRef<number[]>([])
  const epoch = useRef(0)
  const mounted = useRef(true)
  const selectors = useRef<Record<string, HTMLButtonElement | null>>({})
  const notebookTrigger = useRef<HTMLButtonElement | null>(null)
  const interactions = useRef({ select: (_id: InterestId) => {}, pluck: (_index: number) => {}, move: (_square: string) => {} })
  const playing = motionChoice ?? !reduced
  const challenge = allKnightChallenges.find(item => item.id === challengeId) ?? allKnightChallenges[2]
  const current = path[path.length - 1]
  const result = challengeResult(path, challenge)
  const legal = challengeMoves(path, challenge)
  const hint = challengeRoute(path, challenge)
  const canHint = result === 'playing' && hint.length > 0 && hint.length - 1 <= challenge.limit - path.length + 1
  const object = personalObjects.find(item => item.id === selected)
  const visualNotes = phrase.slice(0, 4).map(note => note.midi === null ? 0 : Math.max(0, Math.min(3, Math.round((note.midi - 28) / 5))))
  const viewState = useRef({ selected, playing, dark, visualNotes, current, legal, articulation, position, challenge, path, boardMode, phrase, pieceTitle, tempo, scorePage, activeNote })
  viewState.current = { selected, playing, dark, visualNotes, current, legal, articulation, position, challenge, path, boardMode, phrase, pieceTitle, tempo, scorePage, activeNote }
  const onGameScene = useCallback((state:ChessSceneState)=>{gameState.current=state;const view=viewState.current;if(view.selected==='knight'&&view.boardMode==='game')scene.current?.setGame(state)},[])
  const bindChessInteraction = useCallback((handler:((square:string)=>void)|null)=>{gameInput.current=handler},[])

  const getAudio = useCallback(() => {
    audio.current ??= createInterestAudio(state => { if (mounted.current) setAudioState(state) })
    return audio.current
  }, [])
  const silence = useCallback(() => {
    epoch.current++
    audio.current?.silence()
    phraseTimers.current.forEach(clearTimeout)
    phraseTimers.current = []
    setActiveNote(null)
    setSequencePlaying(false)
  }, [])
  const choose = useCallback((id: InterestId) => { silence(); setSelected(id); setNotebook(null); setNotice(''); setLastString(null) }, [silence])
  const close = useCallback(() => {
    silence(); setSelected(null); setNotebook(null); setNotice('All objects.')
    if (selected) selectors.current[selected]?.focus({ preventScroll: true })
  }, [selected, silence])
  const preview = useCallback((midi: number, stringIndex?: number) => {
    const request = epoch.current
    void getAudio().play(midiFrequency(midi), 0, articulation).catch(() => { if (request === epoch.current && mounted.current) setAudioState('error') })
    if (stringIndex !== undefined) { scene.current?.pluck(stringIndex); setLastString(stringIndex) }
    setNotice(`${midiLabel(midi)}, ${articulation === 'arco' ? 'bowed' : 'plucked'}.`)
  }, [getAudio, articulation])
  const pluck = useCallback((index: number) => {
    preview(bassStrings[index].midi + position, index)
  }, [preview, position])
  const addNote = useCallback((index: number) => {
    silence()
    editPhrase(addPhraseNote(phrase, { midi: bassStrings[index].midi, beats: 1 }, 4))
    preview(bassStrings[index].midi, index)
  }, [preview, silence, phrase])
  const move = useCallback((square: string) => {
    const next = advanceChallenge(path, square, challenge)
    if (next.length > path.length) {
      setPath(next)
      setNotice(`Knight on ${square.toUpperCase()}. ${next.length - 1} of ${challenge.limit} moves.${challengeResult(next, challenge) === 'solved' ? ' You found a route.' : ''}`)
    }
  }, [path, challenge])
  interactions.current = { select: choose, pluck, move }

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(media.matches)
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])
  useEffect(() => {
    let stopped = false
    mounted.current = true
    setStatus('loading')
    void import('./interest-renderer').then(({ mountInterestScene }) => {
      if (stopped || !canvas.current) return
      try {
        scene.current = mountInterestScene(canvas.current, dark, {
          choose: id => interactions.current.select(id), pluck: index => interactions.current.pluck(index), move: square => interactions.current.move(square), chess: square => gameInput.current?.(square),
        }, setStatus)
        const view = viewState.current
        scene.current.select(view.selected); scene.current.setPlaying(view.playing); scene.current.setDark(view.dark)
        scene.current.setNotes(view.visualNotes); scene.current.setPuzzle(view.current, view.legal, view.challenge.goal, view.path,view.challenge.blocked,view.challenge.checkpoints); scene.current.setBass(view.articulation, view.position)
        scene.current.setScore(view.phrase,view.pieceTitle,view.tempo,view.scorePage,view.activeNote)
        scene.current.setGame(view.selected==='knight'&&view.boardMode==='game'?gameState.current:null)
      } catch (error) { console.warn('Could not open personal objects', error); setStatus('error') }
    }).catch(error => { if (!stopped) { console.warn('Could not load personal objects renderer', error); setStatus('error') } })
    return () => { stopped = true; mounted.current = false; epoch.current++; scene.current?.dispose(); scene.current = null; audio.current?.dispose(); audio.current = null; phraseTimers.current.forEach(clearTimeout) }
  }, [])
  useEffect(() => { scene.current?.select(selected) }, [selected, status])
  useEffect(() => { scene.current?.setPlaying(playing) }, [playing, status])
  useEffect(() => { scene.current?.setDark(dark) }, [dark, status])
  useEffect(() => { scene.current?.setNotes(visualNotes) }, [phrase, status])
  useEffect(() => { scene.current?.setPuzzle(current, legal, challenge.goal, path,challenge.blocked,challenge.checkpoints) }, [current, path.length, challengeId, status])
  useEffect(() => { scene.current?.setScore(phrase,pieceTitle,tempo,scorePage,activeNote) },[phrase,pieceTitle,tempo,scorePage,activeNote,status])
  useEffect(() => { scene.current?.setGame(selected==='knight'&&boardMode==='game'?gameState.current:null) },[boardMode,selected,status])
  useEffect(() => { scene.current?.setBass(articulation, position) }, [articulation, position, status])
  useEffect(() => {
    if (selected === 'bass' || selected === 'score') { const engine = getAudio(); void engine.prepare().catch(() => { if (mounted.current && audio.current === engine) setAudioState('error') }) }
  }, [selected, getAudio])
  useEffect(() => {
    if (!selected) return
    document.getElementById('about-interest-title')?.focus({ preventScroll: true })
  }, [selected])
  useEffect(() => {
    if (!selected) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); if (notebook) { setNotebook(null); notebookTrigger.current?.focus() } else close() } }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [selected, close, notebook])
  useEffect(() => {
    const hide = () => { if (document.hidden) silence() }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [silence])
  useEffect(() => {
    if (!notebook) return
    const heading = document.getElementById('about-notebook-title')
    heading?.focus({ preventScroll: true })
    heading?.closest('section')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' })
  }, [notebook, reduced])

  function openNotebook(kind: Notebook, trigger: HTMLButtonElement) {
    notebookTrigger.current = trigger
    setNotebook(current => current === kind ? null : kind)
  }
  function editPhrase(notes: PhraseNote[]) { silence();notesHistory.current.undo.push(phrase.map(note=>({...note})));notesHistory.current.undo=notesHistory.current.undo.slice(-40);notesHistory.current.redo=[];setPhrase(notes) }
  function undoPiece(redo=false){const history=notesHistory.current,source=redo?history.redo:history.undo,target=redo?history.undo:history.redo;const next=source.pop();if(next){silence();target.push(phrase);setPhrase(next)}}
  function returnToBoard() {
    const heading = document.getElementById('about-interest-title')
    heading?.focus({ preventScroll: true })
    heading?.closest('.about-object-stage')?.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' })
  }
  function playPhrase() {
    silence()
    const request = epoch.current
    const scheduled = phraseSchedule(phrase, tempo)
    setSequencePlaying(scheduled.length > 0)
    void getAudio().playSequence(scheduled, articulation, .8, index => {
      if (request !== epoch.current || !mounted.current) return
      const sourceIndex=scheduled[index].sourceIndex
      setActiveNote(sourceIndex)
      setScorePage(Math.floor(totalPhraseBeats(phrase.slice(0,sourceIndex))/32))
      const midi = phrase[sourceIndex]?.midi
      if (midi !== null && midi !== undefined) scene.current?.pluck(Math.max(0, Math.min(3, Math.round((midi - 28) / 5))))
      if (index === scheduled.length - 1) phraseTimers.current.push(window.setTimeout(() => { if (request === epoch.current) { setActiveNote(null); setSequencePlaying(false) } }, scheduled[index].duration * 1000))
    }).catch(() => { if (request === epoch.current && mounted.current) { setAudioState('error'); setSequencePlaying(false) } })
    setNotice('Playing your phrase.')
  }
  function bassKeys(event: ReactKeyboardEvent<HTMLElement>) {
    if (selected !== 'bass' || event.repeat || event.metaKey || event.ctrlKey || event.altKey || (event.target as Element).closest('input,select,textarea,[contenteditable="true"]')) return
    const index = ['a', 's', 'd', 'f'].indexOf(event.key.toLowerCase())
    if (index >= 0) { event.preventDefault(); pluck(index) }
  }

  return <section className="about-objects" aria-labelledby="about-title" data-selected={selected ?? 'collection'} data-notebook={notebook ?? 'closed'} data-audio-state={audioState} data-phrase-playing={sequencePlaying}>
    <h1 id="about-title" className="sr-only">About Sulayman Bowles — personal interests</h1>
    <div className="about-objects-toolbar mono">
      <span>Personal objects <span className="about-object-count">/ 03</span></span>
      <div>{selected && <button onClick={() => scene.current?.resetView()} aria-label="Reset object view">Reset view</button>}<button onClick={() => setMotionChoice(!playing)} aria-pressed={playing} aria-label={playing ? 'Pause animation' : 'Play animation'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause' : 'Play'}</button></div>
    </div>
    <div className="about-object-stage">
      <canvas ref={canvas} className="about-object-canvas" aria-label="Three-dimensional double bass, score, and chess knight. Use the interest buttons to explore." role="img" />
      {status === 'loading' && <p className="about-object-status mono" role="status">Opening the collection…</p>}
      {status === 'error' && <p className="about-object-status mono" role="status">The objects couldn’t load. You can still explore each interest below.</p>}
      {!selected && status === 'ready' && <p className="about-object-invitation mono">Pick an object.</p>}
      {object && <aside key={object.id} className="about-object-reveal" role="region" aria-labelledby="about-interest-title" onKeyDown={bassKeys}>
        <div className="about-reveal-top mono"><span>{object.label}</span><button onClick={close} aria-label="Return to all objects">×</button></div>
        <h2 id="about-interest-title" tabIndex={-1}>{object.title}</h2>
        <p className="about-object-sentence">{selected === 'knight' ? boardMode==='game'?'A complete board. Two players, or a small practice opponent.':challenge.checkpoints?.length?'Collect C4 and F6, then reach H8 in ten knight moves.':challenge.blocked?.length?'Six moves to H8, with the center squares closed.':`I enjoy logic puzzles. Try a small one: A1 to ${challenge.goal.toUpperCase()} in ${challenge.limit} knight moves.` : object.sentence}</p>
        {selected==='knight'&&<div className="about-option-buttons about-board-mode mono" role="group" aria-label="Choose board mode"><button aria-pressed={boardMode==='puzzle'} onClick={()=>{setBoardMode('puzzle');setNotebook(null)}}>Knight puzzles</button><button aria-pressed={boardMode==='game'} onClick={()=>{setBoardMode('game');setNotebook(null)}}>Full chess</button></div>}
        {selected === 'bass' && <div className="about-interest-play">
          <div className="about-articulation mono" role="group" aria-label="Bass playing technique"><button aria-pressed={articulation === 'pizzicato'} onClick={() => { silence(); setArticulation('pizzicato') }}>Pizzicato<span>Plucked</span></button><button aria-pressed={articulation === 'arco'} onClick={() => { silence(); setArticulation('arco') }}>Arco<span>Bowed</span></button></div>
          <div className="about-string-buttons" aria-label="Play a bass string">{bassStrings.map((string, index) => <button key={string.label} onClick={() => pluck(index)} aria-label={`${articulation === 'arco' ? 'Bow' : 'Pluck'} ${string.label} string`} data-sounding={lastString === index}><span>{midiLabel(string.midi + position)}</span><span className="mono">{string.key}</span></button>)}</div>
          <label className="about-field about-finger-position mono">Finger position<span>{position === 0 ? 'Open strings' : position === 12 ? 'One octave up' : `+${position} semitone${position===1?'':'s'}`}</span><input aria-label="Bass finger position" type="range" min={0} max={12} step={1} value={position} onChange={event => { silence(); setPosition(Number(event.target.value)) }} /></label>
          <p className="about-interaction-note mono">Tap a string, or play with A · S · D · F.</p>
        </div>}
        {selected === 'score' && <div className="about-interest-play">
          <div className="about-phrase" aria-label="Your phrase">{Array.from({ length: 4 }, (_, index) => <span key={index} data-filled={!!phrase[index]} data-playing={activeNote === index}>{phrase[index] ? midiLabel(phrase[index].midi) : '·'}</span>)}</div>
          <div className="about-note-buttons" aria-label="Choose a note">{bassStrings.map((note, index) => <button key={note.label} onClick={() => addNote(index)} disabled={phrase.length >= 4} aria-label={`Add ${note.label} note`}>{note.label}</button>)}</div>
          <div className="about-play-actions mono"><button onClick={playPhrase} disabled={!phrase.length}>▷ Hear it</button><button onClick={silence} disabled={!sequencePlaying}>Stop</button><button onClick={() => editPhrase([])} disabled={!phrase.length}>Start again</button></div>
          <p className="about-interaction-note mono">{phrase.length > 4 ? `${phrase.length} notes & rests · ${Math.ceil(totalPhraseBeats(phrase)/4)} bars · ${tempo} BPM` : 'Choose four notes. Build a piece on the paper in the editor.'}</p>
        </div>}
        {(selected === 'bass' || selected === 'score') && <p className="about-audio-status mono" role="status">{audioState === 'loading' ? 'Loading the double bass…' : audioState === 'error' ? 'The sound library couldn’t load. Try another note to retry.' : 'Recorded double bass · sound on click'}</p>}
        {selected === 'knight' && boardMode==='puzzle' && <div className="about-interest-play">
          <div className="about-puzzle-position"><span>{current.toUpperCase()}</span><span className="mono">{path.length - 1} / {challenge.limit} moves</span></div>
          <p className="about-puzzle-caption">{result === 'solved' ? 'You found a route.' : result === 'finished' ? `${challenge.limit} moves. Another route?` : 'Two squares, then one across.'}</p>
          {result === 'playing' && <div className="about-move-buttons" aria-label="Legal knight moves">{legal.map(square => <button key={square} aria-label={`Move knight to ${square.toUpperCase()}`} onClick={() => move(square)}>{square.toUpperCase()}</button>)}</div>}
          <div className="about-play-actions mono"><button onClick={() => setPath(previous => previous.slice(0, -1))} disabled={path.length < 2}>Undo</button><button onClick={() => { setPath(['a1']); setNotice('New route. Knight on A1.') }} disabled={path.length < 2}>Start again</button>{notebook === 'puzzle' && <button onClick={() => move(hint[1])} disabled={!canHint}>Hint</button>}</div>
          <p className="about-interaction-note mono">Reach the ring. Tap a dot, or choose a move here.</p>
        </div>}
        {selected==='knight'&&<ChessGame active={boardMode==='game'} onScene={onGameScene} bindInteraction={bindChessInteraction}/>}
        <div className="about-deeper-links mono">
          {selected === 'score' && <button onClick={event => openNotebook('phrase', event.currentTarget)} aria-expanded={notebook === 'phrase'} aria-controls="about-notebook">Compose on the paper<span aria-hidden="true">↗</span></button>}
          {selected !== 'knight' && <button onClick={event => openNotebook('performances', event.currentTarget)} aria-expanded={notebook === 'performances'} aria-controls="about-notebook">Performances & repertoire<span>{performances.length}</span></button>}
          {selected === 'knight' && boardMode==='puzzle' && <button onClick={event => openNotebook('puzzle', event.currentTarget)} aria-expanded={notebook === 'puzzle'} aria-controls="about-notebook">More routes & the reasoning<span aria-hidden="true">↗</span></button>}
        </div>
        <details className="about-personal-detail"><summary>{object.detailLabel}<span aria-hidden="true">+</span></summary><p>{object.detail}</p><a href={object.source} target="_blank" rel="noreferrer">{object.sourceLabel} <span aria-hidden="true">↗</span></a></details>
      </aside>}
    </div>
    <div className="about-object-selectors" aria-label="Personal interests">{personalObjects.map((item, index) => <button key={item.id} ref={node => { selectors.current[item.id] = node }} onClick={() => selected === item.id ? close() : choose(item.id)} aria-pressed={selected === item.id}><span className="mono">0{index + 1}</span><span>{item.label}</span><span aria-hidden="true">{selected === item.id ? '−' : '↗'}</span></button>)}</div>
    <div id="about-notebook">{notebook && <section className="about-notebook" aria-labelledby="about-notebook-title">
      <div className="about-notebook-heading"><div><span className="mono">{notebook === 'performances' ? 'Music / archive' : notebook === 'phrase' ? 'Composition / sketchbook' : 'Logic / a closer look'}</span><h2 id="about-notebook-title" tabIndex={-1}>{notebook === 'performances' ? 'Performances & repertoire.' : notebook === 'phrase' ? 'Make a little music.' : 'Follow the thought.'}</h2></div><button aria-label="Close detailed view" onClick={() => { setNotebook(null); notebookTrigger.current?.focus() }}>×</button></div>
      {notebook === 'performances' && <><p className="about-archive-note mono">{performanceArchiveNote}</p><PerformanceArchive entries={performances} /></>}
      {notebook === 'phrase' && <PhraseEditor notes={phrase} onChange={editPhrase} tempo={tempo} onTempo={value => { silence(); setTempo(value) }} title={pieceTitle} onTitle={setPieceTitle} page={scorePage} onPage={setScorePage} articulation={articulation} onArticulation={value => { silence(); setArticulation(value) }} onPlay={playPhrase} onStop={silence} onPreview={midi => preview(midi)} activeNote={activeNote} onUndo={()=>undoPiece()} onRedo={()=>undoPiece(true)} canUndo={notesHistory.current.undo.length>0} canRedo={notesHistory.current.redo.length>0}/>}
      {notebook === 'puzzle' && <PuzzleNotebook challenge={challenge} onChallenge={id => { setChallengeId(id); setPath(['a1']); setNotice('New route. Knight on A1.') }} path={path} onMove={move} onReset={() => setPath(['a1'])} onUndo={() => setPath(previous => previous.slice(0, -1))} onBoard={returnToBoard} />}
      {notebook !== 'puzzle' && <details className="about-library-credit"><summary>About the instrument sounds<span aria-hidden="true">+</span></summary><p>The playable bass uses recordings from <a href="https://versilian-studios.com/vsco-community/" target="_blank" rel="noreferrer">VSCO 2 Community Edition</a>, a CC0 sample library. These instrument samples are separate from the performance recordings linked above.</p></details>}
    </section>}</div>
    <p className="sr-only" aria-live="polite">{notice}</p>
  </section>
}
