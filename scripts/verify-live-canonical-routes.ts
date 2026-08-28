import { getCanonicalRoutes } from '../src/seo/routes';
import { absoluteUrl } from '../src/seo/site';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base-url');
const baseUrl = (baseIndex >= 0 ? args[baseIndex + 1] : process.env.BASE_URL ?? 'https://sulayman-bowles.dev').replace(/\/+$/, '');
assert(/^https?:\/\//.test(baseUrl), 'Usage: npm run verify:pseo-live -- --base-url https://host.example');

const routes = getCanonicalRoutes();
const runId = Date.now();
const failures: string[] = [];

async function verifyRoute(route: (typeof routes)[number]) {
  const separator = route.path.includes('?') ? '&' : '?';
  const response = await fetch(`${baseUrl}${route.path}${separator}validation=${runId}`, {
    redirect: 'follow',
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache', 'user-agent': 'Sulayman-Bowles-Canonical-Route-Validator/1.0' },
  });
  const html = await response.text();
  const expectedCanonical = absoluteUrl(route.path);
  const checks: Array<[boolean, string]> = [
    [response.status === 200, `HTTP ${response.status}`],
    [html.includes(`<title>${escapeHtml(route.title)}</title>`), 'title mismatch'],
    [html.includes(`name="description" content="${escapeHtml(route.description)}"`), 'description mismatch'],
    [html.includes(`rel="canonical" href="${expectedCanonical}"`), 'canonical mismatch'],
    [html.includes(`<h1>${escapeHtml(route.h1)}</h1>`), 'static H1 mismatch'],
    [html.includes('type="application/ld+json"'), 'JSON-LD missing'],
    [html.includes(expectedCanonical), 'canonical URL missing from document/schema'],
    [!/<meta name="robots" content="[^"]*noindex/i.test(html), 'unexpected noindex'],
  ];
  for (const [passed, message] of checks) {
    if (!passed) failures.push(`${route.path}: ${message}`);
  }
}

for (let index = 0; index < routes.length; index += 8) {
  await Promise.all(routes.slice(index, index + 8).map(verifyRoute));
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml?validation=${runId}`, { headers: { 'cache-control': 'no-cache' } });
const sitemap = await sitemapResponse.text();
if (sitemapResponse.status !== 200) failures.push(`/sitemap.xml: HTTP ${sitemapResponse.status}`);
for (const route of routes) {
  if (!sitemap.includes(`<loc>${absoluteUrl(route.path)}</loc>`)) failures.push(`${route.path}: missing from live sitemap`);
}

assert(!failures.length, `Live canonical-route validation failed:\n${failures.join('\n')}`);
console.log(`Live canonical-route verification passed for ${routes.length} URLs at ${baseUrl} with uncached HTTP, head, schema, H1, indexability, and sitemap checks.`);
