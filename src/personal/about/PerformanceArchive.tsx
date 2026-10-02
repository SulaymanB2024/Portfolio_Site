import { useMemo, useState } from 'react'

export type PerformanceEntry = {
  id: string; title: string; date: string; displayDate: string; role: 'performer' | 'composer';
  ensemble: string; repertoire: string[]; links: { label: string; href: string; kind: 'recording' | 'program' }[]
}

export default function PerformanceArchive({ entries, initialRole }: { entries: PerformanceEntry[]; initialRole: 'all' | 'performer' | 'composer' }) {
  const [role, setRole] = useState(initialRole)
  const visible = useMemo(() => entries.filter(entry => role === 'all' || entry.role === role), [entries, role])
  return <div className="about-performance-archive">
    <div className="about-archive-filters mono" role="group" aria-label="Filter performances">
      {([['all', 'All'], ['performer', 'Double bass'], ['composer', 'Composition']] as const).map(([value, label]) => <button key={value} aria-pressed={role === value} onClick={() => setRole(value)}>{label}<span>{entries.filter(entry => value === 'all' || entry.role === value).length}</span></button>)}
    </div>
    <div className="about-performance-list">
      {visible.map(entry => <article className="about-performance" key={entry.id}>
        <div className="about-performance-date mono"><time dateTime={entry.date}>{entry.displayDate}</time><span>{entry.role === 'performer' ? 'Double bass' : 'Composer'}</span></div>
        <div className="about-performance-program"><h3>{entry.title}</h3><p className="about-performance-ensemble">{entry.ensemble}</p>{entry.repertoire.length > 0 && <ul>{entry.repertoire.map(work => <li key={work}>{work}</li>)}</ul>}</div>
        <div className="about-performance-links mono">{entry.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><span aria-hidden="true">{link.kind === 'recording' ? '▷' : '↗'}</span></a>)}</div>
      </article>)}
    </div>
    <p className="sr-only" aria-live="polite">{visible.length} performances shown.</p>
  </div>
}
