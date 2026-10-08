import test from 'node:test'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { companySlug, emptyRegistry, parseRegistry, reconcileCompanies, validateCompanies } from '../lib/outreach/registry.ts'
import { reservedOutreachSlugs } from '../lib/outreach/reserved.ts'
import { createSyncHandler, outreachSpreadsheetId, validSyncSignature } from '../lib/outreach/sync.ts'
import { createOutreachHomeHandler, outreachDocument } from '../lib/outreach/home.ts'
import { approvedOutreachSlug } from '../src/personal/outreach-context.ts'
import { resolveRoute } from '../src/personal/editorial/routes.ts'
import { createPersonalAnalytics, type AnalyticsWindow } from '../src/personal/analytics.ts'

const row = (company: string, recordId = randomUUID()) => ({ company, recordId })

test('company slugs are readable, normalized and respect the six initial overrides', () => {
  for (const [name, slug] of [['Base Power Company', 'base-power'], ['Anduril Industries', 'anduril'], ['JPMorganChase', 'jpmorgan'], ['McKinsey & Company', 'mckinsey'], ['Bain & Company', 'bain'], ['Boston Consulting Group', 'bcg'], ['D. E. Shaw', 'd-e-shaw'], ['Café & Co.', 'cafe-and-co'], ['Constructor', 'constructor']]) assert.equal(companySlug(name), slug)
})

test('duplicate companies reuse a URL; reserved paths and normalization collisions get a suffix', () => {
  const a = row('Writing'), b = row('Café'), c = row('Cafe'), d = row('  WRITING  ')
  const result = reconcileCompanies(emptyRegistry(), validateCompanies([a,b,c,d]), reservedOutreachSlugs())
  assert.deepEqual(result.links.map(link => link.slug), ['writing-2', 'cafe', 'cafe-2', 'writing-2'])
  assert.equal(result.registry.revision, 1)
  assert.equal(Object.keys(result.registry.companies).length, 3)
  assert.equal(reconcileCompanies(result.registry, validateCompanies([a,b,c,d]), reservedOutreachSlugs()).changed, false)
  assert.equal(reconcileCompanies(result.registry, validateCompanies([d,c,b,a]), reservedOutreachSlugs()).changed, false)
})

test('published identities survive reordering, retries, renames, omission and recovery by company name', () => {
  const google = row('Google'), meta = row('Meta')
  const first = reconcileCompanies(emptyRegistry(), [google, meta], reservedOutreachSlugs())
  const retry = reconcileCompanies(first.registry, [meta, google], reservedOutreachSlugs())
  assert.equal(retry.changed, false)
  const renamed = reconcileCompanies(retry.registry, [{ ...google, company: 'Google LLC' }], reservedOutreachSlugs())
  assert.equal(renamed.links[0].slug, 'google')
  assert.equal(renamed.registry.records[meta.recordId], 'meta')
  assert.equal(renamed.registry.companies.meta.name, 'Meta')
  const duplicate = reconcileCompanies(renamed.registry, [row('Google LLC')], reservedOutreachSlugs())
  assert.equal(duplicate.links[0].slug, 'google')
  assert.deepEqual(first.registry.companies.google, { name: 'Google', identity: 'google' })
})

test('malformed rows and corrupted registry snapshots fail without publishing private text', () => {
  for (const name of ['', 'person@example.com', 'https://example.com', 'x'.repeat(161)]) assert.throws(() => validateCompanies([row(name)]))
  const a = row('Google'); assert.throws(() => validateCompanies([a,a]))
  assert.throws(() => parseRegistry({ version: 1, revision: 1, companies: {}, records: { bad: 'unknown' } }))
})

function signedRequest(companies: unknown[], secret: string, timestamp = String(Date.now())) {
  const body = JSON.stringify({ spreadsheetId: outreachSpreadsheetId, sheet: 'Portfolio Links', companies })
  return new Request('https://sulayman-bowles.dev/api/outreach-sync', { method: 'POST', body, headers: {
    'Content-Type': 'application/json', 'x-outreach-timestamp': timestamp,
    'x-outreach-signature': createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex'),
  } })
}

test('authenticated sync publishes one batch and skips identical retries; signatures bind body and time', async () => {
  const secret = 'test-only-secret-'.repeat(3)
  let registry = emptyRegistry(), writes = 0
  const store = { read: async () => registry, write: async (value: typeof registry) => { registry = value; writes++ } }
  const handler = createSyncHandler(store, reservedOutreachSlugs(), secret)
  const rows = [row('Google'), row('Base Power Company')]
  assert.equal((await handler(new Request('https://example.test', { method: 'POST', body: '{}' }))).status, 401)
  const first = await handler(signedRequest(rows, secret))
  assert.equal(first.status, 200)
  assert.equal((await first.json()).links[1].url, 'https://sulayman-bowles.dev/base-power')
  assert.equal((await handler(signedRequest(rows, secret))).status, 200)
  assert.equal(writes, 1)
  assert.equal((await handler(signedRequest(rows, secret, String(Date.now() - 6 * 60_000)))).status, 401)
  assert.equal(validSyncSignature('{}', String(Date.now()), '0'.repeat(64), secret), false)
})

