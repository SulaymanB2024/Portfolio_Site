import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { voidAgencyProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const VOID_AGENCY_SEO = getSeoRoute('/void-agency')!;
const reviewInputs = [
  'Crawlable public URLs, sitemap coverage, robots directives, redirects, canonical tags, and indexability controls.',
  'Page templates, internal-link paths, structured data, source clarity, and visible service proof before any growth claim.',
  'Google Search Console, GA4, query groups, and conversion paths when the site owner can provide access.',
];

const serviceBoundaries = [
  'No private client names, traffic gains, rankings, revenue movement, or AI citations are implied from this page.',
  'The agency page explains the service branch; the method page carries the process; sample crawl data shows the evidence format.',
  'Recommendations should stay tied to affected URLs, source observations, implementation effort, and a decision the owner can act on.',
];

export default function VoidAgencyPage() {
  useSEO(VOID_AGENCY_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/void-agency" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[0.44fr_0.56fr] xl:px-10 xl:pt-20">
        <div className="self-end">
          <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-canvas/48">Service practice</p>
          <h1 className="font-serif text-[5rem] md:text-[8.5rem] xl:text-[12rem] italic leading-[0.72] tracking-normal">
            Void Agency.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-canvas/62">
            Void Agency is the service branch connected to my technical SEO work: crawlability, indexation diagnostics, structured content, analytics review, and practical web audits.
          </p>
        </div>

        <div className="self-center border border-canvas/14 p-6 md:p-10">
          <h2 className="font-serif text-4xl italic leading-none tracking-normal">What this page clarifies.</h2>
          <div className="mt-8 grid gap-5">
            {[
              'The personal site distinguishes Void Agency as an organization/service branch, not a separate unrelated identity.',
              'The technical method lives on /method, while this page explains how the agency connects to the rest of the work.',
              'The page points to the external agency domain, public sample crawl data, and intake route without inventing private client outcomes.',
            ].map((item) => (
              <p key={item} className="border-l border-canvas/14 pl-4 text-sm leading-relaxed text-canvas/60">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
            What gets reviewed before claims.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            Void Agency work should start with inspectable site evidence, then move into priorities. The page stays separate from unsupported outcome claims so the service description remains reviewable.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 lg:grid-cols-2">
          <div className="bg-canvas/[0.012] p-6">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Audit inputs</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {reviewInputs.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-canvas/[0.012] p-6">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Public limits</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {serviceBoundaries.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
            Supporting links.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            The organization page stays useful by pointing to the agency domain, method page, sample audit run, and direct intake.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {voidAgencyProofLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="min-h-[230px] bg-canvas/[0.012] p-5 transition-colors hover:bg-canvas hover:text-ink"
            >
              <p className="mb-7 text-[10px] uppercase tracking-[0.24em] text-inherit opacity-45">{link.role}</p>
              <h3 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-inherit">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10">
        <div className="grid gap-8 border border-canvas/14 p-6 md:p-10 lg:grid-cols-[0.55fr_0.45fr]">
          <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
            For process details, use the Method page.
          </h2>
          <div className="self-center">
            <p className="max-w-xl text-base leading-relaxed text-canvas/58">
              /void-agency explains the service practice. /method explains the technical SEO audit process. Keeping those roles separate makes the site easier to navigate.
            </p>
            <a href="/method" className="mt-8 inline-flex text-[10px] uppercase tracking-[0.24em] text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-canvas">
              Read the technical SEO audit method
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/void-agency" tone="dark" />
      </div>
    </main>
  );
}
