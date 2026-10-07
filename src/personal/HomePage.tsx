import LandingSequence from './LandingSequence'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { PersonalProfile } from './PersonalProfile'
import { installHomeScrollMotion } from './home-scroll-motion'

const HomeWriting = lazy(() => import('./HomeWriting'))

export default function HomePage({ onLandingActiveChange }: { dark: boolean; onLandingActiveChange: (active: boolean) => void }) {
  const content = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const site = content.current?.closest<HTMLElement>('.home-site')
    if (site) return installHomeScrollMotion(site, { text: false, pointer: false })
  }, [])
  return <>
    <LandingSequence onActiveChange={onLandingActiveChange} />
    <div ref={content} className="home-standard-content"><PersonalProfile compact /><Suspense fallback={null}><HomeWriting /></Suspense></div>
  </>
}
