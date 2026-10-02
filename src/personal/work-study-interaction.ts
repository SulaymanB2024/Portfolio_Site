export type StudyMoveBounds = { x: number; y: number; worldWidth: number; worldHeight: number }

const finite = (value: number, fallback = 0) => Number.isFinite(value) ? value : fallback
export const boundedStudyInput = (value: number, limit: number) => Math.max(-Math.max(0, finite(limit)), Math.min(Math.max(0, finite(limit)), finite(value)))
export const studyYaw = (value: number) => Math.atan2(Math.sin(finite(value)), Math.cos(finite(value)))

/** Sphere/frustum-plane clearance, including the complete idle/scroll bob range.
 * Offsets use viewport fractions, so a pointer pixel moves a projected pixel.
 */
export function studyMoveBounds(radius: number, distance: number, verticalAngle: number, aspect: number): StudyMoveBounds {
  const r = Math.max(.001, finite(radius, 1))
  const d = Math.max(r, finite(distance, r))
  const angle = Math.max(.01, Math.min(1.4, finite(verticalAngle, .3)))
  const ratio = Math.max(.01, finite(aspect, 1))
  const horizontal = Math.atan(Math.tan(angle) * ratio)
  const worldHeight = 2 * d * Math.tan(angle)
  const worldWidth = worldHeight * ratio
  const xClearance = Math.max(0, (d * Math.sin(horizontal) - r) / Math.cos(horizontal))
  const yClearance = Math.max(0, (d * Math.sin(angle) - r) / Math.cos(angle) - .067)
  return { x: Math.min(.14, xClearance / worldWidth), y: Math.min(.14, yClearance / worldHeight), worldWidth, worldHeight }
}

/** Let the browser claim vertical touch gestures before claiming horizontal drag. */
export function studyTouchIntent(dx: number, dy: number): 'pending' | 'scroll' | 'drag' {
  if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) return 'scroll'
  if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) return 'drag'
  return 'pending'
}
