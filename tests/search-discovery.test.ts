import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { machineProfile, machineReferences, documentText, fullDiscoveryText, discoveryText } from '../tools/search-discovery.ts'
import { resumeProfile, resumeReview } from '../src/personal/profile-copy.ts'
import { publicPages, siteOrigin } from '../src/personal/public-pages.ts'
import { identity } from '../src/personal/identity.ts'
import { personId, searchMetadata } from '../src/personal/search-metadata.ts'
import { answerNotes, answerNotesUpdated } from '../src/personal/editorial/answer-notes.ts'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import type { WritingArticle } from '../src/personal/editorial/types.ts'

const articles: WritingArticle[] = catalog.map(article => JSON.parse(readFileSync(new URL(`../src/personal/editorial/data/articles/${article.slug}.json`, import.meta.url), 'utf8')))
const boundaries = 'Owner-reported outcomes are not independent verification. Historical records retain their dates.'

test('machine profile projects reviewed public facts without inherited historical/private fields', () => {
  const profile = machineProfile(boundaries)
  assert.equal(profile.name, 'Sulayman Bowles')
  assert.equal(profile.id, personId)
  assert.equal(profile.summary, identity.summary)
  assert.equal(profile.reviewedAsOf, resumeReview.asOf)
  assert.deepEqual(profile.education.degrees, [{ degree: 'Bachelor of Business Administration', field: 'Finance' }])
  assert.equal(profile.education.expectedGraduation, resumeProfile.education.expectedGraduation)
  assert.deepEqual(profile.experience.map(role => role.summary), resumeProfile.experience.filter(role => role.visibility === 'public').map(role => role.publicSummary))
  assert.deepEqual(profile.profiles.map(profile => profile.url), identity.profiles.map(profile => profile.href))
  assert.equal(profile.evidenceBoundaries, boundaries)
  assert.equal(profile.historicalSources[0].note, resumeReview.pdfNote)
  for (const key of ['certifications', 'languages', 'proofClaims', 'projects', 'alternateName', 'location', 'canonicalLinks']) assert(!(key in profile))
  assert(!JSON.stringify(profile).includes('Suleiman'))
  assert(profile.experience.every(role => role.source === `${siteOrigin}/resume`))
})

test('machine references cover current canonical documents, real dates and exact citations', () => {
  const references = machineReferences(articles, boundaries)
  assert.deepEqual(references.pages.map(page => page.url), publicPages.map(page => `${siteOrigin}${page.path}`))
  assert.equal(references.articles.length, catalog.length)
  assert(references.pages.every(page => !new URL(page.url).hash && !new URL(page.url).search))
  assert(!('generatedAt' in references))
  for (const [index, record] of references.articles.entries()) {
    const source = articles[index]
    assert.equal(record.author, personId)
    assert.equal(record.url, `${siteOrigin}${source.path}`)
    assert.equal(record.datePublished, source.date.replaceAll('.', '-'))
    const articleNode = searchMetadata(`writing/${source.slug}`).schema!['@graph'].find(node => node['@type'] === 'Article')!
    assert.equal(record.dateModified, articleNode.dateModified, 'Machine references must describe the same reader edition as the document')
    assert.equal(record.manuscriptDateModified, source.dateModified?.replaceAll('.', '-'))
    assert.equal(record.evidenceBoundary, source.pageContent?.boundary?.text || source.evidenceBoundary)
    for (const citation of record.sources) for (const url of citation.urls) {
      assert(new URL(url).protocol.startsWith('http'))
      const original = url.startsWith(`${siteOrigin}/`) ? new URL(url).pathname : url
      assert(JSON.stringify(source.sources).includes(original), `Unpublished citation: ${url}`)
    }
    const notes = answerNotes(source.slug)
    if (notes) {
      assert.equal(record.readerNotes!.dateAdded, answerNotesUpdated)
      assert.equal(record.readerNotes!.evidenceBoundary, notes.boundary)
      assert.deepEqual(record.readerNotes!.questions.map(question => question.url), notes.questions.map(note => `${siteOrigin}${source.path}#${note.id}`))
      for (const question of record.readerNotes!.questions) for (const citation of question.sources) {
        assert(articleNode.citation.includes(citation.url), `Reader citation missing from document metadata: ${citation.url}`)
      }
    } else assert(!record.readerNotes)
  }
  for (const topic of references.readingPaths) for (const reading of topic.readings) assert(references.articles.some(article => article.url === reading.url))
  assert.deepEqual(machineReferences(articles, boundaries), references)
})

test('full-text projection retains visible text, tables, literal entities and canonical link targets', () => {
  const markup = '<h1>Accepted headline</h1><p>R&amp;D &lt;code&gt; &#x27;quoted&#x27; $&amp;</p><p><a href="/resume">Résumé</a> and <a href="#source-1">Source</a></p><table><tr><td>A</td><td>B</td></tr></table><script>private()</script>'
  const text = documentText(markup, `${siteOrigin}/about`)
  assert(text.includes("R&D <code> 'quoted' $&"))
  assert(text.includes(`(${siteOrigin}/resume)`))
  assert(text.includes(`(${siteOrigin}/about#source-1)`))
  assert(text.includes('A | B |'))
  assert(!text.includes('private()'))
  const full = fullDiscoveryText(machineProfile(boundaries), [{ url: `${siteOrigin}/about`, text }])
  assert(full.includes(boundaries))
  assert(full.includes(`Canonical source: ${siteOrigin}/about`))
  assert(full.includes(text))
})

test('concise discovery links canonical documents and all alternate machine formats', () => {
  const text = discoveryText(identity.summary, resumeReview.asOf, boundaries)
  for (const page of publicPages) assert(text.includes(`](${siteOrigin}${page.path})`))
  for (const path of ['/machine/profile.json', '/machine/references.json', '/llms-full.txt']) assert(text.includes(`](${siteOrigin}${path})`))
  assert(text.includes(`Person identifier: ${personId}`))
  assert(text.includes(boundaries))
})

test('text boundaries separate block starts, definition pairs and prose after links', () => {
  const text = documentText('<span>Find your answer</span><h2>How do I check?</h2><dl><dt>Board</dt><dd>64 squares / 13 regions</dd></dl><a href="#verifier">Verify</a><p>Recompute the schedule.</p><pre>  first\n    second</pre><svg><text>Every 3 moves</text><text>Every 7 moves</text><text>Move <tspan>54</tspan></text></svg>', `${siteOrigin}/about`)
  assert(text.includes('Find your answer\n\nHow do I check?'))
  assert(text.includes('Board\n\n64 squares / 13 regions'))
  assert(text.includes(`Verify (${siteOrigin}/about#verifier)\n\nRecompute`))
  assert(text.includes('first\n    second'))
  assert(text.includes('Every 3 moves\n\nEvery 7 moves'))
  assert(text.includes('Move\n\n54'))
})
