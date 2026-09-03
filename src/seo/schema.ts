import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  type EvidenceListItem,
} from '../content/evidenceLists';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
import { PROFILE_FACTS } from '../content/profileFacts';
import { PROJECT_INDEX, PROJECT_SOURCE_RECORD_COUNT } from '../content/projectIndex';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticleMeta';
import { searchTerms } from './keywordStrategy';
import {
  ATLAS_SOFTWARE_ID,
  DEFAULT_OG_IMAGE,
  LOGO_ID,
  PERSON_ID,
  PRIMARY_IMAGE_ID,
  SITE_NAME,
  SITE_URL,
  VOID_AGENCY_ID,
  WEBSITE_ID,
  absoluteUrl,
} from './site';

export type JsonLd = Record<string, unknown>;

function graphSchema(items: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map(({ '@context': _context, ...item }) => item),
  };
}

const canonicalLogo = {
  '@type': 'ImageObject',
  '@id': LOGO_ID,
  url: absoluteUrl('/favicon.svg'),
  contentUrl: absoluteUrl('/favicon.svg'),
};

const canonicalPrimaryImage = {
  '@type': 'ImageObject',
  '@id': PRIMARY_IMAGE_ID,
  url: absoluteUrl(DEFAULT_OG_IMAGE),
  contentUrl: absoluteUrl(DEFAULT_OG_IMAGE),
};

const schemaDateModified = PROFILE_FACTS.lastReviewed;
const directEmail = 'sulayman.bowles@gmail.com';

const primarySiteParts = [
  { name: 'About Sulayman Bowles', path: '/about' },
  { name: 'Technical SEO and AI Systems Portfolio', path: '/work' },
  { name: 'Atlas Technical SEO Audit Software', path: '/atlas' },
  { name: 'Technical SEO Audit Services', path: '/method' },
  { name: 'Technical SEO Consultant Contact', path: '/contact' },
  { name: 'Technical SEO and AI Systems Research', path: '/research' },
  { name: 'AI and Agent Systems Research', path: '/research/ai-systems' },
  { name: 'Search and Crawl Systems Research', path: '/research/search-systems' },
  { name: 'Technical SEO Diagnostic Library', path: '/research/technical-seo' },
  { name: 'Markets, Ownership, and Models', path: '/markets' },
];

function contactPointSchema(): JsonLd {
  return {
    '@type': 'ContactPoint',
    '@id': `${absoluteUrl('/contact')}#technical-seo-contact`,
    contactType: 'technical SEO, crawl analysis, analytics, and research inquiries',
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
      name: PROFILE_FACTS.education.institution,
      url: 'https://www.utexas.edu/',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: PROFILE_FACTS.education.school,
      url: 'https://www.mccombs.utexas.edu/',
    },
  ];

  if (includeVoidAgencyAffiliation) {
    affiliation.push({
      '@type': 'Organization',
      name: 'Void Agency',
      '@id': VOID_AGENCY_ID,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PROFILE_FACTS.name,
    url: SITE_URL,
    jobTitle: 'Technical systems builder',
    mainEntityOfPage: absoluteUrl('/about'),
    description: PROFILE_FACTS.currentSummary,
    sameAs: [
      PROFILE_FACTS.canonicalLinks.linkedin,
      PROFILE_FACTS.canonicalLinks.github,
      'https://devpost.com/sulayman-bowles',
      PROFILE_FACTS.canonicalLinks.technicalLedger,
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
        '@id': `${absoluteUrl('/about')}#webpage`,
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
        description: 'Public technical archive for projects, experiments, files, and competition work connected to the main portfolio.',
      },
    ],
    affiliation,
    knowsLanguage: ['English'],
    knowsAbout: [
      'Technical SEO',
      'Technical SEO consulting',
      'Technical SEO audit software',
      'AI product management',
      'Technical systems',
      'Crawlability',
      'Indexation',
      'Structured data',
      'Investment research',
      'Music composition',
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
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Personal site for Sulayman Bowles covering Atlas, technical SEO, search visibility, finance research, public source context, and selected work.',
    keywords: searchTerms('/'),
    inLanguage: 'en-US',
    publisher: {
      '@id': PERSON_ID,
    },
    about: [
      { '@id': PERSON_ID },
      { '@id': ATLAS_SOFTWARE_ID },
      { '@id': VOID_AGENCY_ID },
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
    '@id': VOID_AGENCY_ID,
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
  keywords,
}: {
  path: string;
  name: string;
  description: string;
  mainEntityId?: string;
  aboutIds?: string[];
  additionalType?: string | string[];
  dateModified?: string;
  keywords?: readonly string[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': additionalType
      ? ['WebPage', ...(Array.isArray(additionalType) ? additionalType : [additionalType])]
      : 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    url: absoluteUrl(path),
    description,
    ...(keywords?.length ? { keywords } : {}),
    inLanguage: 'en-US',
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
    ...(aboutIds.length ? { about: aboutIds.map((id) => ({ '@id': id })) } : {}),
    primaryImageOfPage: canonicalPrimaryImage,
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
      url: absoluteUrl('/about'),
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
          '@id': VOID_AGENCY_ID,
        },
      },
    })),
  };
}

