import { ALL_ARTICLES, getArticlePath, getLegacyArticlePath } from '../content/articleRegistry';
import { isInvestmentMemo } from '../content/articleModels';
import { TEXAS_TOLL_ARTICLE_SLUG } from '../content/texasTollRoadArticleMeta';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_EXCERPT,
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_PATH,
  VIRALBENCH_ARTICLE_SEO_TITLE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import {
  aboutJsonLd,
  austinTechnicalSeoJsonLd,
  atlasSampleCrawlJsonLd,
  atlasJsonLd,
  contactJsonLd,
  homeJsonLd,
  marketArticleJsonLd,
  marketsJsonLd,
  methodJsonLd,
  researchAssetsJsonLd,
  resumeJsonLd,
  sitemapJsonLd,
  viralBenchArticleJsonLd,
  workJsonLd,
  type JsonLd,
} from './schema';

export type RouteSection =
  | 'home'
  | 'about'
  | 'resume'
  | 'source-information'
  | 'work'
  | 'contact'
  | 'project'
  | 'service'
  | 'local-service'
  | 'research'
  | 'research-article';

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
  generateStatic?: boolean;
  noindex?: boolean;
  lastmod?: string;
  staticSummary: string;
  staticHtml?: string;
  image?: string;
  jsonLd?: JsonLd;
}

export type RouteVisualMode = 'canvas-sample' | 'dark-evidence' | 'memo-reader' | 'book' | 'prototype';
export type RouteTone = 'light' | 'dark';

export const SITE_LASTMOD = '2026-07-16';
const METADATA_REFRESH_LASTMOD = '2026-07-19';
const PROFILE_OG_IMAGE = '/images/social/og-profile.png';
const ATLAS_OG_IMAGE = '/images/social/og-atlas.png';
const WORK_OG_IMAGE = '/images/social/og-work.png';
const VOID_OG_IMAGE = '/images/social/og-void.png';
const RESEARCH_OG_IMAGE = '/images/social/og-research.png';
const TOLL_ROADS_OG_IMAGE = '/images/social/og-toll-roads.png';

export const NOT_FOUND_ROUTE: SeoRoute = {
  path: '/404',
  aliases: [],
  title: 'Page Not Found | Sulayman Bowles',
  description: 'The requested page is not part of the current public record for sulayman-bowles.dev.',
  h1: 'Page Not Found',
  section: 'source-information',
  pageType: 'website',
  priority: 0,
  includeInSitemap: false,
  generateStatic: true,
  noindex: true,
  lastmod: SITE_LASTMOD,
  staticSummary: 'The requested page is unavailable. Use Home, Work, Research, or the HTML sitemap.',
};

