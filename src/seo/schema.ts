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
      'https://bento.me/sulayman-bowles',
      SITE_URL,
    ],
    mainEntityOfPage: {
      '@id': absoluteUrl('/about'),
    },
    affiliation: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'The University of Texas at Austin',
      },
      {
        '@id': `${SITE_URL}/#void-agency`,
      },
    ],
    worksFor: {
      '@id': `${SITE_URL}/#void-agency`,
    },
    knowsAbout: [
      'Technical SEO',
      'AI crawler access',
      'Crawlability',
      'Indexation',
      'Structured data',
      'Finance and data analysis',
    ],
  };
}

export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#void-agency`,
    name: 'Void Agency',
    url: absoluteUrl('/method'),
    founder: {
      '@id': `${SITE_URL}/#person`,
    },
    sameAs: [absoluteUrl('/method')],
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

function entityGraph(): JsonLd[] {
  return [personSchema(), organizationSchema(), websiteSchema()];
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
      'A technical SEO audit console for crawl records, indexation, architecture, internal links, structured data, performance inputs, exports, and crawler access checks.',
  };
}

export function serviceSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/method#service`,
    name: 'Technical SEO and AI Crawler Access Audit',
    url: absoluteUrl('/method'),
    provider: {
      '@id': `${SITE_URL}/#void-agency`,
    },
    areaServed: 'United States',
    serviceType: [
      'Technical SEO Audit',
      'AI Crawler Access Audit',
      'Crawlability Audit',
      'Structured Data Audit',
    ],
  };
}

export function webPageSchema({
  name,
  description,
  path,
  about,
}: {
  name: string;
  description: string;
  path: string;
  about?: JsonLd;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    url: absoluteUrl(path),
    description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    author: {
      '@id': `${SITE_URL}/#person`,
    },
    ...(about ? { about } : {}),
  };
}

export function profilePageSchema(): JsonLd {
  return {
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
  return graphSchema(entityGraph());
}

export function aboutJsonLd(): JsonLd {
  return graphSchema([
    ...entityGraph(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ]);
}

export function resumeJsonLd(): JsonLd {
  return graphSchema([
    ...entityGraph(),
    profilePageSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Resume', path: '/resume' },
    ]),
  ]);
}

export function atlasJsonLd(): JsonLd {
  return graphSchema([
    ...entityGraph(),
    projectSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Atlas', path: '/atlas' },
    ]),
  ]);
}

export function methodJsonLd(): JsonLd {
  return graphSchema([
    ...entityGraph(),
    serviceSchema(),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Method', path: '/method' },
    ]),
  ]);
}

export function marketsJsonLd(title: string, description: string, path = '/markets'): JsonLd {
  return graphSchema([
    ...entityGraph(),
    collectionPageSchema(title, description, path),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path },
    ]),
  ]);
}

export function intentPageJsonLd({
  title,
  description,
  path,
  parentName,
  parentPath,
  kind,
}: {
  title: string;
  description: string;
  path: string;
  parentName: string;
  parentPath: string;
  kind: 'project' | 'service' | 'research';
}): JsonLd {
  const about =
    kind === 'project'
      ? { '@id': `${SITE_URL}/atlas#software` }
      : kind === 'service'
        ? { '@id': `${SITE_URL}/method#service` }
        : { '@id': `${absoluteUrl('/markets')}#collection` };

  return graphSchema([
    ...entityGraph(),
    ...(kind === 'project' ? [projectSchema()] : []),
    ...(kind === 'service' ? [serviceSchema()] : []),
    webPageSchema({ name: title, description, path, about }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: parentName, path: parentPath },
      { name: title, path },
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
    ...entityGraph(),
    articleSchema({ title, description, path, datePublished }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: title, path },
    ]),
  ]);
}
