import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { restoredArticleHtml } from '../src/personal/editorial/restored-html.ts'
import { articleDownloads, sourceAnchor } from '../src/personal/editorial/article-content.ts'
import { articleHref } from '../src/personal/editorial/links.ts'
import type { ArticleSummary, WritingArticle } from '../src/personal/editorial/types.ts'
import { originalFields, protectedArticleEvidence } from '../tools/article-revision-integrity.mjs'

const load = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const catalog: ArticleSummary[] = load('../src/personal/editorial/data/catalog.json')
const manifest = load('../docs/article-restoration.json')
const revisions = load('../docs/article-revisions.json').records
const article = (slug: string): WritingArticle => load(`../src/personal/editorial/data/articles/${slug}.json`)

test('original recoveries remain frozen; recorded editorial revisions preserve their research evidence', () => {
  for (const record of manifest.records) {
    const data = article(record.slug)
    const revision = revisions.find((item: any) => item.slug === record.slug)
    const original = revision ? load(`../${revision.originalPath}`) : data
    assert.equal(createHash('sha256').update(JSON.stringify(originalFields(original, record.sourceKeys))).digest('hex'), record.originalSha256, record.slug)
    if (revision) assert.deepEqual(protectedArticleEvidence(data, record.sourceKeys), protectedArticleEvidence(original, record.sourceKeys), record.slug)
    for (const figure of data.sections?.flatMap(section => section.figures || []) || []) {
      assert(figure.alt && figure.caption && figure.width > 0 && figure.height > 0)
      assert(readFileSync(new URL(`../public${figure.src}`, import.meta.url)).length > 0)
    }
  }
})

test('every published article has an assigned ink artwork and a retained local poster', () => {
  const source = readFileSync(new URL('../src/personal/editorial/generative/manifest.ts', import.meta.url), 'utf8')
  for (const article of catalog) {
    const assignment = source.match(new RegExp(`'${article.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': '(yuru-\\d+)'`))
    assert(assignment, `Missing ink artwork: ${article.path}`)
    assert(readFileSync(new URL(`../public/images/generative-art/${assignment[1]}.webp`, import.meta.url)).length > 0)
  }
})

test('original numbered citations have matching source IDs; legacy numeric bookmarks are retained by the reader', () => {
  for (const record of manifest.records) {
    const data = article(record.slug)
    const citations = [...JSON.stringify(data).matchAll(/\[S(\d+)\]/g)]
    for (const [, number] of citations) assert(data.sources?.[Number(number) - 1], `${record.slug} citation S${number}`)
    data.sources?.forEach((source, index) => assert.equal(sourceAnchor(source, index), `source-s${index + 1}`))
  }
})

test('original resources are available, deduplicated and respect a subdirectory deployment', () => {
  for (const record of manifest.records) {
    const data = article(record.slug)
    const downloads = articleDownloads(data)
    assert.equal(new Set(downloads.map(item => item.href)).size, downloads.length)
    assert.equal(downloads.length, record.resources)
    for (const resource of downloads.filter(item => /\.[a-z]+$/i.test(item.href))) {
      assert(readFileSync(new URL(`../public${resource.href}`, import.meta.url)).length > 0)
      assert.equal(articleHref(resource.href, catalog, '/portfolio/'), `/portfolio${resource.href}`)
    }
  }
})

test('the standalone toll-road body adopts native classes and routing without losing evidence targets', () => {
  const data = article(manifest.html.slug)
  const html = restoredArticleHtml(data.htmlBody!, catalog, '/portfolio/')
  for (const id of manifest.html.ids) assert(html.includes(`id="${id}"`))
  assert.equal((html.match(/<table>/g) || []).length, 4)
  assert.equal((html.match(/<img /g) || []).length, 3)
  assert.equal((html.match(/class="reader-figure-viewport" role="region"/g) || []).length, 3)
  assert(html.includes('class="reader-table"'))
  assert(html.includes('class="reader-section"'))
  assert(html.includes('href="#/writing/how-airlines-borrow-against-loyalty-programs"'))
  assert(html.includes('src="/portfolio/images/research/texas-toll-roads-stay-tolled-100.svg"'))
  assert.equal(new Set(data.outline?.map(item => item.id)).size, data.outline?.length)
})

test('the recovered HTML boundary rejects executable markup and unsafe navigation', () => {
  for (const html of ['<script>bad()</script>', '<p onclick="bad()">Text</p>', '<a href="javascript:bad()">Text</a>', '<img src="//host.test/image.png" />', '<p style="color:red">Text</p>']) assert.throws(() => restoredArticleHtml(html, catalog))
})
