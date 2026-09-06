export type EvidenceListItem = {
  category?: string;
  label: string;
  href: string;
  proves: string;
};

export type BuyerDecisionEvidenceItem = {
  question: string;
  answer: string;
  href: string;
  action: string;
};

const VOID_AUDIT_KIT_URL = 'https://www.void-agency.com/tools/technical-seo-audit-checklist';

export const buyerDecisionEvidence: BuyerDecisionEvidenceItem[] = [
  {
    question: 'What standard will the work use?',
    answer:
      'The public method shows evidence capture, finding review, owners, acceptance checks, and reruns. It is process evidence—not a client-outcome case study.',
    href: VOID_AUDIT_KIT_URL,
    action: 'Inspect the worked finding',
  },
  {
    question: 'Can I inspect the proof before sharing access?',
    answer:
      'The Atlas demonstration exposes a dated, sanitized source record and its limits. It does not establish rankings, traffic, revenue, or full production coverage.',
    href: '/atlas/sample-crawl',
    action: 'Inspect the sample crawl',
  },
  {
    question: 'What makes a useful first brief?',
    answer:
      'Bring a site or product surface, the suspected evidence gap, and the decision the work must support. Do not send credentials or sensitive client data in the first email.',
    href: '/contact',
    action: 'Prepare the evidence brief',
  },
];

export type ContactEvidenceItem = {
  label: string;
  description: string;
};

export type ContactDecisionItem = ContactEvidenceItem & {
  title: string;
};

export type ContactBuyerQuestion = {
  question: string;
  answer: string;
};

export const contactResponsePaths: ContactEvidenceItem[] = [
  {
    label: 'Technical SEO',
    description: 'Indexation, canonicals, redirects, internal links, schema, and template diagnosis.',
  },
  {
    label: 'Crawl evidence',
    description: 'Raw/rendered states, measurement gaps, finding review, implementation checks, and reruns.',
  },
  {
    label: 'AI-system evidence',
    description: 'Evaluation traces, source boundaries, replay plans, and a clear split between built and proposed work.',
  },
  {
    label: 'Analytics / research',
    description: 'GA4, Search Console, source ledgers, decision baselines, and inspectable assumptions.',
  },
];

export const contactIntakeNotes: ContactEvidenceItem[] = [
  {
    label: 'Surface',
    description: 'Site URL, product surface, affected template, or system boundary.',
  },
  {
    label: 'Observed problem',
    description: 'What changed, failed, or remains unverified—and what evidence already exists.',
  },
  {
    label: 'Decision',
    description: 'Who needs to act, what the work must support, and what would count as a useful next check.',
  },
];

export const contactDecisionProtocol: ContactDecisionItem[] = [
  {
    label: '01 / Fit',
    title: 'Name the blocked decision.',
    description: 'Start with the site or system, the observable issue, and the person or team that must act.',
  },
  {
    label: '02 / Boundary',
    title: 'Separate evidence from access gaps.',
    description: 'Keep observed, inferred, inaccessible, and private states distinct. Credentials never belong in the brief.',
  },
  {
    label: '03 / First step',
    title: 'Scope the smallest useful pass.',
    description: 'Choose a focused diagnosis, audit, implementation handoff, or validation rerun before expanding.',
  },
];

