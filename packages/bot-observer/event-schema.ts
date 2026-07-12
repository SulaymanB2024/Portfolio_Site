export const BOT_EVENT_SCHEMA_VERSION = '1.0.0';
export const CLASSIFIER_VERSION = '2026-07-11.1';

export const OBSERVED_CLASSES = [
  'self_identified_bot',
  'suspected_automation',
  'ordinary_browser',
] as const;

export const BOT_PURPOSES = [
  'traditional_search',
  'ai_search',
  'model_training',
  'user_agent_fetch',
  'seo_intelligence',
  'social_preview',
  'monitoring',
  'security_scanning',
  'performance_testing',
  'generic_automation',
  'unknown',
] as const;

export const VERIFICATION_STATUSES = [
  'unverified',
  'pending',
  'published_ip_match',
  'reverse_dns_verified',
  'signed_identity_verified',
  'failed',
] as const;

export const SIGNATURE_VERIFICATION_STATUSES = [
  'not_present',
  'unverified',
  'verified',
  'failed',
  'unsupported',
] as const;

export const ROUTE_CLASSES = [
  'document',
  'robots',
  'sitemap',
  'llms',
  'public_pdf',
  'machine_readable',
] as const;

export const DEPLOYMENT_ENVIRONMENTS = ['production', 'preview', 'development'] as const;

export type ObservedClass = (typeof OBSERVED_CLASSES)[number];
export type BotPurpose = (typeof BOT_PURPOSES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
export type SignatureVerificationStatus = (typeof SIGNATURE_VERIFICATION_STATUSES)[number];
export type RouteClass = (typeof ROUTE_CLASSES)[number];
export type DeploymentEnvironment = (typeof DEPLOYMENT_ENVIRONMENTS)[number];

export interface ClassificationResult {
  observedClass: ObservedClass;
  claimedBotId: string | null;
  claimedBotName: string | null;
  claimedOperator: string | null;
  purpose: BotPurpose;
  confidence: number;
  verificationStatus: VerificationStatus;
  matchedRuleIds: string[];
  classifierVersion: string;
  registryVersion: string;
}

export interface BotEvent {
  eventSchemaVersion: string;
  eventId: string;
  occurredAt: string;
  siteId: string;
  environment: DeploymentEnvironment;
  deploymentId: string | null;
  commitSha: string | null;
  host: string;
  path: string;
  routeClass: RouteClass;
  method: 'GET' | 'HEAD';
  queryParameterNames: string[];
  redactedReferrerOrigin: string | null;
  userAgent: string;
  observedClass: ObservedClass;
  claimedBotId: string | null;
  claimedBotName: string | null;
  claimedOperator: string | null;
  purpose: BotPurpose;
  confidence: number;
  matchedRuleIds: string[];
  classifierVersion: string;
  registryVersion: string;
  verificationStatus: VerificationStatus;
  verificationMethod: string | null;
  verifiedAt: string | null;
  country: string | null;
  region: string | null;
  asn: number | null;
  ipHashRotating: string | null;
  ja3Digest: string | null;
  ja4Digest: string | null;
  signaturePresent: boolean;
  signatureAgent: string | null;
  signatureKeyId: string | null;
  signatureVerificationStatus: SignatureVerificationStatus;
  signatureVerifiedAt: string | null;
}

export type BotEventValidationResult =
  | { ok: true; event: BotEvent }
  | { ok: false; issues: string[] };

const EVENT_KEYS = new Set<keyof BotEvent>([
  'eventSchemaVersion',
  'eventId',
  'occurredAt',
  'siteId',
  'environment',
  'deploymentId',
  'commitSha',
  'host',
  'path',
  'routeClass',
  'method',
  'queryParameterNames',
  'redactedReferrerOrigin',
  'userAgent',
  'observedClass',
  'claimedBotId',
  'claimedBotName',
  'claimedOperator',
  'purpose',
  'confidence',
  'matchedRuleIds',
  'classifierVersion',
  'registryVersion',
  'verificationStatus',
  'verificationMethod',
  'verifiedAt',
  'country',
  'region',
  'asn',
  'ipHashRotating',
  'ja3Digest',
  'ja4Digest',
  'signaturePresent',
  'signatureAgent',
  'signatureKeyId',
  'signatureVerificationStatus',
  'signatureVerifiedAt',
]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SITE_ID_PATTERN = /^[a-z0-9][a-z0-9-]{2,63}$/;
const HOST_PATTERN = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const SHA_PATTERN = /^[0-9a-f]{7,64}$/i;
const DIGEST_PATTERN = /^[A-Za-z0-9_+./=-]{4,256}$/;
const COUNTRY_PATTERN = /^[A-Z]{2}$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/u;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/iu;
const ENCODED_EMAIL_PATTERN = /[A-Z0-9._%+-]+%40[A-Z0-9.-]+(?:\.|%2E)[A-Z]{2,}/iu;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEnumValue<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === 'string' && (values as readonly string[]).includes(value);
}

function validString(value: unknown, maxLength: number, allowEmpty = false): value is string {
  return (
    typeof value === 'string' &&
    value.length <= maxLength &&
    !CONTROL_CHARACTER_PATTERN.test(value) &&
    (allowEmpty || value.length > 0)
  );
}

function containsEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value) || ENCODED_EMAIL_PATTERN.test(value);
}

