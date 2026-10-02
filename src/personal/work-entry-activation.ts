type ActivationClock = { set(callback: () => void, delay: number): number; clear(id: number): void }

export const STUDY_CLICK_DELAY = 520

/** A drag or a second click must never become a queued project navigation. */
export function createStudyActivationGate(clock: ActivationClock = {
  set: (callback, delay) => window.setTimeout(callback, delay),
  clear: id => window.clearTimeout(id),
}) {
  let pending: number | null = null
  let pointer: { id: number; x: number; y: number; touch: boolean } | null = null
  let blocked = false
  function cancel() {
    if (pending !== null) clock.clear(pending)
    pending = null
  }
  return {
    get blocked() { return blocked },
    start(id: number, x: number, y: number, type: string) {
      cancel()
      blocked = false
      pointer = { id, x, y, touch: type === 'touch' }
    },
    move(id: number, x: number, y: number) {
      if (!pointer || pointer.id !== id) return
      const threshold = pointer.touch ? 8 : 2
      if (Math.abs(x - pointer.x) >= threshold || Math.abs(y - pointer.y) >= threshold) blocked = true
    },
    end(id: number, dragging: boolean) {
      if (!pointer || pointer.id !== id) return
      blocked ||= dragging
      pointer = null
    },
    interrupt() { cancel(); pointer = null; blocked = true },
    queue(activate: () => void) {
      cancel()
      if (blocked) return
      pending = clock.set(() => { pending = null; activate() }, STUDY_CLICK_DELAY)
    },
    cancel,
  }
}
