import { useEffect, useRef, useState } from 'react'
import { sectionHref } from './library'
import { readerProgress, readerSection, type ReaderPosition } from './reader-position'

const compactReader = '(max-width: 760px), (max-width: 950px) and (max-height: 500px)'

export default function ReaderNavigation({ sections }: { sections: { id: string; title: string }[] }) {
  const [open, setOpen] = useState(() => !matchMedia(compactReader).matches)
  const [active, setActive] = useState<string | undefined>(sections[0]?.id)
  const line = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLElement>(null)
  const current = sections.find(section => section.id === active)
  const title = (value: string) => value.replace(/^(?:[IVXLCDM]+|\d+)[.)]\s+/, '')

  useEffect(() => {
    let frame = 0
    let dirty = true
    let top = 0
    let height = 0
    let arrivalOffset = 0
    let positions: ReaderPosition[] = []
    const prose = aside.current?.parentElement?.querySelector<HTMLElement>('.reader-prose')
    const targets = sections.map(section => ({ id: section.id, element: document.getElementById(section.id) }))
    const update = () => {
      frame = 0
      if (!prose || !line.current) return
      if (dirty) {
        dirty = false
        const bounds = prose.getBoundingClientRect()
        top = bounds.top + scrollY
        height = bounds.height
        positions = targets.flatMap(target => target.element?.isConnected ? [{ id: target.id, top: target.element.getBoundingClientRect().top + scrollY }] : [])
        const firstTarget = targets.find(target => target.element?.isConnected)?.element
        arrivalOffset = firstTarget ? parseFloat(getComputedStyle(firstTarget).scrollMarginTop) || 0 : 0
      }
      const progress = readerProgress(top, height, scrollY, innerHeight)
      const current = readerSection(positions, scrollY, innerHeight, sections[0]?.id, arrivalOffset)
      line.current.style.transform = `scaleX(${progress})`
      setActive(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const layoutChanged = () => { dirty = true; schedule() }
    const observer = new ResizeObserver(layoutChanged)
    if (prose) observer.observe(prose)
    const article = prose?.closest('.article-page')
    if (article) observer.observe(article)
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', layoutChanged, { passive: true })
    document.fonts.addEventListener('loadingdone', layoutChanged)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', layoutChanged); document.fonts.removeEventListener('loadingdone', layoutChanged) }
  }, [sections])

  useEffect(() => {
    const media = matchMedia(compactReader)
    const change = () => setOpen(!media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  // Keep the current chapter visible in a long contents list without moving the page.
  useEffect(() => {
    const nav = aside.current?.querySelector('nav')
    const link = nav?.querySelector<HTMLElement>('a[aria-current="location"]')
    if (!open || !nav || !link || nav.contains(document.activeElement)) return
    const bounds = nav.getBoundingClientRect()
    const target = link.getBoundingClientRect()
    if (target.top < bounds.top + 8) nav.scrollTop += target.top - bounds.top - 8
    else if (target.bottom > bounds.bottom - 8) nav.scrollTop += target.bottom - bounds.bottom + 8
  }, [active, open])

  return <aside ref={aside} className="reader-aside">
    <div className="reader-progress" aria-hidden="true"><div ref={line} /></div>
    <details className="article-contents" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary className="mono"><span className="reader-contents-label">Contents<span className="reader-current-title" title={current?.title}>{current ? title(current.title) : 'Article sections'}</span></span><span className="chapter-position" aria-hidden="true">{String(Math.max(0, sections.findIndex(section => section.id === active)) + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span><span aria-hidden="true">+</span></summary>
      <nav aria-label="Article sections">{sections.map((section, index) => <a key={section.id} href={sectionHref(location.hash, section.id)} aria-current={active === section.id ? 'location' : undefined} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; setActive(section.id); if (matchMedia(compactReader).matches) setOpen(false) }}><span className="reader-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{title(section.title)}</span></a>)}</nav>
    </details>
  </aside>
}
