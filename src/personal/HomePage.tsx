import LandingSequence from './LandingSequence'
import { lazy, Suspense } from 'react'

const HomeWriting = lazy(() => import('./HomeWriting'))

export default function HomePage({ onLandingActiveChange }: { dark: boolean; onLandingActiveChange: (active: boolean) => void }) {
  return <>
    <LandingSequence onActiveChange={onLandingActiveChange} />
    <div className="home-standard-content"><Suspense fallback={null}><HomeWriting /></Suspense></div>
  </>
}
