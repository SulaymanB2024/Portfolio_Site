import { useState, type CSSProperties } from 'react'
import { addPhraseNote, midiLabel, totalPhraseBeats, validatePhrase, type PhraseNote } from './music-phrase'
import { exportMidi, exportMusicXml } from './score-export'
import { scorePageCount } from './score-engraving'
import ScorePreview from './ScorePreview'
import type { AudioArticulation } from './interest-audio'
import './composer.css'

type Props = {
  notes: PhraseNote[]; onChange(notes: PhraseNote[]): void; tempo: number; onTempo(value: number): void;
  title: string; onTitle(value: string): void; page: number; onPage(value: number): void;
  articulation: AudioArticulation; onArticulation(value: AudioArticulation): void;
  onPlay(): void; onStop(): void; onPreview(midi: number): void; activeNote: number | null;
  onUndo(): void; onRedo(): void; canUndo: boolean; canRedo: boolean;
}
const study: PhraseNote[] = [
  {midi:28,beats:1},{midi:35,beats:.5},{midi:38,beats:.5},{midi:40,beats:2},
  {midi:null,beats:.5},{midi:43,beats:.5},{midi:42,beats:1},{midi:40,beats:1},{midi:38,beats:1},
  {midi:35,beats:.5},{midi:38,beats:.5},{midi:40,beats:1},{midi:43,beats:2},
  {midi:42,beats:.5},{midi:40,beats:.5},{midi:35,beats:1},{midi:28,beats:2},
]

const registers = [[28, 'Low', 'E1–D♯2'], [40, 'Middle', 'E2–D♯3'], [52, 'Upper', 'E3–G3']] as const
const durations = [[.25, '16th', 'Sixteenth'], [.5, 'Eighth', 'Eighth'], [1, 'Quarter', 'Quarter'], [2, 'Half', 'Half'], [4, 'Whole', 'Whole']] as const

