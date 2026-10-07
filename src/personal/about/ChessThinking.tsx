import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { SearchTrace } from './ChessSearch'
import { formatEngineScore } from './chess-analysis'
import { searchPlot } from './chess-search-visuals'
import { createThinkingModel, layoutThinkingGraph, thinkingMoveNumber, type ThinkingLayout, type ThinkingModel } from './chess-thinking-model'
import ChessWorlds from './ChessWorlds'
import ChessPrintScreen from './chess-print-screen'
import './chess-thinking.css'

const compactNodes = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

export function ChessIterations({ trace, dither = false }: { trace: SearchTrace; dither?: boolean }) {
  const printId = useId().replace(/:/g,'')
  const plot = useMemo(() => searchPlot(trace.samples), [trace.samples])
  if (!plot.points.length) return null
  const last = plot.points.at(-1)!
  const hasCp = plot.points.some(point => point.y !== null)
  const scale = hasCp ? `±${(plot.ceiling / 100).toFixed(2)} pawns` : plot.points.some(point => point.kind === 'mate') ? 'Mate reports' : 'Unscored'
  return <figure className="chess-iterations">
    <svg viewBox="0 0 480 60" preserveAspectRatio="none" role="img" aria-label={`Evaluation across ${plot.points.length} reported depths. ${hasCp ? `Scale plus or minus ${(plot.ceiling / 100).toFixed(2)} pawns.` : 'No centipawn score reported.'} Triangles mark bounds; diamonds mark mate scores.`}>
      {dither && <defs><ChessPrintScreen id={`${printId}-evaluation`} coverage={.38}/></defs>}
      {dither && plot.points.map((point,index) => {
        const next = plot.points[index+1]
        return point.kind === 'exact' && next?.kind === 'exact' ? <path key={point.key} d={`M${point.x} 30V${point.y}L${next.x} ${next.y}V30Z`} fill={`url(#${printId}-evaluation)`} aria-hidden="true"/> : null
      })}
      {hasCp && <><path className="chess-iterations-zero" d="M16 30H464"/><text className="chess-iterations-baseline" x="476" y="30" textAnchor="middle" dominantBaseline="central" aria-hidden="true">0</text></>}
      {plot.segments.map((segment,index) => <path key={index} className="chess-iterations-line" d={segment}/>)}
      {plot.points.map(point => <g key={point.key}><title>{`Depth ${point.sample.depth}: ${formatEngineScore(point.sample.score)}`}</title>
        {point.kind === 'exact' && <circle className="chess-iterations-point" cx={point.x} cy={point.y!} r="2"/>}
        {point.kind === 'bound' && <path className="chess-iterations-point" d={point.sample.score?.bound === 'lower' ? `M${point.x} ${point.y! - 3}l-3 6h6Z` : `M${point.x} ${point.y! + 3}l-3 -6h6Z`}/>}
        {point.kind === 'mate' && <path className="chess-iterations-point" d={`M${point.x} 48l3 4-3 4-3-4Z`}/>}
        {point.kind === 'depth' && <path className="chess-iterations-unscored" d={`M${point.x} 50v5`}/>}
      </g>)}
      {last.y !== null && <circle key={last.key} className="chess-iterations-report" cx={last.x} cy={last.y} r="5"/>}
    </svg>
    <figcaption><span>d{plot.firstDepth}</span><span>{scale}</span><span>d{plot.lastDepth}</span></figcaption>
  </figure>
}

function ReportedLines({ model, layout, variant, id, dither = false }: { model: ThinkingModel; layout: ThinkingLayout; variant: 'wide' | 'compact'; id: string; dither?: boolean }) {
  const description = `${model.lines.length} reported best lines, showing up to ${layout.plies} plies. Ink marks the latest reported line; earlier reports are subdued.`
  return <svg className={`chess-thinking-graph chess-thinking-graph-${variant}`} viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-labelledby={`${id}-${variant}-title ${id}-${variant}-description`}>
    {dither && <defs><ChessPrintScreen id={`${id}-${variant}-route-screen`} coverage={.63}/></defs>}
    <title id={`${id}-${variant}-title`}>Reported best lines</title>
    <desc id={`${id}-${variant}-description`}>{description} {model.lines.map(line => `Depth ${line.depth}: ${line.ids.map(nodeId => model.nodes.find(node => node.id === nodeId)?.move.san).join(' ')}.`).join(' ')}</desc>
    {Array.from({ length: layout.plies }, (_, index) => <text key={index} className="chess-thinking-column" x={variant === 'compact' ? 43 + index * 76 : 64 + index * 120} y="14" textAnchor="middle">{thinkingMoveNumber(model, index + 1)}</text>)}
    <g className="chess-thinking-routes" aria-hidden="true">{layout.edges.map(edge => <path key={edge.id} d={edge.path} className="chess-thinking-route" data-current={edge.current} style={dither ? {stroke:`url(#${id}-${variant}-route-screen)`,strokeWidth:edge.current ? 3 : 1.8} : undefined}/>)}</g>
    {layout.currentPath && <path key={model.currentIds.join(',')} className="chess-thinking-activity" d={layout.currentPath} pathLength="1" style={dither ? {stroke:`url(#${id}-${variant}-route-screen)`,strokeWidth:4} : undefined} aria-hidden="true"><title>Decorative activity while Stockfish searches</title></path>}
    {layout.nodes.map(node => <g key={node.id} className="chess-thinking-node" data-current={node.current} transform={`translate(${node.x} ${node.y})`}>
      <title>{`${node.move.from}${node.move.to}${node.move.promotion ?? ''}; reported at depth ${node.reportDepths.join(', ')}`}</title>
      <rect className="chess-thinking-label-ground" x={variant === 'compact' ? -29 : -37} y="-10" width={variant === 'compact' ? 58 : 74} height="19"/>
      <text className="chess-thinking-san" textAnchor="middle" dominantBaseline="central">{node.move.san}</text>
      {node.current && <rect key={`${model.currentIds.join(',')}:${model.lines.at(-1)?.depth}`} className="chess-thinking-visit" x="-12" y="10" width="24" height="1.5" style={{ animationDelay: `${(node.ply - 1) * 70}ms` }} aria-hidden="true"/>}
      {node.endDepths.length > 0 && <text className="chess-thinking-report-depth" textAnchor="middle" y="18">d{node.endDepths.at(-1)}</text>}
      {node.continues && <text className="chess-thinking-continuation" x={variant === 'compact' ? 29 : 37} y="3" aria-label="Reported line continues">…</text>}
    </g>)}
  </svg>
}

