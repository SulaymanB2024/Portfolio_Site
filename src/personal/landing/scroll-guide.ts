import { CHAPTERS, railProgress, sceneSequence, textSequence } from './sequence.ts'
import { pacedTravel, thresholdMotion } from './motion-curves.ts'

// Stops sit inside the existing reading holds, never inside a half-printed title.
export const READING_STOPS = [0, .21, .46, .71, .96] as const

export function nextReadingStop(progress: number): number | null {
  const { leg, local } = sceneSequence(progress)
  const next = leg + (local >= .74 ? 2 : 1)
  return READING_STOPS[next] ?? null
}

/** A small alignment after native scrolling; the whole transition stays freely scrubbable. */
export function nearbyReadingStop(progress: number, distance: number): number | null {
  if (!Number.isFinite(progress) || !Number.isFinite(distance) || distance <= 0) return null
  const stop = READING_STOPS.slice(1).find(value => Math.abs(value - progress) * distance <= Math.min(48, distance * .009))
  return stop !== undefined && Math.abs(stop - progress) * distance > 1 ? stop : null
}

export function guideProgress(progress: number, reduced = false) {
  if (reduced) return textSequence(progress, 'threshold', true).active
  const { leg, local } = sceneSequence(progress)
  return leg + thresholdMotion(local).travel
}

export function mountScrollGuide(rail: HTMLElement, stage: HTMLElement, button: HTMLButtonElement, track: HTMLElement) {
  const events = new AbortController(), reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const nativeScrollEnd = Boolean('onscrollend' in window)
  let frame = 0, settleTimer = 0, disposed = false, resizedAt = -Infinity
  let lastPosition = '', lastActive = -1, lastNext: number | null | undefined
  let measuredWidth = stage.clientWidth, measuredHeight = stage.clientHeight, measuredRailHeight = rail.clientHeight
  const measure = () => {
    const top = rail.getBoundingClientRect().top + scrollY
    const distance = Math.max(1, rail.clientHeight - stage.clientHeight)
    return { top, distance, progress: railProgress(scrollY, top, rail.clientHeight, stage.clientHeight) }
  }
  function cancel() {
    cancelAnimationFrame(frame); frame = 0
    clearTimeout(settleTimer); settleTimer = 0
    delete stage.dataset.guidance
  }
  function update() {
    if (disposed) return
    const { progress } = measure(), next = nextReadingStop(progress)
    const active = textSequence(progress, 'threshold', reduced.matches).active
    const position = guideProgress(progress, reduced.matches).toFixed(4)
    // Once WebGL is ready, its exact visual position drives the progress rule.
    if (stage.dataset.state !== 'ready' && position !== lastPosition) { track.style.setProperty('--guide-position', position); lastPosition = position }
    if (active !== lastActive) {
      track.setAttribute('aria-valuenow', String(active))
      track.setAttribute('aria-valuetext', `${CHAPTERS[active].label}, ${active + 1} of ${CHAPTERS.length}`)
      lastActive = active
    }
    if (next !== lastNext) {
      button.setAttribute('aria-label', next === null ? 'Continue to writing' : `Continue to ${CHAPTERS[Math.round(next * 4)].label}`)
      lastNext = next
    }
  }
  function animateTo(top: number, align = false, complete?: () => void) {
    cancel()
    if (reduced.matches) { window.scrollTo({ top, behavior: 'instant' }); update(); complete?.(); return }
    const from = scrollY, distance = top - from
    if (Math.abs(distance) < 1) { complete?.(); return }
    const duration = align ? 240 : 800 + Math.min(500, Math.abs(distance) / Math.max(1, stage.clientHeight) * 300)
    let started: number | undefined
    stage.dataset.guidance = align ? 'aligning' : 'continuing'
    function tick(time: number) {
      if (disposed) return
      started ??= time
      const elapsed = Math.min(1, (time - started) / duration)
      window.scrollTo({ top: from + distance * pacedTravel(elapsed), behavior: 'instant' })
      if (elapsed < 1) frame = requestAnimationFrame(tick)
      else { frame = 0; delete stage.dataset.guidance; update(); complete?.() }
    }
    frame = requestAnimationFrame(tick)
  }
  function continueReading() {
    const { top, distance, progress } = measure(), next = nextReadingStop(progress)
    const writing = rail.closest('.home-site')?.querySelector<HTMLElement>('.home-writing')
    animateTo(next === null ? (writing ? writing.getBoundingClientRect().top + scrollY - 110 : top + rail.clientHeight) : top + distance * next, false, next === null && writing ? () => {
      if (!writing.isConnected) return
      writing.tabIndex = -1
      writing.focus({ preventScroll: true })
    } : undefined)
  }
  function settle() {
    clearTimeout(settleTimer); settleTimer = 0
    if (disposed || frame || performance.now() - resizedAt < 240 || reduced.matches || document.hidden) return
    const { top, distance, progress } = measure()
    if (scrollY < top || scrollY > top + distance) return
    const stop = nearbyReadingStop(progress, distance)
    if (stop !== null) animateTo(top + stop * distance, true)
  }
  function scroll() {
    update()
    if (!nativeScrollEnd && !frame) { clearTimeout(settleTimer); settleTimer = window.setTimeout(settle, 220) }
  }
  function resize() {
    // The address bar can resize the window while the stable svh composition stays identical.
    if (stage.clientWidth !== measuredWidth || stage.clientHeight !== measuredHeight || rail.clientHeight !== measuredRailHeight) {
      cancel(); resizedAt = performance.now()
      measuredWidth = stage.clientWidth; measuredHeight = stage.clientHeight; measuredRailHeight = rail.clientHeight
    }
    update()
  }
  const options = { passive: true, signal: events.signal }
  button.addEventListener('click', continueReading, { signal: events.signal })
  window.addEventListener('scroll', scroll, options)
  window.addEventListener('scrollend', settle, options)
  window.addEventListener('resize', resize, options)
  for (const event of ['wheel', 'touchstart', 'pointerdown']) window.addEventListener(event, cancel, options)
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancel()
  }, { signal: events.signal })
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel() }, { signal: events.signal })
  reduced.addEventListener('change', () => { cancel(); update() }, { signal: events.signal })
  update()
  return () => { disposed = true; cancel(); events.abort() }
}
