import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { projects, type Project } from './content'
import type { WorkStudyHandle } from './work-study-renderer'
import { siteCopy } from './site-copy'
import { createStudyActivationGate } from './work-entry-activation'
import { createWorkStageReadiness } from './work-stage-readiness'
import { readPortfolioRenderPolicy } from './mobile-render-policy'
import { caseStudies } from './projects/case-studies'
import { describeAtlasRow } from './projects/atlas-evidence'
import { workContributions } from './projects/work-curation'
import { DestinationCue, DestinationLink, LinkArrow } from './DestinationLink'
import './work-studies.css'
import './work-curation.css'

type StudyController = { identity: string; registerActivation(cancel: () => void): () => void; reset(slug: string): void; spin(slug: string, spinning: boolean): void; playing: boolean; reduced: boolean; toggle(): void; open(project: Project): void; explore(project: Project, event: MouseEvent<HTMLAnchorElement>): void }
const StudyContext = createContext<StudyController | null>(null)

function WorkStage({ children, dark, identity, className = '' }: { children: ReactNode; dark: boolean; identity: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<WorkStudyHandle | null>(null)
  const queuedActivations = useRef(new Set<() => void>())
  const [playing, setPlaying] = useState(() => readPortfolioRenderPolicy().autoplay)
  const playingRef = useRef(playing)
  playingRef.current = playing
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    const element = root.current
    const surface = canvas.current
    if (!element || !surface) return
    let cancelled = false
    let starting = false
    let mount: typeof import('./work-study-renderer').mountWorkStudies | null = null
    const readiness = createWorkStageReadiness(() => {
      if (cancelled || !mount) return
      handle.current = mount(surface, element)
      handle.current.setPlaying(playingRef.current)
      observer.disconnect()
      document.removeEventListener('visibilitychange', eligibility)
    })
    function eligibility() {
      const rect = element!.getBoundingClientRect()
      readiness.visible(!document.hidden && rect.width > 1 && rect.height > 1 && rect.bottom > -180 && rect.top < window.innerHeight + 180 && rect.right > -180 && rect.left < window.innerWidth + 180)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') queuedActivations.current.forEach(cancel => cancel())
    }
    document.addEventListener('keydown', escape)
    document.addEventListener('visibilitychange', eligibility)
    const observer = new IntersectionObserver(entries => {
      eligibility()
      if (starting || !entries.some(entry => entry.isIntersecting)) return
      starting = true
      import('./work-study-renderer').then(({ mountWorkStudies }) => {
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
    return () => { cancelled = true; readiness.dispose(); observer.disconnect(); document.removeEventListener('visibilitychange', eligibility); document.removeEventListener('keydown', escape); handle.current?.dispose(); handle.current = null }
  }, [identity])
  useEffect(() => { handle.current?.setPlaying(playingRef.current) }, [playing])
  useEffect(() => { handle.current?.refresh() }, [dark])
  function open(project: Project) {
    location.hash = `/work/${project.slug}`
  }
  function explore(project: Project, event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (event.detail > 0 && window.getSelection()?.isCollapsed === false) { event.preventDefault(); return }
    event.preventDefault()
    open(project)
  }
  const controller = useMemo<StudyController>(() => ({
    identity,
    registerActivation: cancel => { queuedActivations.current.add(cancel); return () => { queuedActivations.current.delete(cancel) } },
    reset: slug => handle.current?.reset(slug),
    spin: (slug, spinning) => handle.current?.setSpinning(slug, spinning),
    playing, reduced, toggle: () => setPlaying(value => !value), open, explore,
  }), [playing, reduced, identity])
  function cancelActivations() {
    queuedActivations.current.forEach(cancel => cancel())
  }
  return <StudyContext.Provider value={controller}><div ref={root} className={`work-stage ${className}`} data-work-playing={playing} onPointerDownCapture={cancelActivations} onKeyDownCapture={cancelActivations} onClickCapture={cancelActivations} onAuxClickCapture={cancelActivations}>
    <canvas ref={canvas} className="work-stage-canvas" aria-hidden="true" />
    {children}
  </div></StudyContext.Provider>
}

function WorkMotionControl() {
  const motion = useContext(StudyContext)!
  return <button className="work-motion-control" disabled={motion.reduced} onClick={motion.toggle} aria-label={motion.playing ? 'Pause work sculptures' : 'Play work sculptures'} aria-pressed={motion.playing && !motion.reduced} title={motion.reduced ? 'Automatic motion follows your reduced motion preference' : undefined}>
    <span aria-hidden="true">{motion.reduced ? '—' : motion.playing ? 'Ⅱ' : '▷'}</span>{motion.reduced ? 'Motion off' : motion.playing ? 'Pause motion' : 'Play motion'}
  </button>
}

function WorkSculpture({ project, motionControl = false, navigates = false }: { project: Project; motionControl?: boolean; navigates?: boolean }) {
  const element = useRef<HTMLElement>(null)
  const motion = useContext(StudyContext)!
  const activation = useMemo(() => createStudyActivationGate(), [])
  const [ready, setReady] = useState(false)
  useEffect(() => { activation.cancel(); return () => activation.cancel() }, [activation, motion.identity, motion.playing, motion.reduced])
  useEffect(() => motion.registerActivation(activation.cancel), [activation, motion])
  useEffect(() => {
    const slot = element.current
    if (!slot) return
    const status = () => setReady(slot.dataset.state === 'ready')
    const observer = new MutationObserver(status)
    observer.observe(slot, { attributes: true, attributeFilter: ['data-state'] })
    status()
    return () => observer.disconnect()
  }, [])
  const label = `${project.name} sculpture. Drag or use arrow keys to rotate. Home or double-click resets this object.`
  const slot = {
    ref: (node: HTMLElement | null) => { element.current = node },
    className: 'work-study-slot',
    'data-work-study': project.slug,
    'data-work-interactive': 'true',
    'data-work-framing': motionControl ? 'detail' : 'collection',
    'data-state': 'loading',
    tabIndex: 0,
  }
  function clickSculpture(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented) return
    if (event.detail > 0 && activation.blocked) {
      event.preventDefault()
      activation.cancel()
      return
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (event.detail > 0 && window.getSelection()?.isCollapsed === false) { event.preventDefault(); activation.cancel(); return }
    if (event.detail === 0) { motion.explore(project, event); return }
    event.preventDefault()
    if (event.detail > 1) { activation.cancel(); return }
    activation.queue(() => motion.open(project))
  }
  const failure = <span className="work-study-failure">Object unavailable</span>
  return <div className="work-sculpture work-sculpture-interactive" data-work-navigates={navigates} onPointerDownCapture={() => activation.cancel()} onKeyDownCapture={() => activation.cancel()}>
    {navigates ? <a {...slot} href={`#/work/${project.slug}`} draggable={false} aria-label={`Open ${project.name}. ${label}`}
      onClick={clickSculpture}
      onPointerDownCapture={event => { if (event.isPrimary && event.button === 0) activation.start(event.pointerId, event.clientX, event.clientY, event.pointerType) }}
      onPointerMoveCapture={event => activation.move(event.pointerId, event.clientX, event.clientY)}
      onPointerUpCapture={event => activation.end(event.pointerId, element.current?.dataset.dragging === 'true')}
      onPointerCancelCapture={() => activation.interrupt()}
      onDoubleClick={event => { event.preventDefault(); activation.cancel() }}
    >{failure}</a> : <div {...slot} role="group" aria-label={label}>{failure}</div>}
    <div className="work-study-controls" onClickCapture={() => activation.cancel()}>
      <span>Drag to rotate</span>
      {motionControl && <WorkMotionControl />}
      <button disabled={!ready} aria-label={`Reset ${project.name} sculpture`} title="Reset this object" onClick={() => motion.reset(project.slug)}>Reset</button>
    </div>
  </div>
}

function ProjectEntry({ project, featured = false }: { project: Project; featured?: boolean }) {
  const motion = useContext(StudyContext)!
  const link = useRef<HTMLAnchorElement>(null)
  const activation = useMemo(() => createStudyActivationGate(), [])
  function guardClick(event: MouseEvent<HTMLElement>) {
    const control = (event.target as Element).closest('button,input,textarea,select')
    if (control) return
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.detail > 0 && (activation.blocked || (!modified && window.getSelection()?.isCollapsed === false))) event.preventDefault()
  }
  function clickContent(event: MouseEvent<HTMLElement>) {
    if (event.type === 'auxclick' && event.button !== 1) return
    if (event.defaultPrevented || (event.target as Element).closest('a,button,input,textarea,select')) return
    event.preventDefault()
    // Use the link's native modified activation for middle-click as well as Cmd/Ctrl-click.
    const middle = event.type === 'auxclick'
    link.current?.dispatchEvent(new window.MouseEvent('click', {
      bubbles: true, cancelable: true, view: window, detail: event.detail, button: middle ? 0 : event.button,
      metaKey: middle || event.metaKey, ctrlKey: middle || event.ctrlKey, shiftKey: event.shiftKey, altKey: event.altKey,
    }))
  }
  return <article className={`work-study-entry work-study-entry-${project.slug}`}
    onPointerDownCapture={event => { if (event.isPrimary && (event.button === 0 || event.button === 1)) activation.start(event.pointerId, event.clientX, event.clientY, event.pointerType) }}
    onPointerMoveCapture={event => activation.move(event.pointerId, event.clientX, event.clientY)}
    onPointerUpCapture={event => activation.end(event.pointerId, false)}
    onPointerCancelCapture={() => activation.interrupt()}
    onClickCapture={guardClick} onClick={clickContent} onAuxClickCapture={guardClick} onAuxClick={clickContent}
  >
    <a ref={link} className="work-entry-area" href={`#/work/${project.slug}`} aria-labelledby={`work-${project.slug}-title`} draggable={false} onClick={event => motion.explore(project, event)} />
    <WorkSculpture project={project} navigates />
    <div className="work-study-copy">
      <div className="work-study-text">
        <span className="work-study-tags">{project.category}</span>
        <h2 id={`work-${project.slug}-title`}>{project.slug === 'internshipdeadlines' ? <>Internship<wbr />Deadlines</> : project.name}</h2>
        <p>{project.summary}</p>
        {featured && <p className="work-study-role">{workContributions[project.slug]?.role}</p>}
        <DestinationCue className="work-study-link mono">{siteCopy.work.explore}</DestinationCue>
      </div>
    </div>
  </article>
}

function AtlasEntry() {
  const atlas = caseStudies.find(study => study.slug === 'atlas')!
  return <article className="work-curated-atlas">
    <a className="work-curated-atlas-link" href="#/work/atlas" aria-labelledby="work-atlas-title">
      <div className="work-study-text">
        <span className="work-study-tags">{atlas.category}</span>
        <h2 id="work-atlas-title">Atlas</h2>
        <p>I built a website crawler and local console for tracing findings back to their evidence.</p>
        <p className="work-study-role">{workContributions.atlas.role}</p>
        <DestinationCue className="work-study-link mono">{siteCopy.work.explore}</DestinationCue>
      </div>
      <figure className="work-atlas-preview">
        <figcaption><span>Two source captures</span><span>16 July 2026</span></figcaption>
        <div className="work-atlas-captures">
          {[0, 1].map(index => {
            const row = describeAtlasRow(index)
            return <div key={row.url}>
              <span className="mono">{index === 0 ? 'Static HTML' : 'JavaScript source'}</span>
              <strong>{String(row.source_quote_card_count).padStart(2, '0')}</strong>
              <p>Quote cards in source</p>
              <span className="work-atlas-response mono">{row.status_code} OK</span>
            </div>
          })}
        </div>
        <p>Both requests succeeded. Their captured content calls for different next steps.</p>
        <small>Retained HTML from Quotes to Scrape; this sample does not measure the rendered page.</small>
      </figure>
    </a>
  </article>
}

function ProjectEntries({ items, compact, supporting = false }: { items: Project[]; compact: boolean; supporting?: boolean }) {
  return <div className={`work-study-list ${compact ? 'work-study-list-compact' : ''} ${supporting ? 'work-study-list-supporting' : ''}`}>{items.map(project => <ProjectEntry key={project.slug} project={project} />)}</div>
}

export function SelectedWork({ dark }: { dark: boolean }) {
  return <section className="selected-work work-studies-home" id="selected-work" aria-label="Selected work">
    <WorkStage dark={dark} identity="selected-work">
      <div className="work-section-label"><span className="mono">{siteCopy.work.selectedLabel}</span><WorkMotionControl /></div><div className="work-collection-intro"><h2>{siteCopy.work.heading[0]}<br /><em>{siteCopy.work.heading[1]}</em></h2><p>{siteCopy.work.introduction}</p></div>
      <ProjectEntries items={projects.slice(0, 2)} compact />
      <div className="work-further" aria-label="More work">{projects.slice(2).map(project => <a key={project.slug} href={`#/work/${project.slug}`}><span>{project.name}</span><LinkArrow /></a>)}</div>
      <div className="section-tail"><DestinationLink className="arrow-link" href="#/work">{siteCopy.work.all}</DestinationLink></div>
    </WorkStage>
  </section>
}

export function WorkPage({ dark }: { dark: boolean }) {
  const internship = projects.find(project => project.slug === 'internshipdeadlines')!
  const sapien = projects.find(project => project.slug === 'sapien')!
  const supporting = projects.filter(project => !['internshipdeadlines', 'sapien'].includes(project.slug))
  return <section className="work-page work-studies-page">
    <header className="work-page-intro"><h1>{siteCopy.work.title}</h1><p>Selected contributions in product, engineering, and growth.</p></header>
    <WorkStage dark={dark} identity="work-collection">
      <div className="work-study-toolbar">
        <WorkMotionControl />
      </div>
      <div className="work-study-list work-curated-featured" aria-label="Featured projects">
        <ProjectEntry project={internship} featured />
        <AtlasEntry />
        <ProjectEntry project={sapien} featured />
      </div>
      <section className="work-curated-supporting" aria-labelledby="supporting-work-title">
        <header><h2 id="supporting-work-title">Studies & experiments</h2><p>Research in contracts and cash flows, and the graphics behind this site.</p></header>
        <ProjectEntries items={supporting} compact supporting />
      </section>
    </WorkStage>
  </section>
}

export function ProjectStudy({ project, dark }: { project: Project; dark: boolean }) {
  return <WorkStage dark={dark} identity={project.slug} className="work-studies-project"><WorkSculpture project={project} motionControl /></WorkStage>
}