export function ChessReportedLines({ trace, dither = false }: { trace: SearchTrace | null; dither?: boolean }) {
  const id = useId()
  const model = useMemo(() => createThinkingModel(trace),[trace])
  const wide = useMemo(() => layoutThinkingGraph(model),[model])
  const narrow = useMemo(() => layoutThinkingGraph(model,true),[model])
  if (!model.nodes.length) return null
  return <figure className="chess-reported-lines"><figcaption>Reported best lines</figcaption><ReportedLines model={model} layout={wide} variant="wide" id={id} dither={dither}/><ReportedLines model={model} layout={narrow} variant="compact" id={id} dither={dither}/></figure>
}

export default function ChessThinking({ trace, thinking, finishing, thinkTime, onPlayNow, loading }: { trace: SearchTrace | null; thinking: boolean; finishing: boolean; thinkTime: number; onPlayNow(): void; loading: number | null | undefined }) {
  const section = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => setInView(entries.some(entry => entry.isIntersecting)))
    if (section.current) observer?.observe(section.current)
    return () => { document.removeEventListener('visibilitychange', update); observer?.disconnect() }
  }, [])
  const model = useMemo(() => createThinkingModel(trace), [trace])
  const latest = trace?.latest
  const settled = !thinking && !!trace?.complete
  const state = loading !== undefined ? 'loading' : thinking ? 'searching' : settled ? 'settled' : 'idle'
  const motion = state === 'searching' && visible && inView
  const percent = typeof loading === 'number' && Number.isFinite(loading) ? Math.max(0, Math.min(1, loading)) : null
  return <section ref={section} className="chess-thinking" data-state={state} data-motion={motion} aria-label={settled ? 'Last Stockfish search' : 'Stockfish search'}>
    <header className="chess-thinking-heading">
      <div><h3>Stockfish</h3></div>
      <div className="chess-thinking-controls"><span className="chess-thinking-status" role="status" aria-live="polite" aria-atomic="true">{state === 'loading' ? percent === 1 ? 'Starting' : 'Loading' : thinking ? finishing ? 'Finishing' : 'Thinking' : settled ? 'Last search' : 'Ready'}</span><button className="chess-play-now" hidden={!thinking || loading !== undefined} disabled={finishing || !latest?.depth} onClick={onPlayNow} title="Play Stockfish’s best move so far">Play now<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4"/></svg></button></div>
    </header>
    {loading === undefined && latest && <div className="chess-thinking-footer">
      {model.move && <span className="chess-thinking-move"><span>{model.moveLabel === 'Candidate' ? thinking ? 'Considering' : 'Searched move' : model.moveLabel}</span><strong key={`${trace?.fen}/${model.move}`}>{model.move}</strong></span>}
      <span className="chess-thinking-score" title="White-positive evaluation. Mate distance is in moves; ≥ and ≤ indicate bounds."><span><span className="chess-evaluation-label-prefix">Eval · </span>White</span><strong>{formatEngineScore(latest.score)}</strong></span>
      <span className="chess-thinking-statistics" data-has-time={latest.timeMs !== undefined}>{latest.depth > 0 && <span>Depth <b>{latest.depth}</b></span>}{latest.depth > 0 && <span title={`${latest.nodes.toLocaleString('en')} searched nodes`}><b>{compactNodes.format(latest.nodes)}</b> nodes</span>}{latest.timeMs !== undefined && <span className="chess-thinking-time" title="Elapsed search time reported by Stockfish"><b>{(latest.timeMs / 1000).toFixed(1)}s</b>{thinking && <span> / {thinkTime / 1000}s</span>}</span>}</span>
      {trace && <ChessIterations trace={trace}/>}
    </div>}
    <figure className="chess-thinking-diagram">
      {state === 'loading' ? <div className="chess-thinking-empty"><span>Opening the engine</span><div className="chess-thinking-download" role="progressbar" aria-label="Loading Stockfish" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent === null ? undefined : Math.floor(percent * 100)}><span style={{ width: `${(percent ?? 0) * 100}%` }}/></div>{percent !== null && <span className="chess-thinking-percent">{Math.floor(percent * 100)}%</span>}</div> : model.nodes.length ? <>
        <ChessWorlds trace={trace} thinking={thinking}/>
      </> : <div className="chess-thinking-empty">{thinking || trace ? <span>{thinking ? 'Awaiting a reported line' : 'No line reported'}</span> : <p className="chess-thinking-instruction"><strong>Your move.</strong><span>Select a piece, then a marked square.</span></p>}</div>}
    </figure>
  </section>
}
