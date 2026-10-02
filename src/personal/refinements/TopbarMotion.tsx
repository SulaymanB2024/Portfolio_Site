import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { installNavigationMotion } from './navigation-motion'
import { subscribeSiteTargets } from './site-targets'
import './navigation-motion.css'

export default function TopbarMotion() {
  const [nav, setNav] = useState<HTMLElement | null>(null)
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    return subscribeSiteTargets(root, targets => setNav(targets.nav))
  }, [])
  useLayoutEffect(() => {
    const root = document.getElementById('root')
    if (root && nav && marker.current) return installNavigationMotion(root, nav, marker.current)
  }, [nav])
  return nav ? createPortal(<span ref={marker} className="nav-motion-marker" aria-hidden="true" />, nav) : null
}
