import {
  AI_INFORMATION_DESCRIPTION,
  CANONICAL_PERSON_ID,
  expertiseAreas,
} from '../content/aiInformation';
import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  publicSourceGraph,
  type EvidenceListItem,
} from '../content/evidenceLists';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
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

const schemaDateModified = '2026-07-12';
const personId = CANONICAL_PERSON_ID;
const directEmail = 'sulayman.bowles@gmail.com';

const primarySiteParts = [
  { name: 'About Sulayman Bowles', path: '/about' },
  { name: 'Selected Work', path: '/work' },
  { name: 'Atlas SEO Audit Console', path: '/atlas' },
  { name: 'Void Agency Method', path: '/method' },
  { name: 'AI Information', path: '/ai-information' },
  { name: 'Contact Sulayman Bowles', path: '/contact' },
  { name: 'Research Assets', path: '/research' },
];

function contactPointSchema(): JsonLd {
  return {
    '@type': 'ContactPoint',
    '@id': `${absoluteUrl('/contact')}#technical-seo-contact`,
    contactType: 'technical SEO, AI-search visibility, crawl evidence, analytics, and source-backed research inquiries',
    email: directEmail,
    url: absoluteUrl('/contact'),
    availableLanguage: ['en-US', 'English'],
  };
}

export function personSchema({
  includeVoidAgencyAffiliation = false,
  includeContactPoint = false,
}: {
  includeVoidAgencyAffiliation?: boolean;
  includeContactPoint?: boolean;
} = {}): JsonLd {
  const affiliation: JsonLd[] = [
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
  ];

  if (includeVoidAgencyAffiliation) {
    affiliation.push({
      '@type': 'Organization',
      name: 'Void Agency',
      '@id': `${SITE_URL}/#void-agency`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: SITE_NAME,
    url: SITE_URL,
    logo: canonicalLogo,
    image: canonicalLogo,
    jobTitle: 'Technical systems builder',
    mainEntityOfPage: absoluteUrl('/ai-information'),
    description:
      'Sulayman Bowles is a UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, AI-search visibility, and finance/data research.',
    sameAs: [
      'https://www.linkedin.com/in/sulayman-bowles/',
      'https://github.com/SulaymanB2024',
      'https://devpost.com/sulayman-bowles',
      'https://sulayman-bowles.tech/',
    ],
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'canonical domain',
        value: 'sulayman-bowles.dev',
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'GitHub username',
        value: 'SulaymanB2024',
      },
    ],
    subjectOf: [
      {
        '@type': 'WebPage',
        name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
        url: absoluteUrl('/ai-information'),
        description:
          'Canonical public source page for current identity, source graph, clarifications, crawler signals, and AI-search context.',
      },
      {
        '@type': 'ProfilePage',
        name: 'SulaymanB2024 GitHub profile',
        url: 'https://github.com/SulaymanB2024',
        description: 'Public code profile for portfolio, crawler, technical SEO, and finance/data projects.',
      },
      {
        '@type': 'ProfilePage',
        name: 'Sulayman Bowles Devpost profile',
        url: 'https://devpost.com/sulayman-bowles',
        description: 'Public project and hackathon profile corroborating the technical builder identity.',
      },
      {
        '@type': 'WebPage',
        name: 'Void Agency',
        url: 'https://www.void-agency.com/',
        description: 'Public agency branch connected to technical SEO, AI-search visibility, and evidence-backed audits.',
      },
      {
        '@type': 'WebPage',
        name: 'Sulayman Bowles Technical Ledger',
        url: 'https://sulayman-bowles.tech/',
        description: 'Public technical ledger for projects, experiments, artifacts, and competition proof connected to the canonical identity hub.',
      },
      {
        '@type': 'WebPage',
        name: 'Golden Hornet Young Composers Concert',
        url: 'https://www.goldenhornet.org/calendar/young-composers-concert-2022',
        description:
          'Historical composition-background source that should be interpreted as earlier context, not current primary positioning.',
      },
      {
        '@type': 'WebPage',
        name: 'UT Butler University Orchestra',
        url: 'https://music.utexas.edu/events/4645-university-orchestra',
        description:
          'Historical classical-bass source that should be reconciled with the current McCombs, Atlas, technical SEO, AI-search visibility, and finance/data positioning.',
      },
    ],
    affiliation,
    knowsLanguage: ['English'],
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
    ...(includeContactPoint ? { contactPoint: [contactPointSchema()] } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Personal site for Sulayman Bowles covering Atlas, technical SEO, AI-search visibility, finance/data research, public source context, and selected work.',
    inLanguage: 'en-US',
    publisher: {
      '@id': personId,
    },
    about: [
      { '@id': personId },
      { '@id': `${SITE_URL}/atlas#software` },
      { '@id': `${SITE_URL}/#void-agency` },
    ],
    hasPart: primarySiteParts.map((part) => ({
      '@type': 'WebPage',
      name: part.name,
      url: absoluteUrl(part.path),
    })),
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
      '@id': personId,
    },
    contactPoint: [contactPointSchema()],
    areaServed: 'United States',
  };
}

