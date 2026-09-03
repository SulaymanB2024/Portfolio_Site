import { AI_MANAGERS_ARTICLE_PATH } from './aiManagersArticle';
import { AIRLINE_LOYALTY_FINANCING_ARTICLE_SLUG } from './airlineLoyaltyFinancingArticle';
import { AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_SLUG } from './austinHomeServiceOwnershipArticle';
import type { ResearchArticle } from './articleModels';
import { getArticlePath, getArticleBySlug } from './articleRegistry';
import { HIDDEN_FINANCING_HARDWARE_ARTICLE_SLUG } from './hiddenFinancingHardwareArticle';
import { INDEX_COMPANY_MATTERS_ARTICLE_SLUG } from './indexCompanyMattersArticle';
import { ONLINE_RETURNS_INVESTIGATION_ARTICLE_SLUG } from './onlineReturnsInvestigationArticle';
import { SOFTWARE_BUYOUT_COHORT_ARTICLE_SLUG } from './softwareBuyoutCohortArticle';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';
import { TEXAS_TOLL_ARTICLE_SLUG } from './texasTollRoadArticleMeta';
import { US_TOLL_ROAD_OWNERSHIP_ARTICLE_SLUG } from './usTollRoadOwnershipArticle';
import { THE_AI_MEGAWATT_ARTICLE_SLUG } from './theAiMegawattArticle';
import { WAYMO_HARDWARE_FINANCING_ARTICLE_SLUG } from './waymoHardwareFinancingArticle';
import { WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_SLUG } from './westCampusStudentHousingArticle';

export type PublicationIndexItem = {
  category: 'AI systems and products' | 'Search systems' | 'Technical SEO' | 'Markets and investing';
  title: string;
  href: string;
  description: string;
  date: string;
  featured?: boolean;
};

const article = (slug: string) => {
  const item = getArticleBySlug(slug);
  if (!item) throw new Error(`Publication index references missing article: ${slug}`);
  return item;
};

const aiMegawatt = article(THE_AI_MEGAWATT_ARTICLE_SLUG);
const crawlerPolicy = article('ai-search-crawler-policy');
const austinHomeServiceOwnership = article(AUSTIN_HOME_SERVICE_OWNERSHIP_ARTICLE_SLUG);
const publicDataInfrastructure = article('technical-seo-public-data-infrastructure');
const canonicalIdentity = article('canonical-identity-personal-seo');
const texasTollRoads = article(TEXAS_TOLL_ARTICLE_SLUG);
const usTollRoadOwnership = article(US_TOLL_ROAD_OWNERSHIP_ARTICLE_SLUG);
const indexCompanyMatters = article(INDEX_COMPANY_MATTERS_ARTICLE_SLUG);
const softwareBuyoutCohort = article(SOFTWARE_BUYOUT_COHORT_ARTICLE_SLUG);
const airlineLoyaltyFinancing = article(AIRLINE_LOYALTY_FINANCING_ARTICLE_SLUG);
const onlineReturnsInvestigation = article(ONLINE_RETURNS_INVESTIGATION_ARTICLE_SLUG);
const hiddenFinancingHardware = article(HIDDEN_FINANCING_HARDWARE_ARTICLE_SLUG);
const waymoHardwareFinancing = article(WAYMO_HARDWARE_FINANCING_ARTICLE_SLUG);
const westCampusStudentHousing = article(WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_SLUG);

function seriesCategory(articleItem: ResearchArticle): PublicationIndexItem['category'] {
  if (articleItem.cluster === 'ai-systems') return 'AI systems and products';
  if (articleItem.cluster === 'ai-crawlers' || articleItem.cluster === 'crawler-engineering') {
    return 'Search systems';
  }
  return 'Technical SEO';
}

