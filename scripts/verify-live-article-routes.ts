import { ARTICLE_SEARCH_TARGETS } from '../src/seo/articleSearchTargets';
import { getSeoRoute } from '../src/seo/routes';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalize(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function typeSet(value: unknown, types = new Set<string>()) {
  if (Array.isArray(value)) {
    for (const item of value) typeSet(item, types);
  } else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const schemaType = record['@type'];
    if (typeof schemaType === 'string') types.add(schemaType);
    if (Array.isArray(schemaType)) {
      for (const item of schemaType) if (typeof item === 'string') types.add(item);
    }
    for (const nested of Object.values(record)) typeSet(nested, types);
  }
  return types;
}

function jsonLdTypes(html: string) {
  const types = new Set<string>();
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      typeSet(JSON.parse(match[1]), types);
    } catch {
      throw new Error('Invalid JSON-LD found in live HTML');
    }
  }
  return types;
}

const baseArgIndex = process.argv.indexOf('--base');
const baseUrl = (baseArgIndex === -1 ? 'https://sulayman-bowles.dev' : process.argv[baseArgIndex + 1])
  ?.replace(/\/+$/, '');
const canonicalBaseUrl = 'https://sulayman-bowles.dev';
assert(baseUrl, 'Usage: npm run verify:articles-live -- --base https://example.com');

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`, { redirect: 'follow' });
assert(sitemapResponse.status === 200, `sitemap returned HTTP ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const titles = new Set<string>();
const h1Values = new Set<string>();
const results: Array<{ path: string; status: number; title: string; h1: string }> = [];

for (const target of ARTICLE_SEARCH_TARGETS) {
  const response = await fetch(`${baseUrl}${target.path}`, {
    redirect: 'follow',
    headers: { 'user-agent': 'SulaymanBowlesArticleReleaseVerifier/1.0' },
  });
  const html = await response.text();
  const expectedCanonical = `${canonicalBaseUrl}${target.path}`;
  const expectedFinalUrl = `${baseUrl}${target.path}`;
  const title = normalize(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const h1 = normalize(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const types = jsonLdTypes(html);
  const visibleText = normalize(html).toLowerCase();

  assert(response.status === 200, `${target.path}: HTTP ${response.status}`);
  assert(response.url.replace(/\/+$/, '') === expectedFinalUrl, `${target.path}: final URL is ${response.url}`);
  assert(
    html.includes(`rel="canonical" href="${expectedCanonical}"`),
    `${target.path}: self-canonical is missing`,
  );
  assert(!/<meta[^>]+name="robots"[^>]+noindex/i.test(html), `${target.path}: noindex is present`);
  assert(title, `${target.path}: title is missing`);
  assert(h1, `${target.path}: H1 is missing`);
  assert(!titles.has(title.toLowerCase()), `${target.path}: title is duplicated`);
  assert(!h1Values.has(h1.toLowerCase()), `${target.path}: H1 is duplicated`);
  assert(types.has('Article'), `${target.path}: Article JSON-LD is missing`);
  assert(types.has('BreadcrumbList'), `${target.path}: Breadcrumb JSON-LD is missing`);
  assert(
    visibleText.includes('source ledger') || visibleText.includes('research sources'),
    `${target.path}: visible source ledger is missing`,
  );
  assert(
    sitemap.includes(`<loc>${expectedCanonical}</loc>`),
    `${target.path}: sitemap membership is missing`,
  );

  titles.add(title.toLowerCase());
  h1Values.add(h1.toLowerCase());
  results.push({ path: target.path, status: response.status, title, h1 });
}

if (baseUrl === canonicalBaseUrl) {
  for (const target of ARTICLE_SEARCH_TARGETS) {
    const route = getSeoRoute(target.path)!;
    for (const alias of route.aliases) {
      const response = await fetch(`${baseUrl}${alias}`, { redirect: 'manual' });
      assert(response.status === 308, `${alias}: expected HTTP 308, received ${response.status}`);
      assert(response.headers.get('location') === target.path, `${alias}: redirect target is incorrect`);
    }
  }
}

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  checkedAt: new Date().toISOString(),
  articleCount: results.length,
  legacyRedirectCount: baseUrl === canonicalBaseUrl
    ? ARTICLE_SEARCH_TARGETS.reduce(
      (sum, target) => sum + getSeoRoute(target.path)!.aliases.length,
      0,
    )
    : 0,
  results,
}, null, 2));
