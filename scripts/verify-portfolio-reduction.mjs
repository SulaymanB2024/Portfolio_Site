import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const textFromHtml = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const nav = read('src/content/siteNavigation.ts');
for (const retired of ['/simple', '/ai-information', '/austin-technical-seo', '/case-studies/technical-seo-audit']) {
  assert(!nav.includes(`href: '${retired}'`), `navigation retains ${retired}`);
}

const method = read('dist/method/index.html');
assert(method.includes('id="worked-finding"'), 'method: worked finding anchor missing');
assert(method.includes('href="/method#worked-finding"') || method.includes('href="#worked-finding"'), 'method: worked finding link missing');

const routes = read('src/seo/routes.ts');
for (const retired of ["path: '/simple'", "path: '/ai-information'", "path: '/austin-technical-seo'", "path: '/case-studies/technical-seo-audit'"]) {
  assert(!routes.includes(retired), `route registry retains ${retired}`);
}

for (const missing of ['dist/simple/index.html', 'dist/ai-information/index.html', 'dist/austin-technical-seo/index.html', 'dist/case-studies/technical-seo-audit/index.html']) {
  assert(!fs.existsSync(path.resolve(missing)), `static generation retained retired route ${missing}`);
}

const voidRelationship = read('dist/void-agency/index.html');
for (const expected of ['How Sulayman Bowles Builds and Runs Void Agency', 'Role and Contributions', 'Verified Operating Record', 'Evidence Boundaries']) {
  assert(textFromHtml(voidRelationship).includes(expected), `void relationship: missing ${expected}`);
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
