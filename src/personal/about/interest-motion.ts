import type { Material, Vector3 } from 'three'

export type InterestView = { yaw: number; pitch: number }

/** Layout and direct input settle independently from the retained idle clock. */
export function settleInterestValue(value: number, goal: number, seconds: number, reduced = false) {
  if (reduced) return goal
  const delta = Math.max(0, Math.min(.1, Number.isFinite(seconds) ? seconds : 0))
  const next = value + (goal - value) * (1 - Math.exp(-delta * 7))
  return Math.abs(next - goal) < .0008 ? goal : next
}

export function settleInterestView(view: InterestView, yaw: number, pitch: number, seconds: number, reduced = false) {
  view.yaw = settleInterestValue(view.yaw, yaw, seconds, reduced)
  view.pitch = settleInterestValue(view.pitch, pitch, seconds, reduced)
  return view.yaw !== yaw || view.pitch !== pitch
}

/** Analytic idle offsets freeze exactly at pause; they never leave an easing tail. */
export function composeInterestView(view: InterestView, index: number, seconds: number, reduced: boolean, output: { x: number; y: number }) {
  output.x = view.pitch
  output.y = view.yaw + (reduced ? 0 : Math.sin(seconds * .32 + index) * .15)
}

/** Write into a retained vector; source pivots and tile coordinates remain owned. */
export function writeKnightDestination(start: Vector3 | undefined, source: Vector3 | undefined, destination: Vector3 | undefined, output: Vector3) {
  if (!start || !source || !destination) return false
  output.set(start.x + destination.x - source.x, start.y + destination.y - source.y, start.z + destination.z - source.z)
  return true
}

/** Board fade ownership needs one isolated clone per original material. */
export function cloneInterestBoardMaterial(source: Material, copies: Map<Material, Material>) {
  let copy = copies.get(source)
  if (!copy) { copy = source.clone(); copy.opacity = 0; copies.set(source, copy) }
  return copy
}
