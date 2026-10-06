import test from 'node:test'
import assert from 'node:assert/strict'
import { documentModifiedDate, searchSitemap } from '../tools/search-sitemap.ts'
import { publicPages } from '../src/personal/public-pages.ts'

test('sitemap dates describe significant recorded edits and omit unrecorded page dates', () => {
  assert.equal(documentModifiedDate('writing/why-texas-toll-roads-stay-tolled'), '2026-10-06')
  assert.equal(documentModifiedDate('writing/the-first-ai-managers'), '2026-10-05')
  assert.equal(documentModifiedDate('topics/financial-systems'), '2026-10-06')
  assert.equal(documentModifiedDate('resume'), undefined)
  assert.equal(documentModifiedDate('unknown'), undefined)
  const xml = searchSitemap()
  assert.equal((xml.match(/<loc>/g) || []).length, publicPages.length)
  assert(!xml.includes('<priority>') && !xml.includes('<changefreq>'))
  assert(xml.includes('<loc>https://sulayman-bowles.dev/resume</loc></url>'))
  assert(xml.includes('<loc>https://sulayman-bowles.dev/research/financial-systems/why-texas-toll-roads-stay-tolled</loc><lastmod>2026-10-06</lastmod>'))
  assert.equal(searchSitemap(), xml, 'Regeneration must not manufacture a new revision')
})
