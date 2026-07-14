import { classifyUserAgent } from './classifier.js';
import { BOT_EVENT_SCHEMA_VERSION, type BotEvent, type RouteClass } from './event-schema.js';
import {
  extractQueryParameterNames,
  redactPath,
  redactReferrerOrigin,
  redactSensitiveText,
  sanitizeOptionalText,
} from './redact.js';

const EXCLUDED_PREFIXES = ['/api', '/_next', '/_vercel', '/assets', '/fonts'];
const EXCLUDED_EXTENSIONS = /\.(?:css|js|mjs|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot)$/i;

export interface BotObserverRuntimeConfig {
  collectorUrl: string;
  siteId: string;
  secret: string;
  environment: 'production' | 'preview' | 'development';
  deploymentId: string | null;
  commitSha: string | null;
}

type EnvironmentSource = Record<string, string | undefined>;

function normalizeEnvironment(value: string | undefined): BotObserverRuntimeConfig['environment'] {
  return value === 'production' || value === 'preview' ? value : 'development';
}

export function getBotObserverRuntimeConfig(env: EnvironmentSource): BotObserverRuntimeConfig | null {
  if (env.BOT_OBSERVER_ENABLED !== 'true') return null;
  const collectorUrl = env.BOT_OBSERVER_COLLECTOR_URL?.trim();
  const siteId = env.BOT_OBSERVER_SITE_ID?.trim();
  const secret = env.BOT_OBSERVER_HMAC_SECRET?.trim();
  if (!collectorUrl || !siteId || !secret || secret.length < 32) return null;
  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(siteId)) return null;

  let parsedCollectorUrl: URL;
  try {
    parsedCollectorUrl = new URL(collectorUrl);
  } catch {
    return null;
  }
  if (parsedCollectorUrl.protocol !== 'https:') return null;

  return {
    collectorUrl: parsedCollectorUrl.toString(),
    siteId,
    secret,
    environment: normalizeEnvironment(env.VERCEL_ENV),
    deploymentId: sanitizeOptionalText(env.VERCEL_DEPLOYMENT_ID ?? env.VERCEL_URL, 128),
    commitSha: sanitizeOptionalText(env.VERCEL_GIT_COMMIT_SHA, 64),
  };
}

export function routeClassForRequest(request: Request): RouteClass | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  if (path === '/health' || path === '/healthz') return null;
  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
  if (path === '/robots.txt') return 'robots';
  if (path === '/llms.txt') return 'llms';
  if (path === '/sitemap.xml' || path.startsWith('/sitemap-')) return 'sitemap';
  if (path.endsWith('.pdf')) return 'public_pdf';
  if (/\.(?:csv|json|md|xml|txt)$/i.test(path)) return 'machine_readable';
  if (EXCLUDED_EXTENSIONS.test(path)) return null;

  const accept = request.headers.get('accept') ?? '';
  return !accept || accept.includes('text/html') || accept.includes('*/*') ? 'document' : null;
}

export function shouldObserveRequest(request: Request): boolean {
  return routeClassForRequest(request) !== null;
}

function requestAsn(request: Request): number | null {
  const value = request.headers.get('x-vercel-ip-as-number');
  if (!value || !/^\d{1,10}$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function createBotEvent(request: Request, config: BotObserverRuntimeConfig): BotEvent {
  const routeClass = routeClassForRequest(request);
  if (!routeClass) throw new Error('request is outside the observer route contract');
  const url = new URL(request.url);
  const userAgent = redactSensitiveText(request.headers.get('user-agent'), 1024);
  const classification = classifyUserAgent(userAgent);
  const signaturePresent = request.headers.has('signature') || request.headers.has('signature-input');
  const countryCandidate = sanitizeOptionalText(request.headers.get('x-vercel-ip-country'), 2)?.toUpperCase() ?? null;
  const country = countryCandidate && /^[A-Z]{2}$/.test(countryCandidate) ? countryCandidate : null;

  return {
    eventSchemaVersion: BOT_EVENT_SCHEMA_VERSION,
    eventId: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    siteId: config.siteId,
    environment: config.environment,
    deploymentId: config.deploymentId,
    commitSha: config.commitSha,
    host: url.hostname.toLowerCase().slice(0, 253),
    path: redactPath(url.pathname),
    routeClass,
    method: request.method as 'GET' | 'HEAD',
    queryParameterNames: extractQueryParameterNames(url),
    redactedReferrerOrigin: redactReferrerOrigin(request.headers.get('referer')),
    userAgent,
    observedClass: classification.observedClass,
    claimedBotId: classification.claimedBotId,
    claimedBotName: classification.claimedBotName,
    claimedOperator: classification.claimedOperator,
    purpose: classification.purpose,
    confidence: classification.confidence,
    matchedRuleIds: classification.matchedRuleIds,
    classifierVersion: classification.classifierVersion,
    registryVersion: classification.registryVersion,
    verificationStatus: classification.verificationStatus,
    verificationMethod: null,
    verifiedAt: null,
    country,
    region: sanitizeOptionalText(request.headers.get('x-vercel-ip-country-region'), 64),
    asn: requestAsn(request),
    ipHashRotating: null,
    ja3Digest: null,
    ja4Digest: null,
    signaturePresent,
    signatureAgent: null,
    signatureKeyId: null,
    signatureVerificationStatus: signaturePresent ? 'unverified' : 'not_present',
    signatureVerifiedAt: null,
  };
}
