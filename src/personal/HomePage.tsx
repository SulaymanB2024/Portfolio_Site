import LandingSequence from './LandingSequence'
import HomeWriting from './HomeWriting'

export default function HomePage({ onLandingActiveChange }: { dark: boolean; onLandingActiveChange: (active: boolean) => void }) {
  return <>
    <LandingSequence onActiveChange={onLandingActiveChange} />
    <div className="home-standard-content"><HomeWriting /></div>
  </>
}
