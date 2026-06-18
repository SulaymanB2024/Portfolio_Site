import { AI_INFORMATION_DESCRIPTION } from '../content/aiInformation';
import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  fanOutQueryMap,
  publicSourceGraph,
  type EvidenceListItem,
  type FanOutQueryMapItem,
} from '../content/evidenceLists';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './site';

export type JsonLd = Record<string, unknown>;

function graphSchema(items: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map(({ '@context': _context, ...item }) => item),
  };
}

const canonicalLogo = {
  '@type': 'ImageObject',
  '@id': `${SITE_URL}/#logo`,
  url: absoluteUrl(DEFAULT_OG_IMAGE),
};

export function personSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: canonicalLogo,
    image: canonicalLogo,
    mainEntityOfPage: absoluteUrl('/ai-information'),
    description:
      'Sulayman Bowles is a UT Austin McCombs student and technical systems builder focused on Atlas SEO Audit Console, technical SEO, AI-search visibility, and finance/data research.',
    sameAs: [
      'https://www.linkedin.com/in/sulayman-bowles/',
      'https://github.com/SulaymanB2024',
    ],
    affiliation: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'The University of Texas at Austin',
        url: 'https://www.utexas.edu/',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'McCombs School of Business',
        url: 'https://www.mccombs.utexas.edu/',
      },
      {
        '@type': 'Organization',
        name: 'Void Agency',
        '@id': `${SITE_URL}/#void-agency`,
      },
    ],
    knowsAbout: [
      'Technical SEO',
      'AI search discoverability',
      'AI search visibility',
      'AEO',
      'GEO',
      'Crawlability',
      'Indexation',
      'Structured data',
      'Finance and data analysis',
      'Market research',
      'Atlas SEO Audit Console',
      'Void Agency',
    ],
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
  };
}

export function voidAgencyOrganizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#void-agency`,
    name: 'Void Agency',
    url: 'https://www.void-agency.com/',
    logo: canonicalLogo,
    sameAs: ['https://www.void-agency.com/'],
    description:
      'Void Agency is a technical SEO and AI-search visibility practice connected to Sulayman Bowles work in crawlability, indexation diagnostics, structured content, analytics review, and evidence-backed web/search audits.',
    founder: {
      '@id': `${SITE_URL}/#person`,
    },
  };
}

export function canonicalEntitySchemas(): JsonLd[] {
  return [personSchema(), voidAgencyOrganizationSchema()];
}

function webPageSchema({
  path,
  name,
  description,
  mainEntityId,
  aboutIds = [],
}: {
  path: string;
  name: string;
  description: string;
  mainEntityId?: string;
  aboutIds?: string[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: 'en-US',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
    ...(aboutIds.length ? { about: aboutIds.map((id) => ({ '@id': id })) } : {}),
    primaryImageOfPage: canonicalLogo,
  };
}

function evidenceItemListSchema({
  id,
  name,
  description,
  path,
  items,
}: {
  id: string;
  name: string;
  description: string;
  path: string;
  items: EvidenceListItem[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#${id}`,
    name,
    url: `${absoluteUrl(path)}#${id}`,
    description,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.category ? `${item.category}: ${item.label}` : item.label,
      description: item.proves,
      url: absoluteUrl(item.href),
    })),
  };
}

function fanOutQueryItemListSchema(items: FanOutQueryMapItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/ai-information')}#fan-out-query-map`,
    name: 'Fan-Out Query Map',
    url: `${absoluteUrl('/ai-information')}#fan-out-query-map`,
    description:
      'A public map of likely search follow-up questions, the canonical page best suited to answer each one, missing content, and recommended edits.',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.originalQuery,
      description: `Likely fan-out queries: ${item.likelyFanOutQueries.join('; ')}. Missing content: ${item.missingContent}. Recommended edit: ${item.recommendedEdit}`,
      url: absoluteUrl(item.href),
    })),
  };
}

