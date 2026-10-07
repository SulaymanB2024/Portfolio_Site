import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { SearchTrace } from './ChessSearch'
import { Chess } from './vendor/chess.js'
import { createChessWorlds, worldMoveLine, type ChessWorld, type WorldFrame } from './chess-worlds-model'
import { continuationPieceKeyframes, continuationTiming } from './chess-continuation-animation'
import ChessPiece from './ChessPiece'
import ChessBoardPrint from './ChessBoardPrint'
import './chess-continuation.css'

function ContinuationBoard({ candidate, root, motion, previous, flipped }: { candidate: ChessWorld | null; root: WorldFrame; motion: boolean; previous: boolean; flipped: boolean }) {
  const scope = useId().replace(/[^a-zA-Z0-9]/g, '')
  const figure = useRef<HTMLElement>(null)
  const pending = useRef(candidate)
  const [world, setWorld] = useState(candidate)
  const [take, setTake] = useState(0)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    pending.current = candidate
    // New depths can update the label without restarting the same legal line.
    setWorld((current) => (!motion || !current || !candidate || current.id === candidate.id ? candidate : current))
  }, [candidate, motion])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => setInView(entries.some((entry) => entry.isIntersecting)))
    if (figure.current) observer.observe(figure.current)
    return () => observer.disconnect()
  }, [])
  const timing = continuationTiming(world?.moves.length ?? 0)
  const cycle = `continuation${scope}cycle${take}`
  const { animations, rules, highlights } = useMemo(() => {
    const tracks =
      world?.tracks ??
      root.pieces.map((piece) => ({ id: piece.id, color: piece.color, initialType: piece.type, finalType: piece.type, squares: [piece.square], promotionAt: null, moving: false }))
    const animations = tracks.map((track, index) => ({ track, name: `continuation${scope}take${take}piece${index}`, frames: continuationPieceKeyframes(track) }))
    const rules = animations
      .filter((animation) => animation.track.moving)
      .map(
        (animation) =>
          `@keyframes ${animation.name}{${animation.frames.map((frame) => `${frame.percent}%{transform:translate(${frame.x}px,${frame.y}px);opacity:${frame.opacity};--continuation-promoted:${frame.promoted};}`).join('')}}`
      )
      .join('')
    const highlights = (world?.moves ?? []).map((move, index) => {
      const start = ((timing.lead + index * timing.step) / timing.duration) * 100
      const end = ((timing.lead + (index + 1) * timing.step) / timing.duration) * 100
      const name = `continuation${scope}take${take}move${index}`
      return { move, name, rule: `@keyframes ${name}{0%{opacity:0}${start - 0.001}%{opacity:0}${start}%{opacity:1}${end - 0.001}%{opacity:1}${end}%{opacity:0}100%{opacity:0}}` }
    })
    return { animations, rules, highlights }
  }, [world?.id, root.fen, scope, take])
  const line = world ? worldMoveLine(world, root.fen) : ''
  const final = world?.lastMove
  const playing = !!world && motion && inView
  const fields = root.fen.split(/\s+/),
    black = fields[1] === 'b',
    first = Number(fields[5]) || 1
  const replay = () => {
    setWorld(pending.current)
    setTake((value) => value + 1)
  }
  return (
    <figure
      ref={figure}
      className="chess-continuation"
      data-motion={playing}
      data-has-line={!!world}
      data-line-id={world?.id}
      style={
        {
          '--continuation-duration': `${timing.duration}ms`,
          '--continuation-cycle': cycle,
          '--continuation-white-fill': `url(#${scope}-white)`,
          '--continuation-black-fill': `url(#${scope}-black)`
        } as CSSProperties
      }>
      <style>
        {rules}
        {highlights.map((highlight) => highlight.rule).join('')}
        {`@keyframes ${cycle}{0%{opacity:0}${(250 / timing.duration) * 100}%{opacity:1}${((timing.duration - timing.fade) / timing.duration) * 100}%{opacity:1}100%{opacity:0}}`}
      </style>
      <figcaption className="chess-continuation-heading">
        <span>{world ? previous ? 'Last searched line' : 'Suggested continuation' : 'Current position'}</span>
        {world && <button type="button" className="chess-continuation-replay" disabled={!motion} onClick={replay} aria-label="Replay suggested continuation">Replay <span aria-hidden="true">↻</span></button>}
      </figcaption>
      <button
        type="button"
        className="chess-continuation-board"
        disabled={!world || !motion}
        onClick={replay}
        aria-label={world ? `${motion ? 'Replay' : 'Position after'} Stockfish’s reported line at depth ${world.depth}: ${line}` : 'Current chess position'}>
        <svg viewBox="0 0 416 416" aria-hidden="true" focusable="false">
          <defs>
            <ChessBoardPrint scope={scope}/>
          </defs>
          <rect x="16" y="16" width="384" height="384" fill="var(--chess-tile-light)" />
          {Array.from({ length: 64 }, (_, index) => (
            <rect
              key={index}
              x={16 + (index % 8) * 48}
              y={16 + Math.floor(index / 8) * 48}
              width="48"
              height="48"
              fill={`url(#${scope}-square-${(Math.floor(index / 8) + (index % 8)) % 2 ? 'dark' : 'light'})`}
            />
          ))}
          <rect className="chess-continuation-edge" x="16" y="16" width="384" height="384" />
          {Array.from({ length: 9 }, (_, index) => (
            <path key={index} className="chess-continuation-grid" d={`M${16 + index * 48} 16V400M16 ${16 + index * 48}H400`} />
          ))}
          {(flipped ? 'hgfedcba' : 'abcdefgh').split('').map((file, index) => (
            <text key={file} className="chess-continuation-axis" x={40 + index * 48} y="414" textAnchor="middle">
              {file}
            </text>
          ))}
          {(flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1]).map((rank, index) => (
            <text key={rank} className="chess-continuation-axis" x="7" y={44 + index * 48} textAnchor="middle">
              {rank}
            </text>
          ))}
          {final &&
            [final.from, final.to].map((square) => (
              <rect key={square} className="chess-continuation-final" transform={flipped ? 'rotate(180 208 208)' : undefined} x={16 + 'abcdefgh'.indexOf(square[0]) * 48} y={16 + (8 - Number(square[1])) * 48} width="48" height="48" />
            ))}
          <g
            key={`${world?.id ?? root.fen}/${take}`}
            className="chess-continuation-plane"
            transform={flipped ? 'rotate(180 208 208)' : undefined}
            onAnimationIteration={(event) => {
              if (event.animationName === cycle && pending.current?.id !== world?.id) setWorld(pending.current)
            }}>
            {highlights.flatMap(({ move, name }, index) =>
              [move.from, move.to].map((square) => (
                <rect
                  key={`${index}${square}`}
                  className="chess-continuation-marker"
                  x={16 + 'abcdefgh'.indexOf(square[0]) * 48}
                  y={16 + (8 - Number(square[1])) * 48}
                  width="48"
                  height="48"
                  style={{ '--continuation-highlight': name } as CSSProperties}
                />
              ))
            )}
            {animations.map(({ track, name, frames }) => {
              const last = frames.at(-1)!
              return (
                <g
                  key={track.id}
                  className="chess-continuation-piece"
                  data-moving={track.moving}
                  data-piece={track.id}
                  style={
                    {
                      transform: `translate(${last.x}px,${last.y}px)`,
                      opacity: last.opacity,
                      '--continuation-animation': name,
                      '--continuation-promoted': last.promoted
                    } as CSSProperties
                  }>
                  <svg width="48" height="48" viewBox="0 0 48 48" overflow="visible"><g transform={flipped ? 'rotate(180 24 24)' : undefined}>
                    <g className="chess-continuation-original">
                      <ChessPiece type={track.initialType} color={track.color} />
                    </g>
                    {track.finalType !== track.initialType && (
                      <g className="chess-continuation-upgraded">
                        <ChessPiece type={track.finalType} color={track.color} />
                      </g>
                    )}
                  </g></svg>
                </g>
              )
            })}
          </g>
        </svg>
      </button>
      {world && (
        <p className="chess-continuation-line" aria-label={line}>
          {highlights.map(({ move, name }, index) => {
            const offset = index + Number(black),
              number = first + Math.floor(offset / 2)
            return (
              <span key={`${index}${move.from}${move.to}`}>
                <span className="chess-continuation-ply-ink" style={{ '--continuation-highlight': name } as CSSProperties} aria-hidden="true" />
                {offset % 2 === 0 ? <small>{number}. </small> : index === 0 ? <small>{number}… </small> : null}
                <b>{move.san}</b>{' '}
              </span>
            )
          })}
          {(world.continues || world.partial) && <span>…</span>}
        </p>
      )}
    </figure>
  )
}

export default function ChessContinuation({ trace, positionFen, motion, flipped }: { trace: SearchTrace | null; positionFen: string; motion: boolean; flipped: boolean }) {
  const candidate = useMemo(() => createChessWorlds(trace).worlds[0] ?? null, [trace])
  const root = useMemo((): WorldFrame => {
    let game: Chess
    try {
      game = new Chess(trace?.fen ?? positionFen)
    } catch {
      game = new Chess(positionFen)
    }
    return {
      fen: game.fen(),
      pieces: game
        .board()
        .flatMap((row) =>
          row.flatMap((piece) => (piece ? [{ id: `${piece.color}${piece.type}@${piece.square}`, square: piece.square, type: piece.type, color: piece.color }] : []))
        )
    }
  }, [trace?.fen, positionFen])
  return <ContinuationBoard key={root.fen} root={root} candidate={candidate} motion={motion} previous={root.fen !== positionFen} flipped={flipped} />
}
