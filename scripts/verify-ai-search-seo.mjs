import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://sulayman-bowles.dev';
const personId = `${siteUrl}/ai-information#sulayman-bowles`;

const routeFiles = {
  home: 'dist/index.html',
  work: 'dist/work/index.html',
  about: 'dist/about/index.html',
  atlas: 'dist/atlas/index.html',
  atlasSampleCrawl: 'dist/atlas/sample-crawl/index.html',
  resume: 'dist/resume/index.html',
  simple: 'dist/simple/index.html',
  aiInformation: 'dist/ai-information/index.html',
  research: 'dist/research/index.html',
  sitemap: 'dist/sitemap/index.html',
  method: 'dist/method/index.html',
  voidAgency: 'dist/void-agency/index.html',
  contact: 'dist/contact/index.html',
  austinTechnicalSeo: 'dist/austin-technical-seo/index.html',
  technicalSeoCaseStudy: 'dist/case-studies/technical-seo-audit/index.html',
  markets: 'dist/markets/index.html',
};

const routePaths = {
  home: '/',
  work: '/work',
  about: '/about',
  atlas: '/atlas',
  atlasSampleCrawl: '/atlas/sample-crawl',
  resume: '/resume',
  simple: '/simple',
  aiInformation: '/ai-information',
  research: '/research',
  sitemap: '/sitemap',
  method: '/method',
  voidAgency: '/void-agency',
  contact: '/contact',
  austinTechnicalSeo: '/austin-technical-seo',
  technicalSeoCaseStudy: '/case-studies/technical-seo-audit',
  markets: '/markets',
};

const routesWithVoidOrganization = new Set(['aiInformation', 'method', 'voidAgency']);
const atlasSoftwareRoutes = new Set(['atlas', 'atlasSampleCrawl', 'aiInformation']);

const marketFiles = [
  'dist/markets/ai-search-crawler-policy/index.html',
  'dist/markets/technical-seo-public-data-infrastructure/index.html',
  'dist/markets/canonical-identity-personal-seo/index.html',
  'dist/markets/who-owns-texas-toll-roads/index.html',
];

const publicMarketLastmods = {
  '/markets/ai-search-crawler-policy': '2026-07-05',
  '/markets/technical-seo-public-data-infrastructure': '2026-07-05',
  '/markets/canonical-identity-personal-seo': '2026-07-05',
  '/markets/who-owns-texas-toll-roads': '2026-07-11',
};

