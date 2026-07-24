import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://sulayman-bowles.dev';
const personId = `${siteUrl}/about#sulayman-bowles`;
const retiredPaths = ['/simple', '/ai-information', '/void-agency', '/case-studies/technical-seo-audit'];
const retiredArchivePaths = [
  '/markets/network-monopolies',
  '/markets/computational-commodity-systems',
  '/markets/fiat-horizon',
];
const routeFiles = [
  ['/', 'dist/index.html'],
  ['/about', 'dist/about/index.html'],
  ['/work', 'dist/work/index.html'],
  ['/resume', 'dist/resume/index.html'],
  ['/atlas', 'dist/atlas/index.html'],
  ['/atlas/sample-crawl', 'dist/atlas/sample-crawl/index.html'],
  ['/research', 'dist/research/index.html'],
  ['/research/ai-systems/the-first-ai-managers', 'dist/research/ai-systems/the-first-ai-managers/index.html'],
  ['/research/financial-systems/how-airlines-borrow-against-loyalty-programs', 'dist/research/financial-systems/how-airlines-borrow-against-loyalty-programs/index.html'],
  ['/research/financial-systems/where-online-returns-actually-go', 'dist/research/financial-systems/where-online-returns-actually-go/index.html'],
  ['/research/financial-systems/hidden-financing-hardware-startups', 'dist/research/financial-systems/hidden-financing-hardware-startups/index.html'],
  ['/research/financial-systems/waymo-hardware-financing', 'dist/research/financial-systems/waymo-hardware-financing/index.html'],
  ['/markets/who-owns-texas-toll-roads', 'dist/markets/who-owns-texas-toll-roads/index.html'],
  ['/method', 'dist/method/index.html'],
  ['/austin-technical-seo', 'dist/austin-technical-seo/index.html'],
  ['/contact', 'dist/contact/index.html'],
];

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const textFromHtml = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const graph = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
  const value = JSON.parse(match[1]);
  return value['@graph'] ?? [value];
});

for (const [pathname, file] of routeFiles) {
  const html = read(file);
  const jsonLd = graph(html);
  const person = jsonLd.find((item) => item['@type'] === 'Person' && item['@id'] === personId);
  assert(person, `${pathname}: missing canonical Person schema`);
  assert(!html.includes('/ai-information#sulayman-bowles'), `${pathname}: stale Person ID`);
  assert(html.includes(`rel="canonical" href="${siteUrl}${pathname === '/' ? '/' : pathname}"`), `${pathname}: canonical link mismatch`);
}

const home = read('dist/index.html');
for (const proof of ['/research/ai-systems/the-first-ai-managers', '/atlas', '/markets/who-owns-texas-toll-roads']) {
  assert(home.includes(`href="${proof}"`), `home: missing proof link ${proof}`);
}
assert(textFromHtml(home).includes('Technical SEO, AI product, systems, and investment research.'), 'home: missing positioning');
assert(home.includes('href="/method">Technical SEO audit services</a>'), 'home: missing technical SEO audit services anchor');
assert(home.includes('href="/austin-technical-seo">Austin technical SEO consultant</a>'), 'home: missing Austin technical SEO consultant anchor');

const resume = read('dist/resume/index.html');
for (const fact of ['Bachelor of Business Administration in Finance', 'Bachelor of Arts in Music', 'Expected May 2028', 'AI Product Manager Intern', 'Confidential B2B manufacturer']) {
  assert(textFromHtml(resume).includes(fact), `resume: missing master-resume fact ${fact}`);
}
for (const stale of ['Expected May 2027', 'Incoming AI Product Manager', 'data labeling', 'annotation']) {
  assert(!textFromHtml(resume).toLowerCase().includes(stale.toLowerCase()), `resume: stale fact ${stale}`);
}
assert(fs.existsSync(path.resolve('public/Sulayman_Bowles_Resume.pdf')), 'public master resume PDF missing');

const about = read('dist/about/index.html');
assert(textFromHtml(about).includes('current second degree'), 'about: music must be current, not historical');

const austin = read('dist/austin-technical-seo/index.html');
for (const expected of ['Austin Technical SEO Consultant', 'Crawlability and indexation audit', 'JavaScript rendering and templates', 'Structured data and AI search readiness']) {
  assert(textFromHtml(austin).includes(expected), `Austin SEO: missing ${expected}`);
}

