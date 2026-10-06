import catalog from './data/catalog.json'
import { restoredArticleHtml } from './restored-html'
import type { ArticleSummary } from './types'

export default function RestoredArticleBody({ html, baseUrl = '/' }: { html: string; baseUrl?: string }) {
  return <div className="reader-restored-html" dangerouslySetInnerHTML={{ __html: restoredArticleHtml(html, catalog as ArticleSummary[], baseUrl) }} />
}
