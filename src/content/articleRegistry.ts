import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { RESEARCH_ARTICLES } from './researchArticles';

export const ALL_ARTICLES: PublicArticle[] = [...RESEARCH_ARTICLES, ...INVESTMENT_MEMOS];
export const INDEXABLE_ARTICLES = ALL_ARTICLES.filter((article) => article.indexable !== false);

export function getArticleBySlug(slug: string) {
  return ALL_ARTICLES.find((article) => article.slug === slug);
}
