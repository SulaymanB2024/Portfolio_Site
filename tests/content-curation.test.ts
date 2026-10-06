import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { consolidatedDestination, withdrawnArticleSlugs } from '../src/personal/editorial/curation.ts'
import { writingSelection } from '../src/personal/editorial/writing-selection.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { articleHref } from '../src/personal/editorial/links.ts'
import { articleSection, sectionHref, relatedArticles, filterWritingArticles } from '../src/personal/editorial/library.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'
import { withWritingCopy } from '../src/personal/site-copy.ts'
import { publicPages } from '../src/personal/public-pages.ts'

const load = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const catalog: ArticleSummary[] = load('../src/personal/editorial/data/catalog.json')
const archived: ArticleSummary[] = load('../src/personal/editorial/data/archived-catalog.json')
const hosting = load('../vercel.json')

test('subject searches include the original essays through lightweight catalog metadata', () => {
  const essays = catalog.map(withWritingCopy)
  for (const [query, slug] of [
    ['sqlite', 'sqlite-crawl-pipelines'], ['loyalty', 'how-airlines-borrow-against-loyalty-programs'],
    ['hardware startup', 'hidden-financing-hardware-startups'], ['megawatt', 'the-ai-megawatt'],
    ['austin home', 'who-owns-austin-home-service-companies'], ['toll roads', 'why-texas-toll-roads-stay-tolled'],
  ]) assert(filterWritingArticles(essays, { query, category: 'All' }).some(article => article.slug === slug), query)
  assert.deepEqual(filterWritingArticles(essays, { query: 'loyalty', category: 'AI INFRASTRUCTURE' }), [])
})

test('discovery, reader covers and public metadata describe the same manuscripts', () => {
  for (const summary of catalog) {
    const article = load(`../src/personal/editorial/data/articles/${summary.slug}.json`)
    const card = withWritingCopy(summary)
    const reader = withWritingCopy(article)
    const page = publicPages.find(page => page.route === `writing/${summary.slug}`)!
    assert.ok(page)
    assert.equal(summary.title, article.title)
    assert.equal(summary.displayTitle, article.displayTitle)
    assert.equal(card.subtitle, reader.subtitle)
    assert.equal(page.description, reader.subtitle)
    assert.equal(page.title, `${reader.displayTitle || reader.title} — Sulayman Bowles`)
    assert.equal(page.path, article.path)
    assert.equal(summary.date, article.date)
  }
})

test('every original path, alias and reader bookmark opens its own article', () => {
  for (const article of catalog) for (const url of [article.path, ...(article.aliases || []), `/writing/${article.slug}`]) {
    const route = `writing/${article.slug}`
    assert.equal(consolidatedDestination(url), undefined)
    assert.equal(resolveRoute('', url, catalog), route)
    assert.equal(resolveRoute(`#${url}?from=%23%2Fwriting`, '/', catalog), route)
    if (url !== `/writing/${article.slug}`) assert.equal(articleHref(`https://sulayman-bowles.dev${url}`, catalog), `#/${route}`)
  }
  assert(archived.every(article => catalog.some(item => item.slug === article.slug) || withdrawnArticleSlugs.includes(article.slug)))
})

test('previously withdrawn manuscripts keep their own canonical response and bookmarks', () => {
  assert.equal(withdrawnArticleSlugs.length, 0)
  for (const slug of ['canonicalization-graph-consistency', 'internal-links-directed-retrieval-graph', 'robots-txt-courtesy-not-access-control', 'structured-data-without-content-drift', 'audit-findings-derived-records']) {
    const article = catalog.find(item => item.slug === slug)!
    assert(article)
    assert(publicPages.some(page => page.route === `writing/${slug}`))
    const retained = archived.find(item => item.slug === slug)!
    assert(retained)
    for (const path of [retained.path, ...(retained.aliases || []), `/writing/${slug}`]) {
      assert.equal(resolveRoute('', path, catalog), `writing/${slug}`)
      assert.equal(resolveRoute(`#${path}`, '/', catalog), `writing/${slug}`)
      assert.equal(consolidatedDestination(path), undefined)
      assert.equal(articleSection(`#${path}?section=reader-target`), 'reader-target')
      const redirects = hosting.routes.slice(0, hosting.routes.findIndex((route: any) => route.handle === 'filesystem'))
      const redirect = redirects.find((route: any) => !route.has && route.headers?.Location && new RegExp(`^(?:${route.src})$`).test(path))
      if (path === article.path) assert.equal(redirect, undefined, 'Canonical article must reach the filesystem')
      else assert.equal(redirect?.headers.Location, article.path, 'Alias redirects directly to its own article')
    }
    assert(readFileSync(new URL(`../src/personal/editorial/data/articles/${slug}.json`, import.meta.url)).length > 0)
  }
})

test('the curated collection leads with Shopkeeper and separates substantial essays from implementation notes', () => {
  const selection = writingSelection(catalog)
  assert.equal(selection.selected[0].slug, 'the-first-ai-managers')
  assert.equal(selection.selected.length, 7)
  assert(!selection.selected.some(article => article.slug === 'canonical-identity-personal-seo'))
  const all = [...selection.selected, ...selection.more, ...selection.notes]
  assert.equal(all.length, catalog.length)
  assert.equal(new Set(all.map(article => article.slug)).size, catalog.length)
  assert(selection.more.some(article => article.slug === 'viralbench-codex-agent-harness'))
  assert(selection.notes.some(article => article.slug === 'ai-search-crawler-policy'))
  const filtered = writingSelection(filterWritingArticles(catalog, { query: 'loyalty', category: 'All' }))
  assert.equal(filtered.selected.length, 1)
  assert.equal(filtered.selected[0].slug, 'how-airlines-borrow-against-loyalty-programs')
})

test('old reader section targets stay on the recovered manuscript', () => {
  const old = '#/writing/raw-html-rendered-dom-evidence?from=%23%2Fwriting'
  assert.equal(articleSection(old), null)
  assert.equal(articleSection('#sources', '/research/technical-seo/raw-html-rendered-dom-evidence'), 'sources')
  const next = sectionHref(old, 'conclusion')
  assert.ok(next.startsWith('#/writing/raw-html-rendered-dom-evidence?'))
  assert.equal(articleSection(next), 'conclusion')
  assert.equal(new URLSearchParams(next.split('?')[1]).get('from'), '#/writing')
})

test('related reading only links routed articles, with siblings preferred for restored research', () => {
  for (const article of catalog) for (const related of relatedArticles(article, catalog)) {
    assert.notEqual(related.slug, article.slug)
    assert(catalog.some(item => item.slug === related.slug))
  }
  const waymo = catalog.find(item => item.slug === 'waymo-hardware-financing')!
  assert(relatedArticles(waymo, catalog).every(item => item.path.startsWith('/research/financial-systems/')))
  assert.equal(articleHref('https://example.org/research/technical-seo/raw-html-rendered-dom-evidence', catalog), 'https://example.org/research/technical-seo/raw-html-rendered-dom-evidence')
})
