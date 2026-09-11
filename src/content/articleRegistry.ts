import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { RARE_EARTH_MAGNET_BUILDOUT_ARTICLE } from './rareEarthMagnetBuildoutArticle';
import { RESEARCH_ARTICLES } from './researchArticles';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';
import { THE_AI_MEGAWATT_ARTICLE } from './theAiMegawattArticle';

const ROBOTS_ACCESS_CONTROL_ARTICLE_SLUG = 'robots-txt-courtesy-not-access-control';
const ROBOTS_ACCESS_CONTROL_CTR_TITLE = 'Robots.txt Is Not Access Control | RFC 9309 Authorization';
const AI_CRAWLER_POLICY_ARTICLE_SLUG = 'ai-search-crawler-policy';
const AI_CRAWLER_POLICY_CTR_TITLE = 'AI Crawler Robots.txt Guide | GPTBot, ClaudeBot & PerplexityBot';
const AI_MANAGERS_ARTICLE_SLUG = 'the-first-ai-managers';
const AI_MANAGERS_CTR_TITLE = 'AI Managers: 30 AI Manager Cases Reviewed';
const WAYMO_FINANCING_ARTICLE_SLUG = 'waymo-hardware-financing';
const WAYMO_FINANCING_CTR_TITLE = 'Waymo Financing Structure: Who Funds the Hardware?';

const BASE_ARTICLES: PublicArticle[] = [
  THE_AI_MEGAWATT_ARTICLE,
  ...TECHNICAL_ARTICLE_SERIES,
  ...RESEARCH_ARTICLES,
  RARE_EARTH_MAGNET_BUILDOUT_ARTICLE,
  ...INVESTMENT_MEMOS,
];

function applyMeasuredSearchSnippetExperiment(article: PublicArticle): PublicArticle {
  if (
    article.kind === 'research'
    && article.cluster === 'ai-crawlers'
    && article.slug === ROBOTS_ACCESS_CONTROL_ARTICLE_SLUG
  ) {
    return {
      ...article,
      seoTitle: ROBOTS_ACCESS_CONTROL_CTR_TITLE,
    };
  }

  if (
    article.kind === 'research'
    && article.cluster === 'ai-crawlers'
    && article.slug === AI_CRAWLER_POLICY_ARTICLE_SLUG
  ) {
    return {
      ...article,
      seoTitle: AI_CRAWLER_POLICY_CTR_TITLE,
    };
  }

  if (
    article.kind === 'research'
    && article.cluster === 'ai-systems'
    && article.slug === AI_MANAGERS_ARTICLE_SLUG
  ) {
    return {
      ...article,
      seoTitle: AI_MANAGERS_CTR_TITLE,
    };
  }

  if (
    article.kind === 'research'
    && article.cluster === 'financial-systems'
    && article.slug === WAYMO_FINANCING_ARTICLE_SLUG
  ) {
    return {
      ...article,
      seoTitle: WAYMO_FINANCING_CTR_TITLE,
    };
  }

  return article;
}

export const ALL_ARTICLES: PublicArticle[] = BASE_ARTICLES.map(applyMeasuredSearchSnippetExperiment);
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
