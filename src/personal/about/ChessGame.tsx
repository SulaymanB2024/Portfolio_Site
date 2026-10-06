import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Chess, gameCaption, pieceNames } from './chess-game'
import { StockfishEngine, type EngineProgress } from './chess-engine'
import type { Color, Move, PieceSymbol, Square } from './vendor/chess.js'
import ChessPiece from './ChessPiece'
import { pieceTravel, travelOffset, type PieceTravel } from './chess-move-feedback'
import './chess-interface.css'

export type ChessSceneState = {
  pieces: { square: string; type: PieceSymbol; color: Color }[];
  selected: string | null; legal: string[]; lastMove: string[]; check: string | null; flipped: boolean
}

export type ChessBoardView = '3d' | '2d'

export default function ChessGame({ active, view, onView, onResetView, onScene, bindInteraction }: { active: boolean; view: ChessBoardView; onView(view: ChessBoardView): void; onResetView(): void; onScene(state: ChessSceneState): void; bindInteraction(handler: ((square: string) => void) | null): void }) {
  const engine = useRef(new Chess())
  const [revision, setRevision] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [opponent, setOpponent] = useState<'local'|'computer'>('computer')
  const [thinking, setThinking] = useState(false)
  const [progress, setProgress] = useState<EngineProgress | null>(null)
  const [thinkTime, setThinkTime] = useState(10_000)
  const [attempt, setAttempt] = useState(0)
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [promotion, setPromotion] = useState<{from:Square;to:Square}|null>(null)
  const [flipped, setFlipped] = useState(false)
  const [boardFocus, setBoardFocus] = useState<Square>('e2')
  const [message, setMessage] = useState('')
  const [travel, setTravel] = useState<PieceTravel[]>([])
  const promotionChoices = useRef<HTMLDivElement>(null)
  const viewSwitcher = useRef<HTMLDivElement>(null)
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
  const locked = thinking || !!promotion || game.isGameOver() || opponent === 'computer' && game.turn() === 'b'
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
    onScene({ pieces, selected, legal:[...new Set(legal.map(move=>move.to))], lastMove:last ? [last.from,last.to] : [], check:game.isCheck() ? pieces.find(piece=>piece.type==='k'&&piece.color===game.turn())?.square??null : null, flipped })
  }, [revision,selected,flipped,onScene])

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
    if (!active || !visible || opponent!=='computer') { stockfish.current?.release(); return }
    if (game.turn()!=='b' || game.isGameOver() || promotion) return
    const id = ++request.current, fen = game.fen()
    stockfish.current ??= new StockfishEngine({
      url: `${import.meta.env.BASE_URL}engines/stockfish/stockfish-19-single.js`,
      hashMb: window.matchMedia('(max-width: 900px)').matches ? 32 : 128,
    })
    const controller = new AbortController()
    setThinking(true); setMessage('')
    void stockfish.current.search({
      moves: game.history({verbose:true}).map(move => `${move.from}${move.to}${move.promotion ?? ''}`),
      fen, milliseconds: thinkTime, signal: controller.signal,
      onProgress: value => { if (id === request.current) setProgress(value) },
    }).then(move => {
      if (id !== request.current || game.fen() !== fen || controller.signal.aborted) return
      setThinking(false); setProgress(null)
      if (move) update(game.move(move))
    }).catch((error: Error) => {
      if (id !== request.current || controller.signal.aborted) return
      setThinking(false); setProgress(null)
      setMessage(error.message)
    })
    return () => { request.current++; controller.abort(); setThinking(false); setProgress(null) }
  },[active,visible,opponent,revision,promotion,thinkTime,attempt,update])
  useEffect(()=>()=>{request.current++;stockfish.current?.dispose();stockfish.current=null},[])

  function undo() {
    request.current++; if (thinking) stockfish.current?.release(); setThinking(false); setProgress(null)
    const turn=game.turn(); game.undo()
    if(opponent==='computer' && turn==='w' && game.history().length) game.undo()
    update()
  }
  function newGame() {
    followLedger.current = true
    request.current++; stockfish.current?.newGame(); setThinking(false); setProgress(null); game.reset(); update()
  }
  function downloadGame() {
    const blob=new Blob([game.pgn()],{type:'application/x-chess-pgn'})
    const url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download='personal-objects-chess.pgn'; link.click(); URL.revokeObjectURL(url)
  }
  function restoreBoardFocus(square: Square) {
    if (view === '2d') boardButtons.current.get(square)?.focus({ preventScroll: true })
    else viewSwitcher.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.focus({ preventScroll: true })
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
    boardButtons.current.get(next)?.focus()
  }
  const status = thinking ? progress?.phase === 'loading' ? 'Loading Stockfish…' : 'Black is thinking…' : gameCaption(game)
  const instruction = promotion ? 'Choose the piece your pawn becomes.' : game.isGameOver() ? 'Save the game, or begin another.' : thinking ? progress?.phase === 'loading' ? progress.percent === null ? 'Full engine · 99 MB on first use.' : progress.percent >= 1 ? 'Starting the engine…' : `Downloading the engine · ${Math.floor(progress.percent * 100)}%` : progress?.phase === 'thinking' && progress.depth > 0 ? `Depth ${progress.depth} · ${new Intl.NumberFormat('en', {notation:'compact',maximumFractionDigits:1}).format(progress.nodes)} positions searched.` : 'Your reply comes next.' : selected ? `${selected.toUpperCase()} selected. Choose a marked square.` : message && opponent === 'computer' ? 'Retry the engine, or choose two players.' : `Choose a ${game.turn() === 'w' ? 'white' : 'black'} piece, then a marked square.`
  const boardFeedback = promotion ? 'Choose a promotion.' : selected ? `${selected.toUpperCase()} · choose a square` : thinking || game.isGameOver() ? status : last ? `${last.san} · ${last.from.toUpperCase()} → ${last.to.toUpperCase()}` : status
  function player(color: Color) {
    const isComputer = opponent === 'computer' && color === 'b'
    return <div className="chess-player" data-active={!game.isGameOver() && game.turn() === color}>
      <span className="chess-player-piece"><ChessPiece color={color} type="k"/></span>
      <div className="chess-player-name"><span>{isComputer ? 'Stockfish 19' : opponent === 'computer' ? 'You' : color === 'w' ? 'White' : 'Black'}</span><span className="mono">{color === 'w' ? 'White pieces' : 'Black pieces'}</span></div>
      {!!captures[color].length && <span className="chess-player-captures" aria-label={`${color === 'w' ? 'White' : 'Black'} captured ${captures[color].map(type => pieceNames[type]).join(', ')}`}>{captures[color].map((type,index) => <ChessPiece key={index} color={color === 'w' ? 'b' : 'w'} type={type}/>)}</span>}
      <span className="chess-player-state mono">{game.isGameOver() ? 'Game over' : game.turn() === color ? thinking ? progress?.phase === 'loading' ? 'Loading' : 'Thinking' : 'To move' : isComputer ? 'Full strength' : 'Ready'}</span>
    </div>
  }
  return <div className="about-chess-game" data-view={view} hidden={!active}>
    <div className="chess-table">
      <div className="chess-table-heading mono"><span>The board</span><div ref={viewSwitcher} className="chess-view-switch" role="group" aria-label="Board view"><button aria-pressed={view === '3d'} onClick={()=>onView('3d')}>3D board</button><button aria-pressed={view === '2d'} onClick={()=>onView('2d')}>2D board</button></div></div>
      {player(flipped ? 'w' : 'b')}
      <div className="chess-board-surface">
        <div className="chess-flat-board" hidden={view !== '2d'}>
          <div className="chess-rank-labels mono" aria-hidden="true">{ranks.map(rank=><span key={rank}>{rank}</span>)}</div>
          <div className="about-chess-board" role="group" aria-label="Accessible chess board" aria-describedby="chess-board-keys">{ranks.flatMap(rank=>[...files].map(file=>{
            const square=`${file}${rank}` as Square, piece=game.get(square), available=legal.some(move=>move.to===square), moving=travel.find(item=>item.to===square)
            const offset = moving ? travelOffset(moving, flipped) : null
            return <button key={square} ref={node => { if (node) boardButtons.current.set(square,node); else boardButtons.current.delete(square) }} tabIndex={boardFocus === square ? 0 : -1} onFocus={()=>setBoardFocus(square)} onKeyDown={event=>navigateBoard(event,square)} aria-label={`${square.toUpperCase()}${piece ? `, ${piece.color==='w'?'White':'Black'} ${pieceNames[piece.type]}` : ', empty'}${available ? ', legal move' : ''}${last?.to === square ? ', last move' : ''}${checkedKing === square ? ', in check' : ''}`} aria-pressed={selected===square} aria-disabled={locked} data-dark={(file.charCodeAt(0)-97+rank-1)%2===0} data-legal={available} data-last={last?.from===square||last?.to===square} data-check={checkedKing === square} data-travelling={!!moving} onClick={()=>pick(square)}>{piece && <span key={moving ? `move-${revision}` : `${piece.color}${piece.type}`} className="chess-piece-position" data-travelling={!!moving} style={offset ? { '--chess-from-x': `${offset.x}%`, '--chess-from-y': `${offset.y}%` } as CSSProperties : undefined}><ChessPiece color={piece.color} type={piece.type}/></span>}</button>
          }))}</div>
          <div className="chess-file-labels mono" aria-hidden="true">{[...files].map(file=><span key={file}>{file}</span>)}</div>
        </div>
      </div>
      {player(flipped ? 'b' : 'w')}
      {promotion && <div ref={promotionChoices} className="about-promotion chess-promotion-choices" role="group" aria-label="Promote your pawn" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();cancelPromotion()}}}>{(['q','r','b','n'] as const).map(type=><button key={type} aria-label={`Promote to ${pieceNames[type]}`} onClick={()=>{const to=promotion.to;update(game.move({...promotion,promotion:type}));restoreBoardFocus(to)}}><ChessPiece color={game.turn()} type={type}/>{pieceNames[type]}</button>)}<button className="chess-promotion-cancel mono" onClick={cancelPromotion}>Cancel promotion</button></div>}
      <div className="chess-table-tools mono"><span className="chess-board-feedback"><span>{boardFeedback}</span><span>{promotion ? 'Choose a piece above' : view === '3d' ? 'Drag to rotate' : selected ? `Tap ${selected.toUpperCase()} to cancel` : 'Click or tap to move'}</span></span><div>{view === '3d' && <button onClick={onResetView} aria-label="Reset view">Reset view ↺</button>}<button onClick={()=>setFlipped(value=>!value)}>Turn board ↻</button></div></div>
      <details className="chess-keyboard-help"><summary className="mono">Keyboard controls<span aria-hidden="true">+</span></summary><p id="chess-board-keys">On the 2D board, arrow keys reach a square; Enter or Space selects or moves. Escape cancels a selection or promotion. Tab leaves the board. On the 3D board, arrow keys tilt the view; Home resets it.</p></details>
    </div>
    <div className="chess-game-panel">
      <div className="chess-opponent mono" role="group" aria-label="Chess opponent"><button aria-pressed={opponent==='computer'} onClick={()=>{setMessage('');setOpponent('computer')}}>Vs. computer</button><button aria-pressed={opponent==='local'} onClick={()=>{setMessage('');setOpponent('local')}}>Two players</button></div>
      <div className="chess-turn" data-turn={game.turn()} data-thinking={thinking}><span className="mono">{`Move ${String(game.moveNumber()).padStart(2, '0')}`}</span><p className="about-chess-status" role="status">{status}</p></div>
      <div className="chess-move-prompt"><p className="about-interaction-note">{instruction}</p>
        {opponent === 'computer' && <div className="chess-engine-progress" data-loading={progress?.phase === 'loading'} role={progress?.phase === 'loading' ? 'progressbar' : undefined} aria-hidden={progress?.phase !== 'loading'} aria-label="Loading Stockfish" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress?.phase === 'loading' && progress.percent !== null ? Math.floor(progress.percent * 100) : undefined}><span style={{width:`${(progress?.phase === 'loading' ? progress.percent ?? 0 : 0)*100}%`}} /></div>}
        {!!selected && !promotion && <div className="chess-legal-moves"><span className="mono">Move to</span><div className="about-move-buttons" aria-label="Legal chess moves">{[...new Set(legal.map(move=>move.to))].map(square=><button key={square} aria-label={`Play chess move to ${square.toUpperCase()}`} onClick={()=>pick(square)}>{square.toUpperCase()}</button>)}</div></div>}
      </div>
      <div className="chess-game-actions mono"><button onClick={undo} disabled={!history.length}>← Take back</button><button onClick={newGame} disabled={!history.length&&!thinking}>New game ↗</button></div>
      <div className="chess-record" aria-label="Game record">
        <div className="chess-record-title mono"><span>Game record</span><button onClick={downloadGame} disabled={!history.length} aria-label="Download game as PGN">PGN <span aria-hidden="true">↓</span></button></div>
        <div className="chess-ledger-heading mono"><span>No.</span><span>White</span><span>Black</span></div>
        <ol ref={ledger} tabIndex={history.length ? 0 : -1} aria-label="Full move history" className="about-chess-history chess-full-history mono" onScroll={event=>{const el=event.currentTarget;followLedger.current=el.scrollHeight-el.scrollTop-el.clientHeight<40}}>{movePairs.map(pair=><li key={pair.number}><span>{String(pair.number).padStart(2,'0')}</span><span data-latest={last?.color === 'w' && pair.number === movePairs.length}>{pair.white}</span><span data-latest={last?.color === 'b' && pair.number === movePairs.length}>{pair.black}</span></li>)}</ol>
        {!history.length && <p className="chess-opening-note">The first move is yours.</p>}
      </div>
      {message && <div className="chess-engine-error"><p className="about-interaction-note mono" role="status">{message}</p>{opponent === 'computer' && <button onClick={()=>setAttempt(value=>value+1)}>Retry Stockfish ↻</button>}</div>}
      <details className="chess-settings"><summary className="mono">Game settings<span aria-hidden="true">+</span></summary>{opponent === 'computer' ? <><div className="chess-engine-settings mono"><label htmlFor="chess-think-time">Think time</label><select id="chess-think-time" value={thinkTime} disabled={thinking} onChange={event=>setThinkTime(Number(event.target.value))}>{[[3000,'3 seconds'],[10000,'10 seconds'],[30000,'30 seconds'],[60000,'1 minute']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div><p>Stockfish 19 at full strength. More time lets it search deeper.</p></> : <p>Share the board. White moves first.</p>}
        <div className="chess-engine-credit mono"><a href="https://github.com/nmrugg/stockfish.js" target="_blank" rel="noreferrer">Stockfish.js 19 ↗</a><a href={`${import.meta.env.BASE_URL}engines/stockfish/Copying.txt`}>License</a><a href={`${import.meta.env.BASE_URL}engines/stockfish/source/stockfish-19.0.0-source.zip`} download>Source ↓</a></div>
      </details>
    </div>
  </div>
}
