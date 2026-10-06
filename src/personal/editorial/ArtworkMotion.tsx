import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import './artwork-motion.css'

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
  return <ArtworkMotion.Provider value={value}><svg className="artwork-ink-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="artwork-ink" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="marks" /><feComponentTransfer in="marks" result="drawn-marks"><feFuncA type="linear" slope="1.7" /></feComponentTransfer><feFlood floodColor="var(--ink)" result="ink" /><feComposite in="ink" in2="drawn-marks" operator="in" /></filter></defs></svg>{children}</ArtworkMotion.Provider>
}

export function useArtworkMotion() { return useContext(ArtworkMotion) }
