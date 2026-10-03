import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess, gameCaption, pieceNames } from './chess-game'
import type { Color, PieceSymbol, Square } from './vendor/chess.js'
import './chess-interface.css'

export type ChessSceneState = {
  pieces: { square: string; type: PieceSymbol; color: Color }[];
  selected: string | null; legal: string[]; lastMove: string[]; check: string | null; flipped: boolean
}
const symbols = { w: { k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙' }, b: { k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟' } }

export default function ChessGame({ active, onScene, bindInteraction }: { active: boolean; onScene(state: ChessSceneState): void; bindInteraction(handler: ((square: string) => void) | null): void }) {
  const engine = useRef(new Chess())
  const [revision, setRevision] = useState(0)
  const [selected, setSelected] = useState<Square | null>(null)
  const [opponent, setOpponent] = useState<'local'|'computer'>('computer')
  const [thinking, setThinking] = useState(false)
  const [promotion, setPromotion] = useState<{from:Square;to:Square}|null>(null)
  const [flipped, setFlipped] = useState(false)
  const [message, setMessage] = useState('')
  const worker = useRef<Worker|null>(null)
  const request = useRef(0)
  const game = engine.current
  const legal = selected ? game.moves({ square:selected, verbose:true }) : []
  const history = game.history({ verbose:true })
  const last = history.at(-1)
  const pieces = game.board().flat().filter(piece => piece !== null)
  const files = flipped ? 'hgfedcba' : 'abcdefgh'
  const ranks = flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1]
  const movePairs = Array.from({length:Math.ceil(history.length/2)},(_,index)=>({number:index+1,white:history[index*2].san,black:history[index*2+1]?.san??'—'}))
  const update = useCallback(() => { setRevision(value => value+1); setSelected(null); setPromotion(null); setMessage('') }, [])

  useEffect(() => {
    onScene({ pieces, selected, legal:[...new Set(legal.map(move=>move.to))], lastMove:last ? [last.from,last.to] : [], check:game.isCheck() ? pieces.find(piece=>piece.type==='k'&&piece.color===game.turn())?.square??null : null, flipped })
  }, [revision,selected,flipped,onScene])

  const pick = useCallback((square: string) => {
    if (!active || thinking || promotion || game.isGameOver() || opponent==='computer'&&game.turn()==='b') return
    const target = square as Square
    const move = selected ? game.moves({square:selected,verbose:true}).find(candidate=>candidate.to===target) : null
    if (move && selected) {
      if (move.promotion) { setPromotion({from:selected,to:target}); return }
      game.move({from:selected,to:target}); update(); return
    }
    const piece = game.get(target)
    setSelected(piece?.color === game.turn() ? target : null)
  }, [active,thinking,promotion,opponent,selected,revision,update])
  useEffect(() => { bindInteraction(active ? pick : null); return ()=>bindInteraction(null) }, [active,pick,bindInteraction])
  useEffect(() => {
    if (!active || opponent!=='computer' || game.turn()!=='b' || game.isGameOver() || promotion) return
    const id = ++request.current, fen = game.fen()
    const task = new Worker(new URL('./chess-worker.ts',import.meta.url),{type:'module'})
    worker.current=task; setThinking(true)
    task.onmessage=(event:MessageEvent<{id:number;move:{from:Square;to:Square;promotion?:PieceSymbol}|null}>)=>{
      if (id!==request.current || game.fen()!==fen) return
      task.terminate(); worker.current=null; setThinking(false)
      if(event.data.move) { game.move(event.data.move); update() }
      else setMessage('The practice opponent paused. You can switch to two players.')
    }
    task.onerror=()=>{ task.terminate(); worker.current=null; setThinking(false); setMessage('The practice opponent couldn’t respond. You can switch to two players.') }
    task.postMessage({id,fen,depth:2})
    return ()=>{ request.current++; task.terminate(); worker.current=null; setThinking(false) }
  },[active,opponent,revision,promotion,update])
  useEffect(()=>()=>{request.current++;worker.current?.terminate()},[])

  function undo() {
    request.current++; worker.current?.terminate(); worker.current=null; setThinking(false)
    const turn=game.turn(); game.undo()
    if(opponent==='computer' && turn==='w' && game.history().length) game.undo()
    update()
  }
  function downloadGame() {
    const blob=new Blob([game.pgn()],{type:'application/x-chess-pgn'})
    const url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download='personal-objects-chess.pgn'; link.click(); URL.revokeObjectURL(url)
  }
  return <div className="about-chess-game" hidden={!active}>
    <div className="chess-opponent" role="group" aria-label="Chess opponent"><button aria-pressed={opponent==='computer'} onClick={()=>setOpponent('computer')}>Play the computer<span className="mono">You have white</span></button><button aria-pressed={opponent==='local'} onClick={()=>setOpponent('local')}>Two players<span className="mono">Share the board</span></button></div>
    <div className="chess-turn" data-turn={game.turn()}><span aria-hidden="true" className="chess-turn-piece">{game.turn()==='w'?'♔':'♚'}</span><div><span className="mono">{thinking?'Considering the position':`Move ${game.moveNumber()}`}</span><p className="about-chess-status" role="status">{thinking ? 'Black is thinking…' : gameCaption(game)}</p></div></div>
    <p className="about-interaction-note">{promotion ? 'Choose the piece your pawn becomes.' : selected ? `${selected.toUpperCase()} selected. Choose a marked square.` : `Choose a ${game.turn() === 'w' ? 'white' : 'black'} piece, then a marked square.`}</p>
    {promotion && <div className="about-promotion" role="group" aria-label="Promote your pawn">{(['q','r','b','n'] as const).map(type=><button key={type} onClick={()=>{game.move({...promotion,promotion:type});update()}}>{pieceNames[type]}</button>)}</div>}
    {!!selected && !promotion && <div className="about-move-buttons" aria-label="Legal chess moves">{[...new Set(legal.map(move=>move.to))].map(square=><button key={square} aria-label={`Play chess move to ${square.toUpperCase()}`} onClick={()=>pick(square)}>{square.toUpperCase()}</button>)}</div>}
    <div className="chess-game-actions mono"><button onClick={undo} disabled={!history.length}>← Take back</button><button onClick={()=>setFlipped(value=>!value)}>Turn board ↻</button><button onClick={()=>{request.current++;worker.current?.terminate();setThinking(false);game.reset();update()}} disabled={!history.length&&!thinking}>New game</button></div>
    <div className="chess-recent-moves" aria-label="Recent moves"><div className="chess-ledger-heading mono"><span>Moves</span><span>White</span><span>Black</span></div>{movePairs.length?<ol className="about-chess-history mono">{movePairs.slice(-3).map(pair=><li key={pair.number}><span>{pair.number}.</span><span>{pair.white}</span><span>{pair.black}</span></li>)}</ol>:<p className="chess-opening-note">The board is yours.</p>}</div>
    <details className="about-personal-detail about-chess-detail"><summary>Keyboard board & full game<span aria-hidden="true">+</span></summary>
      <div className="about-chess-board" role="group" aria-label="Accessible chess board">{ranks.flatMap(rank=>[...files].map(file=>{
        const square=`${file}${rank}` as Square, piece=game.get(square), available=legal.some(move=>move.to===square)
        return <button key={square} aria-label={`${square.toUpperCase()}${piece ? `, ${piece.color==='w'?'White':'Black'} ${pieceNames[piece.type]}` : ', empty'}`} aria-pressed={selected===square} data-dark={(file.charCodeAt(0)-97+rank-1)%2===0} data-legal={available} data-last={last?.from===square||last?.to===square} onClick={()=>pick(square)} disabled={thinking||!!promotion||game.isGameOver()}><span aria-hidden="true">{piece ? symbols[piece.color][piece.type] : available ? '·' : ''}</span><small aria-hidden="true">{square}</small></button>
      }))}</div>
      <div className="about-play-actions mono"><button onClick={downloadGame} disabled={!history.length}>Save PGN</button></div>
      <ol className="about-chess-history mono">{Array.from({length:Math.ceil(history.length/2)},(_,index)=><li key={index}><span>{index+1}.</span><span>{history[index*2].san}</span><span>{history[index*2+1]?.san??'·'}</span></li>)}</ol>
      {!history.length && <p>No moves yet.</p>}
    </details>
    {message && <p className="about-interaction-note mono" role="status">{message}</p>}
  </div>
}
