import { useMemo } from 'react'
import { buildScoreEngraving, type ScoreCommand } from './score-engraving'
import type { PhraseNote } from './music-phrase'

export { scorePageCount } from './score-engraving'
export type ScorePreviewProps = { notes: readonly PhraseNote[]; title: string; tempo: number; page?: number; activeIndex?: number | null; selectedIndex?: number | null; readable?: boolean; onSelect?: (index: number) => void }

export function ScorePrimitive({ command }: { command: ScoreCommand }) {
  const shared = { 'data-score-role': command.role, 'data-source-index': command.sourceIndex, opacity: command.alpha ?? 1 }
  if (command.kind === 'text') return <text {...shared} x={command.x} y={command.y} fontSize={command.size} fontFamily={command.font === 'serif' ? "Georgia, 'Times New Roman', serif" : "'Courier New', monospace"} textAnchor={command.anchor} fill="currentColor">{command.text}</text>
  if (command.kind === 'line') return <line {...shared} x1={command.x1} y1={command.y1} x2={command.x2} y2={command.y2} stroke="currentColor" strokeWidth={command.width} />
  if (command.kind === 'rect') return <rect {...shared} x={command.x} y={command.y} width={command.width} height={command.height} fill="currentColor" />
  if (command.kind === 'path') return <path {...shared} d={command.d} fill={command.fill ? 'currentColor' : 'none'} stroke={command.fill ? 'none' : 'currentColor'} strokeWidth={command.width} />
  return <ellipse {...shared} cx={command.x} cy={command.y} rx={command.rx} ry={command.ry} transform={`rotate(${command.rotation} ${command.x} ${command.y})`} fill={command.fill ? 'currentColor' : 'none'} stroke={command.fill ? 'none' : 'currentColor'} strokeWidth={command.width} />
}

export default function ScorePreview({ notes, title, tempo, page = 0, activeIndex = null, selectedIndex = null, readable = false, onSelect }: ScorePreviewProps) {
  const engraving = useMemo(() => buildScoreEngraving(notes, { title, tempo, page, activeIndex }), [notes, title, tempo, page, activeIndex])
  return <figure className="score-preview" data-page-count={engraving.pageCount} data-page={engraving.page + 1} data-readable={readable}>
    <div className="score-preview-sheet">
      <div className="score-preview-canvas" style={{ position: 'relative' }}>
      <svg className="score-preview-svg" viewBox={`0 0 ${engraving.width} ${engraving.height}`} role="img" aria-label={`${title || 'Untitled study'}, double-bass score. Page ${engraving.page + 1} of ${engraving.pageCount}.`} style={{ display: 'block', width: '100%', height: 'auto' }} strokeLinecap="round" strokeLinejoin="round">
        {engraving.commands.map((command, index) => <ScorePrimitive key={index} command={command} />)}
      </svg>
      {onSelect && <div className="score-preview-selections" style={{ position: 'absolute', inset: 0 }}>{engraving.hitTargets.map((target, index) => <button key={index} className="score-preview-event" style={{ position: 'absolute', left: `${target.x / engraving.width * 100}%`, top: `${target.y / engraving.height * 100}%`, width: `${target.width / engraving.width * 100}%`, height: `${target.height / engraving.height * 100}%` }} aria-label={`Select ${target.label.toLowerCase()}`} aria-pressed={selectedIndex === target.sourceIndex} aria-current={activeIndex === target.sourceIndex ? 'step' : undefined} data-active={activeIndex === target.sourceIndex} data-selected={selectedIndex === target.sourceIndex} data-source-index={target.sourceIndex} onClick={() => onSelect(target.sourceIndex)} />)}</div>}
      </div>
    </div>
    <figcaption className="score-preview-caption mono">Double bass · sounds one octave below the written score.</figcaption>
  </figure>
}
