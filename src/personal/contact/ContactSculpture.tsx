import { useEffect, useRef, useState } from 'react'
import type { ObjectHandle } from '../object-renderer'

export default function ContactSculpture({ dark }: { dark: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fieldInput = useRef<HTMLInputElement>(null)
  const handle = useRef<ObjectHandle | null>(null)
  const darkRef = useRef(dark)
  darkRef.current = dark
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
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
        const value = Math.round((handle.current?.getField?.() ?? .42) * 100)
        if (!cancelled && playingRef.current && fieldInput.current && value !== lastField) {
          // Keep the control in step without re-rendering the page every animation frame.
          lastField = value
          fieldInput.current.value = String(value)
          fieldInput.current.setAttribute('aria-valuetext', `${value} percent dispersed`)
        }
      }, false, .7)
      handle.current.setFieldPlaying?.(playingRef.current)
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true; handle.current?.dispose(); handle.current = null }
  }, [])
  useEffect(() => { handle.current?.setDark(dark) }, [dark])
  useEffect(() => { handle.current?.setFieldPlaying?.(playing) }, [playing])

  return <figure className="lion-study" data-status={status}>
    <div className="lion-study-stage" aria-busy={status === 'loading'}>
      <canvas ref={canvas} tabIndex={status === 'ready' ? 0 : -1} aria-hidden={status !== 'ready'} aria-label="Three Lions, an etched 3D sculpture. Drag or use arrow keys to turn. Home resets the view." />
      {status !== 'ready' && <p className="lion-study-status mono" role="status">{status === 'loading' ? 'Gathering the ink…' : 'The sculpture is unavailable. Contact links remain below.'}</p>}
    </div>
    <figcaption className="lion-study-caption">
      <details className="lion-study-credit"><summary><span className="lion-study-title">Three lions, in ink.</span><span className="mono">After a headrest in the Cleveland Museum of Art <span aria-hidden="true">+</span></span></summary><p><a href="https://sketchfab.com/3d-models/201715-headrest-with-three-lions-31a9a4ae69834c42a4869d0610f32515" target="_blank" rel="noreferrer">Headrest with Three Lions ↗</a><br />Reworked as an etched surface and 42,000 points sampled from the sculpture.<br /><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">Original scan: CC0 · Public domain</a></p></details>
      <div className="lion-study-tools">
        <label className="lion-study-field"><span className="mono">Form</span><input ref={fieldInput} type="range" min="0" max="100" step="1" defaultValue="42" disabled={status !== 'ready'} aria-label="Disperse the lion sculpture" aria-valuetext="42 percent dispersed" onPointerDown={() => { handle.current?.setFieldPlaying?.(false); setPlaying(false) }} onChange={event => { setPlaying(false); event.target.setAttribute('aria-valuetext', `${event.target.value} percent dispersed`); handle.current?.setField?.(Number(event.target.value) / 100) }} /><span className="mono">Field</span></label>
        <div className="lion-study-instructions mono"><span>Drag to turn</span><div>
          <button type="button" disabled={status !== 'ready' || reducedMotion} aria-label={playing ? 'Pause sculpture animation' : 'Play sculpture animation'} title={reducedMotion ? 'Automatic motion is off for reduced motion' : undefined} onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" disabled={status !== 'ready'} onClick={() => {
            handle.current?.reset(); handle.current?.setField?.(.42); setPlaying(false)
            if (fieldInput.current) { fieldInput.current.value = '42'; fieldInput.current.setAttribute('aria-valuetext', '42 percent dispersed') }
          }}>Reset <span aria-hidden="true">↺</span></button>
        </div></div>
      </div>
    </figcaption>
  </figure>
}
