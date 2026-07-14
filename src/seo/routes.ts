import { ALL_ARTICLES } from '../content/articleRegistry';
import { isInvestmentMemo } from '../content/articleModels';
import { TEXAS_TOLL_ARTICLE_SLUG } from '../content/texasTollRoadArticleMeta';
import {
  AI_INFORMATION_DESCRIPTION,
  AI_INFORMATION_STATIC_HTML,
  AI_INFORMATION_TITLE,
} from '../content/aiInformation';
import { SIMPLE_BOOK_DESCRIPTION, SIMPLE_BOOK_H1, SIMPLE_BOOK_STATIC_SUMMARY, SIMPLE_BOOK_TITLE } from '../content/simpleBook';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_EXCERPT,
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_PATH,
  VIRALBENCH_ARTICLE_SEO_TITLE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import {
  aboutJsonLd,
  austinTechnicalSeoJsonLd,
  aiInformationJsonLd,
  atlasSampleCrawlJsonLd,
  atlasJsonLd,
  contactJsonLd,
  homeJsonLd,
  marketArticleJsonLd,
  marketsJsonLd,
  methodJsonLd,
  researchAssetsJsonLd,
  resumeJsonLd,
  simpleBookJsonLd,
  sitemapJsonLd,
  technicalSeoCaseStudyJsonLd,
  viralBenchArticleJsonLd,
  voidAgencyJsonLd,
  workJsonLd,
  type JsonLd,
} from './schema';

export type RouteSection =
  | 'home'
  | 'about'
  | 'book'
  | 'resume'
  | 'source-information'
  | 'work'
  | 'contact'
  | 'project'
  | 'service'
  | 'organization'
  | 'local-service'
  | 'case-study'
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

export type RouteVisualMode = 'canvas-sample' | 'dark-evidence' | 'memo-reader' | 'editorial-article' | 'book' | 'prototype';
export type RouteTone = 'light' | 'dark';

