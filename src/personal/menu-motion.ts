type Listener = (open: boolean) => void
const listeners = new Set<Listener>()
let navigation: HTMLElement | null = null
let observer: MutationObserver | null = null
let open = false

/** One transient menu boundary; each artwork retains its own playback preference. */
export function subscribeMenuMotion(listener: Listener) {
  const target = document.getElementById('main-navigation')
  if (!target) { listener(false); return () => {} }
  if (target !== navigation) {
    observer?.disconnect()
    navigation = target
    open = target.classList.contains('is-open')
    observer = new MutationObserver(() => {
      const next = target.classList.contains('is-open')
      if (next === open) return
      open = next
      listeners.forEach(notify => notify(open))
    })
    observer.observe(target, { attributes: true, attributeFilter: ['class'] })
  }
  listeners.add(listener)
  listener(open)
  return () => {
    listeners.delete(listener)
    if (!listeners.size) { observer?.disconnect(); observer = null; navigation = null; open = false }
  }
}
