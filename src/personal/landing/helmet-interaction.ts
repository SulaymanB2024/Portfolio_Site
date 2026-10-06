export interface HelmetTurn { yaw: number; pitch: number }
export type HelmetGesture = 'pending' | 'rotate' | 'scroll'

const finite = (value: number) => Number.isFinite(value) ? value : 0
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, finite(value)))

/** A complete turn, with enough tilt to inspect the crown without overturning it. */
export function helmetTurn(turn: HelmetTurn): HelmetTurn {
  return { yaw: clamp(turn.yaw, Math.PI), pitch: clamp(turn.pitch, .48) }
}

/** Lock touch intent once; vertical and diagonal gestures belong to the page. */
export function helmetGesture(dx: number, dy: number): HelmetGesture {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < 8) return 'pending'
  return Math.abs(dx) > Math.abs(dy) * 1.25 ? 'rotate' : 'scroll'
}

export function dragHelmet(start: HelmetTurn, dx: number, dy: number, width: number, touch = false): HelmetTurn {
  const scale = Math.PI / Math.max(180, finite(width))
  return helmetTurn({ yaw: start.yaw + finite(dx) * scale, pitch: start.pitch + (touch ? 0 : finite(dy) * scale * .5) })
}

export function helmetKey(turn: HelmetTurn, key: string): HelmetTurn | null {
  if (key === 'Home' || key === 'Escape') return { yaw: 0, pitch: 0 }
  const yaw = key === 'ArrowLeft' ? -.18 : key === 'ArrowRight' ? .18 : 0
  const pitch = key === 'ArrowUp' ? -.09 : key === 'ArrowDown' ? .09 : 0
  return yaw || pitch ? helmetTurn({ yaw: turn.yaw + yaw, pitch: turn.pitch + pitch }) : null
}

export function settleHelmet(current: HelmetTurn, target: HelmetTurn, seconds: number, direct = false): HelmetTurn {
  const amount = direct ? 1 : -Math.expm1(-Math.max(0, Math.min(.1, finite(seconds))) / .065)
  const settle = (value: number, goal: number) => Math.abs(value - goal) < .0002 ? goal : value + (goal - value) * amount
  return { yaw: settle(current.yaw, target.yaw), pitch: settle(current.pitch, target.pitch) }
}
