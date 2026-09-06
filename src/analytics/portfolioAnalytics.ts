import { track as trackVercelEvent } from '@vercel/analytics';
import { getSeoRoute } from '../seo/routes';

export const SEO_CONVERSION_EVENTS = [
  'seo_cta_click',
  'lead_form_start',
  'lead_form_submit',
  'asset_download',
] as const;

export type SeoConversionEventName = typeof SEO_CONVERSION_EVENTS[number];

export const PORTFOLIO_HOSTS = [
  'www.void-agency.com',
  'sulayman-bowles.dev',
  'sulayman-bowles.tech',
  '1-800-operator.vercel.app',
] as const;

export const PORTFOLIO_SITE_BY_HOST = {
  'www.void-agency.com': 'void_agency',
  'sulayman-bowles.dev': 'sulayman_bowles_dev',
  'sulayman-bowles.tech': 'sulayman_bowles_tech',
  '1-800-operator.vercel.app': 'operator',
} as const;

export type PortfolioSite = typeof PORTFOLIO_SITE_BY_HOST[keyof typeof PORTFOLIO_SITE_BY_HOST];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __portfolioAnalyticsStarted?: boolean;
    __portfolioCtaTrackingStarted?: boolean;
  }
}

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,20}$/;
const SCRIPT_ID = 'portfolio-ga4-script';
let lastPageViewKey = '';
let pageViewScheduled = false;

export const PORTFOLIO_CTA_METADATA = {
  home_view_work: { surface: 'home', target: 'selected_work', kind: 'internal' },
  home_start_project: { surface: 'home', target: 'contact', kind: 'internal' },
  home_research: { surface: 'home', target: 'research', kind: 'internal' },
  home_contact: { surface: 'home', target: 'contact', kind: 'internal' },
  home_open_proof: { surface: 'home', target: 'featured_proof', kind: 'internal' },
  home_email: { surface: 'home', target: 'email', kind: 'email' },
  home_linkedin: { surface: 'home', target: 'linkedin', kind: 'external' },
  home_resume: { surface: 'home', target: 'resume', kind: 'internal' },
  home_github: { surface: 'home', target: 'github', kind: 'external' },
  resume_download_pdf: { surface: 'resume', target: 'resume_pdf', kind: 'download' },
  resume_email: { surface: 'resume', target: 'email', kind: 'email' },
  resume_view_work: { surface: 'resume', target: 'selected_work', kind: 'internal' },
  resume_read_research: { surface: 'resume', target: 'research', kind: 'internal' },
  resume_supporting_link: { surface: 'resume', target: 'supporting_record', kind: 'mixed' },
  research_view_work: { surface: 'research', target: 'selected_work', kind: 'internal' },
  research_markets: { surface: 'research', target: 'markets', kind: 'internal' },
  research_atlas: { surface: 'research', target: 'atlas', kind: 'internal' },
  research_open_publication: { surface: 'research', target: 'publication', kind: 'internal' },
  work_open_project: { surface: 'work', target: 'project', kind: 'mixed' },
  work_open_evidence: { surface: 'work', target: 'evidence', kind: 'mixed' },
  work_open_artifact: { surface: 'work', target: 'supporting_artifact', kind: 'internal' },
  work_open_contact: { surface: 'work', target: 'contact', kind: 'internal' },
  void_audit_kit: { surface: 'portfolio', target: 'void_audit_kit', kind: 'external' },
  toll_download_csv: { surface: 'texas_toll_tracker', target: 'texas_toll_tracker_csv', kind: 'download' },
  toll_download_json: { surface: 'texas_toll_tracker', target: 'texas_toll_tracker_json', kind: 'download' },
  contact_email: { surface: 'contact', target: 'email', kind: 'email' },
  contact_linkedin: { surface: 'contact', target: 'linkedin', kind: 'external' },
  contact_resume: { surface: 'contact', target: 'resume', kind: 'internal' },
  contact_github: { surface: 'contact', target: 'github', kind: 'external' },
} as const;

export type PortfolioCtaId = keyof typeof PORTFOLIO_CTA_METADATA;

export type PortfolioCtaEvent = {
  event_name: 'seo_cta_click' | 'asset_download';
  cta_id: PortfolioCtaId;
  cta_surface: (typeof PORTFOLIO_CTA_METADATA)[PortfolioCtaId]['surface'];
  destination: (typeof PORTFOLIO_CTA_METADATA)[PortfolioCtaId]['target'];
  destination_kind: (typeof PORTFOLIO_CTA_METADATA)[PortfolioCtaId]['kind'];
  route_cluster: string;
  portfolio_site: PortfolioSite;
};

export function normalizePortfolioMeasurementId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase();
  return MEASUREMENT_ID_PATTERN.test(normalized) ? normalized : null;
}

export function resolvePortfolioSite(hostname: string): PortfolioSite | null {
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, '');
  return PORTFOLIO_SITE_BY_HOST[normalized as keyof typeof PORTFOLIO_SITE_BY_HOST] ?? null;
}

export function sanitizePortfolioPath(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '/';
  try {
    const parsed = new URL(value, 'https://portfolio.invalid');
    const pathname = parsed.pathname.startsWith('/') ? parsed.pathname : `/${parsed.pathname}`;
    return pathname.replace(/\/{2,}/g, '/').slice(0, 1024) || '/';
  } catch {
    return '/';
  }
}

