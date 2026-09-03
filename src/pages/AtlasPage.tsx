import { motion } from 'motion/react';
import { InternalFooter } from '../components/InternalFooter';
import InternalHeader from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ATLAS_SEO = getSeoRoute('/atlas')!;
const ATLAS_ARTWORK = '/images/atlas-coelifer.svg';

const methodSteps = [
  {
    id: '01',
    title: 'Discover',
    body: 'Seed paths, sitemaps, rendered links, redirects, and stray edges are kept in one inspectable inventory.',
  },
  {
    id: '02',
    title: 'Qualify',
    body: 'Normal content, access challenges, utility URLs, and failed responses are separated before scoring.',
  },
  {
    id: '03',
    title: 'Trace',
    body: 'Questions are tied to pages, passages, confidence values, and the limit of what the source proves.',
  },
  {
    id: '04',
    title: 'Review',
    body: 'Repairs remain in review until the crawl, affected page, and recommendation still agree.',
  },
];

const heroRunStats = [
  { label: 'Public pages captured', value: '2', note: 'bounded open-corpus seed set' },
  { label: 'Observed states', value: '2', note: 'static and render-dependent source' },
  { label: 'Traceable findings', value: '3', note: 'observation, derivation, next check' },
  { label: 'Sample files', value: 'CSV + JSON', note: 'dated snapshot; no build-time crawl' },
];

const mobileHeroLinks = [
  { href: '/atlas/sample-crawl', label: 'See an Atlas sample crawl run', note: 'Public sample' },
  {
    href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
    label: 'View GitHub repo',
    note: 'Audit CLI',
    external: true,
  },
  { href: '/contact', label: 'Request an audit', note: 'Contact' },
];

const capabilityStatus = [
  { capability: 'Native crawl inventory', status: 'Publicly demonstrated', proof: 'Bounded open-corpus crawl available', href: '/atlas/sample-crawl' },
  { capability: 'Source / rendered comparison', status: 'Implemented / sample partial', proof: 'Source capture plus a render-review state; no public browser trace', href: '#atlas-evidence' },
  { capability: 'Run history and exports', status: 'Implemented / sample partial', proof: 'CSV/JSON sample; runtime persistence is not publicly demonstrated', href: '#atlas-technical' },
  { capability: 'Provider coverage', status: 'Prototype', proof: 'Unavailable measurements remain explicit', href: '#atlas-technical' },
  { capability: 'Prioritization logic', status: 'In development', proof: 'Human review still determines final priority', href: '#atlas-technical' },
  { capability: 'Client handoff', status: 'Partial', proof: 'Public demonstration, not a client deliverable', href: '/atlas/sample-crawl' },
];

const crawlLedgerRows = [
  { field: 'Seed URLs', value: '2 public pages', state: 'inventory' },
  { field: 'Static source', value: '10 quote cards', state: 'confirmed_source_content' },
  { field: 'JS source', value: '10 embedded data records', state: 'render_review_required' },
  { field: 'Canonical field', value: 'absent in both source responses', state: 'observation_only' },
  { field: 'Exports', value: 'CSV + JSON manifest', state: 'reviewable_export' },
];

const evidenceCards = [
  { label: 'Demonstration corpus', value: 'Quotes to Scrape' },
  { label: 'Render-sensitive page', value: '/js/' },
  { label: 'Source signal', value: '10 embedded JSON records + DOM-write loop' },
  { label: 'Measured state', value: 'render_review_required' },
  { label: 'Confidence', value: 'high observation', kind: 'score' },
  { label: 'Claim limit', value: 'Demonstration only; not a corpus-owner audit' },
  { label: 'Next check', value: 'Render before content-coverage claims' },
];

const evidenceTrace = [
  {
    id: '01',
    title: 'Ask',
    body: 'A search question is grouped with nearby demand, service language, and the entities it implies.',
  },
  {
    id: '02',
    title: 'Locate',
    body: 'The closest relevant page is retrieved with the passage that made it useful.',
  },
  {
    id: '03',
    title: 'Limit',
    body: 'The system marks what the source supports and the claim it cannot honestly support yet.',
  },
  {
    id: '04',
    title: 'Prescribe',
    body: 'The recommendation names the smallest page, internal link, schema, or copy repair that closes the gap.',
  },
];

