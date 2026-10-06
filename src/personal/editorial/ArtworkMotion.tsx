import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './artwork-motion.css'
import ArtworkInkDefinitions from './ArtworkInk'
import { readPortfolioRenderPolicy } from '../mobile-render-policy'

const ArtworkMotion = createContext({ paused: false, revision: 0, reduced: false, setPaused: (_paused: boolean) => {} })

export function ArtworkMotionProvider({ children }: { children: ReactNode }) {
  const [playback, setPlayback] = useState(() => ({ paused: !readPortfolioRenderPolicy().autoplay, revision: 0 }))
  const setPaused = useCallback((paused: boolean) => setPlayback(previous => ({ paused, revision: previous.revision + 1 })), [])
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(preference.matches)
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])
  const value = useMemo(() => ({ ...playback, reduced, setPaused }), [playback, reduced, setPaused])
  return <ArtworkMotion.Provider value={value}><ArtworkInkDefinitions />{children}</ArtworkMotion.Provider>
}

export function useArtworkMotion() { return useContext(ArtworkMotion) }

export function ArtworkMotionControl() {
  const { paused, reduced, setPaused } = useArtworkMotion()
  if (reduced) return null
  return <button className="artwork-motion-control mono" aria-label={paused ? 'Play all article artwork' : 'Pause all article artwork'} aria-pressed={!paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>{paused ? 'Play art' : 'Pause art'}</button>
}
