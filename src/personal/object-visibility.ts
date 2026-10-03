/** Initialize a deferred sculpture once it approaches the viewport, retaining it afterward. */
export function waitForObjectView(
  element: Element,
  enter: () => void,
  observe: (callback: IntersectionObserverCallback, options: IntersectionObserverInit) => IntersectionObserver = (callback, options) => new IntersectionObserver(callback, options),
) {
  let stopped = false
  const observer = observe(entries => {
    if (stopped || !entries.some(entry => entry.isIntersecting)) return
    stopped = true
    observer.disconnect()
    enter()
  }, { rootMargin: '120px 0px', threshold: 0 })
  observer.observe(element)
  return () => { stopped = true; observer.disconnect() }
}
