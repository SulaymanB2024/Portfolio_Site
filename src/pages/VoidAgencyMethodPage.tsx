import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { auditExampleFindingChain } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const METHOD_SEO = getSeoRoute('/method')!;

const stages = [
  {
    number: '01',
    title: 'Crawl',
    copy: 'Map public URLs, status codes, redirects, canonicals, directives, sitemaps, raw and rendered HTML, internal links, structured data, and template patterns.',
    output: 'Crawl inventory + evidence notes',
  },
  {
    number: '02',
    title: 'Diagnose',
    copy: 'Separate observed fields from interpreted risk. Group findings by template, business role, confidence, affected URLs, and decision impact.',
    output: 'Prioritized finding register',
  },
  {
    number: '03',
    title: 'Repair',
    copy: 'Turn findings into implementation work with an owner, affected surface, recommended change, constraints, and a concrete acceptance check.',
    output: 'Implementation plan or direct fixes',
  },
  {
    number: '04',
    title: 'Measure',
    copy: 'Rerun the crawl and compare expected field changes. Add Search Console, GA4, or conversion review only when access and an appropriate baseline exist.',
    output: 'Rerun notes + measurement gaps',
  },
];

const deliverables = [
  'Executive summary tied to observed scope',
  'URL- and template-level finding register',
  'Prioritized implementation queue with owners',
  'Crawl/source exports where public or approved',
  'Acceptance checks for each recommended repair',
  'Rerun or handoff notes for the next operator',
];

const inputs = [
  'Public site and the business questions the audit must support',
  'CMS, staging, or repository access only when implementation is in scope',
  'Search Console and analytics access only when measurement is in scope',
  'Known migrations, redesigns, incidents, or launch dates that change interpretation',
];

const exclusions = [
  'No guaranteed rankings, traffic, revenue, AI citations, or answer placement',
  'No credentials or sensitive client data through the public form',
  'No challenge page, failed fetch, or missing provider result treated as a healthy or unhealthy page',
  'No recommendation published as complete until its rerun or handoff check is clear',
];

const timeline = [
  ['Focused review', '3–5 business days', 'One bounded surface or decision.'],
  ['Full technical audit', '1–3 weeks', 'Crawl, diagnosis, prioritized plan, and review.'],
  ['Implementation support', 'Scoped after audit', 'Direct fixes or operator handoff with rerun checks.'],
];