test('failed writes retain the previous registry; an automatic retry allocates the same slug', async () => {
  const secret = 'test-only-secret-'.repeat(3)
  let registry = reconcileCompanies(emptyRegistry(), [row('Google')], reservedOutreachSlugs()).registry
  let unavailable = true
  const before = structuredClone(registry)
  const store = { read: async () => registry, write: async (value: typeof registry) => {
    if (unavailable) throw new Error('Upstream unavailable')
    registry = value
  } }
  const handler = createSyncHandler(store, reservedOutreachSlugs(), secret)
  const newRow = row('Base Power Company')
  assert.equal((await handler(signedRequest([newRow], secret))).status, 503)
  assert.deepEqual(registry, before)
  unavailable = false
  const response = await handler(signedRequest([newRow], secret))
  assert.equal((await response.json()).links[0].slug, 'base-power')
  assert(Object.hasOwn(registry.companies, 'google'))
})

test('runtime registry activates new company documents without changing the application build', async () => {
  let registry = emptyRegistry()
  const homepage = '<html><head><link rel="canonical" href="https://sulayman-bowles.dev/"></head><body>Home</body></html>'
  const handler = createOutreachHomeHandler(async () => registry, async missing => missing ? '<html>Page not found</html>' : homepage)
  const request = () => new Request('https://sulayman-bowles.dev/base-power')
  assert.equal((await handler(request())).status, 404)
  registry = reconcileCompanies(registry, [row('Base Power Company')], reservedOutreachSlugs()).registry
  const response = await handler(request())
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, follow')
  assert(!response.headers.has('Location'))
  assert.equal(await response.text(), outreachDocument(homepage, 'base-power'))
  assert.equal((await handler(new Request('https://example.test/not-a-company'))).status, 404)
  assert.equal((await handler(new Request('https://example.test/base-power', {method:'HEAD'}))).status, 200)
  assert.equal((await handler(new Request('https://example.test/api/outreach-home?slug=base-power'))).status, 404)
  assert.equal((await handler(new Request('https://example.test/unknown?slug=base-power'))).status, 404)
  assert.equal((await handler(new Request('https://example.test/base-power?slug=unknown&slug=base-power'))).status, 200)
})

test('only matching approved metadata resolves to Home; hash navigation keeps precedence', () => {
  assert.equal(approvedOutreachSlug('base-power', '/base-power'), 'base-power')
  assert.equal(approvedOutreachSlug('base-power', '/unknown'), undefined)
  assert.equal(approvedOutreachSlug('person@example.com', '/person@example.com'), undefined)
  assert.equal(resolveRoute('', '/base-power', [], 'base-power'), '')
  assert.equal(resolveRoute('#/work', '/base-power', [], 'base-power'), 'work')
  assert.equal(resolveRoute('', '/unknown', []), 'unknown')
})

test('outreach arrival is counted once alongside canonical A→B→A views; preview and arbitrary slugs collect nothing', () => {
  const browser: AnalyticsWindow = {location:{hostname:'sulayman-bowles.dev',protocol:'https:',pathname:'/base-power'}}
  const document = {referrer:'',getElementById:()=>null,createElement:()=>({}),head:{append:()=>{}}} as unknown as Document
  const tracker = createPersonalAnalytics(browser, document, 'base-power')
  tracker({canonical:'https://sulayman-bowles.dev/',title:'Home'})
  tracker({canonical:'https://sulayman-bowles.dev/',title:'Home'})
  tracker({canonical:'https://sulayman-bowles.dev/work',title:'Work'})
  tracker({canonical:'https://sulayman-bowles.dev/',title:'Home'})
  const commands = browser.dataLayer!.map(command=>Array.from(command as ArrayLike<unknown>))
  assert.equal(commands.filter(command=>command[1]==='page_view').length,3)
  assert.deepEqual(commands.filter(command=>command[1]==='outreach_visit').map(command=>command[2]), [{send_to:'G-9VQ15148TG',outreach_company:'base-power'}])
  const preview: AnalyticsWindow = {location:{hostname:'preview.vercel.app',protocol:'https:',pathname:'/base-power'}}
  createPersonalAnalytics(preview,document,'base-power')({canonical:'https://sulayman-bowles.dev/',title:'Home'})
  assert.equal(preview.dataLayer,undefined)
})

test('the dynamic handler follows redirects and filesystem resolution and the initial seed is 50 unique companies', () => {
  const hosting=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'))
  const dynamic=hosting.routes.findIndex((route:any)=>route.dest?.startsWith('/api/outreach-home'))
  assert(dynamic>hosting.routes.findIndex((route:any)=>route.handle==='filesystem'))
  assert(dynamic<hosting.routes.findIndex((route:any)=>route.status===404))
  assert.equal(hosting.routes[dynamic].dest, '/api/outreach-home')
  const names=JSON.parse(readFileSync(new URL('../tools/outreach/seed.json',import.meta.url),'utf8')) as string[]
  assert.equal(new Set(names).size,50)
  const links=reconcileCompanies(emptyRegistry(),names.map(name=>row(name)),reservedOutreachSlugs()).links
  assert.equal(new Set(links.map(link=>link.slug)).size,50)
  assert(!links.some(link=>/-(?:2|3)$/.test(link.slug)))
})
