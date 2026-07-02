import { type ReactNode, useEffect } from 'react';
import { getMarketThesisBySlug } from '../content/marketTheses';
import { ScrollProgress } from '../components/ScrollProgress';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

const EDUCATIONAL_MARKETS_BOUNDARY = 'Educational research sample, not an investment recommendation.';

export default function MarketArticlePage({ slug }: { slug: string }) {
  const thesis = getMarketThesisBySlug(slug) ?? getMarketThesisBySlug('network-monopolies')!;
  const route = getSeoRoute(`/markets/${thesis.slug}`) ?? getSeoRoute('/markets')!;
  const metrics = thesis.metrics ?? [
    { label: 'Research confidence', value: thesis.conviction },
    { label: 'Horizon', value: thesis.horizon },
    { label: 'Sample portfolio weight', value: thesis.allocation },
  ];

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="site-page site-page-dark min-h-screen w-full bg-ink text-canvas selection:bg-canvas selection:text-ink font-sans relative antialiased overflow-x-hidden">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />

      {/* Corner Registration Marks for standalone page */}
      <div className="absolute left-4 top-4 h-4 w-4 border-l border-t border-canvas/30 pointer-events-none z-20" />
      <div className="absolute right-4 top-4 h-4 w-4 border-r border-t border-canvas/30 pointer-events-none z-20" />
      <div className="absolute left-4 bottom-4 h-4 w-4 border-l border-b border-canvas/30 pointer-events-none z-20" />
      <div className="absolute right-4 bottom-4 h-4 w-4 border-r border-b border-canvas/30 pointer-events-none z-20" />

      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />

      <article className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.32fr_0.68fr] xl:px-10 xl:py-24">
        <aside className="space-y-8 border-b border-canvas/12 pb-10 text-[10px] uppercase tracking-[0.22em] text-canvas/54 lg:border-b-0 lg:border-r lg:pr-8">
          <a href="/markets" className="inline-flex items-center gap-2 text-accent hover:text-canvas transition-colors">
            <span>←</span> <span>Back to Markets</span>
          </a>
          <dl className="grid gap-5 pt-4">
            <div>
              <dt className="mb-1 text-canvas/34">Memo</dt>
              <dd className="text-canvas">{thesis.number}</dd>
            </div>
            <div>
              <dt className="mb-1 text-canvas/34">Category</dt>
              <dd className="text-canvas">{thesis.category}</dd>
            </div>
            <div>
              <dt className="mb-1 text-canvas/34">Published</dt>
              <dd className="text-canvas">{thesis.date}</dd>
            </div>
            <div>
              <dt className="mb-1 text-canvas/34">Read Time</dt>
              <dd className="text-canvas">{thesis.readTime}</dd>
            </div>
          </dl>
        </aside>

        <div className="max-w-4xl select-text">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-accent">{thesis.category}</p>
          <h1 className="font-serif text-[3.25rem] md:text-[5.75rem] xl:text-[8rem] italic leading-[0.86] tracking-normal text-canvas">
            {thesis.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-canvas/24 pl-5 text-lg italic leading-relaxed text-canvas/68">
            {thesis.subtitle}
          </p>
          {thesis.claimBoundary ? (
            <p className="mt-5 max-w-3xl border border-risk/30 bg-risk/8 px-4 py-3 text-xs uppercase leading-6 tracking-[0.16em] text-canvas/62">
              {thesis.claimBoundary}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl border border-canvas/12 px-4 py-3 text-xs uppercase leading-6 tracking-[0.16em] text-canvas/54">
            {EDUCATIONAL_MARKETS_BOUNDARY}
          </p>

          <div className="my-12 grid gap-4 border-y border-canvas/10 py-6 text-[10px] uppercase tracking-[0.2em] text-canvas/54 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={`${metric.label}-${metric.value}`}>
                <span className="block text-canvas/32">{metric.label}</span>
                <span className={`mt-2 block ${index === 0 ? 'text-accent' : 'text-canvas/82'}`}>{metric.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8 text-base leading-relaxed text-canvas/72 font-sans">
            {thesis.content.map((paragraph, index) => {
              if (index === 0) {
                const firstChar = paragraph.charAt(0);
                const rest = paragraph.slice(1);
                return (
                  <p key={index}>
                    <span className="float-left text-[3.85rem] font-serif italic mr-2.5 mt-1 leading-[0.8] text-accent select-none">
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
          <div className="my-12 border border-canvas/12 bg-ink p-6 relative overflow-hidden group">
            {/* Terminal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,var(--color-canvas)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-canvas)_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            {/* Internal corner marks */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-canvas/20" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-canvas/20" />

            <div className="text-[8.5px] uppercase tracking-[0.24em] text-accent mb-4 text-center font-sans font-medium">
              {thesis.formulaLabel}
            </div>
            <div className="flex justify-center items-center py-8 border-y border-canvas/8 text-canvas text-base md:text-lg overflow-x-auto font-sans select-all bg-ink/30 shadow-inner">
              <span className="px-4 text-canvas filter drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-canvas)_15%,transparent)] font-semibold tracking-normal">{thesis.formula}</span>
            </div>
            <div className="mt-4 flex justify-between text-[7.5px] text-canvas/34 tracking-[0.18em] font-sans">
              <span>QUANT_ENGINE // MODEL_0{thesis.number}</span>
              <span>COLLATERAL_RATIO // SECULAR_GROWTH</span>
            </div>
          </div>

          <section className="border-t border-canvas/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-risk/80">Key Risk Vector</h2>
            <p className="text-sm leading-relaxed text-canvas/58">{thesis.risks}</p>
          </section>

          {thesis.sources?.length ? (
            <section className="mt-10 border-t border-canvas/12 pt-8">
              <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent/80">Research Sources</h2>
              <div className="grid gap-3">
                {thesis.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid gap-2 border border-canvas/12 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-canvas/60 transition-colors hover:border-accent/60 hover:text-canvas sm:grid-cols-[1fr_auto]"
                  >
                    <span>{source.label}</span>
                    <span className="text-accent/70">Source</span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10 pb-8 relative z-10">
        <InternalFooter activePath="/markets" tone="dark" />
      </div>
    </main>
  );
}
