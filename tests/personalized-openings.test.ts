import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { emptyRegistry, reconcileCompanies, parseRegistry } from '../lib/outreach/registry.ts'
import { reconcileOpenings, validateOpenings, type PersonalizedOpeningInput } from '../lib/outreach/openings.ts'
import { createSyncHandler, outreachSpreadsheetId } from '../lib/outreach/sync.ts'
import { createOutreachHomeHandler, outreachDocument } from '../lib/outreach/home.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import { documentOutreachCompany } from '../src/personal/outreach-context.ts'
import { personalizedOpeningPath, validOpeningLines, type OpeningLines } from '../src/personal/recruiter/personalized-copy.ts'
import { recruiterOpening } from '../src/personal/recruiter/landing.ts'
import { withLandingOpening } from '../src/personal/landing/opening-copy.ts'
import { CHAPTERS } from '../src/personal/landing/sequence.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { createPersonalAnalytics, type AnalyticsWindow } from '../src/personal/analytics.ts'

const lines: OpeningLines = ['Hi Alex — I built Atlas with', 'Python and SQL.', 'I care about answers with', 'checkable sources.']
const homepage = '<html><head><title>Home</title></head><body><!--public-page:start--><main><h1>Sulayman Bowles</h1><p>Original introduction.</p><section><h2>Standard writing</h2><a href="/resume">Résumé</a><p>Protected content.</p></section></main><!--public-page:end--></body></html>'
const ready = (company = 'Google', copy = lines): PersonalizedOpeningInput => ({ recordId: randomUUID(), company, status: 'Ready', lines: copy })
const reserved = reservedOutreachSlugs()

