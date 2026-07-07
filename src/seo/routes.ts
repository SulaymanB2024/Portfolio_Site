import { MARKET_THESES } from '../content/marketTheses';
import {
  AI_INFORMATION_DESCRIPTION,
  AI_INFORMATION_STATIC_HTML,
  AI_INFORMATION_TITLE,
} from '../content/aiInformation';
import { SIMPLE_BOOK_DESCRIPTION, SIMPLE_BOOK_H1, SIMPLE_BOOK_STATIC_SUMMARY, SIMPLE_BOOK_TITLE } from '../content/simpleBook';
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

export type RouteVisualMode = 'canvas-artifact' | 'dark-proof' | 'memo-reader' | 'book' | 'prototype';
export type RouteTone = 'light' | 'dark';

export const SITE_LASTMOD = '2026-07-06';

const CORE_ROUTES: SeoRoute[] = [
  {
    path: '/',
    aliases: [],
    title: 'Sulayman Bowles | Technical SEO Systems Builder',
    description:
      'Sulayman Bowles is a UT Austin McCombs student building technical SEO systems, Atlas crawl evidence, AI-search visibility workflows, and finance/data research.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, AI-search visibility, and finance/data research.',
    jsonLd: homeJsonLd(),
  },
  {
    path: '/work',
    aliases: [],
    title: 'Selected Work | Atlas, SEO & Finance Proof',
    description:
      'Selected public work from Sulayman Bowles across Atlas crawl evidence, technical SEO method, sanitized case-study logic, and finance/data artifacts.',
    h1: 'Selected Work',
    section: 'work',
    pageType: 'website',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Selected public work from Sulayman Bowles across Atlas crawl evidence, technical SEO method, sanitized case-study logic, and finance/data artifacts.',
    jsonLd: workJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | McCombs, SEO & Atlas',
    description:
      'About Sulayman Bowles: UT Austin McCombs student, Void Agency founder, and Atlas builder focused on technical SEO, AI-search visibility, and finance/data systems.',
    h1: 'About Sulayman Bowles',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Sulayman Bowles is a UT Austin McCombs student and builder/operator connecting Atlas, technical SEO, Void Agency, AI-search visibility, and finance/data research.',
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
    jsonLd: simpleBookJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Atlas SEO Audit Console | Crawl Evidence System',
    description:
      'Atlas SEO Audit Console is Sulayman Bowles crawl evidence system for indexation, internal links, canonicals, structured data, rendered HTML, and audit exports.',
    h1: 'Atlas SEO Audit Console',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Atlas is a technical SEO audit console for crawl evidence, indexation, architecture, internal links, structured data, performance inputs, and AI-search readiness.',
    jsonLd: atlasJsonLd(),
  },
  {
    path: '/atlas/sample-crawl',
    aliases: ['/atlas/sample-run'],
    title: 'Atlas Sample Crawl Run | Sanitized SEO Evidence',
    description:
      'A sanitized Atlas sample crawl run showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and downloadable CSV evidence.',
    h1: 'Atlas Sample Crawl Run',
    section: 'project',
    pageType: 'project',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'A sanitized Atlas sample crawl run showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and CSV evidence.',
    jsonLd: atlasSampleCrawlJsonLd(),
  },
  {
    path: '/atlas/celestial-parallax',
    aliases: ['/atlas-animation'],
    title: 'Atlas Celestial Parallax Prototype | Sulayman Bowles',
    description:
      'Temporary Atlas scroll-animation prototype exploring a celestial parallax treatment for the Atlas page hero and methodology transition.',
    h1: 'Atlas Celestial Parallax Prototype',
    section: 'project',
    pageType: 'project',
    priority: 0.2,
    includeInSitemap: false,
    generateStatic: true,
    noindex: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Temporary Atlas scroll-animation prototype exploring a celestial parallax treatment for the Atlas page hero and methodology transition.',
  },
  {
    path: '/resume',
    aliases: ['/resume.html', '/cv', '/cv.html', '/Sulayman_Bowles_Resume_2025.pdf'],
    title: 'Sulayman Bowles Resume | SEO, Product & Finance',
    description:
      'HTML-first resume for Sulayman Bowles covering UT Austin McCombs, Void Agency, Atlas, technical SEO, AI product research, finance/data work, and public proof links.',
    h1: 'Sulayman Bowles Resume',
    section: 'resume',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Stable resume and profile page for Sulayman Bowles with links to Atlas, technical SEO work, finance/data research, public code, LinkedIn, and contact paths.',
    jsonLd: resumeJsonLd(),
  },
  {
    path: '/ai-information',
    aliases: ['/official-information', '/entity-profile', '/source-information'],
    title: 'AI Information | Sulayman Bowles Source Graph',
    description: AI_INFORMATION_DESCRIPTION,
    h1: AI_INFORMATION_TITLE,
    section: 'source-information',
    pageType: 'profile',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Official public information about Sulayman Bowles, Void Agency, and Atlas SEO Audit Console for users, search engines, and AI search systems.',
    staticHtml: AI_INFORMATION_STATIC_HTML,
    jsonLd: aiInformationJsonLd(),
  },
  {
    path: '/research',
    aliases: ['/research-assets', '/proof-assets'],
    title: 'Research Assets | Technical SEO, AI Search & Atlas Data',
    description:
      'Citation-ready public research assets from Sulayman Bowles across technical SEO, AI-search crawler policy, Atlas crawl evidence, Austin crawlability, identity, and finance/data research.',
    h1: 'Research Assets',
    section: 'research',
    pageType: 'research',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Citation-ready public research assets across technical SEO, AI-search crawler policy, Atlas crawl evidence, Austin crawlability, identity, and finance/data research.',
    jsonLd: researchAssetsJsonLd(),
  },
  {
    path: '/sitemap',
    aliases: [],
    title: 'HTML Sitemap | Sulayman Bowles',
    description:
      'Plain HTML sitemap for sulayman-bowles.dev with canonical public routes for work, Atlas, method, markets, resume, contact, source graph, and research pages.',
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
      'Technical SEO audit method from Void Agency for crawl paths, indexation, internal links, structured data, analytics review, AI-search visibility, and implementation priorities.',
    h1: 'Void Agency Method',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Void Agency audits crawl paths, indexation, architecture, structured data, performance, analytics, and AI crawler access to improve search visibility.',
    jsonLd: methodJsonLd(),
  },
  {
    path: '/void-agency',
    aliases: [],
    title: 'Void Agency | Technical SEO & AI Search Audits',
    description:
      'Void Agency organization proof page for technical SEO, AI-search visibility, crawlability, indexation diagnostics, structured content, analytics review, and evidence-backed audits.',
    h1: 'Void Agency',
    section: 'organization',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Void Agency is the service branch connected to technical SEO, AI-search visibility, crawlability, indexation diagnostics, structured content, analytics review, and evidence-backed audits.',
    jsonLd: voidAgencyJsonLd(),
  },
  {
    path: '/contact',
    aliases: ['/audit-intake'],
    title: 'Request a Technical SEO Audit | Sulayman Bowles',
    description:
      'Request a technical SEO or AI-search visibility audit from Sulayman Bowles with crawl evidence, indexation, internal links, structured data, analytics, and source clarity.',
    h1: 'Request a Technical SEO Audit',
    section: 'contact',
    pageType: 'service',
    priority: 0.8,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Request a technical SEO or AI-search visibility audit from Sulayman Bowles with crawl evidence, indexation, internal links, structured data, analytics, and source clarity.',
    jsonLd: contactJsonLd(),
  },
  {
    path: '/austin-technical-seo',
    aliases: ['/austin-seo'],
    title: 'Austin Technical SEO & AI Search Visibility',
    description:
      'Austin technical SEO and AI-search visibility page for teams that need crawlability, indexation, structured data, source clarity, and implementation evidence reviewed.',
    h1: 'Austin Technical SEO',
    section: 'local-service',
    pageType: 'service',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Austin technical SEO and AI-search visibility page for teams that need crawlability, indexation, structured data, source clarity, and implementation evidence reviewed.',
    jsonLd: austinTechnicalSeoJsonLd(),
  },
  {
    path: '/case-studies/technical-seo-audit',
    aliases: ['/technical-seo-case-study'],
    title: 'Technical SEO Audit Case Study | Crawl Evidence',
    description:
      'A sanitized technical SEO audit case study showing how crawl evidence becomes findings, implementation priorities, and review artifacts without private client claims.',
    h1: 'Technical SEO Audit Case Study',
    section: 'case-study',
    pageType: 'article',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'A sanitized technical SEO audit case study showing how crawl evidence becomes findings, implementation priorities, and review artifacts without private client claims.',
    jsonLd: technicalSeoCaseStudyJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets Research | Separate Signal from Noise',
    description:
      'Markets research by Sulayman Bowles across market signals, crypto protocol notes, valuation logic, source tables, assumptions, and investment strategy artifacts.',
    h1: 'Separate Signal from Noise',
    section: 'research',
    pageType: 'research',
    priority: 0.7,
    includeInSitemap: true,
    lastmod: SITE_LASTMOD,
    staticSummary:
      'Markets Research separates signal from noise through evidence-driven research across markets, crypto, investment cases, and decision frameworks.',
    jsonLd: marketsJsonLd(
      'Markets Research | Separate Signal from Noise',
      'Markets research by Sulayman Bowles across market signals, crypto protocol notes, valuation logic, source tables, assumptions, and investment strategy artifacts.',
    ),
  },
];

