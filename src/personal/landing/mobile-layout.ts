export const isStackedLanding = (width: number, height: number) => width <= 700 && height > width

export interface SculptureBounds { x: number; y: number; z: number }

export const LANDING_SCULPTURE_SCALE = 1.33

/** Enlarge the sculpture while retaining clear space below phone titles and links. */
export function mobileSculptureFrame(width: number, height: number, copyTop: number, lineHeight: number, lines: number, linkRows: number, bounds: SculptureBounds, safeBottom = 0) {
  const linksTop = copyTop + lines * lineHeight + 16
  const linkHeight = linkRows * 44 + Math.max(0, linkRows - 1) * 12
  const previousTop = linksTop + linkHeight + 26
  const previousBottom = height - Math.max(60, safeBottom + 44)
  const cameraDepth = 6.1, span = 2 * cameraDepth * Math.tan(16 * Math.PI / 180)
  const focal = height / (2 * Math.tan(16 * Math.PI / 180))
  const previousHeight = Math.max(24, previousBottom - previousTop), previousWidth = width * .88
  const previousY = (.5 - (previousTop + previousHeight / 2) / height) * span
  const previousFitX = previousWidth * cameraDepth / (focal * bounds.x + previousWidth * bounds.z / 2)
  const previousFitY = previousHeight * cameraDepth / (focal * (bounds.y + Math.abs(previousY) * bounds.z / cameraDepth) + previousHeight * bounds.z / 2)
  const enlarged = Math.min(previousFitX, previousFitY) * .9 * LANDING_SCULPTURE_SCALE
  const top = linksTop + linkHeight + 14
  const bottom = height - Math.max(16, safeBottom + 12)
  const availableHeight = Math.max(24, bottom - top), availableWidth = width * .96
  const centerY = top + availableHeight / 2, y = (.5 - centerY / height) * span
  const fitX = availableWidth * cameraDepth / (focal * bounds.x + availableWidth * bounds.z / 2)
  const effectiveHeight = bounds.y + Math.abs(y) * bounds.z / cameraDepth
  const fitY = availableHeight * cameraDepth / (focal * effectiveHeight + availableHeight * bounds.z / 2)
  const scale = Math.min(enlarged, Math.min(fitX, fitY) * .98)
  return { scale, x: 0, y, centerY, top, bottom, availableWidth, availableHeight }
}
