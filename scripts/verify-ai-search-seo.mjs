import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://sulayman-bowles.dev';
const personId = `${siteUrl}/ai-information#sulayman-bowles`;

const canonicalRoutes = [
  ['/', 'dist/index.html'],
  ['/work', 'dist/work/index.html'],
  ['/about', 'dist/about/index.html'],
  ['/simple', 'dist/simple/index.html'],
  ['/atlas', 'dist/atlas/index.html'],
  ['/atlas/sample-crawl', 'dist/atlas/sample-crawl/index.html'],
  ['/resume', 'dist/resume/index.html'],
  ['/ai-information', 'dist/ai-information/index.html'],
  ['/research', 'dist/research/index.html'],
  ['/sitemap', 'dist/sitemap/index.html'],
  ['/method', 'dist/method/index.html'],
  ['/void-agency', 'dist/void-agency/index.html'],
  ['/contact', 'dist/contact/index.html'],
  ['/austin-technical-seo', 'dist/austin-technical-seo/index.html'],
  ['/case-studies/technical-seo-audit', 'dist/case-studies/technical-seo-audit/index.html'],
  ['/viralbench-codex-agent-harness', 'dist/viralbench-codex-agent-harness/index.html'],
  ['/markets', 'dist/markets/index.html'],
  ['/markets/ai-search-crawler-policy', 'dist/markets/ai-search-crawler-policy/index.html'],
  ['/markets/technical-seo-public-data-infrastructure', 'dist/markets/technical-seo-public-data-infrastructure/index.html'],
  ['/markets/canonical-identity-personal-seo', 'dist/markets/canonical-identity-personal-seo/index.html'],
  ['/markets/who-owns-texas-toll-roads', 'dist/markets/who-owns-texas-toll-roads/index.html'],
];

const archivedMarketPaths = [
  '/markets/network-monopolies',
  '/markets/computational-commodity-systems',
  '/markets/fiat-horizon',
];

function read(file) {
  return fs.readFileSync(path.resolve(file), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function absolutePath(pathname) {
  return pathname === '/' ? `${siteUrl}/` : `${siteUrl}${pathname}`;
}

function jsonLdGraph(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert(scripts.length > 0, 'missing JSON-LD script');
  return scripts.flatMap((script) => {
    const parsed = JSON.parse(script[1]);
    return parsed['@graph'] ?? [parsed];
  });
}

function schemaTypes(item) {
  return Array.isArray(item?.['@type']) ? item['@type'] : [item?.['@type']];
}

function findType(graph, type, id) {
  return graph.find((item) => schemaTypes(item).includes(type) && (!id || item['@id'] === id));
}

function findItemList(graph, id) {
  return graph.find((item) => item['@type'] === 'ItemList' && item['@id'] === id);
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function assertVisibleText(file, expected) {
  const text = visibleText(read(file)).toLowerCase();
  for (const value of expected) {
    assert(text.includes(value.toLowerCase()), `${file}: missing visible text "${value}"`);
  }
}

function assertAbsent(file, forbidden) {
  const text = read(file).toLowerCase();
  for (const value of forbidden) {
    assert(!text.includes(value.toLowerCase()), `${file}: contains forbidden residue "${value}"`);
  }
}

function metaContent(html, name) {
  return html.match(new RegExp('(?:name|property)="' + name + '" content="([^"]+)"'))?.[1];
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...values] = rows;
  return {
    headers,
    rows: values.map((valuesRow) =>
      Object.fromEntries(headers.map((header, index) => [header, valuesRow[index] ?? ''])),
    ),
  };
}

function assertNoKeys(value, bannedKeys, location = 'root') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoKeys(item, bannedKeys, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, child] of Object.entries(value)) {
    assert(!bannedKeys.has(key), `${location}: forbidden public campaign field "${key}"`);
    assertNoKeys(child, bannedKeys, `${location}.${key}`);
  }
}

for (const [pathname, file] of canonicalRoutes) {
  assert(fs.existsSync(path.resolve(file)), `${pathname}: missing generated route file`);
  const html = read(file);
  const graph = jsonLdGraph(html);
  const person = findType(graph, 'Person', personId);
  const webPage = findType(graph, 'WebPage', `${absolutePath(pathname)}#webpage`);
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  const description = metaContent(html, 'description') ?? '';
  const robots = metaContent(html, 'robots');
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  const fallbackCount = [...html.matchAll(/id="seo-static-summary"/g)].length;

  assert(canonical.length === 1 && canonical[0] === absolutePath(pathname), `${pathname}: canonical mismatch`);
  assert(title.replaceAll('&amp;', '&').length <= 62, `${pathname}: title too long (${title.length})`);
  assert(description.length >= 145 && description.length <= 180, `${pathname}: description outside 145-180 chars (${description.length})`);
  assert(robots === 'index,follow', `${pathname}: canonical route must be index,follow`);
  assert(h1Count === 1, `${pathname}: expected one static H1, found ${h1Count}`);
  assert(fallbackCount === 1, `${pathname}: expected one no-JS fallback`);
  assert(html.includes('<div id="root"></div>'), `${pathname}: missing React root`);
  assert(person, `${pathname}: missing canonical Person schema at ${personId}`);
  assert(!graph.some((item) => item?.['@id'] === `${siteUrl}/#person`), `${pathname}: retired Person ID present`);
  assert(person.mainEntityOfPage === `${siteUrl}/ai-information`, `${pathname}: Person source page mismatch`);
  assert(webPage, `${pathname}: missing canonical WebPage schema`);
}

