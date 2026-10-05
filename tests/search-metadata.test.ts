import test from 'node:test'
import assert from 'node:assert/strict'
import { searchMetadata, sourceDate, withSearchHead, serializeSchema, personId, websiteId } from '../src/personal/search-metadata.ts'
import { documentHref, withDocumentLinks } from '../tools/public-document-links.ts'
import { identity } from '../src/personal/identity.ts'

test('homepage search identity is descriptive while the published headline stays separate', () => {
  const home = searchMetadata('home')
  assert.equal(home.title, 'Sulayman Bowles — Product, AI & Finance')
  assert.equal(home.canonical, 'https://sulayman-bowles.dev/')
  assert.equal(home.schema!['@graph'].find(node => node['@type'] === 'Person')?.description, identity.homeSummary)
  assert.equal(home.schema!['@graph'].find(node => node['@type'] === 'WebPage')?.name, 'The frontier is all that matters — Sulayman Bowles')
})

test('profile pages and articles share one author and website identity', () => {
  const about = searchMetadata('about').schema!['@graph']
  assert.equal(about.find(node => node['@type'] === 'ProfilePage')?.mainEntity && (about.find(node => node['@type'] === 'ProfilePage')!.mainEntity as any)['@id'], personId)
  const article = searchMetadata('writing/the-first-ai-managers')
  const node = article.schema!['@graph'].find(node => node['@type'] === 'Article')!
  assert.equal((node.author as any)['@id'], personId)
  assert.equal((node.isPartOf as any)['@id'], websiteId)
  assert.equal(article.canonical, 'https://sulayman-bowles.dev/research/ai-systems/the-first-ai-managers')
  assert.equal(article.article?.published, '2026-07-14')
  assert.equal(article.image.url, 'https://sulayman-bowles.dev/images/social/og-research.png')
})

test('the person uses the reviewed biography and connected profiles without implying a completed degree', () => {
  const person = searchMetadata('resume').schema!['@graph'].find(node => node['@type'] === 'Person')!
  assert.equal(person.description, identity.summary)
  assert.equal(person.mainEntityOfPage, 'https://sulayman-bowles.dev/about')
  assert.deepEqual(person.sameAs, identity.profiles.map(profile => profile.href))
  assert.equal((person.affiliation as any).name, 'The University of Texas at Austin')
  assert.equal(person.alumniOf, undefined)
  assert.equal(person.image, undefined)
  assert.equal(person.jobTitle, undefined)
  const about = searchMetadata('about')
  assert.equal(about.schema!['@graph'].find(node => node['@type'] === 'Person')?.description, about.description)
})

test('invalid routes do not borrow the homepage identity or article fields', () => {
  const missing = searchMetadata('writing/does-not-exist')
  assert.equal(missing.robots, 'noindex, follow')
  assert.equal(missing.canonical, 'https://sulayman-bowles.dev/404')
  assert.equal(missing.schema, null)
  assert.equal(missing.article, undefined)
})

test('source dates normalize real dates without inventing freshness', () => {
  assert.equal(sourceDate('2026.07.14'), '2026-07-14')
  assert.equal(sourceDate('2026-02-29'), undefined)
  assert.equal(sourceDate('2026-13-01'), undefined)
  assert.equal(sourceDate('today'), undefined)
  assert.equal(sourceDate(), undefined)
  assert.equal(searchMetadata('writing/atlas-building-an-evidence-console').article?.modified, undefined)
  assert.equal(searchMetadata('writing/viralbench-codex-agent-harness').article?.modified, '2026-07-14')
})

test('rebuilding a head removes stale article data, duplicate canonicals, and old schema', () => {
  const shell = '<html><head><title>Old</title><meta name="viewport" content="width=device-width"><meta property="og:image" content="old"><link rel="canonical" href="old"><link rel="canonical" href="duplicate"><meta property="article:published_time" content="old"><script id="page-schema" type="application/ld+json">{}</script></head><body><h1>Accepted headline</h1></body></html>'
  const html = withSearchHead(shell, searchMetadata('contact'))
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.equal((html.match(/id="page-schema"/g) || []).length, 1)
  assert.equal((html.match(/type="application\/atom\+xml"/g) || []).length, 1)
  assert.equal((html.match(/property="og:image"/g) || []).length, 1)
  assert(!html.includes('article:published_time'))
  assert(html.includes('<h1>Accepted headline</h1>'))
  assert(html.includes('name="viewport" content="width=device-width"'))
  assert.equal(withSearchHead(html, searchMetadata('contact')).replace(/>\s+</g, '><'), html.replace(/>\s+</g, '><'))
})

test('metadata treats markup and replacement tokens as literal text', () => {
  const metadata = searchMetadata('contact')
  metadata.title = 'Literal $& "title" <script> & text'
  metadata.description = '</head><script>bad()</script> $& "quoted"'
  metadata.schema!['@graph'][0].description = '</script><script>bad()</script>'
  const html = withSearchHead('<html><head><title>Old</title></head><body></body></html>', metadata)
  assert(html.includes('Literal $&amp; &quot;title&quot; &lt;script&gt; &amp; text'))
  assert(!html.includes('<script>bad()'))
  assert(!serializeSchema(metadata.schema).includes('</script>'))
  assert.deepEqual(JSON.parse(serializeSchema(metadata.schema)), metadata.schema)
})

test('initial article links resolve to real documents and retain section targets', () => {
  assert.equal(documentHref('#/writing/the-first-ai-managers?section=case-inventory&from=%23%2Fwriting'), '/research/ai-systems/the-first-ai-managers#case-inventory')
  assert.equal(documentHref('#/writing/structured-data-without-content-drift'), '/writing/atlas-building-an-evidence-console#findings')
  assert.equal(documentHref('#source-s1'), '#source-s1')
  assert.equal(withDocumentLinks('<a href="#/writing/the-first-ai-managers?section=case-inventory&amp;from=other">Study</a>'), '<a href="/research/ai-systems/the-first-ai-managers#case-inventory">Study</a>')
  assert.throws(() => documentHref('#/missing-page'), /Unresolved public link/)
})
