import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import catalog from '../src/personal/editorial/data/catalog.json' with { type: 'json' }
import publications from '../docs/article-publications.json' with { type: 'json' }
import { articleTopic } from '../src/personal/editorial/topics.ts'
import { verifyInitialPublication } from '../tools/article-publication-integrity.mjs'

const commissioned = ['choosing-a-growth-channel-under-a-capacity-limit', 'toast-gross-profit-engine', 'harvey-who-keeps-the-value-of-legal-ai', 'vanta-after-the-audit', 'ramp-saving-money-and-retaining-contribution', 'elevenlabs-cost-of-accepted-work', 'flock-safety-installed-cohort-cash']

test('commissioned studies have public routes, evidence assets, downloads and a complete reading path', () => {
  for (const slug of commissioned) {
    const summary = catalog.find(article => article.slug === slug)
    assert(summary, `${slug}: authored content must be publicly registered`)
    assert.equal(articleTopic(slug)?.slug, 'business-models')
    const receipt = publications.records.find(record => record.slug === slug)!
    assert(receipt, `${slug}: publication integrity receipt`)
    const article = verifyInitialPublication(readFileSync(receipt.path), receipt)
    assert(existsSync(`public${summary.image}`))
    assert(article.resources.length)
    for (const resource of article.resources) assert(existsSync(`public${resource.href}`), resource.href)
    for (const section of article.markdownSections) for (const figure of section.figures || []) {
      assert(existsSync(`public${figure.src}`), figure.src)
    }
    const malformed = structuredClone(article)
    malformed.markdownSections[0].blocks.push({ kind: 'table', tableId: 'unresolved-exhibit' })
    const bytes = Buffer.from(JSON.stringify(malformed))
    const hash = createHash('sha256').update(bytes).digest('hex')
    assert.throws(() => verifyInitialPublication(bytes, { ...receipt, articleSha256: hash }), /unresolved table/)
  }
})

test('hosted buyer calculator retains the reviewed five-file CSP-compatible runtime', () => {
  const source = 'docs/article-drafts/strategy-planning-20261012/pitches/companion/'
  const hosted = 'public/research/startup-economics/'
  for (const name of ['startup-models.html', 'startup-models.css', 'startup-models.mjs', 'scenario-math.mjs', 'model-context.mjs']) assert.deepEqual(readFileSync(hosted + name), readFileSync(source + name), name)
  const html = readFileSync(hosted + 'startup-models.html', 'utf8')
  assert(!/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/i.test(html))
  assert(!/\son\w+=/i.test(html))
})

test('downloadable planning models preserve baselines and reject destructive or impossible scenarios', { timeout: 15000 }, () => {
  for (const path of ['docs/article-drafts/strategy-planning-20261012/test_strategy_model.py', 'docs/article-drafts/strategy-planning-20261012/pitches/test_models.py']) {
    execFileSync('python3', [path], { stdio: 'pipe', timeout: 7000 })
  }
})

test('Crocs exposes the operating assumptions behind every plotted price case', () => {
  const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'))
  const article = read('src/personal/editorial/data/articles/crocs-cash-and-brand-test.json')
  const inputs = read('docs/long-pitches-20261012/inputs.json').companies.find((company: { symbol: string }) => company.symbol === 'CROX')
  const results = read('docs/long-pitches-20261012/outputs/model-results.json').companies.CROX.scenarios
  const section = article.sections.find((section: { id: string }) => section.id === 'the-operating-cases-explain-the-wider-price-range')
  assert(section, 'scenario exhibit must survive the separate reverse-hurdle table')
  assert.deepEqual(section.table.columns.slice(1), ['Bear', 'Base', 'Bull'])
  const row = (label: string) => section.table.rows.find((row: string[]) => row[0] === label).slice(1)
  assert.deepEqual(row('Crocs brand growth / year'), inputs.scenarios.map((scenario: any) => `${(scenario.segment_growth.crocs_brand[0] * 100).toFixed(0)}%`))
  assert.deepEqual(row('HEYDUDE growth / year'), inputs.scenarios.map((scenario: any) => `${(scenario.segment_growth.heydude[0] * 100).toFixed(0)}%`))
  assert.deepEqual(row('Terminal cash multiple'), inputs.scenarios.map((scenario: any) => `${scenario.terminal_owner_cash_multiple}×`))
  assert.deepEqual(row('Model price'), results.map((scenario: any) => `$${scenario.terminal_price.toFixed(2)}`))
  assert.deepEqual(row('Price return'), results.map((scenario: any) => `${(scenario.price_return * 100).toFixed(1)}%`))
  assert.match(section.table.note, /exclude the separate \$600m tax-payment stress/)
  const receipt = publications.records.find(record => record.slug === article.slug)!
  verifyInitialPublication(readFileSync(receipt.path), receipt)
})

test('October 14 admission update retains earlier Texas source cutoffs and frozen editions', () => {
  const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'))
  const waymo = read('src/personal/editorial/data/articles/texas-waymo-business-travel.json')
  const austin = waymo.sections.find((section: { id: string }) => section.id === 'texas-access').paragraphs[0]
  assert.match(austin, /eligible Uber products, the AV preference setting and a ride offer/)
  assert.match(austin, /human-driven result/)
  const current = read('public/research/texas-research-library-2026-10-14.json')
  const previous = read('public/research/texas-research-library-2026-10-13.json')
  assert.equal(current.articles.length, 18)
  assert.equal(previous.editionDate, '2026-10-13')
  const updated = new Set(['texas-waymo-business-travel', 'texas-robotaxi-business-service-map'])
  for (const article of current.articles) {
    const historical = previous.articles.find((old: { slug: string }) => old.slug === article.slug)
    if (!updated.has(article.slug)) assert.deepEqual(article, historical, `${article.slug}: preserve unrelated research`)
    else {
      assert.equal(article.datePublished, historical.datePublished)
      assert.equal(article.dateModified, '2026-10-14')
      assert.match(article.evidenceBoundary, /October 14/)
      assert(article.sources.some((source: { href?: string; url?: string }) => (source.href || source.url) === 'https://support.google.com/waymo/answer/18765688'))
    }
  }
  for (const [ledger, id] of [['waymo', 'waymo-03'], ['waymo', 'waymo-05'], ['robotaxi-map', 'avmap-1']]) {
    const claim = read(`docs/texas-business/research/${ledger}-claims.json`).claims.find((claim: { id: string }) => claim.id === id)
    assert.equal(claim.sourceDate, '2026-10-14')
    assert(claim.sources.some((source: { url: string }) => source.url === 'https://support.google.com/waymo/answer/18765688'))
  }
})
