import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { SearchTrace } from './ChessSearch'
import ChessPiece from './ChessPiece'
import { createChessWorlds, worldMoveLine, worldPieceKeyframes, type ChessWorld } from './chess-worlds-model'
import './chess-worlds.css'

const squares = Array.from({ length: 64 }, (_, index) => `${'abcdefgh'[index % 8]}${8 - Math.floor(index / 8)}`)
const placement = (square: string) => ({ left: `${'abcdefgh'.indexOf(square[0]) * 12.5}%`, top: `${(8 - Number(square[1])) * 12.5}%` })

function WorldPreview({ world, primary, line, rootFen, settled, thinking, motion, canReplay }: {world:ChessWorld;primary:boolean;line:string;rootFen:string;settled:boolean;thinking:boolean;motion:boolean;canReplay:boolean}) {
  const scope = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [interrupted, setInterrupted] = useState(!motion)
  const [take, setTake] = useState(0)
  const [replaying, setReplaying] = useState(false)
  useEffect(() => { if (!motion) setInterrupted(true) }, [motion])
  useEffect(() => {
    if (!canReplay) { setReplaying(false); return }
    if (!replaying) return
    const timeout = window.setTimeout(() => setReplaying(false), world.moves.length * 650)
    return () => window.clearTimeout(timeout)
  }, [canReplay,replaying,take,world.moves.length])
  // The immutable root and legal path define the trajectories. Depth-only reports reuse them.
  const { animations, rules, highlights } = useMemo(() => {
    const animations = world.tracks.map((track,index) => ({track,name:`world${scope}take${take}piece${index}`,frames:worldPieceKeyframes(track)}))
    const rules = animations.filter(animation => animation.track.moving).map(animation => `@keyframes ${animation.name}{${animation.frames.map((frame,index) => {
      const ply = Math.ceil(index / 3)
      const raised = index > 0 && index % 3 !== 0 && animation.track.squares[ply] && animation.track.squares[ply - 1] !== animation.track.squares[ply]
      return `${frame.percent}%{transform:translate(${frame.x}%,${frame.y}%);opacity:${frame.opacity};--world-upgraded:${frame.promoted};z-index:${raised ? 3 : 1};}`
    }).join('')}}`).join('')
    const highlights = world.moves.map((move,index) => {
      const start = index / world.moves.length * 100, end = (index + 1) / world.moves.length * 100
      const name = `world${scope}take${take}move${index}`
      const final = index === world.moves.length - 1 ? 1 : 0
      return {move,name,rule:`@keyframes ${name}{0%{opacity:0}${Math.max(0,start-.001)}%{opacity:0}${start}%{opacity:1}${end-.001}%{opacity:1}${end}%{opacity:${final}}100%{opacity:${final}}}`}
    })
    return { animations, rules, highlights }
  }, [world.id,scope,take])
  const fields = rootFen.split(/\s+/), startsBlack = fields[1] === 'b', firstNumber = Number(fields[5]) || 1
  const play = (canReplay && replaying) || (motion && !interrupted)
  return <figure className="chess-world" data-primary={primary} data-current={world.current} data-play={play} data-replaying={replaying} style={{'--world-duration':`${world.moves.length * 650}ms`} as CSSProperties}>
    <style>{rules}{highlights.map(highlight=>highlight.rule).join('')}</style>
    <button className="chess-world-board" disabled={!canReplay} onClick={() => { setTake(value => value + 1); setReplaying(true) }} aria-label={`${canReplay ? 'Replay reported' : 'Reported'} line from depth ${world.depth}: ${line}`} title={canReplay ? `Replay · ${line}` : `Reported line · ${line}`}>
      {squares.map((square,index) => <span key={square} className="chess-world-square" data-dark={(Math.floor(index / 8) + index % 8) % 2 === 1} data-last={square === world.lastMove.from || square === world.lastMove.to} style={placement(square)} aria-hidden="true"/>)}
      {animations.map(({track,name,frames}) => {
        const final = frames.at(-1)!
        return <span key={track.id} className="chess-world-piece" data-moving={track.moving} style={{transform:`translate(${final.x}%,${final.y}%)`,opacity:final.opacity,'--world-animation':name,'--world-upgraded':final.promoted} as CSSProperties}>
          <span className="chess-world-original"><ChessPiece type={track.initialType} color={track.color}/></span>
          {track.finalType !== track.initialType && <span className="chess-world-upgraded"><ChessPiece type={track.finalType} color={track.color}/></span>}
        </span>
      })}
      {highlights.flatMap(({move,name},index)=>[move.from,move.to].map(square=><span key={`${index}${square}`} className="chess-world-marker" data-square={square} data-dark={('abcdefgh'.indexOf(square[0])+8-Number(square[1]))%2===1} style={{...placement(square),'--world-highlight':name} as CSSProperties} aria-hidden="true"/>))}
    </button>
    <figcaption><div className="chess-world-caption"><span>{world.current ? settled ? 'Last' : thinking ? 'Current' : 'Reported' : 'Earlier'}{world.current && (settled || thinking) && <span className="chess-world-line-word"> line</span>}</span><span key={world.depth} className="chess-world-depth" title={`Reported depth ${world.depth}`}>d{world.depth}</span></div><p className="chess-world-line" title={line} aria-label={line}>{highlights.map(({move,name},index)=>{
      const offset = index + Number(startsBlack), number = firstNumber + Math.floor(offset / 2)
      return <span key={`${index}${move.from}${move.to}`} className="chess-world-ply" style={{'--world-highlight':name} as CSSProperties}>{offset % 2 === 0 ? <span className="chess-world-number">{number}. </span> : index === 0 ? <span className="chess-world-number">{number}… </span> : null}<b>{move.san}</b>{' '}</span>
    })}{(world.continues || world.partial) && <span className="chess-world-continuation">…</span>}</p></figcaption>
  </figure>
}

export default function ChessWorlds({ trace, thinking }: { trace: SearchTrace | null; thinking: boolean }) {
  const section = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [inView, setInView] = useState(true)
  const [reduced, setReduced] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => { if (!section.current?.hidden) setInView(entries.some(entry => entry.isIntersecting)) })
    const media = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
    const preference = () => setReduced(media?.matches ?? false)
    media?.addEventListener('change', preference)
    if (section.current) observer?.observe(section.current)
    return () => { document.removeEventListener('visibilitychange', visibility); media?.removeEventListener('change', preference); observer?.disconnect() }
  }, [])
  const model = useMemo(() => createChessWorlds(trace), [trace])
  const canAnimate = visible && inView && !reduced
  const canReplay = model.settled && !thinking && canAnimate
  const motion = thinking && !model.settled && canAnimate
  const preview = (world: ChessWorld, index: number) => <WorldPreview key={world.id} world={world} primary={index === 0} line={worldMoveLine(world, model.rootFen)} rootFen={model.rootFen} settled={model.settled} thinking={thinking} motion={motion} canReplay={canReplay}/>
  return <section ref={section} className="chess-worlds" hidden={!model.worlds.length} data-motion={motion} data-settled={model.settled} aria-label="Reported possible continuations">
    <header className="chess-worlds-heading"><span>Line previews</span>{model.played && <span>Played <b>{model.played}</b></span>}</header>
    <div className="chess-worlds-track">{model.worlds[0] && preview(model.worlds[0],0)}{model.worlds.length > 1 && <div className="chess-worlds-previous"><div className="chess-worlds-prior-heading"><span>Earlier reports</span></div>{model.worlds.slice(1).map((world,index) => preview(world,index+1))}</div>}</div>
  </section>
}
