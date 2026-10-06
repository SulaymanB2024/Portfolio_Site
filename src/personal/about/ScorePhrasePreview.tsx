import { useMemo } from 'react'
import { buildScoreEngraving } from './score-engraving'
import { ScorePrimitive } from './ScorePreview'
import { firstMeasurePhrase, midiLabel, type PhraseNote } from './music-phrase'

/** The first bar uses the same engraving as the manuscript and full editor. */
export default function ScorePhrasePreview({ notes, tempo, activeIndex }: { notes: readonly PhraseNote[]; tempo: number; activeIndex: number | null }) {
  const engraving = useMemo(() => buildScoreEngraving(firstMeasurePhrase(notes), { tempo, activeIndex }), [notes, tempo, activeIndex])
  const events = engraving.hitTargets.filter(target => target.measure === 0)
  // A cropped vector view keeps the actual clef, transposition and rhythm,
  // including ties when an edited event crosses the first barline.
  return <div className="about-phrase-preview">
    <svg viewBox="56 172 336 138" role="img" aria-label={`First measure, double bass. ${events.length ? events.map(target => target.label).join('. ') : 'No notes yet.'}`} strokeLinecap="round" strokeLinejoin="round">
      {engraving.commands.filter(command => command.role !== 'measure-number' || command.kind === 'text' && command.text === '1').map((command, index) => <ScorePrimitive key={index} command={command} />)}
    </svg>
    <div className="about-phrase" aria-label="Your phrase">{Array.from({ length: 4 }, (_, index) => <span key={index} data-filled={!!notes[index]} data-playing={activeIndex === index}><span className="about-phrase-index mono">0{index + 1}</span><span>{notes[index] ? midiLabel(notes[index].midi) : '—'}</span></span>)}</div>
  </div>
}
