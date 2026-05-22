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
      '@type': 'Organization',
      name: 'Void Agency',
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
