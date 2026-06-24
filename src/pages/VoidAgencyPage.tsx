import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { voidAgencyProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const VOID_AGENCY_SEO = getSeoRoute('/void-agency')!;

export default function VoidAgencyPage() {
  useSEO(VOID_AGENCY_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-[#080807] font-sans text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/method" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[0.44fr_0.56fr] xl:px-10 xl:pt-20">
        <div className="self-end">
          <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-[#f1efe8]/48">Organization proof</p>
          <h1 className="font-serif text-[clamp(5rem,12vw,13rem)] italic leading-[0.72] tracking-normal">
            Void Agency.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-[#f1efe8]/62">
            Void Agency is the service branch connected to Sulayman Bowles work in technical SEO, AI-search visibility, crawlability, indexation diagnostics, structured content, analytics review, and evidence-backed web audits.
          </p>
        </div>

        <div className="self-center border border-[#f1efe8]/14 p-6 md:p-10">
          <h2 className="font-serif text-4xl italic leading-none tracking-normal">What this page proves.</h2>
          <div className="mt-8 grid gap-5">
            {[
              'The personal site distinguishes Void Agency as an organization/service branch, not a separate unrelated identity.',
              'The technical method lives on /method, while this page carries the organization proof and cross-links.',
              'The page points to the external agency domain, public sample crawl data, and intake route without inventing private client outcomes.',
            ].map((item) => (
              <p key={item} className="border-l border-[#f1efe8]/14 pl-4 text-sm leading-relaxed text-[#f1efe8]/60">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
            Source-backed links.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-[#f1efe8]/58">
            The organization page stays useful by pointing to inspectable public sources: the agency domain, method page, sample audit artifact, and direct intake.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#f1efe8]/14 md:grid-cols-2 xl:grid-cols-4">
          {voidAgencyProofLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="min-h-[230px] bg-[#f1efe8]/[0.012] p-5 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]"
            >
              <p className="mb-7 text-[10px] uppercase tracking-[0.24em] text-inherit opacity-45">{link.role}</p>
              <h3 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-inherit">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10">
        <div className="grid gap-8 border border-[#f1efe8]/14 p-6 md:p-10 lg:grid-cols-[0.55fr_0.45fr]">
          <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
            For process details, use the Method page.
          </h2>
          <div className="self-center">
            <p className="max-w-xl text-base leading-relaxed text-[#f1efe8]/58">
              /void-agency is the organization proof page. /method is the technical SEO audit process page. Keeping those roles separate gives users and crawlers cleaner intent.
            </p>
            <a href="/method" className="mt-8 inline-flex text-[10px] uppercase tracking-[0.24em] text-[#b7c8a8] underline decoration-[#b7c8a8]/30 underline-offset-4 transition-colors hover:text-[#f1efe8]">
              Read the technical SEO audit method
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