const evidenceStateRows = [
  {
    state: 'confirmed_content',
    meaning: 'Normal rendered content reached; findings can cite page text, links, and metadata.',
  },
  {
    state: 'access_challenge',
    meaning: 'Challenge, bot wall, or rate limit observed; treat as measurement gap, not a content defect.',
  },
  {
    state: 'utility_url',
    meaning: 'Feed, print, cart, script, or external handoff URL; keep out of client-facing action queues.',
  },
  {
    state: 'http_error_page',
    meaning: 'Status-only error response; preserve the failure without turning it into a normal page task.',
  },
];

const evidenceStateChips = [
  { state: 'confirmed_content', label: 'eligible for client review' },
  { state: 'access_challenge', label: 'measurement gap only' },
  { state: 'utility_url', label: 'inventory, not action queue' },
  { state: 'http_error_page', label: 'failure preserved, not normalized' },
];

const coverageRows = [
  {
    area: 'Static quote route',
    observed: '/',
    gap: 'None in source quote-card extraction',
    next: 'Keep as source baseline',
  },
  {
    area: 'JavaScript quote route',
    observed: '/js/',
    gap: 'Rendered quote elements absent from source HTML',
    next: 'Run rendered capture',
  },
  {
    area: 'Canonical field',
    observed: 'Both sampled responses',
    gap: 'No canonical field observed',
    next: 'Record only; no severity assigned',
  },
  {
    area: 'Static pagination',
    observed: '/page/2/',
    gap: 'Uncrawled in this bounded snapshot',
    next: 'Add to next manifest',
  },
];

const coverageMetrics = [
  { label: 'Sample pages', value: '2' },
  { label: 'Observed fields', value: '9' },
  { label: 'Finding chains', value: '3' },
];

const coverageLadder = [
  {
    label: 'Inventory',
    value: 'Every indexable page, redirect, canonical, and source path is kept traceable back to discovery.',
  },
  {
    label: 'Map',
    value: 'The crawl is arranged by service, location, entity, intent, and template purpose.',
  },
  {
    label: 'Compare',
    value: 'Observed pages are compared against the questions and entities the site should be able to answer.',
  },
  {
    label: 'Prioritize',
    value: 'Repairs are ranked by demand, source strength, implementation size, and risk of overclaiming.',
  },
];

const terminalLines = [
  'Public sample summary — not a live CLI transcript',
  'Corpus: Quotes to Scrape',
  'Seed pages: 2',
  'Completed browser traces: 0',
  'Render review required: 1',
  'Reviewable findings: 3',
  'Outputs: CSV + JSON',
  'Claim limit: demonstration only; not a corpus-owner audit',
];

const issueRows = [
  { issue: 'Render-dependent quote output', evidence: 'Source script', impact: 'Review' },
  { issue: 'Canonical field absent', evidence: 'Source extraction', impact: 'Observation' },
  { issue: 'Pagination path discovered', evidence: 'HTML navigation', impact: 'Inventory' },
];

const technicalPillars = [
  { label: 'Run state', value: 'SQLite audit store with durable run IDs and current-output checks' },
  { label: 'Sources', value: 'Seed URLs, sitemaps, rendered links, logs, and operator-supplied context' },
  { label: 'Finding context', value: 'URL, passage, status, render state, source path, and claim limit' },
  { label: 'Exports', value: 'JSON, CSV, markdown, and a reviewed operator brief' },
  { label: 'Human review', value: 'A clear issue queue before anything becomes client-facing' },
  { label: 'Boundary', value: 'Measurement gaps stay separate from confirmed site defects' },
];

const technicalFlow = [
  { id: '01', label: 'Acquire', detail: 'Fetch, render, normalize, and save the discovered pages.' },
  { id: '02', label: 'Qualify', detail: 'Sort normal content from challenges, utility URLs, and failed fetches.' },
  { id: '03', label: 'Retrieve', detail: 'Bind questions to passages, pages, confidence values, and limits.' },
  { id: '04', label: 'Review', detail: 'Hold recommended actions for human review before delivery.' },
];

