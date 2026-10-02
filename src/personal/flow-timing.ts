export function scrollFlowProgress(stageTop: number, stageHeight: number, viewportHeight: number, reducedMotion = false) {
  if (reducedMotion) return 0
  const travel = Math.max(1, stageHeight - viewportHeight)
  return Math.max(0, Math.min(1, -stageTop / travel))
}

/** Advance through the whole text block, with a small intact lead-in. */
export function textFlowFront(progress: number, height: number) {
  return (Math.max(0, Math.min(1, progress)) * 1.16 - .08) * Math.max(0, height)
}

/** Let the intact hero's controls leave before the drawing dissolves. */
export function heroUiOpacity(progress: number) {
  const t = Math.max(0, Math.min(1, (progress - .04) / .18))
  return 1 - t * t * (3 - 2 * t)
}

/** Frame-rate independent settling; never overshoots during a fast scroll reversal. */
export function settleFlow(current: number, target: number, deltaSeconds: number, reducedMotion = false) {
  const next = current + (target - current) * (reducedMotion ? 1 : 1 - Math.exp(-Math.min(.05, Math.max(0, deltaSeconds)) * 18))
  return Math.abs(target - next) < .0005 ? target : next
}
