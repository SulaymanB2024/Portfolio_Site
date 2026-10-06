import type { InterestId } from './about-content'

const TAN_HALF_FOV = Math.tan(16 * Math.PI / 180)

/** Frame the objects in their actual CSS columns, rather than a fixed world row. */
export function interestFraming(width: number, height: number, stacked: boolean, selected: InterestId | null, boardGame = false) {
  const cameraZ = stacked ? selected === 'score' ? 6.2 : selected === 'bass' ? 7.5 : 8 : 6.5
  const worldHeight = 2 * TAN_HALF_FOV * cameraZ
  const worldWidth = worldHeight * Math.max(1, width) / Math.max(1, height)
  return {
    cameraZ,
    columnSpacing: worldWidth / 3,
    focusX: stacked ? 0 : -worldWidth * .165,
    // The full set sits lower than the single knight used in the gallery.
    focusY: selected === 'knight' && boardGame ? .4 : .04,
    bassScale: stacked ? .91 : .99,
    scoreScale: stacked ? .78 : 1.22,
    knightScale: stacked ? .84 : 1.04,
    // The tilted board projects wider than its square footprint. Reserve a
    // margin inside the model column, including on tall desktop viewports.
    focusedKnightScale: Math.min(stacked ? 1.24 : boardGame ? 1.30 : 1.42, worldWidth * (stacked ? .92 : .58) / 3.15),
  }
}

/** Keep the existing desktop raster ceiling, with a smaller phone/touch surface. */
export function interestPixelRatio(width: number, height: number, ratio: number, touch: boolean) {
  const budget = touch ? 400_000 : 2_200_000
  const native = Math.max(.1, Math.min(ratio || 1, 1.5))
  const divisions = Math.max(1, Math.ceil(Math.sqrt(Math.max(1, width * height) * native * native / budget)))
  return native / divisions
}
