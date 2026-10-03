import { useEffect, useRef, useState } from 'react'
import { sectionHref } from './library'
import { readerProgress, readerSection, type ReaderPosition } from './reader-position'

export default function ReaderNavigation({ sections }: { sections: { id: string; title: string }[] }) {
  const [open, setOpen] = useState(() => !matchMedia('(max-width: 760px)').matches)
  const [active, setActive] = useState<string | undefined>(sections[0]?.id)
  const line = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    let dirty = true
    let top = 0
    let height = 0
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
      }
      const progress = readerProgress(top, height, scrollY, innerHeight)
      const current = readerSection(positions, scrollY, innerHeight, sections[0]?.id)
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
    const media = matchMedia('(max-width: 760px)')
    const change = () => setOpen(!media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  return <aside ref={aside} className="reader-aside">
    <div className="reader-progress" aria-hidden="true"><div ref={line} /></div>
    <details className="article-contents" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary className="mono">Contents<span className="chapter-position" aria-hidden="true">{String(Math.max(0, sections.findIndex(section => section.id === active)) + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span><span aria-hidden="true">+</span></summary>
      <nav aria-label="Article sections">{sections.map(section => <a key={section.id} href={sectionHref(location.hash, section.id)} aria-current={active === section.id ? 'location' : undefined} onClick={event => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; setActive(section.id); if (matchMedia('(max-width: 760px)').matches) setOpen(false) }}>{section.title}</a>)}</nav>
    </details>
  </aside>
}
