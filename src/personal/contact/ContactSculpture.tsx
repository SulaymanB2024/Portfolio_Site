import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ObjectHandle } from '../object-renderer'
import { readPortfolioRenderPolicy } from '../mobile-render-policy'
import { portfolioAssetUrl } from '../portfolio-assets'

export default function ContactSculpture({ dark, children }: { dark: boolean; children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldInput = useRef<HTMLInputElement>(null)
  const handle = useRef<ObjectHandle | null>(null)
  const darkRef = useRef(dark)
  darkRef.current = dark
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [mobile] = useState(() => readPortfolioRenderPolicy().mobile)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(() => readPortfolioRenderPolicy().autoplay && !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const playingRef = useRef(playing)
  playingRef.current = playing

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false) }
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    let cancelled = false
    let awaitingFirstPaint = false
    let lastField = -1
    import('../object-renderer').then(({ mountObject }) => {
      if (cancelled || !canvas.current) return
      handle.current = mountObject(canvas.current, 'headrest', darkRef.current, nextStatus => {
        if (cancelled) return
        awaitingFirstPaint = nextStatus === 'ready'
        if (nextStatus === 'error') setStatus('error')
      }, () => {
        if (!cancelled && awaitingFirstPaint) {
          awaitingFirstPaint = false
          setStatus('ready')
        }
        const value = Math.round((handle.current?.getField?.() ?? 0) * 100)
        if (!cancelled && playingRef.current && fieldInput.current && value !== lastField) {
          // Keep the control in step without re-rendering the page every animation frame.
          lastField = value
          fieldInput.current.value = String(value)
          fieldInput.current.setAttribute('aria-valuetext', `${value} percent dispersed`)
        }
      }, false, .86)
      handle.current.setFieldPlaying?.(playingRef.current)
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true; handle.current?.dispose(); handle.current = null }
  }, [])
  useEffect(() => { handle.current?.setDark(dark) }, [dark])
  useEffect(() => { handle.current?.setFieldPlaying?.(playing) }, [playing])

  return <div className="lion-study" data-status={status} data-playing={playing}>
    <link rel="preload" as="fetch" href={portfolioAssetUrl('headrest')} crossOrigin="anonymous" />
    <figure className="lion-study-stage" aria-busy={status === 'loading'}>
      <canvas ref={canvas} tabIndex={status === 'ready' ? 0 : -1} aria-hidden={status !== 'ready'} aria-label={`Three Lions, an etched 3D sculpture. ${mobile ? 'Swipe sideways' : 'Drag'} or use arrow keys to turn. Home resets the view.`} />
      {status !== 'ready' && <p className="lion-study-status mono" role="status">{status === 'loading' ? 'Gathering the ink…' : 'The sculpture is unavailable. Contact links are just below.'}</p>}
      <figcaption className="lion-study-description">Three lions slowly dissolve into ink and take shape again.</figcaption>
    </figure>
    {children}
    <div className="lion-study-caption">
      <details className="lion-study-credit"><summary><span className="lion-study-title">Three lions, in ink.</span><span className="mono">About the study <span aria-hidden="true">+</span></span></summary><p><a href="https://sketchfab.com/3d-models/201715-headrest-with-three-lions-31a9a4ae69834c42a4869d0610f32515" target="_blank" rel="noreferrer">Headrest with Three Lions ↗</a><br />Cleveland Museum of Art. A public-domain scan reworked as an etched surface and grains of ink.<br /><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">Original scan: CC0 · Public domain</a></p></details>
      <div className="lion-study-tools">
        <div className="lion-study-instructions mono"><span>{mobile ? 'Swipe sideways to turn' : playing ? 'Drag to turn' : 'Drag or use arrow keys to turn'}</span><button type="button" disabled={status !== 'ready' || reducedMotion} aria-label={playing ? 'Pause to explore the sculpture' : reducedMotion ? 'Motion off for reduced motion' : 'Play sculpture animation'} aria-expanded={!playing} aria-controls="lion-explore" title={reducedMotion ? 'Automatic motion is off for reduced motion' : undefined} onClick={() => setPlaying(!playing)}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause to explore' : reducedMotion ? 'Motion off' : 'Play animation'}</button></div>
        <div id="lion-explore" className="lion-study-explore" hidden={playing}>
        <label className="lion-study-field"><span className="mono">Form</span><input ref={fieldInput} type="range" min="0" max="100" step="1" defaultValue="0" disabled={status !== 'ready'} aria-label="Disperse the lion sculpture" aria-valuetext="0 percent dispersed" onPointerDown={() => { handle.current?.setFieldPlaying?.(false); setPlaying(false) }} onChange={event => { setPlaying(false); event.target.setAttribute('aria-valuetext', `${event.target.value} percent dispersed`); handle.current?.setField?.(Number(event.target.value) / 100) }} /><span className="mono">Field</span></label>
        <button className="lion-study-reset mono" type="button" disabled={status !== 'ready'} onClick={() => {
          handle.current?.reset(); handle.current?.setField?.(0); setPlaying(false)
          if (fieldInput.current) { fieldInput.current.value = '0'; fieldInput.current.setAttribute('aria-valuetext', '0 percent dispersed') }
        }}>Reset view <span aria-hidden="true">↺</span></button>
        </div>
      </div>
    </div>
  </div>
}
