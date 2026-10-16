import test from 'node:test'
import assert from 'node:assert/strict'
import { newestWritingFirst, selectedWritingSlugs, writingSelection } from '../src/personal/editorial/writing-selection.ts'
import { filterWritingArticles } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }

function article(slug: string, date: string): ArticleSummary {
  return { slug, date, path: `/writing/${slug}`, title: slug, category: 'TECHNICAL SEO', subtitle: 'Summary', readTime: '4 min', kind: 'essay' }
}

test('every Writing collection sorts by publication date across years and months', () => {
  const input = [
    article('the-first-ai-managers', '2025.12.31'),
    article('the-ai-megawatt', '2026.01.01'),
    article('further-older', '2026.02.09'),
    article('further-newer', '2026.10.01'),
    article('ai-search-crawler-policy', '2026.03.01'),
    article('sqlite-crawl-pipelines', '2026.03.11'),
  ]
  const selection = writingSelection(input)
  assert.deepEqual(selection.selected.map(item => item.slug), ['the-ai-megawatt', 'the-first-ai-managers'])
  assert.deepEqual(selection.more.map(item => item.slug), ['further-newer', 'further-older'])
  assert.deepEqual(selection.notes.map(item => item.slug), ['sqlite-crawl-pipelines', 'ai-search-crawler-policy'])
})

test('matching publication dates retain curated and catalog tie order', () => {
  const date = '2026.10.14'
  const input = [
    article(selectedWritingSlugs[2], date),
    article(selectedWritingSlugs[1], date),
    article(selectedWritingSlugs[0], date),
    article('further-b', date), article('further-a', date),
    article('ai-search-crawler-policy', date), article('sqlite-crawl-pipelines', date),
  ]
  const selection = writingSelection(input)
  assert.deepEqual(selection.selected.map(item => item.slug), selectedWritingSlugs.slice(0, 3))
  assert.deepEqual(selection.more.map(item => item.slug), ['further-b', 'further-a'])
  assert.deepEqual(selection.notes.map(item => item.slug), ['ai-search-crawler-policy', 'sqlite-crawl-pipelines'])
})

test('ISO-dated new editions remain newer than dotted historical dates', () => {
  const selection = writingSelection(catalog as ArticleSummary[])
  assert.deepEqual(selection.more.slice(0, 2).map(item => item.slug), ['anduril-valuation-capital-productivity', 'kalshi-40-billion-question'])
  for (const collection of Object.values(selection)) {
    for (let i = 1; i < collection.length; i++) {
      const date = (value: string) => Date.parse(value.replaceAll('.', '-'))
      assert(date(collection[i - 1].date) >= date(collection[i].date), `${collection[i].slug}: real publication chronology`)
    }
  }
  const mixedTies = writingSelection([article('equal-first', '2026.10.14'), article('equal-second', '2026-10-14')])
  assert.deepEqual(mixedTies.more.map(item => item.slug), ['equal-first', 'equal-second'])
})

test('selection preserves each article, the input order, and filtered membership', () => {
  const input = [
    article('further-essay', '2026.10.14'),
    article('the-first-ai-managers', '2026.07.14'),
    article('sqlite-crawl-pipelines', '2026.08.01'),
    article('the-ai-megawatt', '2026.08.16'),
  ]
  const before = input.slice()
  Object.freeze(input)
  const selection = writingSelection(input)
  const combined = [...selection.selected, ...selection.more, ...selection.notes]
  assert.equal(combined.length, input.length)
  for (const item of input) assert.equal(combined.filter(candidate => candidate === item).length, 1)
  assert.deepEqual(input, before)
  const filtered = writingSelection(input.filter(item => item.slug === 'sqlite-crawl-pipelines' || item.slug === 'the-ai-megawatt'))
  assert.deepEqual(filtered.selected.map(item => item.slug), ['the-ai-megawatt'])
  assert.deepEqual(filtered.notes.map(item => item.slug), ['sqlite-crawl-pipelines'])
  assert.deepEqual(filtered.more, [])
})

test('filtered Writing results keep the newest editions first without changing catalog order', () => {
  const input = filterWritingArticles(catalog as ArticleSummary[], { category: 'FINANCIAL SYSTEMS', query: '' })
  const before = input.slice()
  Object.freeze(input)
  const results = newestWritingFirst(input)
  assert.deepEqual(results.slice(0, 3).map(item => item.slug), ['anduril-valuation-capital-productivity', 'kalshi-40-billion-question', 'hyperliquid-valuation'])
  assert.deepEqual(input, before)
  assert.equal(results.length, input.length)
})
