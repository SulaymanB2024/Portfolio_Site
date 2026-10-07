import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { answerNotes, readerModifiedDate, questionAnchor } from '../src/personal/editorial/answer-notes.ts'
import { documentModifiedDate } from './search-sitemap.ts'
import { findReadingTopic, topicQuestions } from '../src/personal/editorial/topics.ts'

const origin = 'https://sulayman-bowles.dev'
const read = path => readFile(path, 'utf8')
const decode = text => text.replace(/&(amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (_, entity) => {
  if (entity.startsWith('#x')) return String.fromCodePoint(parseInt(entity.slice(2), 16))
  if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)))
  return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[entity]
})
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], decode(match[2])]))
const catalog = JSON.parse(await read('src/personal/editorial/data/catalog.json'))
const guides = JSON.parse(await read('src/personal/editorial/data/reader-guides.json'))
const sourceAccess = JSON.parse(await read('src/personal/editorial/data/source-access.json'))
const artworkSource = await read('src/personal/editorial/generative/manifest.ts')
const artworkAssignments = new Map([...artworkSource.matchAll(/'([^']+)': '(yuru-\d+)'/g)].map(match => [match[1], match[2]]))
const artworkCredits = new Map([...artworkSource.matchAll(/\['(yuru-\d+)', '[^']+', '(\d+)'\]/g)].map(match => [match[1], `https://x.com/yuruyurau/status/${match[2]}`]))
const coverPoster = article => {
  const sketch = artworkAssignments.get(article.path)
  assert(sketch, `Missing assigned cover: ${article.slug}`)
  return `/images/generative-art/${sketch}.webp`
}
assert.deepEqual(Object.keys(guides).sort(), catalog.map(article => article.slug).sort(), 'Every essay has one reading guide')
assert(Object.keys(sourceAccess.articles).every(slug => catalog.some(article => article.slug === slug)), 'Source access notes belong to published essays')
const sitemap = await read('dist/sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(decode(match[1])))
const sitemapRecords = new Map([...sitemap.matchAll(/<url>([^]*?)<\/url>/g)].map(match => [decode(match[1].match(/<loc>([^<]+)<\/loc>/)[1]), match[1]]))
assert.equal(new Set(urls.map(url => url.href)).size, urls.length, 'Duplicate sitemap entries')
const titles = new Set()
let citations = 0
for (const url of urls) {
  assert.equal(url.origin, origin)
  const article = catalog.find(article => article.path === url.pathname)
  assert.equal(url.search + url.hash, '', 'Sitemap discovery must use canonical document paths')
  const html = await read(join('dist', url.pathname, 'index.html'))
  const head = html.match(/<head>([^]*?)<\/head>/)?.[1]
  const body = html.match(/<body>([^]*?)<\/body>/)?.[1]
  assert(head && body, `Incomplete document: ${url.pathname}`)
  const canonical = [...head.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).filter(tag => tag.rel === 'canonical')
  assert.equal(canonical.length, 1, `Duplicate/missing canonical: ${url.pathname}`)
  assert.equal(canonical[0].href, url.href)
  const expectedModified = documentModifiedDate(article ? `writing/${article.slug}` : url.pathname.slice(1))
  const sitemapEntry = sitemapRecords.get(url.href)
  assert(sitemapEntry, `Missing sitemap record: ${url.pathname}`)
  assert.equal(sitemapEntry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1], expectedModified, `Sitemap edition-date drift: ${url.pathname}`)
  const feeds = [...head.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).filter(tag => tag.type === 'application/atom+xml')
  assert.equal(feeds.length, 1, `Missing/duplicate writing feed: ${url.pathname}`)
  assert.equal(feeds[0].rel, 'alternate'); assert.equal(feeds[0].href, `${origin}/feed.xml`)
  const machineLinks = [...head.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0])).filter(tag => tag['data-machine-discovery'])
  assert.deepEqual(machineLinks.map(tag => [tag.rel, tag.type, tag.href]), [
    ['describedby', 'text/plain', `${origin}/llms.txt`],
    ['describedby', 'application/json', `${origin}/machine/profile.json`],
  ], `Missing/duplicate machine discovery: ${url.pathname}`)
  const titleMatches = [...head.matchAll(/<title>([^]*?)<\/title>/g)]
  assert.equal(titleMatches.length, 1)
  const title = decode(titleMatches[0][1])
  assert(title.includes('Sulayman Bowles'))
  assert(!titles.has(title), `Duplicate search title: ${url.pathname}`); titles.add(title)
  const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0])).filter(tag => tag.name || tag.property)
  const keys = metas.map(tag => tag.name || tag.property)
  assert.equal(new Set(keys).size, keys.length, `Duplicate head metadata: ${url.pathname}`)
  const meta = Object.fromEntries(metas.map(tag => [tag.name || tag.property, tag.content]))
  assert(meta.description?.trim(), `Missing description: ${url.pathname}`)
  assert.equal(meta['og:title'], title); assert.equal(meta['twitter:title'], title)
  assert.equal(meta['og:description'], meta.description); assert.equal(meta['twitter:description'], meta.description)
  assert.equal(meta['og:url'], url.href)
  assert.equal(meta['twitter:card'], 'summary_large_image')
  assert.equal(meta['twitter:image'], meta['og:image'])
  assert.equal(meta['twitter:image:alt'], meta['og:image:alt'])
  assert(meta['og:image:alt']?.trim())
  assert.equal(meta.robots, 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  const image = new URL(meta['og:image'])
  assert.equal(image.origin, origin)
  const imageMetadata = await sharp(join('dist', image.pathname)).metadata()
  if (meta['og:image:width']) assert.equal(Number(meta['og:image:width']), imageMetadata.width)
  if (meta['og:image:height']) assert.equal(Number(meta['og:image:height']), imageMetadata.height)
  const scripts = [...head.matchAll(/<script\b[^>]*id="page-schema"[^>]*>([^]*?)<\/script>/g)]
  assert.equal(scripts.length, 1, `Duplicate/missing page schema: ${url.pathname}`)
  const schema = JSON.parse(scripts[0][1])
  assert.equal(schema['@context'], 'https://schema.org')
  const graph = schema['@graph']
  assert(Array.isArray(graph))
  const ids = new Set(graph.map(node => node['@id']))
  assert.equal(ids.size, graph.length, `Duplicate entity IDs: ${url.pathname}`)
  const person = graph.find(node => node['@id'] === `${origin}/#person`)
  const website = graph.find(node => node['@id'] === `${origin}/#website`)
  const page = graph.find(node => node['@id'] === `${url.href}#webpage`)
  assert.equal(person?.['@type'], 'Person'); assert.equal(person.name, 'Sulayman Bowles')
  assert.equal(person.url, `${origin}/about`)
  assert(person.sameAs.includes('https://github.com/SulaymanB2024'))
  assert(person.sameAs.includes('https://sulayman-bowles.tech/'))
  assert.equal(person.mainEntityOfPage, `${origin}/about`)
  assert.equal(person.givenName, 'Sulayman'); assert.equal(person.familyName, 'Bowles')
  assert.equal(website?.['@type'], 'WebSite'); assert.equal(website.name, 'Sulayman Bowles')
  assert.equal(page?.url, url.href); assert.equal(page.description, meta.description)
  const checkReferences = value => {
    if (!value || typeof value !== 'object') return
    if (value['@id']) assert(ids.has(value['@id']), `Unresolved schema reference: ${value['@id']}`)
    Object.values(value).forEach(checkReferences)
  }
  checkReferences(graph)
  if (['/about', '/resume'].includes(url.pathname)) {
    assert.equal(page['@type'], 'ProfilePage')
    assert.equal(page.mainEntity['@id'], person['@id'])
  }
  const h1 = [...body.matchAll(/<h1\b[^>]*>([^]*?)<\/h1>/g)]
  assert.equal(h1.length, 1, `Ambiguous page identity: ${url.pathname}`)
  assert(!body.includes('href="#/'), `Fragment route in initial HTML: ${url.pathname}`)
  const links = new Set([...body.matchAll(/<a\b[^>]*>/g)].map(match => attributes(match[0]).href))
  const elementIds = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(match => decode(match[1])))
  if (article || url.pathname === '/writing') assert(elementIds.has('artwork-ink'), `Missing shared cover ink treatment: ${url.pathname}`)
  if (url.pathname === '/writing') {
    const cards = [...body.matchAll(/<a\b[^>]*class="public-writing-story"[^>]*>[^]*?<\/a>/g)].map(match => match[0])
    assert.equal(cards.length, catalog.length, 'Every writing entry must retain its cover card')
    const seen = new Set()
    for (const card of cards) {
      const tag = attributes(card.match(/^<a\b[^>]*>/)[0])
      const entry = catalog.find(article => article.slug === tag['data-slug'])
      assert(entry && !seen.has(entry.slug), `Unknown/duplicate writing card: ${tag['data-slug']}`)
      seen.add(entry.slug)
      assert.equal(tag.href, entry.path, `Cover must open its own essay: ${entry.slug}`)
      const posters = [...card.matchAll(/<img\b[^>]*>/g)].map(match => attributes(match[0]))
      assert.equal(posters.length, 1, `Missing/duplicate writing cover: ${entry.slug}`)
      assert.equal(posters[0].src, coverPoster(entry), `Writing cover assignment drift: ${entry.slug}`)
      assert.equal(posters[0].alt, '', 'Card text names the decorative cover')
      assert.equal(posters[0].width, '400'); assert.equal(posters[0].height, '400')
    }
    assert(body.indexOf('class="public-writing-story"') < body.indexOf('aria-label="Reading paths"'), 'Featured covers must precede reading paths')
  }
  if (['/', '/about'].includes(url.pathname)) {
    assert(decode(body).includes(person.description), `Visible biography/schema drift: ${url.pathname}`)
    // Verified profiles remain in the identity schema; the homepage intentionally
    // omits the separate social navigation, while About opens on the collection.
    assert(links.has(url.pathname === '/' ? '/about' : '/resume'))
  }
  for (const href of links) if (/^#(?:source-|note-)/.test(href)) {
    assert(elementIds.has(decodeURIComponent(href.slice(1))), `Missing citation target: ${url.pathname}${href}`)
  }
  if (article) {
    const source = JSON.parse(await read(`src/personal/editorial/data/articles/${article.slug}.json`))
    const cover = body.match(/<figure\b[^>]*class="public-article-cover"[^>]*>([^]*?)<\/figure>/)
    assert(cover, `Article cover absent from initial HTML: ${article.slug}`)
    assert.equal(attributes(cover[0].match(/^<figure\b[^>]*>/)[0])['data-sketch'], artworkAssignments.get(article.path))
    const poster = attributes(cover[1].match(/<img\b[^>]*>/)?.[0] || '')
    assert.equal(poster.src, coverPoster(article), `Article cover assignment drift: ${article.slug}`)
    assert(poster.alt?.trim(), `Article cover needs a description: ${article.slug}`)
    assert.equal(poster.width, '400'); assert.equal(poster.height, '400'); assert.equal(poster.loading, 'eager')
    const posterMetadata = await sharp(join('dist', poster.src)).metadata()
    assert.equal(posterMetadata.width, 400); assert.equal(posterMetadata.height, 400)
    assert(cover[1].includes(artworkCredits.get(artworkAssignments.get(article.path))), `Original artwork credit missing: ${article.slug}`)
    const guide = guides[article.slug]
    assert(decode(body).includes(guide.question) && decode(body).includes(guide.answer), `Guide absent from initial response: ${article.slug}`)
    assert.equal(new Set(guide.paths.map(path => path.section)).size, 3, `Distinct reading tasks: ${article.slug}`)
    for (const path of guide.paths) {
      assert(elementIds.has(path.section), `Broken guide destination: ${article.slug}#${path.section}`)
      assert(links.has(`#${encodeURIComponent(path.section)}`), `Missing guide link: ${article.slug}#${path.section}`)
    }
    for (const evidence of guide.sources) {
      assert(links.has(evidence.href), `Missing guide source: ${article.slug}`)
      assert(JSON.stringify(source).includes(evidence.href), `Guide introduces an unreviewed source: ${article.slug}`)
    }
    for (const note of sourceAccess.articles[article.slug] || []) {
      assert(JSON.stringify(source).includes(note.href), `Access note must preserve an actual original citation: ${article.slug}`)
      assert(elementIds.has('source-access-notes') && links.has('#source-access-notes'), `Access alternatives are not reachable: ${article.slug}`)
      assert(links.has(note.href) && decode(body).includes(note.note), `Historical citation/access note missing: ${article.slug}`)
      for (const alternative of note.alternatives) assert(links.has(alternative.href), `Missing source access alternative: ${article.slug}`)
    }
    const node = graph.find(node => node['@type'] === 'Article')
    assert(node, `Missing article entity: ${article.slug}`)
    assert.equal(node.headline, decode(h1[0][1]))
    assert.equal(title, `${source.seoTitle || source.title} — Sulayman Bowles`)
    assert.equal(meta.description, source.seoDescription || source.subtitle)
    assert.equal(node.mainEntityOfPage['@id'], page['@id'])
    assert.equal(node.author['@id'], person['@id'])
    assert.equal(node.datePublished, source.date.replaceAll('.', '-'))
    assert.equal(node.dateModified, readerModifiedDate(article.slug, source.dateModified))
    assert.equal(meta['og:type'], 'article'); assert.equal(meta['article:published_time'], node.datePublished)
    assert.equal(meta['article:modified_time'], node.dateModified)
    assert.equal(new Set(node.citation).size, node.citation.length, `Duplicate schema citations: ${article.slug}`)
    for (const citation of node.citation) {
      const citedUrl = new URL(citation)
      const href = citedUrl.origin === origin ? `${citedUrl.pathname}${citedUrl.search}${citedUrl.hash}` : citation
      assert(links.has(href), `Citation absent from visible HTML: ${article.slug} → ${citation}`)
    }
    const notes = answerNotes(article.slug)
    if (notes) {
      assert(elementIds.has('answer-notes') && links.has('#answer-notes'), `Answer notes cannot be found: ${article.slug}`)
      assert(decode(body).includes(notes.boundary), `Missing answer scope: ${article.slug}`)
      for (const note of notes.questions) {
        assert(elementIds.has(note.id) && links.has(`#${note.id}`), `Unlinkable answer: ${article.slug}#${note.id}`)
        assert(decode(body).includes(note.question) && decode(body).includes(note.answer), `Answer absent from initial HTML: ${article.slug}#${note.id}`)
        assert(elementIds.has(note.section) && links.has(`#${note.section}`), `Unreachable supporting analysis: ${article.slug}#${note.id}`)
        for (const evidence of note.sources) assert(links.has(evidence.href), `Answer source missing: ${article.slug}#${note.id}`)
      }
    }
    for (const faq of source.faqs || []) assert(elementIds.has(questionAnchor(faq.question)) && links.has(`#${questionAnchor(faq.question)}`), `Question permalink missing: ${article.slug}`)
    const boundary = source.pageContent?.boundary?.text || source.evidenceBoundary
    if (boundary) assert(body.includes(boundary.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;')), `Missing evidence boundary: ${article.slug}`)
    for (const section of [...(source.sections || []), ...(source.markdownSections || [])]) {
      assert(elementIds.has(section.id), `Missing article section: ${article.slug}#${section.id}`)
    }
    for (const sourceRecord of source.sources || []) {
      const urls = sourceRecord.markdown
        ? [...sourceRecord.markdown.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1])
        : sourceRecord.href ? [sourceRecord.href] : sourceRecord.hrefs || []
      for (const href of urls) {
        // Canonical local source links are checked separately by the release gate.
        if (new URL(href, origin).origin !== origin) assert(links.has(href), `Missing source citation: ${article.slug} → ${href}`)
        citations++
      }
    }
    assert(links.has('/about'), `Missing author profile link: ${article.slug}`)
    assert(elementIds.has('author-note-title'), `Missing visible author biography: ${article.slug}`)
    assert(links.has('/feed.xml'), `Missing author feed link: ${article.slug}`)
  } else {
    assert.equal(meta['og:type'], 'website')
    assert(!keys.some(key => key.startsWith('article:')), `Leaked article metadata: ${url.pathname}`)
  }
  if (['/work', '/writing'].includes(url.pathname) || url.pathname.startsWith('/topics/')) {
    const list = graph.find(node => node['@type'] === 'ItemList')
    assert(list?.itemListElement.length, `Missing collection contents: ${url.pathname}`)
    for (const item of list.itemListElement) assert(links.has(new URL(item.url).pathname), `Collection item missing from HTML: ${item.url}`)
    const topic = url.pathname.startsWith('/topics/') ? findReadingTopic(url.pathname.slice('/topics/'.length)) : undefined
    if (topic) {
      assert.equal(page.dateModified, topic.questionsUpdated)
      assert(body.toLowerCase().includes(`datetime="${topic.questionsUpdated}"`), `Topic date is not visible: ${topic.slug}`)
      for (const question of topicQuestions(topic)) assert(links.has(`${question.article.path}#${question.section}`), `Missing topic question path: ${topic.slug}`)
    }
  }
}
const feed = await read('dist/feed.xml')
assert(feed.includes('<feed xmlns="http://www.w3.org/2005/Atom"'))
assert(feed.includes(`<name>Sulayman Bowles</name><uri>${origin}/about</uri>`))
const entries = [...feed.matchAll(/<entry>([^]*?)<\/entry>/g)].map(match => match[1])
assert.equal(entries.length, catalog.length)
for (const article of catalog) {
  const entry = entries.find(entry => entry.includes(`<id>${origin}${article.path}</id>`))
  assert(entry, `Canonical essay missing from feed: ${article.slug}`)
  assert(entry.includes(`<published>${article.date.replaceAll('.', '-')}T00:00:00Z</published>`))
  assert(entry.includes(`<updated>${readerModifiedDate(article.slug, article.dateModified) || article.date.replaceAll('.', '-')}T00:00:00Z</updated>`))
}
const robots = await read('dist/robots.txt')
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
  assert(new RegExp(`User-agent: ${bot}\\s+Allow: /(?:\\s|$)`, 'i').test(robots), `Search crawler permission missing: ${bot}`)
}
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
const discovery = await read('dist/llms.txt')
for (const url of urls) assert(discovery.includes(`](${url.href})`), `Discovery record missing: ${url.pathname}`)
assert(!discovery.includes('/#/'))
const profile = JSON.parse(await read('dist/machine/profile.json'))
const references = JSON.parse(await read('dist/machine/references.json'))
const fullText = await read('dist/llms-full.txt')
assert.equal(profile.id, `${origin}/#person`)
assert.equal(profile.name, 'Sulayman Bowles')
assert.deepEqual(references.pages.map(page => page.url), urls.map(url => url.href))
assert.equal(references.articles.length, catalog.length)
assert.equal(new Set(references.pages.map(page => page.url)).size, urls.length)
assert(fullText.includes(profile.evidenceBoundaries))
for (const url of urls) assert(fullText.includes(`Canonical source: ${url.href}\n`), `Full text missing: ${url.pathname}`)
for (const path of ['/machine/profile.json', '/machine/references.json', '/llms-full.txt']) assert(discovery.includes(`](${origin}${path})`))
for (const path of ['authority-assets.json', 'technical-seo-reference-index.json']) {
  const historical = JSON.parse(await read(`dist/research/${path}`))
  assert.equal(historical.status, 'historical')
  assert.equal(historical.currentReferenceIndex, `${origin}/machine/references.json`)
}
for (const path of ['/404/index.html', '/sitemap.html']) {
  const html = await read(join('dist', path))
  assert(html.includes('name="robots" content="noindex, follow"'), `Utility indexing drift: ${path}`)
}
await stat('dist/Sulayman_Bowles_Resume.pdf')
console.log(`Search gate passed: ${urls.length} unique canonical pages, visible biographies, coherent identity/social/schema metadata, ${catalog.length} dated feed entries, ${citations} source citations, complete HTML sections, search crawler access, and generated discovery.`)
