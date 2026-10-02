export const WORK_STUDY_PIXEL_BUDGET = 1_350_000
export const WORK_STUDY_SETTLE_EPSILON = .0004

function finite(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback
}

export function clampStudy(value: number, lower: number, upper: number) {
  return Math.max(lower, Math.min(upper, finite(value)))
}

/** A fixed total pixel budget keeps large displays from multiplying render cost. */
export function workStudyRenderSize(width: number, height: number, deviceRatio: number) {
  const cssWidth = Math.max(1, Math.floor(finite(width, 1)))
  const cssHeight = Math.max(1, Math.floor(finite(height, 1)))
  const ratio = Math.min(1.25, Math.max(.1, finite(deviceRatio, 1)), Math.sqrt(WORK_STUDY_PIXEL_BUDGET / (cssWidth * cssHeight)))
  const renderWidth = Math.min(WORK_STUDY_PIXEL_BUDGET, Math.max(1, Math.floor(cssWidth * ratio)))
  const renderHeight = Math.min(Math.floor(WORK_STUDY_PIXEL_BUDGET / renderWidth), Math.max(1, Math.floor(cssHeight * ratio)))
  return { width: renderWidth, height: renderHeight, scaleX: renderWidth / cssWidth, scaleY: renderHeight / cssHeight }
}

/** Signed position through the viewport, with no amplification beyond either edge. */
export function workStudyScroll(top: number, height: number, viewportHeight: number) {
  const viewport = Math.max(1, finite(viewportHeight, 1))
  const extent = Math.max(0, finite(height))
  return clampStudy((viewport / 2 - (finite(top) + extent / 2)) / ((viewport + extent) / 2), -1, 1)
}

/** Monotonic settling, bounded after a suspended tab, ending at an exact target. */
export function settleWorkStudy(current: number, target: number, elapsedSeconds: number) {
  const boundedCurrent = clampStudy(current, -1, 1)
  const boundedTarget = clampStudy(target, -1, 1)
  const delta = boundedTarget - boundedCurrent
  if (Math.abs(delta) <= WORK_STUDY_SETTLE_EPSILON) return boundedTarget
  const elapsed = clampStudy(elapsedSeconds, 0, .1)
  const next = boundedCurrent + delta * (1 - Math.exp(-elapsed * 9))
  return Math.abs(boundedTarget - next) <= WORK_STUDY_SETTLE_EPSILON ? boundedTarget : next
}

export type WorkStudyPose = { yaw: number; pitch: number; roll: number; y: number; idleYaw: number }

/** Mutate a retained pose rather than creating objects in the animation loop. */
export function workStudyPose(seconds: number, phase: number, scroll: number, motion: boolean, pose: WorkStudyPose) {
  const time = finite(seconds)
  const offset = finite(phase)
  const track = clampStudy(scroll, -1, 1)
  pose.idleYaw = motion ? Math.sin(time * .43 + offset) * .17 : 0
  pose.yaw = pose.idleYaw + track * .25
  pose.pitch = (motion ? Math.sin(time * .34 + offset * .7) * .05 : 0) + track * .07
  pose.roll = motion ? Math.sin(time * .25 + offset) * .02 : 0
  pose.y = (motion ? Math.sin(time * .48 + offset) * .026 : 0) + track * .04
}
