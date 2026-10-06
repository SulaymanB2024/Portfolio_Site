import test from 'node:test'
import assert from 'node:assert/strict'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import { readingTopics, topicReadings, articleTopic } from '../src/personal/editorial/topics.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { canonicalPath } from '../src/personal/public-pages.ts'
import { searchMetadata } from '../src/personal/search-metadata.ts'
import { documentHref } from '../tools/public-document-links.ts'

test('reading paths connect the entire restored catalog without stranded or duplicate essays', () => {
  const assigned = readingTopics.flatMap(topic => topic.readings.map(reading => reading.slug))
  assert.equal(new Set(assigned).size, assigned.length)
  assert.deepEqual([...assigned].sort(), catalog.map(article => article.slug).sort())
  for (const article of catalog) assert(articleTopic(article.slug))
})

test('topic deep links and client routes identify the same canonical collection and ordered readings', () => {
  for (const topic of readingTopics) {
    const route = `topics/${topic.slug}`
    const path = `/${route}`
    assert.equal(resolveRoute('', path, catalog), route)
    assert.equal(resolveRoute(`#${path}`, '/', catalog), route)
    assert.equal(canonicalPath(route), path)
    assert.equal(documentHref(`#${path}`), path)
    const metadata = searchMetadata(route)
    const page = metadata.schema!['@graph'].find(node => node['@id'] === `${metadata.canonical}#webpage`)!
    assert.equal(page['@type'], 'CollectionPage')
    const list = metadata.schema!['@graph'].find(node => node['@type'] === 'ItemList')!
    const expected = topicReadings(topic).map(({ article }, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://sulayman-bowles.dev${article.path}`, name: article.displayTitle || article.title }))
    assert.deepEqual(list.itemListElement, expected)
    assert.equal(metadata.article, undefined, 'A reading collection is not a newly dated manuscript')
  }
})
