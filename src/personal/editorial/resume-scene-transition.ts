export const RESUME_DISSOLVE_MS = 2300

/** Finish the visible dissolve, then take the latest loaded selection. */
export function createResumeTransition<Key>(initial: Key, initialReady = true) {
  let current = initial, desired = initial, from = initial, to = initial
  let progress = 1, revision = 0, available = true
  let booted = initialReady, initialMissing = false
  function begin(reduced: boolean) {
    if (!booted || !available || progress < 1 || Object.is(current, desired)) return
    from = current; to = desired; progress = reduced || initialMissing ? 1 : 0
    initialMissing = false
    if (progress === 1) current = to
  }
  return {
    request(key: Key) { desired = key; available = Object.is(key, current); return ++revision },
    ready(ticket: number, reduced = false) {
      if (ticket !== revision) return false
      available = true; begin(reduced); return true
    },
    boot(painted: boolean, reduced = false) { booted = true; initialMissing = !painted; begin(reduced) },
    advance(visibleDeltaMs: number, reduced = false) {
      if (progress < 1) {
        const elapsed = Number.isFinite(visibleDeltaMs) ? Math.max(0, visibleDeltaMs) : 0
        progress = reduced ? 1 : Math.min(1, progress + elapsed / RESUME_DISSOLVE_MS)
        if (progress === 1) current = to
      }
      begin(reduced)
      return { from, to, progress, current, desired, waiting: !available, moving: progress < 1 }
    },
  }
}