const CORE_ROUTES: SeoRoute[] = [
  {
    path: '/',
    aliases: [],
    title: 'Sulayman Bowles | AI Product, Systems & Research',
    description:
      'Sulayman Bowles works in AI product, technical systems, and investment research—building Atlas and publishing source-led work on AI and infrastructure.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Technical systems builder and UT Austin McCombs student working across crawl infrastructure, AI product workflows, analytics, and finance research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: homeJsonLd(),
  },
  {
    path: '/work',
    aliases: [],
    title: 'Selected Work | Technical Systems & Research',
    description:
      'Six public artifacts from Sulayman Bowles with explicit ownership, implementation details, current status, constraints, and inspectable evidence.',
    h1: 'Selected Work',
    section: 'work',
    pageType: 'website',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Six public artifacts across Atlas, infrastructure research, AI-agent evaluation, SEO analytics, Void Agency, and technical builds, each with ownership and proof.',
    image: WORK_OG_IMAGE,
    jsonLd: workJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | Technical Systems Builder',
    description:
      'Sulayman Bowles designs crawl and evidence systems across React, TypeScript, Python, SQLite, technical SEO, AI product work, and finance research.',
    h1: 'About Sulayman Bowles',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Sulayman Bowles is a technical systems builder connecting Atlas, technical SEO, Void Agency, AI product workflows, and finance research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: aboutJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Atlas SEO Audit Console | Crawl Data System',
    description:
      'Atlas SEO Audit Console is Sulayman Bowles crawl data system for indexation, internal links, canonicals, structured data, rendered HTML, and audit exports.',
    h1: 'Atlas SEO Audit Console',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Atlas is a technical SEO audit console for crawl data, indexation, architecture, internal links, structured data, and performance inputs.',
    image: ATLAS_OG_IMAGE,
    jsonLd: atlasJsonLd(),
  },
  {
    path: '/atlas/sample-crawl',
    aliases: ['/atlas/sample-run'],
    title: 'Atlas Open Corpus Demonstration | Crawl Evidence',
    description:
      'A dated Atlas demonstration showing source and render states, discovered paths, confidence, findings, and downloadable run artifacts from a bounded open corpus.',
    h1: 'Atlas Open Corpus Demonstration',
    section: 'project',
    pageType: 'project',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'A dated Atlas open-corpus demonstration with source state, render-state questions, traceable findings, confidence, and CSV/JSON artifacts.',
    image: ATLAS_OG_IMAGE,
    jsonLd: atlasSampleCrawlJsonLd(),
  },
  {
    path: '/atlas/celestial-parallax',
    aliases: ['/atlas-animation'],
    title: 'Atlas Celestial Parallax Prototype | Sulayman Bowles',
    description:
      'Temporary Atlas scroll-animation prototype exploring a celestial parallax treatment for the Atlas page hero, methodology transition, and route-specific motion direction.',
    h1: 'Atlas Celestial Parallax Prototype',
    section: 'project',
    pageType: 'project',
    priority: 0.2,
    includeInSitemap: false,
    generateStatic: true,
    noindex: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Temporary Atlas scroll-animation prototype exploring a celestial parallax treatment for the Atlas page hero, methodology transition, and route-specific motion direction.',
  },
  {
    path: '/resume',
    aliases: ['/resume.html', '/cv', '/cv.html', '/Sulayman_Bowles_Resume_2025.pdf'],
    title: 'Sulayman Bowles Resume | SEO, Product & Finance',
    description:
      'Resume for Sulayman Bowles covering UT Austin McCombs, Void Agency, Atlas, technical SEO, AI product research, markets, and supporting links.',
    h1: 'Sulayman Bowles Resume',
    section: 'resume',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'Stable resume and profile page for Sulayman Bowles with links to Atlas, technical SEO work, finance research, public code, LinkedIn, and contact paths.',
    image: PROFILE_OG_IMAGE,
    jsonLd: resumeJsonLd(),
  },
  {
    path: '/research',
    aliases: ['/research-assets'],
    title: 'Research Notes | Sulayman Bowles',
    description:
      'Readable research notes from Sulayman Bowles on search systems, crawlability, Atlas, public data, identity cleanup, market assumptions, and project evidence.',
    h1: 'Research Notes',
    section: 'research',
    pageType: 'research',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'One research hub with categories for search systems, technical SEO, infrastructure, product and data, and markets research.',
    image: RESEARCH_OG_IMAGE,
    jsonLd: researchAssetsJsonLd(),
  },
  {
    path: '/sitemap',
    aliases: [],
    title: 'HTML Sitemap | Sulayman Bowles',
    description:
      'Plain HTML sitemap for sulayman-bowles.dev with public routes for work, Atlas, method, markets, resume, contact, reference pages, and research files.',
    h1: 'HTML Sitemap',
    section: 'source-information',
    pageType: 'website',
    priority: 0.5,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary: 'Plain HTML links to every public page on sulayman-bowles.dev.',
    jsonLd: sitemapJsonLd(),
  },
  {
    path: '/method',
    aliases: [],
    title: 'Technical SEO Audit Method | Void Agency',
    description:
      'Void Agency’s technical SEO audit method for crawl paths, indexation, internal links, structured data, analytics, and implementation priorities.',
    h1: 'Void Agency Method',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'Void Agency audits crawl paths, indexation, architecture, structured data, performance, analytics, and crawler access to improve search visibility.',
    image: VOID_OG_IMAGE,
    jsonLd: methodJsonLd(),
  },
  {
    path: '/contact',
    aliases: ['/audit-intake'],
    title: 'Contact Sulayman Bowles | Technical SEO Audit Brief',
    description:
      'Contact Sulayman Bowles about technical SEO, raw/render crawl evidence, analytics, implementation handoffs, validation, or source-backed research.',
    h1: 'Contact Sulayman Bowles',
    section: 'contact',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Direct email and a compact brief for technical SEO, crawl evidence, analytics, implementation, validation, and source-backed research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: contactJsonLd(),
  },
  {
    path: '/austin-technical-seo',
    aliases: ['/austin-seo'],
    title: 'Austin Technical SEO & Search Visibility',
    description:
      'Austin technical SEO for teams that need crawlability, indexation, structured data, page clarity, local context, and implementation guidance.',
    h1: 'Austin Technical SEO',
    section: 'local-service',
    pageType: 'service',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'Austin technical SEO page for teams that need crawlability, indexation, structured data, page clarity, local search context, and implementation details reviewed.',
    image: VOID_OG_IMAGE,
    jsonLd: austinTechnicalSeoJsonLd(),
  },
  {
    path: VIRALBENCH_ARTICLE_PATH,
    aliases: [],
    title: VIRALBENCH_ARTICLE_SEO_TITLE,
    description: VIRALBENCH_ARTICLE_DESCRIPTION,
    h1: VIRALBENCH_ARTICLE_TITLE,
    section: 'research-article',
    pageType: 'article',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: VIRALBENCH_ARTICLE_MODIFIED_DATE,
    staticSummary: VIRALBENCH_ARTICLE_EXCERPT,
    image: VIRALBENCH_ARTICLE_IMAGE,
    jsonLd: viralBenchArticleJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets & Investing Research | Sulayman Bowles',
    description:
      'Finance and infrastructure-investing research with visible assumptions, source tables, valuation frames, risks, and recommendation boundaries.',
    h1: 'Markets and Investing',
    section: 'research',
    pageType: 'research',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'A filtered finance and infrastructure-investing archive within the broader Research hub.',
    image: RESEARCH_OG_IMAGE,
    jsonLd: marketsJsonLd(
      'Markets & Investing Research | Sulayman Bowles',
      'Finance and infrastructure-investing research with visible assumptions, source tables, valuation frames, risks, and recommendation boundaries.',
    ),
  },
];

