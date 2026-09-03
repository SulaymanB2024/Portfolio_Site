import fs from 'node:fs';
import path from 'node:path';

import {
  createArticleNavigation,
  type ArticleNavigationSeed,
} from '../src/components/ArticleLayout';
import {
  AI_MANAGERS_ARTICLE_PATH,
  AI_MANAGERS_ARTICLE_SECTIONS,
} from '../src/content/aiManagersArticle';
import { ALL_ARTICLES, INDEXABLE_ARTICLES, getArticlePath } from '../src/content/articleRegistry';
import { PUBLICATION_INDEX } from '../src/content/publicationIndex';
import { TECHNICAL_ARTICLE_SERIES } from '../src/content/technicalArticleSeries';
import { TEXAS_TOLL_ARTICLE_SECTIONS } from '../src/content/texasTollRoadArticle';
import { TEXAS_TOLL_ARTICLE_SLUG } from '../src/content/texasTollRoadArticleMeta';
import {
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_MARKDOWN,
  VIRALBENCH_ARTICLE_PATH,
  VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../src/content/viralBenchArticle';
import { getSeoRoute } from '../src/seo/routes';
import { buildRouteStaticHtml } from '../src/seo/staticContent';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function wordCount(value: string) {
  return value.trim().match(/\b[\p{L}\p{N}][\p{L}\p{N}’'/-]*\b/gu)?.length ?? 0;
}

function proseFor(article: (typeof TECHNICAL_ARTICLE_SERIES)[number]) {
  return [
    ...article.content,
    ...(article.sections ?? []).flatMap((section) => [
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
  ].join(' ');
}

function duplicateValues(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function normalizedWords(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}']+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

type ImageDimensions = { width: number; height: number };

function imageDimensions(filePath: string): ImageDimensions {
  const buffer = fs.readFileSync(filePath);

  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    const startOfFrameMarkers = new Set([
      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
      0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
    ]);
    let offset = 2;

    while (offset < buffer.length) {
      while (buffer[offset] === 0xff) offset += 1;
      const marker = buffer[offset];
      offset += 1;
      if (marker === 0xd8 || marker === 0xd9) continue;
      if (marker === 0xda || offset + 1 >= buffer.length) break;

      const segmentLength = buffer.readUInt16BE(offset);
      if (startOfFrameMarkers.has(marker)) {
        return {
          width: buffer.readUInt16BE(offset + 5),
          height: buffer.readUInt16BE(offset + 3),
        };
      }
      offset += segmentLength;
    }
  }

  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    const chunk = buffer.subarray(12, 16).toString('ascii');
    if (chunk === 'VP8X') {
      const width = 1 + buffer[24] + (buffer[25] << 8) + (buffer[26] << 16);
      const height = 1 + buffer[27] + (buffer[28] << 8) + (buffer[29] << 16);
      return { width, height };
    }
    if (chunk === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      };
    }
  }

  throw new Error(`Unsupported image header: ${filePath}`);
}

function publicAssetPath(assetPath: string) {
  assert(assetPath.startsWith('/'), `artwork path must be root-relative: ${assetPath}`);
  return path.resolve('public', assetPath.slice(1));
}

function assertSharedReaderSource(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf8');
  assert(source.includes('ArticleReaderConfig'), `${filePath}: missing typed ArticleReaderConfig`);
  assert(source.includes('<ArticleReader config={config}>'), `${filePath}: does not render the shared ArticleReader`);
  assert(source.includes('createArticleNavigation'), `${filePath}: does not use shared navigation normalization`);
  assert(!source.includes('metadata={['), `${filePath}: still declares free-form reader metadata`);
  assert(!source.includes('<ArticlePage'), `${filePath}: bypasses the shared reader configuration`);
  assert(!source.includes('<ArticleHero'), `${filePath}: bypasses the shared reader configuration`);
}

const articleLayoutSource = fs.readFileSync('src/components/ArticleLayout.tsx', 'utf8');
assert(
  articleLayoutSource.includes('export function useArticleHashNavigation()'),
  'shared reader must export useArticleHashNavigation',
);
assert(
  articleLayoutSource.includes('useArticleHashNavigation();'),
  'ArticlePage must activate shared hash navigation',
);
assert(
  articleLayoutSource.includes("window.addEventListener('hashchange', handleLocationChange)"),
  'shared hash navigation must respond to hash changes',
);
assert(
  articleLayoutSource.includes("boundaryLabel = 'Boundary'"),
  'ArticleBody must keep the optional boundaryLabel contract',
);

function assertNavigationContract(
  owner: string,
  seeds: ArticleNavigationSeed[],
  targetIds: string[],
) {
  const items = createArticleNavigation(seeds);
  const itemIds = items.map((item) => item.id);

  assert(duplicateValues(itemIds).length === 0, `${owner}: navigation contains duplicate targets`);
  assert(duplicateValues(targetIds).length === 0, `${owner}: article contains duplicate anchor IDs`);
  assert(
    itemIds.length === targetIds.length && itemIds.every((id) => targetIds.includes(id)),
    `${owner}: navigation targets do not match rendered article anchors`,
  );
  assert(items[0]?.id === 'overview' && items[0]?.index === '00', `${owner}: navigation must begin with 00 Overview`);
  assert(items.at(-1)?.index === 'S', `${owner}: navigation must end with S Source ledger`);

  const faqIndex = items.findIndex((item) => item.index === 'FAQ');
  if (faqIndex >= 0) {
    assert(faqIndex === items.length - 2, `${owner}: FAQ must precede the source ledger`);
  }

  const sequentialIndexes = items
    .filter((item) => item.index !== '00' && item.index !== 'FAQ' && item.index !== 'S')
    .map((item) => item.index);
  const expectedIndexes = sequentialIndexes.map((_, index) => String(index + 1).padStart(2, '0'));
  assert(
    sequentialIndexes.join(',') === expectedIndexes.join(','),
    `${owner}: numbered navigation sections must be sequential`,
  );
}

function articleHeadingIds(markdown: string) {
  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm)).map((match) => (
    match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  ));
}

function assertArtworkAsset(
  owner: string,
  role: 'hero' | 'social',
  assetPath: string,
  expected: ImageDimensions,
) {
  const filePath = publicAssetPath(assetPath);
  assert(fs.existsSync(filePath), `${owner}: ${role} artwork is missing: ${assetPath}`);
  const actual = imageDimensions(filePath);
  assert(
    actual.width === expected.width && actual.height === expected.height,
    `${owner}: ${role} artwork must be ${expected.width}x${expected.height}, got ${actual.width}x${actual.height}: ${assetPath}`,
  );
}

function crossArticleDuplicatePassages(wordsPerPassage: number) {
  const owners = new Map<string, Set<string>>();

  for (const article of TECHNICAL_ARTICLE_SERIES) {
    const words = normalizedWords(proseFor(article));
    const seen = new Set<string>();
    for (let index = 0; index <= words.length - wordsPerPassage; index += 1) {
      seen.add(words.slice(index, index + wordsPerPassage).join(' '));
    }
    for (const passage of seen) {
      const slugs = owners.get(passage) ?? new Set<string>();
      slugs.add(article.slug);
      owners.set(passage, slugs);
    }
  }

  return [...owners.entries()]
    .filter(([, slugs]) => slugs.size > 1)
    .map(([passage, slugs]) => ({ passage, slugs: [...slugs].sort() }));
}

assert(TECHNICAL_ARTICLE_SERIES.length === 10, 'article series must contain exactly 10 articles');
assert(
  duplicateValues(TECHNICAL_ARTICLE_SERIES.map((article) => article.slug)).length === 0,
  'article series contains duplicate slugs',
);
assert(
  duplicateValues(TECHNICAL_ARTICLE_SERIES.map((article) => article.title)).length === 0,
  'article series contains duplicate titles',
);

assert(
  !JSON.stringify(ALL_ARTICLES).includes('/og-default.png'),
  'public article data must not use the /og-default.png artwork sentinel',
);

const archivedMethodology = ALL_ARTICLES.find((article) => article.slug === 'archived-research-methodology');
assert(archivedMethodology?.indexable === false, 'archive methodology must remain noindex');
assert(
  archivedMethodology.artwork.kind === 'study' && archivedMethodology.artwork.variant === 'triptych',
  'archive methodology must use the explicit triptych study artwork',
);

const artworkRecords = [
  ...INDEXABLE_ARTICLES.flatMap((article) => {
    if (article.artwork.kind === 'study') {
      assert(
        Boolean(article.artwork.label && article.artwork.note),
        `${article.slug}: study artwork requires a visible label and evidence note`,
      );
      return [];
    }
    return {
      owner: article.slug,
      heroSrc: article.artwork.heroSrc,
      socialSrc: article.artwork.socialSrc,
      copy: `${article.artwork.label} ${article.artwork.caption}`,
    };
  }),
  {
    owner: 'viralbench-codex-agent-harness',
    heroSrc: VIRALBENCH_ARTICLE_IMAGE,
    socialSrc: VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
    copy: VIRALBENCH_ARTICLE_TITLE,
  },
];

assert(
  duplicateValues(artworkRecords.map((record) => record.heroSrc)).length === 0,
  'indexable article hero artwork must be unique',
);
assert(
  duplicateValues(artworkRecords.map((record) => record.socialSrc)).length === 0,
  'indexable article social artwork must be unique',
);

for (const artwork of artworkRecords) {
  assert(artwork.heroSrc !== artwork.socialSrc, `${artwork.owner}: heroSrc and socialSrc must be separate assets`);
  assert(
    !/(?:\bpending\b|\breserved\b|\bplaceholder\b|will replace)/i.test(artwork.copy),
    `${artwork.owner}: artwork copy contains placeholder language`,
  );
  assertArtworkAsset(artwork.owner, 'hero', artwork.heroSrc, { width: 1800, height: 1200 });
  assertArtworkAsset(artwork.owner, 'social', artwork.socialSrc, { width: 1200, height: 630 });
}

[
  'src/pages/MarketArticlePage.tsx',
  'src/pages/AiManagersArticlePage.tsx',
  'src/pages/ViralBenchArticlePage.tsx',
  'src/pages/TexasTollRoadArticlePage.tsx',
].forEach(assertSharedReaderSource);

for (const article of INDEXABLE_ARTICLES) {
  const routePath = getArticlePath(article);
  const route = getSeoRoute(routePath);

  assert(route, `${routePath}: canonical SEO route is missing`);
  assert(route.path === routePath, `${routePath}: SEO route is not self-canonical`);
  assert(route.h1 === article.title, `${routePath}: canonical h1 does not match the article title`);
  assert(route.description === article.seoDescription, `${routePath}: canonical description does not match article metadata`);
  assert(route.includeInSitemap && !route.noindex, `${routePath}: indexable article has conflicting canonical indexation metadata`);
  const metadataImage = article.artwork.kind === 'image' ? article.artwork.socialSrc : route.image;
  assert(metadataImage, `${routePath}: canonical metadata requires an image`);
  if (article.artwork.kind === 'image') {
    assert(route.image === metadataImage, `${routePath}: metadata must use socialSrc`);
  }
  assert(
    JSON.stringify(route.jsonLd).includes(metadataImage),
    `${routePath}: Article structured data must use the canonical metadata image`,
  );
}

const viralBenchRoute = getSeoRoute(VIRALBENCH_ARTICLE_PATH);
assert(viralBenchRoute?.path === VIRALBENCH_ARTICLE_PATH, 'ViralBench canonical route is missing');
assert(viralBenchRoute.image === VIRALBENCH_ARTICLE_SOCIAL_IMAGE, 'ViralBench metadata must use socialSrc');
assert(
  JSON.stringify(viralBenchRoute.jsonLd).includes(VIRALBENCH_ARTICLE_SOCIAL_IMAGE),
  'ViralBench structured data must use socialSrc',
);

for (const article of INDEXABLE_ARTICLES) {
  const routePath = getArticlePath(article);
  if (routePath === AI_MANAGERS_ARTICLE_PATH || article.slug === TEXAS_TOLL_ARTICLE_SLUG) continue;

  const faqSections = (article.sections ?? []).filter((section) => section.id.toLowerCase().includes('faq'));
  const numberedSections = (article.sections ?? []).filter((section) => !section.id.toLowerCase().includes('faq'));
  const seeds: ArticleNavigationSeed[] = [
    { kind: 'overview', id: 'overview', label: 'Overview' },
    ...numberedSections.map((section) => ({
      kind: 'section' as const,
      id: section.id,
      label: section.title,
    })),
    ...(article.kind === 'investment-memo'
      ? [{ kind: 'section' as const, id: 'decision-frame', label: 'Decision frame' }]
      : []),
    ...(article.resources?.length
      ? [{ kind: 'section' as const, id: 'downloads', label: 'Downloads' }]
      : []),
    ...faqSections.map((section) => ({
      kind: 'faq' as const,
      id: section.id,
      label: section.title,
    })),
    { kind: 'source', id: 'source-ledger', label: 'Source ledger' },
  ];
  const targetIds = [
    'overview',
    ...(article.sections ?? []).map((section) => section.id),
    ...(article.kind === 'investment-memo' ? ['decision-frame'] : []),
    ...(article.resources?.length ? ['downloads'] : []),
    'source-ledger',
  ];
  assertNavigationContract(routePath, seeds, targetIds);
}

const aiManagerSeeds: ArticleNavigationSeed[] = [
  { kind: 'overview', id: 'overview', label: 'Overview' },
  ...AI_MANAGERS_ARTICLE_SECTIONS.map((section) => ({
    kind: 'section' as const,
    id: section.id,
    label: section.title,
  })),
  { kind: 'faq', id: 'frequently-asked-questions', label: 'Direct answers' },
  { kind: 'source', id: 'source-ledger', label: 'Source ledger' },
];
assertNavigationContract(
  AI_MANAGERS_ARTICLE_PATH,
  aiManagerSeeds,
  [
    'overview',
    ...AI_MANAGERS_ARTICLE_SECTIONS.map((section) => section.id),
    'frequently-asked-questions',
    'source-ledger',
  ],
);

const texasTollSeeds: ArticleNavigationSeed[] = [
  { kind: 'overview', id: 'overview', label: 'Overview' },
  ...TEXAS_TOLL_ARTICLE_SECTIONS.map((section) => ({
    kind: 'section' as const,
    id: section.id,
    label: section.title,
  })),
  { kind: 'section', id: 'what-remains-unknown', label: 'What remains unknown' },
  { kind: 'faq', id: 'frequently-asked-questions', label: 'Direct answers' },
  { kind: 'source', id: 'source-ledger', label: 'Source ledger' },
];
assertNavigationContract(
  `/markets/${TEXAS_TOLL_ARTICLE_SLUG}`,
  texasTollSeeds,
  [
    'overview',
    ...TEXAS_TOLL_ARTICLE_SECTIONS.map((section) => section.id),
    'what-remains-unknown',
    'frequently-asked-questions',
    'source-ledger',
  ],
);

const viralBenchHeadingIds = articleHeadingIds(VIRALBENCH_ARTICLE_MARKDOWN);
const viralBenchNumberedIds = viralBenchHeadingIds.filter(
  (id) => id !== 'frequently-asked-questions' && id !== 'sources-and-technical-notes',
);
const viralBenchSeeds: ArticleNavigationSeed[] = [
  { kind: 'overview', id: 'overview', label: 'Overview' },
  ...viralBenchNumberedIds.map((id) => ({ kind: 'section' as const, id, label: id })),
  { kind: 'faq', id: 'frequently-asked-questions', label: 'Direct answers' },
  { kind: 'source', id: 'source-ledger', label: 'Source ledger' },
];
assertNavigationContract(
  VIRALBENCH_ARTICLE_PATH,
  viralBenchSeeds,
  [
    'overview',
    ...viralBenchNumberedIds,
    'frequently-asked-questions',
    'source-ledger',
  ],
);

const expectedNumbers = Array.from({ length: 10 }, (_, index) => String(index + 5).padStart(2, '0'));
assert(
  TECHNICAL_ARTICLE_SERIES.map((article) => article.number).join(',') === expectedNumbers.join(','),
  `article numbers must be sequential: ${expectedNumbers.join(', ')}`,
);

const duplicatedPassages = crossArticleDuplicatePassages(16);
assert(
  duplicatedPassages.length === 0,
  `article series repeats exact 16-word passages: ${JSON.stringify(duplicatedPassages.slice(0, 3))}`,
);

assert(ALL_ARTICLES.length === 27, `expected 27 canonical articles; found ${ALL_ARTICLES.length}`);
assert(
  duplicateValues(ALL_ARTICLES.map((article) => normalizedWords(article.conclusion.title).join(' '))).length === 0,
  'article conclusion titles must be route-specific',
);
assert(
  duplicateValues(ALL_ARTICLES.map((article) => normalizedWords(article.conclusion.content).join(' '))).length === 0,
  'article conclusion copy must be route-specific',
);

for (const article of ALL_ARTICLES) {
  const routePath = getArticlePath(article);
  const conclusionTitleWords = wordCount(article.conclusion.title);
  const conclusionContentWords = wordCount(article.conclusion.content);

  assert(
    conclusionTitleWords >= 3 && conclusionTitleWords <= 10,
    `${routePath}: conclusion title must contain 3-10 words`,
  );
  assert(
    conclusionContentWords >= 25 && conclusionContentWords <= 55,
    `${routePath}: conclusion must contain 25-55 words`,
  );
  assert(
    !article.conclusion.content.includes('Public evidence and provider behavior can change'),
    `${routePath}: freshness boilerplate belongs in the source note, not the conclusion`,
  );

  const builtFile = path.resolve('dist', routePath.slice(1), 'index.html');
  if (fs.existsSync(builtFile)) {
    const html = fs.readFileSync(builtFile, 'utf8');
    assert(html.includes(article.conclusion.title), `${routePath}: built static conclusion is missing`);
    assert(
      html.includes('id="article-conclusion-title"'),
      `${routePath}: built static conclusion heading is not addressable`,
    );
  }
}

const articleWordCounts: Array<{ slug: string; words: number }> = [];

for (const article of TECHNICAL_ARTICLE_SERIES) {
  const routePath = getArticlePath(article);
  const route = getSeoRoute(routePath);
  const publication = PUBLICATION_INDEX.find((item) => item.href === routePath);
  const proseWords = wordCount(proseFor(article));
  articleWordCounts.push({ slug: article.slug, words: proseWords });
  const sectionIds = article.sections?.map((section) => section.id) ?? [];

  assert(route, `${routePath}: SEO route was not registered`);
  const staticWords = wordCount(buildRouteStaticHtml(route));

  assert(article.content.length >= 2, `${routePath}: needs at least two overview paragraphs`);
  assert(article.sections?.length === 5, `${routePath}: expected five technical sections`);
  assert(proseWords >= 900, `${routePath}: only ${proseWords} prose words; expected at least 900`);
  assert(staticWords >= 1_000, `${routePath}: only ${staticWords} words in static article output`);
  assert(article.sources.length >= 4, `${routePath}: expected at least four primary sources`);
  assert(article.metrics?.length === 4, `${routePath}: expected four headline metrics`);
  assert(article.thesis && wordCount(article.thesis) >= 15, `${routePath}: thesis is missing or too thin`);
  assert(
    article.evidenceBoundary && wordCount(article.evidenceBoundary) >= 20,
    `${routePath}: evidence boundary is missing or too thin`,
  );
  assert(
    article.seoDescription.length >= 120 && article.seoDescription.length <= 180,
    `${routePath}: SEO description must be 120-180 characters`,
  );
  assert(
    duplicateValues(sectionIds).length === 0,
    `${routePath}: duplicate section IDs`,
  );
  assert(
    article.sections?.some((section) => section.table || section.codeExamples?.length),
    `${routePath}: needs at least one technical table or code artifact`,
  );

  for (const source of article.sources) {
    assert(source.href.startsWith('https://'), `${routePath}: source must use HTTPS: ${source.href}`);
    assert(source.lastVerified === '2026.07.19', `${routePath}: source lacks the current verification date`);
  }

  assert(route.section === 'research-article', `${routePath}: wrong route section`);
  assert(route.includeInSitemap, `${routePath}: route is not indexable`);
  assert(route.aliases.length === 0, `${routePath}: new article should not create a legacy Markets alias`);
  assert(
    route.lastmod === (article.dateModified ?? article.date).replaceAll('.', '-'),
    `${routePath}: route lastmod mismatch`,
  );
  assert(publication?.title === article.title, `${routePath}: publication index entry is missing`);

  const builtFile = path.resolve('dist', routePath.slice(1), 'index.html');
  if (fs.existsSync(builtFile)) {
    const html = fs.readFileSync(builtFile, 'utf8');
    assert(html.includes(`<h1>${article.title}</h1>`), `${routePath}: built static h1 is missing`);
    assert(html.includes(article.thesis), `${routePath}: built static thesis is missing`);
    assert(
      html.includes(`rel="canonical" href="https://sulayman-bowles.dev${routePath}"`),
      `${routePath}: built canonical link is missing`,
    );
    assert(
      html.includes(`<meta name="description" content="${article.seoDescription}"`),
      `${routePath}: built meta description is missing`,
    );
    assert(
      html.includes(`"dateModified":"${article.dateModified?.replaceAll('.', '-')}"`),
      `${routePath}: built Article JSON-LD date is missing`,
    );
    assert(
      article.sections?.every((section) => html.includes(`id="${section.id}-title"`)),
      `${routePath}: built static section anchors are incomplete`,
    );
  }
}

const totalWords = articleWordCounts.reduce((sum, article) => sum + article.words, 0);
const minimumWords = Math.min(...articleWordCounts.map((article) => article.words));
const maximumWords = Math.max(...articleWordCounts.map((article) => article.words));
console.log(
  `Article verification passed: all ${ALL_ARTICLES.length} canonical articles have unique route-specific conclusions; ${artworkRecords.length} indexable readers use unique artwork and normalized navigation; the 10-article technical series contains ${totalWords} prose words, ${minimumWords}-${maximumWords} words each, and no repeated 16-word passages.`,
);
