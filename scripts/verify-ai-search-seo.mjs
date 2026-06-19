import fs from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://sulayman-bowles.dev';

const routeFiles = {
  home: 'dist/index.html',
  about: 'dist/about/index.html',
  atlas: 'dist/atlas/index.html',
  resume: 'dist/resume/index.html',
  simple: 'dist/simple/index.html',
  aiInformation: 'dist/ai-information/index.html',
  method: 'dist/method/index.html',
  markets: 'dist/markets/index.html',
};

const routePaths = {
  home: '/',
  about: '/about',
  atlas: '/atlas',
  resume: '/resume',
  simple: '/simple',
  aiInformation: '/ai-information',
  method: '/method',
  markets: '/markets',
};

const marketFiles = [
  'dist/markets/network-monopolies/index.html',
  'dist/markets/computational-commodity-systems/index.html',
  'dist/markets/fiat-horizon/index.html',
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

function findType(graph, type, id) {
  return graph.find((item) => item['@type'] === type && (!id || item['@id'] === id));
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

for (const [route, file] of Object.entries(routeFiles)) {
  const html = read(file);
  const graph = jsonLdGraph(html);
  const person = findType(graph, 'Person', `${siteUrl}/#person`);
  const org = findType(graph, 'Organization', `${siteUrl}/#void-agency`);
  const website = findType(graph, 'WebSite', `${siteUrl}/#website`);
  const webPage = findType(graph, 'WebPage', `${absolutePath(routePaths[route])}#webpage`);

  assert(person, `${route}: missing canonical Person schema`);
  assert(person.url === siteUrl, `${route}: Person url must be absolute canonical site URL`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://github.com/SulaymanB2024'), `${route}: Person sameAs missing GitHub`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://www.linkedin.com/in/sulayman-bowles/'), `${route}: Person sameAs missing LinkedIn`);
  assert(Array.isArray(person.sameAs) && person.sameAs.includes('https://devpost.com/sulayman-bowles'), `${route}: Person sameAs missing Devpost`);
  assert(graphUrls(person.subjectOf).includes(`${siteUrl}/ai-information`), `${route}: Person subjectOf missing AI Information`);
  assert(graphUrls(person.subjectOf).includes('https://devpost.com/sulayman-bowles'), `${route}: Person subjectOf missing Devpost`);
  assert(graphUrls(person.subjectOf).includes('https://www.goldenhornet.org/calendar/young-composers-concert-2022'), `${route}: Person subjectOf missing Golden Hornet historical source`);
  assert(graphUrls(person.subjectOf).includes('https://music.utexas.edu/events/4645-university-orchestra'), `${route}: Person subjectOf missing UT Butler historical source`);
  assert(propertyValues(person.identifier).includes('SulaymanB2024'), `${route}: Person identifier missing GitHub username`);
  assert(String(person.logo?.url ?? person.logo).startsWith(siteUrl), `${route}: Person logo must be absolute`);

  assert(org, `${route}: missing canonical Organization schema`);
  assert(org.url === 'https://www.void-agency.com/', `${route}: Organization url must be absolute Void Agency URL`);
  assert(Array.isArray(org.sameAs) && org.sameAs.includes('https://www.void-agency.com/'), `${route}: Organization sameAs missing Void Agency`);
  assert(String(org.logo?.url ?? org.logo).startsWith(siteUrl), `${route}: Organization logo must be absolute`);

  assert(website, `${route}: missing shared WebSite schema`);
  assert(webPage, `${route}: missing canonical WebPage schema`);
  assert(webPage.url === absolutePath(routePaths[route]), `${route}: WebPage url must match canonical route URL`);
  assert(webPage.isPartOf?.['@id'] === `${siteUrl}/#website`, `${route}: WebPage must be part of shared WebSite`);

  const title = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  assert(title.replaceAll('&amp;', '&').length <= 62, `${route}: title is too long (${title.length})`);

  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  assert(h1Count === 1, `${route}: expected exactly one static H1, found ${h1Count}`);
}

assertVisibleText('dist/ai-information/index.html', [
  'Identity reconciliation',
  "Earlier public sources describe Sulayman's classical bass and composition background through Golden Hornet, McCallum, and UT Butler.",
  'Golden Hornet',
  'UT Butler',
  'Public Source Graph',
  'Primary source',
  'Code evidence',
  'Professional profile',
  'Agency',
  'Projects',
  'Academic context',
  'Earlier music background',
  'Research artifacts',
  'Clarifications / what not to infer',
  'Fan-Out Query Map',
  'Original query',
  'Likely fan-out queries',
  'Best page to satisfy them',
  'Missing content',
  'Recommended edit',
  'Who is Sulayman Bowles?',
  'What is Atlas SEO Audit Console?',
  'What does Void Agency do?',
  'Does Sulayman Bowles work on AI search visibility?',
  'Is Sulayman Bowles an SEO person, finance person, or software builder?',
  "What public evidence supports Sulayman Bowles's technical SEO work?",
  'Crawler and Indexation Signals',
  'Canonical host: https://sulayman-bowles.dev.',
  'The www host redirects to the apex canonical host.',
  'Robots.txt explicitly allows Googlebot, Bingbot, and DuckDuckBot.',
  'Brave Search does not publish a separate crawler user agent',
  'Robots.txt explicitly allows OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User',
  'The old Sulayman_Bowles_Resume_2025.pdf URL redirects to /resume',
  'Search Console, Bing Webmaster Tools, and IndexNow submissions are discovery and recrawl signals',
  'Provider Discovery Plan',
  'Google Search and Google AI surfaces',
  'Bing, Microsoft Copilot, and Bing-powered search partners',
  'Brave Search',
  'DuckDuckGo',
  'ChatGPT search and OpenAI retrieval',
  'Claude search and user-requested retrieval',
  'Perplexity search and user-requested retrieval',
]);

{
  const graph = jsonLdGraph(read('dist/ai-information/index.html'));
  const sourceGraphList = findItemList(graph, `${siteUrl}/ai-information#public-source-graph`);
  const fanOutList = findItemList(graph, `${siteUrl}/ai-information#fan-out-query-map`);
  const providerPlanList = findItemList(graph, `${siteUrl}/ai-information#provider-discovery-plan`);
  assert(sourceGraphList, 'ai-information: missing Public Source Graph ItemList schema');
  assert(fanOutList, 'ai-information: missing Fan-Out Query Map ItemList schema');
  assert(providerPlanList, 'ai-information: missing Provider Discovery Plan ItemList schema');
  assert(sourceGraphList.itemListElement?.length === 9, 'ai-information: Public Source Graph ItemList should have 9 items');
  assert(fanOutList.itemListElement?.length === 6, 'ai-information: Fan-Out Query Map ItemList should have 6 items');
  assert(providerPlanList.itemListElement?.length === 7, 'ai-information: Provider Discovery Plan ItemList should have 7 items');
}

assertVisibleText('dist/about/index.html', [
  'Identity reconciliation',
  "Earlier public sources describe Sulayman's classical bass and composition background through Golden Hornet, McCallum, and UT Butler.",
  'Golden Hornet',
  'UT Butler',
  'GitHub',
  'LinkedIn',
  'Void',
  'Atlas',
  'Resume',
]);

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

{
  const graph = jsonLdGraph(read('dist/atlas/index.html'));
  const atlasCheckList = findItemList(graph, `${siteUrl}/atlas#atlas-checks`);
  assert(atlasCheckList, 'atlas: missing Atlas checks ItemList schema');
  assert(atlasCheckList.itemListElement?.length === 12, 'atlas: Atlas checks ItemList should have 12 items');
}

assertVisibleText('dist/method/index.html', [
  'AI Search Visibility Audit Checklist',
  'crawlability',
  'indexability',
  'internal links',
  'structured data',
  'source-page clarity',
  'entity consistency',
  'public proof',
  'sitemap freshness',
  'stale/conflicting source cleanup',
]);

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

  assert(llmsText.includes('Last updated: June 19, 2026'), 'llms.txt: stale last updated date');
  assert(llmsText.includes('## Crawler and Indexation Signals'), 'llms.txt: missing crawler/indexation section');
  assert(llmsText.includes('The www host redirects to the apex canonical host.'), 'llms.txt: missing www canonical redirect fact');
  assert(
    llmsText.includes('Robots.txt explicitly allows Googlebot, Bingbot, and DuckDuckBot.'),
    'llms.txt: missing search crawler allow fact',
  );
  assert(llmsText.includes('## Provider Discovery Plan'), 'llms.txt: missing provider discovery plan');
  assert(llmsText.includes('Brave Search: the site is publicly crawlable'), 'llms.txt: missing Brave discovery plan');
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
  assert(robotsText.includes('Sitemap: https://sulayman-bowles.dev/sitemap.xml'), 'robots.txt: missing sitemap directive');

  for (const agent of expectedAiAgents) {
    const pattern = new RegExp(`User-agent: ${agent}\\nAllow: /`);
    assert(pattern.test(robotsText), `robots.txt: missing explicit Allow for ${agent}`);
  }
}

{
  const graph = jsonLdGraph(read('dist/method/index.html'));
  const methodChecklist = findItemList(graph, `${siteUrl}/method#ai-search-visibility-checklist`);
  assert(methodChecklist, 'method: missing AI Search Visibility Audit Checklist ItemList schema');
  assert(methodChecklist.itemListElement?.length === 9, 'method: audit checklist ItemList should have 9 items');
}

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
  assert(ogImage && ogImage === twitterImage, `${file}: OG and Twitter images must match`);
  assert(ogImage === (article.image?.url ?? article.image), `${file}: Article image must match OG/Twitter image`);
  assert(title.replaceAll('&amp;', '&').length <= 62, `${file}: title is too long (${title.length})`);
  assert(description.length >= 145 && description.length <= 180, `${file}: description should be expanded to 145-180 chars (${description.length})`);
}

console.log('AI-search SEO verification passed');
