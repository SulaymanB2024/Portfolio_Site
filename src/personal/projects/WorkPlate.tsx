import type { CSSProperties } from 'react'
import { portfolioAssetUrl } from '../portfolio-assets'

/** Static impressions of the site's original GLBs: color comes from the page's ink. */
export function WorkPlate({ slug, className = '' }: { slug: string; className?: string }) {
  const revision = portfolioAssetUrl(`work-${slug}`).split('?')[1]
  const asset = `${import.meta.env.BASE_URL}images/work-plates/${slug}.webp?${revision}`
  return <div className={`work-plate ${className}`} style={{ '--work-plate': `url("${asset}")` } as CSSProperties} aria-hidden="true" />
}
