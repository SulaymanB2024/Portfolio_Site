import type { TextSequence } from './sequence.ts'

/** Settled type uses the display's native text rasterizer. The shader owns
 * partial ink and portal occlusion, including a held title behind the rim. */
export function headingSurface(sequence: TextSequence, portal: boolean): 'native' | 'shader' {
  const active = sequence.states[sequence.active]
  return !portal && active?.reveal === 1 && active.erase === 0
    && sequence.states.every((state, index) => index === sequence.active || state.reveal === 0 || state.erase === 1)
    ? 'native' : 'shader'
}
