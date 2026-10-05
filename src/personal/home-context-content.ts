import type { InterestId } from './about/about-content'

export const contextInterests: { id: InterestId; label: string; description: string; action: string }[] = [
  { id: 'bass', label: 'Double bass', description: 'I compose and play double bass, with performances at UT Austin and Texas All-State.', action: 'Explore the music' },
  { id: 'score', label: 'Composition', description: 'Write a phrase, hear it, and put it on paper.', action: 'Open the writing desk' },
  { id: 'knight', label: 'Chess & puzzles', description: 'I solved Jane Street’s July 2026 knight puzzle. There are puzzles and a full chess game to explore here.', action: 'Make a move' },
]
