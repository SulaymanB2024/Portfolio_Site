import {
  aiSearchAuditChecklist,
  atlasCheckItems,
  type EvidenceListItem,
} from '../content/evidenceLists';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
import { PROFILE_FACTS } from '../content/profileFacts';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_SOCIAL_IMAGE,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import { searchTerms } from './keywordStrategy';
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

const schemaDateModified = PROFILE_FACTS.lastReviewed;
const directEmail = 'sulayman.bowles@gmail.com';

const primarySiteParts = [
  { name: 'About Sulayman Bowles', path: '/about' },
  { name: 'Sulayman Bowles and Void Agency', path: '/void-agency' },
  { name: 'Technical SEO and AI Systems Portfolio', path: '/work' },
  { name: 'Atlas Technical SEO Audit Software', path: '/atlas' },
  { name: 'Evidence-Led Technical SEO Audit Method', path: '/method' },
  { name: 'Contact Sulayman Bowles', path: '/contact' },
  { name: 'Technical SEO and AI Systems Research', path: '/research' },
];

function contactPointSchema(): JsonLd {
  return {
    '@type': 'ContactPoint',
    '@id': `${absoluteUrl('/contact')}#technical-seo-contact`,
    contactType: 'research, product, technical work, speaking, and professional inquiries',
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
      '@id': `${SITE_URL}/#void-agency`,
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
        '@type': 'ProfilePage',
        name: 'About Sulayman Bowles',
        url: absoluteUrl('/about'),
        description: 'Current public profile for Sulayman Bowles, including AI product work, technical systems, research, education, and selected work.',
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
    '@id': `${SITE_URL}/#website`,
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
  keywords,
}: {
  path: string;
  name: string;
  description: string;
  mainEntityId?: string;
  aboutIds?: string[];
  additionalType?: string;
  dateModified?: string;
  keywords?: readonly string[];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': additionalType ? ['WebPage', additionalType] : 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    url: absoluteUrl(path),
    description,
    ...(keywords?.length ? { keywords } : {}),
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
    keywords: searchTerms('/atlas'),
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
        'About page explaining Sulayman Bowles through technical systems work, UT Austin McCombs, Atlas, technical SEO, Void Agency, AI product workflows, and finance research.',
      keywords: searchTerms('/about'),
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
        'Profile page explaining Sulayman Bowles through technical systems work, UT Austin McCombs, Atlas, technical SEO, Void Agency, AI product workflows, and finance research.',
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

export function voidAgencyRelationshipJsonLd(): JsonLd {
  return graphSchema([
    ...canonicalEntitySchemas({ includeVoidAgency: true }),
    websiteSchema(),
    webPageSchema({
      path: '/void-agency',
      name: 'Sulayman Bowles and Void Agency',
      description:
        'Profile page documenting Sulayman Bowles’s role, public work, verified contributions, and evidence boundaries at Void Agency.',
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/#void-agency`],
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Void Agency', path: '/void-agency' },
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
      keywords: searchTerms('/atlas'),
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
    webPageSchema({
      path: '/method',
      name: 'Evidence-Led Technical SEO Audit Method',
      description:
        'Sulayman Bowles’s personal technical SEO audit methodology for crawlability, indexation, rendering, structured data, implementation, and rerun checks.',
      keywords: searchTerms('/method'),
      mainEntityId: PERSON_ID,
      aboutIds: [PERSON_ID, `${SITE_URL}/#void-agency`, `${SITE_URL}/atlas#software`],
    }),
    evidenceItemListSchema({
      id: 'technical-seo-audit-method',
      name: 'Evidence-Led Technical SEO Audit Method',
      description:
        'Sulayman Bowles’s checklist for crawlability, indexability, source clarity, entity consistency, public files, freshness, and stale-source cleanup.',
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
        'A work index for Sulayman Bowles with contextual links to Atlas sample crawl data, technical SEO method, public code, personal contact, and markets research assumptions.',
      keywords: searchTerms('/work'),
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
  return graphSchema([
    ...canonicalEntitySchemas({ includeContactPoint: true }),
    websiteSchema(),
    webPageSchema({
      path: '/contact',
      name: 'Contact Sulayman Bowles',
      description:
        'Personal contact page for Sulayman Bowles with direct email and links for research, product, technical work, speaking, and professional context; commercial SEO requests are handed to Void Agency.',
      keywords: searchTerms('/contact'),
      mainEntityId: PERSON_ID,
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
        'A dated Atlas demonstration showing source and render states, discovered paths, confidence, findings, and exportable artifacts from a bounded open corpus.',
      mainEntityId: `${SITE_URL}/atlas#software`,
      aboutIds: [PERSON_ID, `${SITE_URL}/atlas#software`],
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      '@id': `${absoluteUrl('/atlas/sample-crawl')}#open-corpus-dataset`,
      name: 'Atlas Open Corpus Run: Quotes to Scrape',
      url: absoluteUrl('/research/atlas-open-corpus-run-2026-07-16.csv'),
      description:
        'Dated bounded source-capture artifact with URL-level source and runtime indicators. It is not a private client export, corpus-owner audit, or ranking claim.',
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
      keywords: searchTerms('/research'),
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