const atlas = read('dist/atlas/sample-crawl/index.html');
for (const expected of ['Atlas Open-Corpus Demonstration', 'raw-versus-rendered', 'Traceable Findings', 'Confidence', 'Download open-corpus CSV', 'Download capture manifest']) {
  assert(textFromHtml(atlas).includes(expected), `atlas demo: missing ${expected}`);
}
assert(!atlas.includes('example.com'), 'atlas demo: fictional example.com rows remain');
for (const artifact of ['public/research/atlas-open-corpus-run-2026-07-16.csv', 'public/research/atlas-open-corpus-run-2026-07-16.json']) {
  assert(fs.existsSync(path.resolve(artifact)), `atlas demo: missing ${artifact}`);
}
const manifest = JSON.parse(read('public/research/atlas-open-corpus-run-2026-07-16.json'));
assert(manifest.run_id && manifest.capture_method && manifest.claim_limit, 'atlas demo: incomplete capture manifest');

const research = read('dist/research/index.html');
assert(textFromHtml(research).includes('22 Notes and Artifacts'), 'research: publication count is not derived as twenty-two');
assert(textFromHtml(research).includes('The First AI Managers'), 'research: featured article missing');
assert(textFromHtml(research).includes('The Hidden Financing Behind Hardware Startups'), 'research: Waymo financing article missing');
assert(textFromHtml(research).includes('How Airlines Borrow Against Loyalty Programs'), 'research: airline loyalty financing article missing');

const aiManagers = read('dist/research/ai-systems/the-first-ai-managers/index.html');
assert(textFromHtml(aiManagers).includes('Source ledger'), 'AI managers: source ledger missing');
assert([...aiManagers.matchAll(/<li id="source-s\d+">/g)].length === 18, 'AI managers: expected 18 published source entries');
assert(aiManagers.includes('<section id="field-map" aria-labelledby="field-map-title">'), 'AI managers: field map section anchor missing');
assert(aiManagers.includes('href="#field-map"'), 'AI managers: source ledger does not link to the field map');
assert(!textFromHtml(aiManagers).includes('72 source'), 'AI managers: unpublished 72-source claim remains');

const onlineReturns = read('dist/research/financial-systems/where-online-returns-actually-go/index.html');
for (const expected of [
  'Where Do Online Returns Go? Inside Reverse Logistics',
  'Where online returns go after the refund',
  'Online return outcomes across nine products and three prices',
  'Liquidation recovery is not the consumer resale price',
  'Financial recovery does not establish the environmental endpoint',
  'What happens to online returns? Five direct answers',
]) {
  assert(textFromHtml(onlineReturns).includes(expected), `Online returns: missing ${expected}`);
}
for (const href of [
  '/research/where-online-return-actually-goes-report.pdf',
  '/research/where-online-return-actually-goes-report.docx',
  '/research/reverse-logistics-tax-model.xlsx',
  '/images/research/online-returns-retrieval-decision.png',
  '/images/research/online-returns-disposition-decision-tree.png',
  '/images/research/online-returns-headphones-waterfall.png',
  '/images/research/online-returns-furniture-waterfall.png',
  '/images/research/online-returns-auction-recovery.png',
  '/images/research/online-returns-retailer-reseller-waterfall.png',
  '/images/research/online-returns-freight-burden.png',
  '/images/research/online-returns-fraud-loss.png',
  '/images/research/online-returns-environmental-routes.png',
]) {
  assert(onlineReturns.includes(`href="${href}"`) || onlineReturns.includes(`src="${href}"`), `Online returns: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `Online returns: missing public file ${href}`);
}

const airlineLoyalty = read('dist/research/financial-systems/how-airlines-borrow-against-loyalty-programs/index.html');
for (const expected of [
  'How Airlines Borrow Against Loyalty Programs',
  'One airline point starts four financial clocks',
  'Partner cash is not the same thing as loyalty revenue',
  'Airline loyalty-backed debt redirects the cash waterfall',
  'American kept the channel; United repaid it',
  'Airline loyalty program financing questions, answered',
  'Methodology, labels, and evidence limits',
]) {
  assert(textFromHtml(airlineLoyalty).includes(expected), `Airline loyalty financing: missing ${expected}`);
}
for (const href of [
  '/research/airline-loyalty-financing-report.pdf',
  '/research/airline-loyalty-financing-report.docx',
  '/images/research/airline-loyalty-parties-money.png',
  '/images/research/airline-loyalty-cash-conversion-cycle.png',
  '/images/research/airline-loyalty-cash-not-revenue.png',
  '/images/research/airline-loyalty-balance-sheets.png',
  '/images/research/airline-loyalty-point-values.png',
  '/images/research/airline-loyalty-backed-financing.png',
  '/images/research/airline-loyalty-program-value.png',
  '/images/research/airline-loyalty-partner-stress.png',
  '/images/research/airline-loyalty-profit-bridge.png',
]) {
  assert(airlineLoyalty.includes(`href="${href}"`) || airlineLoyalty.includes(`src="${href}"`), `Airline loyalty financing: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `Airline loyalty financing: missing public file ${href}`);
}

