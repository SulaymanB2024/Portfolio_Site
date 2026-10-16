import { useEffect, useRef, useState } from 'react'
import type { ResumeChapterId } from './resume-chapters'
import type { mountResumeScene } from './resume-scene'
import { resumeSculptureAssets } from './resume-sculpture-assets'

export default function ResumeSculpture({ chapter, dark, onUnavailable }: { chapter: ResumeChapterId | null; dark: boolean; onUnavailable?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const playbackButton = useRef<HTMLButtonElement>(null)
  const unavailable = useRef(onUnavailable)
  unavailable.current = onUnavailable
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
  const title = chapter ? resumeSculptureAssets[chapter].title : 'Engraved jousting helmet'
  const poster = `url("${import.meta.env.BASE_URL}art/helmet-ink.png")`

  useEffect(() => {
    let cancelled = false
    const updateStatus = (next: 'loading' | 'ready' | 'error') => {
      if (cancelled) return
      const active = document.activeElement
      if (next !== 'ready' && active && (active === canvas.current || active === playbackButton.current)) unavailable.current?.()
      setState(next)
    }
    void import('./resume-scene').then(({ mountResumeScene }) => {
      if (cancelled || !canvas.current) return
      controller.current = mountResumeScene(canvas.current, appearance.current, updateStatus)
      controller.current.setPlaying(playback.current)
      controller.current.select(desired.current)
    }).catch(() => updateStatus('error'))
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null }
  }, [])
  useEffect(() => { controller.current?.select(chapter) }, [chapter])
  useEffect(() => { controller.current?.setDark(dark) }, [dark])
  useEffect(() => { controller.current?.setPlaying(playing) }, [playing])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const changed = () => {
      if (media.matches && document.activeElement === playbackButton.current) canvas.current?.focus({ preventScroll: true })
      setReduced(media.matches)
    }
    changed(); media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }, [])

  return <div className="rx-sculpture" data-state={state}>
    <div className="rx-sculpture-poster" aria-hidden="true" style={{ maskImage: poster, WebkitMaskImage: poster }} />
    <canvas ref={canvas} tabIndex={state === 'ready' ? 0 : -1} role="img" aria-hidden={state !== 'ready'} aria-label={`${title}. Drag sideways or use arrow keys to rotate. Home resets the view.`} />
    <p className="sr-only" role="status">{state === 'loading' ? 'Loading sculpture.' : state === 'error' ? 'Sculpture unavailable. The résumé remains accessible.' : ''}</p>
    {state === 'ready' && !reduced && <button ref={playbackButton} type="button" className="rx-playback" aria-label={playing ? 'Pause sculpture animation' : 'Play sculpture animation'} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        {playing ? <><rect x="6" y="5" width="3" height="14" /><rect x="15" y="5" width="3" height="14" /></> : <path d="M7 4 20 12 7 20Z" />}
      </svg>
    </button>}
  </div>
}
