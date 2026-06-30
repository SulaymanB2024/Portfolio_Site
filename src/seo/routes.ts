import { MARKET_THESES } from '../content/marketTheses';
import { INTENT_PAGES } from '../content/intentPages';
import {
  aboutJsonLd,
  atlasJsonLd,
  homeJsonLd,
  intentPageJsonLd,
  marketArticleJsonLd,
  marketsJsonLd,
  methodJsonLd,
  resumeJsonLd,
  type JsonLd,
} from './schema';

export type RouteSection = 'home' | 'about' | 'resume' | 'project' | 'service' | 'research' | 'research-article' | 'intent';

export interface SeoRoute {
  path: string;
  aliases: string[];
  title: string;
  description: string;
  h1: string;
  section: RouteSection;
  pageType: 'website' | 'profile' | 'project' | 'service' | 'research' | 'article';
  priority: number;
  includeInSitemap: boolean;
  noindex?: boolean;
  staticSummary: string;
  image?: string;
  jsonLd?: JsonLd;
}

const CORE_ROUTES: SeoRoute[] = [
  {
    path: '/',
    aliases: [],
    title: 'Sulayman Bowles | Technical SEO, Atlas & Finance Research',
    description:
      'Sulayman Bowles builds technical SEO systems, AI-search readiness workflows, finance and data analysis, and product software.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    staticSummary:
      'Technical SEO, Atlas, finance research, and web interfaces built from crawl records, search data, filings, and operating assumptions.',
    jsonLd: homeJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | Technical SEO, Atlas & Finance Research',
    description:
      'Learn about Sulayman Bowles, a McCombs student, Void Agency founder, AI product intern, and builder of Atlas, SEO audit tools, finance research notes, and web interfaces.',
    h1: 'About Sulayman Bowles',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    staticSummary:
      'Sulayman Bowles is a McCombs School of Business student at UT Austin, founder of Void Agency, and builder of Atlas, technical SEO audit tools, finance research notes, and web interfaces.',
    jsonLd: aboutJsonLd(),
  },
  {
    path: '/resume',
    aliases: ['/resume.html', '/cv', '/cv.html'],
    title: 'Sulayman Bowles Resume | Technical SEO, Finance & AI',
    description:
      'HTML-first resume for Sulayman Bowles across technical SEO, AI search, finance research, data analysis, Atlas, and product/software execution.',
    h1: 'Sulayman Bowles Resume',
    section: 'resume',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    staticSummary:
      'Stable resume and profile page for Sulayman Bowles with links to Atlas, technical SEO work, finance research, public code, and contact paths.',
    jsonLd: resumeJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Atlas SEO Audit Console | Crawl Records, Indexation & Technical SEO',
    description:
      'Atlas is a technical SEO audit console for crawl records, indexation, internal links, canonicals, structured data, performance inputs, exports, and AI crawler access checks.',
    h1: 'Atlas SEO Audit Console',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'Atlas crawls sites, stores URL-level records, and ranks issues across indexation, architecture, links, schema, performance, exports, and crawler access.',
    jsonLd: atlasJsonLd(),
  },
  {
    path: '/method',
    aliases: ['/void-agency'],
    title: 'Void Agency Method | Technical SEO Audits & Crawler Access Checks',
    description:
      'Void Agency audits crawl paths, indexation, internal links, templates, structured data, performance, analytics, conversion paths, and AI crawler access.',
    h1: 'Void Agency Method',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'Void Agency turns crawl records, URL groups, search data, analytics, and technical findings into ranked implementation work.',
    jsonLd: methodJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets Research | Finance, Data & Market Structure',
    description:
      'Research index for finance, data analysis, platform power, AI compute infrastructure, money, debt, currency trust, mechanisms, assumptions, and evidence ledgers.',
    h1: 'Markets Research',
    section: 'research',
    pageType: 'research',
    priority: 0.7,
    includeInSitemap: true,
    staticSummary:
      'Markets Research collects structured market notes with thesis, mechanism, evidence status, assumptions, counterarguments, implications, and open questions.',
    jsonLd: marketsJsonLd(
      'Markets Research | Finance, Data & Market Structure',
      'Research index for finance, data analysis, platform power, AI compute infrastructure, money, debt, currency trust, mechanisms, assumptions, and evidence ledgers.',
    ),
  },
];

const INTENT_ROUTES: SeoRoute[] = INTENT_PAGES.map((page) => {
  const parentName = page.parent === 'atlas' ? 'Atlas' : page.parent === 'method' ? 'Method' : 'Markets';
  const parentPath = page.parent === 'atlas' ? '/atlas' : page.parent === 'method' ? '/method' : '/markets';
  const kind = page.parent === 'atlas' ? 'project' : page.parent === 'method' ? 'service' : 'research';

  return {
    path: page.path,
    aliases: [],
    title: `${page.title} | Sulayman Bowles`,
    description: page.deck,
    h1: page.title,
    section: 'intent',
    pageType: kind,
    priority: page.parent === 'markets' ? 0.7 : 0.8,
    includeInSitemap: true,
    staticSummary: page.summary,
    jsonLd: intentPageJsonLd({
      title: page.title,
      description: page.deck,
      path: page.path,
      parentName,
      parentPath,
      kind,
    }),
  };
});

const ARTICLE_ROUTES: SeoRoute[] = MARKET_THESES.map((thesis) => {
  const path = `/markets/${thesis.slug}`;

  return {
    path,
    aliases: [],
    title: `${thesis.title} | Sulayman Bowles`,
    description: thesis.thesis,
    h1: thesis.title,
    section: 'research-article',
    pageType: 'article',
    priority: 0.5,
    includeInSitemap: true,
    staticSummary: thesis.thesis,
    jsonLd: marketArticleJsonLd({
      title: thesis.title,
      description: thesis.subtitle,
      path,
      datePublished: thesis.date.replaceAll('.', '-'),
    }),
  };
});

export const SEO_ROUTES: SeoRoute[] = [...CORE_ROUTES, ...INTENT_ROUTES, ...ARTICLE_ROUTES];

export function normalizeInputPath(path: string) {
  const pathname = path.split(/[?#]/)[0] || '/';
  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/';
}

export function normalizePath(path: string) {
  const normalized = normalizeInputPath(path);
  const route = SEO_ROUTES.find((item) => item.path === normalized || item.aliases.includes(normalized));
  return route?.path ?? normalized;
}

export function getSeoRoute(path: string) {
  const canonicalPath = normalizePath(path);
  return SEO_ROUTES.find((route) => route.path === canonicalPath);
}

export function getCanonicalRoutes() {
  return SEO_ROUTES.filter((route) => route.includeInSitemap);
}
