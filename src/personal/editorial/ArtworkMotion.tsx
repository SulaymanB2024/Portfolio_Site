import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './artwork-motion.css'

const ArtworkMotion = createContext({ paused: false, reduced: false, setPaused: (_paused: boolean) => {} })

export function ArtworkMotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(preference.matches)
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])
  const value = useMemo(() => ({ paused, reduced, setPaused }), [paused, reduced])
  return <ArtworkMotion.Provider value={value}><svg className="artwork-ink-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="artwork-ink" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="marks" /><feFlood floodColor="var(--ink)" result="ink" /><feComposite in="ink" in2="marks" operator="in" /></filter></defs></svg>{children}</ArtworkMotion.Provider>
}

export function useArtworkMotion() { return useContext(ArtworkMotion) }

export function ArtworkMotionControl() {
  const { paused, reduced, setPaused } = useArtworkMotion()
  if (reduced) return null
  return <button className="artwork-motion-control mono" aria-label={paused ? 'Play all article artwork' : 'Pause all article artwork'} aria-pressed={!paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>{paused ? 'Play art' : 'Pause art'}</button>
}
