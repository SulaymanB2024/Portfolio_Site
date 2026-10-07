import { useEffect, useRef, useState } from 'react'
import type { SearchTrace } from './ChessSearch'
import { ChessIterations } from './ChessThinking'
import { formatEngineScore } from './chess-analysis'
import ChessContinuation from './ChessContinuation'

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

export default function ChessTelemetry({ trace, positionFen, flipped, loading, error, local }: { trace: SearchTrace | null; positionFen: string; flipped: boolean; loading: number | null | undefined; error: boolean; local: boolean }) {
  const section = useRef<HTMLElement>(null)
  const [motion, setMotion] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let inView = true
    const update = () => setMotion(inView && !document.hidden && !reduced.matches)
    const observer = new IntersectionObserver(entries => { inView = entries.some(entry => entry.isIntersecting); update() })
    if (section.current) observer.observe(section.current)
    document.addEventListener('visibilitychange', update); reduced.addEventListener('change', update); update()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); reduced.removeEventListener('change', update) }
  }, [])
  const latest = trace?.latest && trace.latest.depth > 0 ? trace.latest : null
  const searching = !!trace && !trace.complete && loading === undefined
  const state = error ? 'Unavailable' : local ? 'Two players' : loading !== undefined ? 'Loading' : searching ? 'Searching' : latest ? trace?.played ? 'Last search' : 'Opening study' : 'Ready'
  return <aside ref={section} className="chess-telemetry chess-thinking" data-state={searching ? 'searching' : latest ? 'settled' : 'idle'} data-motion={motion && searching} aria-label="Stockfish visualizations">
    <header className="chess-telemetry-heading"><h2>Inside the search</h2><span role="status" aria-live="polite">{state}</span></header>
    <div className="chess-telemetry-spatial">
      <ChessContinuation trace={trace} positionFen={positionFen} flipped={flipped} motion={motion}/>
      <dl className="chess-telemetry-values">
        <div className="chess-telemetry-eval"><dt>Evaluation · White</dt><dd>{formatEngineScore(latest?.score)}</dd></div>
        <div><dt>Depth / selective</dt><dd>{latest ? `${latest.depth} / ${latest.seldepth ?? '—'}` : '—'}</dd></div>
        <div><dt>Positions searched</dt><dd title={latest?.nodes.toLocaleString('en')}>{latest ? compact.format(latest.nodes) : '—'}</dd></div>
        <div><dt>Positions / second</dt><dd>{latest?.nps !== undefined ? compact.format(latest.nps) : '—'}</dd></div>
      </dl>
    </div>
    <div className="chess-telemetry-depth"><span>Evaluation by depth</span>{trace && latest ? <ChessIterations trace={trace} dither/> : <div className="chess-telemetry-empty-chart" aria-hidden="true"/>}</div>
    {(error || local) && <p className="chess-telemetry-notice">{error ? 'Engine unavailable. Use Retry Stockfish below the board.' : 'Choose Stockfish in Options to see its search.'}</p>}
    <p className="chess-telemetry-caption">{trace?.played ? <>Played <strong>{trace.played}</strong> · </> : null}{local ? 'Two players · current position.' : 'Stockfish 19 · reported principal variations.'}</p>
  </aside>
}
