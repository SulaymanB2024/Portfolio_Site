export type SearchIntentCluster = {
  path: string;
  intent: 'brand' | 'portfolio' | 'profile' | 'product' | 'commercial' | 'local-commercial' | 'research';
  primary: string;
  supporting: readonly string[];
};

export const SEARCH_INTENT_CLUSTERS = [
  {
    path: '/',
    intent: 'brand',
    primary: 'Sulayman Bowles',
    supporting: ['technical SEO', 'AI product', 'technical systems builder'],
  },
  {
    path: '/work',
    intent: 'portfolio',
    primary: 'technical SEO portfolio',
    supporting: ['AI systems portfolio', 'crawl data projects', 'technical research portfolio'],
  },
  {
    path: '/about',
    intent: 'profile',
    primary: 'Sulayman Bowles technical SEO',
    supporting: ['AI product manager', 'technical systems builder', 'UT Austin McCombs'],
  },
  {
    path: '/atlas',
    intent: 'product',
    primary: 'technical SEO audit software',
    supporting: ['technical SEO crawler', 'crawl analysis software', 'SEO audit console'],
  },
  {
    path: '/method',
    intent: 'commercial',
    primary: 'technical SEO audit services',
    supporting: ['technical SEO audit process', 'crawlability audit', 'indexation audit', 'structured data audit'],
  },
  {
    path: '/contact',
    intent: 'commercial',
    primary: 'technical SEO consultant',
    supporting: ['technical SEO audit contact', 'crawlability consultant', 'SEO implementation support'],
  },
  {
    path: '/austin-technical-seo',
    intent: 'local-commercial',
    primary: 'Austin technical SEO consultant',
    supporting: ['technical SEO Austin', 'Austin SEO audit', 'Austin technical SEO services', 'Austin crawlability audit'],
  },
  {
    path: '/research',
    intent: 'research',
    primary: 'technical SEO research',
    supporting: ['AI search research', 'crawler policy research', 'crawlability research'],
  },
  {
    path: '/research/ai-systems',
    intent: 'research',
    primary: 'AI agent systems research',
    supporting: ['AI-operated businesses', 'agent harnesses', 'AI system evaluation'],
  },
  {
    path: '/research/search-systems',
    intent: 'research',
    primary: 'Search and crawl systems research',
    supporting: ['crawler policy', 'canonical identity', 'retrieval infrastructure'],
  },
] as const satisfies readonly SearchIntentCluster[];

export function getSearchIntentCluster(path: string) {
  return SEARCH_INTENT_CLUSTERS.find((cluster) => cluster.path === path);
}

export function searchTerms(path: string) {
  const cluster = getSearchIntentCluster(path);
  return cluster ? [cluster.primary, ...cluster.supporting] : [];
}