const gateRows = [
  { gate: 'Provider gap', behavior: 'Reported as missing measurement, never as confirmation that the site failed.' },
  { gate: 'Challenge page', behavior: 'Recorded as an access problem and excluded from normal issue scoring.' },
  { gate: 'Utility URL', behavior: 'Kept in the atlas inventory but excluded from recommendation queues.' },
  { gate: 'Current export', behavior: 'Used only when its run ID matches the crawl under review.' },
];

const deliverableRows = [
  { label: 'Crawl inventory', value: 'URLs, statuses, canonicals, redirects, discovery paths, and observed states' },
  { label: 'Query analysis', value: 'Questions tied to pages, passages, confidence, and the limit of each claim' },
  { label: 'Coverage map', value: 'The services, locations, entities, and examples the site can or cannot support' },
  { label: 'Issue queue', value: 'Prioritized repairs with affected URLs, rationale, source notes, and review status' },
  { label: 'Client brief', value: 'A restrained summary that separates observed facts from recommended work' },
  { label: 'Machine exports', value: 'CSV and JSON outputs for engineering, content ops, and repeated comparisons' },
];

const handoffNotes = [
  'Observed facts remain separate from derived labels, scores, and recommendations.',
  'Skipped providers, blocked pages, and failed fetches remain measurement gaps.',
  'Only current, reviewed files are included in delivery.',
];

const finalActions = [
  { href: '/atlas/sample-crawl', label: 'See an Atlas sample crawl run' },
  {
    href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
    label: 'View the audit CLI',
    external: true,
  },
  { href: '/contact', label: 'Request an audit' },
];

