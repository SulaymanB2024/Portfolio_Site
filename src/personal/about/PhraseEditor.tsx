import { useState } from 'react'
import { addPhraseNote, midiLabel, totalPhraseBeats, validatePhrase, type PhraseNote } from './music-phrase'
import { exportMidi, exportMusicXml } from './score-export'
import { scorePageCount } from './score-engraving'
import ScorePreview from './ScorePreview'
import type { AudioArticulation } from './interest-audio'

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

export default function PhraseEditor({ notes, onChange, tempo, onTempo, title, onTitle, page, onPage, articulation, onArticulation, onPlay, onStop, onPreview, activeNote, onUndo, onRedo, canUndo, canRedo }: Props) {
  const [touchEditing] = useState(() => matchMedia('(any-pointer: coarse), (max-width: 900px)').matches)
  const [register,setRegister]=useState(40),[beats,setBeats]=useState(1)
  const [editSlot,setEditSlot]=useState<number|null>(null)
  const [entryMode,setEntryMode]=useState<'append'|'replace'|'insert'>('append')
  const [message,setMessage]=useState('')
  const pitches=Array.from({length:register===52?4:12},(_,index)=>register+index)
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
    if(midi!==null){setRegister(midi<40?28:midi<52?40:52);onPreview(midi)}
  }
  function write(midi:number|null){
    let next:PhraseNote[]
    if(selected&&entryMode==='replace')next=notes.map((note,index)=>index===editSlot?{midi,beats}:note)
    else if(selected&&entryMode==='insert')next=[...notes.slice(0,editSlot!),{midi,beats},...notes.slice(editSlot!)]
    else next=addPhraseNote(notes,{midi,beats})
    if(next.length===notes.length&&(!selected||entryMode!=='replace')){setMessage('The piece is full: 64 notes and rests, or 128 beats. Edit an existing note to continue.');return}
    if(commit(next)&&midi!==null)onPreview(midi)
    if(entryMode==='append'){setEditSlot(null);onPage(Math.floor(totalPhraseBeats(notes)/32))}
  }
  function duration(value:number){setBeats(value);if(selected&&entryMode==='replace')commit(notes.map((note,index)=>index===editSlot?{...note,beats:value}:note))}
  function save(kind:'midi'|'xml'){
    const data=kind==='xml'?exportMusicXml(notes,{title,tempo}):exportMidi(notes,{tempo})
    const blob=new Blob([data as BlobPart],{type:kind==='xml'?'application/vnd.recordare.musicxml+xml':'audio/midi'})
    const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`${title.trim().replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,48)||'Untitled'}.${kind==='xml'?'musicxml':'mid'}`;link.click();URL.revokeObjectURL(url)
  }
  return <div className="about-piece-editor">
    <p className="about-notebook-introduction">One thing that drew me to composing: hearing a piece leave my head and become another musician’s interpretation. Start with a note. Give it time. See where it goes.</p>
    <div className="about-piece-workspace">
      <div className="about-piece-paper">
        <ScorePreview notes={notes} title={title} tempo={tempo} page={currentPage} activeIndex={activeNote} selectedIndex={selected?editSlot:null} onSelect={select}/>
        <div className="about-score-pagination mono"><button onClick={()=>onPage(currentPage-1)} disabled={currentPage===0}>← Previous page</button><span>{currentPage+1} / {pages}</span><button onClick={()=>onPage(currentPage+1)} disabled={currentPage>=pages-1}>Next page →</button></div>
      </div>
      <div className="about-piece-controls">
        <label className="about-field mono">Title<input type="text" aria-label="Composition title" maxLength={48} value={title} onChange={event=>onTitle(event.target.value)}/></label>
        <div className="about-play-actions mono"><button onClick={onPlay} disabled={!notes.length}>▷ Play piece</button><button onClick={onStop} aria-label="Stop piece playback">Stop</button><button onClick={()=>{onUndo();setEditSlot(null);setEntryMode('append')}} disabled={!canUndo}>Undo edit</button><button onClick={()=>{onRedo();setEditSlot(null);setEntryMode('append')}} disabled={!canRedo}>Redo edit</button></div>
        <p className="about-piece-count mono">{notes.length} / 64 notes & rests · {totalPhraseBeats(notes)} / 128 beats · 4/4</p>
        {!!notes.length&&<details className="about-personal-detail" open={touchEditing || undefined}><summary>Notes & rests<span aria-hidden="true">+</span></summary><div className="about-score-event-list">{notes.map((note,index)=><button key={index} aria-label={`Edit event ${index+1}: ${midiLabel(note.midi)}`} aria-pressed={editSlot===index} onClick={()=>select(index)}><span className="mono">{String(index+1).padStart(2,'0')}</span><span>{midiLabel(note.midi)}</span><span className="mono">{note.beats} beat{note.beats===1?'':'s'}</span></button>)}</div></details>}
        {selected&&<div className="about-option-buttons mono" role="group" aria-label="Edit selected note"><button aria-pressed={entryMode==='replace'} onClick={()=>setEntryMode('replace')}>Replace</button><button aria-pressed={entryMode==='insert'} onClick={()=>setEntryMode('insert')}>Insert before</button><button aria-pressed={entryMode==='append'} onClick={()=>{setEntryMode('append');setEditSlot(null)}}>Add at end</button></div>}
        <div className="about-option-field mono"><span>Register</span><div className="about-option-buttons" role="group" aria-label="Piece register">{([[28,'Low','E1–D♯2'],[40,'Middle','E2–D♯3'],[52,'Upper','E3–G3']] as const).map(([value,label,range])=><button key={value} aria-pressed={register===value} onClick={()=>setRegister(value)}>{label}<span>{range}</span></button>)}</div></div>
        <div className="about-pitch-palette" aria-label="Write a pitch">{pitches.map(midi=><button key={midi} aria-label={`Write ${midiLabel(midi)}`} onClick={()=>write(midi)}>{midiLabel(midi)}</button>)}</div>
        <div className="about-option-field mono"><span>Duration</span><div className="about-option-buttons about-duration-buttons" role="group" aria-label="Piece note length">{([[.25,'16th'],[.5,'Eighth'],[1,'Quarter'],[2,'Half'],[4,'Whole']] as const).map(([value,label])=><button key={value} aria-pressed={beats===value} onClick={()=>duration(value)}>{label}</button>)}</div></div>
        <div className="about-play-actions mono"><button onClick={()=>write(null)}>Write rest</button><button onClick={()=>{if(selected){commit(notes.filter((_,index)=>index!==editSlot));setEditSlot(null);setEntryMode('append')}}} disabled={!selected}>Remove selected</button></div>
        <div className="about-option-field mono"><span>Sound</span><div className="about-option-buttons" role="group" aria-label="Piece sound">{([['pizzicato','Plucked'],['arco','Bowed']] as const).map(([value,label])=><button key={value} aria-pressed={articulation===value} onClick={()=>onArticulation(value)}>{label}</button>)}</div></div>
        <label className="about-field mono">Tempo<span>{tempo} BPM</span><input type="range" min={40} max={180} step={1} value={tempo} onChange={event=>onTempo(Number(event.target.value))} aria-label="Piece tempo"/></label>
        <p className="about-interaction-note mono" role="status">{message|| (selected?`Note ${editSlot!+1}: ${midiLabel(notes[editSlot!].midi)}. Change its pitch or duration.`:touchEditing ? 'Write notes and rests. Choose an event in Notes & rests to edit it.' : 'Write notes and rests. Select a mark on the paper to edit it.')}</p>
        <div className="about-play-actions mono">{!notes.length&&<button onClick={()=>{commit(study);onPage(0)}}>Start with a study</button>}<button onClick={()=>{commit([]);setEditSlot(null);setEntryMode('append');onPage(0)}} disabled={!notes.length}>Clear score</button></div>
        <details className="about-personal-detail"><summary>Take the score with you<span aria-hidden="true">+</span></summary><div className="about-play-actions mono"><button onClick={()=>save('midi')} disabled={!notes.length}>Save MIDI</button><button onClick={()=>save('xml')} disabled={!notes.length}>Save MusicXML</button></div><p>MIDI keeps the sounding pitches and timing. MusicXML keeps the written score for a notation editor.</p></details>
      </div>
    </div>
    <details className="about-library-credit"><summary>A piece with a little history<span aria-hidden="true">+</span></summary><p>I wrote “The Beauty of Loss” in 2024 as a reflection on my formative years with Golden Hornet.</p><p><a href="https://drive.google.com/file/d/11SN3b9sfKPxgA7xHGOV-ob0U7xVu9sRg/view" target="_blank" rel="noreferrer">The piece and its program note ↗</a></p></details>
  </div>
}
