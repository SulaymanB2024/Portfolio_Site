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
    path: '/void-agency',
    intent: 'profile',
    primary: 'Sulayman Bowles and Void Agency',
    supporting: ['Void Agency founder', 'Void Agency role', 'technical SEO practice'],
  },
  {
    path: '/atlas',
    intent: 'product',
    primary: 'technical SEO audit software',
    supporting: ['technical SEO crawler', 'crawl analysis software', 'SEO audit console'],
  },
  {
    path: '/method',
    intent: 'research',
    primary: 'technical SEO audit method',
    supporting: ['evidence-led technical SEO audits', 'technical SEO audit process', 'crawl evidence', 'audit rerun checks'],
  },
  {
    path: '/contact',
    intent: 'profile',
    primary: 'Contact Sulayman Bowles',
    supporting: ['Sulayman Bowles email', 'technical work', 'research collaboration'],
  },
  {
    path: '/research',
    intent: 'research',
    primary: 'technical SEO research',
    supporting: ['AI search research', 'crawler policy research', 'crawlability research'],
  },
] as const satisfies readonly SearchIntentCluster[];

export function getSearchIntentCluster(path: string) {
  return SEARCH_INTENT_CLUSTERS.find((cluster) => cluster.path === path);
}

export function searchTerms(path: string) {
  const cluster = getSearchIntentCluster(path);
  return cluster ? [cluster.primary, ...cluster.supporting] : [];
}
