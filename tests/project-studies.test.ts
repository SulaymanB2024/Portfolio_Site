import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { findCaseStudy } from '../src/personal/projects/case-studies.ts'
import { describeAtlasRow } from '../src/personal/projects/atlas-evidence.ts'

test('case studies resolve from direct URLs and hash URLs, including retained Atlas links', () => {
  for (const slug of ['atlas', 'payrollpro', 'viralbench']) {
    for (const [hash,path] of [[`#/work/${slug}`, '/'], ['',`/work/${slug}`], [`#/work/${slug}?ref=resume`, '/']]) {
      assert.equal(findCaseStudy(resolveRoute(hash,path,[]))?.slug,slug)
    }
  }
  assert.equal(resolveRoute('', '/atlas', []), 'work/atlas')
  assert.equal(resolveRoute('#/atlas/sample-crawl', '/', []), 'work/atlas')
  assert.equal(findCaseStudy('work/unknown'),undefined)
})

test('sample inspector preserves unknown measurements and separates data from source markup', () => {
  const source = describeAtlasRow(0)
  const javascript = describeAtlasRow(1)
  assert.equal(source.status_code,javascript.status_code)
  assert.equal(source.source_quote_card_count,10)
  assert.equal(javascript.source_quote_card_count,0)
  assert.equal(source.runtimeRecords,null, 'An unrecorded field must not become a measured zero')
  assert.equal(javascript.runtimeRecords,10)
  assert.equal(source.canonical,'Not present in source')
  assert.equal(javascript.canonical,'Not present in source')
  assert.equal(new URL(source.discovered_next_url).pathname,'/page/2/')
  assert.equal(new URL(javascript.discovered_next_url).pathname,'/js/page/2/')
  assert.match(javascript.nextStep,/Render the page/)
  assert.throws(()=>describeAtlasRow(2),RangeError)
})
