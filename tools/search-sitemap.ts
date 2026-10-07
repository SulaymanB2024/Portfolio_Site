import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { publicPages, siteOrigin } from '../src/personal/public-pages.ts'
import { sourceDate } from '../src/personal/search-metadata.ts'
import { readerModifiedDate } from '../src/personal/editorial/answer-notes.ts'
import { findReadingTopic } from '../src/personal/editorial/topics.ts'

export function documentModifiedDate(route: string) {
  const article = catalog.find(article => route === `writing/${article.slug}`)
  if (article) return sourceDate(readerModifiedDate(article.slug, article.dateModified) || article.date)
  const topic = route.startsWith('topics/') ? findReadingTopic(route.slice('topics/'.length)) : undefined
  return sourceDate(topic?.questionsUpdated)
}

export function searchSitemap() {
  // Only actual recorded content revisions are dated. Build time is irrelevant.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPages.map(page => {
    const modified = documentModifiedDate(page.route)
    return `<url><loc>${siteOrigin}${page.path}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`
  }).join('')}</urlset>\n`
}
