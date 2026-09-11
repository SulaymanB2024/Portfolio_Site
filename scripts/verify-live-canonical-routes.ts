import fs from 'node:fs/promises';
import { getCanonicalRoutes } from '../src/seo/routes';
import { buildRobotsText } from '../src/seo/machineReadableAuthority';
import { buildSitemapXml } from '../src/seo/generatedPublicFiles';
import { checkLivePage } from './lib/live-indexability';

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base-url');
const baseUrl = (baseIndex >= 0 ? args[baseIndex + 1] : process.env.BASE_URL ?? 'https://sulayman-bowles.dev')?.replace(/\/+$/, '');
if (!baseUrl || !/^https?:\/\//.test(baseUrl)) throw new Error('Usage: npm run verify:pseo-live -- --base-url https://host.example');
const parsedBase = new URL(baseUrl);
if (parsedBase.pathname !== '/' || parsedBase.search || parsedBase.hash || parsedBase.username || parsedBase.password) throw new Error('Supply an origin, not a path or credentials.');
const routes = getCanonicalRoutes();
const results: Array<{ path: string; status?: number; errors: string[] }> = [];
const failures: string[] = [];

async function request(path: string) {
  const response = await fetch(baseUrl + path, {
    redirect: 'manual', signal: AbortSignal.timeout(20_000),
    headers: { 'cache-control': 'no-cache', 'user-agent': 'SulaymanBowlesIndexabilityVerifier/2.0' },
  });
  // Bounded streaming read; do not buffer an unexpectedly large response before checking it.
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  const reader = response.body?.getReader();
  if (reader) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 4 * 1024 * 1024) {
          await reader.cancel();
          throw new Error('Response exceeds the 4 MiB document limit');
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  return { response, body: Buffer.concat(chunks).toString('utf8') };
}
for (let index = 0; index < routes.length; index += 4) {
  await Promise.all(routes.slice(index, index + 4).map(async (route) => {
    try {
      const { response, body } = await request(route.path);
      const errors = checkLivePage({ status: response.status, contentType: response.headers.get('content-type') ?? '', robotsHeader: response.headers.get('x-robots-tag') ?? '', html: body }, route);
      results.push({ path: route.path, status: response.status, errors });
    } catch (error) { results.push({ path: route.path, errors: [String(error)] }); }
  }));
}
for (const [path, expected] of [['/sitemap.xml', buildSitemapXml()], ['/robots.txt', buildRobotsText()]]) {
  try {
    const { response, body } = await request(path);
    if (response.status !== 200) failures.push(`${path}: expected direct 200; received ${response.status}`);
    if (body.replaceAll('\r\n', '\n').trim() !== expected.trim()) failures.push(`${path}: differs from the reviewed source (stale deployment or changed discovery policy)`);
  } catch (error) { failures.push(`${path}: ${String(error)}`); }
}
for (const record of results) for (const error of record.errors) failures.push(`${record.path}: ${error}`);
const report = {
  checkedAt: new Date().toISOString(), expectedCommit: process.env.GITHUB_SHA ?? null,
  baseUrl, scope: 'Live HTTP/indexability configuration only; NOT Google index status.',
  canonicalUrls: routes.length, failures, pages: results.sort((a, b) => a.path.localeCompare(b.path)),
};
await fs.mkdir('audit-artifact', { recursive: true });
await fs.writeFile('audit-artifact/live-indexability.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checkedAt: report.checkedAt, baseUrl, canonicalUrls: routes.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
