import { ARTWORK_INK_POSTERS } from './artwork-ink-posters.generated.ts'
import type { SketchId } from './generative/types'

/** Native alpha avoids CSS reference-filter composition before React mounts. */
export function nativeArtworkPosterSource(sketchId: SketchId) {
  const source = ARTWORK_INK_POSTERS[sketchId]
  if (!source) throw new Error(`Native ink poster is missing: ${sketchId}`)
  return source
}
