/** Only the latest focus/scroll action may run, including across an unmount. */
export function createLatestFrame(
  request: (callback: FrameRequestCallback) => number = callback => requestAnimationFrame(callback),
  cancel: (id: number) => void = id => cancelAnimationFrame(id),
) {
  let pending: number | null = null
  let revision = 0
  let disposed = false
  function clear() { revision++; if (pending !== null) cancel(pending); pending = null }
  return {
    cancel: clear,
    schedule(action: () => void) {
      clear()
      if (disposed) return
      const ticket = revision
      pending = request(() => {
        if (disposed || ticket !== revision) return
        pending = null
        action()
      })
    },
    dispose() { disposed = true; clear() },
  }
}
