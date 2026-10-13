import type { GenerativeArtwork } from './generative/types'
import { nativeArtworkPosterSource } from './artwork-poster-source'

export function ArtPoster({ artwork, eager = false, decorative = false, baseURL }: { artwork: GenerativeArtwork; eager?: boolean; decorative?: boolean; baseURL?: string }) {
  const base = baseURL ?? import.meta.env.BASE_URL
  return <img className="art-cube-poster" src={`${base}${nativeArtworkPosterSource(artwork.sketchId).replace(/^\//, '')}`} data-source-poster={`${base}${artwork.posterSrc.replace(/^\//, '')}`} alt={decorative ? '' : artwork.alt} width="400" height="400" loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