export default function VoidAgencyMethodPage() {
  useSEO(METHOD_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/method" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">Sulayman Bowles / technical SEO audit methodology</p>
        <h1 className="max-w-6xl font-serif text-[4rem] italic leading-[0.82] tracking-normal md:text-[7.5rem] xl:text-[10rem]">
          How Sulayman Bowles Runs Evidence-Led Technical SEO Audits
        </h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-canvas/70">
          I begin with crawlable evidence, keep observations separate from interpretation, and turn the result into a small set of defensible findings, owners, and rerun checks. Commercial audit work is delivered through Void Agency.
        </p>
        <div className="mt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
          <a href="https://www.void-agency.com/services/technical-seo-ai-search-visibility" className="border-b border-accent/45 pb-1 text-accent hover:border-canvas hover:text-canvas">Work with Void Agency</a>
          <a href="/atlas/sample-crawl" className="border-b border-canvas/28 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Open-corpus demonstration</a>
          <a href="#worked-finding" className="border-b border-canvas/28 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Worked finding</a>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-px border-y border-canvas/14 bg-canvas/14 px-4 py-16 md:px-8 lg:grid-cols-2 xl:px-10">
        <article className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Good fit</p>
          <h2 className="mt-6 font-serif text-4xl italic leading-none md:text-5xl">When the site is real, but the diagnosis is fuzzy.</h2>
          <ul className="mt-8 grid gap-4 text-sm leading-relaxed text-canvas/70">
            {[
              'A migration, redesign, or launch changed crawl paths or indexation.',
              'Templates, canonicals, redirects, internal links, or structured data need review.',
              'A team has many audit findings but no prioritized implementation path.',
              'Analytics and Search Console exist, but the site evidence and decision boundary are not connected.',
            ].map((item) => <li key={item} className="border-l border-canvas/18 pl-4">{item}</li>)}
          </ul>
        </article>
        <article className="bg-ink p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/60">Not a fit</p>
          <h2 className="mt-6 font-serif text-4xl italic leading-none md:text-5xl">When the request is a promise, not an audit.</h2>
          <ul className="mt-8 grid gap-4 text-sm leading-relaxed text-canvas/70">
            {[
              'Guaranteed ranking, traffic, revenue, or AI-answer placement.',
              'Bulk content production without a clear user or product problem.',
              'A hidden security review, credential transfer, or private-data request through public intake.',
              'A broad retainer before the site, question, access, and acceptance criteria are defined.',
            ].map((item) => <li key={item} className="border-l border-canvas/18 pl-4">{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Four stages</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Evidence to acceptance check.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            Each phase produces an artifact the next person can inspect. Interpretation is never allowed to erase the source state.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => (
            <article key={stage.number} className="grid min-h-[330px] content-between bg-ink p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent">{stage.number}</p>
                <h3 className="mt-10 font-serif text-4xl italic leading-none">{stage.title}</h3>
                <p className="mt-6 text-sm leading-relaxed text-canvas/70">{stage.copy}</p>
              </div>
              <p className="mt-8 border-t border-canvas/14 pt-4 text-[10px] uppercase tracking-[0.18em] text-canvas/62">Output / {stage.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-10 border-y border-canvas/14 px-4 py-16 md:px-8 lg:grid-cols-3 xl:px-10 xl:py-24">
        <div>
          <h2 className="font-serif text-4xl italic leading-none">Deliverables</h2>
          <ul className="mt-8 grid gap-4 text-sm leading-relaxed text-canvas/70">
            {deliverables.map((item) => <li key={item} className="border-l border-canvas/18 pl-4">{item}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-4xl italic leading-none">Inputs and access</h2>
          <ul className="mt-8 grid gap-4 text-sm leading-relaxed text-canvas/70">
            {inputs.map((item) => <li key={item} className="border-l border-canvas/18 pl-4">{item}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-4xl italic leading-none">Exclusions</h2>
          <ul className="mt-8 grid gap-4 text-sm leading-relaxed text-canvas/70">
            {exclusions.map((item) => <li key={item} className="border-l border-risk/40 pl-4">{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Typical timing</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Bounded before work starts.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            Timing depends on site size, access, and implementation scope. The agreed brief names the surface, evidence sources, output, and acceptance check.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-3">
          {timeline.map(([engagement, duration, scope]) => (
            <article key={engagement} className="bg-ink p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent">{duration}</p>
              <h3 className="mt-7 font-serif text-3xl italic leading-none">{engagement}</h3>
              <p className="mt-5 text-sm leading-relaxed text-canvas/70">{scope}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="worked-finding" className="relative z-10 mx-auto max-w-[1480px] scroll-mt-24 border-t border-canvas/14 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Worked finding</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">One chain, four states.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            The public example uses sanitized data. It demonstrates reasoning and a rerun path, not a private outcome.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {auditExampleFindingChain.map((item, index) => (
            <article key={item.label} className="min-h-[270px] bg-ink p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-8 text-xs uppercase tracking-[0.2em] text-canvas">{item.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-canvas/70">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-14 md:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.56fr_0.44fr] lg:items-center">
          <h2 className="font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Use the method; take commercial work to Void.</h2>
          <div>
            <p className="text-base leading-relaxed text-canvas/70">
              This page documents my personal process. Void Agency owns the agency, local-service, and lead-generation intent; its commercial page explains scope and the consultation path.
            </p>
            <a href="https://www.void-agency.com/services/technical-seo-ai-search-visibility" className="mt-8 inline-flex min-h-11 items-center border-b border-accent/45 text-[10px] uppercase tracking-[0.22em] text-accent hover:border-canvas hover:text-canvas">Review Void’s technical SEO service</a>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 pt-10 md:px-8 xl:px-10">
        <InternalFooter activePath="/method" tone="dark" />
      </div>
    </main>
  );
}
