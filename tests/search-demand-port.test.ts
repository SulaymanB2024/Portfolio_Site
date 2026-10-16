import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { articleTopic, readingTopics } from '../src/personal/editorial/topics.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { publicPages } from '../src/personal/public-pages.ts'
import { verifyInitialPublication, verifyRestorationExclusions } from '../tools/article-publication-integrity.mjs'
import { qualityReadingMinutes } from '../tools/article-quality-integrity.mjs'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url))
const json = (path: string) => JSON.parse(read(path).toString())
const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const manifest = json('docs/search-demand-20260923/port.json')
const original = json(manifest.sourceRecordsPath)
const publications = json('docs/article-publications.json').records
const guides = json('src/personal/editorial/data/reader-guides.json')
const ledger = json('docs/search-demand-20260923/source-ledger.json')
const artworkManifest = read('src/personal/editorial/generative/manifest.ts').toString()

test('all 23 September manuscripts preserve their original text, evidence and dated source records', () => {
  assert.equal(manifest.sourceRef, '088e1e7621fa0636ceaa52b96d5beba3085bbe66')
  assert.equal(sha256(read(manifest.sourceRecordsPath)), manifest.sourceRecordsSha256)
  assert.equal(original.sourceRef, manifest.sourceRef)
  assert.equal(original.records.length, 23)
  assert.equal(manifest.records.length, 23)
  assert.deepEqual(manifest.collections.map((collection: any) => collection.articles.length), [6, 9, 8])
  assert.equal(new Set(manifest.records.map((record: any) => record.slug)).size, 23)
  for (const record of manifest.records) {
    const source = original.records.find((entry: any) => entry.article.slug === record.slug)
    assert(source, record.slug)
    assert.equal(source.sourcePath, record.sourcePath)
    assert.equal(sha256(JSON.stringify(source.article)), record.originalSha256)
    const article = json(record.path)
    for (const [key, value] of Object.entries(source.article)) {
      if (key === 'readTime') {
        assert.equal(record.originalReadTime, value)
        assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`)
      } else if (key === 'sources') {
        assert.deepEqual(article.sources.map(({ id, ...citation }: any) => citation), value, `${record.slug}: original source content/order`)
        assert.deepEqual(article.sources.map((citation: any) => citation.id), article.sources.map((_: any, index: number) => `S${index + 1}`))
      } else assert.deepEqual(article[key], value, `${record.slug}: unchanged ${key}`)
    }
    assert.equal(article.dateModified, source.article.date, 'Integration must not invent a later research edition')
  }
})

test('ported editions have native publication receipts and exactly one discoverable reading path', () => {
  for (const record of manifest.records) {
    const receipt = publications.find((entry: any) => entry.slug === record.slug)
    assert(receipt, record.slug)
    const article = verifyInitialPublication(read(record.path), receipt)
    const summary = catalog.find(entry => entry.slug === record.slug)
    assert(summary, record.slug)
    for (const key of ['path', 'title', 'subtitle', 'seoTitle', 'seoDescription', 'date', 'dateModified', 'readTime', 'image'] as const) assert.equal(summary[key], article[key], `${record.slug}: catalog ${key}`)
    assert.equal(resolveRoute('', article.path, catalog), `writing/${record.slug}`)
    assert.equal(resolveRoute(`#${article.path}`, '/', catalog), `writing/${record.slug}`)
    assert(publicPages.some(page => page.path === article.path))
    assert.equal(readingTopics.filter(topic => topic.readings.some(reading => reading.slug === record.slug)).length, 1)
    assert.equal(articleTopic(record.slug)?.slug, ['ai-crawlers', 'crawler-engineering', 'search-console'].includes(article.cluster) ? 'crawler-evidence' : 'financial-systems')
    assert(artworkManifest.includes(`'${article.path}': '${record.artwork}'`))
    assert(existsSync(new URL(`../public/images/generative-art/${record.artwork}.webp`, import.meta.url)))
    assert(existsSync(new URL(`../public${article.image}`, import.meta.url)))
  }
})

test('new guides and citation ledgers introduce no unsourced claims, links or broken section targets', () => {
  const routes = new Set(publicPages.map(page => page.path))
  for (const record of manifest.records) {
    const article = json(record.path)
    const guide = guides[record.slug]
    assert.equal(guide.question, article.title)
    assert.equal(guide.answer, article.thesis)
    assert.equal(new Set(guide.paths.map((path: any) => path.section)).size, 3)
    for (const path of guide.paths) {
      const section = article.sections.find((section: any) => section.id === path.section)
      assert(section, `${record.slug}: ${path.section}`)
      assert.equal(path.label, section.title)
      assert(section.paragraphs[0].startsWith(path.description), `${record.slug}: guide must quote its source section`)
    }
    for (const source of guide.sources) assert(article.sources.some((entry: any) => entry.href === source.href && entry.label === source.label))
    const citations = ledger.articles.find((entry: any) => entry.slug === record.slug)
    assert.deepEqual(citations.sources, article.sources)
    assert.equal(citations.manuscriptLastVerified, article.lastVerified)
    assert.equal(citations.evidenceBoundary, article.evidenceBoundary)
    for (const resource of article.resources || []) {
      if (!resource.href.startsWith('/')) continue
      const path = resource.href.split('#')[0]
      assert(routes.has(path) || existsSync(new URL(`../public${path}`, import.meta.url)), `${record.slug}: ${path}`)
    }
  }
})

test('historical exclusions require a different canonical path and an intact new publication receipt', () => {
  const exclusions = json('docs/article-restoration.json').excluded
  const excluded = exclusions.find((entry: any) => entry.slug === 'who-owns-us-toll-roads')
  assert.equal(excluded.path, '/markets/who-owns-us-toll-roads')
  const summary = catalog.find(article => article.slug === excluded.slug)!
  assert.equal(summary.path, '/research/financial-systems/who-owns-us-toll-roads')
  const receipt = publications.find((entry: any) => entry.slug === summary.slug)
  verifyRestorationExclusions([excluded], [summary], [receipt], read)
  assert.throws(() => verifyRestorationExclusions([excluded], [{ ...summary, path: excluded.path }], [receipt], read), /historical candidate promoted/)
  assert.throws(() => verifyRestorationExclusions([excluded], [{ ...summary, aliases: [excluded.path] }], [receipt], read), /historical candidate promoted/)
  assert.throws(() => verifyRestorationExclusions([excluded], [summary], [], read), /requires an initial-publication receipt/)
  assert.throws(() => verifyRestorationExclusions([excluded], [summary], [{ ...receipt, canonicalPath: '/unrelated-record' }], read), /requires an initial-publication receipt/)
  assert.throws(() => verifyRestorationExclusions([excluded], [summary], [receipt], (path: string) => Buffer.concat([read(path), Buffer.from(' ')])), /Unrecorded publication change/)
  assert.throws(() => verifyRestorationExclusions([{ slug: summary.slug }], [summary], [receipt], read), /historical candidate promoted/)
})
