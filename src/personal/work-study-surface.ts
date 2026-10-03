/** Keep the cached bitmap in the same scroll ancestry as its sculpture slots. */
export function anchorWorkStudySurface(canvas: HTMLCanvasElement, fixed: boolean, width: number, height: number) {
  const style = canvas.style
  const position = fixed ? 'fixed' : 'absolute'
  if (style.position !== position) style.position = position
  // A route handoff can reparent the canvas before or after changing its root.
  // The actual containing block owns ordinary document positioning.
  const parent = fixed ? null : canvas.offsetParent as HTMLElement | null
  const rect = parent?.getBoundingClientRect()
  const left = rect && parent ? -rect.left - parent.clientLeft + parent.scrollLeft : 0
  const top = rect && parent ? -rect.top - parent.clientTop + parent.scrollTop : 0
  const values = { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }
  for (const key of ['left', 'top', 'width', 'height'] as const) {
    if (style[key] !== values[key]) style[key] = values[key]
  }
}
