export type WarmIntent = 'hover' | 'focus' | 'activate'
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
