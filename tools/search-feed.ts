import { siteOrigin } from '../src/personal/public-pages.ts'
import { sourceDate } from '../src/personal/search-metadata.ts'
import { identity } from '../src/personal/identity.ts'
import { withWritingCopy } from '../src/personal/site-copy.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'
import { readerModifiedDate } from '../src/personal/editorial/answer-notes.ts'

const xml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]!))
const timestamp = (value: string) => {
  const date = sourceDate(value)
  if (!date) throw new Error(`Invalid feed content date: ${value}`)
  return `${date}T00:00:00Z`
}

// Entry identity and dates follow published records; rebuilds do not look new.
export function writingFeed(articles: ArticleSummary[]) {
  if (!articles.length) throw new Error('A writing feed needs published articles')
  const entries = articles.map(withWritingCopy).map(article => {
    const published = timestamp(article.date)
    const updated = timestamp(readerModifiedDate(article.slug, article.dateModified) || article.date)
    if (updated < published) throw new Error(`Feed modification predates publication: ${article.slug}`)
    const url = new URL(article.path, siteOrigin)
    if (url.origin !== siteOrigin || url.search || url.hash) throw new Error(`Invalid canonical feed path: ${article.path}`)
    return { article, published, updated, url: url.href }
  }).sort((a, b) => b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published) || a.url.localeCompare(b.url))
  if (new Set(entries.map(entry => entry.url)).size !== entries.length) throw new Error('Duplicate feed entry')
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-US">
  <id>${siteOrigin}/writing</id>
  <title>${xml(identity.name)} — Writing</title>
  <subtitle>Essays on software, AI systems, and markets.</subtitle>
  <link rel="self" type="application/atom+xml" href="${siteOrigin}/feed.xml" />
  <link rel="alternate" type="text/html" href="${siteOrigin}/writing" />
  <author><name>${xml(identity.name)}</name><uri>${siteOrigin}/about</uri></author>
  <updated>${entries[0].updated}</updated>
${entries.map(({ article, published, updated, url }) => `  <entry>
    <id>${xml(url)}</id>
    <title>${xml(article.displayTitle || article.title)}</title>
    <link rel="alternate" type="text/html" href="${xml(url)}" />
    <published>${published}</published><updated>${updated}</updated>
    <summary type="text">${xml(article.subtitle)}</summary>
  </entry>`).join('\n')}
</feed>\n`
}
