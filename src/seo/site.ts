export const SITE_URL = 'https://sulayman-bowles.dev';
export const SITE_NAME = 'Sulayman Bowles';
export const PERSON_ID = `${SITE_URL}/about#sulayman-bowles`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PRIMARY_IMAGE_ID = `${SITE_URL}/#primaryimage`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const ATLAS_SOFTWARE_ID = `${SITE_URL}/atlas#software`;
export const VOID_AGENCY_ID = `${SITE_URL}/#void-agency`;
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const DEFAULT_LOCALE = 'en_US';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
