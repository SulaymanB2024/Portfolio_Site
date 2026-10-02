const clamp = (value: number) => Math.max(0, Math.min(1, value))

/** Keep the opening alive until the next section reaches the lower reading band. */
export function homeHeroProgress(top: number, height: number, viewport: number, reduced = false) {
  if (reduced) return 0
  return clamp(-top / Math.max(1, height - viewport * .35))
}

/** Finish above the lower reading band; later lines follow by a few scroll pixels. */
export function homeRevealProgress(top: number, viewport: number, stagger = 0) {
  if (!Number.isFinite(top) || !Number.isFinite(viewport) || viewport <= 0) return 1
  return clamp((viewport * .98 - top) / (viewport * .32) - stagger)
}

/** Once read, content stays fully composed when scrolling back. */
export function holdHomeReveal(previous: number, next: number) {
  return Math.max(clamp(previous), clamp(next))
}

export function homeRevealEase(progress: number) {
  const p = clamp(progress)
  return 1 - (1 - p) ** 3
}