export const PUBLICATION_INDEX: readonly PublicationIndexItem[] = [
  {
    category: 'Technical SEO',
    title: 'Technical SEO Diagnostic Library',
    href: '/research/technical-seo',
    description: 'Forty evidence-backed issue guides, platform playbooks, audit checklists, and collection routes with reproducible repair gates.',
    date: '2026.07.20',
    featured: true,
  },
  ...TECHNICAL_ARTICLE_SERIES.map((articleItem) => ({
    category: seriesCategory(articleItem),
    title: articleItem.title,
    href: getArticlePath(articleItem),
    description: articleItem.subtitle,
    date: articleItem.dateModified ?? articleItem.date,
  })),
  {
    category: 'AI systems and products',
    title: aiMegawatt.title,
    href: getArticlePath(aiMegawatt),
    description: aiMegawatt.subtitle,
    date: aiMegawatt.dateModified ?? aiMegawatt.date,
    featured: true,
  },
  {
    category: 'AI systems and products',
    title: 'The First AI Managers',
    href: AI_MANAGERS_ARTICLE_PATH,
    description: 'A 30-case review of AI-operated businesses that separates live operations, pilots, simulations, and vendor claims.',
    date: '2026.07.14',
    featured: true,
  },
  {
    category: 'AI systems and products',
    title: 'Beyond the Leaderboard: ViralBench + Codex',
    href: '/viralbench-codex-agent-harness',
    description: 'A code-level design for traces, replay, controlled trials, and a bounded engineering loop around a live marketing agent.',
    date: '2026.07.09',
  },
  {
    category: 'Search systems',
    title: crawlerPolicy.title,
    href: getArticlePath(crawlerPolicy),
    description: crawlerPolicy.subtitle,
    date: crawlerPolicy.dateModified ?? crawlerPolicy.date,
  },
  {
    category: 'Technical SEO',
    title: publicDataInfrastructure.title,
    href: getArticlePath(publicDataInfrastructure),
    description: publicDataInfrastructure.subtitle,
    date: publicDataInfrastructure.dateModified ?? publicDataInfrastructure.date,
  },
  {
    category: 'Search systems',
    title: canonicalIdentity.title,
    href: getArticlePath(canonicalIdentity),
    description: canonicalIdentity.subtitle,
    date: canonicalIdentity.dateModified ?? canonicalIdentity.date,
  },
  {
    category: 'Markets and investing',
    title: austinHomeServiceOwnership.title,
    href: getArticlePath(austinHomeServiceOwnership),
    description: austinHomeServiceOwnership.subtitle,
    date: austinHomeServiceOwnership.dateModified ?? austinHomeServiceOwnership.date,
    featured: true,
  },
  {
    category: 'Markets and investing',
    title: indexCompanyMatters.title,
    href: getArticlePath(indexCompanyMatters),
    description: indexCompanyMatters.subtitle,
    date: indexCompanyMatters.dateModified ?? indexCompanyMatters.date,
    featured: true,
  },
  {
    category: 'Markets and investing',
    title: softwareBuyoutCohort.title,
    href: getArticlePath(softwareBuyoutCohort),
    description: softwareBuyoutCohort.subtitle,
    date: softwareBuyoutCohort.dateModified ?? softwareBuyoutCohort.date,
  },
  {
    category: 'Markets and investing',
    title: airlineLoyaltyFinancing.title,
    href: getArticlePath(airlineLoyaltyFinancing),
    description: airlineLoyaltyFinancing.subtitle,
    date: airlineLoyaltyFinancing.dateModified ?? airlineLoyaltyFinancing.date,
  },
  {
    category: 'Markets and investing',
    title: onlineReturnsInvestigation.title,
    href: getArticlePath(onlineReturnsInvestigation),
    description: onlineReturnsInvestigation.subtitle,
    date: onlineReturnsInvestigation.dateModified ?? onlineReturnsInvestigation.date,
  },
  {
    category: 'Markets and investing',
    title: hiddenFinancingHardware.title,
    href: getArticlePath(hiddenFinancingHardware),
    description: hiddenFinancingHardware.subtitle,
    date: hiddenFinancingHardware.dateModified ?? hiddenFinancingHardware.date,
  },
  {
    category: 'Markets and investing',
    title: westCampusStudentHousing.title,
    href: getArticlePath(westCampusStudentHousing),
    description: westCampusStudentHousing.subtitle,
    date: westCampusStudentHousing.dateModified ?? westCampusStudentHousing.date,
  },
  {
    category: 'Markets and investing',
    title: waymoHardwareFinancing.title,
    href: getArticlePath(waymoHardwareFinancing),
    description: waymoHardwareFinancing.subtitle,
    date: waymoHardwareFinancing.dateModified ?? waymoHardwareFinancing.date,
  },
  {
    category: 'Markets and investing',
    title: usTollRoadOwnership.title,
    href: getArticlePath(usTollRoadOwnership),
    description: usTollRoadOwnership.subtitle,
    date: usTollRoadOwnership.dateModified ?? usTollRoadOwnership.date,
    featured: true,
  },
  {
    category: 'Markets and investing',
    title: texasTollRoads.title,
    href: getArticlePath(texasTollRoads),
    description: texasTollRoads.subtitle,
    date: texasTollRoads.dateModified ?? texasTollRoads.date,
  },
  {
    category: 'Technical SEO',
    title: 'Atlas Open Corpus Demonstration',
    href: '/atlas/sample-crawl',
    description: 'A versioned public-corpus run showing source and rendered states, traceable findings, confidence, and export excerpts.',
    date: '2026.07.16',
  },
  {
    category: 'Technical SEO',
    title: 'Austin Crawlability Pilot',
    href: '/austin-technical-seo',
    description: 'A bounded 12-site public-homepage pilot with a dated cutoff, public CSV, and explicit measurement gaps.',
    date: '2026.06.25',
  },
];

export const PUBLICATION_CATEGORY_SUMMARY = [
  ['Crawler engineering', 'Crawl frontiers, robots policy, rendering evidence, and retrieval systems.'],
  ['Technical SEO', 'Canonicals, internal links, structured data, migrations, and identity consistency.'],
  ['Data & AI systems', 'Derived records, SQLite pipelines, agent evaluation, and AI operations.'],
  ['Finance & ownership', 'Capital stacks, infrastructure, market mechanics, and local ownership.'],
  ['Public studies & archive', 'Atlas evidence, the Austin pilot, and clearly labeled retired methodology.'],
] as const;
