export type ServiceModuleSlug = 'ai-visibility' | 'product-discovery' | 'local-visibility';

export type ServiceModule = {
  slug: ServiceModuleSlug;
  path: string;
  index: string;
  title: string;
  shortTitle: string;
  audience: string;
  summary: string;
  signals: string[];
  deliverables: string[];
  proof: {
    label: string;
    status: 'Preview' | 'Framework' | 'Available';
    sourceBasis: string;
  };
  cta: string;
  intent: string;
  prevPath: string;
  nextPath: string;
};

export const SERVICE_MODULES: ServiceModule[] = [
  {
    slug: 'ai-visibility',
    path: '/ai-visibility-benchmark',
    index: '02',
    title: 'AI Visibility Benchmark',
    shortTitle: 'AI Visibility',
    audience: 'Brands, SaaS teams, agencies, and founders who need AI systems to retrieve and cite their entity clearly.',
    summary: 'Audits crawler access, entity clarity, answer-ready structure, reference links, and schema graphs for LLM retrieval surfaces.',
    signals: ['LLM crawler directives', 'Entity graph clarity', 'Answer block structure', 'Outbound citation context', 'JSON-LD attribution'],
    deliverables: ['Entity map', 'Crawler access notes', 'Retrieval-readiness checklist', 'Schema recommendations'],
    proof: {
      label: 'Schema graph and agent-log preview',
      status: 'Preview',
      sourceBasis: 'Demo robots rules, DOM outline checks, and JSON-LD examples',
    },
    cta: 'Discuss AI visibility',
    intent: 'ai-visibility',
    prevPath: '/atlas',
    nextPath: '/product-discovery-system',
  },
  {
    slug: 'product-discovery',
    path: '/product-discovery-system',
    index: '03',
    title: 'Product Discovery System',
    shortTitle: 'Product Discovery',
    audience: 'Ecommerce teams with collection templates, filter parameters, product pages, and search-intent gaps.',
    summary: 'Audits catalog templates, parameter duplication, internal link equity, intent mapping, and page-speed constraints.',
    signals: ['Collection template structure', 'Filter and sort parameters', 'Canonical consolidation', 'Internal link depth', 'LCP and CLS checks'],
    deliverables: ['Discovery matrix', 'Intent gap list', 'Canonical rules', 'Template diagnostics'],
    proof: {
      label: 'Catalog heatmap and rules preview',
      status: 'Framework',
      sourceBasis: 'Synthetic catalog paths and template diagnostics',
    },
    cta: 'Request catalog audit',
    intent: 'product-discovery',
    prevPath: '/ai-visibility-benchmark',
    nextPath: '/service-area-visibility-audit',
  },
  {
    slug: 'local-visibility',
    path: '/service-area-visibility-audit',
    index: '04',
    title: 'Service-Area Visibility Audit',
    shortTitle: 'Service Area',
    audience: 'Local service businesses and multi-location operators that depend on territory pages, maps, and citations.',
    summary: 'Audits service-area architecture, GBP alignment, NAP consistency, local schema, crawl depth, and location authority signals.',
    signals: ['Territory page hierarchy', 'GBP category fit', 'NAP consistency', 'LocalBusiness schema', 'Review and maps actions'],
    deliverables: ['Location coverage map', 'NAP discrepancy list', 'Local schema notes', 'Crawl-depth recommendations'],
    proof: {
      label: 'Local citation and crawl-tree preview',
      status: 'Framework',
      sourceBasis: 'Demo directory rows, local schema examples, and territory URL patterns',
    },
    cta: 'Audit service areas',
    intent: 'local-visibility',
    prevPath: '/product-discovery-system',
    nextPath: '/method',
  },
];

export function getServiceModule(slug: ServiceModuleSlug) {
  const module = SERVICE_MODULES.find((item) => item.slug === slug);
  if (!module) {
    throw new Error(`Unknown service module: ${slug}`);
  }
  return module;
}

export function getContactHref(intent: string) {
  return `/?intent=${encodeURIComponent(intent)}#contact`;
}