const generatedRouteFiles = canonicalRoutes.map(([, file]) => file);
for (const file of generatedRouteFiles) {
  assertAbsent(file, [
    'provider-discovery-plan',
    '12 submitted priority urls',
    'preferred_anchor',
    'pitch_angle',
    'quant_engine',
    'collateral_ratio',
    'secular_growth',
  ]);
}

{
  const source = read('src/main.tsx');
  const generator = read('scripts/generate-static-routes.ts');
  assert(source.includes("document.getElementById('seo-static-summary')?.remove();"), 'main.tsx: missing synchronous fallback removal');
  assert(!generator.includes(".js #seo-static-summary"), 'static generator: retired CSS-only removal remains');
  assert(!generator.includes("classList.add('js')"), 'static generator: CSP-blocked inline cleanup remains');
}

assertVisibleText('dist/ai-information/index.html', [
  'Canonical person ID:',
  personId,
  'Canonical Facts',
  'Historical source context',
  'Crawler Facts',
  'Evidence Boundaries',
]);
assert(read('dist/ai-information/index.html').includes('id="sulayman-bowles"'), 'ai-information: canonical Person fragment target missing');

assertVisibleText('dist/resume/index.html', [
  'This page highlights selected experience',
  'full one-page resume',
  'Download Full PDF Resume',
]);
assertVisibleText('dist/atlas/index.html', [
  'Public diagrams, scale figures, terminal output, and sample rows on this site are illustrative',
]);
assertVisibleText('dist/atlas/sample-crawl/index.html', [
  'sanitized/demo data',
  'six-row',
  'synthetic',
]);
assertVisibleText('dist/austin-technical-seo/index.html', [
  'bounded technical-access pilot',
  'measurement gaps',
  'Download the Austin technical-access pilot',
]);
assertVisibleText('dist/case-studies/technical-seo-audit/index.html', [
  'Technical SEO Audit Method Walkthrough',
  'illustrative sample artifacts',
  'does not present a completed client result',
]);
assertVisibleText('dist/markets/index.html', [
  'Appian Operating Durability Diligence Framework',
  'source-backed educational diligence framework',
]);
assertVisibleText('dist/research/index.html', [
  'Who Owns the Toll Roads in Texas?',
  'Beyond the Leaderboard: ViralBench + Codex',
  'Technical SEO Audit Method Walkthrough',
  'Claim boundary:',
]);

{
  const file = 'dist/viralbench-codex-agent-harness/index.html';
  const graph = jsonLdGraph(read(file));
  const article = findType(graph, 'BlogPosting');
  const faq = findType(graph, 'FAQPage');
  assert(article?.datePublished === '2026-07-09', 'ViralBench: publication date mismatch');
  assert(article?.citation?.includes('https://github.com/JibranK12345/Viral-Bench'), 'ViralBench: repository citation missing');
  assert(faq?.mainEntity?.length >= 4, 'ViralBench: FAQ schema incomplete');
  assertVisibleText(file, [
    'Beyond the Leaderboard: Building a Codex-Powered Improvement Harness on ViralBench',
    'The evidence layer comes before the Codex layer',
    'Frequently asked questions',
    '5f5f57e251023ceb37961c0fc2c808f67ceb71eb',
  ]);
}

{
  const file = 'dist/markets/who-owns-texas-toll-roads/index.html';
  const html = read(file);
  assertVisibleText(file, [
    'Who Owns the Toll Roads in Texas? Ownership, Operators, and Economics',
    'Texas toll roads do not have one owner',
    'A road can have seven different owners',
    'What remains unknown',
    'Frequently asked questions',
    'Source ledger',
  ]);
  assert((html.match(/id="source-s\d+"/g) ?? []).length === 25, 'Texas article: expected 25 source entries');
  assert((html.match(/<table>/g) ?? []).length >= 4, 'Texas article: expected four evidence tables');
}

{
  const graph = jsonLdGraph(read('dist/research/index.html'));
  const list = findItemList(graph, `${siteUrl}/research#asset-list`);
  assert(list?.itemListElement?.length === 10, 'research: expected 10 public research assets');
}

