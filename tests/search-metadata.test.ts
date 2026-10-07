import test from 'node:test'
import assert from 'node:assert/strict'
import { searchMetadata, sourceDate, metadataTags, withSearchHead, serializeSchema, personId, websiteId } from '../src/personal/search-metadata.ts'
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
  assert.deepEqual(node.isPartOf, [{ '@id': websiteId }, { '@id': 'https://sulayman-bowles.dev/topics/ai-and-verification#webpage' }])
  const parent = article.schema!['@graph'].find(node => node['@id'] === 'https://sulayman-bowles.dev/topics/ai-and-verification#webpage')!
  assert.equal(parent['@type'], 'CollectionPage')
  assert.equal(parent.name, 'Make AI results inspectable — Sulayman Bowles')
  assert.deepEqual(parent.isPartOf, { '@id': websiteId })
  assert.equal(article.canonical, 'https://sulayman-bowles.dev/research/ai-systems/the-first-ai-managers')
  assert.equal(article.article?.published, '2026-07-14')
  assert.equal(article.image.url, 'https://sulayman-bowles.dev/images/social/og-research.png')
})

test('topic search titles describe the subject while schema preserves the visible collection heading', () => {
  const topic = searchMetadata('topics/financial-systems')
  assert.equal(topic.title, 'Texas Toll-Road & Airline Loyalty Research — Sulayman Bowles')
  const page = topic.schema!['@graph'].find(node => node['@id'] === `${topic.canonical}#webpage`)!
  assert.equal(page['@type'], 'CollectionPage')
  assert.equal(page.name, 'Who owns the cash flow? — Sulayman Bowles')
  assert.equal(page.datePublished, undefined)
  assert.equal(page.dateModified, '2026-10-06')
  assert.equal(topic.article, undefined)
})

test('article citations include visible guide and answer-note evidence once per exact URL', () => {
  const article = searchMetadata('writing/why-texas-toll-roads-stay-tolled').schema!['@graph'].find(node => node['@type'] === 'Article')!
  assert.deepEqual(article.citation, [
    'https://www.ntta.org/about-us/financial-information',
    'https://www.txdot.gov/content/dam/docs/division/gov/hb-803-report-fy-2025.pdf',
    'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh288-toll-lanes/executed-agreements.html',
    'https://auditor.harriscountytx.gov/Reports/Annual-Comprehensive-Financial-Report-Harris-County',
    'https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6',
    'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html',
  ])
  assert(searchMetadata('contact').schema!['@graph'].every(node => node.citation === undefined))
})

test('citations resolve local evidence on the canonical origin and retain source fragments', () => {
  const hardware = searchMetadata('writing/hidden-financing-hardware-startups').schema!['@graph'].find(node => node['@type'] === 'Article')!
  assert((hardware.citation as string[]).includes('https://sulayman-bowles.dev/research/hidden-financing-report.pdf'))
  const robots = searchMetadata('writing/robots-txt-courtesy-not-access-control').schema!['@graph'].find(node => node['@type'] === 'Article')!
  assert((robots.citation as string[]).includes('https://www.rfc-editor.org/rfc/rfc9309.html#section-3'))
  assert((robots.citation as string[]).includes('https://developers.openai.com/api/docs/bots'))
  assert((robots.citation as string[]).includes('https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests'))
  assert.equal(new Set(robots.citation as string[]).size, (robots.citation as string[]).length)
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
  assert.equal(searchMetadata('writing/atlas-building-an-evidence-console').article?.modified, '2026-10-05')
  assert.equal(searchMetadata('writing/viralbench-codex-agent-harness').article?.modified, '2026-10-05')
})

test('actual answer-note editions update article and social dates without changing publication dates', () => {
  const article = searchMetadata('writing/why-texas-toll-roads-stay-tolled')
  assert.equal(article.article?.published, '2026-09-02')
  assert.equal(article.article?.modified, '2026-10-06')
  const node = article.schema!['@graph'].find(node => node['@type'] === 'Article')!
  assert.equal(node.datePublished, '2026-09-02')
  assert.equal(node.dateModified, '2026-10-06')
  assert.equal(metadataTags(article).find(tag => tag.key === 'article:modified_time')?.value, '2026-10-06')
  assert.equal(searchMetadata('writing/hidden-financing-hardware-startups').article?.modified, '2026-10-05')
})

test('rebuilding a head removes stale article data, duplicate canonicals, and old schema', () => {
  const shell = '<html><head><title>Old</title><meta name="viewport" content="width=device-width"><meta property="og:image" content="old"><link rel="canonical" href="old"><link rel="canonical" href="duplicate"><meta property="article:published_time" content="old"><script id="page-schema" type="application/ld+json">{}</script></head><body><h1>Accepted headline</h1></body></html>'
  const html = withSearchHead(shell, searchMetadata('contact'))
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.equal((html.match(/id="page-schema"/g) || []).length, 1)
  assert.equal((html.match(/type="application\/atom\+xml"/g) || []).length, 1)
  assert.equal((html.match(/data-machine-discovery=/g) || []).length, 2)
  assert(html.includes('rel="describedby" type="text/plain" href="https://sulayman-bowles.dev/llms.txt"'))
  assert(html.includes('rel="describedby" type="application/json" href="https://sulayman-bowles.dev/machine/profile.json"'))
  assert.equal(html.match(/<body>([^]*?)<\/body>/)![1], shell.match(/<body>([^]*?)<\/body>/)![1])
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
  assert.equal(documentHref('#/writing/structured-data-without-content-drift'), '/research/technical-seo/structured-data-without-content-drift')
  assert.equal(documentHref('#source-s1'), '#source-s1')
  assert.equal(withDocumentLinks('<a href="#/writing/the-first-ai-managers?section=case-inventory&amp;from=other">Study</a>'), '<a href="/research/ai-systems/the-first-ai-managers#case-inventory">Study</a>')
  assert.throws(() => documentHref('#/missing-page'), /Unresolved public link/)
})