const ARTICLE_ROUTES: SeoRoute[] = MARKET_THESES.map((thesis) => {
  const path = `/markets/${thesis.slug}`;
  const isIndexable = thesis.indexable !== false;
  const datePublished = thesis.date.replaceAll('.', '-');
  const dateModified = (thesis.dateModified ?? thesis.date).replaceAll('.', '-');

  return {
    path,
    aliases: [],
    title: `${thesis.seoTitle} | Sulayman Bowles`,
    description: thesis.seoDescription,
    h1: thesis.title,
    section: 'research-article',
    pageType: 'article',
    priority: isIndexable ? 0.6 : 0.2,
    includeInSitemap: isIndexable,
    generateStatic: !isIndexable,
    noindex: !isIndexable,
    lastmod: dateModified,
    staticSummary: thesis.content[0],
    image: thesis.image,
    jsonLd: marketArticleJsonLd({
      title: thesis.title,
      description: thesis.seoDescription,
      path,
      datePublished,
      dateModified,
      image: thesis.image,
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

  if (route?.section === 'research-article') {
    return 'memo-reader';
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
    return 'dark-proof';
  }

  return 'canvas-artifact';
}

export function getRouteTone(path: string): RouteTone {
  const mode = getRouteVisualMode(path);
  return mode === 'dark-proof' || mode === 'memo-reader' ? 'dark' : 'light';
}

export function getCanonicalRoutes() {
  return SEO_ROUTES.filter((route) => route.includeInSitemap);
}