export function canonicalEntitySchemas({
  includeVoidAgency = false,
  includeContactPoint = false,
}: {
  includeVoidAgency?: boolean;
  includeContactPoint?: boolean;
} = {}): JsonLd[] {
  return [
    personSchema({
      includeVoidAgencyAffiliation: includeVoidAgency,
      includeContactPoint,
    }),
    ...(includeVoidAgency ? [voidAgencyOrganizationSchema()] : []),
  ];
}

function webPageSchema({
  path,
  name,
  description,
  mainEntityId,
  aboutIds = [],
  additionalType,
  dateModified,
}: {
  path: string;
  name: string;
  description: string;
  mainEntityId?: string;
  aboutIds?: string[];
  additionalType?: string;
  dateModified?: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': additionalType ? ['WebPage', additionalType] : 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: 'en-US',
    ...(dateModified ? { dateModified } : {}),
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


function expertiseDefinedTermSetSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${absoluteUrl('/ai-information')}#expertise-areas`,
    name: 'Relevant Expertise Areas',
    description:
      'Public expertise terms stated on the AI information page for Sulayman Bowles.',
    hasDefinedTerm: expertiseAreas.map((area, index) => ({
      '@type': 'DefinedTerm',
      '@id': `${absoluteUrl('/ai-information')}#expertise-${index + 1}`,
      name: area,
    })),
  };
}

function methodOfferCatalogSchema(): JsonLd {
  const offers = [
    {
      name: 'Indexation Audit at Scale',
      url: absoluteUrl('/atlas'),
      serviceType: 'Technical SEO Audit',
      description:
        'Crawl waste, duplicate templates, canonicals, orphaned pages, redirects, and blocked discovery review.',
    },
    {
      name: 'Public Page Clarity Review',
      url: absoluteUrl('/ai-information'),
      serviceType: 'AI Search Visibility Audit',
      description:
        'Entity clarity, page structure, schema, source material, and crawler access review.',
    },
    {
      name: 'Product Discovery System',
      url: absoluteUrl('/contact'),
      serviceType: 'Product and Collection Page SEO Audit',
      description:
        'Metadata, thin templates, internal links, duplicate paths, and search-intent gap review.',
    },
    {
      name: 'Service-Area Visibility Audit',
      url: absoluteUrl('/austin-technical-seo'),
      serviceType: 'Local Search Visibility Audit',
      description:
        'Service pages, location pages, local entity clarity, crawl structure, and measurement-path review.',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${absoluteUrl('/method')}#offer-catalog`,
    name: 'Technical SEO and AI Search Audit Offer Catalog',
    description:
      'Service examples visible on the Void Agency method page for technical SEO and AI-search visibility audits.',
    itemListElement: offers.map((offer) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: offer.name,
        url: offer.url,
        serviceType: offer.serviceType,
        description: offer.description,
        provider: {
          '@id': `${SITE_URL}/#void-agency`,
        },
      },
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
      '@id': personId,
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
    hasOfferCatalog: {
      '@id': `${absoluteUrl('/method')}#offer-catalog`,
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl('/contact'),
      availableLanguage: ['en-US', 'English'],
    },
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
      '@id': personId,
    },
  };
}

