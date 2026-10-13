import assert from 'node:assert/strict'
import { qualityHash, qualityReadingMinutes } from './article-quality-integrity.mjs'

// New research has no historical manuscript to restore or revise. Preserve its
// explicitly recorded initial edition without inventing revision provenance.
export function verifyInitialPublication(bytes, record) {
  assert.equal(qualityHash(bytes), record.articleSha256, `Unrecorded initial-edition change: ${record.slug}`)
  const article = JSON.parse(bytes)
  assert.equal(article.slug, record.slug)
  assert.equal(article.path, record.canonicalPath)
  assert.equal(article.date, record.datePublished)
  assert.equal(article.dateModified, record.dateModified)
  assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`)
  assert(article.author && article.seoTitle && article.seoDescription && article.evidenceBoundary)
  const sections = article.sections || []
  assert(sections.length && new Set(sections.map(section => section.id)).size === sections.length, `${record.slug}: missing or duplicate sections`)
  const sources = article.sources || []
  assert(sources.length && sources.every(source => source.id && source.href && /^https:\/\//.test(source.href)), `${record.slug}: primary-source ledger required`)
  assert.equal(new Set(sources.map(source => source.id)).size, sources.length, `${record.slug}: duplicate evidence identity`)
  const sourceIds = new Set(sources.map(source => `source-${source.id.toLowerCase()}`))
  for (const match of JSON.stringify(article).matchAll(/#(source-[\w-]+)/g)) assert(sourceIds.has(match[1]), `${record.slug}: unresolved evidence ${match[1]}`)
  return article
}
