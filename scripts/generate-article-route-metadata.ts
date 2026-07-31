import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ALL_ARTICLES, getArticleAliases, getArticlePath } from '../src/content/articleRegistry';
import { getArticleSearchTarget } from '../src/seo/articleSearchTargets';

const outputPath = path.resolve(process.cwd(), 'src/content/articleRouteMetadata.ts');

const rows = ALL_ARTICLES.map((article) => ({
  kind: article.kind,
  path: getArticlePath(article),
  aliases: getArticleAliases(article),
  title: article.title,
  seoTitle: article.seoTitle,
  seoDescription: article.seoDescription,
  date: article.date,
  dateModified: article.dateModified ?? article.date,
  indexable: article.indexable !== false,
  staticSummary: `${getArticleSearchTarget(getArticlePath(article))?.directAnswer ?? ''} ${article.content[0]}`.trim(),
  image: article.artwork.kind === 'image' ? article.artwork.socialSrc : '/images/social/og-research.png',
}));

const source = `export type ArticleRouteMetadata = {
  kind: 'research' | 'investment-memo';
  path: string;
  aliases: string[];
  title: string;
  seoTitle: string;
  seoDescription: string;
  date: string;
  dateModified: string;
  indexable: boolean;
  staticSummary: string;
  image: string;
};

// Compact, browser-safe route metadata. The static route generator verifies this
// manifest against the full article registry before a production build completes.
export const ARTICLE_ROUTE_METADATA: ArticleRouteMetadata[] = ${JSON.stringify(rows, null, 2)};
`;

await fs.writeFile(outputPath, source);
console.log(`Wrote ${rows.length} article route records to ${outputPath}`);
