import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { WireframeGrid } from '../components/WireframeGrid';
import { voidAgencyProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const VOID_AGENCY_SEO = getSeoRoute('/void-agency')!;

const facts = [
  ['Role', 'Service and operating branch'],
  ['Founder', 'Sulayman Bowles'],
  ['Focus', 'Technical SEO, crawl evidence, web systems, and analytics'],
  ['Proof claim', '$50K+ collected revenue as of May 31, 2026'],
  ['Method', '/method'],
  ['Intake', '/contact'],
];

export default function VoidAgencyPage() {
  useSEO(VOID_AGENCY_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <InternalHeader activePath="/void-agency" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[68vh] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">Canonical organization record</p>
        <h1 className="font-serif text-[5rem] italic leading-[0.78] tracking-normal md:text-[9rem] xl:text-[13rem]">Void Agency.</h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-canvas/70">
          Void Agency is the service and operating branch of my technical SEO work. This page establishes the organization and routes readers to the detailed Method, public Atlas evidence, external agency domain, and contact path.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-px border-y border-canvas/14 bg-canvas/14 px-4 py-16 md:px-8 lg:grid-cols-[0.42fr_0.58fr] xl:px-10">
        <div className="bg-ink p-6 md:p-8">
          <h2 className="font-serif text-4xl italic leading-none md:text-5xl">What belongs here.</h2>
          <p className="mt-6 text-base leading-relaxed text-canvas/70">
            The organization name, founder relationship, current offer boundary, dated public proof claim, and links to the pages that carry process and evidence.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-canvas/64">
            Private client identities, credentials, traffic or ranking changes, and unreleased deliverables do not belong on this record.
          </p>
        </div>
        <dl className="grid gap-px bg-canvas/14 sm:grid-cols-2">
          {facts.map(([label, value]) => (
            <div key={label} className="min-h-[150px] bg-ink p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-canvas/60">{label}</dt>
              <dd className="mt-7 text-sm leading-relaxed text-canvas/76">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <h2 className="font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Follow the evidence path.</h2>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            The Method page explains scope and delivery; Atlas and its sample crawl show the evidence format; Contact is the only intake path.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {voidAgencyProofLinks.map((link) => (
            <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="min-h-[240px] bg-ink p-5 transition-colors hover:bg-canvas hover:text-ink">
              <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">{link.role}</p>
              <h3 className="mt-8 text-xs uppercase leading-relaxed tracking-[0.22em] text-current">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-current/70">{link.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/void-agency" tone="dark" />
      </div>
    </main>
  );
}
