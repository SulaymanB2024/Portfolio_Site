/** A resolved import may create a renderer only while its stage is eligible. */
export function createWorkStageReadiness(mount: () => void) {
  let ready = false
  let visible = false
  let disposed = false
  let mounted = false
  function attempt() {
    if (disposed || mounted || !ready || !visible) return
    mounted = true
    mount()
  }
  return {
    ready() { ready = true; attempt() },
    visible(next: boolean) { visible = next; attempt() },
    dispose() { disposed = true },
  }
}
