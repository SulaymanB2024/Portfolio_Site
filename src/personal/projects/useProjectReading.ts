import { useEffect, useState, type RefObject } from 'react'
import type { ReaderPosition } from '../editorial/reader-position'
import { projectIndexScroll, projectReaderSection, requestedProjectChapter } from './project-reading-position'

/** Keep chapter position, direct links and the printed reading bar in agreement. */
export function useProjectReading(root: RefObject<HTMLElement | null>, slug: string, sectionSelector: string, first: string) {
  const [active, setActive] = useState(first)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const sections = [...element.querySelectorAll<HTMLElement>(sectionSelector)]
    const index = element.querySelector<HTMLElement>('.project-reading-bar')
    const track = index?.querySelector<HTMLElement>('.project-index-track')
    let positions: ReaderPosition[] = []
    let indexHeight = 0
    let dirty = true
    let readingFrame = 0
    let requestedFrame = 0
    let visibleChapter = ''
    function indexEdges() {
      if (!track) return
      track.style.setProperty('--project-index-left', track.scrollLeft > 1 ? 'transparent' : '#000')
      track.style.setProperty('--project-index-right', track.scrollLeft + track.clientWidth < track.scrollWidth - 1 ? 'transparent' : '#000')
    }
    function read() {
      readingFrame = 0
      if (dirty) {
        positions = sections.map((section) => ({ id: section.dataset.storyChapter ?? section.id, top: section.getBoundingClientRect().top + scrollY }))
        const measuredHeight = Math.ceil(index?.getBoundingClientRect().height ?? 0)
        indexHeight = index && getComputedStyle(index).position === 'sticky' ? measuredHeight : 0
        element!.style.setProperty('--project-index-height', `${measuredHeight}px`)
        dirty = false
        visibleChapter = ''
        indexEdges()
      }
      const current = projectReaderSection(positions, scrollY, innerHeight, indexHeight, first)
      if (current) setActive((previous) => (previous === current ? previous : current))
      if (current && track && current !== visibleChapter) {
        const link = track.querySelector<HTMLElement>(`[data-project-chapter="${current}"]`)
        if (link) {
          const left = link.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
          const next = projectIndexScroll(track.scrollLeft, track.clientWidth, left, link.offsetWidth, track.scrollWidth)
          if (next !== track.scrollLeft) track.scrollTo({ left: next, behavior: 'instant' })
          indexEdges()
        }
        visibleChapter = current
      }
    }
    function schedule() {
      if (!readingFrame) readingFrame = requestAnimationFrame(read)
    }
    function reflow() {
      dirty = true
      schedule()
    }
    function reachRequestedChapter() {
      cancelAnimationFrame(requestedFrame)
      requestedFrame = 0
      const requested = requestedProjectChapter(location.hash, location.pathname, location.search, slug)
      const destination = sections.find((section) => (section.dataset.storyChapter ?? section.id) === requested)
      if (!destination) return
      // Allow the router's scroll reset to finish before a direct chapter arrival.
      requestedFrame = requestAnimationFrame(() => {
        requestedFrame = 0
        if (dirty) {
          cancelAnimationFrame(readingFrame)
          read()
        }
        destination.scrollIntoView({ behavior: 'instant', block: 'start' })
        destination.focus({ preventScroll: true })
        setActive(requested!)
      })
    }
    const observer = new ResizeObserver(reflow)
    observer.observe(element)
    if (index) observer.observe(index)
    track?.addEventListener('scroll', indexEdges, { passive: true })
    for (const section of sections) observer.observe(section)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', reflow)
    window.addEventListener('hashchange', reachRequestedChapter)
    window.addEventListener('popstate', reachRequestedChapter)
    document.fonts.addEventListener('loadingdone', reflow)
    read()
    reachRequestedChapter()
    return () => {
      cancelAnimationFrame(readingFrame)
      cancelAnimationFrame(requestedFrame)
      observer.disconnect()
      track?.removeEventListener('scroll', indexEdges)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', reflow)
      window.removeEventListener('hashchange', reachRequestedChapter)
      window.removeEventListener('popstate', reachRequestedChapter)
      document.fonts.removeEventListener('loadingdone', reflow)
      element.style.removeProperty('--project-index-height')
    }
  }, [root, slug, sectionSelector, first])
  return [active, setActive] as const
}
