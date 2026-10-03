import { useEffect, useRef } from 'react'
import { projects } from './content'
import './landing/landing.css'

function returnToStart(event: React.MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

export default function LandingSequence({ onActiveChange }: { onActiveChange: (active: boolean) => void }) {
  const rail = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const headline = useRef<HTMLHeadingElement>(null)
  const loading = useRef<HTMLParagraphElement>(null)
  const copyContent = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLAnchorElement>(null)
  const links = useRef<HTMLDivElement>(null)
  const project = useRef<HTMLAnchorElement>(null)
  const article = useRef<HTMLAnchorElement>(null)
  const category = useRef<HTMLSpanElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const cue = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = rail.current
    if (!element) return
    let previous: boolean | undefined
    function update() {
      const active = element!.getBoundingClientRect().bottom > innerHeight - 60
      if (active !== previous) { previous = active; onActiveChange(active) }
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [onActiveChange])

  useEffect(() => {
    let mounted = true
    let dispose: (() => void) | undefined
    void import('./landing/renderer').then(({ mountLandingSequence }) => {
      if (!mounted || !rail.current || !stage.current || !canvas.current || !headline.current || !loading.current || !copyContent.current || !title.current || !links.current || !project.current || !article.current || !category.current || !count.current || !cue.current) return
      dispose = mountLandingSequence({ rail: rail.current, stage: stage.current, canvas: canvas.current, headline: headline.current, loading: loading.current, copyContent: copyContent.current, title: title.current, links: links.current, project: project.current, article: article.current, category: category.current, count: count.current, cue: cue.current })
    }).catch(() => {
      if (!mounted) return
      if (canvas.current) canvas.current.dataset.state = 'error'
      if (loading.current) loading.current.textContent = 'Explore the projects below.'
    })
    return () => { mounted = false; dispose?.() }
  }, [])

  return <section ref={rail} className="landing-rail" aria-label="Selected work scroll sequence">
    <div ref={stage} className="landing-stage">
      <canvas ref={canvas} className="landing-canvas" aria-hidden="true" />
      <header className="landing-header">
        <a href="#/" onClick={returnToStart}>Sulayman Bowles</a>
        <nav aria-label="Landing navigation"><a href="#/about">About</a><a href="#/writing">Writing</a></nav>
      </header>
      <div className="landing-copy"><div ref={copyContent} className="landing-copy-content">
        <span ref={category} className="landing-category" />
        <a ref={title} className="landing-title-target" tabIndex={-1}><h1 ref={headline} id="landing-title">The frontier<br />is all that<br />matters.</h1></a>
        <div ref={links} className="landing-story-links">
          <a ref={project} href="#/about">About me <span aria-hidden="true">↗</span></a>
          <a ref={article} hidden />
        </div>
      </div></div>
      <p ref={loading} className="landing-loading" role="status">Loading sculpture</p>
      <span className="landing-frame-mark landing-frame-start" aria-hidden="true" />
      <span className="landing-frame-mark landing-frame-end" aria-hidden="true" />
      <div className="landing-footer" aria-hidden="true"><span ref={cue}>Scroll to continue ↓</span><span ref={count}>00 / 04</span></div>
      <nav className="landing-fallback-nav" aria-label="Project pages">
        {projects.map(item => <a key={item.slug} href={`#/work/${item.slug}`}>{item.name}<span aria-hidden="true">↗</span></a>)}
        <a href="#/writing">Writing<span aria-hidden="true">↗</span></a>
      </nav>
    </div>
    <nav className="landing-screen-reader-nav" aria-label="All selected projects">
      {projects.map(item => <a key={item.slug} href={`#/work/${item.slug}`} tabIndex={-1}>{item.name}</a>)}
    </nav>
  </section>
}
