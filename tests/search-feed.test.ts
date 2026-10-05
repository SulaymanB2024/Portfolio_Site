import test from 'node:test'
import assert from 'node:assert/strict'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { writingFeed } from '../tools/search-feed.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

test('feed uses canonical essay identities, real source dates, and the public author', () => {
  const feed = writingFeed(catalog)
  assert.equal((feed.match(/<entry>/g) || []).length, 4)
  assert(feed.includes('<name>Sulayman Bowles</name><uri>https://sulayman-bowles.dev/about</uri>'))
  assert(feed.includes('<updated>2026-10-01T00:00:00Z</updated>'))
  for (const article of catalog) assert(feed.includes(`<id>https://sulayman-bowles.dev${article.path}</id>`))
  assert(!feed.includes('#/'))
  assert(feed.indexOf('/writing/atlas-building-an-evidence-console</id>') < feed.indexOf('/markets/who-owns-texas-toll-roads</id>'))
  assert.equal(writingFeed(catalog), writingFeed([...catalog].reverse()))
})

test('feed escapes XML and rejects invalid dates, duplicate identities, and external URLs', () => {
  const article: ArticleSummary = { ...catalog[0], slug: 'xml-escaping', path: '/writing/xml-escaping', displayTitle: 'A & B < C', subtitle: '"Quoted" & <text>' }
  const feed = writingFeed([article])
  assert(feed.includes('<title>A &amp; B &lt; C</title>'))
  assert(feed.includes('<summary type="text">&quot;Quoted&quot; &amp; &lt;text&gt;</summary>'))
  assert.throws(() => writingFeed([{ ...article, date: '2026-02-30' }]), /Invalid feed content date/)
  assert.throws(() => writingFeed([{ ...article, dateModified: '2020-01-01' }]), /predates publication/)
  for (const path of ['https://example.com/essay', '/writing/essay#section', '/writing/essay?q=search']) assert.throws(() => writingFeed([{ ...article, path }]), /Invalid canonical feed path/)
  assert.throws(() => writingFeed([article, article]), /Duplicate feed entry/)
})
