import fs from 'node:fs';
import path from 'node:path';

function read(relativePath) {
  return fs.readFileSync(path.resolve(relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function textFromHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function jsonLdGraph(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(match, 'Missing JSON-LD script');
  const parsed = JSON.parse(match[1]);
  return parsed['@graph'] ?? [parsed];
}

const homeHtml = read('dist/index.html');
const workHtml = read('dist/work/index.html');
const researchHtml = read('dist/research/index.html');
const marketsHtml = read('dist/markets/index.html');
const atlasHtml = read('dist/atlas/index.html');
const austinHtml = read('dist/austin-technical-seo/index.html');
const aiHtml = read('dist/ai-information/index.html');
const notFoundHtml = read('dist/404.html');
const navSource = read('src/content/siteNavigation.ts');
const transitionSource = read('src/hooks/usePageTransitions.ts');
const headerSource = read('src/components/InternalHeader.tsx');
const contactSource = read('src/components/AuditIntakeForm.tsx');
const appSource = read('src/App.tsx');
const mainSource = read('src/main.tsx');
const profileSource = read('src/content/profileFacts.ts');
const llmsText = read('public/llms.txt');
const indexCss = read('src/index.css');
const vercelConfig = JSON.parse(read('vercel.json'));

const primaryBlock = navSource.match(/export const primaryNav[\s\S]*?\n\];/)?.[0] ?? '';
const primaryLabels = [...primaryBlock.matchAll(/label: '([^']+)'/g)].map((match) => match[1]);
assert(JSON.stringify(primaryLabels) === JSON.stringify(['Work', 'Atlas', 'Research', 'About', 'Resume', 'Contact']), 'Primary navigation must remain the six-route decision path');
for (const utility of ['Method', 'Austin SEO', 'Void Agency', 'Text Edition', 'AI Information', 'HTML Sitemap', 'Tech Ledger']) {
  assert(navSource.includes(`label: '${utility}'`), `Utility navigation missing ${utility}`);
}

assert(!transitionSource.includes('800'), 'Navigation transition source still contains the old fixed 800ms delay');
assert(transitionSource.includes('prefers-reduced-motion: reduce'), 'Reduced-motion navigation check is missing');
assert(transitionSource.includes('flushSync'), 'View Transition route commit is not synchronous');

for (const focusContract of ['querySelectorAll<HTMLElement>', "event.key === 'Escape'", "event.key !== 'Tab'", 'last.focus()', 'first.focus()', 'mobileMenuButtonRef.current.focus']) {
  assert(headerSource.includes(focusContract), `Mobile menu focus contract missing: ${focusContract}`);
}

assert(homeHtml.includes('.app-mounted #seo-static-summary'), 'Static fallback is not hidden by the post-commit mount marker');
assert(!homeHtml.includes('.js #seo-static-summary'), 'Static fallback is hidden before React commits');
assert(homeHtml.includes('id="seo-static-summary"'), 'Homepage static fallback is missing');
assert(mainSource.includes("document.getElementById('seo-static-summary')?.remove()"), 'Mounted app does not remove the static fallback before rendering');
assert(!appSource.includes('<span>Building Evidence</span>'), 'Preloader label is exposed as machine-readable page content');
assert(appSource.includes('aria-hidden="true"'), 'Preloader is not hidden from the accessibility tree');
assert(indexCss.includes('.visual-label::before'), 'Visual-only preloader labels are missing their CSS renderer');

assert(fs.existsSync(path.resolve('dist/404.html')), 'Generated 404.html is missing');
assert(notFoundHtml.includes('name="robots" content="noindex,nofollow"'), '404 artifact must be noindex,nofollow');
assert(textFromHtml(notFoundHtml).includes('Page Not Found'), '404 artifact needs a clear page identity');
assert(appSource.includes('<NotFoundPage'), 'Unknown client routes do not render the dedicated NotFound page');
assert(vercelConfig.routes?.some((route) => route.handle === 'filesystem'), 'Vercel custom 404 routing must check generated files first');
assert(vercelConfig.routes?.some((route) => route.src === '/(.*)' && route.status === 404 && route.dest === '/404'), 'Vercel custom 404 routing must preserve HTTP 404 status and target the generated clean URL');
const filesystemRouteIndex = vercelConfig.routes.findIndex((route) => route.handle === 'filesystem');
const notFoundRouteIndex = vercelConfig.routes.findIndex((route) => route.status === 404 && route.dest === '/404');
const securityRouteIndex = vercelConfig.routes.findIndex((route) => route.continue === true && route.headers?.['Content-Security-Policy']);
const legacyAliasIndex = vercelConfig.routes.findIndex((route) => route.src === '/projects/atlas' && route.headers?.Location === '/atlas');
assert(legacyAliasIndex >= 0 && legacyAliasIndex < filesystemRouteIndex, 'Legacy aliases must run before filesystem and 404 handling');
assert(securityRouteIndex >= 0 && securityRouteIndex < filesystemRouteIndex, 'Security headers must run before filesystem and 404 handling');
assert(filesystemRouteIndex >= 0 && filesystemRouteIndex < notFoundRouteIndex, 'Vercel filesystem handling must precede the branded 404 catch-all');

for (const artifact of ['Atlas SEO Audit Console', 'Who Owns the Toll Roads in Texas?', 'ViralBench + Codex Improvement Harness', 'Austin Crawlability Pilot', 'Void Agency', 'Sulayman Bowles Technical Ledger']) {
  assert(textFromHtml(workHtml).includes(artifact), `Work page missing artifact: ${artifact}`);
}
assert(homeHtml.includes('href="/markets/who-owns-texas-toll-roads"'), 'Texas toll-road article must be linked from Home');
assert(workHtml.includes('href="/markets/who-owns-texas-toll-roads"'), 'Texas toll-road article must be linked from Work');

for (const researchCategory of ['Search systems', 'Technical SEO', 'Markets and investing', 'Product and data']) {
  assert(textFromHtml(researchHtml).includes(researchCategory), `Research hub missing category: ${researchCategory}`);
}
for (const nonFinanceTitle of ['Crawler Policy Comes Before Visibility', 'Technical SEO as Public Data Infrastructure', 'Canonical Identity for Personal SEO']) {
  assert(!textFromHtml(marketsHtml).includes(nonFinanceTitle), `Markets filter duplicates non-finance research: ${nonFinanceTitle}`);
}
assert(textFromHtml(marketsHtml).includes('Who Owns the Toll Roads in Texas?'), 'Markets filter is missing the current infrastructure-investing article');

for (const articlePath of [
  'dist/markets/ai-search-crawler-policy/index.html',
  'dist/markets/technical-seo-public-data-infrastructure/index.html',
  'dist/markets/canonical-identity-personal-seo/index.html',
]) {
  const body = textFromHtml(read(articlePath)).toLowerCase();
  assert(!body.includes('not investment advice'), `${articlePath} exposes an investment disclaimer on non-finance research`);
  assert(!body.includes('recommendation boundary'), `${articlePath} exposes investment-only recommendation framing`);
}

const homePerson = jsonLdGraph(homeHtml).find((item) => item['@type'] === 'Person');
assert(homePerson, 'Canonical Person schema missing from Home');
assert(homePerson.logo === undefined, 'Person schema must not use an Organization-style logo');
assert(homePerson.image === undefined, 'Person schema must not reuse an Organization logo as image');

const socialCards = new Map([
  ['dist/index.html', '/images/social/og-profile.png'],
  ['dist/work/index.html', '/images/social/og-work.png'],
  ['dist/atlas/index.html', '/images/social/og-atlas.png'],
  ['dist/void-agency/index.html', '/images/social/og-void.png'],
  ['dist/research/index.html', '/images/social/og-research.png'],
  ['dist/markets/who-owns-texas-toll-roads/index.html', '/images/social/og-toll-roads.png'],
]);
for (const [file, image] of socialCards) {
  assert(read(file).includes(`property="og:image" content="https://sulayman-bowles.dev${image}"`), `${file} is missing its route-specific social image`);
  const localImage = path.resolve(`public${image}`);
  assert(fs.existsSync(localImage) && fs.statSync(localImage).size > 10000, `${image} is missing or empty`);
}

for (const status of ['Shipped', 'Shipped / partial', 'Prototype', 'In development']) {
  assert(textFromHtml(atlasHtml).includes(status), `Atlas capability matrix missing status: ${status}`);
}

for (const austinRequirement of ['Based in Austin', 'fixed-scope reviews', 'June 25, 2026', 'Illustrative report layout', 'Open Austin benchmark pilot CSV']) {
  assert(textFromHtml(austinHtml).includes(austinRequirement), `Austin page missing: ${austinRequirement}`);
}
assert(austinHtml.includes('/images/austin-audit-report-example.png'), 'Austin example report image is missing');

for (const visibleField of ['contact-name', 'contact-email', 'contact-website-url', 'contact-message']) {
  assert(contactSource.includes(`id="${visibleField}"`), `Contact form missing visible field ${visibleField}`);
}
assert(contactSource.includes('<details'), 'Optional contact scope must remain collapsed in details');

assert(profileSource.includes("lastReviewed: '2026-07-12'"), 'Typed profile facts need a current review date');
assert(profileSource.includes("nextRoleReview: '2026-08-31'"), 'Chegg/current-role tense review must remain scheduled for August 2026');
assert(Date.now() <= Date.parse('2026-08-31T23:59:59Z'), 'The August 2026 current-role tense review is due; update the résumé and advance nextRoleReview');
for (const proofDate of ['2026-05-31', '2026-07-11', '2026-07-12']) {
  assert(profileSource.includes(`asOf: '${proofDate}'`), `Typed profile facts missing proof date ${proofDate}`);
}

assert(llmsText.split('\n').length <= 75, 'llms.txt has expanded beyond the concise reference budget');
assert(!llmsText.includes('Provider Discovery Plan'), 'llms.txt exposes internal provider-discovery planning');
assert(!textFromHtml(aiHtml).includes('Provider Discovery Plan'), 'AI information page exposes provider-discovery planning');

assert(indexCss.includes('var(--color-ink) 56%'), 'Light-page small-text contrast floor is missing');
assert(indexCss.includes('var(--color-canvas) 58%'), 'Dark-page small-text contrast floor is missing');

console.log('Portfolio reduction acceptance checks passed.');
