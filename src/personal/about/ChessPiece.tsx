import type { Color, PieceSymbol } from './vendor/chess.js'

// Small, original silhouettes keep the flat board crisp without a font or image download.
export default function ChessPiece({ type, color }: { type: PieceSymbol; color: Color }) {
  return <svg className="chess-piece" data-color={color} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <g strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
      {type === 'p' && <><circle cx="24" cy="13" r="5.5"/><path d="M20 19h8c-1.5 6 .3 10 5 14H15c4.7-4 6.5-8 5-14Z"/><path d="M15 33h18l3 6H12l3-6Z"/></>}
      {type === 'r' && <><path d="M13 8h6v5h4V8h5v5h4V8h5v12H13V8Zm4 12h16l-2 13H19l-2-13ZM15 33h20l2 6H13l2-6Z"/><path d="M17 17h16M20 29h10" fill="none"/></>}
      {type === 'n' && <><path d="m19 9 1-5 6 7c9 4 10 14 9 22H15c0-6 3-11 9-16l-6 2-5 5-5-3 4-9 7-3Z"/><path d="M15 33h20l2 6H12l3-6Z"/><path d="m28 15 3 7-2 8M11 18l4 1" fill="none"/><circle cx="20" cy="13" r="1" className="chess-piece-eye" stroke="none"/></>}
      {type === 'b' && <><circle cx="24" cy="6" r="2"/><path d="M24 9c-4 4-9 8-8 13 .6 3 4 5 8 5s7.4-2 8-5c1-5-4-9-8-13ZM20 27h8l4 6H16l4-6ZM15 33h18l3 6H12l3-6Z"/><path d="m25 13-4 7M19 24h10" fill="none"/></>}
      {type === 'q' && <><path d="m12 13 5 15h14l5-15-8 8-4-11-4 11-8-8ZM17 28h14l2 5H15l2-5ZM15 33h18l3 6H12l3-6Z"/><circle cx="12" cy="11" r="2.5"/><circle cx="24" cy="8" r="2.5"/><circle cx="36" cy="11" r="2.5"/><path d="M19 25h10" fill="none"/></>}
      {type === 'k' && <><path d="M24 4v10M20 8h8" fill="none"/><path d="M24 16c-5-7-13-2-10 5l4 7h12l4-7c3-7-5-12-10-5ZM18 28h12l3 5H15l3-5ZM15 33h18l3 6H12l3-6Z"/><path d="M24 16v9M19 25h10" fill="none"/></>}
    </g>
  </svg>
}
