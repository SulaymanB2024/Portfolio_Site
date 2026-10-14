import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { qualityHash, qualityProseWords, qualityReadingMinutes } from '../tools/article-quality-integrity.mjs'

const articlePath = 'src/personal/editorial/data/articles/hyperliquid-valuation.json'
const modelPath = 'public/research/hyperliquid-valuation/model.py'
const inputsPath = 'public/research/hyperliquid-valuation/inputs.json'
const resultPath = 'public/research/hyperliquid-valuation/results.json'

test('Hyperliquid initial edition exposes a reproducible manuscript fingerprint', t => {
  const bytes = readFileSync(articlePath)
  const article = JSON.parse(bytes.toString())
  t.diagnostic('HYPERLIQUID_PUBLICATION ' + JSON.stringify({
    slug: article.slug,
    articleSha256: qualityHash(bytes),
    proseWords: qualityProseWords(article),
    readTime: `${qualityReadingMinutes(article)} MIN`,
  }))
  assert.equal(article.readTime, `${qualityReadingMinutes(article)} MIN`)
})

test('executing the published Python model reproduces frozen results without writing files', () => {
  const program = `import json,runpy\nm=runpy.run_path(${JSON.stringify(modelPath)})\nd=json.load(open(${JSON.stringify(inputsPath)}))\na=m['build'](d)\nd['supplyM']=707\nb=m['build'](d)\nprint(json.dumps({'base':a,'customInversePerToken':b['inverse']['perToken']}))`
  const actual = JSON.parse(execFileSync('python3', ['-c', program], { encoding: 'utf8', timeout: 10000 }))
  const expected = JSON.parse(readFileSync(resultPath, 'utf8'))
  const near = (a: number, b: number) => assert(Math.abs(a-b) < Math.max(1e-9, Math.abs(b)*1e-10))
  for (const name of ['bear', 'base', 'bull']) {
    near(actual.base.cases[name].perToken, expected.cases[name].perToken)
    actual.base.cases[name].flowsB.forEach((v: number, i: number) => near(v, expected.cases[name].flowsB[i]))
  }
  near(actual.base.inverse.growth, expected.inverse.growth)
  near(actual.customInversePerToken, 80)
})
