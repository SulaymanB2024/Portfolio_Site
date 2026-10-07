import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './artwork-motion.css'
import ArtworkInkDefinitions from './ArtworkInk'

const ArtworkMotion = createContext({ paused: false, revision: 0, reduced: false })

export function ArtworkMotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(preference.matches)
    preference.addEventListener('change', change)
    return () => preference.removeEventListener('change', change)
  }, [])
  const value = useMemo(() => ({ paused: false, revision: 0, reduced }), [reduced])
  return <ArtworkMotion.Provider value={value}><ArtworkInkDefinitions />{children}</ArtworkMotion.Provider>
}

export function useArtworkMotion() { return useContext(ArtworkMotion) }
