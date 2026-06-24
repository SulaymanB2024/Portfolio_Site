import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { austinSeoSignals } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const AUSTIN_SEO = getSeoRoute('/austin-technical-seo')!;

export default function AustinTechnicalSeoPage() {
  useSEO(AUSTIN_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-[#080807] font-sans text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/method" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] content-end px-4 pb-20 pt-16 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-[#f1efe8]/48">Austin technical SEO</p>
        <h1 className="max-w-6xl font-serif text-[clamp(3.8rem,9vw,10rem)] italic leading-[0.84] tracking-normal">
          Austin technical SEO and AI-search visibility.
        </h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-[#f1efe8]/62">
          A local service page for Austin teams that need crawlability, indexation, structured data, source clarity, and technical search evidence reviewed before broader content or growth work.
        </p>
        <div className="mt-10 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.24em]">
          <a href="/contact" className="border-b border-[#f1efe8]/20 pb-1 text-[#b7c8a8] transition-colors hover:border-[#f1efe8] hover:text-[#f1efe8]">
            Request an audit
          </a>
          <a href="/method" className="border-b border-[#f1efe8]/20 pb-1 transition-colors hover:border-[#f1efe8]">
            Read the technical SEO audit method
          </a>
          <a href="/atlas/sample-crawl" className="border-b border-[#f1efe8]/20 pb-1 transition-colors hover:border-[#f1efe8]">
            See an Atlas sample crawl run
          </a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
            What gets checked.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-[#f1efe8]/58">
            The local frame is useful only when it is backed by crawlable pages, real source signals, and implementation detail. This page does not claim local rankings, traffic movement, or AI citations.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#f1efe8]/14 md:grid-cols-2 xl:grid-cols-3">
          {austinSeoSignals.map((signal, index) => (
            <article key={signal} className="min-h-[150px] bg-[#f1efe8]/[0.012] p-5">
              <p className="mb-7 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/38">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="text-sm leading-relaxed text-[#f1efe8]/68">{signal}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10">
        <div className="grid gap-8 border border-[#f1efe8]/14 p-6 md:p-10 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
              Built for evidence, not vague local SEO.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#f1efe8]/58">
              The audit starts with public pages and technical signals. When analytics or Google Search Console access is available, those sources can support prioritization, but they are not invented into the public claim.
            </p>
          </div>
          <div className="grid content-center gap-4 text-[10px] uppercase tracking-[0.22em]">
            <a href="/void-agency" className="border border-[#f1efe8]/14 p-4 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]">
              View Void Agency proof
            </a>
            <a href="/case-studies/technical-seo-audit" className="border border-[#f1efe8]/14 p-4 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]">
              Read the technical SEO case study
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/method" tone="dark" />
      </div>
    </main>
  );
}
