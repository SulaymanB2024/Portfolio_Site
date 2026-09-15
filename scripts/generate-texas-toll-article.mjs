import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const partsDirectory = path.join(root, 'src/content/texasTollRoadFinanceStatic');
const outputDirectory = path.join(root, 'public/research/financial-systems');
const outputPath = path.join(outputDirectory, 'why-texas-toll-roads-stay-tolled.html');
const directoryOutputPath = path.join(outputDirectory, 'why-texas-toll-roads-stay-tolled', 'index.html');
const siteUrl = 'https://sulayman-bowles.dev';
const canonicalPath = '/research/financial-systems/why-texas-toll-roads-stay-tolled';
const canonicalUrl = `${siteUrl}${canonicalPath}`;
const personId = `${siteUrl}/about#sulayman-bowles`;
const websiteId = `${siteUrl}/#website`;

const partNames = (await readdir(partsDirectory))
  .filter((name) => /^\d{2}\.html$/.test(name))
  .sort();

if (partNames.length !== 8) {
  throw new Error(`Expected 8 Texas toll-road article fragments; found ${partNames.length}.`);
}

const fragments = await Promise.all(
  partNames.map((name) => readFile(path.join(partsDirectory, name), 'utf8')),
);
let article = fragments.join('');

const requiredSignals = [
  '<h1>Why Texas Toll Roads Stay Tolled: Where the Money Goes After Construction</h1>',
  'texas-toll-roads-stay-tolled-100.svg',
  'texas-toll-roads-stay-tolled-financial-model-2025.xlsx',
  'Texas Transportation Code Chapter 284',
  'application/ld+json',
];
for (const signal of requiredSignals) {
  if (!article.includes(signal)) {
    throw new Error(`Texas toll-road article is missing required signal: ${signal}`);
  }
}

article = article
  .replace('<meta name="robots" content="index,follow,max-image-preview:large" />', '<meta name="robots" content="index,follow" />')
  .replace(
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />\n  <link rel="alternate" type="text/plain" title="LLMs text" href="/llms.txt" />`,
  )
  .replace('  <main>\n', '  <main class="seo-static-crawl-content" data-public-document="ready">\n');

const jsonLdPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
const jsonLdMatch = article.match(jsonLdPattern);
if (!jsonLdMatch) throw new Error('Texas toll-road article JSON-LD source is missing.');
const sourceArticle = JSON.parse(jsonLdMatch[1]);
const { '@context': _sourceContext, ...articleNode } = sourceArticle;
Object.assign(articleNode, {
  '@type': 'Article',
  '@id': `${canonicalUrl}#article`,
  url: canonicalUrl,
  author: { '@id': personId },
  publisher: { '@id': personId },
});

const title = 'Why Texas Toll Roads Stay Tolled: Where the Money Goes After Construction';
const description = 'Audited records show why Texas toll roads stay tolled after construction, tracing operations, debt, reserves, public transfers, and private concessions.';
const authorityGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Sulayman Bowles',
      url: siteUrl,
      jobTitle: 'Technical systems builder',
      mainEntityOfPage: `${siteUrl}/about`,
      description: 'Sulayman Bowles is a UT Austin finance student and Growth & Product Intern at Chegg. He builds Atlas technical SEO software, runs Void Agency, and publishes research on AI systems, infrastructure, and ownership.',
      sameAs: [
        'https://www.linkedin.com/in/sulayman-bowles/',
        'https://github.com/SulaymanB2024',
        'https://devpost.com/sulayman-bowles',
        'https://sulayman-bowles.tech/',
      ],
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'canonical domain', value: 'sulayman-bowles.dev' },
        { '@type': 'PropertyValue', propertyID: 'GitHub username', value: 'SulaymanB2024' },
      ],
      subjectOf: [
        { '@id': `${siteUrl}/about#webpage` },
        { '@type': 'WebPage', name: 'Void Agency', url: 'https://www.void-agency.com/', description: 'Public agency branch connected to technical SEO, crawlability, structured content, analytics, and practical audits.' },
        { '@type': 'WebPage', name: 'Sulayman Bowles Technical Ledger', url: 'https://sulayman-bowles.tech/', description: 'Public technical ledger for projects, experiments, files, and competition records connected to the main identity site.' },
      ],
      affiliation: [
        { '@type': 'CollegeOrUniversity', name: 'The University of Texas at Austin', url: 'https://www.utexas.edu/' },
        { '@type': 'CollegeOrUniversity', name: 'McCombs School of Business', url: 'https://www.mccombs.utexas.edu/' },
      ],
      knowsLanguage: ['English'],
      knowsAbout: ['Technical SEO', 'Technical SEO consulting', 'Technical SEO audit software', 'AI product management', 'Technical systems', 'Crawlability', 'Indexation', 'Structured data', 'Investment research', 'Music composition', 'Atlas SEO Audit Console', 'Void Agency'],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: 'Sulayman Bowles',
      url: siteUrl,
      description: 'Personal site for Sulayman Bowles covering Atlas, technical SEO, search visibility, finance research, public source context, and selected work.',
      keywords: ['Sulayman Bowles', 'technical SEO', 'AI product', 'technical systems builder'],
      inLanguage: 'en-US',
      publisher: { '@id': personId },
      about: [{ '@id': personId }, { '@id': `${siteUrl}/atlas#software` }, { '@id': `${siteUrl}/#void-agency` }],
      hasPart: [
        { '@type': 'WebPage', name: 'About Sulayman Bowles', url: `${siteUrl}/about` },
        { '@type': 'WebPage', name: 'Technical SEO and AI Systems Portfolio', url: `${siteUrl}/work` },
        { '@type': 'WebPage', name: 'Atlas Technical SEO Audit Software', url: `${siteUrl}/atlas` },
        { '@type': 'WebPage', name: 'Technical SEO Audit Services', url: `${siteUrl}/method` },
        { '@type': 'WebPage', name: 'Technical SEO Consultant Contact', url: `${siteUrl}/contact` },
        { '@type': 'WebPage', name: 'Technical SEO and AI Systems Research', url: `${siteUrl}/research` },
      ],
    },
    articleNode,
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: title,
      url: canonicalUrl,
      description,
      inLanguage: 'en-US',
      isPartOf: { '@id': websiteId },
      mainEntity: { '@id': `${canonicalUrl}#article` },
      about: [{ '@id': personId }],
      primaryImageOfPage: { '@type': 'ImageObject', '@id': `${siteUrl}/#primaryimage`, url: `${siteUrl}/og-default.png`, contentUrl: `${siteUrl}/og-default.png` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'Research', item: `${siteUrl}/research` },
        { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
      ],
    },
  ],
};
article = article.replace(jsonLdPattern, `<script type="application/ld+json">${JSON.stringify(authorityGraph)}</script>`);

await mkdir(outputDirectory, { recursive: true });
await mkdir(path.dirname(directoryOutputPath), { recursive: true });
await Promise.all([
  writeFile(outputPath, article, 'utf8'),
  writeFile(directoryOutputPath, article, 'utf8'),
]);
console.log(`Generated canonical flat/directory copies for ${path.relative(root, outputPath)} from ${partNames.length} reviewed fragments.`);