function documentFor(html: string) {
  return { querySelector(selector: string) {
    const meta = /^meta\[name="([^"]+)"\]$/.exec(selector)
    if (meta) {
      const match = new RegExp(`<meta name="${meta[1]}" content="([^"]*)">`).exec(html)
      return match ? { content: match[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"') } : null
    }
    const id = selector.startsWith('#') ? selector.slice(1) : undefined
    const match = id && new RegExp(`<script type="application/json" id="${id}">([^]*?)<\\/script>`).exec(html)
    return match ? { textContent: match[1] } : null
  } } as Pick<Document, 'querySelector'>
}

test('two openings at one company keep their own copy and stable links across reorder and omission', () => {
  const a = ready(), b = ready('Google', ['Hi Jordan — I work in', 'product and growth.', 'I like Google’s AI answers with', 'sources I can inspect.'])
  const first = reconcileOpenings(emptyRegistry(), [a, b], reserved)
  assert.equal(first.links.length, 2)
  assert.equal(new Set(first.links.map(link => link.url)).size, 2)
  assert.equal(Object.keys(first.registry.companies).length, 1)
  assert.deepEqual(first.registry.openings![a.recordId].lines, a.lines)
  assert.equal(reconcileOpenings(first.registry, [b, a], reserved).changed, false)
  assert.equal(reconcileOpenings(first.registry, [a], reserved).changed, false)
  assert(first.registry.openings![b.recordId].enabled)
  assert.deepEqual(parseRegistry(first.registry), first.registry)
})

test('recipient rows preserve existing company labels and legacy company sync preserves openings', () => {
  const company = { recordId: randomUUID(), company: 'Google' }
  const base = reconcileCompanies(emptyRegistry(), [company], reserved).registry
  const row = ready('GOOGLE')
  const created = reconcileOpenings(base, [row], reserved)
  assert.deepEqual(created.registry.companies.google, base.companies.google)
  assert.deepEqual(created.registry.records, base.records)
  const legacy = reconcileCompanies(created.registry, [{ recordId: randomUUID(), company: 'Meta' }], reserved)
  assert.deepEqual(legacy.registry.openings, created.registry.openings)
  assert.equal(legacy.registry.companies.google.name, 'Google')
})

test('Draft preserves published copy; Paused disables the page; Ready restores the same URL', async () => {
  const row = ready()
  let registry = reconcileOpenings(emptyRegistry(), [row], reserved).registry
  const handler = createOutreachHomeHandler(async () => registry, async missing => missing ? 'Not found' : homepage)
  const request = () => new Request(`https://example.test${personalizedOpeningPath(row.recordId)}`)
  assert.equal((await handler(request())).status, 200)
  const draft = reconcileOpenings(registry, [{ ...row, status: 'Draft', lines: undefined }], reserved)
  assert.equal(draft.changed, false)
  assert.deepEqual(draft.registry.openings![row.recordId].lines, lines)
  registry = reconcileOpenings(registry, [{ ...row, status: 'Paused', lines: undefined }], reserved).registry
  assert.equal((await handler(request())).status, 404)
  const resumed = reconcileOpenings(registry, [row], reserved)
  registry = resumed.registry
  assert.equal((await handler(request())).status, 200)
  assert.equal(resumed.links[0].url, draft.links[0].url)
})

test('the same stable page updates only after Ready; invalid public copy and duplicate IDs fail', () => {
  const row = ready()
  const before = reconcileOpenings(emptyRegistry(), [row], reserved)
  const edited = { ...row, lines: ['Hi Alex — my work includes', 'Python and SQL.', 'I like sources people can', 'inspect for themselves.'] as OpeningLines }
  const after = reconcileOpenings(before.registry, [edited], reserved)
  assert.equal(after.links[0].url, before.links[0].url)
  assert.equal(after.registry.revision, before.registry.revision + 1)
  assert.deepEqual(after.registry.openings![row.recordId].lines, edited.lines)
  assert.deepEqual(before.registry.openings![row.recordId].lines, lines)
  for (const bad of [[], ['one', 'two', 'three'], ['one', 'two', 'three', ' person@example.com'], ['one', 'two', 'three', 'https://example.com'], ['one', 'two', 'three', 'x'.repeat(113)], ['one', 'two', 'three', 'line\nline']]) {
    assert.equal(validOpeningLines(bad), false)
    assert.throws(() => validateOpenings([{ ...row, lines: bad }]))
  }
  assert.throws(() => validateOpenings([row, row]))
  assert.throws(() => validateOpenings([{ ...row, recordId: '__proto__' }]))
  assert.equal(validateOpenings([{ ...row, status: 'Draft', lines: [] }])[0].lines, undefined)
})

function signed(rows: unknown[], secret: string, source = 'Personalized Openings') {
  const body = JSON.stringify({ spreadsheetId: outreachSpreadsheetId, sheet: source, openings: rows })
  const timestamp = String(Date.now())
  return new Request('https://example.test/api/outreach-sync', { method: 'POST', body, headers: {
    'x-outreach-timestamp': timestamp,
    'x-outreach-signature': createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex'),
  } })
}

test('authenticated opening sync writes once, rejects tampering and retries after a failed write', async () => {
  const secret = 'test-only-personalization-secret-'.repeat(2)
  let registry = emptyRegistry(), writes = 0, failed = true
  const row = ready()
  const store = { read: async () => registry, write: async (value: typeof registry) => { if (failed) throw new Error('Unavailable'); registry = value; writes++ } }
  const handler = createSyncHandler(store, reserved, secret)
  assert.equal((await handler(signed([row], secret))).status, 503)
  assert.deepEqual(registry, emptyRegistry())
  failed = false
  const response = await handler(signed([row], secret))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).links[0].url, `https://sulayman-bowles.dev/for/${row.recordId}`)
  assert.equal((await handler(signed([row], secret))).status, 200)
  assert.equal(writes, 1)
  assert.equal((await handler(signed([row], secret, 'Relationships'))).status, 400)
  assert.equal((await handler(signed([row], 'wrong-secret'.repeat(4)))).status, 401)
})

