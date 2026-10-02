import { useState } from 'react'
import AnimatedArtwork from './AnimatedArtwork'
import { useArtworkMotion } from './ArtworkMotion'
import type { GenerativeArtwork } from './generative/types'
import { artworkTransitionName } from './artwork-continuity'

export default function ArtCube({ artwork }: { artwork: GenerativeArtwork }) {
  const motion = useArtworkMotion()
  const [paused, setPaused] = useState(false)
  const [state, setState] = useState<'poster' | 'running' | 'paused' | 'fallback'>('poster')
  const stopped = paused || motion.paused
  function toggle() {
    if (stopped) { setPaused(false); motion.setPaused(false) }
    else setPaused(true)
  }
  return <figure className="article-art-cube" data-sketch={artwork.sketchId} data-treatment={artwork.treatment} data-art-state={state} data-embedded="true">
    <div className="art-cube-square"><AnimatedArtwork artwork={artwork} size={400} eager paused={stopped} embedded transitionName={artworkTransitionName(artwork)} onStateChange={setState} />{!motion.reduced && <button className="art-cube-control" aria-label={stopped ? 'Play artwork' : 'Pause artwork'} aria-pressed={!stopped} disabled={state === 'fallback'} onClick={toggle}><span aria-hidden="true">{stopped ? '▶' : 'Ⅱ'}</span></button>}</div>
    <figcaption><span>{artwork.title}</span><a href={artwork.attribution.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Original ${artwork.title} sketch by @yuruyurau`}>@yuruyurau ↗</a></figcaption>
  </figure>
}
