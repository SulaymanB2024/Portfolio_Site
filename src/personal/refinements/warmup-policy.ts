export type WarmIntent = 'hover' | 'focus' | 'activate'
const placedFocus = new WeakSet<EventTarget>()

/** Accessibility focus placement does not imply a chosen route. */
export function focusWithoutWarmup(target: HTMLElement | null) {
  if (!target) return
  placedFocus.add(target)
  try { target.focus() } finally { placedFocus.delete(target) }
}
export function isPlacedFocus(target: EventTarget | null) {
  return target !== null && placedFocus.has(target)
}

export function allowsWarmup(intent: WarmIntent, saveData = false, effectiveType = '') {
  return intent === 'activate' || (!saveData && effectiveType !== 'slow-2g' && effectiveType !== '2g')
}

/** Share in-flight loads, but permit a later user action to retry a failed load. */
export function createWarmCache() {
  const requests = new Map<string, Promise<unknown>>()
  return function warm(key: string, load: () => Promise<unknown>) {
    const existing = requests.get(key)
    if (existing) return existing
    const request = Promise.resolve().then(load).catch(error => { requests.delete(key); throw error })
    requests.set(key, request)
    return request
  }
}
