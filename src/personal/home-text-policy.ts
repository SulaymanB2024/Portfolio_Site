/** Preserve every space and punctuation mark while composing native words. */
export function homeTextTokens(text: string) {
  return text.match(/\s+|\S+/gu) || []
}

/** A phrase follows its lead word, but long titles never become a long sequence. */
export function homeWordDelay(index: number) {
  return Math.min(.26, Math.max(0, Number.isFinite(index) ? index : 0) * .035)
}

/** A local, bounded response; words away from the pointer keep their baseline. */
export function homeWordInfluence(x: number, y: number, wordX: number, wordY: number, engagement: number) {
  if (![x, y, wordX, wordY, engagement].every(Number.isFinite)) return 0
  const distance = Math.hypot(x - wordX, (y - wordY) * .7)
  const proximity = Math.max(0, 1 - distance / .75)
  return Math.max(0, Math.min(1, engagement)) * proximity * proximity * (3 - 2 * proximity)
}
