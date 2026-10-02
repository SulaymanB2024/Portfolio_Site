/** Optional local benchmark. The production build eliminates this import. */
export function installFluidityProbe() {
  const originalObserver = window.MutationObserver
  const originalBounds = Element.prototype.getBoundingClientRect
  const originalAll = Element.prototype.querySelectorAll
  const fresh = () => ({ observers: {} as Record<string, number>, headingReads: 0, navReads: 0, rootTextScans: 0 })
  let counts = fresh()
  window.MutationObserver = class extends originalObserver {
    constructor(callback: MutationCallback) {
      const name = callback.name || 'anonymous'
      super((records, observer) => {
        counts.observers[name] = (counts.observers[name] || 0) + 1
        callback(records, observer)
      })
    }
  }
  Element.prototype.getBoundingClientRect = function () {
    if (this.id && this.closest('.reader-prose')) counts.headingReads++
    if (this.id === 'main-navigation' || this.parentElement?.id === 'main-navigation') counts.navReads++
    return originalBounds.call(this)
  }
  Element.prototype.querySelectorAll = function <K extends keyof HTMLElementTagNameMap>(selector: K): NodeListOf<HTMLElementTagNameMap[K]> {
    if (this.id === 'root' && selector.includes('.work-collection-intro')) counts.rootTextScans++
    return originalAll.call(this, selector) as NodeListOf<HTMLElementTagNameMap[K]>
  }
  const controls = document.createElement('div')
  controls.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:9999;display:flex;gap:8px;font:12px sans-serif'
  const reset = document.createElement('button')
  reset.textContent = 'Reset benchmark'
  reset.onclick = () => { counts = fresh(); delete document.documentElement.dataset.fluidityMeasurements }
  const report = document.createElement('button')
  report.textContent = 'Record benchmark'
  report.onclick = () => { document.documentElement.dataset.fluidityMeasurements = JSON.stringify(counts) }
  controls.append(reset, report)
  document.body.append(controls)
  return () => {
    window.MutationObserver = originalObserver
    Element.prototype.getBoundingClientRect = originalBounds
    Element.prototype.querySelectorAll = originalAll
    controls.remove()
    delete document.documentElement.dataset.fluidityMeasurements
  }
}
