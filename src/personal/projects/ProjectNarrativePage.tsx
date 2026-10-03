import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { projects, type Project } from '../content'
import { ProjectStudy } from '../WorkCollection'
import { ProjectDiagram } from './ProjectDiagrams'
import { workNarratives } from './work-narratives'
import ProductEvidence from './ProductEvidence'
import './project-narrative.css'

function StoryLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith('http')
  return <a className={`arrow-link ${className}`} href={href.startsWith('./') ? `${import.meta.env.BASE_URL}${href.slice(2)}` : href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}<span aria-hidden="true">{external ? '↗' : '→'}</span></a>
}

function WorkingArtifact({ slug }: { slug: string }) {
  if (slug === 'internshipdeadlines') return <aside className="story-artifact story-record" aria-label="What belongs in an application plan"><span className="mono">A record becomes a plan</span><dl><div><dt>Employer posting</dt><dd>The original reference</dd></div><div><dt>Application deadline</dt><dd>Source supplied / unknown</dd></div><div><dt>Personal target</dt><dd>Your next action</dd></div></dl><p>Source facts and personal plans have different authors.</p></aside>
  if (slug === 'sapien') return <aside className="story-artifact story-brief" aria-label="The structure of a research story"><span className="mono">Inside a research story</span><div><span className="mono" aria-hidden="true">01</span><p>The decision</p></div><div><span className="mono" aria-hidden="true">02</span><p>The comparison</p></div><div><span className="mono" aria-hidden="true">03</span><p>The evidence behind the claim</p></div><p>A useful explanation carries all three.</p></aside>
  if (slug === 'investing-markets') return <aside className="story-artifact story-waterfall" aria-label="Payment order documented for SH 288 concession termination"><span className="mono">SH 288 / termination proceeds</span><div><span className="mono">First</span><p>Outstanding debt</p></div><span className="story-flow-arrow" aria-hidden="true">↓</span><div><span className="mono">Remainder</span><p>Available to shareholders</p></div><p>Payment priority described in the <a href="https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project" target="_blank" rel="noreferrer">federal project record ↗</a>.</p></aside>
  return <figure className="story-artifact story-fold"><span className="mono">Form / construction / movement</span><svg viewBox="0 0 500 290" role="img" aria-label="A folded sheet meeting a hinge and a shared pivot"><defs><pattern id="fold-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" /></pattern></defs><path d="M60 221 184 37 245 150Z" fill="url(#fold-grain)" stroke="currentColor" /><path d="M184 37 403 206 245 150Z" fill="none" stroke="currentColor"/><path d="M60 221 403 206 245 150Z" fill="url(#fold-grain)" stroke="currentColor"/><path d="M184 37 245 150 403 206" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="245" cy="150" r="28" fill="var(--paper)" stroke="currentColor"/><circle cx="245" cy="150" r="9" fill="currentColor"/><path d="M245 183V255 M243 255h86" fill="none" stroke="currentColor"/><text x="335" y="260" fill="currentColor" fontFamily="Courier New, monospace" fontSize="12">PIVOT</text></svg><figcaption>A form needs structure before movement can explain it.</figcaption></figure>
}

