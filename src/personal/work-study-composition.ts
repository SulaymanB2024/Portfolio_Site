export type StudyScissor = { x: number; y: number; width: number; height: number }

/** Expand a reusable postpass rectangle to cover a model's clipped pixels. */
export function includeStudyScissor(bounds: StudyScissor, x: number, y: number, width: number, height: number) {
  if (width <= 0 || height <= 0) return
  if (bounds.width === 0 || bounds.height === 0) {
    bounds.x = x
    bounds.y = y
    bounds.width = width
    bounds.height = height
    return
  }
  const right = Math.max(bounds.x + bounds.width, x + width)
  const top = Math.max(bounds.y + bounds.height, y + height)
  bounds.x = Math.min(bounds.x, x)
  bounds.y = Math.min(bounds.y, y)
  bounds.width = right - bounds.x
  bounds.height = top - bounds.y
}