export const contactBuyerQuestions: ContactBuyerQuestion[] = [
  {
    question: 'Is this only for a full-site audit?',
    answer:
      'No. A focused diagnosis can be a better first step when the affected surface and decision are already narrow. A larger audit should earn its scope from the evidence gap.',
  },
  {
    question: 'What does a useful deliverable look like?',
    answer:
      'It depends on scope, but the public method uses URL or source-level observations, interpretation, confidence, priority, an owner, an acceptance check, and a rerun path. That structure is process evidence, not a promised business outcome.',
  },
  {
    question: 'Do you need credentials or production access before we talk?',
    answer:
      'No. Start with a public URL or a plain-language description of the private surface. Any later access should be agreed after fit and scope are clear; never send credentials in an initial email.',
  },
  {
    question: 'Can you guarantee rankings, traffic, revenue, or AI answer placement?',
    answer:
      'No. Those outcomes depend on external systems and conditions beyond a technical review. The work can make evidence, implementation choices, acceptance checks, and remaining uncertainty explicit.',
  },
  {
    question: 'What does sending an inquiry authorize?',
    answer:
      'It requests a discussion of fit and scope. It does not authorize system access, deployment, publication, or billable work.',
  },
  {
    question: 'What happens after the brief is reviewed?',
    answer:
      'The first decision is whether the surface, evidence gap, and intended decision are specific enough to scope. Missing context should be clarified before recommending a broader engagement.',
  },
];

export const atlasCheckItems: EvidenceListItem[] = [
  { label: 'URL discovery', href: '/atlas', proves: 'Atlas starts from discovered URLs and crawl records, not only manual page samples.' },
  { label: 'robots.txt', href: VOID_AUDIT_KIT_URL, proves: 'Robots directives are part of the audit evidence used to understand crawler access.' },
  { label: 'XML sitemaps', href: VOID_AUDIT_KIT_URL, proves: 'Sitemaps are checked as route and freshness signals rather than assumed to be complete.' },
  { label: 'raw HTML', href: '/atlas/sample-crawl', proves: 'The public demonstration keeps source capture separate from rendered-page observations.' },
  { label: 'render review', href: '/atlas/sample-crawl', proves: 'The public sample records when a browser render is required before content-coverage claims; it does not contain a completed browser trace.' },
  { label: 'titles/meta', href: VOID_AUDIT_KIT_URL, proves: 'Document titles and meta descriptions are treated as inspectable page-level evidence.' },
  { label: 'canonicals', href: VOID_AUDIT_KIT_URL, proves: 'Canonical URLs are checked for duplicate-path, consolidation, and indexation clarity.' },
  { label: 'structured data', href: '/about', proves: 'JSON-LD and visible page text are aligned so entity claims are structured and readable.' },
  { label: 'internal links', href: '/atlas', proves: 'Internal link evidence supports crawl-depth, orphan-risk, and page-relationship analysis.' },
  { label: 'scoring', href: '/atlas', proves: 'Findings are prioritized by severity, confidence, affected URLs, effort, and evidence quality.' },
  { label: 'SQLite persistence', href: '/atlas', proves: 'Atlas describes implemented persistence; runtime persistence is not demonstrated by the public sample.' },
  { label: 'exports/dashboards', href: '/atlas', proves: 'The public sample includes CSV and JSON artifacts; broader operator and client handoff remains partial.' },
];

export const aiSearchAuditChecklist: EvidenceListItem[] = [
  { label: 'crawlability', href: VOID_AUDIT_KIT_URL, proves: 'Search systems need access to public pages before they can interpret them.' },
  { label: 'indexability', href: VOID_AUDIT_KIT_URL, proves: 'Indexation directives, canonicals, and response behavior are checked before content recommendations.' },
  { label: 'internal links', href: '/atlas', proves: 'Internal links show which pages the site itself treats as important and reachable.' },
  { label: 'structured data', href: '/about', proves: 'Schema helps connect entities, pages, projects, and source claims when it matches visible text.' },
  { label: 'source-page clarity', href: '/about', proves: 'Clear source pages make identity, projects, services, and support links easy to verify.' },
  { label: 'entity consistency', href: '/about', proves: 'Consistent names and descriptions reduce confusion between Sulayman Bowles, Atlas, Void Agency, and related sources.' },
  { label: 'public work', href: '/resume', proves: 'Public work such as GitHub, LinkedIn, project pages, resume entries, and research pages supports claims without inventing private outcomes.' },
  { label: 'sitemap freshness', href: VOID_AUDIT_KIT_URL, proves: 'Fresh sitemap lastmod values help crawlers find current canonical pages and avoid stale route assumptions.' },
];
