const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const ENCODED_EMAIL_PATTERN = /[A-Z0-9._%+-]+%40[A-Z0-9.-]+(?:\.|%2E)[A-Z]{2,}/gi;
const UUID_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
const LONG_TOKEN_PATTERN = /\b[A-Za-z0-9_-]{48,}\b/g;
const LONG_NUMERIC_SEGMENT_PATTERN = /\/\d{7,}(?=\/|$)/g;

function redactSensitiveTokens(value: string): string {
  return value
    .replace(EMAIL_PATTERN, ':email')
    .replace(ENCODED_EMAIL_PATTERN, ':email')
    .replace(UUID_PATTERN, ':id')
    .replace(LONG_TOKEN_PATTERN, ':token');
}

export function sanitizeText(value: string | null | undefined, maxLength: number): string {
  return (value ?? '').replace(CONTROL_CHARACTERS, ' ').trim().slice(0, maxLength);
}

export function sanitizeOptionalText(value: string | null | undefined, maxLength: number): string | null {
  const sanitized = sanitizeText(value, maxLength);
  return sanitized.length > 0 ? sanitized : null;
}

export function redactSensitiveText(value: string | null | undefined, maxLength: number): string {
  return redactSensitiveTokens(sanitizeText(value, maxLength)).slice(0, maxLength);
}

export function redactSensitiveOptionalText(
  value: string | null | undefined,
  maxLength: number,
): string | null {
  const redacted = redactSensitiveText(value, maxLength);
  return redacted.length > 0 ? redacted : null;
}

export function redactPath(pathname: string): string {
  const path = sanitizeText(pathname, 2048) || '/';
  return redactSensitiveTokens(path).replace(LONG_NUMERIC_SEGMENT_PATTERN, '/:id');
}

export function extractQueryParameterNames(url: URL): string[] {
  const names = new Set<string>();
  for (const name of url.searchParams.keys()) {
    const sanitized = redactSensitiveText(name, 128);
    if (sanitized) names.add(sanitized);
    if (names.size >= 64) break;
  }
  return [...names].sort((left, right) => left.localeCompare(right));
}

export function redactReferrerOrigin(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.origin.slice(0, 512);
  } catch {
    return null;
  }
}
