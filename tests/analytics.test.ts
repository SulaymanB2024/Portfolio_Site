import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyticsPageLocation, analyticsReferrer, createPersonalAnalytics, personalMeasurementId, recordPersonalPageView, type AnalyticsWindow } from '../src/personal/analytics.ts'
import { searchMetadata } from '../src/personal/search-metadata.ts'

function fixture(hostname = 'sulayman-bowles.dev', protocol = 'https:') {
  const scripts: HTMLScriptElement[] = []
  const browser: AnalyticsWindow = { location: { hostname, protocol } }
  let page = searchMetadata('home')
  const document = {
    title: page.title,
    referrer: 'https://www.google.com/search?q=private+search&email=person%40example.com',
    createElement: () => ({} as HTMLScriptElement),
    getElementById: (id: string) => scripts.find(script => script.id === id) || null,
    head: { append: (script: HTMLScriptElement) => scripts.push(script) },
    querySelector: () => ({ href: page.canonical }),
  } as unknown as Document
  const route = (value: string) => { page = searchMetadata(value); document.title = page.title }
  const commands = () => (browser.dataLayer || []).map(command => Array.from(command as ArrayLike<unknown>))
  const views = () => commands().filter(command => command[0] === 'event' && command[1] === 'page_view').map(command => command[2] as Record<string, unknown>)
  return { browser, document, scripts, route, commands, views }
}

