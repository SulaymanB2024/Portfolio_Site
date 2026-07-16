import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef, type CSSProperties, type RefObject } from 'react';
import { InternalFooter } from '../components/InternalFooter';
import InternalHeader from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ATLAS_SEO = getSeoRoute('/atlas')!;
const ATLAS_ARTWORK = '/images/atlas-coelifer.svg';
const ATLAS_ASSETS = {
  frameFragment: '/images/atlas/frame-fragment.png',
  orbitNetwork: '/images/atlas/orbit-network.png',
  orbitSphere: '/images/atlas/orbit-sphere.png',
  celestialArc: '/images/atlas/celestial-arc.png',
  atlasFigureGlobe: '/images/atlas/atlas-figure-globe.png',
  atlasFigurePortrait: '/images/atlas/atlas-figure-portrait.png',
  armillarySphere: '/images/atlas/armillary-sphere.png',
} as const;

const openingArtworkStyle: CSSProperties = {
  maskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.96) 50%, rgba(0,0,0,0.9) 90%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.92) 9%, rgba(0,0,0,0.98) 84%, transparent 100%)',
  maskComposite: 'intersect',
  WebkitMaskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.96) 50%, rgba(0,0,0,0.9) 90%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.92) 9%, rgba(0,0,0,0.98) 84%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
};

const suppliedPlateStyle: CSSProperties = {
  filter: 'contrast(1.08) saturate(0.55) brightness(0.98)',
  mixBlendMode: 'multiply',
};

const widePlateMaskStyle: CSSProperties = {
  maskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.86) 12%, rgba(0,0,0,0.96) 76%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.94) 12%, rgba(0,0,0,0.92) 86%, transparent 100%)',
  maskComposite: 'intersect',
  WebkitMaskImage:
    'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.86) 12%, rgba(0,0,0,0.96) 76%, transparent 100%), linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.94) 12%, rgba(0,0,0,0.92) 86%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
};

const methodSteps = [
  {
    id: '01',
    title: 'Discover',
    body: 'Seed paths, sitemaps, rendered links, redirects, and stray edges are kept in one inspectable inventory.',
  },
  {
    id: '02',
    title: 'Qualify',
    body: 'Normal content, access challenges, utility URLs, and error surfaces are separated before scoring.',
  },
  {
    id: '03',
    title: 'Trace',
    body: 'Questions are tied to pages, passages, confidence values, and the limit of what the source proves.',
  },
  {
    id: '04',
    title: 'Review',
    body: 'Repairs stay behind a human-readable gate until the run, file, and source claim still match.',
  },
];

const heroRunStats = [
  { label: 'Public pages captured', value: '2', note: 'bounded open-corpus seed set' },
  { label: 'Observed states', value: '2', note: 'static and render-dependent source' },
  { label: 'Traceable findings', value: '3', note: 'observation, derivation, next check' },
  { label: 'Run package', value: 'CSV + JSON', note: 'dated snapshot; no build-time crawl' },
];

const mobileHeroLinks = [
  { href: '/atlas/sample-crawl', label: 'See an Atlas sample crawl run', note: 'Review package' },
  {
    href: 'https://github.com/SulaymanB2024/Thick-Scraper-VOID-',
    label: 'View GitHub repo',
    note: 'Audit CLI',
    external: true,
  },
  { href: '/contact', label: 'Request an audit', note: 'Contact' },
];

const capabilityStatus = [
  { capability: 'Native crawl inventory', status: 'Shipped', proof: 'Open-corpus demonstration', href: '/atlas/sample-crawl' },
  { capability: 'Raw / rendered evidence', status: 'Shipped', proof: 'Evidence model below', href: '#atlas-evidence' },
  { capability: 'Run persistence and exports', status: 'Shipped / partial', proof: 'Technical architecture below', href: '#atlas-technical' },
  { capability: 'Provider mesh', status: 'Prototype', proof: 'Measurement gaps remain explicit', href: '#atlas-technical' },
  { capability: 'Scoring policy', status: 'In development', proof: 'Review gate remains authoritative', href: '#atlas-technical' },
  { capability: 'Client handoff', status: 'Partial', proof: 'Public demonstration package, not a client deliverable', href: '/atlas/sample-crawl' },
];

const crawlLedgerRows = [
  { field: 'Seed URLs', value: '2 public pages', state: 'inventory' },
  { field: 'Static source', value: '10 quote cards', state: 'confirmed_source_content' },
  { field: 'JS source', value: '10 embedded data records', state: 'render_review_required' },
  { field: 'Canonical field', value: 'absent in both source responses', state: 'observation_only' },
  { field: 'Exports', value: 'CSV + JSON manifest', state: 'reviewable_artifact' },
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
    body: 'The closest crawl-backed surface is retrieved with the passage that made it relevant.',
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
    meaning: 'Status-only error surface; preserve the failure without turning it into a normal page task.',
  },
];

const evidenceStateChips = [
  { state: 'confirmed_content', label: 'client-visible evidence allowed' },
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
  {
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
    value: 'Observed surfaces are compared against the questions and entities the site should be able to answer.',
  },
  {
    label: 'Prioritize',
    value: 'Repairs are ranked by demand, evidence strength, implementation size, and risk of overclaiming.',
  },
];

