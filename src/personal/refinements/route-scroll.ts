type Point = { left: number; top: number }
type Arrival = { entry?: string; point?: Point }
const ENTRY = '__portfolioScrollEntry'

/** Retain history positions without writing history state on every scroll frame. */
export function installRouteScroll(host: Window = window, { nativeRestoration = false } = {}) {
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
  // Recruiter documents keep browser restoration for native destinations, but
  // their later chapters still use hash routes and need per-entry positions.
  let current = ensureEntry()
  let currentAddress = host.location?.href
  const ownsRestoration = Boolean(current) && !nativeRestoration
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
  function traversing() {
    leaving()
    // A rejected navigation can restore the source URL in a new history entry.
    // Traversing identical addresses emits popstate without hashchange.
    if (host.location?.href && host.location.href === currentAddress) {
      current = readEntry()
      const point = current ? positions.get(current) : undefined
      if (point) host.scrollTo({ ...point, behavior: 'instant' })
      paused = false
      capture()
    }
  }
  capture()
  host.addEventListener('scroll', capture, { passive: true })
  host.addEventListener('popstate', traversing)

  return {
    begin(): Arrival {
      leaving()
      currentAddress = host.location?.href
      const entry = ensureEntry()
      return { entry, point: entry ? positions.get(entry) : undefined }
    },
    samePage(arrival: Arrival) {
      cancelFrame()
      currentAddress = host.location?.href
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
      host.removeEventListener('popstate', traversing)
      if (ownsRestoration && host.history.scrollRestoration === 'manual') host.history.scrollRestoration = previousRestoration
      positions.clear()
    },
  }
}
