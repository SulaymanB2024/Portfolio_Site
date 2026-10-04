type Point = { left: number; top: number }
type Arrival = { entry?: string; point?: Point }
const ENTRY = '__portfolioScrollEntry'

/** Retain history positions without writing history state on every scroll frame. */
export function installRouteScroll(host: Window = window) {
  const positions = new Map<string, Point>()
  const prefix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  let serial = 0
  let paused = false
  let disposed = false
  let frame: number | undefined
  let settle: (() => void) | undefined
  const previousRestoration = host.history.scrollRestoration

  function readEntry() {
    const state = host.history.state
    return state && typeof state[ENTRY] === 'string' ? state[ENTRY] as string : undefined
  }
  function ensureEntry() {
    const existing = readEntry()
    if (existing) return existing
    const state = host.history.state
    // Preserve foreign state rather than changing its type to add our marker.
    if (state !== null && typeof state !== 'object') return undefined
    const entry = `${prefix}-${++serial}`
    try { host.history.replaceState({ ...state, [ENTRY]: entry }, '') } catch { return undefined }
    return entry
  }
  let current = ensureEntry()
  const ownsRestoration = Boolean(current)
  if (ownsRestoration) host.history.scrollRestoration = 'manual'

  function capture() {
    if (disposed || paused || !current) return
    positions.set(current, { left: host.scrollX, top: host.scrollY })
    // A long browsing session must not retain an unlimited position archive.
    if (positions.size > 100) positions.delete(positions.keys().next().value!)
  }
  function cancelFrame() {
    if (frame === undefined) return
    host.cancelAnimationFrame(frame)
    frame = undefined
    settle?.()
    settle = undefined
  }
  function leaving() {
    capture()
    cancelFrame()
    // Native traversal can scroll the old DOM while the destination loads.
    paused = true
  }
  capture()
  host.addEventListener('scroll', capture, { passive: true })
  host.addEventListener('popstate', leaving)

  return {
    begin(): Arrival {
      leaving()
      const entry = ensureEntry()
      return { entry, point: entry ? positions.get(entry) : undefined }
    },
    samePage(arrival: Arrival) {
      cancelFrame()
      current = arrival.entry
      paused = false
      capture()
      // Contents and filter controls own same-page query navigation.
    },
    commit(arrival: Arrival, freshArrival?: () => void) {
      cancelFrame()
      current = arrival.entry
      return new Promise<void>(resolve => {
        settle = resolve
        frame = host.requestAnimationFrame(() => {
          frame = undefined
          settle = undefined
          if (!disposed && (!arrival.entry || readEntry() === arrival.entry)) {
            host.scrollTo({ ...(arrival.point ?? { left: 0, top: 0 }), behavior: 'instant' })
            if (!arrival.point) freshArrival?.()
            paused = false
            capture()
          }
          resolve()
        })
      })
    },
    dispose() {
      capture()
      disposed = true
      cancelFrame()
      host.removeEventListener('scroll', capture)
      host.removeEventListener('popstate', leaving)
      if (ownsRestoration && host.history.scrollRestoration === 'manual') host.history.scrollRestoration = previousRestoration
      positions.clear()
    },
  }
}