const terminalLines = [
  '# bounded public demonstration; not a private client run',
  '$ atlas audit --seed https://quotes.toscrape.com/js/ --render',
  'Opening crawl ledger...',
  '2 seed pages captured from the versioned manifest',
  'Drawing evidence states...',
  'static_source=1 render_review_required=1',
  'Extracting titles, canonicals, links, source content, and runtime indicators',
  'Binding observations to finding chains...',
  '3 reviewable findings with confidence and claim limits',
  'No client actions generated from demonstration data',
  'Export package sealed with seed URLs, run ID, and boundaries',
];

const issueRows = [
  { issue: 'Render-dependent quote output', evidence: 'Source script', impact: 'Review' },
  { issue: 'Canonical field absent', evidence: 'Source extraction', impact: 'Observation' },
  { issue: 'Pagination path discovered', evidence: 'HTML navigation', impact: 'Inventory' },
];

const technicalPillars = [
  { label: 'Run state', value: 'SQLite audit store with durable run IDs and current-output checks' },
  { label: 'Sources', value: 'Seed URLs, sitemaps, rendered links, logs, and operator-supplied context' },
  { label: 'Evidence', value: 'URL, passage, status, render state, source path, and claim boundary' },
  { label: 'Exports', value: 'JSON, CSV, markdown, and a reviewed operator package' },
  { label: 'Review gate', value: 'Human-readable issue queue before anything becomes client-facing' },
  { label: 'Boundary', value: 'Measurement gaps stay separate from confirmed site defects' },
];

const technicalFlow = [
  { id: '01', label: 'Acquire', detail: 'Fetch, render, normalize, and persist the discovered surface.' },
  { id: '02', label: 'Qualify', detail: 'Sort normal content from challenges, utility URLs, and failed fetches.' },
  { id: '03', label: 'Retrieve', detail: 'Bind questions to passages, pages, confidence values, and limits.' },
  { id: '04', label: 'Review', detail: 'Hold generated actions behind a human-readable publish gate.' },
];

const gateRows = [
  { gate: 'Provider gap', behavior: 'Reported as missing measurement, never as confirmation that the site failed.' },
  { gate: 'Challenge page', behavior: 'Preserved as access evidence and suppressed from normal issue scoring.' },
  { gate: 'Utility URL', behavior: 'Kept in the atlas inventory but excluded from recommendation queues.' },
  { gate: 'Fixed output', behavior: 'Trusted only when embedded run IDs match the current reviewed run.' },
];

const deliverableRows = [
  { label: 'Crawl inventory', value: 'URLs, statuses, canonicals, redirects, discovery paths, and evidence states' },
  { label: 'Retrieval evidence', value: 'Questions tied to pages, passages, confidence, and the edge of each claim' },
  { label: 'Coverage map', value: 'The services, locations, entities, and examples the site can or cannot support' },
  { label: 'Issue queue', value: 'Prioritized repairs with affected URLs, rationale, source notes, and review status' },
  { label: 'Client brief', value: 'A restrained summary that separates observed facts from recommended work' },
  { label: 'Machine exports', value: 'CSV and JSON outputs for engineering, content ops, and repeated comparisons' },
];

const handoffNotes = [
  'Observed facts remain separate from derived labels, scores, and recommendations.',
  'Skipped providers, blocked pages, and failed fetches remain measurement gaps.',
  'Review and publish gates keep stale or unverified packages out of delivery.',
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

const finalNodes = [
  { x: '42%', y: '35%' },
  { x: '51%', y: '28%' },
  { x: '60%', y: '42%' },
  { x: '68%', y: '33%' },
  { x: '75%', y: '52%' },
  { x: '57%', y: '62%' },
  { x: '45%', y: '55%' },
  { x: '82%', y: '39%' },
];

const gentleReveal = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.34, margin: '-8% 0px -8% 0px' },
  transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
} as const;