const hiddenFinancing = read('dist/research/financial-systems/hidden-financing-hardware-startups/index.html');
for (const expected of [
  'Hardware Startup Financing: Five Capital Stacks',
  'Hardware startup financing has three capital stacks',
  'CoreWeave FY2025 debt principal',
  'Which hardware financing structures actually scale?',
  'Hardware startup financing questions, answered',
  'Evidence hierarchy used throughout the report and model',
]) {
  assert(textFromHtml(hiddenFinancing).includes(expected), `Hidden financing: missing ${expected}`);
}
for (const href of [
  '/research/hidden-financing-report.pdf',
  '/research/hidden-financing-report.docx',
  '/research/hidden-financing-model.xlsx',
  '/research/capital-stack-diagrams.zip',
  '/images/research/hidden-financing-waymo-capital-stack.png',
  '/images/research/hidden-financing-serve-capital-stack.png',
  '/images/research/hidden-financing-coreweave-capital-stack.png',
  '/images/research/hidden-financing-anduril-capital-stack.png',
  '/images/research/hidden-financing-northvolt-capital-stack.png',
]) {
  assert(hiddenFinancing.includes(`href="${href}"`) || hiddenFinancing.includes(`src="${href}"`), `Hidden financing: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `Hidden financing: missing public file ${href}`);
}

const waymo = read('dist/research/financial-systems/waymo-hardware-financing/index.html');
for (const expected of [
  'The Hidden Financing Behind Hardware Startups',
  '$27.1B–$27.35B',
  'Counterfactual fleet-debt coverage',
  'Which structures actually scale',
  'Hardware financing model',
]) {
  assert(textFromHtml(waymo).includes(expected), `Waymo financing: missing ${expected}`);
}
for (const href of [
  '/research/waymo-hardware-financing-report.pdf',
  '/research/waymo-hardware-financing-report.docx',
  '/research/waymo-hardware-financing-model.xlsx',
  '/images/research/waymo-capital-stack.png',
  '/images/research/waymo-downside-waterfall.png',
]) {
  assert(waymo.includes(`href="${href}"`) || waymo.includes(`src="${href}"`), `Waymo financing: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `Waymo financing: missing public file ${href}`);
}

const toll = read('dist/markets/who-owns-texas-toll-roads/index.html');
assert(/<sup class="article-citation"><a href="#source-s1"/.test(toll), 'toll roads: citation markers are not linked superscripts');
assert(!toll.includes('shareholders.S1S2S3'), 'toll roads: citation markers remain adjacent to prose');
assert(toll.includes('<title>Are Texas Toll Roads Privately Owned? Ownership Guide</title>'), 'toll roads: approved title changed');
assert(
  toll.includes('Most Texas toll roads are publicly owned. See who owns each system, which private concessions operate lanes, and where toll revenue and billing sit.'),
  'toll roads: approved description is missing',
);
assert(
  textFromHtml(toll).includes('Most Texas toll roads are publicly owned, not privately owned. TxDOT, counties, and public toll authorities own most roadways.'),
  'toll roads: shared direct answer is missing',
);
assert(toll.includes('id="ownership-lookup"'), 'toll roads: early ownership lookup is missing');
assert(toll.includes('href="/research/texas-toll-road-ownership-2026.csv"'), 'toll roads: ownership CSV link is missing');
const tollGraph = graph(toll);
assert(tollGraph.some((item) => item['@type'] === 'Article'), 'toll roads: Article schema is missing');
assert(tollGraph.some((item) => item['@type'] === 'BreadcrumbList'), 'toll roads: Breadcrumb schema is missing');
const tollCsv = read('public/research/texas-toll-road-ownership-2026.csv');
assert(tollCsv.trim().split('\n').length === 10, 'toll roads: ownership CSV must contain one header and nine data rows');

