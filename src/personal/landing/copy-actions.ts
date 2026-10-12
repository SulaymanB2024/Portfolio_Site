import type { TextSequence } from './sequence.ts'

/** Keep visible destinations usable throughout the title's reading hold. */
export function copyLinksUsable(sequence: TextSequence, alpha: number) {
  const state = sequence.states[sequence.active]
  return Boolean(state && state.reveal > .999 && state.erase < .001 && alpha > .01)
}
