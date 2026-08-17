import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { RARE_EARTH_MAGNET_BUILDOUT_ARTICLE } from './rareEarthMagnetBuildoutArticle';
import { RESEARCH_ARTICLES } from './researchArticles';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';

export const ALL_ARTICLES: PublicArticle[] = [
  ...TECHNICAL_ARTICLE_SERIES,
  ...RESEARCH_ARTICLES,
  RARE_EARTH_MAGNET_BUILDOUT_ARTICLE,
  ...INVESTMENT_MEMOS,
];
export const INDEXABLE_ARTICLES = ALL_ARTICLES.filter((article) => article.indexable !== false);

export function getArticlePath(article: PublicArticle) {
  return article.kind === 'investment-memo'
    ? `/markets/${article.slug}`
    : `/research/${article.cluster}/${article.slug}`;
}

export function getArticleAliases(article: PublicArticle) {
  return article.aliases ?? [];
}

export function getArticleBySlug(slug: string) {
  return ALL_ARTICLES.find((article) => article.slug === slug);
}

export function getArticleByPath(path: string) {
  return ALL_ARTICLES.find((article) => getArticlePath(article) === path);
}
