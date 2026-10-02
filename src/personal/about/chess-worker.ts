import { computerMove } from './chess-game'
self.onmessage = (event: MessageEvent<{ id: number; fen: string; depth: number }>) => {
  try { self.postMessage({ id: event.data.id, move: computerMove(event.data.fen, event.data.depth) }) }
  catch { self.postMessage({ id: event.data.id, move: null }) }
}
