export const STUDY_COLLECTION_FRAMING = 1.18
export const STUDY_DETAIL_FRAMING = 1.05
export const STUDY_ARTICULATION_MARGIN = .16
export const STUDY_BOB_MARGIN = .067

const finite = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback

/** Docking begins at the source framing and ends at the exact detail framing. */
export function workStudyFraming(detail: boolean, dockProgress = 1) {
  if (!detail) return STUDY_COLLECTION_FRAMING
  const progress = Math.max(0, Math.min(1, finite(dockProgress, 0)))
  return STUDY_COLLECTION_FRAMING + (STUDY_DETAIL_FRAMING - STUDY_COLLECTION_FRAMING) * progress
}

/** Fit the rotating, articulated sphere to the tighter frustum plane. */
export function workStudyCameraDistance(radius: number, aspect: number, verticalAngle: number, framing: number) {
  const r = Math.max(.001, finite(radius, 1))
  const ratio = Math.max(.01, finite(aspect, 1))
  const angle = Math.max(.01, Math.min(1.4, finite(verticalAngle, .3)))
  const padding = Math.max(STUDY_DETAIL_FRAMING, Math.min(STUDY_COLLECTION_FRAMING, finite(framing, STUDY_COLLECTION_FRAMING)))
  const horizontal = Math.atan(Math.tan(angle) * ratio)
  return ((r + STUDY_ARTICULATION_MARGIN) * padding + STUDY_BOB_MARGIN) / Math.sin(Math.min(angle, horizontal))
}
