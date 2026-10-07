import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { protectedQualityEvidence, qualityReadingMinutes, verifyQualityRevision } from '../tools/article-quality-integrity.mjs'
import { searchMetadata } from '../src/personal/search-metadata.ts'
import { relatedArticles } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

const json = (path: string) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'))
const manifest = json('docs/article-quality-revisions.json')
const catalog: ArticleSummary[] = json('src/personal/editorial/data/catalog.json')
const archived = json('src/personal/editorial/data/archived-catalog.json')
const retained = [...catalog, ...archived.filter((item: ArticleSummary) => !catalog.some((active: ArticleSummary) => active.slug === item.slug))]
const record = (slug: string) => manifest.records.find((item: any) => item.slug === slug)

test('published and withdrawn manuscripts retain reviewed revisions and evidence', () => {
  assert.equal(manifest.records.length, retained.length)
  for (const item of manifest.records) {
    const before = json(item.baselinePath), article = json(item.path)
    verifyQualityRevision(before, article, item, manifest.exceptions)
    assert(item.changedUnits.length > 0)
    assert.equal(article.date, before.date)
    assert.equal(article.lastVerified, before.lastVerified)
    assert.equal(retained.find(summary => summary.slug === item.slug)?.readTime, article.readTime)
  }
})

test('revision guards reject changed quantities, source links, code, publication dates, and evidence targets', () => {
  const item = record('the-ai-megawatt'), before = json(item.baselinePath), article = json(item.path)
  for (const mutate of [
    (data: any) => { data.content[0] = data.content[0].replace('402,574', '500,000') },
    (data: any) => { data.sections[2].paragraphs[0] = data.sections[2].paragraphs[0].replace('[S1]', '') },
    (data: any) => { data.sources[0].href = 'https://invalid.test/' },
    (data: any) => { data.date = '2026-10-05' },
    (data: any) => { data.lastVerified = '2026-10-05' },
    (data: any) => { data.sections[0].id = 'lost-bookmark' },
    (data: any) => { data.sections[1].figures[0].src = '/wrong-figure.svg' },
  ]) {
    const changed = structuredClone(article); mutate(changed)
    assert.throws(() => verifyQualityRevision(before, changed, item, manifest.exceptions))
  }
  const codeItem = record('sqlite-crawl-pipelines'), code = json(codeItem.path), original = json(codeItem.baselinePath)
  const section = code.sections.find((section: any) => section.codeExamples?.length)
  section.codeExamples[0].code += '\nDELETE FROM crawl_run;'
  assert.notDeepEqual(protectedQualityEvidence(code), protectedQualityEvidence(original))
})

test('the protocol correction permits only its declared primary citation', () => {
  const item = record('ai-search-crawler-policy'), before = json(item.baselinePath), article = json(item.path)
  assert.throws(() => verifyQualityRevision(before, article, item, []))
  verifyQualityRevision(before, article, item, manifest.exceptions)
  const changed = structuredClone(article); changed.content[1] += ' The guarantee lasts 99 days.'
  assert.throws(() => verifyQualityRevision(before, changed, item, manifest.exceptions))
  assert(article.content[1].includes('case-insensitive product-token group matching'))
})

test('the broken-route correction preserves every remaining resource and code caption quantity', () => {
  const item = record('jane-street-exact-search-solver-verification')
  const before = json(item.baselinePath), article = json(item.path)
  verifyQualityRevision(before, article, item, manifest.exceptions)
  assert.throws(() => verifyQualityRevision(before, article, item, []))
  const missing = structuredClone(article); missing.resources.pop()
  assert.throws(() => verifyQualityRevision(before, missing, item, manifest.exceptions))
  const caption = structuredClone(article); caption.sections[3].codeExamples[0].description += ' Verified in 999 runs.'
  assert.throws(() => verifyQualityRevision(before, caption, item, manifest.exceptions))
})

test('HTML revisions preserve original markup, tables, figures, and sources', () => {
  const item = record('why-texas-toll-roads-stay-tolled'), before = json(item.baselinePath), article = json(item.path)
  assert.deepEqual(protectedQualityEvidence(article), protectedQualityEvidence(before))
  const changed = structuredClone(article); changed.htmlBody = changed.htmlBody.replace('id="source-ledger"', 'id="lost-sources"')
  assert.notEqual(changed.htmlBody, article.htmlBody)
  assert.notDeepEqual(protectedQualityEvidence(changed), protectedQualityEvidence(before))
})

test('search and social metadata use authored search copy while schema keeps the visible headline', () => {
  const titles = new Set(), descriptions = new Set()
  for (const summary of catalog) {
    const article = json(`src/personal/editorial/data/articles/${summary.slug}.json`), meta = searchMetadata(`writing/${summary.slug}`)
    assert.equal(meta.title, `${article.seoTitle} — Sulayman Bowles`)
    assert.equal(meta.description, article.seoDescription)
    const node = meta.schema!['@graph'].find(node => node['@type'] === 'Article')!
    assert.equal(node.headline, article.displayTitle || article.title)
    assert.equal(node.description, article.seoDescription)
    assert.equal(node.datePublished, article.date.replaceAll('.', '-'))
    assert.equal(node.dateModified, '2026-10-05')
    assert(!titles.has(article.seoTitle)); titles.add(article.seoTitle)
    assert(!descriptions.has(article.seoDescription)); descriptions.add(article.seoDescription)
  }
})

test('next-reading links follow the subject and remain two distinct routed articles', () => {
  for (const summary of catalog) {
    const next = relatedArticles(summary, catalog)
    assert.equal(next.length, 2)
    assert.equal(new Set(next.map(item => item.slug)).size, 2)
    assert(next.every(item => item.slug !== summary.slug && catalog.some(candidate => candidate.path === item.path)))
  }
  assert.equal(relatedArticles(catalog.find(item => item.slug === 'who-owns-texas-toll-roads')!, catalog)[0].slug, 'why-texas-toll-roads-stay-tolled')
  assert.equal(relatedArticles(catalog.find(item => item.slug === 'atlas-building-an-evidence-console')!, catalog)[0].slug, 'raw-html-rendered-dom-evidence')
})

test('reading estimates exclude duplicate source-manuscript copies and separate registries', () => {
  const item = record('the-first-ai-managers'), article = json(item.path)
  const copy = structuredClone(article)
  copy.markdown = 'Repeated unused manuscript '.repeat(10000)
  copy.sources.push({ label: 'Large source ledger', note: 'Extra source detail '.repeat(10000) })
  copy.cases = [...copy.cases, ...copy.cases]
  assert.equal(qualityReadingMinutes(copy), qualityReadingMinutes(article))
})
