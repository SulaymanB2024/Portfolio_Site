export type StudyRect = { left: number; top: number; width: number; height: number }

export const STUDY_EXPAND_MS = 560
export const STUDY_DOCK_MS = 480

/** Zero velocity at both ends keeps the two legs of the flight joined smoothly. */
export function studyFlightProgress(elapsed: number, duration: number) {
  const t = Math.max(0, Math.min(1, Number.isFinite(elapsed) ? elapsed / duration : 0))
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/** A restrained dither pulse with no abrupt change at either flight boundary. */
export function studyFlightAccent(progress: number) {
  const t = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
  if (t === 0 || t === 1) return 0
  const wave = Math.sin(t * Math.PI)
  return wave * wave
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
