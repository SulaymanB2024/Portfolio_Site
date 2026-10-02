import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal, flushSync } from 'react-dom'
import type { WorkStudyFlight } from './work-study-renderer'
import './project-transition.css'

type Arrival = WorkStudyFlight & { href: string; slug: string; paper: string; ink: string }
type Navigation = { arrive(arrival: Arrival): void; claim(root: HTMLElement, slug: string): WorkStudyFlight | null }
const ProjectNavigation = createContext<Navigation>({ arrive() {}, claim: () => null })

/** The original canvas and scene travel across routes; no snapshot or second model. */
export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const [arrival, setArrival] = useState<Arrival | null>(null)
  const [docking, setDocking] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const pending = useRef<{ arrival: Arrival; root: HTMLElement | null } | null>(null)

  const complete = useCallback(() => {
    const current = pending.current
    if (!current) return
    pending.current = null
    if (current.root?.isConnected) current.root.prepend(current.arrival.canvas)
    else current.arrival.handle.dispose()
    setArrival(null)
  }, [])

  const claim = useCallback((root: HTMLElement, slug: string) => {
    const current = pending.current
    if (!current || current.root || current.arrival.slug !== slug || location.hash !== current.arrival.href) return null
    current.root = root
    if (!current.arrival.handle.dock(root, complete)) {
      current.root = null
      complete()
      return null
    }
    setDocking(true)
    return current.arrival
  }, [complete])

  useLayoutEffect(() => {
    if (arrival && host.current) host.current.replaceChildren(arrival.canvas)
  }, [arrival])

  useEffect(() => {
    if (!arrival) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const recover = () => {
      if (pending.current?.arrival !== arrival) return
      arrival.handle.finishTransition()
      complete()
    }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') recover() }
    const routeChanged = () => { if (location.hash !== arrival.href) recover() }
    const timeout = window.setTimeout(recover, 2200)
    document.addEventListener('keydown', escape)
    window.addEventListener('hashchange', routeChanged)
    return () => {
      window.clearTimeout(timeout)
      document.removeEventListener('keydown', escape)
      window.removeEventListener('hashchange', routeChanged)
      document.body.style.overflow = previousOverflow
    }
  }, [arrival, complete])

  useEffect(() => () => {
    pending.current?.arrival.handle.dispose()
    pending.current = null
  }, [])

  const arrive = useCallback((value: Arrival) => {
    pending.current?.arrival.handle.dispose()
    pending.current = { arrival: value, root: null }
    flushSync(() => { setDocking(false); setArrival(value) })
    location.hash = value.href.slice(1)
  }, [])
  const navigation = useMemo(() => ({ arrive, claim }), [arrive, claim])

  return <ProjectNavigation.Provider value={navigation}>{children}{arrival && createPortal(
    <div className={`project-arrival ${docking ? 'is-docking' : ''}`} style={{ '--arrival-paper': arrival.paper, color: arrival.ink } as CSSProperties} aria-hidden="true"><div ref={host} className="project-arrival-image" /></div>, document.body,
  )}</ProjectNavigation.Provider>
}

export const useProjectArrival = () => useContext(ProjectNavigation)
