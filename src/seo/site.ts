export const SITE_URL = 'https://sulayman-bowles.dev';
export const SITE_NAME = 'Sulayman Bowles';
export const PERSON_ID = `${SITE_URL}/ai-information#sulayman-bowles`;
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const DEFAULT_LOCALE = 'en_US';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