function validReferrerOrigin(value: unknown): value is string | null {
  if (value === null) return true;
  if (!validString(value, 512) || containsEmail(value)) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && parsed.origin === value;
  } catch {
    return false;
  }
}

function validOptionalString(value: unknown, maxLength: number): value is string | null {
  return value === null || validString(value, maxLength);
}

function validStringArray(value: unknown, maxItems: number, maxItemLength: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => validString(item, maxItemLength))
  );
}

export function validateBotEvent(input: unknown): BotEventValidationResult {
  if (!isRecord(input)) {
    return { ok: false, issues: ['event must be an object'] };
  }

  const issues: string[] = [];
  const unknownKeys = Object.keys(input).filter((key) => !EVENT_KEYS.has(key as keyof BotEvent));
  if (unknownKeys.length > 0) issues.push('event contains unknown fields');

  if (input.eventSchemaVersion !== BOT_EVENT_SCHEMA_VERSION) issues.push('unsupported event schema');
  if (!validString(input.eventId, 36) || !UUID_PATTERN.test(input.eventId)) issues.push('invalid eventId');
  if (!validString(input.occurredAt, 40) || Number.isNaN(Date.parse(input.occurredAt))) issues.push('invalid occurredAt');
  if (!validString(input.siteId, 64) || !SITE_ID_PATTERN.test(input.siteId)) issues.push('invalid siteId');
  if (!isEnumValue(DEPLOYMENT_ENVIRONMENTS, input.environment)) issues.push('invalid environment');
  if (!validOptionalString(input.deploymentId, 128)) issues.push('invalid deploymentId');
  if (!validOptionalString(input.commitSha, 64) || (input.commitSha !== null && !SHA_PATTERN.test(input.commitSha))) {
    issues.push('invalid commitSha');
  }
  if (!validString(input.host, 253) || !HOST_PATTERN.test(input.host)) issues.push('invalid host');
  if (
    !validString(input.path, 2048) ||
    !input.path.startsWith('/') ||
    input.path.includes('?') ||
    input.path.includes('#') ||
    containsEmail(input.path)
  ) {
    issues.push('invalid path');
  }
  if (!isEnumValue(ROUTE_CLASSES, input.routeClass)) issues.push('invalid routeClass');
  if (input.method !== 'GET' && input.method !== 'HEAD') issues.push('invalid method');
  if (
    !validStringArray(input.queryParameterNames, 64, 128) ||
    input.queryParameterNames.some((name) => /[?&#=]/u.test(name) || containsEmail(name))
  ) {
    issues.push('invalid queryParameterNames');
  }
  if (!validReferrerOrigin(input.redactedReferrerOrigin)) issues.push('invalid redactedReferrerOrigin');
  if (!validString(input.userAgent, 1024, true) || containsEmail(input.userAgent)) issues.push('invalid userAgent');
  if (!isEnumValue(OBSERVED_CLASSES, input.observedClass)) issues.push('invalid observedClass');
  if (!validOptionalString(input.claimedBotId, 128)) issues.push('invalid claimedBotId');
  if (!validOptionalString(input.claimedBotName, 128)) issues.push('invalid claimedBotName');
  if (!validOptionalString(input.claimedOperator, 128)) issues.push('invalid claimedOperator');
  if (!isEnumValue(BOT_PURPOSES, input.purpose)) issues.push('invalid purpose');
  if (typeof input.confidence !== 'number' || !Number.isFinite(input.confidence) || input.confidence < 0 || input.confidence > 1) {
    issues.push('invalid confidence');
  }
  if (!validStringArray(input.matchedRuleIds, 24, 128)) issues.push('invalid matchedRuleIds');
  if (!validString(input.classifierVersion, 64)) issues.push('invalid classifierVersion');
  if (!validString(input.registryVersion, 64)) issues.push('invalid registryVersion');
  if (!isEnumValue(VERIFICATION_STATUSES, input.verificationStatus)) issues.push('invalid verificationStatus');
  if (!validOptionalString(input.verificationMethod, 64)) issues.push('invalid verificationMethod');
  if (!validOptionalString(input.verifiedAt, 40) || (input.verifiedAt !== null && Number.isNaN(Date.parse(input.verifiedAt)))) {
    issues.push('invalid verifiedAt');
  }
  if (input.country !== null && (typeof input.country !== 'string' || !COUNTRY_PATTERN.test(input.country))) {
    issues.push('invalid country');
  }
  if (!validOptionalString(input.region, 64)) issues.push('invalid region');
  if (
    input.asn !== null &&
    (typeof input.asn !== 'number' || !Number.isSafeInteger(input.asn) || input.asn < 0)
  ) {
    issues.push('invalid asn');
  }
  if (!validOptionalString(input.ipHashRotating, 128)) issues.push('invalid ipHashRotating');
  if (!validOptionalString(input.ja3Digest, 256) || (input.ja3Digest !== null && !DIGEST_PATTERN.test(input.ja3Digest))) {
    issues.push('invalid ja3Digest');
  }
  if (!validOptionalString(input.ja4Digest, 256) || (input.ja4Digest !== null && !DIGEST_PATTERN.test(input.ja4Digest))) {
    issues.push('invalid ja4Digest');
  }
  if (typeof input.signaturePresent !== 'boolean') issues.push('invalid signaturePresent');
  if (!validOptionalString(input.signatureAgent, 256) || (input.signatureAgent !== null && containsEmail(input.signatureAgent))) {
    issues.push('invalid signatureAgent');
  }
  if (!validOptionalString(input.signatureKeyId, 256) || (input.signatureKeyId !== null && containsEmail(input.signatureKeyId))) {
    issues.push('invalid signatureKeyId');
  }
  if (!isEnumValue(SIGNATURE_VERIFICATION_STATUSES, input.signatureVerificationStatus)) {
    issues.push('invalid signatureVerificationStatus');
  }
  if (
    !validOptionalString(input.signatureVerifiedAt, 40) ||
    (input.signatureVerifiedAt !== null &&
      (Number.isNaN(Date.parse(input.signatureVerifiedAt)) || input.signatureVerificationStatus !== 'verified'))
  ) {
    issues.push('invalid signatureVerifiedAt');
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, event: input as unknown as BotEvent };
}
