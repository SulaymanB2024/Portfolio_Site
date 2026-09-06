// Usage: node scripts/verify-seo-portfolio.mjs <portfolio-dist> <void-dist> <delta-build>
// Verify the three exact build artifacts together before releasing source redirects.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2).map((root) => path.resolve(root));
assert.equal(roots.length, 3, 'Supply the Portfolio, VOID, and Delta build directories in that order.');
const manifests = ['research/seo-portfolio-routes-v1.json', 'seo-portfolio-routes.json', 'seo-portfolio-routes.json'];
const normalizeDomain = (domain) => domain === 'void-agency.com' ? 'www.void-agency.com' : domain;
const admitted = new Set(['protect', 'refresh', 'observe']);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const inventories = roots.map((root, i) => {
  const manifest = readJson(path.join(root, manifests[i]));
  const rows = Array.isArray(manifest) ? manifest : manifest.routes;
  return { root, rows, config: readJson(path.join(root, '..', 'vercel.json')) };
});
const retained = new Map();
const owners = new Map();
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map((m) => [m[1], m[2]]));
let redirectCount = 0;

for (const { root, rows } of inventories) {
  for (const row of rows) {
    assert.equal(row.schemaVersion, 'SeoPortfolioRouteV1');
    if (!admitted.has(row.lifecycle)) continue;
    const origin = `https://${normalizeDomain(row.domain)}`;
    const canonical = new URL(row.path, origin).href;
    assert.equal(row.canonical, canonical, `${row.path}: self-canonical mismatch`);
    assert.equal(normalizeDomain(row.ownerDomain), normalizeDomain(row.domain), `${canonical}: indexable non-owner`);
    assert.equal(row.redirectTarget, null, `${canonical}: indexable redirect`);
    assert(!retained.has(canonical), `${canonical}: duplicate URL`);
    assert(!owners.has(row.intentCluster), `${row.intentCluster}: multiple declared indexable owners`);
    owners.set(row.intentCluster, canonical);
    const html = fs.readFileSync(path.join(root, row.path, 'index.html'), 'utf8');
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attrs(m[0]));
    assert.deepEqual(links.filter((link) => link.rel === 'canonical').map((link) => link.href), [canonical], `${canonical}: delivered canonical mismatch`);
    const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => attrs(m[0]));
    assert(!meta.some((item) => item.name === 'robots' && /noindex/.test(item.content)), `${canonical}: noindex in retained HTML`);
    assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `${canonical}: requires one H1`);
    for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) JSON.parse(script[1]);
    retained.set(canonical, row);
  }
}

function matches(rule, pathname) {
  if (rule.has) return false;
  if (rule.src) return new RegExp(`^(?:${rule.src})$`).test(pathname);
  if (rule.source === pathname) return true;
  return rule.source?.endsWith('/:path*') && pathname.startsWith(`${rule.source.slice(0, -7)}/`);
}

for (const { root, rows, config } of inventories) {
  const rules = config.routes || config.redirects || [];
  for (const row of rows.filter((item) => item.redirectTarget)) {
    const target = new URL(row.redirectTarget, `https://${normalizeDomain(row.domain)}`).href;
    assert(retained.has(target), `${row.path}: destination is absent, redirected, or noindex: ${target}`);
    assert.equal(normalizeDomain(row.ownerDomain), normalizeDomain(retained.get(target).domain), `${row.path}: destination owner mismatch`);
    assert.equal(row.canonical, target, `${row.path}: migration canonical mismatch`);
    const rule = rules.find((candidate) => matches(candidate, row.path) && (candidate.headers?.Location || candidate.destination));
    assert(rule, `${row.path}: server redirect absent`);
    assert(rule.permanent === true || [301, 308].includes(rule.status), `${row.path}: redirect is not permanent`);
    assert.equal(new URL(rule.destination || rule.headers.Location, `https://${normalizeDomain(row.domain)}`).href, target, `${row.path}: server destination drift`);
    assert(!fs.existsSync(path.join(root, row.path, 'index.html')), `${row.path}: duplicate redirect-source HTML remains`);
    redirectCount += 1;
  }
  const sitemapFiles = fs.readdirSync(root).filter((file) => /^sitemap.*\.xml$/.test(file)).map((file) => path.join(root, file));
  const childDir = path.join(root, 'sitemaps');
  if (fs.existsSync(childDir)) sitemapFiles.push(...fs.readdirSync(childDir).filter((file) => file.endsWith('.xml')).map((file) => path.join(childDir, file)));
  const sitemapUrls = new Set();
  for (const file of sitemapFiles) {
    const xml = fs.readFileSync(file, 'utf8');
    if (xml.includes('<sitemapindex')) continue;
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      assert(retained.has(match[1]), `${file}: noncanonical, redirected, or noindex sitemap URL: ${match[1]}`);
      sitemapUrls.add(match[1]);
    }
  }
  for (const row of rows.filter((item) => admitted.has(item.lifecycle))) assert(sitemapUrls.has(row.canonical), `${row.canonical}: omitted from sitemap`);
}
console.log(JSON.stringify({ ok: true, declaredRoutes: inventories.reduce((n, item) => n + item.rows.length, 0), indexableRoutes: retained.size, permanentRedirects: redirectCount, declaredIntentOwners: owners.size }, null, 2));
