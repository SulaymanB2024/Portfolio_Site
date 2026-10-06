import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import ResearchDiagram, { hasResearchDiagram } from '../src/personal/editorial/ResearchDiagram'
import type { ArticleFigure } from '../src/personal/editorial/types'

const figure = (name: string): ArticleFigure => ({ src: `/images/research/${name}`, alt: name, caption: '', width: 1000, height: 700 })
const render = (name: string) => renderToStaticMarkup(<ResearchDiagram figure={figure(name)} />)

test('only the seven supplied financing charts use readable native reconstructions', () => {
  for (const name of ['waymo-capital-stack.png', ...['waymo', 'serve', 'coreweave', 'anduril', 'northvolt'].map(company => `hidden-financing-${company}-capital-stack.png`), 'west-campus-capital-stack.png']) {
    assert.equal(hasResearchDiagram(figure(name).src), true)
    const html = render(name)
    assert(html.includes('research-diagram'))
    assert(!html.includes('<img'))
  }
  assert.equal(hasResearchDiagram('/images/research/waymo-downside-waterfall.png'), false)
  assert.equal(render('waymo-downside-waterfall.png'), '')
})

test('disclosed funding stays distinct from modeled parent shares and conditional commitments', () => {
  const waymo = render('waymo-capital-stack.png')
  assert(waymo.includes('$27.1–27.35B'))
  assert(waymo.includes('$13.1–22.0B modeled cumulative contribution'))
  assert(waymo.includes('July 2024 commitment is excluded to avoid double counting'))
  assert(waymo.includes('No quantified Waymo-level debt'))
  const anduril = render('hidden-financing-anduril-capital-stack.png')
  assert(anduril.includes('$310M grant commitment'))
  assert(anduril.includes('$70M requested site support'))
  assert(anduril.includes('$452.3M nominal future value is conditional'))
  assert(anduril.includes('not all cash received'))
  const northvolt = render('hidden-financing-northvolt-capital-stack.png')
  assert(northvolt.includes('$5.0B non-recourse project package committed; draw amount unknown'))
  assert(northvolt.includes('not financing cash'))
  assert(northvolt.includes('$100M approved / available rescue facility with superpriority'))
})

test('CoreWeave preserves borrower-specific recourse instead of assigning consolidated debt to subsidiaries', () => {
  const html = render('hidden-financing-coreweave-capital-stack.png')
  assert(html.includes('$21.615B'))
  assert(html.includes('$8.449B'))
  assert(html.includes('$8.185B'))
  assert(html.includes('CCAC VII LLC / DDTL 3'))
  assert(html.includes('Parent guarantee'))
  assert(html.includes('CCAC VIII LLC / DDTL 4'))
  assert(html.includes('Non-recourse except carve-outs'))
  assert(html.includes('Consolidated totals do not allocate balances to each entity'))
  assert(!html.includes('<ol'))
})

test('West Campus scales actual source values together while preserving disclosed versus illustrative status', () => {
  const html = render('west-campus-capital-stack.png')
  assert.equal((html.match(/class="research-stack-heading"/g) || []).length, 6)
  assert(html.includes('$30.125M'))
  assert(html.includes('$23.24M'))
  assert(html.includes('2019 disclosed debt and preferred; common derived from total uses'))
  assert(html.includes('Illustrative RFS-bond allocation; actual project balance not public'))
  assert(html.includes('they do not report current financing balances'))
  const widths = [...html.matchAll(/style="width:([\d.]+)%"/g)].map(match => Number(match[1]))
  assert.equal(widths.length, 14)
  // $124,366,118 total uses less $66,125,000 mortgage and $35M preferred.
  assert(Math.abs(widths.slice(0, 4).reduce((sum, value) => sum + value, 0) * 2 - 124.366118) < 1e-8)
  // Every row uses the same $200M scale; no individually normalized bars.
  assert.equal(widths[0], 18)
  assert.equal(widths[4], 21)
  assert.equal(widths[6], 44)
  assert.equal(widths[8], 47.5)
})
