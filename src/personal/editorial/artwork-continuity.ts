import type { GenerativeArtwork } from './generative/types'
import { artworkPlayers } from './artwork-players'

export const artworkTransitionName = (artwork: GenerativeArtwork) => `article-${artwork.sketchId}`
export function galleryArticleJourney(from: string, to: string) {
  return (from === 'writing' && to.startsWith('writing/')) || (from.startsWith('writing/') && to === 'writing')
}
export type ArtworkTransition = { ready: Promise<void>; finished: Promise<void>; skipTransition: () => void }
const preparationTimeout = 4000
const duration = 520
const easing = 'cubic-bezier(.24,.76,.2,1)'
const findArtwork = (name: string) => [...document.querySelectorAll<HTMLElement>('.animated-artwork')]
  .find(element => element.dataset.artworkKey === name)

/** A live drawing leads the move; paper and navigation never disappear beneath it. */
export function startArtworkTransition(name: string, update: () => void | Promise<void>): ArtworkTransition {
  const source = findArtwork(name)
  const before = source?.getBoundingClientRect()
  if (!source || !before || before.bottom <= 0 || before.top >= innerHeight || before.right <= 0 ||
      before.left >= innerWidth || before.width === 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ready = Promise.resolve().then(update)
    return { ready, finished: ready, skipTransition() {} }
  }
  const origin = source
  const started = performance.now()
  const player = artworkPlayers.get(name)
  const handoff = player?.status.painted && !player.status.failed ? artworkPlayers.lift(name) : undefined
  const drawing = source.cloneNode(true) as HTMLElement
  drawing.style.viewTransitionName = 'none'
  drawing.style.opacity = '1'
  drawing.removeAttribute('data-artwork-key')
  const drawingHost = drawing.querySelector<HTMLElement>('.animated-artwork-canvas')!
  drawingHost.replaceChildren()
  if (handoff) handoff.player.moveTo(drawingHost)
  else drawing.dataset.artState = 'poster'
  const unsubscribe = handoff?.player.subscribe(status => {
    drawing.dataset.frames = String(status.stats.frames)
    drawing.dataset.player = String(status.id)
    drawing.dataset.artState = status.failed ? 'fallback' : status.painted ? 'running' : 'poster'
  })
  const overlay = document.createElement('div')
  overlay.className = 'artwork-travel'
  overlay.setAttribute('aria-hidden', 'true'); overlay.inert = true
  overlay.append(drawing)
  const sourceOpacity = source.style.opacity
  source.style.opacity = '0'
  let destination: HTMLElement | undefined
  let destinationOpacity = ''
  let cancelled = false, cleaned = false
  let preparationTimer: ReturnType<typeof setTimeout> | undefined
  let travel: Animation | undefined
  const animations: Animation[] = []
  const place = (rect: DOMRect) => Object.assign(overlay.style, {
    left: `${rect.left + rect.width / 2}px`, top: `${rect.top + rect.height / 2}px`,
    width: `${rect.width}px`, height: `${rect.height}px`, transform: 'translate(-50%, -50%)',
  })
  place(before)
  document.body.append(overlay)
  // A cold article still responds on the first frame, while its data is prepared.
  const lift = overlay.animate([
    { transform: 'translate(-50%, -50%) scale(1)' },
    { transform: 'translate(-50%, calc(-50% - 4px)) scale(1.015)' },
  ], { duration: 100, easing, fill: 'forwards' })
  animations.push(lift); void lift.finished.catch(() => {})
  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  function clean() {
    if (cleaned) return
    cleaned = true
    if (preparationTimer !== undefined) clearTimeout(preparationTimer)
    preparationTimer = undefined
    animations.forEach(animation => animation.cancel())
    handoff?.finish()
    unsubscribe?.()
    if (destination) destination.style.opacity = destinationOpacity
    origin.style.opacity = sourceOpacity
    overlay.remove()
    window.removeEventListener('resize', skip)
    document.removeEventListener('wheel', skip)
    document.removeEventListener('touchstart', skip)
    document.removeEventListener('visibilitychange', visibility)
    window.removeEventListener('keydown', key)
    preference.removeEventListener('change', reduced)
  }
  function skip() { cancelled = true; clean() }
  function visibility() { if (document.hidden) skip() }
  function reduced() { if (preference.matches) skip() }
  function key(event: KeyboardEvent) { if (event.key === 'Escape') skip() }
  window.addEventListener('resize', skip)
  document.addEventListener('wheel', skip, { passive: true })
  document.addEventListener('touchstart', skip, { passive: true })
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('keydown', key)
  preference.addEventListener('change', reduced)
  document.documentElement.dataset.artTransitionEngine = handoff ? 'live-canvas' : 'poster'
  // A stalled destination must release the lifted drawing and its listeners.
  // Resource loading continues; late arrival still commits through the route owner.
  preparationTimer = setTimeout(skip, preparationTimeout)
  const ready = (async () => {
    await update()
    if (preparationTimer !== undefined) clearTimeout(preparationTimer)
    preparationTimer = undefined
    if (cancelled) return
    destination = findArtwork(name)
    if (!destination || destination === source) return
    destinationOpacity = destination.style.opacity
    destination.style.opacity = '0'
    const after = destination.getBoundingClientRect()
    const lifted = overlay.getBoundingClientRect()
    lift.cancel(); place(lifted)
    const dx = after.left + after.width / 2 - (lifted.left + lifted.width / 2)
    const dy = after.top + after.height / 2 - (lifted.top + lifted.height / 2)
    const sx = after.width / lifted.width, sy = after.height / lifted.height
    const arc = Math.min(8, Math.hypot(dx, dy) * .035)
    const frames = Array.from({ length: 17 }, (_, index) => {
      const t = index / 16
      return { offset: t, transform: `translate(calc(-50% + ${dx * t}px), calc(-50% + ${dy * t - Math.sin(Math.PI * t) * arc}px)) scale(${1 + (sx - 1) * t}, ${1 + (sy - 1) * t})` }
    })
    document.documentElement.dataset.artTransitionPreparationMs = (performance.now() - started).toFixed(1)
    travel = overlay.animate(frames, { duration, easing, fill: 'forwards' })
    animations.push(travel)
    const main = document.getElementById('main-content')
    const texts = main?.querySelectorAll<HTMLElement>('.reader-heading, .reader-layout, .writing-heading, .writing-introduction, .writing-toolbar, .writing-story-copy > *') ?? []
    texts.forEach(element => {
      const box = element.getBoundingClientRect()
      if (box.bottom <= 0 || box.top >= innerHeight) return
      const text = element.animate([{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 220, delay: 45, easing, fill: 'both' })
      animations.push(text); void text.finished.catch(() => {})
    })
    main?.querySelectorAll<HTMLElement>('.article-art-cube figcaption, .art-cube-control').forEach(element => {
      const detail = element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: duration - 160, easing: 'ease-out', fill: 'both' })
      animations.push(detail); void detail.finished.catch(() => {})
    })
  })()
  const finished = ready.then(async () => {
    try { await travel?.finished } catch { /* A new route or user gesture completed this flight early. */ }
  }).finally(clean)
  return { ready, finished, skipTransition: skip }
}