test('the initial production view is manual, sanitized and loads one asynchronous native tag', () => {
  const f = fixture()
  assert.equal(recordPersonalPageView(f.document, f.browser), true)
  assert.deepEqual(f.views(), [{
    send_to: personalMeasurementId,
    page_location: 'https://sulayman-bowles.dev/',
    page_title: searchMetadata('home').title,
    page_referrer: 'https://www.google.com/',
  }])
  assert.equal(f.scripts.length, 1)
  assert.equal(f.scripts[0].async, true)
  assert.equal(f.scripts[0].referrerPolicy, 'origin')
  assert.equal(f.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${personalMeasurementId}`)
  const config = f.commands().find(command => command[0] === 'config')![2] as Record<string, unknown>
  assert.equal(config.send_page_view, false)
  assert.equal(config.allow_google_signals, false)
  assert.equal(config.allow_ad_personalization_signals, false)
  assert.equal(f.commands().find(command => command[0] === 'set')![2], false)
  assert.equal(recordPersonalPageView(f.document, f.browser), false)
  assert.equal(f.views().length, 1)
})

test('initial deep and hash routes use committed canonical metadata instead of the physical URL', () => {
  for (const route of ['writing/how-airlines-borrow-against-loyalty-programs', 'writing/robots-txt-courtesy-not-access-control']) {
    const f = fixture()
    f.route(route)
    assert.equal(recordPersonalPageView(f.document, f.browser), true)
    const metadata = searchMetadata(route)
    assert.equal(f.views()[0].page_location, metadata.canonical)
    assert.equal(f.views()[0].page_title, metadata.title)
    assert(!String(f.views()[0].page_location).includes('#'))
    assert(!String(f.views()[0].page_location).includes('?'))
  }
})

test('route commits measure A→B→A with correct referrers and suppress sections and repeated effects', () => {
  const f = fixture()
  f.route('writing/who-owns-texas-toll-roads')
  recordPersonalPageView(f.document, f.browser)
  // Section hashes, query values, replaceState and title-only effects retain this canonical.
  f.document.title += ' '
  assert.equal(recordPersonalPageView(f.document, f.browser), false)
  f.route('about')
  assert.equal(recordPersonalPageView(f.document, f.browser), true)
  assert.equal(recordPersonalPageView(f.document, f.browser), false)
  f.route('writing/who-owns-texas-toll-roads')
  assert.equal(recordPersonalPageView(f.document, f.browser), true)
  assert.equal(f.views().length, 3)
  assert.equal(f.views()[1].page_referrer, 'https://sulayman-bowles.dev/markets/who-owns-texas-toll-roads')
  assert.equal(f.views()[2].page_referrer, 'https://sulayman-bowles.dev/about')
  const updates = f.commands().filter(command => command[0] === 'config').slice(1)
  assert.equal(updates.length, 2)
  for (const update of updates) {
    assert.equal((update[2] as Record<string, unknown>).update, true)
    assert.equal((update[2] as Record<string, unknown>).send_page_view, false)
  }
  assert.equal(f.scripts.length, 1)
})

test('preview, local, lookalike and HTTP origins never initialize or queue analytics', () => {
  for (const [hostname, protocol] of [
    ['localhost', 'http:'], ['127.0.0.1', 'http:'],
    ['portfolio-site-sample.vercel.app', 'https:'], ['sulayman-bowles.dev.evil.test', 'https:'],
    ['preview.sulayman-bowles.dev', 'https:'], ['sulayman-bowles.dev', 'http:'],
  ]) {
    const f = fixture(hostname, protocol)
    assert.equal(recordPersonalPageView(f.document, f.browser), false)
    assert.equal(f.scripts.length, 0)
    assert.equal(f.browser.gtag, undefined)
    assert.equal(f.browser.dataLayer, undefined)
  }
  const www = fixture('www.sulayman-bowles.dev')
  assert.equal(recordPersonalPageView(www.document, www.browser), true)
  assert.equal(www.views()[0].page_location, 'https://sulayman-bowles.dev/')
})

test('known page identities exclude query values, hashes, arbitrary paths and credential URLs', () => {
  assert.equal(analyticsPageLocation('https://sulayman-bowles.dev/about?email=person@example.com#/secret'), 'https://sulayman-bowles.dev/about')
  for (const url of ['https://sulayman-bowles.dev/account/person@example.com', 'https://evil.test/about', 'javascript:bad()', 'https://person:password@sulayman-bowles.dev/about']) assert.equal(analyticsPageLocation(url), undefined)
  assert.equal(analyticsReferrer('https://sulayman-bowles.dev/about?email=person@example.com#section'), 'https://sulayman-bowles.dev/about')
  assert.equal(analyticsReferrer('https://www.sulayman-bowles.dev/about?private=yes'), 'https://sulayman-bowles.dev/about')
  assert.equal(analyticsReferrer('https://external.test/accounts/person@example.com?private=yes'), 'https://external.test/')
  assert.equal(analyticsReferrer('https://person:password@external.test/private'), '')
  assert.equal(analyticsReferrer('mailto:person@example.com'), '')
})

test('analytics failures and invalid head state leave application navigation available', () => {
  const f = fixture()
  f.browser.gtag = () => { throw new Error('Tag blocked') }
  const tracker = createPersonalAnalytics(f.browser, f.document)
  assert.equal(tracker({ canonical: searchMetadata('about').canonical, title: 'About' }), false)
  assert.equal(f.scripts.length, 0)
  const invalid = fixture()
  invalid.document.querySelector = () => { throw new Error('Head unavailable') }
  assert.equal(recordPersonalPageView(invalid.document, invalid.browser), false)
})

test('the deployed CSP permits the native loader and collection without broadening script execution', () => {
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'))
  const policy = config.routes.find((route: any) => route.headers?.['Content-Security-Policy']).headers['Content-Security-Policy'] as string
  const directives = new Map(policy.split(';').map(directive => {
    const [name, ...sources] = directive.trim().split(/\s+/)
    return [name, sources] as const
  }))
  assert(directives.get('script-src')!.includes('https://www.googletagmanager.com'))
  for (const host of ['https://www.googletagmanager.com', 'https://www.google-analytics.com', 'https://region1.google-analytics.com']) assert(directives.get('connect-src')!.includes(host))
  assert(!directives.get('script-src')!.some(source => source.includes('*') || source === "'unsafe-inline'" || source === "'unsafe-eval'"))
  assert(!directives.get('connect-src')!.some(source => source.includes('*') || source.includes('doubleclick') || source.includes('googleadservices')))
  assert.deepEqual(directives.get('script-src-attr'), ["'none'"])
})

test('the route effect records metadata only after the title and canonical are updated', () => {
  const source = readFileSync(new URL('../src/personal/PersonalSite.tsx', import.meta.url), 'utf8')
  assert.match(source, /updateSearchHead\(document, route\)\s+recordPersonalPageView\(document, window\)/)
  const analytics = readFileSync(new URL('../src/personal/analytics.ts', import.meta.url), 'utf8')
  assert(!analytics.includes('addEventListener('))
})
