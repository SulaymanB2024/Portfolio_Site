import test from 'node:test'
import assert from 'node:assert/strict'
import { articleReturnHref, articleSection, filterWritingArticles, readWritingFilters, relatedArticles, readerFragmentHref, sectionHref, writingHref } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

const catalog = [
  { slug: 'authority', path: '/research/ai/authority', category: 'AI SYSTEMS' },
  { slug: 'trace', path: '/research/ai/trace', category: 'EVIDENCE SYSTEMS' },
  { slug: 'crawl', path: '/research/crawlers/crawl', category: 'CRAWLER ENGINEERING' },
] as ArticleSummary[]
const categories = ['All', ...catalog.map(article => article.category)]

test('writing search combines terms across titles and decks while respecting the selected topic', () => {
  const essays = [
    { slug: 'roads', title: 'Who owns Texas toll roads?', displayTitle: 'Who owns the cash flow?', subtitle: 'Contracts divide revenue and risk.', category: 'INFRASTRUCTURE' },
    { slug: 'shops', title: 'The First AI Managers', displayTitle: 'The Shopkeeper in the Machine', subtitle: 'AI-operated cafés and yesterday’s decisions.', category: 'AI SYSTEMS' },
  ] as ArticleSummary[]
  const find = (query: string, category = 'All') => filterWritingArticles(essays, { query, category }).map(article => article.slug)
  assert.deepEqual(find('revenue Texas'), ['roads'])
  assert.deepEqual(find('  CASH   risk '), ['roads'])
  assert.deepEqual(find('AI-operated cafes'), ['shops'])
  assert.deepEqual(find("yesterday's decisions"), ['shops'])
  assert.deepEqual(find('café missing'), [])
  assert.deepEqual(find('Texas', 'AI SYSTEMS'), [])
  assert.deepEqual(find('', 'AI SYSTEMS'), ['shops'])
  assert.deepEqual(find('   '), ['roads', 'shops'])
})

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

test('search and return bookmarks round-trip literal URL syntax and Unicode without changing meaning', () => {
  const queries = ['Café? #1 & 50% + tax', '日本語 / 東京', 'yesterday’s café', 'a=b?from=#/work', '<script>alert(1)</script>']
  for (const query of queries) {
    for (const category of categories) {
      const filters = { query, category }
      const archive = writingHref(filters, 'authority')
      assert.deepEqual(readWritingFilters(archive, categories), filters)
      const reader = `#/writing/authority?from=${encodeURIComponent(archive)}`
      assert.equal(articleReturnHref(reader, catalog), archive)
      assert.equal(articleReturnHref(sectionHref(reader, 'source-café?#1'), catalog), archive)
    }
  }
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

test('native citation links keep the reader and its archive context when copied or opened separately', () => {
  const reader = '#/writing/authority?from=' + encodeURIComponent('#/writing?q=50%25&at=authority')
  for (const fragment of ['#note-1', '#note-ref-1', '#source-12', '#margin-50%25-caf%C3%A9']) {
    const href = readerFragmentHref(reader, fragment)
    assert.equal(href.split('?')[0], '#/writing/authority')
    assert.equal(articleSection(href), articleSection(fragment))
    assert.equal(articleReturnHref(href, catalog), '#/writing?q=50%25&at=authority')
  }
  for (const href of ['https://example.org/#note-1', '#/writing/trace', '#invalid-%']) assert.equal(readerFragmentHref(reader, href), href)
  assert.equal(readerFragmentHref('#/writing', '#note-1'), '#note-1')
  assert.equal(readerFragmentHref('#section', '#note-1'), '#note-1')
})
