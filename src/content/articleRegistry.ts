import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { RESEARCH_ARTICLES } from './researchArticles';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';
import { UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE } from './uniBurnSupplyAccountingArticle';

export const ALL_ARTICLES: PublicArticle[] = [
  ...TECHNICAL_ARTICLE_SERIES,
  ...RESEARCH_ARTICLES,
  ...INVESTMENT_MEMOS,
  UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE,
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
