import { useState } from 'react'
import AnimatedArtwork from './AnimatedArtwork'
import { useArtworkMotion } from './ArtworkMotion'
import type { GenerativeArtwork } from './generative/types'
import { artworkTransitionName } from './artwork-continuity'

export default function ArtCube({ artwork }: { artwork: GenerativeArtwork }) {
  const motion = useArtworkMotion()
  const [choice, setChoice] = useState<{ revision: number; paused: boolean } | null>(null)
  const [state, setState] = useState<'poster' | 'running' | 'paused' | 'fallback'>('poster')
  const stopped = choice?.revision === motion.revision ? choice.paused : motion.paused
  function toggle() {
    setChoice({ revision: motion.revision, paused: !stopped })
  }
  return <figure className="article-art-cube" data-sketch={artwork.sketchId} data-treatment={artwork.treatment} data-art-state={state} data-embedded="true">
    <div className="art-cube-square"><AnimatedArtwork artwork={artwork} size={400} eager paused={stopped} embedded transitionName={artworkTransitionName(artwork)} onStateChange={setState} /></div>
    <figcaption><div className="art-cube-credit"><span>{artwork.title}</span><a href={artwork.attribution.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Original ${artwork.title} sketch by @yuruyurau`}>@yuruyurau ↗</a></div>{!motion.reduced && <button className="art-cube-control" aria-label={stopped ? 'Play artwork' : 'Pause artwork'} aria-pressed={!stopped} disabled={state === 'fallback'} onClick={toggle}><span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span>{stopped ? 'Play' : 'Pause'}</button>}</figcaption>
  </figure>
}
