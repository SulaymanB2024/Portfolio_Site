import { useMemo } from 'react'
import { buildScoreEngraving } from './score-engraving'
import { ScorePrimitive } from './ScorePreview'
import { clampedPhraseTempo, firstMeasurePhrase, midiLabel, type PhraseNote } from './music-phrase'
import './music-study.css'

/** The first bar uses the same engraving as the manuscript and full editor. */
export default function ScorePhrasePreview({ notes, tempo, activeIndex }: { notes: readonly PhraseNote[]; tempo: number; activeIndex: number | null }) {
  const engraving = useMemo(() => buildScoreEngraving(firstMeasurePhrase(notes), { tempo, activeIndex }), [notes, tempo, activeIndex])
  const events = engraving.hitTargets.filter(target => target.measure === 0)
  const active = events.find(target => target.sourceIndex === activeIndex)
  const beat = active ? notes.slice(0, active.sourceIndex).reduce((sum, note) => sum + note.beats, 0) : null
  const top = Math.min(172, ...events.map(target => target.y - 18))
  const bottom = Math.max(310, ...events.map(target => target.y + target.height + 18))
  // A cropped vector view keeps the actual clef, transposition and rhythm,
  // including ties when an edited event crosses the first barline.
  return <div className="about-phrase-preview music-phrase-study" data-sounding={!!active}>
    <div className="music-manuscript">
      <div className="music-manuscript-heading mono"><span>First bar · 4/4</span><span aria-label={`${clampedPhraseTempo(tempo)} quarter notes per minute`}>♩ = {clampedPhraseTempo(tempo)}</span></div>
      <svg className="music-manuscript-score" viewBox={`56 ${top} 336 ${bottom - top}`} role="img" aria-label={`First measure, double bass. ${events.length ? events.map(target => target.label).join('. ') : 'No notes yet.'}`} strokeLinecap="round" strokeLinejoin="round">
        {engraving.commands.filter(command => !['measure-number','title','label','rule','page-number'].includes(command.role)).map((command, index) => <g key={index} className="music-score-mark" data-playing={command.sourceIndex !== undefined && command.sourceIndex === activeIndex} data-role={command.role}><ScorePrimitive command={command} /></g>)}
        {active && <g key={activeIndex} className="music-score-cursor" aria-hidden="true" transform={`translate(${active.x + active.width / 2} 0)`}><path d={`M -3 ${top + 8} L 3 ${top + 8} L 0 ${top + 12} Z`} fill="currentColor"/><path d={`M 0 ${top + 15} L 0 ${bottom - 18}`} stroke="currentColor" strokeWidth=".6"/><path d={`M -3 ${bottom - 10} L 3 ${bottom - 10} L 0 ${bottom - 14} Z`} fill="currentColor"/></g>}
      </svg>
      <div className="music-measure-beats mono" aria-hidden="true">{[0, 1, 2, 3].map(index => <span key={index} data-current={beat !== null && Math.floor(beat) === index}><span>{index + 1}</span><i/></span>)}</div>
    </div>
    <div className="about-phrase" aria-label="Your phrase">{Array.from({ length: 4 }, (_, index) => <span key={index} data-filled={!!notes[index]} data-playing={activeIndex === index}><span className="about-phrase-index mono">0{index + 1}</span><span>{notes[index] ? midiLabel(notes[index].midi) : '—'}</span></span>)}</div>
  </div>
}
