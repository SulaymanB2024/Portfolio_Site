export type ArticleSource = {
  label: string;
  href: string;
};

export type ArticleMetric = {
  label: string;
  value: string;
};

export type ResearchArticle = {
  kind: 'research';
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
  readTime: string;
  author: string;
  thesis?: string;
  evidenceBoundary?: string;
  content: string[];
  metrics?: ArticleMetric[];
  sources: ArticleSource[];
  indexable?: boolean;
};

export type InvestmentMemo = Omit<ResearchArticle, 'kind' | 'evidenceBoundary'> & {
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