export function sanitizePortfolioReferrer(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    const site = resolvePortfolioSite(parsed.hostname);
    return site
      ? `${parsed.protocol}//${parsed.host}${sanitizePortfolioPath(parsed.pathname)}`
      : `${parsed.protocol}//${parsed.host}/`;
  } catch {
    return '';
  }
}

function isPortfolioCtaId(value: unknown): value is PortfolioCtaId {
  return typeof value === 'string'
    && Object.prototype.hasOwnProperty.call(PORTFOLIO_CTA_METADATA, value);
}

export function buildPortfolioCtaEvent(
  ctaId: unknown,
  hostname: string,
  pathname: string,
): PortfolioCtaEvent | null {
  if (!isPortfolioCtaId(ctaId)) return null;
  const portfolioSite = resolvePortfolioSite(hostname);
  if (!portfolioSite) return null;
  const route = getSeoRoute(sanitizePortfolioPath(pathname));
  const routeCluster = route?.portfolioRoute?.intentCluster;
  if (!routeCluster) return null;
  const metadata = PORTFOLIO_CTA_METADATA[ctaId];

  return {
    event_name: metadata.kind === 'download' ? 'asset_download' : 'seo_cta_click',
    cta_id: ctaId,
    cta_surface: metadata.surface,
    destination: metadata.target,
    destination_kind: metadata.kind,
    route_cluster: routeCluster,
    portfolio_site: portfolioSite,
  };
}

function sendPortfolioCta(ctaId: unknown): void {
  if (window.location.protocol !== 'https:') return;
  const properties = buildPortfolioCtaEvent(
    ctaId,
    window.location.hostname,
    window.location.pathname,
  );
  if (!properties) return;
  const { event_name: eventName, ...eventProperties } = properties;

  try {
    trackVercelEvent(eventName, eventProperties);
  } catch {
    // Measurement must never interfere with the user's navigation.
  }

  try {
    window.gtag?.('event', eventName, {
      ...eventProperties,
      transport_type: 'beacon',
    });
  } catch {
    // GA4 is optional and fails closed when unavailable or blocked.
  }
}

export function startPortfolioCtaTracking(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (window.__portfolioCtaTrackingStarted) return false;
  if (!resolvePortfolioSite(window.location.hostname) || window.location.protocol !== 'https:') return false;

  window.__portfolioCtaTrackingStarted = true;
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>('[data-portfolio-cta]');
    if (!target) return;
    sendPortfolioCta(target.dataset.portfolioCta);
  }, { capture: true });
  return true;
}

function ensureGtag(measurementId: string): NonNullable<Window['gtag']> {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ads_data_redaction: true,
    linker: {
      domains: [...PORTFOLIO_HOSTS],
      accept_incoming: true,
      decorate_forms: false,
    },
  });

  return window.gtag;
}

function sendPortfolioPageView(measurementId: string): void {
  const portfolioSite = resolvePortfolioSite(window.location.hostname);
  if (!portfolioSite) return;

  const pagePath = sanitizePortfolioPath(window.location.pathname);
  const pageViewKey = `${window.location.hostname.toLowerCase()}${pagePath}`;
  if (lastPageViewKey === pageViewKey) return;
  lastPageViewKey = pageViewKey;

  const pageTitle = document.title.replace(/\s+/g, ' ').trim().slice(0, 300);
  window.gtag?.('event', 'page_view', {
    send_to: measurementId,
    page_location: `https://${window.location.hostname.toLowerCase()}${pagePath}`,
    page_path: pagePath,
    page_title: pageTitle,
    page_referrer: sanitizePortfolioReferrer(document.referrer),
    portfolio_site: portfolioSite,
    transport_type: 'beacon',
  });
}

function schedulePortfolioPageView(measurementId: string): void {
  if (pageViewScheduled) return;
  pageViewScheduled = true;
  window.requestAnimationFrame(() => {
    pageViewScheduled = false;
    sendPortfolioPageView(measurementId);
  });
}

function observeHistory(measurementId: string): void {
  const pushState = window.history.pushState.bind(window.history);
  const replaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    pushState(...args);
    schedulePortfolioPageView(measurementId);
  };
  window.history.replaceState = (...args) => {
    replaceState(...args);
    schedulePortfolioPageView(measurementId);
  };
  window.addEventListener('popstate', () => schedulePortfolioPageView(measurementId));
}

export function startPortfolioAnalytics(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (window.__portfolioAnalyticsStarted) return false;

  const environment = (import.meta as ImportMeta & {
    readonly env?: Record<string, string | undefined>;
  }).env;
  const measurementId = normalizePortfolioMeasurementId(
    environment?.VITE_PORTFOLIO_GA_MEASUREMENT_ID,
  );
  const portfolioSite = resolvePortfolioSite(window.location.hostname);
  if (!measurementId || !portfolioSite || window.location.protocol !== 'https:') return false;

  window.__portfolioAnalyticsStarted = true;
  ensureGtag(measurementId);
  observeHistory(measurementId);
  schedulePortfolioPageView(measurementId);
  return true;
}
