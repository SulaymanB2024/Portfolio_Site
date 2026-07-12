import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { PUBLIC_MARKET_THESES } from '../content/marketTheses';
import { RESEARCH_ASSETS } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const MARKETS_SEO = getSeoRoute('/markets')!;
const COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';

export default function MarketsPage() {
  useSEO(MARKETS_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/research" tone="light" />

      <section className="relative min-h-[calc(100svh-88px)] overflow-hidden px-4 pb-14 pt-12 md:px-8 md:pt-16 xl:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 select-none">
          <img src={COIN_ART} alt="" className="markets-coin-art h-auto max-w-none" draggable={false} />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-210px)] w-full max-w-[1480px] flex-col justify-center lg:min-h-[560px] lg:pl-14">
          <p className="mb-10 text-[10px] uppercase tracking-[0.32em] text-ink/60">Research / Markets filter</p>
          <h1 className="max-w-[720px] font-serif text-[4.2rem] italic leading-[0.88] text-ink md:text-[6.5rem] xl:text-[8.5rem]">
            Markets and investing.
          </h1>
          <p className="mt-8 max-w-[520px] text-base leading-relaxed text-ink/68">
            Finance and infrastructure-investing research only: ownership, cash-flow rights, valuation frames, assumptions, downside cases, and explicit recommendation boundaries.
          </p>
          <div className="mt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
            <a href="#investment-research" className="border-b border-ink/30 pb-1 text-ink/70 hover:text-ink">Open research</a>
            <a href="/research" className="border-b border-ink/20 pb-1 text-ink/64 hover:text-ink">All categories</a>
          </div>
        </div>
      </section>

      <section id="investment-research" className="mx-auto w-full max-w-[1480px] border-y border-ink/14 px-4 py-16 md:px-8 md:py-24 xl:px-10">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink/60">Current research</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Source-led, not promotional.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ink/64">
            Every current item must distinguish public facts, analyst inference, missing information, and recommendation limits. Archived drafts remain noindexed and are not presented as current views.
          </p>
        </div>

        <div className="divide-y divide-ink/14 border-y border-ink/14">
          {PUBLIC_MARKET_THESES.map((memo, index) => (
            <a key={memo.slug} href={`/markets/${memo.slug}`} className="group grid gap-5 py-7 transition-colors hover:bg-ink/[0.025] md:grid-cols-[72px_minmax(0,1fr)_minmax(180px,0.24fr)] md:items-center md:px-4">
              <span className="font-serif text-xl italic text-ink/60">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.24em] text-ink">{memo.title}</span>
                <span className="mt-2 block max-w-3xl text-sm leading-relaxed text-ink/64">{memo.subtitle}</span>
                <span className="mt-3 block text-[10px] uppercase tracking-[0.18em] text-ink/60">{memo.category} / {memo.readTime} / {memo.sources.length} sources</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink/64 md:text-right">{memo.date}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1480px] px-4 py-16 md:px-8 md:py-24 xl:px-10">
        <div className="grid gap-10 border-y border-ink/14 py-10 lg:grid-cols-[0.46fr_0.54fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink/60">Supporting model</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Assumptions visible.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-sm leading-relaxed text-ink/64">
              The Appian memo and assumptions table remain educational samples. They are not current recommendations or price targets.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href={RESEARCH_ASSETS.appianMemoPdf} className="min-h-[132px] border border-ink/14 p-5 hover:bg-ink hover:text-canvas">
                <span className="text-[10px] uppercase tracking-[0.22em] text-current/64">PDF research sample</span>
                <span className="mt-8 block text-[11px] uppercase tracking-[0.22em]">Open memo</span>
              </a>
              <a href={RESEARCH_ASSETS.appianAssumptionsCsv} className="min-h-[132px] border border-ink/14 p-5 hover:bg-ink hover:text-canvas">
                <span className="text-[10px] uppercase tracking-[0.22em] text-current/64">CSV source table</span>
                <span className="mt-8 block text-[11px] uppercase tracking-[0.22em]">Open assumptions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/research" tone="light" />
      </div>
    </main>
  );
}
