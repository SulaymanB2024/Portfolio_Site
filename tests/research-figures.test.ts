import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { readerFigureNames, readerFigureSvg, prepareReaderFigures } from '../tools/reader-figure-assets.mjs'
import { researchFigurePresentation } from '../src/personal/editorial/research-figure-presentation.ts'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const geometry = (svg: string) => [...svg.matchAll(/\b(d|x|y|width|height|viewBox|transform|clip-path|id|xlink:href)="([^"]*)"/g)].map(match => match.slice(1))
const labels = (svg: string) => [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(match => match[1])

test('ink derivatives retain the original chart geometry, labels and frozen source bytes', async () => {
  const provenance = JSON.parse(read('docs/reader-figure-assets.json'))
  for (const record of provenance.records) {
    const source = read(record.sourcePath)
    const output = read(record.outputPath)
    assert.equal(createHash('sha256').update(source).digest('hex'), record.sourceSha256)
    assert.deepEqual(geometry(output), geometry(source), record.sourcePath)
    assert.deepEqual(labels(output), labels(source), record.sourcePath)
    assert(!/#(?:1f77b4|ff7f0e|2ca02c|d62728|9467bd)/i.test(output))
  }
  await prepareReaderFigures(new URL('../', import.meta.url).pathname, true)
})

test('every sensitivity curve and its legend share a distinct non-color encoding', () => {
  const source = read('public/images/research/the-ai-megawatt-sensitivity.svg')
  const output = readerFigureSvg(source, 'the-ai-megawatt-sensitivity')
  const curves = [...output.matchAll(/<path\b[^>]*stroke-width="1\.5"[^>]*>/g)].map(match => match[0])
  assert.equal(curves.length, 10)
  const pattern = (path: string) => path.match(/stroke-dasharray="([^"]*)"/)?.[1] || 'solid'
  const series = curves.slice(0, 5).map(pattern)
  assert.equal(new Set(series).size, 5)
  assert.deepEqual(curves.slice(5).map(pattern), series)
})

test('reader presentation uses only registered derivatives and retains original full-size links', () => {
  for (const name of readerFigureNames) {
    const src = `/images/research/${name}.svg`
    assert.deepEqual(researchFigurePresentation(src, '/portfolio/'), {
      original: `/portfolio${src}`, display: `/portfolio/images/research/reader/${name}.svg`,
    })
  }
  for (const src of ['/images/research/unregistered.svg', '/images/research/airline-loyalty-balance-sheets.png', '/other/the-ai-megawatt-power-ladder.svg']) {
    assert.equal(researchFigurePresentation(src).display, src)
  }
})

test('verification reports stale derivatives without repairing files or writing a manifest', async () => {
  const root = mkdtempSync(join(tmpdir(), 'reader-figure-check-'))
  try {
    mkdirSync(join(root, 'public/images/research/reader'), { recursive: true })
    const name = readerFigureNames[0]
    writeFileSync(join(root, `public/images/research/${name}.svg`), read(`public/images/research/${name}.svg`))
    const output = join(root, `public/images/research/reader/${name}.svg`)
    writeFileSync(output, 'stale derivative')
    await assert.rejects(prepareReaderFigures(root, true), /Reader figure differs/)
    assert.equal(readFileSync(output, 'utf8'), 'stale derivative')
    assert.deepEqual(readdirSync(root), ['public'])
  } finally { rmSync(root, { recursive: true, force: true }) }
})
