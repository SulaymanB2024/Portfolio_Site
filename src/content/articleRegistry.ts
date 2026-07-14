import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { RESEARCH_ARTICLES } from './researchArticles';

export const ALL_ARTICLES: PublicArticle[] = [...RESEARCH_ARTICLES, ...INVESTMENT_MEMOS];
export const INDEXABLE_ARTICLES = ALL_ARTICLES.filter((article) => article.indexable !== false);

export function getArticlePath(article: PublicArticle) {
  return article.kind === 'investment-memo'
    ? `/markets/${article.slug}`
    : `/research/${article.cluster}/${article.slug}`;
}

export function getLegacyArticlePath(article: PublicArticle) {
  return article.kind === 'research' ? `/markets/${article.slug}` : undefined;
}

export function getArticleBySlug(slug: string) {
  return ALL_ARTICLES.find((article) => article.slug === slug);
}

export function getArticleByPath(path: string) {
  return ALL_ARTICLES.find((article) => getArticlePath(article) === path);
}