test('one exact selected opening reaches readable HTML and React context without a contact roster', () => {
  const row = ready()
  const html = outreachDocument(homepage, 'google', 'Google', { id: row.recordId, lines })
  const path = personalizedOpeningPath(row.recordId)
  const company = documentOutreachCompany(documentFor(html), path)!
  assert.deepEqual(company, { slug: 'google', name: 'Google', opening: { id: row.recordId, lines } })
  assert(html.includes(lines.join(' ')))
  assert(html.includes('Protected content.'))
  assert.equal(resolveRoute('', path, [], path.slice(1)), 'recruiter')
  assert.equal(resolveRoute('#/', path, [], path.slice(1)), '')
  assert.equal(resolveRoute('#/resume', path, [], path.slice(1)), 'resume')
  assert.equal(documentOutreachCompany(documentFor(html), personalizedOpeningPath(randomUUID())), undefined)
  assert.equal(documentOutreachCompany(documentFor(html.replace(row.recordId, randomUUID())), path), undefined)
  const opening = recruiterOpening(company)
  assert.deepEqual(opening.lines, lines)
  assert.equal(opening.href, '/resume')
  assert.equal(opening.article.href, '/')
  assert(withLandingOpening(opening).slice(1).every((chapter, index) => chapter === CHAPTERS[index + 1]))
  assert(!html.includes('relationshipId') && !html.includes('jobDescription'))
})

test('selected text is escaped in HTML and inert JSON, including closing-script text', () => {
  const copy: OpeningLines = ['Hi Alex — <R&D>', '</script><script>bad()</script>', 'Quotes "and" & evidence', 'remain ordinary text.']
  const id = randomUUID()
  const html = outreachDocument(homepage, 'google', 'Google', { id, lines: copy })
  assert(!html.includes('</script><script>bad()'))
  assert(html.includes('\\u003c/script\\u003e'))
  assert(html.includes('&lt;R&amp;D&gt;'))
  assert.deepEqual(documentOutreachCompany(documentFor(html), personalizedOpeningPath(id))?.opening?.lines, copy)
})

test('unknown, paused and malformed IDs return 404; HEAD and query tampering retain exact path context', async () => {
  const row = ready()
  const registry = reconcileOpenings(emptyRegistry(), [row], reserved).registry
  const handler = createOutreachHomeHandler(async () => registry, async missing => missing ? 'Not found' : homepage)
  for (const path of [`/for/${randomUUID()}`, '/for/bad-id', `/api/outreach-home?id=${row.recordId}`, `/for/${row.recordId.toUpperCase()}`]) {
    assert.equal((await handler(new Request(`https://example.test${path}`))).status, 404)
  }
  const response = await handler(new Request(`https://example.test/for/${row.recordId}?name=Wrong&company=meta`))
  const html = await response.text()
  assert.equal(response.status, 200)
  assert(!html.includes('Wrong'))
  assert(html.includes('Hi Alex'))
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store')
  const head = await handler(new Request(`https://example.test/for/${row.recordId}`, { method: 'HEAD' }))
  assert.equal(head.status, 200)
  assert.equal(await head.text(), '')
})

test('personalized arrivals retain company-only analytics without recipient, role or page ID fields', () => {
  const row = ready()
  const browser: AnalyticsWindow = { location: { protocol: 'https:', hostname: 'sulayman-bowles.dev', pathname: personalizedOpeningPath(row.recordId) } }
  const document = { referrer: '', getElementById: () => null, createElement: () => ({}), head: { append: () => {} } } as unknown as Document
  const tracker = createPersonalAnalytics(browser, document, 'google', row.recordId)
  tracker({ title: 'Google — Sulayman Bowles', canonical: 'https://sulayman-bowles.dev/' })
  tracker({ title: 'Résumé', canonical: 'https://sulayman-bowles.dev/resume' })
  const commands = browser.dataLayer!.map(command => Array.from(command as ArrayLike<unknown>))
  assert.deepEqual(commands.filter(command => command[1] === 'outreach_visit').map(command => command[2]), [{ send_to: 'G-9VQ15148TG', outreach_company: 'google' }])
  assert(!JSON.stringify(commands).includes(row.recordId))
  assert(!JSON.stringify(commands).includes('Alex'))
})
