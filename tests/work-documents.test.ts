import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { workNarratives } from '../src/personal/projects/work-narratives.ts'
import { caseNarratives } from '../src/personal/projects/case-narratives.ts'
import { caseStudies } from '../src/personal/projects/case-studies.ts'
import { workLinkHref } from '../src/personal/projects/work-document.ts'

const documents = { ...workNarratives, ...caseNarratives }
const catalog = JSON.parse(readFileSync(new URL('../src/personal/editorial/data/catalog.json', import.meta.url), 'utf8'))
const articleSlugs = new Set(catalog.map((article: { slug: string }) => article.slug))

test('all seven work documents retain existing chapter bookmarks and unique section identities', () => {
  assert.deepEqual(Object.keys(documents).sort(), ['atlas', 'internshipdeadlines', 'investing-markets', 'miscellaneous', 'payrollpro', 'sapien', 'viralbench'])
  for (const [slug, document] of Object.entries(documents)) {
    const ids = document.chapters.map((chapter) => chapter.id)
    assert.equal(new Set(ids).size, ids.length, slug)
    for (const id of caseNarratives[slug] ? ['study-section-1', 'study-section-2', 'study-section-3', 'study-section-4'] : ['question', 'system', 'practice']) {
      assert.ok(ids.includes(id), `${slug}: lost ${id}`)
    }
    for (const chapter of document.chapters) {
      assert.match(chapter.id, /^[a-z0-9-]+$/)
      assert.ok(chapter.title && chapter.label && chapter.body.length, `${slug}/${chapter.id}`)
      if (chapter.table) for (const row of chapter.table.rows) assert.equal(row.length, chapter.table.columns.length, `${slug}: incomplete table`)
    }
  }
  for (const study of caseStudies)
    assert.deepEqual(
      study.chapters,
      caseNarratives[study.slug].chapters.map((chapter) => chapter.label)
    )
})

test('sources resolve to retained artifacts or actual catalog routes, including nested deployment bases', () => {
  for (const [slug, document] of Object.entries(documents)) {
    for (const link of [...document.links, ...document.chapters.flatMap((chapter) => chapter.links ?? [])]) {
      assert.ok(link.label && link.description, `${slug}: unlabeled source`)
      if (link.href.startsWith('./')) {
        const file = new URL(link.href === './shader.html' ? '../shader.html' : `../public/${link.href.slice(2)}`, import.meta.url)
        assert.ok(existsSync(file), `${slug}: missing ${link.href}`)
        assert.ok(readFileSync(file).byteLength > 0)
        assert.equal(workLinkHref(link.href, '/portfolio/'), `/portfolio/${link.href.slice(2)}`)
      } else if (link.href.startsWith('#/writing/')) {
        assert.ok(articleSlugs.has(link.href.slice('#/writing/'.length)), `${slug}: missing article`)
      } else if (link.href.startsWith('#/work/')) {
        assert.ok(documents[link.href.slice('#/work/'.length)], `${slug}: missing project`)
      } else assert.match(link.href, /^https:\/\//)
    }
  }
})

test('published figures stay assigned to their actual projects and rejected inserts remain absent', () => {
  const evidence = Object.entries(documents).flatMap(([slug, document]) => document.chapters.filter((chapter) => chapter.artifact).map((chapter) => [slug, chapter.artifact]))
  assert.deepEqual(evidence, [
    ['internshipdeadlines', 'system'],
    ['sapien', 'system'],
    ['investing-markets', 'system'],
    ['miscellaneous', 'system'],
    ['atlas', 'atlas'],
    ['payrollpro', 'payroll'],
    ['viralbench', 'viral']
  ])
  const serialized = JSON.stringify(documents)
  assert.doesNotMatch(serialized, /atlas-console\.jpg|internship-offer|\/tools\/offers|texas-toll-roads-stay-tolled-financial-model-2025\.xlsx/)
})

test('the derivative comparison agrees with the current asset manifest', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/portfolio-models/manifest.json', import.meta.url), 'utf8'))
  const table = workNarratives.miscellaneous.chapters.find((chapter) => chapter.id === 'assets')!.table!
  const assets = Object.values(manifest.assets ?? manifest.models ?? manifest) as any[]
  assert.ok(assets.length, 'manifest records')
  for (const [name, sizes, triangles] of table.rows) {
    const selector = name === 'Helmet' ? 'helmet' : name === 'Contact sculpture' ? 'headrest' : name === 'Globe' ? 'globe' : 'work-miscellaneous'
    const asset = assets.find((asset) => JSON.stringify(asset).includes(selector))
    assert.ok(asset, selector)
    const source = asset.sourceStats ?? asset.source?.stats
    const output = asset.stats
    assert.ok(source && output, selector)
    assert.equal(sizes, `${(asset.source.bytes / 1e6).toFixed(2)} → ${(asset.bytes / 1e6).toFixed(2)} MB`, name)
    assert.equal(source.triangles, Number(triangles.replaceAll(',', '')), name)
    assert.equal(output.triangles, source.triangles, name)
  }
})


test('existing source-material bookmarks still reach sources after adding a chapter', () => {
  for (const [slug, id] of [['atlas', 'study-section-5'], ['payrollpro', 'study-section-4'], ['viralbench', 'study-section-4']]) {
    const chapter = caseNarratives[slug].chapters.find(chapter => chapter.id === id)
    assert.equal(chapter?.label, 'Source material', slug)
    assert.ok(chapter.links?.length)
  }
})
