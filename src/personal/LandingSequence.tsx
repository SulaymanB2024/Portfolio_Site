import { Fragment, useEffect, useRef } from 'react'
import { projects } from './content'
import { portfolioAssetUrl } from './portfolio-assets'
import { DestinationLink, LinkArrow } from './DestinationLink'
import type { LandingOpeningCopy } from './landing/opening-copy'
import './landing/landing.css'
import './landing/opening-motion.css'

export default function LandingSequence({ onActiveChange, opening }: { onActiveChange: (active: boolean) => void; opening?: LandingOpeningCopy }) {
  const rail = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const helmetControl = useRef<HTMLButtonElement>(null)
  const headline = useRef<HTMLHeadingElement>(null)
  const loading = useRef<HTMLParagraphElement>(null)
  const copyContent = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLAnchorElement>(null)
  const links = useRef<HTMLDivElement>(null)
  const project = useRef<HTMLAnchorElement>(null)
  const article = useRef<HTMLAnchorElement>(null)
  const category = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = rail.current
    if (!element) return
    let previous: boolean | undefined
    function update() {
      const continuation = element!.nextElementSibling
      const top = continuation instanceof HTMLElement && continuation.classList.contains('home-standard-content')
        ? continuation.getBoundingClientRect().top : element!.getBoundingClientRect().bottom
      const covered = String(top <= 0)
      if (stage.current && stage.current.dataset.covered !== covered) stage.current.dataset.covered = covered
      const active = top > innerHeight - 60
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
      if (!mounted || !rail.current || !stage.current || !canvas.current || !helmetControl.current || !headline.current || !loading.current || !copyContent.current || !title.current || !links.current || !project.current || !article.current || !category.current) return
      dispose = mountLandingSequence({ rail: rail.current, stage: stage.current, canvas: canvas.current, helmetControl: helmetControl.current, headline: headline.current, loading: loading.current, copyContent: copyContent.current, title: title.current, links: links.current, project: project.current, article: article.current, category: category.current }, opening)
    }).catch(() => {
      if (!mounted) return
      if (canvas.current) canvas.current.dataset.state = 'error'
      if (stage.current) stage.current.dataset.state = 'error'
      if (loading.current) { loading.current.textContent = 'Explore the projects below.'; loading.current.hidden = false }
    })
    return () => { mounted = false; dispose?.() }
  }, [opening])

  return <section ref={rail} className="landing-rail" aria-label="Selected work scroll sequence">
    <link rel="preload" as="fetch" href={portfolioAssetUrl('helmet')} crossOrigin="anonymous" />
    <div ref={stage} className="landing-stage">
      <canvas ref={canvas} className="landing-canvas" aria-hidden="true" hidden />
      <div className="landing-copy"><div ref={copyContent} className="landing-copy-content">
        <span ref={category} className="landing-category">{opening?.category}</span>
        <a ref={title} className="landing-title-target" tabIndex={-1}><h1 ref={headline} id="landing-title">{opening ? opening.lines.map((line, index) => <Fragment key={index}><span className="landing-title-line" data-quiet={index % 2 === 0 ? '' : undefined}>{line}</span>{index < 3 ? ' ' : ''}</Fragment>) : <><span className="landing-title-line" data-quiet>The</span>{' '}<span className="landing-title-line">frontier</span>{' '}<span className="landing-title-line" data-quiet>is all that</span>{' '}<span className="landing-title-line">matters.</span></>}</h1></a>
        <div ref={links} className="landing-story-links">
          <a ref={project} className="destination-link" href={opening?.href || '#/work'}><span className="destination-link-label">{opening?.linkLabel || 'Selected work'}</span><LinkArrow /></a>
          <a ref={article} className="destination-link" href={opening?.article.href || '#/about'}><span className="destination-link-label">{opening?.article.label || 'About me'}</span><LinkArrow /></a>
        </div>
      </div></div>
      <button ref={helmetControl} type="button" className="landing-helmet-control" aria-label="Rotate helmet" aria-describedby="sculpture-instructions" hidden>
        <span id="sculpture-instructions" className="landing-screen-reader-nav">Drag horizontally to turn the sculpture. Use arrow keys to turn and tilt, Home or Escape to reset. Double-click to reset. Vertical swipes scroll the page.</span>
      </button>
      <p ref={loading} className="landing-loading" role="status" hidden>Loading sculpture</p>
      <nav className="landing-fallback-nav" aria-label="Project pages">
        {projects.map(item => <DestinationLink key={item.slug} href={`#/work/${item.slug}`}>{item.name}</DestinationLink>)}
        <DestinationLink href="#/writing">Writing</DestinationLink>
      </nav>
    </div>
    <nav className="landing-screen-reader-nav" aria-label="All selected projects">
      {projects.map(item => <a key={item.slug} href={`#/work/${item.slug}`} tabIndex={-1}>{item.name}</a>)}
    </nav>
  </section>
}
