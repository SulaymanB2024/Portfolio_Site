import { useId, useMemo, useState } from 'react'
import { archiveEntries, repertoireComposers, splitWork, toggleProgram, type PerformanceEntry, type PerformanceFilter } from './performance-archive'
import './performances.css'

const filters = [
  ['all', 'All'],
  ['ut-austin', 'UT Austin'],
  ['all-state', 'All-State'],
] as const

function RepertoirePreview({ works }: { works: string[] }) {
  const composers = repertoireComposers(works)
  if (!composers.length) return null
  return <p className="performance-program-preview" aria-label={`Music by ${composers.map(composer => composer.name).join(', ')}`}>
    {composers.map(composer => composer.short).join(' · ')}
  </p>
}

export default function PerformanceArchive({ entries }: { entries: PerformanceEntry[] }) {
  const archiveId = useId()
  const [filter, setFilter] = useState<PerformanceFilter>('all')
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const visible = useMemo(() => archiveEntries(entries, filter), [entries, filter])
  const years = useMemo(() => [...new Set(visible.map(entry => entry.date.slice(0, 4)))], [visible])

  const chooseFilter = (value: PerformanceFilter) => {
    if (value === filter) return
    setFilter(value)
  }

  return <div className="performance-programs">
    <div className="performance-program-filters" role="group" aria-label="Filter performances">
      {filters.map(([value, label]) => {
        const count = entries.filter(entry => value === 'all' || entry.series === value).length
        return <button type="button" key={value} aria-pressed={filter === value} onClick={() => chooseFilter(value)}>
          <span>{label}</span><span className="performance-filter-count" aria-hidden="true">{String(count).padStart(2, '0')}</span>
          <span className="performance-visually-hidden">, {count} programs</span>
        </button>
      })}
    </div>

    <div className="performance-program-chronology">
      {years.map(year => <section className="performance-program-year" key={year} aria-labelledby={`${archiveId}-${year}`}>
        <h3 className="performance-year-label" id={`${archiveId}-${year}`}>{year}</h3>
        <div className="performance-year-programs">
          {visible.filter(entry => entry.date.startsWith(year)).map(entry => {
            const expanded = openIds.has(entry.id)
            const panelId = `${archiveId}-${entry.id}-program`
            const toggleId = `${archiveId}-${entry.id}-toggle`
            const titleId = `${toggleId}-title`
            return <article className="performance-program" key={entry.id} data-expanded={expanded}>
              <div className="performance-program-heading">
                {entry.endDate ? <span className="performance-program-date">
                  <time dateTime={entry.date}>{entry.displayDate.split('–')[0]}</time>–<time dateTime={entry.endDate}>{entry.displayDate.split('–')[1].replace(/, \d{4}$/, '')}</time>
                </span> : <time className="performance-program-date" dateTime={entry.date} aria-label={entry.displayDate}>
                  {entry.displayDate.replace(/, \d{4}$/, '')}
                </time>}
                <div className="performance-program-identity">
                  <h4>
                    <button className="performance-program-toggle" type="button" id={toggleId}
                      aria-expanded={expanded} aria-controls={panelId}
                      aria-label={`${expanded ? 'Close' : 'Open'} ${entry.title} program, ${entry.displayDate}`}
                      onClick={() => setOpenIds(previous => toggleProgram(previous, entry.id))}>
                      <span className="performance-program-title" id={titleId}>{entry.title}</span>
                      <span className="performance-program-sign" aria-hidden="true"><i /><i /></span>
                    </button>
                  </h4>
                  <p className="performance-program-ensemble">{entry.ensemble}</p>
                  {!expanded && <RepertoirePreview works={entry.repertoire} />}
                  {!expanded && entry.links.some(link => link.kind === 'recording') && <p className="performance-recording-cue">Recording release <span aria-hidden="true">↘</span></p>}
                </div>
              </div>

              <div className="performance-program-panel" id={panelId} role="region" aria-labelledby={titleId} hidden={!expanded}>
                <div className="performance-program-sheet">
                  <div className="performance-program-sheet-label">
                    <span>Repertoire</span><span>{entry.role === 'performer' ? 'Double bass' : 'Composer'}</span>
                  </div>
                  {entry.repertoire.length > 0 && <ol className="performance-program-repertoire" role="list" aria-label="Repertoire">
                    {entry.repertoire.map((work, index) => {
                      const { composer, title } = splitWork(work)
                      return <li key={work}>
                        <span className="performance-work-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                        <span className="performance-work-credit">{composer}</span>
                        {composer && <span className="performance-visually-hidden"> — </span>}
                        <span className="performance-work-title">{title}</span>
                      </li>
                    })}
                  </ol>}
                  <nav className="performance-program-sources" aria-label={`Sources for ${entry.title}, ${entry.displayDate}`}>
                    {entry.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" data-kind={link.kind}>
                      <span>{link.label}</span><span className="performance-source-arrow" aria-hidden="true">↗</span>
                      <span className="performance-visually-hidden"> (opens in a new tab)</span>
                    </a>)}
                  </nav>
                </div>
              </div>
            </article>
          })}
        </div>
      </section>)}
      {!visible.length && <p className="performance-program-empty">No performances in this series.</p>}
    </div>
    <p className="performance-visually-hidden" role="status" aria-live="polite" aria-atomic="true">{visible.length} concert programs shown.</p>
  </div>
}
