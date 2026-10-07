export type ChessOrbit = { yaw: number; pitch: number }

/** Unrestricted azimuth; keep the playing surface visible from edge to overhead. */
export function turnChessOrbit(view: ChessOrbit, yaw: number, pitch: number): ChessOrbit {
  return {
    yaw: view.yaw + (Number.isFinite(yaw) ? yaw : 0),
    pitch: Math.max(-.60, Math.min(.86, view.pitch + (Number.isFinite(pitch) ? pitch : 0))),
  }
}

/** Reset/flip through the nearest equivalent angle, even after several full turns. */
export function chessOrbitTarget(target: number, current: number) {
  const circle = Math.PI * 2
  return target + Math.round((current - target) / circle) * circle
}

/** The live board owns both touch axes; gallery objects leave vertical scrolling free. */
export function chessDragIntent(pointerType: string, board: boolean, dx: number, dy: number) {
  return board || pointerType !== 'touch' || Math.abs(dx) > Math.abs(dy) * 1.2 ? 'horizontal' : 'vertical'
}
