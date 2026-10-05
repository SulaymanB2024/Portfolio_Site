import { LANDING_SCULPTURE_SCALE, type SculptureBounds } from './mobile-layout.ts'

export const LANDING_ART = [
  { rotation: [0, -.12, 0], exposure: -1, turn: 1 },
  { rotation: [.09, -.19, -.04], exposure: .65, turn: 1.4 },
  { rotation: [-.02, .32, -.06], exposure: .70, turn: .6 },
  { rotation: [.06, -.12, 0], exposure: .65, turn: .8 },
  { rotation: [.04, .24, -.02], exposure: .75, turn: 1.2 },
] as const

/** Enlarge the authored framing and keep the silhouette inside the viewport. */
export function desktopSculptureFrame(width: number, height: number, index: number, bounds: SculptureBounds) {
  const centerX = width * .745, centerY = height * .51
  const availableWidth = width * (index === 0 ? .42 : index === 3 ? .385 : .40)
  const availableHeight = height * (index === 0 ? .72 : index === 2 ? .66 : .62)
  const depth = 5.9, focal = height / (2 * Math.tan(16 * Math.PI / 180))
  let x = (centerX - width / 2) * depth / focal, y = (height / 2 - centerY) * depth / focal
  const fitX = availableWidth * depth / (focal * (bounds.x + Math.abs(x) * bounds.z / depth) + availableWidth * bounds.z / 2)
  const fitY = availableHeight * depth / (focal * (bounds.y + Math.abs(y) * bounds.z / depth) + availableHeight * bounds.z / 2)
  const top = Math.min(112, height * .22), bottom = height - 20
  const safeHeight = bottom - top
  const fitHeight = safeHeight * depth / (focal * bounds.y + safeHeight * bounds.z / 2)
  const scale = Math.min(Math.min(fitX, fitY) * .94 * LANDING_SCULPTURE_SCALE, fitHeight * .98)
  const nearest = depth - bounds.z * scale / 2
  // Move a larger silhouette inward rather than cutting off its right edge.
  x = Math.min(x, (width * .98 - width / 2) * nearest / focal - bounds.x * scale / 2)
  y = Math.max((height / 2 - bottom) * nearest / focal + bounds.y * scale / 2,
    Math.min(y, (height / 2 - top) * nearest / focal - bounds.y * scale / 2))
  return { x, y, scale }
}
