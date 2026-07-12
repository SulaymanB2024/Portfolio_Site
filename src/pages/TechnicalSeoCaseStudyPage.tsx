import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { auditCaseStudySteps as auditWalkthroughSteps, contextualProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const METHOD_WALKTHROUGH_SEO = getSeoRoute('/case-studies/technical-seo-audit')!;

export default function TechnicalSeoMethodWalkthroughPage() {
  useSEO(METHOD_WALKTHROUGH_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-[#080807] font-sans text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/work" tone="dark" />

      <article className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <header className="grid min-h-[64vh] content-end border-b border-[#f1efe8]/12 pb-14">
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#f1efe8]/45">Method walkthrough / illustrative demo</p>
          <h1 className="max-w-6xl font-serif text-[clamp(3.7rem,9vw,10rem)] italic leading-[0.84] tracking-normal">
            Technical SEO audit method walkthrough.
          </h1>
          <p className="mt-10 max-w-3xl text-base leading-relaxed text-[#f1efe8]/62">
            An illustrative walkthrough of how crawl fields can become implementation work without exposing private client records or claiming a completed client result, search outcome, or performance lift.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-px overflow-hidden border-b border-[#f1efe8]/12 py-16 md:grid-cols-4">
          {auditWalkthroughSteps.map((step, index) => (
            <section key={step.title} className="min-h-[250px] bg-[#f1efe8]/[0.012] p-6">
              <p className="mb-8 text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/42">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-[#f1efe8]">{step.title}</h2>
              <p className="mt-5 text-sm leading-relaxed text-[#f1efe8]/58">{step.copy}</p>
            </section>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-12 border-b border-[#f1efe8]/12 py-16 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
              Evidence chain.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-[#f1efe8]/58">
              The useful audit path is observable field, interpreted risk, implementation action, and review artifact. Each step stays tied to the crawl table.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ['Observed field', 'Status code, crawl depth, inlinks, outlinks, canonical state, and indexability.'],
              ['Interpreted risk', 'Duplicate templates, weak hub copy, missing canonical targets, soft-404 risk, or crawl-depth waste.'],
              ['Implementation action', 'Repair canonicals, strengthen internal links, consolidate pages, update templates, and document ownership.'],
              ['Review artifact', 'Sanitized CSV, issue list, method page, source graph, and intake path for next review.'],
            ].map(([label, copy]) => (
              <div key={label} className="border border-[#f1efe8]/14 p-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/48">{label}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#f1efe8]/64">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="mb-8 text-[10px] uppercase tracking-[0.32em] text-[#f1efe8]/45">Contextual links</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {contextualProofLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="min-h-[180px] border border-[#f1efe8]/14 p-5 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]"
              >
                <h3 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-inherit">{link.label}</h3>
                <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.description}</p>
              </a>
            ))}
          </div>
        </section>
      </article>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/work" tone="dark" />
      </div>
    </main>
  );
}
