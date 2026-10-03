import { useEffect, useState, type RefObject } from 'react'
import type { ReaderPosition } from '../editorial/reader-position'
import { projectReaderSection } from './project-reading-position'

/** Keep chapter position, direct links and the printed reading bar in agreement. */
export function useProjectReading(root: RefObject<HTMLElement | null>, slug: string, sectionSelector: string, first: string) {
  const [active, setActive] = useState(first)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const sections = [...element.querySelectorAll<HTMLElement>(sectionSelector)]
    const index = element.querySelector<HTMLElement>('.project-reading-bar')
    let positions: ReaderPosition[] = []
    let indexHeight = 0
    let dirty = true
    let readingFrame = 0
    let requestedFrame = 0
    function read() {
      readingFrame = 0
      if (dirty) {
        positions = sections.map((section) => ({ id: section.dataset.storyChapter ?? section.id, top: section.getBoundingClientRect().top + scrollY }))
        const measuredHeight = Math.ceil(index?.getBoundingClientRect().height ?? 0)
        indexHeight = matchMedia('(min-width: 1001px)').matches ? measuredHeight : 0
        element!.style.setProperty('--project-index-height', `${measuredHeight}px`)
        dirty = false
      }
      const current = projectReaderSection(positions, scrollY, innerHeight, indexHeight, first)
      if (current) setActive((previous) => (previous === current ? previous : current))
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
      const [address, query] = location.hash.split('?')
      if (address !== `#/work/${slug}`) return
      const requested = new URLSearchParams(query || '').get('chapter')
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
    for (const section of sections) observer.observe(section)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', reflow)
    window.addEventListener('hashchange', reachRequestedChapter)
    document.fonts.addEventListener('loadingdone', reflow)
    read()
    reachRequestedChapter()
    return () => {
      cancelAnimationFrame(readingFrame)
      cancelAnimationFrame(requestedFrame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', reflow)
      window.removeEventListener('hashchange', reachRequestedChapter)
      document.fonts.removeEventListener('loadingdone', reflow)
      element.style.removeProperty('--project-index-height')
    }
  }, [root, slug, sectionSelector, first])
  return [active, setActive] as const
}