export function projectSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': ATLAS_SOFTWARE_ID,
    name: 'Atlas SEO Audit Console',
    url: absoluteUrl('/atlas'),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    creator: {
      '@id': PERSON_ID,
    },
    description:
      'In-development technical SEO crawl-analysis software. Its public demonstration covers bounded source capture, render-review states, traceable findings, and CSV/JSON outputs; the Atlas page labels additional capabilities by implementation status.',
    keywords: searchTerms('/atlas'),
    featureList: [
      'Bounded URL and source capture',
      'Source-versus-render review states',
      'robots.txt, sitemap, canonical, noindex, and redirect review',
      'Source-linked finding records',
      'CSV and JSON demonstration files',
      'Persistence, graph, scoring, and client-handoff capabilities labeled as partial or in development',
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
      '@id': VOID_AGENCY_ID,
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
        'Homepage for Sulayman Bowles, a technical systems builder working across crawl infrastructure, AI product workflows, analytics, and finance research.',
      keywords: searchTerms('/'),
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
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
        'About page explaining Sulayman Bowles through technical systems work, UT Austin McCombs, Atlas, technical SEO, Void Agency, AI product workflows, and finance research.',
      keywords: searchTerms('/about'),
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
      additionalType: ['AboutPage', 'ProfilePage'],
      dateModified: schemaDateModified,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
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
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Resume', path: '/resume' },
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
        'Project page for the in-development Atlas technical SEO audit system, including a bounded public crawl sample and candid implementation status.',
      keywords: searchTerms('/atlas'),
      mainEntityId: ATLAS_SOFTWARE_ID,
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
        'Technical SEO audit services and process page for Void Agency, covering crawlability, indexation, rendering, structured data, implementation, and rerun checks.',
      keywords: searchTerms('/method'),
      mainEntityId: `${SITE_URL}/method#service`,
      aboutIds: [PERSON_ID, VOID_AGENCY_ID, ATLAS_SOFTWARE_ID],
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
      'Complete Project Ledger',
      'A provenance-bounded project ledger from Sulayman Bowles spanning AI and agent systems, search and crawl systems, technical SEO, and markets models.',
      '/work',
    ),
    webPageSchema({
      path: '/work',
      name: 'Complete Project Ledger',
      description:
        'A complete project-family index for Sulayman Bowles with ownership, status, visibility, evidence boundaries, public code, live systems, research, contributions, and prototypes.',
      keywords: searchTerms('/work'),
      mainEntityId: collectionId,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${absoluteUrl('/work')}#project-ledger`,
      name: 'Sulayman Bowles Project Families',
      description: `${PROJECT_INDEX.length} project families containing ${PROJECT_SOURCE_RECORD_COUNT} named project records, grouped without counting duplicate clones, generated worktrees, empty repositories, or undocumented placeholders as separate accomplishments.`,
      numberOfItems: PROJECT_INDEX.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: PROJECT_INDEX.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        description: `${project.summary} Named project records: ${project.sourceProjects.join(', ')}. Evidence boundary: ${project.evidenceBoundary}`,
        url: project.href
          ? project.href.startsWith('http') ? project.href : absoluteUrl(project.href)
          : `${absoluteUrl('/work')}#projects-${project.clusterId}`,
      })),
    },
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
      keywords: searchTerms('/contact'),
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
      name: 'Atlas Open Corpus Demonstration',
      description:
        'A dated Atlas sample with bounded source capture, render-review states, traceable findings, confidence, and downloadable CSV/JSON files.',
      mainEntityId: ATLAS_SOFTWARE_ID,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${absoluteUrl('/atlas/sample-crawl')}#open-corpus-dataset`,
      name: 'Atlas Open Corpus Run: Quotes to Scrape',
      url: absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv'),
      description:
        'Dated bounded source-capture dataset with URL-level source and runtime indicators. It is not a private client export, corpus-owner audit, or ranking claim.',
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