function DurationMark({ beats }: { beats: number }) {
  return <svg viewBox="0 0 26 32" aria-hidden="true" focusable="false">
    <ellipse cx={beats === 4 ? 13 : 8} cy="24" rx={beats === 4 ? 7 : 5.5} ry="3.7" transform={beats === 4 ? undefined : 'rotate(-22 8 24)'} fill={beats < 2 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" />
    {beats !== 4 && <path d="M13 23V4" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {beats < 1 && <path d="M13 4C14 10 22 10 18 17" fill="none" stroke="currentColor" strokeWidth="1.7" />}
    {beats === .25 && <path d="M13 10C15 15 22 15 18 22" fill="none" stroke="currentColor" strokeWidth="1.7" />}
  </svg>
}

function TransportMark({ stop = false }: { stop?: boolean }) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">{stop ? <rect x="5" y="5" width="10" height="10" fill="currentColor" /> : <path d="M6 3L16 10L6 17Z" fill="currentColor" />}</svg>
}

export default function PhraseEditor({ notes, onChange, tempo, onTempo, title, onTitle, page, onPage, articulation, onArticulation, onPlay, onStop, onPreview, activeNote, onUndo, onRedo, canUndo, canRedo }: Props) {
  const [touchEditing] = useState(() => typeof matchMedia === 'function' && matchMedia('(any-pointer: coarse), (max-width: 900px)').matches)
  const [register,setRegister]=useState(40),[beats,setBeats]=useState(1)
  const [editSlot,setEditSlot]=useState<number|null>(null)
  const [entryMode,setEntryMode]=useState<'append'|'replace'|'insert'>('append')
  const [message,setMessage]=useState('')
  const [lastPitch, setLastPitch] = useState<number | null>(null)
  const [scoreReading, setScoreReading] = useState(false)
  const pitches=Array.from({length:register===52?4:12},(_,index)=>register+index)
  const naturals = pitches.filter(midi => !midiLabel(midi).includes('♯'))
  const trailingSharp = midiLabel(pitches[pitches.length - 1]).includes('♯')
  const pages=scorePageCount(notes), selected=editSlot!==null&&!!notes[editSlot]
  const currentPage=Math.min(page,pages-1)
  function commit(next:PhraseNote[]){
    const result=validatePhrase(next)
    if(!result.valid){setMessage(result.error!);return false}
    onChange(next);setMessage('');return true
  }
  function select(index:number){
    onStop();setEditSlot(index);setEntryMode('replace');setBeats(notes[index].beats)
    onPage(Math.floor(totalPhraseBeats(notes.slice(0,index))/32))
    const midi=notes[index].midi
    setLastPitch(midi)
    if(midi!==null){setRegister(midi<40?28:midi<52?40:52);onPreview(midi)}
  }
  function write(midi:number|null){
    let next:PhraseNote[]
    if(selected&&entryMode==='replace')next=notes.map((note,index)=>index===editSlot?{midi,beats}:note)
    else if(selected&&entryMode==='insert')next=[...notes.slice(0,editSlot!),{midi,beats},...notes.slice(editSlot!)]
    else next=addPhraseNote(notes,{midi,beats})
    if(next.length===notes.length&&(!selected||entryMode!=='replace')){setMessage('The piece is full: 64 notes and rests, or 128 beats. Edit an existing note to continue.');return}
    if (!commit(next)) return
    setLastPitch(midi)
    if(midi!==null)onPreview(midi)
    if(entryMode==='append'){setEditSlot(null);onPage(Math.floor(totalPhraseBeats(notes)/32))}
  }
  function duration(value:number){setBeats(value);if(selected&&entryMode==='replace')commit(notes.map((note,index)=>index===editSlot?{...note,beats:value}:note))}
  function save(kind:'midi'|'xml'){
    const data=kind==='xml'?exportMusicXml(notes,{title,tempo}):exportMidi(notes,{tempo})
    const blob=new Blob([data as BlobPart],{type:kind==='xml'?'application/vnd.recordare.musicxml+xml':'audio/midi'})
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${title.trim().replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,48)||'Untitled'}.${kind==='xml'?'musicxml':'mid'}`;link.click();URL.revokeObjectURL(url)
  }
  return <div className="about-piece-editor">
    <header className="composer-masthead">
      <div className="composer-title-block">
        <label className="composer-title-label"><span className="mono">Composition title</span><input type="text" aria-label="Composition title" maxLength={48} value={title} placeholder="Untitled" onChange={event=>onTitle(event.target.value)}/></label>
        <p className="composer-signature mono"><span>Double bass</span><span>4/4</span><span>{tempo} BPM</span></p>
      </div>
      <div className="composer-transport" role="group" aria-label="Score transport">
        <button className="composer-play" onClick={onPlay} disabled={!notes.length} aria-label={activeNote === null ? 'Play piece' : 'Restart piece playback'}><TransportMark/> <span>{activeNote === null ? 'Play' : 'Replay'}</span></button>
        <button className="composer-stop" onClick={onStop} aria-label="Stop piece playback"><TransportMark stop/><span>Stop</span></button>
        <div className="composer-history-controls">
          <button onClick={()=>{onUndo();setEditSlot(null);setEntryMode('append')}} disabled={!canUndo} aria-label="Undo edit" title="Undo edit"><span aria-hidden="true">↶</span></button>
          <button onClick={()=>{onRedo();setEditSlot(null);setEntryMode('append')}} disabled={!canRedo} aria-label="Redo edit" title="Redo edit"><span aria-hidden="true">↷</span></button>
        </div>
      </div>
    </header>

    <div className="about-piece-workspace composer-workspace">
      <div className="about-piece-paper composer-paper">
        <div className="composer-paper-heading mono"><span>Written score</span><div className="composer-paper-tools">{!notes.length && <button onClick={()=>{commit(study);setEditSlot(null);setEntryMode('append');onPage(0)}}>Start with a study <span aria-hidden="true">↗</span></button>}<button aria-label="Enlarge written score" aria-pressed={scoreReading} onClick={()=>setScoreReading(value=>!value)}>{scoreReading ? 'Fit' : 'Read'} <span aria-hidden="true">{scoreReading ? '−' : '+'}</span></button></div></div>
        <ScorePreview notes={notes} title={title} tempo={tempo} page={currentPage} activeIndex={activeNote} selectedIndex={selected?editSlot:null} readable={scoreReading} onSelect={select}/>
        <nav className="about-score-pagination composer-pagination mono" aria-label="Score pages"><button onClick={()=>onPage(currentPage-1)} disabled={currentPage===0} aria-label="Previous score page"><span aria-hidden="true">←</span> Previous</button><span>Page {currentPage+1} of {pages}</span><button onClick={()=>onPage(currentPage+1)} disabled={currentPage>=pages-1} aria-label="Next score page">Next <span aria-hidden="true">→</span></button></nav>
      </div>

      <div className="about-piece-controls composer-console">
        <div className="composer-entry-heading"><span className="mono">{selected ? `Event ${String(editSlot! + 1).padStart(2, '0')}` : 'Write a note'}</span><span>{selected ? midiLabel(notes[editSlot!].midi) : 'E1—G3'}</span></div>
        {selected && <div className="composer-entry-modes mono" role="group" aria-label="Edit selected note"><button aria-pressed={entryMode==='replace'} onClick={()=>setEntryMode('replace')}>Replace</button><button aria-pressed={entryMode==='insert'} onClick={()=>setEntryMode('insert')}>Insert before</button><button aria-pressed={entryMode==='append'} onClick={()=>{setEntryMode('append');setEditSlot(null)}}>Add at end</button></div>}
        <div className="composer-register" role="group" aria-label="Piece register">{registers.map(([value,label,range])=><button key={value} className="mono" aria-pressed={register===value} onClick={()=>setRegister(value)}><span>{label}</span><small>{range}</small></button>)}</div>
        <div className="composer-keyboard-window">
          <div className="composer-keyboard" role="group" aria-label="Write a pitch" data-trailing-sharp={trailingSharp} style={{'--natural-count':naturals.length} as CSSProperties}>
            {pitches.map(midi => {
              const name = midiLabel(midi), sharp = name.includes('♯'), naturalIndex = naturals.filter(note => note < midi).length
              const keyStyle: CSSProperties = sharp ? { left:`calc((100% - ${trailingSharp ? 22 : 0}px) * ${naturalIndex} / ${naturals.length} - 22px)` } : { gridColumn: naturalIndex + 1 }
              return <button key={midi} className={`composer-key ${sharp ? 'composer-key-sharp' : 'composer-key-natural'}`} style={keyStyle} aria-label={`Write ${name}`} aria-pressed={selected ? notes[editSlot!].midi === midi : lastPitch === midi} data-playing={activeNote !== null && notes[activeNote]?.midi === midi} onClick={()=>write(midi)}><span>{name.replace(/\d+$/, '')}</span><small>{Math.floor(midi / 12) - 1}</small></button>
            })}
          </div>
        </div>

        <fieldset className="composer-duration"><legend className="mono">Duration</legend><div role="group" aria-label="Piece note length">{durations.map(([value,label,accessible])=><button key={value} aria-label={`${accessible} note`} aria-pressed={beats===value} onClick={()=>duration(value)}><DurationMark beats={value}/><span className="mono">{label}</span></button>)}</div></fieldset>
        <div className="composer-edit-actions mono"><button className="composer-rest" onClick={()=>write(null)}><svg viewBox="0 0 24 32" aria-hidden="true" focusable="false"><path d="M11 3L18 11L11 16L17 22C8 19 6 25 12 29C4 27 4 18 12 18L6 11L13 8Z" fill="currentColor"/></svg> Write rest</button><button onClick={()=>{if(selected){commit(notes.filter((_,index)=>index!==editSlot));setEditSlot(null);setEntryMode('append')}}} disabled={!selected}>Remove event</button></div>
        <p className="composer-feedback mono" role="status" data-error={Boolean(message)}>{message || (selected ? `${entryMode === 'insert' ? 'Insert before' : 'Replace'} event ${editSlot! + 1}. Choose a key or duration.` : touchEditing ? 'Choose a key. Edit an event in Notes & rests.' : 'Choose a key. Select a note on the score to edit.')}</p>

        <details className="composer-settings"><summary><span>Sound & tempo</span><span className="composer-summary-meta">{articulation === 'arco' ? 'Bowed' : 'Plucked'} · {tempo}</span><span className="composer-disclosure-mark" aria-hidden="true">+</span></summary><div className="composer-settings-body">
          <div className="composer-sound" role="group" aria-label="Piece sound">{([['pizzicato','Plucked'],['arco','Bowed']] as const).map(([value,label])=><button key={value} aria-pressed={articulation===value} onClick={()=>onArticulation(value)}>{label}</button>)}</div>
          <label className="composer-tempo mono"><span>Tempo</span><output>{tempo} BPM</output><input type="range" min={40} max={180} step={1} value={tempo} onChange={event=>onTempo(Number(event.target.value))} aria-label="Piece tempo"/></label>
        </div></details>
      </div>
    </div>

    <div className="composer-document-footer">
      <p className="composer-capacity mono">{notes.length} / 64 notes & rests <span aria-hidden="true">·</span> {totalPhraseBeats(notes)} / 128 beats</p>
      <button className="composer-clear mono" onClick={()=>{commit([]);setEditSlot(null);setEntryMode('append');setLastPitch(null);onPage(0)}} disabled={!notes.length}>Clear score</button>
    </div>

    {!!notes.length && <details className="composer-events" open={touchEditing || undefined}><summary><span>Notes & rests</span><span className="composer-summary-meta">{notes.length} events</span><span className="composer-disclosure-mark" aria-hidden="true">+</span></summary><ol className="composer-event-list">{notes.map((note,index)=><li key={index}><button aria-label={`Edit event ${index+1}: ${midiLabel(note.midi)}, ${note.beats} beat${note.beats===1?'':'s'}`} aria-pressed={selected && editSlot===index} aria-current={activeNote===index ? 'step' : undefined} onClick={()=>select(index)}><span className="composer-event-index mono">{String(index+1).padStart(2,'0')}</span><span>{midiLabel(note.midi)}</span><span className="composer-event-duration mono">{note.beats} beat{note.beats===1?'':'s'}</span><span aria-hidden="true">↗</span></button></li>)}</ol></details>}
    <details className="composer-downloads"><summary><span>Download score</span><span className="composer-summary-meta">MIDI / MusicXML</span><span className="composer-disclosure-mark" aria-hidden="true">+</span></summary><div className="composer-download-actions"><button onClick={()=>save('midi')} disabled={!notes.length}><span>Save MIDI</span><span className="mono">Pitches & timing</span><span aria-hidden="true">↓</span></button><button onClick={()=>save('xml')} disabled={!notes.length}><span>Save MusicXML</span><span className="mono">Written notation</span><span aria-hidden="true">↓</span></button></div></details>
    <details className="composer-credit"><summary><span>Behind the score</span><span className="composer-disclosure-mark" aria-hidden="true">+</span></summary><div><p>One thing that drew me to composing: hearing a piece leave my head and become another musician’s interpretation. Start with a note. Give it time. See where it goes.</p><p>I wrote “The Beauty of Loss” in 2024 as a reflection on my formative years with Golden Hornet.</p><a href="https://drive.google.com/file/d/11SN3b9sfKPxgA7xHGOV-ob0U7xVu9sRg/view" target="_blank" rel="noreferrer">The piece and its program note <span aria-hidden="true">↗</span></a></div></details>
  </div>
}
