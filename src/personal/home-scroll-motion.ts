import { homeRevealEase, homeRevealProgress, holdHomeReveal } from './home-scroll-timing'
import { settleFlow } from './flow-timing'
import { installHomePointerMotion } from './home-pointer-motion'
import { installHomeTextMotion } from './home-text-motion'
import './home-scroll-motion.css'

type Reveal = { element: HTMLElement; stagger: number; target: number; current: number }
type Group = { anchor: HTMLElement; reveals: Reveal[]; done: boolean }

/** A short scroll-driven composition, followed by a still reading surface. */
export function installHomeScrollMotion(site: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const groups: Group[] = []
  const owned = new Set<HTMLElement>()
  const active = new Set<Group>()
  const observed = new Map<HTMLElement, Group>()
  let frame = 0, previousTime = 0, frames = 0, disposed = false
  site.dataset.homeScrollMotion = 'true'
  const disposeText = installHomeTextMotion(site)
  const disposePointer = installHomePointerMotion(site)

  function request() {
    if (!disposed && active.size && !frame && !document.hidden && !reduced.matches) frame = requestAnimationFrame(paint)
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; previousTime = 0 }
  function write(reveal: Reveal, value: number) {
    reveal.element.style.setProperty('--home-reveal', homeRevealEase(value).toFixed(4))
  }
  function finish(group: Group) {
    group.done = true
    group.reveals.forEach(reveal => { reveal.current = reveal.target = 1; write(reveal, 1) })
    active.delete(group)
    observer.unobserve(group.anchor)
  }
  function paint(time: number) {
    frame = 0
    if (disposed || document.hidden || reduced.matches) return
    // Stationary anchors are measured before writing. All artwork motion is inside its slot.
    const measurements = [...active].map(group => ({ group, top: group.anchor.getBoundingClientRect().top }))
    const delta = previousTime ? Math.min(.05, (time - previousTime) / 1000) : 1 / 60
    previousTime = time
    let settling = false
    for (const { group, top } of measurements) {
      if (!group.anchor.isConnected) { active.delete(group); observer.unobserve(group.anchor); continue }
      for (const reveal of group.reveals) {
        reveal.target = holdHomeReveal(reveal.target, homeRevealProgress(top, innerHeight, reveal.stagger))
        reveal.current = settleFlow(reveal.current, reveal.target, delta)
        write(reveal, reveal.current)
        if (reveal.current !== reveal.target) settling = true
      }
      if (group.reveals.every(reveal => reveal.current === 1)) finish(group)
    }
    site.dataset.homeScrollFrames = String(++frames)
    site.dataset.homeScrollActive = String(active.size)
    if (settling) request(); else previousTime = 0
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const group = observed.get(entry.target as HTMLElement)
      if (!group || group.done) continue
      if (entry.isIntersecting) active.add(group); else active.delete(group)
    }
    request()
  }, { rootMargin: '80px 0px', threshold: 0 })

  function add(anchor: HTMLElement, parts: [HTMLElement, string, number][]) {
    const fresh = parts.filter(([element]) => !owned.has(element))
    if (!fresh.length) return
    const previous = observed.get(anchor)
    const alreadyReading = previous?.done || anchor.getBoundingClientRect().top < innerHeight * .66
    const reveals = fresh.map(([element, kind, stagger]) => {
      owned.add(element)
      element.dataset.homeReveal = kind
      const value = reduced.matches || alreadyReading ? 1 : 0
      const reveal = { element, stagger, target: value, current: value }
      write(reveal, value)
      return reveal
    })
    if (previous) {
      previous.reveals.push(...reveals)
      if (reduced.matches || alreadyReading) finish(previous)
      return
    }
    const group: Group = { anchor, done: false, reveals }
    groups.push(group)
    observed.set(anchor, group)
    if (reduced.matches || alreadyReading) finish(group); else observer.observe(anchor)
  }
  function scan() {
    const copy = (selector: string, children: string) => site.querySelectorAll<HTMLElement>(selector).forEach(anchor => {
      add(anchor, [...anchor.querySelectorAll<HTMLElement>(children)].map((element, index) => [element, element.matches('h2,h3') ? 'heading' : 'text', index * .075]))
    })
    copy('.work-collection-intro', 'h2,p')
    copy('.work-study-copy', '.work-study-number,.work-study-tags,h2,.work-study-text > p,.work-study-link')
    copy('.work-further a', ':scope > span:first-child')
    copy('.journal-heading', '.journal-kicker,h2')
    copy('.journal-essay-copy', '.journal-category,h3,.journal-deck,.journal-meta')
    site.querySelectorAll<HTMLElement>('.journal-essay').forEach(essay => {
      const anchor = essay.querySelector<HTMLElement>('.journal-essay-copy')
      const read = essay.querySelector<HTMLElement>('.journal-read')
      if (anchor && read) add(anchor, [[read, 'text', .225]])
    })
    site.querySelectorAll<HTMLElement>('.section-tail .arrow-link').forEach(link => add(link, [[link, 'link', 0]]))
    copy('.site-closing', ':scope > .eyebrow')
    copy('.site-closing-main', 'h2,.site-closing-contact > p,.closing-email,.site-closing-contact > .arrow-link')
    copy('.footer-baseline', ':scope > .mono')
    site.querySelectorAll<HTMLElement>('.journal-art').forEach(element => add(element, [[element, 'art', 0]]))
    site.querySelectorAll<HTMLElement>('.work-section-label,.work-study-entry,.journal-heading,.journal-all,.personal-footer').forEach(element => {
      // Journal heading already has a copy group, so observe its stationary parent.
      const anchor = element.matches('.journal-heading') ? element.parentElement! : element
      add(anchor, [[element, element.matches('.journal-heading') ? 'rule-bottom' : 'rule-top', 0]])
    })
    site.querySelectorAll<HTMLElement>('.work-further a').forEach(element => add(element, [[element, 'rule-bottom', 0]]))
  }
  function preference() {
    stop()
    if (reduced.matches) groups.forEach(finish)
    else request()
    site.dataset.homeScrollActive = String(active.size)
    site.dataset.homeScrollReduced = String(reduced.matches)
  }
  function focus(event: FocusEvent) {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const row = target.closest('.work-study-entry,.journal-essay,.site-closing')
    for (const group of groups) if (group.anchor.contains(target) || row?.contains(group.anchor)) finish(group)
  }
  const resize = new ResizeObserver(request)
  resize.observe(site)
  const mutations = new MutationObserver(scan)
  mutations.observe(site, { childList: true, subtree: true })
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request, { passive: true })
  site.addEventListener('focusin', focus)
  const visibility = () => { stop(); if (!document.hidden) request() }
  document.addEventListener('visibilitychange', visibility)
  reduced.addEventListener('change', preference)
  scan(); preference()
  return () => {
    disposed = true; stop(); disposePointer(); disposeText(); observer.disconnect(); resize.disconnect(); mutations.disconnect()
    window.removeEventListener('scroll', request)
    window.removeEventListener('resize', request)
    site.removeEventListener('focusin', focus)
    document.removeEventListener('visibilitychange', visibility)
    reduced.removeEventListener('change', preference)
    owned.forEach(element => { delete element.dataset.homeReveal; element.style.removeProperty('--home-reveal') })
    delete site.dataset.homeScrollMotion; delete site.dataset.homeScrollFrames
    delete site.dataset.homeScrollActive; delete site.dataset.homeScrollReduced
  }
}
