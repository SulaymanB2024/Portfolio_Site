import { useEffect, useRef, useState } from 'react'
import { identity } from './identity'
import { contextInterests } from './home-context-content'
import { interestHref } from './about/interest-route'
import { waitForObjectView } from './object-visibility'
import type { InterestId } from './about/about-content'
import type { mountContextObject } from './context-renderer'

export default function HomeContext() {
  const [selected, setSelected] = useState<InterestId>('bass')
  const [displayed, setDisplayed] = useState<InterestId | null>(null)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<ReturnType<typeof mountContextObject> | null>(null)
  const current = useRef({ selected, playing })
  current.current = { selected, playing }
  const interest = contextInterests.find(item => item.id === (displayed ?? selected))!
  const requested = contextInterests.find(item => item.id === selected)!

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(media.matches)
    change(); media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    let stopped = false
    if (!canvas.current) return
    const cancel = waitForObjectView(canvas.current, () => {
      void import('./context-renderer').then(({ mountContextObject }) => {
        if (stopped || !canvas.current) return
        controller.current = mountContextObject(canvas.current, value => { if (!stopped) setStatus(value) }, id => { if (!stopped) setDisplayed(id) })
        controller.current.select(current.current.selected)
        controller.current.setPlaying(current.current.playing)
      }).catch(() => { if (!stopped) setStatus('error') })
    })
    return () => { stopped = true; cancel(); controller.current?.dispose(); controller.current = null }
  }, [])
  useEffect(() => { controller.current?.select(selected) }, [selected])
  useEffect(() => { controller.current?.setPlaying(playing) }, [playing])

  return <section className="home-context" id="home-profile" aria-labelledby="home-profile-title">
    <div className="home-context-intro">
      <h2 id="home-profile-title" tabIndex={-1}>I’m Sulayman<span aria-hidden="true">.</span></h2>
      <p className="home-context-summary">{identity.homeSummary}</p>
      <nav className="home-context-work mono" aria-label="My experience"><a href="#/resume">Chegg<span aria-hidden="true"> / </span>Sapien<span aria-hidden="true"> / </span>VOID<span className="home-context-arrow" aria-hidden="true">↗</span></a></nav>
      <a className="home-context-about" href="#/about">About me<span aria-hidden="true">↗</span></a>
    </div>
    <div className="home-context-interests">
      <div className="home-context-stage" data-state={status}>
        <canvas ref={canvas} role="img" tabIndex={displayed ? 0 : -1} aria-hidden={!displayed} aria-label={`${interest.label} sculpture. Drag to turn, arrow keys to rotate, Home to reset.`} />
        <span className="home-context-turn mono" aria-hidden="true">Drag to turn</span>
        {status === 'error' && <p className="home-context-error">Explore the music and puzzles on my About page.</p>}
        <span className="sr-only" role="status">{status === 'loading' ? `Opening ${requested.label.toLowerCase()} sculpture.` : status === 'error' ? 'The sculpture is unavailable. The About links still work.' : ''}</span>
      </div>
      <div className="home-context-choices" aria-label="Outside my work">{contextInterests.map(item => <button key={item.id} type="button" aria-pressed={item.id === selected} aria-controls="home-interest-description" onClick={() => setSelected(item.id)}>{item.label}</button>)}</div>
      <div className="home-context-reveal" id="home-interest-description">{contextInterests.map(item => {
        const active = item.id === interest.id
        return <div key={item.id} className="home-context-reveal-panel" data-active={active} aria-hidden={!active} inert={!active}>
          <p aria-live={active ? 'polite' : 'off'}>{item.description}</p>
          <a className="mono" href={interestHref(item.id)}>{item.action}<span aria-hidden="true">→</span></a>
        </div>
      })}</div>
    </div>
    <div className="home-context-footer mono">
      <nav aria-label="Sulayman Bowles profiles">{identity.profiles.map(profile => <a key={profile.href} href={profile.href} rel="me noreferrer" target="_blank">{profile.label}<span aria-hidden="true">↗</span></a>)}</nav>
      <button type="button" aria-pressed={playing && !reduced} disabled={reduced} onClick={() => setPlaying(!playing)}>{playing && !reduced ? 'Pause motion' : 'Motion paused'}<span aria-hidden="true">{playing && !reduced ? 'Ⅱ' : '▷'}</span></button>
    </div>
  </section>
}
