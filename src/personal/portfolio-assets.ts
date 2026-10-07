import urls from 'virtual:portfolio-runtime-urls'
import { requireGLBPath } from './model-asset'

/** Production addresses are content-addressed; local previews retain the source paths. */
export function portfolioAssetUrl(id: string) {
  const url = (urls as Record<string, string>)[id]
  if (!url) throw new Error(`Unknown portfolio model: ${id}`)
  return `${import.meta.env.BASE_URL}${requireGLBPath(url)}`
}