{
  const authority = JSON.parse(read('public/research/authority-assets.json'));
  assert(authority.schema_version === '2.0', 'authority index: schema version mismatch');
  assert(authority.reviewed_at === '2026-07-12', 'authority index: review date mismatch');
  assert(authority.canonical_host === siteUrl, 'authority index: canonical host mismatch');
  assert(authority.assets?.length === 10, 'authority index: expected 10 assets');
  assertNoKeys(authority, new Set(['priority', 'preferred_anchor', 'pitch_angle', 'audiences', 'outreach']));
  for (const asset of authority.assets) {
    assert(asset.name && asset.url && asset.type && asset.description, 'authority index: incomplete asset');
    assert(Array.isArray(asset.topics) && asset.topics.length > 0, `${asset.name}: topics missing`);
    assert(asset.claim_boundary, `${asset.name}: claim boundary missing`);
    assert(Array.isArray(asset.supporting_assets), `${asset.name}: supporting assets missing`);
  }
}

{
  const atlas = parseCsv(read('public/research/atlas-sanitized-crawl-sample.csv'));
  assert(atlas.rows.length === 6, 'Atlas sample: expected six rows');
  assert(atlas.rows.every((row) => row.artifact_state === 'illustrative_demo'), 'Atlas sample: row not marked illustrative');
  assert(atlas.rows.every((row) => row.source_scope === 'synthetic_example.com'), 'Atlas sample: row not marked synthetic');
}

{
  const austin = parseCsv(read('public/research/austin-crawlability-benchmark-pilot.csv'));
  const eligible = austin.rows.filter((row) => row.included_in_homepage_content_aggregate === 'true');
  const gaps = austin.rows.filter((row) => row.homepage_content_evidence_state.includes('measurement_gap'));
  assert(austin.rows.length === 12, 'Austin pilot: expected 12 rows');
  assert(eligible.length === 6, 'Austin pilot: expected six content-eligible rows');
  assert(gaps.length === 6, 'Austin pilot: expected six homepage access gaps');
  assert(austin.headers.includes('homepage_request_result'), 'Austin pilot: request result column missing');
  assert(austin.headers.includes('homepage_response_2xx_or_3xx'), 'Austin pilot: response state column missing');
  assert(austin.headers.includes('successful_check_total'), 'Austin pilot: fixed denominator missing');
}

{
  const appian = parseCsv(read('public/research/appian-assumptions-table.csv'));
  assert(appian.rows.length === 8, 'Appian diligence table: expected eight rows');
  assert(appian.headers.includes('Observed fact'), 'Appian diligence table: observed fact column missing');
  assert(appian.headers.includes('Primary source'), 'Appian diligence table: primary source column missing');
}

for (const file of [
  'public/Sulayman_Bowles_Resume.pdf',
  'public/research/appian-enterprise-software-durability-memo.pdf',
]) {
  const bytes = fs.readFileSync(path.resolve(file));
  assert(bytes.subarray(0, 4).toString('utf8') === '%PDF', `${file}: invalid PDF signature`);
  assert(bytes.length > 20_000, `${file}: PDF unexpectedly small`);
}

{
  const llms = read('public/llms.txt');
  assert(llms.includes('Canonical person ID: ' + personId), 'llms.txt: canonical Person ID mismatch');
  assert(llms.includes('markets/who-owns-texas-toll-roads'), 'llms.txt: Texas article missing');
  assert(llms.includes('viralbench-codex-agent-harness'), 'llms.txt: ViralBench article missing');
  assert(!llms.toLowerCase().includes('provider discovery plan'), 'llms.txt: provider campaign residue remains');
  assert(!llms.toLowerCase().includes('12 submitted priority urls'), 'llms.txt: stale submission count remains');
}

{
  const expectedUrls = canonicalRoutes.map(([pathname]) => absolutePath(pathname));
  for (const file of ['dist/sitemap.xml', 'public/sitemap.xml']) {
    const sitemap = read(file);
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert(urls.length === 21, `${file}: expected 21 canonical URLs, found ${urls.length}`);
    assert(JSON.stringify(urls) === JSON.stringify(expectedUrls), `${file}: canonical route inventory/order mismatch`);
    assert(!sitemap.includes('#'), `${file}: fragment URL present`);
  }

  const distSitemap = read('dist/sitemap.xml');
  const publicSitemap = read('public/sitemap.xml');
  assert(distSitemap === publicSitemap, 'public and generated sitemaps differ');
  assert(distSitemap.includes(`<loc>${siteUrl}/viralbench-codex-agent-harness</loc>\n    <lastmod>2026-07-09</lastmod>`), 'sitemap: ViralBench lastmod mismatch');
  assert(distSitemap.includes(`<loc>${siteUrl}/markets/who-owns-texas-toll-roads</loc>\n    <lastmod>2026-07-11</lastmod>`), 'sitemap: Texas article lastmod mismatch');

  for (const pathname of archivedMarketPaths) {
    assert(!distSitemap.includes(`<loc>${absolutePath(pathname)}</loc>`), `${pathname}: archived route leaked into sitemap`);
    const html = read('dist' + pathname + '/index.html');
    assert(metaContent(html, 'robots') === 'noindex,nofollow', `${pathname}: archived route must be noindex,nofollow`);
  }
}

console.log('Content corpus verification passed: 21 canonical routes, one static H1 each, current schema/assets, and bounded evidence states.');
