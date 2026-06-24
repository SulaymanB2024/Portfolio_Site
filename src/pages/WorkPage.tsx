import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { contextualProofLinks, workProofCards } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const WORK_SEO = getSeoRoute('/work')!;

export default function WorkPage() {
  useSEO(WORK_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-[#080807] font-sans text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/work" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[62vh] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#f1efe8]/45">Selected work</p>
        <h1 className="max-w-5xl font-serif text-[clamp(4rem,11vw,11rem)] italic leading-[0.82] tracking-normal">
          Work built from evidence.
        </h1>
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-[#f1efe8]/62">
          A compact index of public work surfaces: Atlas crawl evidence, technical SEO method, sanitized case-study logic, and finance/data artifacts with visible assumptions.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-px overflow-hidden border-y border-[#f1efe8]/14 px-4 py-16 md:grid-cols-2 md:px-8 xl:grid-cols-4 xl:px-10">
        {workProofCards.map((item, index) => (
          <article key={item.href} className="min-h-[330px] bg-[#f1efe8]/[0.012] p-6">
            <p className="mb-8 text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/42">
              {String(index + 1).padStart(2, '0')} / {item.eyebrow}
            </p>
            <h2 className="max-w-xs font-serif text-3xl italic leading-none tracking-normal text-[#f1efe8]">{item.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-[#f1efe8]/58">{item.copy}</p>
            <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.22em]">
              <a href={item.href} className="text-[#f1efe8]/72 underline decoration-[#f1efe8]/20 underline-offset-4 transition-colors hover:text-[#f1efe8]">
                Open project page
              </a>
              <a href={item.ctaHref} className="text-[#b7c8a8] underline decoration-[#b7c8a8]/30 underline-offset-4 transition-colors hover:text-[#f1efe8]">
                {item.cta}
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[clamp(3rem,5vw,6rem)] italic leading-[0.9] tracking-normal">
            Contextual proof paths.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-[#f1efe8]/58">
            These links are written as human-readable next steps, not source-map filler. They point from project copy to sample data, method, code, intake, and finance assumptions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {contextualProofLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="min-h-[190px] border border-[#f1efe8]/14 p-5 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]"
            >
              <h3 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-inherit">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/work" tone="dark" />
      </div>
    </main>
  );
}
