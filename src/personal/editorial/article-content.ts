import type { ArticleSource, WritingArticle } from './types.ts'
import { researchDatasets } from './research-datasets.ts'

export function articleDownloads(article: WritingArticle): { label: string; href: string; description?: string; format?: string }[] {
  return [...(article.resources || []), ...(article.supportingAssets || []), ...(article.researchAssets || []).flatMap(asset => asset.supportingAssets || []),
    ...(researchDatasets[article.slug] || []).map(({ label, href, description }) => ({ label, href, description, format: 'CSV' })),
  ]
    .filter((asset, index, items) => items.findIndex(item => item.href === asset.href) === index)
}

export function sourceAnchor(source: ArticleSource, index: number) {
  return `source-${source.id?.toLowerCase() || `s${index + 1}`}`
}
