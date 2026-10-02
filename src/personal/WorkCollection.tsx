import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { projects, type Project, type ProjectCategory } from './content'
import type { WorkStudyHandle } from './work-study-renderer'
import { useProjectArrival } from './ProjectTransition'
import { siteCopy } from './site-copy'
import { createStudyActivationGate } from './work-entry-activation'
import './work-studies.css'

type StudyController = { identity: string; registerActivation(cancel: () => void): () => void; reset(slug: string): void; spin(slug: string, spinning: boolean): void; playing: boolean; reduced: boolean; toggle(): void; open(project: Project): void; explore(project: Project, event: MouseEvent<HTMLAnchorElement>): void }
const StudyContext = createContext<StudyController | null>(null)

function WorkStage({ children, dark, identity, className = '' }: { children: ReactNode; dark: boolean; identity: string; className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<WorkStudyHandle | null>(null)
  const navigation = useProjectArrival()
  const transferred = useRef(false)
  const opening = useRef(false)
  const queuedActivations = useRef(new Set<() => void>())
  const [playing, setPlaying] = useState(true)
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
    const site = element.closest<HTMLElement>('.personal-site')
    let cancelled = false
    let starting = false
    const inherited = navigation.claim(element, identity)
    if (inherited) {
      surface.style.display = 'none'
      handle.current = inherited.handle
      playingRef.current = inherited.playing
      setPlaying(inherited.playing)
      return () => { handle.current?.dispose(); handle.current = null }
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      queuedActivations.current.forEach(cancel => cancel())
      if (!opening.current || transferred.current) return
      handle.current?.finishTransition()
      opening.current = false
      delete element.dataset.workOpening
      const slot = element.querySelector<HTMLElement>('[data-expanding]')
      if (slot) delete slot.dataset.expanding
      if (site) delete site.dataset.projectOpening
    }
    document.addEventListener('keydown', escape)
    const observer = new IntersectionObserver(entries => {
      if (starting || !entries.some(entry => entry.isIntersecting)) return
      starting = true
      observer.disconnect()
      import('./work-study-renderer').then(({ mountWorkStudies }) => {
        if (cancelled) return
        handle.current = mountWorkStudies(surface, element)
        handle.current.setPlaying(playingRef.current)
      }).catch(() => {
        if (cancelled) return
        surface.dataset.state = 'error'
        element.querySelectorAll<HTMLElement>('[data-work-study]').forEach(slot => { slot.dataset.state = 'error' })
      })
    }, { rootMargin: '180px' })
    observer.observe(element)
    return () => { cancelled = true; observer.disconnect(); document.removeEventListener('keydown', escape); if (!transferred.current) handle.current?.dispose(); transferred.current = false; handle.current = null; opening.current = false; delete element.dataset.workOpening; delete site?.dataset.projectOpening }
  }, [identity])
  useEffect(() => { handle.current?.setPlaying(playingRef.current) }, [playing])
  useEffect(() => { handle.current?.refresh() }, [dark])
  function open(project: Project) {
    if (opening.current) return
    const href = `#/work/${project.slug}`
    const stage = root.current
    const slot = stage?.querySelector<HTMLElement>(`[data-work-study="${project.slug}"]`)
    if (reduced || !handle.current || !stage || !slot || slot.dataset.state !== 'ready') {
      location.hash = href.slice(1)
      return
    }
    opening.current = true
    const appearance = getComputedStyle(stage)
    const paper = appearance.getPropertyValue('--paper').trim()
    const ink = appearance.getPropertyValue('--ink').trim()
    const site = stage.closest<HTMLElement>('.personal-site')
    if (site) site.dataset.projectOpening = 'true'
    slot.dataset.expanding = 'true'
    stage.dataset.workOpening = project.slug
    if (!handle.current.beginTransition(project.slug, flight => {
      transferred.current = true
      navigation.arrive({ ...flight, href, slug: project.slug, paper, ink })
    })) {
      delete stage.dataset.workOpening
      delete slot.dataset.expanding
      if (site) delete site.dataset.projectOpening
      opening.current = false
      location.hash = href.slice(1)
    }
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
  const [moving, setMoving] = useState(false)
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
  const label = `${project.name} sculpture. Drag or use arrow keys to ${moving ? 'move' : 'rotate'}. Home or double-click resets this object.`
  const slot = {
    ref: (node: HTMLElement | null) => { element.current = node },
    className: 'work-study-slot',
    'data-work-study': project.slug,
    'data-work-interactive': 'true',
    'data-work-gesture': moving ? 'move' : 'rotate',
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
      <span>{moving ? 'Drag to move' : 'Drag to rotate'}</span>
      <button className="work-gesture-control" disabled={!ready} aria-label={`Move ${project.name} sculpture`} aria-pressed={moving} title="Toggle between moving and rotating this object" onClick={() => setMoving(value => !value)}>Move</button>
      {motionControl && <WorkMotionControl />}
      <button disabled={!ready} aria-label={`Reset ${project.name} sculpture`} title="Reset this object" onClick={() => motion.reset(project.slug)}><span aria-hidden="true">↺</span></button>
    </div>
  </div>
}

function ProjectEntry({ project }: { project: Project }) {
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
      <span className="work-study-number mono" aria-hidden="true">{project.number}</span>
      <div className="work-study-text">
        <span className="work-study-tags mono">{project.tags.join(' / ')}</span>
        <h2 id={`work-${project.slug}-title`}>{project.slug === 'internshipdeadlines' ? <>Internship<wbr />Deadlines</> : project.name}</h2>
        <p>{project.summary}</p>
        <span className="work-study-link mono">{siteCopy.work.explore}<span aria-hidden="true">↗</span></span>
      </div>
    </div>
  </article>
}

function ProjectEntries({ items, compact }: { items: Project[]; compact: boolean }) {
  return <div className={`work-study-list ${compact ? 'work-study-list-compact' : ''}`}>{items.map(project => <ProjectEntry key={project.slug} project={project} />)}</div>
}

export function SelectedWork({ dark }: { dark: boolean }) {
  return <section className="selected-work work-studies-home" id="selected-work" aria-label="Selected work">
    <WorkStage dark={dark} identity="selected-work">
      <div className="work-section-label"><span className="mono">{siteCopy.work.selectedLabel}</span><WorkMotionControl /></div><div className="work-collection-intro"><h2>{siteCopy.work.heading[0]}<br /><em>{siteCopy.work.heading[1]}</em></h2><p>{siteCopy.work.introduction}</p></div>
      <ProjectEntries items={projects} compact />
      <div className="section-tail"><a className="arrow-link" href="#/work">{siteCopy.work.all}<span aria-hidden="true">→</span></a></div>
    </WorkStage>
  </section>
}

export function WorkPage({ dark }: { dark: boolean }) {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')
  const filters: (ProjectCategory | 'All')[] = ['All', 'Product', 'AI', 'Markets', 'Experiments']
  const visible = projects.filter(project => filter === 'All' || project.category === filter)
  return <section className="work-page work-studies-page">
    <h1 className="work-page-label">Work</h1>
    <WorkStage dark={dark} identity={filter}>
      <div className="work-study-toolbar">
        <div className="work-filters" role="group" aria-label="Filter work by category">{filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <div className="work-study-toolbar-end"><p className="work-count mono" role="status" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</p><WorkMotionControl /></div>
      </div>
      <ProjectEntries items={visible} compact={false} />
    </WorkStage>
  </section>
}

export function ProjectStudy({ project, dark }: { project: Project; dark: boolean }) {
  return <WorkStage dark={dark} identity={project.slug} className="work-studies-project"><WorkSculpture project={project} motionControl /></WorkStage>
}
