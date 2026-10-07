import { useEffect, useRef, useState } from 'react'
import { formatEngineScore, formatPrincipalVariation } from './chess-analysis'
import type { EngineThinkingProgress } from './chess-engine'
import { principalLineSteps, searchPlot } from './chess-search-visuals'
import './chess-search-visuals.css'

export type SearchTrace = { fen: string; latest: EngineThinkingProgress; samples: EngineThinkingProgress[]; complete: boolean; played?: string }
const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

/** Motion follows observed changes to one principal variation and reported depths. */
export default function ChessSearch({ trace, thinking, loading }: { trace: SearchTrace | null; thinking: boolean; loading: number | null | undefined }) {
  const section = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => setInView(entries.some(entry => entry.isIntersecting)))
    if (section.current) observer?.observe(section.current)
    return () => { document.removeEventListener('visibilitychange', visibility); observer?.disconnect() }
  }, [])
  const latest = trace?.latest
  const state = loading !== undefined ? 'loading' : thinking ? 'searching' : trace?.complete ? 'settled' : 'idle'
  const motion = state === 'searching' && visible && inView
  const percent = typeof loading === 'number' && Number.isFinite(loading) ? Math.max(0, Math.min(1, loading)) : null
  const status = state === 'loading' ? percent === 1 ? 'Starting engine' : 'Loading engine' : state === 'searching' ? 'Searching' : state === 'settled' ? 'Last search' : 'After your move'
  const candidate = latest?.pv?.[0]
  const played = state === 'settled' ? trace?.played : undefined
  const move = played ?? candidate?.san
  const candidateKey = `${trace?.fen ?? ''}/${played ?? `${candidate?.from ?? ''}${candidate?.to ?? ''}${candidate?.promotion ?? ''}`}`
  const plot = searchPlot(trace?.samples ?? [])
  const steps = principalLineSteps(latest?.pv, trace?.fen ?? '', 8)
  const line = trace && latest?.pv?.length ? formatPrincipalVariation(latest.pv, trace.fen, 64) : ''
  const moreLine = latest?.pvTruncated || (latest?.pv?.length ?? 0) > steps.length
  const reported = latest && (latest.depth > 0 || latest.timeMs !== undefined || latest.score !== undefined)
  const eventKey = `${latest?.depth}:${latest?.nodes}:${latest?.timeMs}:${latest?.score?.kind}:${latest?.score?.value}:${latest?.score?.bound}`
  const reportedPoint = plot.points.find(point => point.sample.depth === latest?.depth)
  const hasBounds = plot.points.some(point => point.kind === 'bound')
  const hasMate = plot.points.some(point => point.kind === 'mate')
  const hasCp = plot.points.some(point => point.y !== null)
  return <section ref={section} className="chess-search chess-search-ribbon" aria-label="Stockfish search" data-searching={thinking} data-state={state} data-motion={motion}>
    <div className="search-ribbon-heading mono">
      <span className="search-ribbon-engine"><span className="search-ribbon-signal" aria-hidden="true">{state === 'settled' ? '■' : '↗'}</span>Search</span>
      <span className="search-ribbon-status"><span role="status" aria-live="polite" aria-atomic="true">{status}</span>{state === 'loading' && percent !== null && <span aria-hidden="true">{Math.floor(percent * 100)}%</span>}</span>
    </div>
    {state === 'loading' ? <div className="search-ribbon-loading">
      <div className="search-ribbon-download" role="progressbar" aria-label="Loading Stockfish" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent === null ? undefined : Math.floor(percent * 100)} aria-valuetext={percent === 1 ? 'Download complete; starting engine' : undefined}><span style={{ width: `${(percent ?? 0) * 100}%` }}/></div>
    </div> : (state !== 'idle' || trace) && <>
      <div className="search-ribbon-main">
        <div className="search-ribbon-candidate">
          <span className="search-ribbon-label mono">{played ? 'Played' : thinking ? 'Candidate' : 'Searched move'}</span>
          <div key={candidateKey} className="search-ribbon-move search-ribbon-arrival"><strong>{move ?? '—'}</strong>{candidate && (!played || played === candidate.san) && <span className="search-ribbon-coordinates mono">{candidate.from}<span aria-hidden="true">→</span>{candidate.to}</span>}</div>
        </div>
        <div className="search-ribbon-evaluation">
          <span className="search-ribbon-label mono">White evaluation</span>
          <strong data-bound={!!latest?.score?.bound} title="Positive values favor White. Mate distance is in moves. Bound scores are limits.">{formatEngineScore(latest?.score)}</strong>
          {latest?.score?.bound && <span className="search-ribbon-bound mono">{latest.score.bound === 'lower' ? 'Lower bound' : 'Upper bound'}</span>}
        </div>
        <dl className="search-ribbon-stats mono">
          <div><dt>Depth</dt><dd key={latest?.depth} className="search-ribbon-arrival">{latest?.depth || '—'}</dd></div>
          <div><dt>Positions</dt><dd title={reported ? `${latest.nodes.toLocaleString('en')} searched nodes` : undefined}>{reported ? compact.format(latest.nodes) : '—'}</dd></div>
          <div><dt>Time</dt><dd>{latest?.timeMs !== undefined ? `${(latest.timeMs / 1000).toFixed(1)}s` : '—'}</dd></div>
        </dl>
      </div>
      <div className="search-ribbon-line">
        <span className="search-ribbon-label mono">{thinking ? 'Current line' : 'Searched line'}</span>
        {steps.length ? <ol className="search-ribbon-pv mono" aria-label={line} title={line}>{steps.map((step, index) => <li key={`${trace?.fen}/${step.key}`} className="search-ribbon-arrival" data-first={index === 0} title={step.uci}>{step.number && <span className="search-ribbon-number">{step.number}</span>}<span>{step.san}</span></li>)}{moreLine && <li className="search-ribbon-more" aria-label={latest?.pvTruncated ? 'Partial reported line' : 'Line continues'}>…</li>}</ol> : <span className="search-ribbon-awaiting mono">{thinking ? 'Waiting for the first report' : 'No line reported'}</span>}
      </div>
      <figure className="search-ribbon-plot">
        {plot.points.length ? <svg viewBox="0 0 480 84" preserveAspectRatio="none" role="img" aria-label={`${state === 'settled' ? 'Last' : 'Current'} search: ${plot.points.length} reported depths. White-positive evaluation; triangles mark bounds, diamonds mark mate scores.`}>
          <path className="search-ribbon-zero" d="M16 30H464"/><path className="search-ribbon-rail" d="M16 72H464"/>
          {plot.segments.map((segment, index) => <path key={index} className="search-ribbon-trace" d={segment}/>)}
          {plot.points.map(point => <g key={point.key} className="search-ribbon-point search-ribbon-arrival"><title>{`Depth ${point.sample.depth} · ${formatEngineScore(point.sample.score)}`}</title><path className="search-ribbon-tick" d={`M${point.x} 68V76`}/>{point.kind === 'exact' && <circle className="search-ribbon-exact" cx={point.x} cy={point.y!} r="2.5"/>}{point.kind === 'bound' && <path className="search-ribbon-limit" d={point.sample.score?.bound === 'lower' ? `M${point.x} ${point.y! - 3}l-3 6h6Z` : `M${point.x} ${point.y! + 3}l-3 -6h6Z`}/>} {point.kind === 'mate' && <path className="search-ribbon-mate" d={`M${point.x} 67l4 5-4 5-4-5Z`}/>}</g>)}
          {reportedPoint && <circle key={eventKey} className="search-ribbon-report-pulse" cx={reportedPoint.x} cy={reportedPoint.y ?? 72} r="5"/>}
        </svg> : <div className="search-ribbon-empty-plot"/>}
        <figcaption className="mono"><span>{plot.firstDepth === null ? 'No depth report yet' : `Depth ${plot.firstDepth}${plot.firstDepth !== plot.lastDepth ? ` → ${plot.lastDepth}` : ''}`}</span><span>{hasCp ? `±${(plot.ceiling / 100).toFixed(2)}` : 'Reported iterations'}{hasBounds ? ' · △ bound' : ''}{hasMate ? ' · ◇ mate' : ''}</span></figcaption>
      </figure>
    </>}
  </section>
}
