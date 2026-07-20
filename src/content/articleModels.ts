export type ArticleSource = {
  label: string;
  href: string;
  lastVerified?: string;
};

export type ArticleMetric = {
  label: string;
  value: string;
};

export type ResearchCluster =
  | 'firecrawl'
  | 'ai-crawlers'
  | 'ai-systems'
  | 'search-console'
  | 'personal-seo'
  | 'crawler-engineering'
  | 'technical-seo'
  | 'data-systems';

export type ArticleTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type ArticleCodeExample = {
  title: string;
  description: string;
  language: 'robots.txt' | 'shell' | 'typescript' | 'sql' | 'json';
  code: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  table?: ArticleTable;
  codeExamples?: ArticleCodeExample[];
};

export type ResearchArticle = {
  kind: 'research';
  cluster: ResearchCluster;
  slug: string;
  number: string;
  category: string;
  title: string;
  seoTitle: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  date: string;
  dateModified?: string;
  lastVerified?: string;
  readTime: string;
  author: string;
  thesis?: string;
  evidenceBoundary?: string;
  content: string[];
  sections?: ArticleSection[];
  metrics?: ArticleMetric[];
  sources: ArticleSource[];
  indexable?: boolean;
};

export type InvestmentMemo = Omit<ResearchArticle, 'kind' | 'evidenceBoundary' | 'cluster' | 'lastVerified'> & {
  kind: 'investment-memo';
  assumptions?: string[];
  valuationFrame?: string;
  risks: string;
  recommendationBoundary: string;
  conviction: string;
  horizon: string;
  allocation: string;
  formula: string;
  formulaLabel: string;
};

export type PublicArticle = ResearchArticle | InvestmentMemo;

export function isInvestmentMemo(article: PublicArticle): article is InvestmentMemo {
  return article.kind === 'investment-memo';
}
