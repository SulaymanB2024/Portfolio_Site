import type { GenerativeArtwork } from './generative/types'

export function ArtPoster({ artwork, eager = false, decorative = false }: { artwork: GenerativeArtwork; eager?: boolean; decorative?: boolean }) {
  return <img className="art-cube-poster" src={`${import.meta.env.BASE_URL}${artwork.posterSrc.replace(/^\//, '')}`} alt={decorative ? '' : artwork.alt} width="400" height="400" loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