export function articleSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
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
    dateModified: dateModified ?? datePublished,
    author: {
      '@id': personId,
    },
    publisher: {
      '@id': personId,
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
      mainEntityId: personId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
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
        'About page explaining Sulayman Bowles through UT Austin McCombs, Atlas, technical SEO, Void Agency, AI-search visibility, and finance/data research.',
      mainEntityId: personId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
      additionalType: 'AboutPage',
      dateModified: schemaDateModified,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/about')}#profile`,
      name: 'About Sulayman Bowles',
      url: absoluteUrl('/about'),
      description:
        'Profile page explaining Sulayman Bowles through one public thesis: UT Austin McCombs, Atlas, technical SEO, Void Agency, AI-search visibility, and finance/data research.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': personId,
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
      mainEntityId: personId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/simple')}#profile`,
      name: 'A Short Book About Sulayman Bowles',
      url: absoluteUrl('/simple'),
      description:
        'A first-person text edition of Sulayman Bowles website, covering technical SEO, AI-search visibility, Atlas, Void Agency, Markets Research, finance/data work, software systems, and current direction.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': personId,
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
      mainEntityId: personId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/resume')}#profile`,
      name: 'Sulayman Bowles Resume | Technical SEO, Atlas & Finance/Data',
      url: absoluteUrl('/resume'),
      description:
        'HTML-first canonical resume for Sulayman Bowles across UT Austin McCombs, Void Agency, Atlas, technical SEO, AI-search visibility, finance/data research, public code, and professional profiles.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': personId,
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
    ...canonicalEntitySchemas({ includeVoidAgency: true }),
    websiteSchema(),
    projectSchema(),
    webPageSchema({
      path: '/ai-information',
      name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
      description: AI_INFORMATION_DESCRIPTION,
      mainEntityId: personId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
      additionalType: 'AboutPage',
      dateModified: schemaDateModified,
    }),
    evidenceItemListSchema({
      id: 'public-source-graph',
      name: 'Public Source Graph',
      description:
        'A categorized list of public sources that explain Sulayman Bowles, Atlas SEO Audit Console, Void Agency, academic context, research artifacts, and clarification boundaries.',
      path: '/ai-information',
      items: publicSourceGraph,
    }),
    expertiseDefinedTermSetSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/ai-information')}#profile`,
      name: 'AI Information for Sulayman Bowles, Void Agency, and Atlas',
      url: absoluteUrl('/ai-information'),
      description: AI_INFORMATION_DESCRIPTION,
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': personId,
      },
      about: [
        { '@id': personId },
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
      aboutIds: [personId],
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
    ...canonicalEntitySchemas({ includeVoidAgency: true }),
    websiteSchema(),
    serviceSchema(),
    methodOfferCatalogSchema(),
    webPageSchema({
      path: '/method',
      name: 'Void Agency Method',
      description:
        'Canonical service/process page for Void Agency technical SEO and AI-search visibility audits.',
      mainEntityId: `${SITE_URL}/method#service`,
      aboutIds: [personId, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
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

export function workJsonLd(): JsonLd {
  const collectionId = `${absoluteUrl('/work')}#collection`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    collectionPageSchema(
      'Selected Work',
      'Selected public work from Sulayman Bowles across Atlas crawl evidence, technical SEO method, an illustrative audit walkthrough, and finance/data artifacts.',
      '/work',
    ),
    webPageSchema({
      path: '/work',
      name: 'Selected Work',
      description:
        'A canonical work index for Sulayman Bowles with contextual proof links to Atlas sample crawl data, technical SEO method, public code, audit intake, and finance/data assumptions.',
      mainEntityId: collectionId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
    ]),
  ]);
}

export function contactJsonLd(): JsonLd {
  const serviceId = `${absoluteUrl('/contact')}#audit-intake-service`;

  return graphSchema([
    ...canonicalEntitySchemas({ includeContactPoint: true }),
    websiteSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': serviceId,
      name: 'Technical SEO Audit Intake',
      url: absoluteUrl('/contact'),
      provider: {
        '@id': personId,
      },
      serviceType: ['Technical SEO Audit', 'AI Search Visibility Audit', 'Crawlability Review'],
      areaServed: 'United States',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absoluteUrl('/contact'),
        availableLanguage: ['en-US', 'English'],
      },
      description:
        'Contact and compact audit brief path for technical SEO, AI-search visibility, crawl evidence, analytics, source-backed research, and audit-scope requests.',
    },
    webPageSchema({
      path: '/contact',
      name: 'Contact Sulayman Bowles',
      description:
        'Contact page for Sulayman Bowles with a direct email path, compact Formspree brief form, and links to LinkedIn, GitHub, resume, public site, Atlas sample crawl evidence, and the technical SEO method.',
      mainEntityId: serviceId,
      aboutIds: [personId],
      additionalType: 'ContactPage',
      dateModified: schemaDateModified,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  ]);
}

export function atlasSampleCrawlJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    projectSchema(),
    webPageSchema({
      path: '/atlas/sample-crawl',
      name: 'Atlas Sample Crawl Run',
      description:
        'A sanitized Atlas sample crawl table showing URL status, indexability, crawl depth, link counts, canonical state, issue labels, and evidence notes.',
      mainEntityId: `${SITE_URL}/atlas#software`,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${absoluteUrl('/atlas/sample-crawl')}#sanitized-crawl-dataset`,
      name: 'Atlas Sanitized Crawl Sample',
      url: absoluteUrl('/research/atlas-sanitized-crawl-sample.csv'),
      description:
        'Sanitized/demo crawl sample with URL-level technical SEO fields. It is not a private client export or ranking claim.',
      license: 'https://creativecommons.org/licenses/by/4.0',
      creator: {
        '@id': personId,
      },
      isAccessibleForFree: true,
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Atlas', path: '/atlas' },
      { name: 'Sample Crawl', path: '/atlas/sample-crawl' },
    ]),
  ]);
}

