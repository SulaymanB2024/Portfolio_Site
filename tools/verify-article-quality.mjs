import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { qualityHash, protectedQualityEvidence, verifyQualityRevision } from './article-quality-integrity.mjs'

const json = path => JSON.parse(readFileSync(path, 'utf8'))
const manifest = json('docs/article-quality-revisions.json')
const catalog = json('src/personal/editorial/data/catalog.json')
const archived = json('src/personal/editorial/data/archived-catalog.json')
const retained = [...catalog, ...archived.filter(item => !catalog.some(active => active.slug === item.slug))]
assert.equal(manifest.records.length, retained.length)
assert.equal(new Set(manifest.records.map(item => item.slug)).size, retained.length)
const titles = new Set(), descriptions = new Set()
let units = 0
for (const record of manifest.records) {
  const baselineBytes = readFileSync(record.baselinePath), currentBytes = readFileSync(record.path)
  assert.equal(qualityHash(baselineBytes), record.baselineSha256, `Baseline drift: ${record.slug}`)
  assert.equal(qualityHash(currentBytes), record.currentSha256, `Unreviewed change: ${record.slug}`)
  const before = JSON.parse(baselineBytes), article = JSON.parse(currentBytes)
  assert.equal(qualityHash(JSON.stringify(protectedQualityEvidence(article))), record.evidenceSha256)
  units += verifyQualityRevision(before, article, record, manifest.exceptions)
  const summary = retained.find(item => item.slug === record.slug)
  assert(summary)
  for (const field of ['subtitle', 'seoTitle', 'seoDescription', 'readTime', 'date', 'dateModified', 'path', 'title', 'displayTitle']) assert.equal(summary[field], article[field], `${record.slug}: catalog ${field}`)
  assert(!titles.has(article.seoTitle) && !descriptions.has(article.seoDescription), `Duplicate search copy: ${record.slug}`)
  titles.add(article.seoTitle); descriptions.add(article.seoDescription)
}
console.log(`Article quality verified: ${manifest.records.length} revised bodies, ${units} prose units, distinct metadata, original evidence and publication cutoffs preserved; no files written.`)
