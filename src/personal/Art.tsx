import { useEffect, useRef, useState } from 'react'
import type { ArtKind } from './content'
import type { mountObject } from './object-renderer'

export function StillArt({ kind, className = '' }: { kind: ArtKind; className?: string }) {
  return <img className={`still-art ${className}`} src={`${import.meta.env.BASE_URL}art/${kind}.webp`} alt="" loading="lazy" width="600" height="600" />
}

function HelmetPoster() {
  return <span className="helmet-poster" aria-hidden="true" style={{ maskImage: `url(${import.meta.env.BASE_URL}art/helmet-ink.png)` }} />
}

export function Art({ kind, dark, className = '', flow = false, cameraDistanceScale = 1, onFlowReady, onRendered, onObjectStatus }: { kind: ArtKind; dark: boolean; className?: string; flow?: boolean; cameraDistanceScale?: number; onFlowReady?: (handler: (progress: number, drift: number) => void) => void; onRendered?: (time: number) => void; onObjectStatus?: (status: 'ready' | 'error') => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<ReturnType<typeof mountObject> | null>(null)
  const darkRef = useRef(dark)
  darkRef.current = dark
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [spinning, setSpinning] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { setReducedMotion(query.matches); if (query.matches) { handle.current?.setSpinning(false); setSpinning(false) } }
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    let cancelled = false
    let awaitingFirstPaint = false
    setStatus('loading')
    setSpinning(false)
    import('./object-renderer').then(({ mountObject }) => {
      if (cancelled || !canvas.current) return
      handle.current = mountObject(canvas.current, kind, darkRef.current, nextStatus => {
        if (cancelled) return
        // A loaded mesh still needs its first GPU frame before it can be revealed.
        awaitingFirstPaint = nextStatus === 'ready'
        if (nextStatus === 'error') {
          setStatus('error')
          onObjectStatus?.('error')
        }
      }, time => {
        if (cancelled) return
        if (awaitingFirstPaint) {
          awaitingFirstPaint = false
          setStatus('ready')
          onObjectStatus?.('ready')
        }
        onRendered?.(time)
      }, flow, cameraDistanceScale)
      onFlowReady?.((progress, drift) => handle.current?.setFlow(progress, drift))
    }).catch(() => { if (!cancelled) { setStatus('error'); onObjectStatus?.('error') } })
    return () => { cancelled = true; handle.current?.dispose(); handle.current = null }
  }, [kind, flow, cameraDistanceScale, onFlowReady, onRendered, onObjectStatus])
  useEffect(() => { handle.current?.setDark(dark) }, [dark])
  return <div className={`art-viewer ${className}`} data-status={status} aria-busy={status === 'loading'}>
    {kind === 'helmet' && !flow ? <HelmetPoster /> : status === 'error' && <StillArt kind={kind} className="art-fallback" />}
    <canvas ref={canvas} tabIndex={0} aria-label={`${kind} sculpture. Drag or use arrow keys to rotate. Home resets the view.`} />
    {status === 'loading' && <span className="sr-only" role="status">Loading 3D model.</span>}
    {status === 'error' && <span className="art-status" role="status">Object preview · interactive view unavailable</span>}
    <div className="object-controls">
      <span>Drag to rotate</span>
      <button disabled={status !== 'ready' || reducedMotion} aria-label={spinning ? 'Pause rotation' : 'Start rotation'} aria-pressed={spinning} title={reducedMotion ? 'Automatic rotation follows your reduced motion preference' : spinning ? 'Pause full rotation' : 'Play full rotation'} onClick={() => {
        handle.current?.setSpinning(!spinning); setSpinning(!spinning)
      }}><span aria-hidden="true">{spinning ? 'Ⅱ' : '▷'}</span></button>
      <button disabled={status !== 'ready'} aria-label="Reset object view" title="Reset to the starting angle" onClick={() => handle.current?.reset()}><span aria-hidden="true">↺</span></button>
    </div>
  </div>
}
