import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { originalFields, protectedArticleEvidence } from './article-revision-integrity.mjs'
import { verifyCodeLabelReadback } from './article-code-label-integrity.mjs'

const read = path => readFileSync(path, 'utf8')
const hash = value => createHash('sha256').update(value).digest('hex')
const manifest = JSON.parse(read('docs/article-restoration.json'))
const catalog = JSON.parse(read('src/personal/editorial/data/catalog.json'))
const archived = JSON.parse(read('src/personal/editorial/data/archived-catalog.json'))
const retained = [...catalog, ...archived.filter(item => !catalog.some(active => active.slug === item.slug))]
const revisions = JSON.parse(read('docs/article-revisions.json')).records
const quality = JSON.parse(read('docs/article-quality-revisions.json')).records
for (const file of manifest.sourceFiles) {
  assert.equal(hash(execFileSync('git', ['show', `${manifest.sourceRef}:${file.path}`], { maxBuffer: 4 * 1024 * 1024 })), file.sha256, `Original source drift: ${file.path}`)
}
for (const record of manifest.records) {
  const bytes = readFileSync(`src/personal/editorial/data/articles/${record.slug}.json`)
  verifyCodeLabelReadback(bytes)
  const article = JSON.parse(bytes)
  const revision = revisions.find(item => item.slug === record.slug)
  const original = revision ? JSON.parse(read(revision.originalPath)) : article
  assert.equal(hash(JSON.stringify(originalFields(original, record.sourceKeys))), record.originalSha256, `Original manuscript drift: ${record.slug}`)
  if (revision) {
    assert.equal(revision.originalSha256, record.originalSha256, `Unbound editorial revision: ${record.slug}`)
    assert.equal(hash(readFileSync(`src/personal/editorial/data/articles/${record.slug}.json`)), revision.currentSha256, `Unrecorded editorial change: ${record.slug}`)
    assert.equal(hash(JSON.stringify(protectedArticleEvidence(article, record.sourceKeys))), revision.evidenceSha256, `Edited evidence drift: ${record.slug}`)
    assert.deepEqual(protectedArticleEvidence(article, record.sourceKeys), protectedArticleEvidence(original, record.sourceKeys), `Original evidence changed: ${record.slug}`)
  }
  assert(retained.some(item => item.slug === record.slug && item.path === record.path), `Missing recovered record: ${record.slug}`)
}
for (const record of manifest.retained) {
  const revision = quality.find(item => item.slug === record.slug)
  assert(revision, `Missing reviewed-source revision: ${record.slug}`)
  assert.equal(hash(readFileSync(revision.baselinePath)), record.sha256, `Reviewed original drift: ${record.slug}`)
  assert.equal(hash(readFileSync(revision.path)), revision.currentSha256, `Unrecorded reviewed-source edit: ${record.slug}`)
}
const article = JSON.parse(read(`src/personal/editorial/data/articles/${manifest.html.slug}.json`))
const htmlBaseline = JSON.parse(read(quality.find(item => item.slug === manifest.html.slug).baselinePath))
const original = manifest.html.sourceFragments.map(path => execFileSync('git', ['show', `${manifest.sourceRef}:${path}`], { encoding: 'utf8' })).join('')
const body = original.match(/<article\b[^>]*id="article"[^>]*>([\s\S]*?)<\/article>/)?.[1]
assert(body, 'Missing original toll-road manuscript')
assert.equal(hash(htmlBaseline.htmlBody), manifest.html.sha256)
assert.equal(htmlBaseline.htmlBody.trim(), body.trim(), 'HTML recovery archive changed original material')
for (const id of manifest.html.ids) assert(article.htmlBody.includes(`id="${id}"`), `Lost original target: ${id}`)
for (const asset of manifest.assets) assert.equal(hash(readFileSync(`public${asset.href}`)), asset.sha256, `Original figure/download drift: ${asset.href}`)
for (const excluded of manifest.excluded) assert(!catalog.some(article => article.slug === excluded.slug), `Unverified candidate promoted: ${excluded.slug}`)
console.log(`Article verification passed: ${manifest.restoredCount} original recoveries audited, ${revisions.length} recorded source revisions, ${manifest.retained.length} reviewed-source archives and ${manifest.assets.length} unchanged assets; no files written.`)
