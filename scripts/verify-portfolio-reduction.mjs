import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const textFromHtml = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const nav = read('src/content/siteNavigation.ts');
for (const retired of ['/simple', '/ai-information', '/case-studies/technical-seo-audit', '/void-agency']) {
  assert(!nav.includes(`href: '${retired}'`), `navigation retains ${retired}`);
}

const vercelRoutes = JSON.parse(read('vercel.json')).routes;
for (const [source, destination] of [
  ['/method', 'https://www.void-agency.com/tools/technical-seo-audit-checklist'],
  ['/austin-technical-seo', 'https://www.void-agency.com/services/technical-seo-ai-search-visibility'],
]) {
  assert(!fs.existsSync(path.resolve(`dist${source}/index.html`)), `${source}: migrated page must not emit duplicate HTML`);
  assert(vercelRoutes.some((route) => !route.has && route.src === source && route.status === 308 && route.headers?.Location === destination), `${source}: exact permanent destination is missing`);
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
