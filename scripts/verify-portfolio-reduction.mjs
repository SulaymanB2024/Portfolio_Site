import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const textFromHtml = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const nav = read('src/content/siteNavigation.ts');
for (const retired of ['/simple', '/ai-information', '/case-studies/technical-seo-audit', '/void-agency']) {
  assert(!nav.includes(`href: '${retired}'`), `navigation retains ${retired}`);
}

const method = read('dist/method/index.html');
assert(method.includes('id="worked-finding"'), 'method: worked finding anchor missing');
assert(method.includes('href="/method#worked-finding"') || method.includes('href="#worked-finding"'), 'method: worked finding link missing');

const austin = read('dist/austin-technical-seo/index.html');
for (const required of ['Austin Crawlability Pilot Snapshot', 'Query Examples Before Page Expansion', 'Request an Austin technical SEO audit']) {
  assert(textFromHtml(austin).includes(required), `austin: missing ${required}`);
}
for (const stale of ['Common Austin site problems.', 'Sample audit output.', 'Use this format for your site audit.']) {
  assert(!textFromHtml(austin).includes(stale), `austin: redundant section remains ${stale}`);
}

const routes = read('src/seo/routes.ts');
for (const retired of ["path: '/simple'", "path: '/ai-information'", "path: '/void-agency'", "path: '/case-studies/technical-seo-audit'"]) {
  assert(!routes.includes(retired), `route registry retains ${retired}`);
}

for (const missing of ['dist/simple/index.html', 'dist/ai-information/index.html', 'dist/void-agency/index.html', 'dist/case-studies/technical-seo-audit/index.html']) {
  assert(!fs.existsSync(path.resolve(missing)), `static generation retained retired route ${missing}`);
}

for (const missing of [
  'dist/markets/network-monopolies/index.html',
  'dist/markets/computational-commodity-systems/index.html',
  'dist/markets/fiat-horizon/index.html',
]) {
  assert(!fs.existsSync(path.resolve(missing)), `static generation retained retired archive route ${missing}`);
}

assert(
  fs.existsSync(path.resolve('dist/markets/archived-research-methodology/index.html')),
  'static generation omitted consolidated archive methodology',
);

console.log('Portfolio route-reduction verification passed.');