const ARTICLE_ROUTES: SeoRoute[] = ALL_ARTICLES.map((article) => {
  const path = getArticlePath(article);
  const legacyPath = getLegacyArticlePath(article);
  const isIndexable = article.indexable !== false;
  const datePublished = article.date.replaceAll('.', '-');
  const dateModified = (article.dateModified ?? article.date).replaceAll('.', '-');
  const investmentMemo = isInvestmentMemo(article);
  const articleImage = article.slug === TEXAS_TOLL_ARTICLE_SLUG ? TOLL_ROADS_OG_IMAGE : article.image === '/og-default.png' ? RESEARCH_OG_IMAGE : article.image;

  return {
    path,
    aliases: legacyPath ? [legacyPath] : [],
    title: article.slug === TEXAS_TOLL_ARTICLE_SLUG || article.seoTitle.length > 60 ? article.seoTitle : `${article.seoTitle} | Sulayman Bowles`,
    description: article.seoDescription,
    h1: article.title,
    section: 'research-article',
    pageType: 'article',
    priority: isIndexable ? 0.6 : 0.2,
    includeInSitemap: isIndexable,
    generateStatic: !isIndexable,
    noindex: !isIndexable,
    lastmod: dateModified,
    staticSummary: article.content[0],
    image: articleImage,
    jsonLd: marketArticleJsonLd({
      title: article.title,
      description: article.seoDescription,
      path,
      datePublished,
      dateModified,
      image: articleImage,
      collectionPath: investmentMemo ? '/markets' : '/research',
      collectionName: investmentMemo ? 'Markets' : 'Research',
    }),
  };
});

export const SEO_ROUTES: SeoRoute[] = [...CORE_ROUTES, ...ARTICLE_ROUTES];

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

export function getRouteVisualMode(path: string): RouteVisualMode {
  const route = getSeoRoute(path);

  if (route?.path === '/atlas/celestial-parallax') {
    return 'prototype';
  }

  if (route?.section === 'research-article') {
    return 'memo-reader';
  }

  if (
    route?.section === 'about' ||
    route?.section === 'work' ||
    route?.section === 'contact' ||
    route?.section === 'service' ||
    route?.section === 'local-service'
  ) {
    return 'dark-evidence';
  }

  return 'canvas-sample';
}

export function getRouteTone(path: string): RouteTone {
  const mode = getRouteVisualMode(path);
  const route = getSeoRoute(path);
  if (mode === 'memo-reader') {
    return 'light';
  }
  return mode === 'dark-evidence' ? 'dark' : 'light';
}

export function getCanonicalRoutes() {
  return SEO_ROUTES.filter((route) => route.includeInSitemap);
}
