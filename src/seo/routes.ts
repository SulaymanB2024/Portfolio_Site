import { MARKET_THESES } from '../content/marketTheses';
import { AI_INFORMATION_DESCRIPTION, AI_INFORMATION_STATIC_HTML, AI_INFORMATION_TITLE } from '../content/aiInformation';
import {
  aboutJsonLd,
  aiInformationJsonLd,
  aiVisibilityJsonLd,
  atlasJsonLd,
  homeJsonLd,
  marketArticleJsonLd,
  marketsJsonLd,
  methodJsonLd,
  productDiscoveryJsonLd,
  localVisibilityJsonLd,
  resumeJsonLd,
  type JsonLd,
} from './schema';

export type RouteSection = 'home' | 'about' | 'resume' | 'source-information' | 'project' | 'service' | 'research' | 'research-article';

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
  lastmod?: string;
  staticSummary: string;
  staticHtml?: string;
  image?: string;
  jsonLd?: JsonLd;
}

export const SITE_LASTMOD = '2026-06-01';

const CORE_ROUTES: SeoRoute[] = [
  {
    path: '/',
    aliases: [],
    title: 'Sulayman Bowles | Technical SEO, AI Search, Finance/Data Systems',
    description:
      'Sulayman Bowles is a McCombs student and Void Agency founder building technical SEO systems, AI-search discoverability workflows, finance/data tools, and evidence-backed web experiences.',
    h1: 'Sulayman Bowles',
    section: 'home',
    pageType: 'website',
    priority: 1.0,
    includeInSitemap: true,
    staticSummary:
      'Technical SEO systems, AI-search discoverability workflows, finance/data tools, and evidence-backed web experiences built by Sulayman Bowles.',
    jsonLd: homeJsonLd(),
  },
  {
    path: '/about',
    aliases: [],
    title: 'About Sulayman Bowles | Technical SEO, AI Product & Finance/Data',
    description:
      'Learn about Sulayman Bowles, a McCombs student, Void Agency founder, AI product intern, and builder of technical SEO, AI-search, and finance/data systems.',
    h1: 'About Sulayman Bowles',
    section: 'about',
    pageType: 'profile',
    priority: 0.8,
    includeInSitemap: true,
    staticSummary:
      'Sulayman Bowles is a McCombs School of Business student at UT Austin, founder of Void Agency, and builder of Atlas, technical SEO systems, AI-search workflows, and finance/data tools.',
    jsonLd: aboutJsonLd(),
  },
  {
    path: '/atlas',
    aliases: ['/projects/atlas'],
    title: 'Atlas SEO Audit Console | Crawl Evidence, Indexation & AI Search',
    description:
      'Atlas is a technical SEO audit console built by Sulayman Bowles for crawl evidence, indexation, internal links, canonicals, structured data, performance inputs, and AI-search readiness.',
    h1: 'Atlas SEO Audit Console',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'Atlas is a technical SEO audit console for crawl evidence, indexation, architecture, internal links, structured data, performance inputs, and AI-search readiness.',
    jsonLd: atlasJsonLd(),
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
    path: '/ai-information',
    aliases: ['/official-information', '/entity-profile', '/source-information'],
    title: AI_INFORMATION_TITLE,
    description: AI_INFORMATION_DESCRIPTION,
    h1: AI_INFORMATION_TITLE,
    section: 'source-information',
    pageType: 'profile',
    priority: 0.7,
    includeInSitemap: true,
    staticSummary:
      'Official public information about Sulayman Bowles, Void Agency, and Atlas SEO Audit Console for users, search engines, and AI search systems.',
    staticHtml: AI_INFORMATION_STATIC_HTML,
    jsonLd: aiInformationJsonLd(),
  },
  {
    path: '/sitemap',
    aliases: [],
    title: 'HTML Sitemap | Sulayman Bowles',
    description: 'Plain HTML sitemap with direct links to every public page on sulayman-bowles.dev.',
    h1: 'HTML Sitemap',
    section: 'source-information',
    pageType: 'website',
    priority: 0.5,
    includeInSitemap: true,
    staticSummary: 'Plain HTML links to every public page on sulayman-bowles.dev.',
  },
  {
    path: '/method',
    aliases: ['/void-agency'],
    title: 'Void Agency Method | Technical SEO & AI Search Visibility Audits',
    description:
      'Void Agency audits crawl paths, indexation, architecture, structured data, performance, analytics, and AI crawler access to improve search visibility.',
    h1: 'Void Agency Method',
    section: 'service',
    pageType: 'service',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'Void Agency audits crawl paths, indexation, architecture, structured data, performance, analytics, and AI crawler access to improve search visibility.',
    jsonLd: methodJsonLd(),
  },
  {
    path: '/markets',
    aliases: ['/projects/markets'],
    title: 'Markets Research | Investment Cases, Valuation & Crypto Research',
    description:
      'A research archive for Sulayman Bowles covering traditional investment cases, crypto research, valuation logic, market systems, and finance/data reasoning.',
    h1: 'Markets Research',
    section: 'research',
    pageType: 'research',
    priority: 0.7,
    includeInSitemap: true,
    staticSummary:
      'Markets Research is a finance and data archive covering investment cases, valuation logic, crypto research, market systems, and decision frameworks.',
    jsonLd: marketsJsonLd(
      'Markets Research | Investment Cases, Valuation & Crypto Research',
      'A research archive for Sulayman Bowles covering traditional investment cases, crypto research, valuation logic, market systems, and finance/data reasoning.',
    ),
  },
  {
    path: '/ai-visibility-benchmark',
    aliases: ['/projects/ai-visibility-benchmark', '/method/ai-visibility-benchmark'],
    title: 'AI Visibility Benchmark | Void Agency',
    description:
      'An in-depth review of how search engines and LLM RAG systems crawl, interpret, and cite brand entities and structured data.',
    h1: 'AI Visibility Benchmark',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'The AI Visibility Benchmark audits a website’s entity clarity, AI agent permissions, retrieval readiness, and citation potential across search systems.',
    jsonLd: aiVisibilityJsonLd(),
  },
  {
    path: '/product-discovery-system',
    aliases: ['/projects/product-discovery-system', '/method/product-discovery-system'],
    title: 'Product Discovery System | Void Agency',
    description:
      'Detailed methodology for auditing e-commerce templates, keyword intent mappings, internal link equity, and canonical consolidations.',
    h1: 'Product Discovery System',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'The Product Discovery System evaluates template structures, intent alignment, parameter duplications, and crawl paths across e-commerce catalogs.',
    jsonLd: productDiscoveryJsonLd(),
  },
  {
    path: '/service-area-visibility-audit',
    aliases: ['/projects/service-area-visibility-audit', '/method/service-area-visibility-audit', '/service-area-visibility'],
    title: 'Service-Area Visibility Audit | Void Agency',
    description:
      'Analyzing territory landing page architecture, GBP signal metrics, NAP directories, and local link crawls.',
    h1: 'Service-Area Visibility Audit',
    section: 'project',
    pageType: 'project',
    priority: 0.9,
    includeInSitemap: true,
    staticSummary:
      'The Service-Area Visibility Audit maps territory landing page patterns, GBP local signals, and citation authority flow for local service businesses.',
    jsonLd: localVisibilityJsonLd(),
  },
];

const ARTICLE_ROUTES: SeoRoute[] = MARKET_THESES.map((thesis) => {
  const path = `/markets/${thesis.slug}`;

  return {
    path,
    aliases: [],
    title: `${thesis.title} | Sulayman Bowles`,
    description: thesis.subtitle,
    h1: thesis.title,
    section: 'research-article',
    pageType: 'article',
    priority: 0.6,
    includeInSitemap: true,
    staticSummary: thesis.content[0],
    jsonLd: marketArticleJsonLd({
      title: thesis.title,
      description: thesis.subtitle,
      path,
      datePublished: thesis.date.replaceAll('.', '-'),
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

export function getCanonicalRoutes() {
  return SEO_ROUTES.filter((route) => route.includeInSitemap);
}