const archivedMarketFiles = [
  'dist/markets/network-monopolies/index.html',
  'dist/markets/computational-commodity-systems/index.html',
  'dist/markets/fiat-horizon/index.html',
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

function graphUrls(items) {
  return (Array.isArray(items) ? items : []).map((item) => item?.url).filter(Boolean);
}

function propertyValues(items) {
  return (Array.isArray(items) ? items : []).map((item) => item?.value).filter(Boolean);
}

function absolutePath(pathname) {
  return pathname === '/' ? `${siteUrl}/` : `${siteUrl}${pathname}`;
}

function canonicalHref(html) {
  return [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
}

function metaContent(html, selector) {
  const propMatch = selector.startsWith('property=')
    ? html.match(new RegExp(`<meta ${selector} content="([^"]+)"`))
    : html.match(new RegExp(`<meta ${selector} content="([^"]+)"`));
  return propMatch?.[1];
}

function textFromHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function assertVisibleText(file, expectedItems) {
  const text = textFromHtml(read(file)).toLowerCase();
  for (const item of expectedItems) {
    assert(text.includes(item.toLowerCase()), `${file}: missing visible text "${item}"`);
  }
}

function visibleBodyMarkup(file) {
  const html = read(file);
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
  return body.replace(/<script[\s\S]*?<\/script>/g, ' ');
}

function visibleText(file) {
  return textFromHtml(visibleBodyMarkup(file));
}

function assertHiddenText(file, rejectedItems) {
  const text = visibleText(file).toLowerCase();
  for (const item of rejectedItems) {
    assert(!text.includes(item.toLowerCase()), `${file}: should not expose visible text "${item}"`);
  }
}

function assertHref(file, href, label) {
  const html = read(file);
  assert(html.includes(`href="${href}"`), `${file}: missing href "${href}"`);
  assert(textFromHtml(html).toLowerCase().includes(label.toLowerCase()), `${file}: missing anchor text "${label}"`);
}

function assertNoVisibleHref(file, href) {
  assert(!visibleBodyMarkup(file).includes(`href="${href}"`), `${file}: should not expose visible href "${href}"`);
}

for (const [route, file] of Object.entries(routeFiles)) {
  const html = read(file);
  const graph = jsonLdGraph(html);
  const person = findType(graph, 'Person', personId);
  const org = findType(graph, 'Organization', `${siteUrl}/#void-agency`);
  const software = findType(graph, 'SoftwareApplication', `${siteUrl}/atlas#software`);
  const website = findType(graph, 'WebSite', `${siteUrl}/#website`);
  const webPage = findType(graph, 'WebPage', `${absolutePath(routePaths[route])}#webpage`);

  assert(person, `${route}: missing canonical Person schema`);
  assert(!html.includes(`${siteUrl}/#person`), `${route}: stale homepage-fragment Person ID found`);
  assert(person.url === siteUrl, `${route}: Person url must be absolute canonical site URL`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://github.com/SulaymanB2024'), `${route}: Person sameAs missing GitHub`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://www.linkedin.com/in/sulayman-bowles/'), `${route}: Person sameAs missing LinkedIn`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://devpost.com/sulayman-bowles'), `${route}: Person sameAs missing Devpost`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://sulayman-bowles.tech/'), `${route}: Person sameAs missing technical ledger`);
  assert(graphUrls(person.subjectOf).includes(`${siteUrl}/ai-information`), `${route}: Person subjectOf missing AI Information`);
  assert(graphUrls(person.subjectOf).includes('https://sulayman-bowles.tech/'), `${route}: Person subjectOf missing technical ledger`);
  assert(graphUrls(person.subjectOf).includes('https://devpost.com/sulayman-bowles'), `${route}: Person subjectOf missing Devpost`);
  assert(graphUrls(person.subjectOf).includes('https://www.goldenhornet.org/calendar/young-composers-concert-2022'), `${route}: Person subjectOf missing Golden Hornet historical source`);
  assert(graphUrls(person.subjectOf).includes('https://music.utexas.edu/events/4645-university-orchestra'), `${route}: Person subjectOf missing UT Butler historical source`);
  assert(propertyValues(person.identifier).includes('SulaymanB2024'), `${route}: Person identifier missing GitHub username`);
  assert(String(person.logo?.url ?? person.logo).startsWith(siteUrl), `${route}: Person logo must be absolute`);

  if (routesWithVoidOrganization.has(route)) {
    assert(org, `${route}: missing canonical Organization schema`);
    assert(org.url === 'https://www.void-agency.com/', `${route}: Organization url must be absolute Void Agency URL`);
    assert(Array.isArray(org.sameAs) && org.sameAs.includes('https://www.void-agency.com/'), `${route}: Organization sameAs missing Void Agency`);
    assert(String(org.logo?.url ?? org.logo).startsWith(siteUrl), `${route}: Organization logo must be absolute`);
  } else {
    assert(!org, `${route}: Void Agency Organization schema should only appear on Void/material service source pages`);
  }

  if (atlasSoftwareRoutes.has(route)) {
    assert(software, `${route}: missing Atlas SoftwareApplication schema`);
  }

  assert(website, `${route}: missing shared WebSite schema`);
  assert(webPage, `${route}: missing canonical WebPage schema`);
  assert(webPage.url === absolutePath(routePaths[route]), `${route}: WebPage url must match canonical route URL`);
  assert(webPage.isPartOf?.['@id'] === `${siteUrl}/#website`, `${route}: WebPage must be part of shared WebSite`);
  assert(website.description?.includes('Atlas'), `${route}: WebSite schema should describe the site focus`);
  assert(graphUrls(website.hasPart).includes(`${siteUrl}/atlas`), `${route}: WebSite hasPart missing Atlas page`);
  assert(graphUrls(website.hasPart).includes(`${siteUrl}/contact`), `${route}: WebSite hasPart missing contact page`);

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  assert(title.replaceAll('&amp;', '&').length <= 62, `${route}: title is too long (${title.length})`);
  const description = metaContent(html, 'name="description"') ?? '';
  assert(description.length >= 145 && description.length <= 180, `${route}: description should be 145-180 chars (${description.length})`);

  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  assert(h1Count === 1, `${route}: expected exactly one static H1, found ${h1Count}`);
}

assertVisibleText('dist/ai-information/index.html', [
  'Profile Context for Sulayman Bowles, Void Agency, and Atlas',
  'This page keeps current descriptions and older background in one place',
  'Identity reconciliation',
  "Earlier public sources describe Sulayman's classical bass and composition background through Golden Hornet, McCallum, and UT Butler.",
  'Golden Hornet',
  'UT Butler',
  'What the Work Supports',
  'Entity Summaries',
  'What Void Agency Does',
  'What Atlas SEO Audit Console Does',
  'Relevant Expertise',
  'What Not to Infer',
  'How to Use This Page',
]);
assertHiddenText('dist/ai-information/index.html', [
  'AI Information',
  'Public Source List',
  'Likely Search Questions',
  'Crawler and Indexation Signals',
  'Provider Discovery Plan',
  'Evidence and Source Links',
  'Source List',
  'llms.txt',
  'Search Console',
  'Bing Webmaster Tools',
]);

assertVisibleText('dist/research/index.html', [
  'Research Notes',
  'Selected notes',
  'Crawler Policy Comes Before Visibility',
  'Technical SEO as Public Data Infrastructure',
  'Canonical Identity for Personal SEO',
  'Atlas Sample Crawl Run',
  'Related work',
]);
assertHiddenText('dist/research/index.html', [
  'Authority asset JSON',
  'llms.txt reference file',
  'Public References',
  'Downloadable Public Files',
  'Preferred anchor',
  'These assets do not claim rankings',
]);
assertNoVisibleHref('dist/research/index.html', '/research/authority-assets.json');
assertNoVisibleHref('dist/research/index.html', '/llms.txt');
assertHref('dist/research/index.html', '/work', 'Selected work');
assertHref('dist/research/index.html', '/markets/ai-search-crawler-policy', 'Crawler Policy Comes Before Visibility');

const visibleArtifactTextRejects = [
  'AI Information',
  'Authority asset JSON',
  'llms.txt reference file',
  'Crawler policy sources',
  'Public Source List',
  'Likely Search Questions',
  'Crawler and Indexation Signals',
  'Provider Discovery Plan',
  'Downloadable Public Files',
  'Preferred anchor',
  'Ahrefs Domain Rating',
];

const visibleArtifactHrefRejects = [
  '/research/authority-assets.json',
  '/research/ai-search-crawler-policy-sources.csv',
  '/llms.txt',
  '/sitemap.xml',
];

for (const file of new Set([...Object.values(routeFiles), ...marketFiles, ...archivedMarketFiles])) {
  assertHiddenText(file, visibleArtifactTextRejects);
  for (const href of visibleArtifactHrefRejects) {
    assertNoVisibleHref(file, href);
  }
}

{
  const graph = jsonLdGraph(read('dist/research/index.html'));
  const researchAssetList = findItemList(graph, `${siteUrl}/research#asset-list`);
  assert(researchAssetList, 'research: missing Research Assets ItemList schema');
  assert(researchAssetList.itemListElement?.length === 14, 'research: Research Assets ItemList should have 14 items');
}

{
  const graph = jsonLdGraph(read('dist/ai-information/index.html'));
  const sourceGraphList = findItemList(graph, `${siteUrl}/ai-information#public-source-graph`);
  const fanOutList = findItemList(graph, `${siteUrl}/ai-information#fan-out-query-map`);
  const providerPlanList = findItemList(graph, `${siteUrl}/ai-information#provider-discovery-plan`);
  const expertiseTerms = findType(graph, 'DefinedTermSet', `${siteUrl}/ai-information#expertise-areas`);
  assert(sourceGraphList, 'ai-information: missing Public Source List ItemList schema');
  assert(fanOutList, 'ai-information: missing Likely Search Questions ItemList schema');
  assert(providerPlanList, 'ai-information: missing Provider Discovery Plan ItemList schema');
  assert(expertiseTerms, 'ai-information: missing Relevant Expertise Areas DefinedTermSet schema');
  assert(sourceGraphList.itemListElement?.length === 13, 'ai-information: Public Source List ItemList should have 13 items');
  assert(fanOutList.itemListElement?.length === 6, 'ai-information: Likely Search Questions ItemList should have 6 items');
  assert(providerPlanList.itemListElement?.length === 7, 'ai-information: Provider Discovery Plan ItemList should have 7 items');
  assert(expertiseTerms.hasDefinedTerm?.length === 14, 'ai-information: Relevant Expertise Areas should have 14 terms');
  assert(findType(graph, 'AboutPage', `${siteUrl}/ai-information#webpage`), 'ai-information: WebPage should also be typed as AboutPage');
}

assertVisibleText('dist/about/index.html', [
  'Historical Source Context',
  "Earlier public sources describe Sulayman's classical bass and composition background through Golden Hornet, McCallum, and UT Butler.",
  'Golden Hornet',
  'UT Butler',
  'GitHub',
  'LinkedIn',
  'Void',
  'Atlas',
  'Resume',
]);
{
  const graph = jsonLdGraph(read('dist/about/index.html'));
  assert(findType(graph, 'AboutPage', `${siteUrl}/about#webpage`), 'about: WebPage should also be typed as AboutPage');
}

assertVisibleText('dist/resume/index.html', [
  'Download PDF Resume',
]);
assert(read('dist/resume/index.html').includes('/Sulayman_Bowles_Resume.pdf'), 'resume: missing PDF resume href');

{
  const resumePdf = path.resolve('public/Sulayman_Bowles_Resume.pdf');
  const pdfStat = fs.statSync(resumePdf);
  assert(pdfStat.size > 100000, 'resume PDF should be present and non-empty');
  const signature = fs.readFileSync(resumePdf).subarray(0, 4).toString('utf8');
  assert(signature === '%PDF', 'resume PDF should have a PDF signature');
}

{
  const atlasSampleCsv = path.resolve('public/research/atlas-sanitized-crawl-sample.csv');
  const appianAssumptionsCsv = path.resolve('public/research/appian-assumptions-table.csv');
  const appianMemoPdf = path.resolve('public/research/appian-enterprise-software-durability-memo.pdf');
  assert(fs.statSync(atlasSampleCsv).size > 500, 'Atlas sample crawl CSV should be present and non-empty');
  assert(fs.statSync(appianAssumptionsCsv).size > 1000, 'Appian assumptions CSV should be present and non-empty');
  assert(fs.statSync(appianMemoPdf).size > 100000, 'Appian memo PDF should be present and non-empty');
  assert(read('public/research/atlas-sanitized-crawl-sample.csv').includes('canonical_state'), 'Atlas sample CSV should include canonical_state column');
  assert(read('public/research/appian-assumptions-table.csv').includes('Validation Source'), 'Appian assumptions CSV should include Validation Source column');
  const appianSignature = fs.readFileSync(appianMemoPdf).subarray(0, 4).toString('utf8');
  assert(appianSignature === '%PDF', 'Appian memo should have a PDF signature');
}

assertVisibleText('dist/atlas/index.html', [
  'What Atlas SEO Audit Console Checks',
  'URL discovery',
  'robots.txt',
  'XML sitemaps',
  'raw HTML',
  'rendered HTML',
  'titles/meta',
  'canonicals',
  'structured data',
  'internal links',
  'scoring',
  'SQLite persistence',
  'exports/dashboards',
]);
assertHref('dist/atlas/index.html', '/atlas/sample-crawl', 'See an Atlas sample crawl run');
assertHref('dist/atlas/index.html', 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-', 'View the GitHub repo for the audit CLI');
assertHref('dist/atlas/index.html', '/contact', 'Request an audit');

{
  const graph = jsonLdGraph(read('dist/atlas/index.html'));
  const atlasCheckList = findItemList(graph, `${siteUrl}/atlas#atlas-checks`);
  assert(atlasCheckList, 'atlas: missing Atlas checks ItemList schema');
  assert(atlasCheckList.itemListElement?.length === 12, 'atlas: Atlas checks ItemList should have 12 items');
}

assertVisibleText('dist/work/index.html', [
  'Selected Work',
  'See an Atlas sample crawl run',
  'Read the technical SEO audit method',
  'View the GitHub repo for the audit CLI',
  'Request an audit',
  'Read the markets research memo with assumptions',
]);
assertHref('dist/work/index.html', '/atlas/sample-crawl', 'See an Atlas sample crawl run');
assertHref('dist/work/index.html', '/contact', 'Request an audit');
assertHref('dist/work/index.html', '/markets#appian-assumptions', 'Read the markets research memo with assumptions');

assertVisibleText('dist/contact/index.html', [
  'Contact Sulayman Bowles',
  'Direct Contact',
  'Brief Form',
  'Elsewhere',
  'LinkedIn',
  'GitHub',
  'Tech Ledger',
  'Related Context',
  'See an Atlas sample crawl run',
  'Read the technical SEO audit method',
]);
assertHref('dist/contact/index.html', 'mailto:sulayman.bowles@gmail.com', 'Email Sulayman Bowles');
assertHref('dist/contact/index.html', '/atlas/sample-crawl', 'See an Atlas sample crawl run');
assertHref('dist/contact/index.html', '/method', 'Read the technical SEO audit method');
{
  const graph = jsonLdGraph(read('dist/contact/index.html'));
  const contactPage = findType(graph, 'ContactPage', `${siteUrl}/contact#webpage`);
  const contactService = findType(graph, 'Service', `${siteUrl}/contact#audit-intake-service`);
  const person = findType(graph, 'Person', personId);
  assert(contactPage, 'contact: WebPage should also be typed as ContactPage');
  assert(contactService?.availableChannel?.serviceUrl === `${siteUrl}/contact`, 'contact: Service schema missing available channel');
  assert(person.contactPoint?.some((point) => point.email === 'sulayman.bowles@gmail.com'), 'contact: Person schema missing direct contact point');
}

assertVisibleText('dist/atlas/sample-crawl/index.html', [
  'Atlas Sample Crawl Run',
  'Sanitized crawl data',
  'Download sanitized crawl CSV',
  'https://example.com/resources/seo-tools',
  'missing canonical',
  'View the GitHub repo for the audit CLI',
  'Request an audit',
]);
assertHref('dist/atlas/sample-crawl/index.html', '/research/atlas-sanitized-crawl-sample.csv', 'Download sanitized crawl CSV');
assertHref('dist/atlas/sample-crawl/index.html', 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-', 'View the GitHub repo for the audit CLI');

{
  const graph = jsonLdGraph(read('dist/atlas/sample-crawl/index.html'));
  const dataset = findType(graph, 'Dataset', `${siteUrl}/atlas/sample-crawl#sanitized-crawl-dataset`);
  assert(dataset, 'atlas sample crawl: missing Dataset schema');
  assert(dataset.license === 'https://creativecommons.org/licenses/by/4.0', 'atlas sample crawl: Dataset schema missing CC BY 4.0 license');
}

assertVisibleText('dist/case-studies/technical-seo-audit/index.html', [
  'Technical SEO Audit Case Study',
  'Short Answer',
  'Problem observed',
  'Evidence used',
  'Rerun check',
  'What it does not prove',
  'Crawl data before recommendations',
  'Separate observations from interpretation',
  'Request an audit',
]);
assertHref('dist/case-studies/technical-seo-audit/index.html', '/contact', 'Request an audit');

assertVisibleText('dist/austin-technical-seo/index.html', [
  'Austin Technical SEO',
  'search visibility',
  'Short Answer',
  'Who this is for',
  'What you receive',
  'When not to hire me',
  'What I check',
  'Pilot Method',
  'Use this format for your site audit',
  'Query Examples Before Page Expansion',
  'Common Austin site problems',
  'Sample audit output',
  'emergency HVAC repair Austin',
  'foundation repair estimate Austin',
  'This page does not claim local rankings',
  'View Void Agency',
]);
assertHref('dist/austin-technical-seo/index.html', '/contact', 'Request an audit');
assertHref('dist/austin-technical-seo/index.html', '/void-agency', 'View Void Agency');

assertVisibleText('dist/void-agency/index.html', [
  'Void Agency',
  'Service practice',
  'Void Agency website',
  'Read the technical SEO audit method',
  'See an Atlas sample crawl run',
]);
assertHref('dist/void-agency/index.html', 'https://www.void-agency.com/', 'Void Agency website');
assertHref('dist/void-agency/index.html', '/method', 'Read the technical SEO audit method');

assertVisibleText('dist/method/index.html', [
  'Search Visibility Audit Checklist',
  'Audit Details',
  'Concrete deliverables',
  'Timeline',
  'Required access',
  'What the audit does not include',
  'Sample output links',
  'Measurement plan after implementation',
  'Public Page Clarity Review',
  'Product Discovery System',
  'Service-Area Visibility Audit',
  'crawlability',
  'indexability',
  'internal links',
  'structured data',
  'source-page clarity',
  'entity consistency',
  'public work',
  'sitemap freshness',
  'stale/conflicting source cleanup',
]);
assertHref('dist/method/index.html', '/atlas/sample-crawl', 'See an Atlas sample crawl run');
assertHref('dist/method/index.html', '/ai-information', 'Open reference page');
assertHref('dist/method/index.html', '/austin-technical-seo', 'Open local SEO page');
assertHref('dist/method/index.html', '/void-agency', 'View Void Agency');
assertHref('dist/method/index.html', '/contact', 'Request an audit');

{
  const llmsText = read('public/llms.txt');
  const robotsText = read('public/robots.txt');
  const expectedAiAgents = [
    'Googlebot',
    'Bingbot',
    'DuckDuckBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'GPTBot',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'PerplexityBot',
    'Perplexity-User',
  ];

  assert(llmsText.includes('Last updated: July 11, 2026'), 'llms.txt: stale last updated date');
  assert(
    llmsText.includes('Canonical person ID: https://sulayman-bowles.dev/ai-information#sulayman-bowles'),
    'llms.txt: missing canonical person ID',
  );
  assert(llmsText.includes('Selected work: https://sulayman-bowles.dev/work'), 'llms.txt: missing selected work route');
  assert(llmsText.includes('Atlas sample crawl run: https://sulayman-bowles.dev/atlas/sample-crawl'), 'llms.txt: missing Atlas sample crawl route');
  assert(llmsText.includes('Void Agency: https://sulayman-bowles.dev/void-agency'), 'llms.txt: missing Void Agency route');
  assert(llmsText.includes('Technical ledger: https://sulayman-bowles.tech/'), 'llms.txt: missing technical ledger link');
  assert(llmsText.includes('Audit intake/contact: https://sulayman-bowles.dev/contact'), 'llms.txt: missing contact route');
  assert(llmsText.includes('Sanitized Atlas crawl sample CSV'), 'llms.txt: missing Atlas sample file');
  assert(llmsText.includes('Appian assumptions table CSV'), 'llms.txt: missing Appian assumptions file');
  assert(llmsText.includes('## Crawler and Indexation Signals'), 'llms.txt: missing crawler/indexation section');
  assert(llmsText.includes('The www host redirects to the apex canonical host.'), 'llms.txt: missing www canonical redirect fact');
  assert(
    llmsText.includes('Robots.txt explicitly allows Googlebot, Bingbot, and DuckDuckBot.'),
    'llms.txt: missing search crawler allow fact',
  );
  assert(llmsText.includes('## Provider Discovery Plan'), 'llms.txt: missing provider discovery plan');
  assert(llmsText.includes('Current PDF resume: https://sulayman-bowles.dev/Sulayman_Bowles_Resume.pdf'), 'llms.txt: missing current PDF resume link');
  assert(llmsText.includes('## Research Articles'), 'llms.txt: missing research articles section');
  assert(llmsText.includes('Crawler Policy Comes Before Visibility'), 'llms.txt: missing crawler policy article');
  assert(llmsText.includes('Technical SEO as Public Data Infrastructure'), 'llms.txt: missing public data infrastructure article');
  assert(llmsText.includes('Canonical Identity Beats More Content'), 'llms.txt: missing canonical identity article');
  assert(llmsText.includes('Who Owns the Toll Roads in Texas?'), 'llms.txt: missing Texas toll-road ownership article');
  assert(llmsText.includes('Brave Search: the site is publicly crawlable'), 'llms.txt: missing Brave discovery plan');
  assert(
    llmsText.includes('Google Search and Google AI surfaces: public site signals are present'),
    'llms.txt: Google provider plan should describe public signals, not unverified private Search Console state',
  );
  assert(
    llmsText.includes('Bing, Microsoft Copilot, and Bing-powered search partners: public site signals are present'),
    'llms.txt: Bing provider plan should describe public signals, not unverified private Bing Webmaster state',
  );
  assert(
    llmsText.includes('Robots.txt explicitly allows OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User'),
    'llms.txt: missing explicit AI crawler allow fact',
  );
  assert(
    llmsText.includes('The old Sulayman_Bowles_Resume_2025.pdf URL redirects to https://sulayman-bowles.dev/resume.'),
    'llms.txt: missing old PDF redirect fact',
  );
  assert(
    llmsText.includes('Search Console, Bing Webmaster Tools, and IndexNow submissions are discovery and recrawl signals'),
    'llms.txt: missing submission claim boundary',
  );
  assert(!llmsText.includes('Bing-indexed source paths'), 'llms.txt: should not claim Bing indexing without live verification');
  assert(robotsText.includes('Sitemap: https://sulayman-bowles.dev/sitemap.xml'), 'robots.txt: missing sitemap directive');

  for (const agent of expectedAiAgents) {
    const pattern = new RegExp(`User-agent: ${agent}\\nAllow: /`);
    assert(pattern.test(robotsText), `robots.txt: missing explicit Allow for ${agent}`);
  }
}

{
  const sitemapText = read('dist/sitemap.xml');
  const publicSitemapText = read('public/sitemap.xml');
  const expectedCanonicalPaths = Object.values(routePaths);

  for (const pathname of expectedCanonicalPaths) {
    const loc = `<loc>${absolutePath(pathname)}</loc>`;
    assert(sitemapText.includes(loc), `dist sitemap: missing ${loc}`);
    assert(publicSitemapText.includes(loc), `public sitemap: missing ${loc}`);
  }

  for (const [pathname, lastmod] of Object.entries(publicMarketLastmods)) {
    const sitemapEntry = `<loc>${absolutePath(pathname)}</loc>\n    <lastmod>${lastmod}</lastmod>`;
    assert(sitemapText.includes(sitemapEntry), `dist sitemap: stale lastmod for ${pathname}`);
    assert(publicSitemapText.includes(sitemapEntry), `public sitemap: stale lastmod for ${pathname}`);
  }

  for (const pathname of archivedMarketPaths) {
    const loc = `<loc>${absolutePath(pathname)}</loc>`;
    assert(!sitemapText.includes(loc), `dist sitemap: archived URL should be excluded: ${loc}`);
    assert(!publicSitemapText.includes(loc), `public sitemap: archived URL should be excluded: ${loc}`);
  }

  assert(!sitemapText.includes('#'), 'dist sitemap should not contain hash-only URLs');
  assert(!publicSitemapText.includes('#'), 'public sitemap should not contain hash-only URLs');
}

{
  const vercelConfig = JSON.parse(read('vercel.json'));
  const redirects = vercelConfig.redirects ?? [];
  assert(vercelConfig.cleanUrls === true, 'vercel: cleanUrls must redirect .html duplicate URLs');
  assert(vercelConfig.trailingSlash === false, 'vercel: trailingSlash must redirect slash duplicate URLs');
  assert(!redirects.some((item) => item.source === '/void-agency'), 'vercel: /void-agency must not redirect away from canonical route');
  assert(redirects.some((item) => item.source === '/atlas/sample-run' && item.destination === '/atlas/sample-crawl'), 'vercel: missing /atlas/sample-run redirect');
  assert(redirects.some((item) => item.source === '/atlas-animation' && item.destination === '/atlas/celestial-parallax'), 'vercel: missing /atlas-animation redirect');
  assert(redirects.some((item) => item.source === '/audit-intake' && item.destination === '/contact'), 'vercel: missing /audit-intake redirect');
  assert(redirects.some((item) => item.source === '/austin-seo' && item.destination === '/austin-technical-seo'), 'vercel: missing /austin-seo redirect');
  assert(
    redirects.some((item) => item.source === '/technical-seo-case-study' && item.destination === '/case-studies/technical-seo-audit'),
    'vercel: missing /technical-seo-case-study redirect',
  );
  assert(redirects.some((item) => item.source === '/projects/atlas' && item.destination === '/atlas'), 'vercel: missing legacy /projects/atlas redirect');
  assert(redirects.some((item) => item.source === '/cv.html' && item.destination === '/resume'), 'vercel: missing legacy /cv.html redirect');
  assert(redirects.some((item) => item.source === '/resume.html' && item.destination === '/resume'), 'vercel: missing legacy /resume.html redirect');
  assert(redirects.some((item) => item.source === '/official-information' && item.destination === '/ai-information'), 'vercel: missing /official-information redirect');
  assert(redirects.some((item) => item.source === '/entity-profile' && item.destination === '/ai-information'), 'vercel: missing /entity-profile redirect');
  assert(redirects.some((item) => item.source === '/source-information' && item.destination === '/ai-information'), 'vercel: missing /source-information redirect');
  assert(redirects.some((item) => item.source === '/research-assets' && item.destination === '/research'), 'vercel: missing /research-assets redirect');
}

{
  const graph = jsonLdGraph(read('dist/method/index.html'));
  const methodChecklist = findItemList(graph, `${siteUrl}/method#search-visibility-checklist`);
  const offerCatalog = findType(graph, 'OfferCatalog', `${siteUrl}/method#offer-catalog`);
  assert(methodChecklist, 'method: missing Search Visibility Audit Checklist ItemList schema');
  assert(offerCatalog, 'method: missing Technical SEO Audit Offer Catalog schema');
  assert(methodChecklist.itemListElement?.length === 9, 'method: audit checklist ItemList should have 9 items');
  assert(offerCatalog.itemListElement?.length === 4, 'method: OfferCatalog should have 4 offers');
}

assertVisibleText('dist/markets/index.html', [
  'Markets Research Memo With Assumptions',
  'Read the markets research memo with assumptions',
  'Download the Appian assumptions table',
  'educational research samples',
  'Not a recommendation or price target',
]);
assertHref('dist/markets/index.html', '/research/appian-enterprise-software-durability-memo.pdf', 'Read the markets research memo with assumptions');
assertHref('dist/markets/index.html', '/research/appian-assumptions-table.csv', 'Download the Appian assumptions table');

for (const file of marketFiles) {
  const html = read(file);
  const graph = jsonLdGraph(html);
  const article = findType(graph, 'Article');
  const pathname = file.replace(/^dist/, '').replace(/\/index\.html$/, '');
  const website = findType(graph, 'WebSite', `${siteUrl}/#website`);
  const webPage = findType(graph, 'WebPage', `${siteUrl}${pathname}#webpage`);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  const description = metaContent(html, 'name="description"') ?? '';
  const ogImage = metaContent(html, 'property="og:image"');
  const twitterImage = metaContent(html, 'name="twitter:image"');

  assert(article, `${file}: missing Article schema`);
  assert(website, `${file}: missing shared WebSite schema`);
  assert(webPage, `${file}: missing canonical WebPage schema`);
  assert(webPage.mainEntity?.['@id'] === article['@id'], `${file}: WebPage should point to Article as mainEntity`);
  assert(String(article.image?.url ?? article.image).startsWith(siteUrl), `${file}: Article image must be absolute`);
  assert(article.dateModified === publicMarketLastmods[pathname], `${file}: Article schema should carry current dateModified`);
  assert(ogImage && ogImage === twitterImage, `${file}: OG and Twitter images must match`);
  assert(ogImage === (article.image?.url ?? article.image), `${file}: Article image must match OG/Twitter image`);
  assert(title.replaceAll('&amp;', '&').length <= 62, `${file}: title is too long (${title.length})`);
  assert(description.length >= 145 && description.length <= 180, `${file}: description should be expanded to 145-180 chars (${description.length})`);
}

for (const file of archivedMarketFiles) {
  const html = read(file);
  const robots = metaContent(html, 'name="robots"');
  assert(robots === 'noindex,nofollow', `${file}: archived market note should be statically generated with noindex,nofollow`);
  assertVisibleText(file, ['Archived', 'not investment advice', 'current recommendation']);
}

assertVisibleText('dist/markets/ai-search-crawler-policy/index.html', [
  'Crawler Policy Comes Before Visibility',
  'Research Sources',
  'OpenAI Crawlers',
  'Anthropic crawler guidance',
  'Perplexity Crawlers',
  'IndexNow documentation',
]);

assertVisibleText('dist/markets/technical-seo-public-data-infrastructure/index.html', [
  'Technical SEO as Public Data Infrastructure',
  'Research Sources',
  'Google structured data introduction',
  'Google helpful content guidance',
  'SEC EDGAR APIs',
]);

assertVisibleText('dist/markets/canonical-identity-personal-seo/index.html', [
  'Canonical Identity Beats More Content',
  'Research Sources',
  'Google canonicalization guide',
  'Google ProfilePage structured data',
  'Schema.org Person',
]);

assertVisibleText('dist/markets/who-owns-texas-toll-roads/index.html', [
  'Who Owns the Toll Roads in Texas? Ownership, Operators, and Economics',
  'Texas toll roads do not have one owner',
  'A road can have seven different owners',
  'SH 130: the danger of believing the traffic model',
  'SH 288: the value of a termination clause',
  'Texas toll-road ownership map',
  '65% / 32% / 4% other',
  'What remains unknown',
  'Frequently asked questions',
  'Source ledger',
]);
assertHref('dist/research/index.html', '/markets/who-owns-texas-toll-roads', 'Who Owns the Toll Roads in Texas?');

{
  const html = read('dist/markets/who-owns-texas-toll-roads/index.html');
  assert((html.match(/id="source-s\d+"/g) ?? []).length === 25, 'Texas toll-road article: expected 25 source-ledger entries');
  assert((html.match(/<table>/g) ?? []).length >= 4, 'Texas toll-road article: expected at least four evidence tables');
  assert((html.match(/<h3>[^<]*\?<\/h3>/g) ?? []).length >= 8, 'Texas toll-road article: expected visible FAQ answers');
  assert(html.includes('Scenario, not price.'), 'Texas toll-road article: missing model-screening boundary');
}

console.log('AI-search SEO verification passed');
