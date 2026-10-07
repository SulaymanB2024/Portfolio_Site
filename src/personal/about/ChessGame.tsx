import { useCallback, useEffect, useLayoutEffect, useRef, useState, useId, type CSSProperties, type KeyboardEvent } from 'react'
import { Chess, gameCaption, pieceNames } from './chess-game'
import { StockfishEngine, type EngineProgress } from './chess-engine'
import type { Color, Move, PieceSymbol, Square } from './vendor/chess.js'
import ChessPiece from './ChessPiece'
import ChessBoardPrint from './ChessBoardPrint'
import ChessSearch, { type SearchTrace } from './ChessSearch'
import ChessThinking, { ChessReportedLines } from './ChessThinking'
import ChessTelemetry from './ChessTelemetry'
import { appendDepthSample } from './chess-analysis'
import { pieceTravel, travelOffset, type PieceTravel } from './chess-move-feedback'
import { createChessFocus, type ChessFocus } from './chess-focus'
import './chess-interface.css'
import './chess-focus.css'
import './chess-telemetry.css'
import './chess-design.css'

export type ChessSceneState = {
  pieces: { square: string; type: PieceSymbol; color: Color }[];
  selected: string | null; legal: string[]; lastMove: string[]; check: string | null; flipped: boolean; candidate?: { from: string; to: string; depth?: number } | null
}

export type ChessBoardView = '3d' | '2d'

function ChessActionIcon({ kind }: { kind: 'reset' | 'flip' | 'undo' | 'options' | 'expand' | 'collapse' }) {
  const path = { reset: 'M5 10a7 7 0 1 1 0 5M5 4v6h6', flip: 'M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4', undo: 'M9 5 4 10l5 5M4 10h9a6 6 0 0 1 6 6v3', options: 'M4 6h5m4 0h7M9 3v6M4 12h10m4 0h2M14 9v6M4 18h3m4 0h9M7 15v6', expand: 'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5', collapse: 'M4 9h5V4m11 5h-5V4M9 20v-5H4m11 5v-5h5' }[kind]
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={path}/></svg>
}

