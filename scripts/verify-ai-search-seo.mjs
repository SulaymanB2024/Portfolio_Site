import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://sulayman-bowles.dev';
const personId = `${siteUrl}/about#sulayman-bowles`;
const websiteId = `${siteUrl}/#website`;
const primaryImageId = `${siteUrl}/#primaryimage`;
const atlasSoftwareId = `${siteUrl}/atlas#software`;
const voidAgencyId = `${siteUrl}/#void-agency`;
const retiredPaths = ['/simple', '/ai-information', '/void-agency', '/case-studies/technical-seo-audit'];
const retiredArchivePaths = [
  '/markets/network-monopolies',
  '/markets/computational-commodity-systems',
  '/markets/fiat-horizon',
];
const crawlerAgents = [
  '*',
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
  'Perplexity-User',
  'GPTBot',
  'ClaudeBot',
];

const read = (file) => fs.readFileSync(path.resolve(file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const textFromHtml = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const jsonLdScripts = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
const graph = (html) => jsonLdScripts(html).flatMap((match) => {
  const value = JSON.parse(match[1]);
  return value['@graph'] ?? [value];
});
const asTypes = (value) => Array.isArray(value) ? value : [value];
const hasType = (item, type) => asTypes(item?.['@type']).includes(type);
const canonicalUrlFor = (pathname) => `${siteUrl}${pathname === '/' ? '/' : pathname}`;
const headFromHtml = (html) => html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
const tags = (html, tagName) => [...headFromHtml(html).matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find((value) => value !== undefined);
const relTokens = (tag) => new Set((attr(tag, 'rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean));
const metaTags = (html, key, value) => tags(html, 'meta').filter((tag) => attr(tag, key)?.toLowerCase() === value.toLowerCase());
const linkTags = (html, rel) => tags(html, 'link').filter((tag) => relTokens(tag).has(rel.toLowerCase()));

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
  });
}

function pathnameFromStaticFile(file) {
  const relative = path.relative(path.resolve('dist'), file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404';
  assert(relative.endsWith('/index.html'), `unexpected static route path: ${relative}`);
  return `/${relative.slice(0, -'/index.html'.length)}`;
}

function xmlText(block, tagName) {
  return block.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i'))?.[1]?.trim();
}

const sitemap = read('public/sitemap.xml');
assert(!sitemap.startsWith('\uFEFF'), 'sitemap: UTF-8 BOM is not allowed');
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
  loc: xmlText(match[1], 'loc'),
  lastmod: xmlText(match[1], 'lastmod'),
  priority: xmlText(match[1], 'priority'),
}));
assert(sitemapEntries.length > 0, 'sitemap: no URL entries');
const sitemapPaths = new Set();
const sitemapByPath = new Map();
const today = new Date().toISOString().slice(0, 10);

for (const entry of sitemapEntries) {
  assert(entry.loc, 'sitemap: URL entry has no loc');
  const url = new URL(entry.loc);
  assert(url.origin === siteUrl, `sitemap: foreign origin ${entry.loc}`);
  assert(!url.search && !url.hash, `sitemap: query or fragment in ${entry.loc}`);
  assert(url.pathname === '/' || !url.pathname.endsWith('/'), `sitemap: trailing slash in ${entry.loc}`);
  assert(url.href === canonicalUrlFor(url.pathname), `sitemap: non-canonical URL ${entry.loc}`);
  assert(!sitemapPaths.has(url.pathname), `sitemap: duplicate URL ${entry.loc}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod ?? ''), `sitemap: invalid lastmod for ${entry.loc}`);
  assert(entry.lastmod <= today, `sitemap: future lastmod for ${entry.loc}`);
  assert(Number(entry.priority) >= 0 && Number(entry.priority) <= 1, `sitemap: invalid priority for ${entry.loc}`);
  sitemapPaths.add(url.pathname);
  sitemapByPath.set(url.pathname, entry);
}

const robots = read('public/robots.txt');
assert(!robots.startsWith('\uFEFF'), 'robots.txt: UTF-8 BOM is not allowed');
assert(Buffer.byteLength(robots, 'utf8') < 500 * 1024, 'robots.txt: exceeds the 500 KiB interoperability ceiling');
assert(robots.includes('robots.txt is advisory, not access control'), 'robots.txt: missing access-control boundary');
assert(!/^\s*(?:crawl-delay|noindex)\s*:/im.test(robots), 'robots.txt: unsupported indexing or crawl-delay directive');
const robotsSitemaps = [...robots.matchAll(/^sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
assert(robotsSitemaps.length === 1 && robotsSitemaps[0] === `${siteUrl}/sitemap.xml`, 'robots.txt: sitemap declaration drifted');

function parseRobotsGroups(text) {
  const groups = [];
  let agents = [];
  let directives = [];
  const flush = () => {
    if (agents.length > 0) groups.push({ agents, directives });
    agents = [];
    directives = [];
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const match = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2].trim();
    if (field === 'user-agent') {
      if (directives.length > 0) flush();
      agents.push(value);
    } else if (field === 'allow' || field === 'disallow') {
      assert(agents.length > 0, `robots.txt: ${field} appears before a User-agent`);
      directives.push({ field, value });
    }
  }
  flush();
  return groups;
}

const robotsGroups = parseRobotsGroups(robots);
const observedAgents = robotsGroups.flatMap((group) => group.agents);
assert(new Set(observedAgents).size === observedAgents.length, 'robots.txt: duplicate User-agent token');
assert(
  observedAgents.length === crawlerAgents.length && crawlerAgents.every((agent) => observedAgents.includes(agent)),
  `robots.txt: crawler roster drifted; found ${observedAgents.join(', ')}`,
);
for (const agent of crawlerAgents) {
  const group = robotsGroups.find((candidate) => candidate.agents.includes(agent));
  assert(group, `robots.txt: missing policy group for ${agent}`);
  assert(
    group.directives.length === 1 && group.directives[0].field === 'allow' && group.directives[0].value === '/',
    `robots.txt: ${agent} must have exactly Allow: /`,
  );
}

const llms = read('public/llms.txt');
assert(!llms.startsWith('\uFEFF'), 'llms.txt: UTF-8 BOM is not allowed');
assert(llms.startsWith('# Sulayman Bowles\n\n> '), 'llms.txt: expected H1 and concise blockquote summary');
for (const heading of [
  'How to Interpret This File',
  'Current Summary',
  'Primary Pages',
  'Public Work and Research',
  'Canonical Entities and Source Roles',
  'Indexability Contract',
  'Crawler Policy',
]) {
  assert(llms.includes(`## ${heading}`), `llms.txt: missing ${heading} section`);
}
for (const expected of [
  'not access control',
  'does not prove a crawl, indexing, ranking, model inclusion, answer inclusion, or citation',
  'noindex is not a privacy or authorization boundary',
  'does not independently prove biographical, product, client, performance, or outcome claims',
]) {
  assert(llms.includes(expected), `llms.txt: missing interpretation limit: ${expected}`);
}
assert(!/^- [^[][^:\n]*:\s+https?:\/\//m.test(llms), 'llms.txt: legacy bare-URL file-list entry remains');
const llmsLinks = [...llms.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => ({
  label: match[1],
  href: match[2],
}));
assert(llmsLinks.length >= 35, 'llms.txt: expected a substantial Markdown file index');
for (const { label, href } of llmsLinks) {
  assert(label.trim().length > 0, 'llms.txt: empty Markdown link label');
  const url = new URL(href);
  assert(!url.search, `llms.txt: query string is not allowed in ${href}`);
  if (url.origin !== siteUrl) continue;
  const extension = path.posix.extname(url.pathname);
  if (!extension) {
    assert(sitemapPaths.has(url.pathname), `llms.txt: internal HTML link is absent from the sitemap: ${href}`);
  }
}
for (const agent of crawlerAgents.filter((agent) => agent !== '*')) {
  assert(llms.includes(agent), `llms.txt: crawler policy omits ${agent}`);
}
assert(llms.includes(`Canonical person ID: ${personId}`), 'llms.txt: canonical Person ID mismatch');

const staticRouteFiles = walkFiles(path.resolve('dist'))
  .filter((file) => file === path.resolve('dist/404.html') || file.endsWith(`${path.sep}index.html`))
  .sort();
const staticRoutes = new Map();
for (const file of staticRouteFiles) {
  const pathname = pathnameFromStaticFile(file);
  assert(!staticRoutes.has(pathname), `${pathname}: duplicate generated static route`);
  staticRoutes.set(pathname, file);
}
assert(staticRoutes.size > sitemapPaths.size, 'generated routes: no explicit noindex boundary routes found');
for (const pathname of sitemapPaths) {
  assert(staticRoutes.has(pathname), `sitemap: no generated static HTML for ${pathname}`);
}
assert(read('dist/sitemap.xml') === sitemap, 'dist sitemap differs from public sitemap');
assert(read('dist/robots.txt') === robots, 'dist robots.txt differs from public robots.txt');
assert(read('dist/llms.txt') === llms, 'dist llms.txt differs from public llms.txt');

const personCoreSignatures = new Set();
for (const [pathname, file] of staticRoutes) {
  const html = read(file);
  const canonicalUrl = canonicalUrlFor(pathname);
  const isIndexable = sitemapPaths.has(pathname);
  const expectedRobots = isIndexable ? 'index,follow' : 'noindex,nofollow';

  assert(html.includes('<main class="seo-static-crawl-content">'), `${pathname}: static semantic main is missing`);
  assert(/<h1\b/i.test(html), `${pathname}: static H1 is missing`);

  const canonicalLinks = linkTags(html, 'canonical');
  assert(canonicalLinks.length === 1, `${pathname}: expected exactly one canonical link`);
  assert(attr(canonicalLinks[0], 'href') === canonicalUrl, `${pathname}: canonical link mismatch`);

  const llmsAlternates = linkTags(html, 'alternate').filter((tag) => attr(tag, 'type') === 'text/plain');
  assert(
    llmsAlternates.length === 1 && attr(llmsAlternates[0], 'href') === '/llms.txt',
    `${pathname}: llms.txt alternate discovery link drifted`,
  );

  const icons = linkTags(html, 'icon');
  assert(
    icons.some((tag) => attr(tag, 'type') === 'image/svg+xml'
      && attr(tag, 'sizes') === 'any'
      && attr(tag, 'href') === '/favicon.svg'),
    `${pathname}: scalable favicon discovery link drifted`,
  );
  assert(
    icons.some((tag) => attr(tag, 'type') === 'image/png'
      && attr(tag, 'sizes') === '32x32'
      && attr(tag, 'href') === '/favicon-32x32.png'),
    `${pathname}: 32px favicon discovery link drifted`,
  );
  const touchIcons = linkTags(html, 'apple-touch-icon');
  assert(
    touchIcons.length === 1
      && attr(touchIcons[0], 'sizes') === '180x180'
      && attr(touchIcons[0], 'href') === '/apple-touch-icon.png',
    `${pathname}: Apple Touch icon discovery link drifted`,
  );
  const themeColors = metaTags(html, 'name', 'theme-color');
  assert(
    themeColors.length === 1 && attr(themeColors[0], 'content') === '#f1efe8',
    `${pathname}: browser theme color drifted`,
  );

  const robotsMeta = metaTags(html, 'name', 'robots');
  assert(robotsMeta.length === 1, `${pathname}: expected exactly one robots meta tag`);
  assert(
    (attr(robotsMeta[0], 'content') ?? '').toLowerCase().replace(/\s+/g, '') === expectedRobots,
    `${pathname}: robots meta must be ${expectedRobots}`,
  );

  const descriptions = metaTags(html, 'name', 'description');
  assert(descriptions.length === 1, `${pathname}: expected exactly one meta description`);
  const description = attr(descriptions[0], 'content') ?? '';
  assert(description.length >= 70 && description.length <= 190, `${pathname}: description length outside 70-190`);

  const titles = [...headFromHtml(html).matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => match[1]);
  assert(titles.length === 1, `${pathname}: expected exactly one title`);
  assert(titles[0].length >= 10 && titles[0].length <= 70, `${pathname}: title length outside 10-70`);

  const ogUrls = metaTags(html, 'property', 'og:url');
  assert(ogUrls.length === 1 && attr(ogUrls[0], 'content') === canonicalUrl, `${pathname}: og:url mismatch`);

  const scripts = jsonLdScripts(html);
  assert(scripts.length === 1, `${pathname}: expected exactly one JSON-LD script`);
  const jsonLd = graph(html);
  const ids = jsonLd.map((item) => item['@id']).filter((id) => typeof id === 'string');
  assert(new Set(ids).size === ids.length, `${pathname}: duplicate JSON-LD @id values`);
  assert(!html.includes('/ai-information#sulayman-bowles'), `${pathname}: stale Person ID`);

  const person = jsonLd.find((item) => hasType(item, 'Person') && item['@id'] === personId);
  if (person) {
    assert(person.name === 'Sulayman Bowles', `${pathname}: Person name drifted`);
    assert(person.url === siteUrl, `${pathname}: Person URL drifted`);
    assert(person.mainEntityOfPage === `${siteUrl}/about`, `${pathname}: Person mainEntityOfPage drifted`);
    assert(Array.isArray(person.sameAs) && person.sameAs.length >= 3, `${pathname}: Person sameAs evidence is incomplete`);
    assert(new Set(person.sameAs).size === person.sameAs.length, `${pathname}: duplicate Person sameAs entries`);
    assert(person.sameAs.every((url) => /^https:\/\//.test(url)), `${pathname}: non-HTTPS Person sameAs entry`);
    personCoreSignatures.add(JSON.stringify({
      name: person.name,
      url: person.url,
      mainEntityOfPage: person.mainEntityOfPage,
      sameAs: [...person.sameAs].sort(),
      identifier: person.identifier,
      subjectOf: person.subjectOf,
    }));
  }

  if (isIndexable) {
    assert(person, `${pathname}: missing canonical Person schema`);
    const website = jsonLd.find((item) => hasType(item, 'WebSite') && item['@id'] === websiteId);
    assert(website, `${pathname}: missing canonical WebSite schema`);
    assert(website.url === siteUrl, `${pathname}: WebSite URL drifted`);
    assert(website.publisher?.['@id'] === personId, `${pathname}: WebSite publisher drifted`);
    assert(website.about?.some((item) => item['@id'] === personId), `${pathname}: WebSite about omits Person`);
    assert(website.about?.some((item) => item['@id'] === atlasSoftwareId), `${pathname}: WebSite about omits Atlas`);
    assert(website.about?.some((item) => item['@id'] === voidAgencyId), `${pathname}: WebSite about omits Void Agency`);

    const pages = jsonLd.filter((item) => hasType(item, 'WebPage') && item.url === canonicalUrl);
    assert(pages.length === 1, `${pathname}: expected one canonical WebPage schema`);
    const page = pages[0];
    assert(page['@id'] === `${canonicalUrl}#webpage`, `${pathname}: WebPage @id mismatch`);
    assert(page.isPartOf?.['@id'] === websiteId, `${pathname}: WebPage isPartOf mismatch`);
    assert(page.primaryImageOfPage?.['@id'] === primaryImageId, `${pathname}: WebPage primary image ID drifted`);
    const mainEntityId = page.mainEntity?.['@id'];
    if (mainEntityId) {
      assert(ids.includes(mainEntityId), `${pathname}: WebPage mainEntity does not resolve in the graph`);
    }

    const articles = jsonLd.filter((item) => hasType(item, 'Article'));
    if (articles.length > 0) {
      assert(articles.length === 1, `${pathname}: expected one Article schema`);
      const article = articles[0];
      assert(article['@id'] === `${canonicalUrl}#article`, `${pathname}: Article @id mismatch`);
      assert(article.url === canonicalUrl, `${pathname}: Article URL mismatch`);
      assert(article.author?.['@id'] === personId, `${pathname}: Article author mismatch`);
      assert(article.publisher?.['@id'] === personId, `${pathname}: Article publisher mismatch`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished), `${pathname}: invalid Article datePublished`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(article.dateModified), `${pathname}: invalid Article dateModified`);
      assert(article.dateModified >= article.datePublished, `${pathname}: Article modified date predates publication`);
      assert(
        article.dateModified === sitemapByPath.get(pathname)?.lastmod,
        `${pathname}: Article dateModified and sitemap lastmod differ`,
      );
    }
  }
}
assert(personCoreSignatures.size === 1, 'canonical Person evidence drifted across generated route graphs');

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
assert(textFromHtml(research).includes('27 Notes and Artifacts'), 'research: publication count is not derived as twenty-seven');
assert(textFromHtml(research).includes('The First AI Managers'), 'research: featured article missing');
assert(textFromHtml(research).includes('Who Owns Austin’s Home-Service Companies?'), 'research: Austin home-service ownership article missing');
assert(textFromHtml(research).includes('Who Funds Waymo’s Hardware?'), 'research: Waymo financing article missing');
assert(textFromHtml(research).includes('How Airlines Borrow Against Loyalty Programs'), 'research: airline loyalty financing article missing');
assert(textFromHtml(research).includes('Who Owns West Campus Student Housing?'), 'research: West Campus housing article missing');
assert(textFromHtml(research).includes('What Happens When an Index Decides a Company Matters?'), 'research: index-company article missing');

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

const indexCompany = read('dist/research/financial-systems/what-happens-when-an-index-decides-a-company-matters/index.html');
for (const expected of [
  'What Happens When an Index Decides a Company Matters?',
  'The effective close: Tesla enters',
  'Four different systems decide who gets in',
  'How a rule becomes a market order',
  'The index effect changed by era',
  'Inclusion does not automatically lower the cost of capital',
  'Methodology and five interpretation limits',
]) {
  assert(textFromHtml(indexCompany).includes(expected), `Index company: missing ${expected}`);
}
for (const href of [
  '/research/index-company-matters-evidence-audit.pdf',
  '/research/index-company-matters-evidence-audit.docx',
  '/images/research/index-provider-revenue-mix.png',
  '/images/research/index-migration-net-demand.png',
  '/images/research/tesla-sp500-inclusion-price-path.png',
  '/images/research/index-effect-by-era.png',
]) {
  assert(indexCompany.includes(`href="${href}"`) || indexCompany.includes(`src="${href}"`), `Index company: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `Index company: missing public file ${href}`);
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
  'Who Funds Waymo’s Hardware?',
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

const westCampus = read('dist/research/financial-systems/west-campus-student-housing/index.html');
for (const expected of [
  'Who Owns West Campus Student Housing?',
  '4,805 BEDS',
  'High property margins are not high owner returns',
  'Modeled refinancing gap under the combined stress',
  'What the evidence still cannot answer',
  'Six-property financial model',
]) {
  assert(textFromHtml(westCampus).includes(expected), `West Campus housing: missing ${expected}`);
}
for (const href of [
  '/research/west-campus-investigative-report.pdf',
  '/research/west-campus-investigative-report.docx',
  '/research/west-campus-executive-analytical-memo.docx',
  '/research/west-campus-property-models.xlsx',
  '/research/west-campus-dossiers-methodology-claims.docx',
  '/images/research/west-campus-properties-map.png',
  '/images/research/west-campus-noi-margin.png',
  '/images/research/west-campus-capital-stack.png',
  '/images/research/waterloo-development-stress.png',
  '/images/research/waterloo-residual-land-value.png',
  '/images/research/west-campus-prelease-points.png',
  '/images/research/west-campus-equity-stress.png',
]) {
  assert(westCampus.includes(`href="${href}"`) || westCampus.includes(`src="${href}"`), `West Campus housing: missing artifact ${href}`);
  assert(fs.existsSync(path.resolve(`public${href}`)), `West Campus housing: missing public file ${href}`);
}

const toll = read('dist/markets/who-owns-texas-toll-roads/index.html');
assert(/<sup class="article-citation"><a href="#source-s1"/.test(toll), 'toll roads: citation markers are not linked superscripts');
assert(!toll.includes('shareholders.S1S2S3'), 'toll roads: citation markers remain adjacent to prose');
assert(toll.includes('<title>Who Owns Texas Toll Roads? Public Owners &amp; 4 Concessions</title>'), 'toll roads: gated title variant changed');
assert(
  toll.includes('Most Texas toll roads are publicly owned. See the four major private concessions, who operates each road, who collects toll revenue, and where ownership ends.'),
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

for (const retired of retiredPaths) assert(!sitemap.includes(`${siteUrl}${retired}`), `sitemap: retired path remains ${retired}`);
for (const retired of retiredArchivePaths) assert(!sitemap.includes(`${siteUrl}${retired}`), `sitemap: retired archive path remains ${retired}`);
assert(!sitemap.includes(`${siteUrl}/markets/archived-research-methodology`), 'sitemap: noindex archive methodology is included');

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

console.log(
  `SEO and content-remediation verification passed for ${sitemapPaths.size} indexable routes, ${staticRoutes.size - sitemapPaths.size} generated noindex routes, ${crawlerAgents.length} crawler tokens, and ${llmsLinks.length} llms.txt references.`,
);