export function projectSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/atlas#software`,
    name: 'Atlas SEO Audit Console',
    url: absoluteUrl('/atlas'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    creator: {
      '@id': `${SITE_URL}/#person`,
    },
    description:
      'A technical SEO audit and evidence system for crawling websites, preserving raw and rendered page evidence, checking robots.txt and sitemap behavior, analyzing internal link graphs, scoring technical findings, persisting crawl data, and exporting operator or client-facing reports.',
    featureList: [
      'Crawling and URL discovery',
      'robots.txt and sitemap handling',
      'Raw HTML and rendered-page evidence',
      'SQLite persistence for crawl records',
      'Internal link graph analysis',
      'Canonical, noindex, redirect, and indexability checks',
      'Technical scoring and issue prioritization',
      'Operator dashboard and client-facing export structures',
    ],
  };
}

export function serviceSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/method#service`,
    name: 'Technical SEO and AI Search Visibility Audit',
    url: absoluteUrl('/method'),
    provider: {
      '@id': `${SITE_URL}/#void-agency`,
    },
    areaServed: 'United States',
    serviceType: [
      'Technical SEO Audit',
      'AI Search Visibility Audit',
      'Crawlability Audit',
      'Structured Data Audit',
    ],
    description:
      'Technical SEO and AI-search visibility audit work covering crawlability, robots.txt, sitemaps, raw and rendered HTML, canonical URLs, internal links, structured data, GSC/GA4 review, page templates, query buckets, and implementation recommendations.',
  };
}

export function collectionPageSchema(name: string, description: string, path: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#collection`,
    name,
    url: absoluteUrl(path),
    description,
    author: {
      '@id': `${SITE_URL}/#person`,
    },
  };
}

export function articleSchema({
  title,
  description,
  path,
  datePublished,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  image?: string;
}): JsonLd {
  const imageUrl = absoluteUrl(image);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    headline: title,
    name: title,
    url: absoluteUrl(path),
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    description,
    datePublished,
    author: {
      '@id': `${SITE_URL}/#person`,
    },
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homeJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    webPageSchema({
      path: '/',
      name: 'Sulayman Bowles',
      description:
        'Homepage for Sulayman Bowles, a UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, AI-search visibility, and finance/data research.',
      mainEntityId: `${SITE_URL}/#person`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
    }),
  ]);
}

export function aboutJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    webPageSchema({
      path: '/about',
      name: 'About Sulayman Bowles',
      description:
        'About page explaining Sulayman Bowles through UT Austin McCombs, Atlas SEO Audit Console, technical SEO, Void Agency, AI-search visibility, and finance/data research.',
      mainEntityId: `${SITE_URL}/#person`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/about')}#profile`,
      name: 'About Sulayman Bowles',
      url: absoluteUrl('/about'),
      description:
        'Profile page explaining Sulayman Bowles through one public thesis: UT Austin McCombs, Atlas SEO Audit Console, technical SEO, Void Agency, AI-search visibility, and finance/data research.',
      mainEntity: {
        '@id': `${SITE_URL}/#person`,
      },
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ]);
}

export function simpleBookJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    webPageSchema({
      path: '/simple',
      name: 'A Short Book About Sulayman Bowles',
      description:
        'First-person text edition explaining Sulayman Bowles, technical SEO, AI-search visibility, Atlas, Void Agency, Markets Research, finance/data work, and software systems.',
      mainEntityId: `${SITE_URL}/#person`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/simple')}#profile`,
      name: 'A Short Book About Sulayman Bowles',
      url: absoluteUrl('/simple'),
      description:
        'A first-person text edition of Sulayman Bowles website, covering technical SEO, AI-search visibility, Atlas, Void Agency, Markets Research, finance/data work, software systems, and current direction.',
      mainEntity: {
        '@id': `${SITE_URL}/#person`,
      },
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Book', path: '/simple' },
    ]),
  ]);
}

