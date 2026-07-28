import { ALL_ARTICLES, getArticleAliases, getArticlePath } from '../content/articleRegistry';
import { isInvestmentMemo } from '../content/articleModels';
import { TEXAS_TOLL_ARTICLE_SLUG } from '../content/texasTollRoadArticleMeta';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_EXCERPT,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_PATH,
  VIRALBENCH_ARTICLE_SEO_TITLE,
  VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import {
  aboutJsonLd,
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
  voidAgencyRelationshipJsonLd,
  workJsonLd,
  type JsonLd,
} from './schema';
import { getArticleSearchTarget } from './articleSearchTargets';

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
const KEYWORD_LASTMOD = '2026-07-18';
const SEO_PERFORMANCE_LASTMOD = '2026-07-24';
const PROFILE_OG_IMAGE = '/images/social/og-profile.png';
const ATLAS_OG_IMAGE = '/images/social/og-atlas.png';
const WORK_OG_IMAGE = '/images/social/og-work.png';
const VOID_OG_IMAGE = '/images/social/og-void.png';
const RESEARCH_OG_IMAGE = '/images/social/og-research.png';
const VIRALBENCH_SEARCH_TARGET = getArticleSearchTarget(VIRALBENCH_ARTICLE_PATH);

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
    title: 'Sulayman Bowles | Technical SEO, AI Systems & Research',
    description:
      'Technical SEO, AI product, crawl systems, analytics, and source-led investment research from Sulayman Bowles, builder of Atlas and founder of Void Agency.',
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
    path: '/void-agency',
    aliases: [],
    title: 'Sulayman Bowles and Void Agency | Role & Contributions',
    description:
      'Sulayman Bowles’s role, public work, verified contributions, and evidence boundaries at Void Agency, with commercial services kept on the agency site.',
    h1: 'How Sulayman Bowles Builds and Runs Void Agency',
    section: 'about',
    pageType: 'profile',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SEO_PERFORMANCE_LASTMOD,
    staticSummary:
      'An author-and-company relationship page documenting Sulayman Bowles’s founder role, public systems work, verified contribution record, and claim boundaries at Void Agency.',
    image: VOID_OG_IMAGE,
    jsonLd: voidAgencyRelationshipJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Technical SEO Audit Software & Crawler | Atlas',
    description:
      'Atlas is technical SEO audit software and a crawler for indexation, internal links, canonicals, structured data, rendered HTML, evidence, and audit exports.',
    h1: 'Atlas SEO Audit Console',
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
    title: 'Sulayman Bowles Resume | Technical SEO & AI Product',
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
    title: 'Technical SEO & AI Systems Research | Sulayman Bowles',
    description:
      'Technical SEO research and AI systems notes from Sulayman Bowles on crawlability, crawler policy, Atlas, public data, identity, markets, and evidence.',
    h1: 'Research Notes',
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
    title: 'Evidence-Led Technical SEO Audit Method | Sulayman Bowles',
    description:
      'How Sulayman Bowles runs evidence-led technical SEO audits across crawl paths, indexation, rendering, internal links, structured data, and rerun checks.',
    h1: 'How Sulayman Bowles Runs Evidence-Led Technical SEO Audits',
    section: 'research',
    pageType: 'research',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SEO_PERFORMANCE_LASTMOD,
    staticSummary:
      'Sulayman Bowles’s personal technical SEO audit methodology for preserving crawl evidence, separating observation from interpretation, assigning implementation owners, and validating repairs.',
    image: RESEARCH_OG_IMAGE,
    jsonLd: methodJsonLd(),
  },
  {
    path: '/contact',
    aliases: [],
    title: 'Contact Sulayman Bowles | Technical Work & Research',
    description:
      'Contact Sulayman Bowles about research, product, technical systems, speaking, or professional context; commercial SEO requests are handled by Void Agency.',
    h1: 'Contact Sulayman Bowles',
    section: 'contact',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SEO_PERFORMANCE_LASTMOD,
    staticSummary:
      'Personal contact page for Sulayman Bowles with direct email and professional profiles; commercial agency and local-service requests are handed to Void Agency.',
    image: PROFILE_OG_IMAGE,
    jsonLd: contactJsonLd(),
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
    staticSummary: `${VIRALBENCH_SEARCH_TARGET?.directAnswer ?? VIRALBENCH_ARTICLE_EXCERPT} ${VIRALBENCH_ARTICLE_EXCERPT}`,
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
  const isIndexable = article.indexable !== false;
  const datePublished = article.date.replaceAll('.', '-');
  const dateModified = (article.dateModified ?? article.date).replaceAll('.', '-');
  const investmentMemo = isInvestmentMemo(article);
  const searchTarget = getArticleSearchTarget(path);
  const articleImage = article.artwork.kind === 'image'
    ? article.artwork.socialSrc
    : RESEARCH_OG_IMAGE;
  const brandedTitle = `${article.seoTitle} | Sulayman Bowles`;

  return {
    path,
    aliases: getArticleAliases(article),
    title: article.slug === TEXAS_TOLL_ARTICLE_SLUG || brandedTitle.length > 60 ? article.seoTitle : brandedTitle,
    description: article.seoDescription,
    h1: article.title,
    section: 'research-article',
    pageType: 'article',
    priority: isIndexable ? 0.6 : 0.2,
    includeInSitemap: isIndexable,
    generateStatic: !isIndexable,
    noindex: !isIndexable,
    lastmod: dateModified,
    staticSummary: `${searchTarget?.directAnswer ?? ''} ${article.content[0]}`.trim(),
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
