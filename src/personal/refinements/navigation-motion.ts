import catalog from '../editorial/data/catalog.json'
import { resolveRoute } from '../editorial/routes'
import type { ArticleSummary } from '../editorial/types'
import { navigationMotionPolicy, navInkBounds } from './navigation-policy'
import { subscribeSiteTargets } from './site-targets'

const EASE = 'cubic-bezier(.22, 1, .36, 1)'
type Journey = {
  href: string; sourceHash: string; source: HTMLElement; committed: boolean; entering: boolean
  animations: Set<Animation>; exitTimer: number; recoveryTimer: number; heading?: HTMLElement
  headingAnimation?: Animation; arrivalDone?: boolean
}

export function installNavigationMotion(root: HTMLElement, nav: HTMLElement, marker: HTMLElement) {
  const site = nav.closest<HTMLElement>('.personal-site')!
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  let active: Journey | undefined
  let inkAnimation: Animation | undefined
  let inkTarget: string | undefined
  let disposed = false
  const html = document.documentElement
  site.dataset.navMotionReady = 'true'
  const arrivalObserver = new MutationObserver(() => { if (active) inspect() })

  function anotherJourney() {
    return html.dataset.artTransition === 'running' || Boolean(root.querySelector('[data-project-opening="true"]') || document.querySelector('.project-arrival'))
  }

  function position(link?: HTMLAnchorElement | null, animate = false) {
    link ??= nav.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
    if (!link || nav.getBoundingClientRect().width === 0 || link.getBoundingClientRect().width === 0) {
      inkAnimation?.cancel(); inkTarget = undefined; marker.style.opacity = '0'; return
    }
    const number = link.querySelector<HTMLElement>('.nav-number')
    const bounds = link.getBoundingClientRect()
    const numberBounds = number?.getBoundingClientRect()
    const labelLeft = numberBounds?.width ? numberBounds.right + (parseFloat(getComputedStyle(link).columnGap) || 0) : bounds.left
    const ink = navInkBounds(bounds, nav.getBoundingClientRect(), labelLeft)
    const after = `translate(${ink.x}px, ${ink.y}px) scaleX(${ink.width})`
    // Unrelated DOM updates must not restart or cut short the traveling line.
    if (after === inkTarget) return
    inkTarget = after
    const before = getComputedStyle(marker).transform
    const visible = getComputedStyle(marker).opacity
    inkAnimation?.cancel()
    marker.style.transform = after
    marker.style.opacity = '1'
    if (animate && !preference.matches && marker.animate) {
      inkAnimation = marker.animate([
        { transform: before === 'none' ? after : before, opacity: Number(visible) },
        { transform: after, opacity: 1 },
      ], { duration: 240, easing: EASE })
      void inkAnimation.finished.catch(() => {})
    }
  }

  function finish(journey?: Journey) {
    if (!journey || active !== journey) return
    active = undefined
    arrivalObserver.disconnect()
    window.clearTimeout(journey.exitTimer)
    window.clearTimeout(journey.recoveryTimer)
    journey.animations.forEach(animation => animation.cancel())
    html.dataset.navTransition = 'idle'
    position()
  }

  function animateHeading(journey: Journey, main: HTMLElement) {
    if (journey.heading || preference.matches) return
    const heading = main.querySelector<HTMLElement>('h1')
    if (!heading?.animate) return
    journey.heading = heading
    // Headings move; shared WebGL parents keep their exact bounds.
    const animation = heading.animate([{ transform: 'translateY(3px)' }, { transform: 'translateY(0)' }], { duration: 220, easing: EASE })
    journey.headingAnimation = animation
    journey.animations.add(animation)
    void animation.finished.catch(() => {}).finally(() => {
      journey.animations.delete(animation)
      if (journey.arrivalDone) finish(journey)
    })
  }

  function inspect() {
    if (disposed) return
    const journey = active
    const main = root.querySelector<HTMLElement>('#main-content')
    if (!journey) { position(); return }
    if (!journey.committed && (location.hash !== journey.sourceHash || anotherJourney())) { finish(journey); return }
    // On mobile React closes the menu immediately. Its hidden marker must stop.
    if (nav.getBoundingClientRect().width === 0) position()
    if (!journey.committed || location.hash !== journey.href || !main || main === journey.source) return
    if (journey.entering) { animateHeading(journey, main); return }
    journey.entering = true
    html.dataset.navTransition = 'arriving'
    journey.animations.forEach(animation => animation.cancel())
    journey.animations.clear()
    animateHeading(journey, main)
    const footer = root.querySelector<HTMLElement>('.personal-footer')
    const arrivals = [main, footer].filter((element): element is HTMLElement => Boolean(element?.animate)).map(element => {
      const animation = element.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 180, easing: EASE })
      journey.animations.add(animation)
      return animation.finished.catch(() => {})
    })
    position(undefined, true)
    void Promise.all(arrivals).then(() => {
      journey.arrivalDone = true
      // Suspense may replace its loading message after the page fade completes.
      // Keep listening for the heading until it settles or bounded recovery fires.
      if (journey.headingAnimation?.playState === 'finished') finish(journey)
    })
  }

  function commit(journey: Journey) {
    if (disposed || active !== journey || journey.committed) return
    // A sculpture or history action may begin while this short exit is playing.
    if (location.hash !== journey.sourceHash || anotherJourney()) { finish(journey); return }
    journey.committed = true
    window.clearTimeout(journey.exitTimer)
    location.hash = journey.href
    // A bounded recovery also handles a route that never replaces its main.
    journey.recoveryTimer = window.setTimeout(() => finish(journey), 1100)
  }

  function click(event: MouseEvent) {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.personal-header nav a, .personal-header .identity') : null
    if (!link || !root.contains(link) || !link.hash.startsWith('#/') || link.target === '_blank' || link.hasAttribute('download')) return
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    finish(active)
    const main = root.querySelector<HTMLElement>('#main-content')
    const from = resolveRoute(location.hash, location.pathname, catalog as ArticleSummary[])
    const to = resolveRoute(link.hash, location.pathname, catalog as ArticleSummary[])
    const busy = anotherJourney()
    const policy = navigationMotionPolicy({ button: event.button, metaKey: event.metaKey, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey, defaultPrevented: event.defaultPrevented, reduced: preference.matches || document.hidden, busy, from, to })
    position(link.matches('nav a') ? link : null, true)
    if (policy === 'native' || !main?.animate) return
    event.preventDefault()
    // Leave propagation intact so React closes its mobile menu as usual.
    const journey: Journey = { href: link.hash, sourceHash: location.hash, source: main, committed: false, entering: false, animations: new Set(), exitTimer: 0, recoveryTimer: 0 }
    active = journey
    html.dataset.navTransition = 'leaving'
    html.dataset.navTransitionCount = String(Number(html.dataset.navTransitionCount || 0) + 1)
    // Route immediately; the traveling line and new heading carry the gesture.
    commit(journey)
  }

  function hashChanged() {
    if (active && (!active.committed || location.hash !== active.href)) finish(active)
  }
  function stopMotion() {
    if (!preference.matches && !document.hidden) return
    const journey = active
    if (journey && !journey.committed) commit(journey)
    finish(journey)
    inkAnimation?.cancel()
    position()
  }
  const header = nav.closest<HTMLElement>('.personal-header')!
  const headerObserver = new MutationObserver(function headerChanged() { if (active) inspect(); else position() })
  headerObserver.observe(header, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-current', 'class'] })
  const journeyObserver = new MutationObserver(() => { if (active) inspect() })
  journeyObserver.observe(site, { attributes: true, attributeFilter: ['data-project-opening'] })
  let mountedMain: HTMLElement | null = null
  const unsubscribe = subscribeSiteTargets(root, ({ main }) => {
    if (main === mountedMain) return
    mountedMain = main
    arrivalObserver.disconnect()
    if (active && main) {
      arrivalObserver.observe(main, { childList: true, subtree: true })
      inspect()
    } else position()
  })
  const resize = new ResizeObserver(() => position())
  resize.observe(nav)
  document.addEventListener('click', click, true)
  window.addEventListener('hashchange', hashChanged)
  preference.addEventListener('change', stopMotion)
  document.addEventListener('visibilitychange', stopMotion)
  position()
  return () => {
    disposed = true
    finish(active); inkAnimation?.cancel(); unsubscribe(); arrivalObserver.disconnect(); headerObserver.disconnect(); journeyObserver.disconnect(); resize.disconnect()
    delete site.dataset.navMotionReady
    document.removeEventListener('click', click, true)
    window.removeEventListener('hashchange', hashChanged)
    preference.removeEventListener('change', stopMotion)
    document.removeEventListener('visibilitychange', stopMotion)
  }
}
