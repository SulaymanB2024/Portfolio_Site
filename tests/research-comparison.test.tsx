import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { inflateRawSync } from 'node:zlib'
import { renderToStaticMarkup } from 'react-dom/server'
import ResearchComparison, { hasResearchComparison } from '../src/personal/editorial/ResearchComparison'
import type { ArticleFigure, WritingArticle } from '../src/personal/editorial/types'

const article = (slug: string): WritingArticle => JSON.parse(readFileSync(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))
const figure = (slug: string, section: string): ArticleFigure => article(slug).sections!.find(item => item.id === section)!.figures![0]
const disposition = figure('where-online-returns-actually-go', 'environmental-boundary')
const fees = figure('what-happens-when-an-index-decides-a-company-matters', 'provider-commercial-machine')

// Read the retained workbook directly, without another spreadsheet dependency.
function zipEntry(file: string, name: string) {
  const zip = readFileSync(file)
  const end = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]))
  assert(end >= 0, 'ZIP directory exists')
  let cursor = zip.readUInt32LE(end + 16)
  const entries = zip.readUInt16LE(end + 10)
  for (let index = 0; index < entries; index++) {
    assert.equal(zip.readUInt32LE(cursor), 0x02014b50)
    const length = zip.readUInt16LE(cursor + 28)
    const filename = zip.subarray(cursor + 46, cursor + 46 + length).toString('utf8')
    if (filename === name) {
      const local = zip.readUInt32LE(cursor + 42)
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28)
      const data = zip.subarray(start, start + zip.readUInt32LE(cursor + 20))
      const method = zip.readUInt16LE(cursor + 10)
      assert([0, 8].includes(method), 'supported ZIP method')
      return (method === 8 ? inflateRawSync(data) : data).toString('utf8')
    }
    cursor += 46 + length + zip.readUInt16LE(cursor + 30) + zip.readUInt16LE(cursor + 32)
  }
  throw new Error(`Workbook entry missing: ${name}`)
}

function attributes(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([\w:]+)="([^"]*)"/g)].map(match => [match[1], match[2]]))
}

function dispositionSource() {
  const file = 'public/research/reverse-logistics-tax-model.xlsx'
  const sheet = [...zipEntry(file, 'xl/workbook.xml').matchAll(/<(?:\w+:)?sheet\b[^>]*\/>/g)].map(match => attributes(match[0])).find(item => item.name === 'Environmental_Routes')!
  const relationship = [...zipEntry(file, 'xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*\/>/g)].map(match => attributes(match[0])).find(item => item.Id === sheet['r:id'])!
  const path = relationship.Target.startsWith('/') ? relationship.Target.slice(1) : `xl/${relationship.Target}`
  const cells = new Map([...zipEntry(file, path).matchAll(/<(?:\w+:)?c\b([^>]*)>(.*?)<\/(?:\w+:)?c>/gs)].map(match => {
    const cell = attributes(match[1])
    const content = cell.t === 'inlineStr' ? match[2].match(/<(?:\w+:)?t[^>]*>(.*?)<\/(?:\w+:)?t>/s)?.[1] : match[2].match(/<(?:\w+:)?v>(.*?)<\/(?:\w+:)?v>/s)?.[1]
    return [cell.r, content || '']
  }))
  return Array.from({ length: 9 }, (_, index) => ({
    product: cells.get(`A${index + 4}`)!,
    percentages: ['B', 'C', 'D', 'E', 'F', 'G'].map(column => Math.round(Number(cells.get(`${column}${index + 4}`)) * 100)),
  }))
}

test('the native route chart matches every retained workbook probability', () => {
  const html = renderToStaticMarkup(<ResearchComparison figure={disposition} />)
  const rows = [...html.matchAll(/class="research-route-row">(.*?)<\/dd><\/div>/g)].map(match => match[1])
  const source = dispositionSource()
  assert.equal(rows.length, source.length)
  for (const [index, record] of source.entries()) {
    assert.equal(record.percentages.reduce((sum, percentage) => sum + percentage, 0), 100)
    const plotted = Array(6).fill(0)
    for (const segment of rows[index].matchAll(/data-route="(\d+)" data-share="(\d+)"/g)) plotted[Number(segment[1])] = Number(segment[2])
    assert.deepEqual(plotted, record.percentages, record.product)
    assert(rows[index].includes(record.product.match(/\$(\d+)/)![0]), record.product)
    for (const value of record.percentages.filter(Boolean)) assert(rows[index].includes(`<strong>${value}%</strong>`))
  }
  assert(html.includes('Modeled routes, not measured environmental outcomes.'))
  assert(html.includes('Liquidation transfer (downstream unobserved)'))
  assert(html.includes('Fraudulent/missing/not physically recovered'))
})

test('revenue values and shares reconcile to the reported 2025 denominator', () => {
  const document = article('what-happens-when-an-index-decides-a-company-matters')
  const paragraph = document.sections!.find(item => item.id === 'provider-commercial-machine')!.paragraphs![1]
  const reported = [...paragraph.matchAll(/\$([\d.]+) (billion|million)/g)].map(match => Number(match[1]) * (match[2] === 'billion' ? 1000 : 1))
  assert.deepEqual(reported.slice(0, 4), [1850, 1206, 320, 324])
  const html = renderToStaticMarkup(<ResearchComparison figure={fees} />)
  const plotted = [...html.matchAll(/data-millions="(\d+)"/g)].map(match => Number(match[1]))
  assert.deepEqual(plotted, reported.slice(1, 4))
  assert.equal(plotted.reduce((sum, millions) => sum + millions, 0), reported[0])
  for (const [index, value] of plotted.entries()) {
    assert(html.includes(`${(value / reported[0] * 100).toFixed(1)}%`))
    assert(html.includes(['Asset-linked fees', 'Subscriptions', 'Usage-based royalties'][index]))
  }
  assert(html.includes('$1.850B'))
})

test('series have foreground patterns with unique IDs across multiple comparisons', () => {
  const html = renderToStaticMarkup(<><ResearchComparison figure={disposition} /><ResearchComparison figure={fees} /></>)
  const ids = [...html.matchAll(/<pattern id="([^"]+)"/g)].map(match => match[1])
  assert.equal(ids.length, 12)
  assert.equal(new Set(ids).size, ids.length)
  for (const reference of html.matchAll(/fill="url\(#([^)]*)\)"/g)) assert(ids.includes(reference[1]))
  assert(html.includes('<circle cx="4" cy="4" r="1.4"'))
  assert(html.includes('M0 0L8 8M8 0L0 8'))
  assert(!html.includes('<img'))
})

test('comparisons replace only their two recognized source assets', () => {
  assert(hasResearchComparison(disposition.src))
  assert(hasResearchComparison(fees.src))
  for (const src of ['/images/research/index-migration-net-demand.png', '/images/research/online-returns-environmental-routes.png?variant=2']) {
    assert(!hasResearchComparison(src))
    assert.equal(renderToStaticMarkup(<ResearchComparison figure={{ ...fees, src }} />), '')
  }
})
