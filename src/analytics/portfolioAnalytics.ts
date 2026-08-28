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
  }
}

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,20}$/;
const SCRIPT_ID = 'portfolio-ga4-script';
let lastPageViewKey = '';
let pageViewScheduled = false;

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
