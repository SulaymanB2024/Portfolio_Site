import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { sha256, protectedArticleEvidence, articleProseWords } from '../tools/article-revision-integrity.mjs'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'
import { qualityReadingMinutes } from '../tools/article-quality-integrity.mjs'

const load = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const revisions = load('../docs/article-revisions.json').records
const originals = load('../docs/article-restoration.json').records
const catalog = load('../src/personal/editorial/data/catalog.json')
const archived = load('../src/personal/editorial/data/archived-catalog.json')
const retained = [...catalog, ...archived.filter((item: ArticleSummary) => !catalog.some((active: ArticleSummary) => active.slug === item.slug))]

test('recovered-source revisions are bound to readbacks and main-manuscript reading estimates', () => {
  for (const revision of revisions) {
    const file = `../src/personal/editorial/data/articles/${revision.slug}.json`
    const article = load(file)
    const original = load(`../${revision.originalPath}`)
    assert.equal(sha256(readFileSync(new URL(file, import.meta.url))), revision.currentSha256, revision.slug)
    assert.equal(articleProseWords(original), revision.proseWords.before)
    assert.equal(articleProseWords(article), revision.proseWords.after)
    if (revision.priorRevision) {
      assert(articleProseWords(article) <= articleProseWords(original) * 0.8, revision.slug)
      assert.equal(article.openingPresentation, 'integrated')
    }
    assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`)
    assert.equal(retained.find((item: any) => item.slug === revision.slug).readTime, article.readTime)
    assert.equal(retained.find((item: any) => item.slug === revision.slug).subtitle, article.subtitle)
    if (article.metricSection) assert(article.sections.some((section: any) => section.id === article.metricSection))
  }
})

test('evidence protection permits prose edits and figure moves, but catches changed data, sources and targets', () => {
  const original = load('../docs/article-originals/the-ai-megawatt.json')
  const keys = originals.find((item: any) => item.slug === original.slug).sourceKeys
  const baseline = protectedArticleEvidence(original, keys)
  const moved = structuredClone(original)
  const from = moved.sections.find((section: any) => section.figures?.length)
  moved.sections[0].figures = [from.figures.shift()]
  moved.sections[0].title = 'A shorter heading'
  moved.content = ['A revised opening.']
  assert.deepEqual(protectedArticleEvidence(moved, keys), baseline)
  for (const mutate of [
    (article: any) => { article.sections[0].table.rows[0][0] = 'Changed datum' },
    (article: any) => { article.sections[0].id = 'lost-bookmark' },
    (article: any) => { article.sources[0].href = 'https://invalid.test/' },
    (article: any) => { article.resources.pop() },
    (article: any) => { article.evidenceBoundary = 'Now a forecast.' },
    (article: any) => { article.sections.find((section: any) => section.bullets?.length).bullets.pop() },
    (article: any) => { article.sections.find((section: any) => section.figures?.length).figures.pop() },
  ]) {
    const changed = structuredClone(original)
    mutate(changed)
    assert.notDeepEqual(protectedArticleEvidence(changed, keys), baseline)
  }
})

test('the AI capacity edit retains the numeric bases and separates scenarios from observations', () => {
  const article = load('../src/personal/editorial/data/articles/the-ai-megawatt.json')
  const text = article.sections.map((section: any) => section.paragraphs.join(' ')).join(' ')
  for (const value of ['1,000 MW', 'PUE of 1.145', '873.36 MW', '793.97 MW', '142 kW', '72 GPUs', '5,591.31', '402,574', '434,856', '355,819', '460,948', '53.27 kW', '4.69%', '115.97 kW', '10.21%', '50%', '500 MW', '4.38 TWh', '75%–85%', '0.705 billion', '1.06 billion']) assert(text.includes(value), value)
  assert(text.includes('engineering sensitivities, not confidence bounds'))
  assert(text.includes('not an assumption that every port is populated'))
  assert(text.includes('not measured at gigawatt scale'))
  assert(text.includes('do not measure useful work'))
  const contract = article.sections.find((section: any) => section.id === 'research-contract')
  assert.equal(contract.figuresPosition, 'before-table')
  assert.equal(contract.figures[0].src, '/images/research/the-ai-megawatt-power-ladder.svg')
})
