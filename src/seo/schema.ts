import { AI_INFORMATION_DESCRIPTION, expertiseAreas, providerDiscoveryPlan } from '../content/aiInformation';
import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  fanOutQueryMap,
  publicSourceGraph,
  type EvidenceListItem,
  type FanOutQueryMapItem,
} from '../content/evidenceLists';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
import { absoluteUrl, DEFAULT_OG_IMAGE, PERSON_ID, SITE_NAME, SITE_URL } from './site';

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

const schemaDateModified = '2026-07-07';
const directEmail = 'sulayman.bowles@gmail.com';

const primarySiteParts = [
  { name: 'About Sulayman Bowles', path: '/about' },
  { name: 'Selected Work', path: '/work' },
  { name: 'Atlas SEO Audit Console', path: '/atlas' },
  { name: 'Void Agency Method', path: '/method' },
  { name: 'Profile Context', path: '/ai-information' },
  { name: 'Contact Sulayman Bowles', path: '/contact' },
  { name: 'Research Notes', path: '/research' },
];

function contactPointSchema(): JsonLd {
  return {
    '@type': 'ContactPoint',
    '@id': `${absoluteUrl('/contact')}#technical-seo-contact`,
    contactType: 'technical SEO, crawl evidence, analytics, and source-backed research inquiries',
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
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: canonicalLogo,
    image: canonicalLogo,
    jobTitle: 'Technical systems builder',
    mainEntityOfPage: absoluteUrl('/ai-information'),
    description:
      'Sulayman Bowles is a UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, search visibility, and finance research.',
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
        name: 'Profile Context for Sulayman Bowles, Void Agency, and Atlas',
        url: absoluteUrl('/ai-information'),
        description:
          'Profile context page for current identity, project links, older background, and clarification limits.',
      },
      {
        '@type': 'ProfilePage',
        name: 'SulaymanB2024 GitHub profile',
        url: 'https://github.com/SulaymanB2024',
        description: 'Public code profile for portfolio, crawler, technical SEO, and finance research projects.',
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
        description: 'Public agency branch connected to technical SEO, crawlability, structured content, analytics, and practical audits.',
      },
      {
        '@type': 'WebPage',
        name: 'Sulayman Bowles Technical Ledger',
        url: 'https://sulayman-bowles.tech/',
        description: 'Public technical ledger for projects, experiments, files, and competition records connected to the main identity site.',
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
          'Historical classical-bass source that should be reconciled with the current McCombs, Atlas, technical SEO, search visibility, and finance research positioning.',
      },
    ],
    affiliation,
    knowsLanguage: ['English'],
    knowsAbout: [
      'Technical SEO',
      'Search discoverability',
      'Search visibility',
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
      'Personal site for Sulayman Bowles covering Atlas, technical SEO, search visibility, finance research, public source context, and selected work.',
    inLanguage: 'en-US',
    publisher: {
      '@id': PERSON_ID,
    },
    about: [
      { '@id': PERSON_ID },
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
      'Void Agency is a technical SEO practice connected to Sulayman Bowles work in crawlability, indexation diagnostics, structured content, analytics review, and practical web/search audits.',
    founder: {
      '@id': PERSON_ID,
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

function fanOutQueryItemListSchema(items: FanOutQueryMapItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/ai-information')}#fan-out-query-map`,
    name: 'Likely Search Questions',
    url: `${absoluteUrl('/ai-information')}#fan-out-query-map`,
    description:
      'A public map of likely search follow-up questions, the best page to answer each one, missing content, and recommended edits.',
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

function providerDiscoveryPlanItemListSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/ai-information')}#provider-discovery-plan`,
    name: 'Provider Discovery Plan',
    url: `${absoluteUrl('/ai-information')}#provider-discovery-plan`,
    description:
      'A public search-provider discovery plan describing current crawl/indexation signals and next monitoring actions for Google, Bing, Brave, DuckDuckGo, ChatGPT search, Claude, and Perplexity.',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: providerDiscoveryPlan.length,
    itemListElement: providerDiscoveryPlan.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.provider,
      description: `Current signal: ${item.currentSignal} Next action: ${item.nextAction}`,
      url: absoluteUrl('/ai-information'),
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
      'Public expertise terms stated on the profile context page for Sulayman Bowles.',
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
      serviceType: 'Search Visibility Audit',
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
    name: 'Technical SEO Audit Offer Catalog',
    description:
      'Service examples visible on the Void Agency method page for technical SEO and search visibility audits.',
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
      '@id': PERSON_ID,
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
    name: 'Technical SEO and Search Visibility Audit',
    url: absoluteUrl('/method'),
    provider: {
      '@id': `${SITE_URL}/#void-agency`,
    },
    areaServed: 'United States',
    serviceType: [
      'Technical SEO Audit',
      'Search Visibility Audit',
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
      'Technical SEO and search visibility audit work covering crawlability, robots.txt, sitemaps, raw and rendered HTML, canonical URLs, internal links, structured data, GSC/GA4 review, page templates, query buckets, and implementation recommendations.',
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
      '@id': PERSON_ID,
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
      '@id': PERSON_ID,
    },
    publisher: {
      '@id': PERSON_ID,
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
        'Homepage for Sulayman Bowles, a UT Austin McCombs student and technical systems builder focused on Atlas, technical SEO, search visibility, and finance research.',
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
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
        'About page explaining Sulayman Bowles through UT Austin McCombs, Atlas, technical SEO, Void Agency, search visibility, and finance research.',
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
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
        'Profile page explaining Sulayman Bowles through UT Austin McCombs, Atlas, technical SEO, Void Agency, search visibility, and finance research.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': PERSON_ID,
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
        'First-person text edition explaining Sulayman Bowles, technical SEO, Atlas, Void Agency, Markets Research, finance research, and software systems.',
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/simple')}#profile`,
      name: 'A Short Book About Sulayman Bowles',
      url: absoluteUrl('/simple'),
      description:
        'A first-person text edition of Sulayman Bowles website, covering technical SEO, Atlas, Void Agency, Markets Research, finance research, software systems, and current direction.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': PERSON_ID,
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
        'HTML-first resume for Sulayman Bowles across UT Austin McCombs, Void Agency, Atlas, technical SEO, search visibility, finance research, public code, and professional profiles.',
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/resume')}#profile`,
      name: 'Sulayman Bowles Resume | Technical SEO, Atlas & Finance Research',
      url: absoluteUrl('/resume'),
      description:
        'HTML-first resume for Sulayman Bowles across UT Austin McCombs, Void Agency, Atlas, technical SEO, search visibility, finance research, public code, and professional profiles.',
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': PERSON_ID,
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
      name: 'Profile Context for Sulayman Bowles, Void Agency, and Atlas',
      description: AI_INFORMATION_DESCRIPTION,
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`, `${SITE_URL}/#void-agency`],
      additionalType: 'AboutPage',
      dateModified: schemaDateModified,
    }),
    evidenceItemListSchema({
      id: 'public-source-graph',
      name: 'Public Source List',
      description:
        'A categorized list of public sources that explain Sulayman Bowles, Atlas SEO Audit Console, Void Agency, academic context, research files, and clarification limits.',
      path: '/ai-information',
      items: publicSourceGraph,
    }),
    fanOutQueryItemListSchema(fanOutQueryMap),
    providerDiscoveryPlanItemListSchema(),
    expertiseDefinedTermSetSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl('/ai-information')}#profile`,
      name: 'Profile Context for Sulayman Bowles, Void Agency, and Atlas',
      url: absoluteUrl('/ai-information'),
      description: AI_INFORMATION_DESCRIPTION,
      dateModified: schemaDateModified,
      mainEntity: {
        '@id': PERSON_ID,
      },
      about: [
        { '@id': PERSON_ID },
        { '@id': `${SITE_URL}/#void-agency` },
        { '@id': `${SITE_URL}/atlas#software` },
      ],
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Profile Context', path: '/ai-information' },
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
        'Software/project page for Atlas SEO Audit Console, a crawl system for technical SEO, indexation, internal links, structured data, scoring, and exports.',
      mainEntityId: `${SITE_URL}/atlas#software`,
      aboutIds: [PERSON_ID],
    }),
    evidenceItemListSchema({
      id: 'atlas-checks',
      name: 'What Atlas SEO Audit Console Checks',
      description:
        'List of technical SEO checks handled by Atlas SEO Audit Console, aligned with visible page copy.',
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
        'Service/process page for Void Agency technical SEO and search visibility audits.',
      mainEntityId: `${SITE_URL}/method#service`,
      aboutIds: [PERSON_ID, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
    }),
    evidenceItemListSchema({
      id: 'search-visibility-checklist',
      name: 'Search Visibility Audit Checklist',
      description:
        'Checklist for crawlability, indexability, source clarity, entity consistency, public files, freshness, and stale-source cleanup.',
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
      'Selected public work from Sulayman Bowles across Atlas crawl data, technical SEO method, sanitized case-study logic, and markets research notes.',
      '/work',
    ),
    webPageSchema({
      path: '/work',
      name: 'Selected Work',
      description:
        'A work index for Sulayman Bowles with contextual links to Atlas sample crawl data, technical SEO method, public code, audit intake, and markets research assumptions.',
      mainEntityId: collectionId,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
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
        '@id': PERSON_ID,
      },
      serviceType: ['Technical SEO Audit', 'Search Visibility Audit', 'Crawlability Review'],
      areaServed: 'United States',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: absoluteUrl('/contact'),
        availableLanguage: ['en-US', 'English'],
      },
      description:
        'Contact and compact audit brief path for technical SEO audits, crawl reviews, analytics, markets research, and structured web systems.',
    },
    webPageSchema({
      path: '/contact',
      name: 'Contact Sulayman Bowles',
      description:
        'Contact page for Sulayman Bowles with a direct email path, compact Formspree brief form, and links to LinkedIn, GitHub, resume, public site, Atlas sample crawl data, and the technical SEO method.',
      mainEntityId: serviceId,
      aboutIds: [PERSON_ID],
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
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
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
        '@id': PERSON_ID,
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
      title: 'Technical SEO Audit Case Study',
      description:
        'A sanitized technical SEO case-study frame showing how crawl data becomes findings, priorities, and implementation work without private client claims.',
      path: '/case-studies/technical-seo-audit',
      datePublished: '2026-06-21',
    }),
    webPageSchema({
      path: '/case-studies/technical-seo-audit',
      name: 'Technical SEO Audit Case Study',
      description:
        'A public case study for Sulayman Bowles showing the path from crawl fields to interpreted risk, implementation action, and review notes.',
      mainEntityId: articleId,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
      { name: 'Technical SEO Audit Case Study', path: '/case-studies/technical-seo-audit' },
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
      name: 'Austin Technical SEO',
      url: absoluteUrl('/austin-technical-seo'),
      provider: {
        '@id': PERSON_ID,
      },
      areaServed: {
        '@type': 'City',
        name: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      serviceType: ['Technical SEO Audit', 'Search Visibility Audit', 'Local Search Visibility Review'],
      description:
        'Technical SEO audit work for Austin teams that need crawlability, indexation, structured data, page clarity, and implementation detail reviewed.',
    },
    webPageSchema({
      path: '/austin-technical-seo',
      name: 'Austin Technical SEO',
      description:
        'A local service-intent page for Austin technical SEO work with conservative limits and links to method, sample crawl data, and intake.',
      mainEntityId: serviceId,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
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
      'Public technical SEO, crawler policy, Atlas, crawlability, identity, and finance research files from Sulayman Bowles.',
      '/research',
    ),
    webPageSchema({
      path: '/research',
      name: 'Research Assets',
      description:
        'Public index of technical SEO, crawler policy, Atlas, crawlability, identity, and finance research files with source-file links and limits.',
      mainEntityId: collectionId,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${absoluteUrl('/research')}#asset-list`,
      name: 'Public Research Notes and Files',
      url: `${absoluteUrl('/research')}#asset-list`,
      description:
        'Prioritized public pages and files for technical SEO, crawler policy, Atlas, crawlability, identity, and finance research contexts.',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: publicResearchAssets.length,
      itemListElement: publicResearchAssets.map((asset, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: asset.name,
        description: asset.pitchAngle,
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
        '@id': PERSON_ID,
      },
      isPartOf: {
        '@id': collectionId,
      },
    })),
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${absoluteUrl('/research')}#limits`,
      name: 'Research File Limits',
      description: 'Explicit limits for interpreting the research files on sulayman-bowles.dev.',
      hasDefinedTerm: researchClaimBoundaries.map((boundary, index) => ({
        '@type': 'DefinedTerm',
        '@id': `${absoluteUrl('/research')}#limit-${index + 1}`,
        name: `Limit ${index + 1}`,
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
        'Service-practice page for Void Agency, the branch connected to Sulayman Bowles technical SEO, crawlability, and practical audits.',
      mainEntityId: `${SITE_URL}/#void-agency`,
      aboutIds: [PERSON_ID, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
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
        'Plain HTML sitemap for sulayman-bowles.dev with public routes for work, Atlas, method, markets, resume, contact, reference, and research pages.',
      aboutIds: [PERSON_ID],
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
      aboutIds: [PERSON_ID],
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
      aboutIds: [PERSON_ID],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Markets', path: '/markets' },
      { name: title, path },
    ]),
  ]);
}
