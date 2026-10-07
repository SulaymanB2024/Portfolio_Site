import { useEffect, useRef, useState } from 'react'
import type { ResumeChapterId } from './resume-chapters'
import type { mountResumeScene } from './resume-scene'

export default function ResumeSculpture({ chapter, dark }: { chapter: ResumeChapterId | null; dark: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<ReturnType<typeof mountResumeScene> | null>(null)
  const desired = useRef(chapter)
  desired.current = chapter
  const appearance = useRef(dark)
  appearance.current = dark
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [playing, setPlaying] = useState(true)
  const playback = useRef(playing)
  playback.current = playing
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    let cancelled = false
    void import('./resume-scene').then(({ mountResumeScene }) => {
      if (cancelled || !canvas.current) return
      controller.current = mountResumeScene(canvas.current, appearance.current, next => { if (!cancelled) setState(next) })
      controller.current.setPlaying(playback.current)
      controller.current.select(desired.current)
    }).catch(() => { if (!cancelled) setState('error') })
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null }
  }, [])
  useEffect(() => { controller.current?.select(chapter) }, [chapter])
  useEffect(() => { controller.current?.setDark(dark) }, [dark])
  useEffect(() => { controller.current?.setPlaying(playing) }, [playing])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => setReduced(media.matches)
    changed(); media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  return <div className="rx-sculpture" data-state={state}>
    <canvas ref={canvas} tabIndex={state === 'ready' ? 0 : -1} role="img" aria-label={`${chapter ? 'Experience' : 'Knight'} sculpture. Drag sideways or use arrow keys to rotate. Home resets the view.`} />
    <p className="sr-only" role="status">{state === 'loading' ? 'Loading sculpture.' : state === 'error' ? 'Sculpture unavailable. The résumé remains accessible.' : ''}</p>
    {state === 'ready' && !reduced && <button type="button" className="rx-playback" aria-label={playing ? 'Pause sculpture animation' : 'Play sculpture animation'} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>{playing ? 'Pause' : 'Play'}</button>}
    {!chapter && <details className="rx-art-credit"><summary>Artwork credit</summary><p>Animated study of <a href="https://sketchfab.com/3d-models/jousting-helmet-a4eea31d9d9441af9434a7da5ae46b54" target="_blank" rel="noreferrer">Jousting Helmet</a> · The Royal Armoury · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Display pose and animation added; original engraving retained.</p></details>}
  </div>
}
