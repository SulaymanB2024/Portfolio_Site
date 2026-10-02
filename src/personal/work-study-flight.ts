export type StudyRect = { left: number; top: number; width: number; height: number }

export const STUDY_DEPART_MS = 420
export const STUDY_DOCK_MS = 2780

/** One continuous, gently settling movement between the actual artwork slots. */
export function studyFlightProgress(elapsed: number, duration: number) {
  const t = Math.max(0, Math.min(1, Number.isFinite(elapsed) ? elapsed / duration : 0))
  if (t < 1e-12) return 0
  if (t > 1 - 1e-12) return 1
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export function studyFlightRect(from: StudyRect, to: StudyRect, progress: number): StudyRect {
  const t = Math.max(0, Math.min(1, progress))
  return {
    left: from.left + (to.left - from.left) * t,
    top: from.top + (to.top - from.top) * t,
    width: Math.max(1, from.width + (to.width - from.width) * t),
    height: Math.max(1, from.height + (to.height - from.height) * t),
  }
}

/** The ink journey does not restart when the original canvas changes routes. */
export function studyFlightInkProgress(phase: 'depart' | 'hold' | 'dock', elapsed: number) {
  const handoff = STUDY_DEPART_MS / (STUDY_DEPART_MS + STUDY_DOCK_MS)
  if (phase === 'hold') return handoff
  const t = Math.max(0, Math.min(1, Number.isFinite(elapsed) ? elapsed / (phase === 'depart' ? STUDY_DEPART_MS : STUDY_DOCK_MS) : 0))
  return phase === 'depart' ? t * handoff : handoff + t * (1 - handoff)
}

/** Gather the ink, hold its coarse structure, then resolve gently to exact rest. */
export function studyFlightInkStrength(progress: number) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
  return studyFlightProgress(p, .22) * (1 - studyFlightProgress(p - .72, .28))
}

/** Separate ink loss, circulation and return, with motionless exact endpoints. */
export function studyFlightInkMotion(progress: number) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
  const release = studyFlightProgress(p - .12, .30)
  const gather = studyFlightProgress(p - .55, .41)
  const particles = studyFlightProgress(p - .08, .22) * (1 - studyFlightProgress(p - .80, .20))
  const body = 1 - studyFlightProgress(p - .10, .29) * (1 - studyFlightProgress(p - .72, .27))
  const turn = studyFlightProgress(p - .14, .78) * Math.PI * 1.8
  return { release, gather, particles, body, turn }
}
