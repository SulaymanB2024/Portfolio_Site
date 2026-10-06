import type { InterestId } from './about/about-content'

export type ContextTransition = {
  shown: InterestId | null
  target: InterestId | null
  phase: 'hold' | 'out' | 'in'
  reveal: number
  from: number
  elapsed: number
}

export function emptyContextTransition(): ContextTransition {
  return { shown: null, target: null, phase: 'hold', reveal: 1, from: 1, elapsed: 0 }
}

/** Only call when the target GLB is decoded. Keep the old object while loading. */
export function changeContextObject(state: ContextTransition, target: InterestId, reduced = false): ContextTransition {
  if (!state.shown || reduced) return { shown: target, target, phase: 'hold', reveal: 1, from: 1, elapsed: 0 }
  if (state.target === target) return state
  return { ...state, target, phase: state.shown === target ? 'in' : 'out', from: state.reveal, elapsed: 0 }
}

/** The outgoing ink clears before the next object is drawn; there is no overlap. */
export function advanceContextTransition(state: ContextTransition, delta: number, reduced = false): ContextTransition {
  if (reduced) return state.target ? changeContextObject(state, state.target, true) : state
  if (state.phase === 'hold' || !Number.isFinite(delta) || delta <= 0) return state
  let next = { ...state }, remaining = Math.min(delta, .1)
  for (let step = 0; step < 2 && next.phase !== 'hold'; step++) {
    const duration = next.phase === 'out' ? .16 * Math.max(next.from, .25) : .24 * Math.max(1 - next.from, .25)
    const consumed = Math.min(remaining, Math.max(0, duration - next.elapsed))
    next.elapsed += consumed; remaining -= consumed
    const t = Math.min(1, next.elapsed / duration), ease = t * t * (3 - 2 * t)
    next.reveal = next.phase === 'out' ? next.from * (1 - ease) : next.from + (1 - next.from) * ease
    if (t < 1) break
    if (next.phase === 'out') next = { ...next, shown: next.target, phase: 'in', reveal: 0, from: 0, elapsed: 0 }
    else next = { ...next, phase: 'hold', reveal: 1, from: 1, elapsed: 0 }
    if (remaining <= 0) break
  }
  return next
}