export function viralBenchArticleJsonLd(): JsonLd {
  const path = '/viralbench-codex-agent-harness';
  const title = VIRALBENCH_ARTICLE_TITLE;
  const description = VIRALBENCH_ARTICLE_DESCRIPTION;
  const articleId = `${absoluteUrl(path)}#article`;
  const image = absoluteUrl(VIRALBENCH_ARTICLE_SOCIAL_IMAGE);
  const article = articleSchema({
    title,
    description,
    path,
    datePublished: VIRALBENCH_ARTICLE_DATE,
    dateModified: VIRALBENCH_ARTICLE_MODIFIED_DATE,
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
        { '@type': 'Thing', name: 'Codex', sameAs: 'https://developers.openai.com/codex' },
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
      aboutIds: [PERSON_ID],
      dateModified: VIRALBENCH_ARTICLE_MODIFIED_DATE,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${absoluteUrl(path)}#faq`,
      mainEntity: [
        ['What is ViralBench?', 'ViralBench is a live AI marketing benchmark in which frontier models operate TikTok accounts and try to maximize views in the fitness category.'],
        ['What is an AI agent harness?', 'An agent harness is the operating system around a model: instructions, tools, schemas, memory, permissions, execution loop, tests, traces, validation rules, and deployment boundaries.'],
        ['How would Codex use ViralBench as a harness?', 'Codex would operate outside the content agent, inspect failed runs, modify a bounded part of the repository, run replay tests, and produce a candidate patch for review.'],
        ['Why is offline replay necessary?', 'Replay catches process failures cheaply and repeatedly. It cannot predict TikTok distribution, so it is a prerequisite for a live test rather than a substitute for one.'],
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
      name: 'Austin Technical SEO Consultant and Audit Services',
      url: absoluteUrl('/austin-technical-seo'),
      provider: {
        '@id': PERSON_ID,
      },
      areaServed: {
        '@type': 'City',
        name: 'Austin',
      },
      serviceType: ['Austin Technical SEO Consulting', 'Technical SEO Audit', 'Crawlability Audit', 'Local Search Visibility Review'],
      description:
        'Austin technical SEO consulting for teams that need crawlability, indexation, JavaScript rendering, internal links, structured data, local pages, and implementation reviewed.',
    },
    webPageSchema({
      path: '/austin-technical-seo',
      name: 'Austin Technical SEO Consultant',
      description:
        'Austin technical SEO consultant and audit-services page with crawlability analysis, defined limits, method links, sample crawl data, and intake.',
      keywords: searchTerms('/austin-technical-seo'),
      mainEntityId: serviceId,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
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
      'Research Clusters and Public Archive',
      'Four connected research clusters and a complete public archive covering AI systems, search and crawl systems, technical SEO, and markets models.',
      '/research',
    ),
    webPageSchema({
      path: '/research',
      name: 'Research Clusters and Public Archive',
      description:
        'A complete research index organized into AI systems, search and crawl systems, technical SEO diagnostics, and markets models, with source-file links and evidence limits.',
      keywords: searchTerms('/research'),
      mainEntityId: collectionId,
      aboutIds: [PERSON_ID, ATLAS_SOFTWARE_ID],
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
  collectionPath = '/markets',
  collectionName = 'Markets',
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  collectionPath?: string;
  collectionName?: string;
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
      { name: collectionName, path: collectionPath },
      { name: title, path },
    ]),
  ]);
}

export function technicalSeoCollectionJsonLd({
  title,
  description,
  path,
  parentPath = '/research',
  parentName = 'Research',
}: {
  title: string;
  description: string;
  path: string;
  parentPath?: string;
  parentName?: string;
}): JsonLd {
  const collectionId = `${absoluteUrl(path)}#collection`;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Research', path: '/research' },
  ];

  if (parentPath !== '/research') {
    breadcrumbs.push({ name: parentName, path: parentPath });
  }
  breadcrumbs.push({ name: title, path });

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
    breadcrumbSchema(breadcrumbs),
  ]);
}

export function researchClusterJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLd {
  return technicalSeoCollectionJsonLd({
    title,
    description,
    path,
    parentPath: '/research',
    parentName: 'Research',
  });
}
