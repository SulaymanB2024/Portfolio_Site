import { subscribeSiteTargets } from './site-targets'

const TEXT_ARRIVALS = [
  '.work-collection-intro', '.work-study-copy', '.journal-heading', '.journal-essay-copy',
  '.about-copy', '.interests-grid > div', '.contact-copy', '.site-closing-main > *',
].join(',')

/** Animate text only, once. Never conceal content while waiting for an observer. */
export function installTextArrivals(root: HTMLElement) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  const seen = new WeakSet<Element>()
  const pending = new Set<Element>()
  const animations = new Set<Animation>()
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const element = entry.target as HTMLElement
      observer.unobserve(element)
      pending.delete(element)
      if (preference.matches || document.hidden || document.documentElement.dataset.artTransition === 'running' || ['leaving', 'arriving'].includes(document.documentElement.dataset.navTransition || '') || root.querySelector('[data-project-opening="true"]')) continue
      // Shared renderers use DOM bounds: moving their containers would move the GPU view.
      if (!element.animate || element.closest('.article-page, .hero-copy') || getComputedStyle(element).viewTransitionName !== 'none') continue
      const animation = element.animate([
        { opacity: .62, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 560, easing: 'cubic-bezier(.22, 1, .36, 1)' })
      animations.add(animation)
      void animation.finished.catch(() => {}).finally(() => animations.delete(animation))
    }
  }, { threshold: .12 })
  function scan(scope: Element) {
    for (const element of pending) {
      if (!element.isConnected) { observer.unobserve(element); pending.delete(element) }
    }
    const arrivals = [...scope.querySelectorAll(TEXT_ARRIVALS)]
    if (scope.matches(TEXT_ARRIVALS)) arrivals.unshift(scope)
    arrivals.forEach(element => {
      if (seen.has(element)) return
      seen.add(element)
      // Content already on screen doesn't need to announce itself again.
      if (element.getBoundingClientRect().top <= innerHeight || preference.matches) return
      pending.add(element)
      observer.observe(element)
    })
  }
  function stop() { animations.forEach(animation => animation.cancel()); animations.clear() }
  function changed() { if (preference.matches) { stop(); observer.disconnect(); pending.clear() } }
  function visibility() { if (document.hidden) stop() }
  const mutations = new MutationObserver(function scanAdded(records) {
    for (const record of records) for (const node of record.addedNodes) {
      if (node instanceof HTMLElement && !node.matches('canvas, script, style')) scan(node)
    }
  })
  const unsubscribe = subscribeSiteTargets(root, ({ main, footer }) => {
    mutations.disconnect()
    for (const scope of [main, footer]) if (scope) {
      scan(scope)
      mutations.observe(scope, { childList: true, subtree: true })
    }
  })
  preference.addEventListener('change', changed)
  document.addEventListener('visibilitychange', visibility)
  return () => {
    unsubscribe(); mutations.disconnect(); observer.disconnect(); stop()
    preference.removeEventListener('change', changed)
    document.removeEventListener('visibilitychange', visibility)
  }
}