export default function AtlasPage() {
  useSEO(ATLAS_SEO);
  const prefersReducedMotion = useReducedMotion();

  const gentleReveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <main className="site-page site-page-light visual-lab-page atlas-visual relative min-h-screen overflow-x-clip bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/atlas" tone="light" variant="home" />

      {/* Hero Section */}
      <section id="atlas-hero" className="relative border-b border-ink/12 px-4 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24 xl:px-10">
        <div className="mx-auto grid w-full max-w-[1480px] items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-10">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[42rem]"
          >
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/70" aria-hidden="true" />
              <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink/54">
                ATLAS ENGINE · CRAWL & EVIDENCE SYSTEM
              </p>
            </div>

            <h1 className="mt-6 font-serif text-[2.85rem] font-light leading-[0.95] tracking-normal text-ink sm:text-[3.5rem] md:text-[4.25rem] xl:text-[5.1rem]">
              To see the <br className="hidden sm:inline" />
              <span className="italic">whole structure.</span>
            </h1>

            <p className="mt-7 max-w-[34rem] text-sm leading-relaxed tracking-normal text-ink/68 md:text-base">
              A technical audit drawn like a map: pages located, findings tied to
              their source, and unknown territory left visible.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/atlas/sample-crawl"
                className="inline-flex min-h-11 items-center justify-center bg-ink px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-ink/84 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Inspect the public sample →
              </a>
              <a
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center border border-ink/28 bg-canvas px-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Request an audit →
              </a>
              <div className="flex items-center gap-5 pt-1 sm:pt-0">
                <a
                  href="#atlas-methodology"
                  className="inline-flex min-h-11 items-center border-b border-ink/28 text-[11px] uppercase tracking-[0.2em] text-ink/68 transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  View methodology ↓
                </a>
                <a
                  href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center border-b border-ink/20 text-[11px] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  View audit CLI ↗
                </a>
              </div>
            </div>

            <div className="mt-12 hidden grid-cols-2 gap-4 border-t border-ink/10 pt-6 sm:grid lg:grid-cols-4">
              {heroRunStats.map((stat) => (
                <div key={stat.label} className="border-l border-ink/14 pl-3">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/48">{stat.label}</span>
                  <span className="mt-1 block font-serif text-lg leading-tight text-ink/82">{stat.value}</span>
                  <span className="mt-1 block text-[11px] leading-4 text-ink/50">{stat.note}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dedicated Contained Artwork Plate */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto flex max-w-[34rem] flex-col overflow-hidden border border-ink/14 bg-canvas/80 p-7 shadow-[0_16px_50px_color-mix(in_srgb,var(--color-ink)_3.5%,transparent)]">
              {/* Corner decorative marks */}
              <div className="pointer-events-none absolute left-3 top-3 h-2 w-2 border-l border-t border-ink/30" aria-hidden="true" />
              <div className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-r border-t border-ink/30" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 border-b border-l border-ink/30" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-ink/30" aria-hidden="true" />

              <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3 text-[10px] uppercase tracking-[0.24em] text-ink/50">
                <span>SPECIMEN PLATE · ATLAS COELIFER</span>
                <span>OPEN-CORPUS HARNESS</span>
              </div>

              <div className="relative flex h-[28rem] w-full items-center justify-center overflow-hidden">
                <img
                  src={ATLAS_ARTWORK}
                  alt="Atlas bearing the celestial sphere engraved diagram"
                  className="h-full w-full object-contain opacity-[0.22] transition-opacity duration-500 hover:opacity-[0.28]"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="mt-4 border-t border-ink/10 pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/70">
                    Demonstration: Quotes to Scrape
                  </span>
                  <a
                    href="/atlas/sample-crawl"
                    className="text-[10px] uppercase tracking-[0.18em] text-ink/64 underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    Inspect run records →
                  </a>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-ink/54">
                  Raw HTML extract vs client-side rendered DOM. Bounded seed set with explicit render checks and no synthetic scoring.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <MobileSamplePackage />
      <AtlasStatusMatrix />

      {/* Methodology Section */}
      <section
        id="atlas-methodology"
        className="relative scroll-mt-28 border-b border-ink/12 px-4 py-16 md:px-8 md:py-24 xl:px-10"
      >
        <div className="mx-auto max-w-[1480px] lg:px-10">
          <div className="mb-12 max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">
              ATLAS METHODOLOGY
            </p>
            <h2 className="mt-4 font-serif text-[2.4rem] font-light leading-[1] tracking-normal text-ink sm:text-[3.2rem]">
              The four-phase crawl cycle.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/64 md:text-base">
              How an audit moves from raw network discovery to verifiable recommendations without losing provenance or fabricating coverage.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            {/* Steps Timeline */}
            <div className="relative">
              <div className="absolute left-[1.1rem] top-4 bottom-4 w-px bg-ink/16 md:left-[1.25rem]" aria-hidden="true" />
              <div className="space-y-8">
                {methodSteps.map((step) => (
                  <motion.article
                    key={step.id}
                    {...gentleReveal}
                    className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 md:grid-cols-[3.25rem_minmax(0,1fr)] md:gap-6"
                  >
                    <div className="relative flex flex-col items-center pt-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/40 bg-canvas text-[10px] font-semibold tracking-wider text-ink shadow-[0_0_0_4px_var(--color-canvas)]">
                        {step.id}
                      </span>
                    </div>
                    <div className="border-b border-ink/10 pb-6">
                      <h3 className="font-serif text-xl font-medium tracking-normal text-ink/88 md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl text-sm leading-6 text-ink/60 md:text-[15px]">
                        {step.body}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Crawl Ledger Card */}
            <motion.aside
              {...gentleReveal}
              className="flex flex-col border border-ink/14 bg-canvas/80 p-6 md:p-8 shadow-[0_8px_30px_color-mix(in_srgb,var(--color-ink)_2.5%,transparent)]"
            >
              <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4 text-[10px] uppercase tracking-[0.24em] text-ink/50">
                <span>SAMPLE CRAWL</span>
                <span>SAMPLE RUN: QUOTES TO SCRAPE</span>
              </div>
              <div className="divide-y divide-ink/10">
                {crawlLedgerRows.map((row, index) => (
                  <div key={row.field} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-3.5 text-xs">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-ink/82">{row.field}</span>
                        <span className="font-serif text-sm leading-none text-ink/84">{row.value}</span>
                      </div>
                      <div className="mt-1.5">
                        <span className="inline-block rounded-xs border border-ink/14 bg-ink/[0.03] px-2 py-0.5 font-mono text-[10px] text-ink/58">
                          {row.state}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/50">
                Every crawl record stores whether content was observed in the initial HTTP response or required a separate headless render state.
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <EvidenceSection prefersReducedMotion={prefersReducedMotion} />
      <CoverageSection prefersReducedMotion={prefersReducedMotion} />
      <TechnicalSection prefersReducedMotion={prefersReducedMotion} />
      <FinalAtlasSection prefersReducedMotion={prefersReducedMotion} />
      <InternalFooter activePath="/atlas" tone="light" />
    </main>
  );
}

function AtlasStatusMatrix() {
  return (
    <section className="atlas-visual__status relative z-10 border-b border-ink/12 bg-canvas px-4 py-16 md:px-8 md:py-20 xl:px-10" aria-labelledby="atlas-status-heading">
      <div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-14 lg:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">Current capability status</p>
          <h2 id="atlas-status-heading" className="mt-4 font-serif text-[2.4rem] font-light italic leading-[0.98] text-ink sm:text-[3.2rem]">
            What works now, and what does not yet.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/64">
            Status is intentionally conservative. “Prototype,” “partial,” and “in development” remain visible until the software and public sample justify a stronger label.
          </p>
        </div>
        <div className="divide-y divide-ink/12 border-y border-ink/12">
          {capabilityStatus.map((item) => (
            <div key={item.capability} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,0.36fr)_minmax(9rem,0.22fr)_minmax(0,0.42fr)] sm:items-center">
              <span className="text-sm font-medium text-ink/86">{item.capability}</span>
              <span className="w-fit rounded-xs border border-ink/18 bg-ink/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink/70">
                {item.status}
              </span>
              <a
                href={item.href}
                className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.18em] text-ink/64 underline decoration-ink/25 underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {item.proof}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileSamplePackage() {
  return (
    <section className="atlas-visual__mobile-package relative z-10 border-b border-ink/12 bg-canvas px-4 py-10 sm:hidden" aria-labelledby="atlas-mobile-sample-title">
      <div className="grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink/48">
              SAMPLE PACKAGE
            </p>
            <h2 id="atlas-mobile-sample-title" className="mt-1.5 font-serif text-2xl font-light leading-none tracking-normal text-ink/86">
              Reviewed crawl sample
            </h2>
          </div>
          <span className="shrink-0 rounded-xs border border-ink/14 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-ink/48">
            Mobile Specimen
          </span>
        </div>

        <dl className="grid grid-cols-2 border border-ink/12 bg-canvas">
          {heroRunStats.map((stat) => (
            <div key={stat.label} className="border-b border-ink/10 p-3 odd:border-r odd:border-ink/10 last:border-b-0">
              <dt className="text-[10px] uppercase tracking-[0.16em] text-ink/48">{stat.label}</dt>
              <dd className="mt-1 font-serif text-lg leading-none text-ink/84">{stat.value}</dd>
              <dd className="mt-1 text-[10px] leading-4 text-ink/48">{stat.note}</dd>
            </div>
          ))}
        </dl>

        <nav className="grid gap-2 text-[11px] tracking-normal text-ink/60" aria-label="Atlas mobile specimen links">
          {mobileHeroLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="group grid min-h-12 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border border-ink/12 bg-canvas px-3 py-2 transition-colors hover:border-ink/36 hover:text-ink/82"
            >
              <span className="tabular-nums text-[10px] text-ink/40">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-ink/48">{link.note}</span>
                <span className="mt-0.5 block font-serif text-sm italic leading-none text-ink/78">
                  {link.label}
                </span>
              </span>
              <span aria-hidden="true" className="text-[10px] uppercase tracking-[0.18em] text-ink/40 transition-transform group-hover:translate-x-1">
                Open →
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function EvidenceSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const gentleReveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="atlas-evidence"
      className="relative scroll-mt-28 border-b border-ink/12 px-4 py-16 md:px-8 md:py-24 xl:px-10"
    >
      <div className="mx-auto max-w-[1480px] lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
          <motion.div {...gentleReveal}>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">
              ANALYSIS MODEL
            </p>
            <h2 className="mt-4 font-serif text-[2.4rem] font-light leading-[1] tracking-normal text-ink sm:text-[3.2rem]">
              Every conclusion keeps its limits.
            </h2>
            <p className="mt-6 text-sm leading-7 text-ink/64 md:text-base">
              Atlas reads a site as a network of pages, passages, and technical states.
              Each finding keeps its source and uncertainty close, so the audit can
              distinguish what was observed, what was inferred, and what remains unknown.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-y border-ink/12 py-4 text-[10px] uppercase tracking-[0.18em]">
              <div>
                <dt className="text-ink/46">Priority</dt>
                <dd className="mt-1 text-sm font-semibold text-ink/82">High</dd>
              </div>
              <div>
                <dt className="text-ink/46">Confidence</dt>
                <dd className="mt-1 text-sm font-semibold text-ink/82">0.87</dd>
              </div>
              <div>
                <dt className="text-ink/46">State</dt>
                <dd className="mt-1 text-sm font-semibold text-ink/82">Confirmed</dd>
              </div>
            </dl>
            <p className="mt-8 border-l-2 border-ink/20 pl-4 font-serif text-base italic leading-relaxed text-ink/60">
              “A recommendation becomes useful when the path from observation to repair
              is short enough for another person to challenge.”
            </p>
          </motion.div>

          {/* Evidence States Definition Grid */}
          <motion.div {...gentleReveal} className="grid gap-4 sm:grid-cols-2">
            {evidenceStateRows.map((row) => (
              <div key={row.state} className="border border-ink/12 bg-canvas/70 p-5">
                <span className="font-mono text-xs font-semibold text-ink/76">{row.state}</span>
                <p className="mt-3 text-xs leading-5 text-ink/58">{row.meaning}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trace Pipeline Banner */}
        <motion.div {...gentleReveal} className="mt-14 border border-ink/14 bg-canvas/90 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4 text-[10px] uppercase tracking-[0.24em] text-ink/50">
            <span>REVIEW PATH & TRACE PIPELINE</span>
            <span>QUERY → PAGE → PASSAGE → LIMIT → REPAIR</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {evidenceTrace.map((step) => (
              <article key={step.id} className="border-l border-ink/14 pl-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink/46">{step.id} / PHASE</span>
                <h3 className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink/84">{step.title}</h3>
                <p className="mt-2 text-xs leading-5 text-ink/56">{step.body}</p>
              </article>
            ))}
          </div>
        </motion.div>

        {/* Evidence Demonstration Table */}
        <motion.div {...gentleReveal} className="mt-10 border border-ink/14 bg-canvas">
          <div className="border-b border-ink/10 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.24em] text-ink/50">
            CONCRETE AUDIT DEMONSTRATION · EVIDENCE LEDGER
          </div>
          <div className="divide-y divide-ink/10">
            {evidenceCards.map((card, index) => (
              <div
                key={card.label}
                className="grid gap-2 px-6 py-3.5 md:grid-cols-[14rem_minmax(0,1fr)] md:items-baseline"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/52">
                  {String(index + 1).padStart(2, '0')} / {card.label}
                </dt>
                <dd className={card.kind === 'score' ? 'font-serif text-xl leading-none text-ink/84' : 'text-xs leading-6 text-ink/68 md:text-sm'}>
                  {card.value}
                </dd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CoverageSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const gentleReveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="atlas-coverage"
      className="relative scroll-mt-28 border-b border-ink/12 px-4 py-16 md:px-8 md:py-24 xl:px-10"
    >
      <div className="mx-auto max-w-[1480px] lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <motion.div {...gentleReveal} className="max-w-xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">
              COVERAGE MAP
            </p>
            <h2 className="mt-4 font-serif text-[2.4rem] font-light leading-[1] tracking-normal text-ink sm:text-[3.2rem]">
              The map shows where the site goes quiet.
            </h2>
            <p className="mt-6 text-sm leading-7 text-ink/64 md:text-base">
              The crawl is not the destination. It is the rough fieldwork that reveals
              which services, entities, locations, examples, and supporting pages can be
              found, understood, and trusted.
            </p>
            <p className="mt-6 border-l-2 border-ink/20 pl-4 font-serif text-base italic leading-relaxed text-ink/60">
              “The useful map is not the biggest one. It is the one that shows where a
              search system runs out of useful context.”
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-y border-ink/12 py-4">
              {coverageMetrics.map((metric) => (
                <div key={metric.label} className="border-l border-ink/12 pl-3 first:border-l-0">
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-ink/48">{metric.label}</dt>
                  <dd className="mt-1 font-serif text-xl leading-none text-ink/80">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Coverage Table & Ladder */}
          <motion.div {...gentleReveal} className="space-y-6">
            <div className="overflow-hidden border border-ink/14 bg-canvas">
              <div className="border-b border-ink/10 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/50">
                OBSERVED AUDIT SURFACES & QUIET EDGES
              </div>
              <div className="divide-y divide-ink/10">
                {coverageRows.map((row, index) => (
                  <div
                    key={row.area}
                    className="grid gap-3 p-5 text-xs md:grid-cols-[1.1fr_0.9fr_1.1fr_0.9fr] md:items-baseline"
                  >
                    <div>
                      <span className="mr-2 tabular-nums text-[10px] text-ink/40">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-medium text-ink/84">{row.area}</span>
                    </div>
                    <div className="font-mono text-[11px] text-ink/58">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-ink/44 md:hidden">Observed</span>
                      {row.observed}
                    </div>
                    <div className="text-ink/62">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-ink/44 md:hidden">Quiet edge</span>
                      {row.gap}
                    </div>
                    <div className="font-mono text-[11px] text-ink/70 md:text-right">
                      <span className="block text-[10px] uppercase tracking-[0.16em] text-ink/44 md:hidden">Next move</span>
                      {row.next}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Ladder */}
            <div className="border border-ink/14 bg-canvas/70 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">
                Coverage ladder · from raw discovery to prioritized repairs
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {coverageLadder.map((step, index) => (
                  <div key={step.label} className="border-l border-ink/14 pl-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink/44">
                      0{index + 1} / {step.label}
                    </span>
                    <p className="mt-1 text-xs leading-5 text-ink/60">{step.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TechnicalSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const gentleReveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section
      id="atlas-technical"
      className="relative scroll-mt-28 border-b border-ink/12 px-4 py-16 md:px-8 md:py-24 xl:px-10"
    >
      <div className="mx-auto max-w-[1480px] lg:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">
            UNDER THE HOOD
          </p>
          <h2 className="mt-4 font-serif text-[2.4rem] font-light leading-[1] tracking-normal text-ink sm:text-[3.2rem]">
            The machinery stays legible.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/64 md:text-base">
            Atlas begins with the crawl. Source discovery, rendered observations,
            analysis, and recommendations remain distinct, so a reviewer can follow
            the reasoning instead of accepting a score at face value.
          </p>
        </div>

        {/* 4-Phase Pipeline Banner */}
        <div className="grid gap-3 border-y border-ink/12 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {technicalFlow.map((step) => (
            <div key={step.id} className="border-l border-ink/14 pl-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink/44">{step.id} / PIPELINE</span>
              <h3 className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-ink/80">{step.label}</h3>
              <p className="mt-1 text-xs leading-5 text-ink/54">{step.detail}</p>
            </div>
          ))}
        </div>

        {/* Side-by-Side Inspector: Terminal vs Review Queue */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Terminal Inspector */}
          <motion.div
            {...gentleReveal}
            className="overflow-hidden border border-ink/16 bg-canvas-dark text-ink shadow-[0_8px_30px_color-mix(in_srgb,var(--color-ink)_2%,transparent)]"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-ink/50">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink/30" />
                <span className="h-2 w-2 rounded-full bg-ink/30" />
                <span className="h-2 w-2 rounded-full bg-ink/30" />
                <span className="ml-2">AUDIT CLI OUTPUT</span>
              </div>
              <span>SAMPLE RUN</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-6 text-ink/78">
              {terminalLines.map((line) => (
                <code key={line} className="block">
                  {line}
                </code>
              ))}
            </pre>
          </motion.div>

          {/* Review Queue Table */}
          <motion.div
            {...gentleReveal}
            className="overflow-hidden border border-ink/14 bg-canvas p-5"
          >
            <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/50">
              <span>REVIEW QUEUE</span>
              <span>GATE STATUS</span>
            </div>
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Atlas review queue issues, sources, and impact</caption>
              <thead className="border-b border-ink/12 text-[10px] uppercase tracking-[0.16em] text-ink/48">
                <tr>
                  <th scope="col" className="pb-2.5 font-medium">Issue</th>
                  <th scope="col" className="pb-2.5 font-medium">Source</th>
                  <th scope="col" className="pb-2.5 text-right font-medium">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {issueRows.map((row) => (
                  <tr key={row.issue}>
                    <td className="py-3 pr-3 font-medium text-ink/80">{row.issue}</td>
                    <td className="py-3 pr-3 text-ink/54">{row.evidence}</td>
                    <td className="py-3 text-right">
                      <span className="inline-block rounded-xs border border-ink/14 bg-ink/[0.03] px-2 py-0.5 font-mono text-[10px] text-ink/68">
                        {row.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/52">
              Every finding is anchored to source URLs, passages, and a durable run ID, so recommendations can be audited before they are accepted.
            </p>
          </motion.div>
        </div>

        {/* Fail-Closed Gates Grid */}
        <motion.div {...gentleReveal} className="mt-10 border border-ink/14 bg-canvas/80 p-6 md:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">
            Quality controls · operating boundaries
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gateRows.map((row) => (
              <div key={row.gate} className="border-l border-ink/14 pl-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/80">{row.gate}</h3>
                <p className="mt-1.5 text-xs leading-5 text-ink/56">{row.behavior}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Pillars */}
        <motion.div {...gentleReveal} className="mt-10 border-t border-ink/12 pt-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-ink/48">
            ARCHITECTURE PILLARS
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicalPillars.map((pillar) => (
              <div key={pillar.label} className="border-l border-ink/12 pl-3">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-ink/44">{pillar.label}</dt>
                <dd className="mt-1 text-xs leading-5 text-ink/64">{pillar.value}</dd>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalAtlasSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const gentleReveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <section id="atlas-final" className="relative scroll-mt-28 border-b border-ink/12 px-4 py-16 md:px-8 md:py-24 xl:px-10">
      <div className="mx-auto grid w-full max-w-[1480px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-10">
        <motion.div {...gentleReveal} className="max-w-xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/50">
            ATLAS ENGINE
          </p>
          <h2 className="mt-4 font-serif text-[2.8rem] font-light leading-[0.96] tracking-normal text-ink sm:text-[3.6rem] xl:text-[4.25rem]">
            A map for <br />
            <span className="italic">actual repairs.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-ink/64 md:text-base">
            The final report should read like an annotation, not a pitch: what was
            seen, what was missing, what to change first, and what still requires
            judgment.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            {finalActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noreferrer' : undefined}
                className="inline-flex min-h-11 items-center justify-center border border-ink/20 bg-canvas px-4 text-[10px] uppercase tracking-[0.2em] text-ink/72 transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div {...gentleReveal} className="border border-ink/14 bg-canvas p-6 md:p-8 shadow-[0_8px_30px_color-mix(in_srgb,var(--color-ink)_2.5%,transparent)]">
          <div className="mb-4 grid grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-4 border-b border-ink/10 pb-3 text-[10px] uppercase tracking-[0.2em] text-ink/50">
            <span>Deliverable</span>
            <span>Contents</span>
          </div>
          <div className="divide-y divide-ink/10">
            {deliverableRows.map((row, index) => (
              <div
                key={row.label}
                className="grid gap-2 py-3.5 text-xs sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] sm:gap-4"
              >
                <div>
                  <span className="mr-3 tabular-nums text-[10px] text-ink/40">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-ink/84">{row.label}</span>
                </div>
                <p className="leading-5 text-ink/60">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 border-t border-ink/12 pt-6 sm:grid-cols-3">
            {handoffNotes.map((note, index) => (
              <div key={note} className="border-t border-ink/10 pt-3 text-[11px] leading-5 text-ink/54 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-3">
                <span className="block text-[9px] uppercase tracking-[0.2em] text-ink/40">
                  RULE 0{index + 1}
                </span>
                <p className="mt-1">{note}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
