import type { ReaderPosition } from '../editorial/reader-position'

/** Reserve the index plus its 24px gap, with 1px for browser scroll rounding. */
export function projectReaderSection(positions: ReaderPosition[], scroll: number, height: number, indexHeight: number, fallback: string) {
  const line = scroll + Math.max(80, height * 0.16, indexHeight ? indexHeight + 25 : 0)
  let current = fallback
  for (const position of positions) if (position.top <= line) current = position.id
  return current
}
