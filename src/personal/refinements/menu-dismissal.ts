/** A nonmodal menu leaves page input and scrolling to their native targets. */
export function installMenuDismissal(
  header: HTMLElement,
  dismiss: (restoreFocus: boolean) => void,
  host: Document = document,
  compact: MediaQueryList = matchMedia('(max-width: 1000px)'),
) {
  const outside = (event: Event) => {
    if (!header.contains(event.target as Node)) dismiss(false)
  }
  const pointer = (event: PointerEvent) => { if (event.button === 0) outside(event) }
  const key = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented) return
    event.preventDefault()
    dismiss(true)
  }
  const resize = () => { if (!compact.matches) dismiss(false) }
  host.addEventListener('pointerdown', pointer, { capture: true, passive: true })
  host.addEventListener('focusin', outside)
  host.addEventListener('keydown', key)
  compact.addEventListener('change', resize)
  return () => {
    host.removeEventListener('pointerdown', pointer, { capture: true })
    host.removeEventListener('focusin', outside)
    host.removeEventListener('keydown', key)
    compact.removeEventListener('change', resize)
  }
}
