import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import ResearchProcess, { hasResearchProcess } from '../src/personal/editorial/ResearchProcess'
import type { ArticleFigure, WritingArticle } from '../src/personal/editorial/types'

const load = (slug: string): WritingArticle => JSON.parse(readFileSync(`src/personal/editorial/data/articles/${slug}.json`, 'utf8'))
const sourceFigure = (slug: string, basename: string) => load(slug).sections!.flatMap(section => section.figures || []).find(figure => figure.src.endsWith(basename))!

test('only the two retained process charts use native reconstructions', () => {
  const figures = [sourceFigure('waymo-hardware-financing', 'waymo-downside-waterfall.png'), sourceFigure('how-airlines-borrow-against-loyalty-programs', 'airline-loyalty-cash-conversion-cycle.png')]
  for (const figure of figures) {
    assert(figure)
    assert(hasResearchProcess(figure.src))
    const html = renderToStaticMarkup(<ResearchProcess figure={figure} />)
    assert(html.includes('research-process'))
    assert(!html.includes('<img'))
  }
  const other: ArticleFigure = { ...figures[0], src: '/images/research/waymo-capital-stack.png' }
  assert.equal(hasResearchProcess(other.src), false)
  assert.equal(renderToStaticMarkup(<ResearchProcess figure={other} />), '')
})

test('Waymo exposes the same signed contribution amounts as the retained source table', () => {
  const article = load('waymo-hardware-financing')
  const section = article.sections!.find(section => section.id === 'utilization-downside')!
  const base = section.table!.rows.find(row => row[0] === 'Base')!
  assert(base)
  const html = renderToStaticMarkup(<ResearchProcess figure={section.figures![0]} />)
  assert(html.includes(base[3]))
  assert(html.includes('−$18.3M'))
  assert(html.includes('−$61.5M'))
  assert(html.includes('Modeled annual contribution after depreciation'))
  assert(html.includes('corporate R&amp;D is outside this fleet model'))
  assert(html.includes('Economic transmission differs from legal bankruptcy priority'))
  assert(html.includes('If debt or leases are added'))
  assert(html.includes('Title, security and guarantees remain unresolved'))
})

test('the airline timeline keeps all four clocks distinct at every stage', () => {
  const html = renderToStaticMarkup(<ResearchProcess figure={sourceFigure('how-airlines-borrow-against-loyalty-programs', 'airline-loyalty-cash-conversion-cycle.png')} />)
  for (const clock of ['Cash', 'Accounting', 'Fulfillment', 'Financing']) assert.equal((html.match(new RegExp(`<dt>${clock}</dt>`, 'g')) || []).length, 4)
  assert.equal((html.match(/class="research-clock-stage"/g) || []).length, 4)
  assert(html.includes('Card purchase; no airline cash'))
  assert(html.includes('Issuer pays about $12'))
  assert(html.includes('$4.80 current revenue; $7.20 contract liability'))
  assert(html.includes('1.7 years, conditional on redemption'))
  assert.equal((html.match(/class="research-clock-estimated"/g) || []).length, 3)
  assert(html.includes('within the pledged cash waterfall'))
  assert(html.includes('Excess cash release or early amortization, per financing terms'))
  assert(html.includes('not a conventional loan'))
  assert(html.includes('Breakage estimates nonredemption rather than legal expiration'))
})