export function resumeJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    webPageSchema({
      path: '/resume',
      name: 'Sulayman Bowles Resume',
      description:
        'HTML-first canonical resume for Sulayman Bowles across UT Austin McCombs, Void Agency, Atlas, technical SEO, AI-search visibility, finance/data research, public code, and professional profiles.',
      mainEntityId: `${SITE_URL}/#person`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/resume')}#profile`,
      name: 'Sulayman Bowles Resume | Technical SEO, Atlas & Finance/Data',
      url: absoluteUrl('/resume'),
      description:
        'HTML-first canonical resume for Sulayman Bowles across UT Austin McCombs, Void Agency, Atlas, technical SEO, AI-search visibility, finance/data research, public code, and professional profiles.',
      mainEntity: {
        '@id': `${SITE_URL}/#person`,
      },
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Resume', path: '/resume' },
    ]),
  ]);
}

export function aiInformationJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    projectSchema(),
    webPageSchema({
      path: '/ai-information',
      name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
      description: AI_INFORMATION_DESCRIPTION,
      mainEntityId: `${SITE_URL}/#person`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
    }),
    evidenceItemListSchema({
      id: 'public-source-graph',
      name: 'Public Source Graph',
      description:
        'A categorized list of public sources that explain Sulayman Bowles, Atlas SEO Audit Console, Void Agency, academic context, research artifacts, and clarification boundaries.',
      path: '/ai-information',
      items: publicSourceGraph,
    }),
    fanOutQueryItemListSchema(fanOutQueryMap),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/ai-information')}#profile`,
      name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
      url: absoluteUrl('/ai-information'),
      description: AI_INFORMATION_DESCRIPTION,
      mainEntity: {
        '@id': `${SITE_URL}/#person`,
      },
      about: [
        { '@id': `${SITE_URL}/#person` },
        { '@id': `${SITE_URL}/#void-agency` },
        { '@id': `${SITE_URL}/atlas#software` },
      ],
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'AI Information', path: '/ai-information' },
    ]),
  ]);
}

export function atlasJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    projectSchema(),
    webPageSchema({
      path: '/atlas',
      name: 'Atlas SEO Audit Console',
      description:
        'Canonical software/project page for Atlas SEO Audit Console, a crawl and evidence system for technical SEO, indexation, internal links, structured data, scoring, and exports.',
      mainEntityId: `${SITE_URL}/atlas#software`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/#void-agency`],
    }),
    evidenceItemListSchema({
      id: 'atlas-checks',
      name: 'What Atlas SEO Audit Console Checks',
      description:
        'Evidence-facing list of technical SEO checks handled by Atlas SEO Audit Console, aligned with visible page copy.',
      path: '/atlas',
      items: atlasCheckItems,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Atlas', path: '/atlas' },
    ]),
  ]);
}

export function methodJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    serviceSchema(),
    webPageSchema({
      path: '/method',
      name: 'Void Agency Method',
      description:
        'Canonical service/process page for Void Agency technical SEO and AI-search visibility audits.',
      mainEntityId: `${SITE_URL}/method#service`,
      aboutIds: [`${SITE_URL}/#person`, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
    }),
    evidenceItemListSchema({
      id: 'ai-search-visibility-checklist',
      name: 'AI Search Visibility Audit Checklist',
      description:
        'Evidence-facing checklist for crawlability, indexability, source clarity, entity consistency, public proof, freshness, and stale-source cleanup.',
      path: '/method',
      items: aiSearchAuditChecklist,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
    ]),
  ]);
}

export function marketsJsonLd(title: string, description: string, path = '/markets'): JsonLd {
  const collectionId = `${absoluteUrl(path)}#collection`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    collectionPageSchema(title, description, path),
    webPageSchema({
      path,
      name: title,
      description,
      mainEntityId: collectionId,
      aboutIds: [`${SITE_URL}/#person`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path },
    ]),
  ]);
}

export function marketArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  image,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  image?: string;
}): JsonLd {
  const articleId = `${absoluteUrl(path)}#article`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    articleSchema({ title, description, path, datePublished, image }),
    webPageSchema({
      path,
      name: title,
      description,
      mainEntityId: articleId,
      aboutIds: [`${SITE_URL}/#person`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: title, path },
    ]),
  ]);
}
