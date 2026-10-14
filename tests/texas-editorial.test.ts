import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { qualityHash } from '../tools/article-quality-integrity.mjs'
import { publicationReceipt, verifyInitialPublication } from '../tools/article-publication-integrity.mjs'
import { publicClaims, publicationBundlePath, reviewQueue, reviewedUpdate } from '../tools/texas-editorial.mjs'

const publications = JSON.parse(readFileSync(new URL('../docs/article-publications.json', import.meta.url), 'utf8'))
const original = publications.records.find((record: any) => record.slug === 'texas-business-court-contract-decisions')
const article = JSON.parse(readFileSync(new URL(`../${original.path}`, import.meta.url), 'utf8'))

test('a new library edition preserves the legacy download and scopes writes to research JSON', () => {
  assert.equal(publicationBundlePath({}), 'public/research/texas-business-library-2026-10-12.json')
  assert.equal(publicationBundlePath({ bundlePath: 'public/research/texas-autonomy-library-2026-10-13.json' }), 'public/research/texas-autonomy-library-2026-10-13.json')
  for (const path of ['docs/private.json', 'public/research/../private.json', 'public/research/index.html', '/public/research/library.json']) {
    assert.throws(() => publicationBundlePath({ bundlePath: path }))
  }
})

test('manual review queue treats dates as reminders and rejects impossible dates', () => {
  const library = { articles: [{ slug: 'one', pillar: 'Infrastructure', reviewBy: '2026-10-19', triggers: ['New order'] }] }
  assert.equal(reviewQueue(library, '2026-10-12')[0].status, 'upcoming')
  assert.equal(reviewQueue(library, '2026-10-19')[0].status, 'due')
  assert.throws(() => reviewQueue(library, '2026-02-30'))
})

test('public claim projection excludes private context and operational fields', () => {
  const publicData = publicClaims({ workRecord: { private: 'outside' }, claims: [{ id: 'a', claim: 'Public fact', primaryUrl: 'https://example.org/authority', qualification: 'Scope', contextRead: 'private', sources: [{ url: 'https://example.org/authority', date: '2026-10-12', workRecord: 'private' }] }] })
  assert.equal(publicData[0].sources[0].url, 'https://example.org/authority')
  assert(!JSON.stringify(publicData).includes('private'))
  assert(!JSON.stringify(publicData).includes('workRecord'))
})

test('reviewed updates preserve the initial receipt and canonical publication identity', () => {
  const updatedArticle = structuredClone(article)
  updatedArticle.dateModified = '2026-10-19'
  updatedArticle.content[0] += ' This sentence represents a reviewed editorial clarification.'
  const bytes = Buffer.from(JSON.stringify(updatedArticle, null, 2) + '\n')
  const updated = reviewedUpdate(original, updatedArticle, bytes, { reason: 'Clarify the dated scope after reviewing the controlling authority.', evidence: [article.sources[0].href] })
  assert.equal(updated.articleSha256, original.articleSha256)
  assert.equal(publicationReceipt(updated).articleSha256, qualityHash(bytes))
  verifyInitialPublication(bytes, updated)
  assert.throws(() => verifyInitialPublication(bytes, original))
  const broken = structuredClone(updated); broken.updates[0].previousSha256 = '0'.repeat(64)
  assert.throws(() => publicationReceipt(broken))
  const impossible = structuredClone(updated); impossible.updates[0].dateModified = '2026-11-31'
  assert.throws(() => publicationReceipt(impossible))
  for (const field of ['path', 'date']) {
    const wrong = structuredClone(updatedArticle); wrong[field] += '-changed'
    assert.throws(() => reviewedUpdate(original, wrong, Buffer.from(JSON.stringify(wrong)), { reason: 'A material update with reviewed primary evidence.', evidence: [article.sources[0].href] }))
  }
})

test('receipt creation rejects absent evidence and manufactured refreshes', () => {
  const bytes = readFileSync(new URL(`../${original.path}`, import.meta.url))
  assert.throws(() => reviewedUpdate(original, article, bytes, { reason: 'Only a new date is not a meaningful manuscript update.', evidence: [article.sources[0].href] }))
  const changed = structuredClone(article); changed.content[0] += ' A clarification.'
  assert.throws(() => reviewedUpdate(original, changed, Buffer.from(JSON.stringify(changed)), { reason: 'A material update needs actual cited source evidence.', evidence: ['https://invalid.test/unrelated'] }))
})
