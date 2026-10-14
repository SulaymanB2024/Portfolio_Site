import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const slug = 'anduril-valuation-capital-productivity'
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'))

test('Anduril initial edition is registered, cited, and fully packaged', () => {
  const article = read(`src/personal/editorial/data/articles/${slug}.json`)
  const catalog = read('src/personal/editorial/data/catalog.json')
  const summary = catalog.find((item: { slug: string }) => item.slug === slug)
  assert(summary)
  assert.equal(new Set(catalog.map((item: { slug: string }) => item.slug)).size, catalog.length)
  for (const field of ['slug', 'path', 'title', 'displayTitle', 'subtitle', 'seoTitle', 'seoDescription', 'date', 'dateModified', 'readTime']) assert.equal(summary[field], article[field])
  assert.equal(article.sources.length, 17)
  assert.equal(article.sections.length, 10)
  const ids = new Set(article.sources.map((source: { id: string }) => `source-${source.id.toLowerCase()}`))
  for (const match of JSON.stringify(article).matchAll(/#(source-[\w-]+)/g)) assert(ids.has(match[1]))
  let figures = 0
  for (const section of article.sections) for (const figure of section.figures || []) {
    figures++
    assert(existsSync(`public${figure.src}`))
    assert(figure.alt && figure.caption && figure.width > 0 && figure.height > 0)
    const svg = readFileSync(`public${figure.src}`, 'utf8')
    assert(svg.includes('<title') && svg.includes('<desc'))
  }
  assert.equal(figures, 5)
  for (const asset of article.resources) assert(existsSync(`public${asset.href}`))
})

test('Anduril cash-flow model passes its arithmetic and boundary tests', () => {
  execFileSync('python3', ['-m', 'unittest', '-v', 'test_model'], { cwd: 'public/research/anduril-valuation', timeout: 15000, encoding: 'utf8' })
})

test('Published Anduril data reproduces from the model without editing repository files', () => {
  const script = [
    'import csv,json,tempfile',
    'from pathlib import Path',
    'from model import export',
    'with tempfile.TemporaryDirectory() as directory:',
    '    target=Path(directory)',
    '    export(target)',
    "    assert json.loads((target/'model-results.json').read_text()) == json.loads(Path('model-results.json').read_text())",
    "    with (target/'forecast.csv').open(newline='') as generated, Path('forecast.csv').open(newline='') as published:",
    '        assert list(csv.DictReader(generated)) == list(csv.DictReader(published))',
  ].join('\n')
  execFileSync('python3', ['-c', script], { cwd: 'public/research/anduril-valuation', timeout: 15000, encoding: 'utf8' })
})
