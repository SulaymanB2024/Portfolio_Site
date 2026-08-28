import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const CANONICAL_RESUME_URL = 'https://sulayman-bowles.dev/resume';
const RESUME_PDF_PATH = '/Sulayman_Bowles_Resume.pdf';

const config = JSON.parse(await readFile(new URL('vercel.json', ROOT), 'utf8'));
const routes = Array.isArray(config.routes) ? config.routes : [];

assert.equal(config.cleanUrls, true, 'vercel.json must keep cleanUrls enabled');
assert.equal(config.trailingSlash, false, 'vercel.json must keep the non-trailing-slash URL policy');

const resumePdfRoute = routes.find(
  (route) => route.src === '/Sulayman_Bowles_Resume\\.pdf' && !route.has && route.headers?.Link,
);

assert.ok(resumePdfRoute, 'resume PDF must declare an HTTP canonical header');
assert.equal(
  resumePdfRoute.headers.Link,
  `<${CANONICAL_RESUME_URL}>; rel="canonical"`,
  'resume PDF canonical must point to the HTML resume',
);
assert.equal(resumePdfRoute.continue, true, 'resume PDF canonical route must continue to the static file');

function literalPath(source) {
  if (typeof source !== 'string' || !source.startsWith('/')) return null;
  const literal = source.replaceAll('\\.', '.');
  const patternCharacters = ['(', ')', '[', ']', '*', '+', '?', '{', '}', '|'];
  return patternCharacters.some((character) => literal.includes(character)) ? null : literal;
}

const redirects = new Map();

for (const route of routes) {
  const location = route.headers?.Location;
  if (route.has || typeof location !== 'string') continue;

  assert.ok(
    route.status === 301 || route.status === 308,
    `${route.src}: SEO redirect must use 301 or 308`,
  );

  const source = literalPath(route.src);
  if (!source || !location.startsWith('/')) continue;
  redirects.set(source, location);
}

for (const [source, target] of redirects) {
  assert.notEqual(source, target, `${source}: redirect loop points back to itself`);
  assert.ok(!redirects.has(target), `${source}: redirect chain passes through ${target}`);
}

assert.equal(
  redirects.get('/resume.pdf'),
  RESUME_PDF_PATH,
  'legacy resume.pdf URL must redirect directly to the canonical PDF asset',
);

const indexNowScript = await readFile(new URL('scripts/submit-indexnow.mjs', ROOT), 'utf8');
assert.ok(
  !indexNowScript.includes('`${SITE_URL}/Sulayman_Bowles_Resume.pdf`'),
  'default IndexNow submissions must not push the duplicate PDF URL',
);

console.log(
  `Vercel SEO route verification passed: ${redirects.size} direct redirects, non-trailing-slash canonicals, and an HTTP canonical from ${RESUME_PDF_PATH} to ${CANONICAL_RESUME_URL}.`,
);
