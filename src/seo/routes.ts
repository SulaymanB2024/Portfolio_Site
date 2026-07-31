import { ARTICLE_ROUTE_METADATA } from '../content/articleRouteMetadata';
import { TEXAS_TOLL_ARTICLE_SLUG } from '../content/texasTollRoadArticleMeta';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_PATH,
  VIRALBENCH_ARTICLE_SEO_TITLE,
  VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
  VIRALBENCH_ARTICLE_STATIC_SUMMARY,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticleMeta';
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
  displayH1?: string;
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
const KEYWORD_LASTMOD = '2026-07-18';
const PROFILE_OG_IMAGE = '/images/social/og-profile.png';
const ATLAS_OG_IMAGE = '/images/social/og-atlas.png';
const WORK_OG_IMAGE = '/images/social/og-work.png';
const VOID_OG_IMAGE = '/images/social/og-void.png';
const RESEARCH_OG_IMAGE = '/images/social/og-research.png';
export const NOT_FOUND_ROUTE: SeoRoute = {
  path: '/404',
  aliases: [],
  title: 'Page Not Found | Sulayman Bowles',
  description: 'The requested page is not part of the current public record for sulayman-bowles.dev.',
  h1: 'Page Not Found',
  displayH1: 'This page is not part of the record.',
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
    title: 'Sulayman Bowles | Technical SEO, AI Systems & Finance Research',
    description:
      'Technical SEO, AI systems, and finance research from Sulayman Bowles, builder of Atlas and founder of Void Agency.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'Technical SEO and AI systems builder working across crawl infrastructure, analytics, product workflows, and source-led investment research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: homeJsonLd(),
  },
  {
    path: '/work',
    aliases: [],
    title: 'Technical SEO, AI Systems & Research Portfolio',
    description:
      'Technical SEO portfolio and AI systems work from Sulayman Bowles, including Atlas crawl software, audit methods, analytics, research, and public evidence.',
    h1: 'Selected Work',
    displayH1: 'Systems I built. Evidence you can inspect.',
    section: 'work',
    pageType: 'website',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'A technical SEO, AI systems, analytics, and research portfolio with six public artifacts, explicit ownership, implementation details, and proof.',
    image: WORK_OG_IMAGE,
    jsonLd: workJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | Technical SEO & AI Systems',
    description:
      'About Sulayman Bowles: technical SEO consultant, AI product manager, and systems builder working across React, Python, SQLite, analytics, and research.',
    h1: 'About Sulayman Bowles',
    displayH1: 'I build technical systems that make evidence inspectable.',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'Sulayman Bowles connects technical SEO consulting, Atlas crawl software, AI product work, analytics, and source-led finance research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: aboutJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Technical SEO Audit Software & Crawler | Atlas',
    description:
      'Atlas is technical SEO audit software and a crawler for indexation, internal links, canonicals, structured data, rendered HTML, evidence, and audit exports.',
    h1: 'Atlas SEO Audit Console',
    displayH1: 'To see the whole structure.',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'Atlas is technical SEO audit software for crawl analysis, indexation, site architecture, internal links, structured data, and reviewable exports.',
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
    displayH1: 'Open-corpus evidence.',
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
    displayH1: 'To see the whole structure.',
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
    title: 'Sulayman Bowles Resume | Technical SEO & AI Product',
    description:
      'Resume for Sulayman Bowles covering UT Austin McCombs, Void Agency, Atlas, technical SEO, AI product research, markets, and supporting links.',
    h1: 'Sulayman Bowles Resume',
    displayH1: 'Sulayman Bowles',
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
    title: 'Technical SEO & AI Systems Research | Sulayman Bowles',
    description:
      'Technical SEO research and AI systems notes from Sulayman Bowles on crawlability, crawler policy, Atlas, public data, identity, markets, and evidence.',
    h1: 'Research Notes',
    displayH1: 'One archive. Clear categories.',
    section: 'research',
    pageType: 'research',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'Technical SEO, AI search, crawlability, infrastructure, product, data, and markets research with visible sources and evidence limits.',
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
    title: 'Technical SEO Audit Services & Process | Void Agency',
    description:
      'Void Agency’s technical SEO audit method for crawl paths, indexation, internal links, structured data, analytics, and implementation priorities.',
    h1: 'Void Agency Method',
    displayH1: 'Technical SEO audits, evidence first.',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'Technical SEO audit services for crawlability, indexation, rendering, internal links, structured data, analytics, implementation priorities, and rerun checks.',
    image: VOID_OG_IMAGE,
    jsonLd: methodJsonLd(),
  },
  {
    path: '/contact',
    aliases: ['/audit-intake'],
    title: 'Technical SEO Consultant & Audit Contact | Sulayman Bowles',
    description:
      'Contact technical SEO consultant Sulayman Bowles for crawlability, indexation, rendering, structured data, analytics, implementation, or audit support.',
    h1: 'Contact a Technical SEO Consultant',
    displayH1: 'SEO audit contact.',
    section: 'contact',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: KEYWORD_LASTMOD,
    staticSummary:
      'Direct contact and a compact brief for technical SEO consulting, crawl evidence, analytics, implementation support, validation, and research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: contactJsonLd(),
  },
  {
    path: '/austin-technical-seo',
    aliases: ['/austin-seo'],
    title: 'Austin Technical SEO Consultant & Audit Services',
    description:
      'Austin technical SEO for teams that need crawlability, indexation, structured data, page clarity, local context, and implementation guidance.',
    h1: 'Austin Technical SEO',
    displayH1: 'Austin technical SEO consultant.',
    section: 'local-service',
    pageType: 'service',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: METADATA_REFRESH_LASTMOD,
    staticSummary:
      'Austin technical SEO consulting and audit services for crawlability, indexation, rendering, internal links, structured data, local pages, and implementation.',
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
    staticSummary: VIRALBENCH_ARTICLE_STATIC_SUMMARY,
    image: VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
    jsonLd: viralBenchArticleJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets & Investing Research | Sulayman Bowles',
    description:
      'Finance and infrastructure-investing research with visible assumptions, source tables, valuation frames, risks, and recommendation boundaries.',
    h1: 'Markets and Investing',
    displayH1: 'Markets and investing.',
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

const ARTICLE_ROUTES: SeoRoute[] = ARTICLE_ROUTE_METADATA.map((article) => {
  const path = article.path;
  const isIndexable = article.indexable;
  const datePublished = article.date.replaceAll('.', '-');
  const dateModified = article.dateModified.replaceAll('.', '-');
  const investmentMemo = article.kind === 'investment-memo';
  const articleImage = article.image;
  const brandedTitle = `${article.seoTitle} | Sulayman Bowles`;

  return {
    path,
    aliases: article.aliases,
    title: path === `/markets/${TEXAS_TOLL_ARTICLE_SLUG}` || brandedTitle.length > 60 ? article.seoTitle : brandedTitle,
    description: article.seoDescription,
    h1: article.title,
    section: 'research-article',
    pageType: 'article',
    priority: isIndexable ? 0.6 : 0.2,
    includeInSitemap: isIndexable,
    generateStatic: !isIndexable,
    noindex: !isIndexable,
    lastmod: dateModified,
    staticSummary: article.staticSummary,
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