export function technicalSeoCaseStudyJsonLd(): JsonLd {
  const articleId = `${absoluteUrl('/case-studies/technical-seo-audit')}#article`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    articleSchema({
      title: 'Technical SEO Audit Method Walkthrough',
      description:
        'An illustrative technical SEO method walkthrough showing how crawl evidence can become findings and implementation work without presenting a completed client result.',
      path: '/case-studies/technical-seo-audit',
      datePublished: '2026-06-21',
    }),
    webPageSchema({
      path: '/case-studies/technical-seo-audit',
      name: 'Technical SEO Audit Method Walkthrough',
      description:
        'An illustrative walkthrough showing an evidence chain from crawl fields to interpreted risk, implementation action, and review artifacts.',
      mainEntityId: articleId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
      { name: 'Technical SEO Audit Method Walkthrough', path: '/case-studies/technical-seo-audit' },
    ]),
  ]);
}

export function viralBenchArticleJsonLd(): JsonLd {
  const path = '/viralbench-codex-agent-harness';
  const title = 'Beyond the Leaderboard: Building a Codex-Powered Improvement Harness on ViralBench';
  const description =
    'How I’m turning ViralBench into a Codex-powered agent harness for replay, trace evaluation, controlled experiments, and safer marketing automation.';
  const articleId = `${absoluteUrl(path)}#article`;
  const image = absoluteUrl('/images/viralbench-codex-harness.svg');
  const article = articleSchema({
    title,
    description,
    path,
    datePublished: '2026-07-09',
    dateModified: '2026-07-09',
    image,
  });

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    {
      ...article,
      '@type': ['Article', 'BlogPosting'],
      alternativeHeadline: 'ViralBench + Codex: Building an AI Agent Evaluation Harness',
      articleSection: 'AI Systems Engineering',
      keywords: [
        'ViralBench',
        'Codex agent harness',
        'AI agent evaluation harness',
        'autonomous marketing agent',
        'AI marketing benchmark',
        'agent replay testing',
        'harness engineering',
      ],
      about: [
        { '@type': 'Thing', name: 'ViralBench', sameAs: 'https://viralbench.ai/' },
        {
          '@type': 'SoftwareApplication',
          name: 'Codex',
          applicationCategory: 'DeveloperApplication',
          sameAs: 'https://developers.openai.com/codex',
        },
        { '@type': 'Thing', name: 'AI agent evaluation' },
      ],
      citation: [
        'https://viralbench.ai/',
        'https://github.com/JibranK12345/Viral-Bench',
        'https://openai.com/index/harness-engineering/',
        'https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop',
        'https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content',
      ],
    },
    webPageSchema({
      path,
      name: title,
      description,
      mainEntityId: articleId,
      aboutIds: [personId],
      dateModified: '2026-07-09',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${absoluteUrl(path)}#faq`,
      mainEntity: [
        [
          'What is ViralBench?',
          'ViralBench is a live AI marketing benchmark in which frontier models operate TikTok accounts and try to maximize views in the fitness category.',
        ],
        [
          'What is an AI agent harness?',
          'An agent harness is the operating system around a model: instructions, tools, schemas, memory, permissions, execution loop, tests, traces, validation rules, and deployment boundaries.',
        ],
        [
          'How would Codex use ViralBench as a harness?',
          'Codex would operate outside the content agent, inspect failed runs, modify a bounded part of the repository, run replay tests, and produce a candidate patch for review.',
        ],
        [
          'Why is offline replay necessary?',
          'Replay catches process failures cheaply and repeatedly. It cannot predict TikTok distribution, so it is a prerequisite for a live test rather than a substitute for one.',
        ],
      ].map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Research', path: '/research' },
      { name: 'ViralBench + Codex Agent Harness', path },
    ]),
  ]);
}

