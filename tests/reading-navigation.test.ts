import test from 'node:test'
import assert from 'node:assert/strict'
import { articleReturnHref, articleSection, readWritingFilters, relatedArticles, sectionHref, writingHref } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

const catalog = [
  { slug: 'authority', path: '/research/ai/authority', category: 'AI SYSTEMS' },
  { slug: 'trace', path: '/research/ai/trace', category: 'EVIDENCE SYSTEMS' },
  { slug: 'crawl', path: '/research/crawlers/crawl', category: 'CRAWLER ENGINEERING' },
] as ArticleSummary[]
const categories = ['All', ...catalog.map(article => article.category)]

test('a bookmarked archive retains search punctuation, category and the selected article', () => {
  const filters = { query: 'R&D + 50%? café', category: 'AI SYSTEMS' }
  const archive = writingHref(filters, 'authority')
  assert.deepEqual(readWritingFilters(archive, categories), filters)
  const reader = `#/writing/authority?from=${encodeURIComponent(archive)}`
  assert.equal(articleReturnHref(reader, catalog), archive)
  assert.deepEqual(readWritingFilters('#/writing?category=missing&q=trace', categories), { query: 'trace', category: 'All' })
})

test('return links accept only the archive and known selections', () => {
  for (const from of ['https://example.org', '//example.org', '#/writing/other', '#/writing-more', 'javascript:alert(1)']) {
    assert.equal(articleReturnHref(`#/writing/authority?from=${encodeURIComponent(from)}`, catalog), '#/writing')
  }
  assert.equal(articleReturnHref(`#/writing/authority?from=${encodeURIComponent('#/writing?at=unknown&q=trace')}`, catalog), '#/writing?q=trace')
  assert.equal(articleReturnHref('#/writing/authority', catalog), '#/writing')
})

test('section navigation preserves archive context and decodes a fragment only once', () => {
  const reader = `#/writing/authority?from=${encodeURIComponent('#/writing?category=AI+SYSTEMS&q=50%25')}`
  const linked = sectionHref(reader, 'margin-50%-café')
  assert.equal(articleSection(linked), 'margin-50%-café')
  assert.equal(articleReturnHref(linked, catalog), '#/writing?category=AI+SYSTEMS&q=50%25')
  assert.equal(articleSection('#margin-50%25-caf%C3%A9'), 'margin-50%-café')
  assert.equal(articleSection('#invalid-%'), null)
  assert.equal(sectionHref('#old-section', 'new café'), '#new%20caf%C3%A9')
})

test('related reading prefers a shared subject and excludes the current article or duplicate links', () => {
  assert.deepEqual(relatedArticles(catalog[0], [...catalog, catalog[1]]).map(article => article.slug), ['trace', 'crawl'])
  assert.deepEqual(relatedArticles(catalog[0], [catalog[0]]), [])
})
