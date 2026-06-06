import { absoluteUrl, SITE_NAME, SITE_URL } from './site';

export type JsonLd = Record<string, unknown>;

function graphSchema(items: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map(({ '@context': _context, ...item }) => item),
  };
}

export function personSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: [
      'https://www.linkedin.com/in/sulayman-bowles/',
      'https://github.com/SulaymanB2024',
    ],
    affiliation: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'The University of Texas at Austin',
      },
      {
        '@type': 'Organization',
        name: 'Void Agency',
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
    url: 'https://void-agency.com',
    founder: {
      '@id': `${SITE_URL}/#person`,
    },
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
    creator: {
      '@id': `${SITE_URL}/#person`,
    },
    description:
      'A technical SEO audit console for crawl evidence, indexation, architecture, internal links, structured data, performance inputs, and AI-search readiness.',
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
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    headline: title,
    name: title,
    url: absoluteUrl(path),
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
  return graphSchema([personSchema(), websiteSchema()]);
}

export function aboutJsonLd(): JsonLd {
  return graphSchema([
    personSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ]);
}

export function resumeJsonLd(): JsonLd {
  return graphSchema([
    personSchema(),
    websiteSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/resume')}#profile`,
      name: 'Sulayman Bowles Resume | Technical SEO, Finance & AI',
      url: absoluteUrl('/resume'),
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
    personSchema(),
    websiteSchema(),
    voidAgencyOrganizationSchema(),
    projectSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/ai-information')}#profile`,
      name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
      url: absoluteUrl('/ai-information'),
      description:
        'Official public information about Sulayman Bowles, Void Agency, and Atlas SEO Audit Console for users, search engines, and AI search systems.',
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
    projectSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Atlas', path: '/atlas' },
    ]),
  ]);
}

export function methodJsonLd(): JsonLd {
  return graphSchema([
    voidAgencyOrganizationSchema(),
    serviceSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
    ]),
  ]);
}

export function marketsJsonLd(title: string, description: string, path = '/markets'): JsonLd {
  return graphSchema([
    collectionPageSchema(title, description, path),
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
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
}): JsonLd {
  return graphSchema([
    articleSchema({ title, description, path, datePublished }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: title, path },
    ]),
  ]);
}

export function aiVisibilityJsonLd(): JsonLd {
  return graphSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/ai-visibility-benchmark#service`,
      name: 'AI Visibility Benchmark',
      url: absoluteUrl('/ai-visibility-benchmark'),
      provider: {
        '@id': `${SITE_URL}/#void-agency`,
      },
      description:
        'An in-depth review of how search engines and LLM RAG systems crawl, interpret, and cite brand entities and structured data.',
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
      { name: 'AI Visibility', path: '/ai-visibility-benchmark' },
    ]),
  ]);
}

export function productDiscoveryJsonLd(): JsonLd {
  return graphSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/product-discovery-system#service`,
      name: 'Product Discovery System',
      url: absoluteUrl('/product-discovery-system'),
      provider: {
        '@id': `${SITE_URL}/#void-agency`,
      },
      description:
        'Detailed methodology for auditing e-commerce templates, keyword intent mappings, internal link equity, and canonical consolidations.',
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
      { name: 'Product Discovery', path: '/product-discovery-system' },
    ]),
  ]);
}

export function localVisibilityJsonLd(): JsonLd {
  return graphSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/service-area-visibility-audit#service`,
      name: 'Service-Area Visibility Audit',
      url: absoluteUrl('/service-area-visibility-audit'),
      provider: {
        '@id': `${SITE_URL}/#void-agency`,
      },
      description:
        'Analyzing territory landing page architecture, GBP signal metrics, NAP directories, and local link crawls.',
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
      { name: 'Local Visibility', path: '/service-area-visibility-audit' },
    ]),
  ]);
}