export function austinTechnicalSeoJsonLd(): JsonLd {
  const serviceId = `${absoluteUrl('/austin-technical-seo')}#service`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': serviceId,
      name: 'Austin Technical SEO and AI Search Visibility',
      url: absoluteUrl('/austin-technical-seo'),
      provider: {
        '@id': personId,
      },
      areaServed: {
        '@type': 'City',
        name: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      serviceType: ['Technical SEO Audit', 'AI Search Visibility Audit', 'Local Search Visibility Review'],
      description:
        'Technical SEO and AI-search visibility audit work for Austin teams that need crawlability, indexation, structured data, source clarity, and implementation evidence reviewed.',
    },
    webPageSchema({
      path: '/austin-technical-seo',
      name: 'Austin Technical SEO and AI Search Visibility',
      description:
        'A local service-intent page for Austin technical SEO and AI-search visibility work with conservative claim boundaries and links to method, sample crawl data, and intake.',
      mainEntityId: serviceId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Austin Technical SEO', path: '/austin-technical-seo' },
    ]),
  ]);
}

export function researchAssetsJsonLd(): JsonLd {
  const collectionId = `${absoluteUrl('/research')}#collection`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    collectionPageSchema(
      'Research Assets',
      'Citation-ready technical SEO, AI-search, Atlas, crawlability, identity, and finance/data research assets from Sulayman Bowles.',
      '/research',
    ),
    webPageSchema({
      path: '/research',
      name: 'Research Assets',
      description:
        'Public index of citation-ready technical SEO, AI-search, Atlas, crawlability, identity, and finance/data research assets with source-file links and claim boundaries.',
      mainEntityId: collectionId,
      aboutIds: [personId, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${absoluteUrl('/research')}#asset-list`,
      name: 'Citation-Ready Research Assets',
      url: `${absoluteUrl('/research')}#asset-list`,
      description:
        'Prioritized public pages and files that can be cited in technical SEO, AI-search, Atlas, crawlability, identity, and finance/data contexts.',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: publicResearchAssets.length,
      itemListElement: publicResearchAssets.map((asset, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: asset.name,
        description: `${asset.description} Claim boundary: ${asset.claimBoundary}`,
        url: absoluteUrl(asset.href),
      })),
    },
    ...publicDataDownloads.map((download) => ({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${absoluteUrl(download.href)}#asset`,
      name: download.label,
      url: absoluteUrl(download.href),
      description: download.description,
      isAccessibleForFree: true,
      creator: {
        '@id': personId,
      },
      isPartOf: {
        '@id': collectionId,
      },
    })),
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${absoluteUrl('/research')}#claim-boundaries`,
      name: 'Research Asset Claim Boundaries',
      description: 'Explicit limits for interpreting the research assets on sulayman-bowles.dev.',
      hasDefinedTerm: researchClaimBoundaries.map((boundary, index) => ({
        '@type': 'DefinedTerm',
        '@id': `${absoluteUrl('/research')}#claim-boundary-${index + 1}`,
        name: `Claim boundary ${index + 1}`,
        description: boundary,
      })),
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Research Assets', path: '/research' },
    ]),
  ]);
}

export function voidAgencyJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas({ includeVoidAgency: true }),
    websiteSchema(),
    webPageSchema({
      path: '/void-agency',
      name: 'Void Agency',
      description:
        'Canonical organization proof page for Void Agency, the service branch connected to Sulayman Bowles technical SEO, AI-search visibility, crawlability, and evidence-backed audits.',
      mainEntityId: `${SITE_URL}/#void-agency`,
      aboutIds: [personId, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Void Agency', path: '/void-agency' },
    ]),
  ]);
}

export function sitemapJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    webPageSchema({
      path: '/sitemap',
      name: 'HTML Sitemap',
      description:
        'Plain HTML sitemap for sulayman-bowles.dev with canonical public routes for work, Atlas, method, markets, resume, contact, source graph, and research pages.',
      aboutIds: [personId],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Sitemap', path: '/sitemap' },
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
      aboutIds: [personId],
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
  dateModified,
  image,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}): JsonLd {
  const articleId = `${absoluteUrl(path)}#article`;

  return graphSchema([
    ...canonicalEntitySchemas(),
    websiteSchema(),
    articleSchema({ title, description, path, datePublished, dateModified, image }),
    webPageSchema({
      path,
      name: title,
      description,
      mainEntityId: articleId,
      aboutIds: [personId],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: title, path },
    ]),
  ]);
}
