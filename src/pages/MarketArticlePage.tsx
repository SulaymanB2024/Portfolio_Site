import { useEffect } from 'react';
import { PUBLIC_MARKET_THESES, getMarketThesisBySlug } from '../content/marketTheses';
import { ScrollProgress } from '../components/ScrollProgress';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

export default function MarketArticlePage({ slug }: { slug: string }) {
  const thesis = getMarketThesisBySlug(slug) ?? PUBLIC_MARKET_THESES[0];
  const route = getSeoRoute(`/markets/${thesis.slug}`) ?? getSeoRoute('/markets')!;
  const isArchived = thesis.indexable === false;
  const isFinanceResearch = thesis.researchType === 'finance';
  const metrics = thesis.metrics ?? [
    { label: 'Conviction', value: thesis.conviction },
    { label: 'Horizon', value: thesis.horizon },
    { label: 'Allocation', value: thesis.allocation },
  ];

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="site-page site-page-dark min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased overflow-x-hidden">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />

      {/* Corner Registration Marks for standalone page */}
      <div className="absolute left-4 top-4 h-4 w-4 border-l border-t border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute right-4 top-4 h-4 w-4 border-r border-t border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute left-4 bottom-4 h-4 w-4 border-l border-b border-[#f1efe8]/30 pointer-events-none z-20" />
      <div className="absolute right-4 bottom-4 h-4 w-4 border-r border-b border-[#f1efe8]/30 pointer-events-none z-20" />

      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />

      <article className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.32fr_0.68fr] xl:px-10 xl:py-24">
        <aside className="space-y-8 border-b border-[#f1efe8]/12 pb-10 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/54 lg:border-b-0 lg:border-r lg:pr-8">
          <a href="/markets" className="inline-flex items-center gap-2 text-[#b7c8a8] hover:text-[#f1efe8] transition-colors">
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
          </dl>
        </aside>

        <div className="max-w-4xl select-text">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-[#b7c8a8]">{thesis.category}</p>
          <h1 className="font-serif text-[clamp(3.25rem,8vw,8.5rem)] italic leading-[0.86] tracking-normal text-[#f1efe8]">
            {thesis.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-[#f1efe8]/24 pl-5 text-lg italic leading-relaxed text-[#f1efe8]/68">
            {thesis.subtitle}
          </p>

          {isArchived ? (
            <div className="mt-8 border border-[#c2695e]/35 bg-[#c2695e]/8 p-5 text-sm leading-relaxed text-[#f1efe8]/68">
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-[#c2695e]/90">Archived</p>
              <p>{thesis.claimBoundary}</p>
            </div>
          ) : null}

          <div className="my-12 grid gap-4 border-y border-[#f1efe8]/10 py-6 text-[10px] uppercase tracking-[0.2em] text-[#f1efe8]/54 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={`${metric.label}-${metric.value}`}>
                <span className="block text-[#f1efe8]/32">{metric.label}</span>
                <span className={`mt-2 block ${index === 0 ? 'text-[#b7c8a8]' : 'text-[#f1efe8]/82'}`}>{metric.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8 text-base leading-relaxed text-[#f1efe8]/72 font-sans">
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

          {/* Research framework */}
          <div className="my-12 border border-[#f1efe8]/12 bg-[#0c0c0b] p-6 relative overflow-hidden group">
            {/* Terminal Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#f1efe8_1px,transparent_1px),linear-gradient(to_bottom,#f1efe8_1px,transparent_1px)] bg-[size:10px_10px]" />
            
            {/* Internal corner marks */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/20" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/20" />

            <div className="text-[8.5px] uppercase tracking-[0.24em] text-[#b7c8a8] mb-4 text-center font-sans font-medium">
              {thesis.formulaLabel}
            </div>
            <div className="flex justify-center items-center py-8 border-y border-[#f1efe8]/8 text-[#f1efe8] text-base md:text-lg overflow-x-auto font-sans select-all bg-[#080807]/30 shadow-inner">
              <span className="px-4 text-[#f1efe8] filter drop-shadow-[0_0_8px_rgba(241,239,232,0.15)] font-semibold tracking-normal">{thesis.formula}</span>
            </div>
            <div className="mt-4 flex justify-between text-[7.5px] text-[#f1efe8]/34 tracking-[0.18em] font-sans">
              <span>{isFinanceResearch ? `RESEARCH MEMO // ${thesis.number}` : `METHOD NOTE // ${thesis.number}`}</span>
              <span>{isFinanceResearch ? 'EDUCATIONAL // NOT INVESTMENT ADVICE' : 'SOURCES // CLAIM BOUNDARY'}</span>
            </div>
          </div>

          <section className="border-t border-[#f1efe8]/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c2695e]/80">
              {isFinanceResearch ? 'Risk and education boundary' : 'Claim boundary'}
            </h2>
            <p className="text-sm leading-relaxed text-[#f1efe8]/58">{thesis.claimBoundary}</p>
          </section>

          {thesis.sources?.length ? (
            <section className="mt-10 border-t border-[#f1efe8]/12 pt-8">
              <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#b7c8a8]/80">Research Sources</h2>
              <div className="grid gap-3">
                {thesis.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid gap-2 border border-[#f1efe8]/12 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/60 transition-colors hover:border-[#b7c8a8]/60 hover:text-[#f1efe8] sm:grid-cols-[1fr_auto]"
                  >
                    <span>{source.label}</span>
                    <span className="text-[#b7c8a8]/70">Source</span>
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