export default function AtlasPage() {
  useSEO(ATLAS_SEO);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const methodologyRef = useRef<HTMLElement>(null);
  const evidenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const { scrollYProgress: methodologyProgress } = useScroll({
    target: methodologyRef,
    offset: ['start 0.74', 'start 0.18'],
  });
  const { scrollYProgress: evidenceProgress } = useScroll({
    target: evidenceRef,
    offset: ['start 0.98', 'start 0.42'],
  });

  const smoothHeroProgress = useSpring(heroProgress, { stiffness: 140, damping: 30, mass: 0.2 });
  const smoothMethodologyProgress = useSpring(methodologyProgress, { stiffness: 130, damping: 30, mass: 0.2 });
  const smoothEvidenceProgress = useSpring(evidenceProgress, { stiffness: 120, damping: 34, mass: 0.24 });

  const atlasOpacity = useTransform(smoothEvidenceProgress, [0, 0.35, 0.78, 1], [0.16, 0.1, 0.015, 0]);
  const evidencePlateOpacity = useTransform(smoothEvidenceProgress, [0, 0.45, 1], [0.04, 0.1, 0.14]);
  const evidenceFrameOpacity = useTransform(smoothEvidenceProgress, [0, 0.5, 1], [0.03, 0.08, 0.11]);
  const firstLineOpacity = useTransform(smoothHeroProgress, [0, 0.22, 0.52, 0.9], [1, 0.42, 0.16, 0.06]);
  const firstLineColor = useTransform(smoothHeroProgress, [0, 0.24, 0.56, 0.9], ['rgba(8,8,7,1)', 'rgba(8,8,7,0.58)', 'rgba(8,8,7,0.22)', 'rgba(8,8,7,0.12)']);
  const firstLineY = useTransform(smoothHeroProgress, [0, 0.7], ['0rem', '-0.92rem']);
  const heroCopyY = useTransform(smoothHeroProgress, [0, 0.58, 1], ['0rem', '-0.18rem', '-3.25rem']);
  const heroSpineHeight = useTransform(smoothHeroProgress, [0.22, 0.48, 0.68], ['0%', '34%', '44%']);
  const heroSpineOpacity = useTransform(smoothHeroProgress, [0.16, 0.34, 0.5, 0.66], [0, 0.42, 0.26, 0]);
  const methodPreviewOpacity = useTransform(smoothHeroProgress, [0.24, 0.44, 0.58, 0.7], [0, 0.58, 0.28, 0]);
  const heroContentOpacity = useTransform(smoothHeroProgress, [0, 0.45, 0.64, 0.82], [1, 1, 0.36, 0]);
  const methodologyContentOpacity = useTransform(smoothMethodologyProgress, [0, 0.45, 1], [0, 0.58, 1]);
  const methodologyContentY = useTransform(smoothMethodologyProgress, [0, 1], ['2.15rem', '0rem']);
  const methodologyLineScale = useTransform(smoothMethodologyProgress, [0.12, 0.55, 1], [0, 0.72, 1]);

  return (
    <main className="relative min-h-screen bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/atlas" tone="light" variant="home" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        style={openingArtworkStyle}
        aria-hidden="true"
      >
        <motion.img
          src={ATLAS_ARTWORK}
          alt=""
          className="absolute left-[61%] top-[43%] h-[72svh] w-[136vw] -translate-x-1/2 -translate-y-1/2 object-contain object-center max-md:!opacity-[0.08] md:left-auto md:right-[-28rem] md:top-[55%] md:h-[112svh] md:w-[88rem] md:translate-x-0 md:scale-100 xl:right-[-20rem] xl:w-[96rem]"
          style={{ opacity: atlasOpacity }}
          decoding="async"
        />
      </motion.div>

      <section
        ref={heroRef}
        id="atlas-hero"
        className="relative h-[118svh] overflow-visible md:h-[165svh]"
      >
        <div className="sticky top-0 z-10 min-h-[100svh] overflow-hidden px-4 pt-32 md:px-8 md:pt-36 xl:px-10">
          <motion.div
            className="pointer-events-none absolute left-[calc(50%-5rem)] top-[50%] z-[3] hidden w-px origin-top bg-ink/42 md:block lg:left-[calc(50%-6.75rem)]"
            style={prefersReducedMotion ? { height: '46%', opacity: 0.42 } : { height: heroSpineHeight, opacity: heroSpineOpacity }}
            aria-hidden="true"
          />
          <motion.div
            className="pointer-events-none absolute left-[calc(50%-5rem)] top-[50%] z-[3] hidden h-2 w-2 -translate-x-1/2 rounded-full border border-ink/42 bg-canvas md:block lg:left-[calc(50%-6.75rem)]"
            style={prefersReducedMotion ? { opacity: 0.7 } : { opacity: methodPreviewOpacity }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-[1480px] items-center gap-10 pb-8 md:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.58fr)] md:gap-14 md:pb-0 lg:px-10">
            <motion.div
              initial={prefersReducedMotion ? false : { y: 18 }}
              animate={prefersReducedMotion ? undefined : { y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={prefersReducedMotion ? undefined : { opacity: heroContentOpacity, y: heroCopyY }}
              id="atlas-hero-copy"
              className="w-full max-w-[24rem] md:max-w-[40rem]"
            >
              <p className="mb-7 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42 md:mb-8">
                ATLAS ENGINE
              </p>
              <h1 className="font-serif text-[2.7rem] font-light leading-[0.95] tracking-normal text-ink md:text-[3.75rem] xl:text-[4.75rem]">
                <motion.span
                  className="block md:whitespace-nowrap"
                  style={prefersReducedMotion ? undefined : { color: firstLineColor, opacity: firstLineOpacity, y: firstLineY }}
                >
                  To see the
                </motion.span>
                <span className="block md:whitespace-nowrap">
                  <span className="inline-block">
                    whole&nbsp;
                  </span>
                  <span className="inline-block">
                    structure.
                  </span>
                </span>
              </h1>
              <p className="mt-6 max-w-[26rem] text-sm leading-relaxed tracking-normal text-ink/48 md:text-[15px]">
                A technical audit drawn like a map: every page located, every claim traced,
                every recommendation tied to source data.
              </p>
              <a
                href="/atlas#atlas-methodology"
                id="atlas-view-methodology-link"
                className="mt-8 inline-block border-b border-ink/18 pb-1 font-serif text-sm italic tracking-normal text-ink/45 transition-colors hover:border-ink/45 hover:text-ink/72"
              >
                View methodology
              </a>
              <nav className="mt-7 hidden max-w-[27rem] gap-3 text-[10px] uppercase tracking-[0.2em] text-ink/52 md:grid" aria-label="Atlas sample links">
                <a href="/atlas/sample-crawl" className="group grid min-h-11 w-full border-y border-ink/16 py-3 transition-colors hover:border-ink/40 hover:text-ink/78 md:w-fit md:min-h-0 md:border-b md:border-t-0 md:py-1">
                  <span>See an Atlas sample crawl run</span>
                </a>
                <a href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" target="_blank" rel="noreferrer" className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72">
                  View GitHub repo
                </a>
                <a href="/contact" className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72">
                  Request an audit
                </a>
              </nav>
            </motion.div>

          </div>
        </div>

      </section>

      <MobileSamplePackage />
      <AtlasStatusMatrix />

      <section
        ref={methodologyRef}
        id="atlas-methodology"
        className="relative min-h-[104svh] scroll-mt-28 overflow-hidden border-t border-b border-ink/12 px-4 py-24 md:px-8 md:py-28 xl:px-10"
      >
        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-12rem)] w-full max-w-[1480px] items-center gap-10 md:grid-cols-[minmax(10rem,0.38fr)_minmax(0,0.84fr)_minmax(18rem,0.78fr)] md:gap-12 lg:px-10">
          <motion.div
            style={prefersReducedMotion ? undefined : { opacity: methodologyContentOpacity, y: methodologyContentY }}
            className="self-start md:pt-6"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.42em] text-ink/50">
              ATLAS METHODOLOGY
            </p>
          </motion.div>

          <motion.div
            className="relative max-w-[38rem] md:col-start-2"
            style={prefersReducedMotion ? undefined : { opacity: methodologyContentOpacity, y: methodologyContentY }}
          >
            <motion.div
              className="absolute left-[3.1rem] top-0 h-full w-px origin-top bg-ink/20 md:left-[3.5rem]"
              style={prefersReducedMotion ? undefined : { scaleY: methodologyLineScale }}
              aria-hidden="true"
            />
            <div>
              {methodSteps.map((step) => (
                <article
                  key={step.id}
                  className="relative grid min-h-[5.35rem] grid-cols-[5.8rem_minmax(0,1fr)] gap-5 border-b border-ink/10 py-4 md:grid-cols-[6.55rem_minmax(0,1fr)]"
                >
                  <div className="relative flex items-start gap-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/48">{step.id}</span>
                    <span className="mt-1.5 h-2 w-2 rounded-full border border-ink/48 bg-canvas shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-canvas)_90%,transparent)]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-[1.08rem] md:text-[1.28rem] xl:text-[1.45rem] font-semibold leading-none tracking-normal text-ink/86">
                      {step.title}
                    </h2>
                    <p className="mt-2 max-w-[25rem] text-xs leading-6 text-ink/56">
                      {step.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            className="border-y border-ink/12 py-5 md:col-start-3"
          >
            <div className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ink/44">
              <span>Crawl ledger</span>
              <span>sample run</span>
            </div>
            <div className="grid gap-0">
              {crawlLedgerRows.map((row, index) => (
                <div key={row.field} className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-3 border-t border-ink/10 py-3 text-xs leading-5 text-ink/58">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ink/38">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-ink/76">{row.field}</span>
                      <span className="font-serif text-base leading-none text-ink/78">{row.value}</span>
                    </div>
                    <p className="mt-2 font-mono text-[11px] text-ink/46">{row.state}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      <EvidenceSection
        prefersReducedMotion={prefersReducedMotion}
        sectionRef={evidenceRef}
        plateOpacity={evidencePlateOpacity}
        frameOpacity={evidenceFrameOpacity}
      />
      <CoverageSection prefersReducedMotion={prefersReducedMotion} />
      <TechnicalSection prefersReducedMotion={prefersReducedMotion} />
      <FinalAtlasSection prefersReducedMotion={prefersReducedMotion} />
      <InternalFooter activePath="/atlas" tone="light" />
    </main>
  );
}

function AtlasStatusMatrix() {
  return (
    <section className="relative z-10 border-b border-ink/12 bg-canvas px-4 py-14 md:px-8 xl:px-10" aria-labelledby="atlas-status-heading">
      <div className="mx-auto grid w-full max-w-[1480px] gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:px-10">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink/60">Current capability status</p>
          <h2 id="atlas-status-heading" className="mt-5 font-serif text-[2.7rem] font-light italic leading-[0.92] text-ink md:text-[4rem]">
            What works now, and what does not yet.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/66">
            Status is intentionally conservative. “Prototype,” “partial,” and “in development” remain visible until the public proof and review contract support a stronger label.
          </p>
        </div>
        <div className="border-y border-ink/14">
          {capabilityStatus.map((item) => (
            <div key={item.capability} className="grid gap-3 border-b border-ink/12 py-4 last:border-b-0 md:grid-cols-[minmax(0,0.38fr)_minmax(9rem,0.2fr)_minmax(0,0.42fr)] md:items-center">
              <span className="text-sm font-medium text-ink/82">{item.capability}</span>
              <span className="w-fit rounded-full border border-ink/18 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/68">{item.status}</span>
              <a href={item.href} className="text-[10px] uppercase tracking-[0.18em] text-ink/64 underline decoration-ink/25 underline-offset-4 hover:text-ink">{item.proof}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileSamplePackage() {
  return (
    <section className="relative z-10 border-y border-ink/12 bg-canvas/[0.88] px-4 py-9 md:hidden" aria-labelledby="atlas-mobile-sample-title">
      <div className="grid gap-6">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-ink/42">
              SAMPLE PACKAGE
            </p>
            <h2 id="atlas-mobile-sample-title" className="mt-2 font-serif text-2xl font-light leading-none tracking-normal text-ink/82">
              Reviewed crawl evidence
            </h2>
          </div>
          <span className="shrink-0 border-b border-ink/18 pb-1 text-[10px] uppercase tracking-[0.2em] text-ink/42">
            Mobile
          </span>
        </div>

        <dl className="grid grid-cols-2 border-y border-ink/12">
          {heroRunStats.map((stat) => (
            <div key={stat.label} className="min-h-[6rem] border-b border-ink/10 px-3 py-3 odd:border-r odd:border-ink/10">
              <dt className="text-[9px] uppercase tracking-[0.16em] text-ink/42">{stat.label}</dt>
              <dd className="mt-2 font-serif text-xl leading-none text-ink/82">{stat.value}</dd>
              <dd className="mt-2 text-[11px] leading-5 text-ink/46">{stat.note}</dd>
            </div>
          ))}
        </dl>

        <nav className="grid gap-2 text-[11px] tracking-normal text-ink/58" aria-label="Atlas secondary links">
          {mobileHeroLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
              className="group grid min-h-12 grid-cols-[2.4rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-ink/12 py-2 transition-colors hover:border-ink/36 hover:text-ink/78"
            >
              <span className="font-mono text-[10px] text-ink/36">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-ink/40">{link.note}</span>
                <span className="mt-1 block font-serif text-sm italic leading-none tracking-normal text-ink/70">
                  {link.label}
                </span>
              </span>
              <span aria-hidden="true" className="text-[10px] uppercase tracking-[0.18em] text-ink/34 transition-transform group-hover:translate-x-1">
                Open
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function EvidenceSection({
  prefersReducedMotion,
  sectionRef,
  plateOpacity,
  frameOpacity,
}: {
  prefersReducedMotion: boolean;
  sectionRef: RefObject<HTMLElement | null>;
  plateOpacity: MotionValue<number>;
  frameOpacity: MotionValue<number>;
}) {
  return (
    <section ref={sectionRef} id="atlas-evidence" className="relative min-h-[108svh] scroll-mt-28 overflow-hidden border-b border-ink/12 px-4 py-24 md:px-8 md:py-32 xl:px-10">
      <motion.div
        className="pointer-events-none absolute right-[-20rem] top-8 hidden h-[52rem] w-[52rem] md:block"
        style={{ ...widePlateMaskStyle, opacity: plateOpacity }}
        aria-hidden="true"
      >
        <img
          src={ATLAS_ASSETS.orbitNetwork}
          alt=""
          className="h-full w-full object-contain"
          style={suppliedPlateStyle}
          loading="lazy"
          decoding="async"
        />
      </motion.div>
      <div className="mx-auto grid w-full max-w-[1480px] gap-12 md:grid-cols-[minmax(13rem,0.62fr)_minmax(0,1.45fr)] md:gap-16 lg:px-10">
        <motion.div {...(prefersReducedMotion ? {} : gentleReveal)} className="max-w-[26rem]">
          <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42">
            EVIDENCE MODEL
          </p>
          <h2 className="max-w-[13ch] font-serif text-[2rem] md:text-[2.65rem] xl:text-[3.15rem] font-light leading-none tracking-normal text-ink">
            Every claim keeps its edge.
          </h2>
          <p className="mt-8 text-sm leading-7 text-ink/58">
            Atlas reads a site as an evidence field. The page, passage, state, and
            uncertainty stay visible together, so the audit can say what is proved,
            what is inferred, and what is still absent.
          </p>
          <dl className="mt-8 grid max-w-[25rem] grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.18em] text-ink/48">
            <div className="border-t border-ink/14 pt-3">
              <dt>Priority</dt>
              <dd className="mt-1 text-ink/78">High</dd>
            </div>
            <div className="border-t border-ink/14 pt-3">
              <dt>Confidence</dt>
              <dd className="mt-1 text-ink/78">0.87</dd>
            </div>
            <div className="border-t border-ink/14 pt-3">
              <dt>State</dt>
              <dd className="mt-1 text-ink/78">Confirmed</dd>
            </div>
          </dl>
          <p className="mt-9 border-l border-ink/16 pl-5 font-serif text-base italic leading-7 text-ink/50">
            A recommendation should feel less like a guess and more like a line
            drawn between source and absence.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border-y border-ink/12 bg-canvas/70 px-0 py-8"
          >
            <motion.div className="pointer-events-none absolute -right-12 -top-28 h-[25rem] w-[34rem]" style={{ opacity: frameOpacity }} aria-hidden="true">
              <img
                src={ATLAS_ASSETS.frameFragment}
                alt=""
                className="h-full w-full object-contain"
                style={suppliedPlateStyle}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <div className="mb-7 flex items-center justify-between border-b border-ink/10 pb-4 text-[9px] uppercase tracking-[0.24em] text-ink/44">
              <span>Review path</span>
              <span>sample plate</span>
            </div>
            <div className="mb-8 grid gap-2 border-b border-ink/10 pb-6 md:grid-cols-4">
              {evidenceStateChips.map((chip) => (
                <div key={chip.state} className="border-l border-ink/14 pl-3">
                  <p className="font-mono text-[11px] leading-none text-ink/66">{chip.state}</p>
                  <p className="mt-2 text-[11px] leading-5 text-ink/46">{chip.label}</p>
                </div>
              ))}
            </div>
            <div className="absolute left-[3rem] right-[3rem] top-[15.25rem] hidden border-t border-ink/12 md:block" aria-hidden="true" />
            <div className="relative grid gap-7 md:grid-cols-4">
              {evidenceTrace.map((step, index) => (
                <motion.article
                  key={step.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: 0.44,
                    delay: prefersReducedMotion ? 0 : index * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative px-1 md:px-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink/48">{step.id}</span>
                    <span className="h-2 w-2 rounded-full border border-ink/46 bg-canvas shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-canvas)_92%,transparent)]" />
                  </div>
                  <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/78">{step.title}</h3>
                  <p className="mt-3 max-w-[14rem] text-xs leading-6 text-ink/52">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>

          <motion.dl
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.26, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.03 }}
            className="mt-10 border-t border-ink/12"
          >
            <div className="grid gap-2 border-b border-ink/10 py-4 md:grid-cols-[13rem_minmax(0,1fr)] md:items-baseline">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/52">
                Trace
              </dt>
              <dd className="font-serif text-xl italic leading-none text-ink/78">
                query to page to passage to limitation to repair
              </dd>
            </div>
            {evidenceCards.map((card, index) => (
              <div
                key={card.label}
                className="grid gap-2 border-b border-ink/10 py-4 md:grid-cols-[13rem_minmax(0,1fr)] md:items-baseline"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/52">
                  {String(index + 1).padStart(2, '0')} / {card.label}
                </dt>
                <dd className={card.kind === 'score' ? 'font-serif text-2xl leading-none text-ink/82' : 'text-sm leading-7 text-ink/62'}>
                  {card.value}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="mt-10 grid gap-5 border-y border-ink/12 py-6 md:grid-cols-[12rem_minmax(0,1fr)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/62">
              Evidence states
            </p>
            <div className="grid gap-0">
              {evidenceStateRows.map((row) => (
                <div key={row.state} className="grid gap-2 border-b border-ink/10 py-3 last:border-b-0 md:grid-cols-[11rem_minmax(0,1fr)]">
                  <span className="font-mono text-[11px] text-ink/64">{row.state}</span>
                  <p className="text-xs leading-6 text-ink/54">{row.meaning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CoverageSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <section id="atlas-coverage" className="relative min-h-[112svh] scroll-mt-28 overflow-hidden border-b border-ink/12 px-4 py-24 md:px-8 md:py-32 xl:px-10">
      <div
        className="pointer-events-none absolute -left-[18rem] top-16 h-[42rem] w-[42rem] opacity-[0.13] md:-left-[8rem] md:top-20 md:h-[54rem] md:w-[54rem]"
        style={widePlateMaskStyle}
        aria-hidden="true"
      >
        <img
          src={ATLAS_ASSETS.orbitSphere}
          alt=""
          className="h-full w-full object-contain"
          style={suppliedPlateStyle}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="pointer-events-none absolute -bottom-36 right-[-18rem] hidden h-[36rem] w-[36rem] opacity-[0.11] md:block" aria-hidden="true">
        <img
          src={ATLAS_ASSETS.armillarySphere}
          alt=""
          className="h-full w-full object-contain"
          style={suppliedPlateStyle}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-14 md:grid-cols-[minmax(14rem,0.75fr)_minmax(0,1.35fr)] md:items-start md:gap-16 lg:px-10">
        <motion.div {...(prefersReducedMotion ? {} : gentleReveal)} className="max-w-[27rem]">
          <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42">
            COVERAGE MAP
          </p>
          <h2 className="font-serif text-[2.2rem] md:text-[3rem] xl:text-[3.55rem] font-light leading-[0.98] tracking-normal text-ink">
            The map shows where the site goes quiet.
          </h2>
          <p className="mt-8 text-sm leading-7 text-ink/58">
            The crawl is not the destination. It is the rough fieldwork that reveals
            which services, entities, locations, examples, and supporting pages can be
            found, cited, and trusted.
          </p>
          <p className="mt-9 border-l border-ink/16 pl-5 font-serif text-base italic leading-7 text-ink/50">
            The useful map is not the biggest one. It is the one that shows where a
            search system runs out of evidence.
          </p>
          <dl className="mt-10 grid max-w-[25rem] grid-cols-3 border-y border-ink/12 text-center">
            {coverageMetrics.map((metric) => (
              <div key={metric.label} className="border-r border-ink/10 px-3 py-5 last:border-r-0">
                <dt className="text-[9px] uppercase tracking-[0.2em] text-ink/42">{metric.label}</dt>
                <dd className="mt-3 font-serif text-2xl leading-none text-ink/78">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink/12"
          >
            <div className="hidden grid-cols-[minmax(0,0.78fr)_minmax(0,0.8fr)_minmax(0,0.78fr)_minmax(0,0.72fr)] gap-4 border-b border-ink/14 py-4 text-[9px] uppercase tracking-[0.18em] text-ink/44 md:grid">
              <span>Field</span>
              <span>Observed</span>
              <span>Quiet edge</span>
              <span className="text-right">Next move</span>
            </div>
            {coverageRows.map((row, index) => (
              <motion.div
                key={row.area}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.34 }}
                transition={{ duration: 0.42, delay: prefersReducedMotion ? 0 : index * 0.028, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-3 border-b border-ink/10 py-5 text-xs leading-6 text-ink/58 md:grid-cols-[minmax(0,0.78fr)_minmax(0,0.8fr)_minmax(0,0.78fr)_minmax(0,0.72fr)] md:gap-4"
              >
                <div>
                  <span className="mr-3 text-[10px] uppercase tracking-[0.18em] text-ink/42">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-ink/76">{row.area}</span>
                </div>
                <div className="font-mono text-[11px] text-ink/50">
                  <span className="mb-1 block font-sans text-[9px] uppercase tracking-[0.18em] text-ink/38 md:hidden">Observed</span>
                  {row.observed}
                </div>
                <div>
                  <span className="mb-1 block text-[9px] uppercase tracking-[0.18em] text-ink/38 md:hidden">Gap</span>
                  {row.gap}
                </div>
                <div className="font-mono text-[11px] text-ink/62 md:text-right">
                  <span className="mb-1 block font-sans text-[9px] uppercase tracking-[0.18em] text-ink/38 md:hidden">Next</span>
                  {row.next}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28, margin: '-6% 0px -6% 0px' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            className="mt-12 grid gap-5 border-y border-ink/12 py-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/62">
              Coverage ladder
            </p>
            <div className="grid gap-0">
              {coverageLadder.map((step, index) => (
                <div key={step.label} className="grid gap-3 border-b border-ink/10 py-4 last:border-b-0 md:grid-cols-[10rem_minmax(0,1fr)]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ink/46">
                    {String(index + 1).padStart(2, '0')} / {step.label}
                  </div>
                  <p className="text-sm leading-7 text-ink/58">{step.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TechnicalSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <section id="atlas-technical" className="relative min-h-[112svh] scroll-mt-28 overflow-hidden border-b border-ink/12 px-4 py-24 md:px-8 md:py-32 xl:px-10">
      <div className="pointer-events-none absolute left-1/2 top-4 hidden w-[112rem] max-w-none -translate-x-1/2 opacity-[0.17] md:block" aria-hidden="true">
        <img
          src={ATLAS_ASSETS.celestialArc}
          alt=""
          className="w-full object-contain"
          style={suppliedPlateStyle}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mx-auto grid w-full max-w-[1480px] gap-12 md:grid-cols-[minmax(13rem,0.62fr)_minmax(0,1.05fr)_minmax(13rem,0.78fr)] md:gap-10 lg:px-10">
        <motion.div {...(prefersReducedMotion ? {} : gentleReveal)}>
          <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42">
            UNDER THE HOOD
          </p>
          <h2 className="font-serif text-[2rem] md:text-[2.6rem] xl:text-[3rem] font-light leading-none tracking-normal text-ink">
            The machinery stays legible.
          </h2>
          <p className="mt-8 text-sm leading-7 text-ink/58">
            Atlas is a crawl and evidence system first. Source discovery, rendered
            observations, derived labels, and recommendations stay in separate lanes,
            so a review can inspect the path instead of trusting the verdict.
          </p>
          <p className="mt-9 border-l border-ink/16 pl-5 font-serif text-base italic leading-7 text-ink/50">
            The output should have the patience of an archive and the utility of an
            engineering ticket.
          </p>
          <dl className="mt-10 grid gap-0 border-t border-ink/12">
            {technicalPillars.map((pillar) => (
              <div key={pillar.label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-ink/10 py-3">
                <dt className="text-[9px] uppercase tracking-[0.2em] text-ink/42">{pillar.label}</dt>
                <dd className="text-xs leading-5 text-ink/62">{pillar.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-"
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-block border-b border-ink/20 pb-1 font-serif text-sm italic text-ink/58 transition-colors hover:border-ink/45 hover:text-ink"
          >
            View on GitHub
          </a>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: '-6% 0px -6% 0px' }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-ink/14 bg-canvas-dark/72 p-5 shadow-[0_10px_34px_color-mix(in_srgb,var(--color-ink)_2.5%,transparent)]"
        >
          <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-4 text-[9px] uppercase tracking-[0.22em] text-ink/44">
            <span>Run ledger</span>
            <span>atlas.audit</span>
          </div>
          <div className="mb-6 grid gap-0 border-b border-ink/10 pb-5 md:grid-cols-4">
            {technicalFlow.map((step) => (
              <div key={step.id} className="border-b border-ink/10 py-3 last:border-b-0 md:border-b-0 md:border-r md:px-4 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-ink/44">
                  <span>{step.id}</span>
                  <span className="h-1.5 w-1.5 rounded-full border border-ink/38" />
                </div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/72">{step.label}</h3>
                <p className="mt-2 text-[11px] leading-5 text-ink/50">{step.detail}</p>
              </div>
            ))}
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-6 text-ink/68">
            {terminalLines.map((line, index) => (
              <motion.code
                key={line}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.22, delay: prefersReducedMotion ? 0 : index * 0.018 }}
                className="block font-mono"
              >
                {line}
              </motion.code>
            ))}
          </pre>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: '-6% 0px -6% 0px' }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
          className="border-l border-ink/12 pl-6 md:pt-16"
        >
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/62">Review queue</h3>
          <table className="mt-5 w-full text-left text-xs text-ink/58">
            <thead className="border-b border-ink/14 text-[10px] uppercase tracking-[0.18em] text-ink/48">
              <tr>
                <th className="pb-3 font-medium">Issue</th>
                <th className="pb-3 font-medium">Evidence</th>
                <th className="pb-3 text-right font-medium">Impact</th>
              </tr>
            </thead>
            <tbody>
              {issueRows.map((row, index) => (
                <motion.tr
                  key={row.issue}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.28, delay: prefersReducedMotion ? 0 : index * 0.018 }}
                  className="border-b border-ink/10"
                >
                  <td className="py-3 pr-4">{row.issue}</td>
                  <td className="py-3 pr-4 text-ink/44">{row.evidence}</td>
                  <td className="py-3 text-right">{row.impact}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <p className="mt-8 border-t border-ink/10 pt-5 text-xs leading-6 text-ink/48">
            Every issue is anchored to source URLs, passages, and a repeatable run,
            so the audit can be inspected before it is acted on.
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22, margin: '-6% 0px -6% 0px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          className="border-y border-ink/12 py-6 md:col-span-3"
        >
          <div className="grid gap-5 md:grid-cols-[13rem_minmax(0,1fr)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/62">
              Fail-closed gates
            </p>
            <div className="grid gap-0 md:grid-cols-2 md:gap-x-10">
              {gateRows.map((row) => (
                <div key={row.gate} className="grid gap-2 border-b border-ink/10 py-4 md:grid-cols-[9rem_minmax(0,1fr)]">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-ink/48">{row.gate}</h3>
                  <p className="text-xs leading-6 text-ink/56">{row.behavior}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalAtlasSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <section id="atlas-final" className="relative min-h-[112svh] scroll-mt-28 overflow-hidden px-4 py-28 md:px-8 md:py-36 xl:px-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={ATLAS_ASSETS.atlasFigurePortrait}
          alt=""
          className="absolute bottom-[-12rem] right-[-12rem] h-[92svh] w-[58rem] object-contain object-bottom opacity-[0.12] md:bottom-[-9rem] md:right-[-2rem] md:h-[112svh] md:opacity-[0.17]"
          style={{ ...suppliedPlateStyle, ...widePlateMaskStyle }}
          loading="lazy"
          decoding="async"
        />
        <img
          src={ATLAS_ASSETS.armillarySphere}
          alt=""
          className="absolute -left-[21rem] top-24 hidden h-[52rem] w-[52rem] object-contain opacity-[0.1] md:block"
          style={suppliedPlateStyle}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 hidden md:block">
          {finalNodes.map((node, index) => (
            <motion.span
              key={`${node.x}-${node.y}`}
              className="absolute h-2 w-2 rounded-full border border-ink/42 bg-canvas shadow-[0_0_0_7px_color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
              style={{ left: node.x, top: node.y }}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.36, delay: prefersReducedMotion ? 0 : index * 0.025, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-14rem)] w-full max-w-[1480px] items-center gap-14 md:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1fr)] lg:px-10">
        <motion.div {...(prefersReducedMotion ? {} : gentleReveal)} className="max-w-[33rem]">
          <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.42em] text-ink/42">
            ATLAS ENGINE
          </p>
          <h2 className="font-serif text-[2.8rem] md:text-[3.75rem] xl:text-[4.75rem] font-light leading-[0.95] tracking-normal text-ink">
            A map for
            <br />
            actual repairs.
          </h2>
          <p className="mt-6 max-w-[24rem] text-sm leading-7 text-ink/58">
            The final package should read like an annotation, not a pitch: what was
            seen, what was missing, what to change first, and what still requires
            judgment.
          </p>
          <div className="mt-9 grid gap-3 text-[10px] uppercase tracking-[0.2em] text-ink/48">
            {finalActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noreferrer' : undefined}
                className="w-fit border-b border-ink/18 pb-1 transition-colors hover:border-ink/45 hover:text-ink/72"
              >
                {action.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3, margin: '-6% 0px -6% 0px' }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-y border-ink/12 py-7 md:ml-auto md:w-full md:max-w-[43rem]"
        >
          <div className="mb-5 grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] gap-6 text-[9px] uppercase tracking-[0.2em] text-ink/42">
            <span>Deliverable</span>
            <span>Contents</span>
          </div>
          {deliverableRows.map((row, index) => (
            <motion.div
              key={row.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.34 }}
              transition={{ duration: 0.42, delay: prefersReducedMotion ? 0 : index * 0.028, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4 border-t border-ink/10 py-5 text-xs leading-6 text-ink/58 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:gap-6"
            >
              <div>
                <span className="mr-4 text-[10px] uppercase tracking-[0.18em] text-ink/40">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-medium text-ink/76">{row.label}</span>
              </div>
              <p>{row.value}</p>
            </motion.div>
          ))}
          <div className="mt-6 grid gap-3 border-t border-ink/12 pt-6 md:grid-cols-3">
            {handoffNotes.map((note, index) => (
              <p key={note} className="border-t border-ink/10 pt-4 text-[11px] leading-6 text-ink/50">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-ink/38">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {note}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