const publicData = read('dist/research/search-console/technical-seo-public-data-infrastructure/index.html');
for (const expected of ['URL-to-evidence pipeline', 'Atlas demonstrates the pipeline on an open corpus', 'Minimum quality checks before a finding is publishable']) {
  assert(textFromHtml(publicData).includes(expected), `public data infrastructure: missing ${expected}`);
}
assert(!textFromHtml(publicData).includes('sameAs eligibility rubric'), 'public data infrastructure: identity-playbook material leaked into systems essay');

const canonicalIdentity = read('dist/research/personal-seo/canonical-identity-personal-seo/index.html');
for (const expected of ['Profile inventory fields', 'Canonical-host decision tree', 'sameAs eligibility rubric', 'External-profile reconciliation queue']) {
  assert(textFromHtml(canonicalIdentity).includes(expected), `canonical identity: missing ${expected}`);
}
assert(!textFromHtml(canonicalIdentity).includes('URL-to-evidence pipeline'), 'canonical identity: public-data pipeline material leaked into identity playbook');

const crawlerGuide = read('dist/research/ai-crawlers/ai-search-crawler-policy/index.html');
for (const expected of ['Outcome-to-user-agent decision matrix', 'Copy-and-paste robots.txt configurations', 'Verify deployment with server logs']) {
  assert(textFromHtml(crawlerGuide).includes(expected), `crawler guide: missing ${expected}`);
}

const archive = read('dist/markets/archived-research-methodology/index.html');
for (const expected of ['Network advantage requires measurable persistence', 'Compute infrastructure starts with capacity and utilization', 'Monetary claims need windows, units, and transmission paths']) {
  assert(textFromHtml(archive).includes(expected), `archive methodology: missing ${expected}`);
}
assert(/<meta name="robots" content="[^"]*noindex/i.test(archive), 'archive methodology: missing noindex directive');

const sitemap = read('public/sitemap.xml');
for (const retired of retiredPaths) assert(!sitemap.includes(`${siteUrl}${retired}`), `sitemap: retired path remains ${retired}`);
for (const retired of retiredArchivePaths) assert(!sitemap.includes(`${siteUrl}${retired}`), `sitemap: retired archive path remains ${retired}`);
assert(!sitemap.includes(`${siteUrl}/markets/archived-research-methodology`), 'sitemap: noindex archive methodology is included');

const llms = read('public/llms.txt');
assert(llms.includes(`Canonical person ID: ${personId}`), 'llms.txt: canonical Person ID mismatch');
for (const retired of retiredPaths) assert(!llms.includes(`${siteUrl}${retired}`), `llms.txt: retired path remains ${retired}`);
for (const retired of retiredArchivePaths) assert(!llms.includes(`${siteUrl}${retired}`), `llms.txt: retired archive path remains ${retired}`);

const vercel = JSON.parse(read('vercel.json'));
const redirectMap = new Map((vercel.routes ?? []).filter((route) => route.headers?.Location).map((route) => [route.src, route.headers.Location]));
for (const [source, destination] of [
  ['/simple', '/about'],
  ['/ai-information', '/about'],
  ['/case-studies/technical-seo-audit', '/method'],
  ['/void-agency', 'https://www.void-agency.com/'],
  ['/markets/network-monopolies', '/markets/archived-research-methodology'],
  ['/markets/computational-commodity-systems', '/markets/archived-research-methodology'],
  ['/markets/fiat-horizon', '/markets/archived-research-methodology'],
]) {
  assert(redirectMap.get(source) === destination, `vercel: redirect mismatch for ${source}`);
}

console.log('SEO and content-remediation verification passed.');
