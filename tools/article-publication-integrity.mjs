import assert from 'node:assert/strict'
import { qualityHash, qualityReadingMinutes } from './article-quality-integrity.mjs'

// New research has no historical manuscript to restore or revise. Preserve its
// explicitly recorded initial edition without inventing revision provenance.
export function verifyInitialPublication(bytes, record) {
  const receipt = publicationReceipt(record)
  assert.equal(qualityHash(bytes), receipt.articleSha256, `Unrecorded publication change: ${record.slug}`)
  const article = JSON.parse(bytes)
  assert.equal(article.slug, record.slug)
  assert.equal(article.path, record.canonicalPath)
  assert.equal(article.date, record.datePublished)
  assert.equal(article.dateModified, receipt.dateModified)
  assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`)
  assert(article.author && article.seoTitle && article.seoDescription && article.evidenceBoundary)
  const sections = article.sections || article.markdownSections || []
  assert(sections.length && new Set(sections.map(section => section.id)).size === sections.length, `${record.slug}: missing or duplicate sections`)
  const tables = new Set((article.tables || []).map(table => table.id))
  assert.equal(tables.size, (article.tables || []).length, `${record.slug}: duplicate table identity`)
  for (const section of sections) for (const block of section.blocks || []) {
    if (block.kind === 'table') assert(tables.has(block.tableId), `${record.slug}: unresolved table ${block.tableId}`)
  }
  const sources = article.sources || []
  assert(sources.length && sources.every(source => source.id && source.href && /^https:\/\//.test(source.href)), `${record.slug}: primary-source ledger required`)
  assert.equal(new Set(sources.map(source => source.id)).size, sources.length, `${record.slug}: duplicate evidence identity`)
  const sourceIds = new Set(sources.map(source => `source-${source.id.toLowerCase()}`))
  for (const match of JSON.stringify(article).matchAll(/#(source-[\w-]+)/g)) assert(sourceIds.has(match[1]), `${record.slug}: unresolved evidence ${match[1]}`)
  return article
}

// A historical exclusion protects that manuscript and URL. A later, separately
// reviewed edition may share its slug only at a different canonical path, with
// no alias that silently revives the excluded URL.
export function verifyRestorationExclusions(exclusions, catalog, publications, readArticle) {
  for (const excluded of exclusions) for (const summary of catalog.filter(article => article.slug === excluded.slug)) {
    assert(excluded.path && summary.path !== excluded.path && !summary.aliases?.includes(excluded.path), `Unverified historical candidate promoted: ${excluded.slug}`)
    const receipt = publications.find(record => record.slug === summary.slug && record.canonicalPath === summary.path)
    assert(receipt, `Different-path candidate requires an initial-publication receipt: ${excluded.slug}`)
    const article = verifyInitialPublication(readArticle(receipt.path), receipt)
    assert.equal(article.path, summary.path, `${excluded.slug}: admitted edition path`)
  }
}

// Keep the original receipt immutable. Later reviewed editions form an explicit
// hash chain with a reason and primary evidence; the publication date stays fixed.
export function publicationReceipt(record) {
  let articleSha256 = record.articleSha256
  let dateModified = record.dateModified
  assert(/^[a-f0-9]{64}$/.test(articleSha256), `${record.slug}: invalid initial hash`)
  for (const update of record.updates || []) {
    assert.equal(update.previousSha256, articleSha256, `${record.slug}: broken update chain`)
    assert(/^[a-f0-9]{64}$/.test(update.articleSha256) && update.articleSha256 !== articleSha256, `${record.slug}: invalid updated hash`)
    assert(/^\d{4}-\d{2}-\d{2}$/.test(update.dateModified) && update.dateModified >= dateModified, `${record.slug}: invalid update date`)
    assert(!Number.isNaN(Date.parse(update.dateModified)) && new Date(`${update.dateModified}T00:00:00Z`).toISOString().slice(0, 10) === update.dateModified, `${record.slug}: impossible update date`)
    assert(update.reason?.trim().length >= 20, `${record.slug}: explain the material update`)
    assert(update.evidence?.length && update.evidence.every(url => /^https:\/\//.test(url)), `${record.slug}: primary update evidence required`)
    articleSha256 = update.articleSha256
    dateModified = update.dateModified
  }
  return { articleSha256, dateModified }
}
