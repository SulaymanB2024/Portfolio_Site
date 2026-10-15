import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { analyticsPageLocation, analyticsReferrer, createPersonalAnalytics, installPortfolioActionTracking, personalMeasurementId, portfolioActionForHref, recordPersonalPageView, recordPortfolioAction, type AnalyticsWindow, type PortfolioAction } from '../src/personal/analytics.ts'
import { contact } from '../src/personal/content.ts'
import { searchMetadata } from '../src/personal/search-metadata.ts'

function fixture(hostname = 'sulayman-bowles.dev', protocol = 'https:', pathname = '/', outreachSlug?: string) {
  const scripts: HTMLScriptElement[] = []
  const listeners = new Set<EventListener>()
  const browser: AnalyticsWindow = { location: { hostname, protocol, pathname } }
  let page = searchMetadata('home')
  let canonical = page.canonical
  const document = {
    title: page.title,
    referrer: 'https://www.google.com/search?q=private+search&email=person%40example.com',
    createElement: () => ({} as HTMLScriptElement),
    getElementById: (id: string) => scripts.find(script => script.id === id) || null,
    head: { append: (script: HTMLScriptElement) => scripts.push(script) },
    querySelector: (selector: string) => selector === 'link[rel="canonical"]' ? { href: canonical } : selector === 'meta[name="outreach-company"]' ? { content: outreachSlug } : null,
    addEventListener: (type: string, listener: EventListener) => { if (type === 'click') listeners.add(listener) },
    removeEventListener: (type: string, listener: EventListener) => { if (type === 'click') listeners.delete(listener) },
  } as unknown as Document
  const route = (value: string) => { page = searchMetadata(value); canonical = page.canonical; document.title = page.title }
  const setCanonical = (value: string) => { canonical = value }
  const commands = () => (browser.dataLayer || []).map(command => Array.from(command as ArrayLike<unknown>))
  const views = () => commands().filter(command => command[0] === 'event' && command[1] === 'page_view').map(command => command[2] as Record<string, unknown>)
  const actions = () => commands().filter(command => command[0] === 'event' && command[1] === 'portfolio_action').map(command => command[2] as Record<string, unknown>)
  const click = (href?: string, overrides: Partial<MouseEvent> = {}) => {
    let prevented = false, stopped = false
    const event = {
      button: 0, defaultPrevented: false,
      // A nested label/arrow resolves to its containing anchor.
      target: href ? { closest: () => ({ href }) } : null,
      preventDefault: () => { prevented = true }, stopPropagation: () => { stopped = true },
      ...overrides,
    } as unknown as MouseEvent
    for (const listener of [...listeners]) listener(event)
    return { prevented, stopped }
  }
  return { browser, document, scripts, listeners, route, setCanonical, commands, views, actions, click }
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

test('the route effect records committed metadata and analytics adds no history listeners', () => {
  const source = readFileSync(new URL('../src/personal/PersonalSite.tsx', import.meta.url), 'utf8')
  assert.match(source, /updateSearchHead\(document, route\)\s+recordPersonalPageView\(document, window\)/)
  const analytics = readFileSync(new URL('../src/personal/analytics.ts', import.meta.url), 'utf8')
  assert(!/addEventListener\(['"](?:hashchange|popstate)['"]/.test(analytics))
})

test('public recruiting links send bounded actions without another page view or configuration', () => {
  const f = fixture()
  f.route('resume')
  Object.assign(f.browser.location, { search: '?recipient=person@example.com', hash: '#/resume?role=private-role' })
  recordPersonalPageView(f.document, f.browser)
  const dispose = installPortfolioActionTracking(f.document, f.browser)
  for (const href of ['/Sulayman_Bowles_Resume.pdf', `mailto:${contact.email}`, `${contact.linkedin}/`]) {
    assert.deepEqual(f.click(href), { prevented: false, stopped: false })
  }
  assert.deepEqual(f.actions(), ['resume_download', 'email_click', 'linkedin_click'].map(action => ({
    send_to: personalMeasurementId, action, page_location: 'https://sulayman-bowles.dev/resume',
  })))
  assert.equal(f.views().length, 1)
  assert.equal(f.commands().filter(command => command[0] === 'config').length, 1)
  assert.equal(f.scripts.length, 1)
  const payloads = JSON.stringify(f.actions())
  for (const privateValue of [contact.email, contact.linkedin, 'Sulayman_Bowles_Resume.pdf', 'person@example.com', 'private-role', '?', '#']) assert(!payloads.includes(privateValue))
  dispose()
})

test('actions use the latest committed canonical for direct and hash routes rather than physical URLs', () => {
  for (const pathname of ['/', '/resume']) {
    const f = fixture('sulayman-bowles.dev', 'https:', pathname)
    Object.assign(f.browser.location, { hash: '#/resume?recipient=person@example.com' })
    f.route('resume')
    recordPersonalPageView(f.document, f.browser)
    const dispose = installPortfolioActionTracking(f.document, f.browser)
    f.click('/Sulayman_Bowles_Resume.pdf')
    f.route('contact')
    recordPersonalPageView(f.document, f.browser)
    f.click(`mailto:${contact.email}`)
    assert.deepEqual(f.actions().map(action => action.page_location), ['https://sulayman-bowles.dev/resume', 'https://sulayman-bowles.dev/contact'])
    assert.equal(f.views().length, 2)
    dispose()
  }
})

test('registered recruiter actions retain root canonicals and separate once-only outreach attribution', () => {
  const f = fixture('sulayman-bowles.dev', 'https:', '/base-power', 'base-power')
  Object.assign(f.browser.location, { search: '?recipient=person@example.com&role=private-role' })
  recordPersonalPageView(f.document, f.browser)
  const dispose = installPortfolioActionTracking(f.document, f.browser)
  f.click(`mailto:${contact.email}`)
  f.route('resume'); recordPersonalPageView(f.document, f.browser)
  f.click('/Sulayman_Bowles_Resume.pdf')
  f.route('home'); recordPersonalPageView(f.document, f.browser)
  f.click(contact.linkedin)
  assert.deepEqual(f.actions().map(action => action.page_location), ['https://sulayman-bowles.dev/', 'https://sulayman-bowles.dev/resume', 'https://sulayman-bowles.dev/'])
  assert.deepEqual(f.commands().filter(command => command[1] === 'outreach_visit').map(command => command[2]), [{ send_to: personalMeasurementId, outreach_company: 'base-power' }])
  assert.equal(f.views().length, 3)
  for (const value of ['base-power', 'outreach_company', 'recipient', 'role', 'person@example.com']) assert(!JSON.stringify(f.actions()).includes(value))
  dispose()
})

test('delegated tracking shares one listener and releases it correctly across cleanup and remount', () => {
  const f = fixture()
  recordPersonalPageView(f.document, f.browser)
  const first = installPortfolioActionTracking(f.document, f.browser)
  const second = installPortfolioActionTracking(f.document, f.browser)
  assert.equal(f.listeners.size, 1)
  f.click(contact.linkedin)
  assert.equal(f.actions().length, 1)
  first(); first()
  assert.equal(f.listeners.size, 1)
  f.click(contact.linkedin)
  assert.equal(f.actions().length, 2)
  second(); second()
  assert.equal(f.listeners.size, 0)
  f.click(contact.linkedin)
  assert.equal(f.actions().length, 2)
  const remounted = installPortfolioActionTracking(f.document, f.browser)
  f.click(contact.linkedin)
  assert.equal(f.actions().length, 3)
  assert.equal(f.views().length, 1)
  remounted()
  assert.equal(f.listeners.size, 0)
})

test('prevented and non-primary activations are excluded while keyboard and modified primary clicks work', () => {
  const f = fixture()
  recordPersonalPageView(f.document, f.browser)
  const dispose = installPortfolioActionTracking(f.document, f.browser)
  f.click(contact.linkedin, { button: 1 })
  f.click(contact.linkedin, { button: 2 })
  f.click(contact.linkedin, { defaultPrevented: true })
  f.click()
  assert.equal(f.actions().length, 0)
  f.click(contact.linkedin, { detail: 0 })
  f.click(contact.linkedin, { metaKey: true })
  assert.equal(f.actions().length, 2)
  dispose()
})

test('destination allowlists exclude personal context, arbitrary profiles, PDF files and unsupported origins', () => {
  assert.equal(portfolioActionForHref('https://www.sulayman-bowles.dev/Sulayman_Bowles_Resume.pdf'), 'resume_download')
  assert.equal(portfolioActionForHref('https://sulayman-bowles.dev/Sulayman_Bowles_Resume_Current.pdf'), 'resume_download')
  assert.equal(portfolioActionForHref('/Sulayman_Bowles_Resume_Current.pdf?recipient=private'), undefined)
  const unsupported = [
    `mailto:${contact.email}?subject=private-role&cc=person@example.com`, `mailto:${contact.email}#private`, 'mailto:person@example.com',
    `${contact.linkedin}?recipient=person@example.com`, `${contact.linkedin}#private`, `${contact.linkedin}-other`,
    'https://www.linkedin.com/in/person-example/', 'http://www.linkedin.com/in/sulayman-bowles',
    'https://www.linkedin.com.evil.test/in/sulayman-bowles', 'https://person:password@www.linkedin.com/in/sulayman-bowles',
    '/Sulayman_Bowles_Resume.pdf?recipient=person@example.com', '/Sulayman_Bowles_Resume.pdf#private', '/research/other-resume.pdf',
    'https://evil.test/Sulayman_Bowles_Resume.pdf', 'https://preview.sulayman-bowles.dev/Sulayman_Bowles_Resume.pdf',
    'https://sulayman-bowles.dev.evil.test/Sulayman_Bowles_Resume.pdf', 'https://sulayman-bowles.dev:8443/Sulayman_Bowles_Resume.pdf',
    'http://sulayman-bowles.dev/Sulayman_Bowles_Resume.pdf', 'https://person:password@sulayman-bowles.dev/Sulayman_Bowles_Resume.pdf',
    'javascript:alert(1)', 'data:text/plain,private', '#/resume', '/resume',
  ]
  const f = fixture()
  recordPersonalPageView(f.document, f.browser)
  const dispose = installPortfolioActionTracking(f.document, f.browser)
  for (const href of unsupported) {
    assert.equal(portfolioActionForHref(href), undefined, href)
    f.click(href)
  }
  assert.equal(f.actions().length, 0)
  assert.equal(recordPortfolioAction(f.document, f.browser, 'person@example.com' as PortfolioAction), false)
  for (const canonical of ['https://sulayman-bowles.dev/person@example.com', 'https://evil.test/resume', 'https://person:password@sulayman-bowles.dev/resume']) {
    f.setCanonical(canonical)
    assert.equal(recordPortfolioAction(f.document, f.browser, 'email_click'), false)
    f.click(`mailto:${contact.email}`)
  }
  assert.equal(f.actions().length, 0)
  f.setCanonical('https://sulayman-bowles.dev/resume?recipient=person@example.com#private')
  f.click('/Sulayman_Bowles_Resume.pdf')
  assert.deepEqual(f.actions(), [{ send_to: personalMeasurementId, action: 'resume_download', page_location: 'https://sulayman-bowles.dev/resume' }])
  dispose()
})

test('local, preview, lookalike and HTTP pages never install action tracking or emit with an existing tag', () => {
  for (const [hostname, protocol] of [
    ['localhost', 'http:'], ['127.0.0.1', 'http:'], ['portfolio-site-sample.vercel.app', 'https:'],
    ['sulayman-bowles.dev.evil.test', 'https:'], ['preview.sulayman-bowles.dev', 'https:'], ['sulayman-bowles.dev', 'http:'],
  ]) {
    const f = fixture(hostname, protocol)
    const received: unknown[] = []
    f.browser.gtag = (...parameters: unknown[]) => { received.push(parameters) }
    const dispose = installPortfolioActionTracking(f.document, f.browser)
    assert.equal(f.listeners.size, 0)
    assert.equal(recordPortfolioAction(f.document, f.browser, 'email_click'), false)
    f.click(`mailto:${contact.email}`)
    assert.deepEqual(received, [])
    assert.equal(f.browser.dataLayer, undefined)
    assert.equal(f.scripts.length, 0)
    dispose()
  }
  const www = fixture('www.sulayman-bowles.dev')
  recordPersonalPageView(www.document, www.browser)
  const dispose = installPortfolioActionTracking(www.document, www.browser)
  www.click(contact.linkedin)
  assert.equal(www.actions()[0].page_location, 'https://sulayman-bowles.dev/')
  dispose()
})

test('missing tags, analytics errors and unavailable document APIs leave links and cleanup available', () => {
  const f = fixture()
  const dispose = installPortfolioActionTracking(f.document, f.browser)
  f.click(contact.linkedin)
  assert.equal(f.browser.gtag, undefined)
  assert.equal(f.browser.dataLayer, undefined)
  assert.equal(f.scripts.length, 0)
  recordPersonalPageView(f.document, f.browser)
  f.browser.gtag = () => { throw new Error('Tag blocked') }
  assert.deepEqual(f.click(contact.linkedin), { prevented: false, stopped: false })
  assert.equal(recordPortfolioAction(f.document, f.browser, 'linkedin_click'), false)
  f.document.querySelector = () => { throw new Error('Head unavailable') }
  assert.deepEqual(f.click(contact.linkedin), { prevented: false, stopped: false })
  dispose()
  assert.equal(f.listeners.size, 0)
  f.document.addEventListener = () => { throw new Error('Listener unavailable') }
  assert.doesNotThrow(() => installPortfolioActionTracking(f.document, f.browser)())
})
