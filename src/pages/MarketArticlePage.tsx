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
    <main id="top" className="min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased md:cursor-none overflow-x-hidden">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />

      {/* Corner Registration Marks for standalone page */}
      <div className="absolute left-4 top-4 h-4 w-4 border-l border-t border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute right-4 top-4 h-4 w-4 border-r border-t border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute left-4 bottom-4 h-4 w-4 border-l border-b border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute right-4 bottom-4 h-4 w-4 border-r border-b border-[#f1efe8]/30 pointer-events-none z-20" />

      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />

      <article className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-8 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-[0.32fr_0.68fr] lg:gap-12 xl:px-10 xl:py-24">
        <aside className="space-y-6 border-b border-[#f1efe8]/12 pb-7 text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/54 md:tracking-[0.22em] lg:sticky lg:top-28 lg:self-start lg:border-b-0 lg:border-r lg:pb-10 lg:pr-8">
          <a href="/markets" className="hover-target inline-flex items-center gap-2 text-[#b7c8a8] hover:text-[#f1efe8] transition-colors" data-cursor-text="BACK">
            <span>←</span> <span>Back to Markets</span>
          </a>
          <dl className="grid gap-5 pt-4">
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
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Status</dt>
              <dd className="text-[#f1efe8]">Research memo / completed draft</dd>
            </div>
          </dl>
          <nav className="border-t border-[#f1efe8]/12 pt-5" aria-label="Article index">
            <div className="mb-4 text-[#b7c8a8]">Mini Index</div>
            <div className="grid gap-3">
              {[
                ['Thesis', '#thesis'],
                ['Assumptions', '#assumptions'],
                ['Model question', '#model-question'],
                ['Risk', '#risk'],
                ['Status', '#status'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="hover-target transition-colors hover:text-[#f1efe8]" data-cursor-text="JUMP">
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="max-w-4xl select-text">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-[#b7c8a8]">{thesis.category}</p>
          <h1 className="font-serif text-[3rem] italic leading-[0.9] tracking-normal text-[#f1efe8] md:text-[clamp(3.25rem,8vw,8.5rem)] md:leading-[0.86] md:tracking-[-0.045em]">
            {thesis.title}
          </h1>
          <p className="mt-6 max-w-3xl border-l border-[#f1efe8]/24 pl-5 text-base italic leading-relaxed text-[#f1efe8]/68 md:mt-8 md:text-lg">
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

          <div id="thesis" className="space-y-8 scroll-mt-32 text-base leading-relaxed text-[#f1efe8]/72 font-sans">
            {thesis.content.map((paragraph, index) => {
              if (index === 0) {
                const firstChar = paragraph.charAt(0);
                const rest = paragraph.slice(1);
                return (
                  <p key={index}>
                    <span className="float-left text-[3.85rem] font-serif italic mr-2.5 mt-1 leading-[0.8] text-[#b7c8a8] select-none">
                      {firstChar}
                    </span>
                    {rest}
                  </p>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Monetarist / Quantitative Formula Box */}
          <section id="assumptions" className="my-12 scroll-mt-32 border-y border-[#f1efe8]/10 py-6">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#b7c8a8]">Assumptions</h2>
            <div className="grid gap-4 text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/54 md:grid-cols-3">
              <div>
                <span className="block text-[#f1efe8]/32">Horizon</span>
                <span className="mt-2 block text-[#f1efe8]/82">{thesis.horizon}</span>
              </div>
              <div>
                <span className="block text-[#f1efe8]/32">Allocation frame</span>
                <span className="mt-2 block text-[#f1efe8]/82">{thesis.allocation}</span>
              </div>
              <div>
                <span className="block text-[#f1efe8]/32">Source basis</span>
                <span className="mt-2 block text-[#f1efe8]/82">Market reasoning, model assumptions, and public research notes</span>
              </div>
            </div>
          </section>

          <div id="model-question" className="my-12 scroll-mt-32 border border-[#f1efe8]/12 bg-[#0c0c0b] p-6 relative overflow-hidden group">
            {/* Terminal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#f1efe8_1px,transparent_1px),linear-gradient(to_bottom,#f1efe8_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            {/* Internal corner marks */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/20" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/20" />

            <div className="text-[8.5px] uppercase tracking-[0.24em] text-[#b7c8a8] mb-4 text-center font-mono font-medium">
              {thesis.formulaLabel}
            </div>
            <div className="flex justify-center items-center py-8 border-y border-[#f1efe8]/8 text-[#f1efe8] text-base md:text-lg overflow-x-auto font-mono select-all bg-[#080807]/30 shadow-inner">
              <span className="px-4 text-[#f1efe8] filter drop-shadow-[0_0_8px_rgba(241,239,232,0.15)] font-semibold tracking-tight">{thesis.formula}</span>
            </div>
            <div className="mt-4 flex justify-between text-[7.5px] text-[#f1efe8]/34 tracking-[0.18em] font-mono">
              <span>QUANT_ENGINE // MODEL_0{thesis.number}</span>
              <span>COLLATERAL_RATIO // SECULAR_GROWTH</span>
            </div>
          </div>

          <section id="risk" className="scroll-mt-32 border-t border-[#f1efe8]/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c2695e]/80">Key Risk Vector</h2>
            <p className="text-sm leading-relaxed text-[#f1efe8]/58">{thesis.risks}</p>
          </section>

          <section id="status" className="mt-10 scroll-mt-32 border-t border-[#f1efe8]/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#b7c8a8]">Status</h2>
            <p className="text-sm leading-relaxed text-[#f1efe8]/58">
              Completed public research note. The formula and allocation figures are model assumptions for review, not investment advice.
            </p>
          </section>
        </div>
      </article>

      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10 pb-8 relative z-10">
        <InternalFooter activePath="/markets" tone="dark" />
      </div>
    </main>
  );
}
