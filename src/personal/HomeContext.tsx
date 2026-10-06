import { useEffect, useRef, useState } from 'react'
import { identity } from './identity'
import { contextInterests } from './home-context-content'
import { interestHref } from './about/interest-route'
import { waitForObjectView } from './object-visibility'
import type { mountContextObject } from './context-renderer'
import { readPortfolioRenderPolicy } from './mobile-render-policy'
import { DestinationLink } from './DestinationLink'

const interest = contextInterests.find(item => item.id === 'bass')!

export default function HomeContext() {
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
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
        controller.current = mountContextObject(canvas.current, value => { if (!stopped) setStatus(value) })
        controller.current.select('bass')
        controller.current.setPlaying(playingRef.current)
      }).catch(() => { if (!stopped) setStatus('error') })
    })
    return () => { stopped = true; cancel(); controller.current?.dispose(); controller.current = null }
  }, [])
  useEffect(() => { controller.current?.setPlaying(playing) }, [playing])

  return <section className="home-context" id="home-profile" aria-labelledby="home-profile-title">
    <div className="home-context-intro">
      <h2 id="home-profile-title" tabIndex={-1}>I’m Sulayman<span aria-hidden="true">.</span></h2>
      <p className="home-context-summary">{identity.homeSummary}</p>
      <DestinationLink className="home-context-about" href="#/about">About me</DestinationLink>
    </div>
    <div className="home-context-interests">
      <a className="home-context-stage" data-state={status} href={interestHref(interest.id)} aria-label={`Explore ${interest.label}`} aria-describedby="home-sculpture-instructions" draggable={false}>
        <canvas ref={canvas} aria-hidden="true" />
        <span id="home-sculpture-instructions" className="sr-only">Explore double bass on my About page. Drag horizontally or use arrow keys to rotate the sculpture; Home resets it.</span>
        {status === 'error' && <p className="home-context-error">Explore the music on my About page.</p>}
        <span className="sr-only" role="status">{status === 'loading' ? 'Opening double bass sculpture.' : status === 'error' ? 'The sculpture is unavailable. The About links still work.' : ''}</span>
      </a>
      <p className="home-context-caption">{interest.description}</p>
    </div>
  </section>
}
