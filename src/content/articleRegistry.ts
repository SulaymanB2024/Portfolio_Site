import { ETHEREUM_BLOBSPACE_MEASUREMENT_AUDIT_ARTICLE } from './ethereumBlobspaceMeasurementAuditArticle';
import { UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE } from './uniBurnSupplyAccountingArticle';
import { INDEPENDENT_APP_INCOME_ARTICLE, DATA_CENTER_INFRASTRUCTURE_ARTICLE } from './restoredResearchArticles';
import { SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE } from './solidRocketMotorCapacityArticle';
import type { PublicArticle } from './articleModels';
import { INVESTMENT_MEMOS } from './marketTheses';
import { US_TOLL_ROAD_ARTICLE } from './usTollRoadArticle';
import { RARE_EARTH_MAGNET_BUILDOUT_ARTICLE } from './rareEarthMagnetBuildoutArticle';
import { RESEARCH_ARTICLES } from './researchArticles';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';
import { TEXAS_TOLL_REVENUE_ARTICLE } from './texasTollRevenueArticle';
import { THE_AI_MEGAWATT_ARTICLE } from './theAiMegawattArticle';

export const ALL_ARTICLES: PublicArticle[] = [
  ETHEREUM_BLOBSPACE_MEASUREMENT_AUDIT_ARTICLE,
  UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE,
  SOLID_ROCKET_MOTOR_CAPACITY_ARTICLE,
  DATA_CENTER_INFRASTRUCTURE_ARTICLE,
  INDEPENDENT_APP_INCOME_ARTICLE,
  THE_AI_MEGAWATT_ARTICLE,
  ...TECHNICAL_ARTICLE_SERIES,
  ...RESEARCH_ARTICLES,
  TEXAS_TOLL_REVENUE_ARTICLE,
  RARE_EARTH_MAGNET_BUILDOUT_ARTICLE,
  ...INVESTMENT_MEMOS,
  US_TOLL_ROAD_ARTICLE,
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