export const SITE_LASTMOD = '2026-07-12';
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
    title: 'Sulayman Bowles | Technical SEO Systems Builder',
    description:
      'Sulayman Bowles builds technical SEO tools, Atlas crawl audit systems, search visibility workflows, and finance research samples through Atlas and Void Agency.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, search visibility, and finance research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: homeJsonLd(),
  },
  {
    path: '/work',
    aliases: [],
    title: 'Selected Work | Products, Research & Technical Systems',
    description:
      'Six distinct public artifacts from Sulayman Bowles across Atlas, infrastructure research, AI-agent evaluation, SEO analytics, Void Agency, and technical builds.',
    h1: 'Selected Work',
    section: 'work',
    pageType: 'website',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Six distinct public artifacts across Atlas, infrastructure research, AI-agent evaluation, SEO analytics, Void Agency, and technical builds.',
    image: WORK_OG_IMAGE,
    jsonLd: workJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | McCombs, SEO & Atlas',
    description:
      'About Sulayman Bowles: UT Austin McCombs student, Void Agency founder, and Atlas builder focused on technical SEO, crawl audits, and markets research systems.',
    h1: 'About Sulayman Bowles',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Sulayman Bowles is a UT Austin McCombs student and builder/operator connecting Atlas, technical SEO, Void Agency, and finance research.',
    image: PROFILE_OG_IMAGE,
    jsonLd: aboutJsonLd(),
  },
  {
    path: '/simple',
    aliases: ['/book', '/plain', '/text'],
    title: SIMPLE_BOOK_TITLE,
    description: SIMPLE_BOOK_DESCRIPTION,
    h1: SIMPLE_BOOK_H1,
    section: 'book',
    pageType: 'profile',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary: SIMPLE_BOOK_STATIC_SUMMARY,
    image: PROFILE_OG_IMAGE,
    jsonLd: simpleBookJsonLd(),
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
    title: 'Atlas Sample Crawl Run | Sanitized SEO Data',
    description:
      'A sanitized Atlas sample crawl run showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and downloadable CSV rows.',
    h1: 'Atlas Sample Crawl Run',
    section: 'project',
    pageType: 'project',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'A sanitized Atlas sample crawl run showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and CSV rows.',
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
      'HTML-first resume for Sulayman Bowles covering UT Austin McCombs, Void Agency, Atlas, technical SEO, AI product research, markets research, and supporting links.',
    h1: 'Sulayman Bowles Resume',
    section: 'resume',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Stable resume and profile page for Sulayman Bowles with links to Atlas, technical SEO work, finance research, public code, LinkedIn, and contact paths.',
    image: PROFILE_OG_IMAGE,
    jsonLd: resumeJsonLd(),
  },
  {
    path: '/ai-information',
    aliases: ['/official-information', '/entity-profile', '/source-information'],
    title: 'Profile Context | Sulayman Bowles',
    description: AI_INFORMATION_DESCRIPTION,
    h1: AI_INFORMATION_TITLE,
    section: 'source-information',
    pageType: 'profile',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Current profile context for Sulayman Bowles, Void Agency, and Atlas SEO Audit Console.',
    staticHtml: AI_INFORMATION_STATIC_HTML,
    image: PROFILE_OG_IMAGE,
    jsonLd: aiInformationJsonLd(),
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
      'Technical SEO audit method from Void Agency for crawl paths, indexation, internal links, structured data, analytics review, search visibility, and implementation priorities.',
    h1: 'Void Agency Method',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Void Agency audits crawl paths, indexation, architecture, structured data, performance, analytics, and crawler access to improve search visibility.',
    image: VOID_OG_IMAGE,
    jsonLd: methodJsonLd(),
  },
  {
    path: '/void-agency',
    aliases: [],
    title: 'Void Agency | Technical SEO Audits',
    description:
      'Void Agency service-practice page for technical SEO, crawlability, indexation diagnostics, structured content, analytics review, web audits, and search visibility.',
    h1: 'Void Agency',
    section: 'organization',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Void Agency is the service branch connected to technical SEO, crawlability, indexation diagnostics, structured content, analytics review, web audits, and search visibility.',
    image: VOID_OG_IMAGE,
    jsonLd: voidAgencyJsonLd(),
  },
  {
    path: '/contact',
    aliases: ['/audit-intake'],
    title: 'Contact Sulayman Bowles | Technical SEO Audit Brief',
    description:
      'Contact Sulayman Bowles directly or send a brief for technical SEO, crawl evidence, analytics, search visibility, source-backed research, and audit scope.',
    h1: 'Contact Sulayman Bowles',
    section: 'contact',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Contact-first route with direct email, a compact audit brief form, and links to LinkedIn, GitHub, resume, and public project records.',
    image: PROFILE_OG_IMAGE,
    jsonLd: contactJsonLd(),
  },
  {
    path: '/austin-technical-seo',
    aliases: ['/austin-seo'],
    title: 'Austin Technical SEO & Search Visibility',
    description:
      'Austin technical SEO page for teams that need crawlability, indexation, structured data, page clarity, local search context, and implementation details reviewed.',
    h1: 'Austin Technical SEO',
    section: 'local-service',
    pageType: 'service',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Austin technical SEO page for teams that need crawlability, indexation, structured data, page clarity, local search context, and implementation details reviewed.',
    image: VOID_OG_IMAGE,
    jsonLd: austinTechnicalSeoJsonLd(),
  },
  {
    path: '/case-studies/technical-seo-audit',
    aliases: ['/technical-seo-case-study'],
    title: 'Technical SEO Finding Walkthrough | Crawl Data',
    description:
      'A sanitized crawl-to-repair walkthrough showing how one observed field becomes an interpreted risk, implementation action, rerun check, and clear evidence boundary.',
    h1: 'Technical SEO Finding Walkthrough',
    section: 'case-study',
    pageType: 'article',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'A sanitized crawl-to-repair walkthrough showing how one observed field becomes an interpreted risk, implementation action, and rerun check.',
    image: VOID_OG_IMAGE,
    jsonLd: technicalSeoCaseStudyJsonLd(),
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
    lastmod: VIRALBENCH_ARTICLE_DATE,
    staticSummary: VIRALBENCH_ARTICLE_EXCERPT,
    image: VIRALBENCH_ARTICLE_IMAGE,
    jsonLd: viralBenchArticleJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets & Investing Research | Sulayman Bowles',
    description:
      'Finance and infrastructure-investing research from Sulayman Bowles with visible assumptions, source tables, valuation frames, risks, and recommendation boundaries.',
    h1: 'Markets and Investing',
    section: 'research',
    pageType: 'research',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
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
  const path = `/markets/${article.slug}`;
  const isIndexable = article.indexable !== false;
  const datePublished = article.date.replaceAll('.', '-');
  const dateModified = (article.dateModified ?? article.date).replaceAll('.', '-');
  const investmentMemo = isInvestmentMemo(article);
  const articleImage = article.slug === TEXAS_TOLL_ARTICLE_SLUG ? TOLL_ROADS_OG_IMAGE : article.image === '/og-default.png' ? RESEARCH_OG_IMAGE : article.image;

  return {
    path,
    aliases: [],
    title: article.slug === TEXAS_TOLL_ARTICLE_SLUG ? article.seoTitle : `${article.seoTitle} | Sulayman Bowles`,
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

  if (route?.path === '/simple') {
    return 'book';
  }

  if (route?.path === '/atlas/celestial-parallax') {
    return 'prototype';
  }

  if (route?.section === 'research-article' || route?.path === VIRALBENCH_ARTICLE_PATH) {
    return 'editorial-article';
  }

  if (
    route?.section === 'about' ||
    route?.section === 'work' ||
    route?.section === 'contact' ||
    route?.section === 'service' ||
    route?.section === 'organization' ||
    route?.section === 'local-service' ||
    route?.section === 'case-study'
  ) {
    return 'dark-evidence';
  }

  return 'canvas-sample';
}

export function getRouteTone(path: string): RouteTone {
  const mode = getRouteVisualMode(path);
  return mode === 'dark-evidence' || mode === 'memo-reader' ? 'dark' : 'light';
}

export function getCanonicalRoutes() {
  return SEO_ROUTES.filter((route) => route.includeInSitemap);
}
