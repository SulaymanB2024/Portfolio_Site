import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getArticleByPath } from '../src/content/articleRegistry';
import { PUBLICATION_INDEX } from '../src/content/publicationIndex';

const routes = [
  '/markets/who-owns-us-toll-roads',
  '/research/financial-systems/why-texas-toll-roads-stay-tolled',
  '/research/financial-systems/us-solid-rocket-motor-capacity-audit',
  '/markets/when-does-a-data-center-become-infrastructure',
  '/research/app-economics/independent-app-income-distribution',
  '/research/financial-systems/ethereum-blobspace-measurement-audit',
  '/research/financial-systems/uni-burn-supply-accounting',
];
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const assets = new Set<string>();
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0'));
const receipts: object[] = [];

for (const route of routes) {
  const article = getArticleByPath(route);
  assert(article && article.indexable !== false, `${route}: missing indexable article`);
  assert(PUBLICATION_INDEX.some((item) => item.href === route), `${route}: absent from publication archive`);
  const html = fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
  const canonical = `https://sulayman-bowles.dev${route}`;
  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${route}: incorrect canonical`);
  assert(html.includes('<meta name="robots" content="index,follow"'), `${route}: not indexable`);
  assert(sitemap.includes(`<loc>${canonical}</loc>`), `${route}: absent from sitemap`);
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';
  const words = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  assert(words > 1200, `${route}: full static article missing (${words} words)`);
  const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: duplicate static IDs`);
  const anchors = [...body.matchAll(/href="#([^"\s]+)"/g)].map((m) => m[1]);
  assert(anchors.every((id) => ids.includes(id)), `${route}: broken static fragment target`);
  const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  assert(structured.some((data) => JSON.stringify(data).includes('"Article"')), `${route}: article schema missing`);
  for (const m of body.matchAll(/(?:href|src)="(\/[^"?#]+\.(?:pdf|docx|xlsx|zip|csv|json|svg|png|md|py))"/g)) assets.add(m[1]);
  for (const resource of article.resources ?? []) if (resource.href.startsWith('/')) assets.add(resource.href);
  receipts.push({ route, staticWords: words, sourceCount: article.sources.length, resources: article.resources?.length ?? 0 });
}

for (const asset of assets) {
  const file = path.join('public', asset);
  assert(tracked.has(file), `${asset}: resource exists locally but is absent from Git`);
  const data = fs.readFileSync(file);
  assert(data.length > 30, `${asset}: empty or truncated resource`);
  assert(fs.readFileSync(path.join('dist', asset)).equals(data), `${asset}: build differs from public source`);
  if (asset.endsWith('.pdf')) assert(data.subarray(0, 5).toString() === '%PDF-', `${asset}: invalid PDF signature`);
  if (/\.(docx|xlsx|zip)$/.test(asset)) assert(data.subarray(0, 2).toString() === 'PK', `${asset}: invalid ZIP container`);
  if (asset.endsWith('.png')) assert(data.subarray(1, 4).toString() === 'PNG', `${asset}: invalid PNG signature`);
  if (asset.endsWith('.svg')) assert(/<svg\b/.test(data.toString()), `${asset}: invalid SVG`);
  if (asset.endsWith('.json')) JSON.parse(data.toString());
}

const eth = JSON.parse(fs.readFileSync('public/research/ethereum-blobspace-calculations.json', 'utf8'));
assert.equal(eth.target_opportunities, 39839110);
assert.equal(eth.maximum_opportunities, 64292937);
assert.equal(eth.inputs.last_synced_slot_inclusive, 14794852);
assert.equal(eth.repeated_blobs, 326166);
assert(Math.abs(eth.daily_scenarios[0].target_fraction - 30000 / 100800) < 1e-12);
const uni = JSON.parse(fs.readFileSync('public/research/uni-burn-calculations.json', 'utf8'));
assert.equal(uni.dead_address_adjusted_quantity, 891974776);
assert.equal(uni.recurring_and_other_residual, 8025224);
assert.equal(Math.round(uni.annualized_low), 13260087);
assert.equal(Math.round(uni.annualized_high), 15930222);
assert.equal(uni.new_mint_assumption, 0);
for (const route of routes.slice(-2)) {
  const html = fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
  assert(html.includes('not preserved'), `${route}: historical input limitation absent`);
  assert(html.includes('2026.09.06'), `${route}: publication date absent`);
}
console.log(JSON.stringify({ status: 'PASS', articles: receipts, verifiedLocalResources: assets.size }, null, 2));
