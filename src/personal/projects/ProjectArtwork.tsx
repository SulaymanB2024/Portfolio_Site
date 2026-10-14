import { useEffect, useRef } from 'react'
import type { WorkStudyHandle } from '../work-study-renderer'
import { createWorkStageReadiness } from '../work-stage-readiness'
import '../work-studies.css'

/** Direct manipulation without importing the collection's controls or evidence. */
export function ProjectArtwork({ slug, dark }: { slug: string; dark: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<WorkStudyHandle | null>(null)
  useEffect(() => {
    const element = root.current
    const surface = canvas.current
    if (!element || !surface) return
    let cancelled = false
    let starting = false
    let mount: typeof import('../work-study-renderer').mountWorkStudies | null = null
    const readiness = createWorkStageReadiness(() => {
      if (cancelled || !mount) return
      handle.current = mount(surface, element)
      handle.current.setPlaying(true)
      observer.disconnect()
      document.removeEventListener('visibilitychange', eligibility)
    })
    function eligibility() {
      const rect = element!.getBoundingClientRect()
      readiness.visible(!document.hidden && rect.width > 1 && rect.height > 1 && rect.bottom > -180 && rect.top < innerHeight + 180 && rect.right > -180 && rect.left < innerWidth + 180)
    }
    document.addEventListener('visibilitychange', eligibility)
    const observer = new IntersectionObserver(entries => {
      eligibility()
      if (starting || !entries.some(entry => entry.isIntersecting)) return
      starting = true
      import('../work-study-renderer').then(({ mountWorkStudies }) => {
        if (cancelled) return
        mount = mountWorkStudies
        eligibility()
        readiness.ready()
      }).catch(() => {
        if (cancelled) return
        readiness.dispose()
        observer.disconnect()
        document.removeEventListener('visibilitychange', eligibility)
        surface.dataset.state = 'error'
        element.querySelectorAll<HTMLElement>('[data-work-study]').forEach(slot => { slot.dataset.state = 'error' })
      })
    }, { rootMargin: '180px' })
    observer.observe(element)
    return () => {
      cancelled = true
      readiness.dispose()
      observer.disconnect()
      document.removeEventListener('visibilitychange', eligibility)
      handle.current?.dispose()
      handle.current = null
    }
  }, [slug])
  useEffect(() => { handle.current?.refresh() }, [dark])
  return <div ref={root} className="work-stage project-artwork" data-work-playing="true">
    <canvas ref={canvas} className="work-stage-canvas" aria-hidden="true" />
    <div className="work-study-slot project-artwork-slot" data-work-study={slug} data-work-framing="hero" data-work-interactive="true" data-state="loading" tabIndex={0} role="group" aria-labelledby={`${slug}-artwork-title`} aria-description="Interactive sculpture. Drag or use arrow keys to rotate. Home or double-click resets the view." />
  </div>
}
