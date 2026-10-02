import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { consolidatedDestination, consolidatedHref } from '../src/personal/editorial/curation.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { articleHref } from '../src/personal/editorial/links.ts'
import { articleSection, sectionHref, relatedArticles } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

const load = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const catalog: ArticleSummary[] = load('../src/personal/editorial/data/catalog.json')
const archived: ArticleSummary[] = load('../src/personal/editorial/data/archived-catalog.json')

test('every delisted path, alias and reader bookmark resolves to a retained destination', () => {
  for (const article of archived) {
    const destination = consolidatedDestination(article.path)!
    assert.ok(destination)
    assert.ok(!destination.slug || catalog.some(item => item.slug === destination.slug))
    const route = destination.slug ? `writing/${destination.slug}` : 'writing'
    for (const url of [article.path, ...(article.aliases || []), `/writing/${article.slug}`]) {
      assert.equal(resolveRoute('', url, catalog), route)
      assert.equal(resolveRoute(`#${url}?from=%23%2Fwriting`, '/', catalog), route)
      assert.equal(articleHref(`https://sulayman-bowles.dev${url}`, catalog), consolidatedHref(url))
    }
    if (destination.section) {
      const target = load(`../src/personal/editorial/data/articles/${destination.slug}.json`)
      assert.ok(target.sections.some((section: { id: string }) => section.id === destination.section))
    }
  }
})

test('old reader jumps canonicalize without trapping navigation at the consolidation section', () => {
  const old = '#/writing/raw-html-rendered-dom-evidence?from=%23%2Fwriting'
  assert.equal(articleSection(old), 'source-and-render')
  assert.equal(articleSection('', '/research/technical-seo/raw-html-rendered-dom-evidence'), 'source-and-render')
  const next = sectionHref(old, 'improvement-cycle')
  assert.ok(next.startsWith('#/writing/atlas-building-an-evidence-console?'))
  assert.equal(articleSection(next), 'improvement-cycle')
  assert.equal(new URLSearchParams(next.split('?')[1]).get('from'), '#/writing')
})

test('discovery and related reading exclude all delisted notes', () => {
  assert.equal(catalog.length, 4)
  assert.ok(catalog.some(item => item.slug === 'who-owns-texas-toll-roads'))
  const retired = new Set(archived.map(item => item.slug))
  for (const article of catalog) {
    assert.ok(!retired.has(article.slug))
    for (const related of relatedArticles(article, catalog)) assert.ok(!retired.has(related.slug))
  }
  assert.equal(articleHref('https://example.org/research/technical-seo/raw-html-rendered-dom-evidence', catalog), 'https://example.org/research/technical-seo/raw-html-rendered-dom-evidence')
})
