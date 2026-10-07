import type { InterestId } from './about-content'

const TAN_HALF_FOV = Math.tan(16 * Math.PI / 180)

/** Fit the authored set's normalized envelope through the actual perspective. */
function fittedChessScale(width: number, height: number, cameraZ: number, focusY: number, yaw: number, pitch: number) {
  const horizontal = TAN_HALF_FOV * Math.max(1,width) / Math.max(1,height) * .92
  const vertical = TAN_HALF_FOV * .92
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
  let scale = Infinity
  // The original GLB and complete playable set share this centered envelope.
  for (const x of [-1.21,1.21]) for (const y of [-.38,.38]) for (const z of [-1.21,1.21]) {
    const rx = x * cy + z * sy, rz = -x * sy + z * cy
    const ry = y * cp - rz * sp, depth = y * sp + rz * cp
    const across = Math.abs(rx) + horizontal * depth
    const above = ry + vertical * depth, below = -ry + vertical * depth
    if (across > 0) scale = Math.min(scale,cameraZ * horizontal / across)
    if (above > 0) scale = Math.min(scale,(cameraZ * vertical - focusY) / above)
    if (below > 0) scale = Math.min(scale,(cameraZ * vertical + focusY) / below)
  }
  return scale
}

/** Frame the objects in their actual CSS columns, rather than a fixed world row. */
export function interestFraming(width: number, height: number, stacked: boolean, selected: InterestId | null, boardGame = false, boardView = { yaw: -.22, pitch: .67 }) {
  const cameraZ = stacked ? selected === 'score' ? 6.2 : selected === 'bass' ? 7.5 : 8 : 6.5
  const worldHeight = 2 * TAN_HALF_FOV * cameraZ
  const worldWidth = worldHeight * Math.max(1, width) / Math.max(1, height)
  return {
    cameraZ,
    columnSpacing: worldWidth / 3,
    focusX: stacked || selected === 'knight' && boardGame ? 0 : -worldWidth * .165,
    // The full set sits lower than the single knight used in the gallery.
    focusY: selected === 'knight' && boardGame ? .4 : .04,
    bassScale: stacked ? .91 : .99,
    scoreScale: stacked ? .78 : 1.22,
    knightScale: stacked ? .84 : 1.04,
    // The tilted board projects wider than its square footprint. Reserve a
    // margin inside the model column, including on tall desktop viewports.
    focusedKnightScale: boardGame && selected === 'knight'
      ? Math.min(1.55, fittedChessScale(width,height,cameraZ,.4,boardView.yaw,boardView.pitch))
      : Math.min(stacked ? 1.24 : 1.42,worldWidth * (stacked ? .92 : .58) / 3.15),
  }
}

/** Keep the existing desktop raster ceiling, with a smaller phone/touch surface. */
export function interestPixelRatio(width: number, height: number, ratio: number, touch: boolean) {
  const budget = touch ? 400_000 : 2_200_000
  const native = Math.max(.1, Math.min(ratio || 1, 1.5))
  const divisions = Math.max(1, Math.ceil(Math.sqrt(Math.max(1, width * height) * native * native / budget)))
  return native / divisions
}
