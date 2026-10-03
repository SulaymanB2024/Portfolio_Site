export const isStackedLanding = (width: number, height: number) => width <= 700 && height > width

export interface SculptureBounds { x: number; y: number; z: number }

/** Reserve real space for the title and links, then fit the nearest 3D bounds. */
export function mobileSculptureFrame(width: number, height: number, copyTop: number, lineHeight: number, lines: number, linkRows: number, bounds: SculptureBounds, safeBottom = 0) {
  const top = copyTop + lines * lineHeight + 32
  const linkHeight = linkRows * 44 + Math.max(0, linkRows - 1) * 12
  const bottom = height - Math.max(58, safeBottom + 50) - linkHeight - 24
  const availableHeight = Math.max(24, bottom - top), availableWidth = width * .88
  const cameraDepth = 6.1, span = 2 * cameraDepth * Math.tan(16 * Math.PI / 180)
  const focal = height / (2 * Math.tan(16 * Math.PI / 180))
  const centerY = top + availableHeight / 2, y = (.5 - centerY / height) * span
  const fitX = availableWidth * cameraDepth / (focal * bounds.x + availableWidth * bounds.z / 2)
  const effectiveHeight = bounds.y + Math.abs(y) * bounds.z / cameraDepth
  const fitY = availableHeight * cameraDepth / (focal * effectiveHeight + availableHeight * bounds.z / 2)
  const scale = Math.min(fitX, fitY) * .9
  return { scale, x: 0, y, centerY, top, bottom, availableWidth, availableHeight }
}
