import { type ReactNode, useEffect } from 'react';
import { getMarketThesisBySlug } from '../content/marketTheses';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

export default function MarketArticlePage({ slug }: { slug: string }) {
  const prefersReducedMotion = useReducedMotion();
  const thesis = getMarketThesisBySlug(slug) ?? getMarketThesisBySlug('network-monopolies')!;
  const route = getSeoRoute(`/markets/${thesis.slug}`) ?? getSeoRoute('/markets')!;

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased md:cursor-none">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />

      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />

      <article className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.32fr_0.68fr] xl:px-10 xl:py-24">
        <aside className="space-y-8 border-b border-[#f1efe8]/12 pb-10 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/54 lg:border-b-0 lg:border-r lg:pr-8">
          <a href="/markets" className="hover-target inline-flex text-[#b7c8a8]" data-cursor-text="BACK">
            Back to Markets
          </a>
          <dl className="grid gap-5">
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Memo</dt>
              <dd className="text-[#f1efe8]">{thesis.number}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Category</dt>
              <dd className="text-[#f1efe8]">{thesis.category}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Published</dt>
              <dd className="text-[#f1efe8]">{thesis.date}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Read Time</dt>
              <dd className="text-[#f1efe8]">{thesis.readTime}</dd>
            </div>
          </dl>
        </aside>

        <div className="max-w-4xl">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-[#b7c8a8]">{thesis.category}</p>
          <h1 className="font-serif text-[clamp(3.25rem,8vw,8.5rem)] italic leading-[0.86] tracking-[-0.045em] text-[#f1efe8]">
            {thesis.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-[#f1efe8]/24 pl-5 text-lg italic leading-relaxed text-[#f1efe8]/68">
            {thesis.subtitle}
          </p>

          <div className="my-12 grid gap-4 border-y border-[#f1efe8]/10 py-6 text-[10px] uppercase tracking-[0.2em] text-[#f1efe8]/54 md:grid-cols-3">
            <div>
              <span className="block text-[#f1efe8]/32">Conviction</span>
              <span className="mt-2 block text-[#b7c8a8]">{thesis.conviction}</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/32">Horizon</span>
              <span className="mt-2 block text-[#f1efe8]/82">{thesis.horizon}</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/32">Allocation</span>
              <span className="mt-2 block text-[#f1efe8]/82">{thesis.allocation}</span>
            </div>
          </div>

          <div className="space-y-8 text-base leading-relaxed text-[#f1efe8]/72">
            {thesis.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="my-12 border border-[#f1efe8]/12 bg-[#f1efe8]/[0.015] p-6 font-mono">
            <div className="mb-4 text-center text-[8px] uppercase tracking-[0.24em] text-[#f1efe8]/45">
              {thesis.formulaLabel}
            </div>
            <div className="overflow-x-auto border-y border-[#f1efe8]/8 py-6 text-center text-sm text-[#f1efe8] md:text-base">
              <span className="select-all">{thesis.formula}</span>
            </div>
          </div>

          <section className="border-t border-[#f1efe8]/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c2695e]/80">Key Risk Vector</h2>
            <p className="text-sm leading-relaxed text-[#f1efe8]/58">{thesis.risks}</p>
          </section>
        </div>
      </article>

      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10 pb-8 relative z-10">
        <InternalFooter activePath="/markets" tone="dark" />
      </div>
    </main>
  );
}
