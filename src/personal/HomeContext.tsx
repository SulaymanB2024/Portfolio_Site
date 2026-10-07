import { useEffect, useRef, useState } from 'react'
import { identity } from './identity'
import { contextInterests } from './home-context-content'
import { interestHref } from './about/interest-route'
import { waitForObjectView } from './object-visibility'
import type { mountContextObject } from './context-renderer'
import { readPortfolioRenderPolicy } from './mobile-render-policy'
import { DestinationCue, DestinationLink } from './DestinationLink'

const interest = contextInterests.find(item => item.id === 'bass')!

export default function HomeContext() {
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [reloadRequired, setReloadRequired] = useState(false)
  const stage = useRef<HTMLAnchorElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<ReturnType<typeof mountContextObject> | null>(null)
  const playingRef = useRef(playing)
  playingRef.current = playing

  useEffect(() => {
    setPlaying(readPortfolioRenderPolicy().autoplay)
  }, [])
  useEffect(() => {
    let stopped = false
    if (!canvas.current) return
    const cancel = waitForObjectView(canvas.current, () => {
      void import('./context-renderer').then(({ mountContextObject }) => {
        if (stopped || !canvas.current) return
        setReloadRequired(false)
        controller.current = mountContextObject(canvas.current, value => { if (!stopped) setStatus(value) })
        controller.current.select('bass')
        controller.current.setPlaying(playingRef.current)
      }, () => {
        if (stopped) return
        // Browsers retain a rejected module fetch until the document reloads.
        setReloadRequired(true)
        setStatus('error')
      }).catch(() => { if (!stopped) setStatus('error') })
    })
    return () => { stopped = true; cancel(); controller.current?.dispose(); controller.current = null }
  }, [attempt])
  useEffect(() => { controller.current?.setPlaying(playing) }, [playing])

  function retry() {
    if (reloadRequired) { location.reload(); return }
    setStatus('loading')
    setAttempt(value => value + 1)
    stage.current?.focus({ preventScroll: true })
  }

  return <section className="home-context" id="home-profile" aria-labelledby="home-profile-title">
    <div className="home-context-intro">
      <h2 id="home-profile-title" tabIndex={-1}><span className="home-context-greeting">I’m</span>{' '}<span className="home-context-name">Sulayman<span aria-hidden="true">.</span></span></h2>
      <p className="home-context-summary">{identity.homeSummary}</p>
      <DestinationLink className="home-context-about" href="#/about">About me</DestinationLink>
    </div>
    <div className="home-context-interests">
    <a ref={stage} className="home-context-music" href={interestHref(interest.id)} aria-label={`Explore music — ${interest.label.toLowerCase()}`} aria-describedby="home-sculpture-instructions" draggable={false}>
      <div className="home-context-stage" data-state={status}>
        <span className="home-context-frame">
          <span className="home-context-poster" aria-hidden="true" />
          <canvas key={attempt} ref={canvas} aria-hidden="true" />
        </span>
        <span className="home-context-gesture" aria-hidden="true">
          <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 2 3 6l4 4M17 2l4 4-4 4" /></svg>
          <span className="home-context-gesture-pointer">Drag to turn</span>
          <span className="home-context-gesture-touch">Swipe sideways to turn</span>
          <span className="home-context-gesture-keyboard">Arrow keys to turn</span>
        </span>
        <span id="home-sculpture-instructions" className="sr-only">Explore double bass on my About page. Drag horizontally or use arrow keys to rotate the sculpture; Home resets it.</span>
        <span className="sr-only" role="status">{status === 'loading' ? 'Opening double bass sculpture.' : status === 'error' ? 'The sculpture is unavailable. The About links still work.' : ''}</span>
      </div>
      <p className="home-context-caption">{interest.description}</p>
      <DestinationCue className="home-context-music-link">Explore music</DestinationCue>
    </a>
    {status === 'error' && <div className="home-context-recovery">
      <p>The moving sculpture couldn’t load.</p>
      <button type="button" onClick={retry} aria-label={reloadRequired ? 'Reload page to retry double bass sculpture' : 'Retry double bass sculpture'}>{reloadRequired ? 'Reload page' : 'Try again'}</button>
    </div>}
    </div>
  </section>
}
