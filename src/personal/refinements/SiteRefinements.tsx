import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { advanceHiddenWord } from './print-study'
import { installTextArrivals } from './motion'
import TopbarMotion from './TopbarMotion'
import { subscribeSiteTargets } from './site-targets'
import { installRouteWarmup } from './route-warmup'
import './refinements.css'

const PrintRoom = lazy(() => import('./PrintRoom'))

/** An isolated enhancement layer leaves route, artwork and copy owners independent. */
export default function SiteRefinements() {
  const [colophon, setColophon] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const openRoom = useCallback(() => { setHasOpened(true); setOpen(true) }, [])
  const [sky, setSky] = useState(false)
  const skyTimer = useRef(0)
  const showSky = useCallback(() => {
    window.clearTimeout(skyTimer.current)
    setSky(true)
    skyTimer.current = window.setTimeout(() => setSky(false), 2400)
  }, [])
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    const unsubscribe = subscribeSiteTargets(root, targets => setColophon(targets.colophon))
    const disposeMotion = installTextArrivals(root)
    const disposeWarmup = installRouteWarmup(root)
    return () => { unsubscribe(); disposeMotion(); disposeWarmup(); window.clearTimeout(skyTimer.current) }
  }, [])
  useEffect(() => {
    let buffer = ''
    let last = 0
    function key(event: KeyboardEvent) {
      if (open && event.key === 'Escape' && !event.defaultPrevented) {
        buffer = ''
        setOpen(false)
        return
      }
      const target = event.target as Element | null
      if (open || event.isComposing || event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || document.querySelector('[data-project-opening="true"], .project-arrival') || target?.closest('input, textarea, select, button, a, summary, canvas, [contenteditable], [role="textbox"], [data-work-interactive]')) { buffer = ''; return }
      const now = performance.now()
      if (now - last > 1800) buffer = ''
      last = now
      const next = advanceHiddenWord(buffer, event.key)
      buffer = next.buffer
      if (next.found === 'curious') openRoom()
      if (next.found === 'stargaze') showSky()
    }
    const leave = () => { setOpen(false); setSky(false); window.clearTimeout(skyTimer.current) }
    window.addEventListener('keydown', key)
    window.addEventListener('hashchange', leave)
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('hashchange', leave) }
  }, [open, openRoom, showSky])
  return <>
    <TopbarMotion />
    {colophon && createPortal(<button type="button" className="print-room-entry" onClick={openRoom}><span aria-hidden="true">⌖</span>For the curious<span aria-hidden="true">↗</span></button>, colophon)}
    {hasOpened && <Suspense fallback={null}><PrintRoom open={open} onClose={() => setOpen(false)} onSky={() => { setOpen(false); showSky() }} /></Suspense>}
    {sky && <div className="refinement-constellation" role="status"><svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M270 220 420 165 560 285 680 215 785 370M420 165 395 415 550 485 560 285M395 415 270 220" />{[[270,220],[420,165],[560,285],[680,215],[785,370],[395,415],[550,485]].map(([x,y],i) => <g key={i} style={{ animationDelay: `${i * 45}ms` }}><circle cx={x} cy={y} r={i === 2 ? 4 : 2.5} /><path d={`M${x-9} ${y}h18M${x} ${y-9}v18`} /></g>)}</svg><p>A brief constellation.</p></div>}
  </>
}