export default function ChessGame({ active, view, onView, onResetView, onScene, bindInteraction }: { active: boolean; view: ChessBoardView; onView(view: ChessBoardView): void; onResetView(): void; onScene(state: ChessSceneState): void; bindInteraction(handler: ((square: string) => void) | null): void }) {
  const engine = useRef(new Chess())
  const [revision, setRevision] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [opponent, setOpponent] = useState<'local'|'computer'>('computer')
  const [thinking, setThinking] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [progress, setProgress] = useState<EngineProgress | null>(null)
  const [trace, setTrace] = useState<SearchTrace | null>(null)
  const searchTrace = useRef<SearchTrace | null>(null)
  const arrowId = useId().replace(/:/g, '')
  const [thinkTime, setThinkTime] = useState(10_000)
  const [attempt, setAttempt] = useState(0)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [promotion, setPromotion] = useState<{from:Square;to:Square}|null>(null)
  const [flipped, setFlipped] = useState(false)
  const [boardFocus, setBoardFocus] = useState<Square>('e2')
  const [message, setMessage] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const presentation = useRef<ChessFocus | null>(null)
  const gameSurface = useRef<HTMLDivElement>(null)
  const optionsPanel = useRef<HTMLElement>(null)
  const optionsTrigger = useRef<HTMLButtonElement>(null)
  const optionsId = `chess-options-${arrowId}`
  const [travel, setTravel] = useState<PieceTravel[]>([])
  const promotionChoices = useRef<HTMLDivElement>(null)
  const currentView = useRef(view)
  currentView.current = view
  const ledger = useRef<HTMLOListElement>(null)
  const followLedger = useRef(true)
  const boardButtons = useRef(new Map<Square, HTMLButtonElement>())
  const stockfish = useRef<StockfishEngine | null>(null)
  const request = useRef(0)
  const game = engine.current
  const legal = selected ? game.moves({ square:selected, verbose:true }) : []
  const history = game.history({ verbose:true })
  const last = history.at(-1)
  const pieces = game.board().flat().filter(piece => piece !== null)
  const files = flipped ? 'hgfedcba' : 'abcdefgh'
  const ranks = flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1]
  const movePairs = Array.from({length:Math.ceil(history.length/2)},(_,index)=>({number:index+1,white:history[index*2].san,black:history[index*2+1]?.san??'—'}))
  const captures = { w: history.filter(move => move.color === 'w' && move.captured).map(move => move.captured!), b: history.filter(move => move.color === 'b' && move.captured).map(move => move.captured!) }
  const checkedKing = game.isCheck() ? pieces.find(piece => piece.type === 'k' && piece.color === game.turn())?.square : null
  const candidate = thinking && trace?.fen === game.fen() ? trace.latest.pv?.[0] : null
  const locked = thinking || !!promotion || game.isGameOver() || opponent === 'computer' && game.turn() === 'b'
  useEffect(() => {
    const stage = gameSurface.current?.closest<HTMLElement>('.about-object-stage')
    if (!stage) return
    const controller = createChessFocus(stage, setExpanded)
    presentation.current = controller
    return () => { controller.dispose(); presentation.current = null }
  }, [])
  useEffect(() => { if (!active) { setOptionsOpen(false); presentation.current?.close(false) } }, [active])
  useLayoutEffect(() => {
    if (optionsOpen) optionsPanel.current?.querySelector<HTMLButtonElement>('.chess-options-close')?.focus({ preventScroll: true })
  }, [optionsOpen])
  useEffect(() => {
    if (!optionsOpen) return
    const outside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!optionsPanel.current?.contains(target) && !optionsTrigger.current?.contains(target)) setOptionsOpen(false)
    }
    document.addEventListener('pointerdown', outside, true)
    return () => document.removeEventListener('pointerdown', outside, true)
  }, [optionsOpen])
  function closeOptions() { setOptionsOpen(false); optionsTrigger.current?.focus({ preventScroll: true }) }
  function toggleFullscreen(source: HTMLButtonElement) {
    setOptionsOpen(false)
    if (expanded) presentation.current?.close()
    else presentation.current?.enter(source)
  }
  useEffect(() => {
    if (ledger.current && (followLedger.current || !history.length)) ledger.current.scrollTop = ledger.current.scrollHeight
  }, [revision, active])
  const update = useCallback((move?: Move) => { setTravel(move ? pieceTravel(move) : []); setRevision(value => value+1); setSelected(null); setPromotion(null); setMessage('') }, [])
  useEffect(() => {
    if (!travel.length) return
    const timeout = window.setTimeout(() => setTravel([]), 260)
    return () => window.clearTimeout(timeout)
  }, [travel])
  useLayoutEffect(() => { setTravel(current => current.length ? [] : current) }, [view, active, flipped])
  useLayoutEffect(() => {
    if (!promotion || !promotionChoices.current) return
    promotionChoices.current.querySelector('button')?.focus({ preventScroll: true })
    promotionChoices.current.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [promotion])

  useEffect(() => {
    onScene({ pieces, selected, legal:[...new Set(legal.map(move=>move.to))], lastMove:last ? [last.from,last.to] : [], check:game.isCheck() ? pieces.find(piece=>piece.type==='k'&&piece.color===game.turn())?.square??null : null, flipped, candidate: candidate ? {from:candidate.from,to:candidate.to,depth:trace?.latest.depth} : null })
  }, [revision,selected,flipped,view,onScene,candidate?.from,candidate?.to,candidate ? trace?.latest.depth : null])

  const pick = useCallback((square: string) => {
    if (!active || thinking || promotion || game.isGameOver() || opponent==='computer'&&game.turn()==='b') return
    const target = square as Square
    const move = selected ? game.moves({square:selected,verbose:true}).find(candidate=>candidate.to===target) : null
    if (move && selected) {
      if (move.promotion) { setPromotion({from:selected,to:target}); return }
      update(game.move({from:selected,to:target})); return
    }
    if (selected === target) { setSelected(null); return }
    const piece = game.get(target)
    setSelected(piece?.color === game.turn() ? target : null)
  }, [active,thinking,promotion,opponent,selected,revision,update])
  useEffect(() => { bindInteraction(active ? pick : null); return ()=>bindInteraction(null) }, [active,pick,bindInteraction])
  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])
  useEffect(() => {
    if (!active || !visible || opponent!=='computer') { stockfish.current?.release(); if (searchTrace.current && !searchTrace.current.complete) { searchTrace.current = null; setTrace(null) }; return }
    if (game.isGameOver() || promotion) return
    // One bounded opening study supplies real visual data before the first move.
    // It never locks the board or applies its bestmove; a player move cancels it.
    const openingStudy = game.turn() === 'w'
    if (openingStudy && (game.history().length || searchTrace.current?.complete)) return
    const id = ++request.current, fen = game.fen()
    stockfish.current ??= new StockfishEngine({
      url: `${import.meta.env.BASE_URL}engines/stockfish/stockfish-19-single.js`,
      hashMb: window.matchMedia('(max-width: 900px)').matches ? 32 : 128,
    })
    const controller = new AbortController()
    setThinking(!openingStudy); setFinishing(false); setMessage(''); searchTrace.current = null
    void stockfish.current.search({
      moves: game.history({verbose:true}).map(move => `${move.from}${move.to}${move.promotion ?? ''}`),
      fen, milliseconds: openingStudy ? 1_200 : thinkTime, signal: controller.signal,
      onProgress: value => {
        if (id !== request.current) return
        setProgress(value)
        if (value.phase === 'thinking' && value.depth > 0) {
          const next: SearchTrace = { fen, latest: value, samples: appendDepthSample(searchTrace.current?.samples ?? [], value), complete: false }
          searchTrace.current = next; setTrace(next)
        }
      },
    }).then(move => {
      if (id !== request.current || game.fen() !== fen || controller.signal.aborted) return
      const restoreFocus = document.activeElement?.classList.contains('chess-play-now')
      setThinking(false); setFinishing(false); setProgress(null)
      if (openingStudy) {
        if (searchTrace.current) { const complete = {...searchTrace.current, complete: true}; searchTrace.current = complete; setTrace(complete) }
        return
      }
      if (move) {
        const played = game.move(move)
        if (searchTrace.current) { const complete = {...searchTrace.current, complete: true, played: played.san}; searchTrace.current = complete; setTrace(complete) }
        update(played)
        if (restoreFocus) restoreBoardFocus(played.to)
      }
    }).catch((error: Error) => {
      if (id !== request.current || controller.signal.aborted) return
      setThinking(false); setFinishing(false); setProgress(null)
      searchTrace.current = null; setTrace(null); setMessage(error.message)
    })
    return () => { request.current++; controller.abort(); setThinking(false); setFinishing(false); setProgress(null) }
  },[active,visible,opponent,revision,promotion,thinkTime,attempt,update])
  useEffect(()=>()=>{request.current++;stockfish.current?.dispose();stockfish.current=null},[])

  function undo() {
    request.current++; if (thinking) stockfish.current?.release(); setThinking(false); setFinishing(false); setProgress(null)
    searchTrace.current = null; setTrace(null)
    const turn=game.turn(); game.undo()
    if(opponent==='computer' && turn==='w' && game.history().length) game.undo()
    update()
  }
  function newGame() {
    followLedger.current = true
    request.current++; stockfish.current?.newGame(); setThinking(false); setFinishing(false); setProgress(null); game.reset(); searchTrace.current = null; setTrace(null); update()
  }
  function playNow() { if (stockfish.current?.playNow()) setFinishing(true) }
  function downloadGame() {
    const blob=new Blob([game.pgn()],{type:'application/x-chess-pgn'})
    const url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download='personal-objects-chess.pgn'; link.click(); URL.revokeObjectURL(url)
  }
  function restoreBoardFocus(square: Square) {
    if (currentView.current === '2d') boardButtons.current.get(square)?.focus({ preventScroll: true })
    else gameSurface.current?.closest('.about-object-stage')?.querySelector<HTMLCanvasElement>('.about-object-canvas')?.focus({ preventScroll: true })
  }
  function cancelPromotion() {
    if (!promotion) return
    const from = promotion.from
    setPromotion(null); setSelected(null); restoreBoardFocus(from)
  }
  function navigateBoard(event: KeyboardEvent<HTMLButtonElement>, square: Square) {
    if (event.altKey || event.metaKey) return
    const row = ranks.indexOf(Number(square[1])), column = files.indexOf(square[0])
    let nextRow = row, nextColumn = column
    if (event.key === 'Escape' && (selected || promotion)) { event.preventDefault(); event.stopPropagation(); setSelected(null); setPromotion(null); return }
    if (event.key === 'ArrowLeft') nextColumn = Math.max(0, column - 1)
    else if (event.key === 'ArrowRight') nextColumn = Math.min(7, column + 1)
    else if (event.key === 'ArrowUp') nextRow = Math.max(0, row - 1)
    else if (event.key === 'ArrowDown') nextRow = Math.min(7, row + 1)
    else if (event.key === 'Home') { nextColumn = 0; if (event.ctrlKey) nextRow = 0 }
    else if (event.key === 'End') { nextColumn = 7; if (event.ctrlKey) nextRow = 7 }
    else return
    event.preventDefault()
    const next = `${files[nextColumn]}${ranks[nextRow]}` as Square
    setBoardFocus(next)
    boardButtons.current.get(next)?.focus({ preventScroll: true })
  }
  function closeDisclosure(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape') return
    const target = event.target as HTMLElement
    const disclosure = target.closest('details')
    if (!disclosure?.open || !event.currentTarget.contains(disclosure)) return
    event.stopPropagation()
    // Leave native select dismissal to the browser, without leaving the chess page.
    if (target.closest('select')) return
    event.preventDefault()
    disclosure.open = false
    disclosure.querySelector('summary')?.focus({ preventScroll: true })
  }
  const status = thinking ? progress?.phase === 'loading' ? 'Loading Stockfish…' : 'Black is thinking…' : gameCaption(game)
  const boardNotice = game.isGameOver() || game.isCheck() ? gameCaption(game) : null
  const turn = game.isGameOver() ? status : thinking ? status : opponent === 'computer' ? 'Your move.' : `${game.turn() === 'w' ? 'White' : 'Black'} to move.`
  const boardAnnouncement = promotion ? 'Promote your pawn.' : selected ? `${pieceNames[game.get(selected)!.type]} on ${selected.toUpperCase()} selected. Choose a marked square.` : last ? `${last.color === 'b' && opponent === 'computer' ? 'Stockfish' : last.color === 'w' ? 'White' : 'Black'} played ${last.san}. ${turn}` : turn
  const feedbackPrimary = promotion ? 'Promote your pawn' : selected ? `${pieceNames[game.get(selected)!.type].replace(/^\w/,letter=>letter.toUpperCase())} on ${selected.toUpperCase()}` : thinking || game.isGameOver() || game.isCheck() ? status : opponent === 'computer' ? 'Your move' : `${game.turn() === 'w' ? 'White' : 'Black'} to move`
  const feedbackSecondary = promotion ? 'Choose a piece' : selected ? 'Choose a marked square' : game.isGameOver() || game.isCheck() ? '' : last ? `${last.san} · ${last.from.toUpperCase()} → ${last.to.toUpperCase()}` : view === '3d' ? 'Drag to rotate · Click a piece to move' : 'Select a piece, then a marked square'
  function player(color: Color) {
    const isComputer = opponent === 'computer' && color === 'b'
    return <div className="chess-player" data-machine={isComputer} data-active={!game.isGameOver() && game.turn() === color}>
      <span className="chess-player-piece"><ChessPiece color={color} type="k"/></span>
      <div className="chess-player-name"><span>{isComputer ? 'Stockfish 19' : opponent === 'computer' ? 'You' : color === 'w' ? 'White' : 'Black'}</span></div>
      {!!captures[color].length && <span className="chess-player-captures" aria-label={`${color === 'w' ? 'White' : 'Black'} captured ${captures[color].map(type => pieceNames[type]).join(', ')}`}>{captures[color].map((type,index) => <ChessPiece key={index} color={color === 'w' ? 'b' : 'w'} type={type}/>)}</span>}
      <span className="chess-player-state mono"><span>{game.isGameOver() ? '' : game.turn() === color ? thinking ? progress?.phase === 'loading' ? 'Loading' : 'Thinking' : 'To move' : ''}</span></span>
    </div>
  }
  return <div ref={gameSurface} className="about-chess-game chess-focused" data-view={view} data-opponent={opponent} hidden={!active} onKeyDown={event=>{if(event.key === 'Escape' && optionsOpen && !event.defaultPrevented && !(event.target as HTMLElement).closest('select')) {event.preventDefault();event.stopPropagation();closeOptions()}}}>
    <div className="chess-table">
      <div className="chess-board-column">
      <div className="chess-table-top" role="group" aria-label="Game setup">
      <div className="chess-board-toolbar"><div className="chess-view-switch chess-primary-view" role="group" aria-label="Board view"><button aria-label="3D board" aria-pressed={view === '3d'} onClick={()=>onView('3d')}>3D</button><button aria-label="2D board" aria-pressed={view === '2d'} onClick={()=>onView('2d')}>2D</button></div><div className="chess-launch-tools"><button ref={optionsTrigger} aria-label="Board options" aria-expanded={optionsOpen} aria-controls={optionsId} aria-haspopup="dialog" onClick={()=>optionsOpen ? closeOptions() : setOptionsOpen(true)}><ChessActionIcon kind="options"/><span>Options</span></button><button data-chess-fullscreen aria-label={expanded ? 'Exit fullscreen board' : 'Fullscreen board'} aria-pressed={expanded} onClick={event=>toggleFullscreen(event.currentTarget)}><ChessActionIcon kind={expanded ? 'collapse' : 'expand'}/><span>{expanded ? 'Exit fullscreen' : 'Fullscreen'}</span></button></div></div>
      <div className="chess-seat-pair">{player(flipped ? 'b' : 'w')}{player(flipped ? 'w' : 'b')}</div>
      </div>
      <div className="chess-board-surface">
        <div className="chess-flat-board" hidden={view !== '2d'} style={{ '--chess-white-fill': `url(#flat${arrowId}-white)`, '--chess-black-fill': `url(#flat${arrowId}-black)` } as CSSProperties}>
          <svg className="chess-print-defs" aria-hidden="true" focusable="false"><defs><ChessBoardPrint scope={`flat${arrowId}`}/></defs></svg>
          <div className="chess-rank-labels mono" aria-hidden="true">{ranks.map(rank=><span key={rank}>{rank}</span>)}</div>
          <div className="about-chess-board" role="group" aria-label="Accessible chess board" aria-describedby="chess-board-keys"><svg className="chess-flat-print" viewBox="0 0 384 384" aria-hidden="true" focusable="false">{ranks.flatMap((rank,row)=>[...files].map((file,column)=><rect key={`${file}${rank}`} x={column*48} y={row*48} width="48" height="48" fill={`url(#flat${arrowId}-square-${(file.charCodeAt(0)-97+rank-1)%2===0?'dark':'light'})`}/>))}</svg>{ranks.flatMap(rank=>[...files].map(file=>{
            const square=`${file}${rank}` as Square, piece=game.get(square), available=legal.some(move=>move.to===square), moving=travel.find(item=>item.to===square)
            const offset = moving ? travelOffset(moving, flipped) : null
            return <button key={square} ref={node => { if (node) boardButtons.current.set(square,node); else boardButtons.current.delete(square) }} tabIndex={boardFocus === square ? 0 : -1} onFocus={()=>setBoardFocus(square)} onKeyDown={event=>navigateBoard(event,square)} aria-label={`${square.toUpperCase()}${piece ? `, ${piece.color==='w'?'White':'Black'} ${pieceNames[piece.type]}` : ', empty'}${available ? ', legal move' : ''}${last?.to === square ? ', last move' : ''}${checkedKing === square ? ', in check' : ''}`} aria-pressed={selected===square} aria-disabled={locked} data-dark={(file.charCodeAt(0)-97+rank-1)%2===0} data-legal={available} data-last={last?.from===square||last?.to===square} data-check={checkedKing === square} data-travelling={!!moving} onClick={()=>pick(square)}>{piece && <span key={moving ? `move-${revision}` : `${piece.color}${piece.type}`} className="chess-piece-position" data-travelling={!!moving} style={offset ? { '--chess-from-x': `${offset.x}%`, '--chess-from-y': `${offset.y}%` } as CSSProperties : undefined}><ChessPiece color={piece.color} type={piece.type}/></span>}</button>
          }))}{candidate && <svg key={`${candidate.from}${candidate.to}:${trace?.latest.depth}`} className="chess-candidate-arrow" viewBox="0 0 8 8" aria-hidden="true"><defs><marker id={`candidate-${arrowId}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs><circle className="chess-candidate-target" cx={files.indexOf(candidate.to[0])+.5} cy={ranks.indexOf(Number(candidate.to[1]))+.5} r=".34"/><line pathLength="1" x1={files.indexOf(candidate.from[0])+.5} y1={ranks.indexOf(Number(candidate.from[1]))+.5} x2={files.indexOf(candidate.to[0])+.5} y2={ranks.indexOf(Number(candidate.to[1]))+.5} markerEnd={`url(#candidate-${arrowId})`}/></svg>}</div>
          <div className="chess-file-labels mono" aria-hidden="true">{[...files].map(file=><span key={file}>{file}</span>)}</div>
        </div>
      </div>
      {promotion && <div ref={promotionChoices} className="about-promotion chess-promotion-choices" role="group" aria-label="Promote your pawn" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();cancelPromotion()}}}>{(['q','r','b','n'] as const).map(type=><button key={type} aria-label={`Promote to ${pieceNames[type]}`} onClick={()=>{const to=promotion.to;update(game.move({...promotion,promotion:type}));restoreBoardFocus(to)}}><ChessPiece color={game.turn()} type={type}/>{pieceNames[type]}</button>)}<button className="chess-promotion-cancel mono" onClick={cancelPromotion}>Cancel promotion</button></div>}

      <div className="chess-table-tools" data-notice={!!boardNotice}><span className="chess-board-feedback"><strong>{feedbackPrimary}</strong><span>{feedbackSecondary}</span><span className="chess-mobile-notice">{boardNotice}</span></span><span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{boardAnnouncement}</span><div className="chess-board-actions" role="group" aria-label="Game controls">{thinking && <button className="chess-play-now chess-quick-play" onClick={playNow} disabled={progress?.phase !== 'thinking' || finishing}>{finishing ? 'Playing…' : 'Play now'}</button>}{view === '3d' && <button onClick={onResetView} aria-label="Reset view" title="Reset view"><ChessActionIcon kind="reset"/><span>Reset</span></button>}<button onClick={()=>setFlipped(value=>!value)} aria-label="Turn board" title="Turn board"><ChessActionIcon kind="flip"/><span>Flip</span></button><button onClick={undo} disabled={!history.length} aria-label={opponent === 'computer' ? 'Take back your last turn' : 'Take back a move'} title={opponent === 'computer' ? 'Take back your last turn' : 'Take back a move'}><ChessActionIcon kind="undo"/><span>Undo</span></button><button className="chess-new-game" onClick={newGame} disabled={!history.length&&!thinking} aria-label="New game" title="New game"><span>New game</span></button></div></div>
      {!!selected && !promotion && <div className="chess-legal-moves"><span className="mono">{selected.toUpperCase()} →</span><div className="about-move-buttons" aria-label="Legal chess moves">{[...new Set(legal.map(move=>move.to))].map(square=><button key={square} aria-label={`Play chess move to ${square.toUpperCase()}`} onClick={()=>pick(square)}>{square.toUpperCase()}</button>)}</div></div>}
      </div>
      <ChessTelemetry trace={trace} positionFen={game.fen()} flipped={flipped} loading={progress?.phase === 'loading' ? progress.percent : undefined} error={!!message} local={opponent === 'local'}/>
      <aside ref={optionsPanel} id={optionsId} className="chess-sidebar chess-options-panel" role="dialog" aria-label="Chess options" hidden={!optionsOpen} onBlur={event=>{if(event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node) && !optionsTrigger.current?.contains(event.relatedTarget as Node)) setOptionsOpen(false)}}>
        <div className="chess-options-heading"><h2>Board options</h2><button className="chess-options-close" aria-label="Close board options" onClick={closeOptions}>×</button></div>
    <div className="chess-game-panel" onKeyDown={closeDisclosure}>
      <details className="chess-settings" open><summary className="mono">Settings<span aria-hidden="true">+</span></summary><div className="chess-options-setup"><div className="chess-opponent" role="group" aria-label="Chess opponent"><button aria-label="Vs. Stockfish" aria-pressed={opponent==='computer'} onClick={()=>{setMessage('');setOpponent('computer')}}>Stockfish</button><button aria-pressed={opponent==='local'} onClick={()=>{setMessage('');setOpponent('local');searchTrace.current=null;setTrace(null)}}>Two players</button></div></div>{opponent === 'computer' ? <><div className="chess-engine-settings mono"><label htmlFor="chess-think-time">Time per move</label><select id="chess-think-time" value={thinkTime} disabled={thinking} onChange={event=>setThinkTime(Number(event.target.value))}>{[[3000,'3 seconds'],[10000,'10 seconds'],[30000,'30 seconds'],[60000,'1 minute']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div><p>More time lets Stockfish search deeper.</p></> : <p>White moves first.</p>}
        <div className="chess-engine-credit mono"><a href="https://github.com/nmrugg/stockfish.js" target="_blank" rel="noreferrer">Stockfish.js 19 ↗</a><a href={`${import.meta.env.BASE_URL}engines/stockfish/Copying.txt`}>License</a><a href={`${import.meta.env.BASE_URL}engines/stockfish/source/stockfish-19.0.0-source.zip`} download>Source ↓</a></div>
      </details>
      {opponent === 'computer' && <details className="chess-analysis-disclosure" onToggle={event=>setAnalysisOpen(event.currentTarget.open)}><summary className="mono">Analysis<span aria-hidden="true">+</span></summary>{optionsOpen && analysisOpen && <><ChessThinking trace={trace} thinking={thinking} finishing={finishing} thinkTime={thinkTime} onPlayNow={playNow} loading={progress?.phase === 'loading' ? progress.percent : undefined}/><ChessReportedLines trace={trace}/><ChessSearch trace={trace} thinking={thinking} loading={progress?.phase === 'loading' ? progress.percent : undefined}/></>}</details>}
      <details className="chess-record-disclosure" onToggle={event=>{if(event.currentTarget.open && followLedger.current && ledger.current) ledger.current.scrollTop=ledger.current.scrollHeight}}><summary className="mono"><span>Moves</span><span className="chess-disclosure-meta"><span>{history.length ? Math.ceil(history.length / 2) : '—'}<span className="chess-record-last">{last ? ` · ${last.san}` : ''}</span></span><span aria-hidden="true">+</span></span></summary>
      <div className="chess-record" aria-label="Game record">
        <div className="chess-record-title mono"><span>Move history</span><button onClick={downloadGame} disabled={!history.length} aria-label="Download game as PGN">PGN <span aria-hidden="true">↓</span></button></div>
        <div className="chess-ledger-heading mono"><span>No.</span><span>White</span><span>Black</span></div>
        <ol ref={ledger} tabIndex={history.length ? 0 : -1} aria-label="Full move history" className="about-chess-history chess-full-history mono" onScroll={event=>{const el=event.currentTarget;followLedger.current=el.scrollHeight-el.scrollTop-el.clientHeight<40}}>{movePairs.map(pair=><li key={pair.number}><span>{String(pair.number).padStart(2,'0')}</span><span data-latest={last?.color === 'w' && pair.number === movePairs.length}>{pair.white}</span><span data-latest={last?.color === 'b' && pair.number === movePairs.length}>{pair.black}</span></li>)}</ol>

      </div>
      </details>
      <details className="chess-keyboard-help"><summary className="mono">Help<span aria-hidden="true">+</span></summary><p id="chess-board-keys">Select a piece, then a marked square. Drag the 3D board to rotate.</p><p>2D: arrow keys navigate; Enter moves; Escape cancels. 3D: arrows tilt; Home resets.</p><p>Play now asks Stockfish for its best move so far. Undo takes back your turn and its reply. Use Replay beside the suggested continuation to start its line again.</p><p>Positive evaluations favor White; negative ones favor Black. M3 means mate in three; ≥ and ≤ mark search bounds. Depth counts half-moves. Only reported lines appear in the previews.</p></details>
    </div>
      </aside>
    </div>
    {message && <div className="chess-engine-error"><p className="about-interaction-note mono" role="status">{message}</p>{opponent === 'computer' && <button onClick={()=>setAttempt(value=>value+1)}>Retry Stockfish ↻</button>}</div>}

  </div>
}
