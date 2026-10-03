import type { SculptureBounds } from './mobile-layout.ts'

export const LANDING_ART = [
  { rotation: [0, -.12, 0], exposure: -1, turn: 1 },
  { rotation: [.09, -.19, -.04], exposure: .65, turn: 1.4 },
  { rotation: [-.02, .32, -.06], exposure: .70, turn: .6 },
  { rotation: [.06, -.12, 0], exposure: .65, turn: .8 },
  { rotation: [.04, .24, -.02], exposure: .75, turn: 1.2 },
] as const

/** Fit the whole sculpture into its own editorial space, including its depth. */
export function desktopSculptureFrame(width: number, height: number, index: number, bounds: SculptureBounds) {
  if (index === 0) return { x: .95, y: 0, scale: 1.4 }
  const centerX = width * .745, centerY = height * .51
  const availableWidth = width * (index === 3 ? .385 : .40)
  const availableHeight = height * (index === 2 ? .66 : .62)
  const depth = 5.9, focal = height / (2 * Math.tan(16 * Math.PI / 180))
  const x = (centerX - width / 2) * depth / focal, y = (height / 2 - centerY) * depth / focal
  const fitX = availableWidth * depth / (focal * (bounds.x + Math.abs(x) * bounds.z / depth) + availableWidth * bounds.z / 2)
  const fitY = availableHeight * depth / (focal * (bounds.y + Math.abs(y) * bounds.z / depth) + availableHeight * bounds.z / 2)
  return { x, y, scale: Math.min(fitX, fitY) * .94 }
}
