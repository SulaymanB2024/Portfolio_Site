import { PUBLICATION_INDEX, type PublicationIndexItem } from './publicationIndex';

export type ContentClusterId =
  | 'ai-agent-systems'
  | 'search-crawl-systems'
  | 'technical-seo'
  | 'markets-models';

export type ContentCluster = {
  id: ContentClusterId;
  path: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  directAnswer: string;
  category: PublicationIndexItem['category'];
  questions: readonly string[];
  featuredPaths: readonly string[];
};

export const CONTENT_CLUSTERS: readonly ContentCluster[] = [
  {
    id: 'ai-agent-systems',
    path: '/research/ai-systems',
    title: 'AI and Agent Systems',
    shortTitle: 'AI systems',
    eyebrow: 'Authority, evaluation, operations',
    description:
      'AI agent systems research on AI-operated businesses, evaluation harnesses, review gates, infrastructure limits, human control, and dependable operating systems.',
    directAnswer:
      'Strong AI systems are defined by bounded authority, observable traces, repeatable evaluation, explicit human review, and a tested failure path—not by the model name alone.',
    category: 'AI systems and products',
    questions: [
      'What can an AI system own without creating unreviewed side effects?',
      'Which traces and replay tests distinguish a demo from an operating system?',
      'Where do infrastructure, energy, and human supervision constrain scale?',
    ],
    featuredPaths: [
      '/research/ai-systems/the-first-ai-managers',
      '/viralbench-codex-agent-harness',
      '/research/ai-systems/the-ai-megawatt',
    ],
  },
  {
    id: 'search-crawl-systems',
    path: '/research/search-systems',
    title: 'Search and Crawl Systems',
    shortTitle: 'Search systems',
    eyebrow: 'Discovery, retrieval, identity',
    description:
      'Search and crawl systems research on crawler policy, retrieval infrastructure, canonical identity, public data, discovery, rendering, and page interpretation.',
    directAnswer:
      'Search visibility starts with a recoverable chain from discovery to fetch, rendering, canonical interpretation, internal support, and measurable retrieval—not with a rank claim.',
    category: 'Search systems',
    questions: [
      'Can a crawler discover, fetch, render, and interpret the intended canonical page?',
      'Which public signals establish a consistent entity and source trail?',
      'How should crawler access and public-data infrastructure be measured?',
    ],
    featuredPaths: [
      '/research/crawler-engineering/crawl-frontier-state-machine',
      '/research/ai-crawlers/ai-search-crawler-policy',
      '/research/personal-seo/canonical-identity-personal-seo',
    ],
  },
  {
    id: 'technical-seo',
    path: '/research/technical-seo',
    title: 'Technical SEO Diagnostics',
    shortTitle: 'Technical SEO',
    eyebrow: 'Evidence, repair, rerun',
    description:
      'Issue guides, platform playbooks, audit checklists, and public crawl artifacts that connect an observed state to a repair and a rerun gate.',
    directAnswer:
      'A useful technical SEO diagnosis names the affected surface, preserves the observation, separates fact from interpretation, assigns a repair owner, and defines the exact rerun that closes the finding.',
    category: 'Technical SEO',
    questions: [
      'What was observed at the URL, template, or crawl-policy layer?',
      'Which repair changes the underlying state instead of masking the symptom?',
      'What evidence proves the issue is closed after implementation?',
    ],
    featuredPaths: [
      '/research/technical-seo',
      '/atlas/sample-crawl',
      '/austin-technical-seo',
    ],
  },
  {
    id: 'markets-models',
    path: '/markets',
    title: 'Markets, Ownership, and Models',
    shortTitle: 'Markets and models',
    eyebrow: 'Cash flows, rights, downside',
    description:
      'Research on ownership, capital structures, operating economics, forecasts, and decision models, with assumptions and recommendation limits kept visible.',
    directAnswer:
      'A defensible market model separates sourced facts, analyst estimates, missing information, scenario outputs, and the decision the model can actually support.',
    category: 'Markets and investing',
    questions: [
      'Who owns the asset, cash-flow right, liability, or operating decision?',
      'Which model inputs are sourced, estimated, or still unknown?',
      'How does the downside case change the decision boundary?',
    ],
    featuredPaths: [
      '/markets/who-owns-texas-toll-roads',
      '/research/financial-systems/what-happens-when-an-index-decides-a-company-matters',
      '/research/financial-systems/who-owns-austin-home-service-companies',
    ],
  },
] as const;

const CLUSTER_BY_ID = new Map(CONTENT_CLUSTERS.map((cluster) => [cluster.id, cluster]));
const CLUSTER_BY_CATEGORY = new Map(CONTENT_CLUSTERS.map((cluster) => [cluster.category, cluster]));

export function getContentCluster(id: ContentClusterId) {
  return CLUSTER_BY_ID.get(id);
}

export function getContentClusterByPath(path: string) {
  return CONTENT_CLUSTERS.find((cluster) => cluster.path === path);
}

export function getContentClusterForCategory(category: PublicationIndexItem['category']) {
  return CLUSTER_BY_CATEGORY.get(category);
}

export function getContentClusterForPublicationPath(path: string) {
  const publication = PUBLICATION_INDEX.find((item) => item.href === path);
  return publication ? getContentClusterForCategory(publication.category) : undefined;
}

export function getPublicationsForCluster(cluster: ContentCluster | ContentClusterId) {
  const resolved = typeof cluster === 'string' ? getContentCluster(cluster) : cluster;
  return resolved ? PUBLICATION_INDEX.filter((item) => item.category === resolved.category) : [];
}
