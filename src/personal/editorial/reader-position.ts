export type ReaderPosition = { id: string; top: number }

/** Positions are measured on layout changes, then compared without DOM reads. */
export function readerSection(positions: ReaderPosition[], scroll: number, height: number, fallback?: string, arrivalOffset = 0) {
  // A native chapter arrival reserves its scroll margin for the sticky contents.
  // Include one pixel for fractional browser scroll rounding on small screens.
  const threshold = scroll + Math.max(80, height * .16, arrivalOffset + 1)
  let current = fallback
  for (const position of positions) if (position.top <= threshold) current = position.id
  return current
}

export function readerProgress(top: number, height: number, scroll: number, viewport: number) {
  return Math.max(0, Math.min(1, (scroll + viewport * .15 - top) / Math.max(1, height - viewport * .7)))
}
