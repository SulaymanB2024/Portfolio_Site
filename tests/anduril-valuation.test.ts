import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { runInNewContext } from 'node:vm'

const slug = 'anduril-valuation-capital-productivity'
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'))
const directory = 'public/research/anduril-valuation'
const near = (a: number, b: number) => assert(Math.abs(a-b) < 1e-8, `${a} differs from ${b}`)

test('Anduril initial edition is registered, cited, and fully packaged', () => {
  const article = read(`src/personal/editorial/data/articles/${slug}.json`)
  const catalog = read('src/personal/editorial/data/catalog.json')
  const summary = catalog.find((item: { slug: string }) => item.slug === slug)
  assert(summary)
  assert.equal(new Set(catalog.map((item: { slug: string }) => item.slug)).size, catalog.length)
  for (const field of ['slug', 'path', 'title', 'displayTitle', 'subtitle', 'seoTitle', 'seoDescription', 'date', 'dateModified', 'readTime']) assert.equal(summary[field], article[field])
  assert.equal(article.sources.length, 17)
  assert.equal(article.sections.length, 12)
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
  assert.equal(figures, 6)
  for (const asset of article.resources) assert(existsSync(`public${asset.href}`))
})

test('Anduril original model and operating stresses pass arithmetic and boundary tests', () => {
  execFileSync('python3', ['-m', 'unittest', '-v', 'test_model', 'test_stress'], { cwd: directory, timeout: 15000, encoding: 'utf8' })
})

test('Published Anduril data reproduces without editing repository files', () => {
  const script = [
    'import csv,json,tempfile', 'from pathlib import Path',
    'from model import export', 'from stress import export as export_stress',
    'with tempfile.TemporaryDirectory() as directory:',
    '    target=Path(directory)', '    export(target)', '    export_stress(target)',
    "    for name in ['model-results.json','stress-results.json']:",
    '        assert json.loads((target/name).read_text()) == json.loads(Path(name).read_text())',
    "    for name in ['forecast.csv','operating-stress.csv']:",
    '        with (target/name).open(newline="") as generated, Path(name).open(newline="") as published:',
    '            assert list(csv.DictReader(generated)) == list(csv.DictReader(published))',
  ].join('\n')
  execFileSync('python3', ['-c', script], { cwd: directory, timeout: 15000, encoding: 'utf8' })
})

test('Browser calculator matches Python across scenarios, operating shocks and equity bridges', () => {
  const html = readFileSync(`${directory}/valuation-lab.html`, 'utf8')
  const source = readFileSync(`${directory}/valuation-model.js`, 'utf8')
  assert(source)
  const context: any = {}
  runInNewContext(source, context, { timeout: 1000 })
  const inputs = [{}, {case:'Downside'}, {case:'Upside'}, {margin_delay:2}, {margin_shift:-.04}, {margin_shift:.04}, {extra_collection_days:30}, {arsenal2_multiplier:1.5}, {margin_delay:2,margin_shift:-.04,extra_collection_days:30,arsenal2_multiplier:1.5}, {net_cash:5,minority_value:2,available_cash:7,noncash_comp_ratio:.04}, {discount:.10,terminal_growth:.02,scale:1.5}, {discount:.16,terminal_growth:.04,scale:.7}]
  const script = 'import json,sys;from stress import value;print(json.dumps([value(**p) for p in json.loads(sys.argv[1])]))'
  const expected = JSON.parse(execFileSync('python3', ['-c', script, JSON.stringify(inputs)], {cwd:directory,encoding:'utf8',maxBuffer:2_000_000}))
  inputs.forEach((p,i) => {
    const actual=context.AndurilModel.value(p), e=expected[i]
    for (const key of ['enterprise_value','equity_after_assumed_nci','pv_terminal','terminal_fcf','peak_economic_fcf_deficit','cash_timing_proxy_gap']) near(actual[key],e[key])
    actual.rows.forEach((r: any,j: number) => {for(const key of ['revenue','ebit','fcf','cash_timing_proxy','cumulative_fcf','total_reinvestment'])near(r[key],e.rows[j][key])})
  })
  for(const price of [61,100]) {
    const r=context.AndurilModel.reverse(price,{minority_value:2,margin_shift:.04})
    near(context.AndurilModel.value({minority_value:2,margin_shift:.04,scale:r.scale}).equity_after_assumed_nci,price)
  }
  const base=context.AndurilModel.value(),noncash=context.AndurilModel.value({noncash_comp_ratio:.04})
  near(base.enterprise_value,noncash.enterprise_value)
  assert(noncash.cash_timing_proxy_gap<base.cash_timing_proxy_gap)
  assert.throws(()=>context.AndurilModel.value({terminal_growth:.12}))
})

test('Interactive companion is self-contained and has explicit accessible controls', () => {
  const html = readFileSync(`${directory}/valuation-lab.html`, 'utf8')
  assert(!/<script\b[^>]*src="https?:|<link\b[^>]*href=|\bfetch\s*\(|XMLHttpRequest/.test(html))
  assert(!/<script[^>]*>[^<]+<\/script>/.test(html), 'Keep scripts external under the existing CSP')
  assert(html.includes('src="valuation-model.js"') && html.includes('src="valuation-ui.js"'))
  assert(html.includes('aria-live="polite"') && html.includes('role="alert"'))
  assert(readFileSync(`${directory}/valuation-ui.js`, 'utf8').includes('ResizeObserver') && html.includes('model-core'))
  for(const match of html.matchAll(/<input\b[^>]*id="([^"]+)"|<select\b[^>]*id="([^"]+)"/g)) assert(html.includes(`for="${match[1] || match[2]}"`))
  for(const id of ['reset','share','reverse','csv'])assert(html.includes(`id="${id}"`))
})
