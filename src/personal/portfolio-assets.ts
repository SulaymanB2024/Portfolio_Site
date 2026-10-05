import urls from '../../public/portfolio-models/urls.json'
import { requireGLBPath } from './model-asset'

/** Asset URLs carry their content hash without changing the original study's paths. */
export function portfolioAssetUrl(id: string) {
  const url = (urls as Record<string, string>)[id]
  if (!url) throw new Error(`Unknown portfolio model: ${id}`)
  return `${import.meta.env.BASE_URL}${requireGLBPath(url)}`
}
