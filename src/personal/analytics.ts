import { publicPages, siteOrigin } from './public-pages.ts'

export const personalMeasurementId = 'G-9VQ15148TG'
const scriptId = 'personal-ga4-script'
const productionHosts = new Set(['sulayman-bowles.dev', 'www.sulayman-bowles.dev'])
const knownLocations = new Set([...publicPages.map(page => `${siteOrigin}${page.path}`), `${siteOrigin}/404`])

type Gtag = (...parameters: unknown[]) => void
export interface AnalyticsWindow {
  location: Pick<Location, 'hostname' | 'protocol'>
  dataLayer?: unknown[]
  gtag?: Gtag
}
type AnalyticsDocument = Pick<Document, 'referrer' | 'createElement' | 'getElementById' | 'head'>
export interface AnalyticsPage { canonical: string; title: string }

/** Accept only public route identities; never send URL searches or hash parameters. */
export function analyticsPageLocation(value: string): string | undefined {
  try {
    const url = new URL(value)
    if (url.origin !== siteOrigin || url.username || url.password) return undefined
    const canonical = `${siteOrigin}${url.pathname}`
    return knownLocations.has(canonical) ? canonical : undefined
  } catch { return undefined }
}

export function analyticsReferrer(value: string): string {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return ''
    if (productionHosts.has(url.hostname)) return analyticsPageLocation(`${siteOrigin}${url.pathname}`) || `${siteOrigin}/`
    // External paths and searches can contain account identifiers or search terms.
    return `${url.origin}/`
  } catch { return '' }
}

/** One tracker per document. A→B→A is three views; section/title-only changes are not. */
export function createPersonalAnalytics(browser: AnalyticsWindow, document: AnalyticsDocument) {
  let initialized = false
  let previousLocation = ''
  return (page: AnalyticsPage): boolean => {
    if (browser.location.protocol !== 'https:' || !productionHosts.has(browser.location.hostname)) return false
    const pageLocation = analyticsPageLocation(page.canonical)
    if (!pageLocation || pageLocation === previousLocation) return false
    const fields = {
      page_location: pageLocation,
      page_title: page.title.replace(/\s+/g, ' ').trim().slice(0, 300),
      page_referrer: previousLocation || analyticsReferrer(document.referrer),
    }
    try {
      if (!initialized) {
        browser.dataLayer ||= []
        browser.gtag ||= function gtag() { browser.dataLayer!.push(arguments) }
        const tag = browser.gtag
        tag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
        tag('set', 'send_page_view', false)
        tag('js', new Date())
        tag('config', personalMeasurementId, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          ads_data_redaction: true,
          ...fields,
        })
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script')
          script.id = scriptId
          script.async = true
          script.src = `https://www.googletagmanager.com/gtag/js?id=${personalMeasurementId}`
          script.referrerPolicy = 'origin'
          document.head.append(script)
        }
        initialized = true
      } else {
        // Keep engagement events on the committed virtual page without another config view.
        browser.gtag!('config', personalMeasurementId, { update: true, send_page_view: false, ...fields })
      }
      browser.gtag!('event', 'page_view', { send_to: personalMeasurementId, ...fields })
      previousLocation = pageLocation
      return true
    } catch {
      // A blocked tag, storage failure or unavailable analytics must not affect navigation.
      return false
    }
  }
}

const trackers = new WeakMap<AnalyticsWindow, ReturnType<typeof createPersonalAnalytics>>()

/** Called only after updateSearchHead commits the route's title and canonical. */
export function recordPersonalPageView(document: Document, browser: AnalyticsWindow): boolean {
  try {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    if (!canonical) return false
    let tracker = trackers.get(browser)
    if (!tracker) { tracker = createPersonalAnalytics(browser, document); trackers.set(browser, tracker) }
    return tracker({ canonical, title: document.title })
  } catch { return false }
}
