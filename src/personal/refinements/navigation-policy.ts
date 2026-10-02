export type NavigationActivation = {
  button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean
  defaultPrevented: boolean; reduced: boolean; busy: boolean; from: string; to: string
}

/** Only plain section navigation receives an extra page gesture. */
export function navigationMotionPolicy(input: NavigationActivation): 'native' | 'page' {
  if (input.defaultPrevented || input.button !== 0 || input.metaKey || input.ctrlKey || input.shiftKey || input.altKey || input.reduced || input.busy || input.from === input.to) return 'native'
  // This journey already carries the selected artwork and remembered gallery position.
  if ((input.from === 'writing' && input.to.startsWith('writing/')) || (input.from.startsWith('writing/') && input.to === 'writing')) return 'native'
  return 'page'
}

export function navInkBounds(link: { left: number; right: number; bottom: number }, nav: { left: number; top: number }, labelLeft: number) {
  const left = Math.max(link.left, Math.min(link.right, labelLeft))
  return { x: left - nav.left, y: link.bottom - nav.top - 6, width: Math.max(0, link.right - left) }
}
