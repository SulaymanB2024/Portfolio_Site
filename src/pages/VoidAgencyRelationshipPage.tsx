import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const VOID_RELATIONSHIP_SEO = getSeoRoute('/void-agency')!;

const contributions = [
  {
    title: 'Founder and operator',
    copy: 'I set the practice scope, shape engagements, review findings, and own the handoff from public crawl evidence to implementation work.',
    evidence: 'Role and operating record',
  },
  {
    title: 'Technical SEO systems',
    copy: 'I connect crawlability, indexation, rendering, internal links, structured data, analytics, and acceptance checks into bounded audit and repair workflows.',
    evidence: 'Method and Atlas artifacts',
  },
  {
    title: 'Search-ready web delivery',
    copy: 'I build service architecture, proof sections, conversion paths, event measurement, and post-release validation for the agency’s public web systems.',
    evidence: 'Public site and representative examples',
  },
];

const boundaries = [
  'Commercial, local-service, agency, and lead-generation intent belongs on void-agency.com.',
  'The public examples are labeled representative whenever client results are unavailable.',
  'Release, crawlability, indexability, impressions, rankings, clicks, and qualified leads remain separate claims.',
  'No ranking, traffic, revenue, or AI-citation outcome is implied without matching provider evidence.',
];

const proofLinks = [
  {
    label: 'Void Agency commercial site',
    href: 'https://www.void-agency.com/',
    copy: 'Services, Austin and industry positioning, representative examples, and consultation path.',
  },
  {
    label: 'Technical SEO audit example',
    href: 'https://www.void-agency.com/examples/technical-seo-audit',
    copy: 'Representative scope, sanitized output, and explicit evidence limits.',
  },
  {
    label: 'Search-ready website example',
    href: 'https://www.void-agency.com/examples/search-ready-website',
    copy: 'Representative architecture, proof, contact, and measurement deliverables.',
  },
  {
    label: 'AI lead-intake workflow example',
    href: 'https://www.void-agency.com/examples/ai-lead-intake-workflow',
    copy: 'Representative source capture, classification, review, and CRM handoff.',
  },
  {
    label: 'Sulayman’s audit method',
    href: '/method',
    copy: 'Personal methodology for moving from crawl evidence to owners and rerun checks.',
  },
  {
    label: 'Atlas open-corpus demonstration',
    href: '/atlas/sample-crawl',
    copy: 'Dated, bounded public crawl evidence with downloadable artifacts.',
  },
];

export default function VoidAgencyRelationshipPage() {
  useSEO(VOID_RELATIONSHIP_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/void-agency" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">
          Sulayman Bowles / founder relationship / Void Agency
        </p>
        <h1 className="max-w-6xl font-serif text-[4rem] italic leading-[0.82] tracking-normal md:text-[7.5rem] xl:text-[9.5rem]">
          How Sulayman Bowles Builds and Runs Void Agency
        </h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-canvas/70">
          Void Agency is the commercial branch of my technical SEO and web-systems work. I founded the practice, define the operating method, build and review its public systems, and keep every outcome claim tied to inspectable evidence.
        </p>
        <div className="mt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
          <a href="https://www.void-agency.com/" className="border-b border-accent/45 pb-1 text-accent hover:border-canvas hover:text-canvas">Open Void Agency</a>
          <a href="/method" className="border-b border-canvas/28 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Read my audit method</a>
          <a href="/resume" className="border-b border-canvas/28 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Verify role history</a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Role and contribution</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">What I own.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            This page documents the relationship between a person and a company. It does not compete with Void’s service pages for commercial demand.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 lg:grid-cols-3">
          {contributions.map((item, index) => (
            <article key={item.title} className="grid min-h-[330px] content-between bg-ink p-6 md:p-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-10 font-serif text-4xl italic leading-none">{item.title}</h3>
                <p className="mt-6 text-sm leading-relaxed text-canvas/70">{item.copy}</p>
              </div>
              <p className="mt-8 border-t border-canvas/14 pt-4 text-[10px] uppercase tracking-[0.18em] text-canvas/58">
                Evidence / {item.evidence}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-10 px-4 py-16 md:px-8 lg:grid-cols-[0.4fr_0.6fr] xl:px-10 xl:py-24">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Verified operating record</p>
          <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[4.5rem]">Evidence before promotion.</h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-canvas/68">
            The public résumé records more than $50,000 in collected Void Agency revenue as of May 31, 2026. That verifies an operating practice; it does not establish a client ranking or traffic outcome.
          </p>
          <a href="/resume" className="mt-8 inline-flex min-h-11 items-center border-b border-canvas/28 text-[10px] uppercase tracking-[0.22em] text-canvas/72 hover:border-canvas hover:text-canvas">
            Review the supporting résumé
          </a>
        </div>
        <div className="grid gap-4">
          {boundaries.map((item, index) => (
            <article key={item} className="grid grid-cols-[auto_1fr] gap-5 border border-canvas/14 p-5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm leading-relaxed text-canvas/70">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Public proof</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Inspect the work.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            The strongest claims below lead to the canonical service, example, method, or crawl-evidence page that supports them.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-3">
          {proofLinks.map((item) => (
            <a key={item.href} href={item.href} className="min-h-[245px] bg-ink p-6 transition-colors hover:bg-canvas hover:text-ink">
              <h3 className="font-serif text-3xl italic leading-none">{item.label}</h3>
              <p className="mt-6 text-sm leading-relaxed text-current/70">{item.copy}</p>
              <span className="mt-10 block text-[10px] uppercase tracking-[0.22em] text-current/58">Open evidence ↗</span>
            </a>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 pt-12 md:px-8 xl:px-10">
        <InternalFooter activePath="/void-agency" tone="dark" />
      </div>
    </main>
  );
}
