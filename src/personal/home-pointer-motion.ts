import { allowHomePointer, homePointerPose, homePointerRest, homePointerSettled, settleHomePointer, type HomePointerPose } from './home-pointer-policy'
import { homeWordInfluence } from './home-text-policy'
import './home-pointer-motion.css'

const owners = '.journal-essay,.work-study-copy,.work-further a,.section-tail .arrow-link,.hero-copy > .arrow-link,.hero-copy h1,.work-collection-intro h2,.journal-heading h2,.site-closing h2,.site-closing a,.journal-all'
const glyphs = 'span[aria-hidden="true"]'
type Word = { element: HTMLElement; x: number; y: number }
type Response = { owner: HTMLElement; art: HTMLElement | null; glyph: HTMLElement | null; words: Word[]; measured: boolean; current: HomePointerPose; target: HomePointerPose }

/** Cursor response stays inside decorative art and glyphs; native hit areas never move. */
export function installHomePointerMotion(site: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const fine = matchMedia('(hover: hover) and (pointer: fine)')
  const responses = new Map<HTMLElement, Response>()
  const active = new Set<Response>()
  let hovered: Response | undefined, point: { x: number; y: number } | undefined
  let frame = 0, previousTime = 0, frames = 0, dragging = false, disposed = false
  let artPaused = false

  function busy() {
    return site.dataset.projectOpening === 'true' || document.documentElement.dataset.artTransition === 'running' ||
      ['leaving', 'arriving'].includes(document.documentElement.dataset.navTransition || '')
  }
  function focused() { return document.activeElement instanceof HTMLElement && site.contains(document.activeElement) && document.activeElement.matches(':focus-visible') }
  function stop() { cancelAnimationFrame(frame); frame = 0; previousTime = 0 }
  function write(response: Response) {
    const { current } = response
    for (const [element, pose] of [[response.art, artPaused ? homePointerRest : current], [response.glyph, current]] as const) {
      if (!element) continue
      element.style.setProperty('--home-pointer-x', pose.x.toFixed(4))
      element.style.setProperty('--home-pointer-y', pose.y.toFixed(4))
      element.style.setProperty('--home-pointer-engagement', pose.engagement.toFixed(4))
      element.dataset.homePointerActive = String(pose.engagement > 0)
    }
    // Hero glyphs stay still; only their decorative underline responds to proximity.
    const heroFlowing = response.owner.dataset.textFlowActive === 'true'
    response.words = response.words.filter(word => word.element.isConnected && response.owner.contains(word.element))
    response.words.forEach(word => {
      const influence = heroFlowing ? 0 : homeWordInfluence(current.x, current.y, word.x, word.y, current.engagement)
      word.element.style.setProperty('--home-word-influence', influence.toFixed(4))
    })
  }
  function reset() {
    stop(); hovered = undefined; point = undefined; active.clear()
    responses.forEach(response => { response.current = { ...homePointerRest }; response.target = { ...homePointerRest }; write(response) })
    site.dataset.homePointerActive = '0'
  }
  function request() {
    if (!disposed && !frame && active.size && !document.hidden && fine.matches && !reduced.matches && !busy()) frame = requestAnimationFrame(paint)
  }
  function paint(time: number) {
    frame = 0
    if (disposed || document.hidden || reduced.matches || !fine.matches || busy() || dragging || focused() || window.getSelection()?.isCollapsed === false) { reset(); return }
    // One layout read, before all style writes; pointer events only update the desired point.
    if (hovered && point) hovered.target = homePointerPose(point.x, point.y, hovered.owner.getBoundingClientRect())
    const seconds = previousTime ? Math.min(.05, (time - previousTime) / 1000) : 1 / 60
    previousTime = time
    for (const response of active) {
      if (!response.owner.isConnected) { active.delete(response); responses.delete(response.owner); continue }
      response.current = settleHomePointer(response.current, response.target, seconds)
      write(response)
      if (homePointerSettled(response.current, response.target)) active.delete(response)
    }
    site.dataset.homePointerFrames = String(++frames)
    site.dataset.homePointerActive = String(active.size)
    if (active.size) request(); else previousTime = 0
  }
  function leave() {
    if (hovered) { hovered.target = { ...homePointerRest }; active.add(hovered) }
    hovered = undefined; point = undefined; request()
  }
  function measure(response: Response) {
    const box = response.owner.getBoundingClientRect()
    // Cache native word centers on entry/reflow, never measure words on animation frames.
    response.words.forEach(word => {
      const rect = word.element.getBoundingClientRect()
      const translate = getComputedStyle(word.element).translate.split(' ')
      const rise = translate.length > 1 ? Number.parseFloat(translate[1]) || 0 : 0
      word.x = box.width ? (rect.left + rect.width / 2 - box.left) / box.width * 2 - 1 : 0
      word.y = box.height ? (rect.top + rect.height / 2 - rise - box.top) / box.height * 2 - 1 : 0
    })
    response.measured = true
  }
  function move(event: PointerEvent) {
    if (!event.isPrimary) { reset(); return }
    if (!allowHomePointer({ fine: fine.matches, reduced: reduced.matches, hidden: document.hidden, busy: busy(), dragging, focused: focused(),
      pointerType: event.pointerType, buttons: event.buttons, selection: window.getSelection()?.isCollapsed === false })) { reset(); return }
    const owner = event.target instanceof Element ? event.target.closest<HTMLElement>(owners) : null
    if (!owner || !site.contains(owner)) { leave(); return }
    if (hovered?.owner !== owner) {
      leave()
      let response = responses.get(owner)
      if (!response) {
        const art = owner.querySelector<HTMLElement>('.journal-art > .animated-artwork')
        const glyph = owner.querySelector<HTMLElement>(glyphs)
        const words = [...owner.querySelectorAll<HTMLElement>('.home-text-word')].map(element => ({ element, x: 0, y: 0 }))
        if (!art && !glyph && !words.length) return
        if (art) art.dataset.homePointerPart = 'art'
        if (glyph) glyph.dataset.homePointerPart = 'glyph'
        response = { owner, art, glyph, words, measured: false, current: { ...homePointerRest }, target: { ...homePointerRest } }
        responses.set(owner, response)
      }
      if (!response.measured) measure(response)
      hovered = response
    }
    point = { x: event.clientX, y: event.clientY }
    active.add(hovered!); request()
  }
  function changed() {
    artPaused = !!site.querySelector('.artwork-motion-control[aria-pressed="false"]')
    site.dataset.homePointerArtworkPaused = String(artPaused)
    site.dataset.homePointerMotion = String(fine.matches && !reduced.matches)
    if (artPaused || reduced.matches || !fine.matches || busy()) reset()
  }
  const down = () => { dragging = true; reset() }
  const up = () => { dragging = false }
  const blur = () => { dragging = false; reset() }
  const reflow = () => { reset(); responses.forEach(response => { response.measured = false }) }
  const selection = () => { if (window.getSelection()?.isCollapsed === false) reset() }
  const out = (event: PointerEvent) => { if (hovered && (!(event.relatedTarget instanceof Node) || !hovered.owner.contains(event.relatedTarget))) leave() }
  const mutation = new MutationObserver(changed)
  mutation.observe(site, { attributes: true, subtree: true, attributeFilter: ['aria-pressed', 'data-project-opening'] })
  const navigation = new MutationObserver(changed)
  navigation.observe(document.documentElement, { attributes: true, attributeFilter: ['data-art-transition', 'data-nav-transition'] })
  site.addEventListener('pointermove', move, { passive: true })
  site.addEventListener('pointerout', out, { passive: true })
  site.addEventListener('pointerdown', down, { passive: true, capture: true })
  site.addEventListener('focusin', reset)
  window.addEventListener('pointerup', up, { passive: true })
  window.addEventListener('pointercancel', blur, { passive: true })
  window.addEventListener('scroll', reflow, { passive: true })
  window.addEventListener('resize', reflow, { passive: true })
  window.addEventListener('blur', blur)
  document.addEventListener('visibilitychange', blur)
  document.addEventListener('selectionchange', selection)
  reduced.addEventListener('change', changed); fine.addEventListener('change', changed)
  document.fonts.addEventListener('loadingdone', reflow)
  changed()
  return () => {
    disposed = true; reset(); mutation.disconnect(); navigation.disconnect()
    site.removeEventListener('pointermove', move); site.removeEventListener('pointerout', out)
    site.removeEventListener('pointerdown', down, true); site.removeEventListener('focusin', reset)
    window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', blur)
    window.removeEventListener('scroll', reflow); window.removeEventListener('resize', reflow)
    window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', blur)
    document.removeEventListener('selectionchange', selection)
    reduced.removeEventListener('change', changed); fine.removeEventListener('change', changed)
    document.fonts.removeEventListener('loadingdone', reflow)
    responses.forEach(response => { for (const element of [response.art, response.glyph]) if (element) {
      delete element.dataset.homePointerPart; delete element.dataset.homePointerActive
      for (const property of ['--home-pointer-x', '--home-pointer-y', '--home-pointer-engagement']) element.style.removeProperty(property)
    } })
    responses.forEach(response => response.words.forEach(word => word.element.style.removeProperty('--home-word-influence')))
    for (const key of ['homePointerMotion', 'homePointerFrames', 'homePointerActive', 'homePointerArtworkPaused']) delete site.dataset[key]
  }
}
