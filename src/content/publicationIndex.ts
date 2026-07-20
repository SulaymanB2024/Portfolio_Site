import { AI_MANAGERS_ARTICLE_PATH } from './aiManagersArticle';
import type { ResearchArticle } from './articleModels';
import { getArticlePath, getArticleBySlug } from './articleRegistry';
import { TECHNICAL_ARTICLE_SERIES } from './technicalArticleSeries';
import { TEXAS_TOLL_ARTICLE_SLUG } from './texasTollRoadArticleMeta';

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

const crawlerPolicy = article('ai-search-crawler-policy');
const publicDataInfrastructure = article('technical-seo-public-data-infrastructure');
const canonicalIdentity = article('canonical-identity-personal-seo');
const texasTollRoads = article(TEXAS_TOLL_ARTICLE_SLUG);

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
  ['Search systems', 'Crawler policy, canonical identity, and public records.'],
  ['Technical SEO', 'Crawlability, structured data, provenance, and bounded public studies.'],
  ['Markets and investing', 'Ownership structures, valuation frames, assumptions, and risk.'],
  ['AI systems and products', 'AI operations, agent evaluation, Atlas outputs, and inspectable technical artifacts.'],
] as const;
