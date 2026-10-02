import { useCallback, useEffect, useRef } from 'react'
import { Art } from './Art'
import './home-flow.css'
import { heroUiOpacity, settleFlow } from './flow-timing'
import { homeHeroProgress } from './home-scroll-timing'
import { createTextFlow } from './text-flow'

export function HomeScene({ dark }: { dark: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const update = useRef<(progress: number, drift: number) => void>(() => {})
  const currentFlow = useRef<[number, number]>([0, 0])
  const text = useRef<ReturnType<typeof createTextFlow> | null>(null)
  const renderText = useCallback((time: number) => text.current?.render(time), [])
  const textStatus = useCallback((status: 'ready' | 'error') => text.current?.setEnabled(status === 'ready'), [])
  const bind = useCallback((handler: (progress: number, drift: number) => void) => { update.current = handler; handler(...currentFlow.current) }, [])
  useEffect(() => {
    const scene = root.current
    const stage = scene?.closest<HTMLElement>('.home-scroll-stage')
    if (!scene || !stage) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const copy = stage.querySelector<HTMLElement>('.hero-copy')
    if (copy) text.current = createTextFlow(copy)
    const ui = [...stage.querySelectorAll<HTMLElement>('.hero-copy > .arrow-link, .object-controls')]
      .map(element => ({ element, inert: element.inert, hidden: element.getAttribute('aria-hidden') }))
    let uiHidden: boolean | undefined
    let frame = 0
    let progress = 0
    let target = 0
    let previousTime = 0
    let drift = 0
    let settlingUntil = 0
    let visible = true
    let disposed = false
    let count = 0
    function sizeSurface() {
      const rect = scene!.getBoundingClientRect()
      // The sculpture keeps its grid position; only its transparent effect surface expands.
      scene!.style.setProperty('--flow-bleed-left', `${rect.left}px`)
      scene!.style.setProperty('--flow-bleed-right', `${Math.max(0, document.documentElement.clientWidth - rect.right)}px`)
      const hero = stage!.querySelector('.home-hero')?.getBoundingClientRect()
      scene!.style.setProperty('--flow-bleed-top', `${hero ? rect.top - hero.top : 20}px`)
    }
    function measure() {
      const rect = stage!.getBoundingClientRect()
      target = homeHeroProgress(rect.top, rect.height, innerHeight, reduced.matches)
      settlingUntil = performance.now() + 850
      request()
    }
    function request() {
      if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    function tick(time: number) {
      frame = 0
      if (disposed || document.hidden || !visible) return
      const started = performance.now()
      const delta = previousTime ? Math.min((time - previousTime) / 1000, .05) : 1 / 60
      previousTime = time
      progress = settleFlow(progress, target, delta, reduced.matches)
      const opacity = heroUiOpacity(progress)
      stage!.style.setProperty('--hero-ui-opacity', opacity.toFixed(4))
      const hidden = opacity === 0
      if (hidden !== uiHidden) {
        uiHidden = hidden
        stage!.dataset.heroUiHidden = String(hidden)
        for (const previous of ui) {
          previous.element.inert = hidden || previous.inert
          if (hidden) previous.element.setAttribute('aria-hidden', 'true')
          else if (previous.hidden === null) previous.element.removeAttribute('aria-hidden')
          else previous.element.setAttribute('aria-hidden', previous.hidden)
        }
      }
      const flowing = !reduced.matches && progress > .025 && progress < .98
      drift = flowing ? Math.min(1, drift + delta * .65) : 0
      currentFlow.current = [progress, drift]
      update.current(progress, drift)
      // Keep text and sculpture on the earlier shared release timeline.
      text.current?.setProgress(progress, drift)
      scene!.dataset.progress = progress.toFixed(4)
      stage!.dataset.liquidActive = String(progress > .12 && progress < .98 && !reduced.matches)
      scene!.dataset.scrollFrames = String(++count)
      scene!.dataset.reducedMotion = String(reduced.matches)
      const duration = performance.now() - started
      scene!.dataset.scrollCpuMs = duration.toFixed(3)
      if (Math.abs(target - progress) > .0005 || (flowing && time < settlingUntil && drift < 1)) request()
      else previousTime = 0
    }
    function stop() { cancelAnimationFrame(frame); frame = 0; previousTime = 0 }
    function visibility() { stop(); if (!document.hidden) measure() }
    function resize() { sizeSurface(); measure() }
    const layoutObserver = new ResizeObserver(resize)
    layoutObserver.observe(scene)
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      if (visible) measure(); else stop()
    })
    observer.observe(scene)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    reduced.addEventListener('change', measure)
    sizeSurface()
    measure()
    return () => {
      disposed = true
      stop()
      observer.disconnect()
      layoutObserver.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visibility)
      reduced.removeEventListener('change', measure)
      text.current?.dispose()
      text.current = null
      delete stage.dataset.liquidActive
      delete stage.dataset.heroUiHidden
      stage.style.removeProperty('--hero-ui-opacity')
      for (const previous of ui) {
        previous.element.inert = previous.inert
        if (previous.hidden === null) previous.element.removeAttribute('aria-hidden')
        else previous.element.setAttribute('aria-hidden', previous.hidden)
      }
    }
  }, [])
  useEffect(() => { text.current?.refresh() }, [dark])
  return <div ref={root} className="hero-object home-flow-scene" data-progress="0">
    <Art kind="helmet" dark={dark} flow cameraDistanceScale={1.025} onFlowReady={bind} onRendered={renderText} onObjectStatus={textStatus} className="home-flow-viewer" />
  </div>
}
