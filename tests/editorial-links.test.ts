import test from 'node:test'
import assert from 'node:assert/strict'
import { articleHref, safeHref } from '../src/personal/editorial/links.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import type { ArticleSummary } from '../src/personal/editorial/types.ts'

const catalog = [{ slug: 'toll-roads', path: '/research/infrastructure/toll-roads', aliases: ['/markets/toll-roads'] }] as ArticleSummary[]

test('existing public article paths, aliases and section URLs resolve alongside hash navigation', () => {
  assert.equal(resolveRoute('', '/research/infrastructure/toll-roads', catalog), 'writing/toll-roads')
  assert.equal(resolveRoute('#source-s1', '/markets/toll-roads', catalog), 'writing/toll-roads')
  assert.equal(resolveRoute('#/writing/toll-roads?section=sources', '/', catalog), 'writing/toll-roads')
  assert.equal(resolveRoute('#/resume', '/research', catalog), 'resume')
  assert.equal(resolveRoute('', '/research/', catalog), 'writing')
  assert.equal(resolveRoute('#/work/miscellaneous', '/', catalog), 'work/miscellaneous')
  assert.equal(resolveRoute('#/unknown', '/', catalog), 'unknown')
})

test('legacy and canonical article links reach the new reader and retain section targets', () => {
  assert.equal(articleHref('/markets/toll-roads', catalog), '#/writing/toll-roads')
  assert.equal(articleHref('https://sulayman-bowles.dev/research/infrastructure/toll-roads#sources', catalog), '#/writing/toll-roads?section=sources')
  assert.equal(articleHref('#source-s01', catalog), '#source-s01')
  assert.equal(articleHref('/resume', catalog), '#/resume')
})

test('downloads stay local while untransplanted pages and external citations retain their destinations', () => {
  assert.equal(articleHref('/research/evidence.csv', catalog, '/portfolio/'), '/portfolio/research/evidence.csv')
  assert.equal(articleHref('/atlas/sample-crawl', catalog), 'https://sulayman-bowles.dev/atlas/sample-crawl')
  assert.equal(articleHref('https://example.org/source#table', catalog), 'https://example.org/source#table')
  assert.equal(articleHref('mailto:sybatx@gmail.com', catalog), 'mailto:sybatx@gmail.com')
})

test('article markup only accepts navigable web, local, mail and citation links', () => {
  assert.equal(safeHref('javascript:alert(1)'), false)
  assert.equal(safeHref('data:text/html,<script>'), false)
  assert.equal(safeHref('//example.org'), false)
  assert.equal(safeHref('#note-1'), true)
  assert.equal(safeHref('https://example.org'), true)
})