export default function ProjectNarrativePage({ project: p, dark }: { project: Project; dark: boolean }) {
  const narrative = workNarratives[p.slug]
  const chapterLabels: Record<string, string[]> = {
    internshipdeadlines: ['The question', 'The workflow', 'The plan'],
    sapien: ['Buyer questions', 'Research', 'Communication'],
    'investing-markets': ['Ownership', 'Cash flow', 'Assumptions'],
    miscellaneous: ['The idea', 'Ink & paper', 'Iteration'],
  }
  const next = projects[(projects.indexOf(p) + 1) % projects.length]
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState('question')
  useEffect(() => {
    const element = root.current
    if (!element) return
    const sections = [...element.querySelectorAll<HTMLElement>('[data-story-chapter]')]
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        ;(entry.target as HTMLElement).dataset.storySeen = 'true'
        reveal.unobserve(entry.target)
      }
    }, { threshold: .08 })
    let readingFrame: number | null = null
    function readChapter() {
      readingFrame = null
      const readingLine = Math.max(140, innerHeight * .28)
      const current = sections.filter(section => section.getBoundingClientRect().top <= readingLine).at(-1) ?? sections[0]
      const id = current?.dataset.storyChapter
      if (id) setActive(id)
    }
    function trackReading() {
      if (readingFrame === null) readingFrame = requestAnimationFrame(readChapter)
    }
    // Fast scrolling can skip the entire observer band. One coalesced frame per
    // scroll event keeps the index accurate without a continuing animation loop.
    const reading = new IntersectionObserver(trackReading, { rootMargin: '-15% 0px -55% 0px' })
    window.addEventListener('scroll', trackReading, { passive: true })
    window.addEventListener('resize', trackReading)
    for (const section of sections) { reveal.observe(section); reading.observe(section) }
    let requestedFrame: number | null = null
    function reachRequestedChapter() {
      const [address, query] = location.hash.split('?')
      if (address !== `#/work/${p.slug}`) return
      const requested = new URLSearchParams(query || '').get('chapter')
      const destination = sections.find(section => section.dataset.storyChapter === requested)
      if (requestedFrame !== null) cancelAnimationFrame(requestedFrame)
      requestedFrame = null
      if (!destination) return
      // The router resets scroll after its commit. Reach the chapter once that
      // reset has finished, including query-only navigation within this project.
      requestedFrame = requestAnimationFrame(() => {
        requestedFrame = null
        destination.scrollIntoView({ behavior: 'instant', block: 'start' })
        destination.focus({ preventScroll: true })
        setActive(requested!)
      })
    }
    window.addEventListener('hashchange', reachRequestedChapter)
    reachRequestedChapter()
    return () => {
      reveal.disconnect()
      reading.disconnect()
      window.removeEventListener('scroll', trackReading)
      window.removeEventListener('resize', trackReading)
      window.removeEventListener('hashchange', reachRequestedChapter)
      if (readingFrame !== null) cancelAnimationFrame(readingFrame)
      if (requestedFrame !== null) cancelAnimationFrame(requestedFrame)
    }
  }, [p.slug])
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const section = document.getElementById(`${p.slug}-${id}`)
    section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    section?.focus({ preventScroll: true })
    setActive(id)
    const address = new URL(location.href)
    address.hash = `/work/${p.slug}?chapter=${id}`
    history.replaceState(history.state, '', address)
  }
  return <article ref={root} className={`project-page project-narrative project-narrative-${p.slug}`}>
    <a className="project-back mono" href="#/work">← All work</a>
    <section className="project-hero">
      <div className="project-copy">
        <span className="eyebrow">{p.number} / {p.name}</span>
        <h1>{p.headline.map(line => <span key={line}>{line}</span>)}</h1>
        <p>{p.summary}</p>
        <dl className="project-context">
          <div><dt>Role</dt><dd>{narrative.role}</dd></div>
          <div><dt>Approach</dt><dd>{narrative.lens}</dd></div>
        </dl>
        <div className="project-links">
          {p.link && <StoryLink href={p.link.href}>{p.link.label}</StoryLink>}
          <a className="project-read mono" href={`#/work/${p.slug}?chapter=question`} onClick={event => jump(event, 'question')}>Read the project<span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="project-object"><ProjectStudy project={p} dark={dark} /><span className="crosshair" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 1v7m0 8v7M1 12h7m8 0h7" /><circle cx="12" cy="12" r="4" /></svg></span></div>
    </section>
    <nav className="story-index" aria-label="In this project"><span className="mono">Inside the work</span>{narrative.chapters.map((chapter, i) => <a key={chapter.id} href={`#/work/${p.slug}?chapter=${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined} onClick={event => jump(event, chapter.id)}><span aria-hidden="true">0{i + 1}</span>{chapterLabels[p.slug][i]}</a>)}</nav>
    {narrative.chapters.map((chapter, index) => <section className={`story-chapter story-chapter-${chapter.id}`} id={`${p.slug}-${chapter.id}`} data-story-chapter={chapter.id} key={chapter.id} tabIndex={-1} aria-labelledby={`${p.slug}-${chapter.id}-title`}>
      <div className="story-chapter-label mono"><span>0{index + 1} / {chapter.kicker}</span></div>
      {index === 0 ? <div className="story-opening-layout"><div><h2 id={`${p.slug}-${chapter.id}-title`}>{chapter.title}</h2><p className="story-opening">{narrative.opening}</p></div><div className="story-prose">{chapter.body.map(text => <p key={text}>{text}</p>)}{chapter.note && <p className="story-note">{chapter.note}</p>}</div></div>
      : index === 1 ? <div className="story-system-layout"><div className="story-system-copy"><h2 id={`${p.slug}-${chapter.id}-title`}>{chapter.title}</h2><div className="story-prose">{chapter.body.map(text => <p key={text}>{text}</p>)}</div>{chapter.note && <p className="story-note">{chapter.note}</p>}</div><ProjectDiagram slug={p.slug} /></div>
      : <><div className="story-practice-intro"><div><h2 id={`${p.slug}-${chapter.id}-title`}>{chapter.title}</h2><WorkingArtifact slug={p.slug} /></div><div className="story-prose">{chapter.body.map(text => <p key={text}>{text}</p>)}{chapter.note && <p className="story-note">{chapter.note}</p>}</div></div><div className="story-decisions"><span className="mono story-decisions-label">A closer reading</span><div>{p.areas.map((area, i) => <details key={area.title} className="story-decision" open><summary><span className="mono" aria-hidden="true">0{i + 1}</span><h3>{area.title}</h3><span className="story-disclosure-glyph" aria-hidden="true">+</span></summary><p>{area.description}</p></details>)}</div></div></>}
      {p.slug === 'internshipdeadlines' && index === 1 && <ProductEvidence kind="internshipdeadlines" />}
    </section>)}
    <section className="story-conclusion" aria-label="Perspective"><span className="mono">What I take forward</span><p>{narrative.takeaway}</p><div className="story-related"><span className="mono">Follow the thread</span><div>{narrative.links.map(link => <a key={link.href} href={link.href.startsWith('./') ? `${import.meta.env.BASE_URL}${link.href.slice(2)}` : link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}><div><h3>{link.label}</h3><p>{link.description}</p></div><span aria-hidden="true">↗</span></a>)}</div></div></section>
    <div className="story-tail">
      <a className="story-next" href={`#/work/${next.slug}`}><span className="mono">Next / 0{projects.indexOf(next) + 1}</span><span>{next.slug === 'internshipdeadlines' ? <>Internship<wbr />Deadlines</> : next.name}</span><span aria-hidden="true">→</span></a>
      <StoryLink className="story-contact" href="#/contact">Let’s talk</StoryLink>
    </div>
  </article>
}
