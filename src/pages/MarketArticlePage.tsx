import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { getArticleBySlug } from '../content/articleRegistry';
import { isInvestmentMemo } from '../content/articleModels';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

export default function MarketArticlePage({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug) ?? RESEARCH_ARTICLES[0];
  const investmentMemo = isInvestmentMemo(article);
  const route = getSeoRoute(`/markets/${article.slug}`) ?? getSeoRoute('/research')!;
  const backHref = investmentMemo ? '/markets' : '/research';
  const backLabel = investmentMemo ? 'Back to Markets' : 'Back to Research';
  const boundary = investmentMemo ? article.recommendationBoundary : article.evidenceBoundary;
  const metrics = article.metrics ?? [
    { label: 'Category', value: article.category },
    { label: 'Updated', value: article.dateModified ?? article.date },
    { label: 'Sources', value: String(article.sources.length) },
  ];

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath={investmentMemo ? '/markets' : '/research'} tone="dark" />

      <article className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.28fr_0.72fr] xl:px-10 xl:py-24">
        <aside className="space-y-8 border-b border-canvas/14 pb-10 text-[10px] uppercase tracking-[0.22em] text-canvas/60 lg:border-b-0 lg:border-r lg:pr-8">
          <a href={backHref} className="inline-flex min-h-11 items-center gap-2 text-accent transition-colors hover:text-canvas">
            <span aria-hidden="true">←</span>
            <span>{backLabel}</span>
          </a>
          <dl className="grid gap-5 pt-4">
            {[
              ['Article', article.number],
              ['Category', article.category],
              ['Author', article.author],
              ['Published', article.date],
              ['Updated', article.dateModified ?? article.date],
              ['Read time', article.readTime],
              ['Sources', String(article.sources.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mb-1 text-canvas/60">{label}</dt>
                <dd className="text-canvas">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="max-w-4xl select-text">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-accent">{article.category}</p>
          <h1 className="font-serif text-[3.25rem] italic leading-[0.86] tracking-normal text-canvas md:text-[5.75rem] xl:text-[8rem]">
            {article.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-canvas/24 pl-5 text-lg italic leading-relaxed text-canvas/72">
            {article.subtitle}
          </p>

          {boundary ? (
            <p className={`mt-6 max-w-3xl border px-4 py-3 text-xs uppercase leading-6 tracking-[0.16em] text-canvas/72 ${investmentMemo ? 'border-risk/35 bg-risk/8' : 'border-canvas/18 bg-canvas/[0.025]'}`}>
              {boundary}
            </p>
          ) : null}

          {article.thesis ? (
            <section className="mt-8 border border-canvas/16 bg-canvas/[0.025] p-5">
              <h2 className="text-[10px] uppercase tracking-[0.26em] text-accent">Thesis</h2>
              <p className="mt-4 text-base leading-relaxed text-canvas/76">{article.thesis}</p>
            </section>
          ) : null}

          <div className="my-12 grid gap-4 border-y border-canvas/12 py-6 text-[10px] uppercase tracking-[0.2em] text-canvas/60 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <div key={`${metric.label}-${metric.value}`}>
                <span className="block text-canvas/60">{metric.label}</span>
                <span className={`mt-2 block ${index === 0 ? 'text-accent' : 'text-canvas/84'}`}>{metric.value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8 text-base leading-relaxed text-canvas/76">
            {article.content.map((paragraph, index) => (
              <p key={paragraph.slice(0, 56)}>
                {index === 0 ? (
                  <span className="float-left mr-2.5 mt-1 font-serif text-[3.85rem] italic leading-[0.8] text-accent" aria-hidden="true">
                    {paragraph.charAt(0)}
                  </span>
                ) : null}
                {index === 0 ? paragraph.slice(1) : paragraph}
              </p>
            ))}
          </div>

          {investmentMemo ? (
            <>
              <section className="my-12 border border-canvas/16 bg-canvas/[0.018] p-6">
                <h2 className="text-center text-[10px] uppercase tracking-[0.24em] text-accent">{article.formulaLabel}</h2>
                <p className="mt-5 border-y border-canvas/10 py-7 text-center text-base font-semibold text-canvas md:text-lg">
                  {article.formula}
                </p>
              </section>
              <section className="border-t border-canvas/14 pt-8">
                <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-risk/90">Key risk vector</h2>
                <p className="text-sm leading-relaxed text-canvas/72">{article.risks}</p>
              </section>
            </>
          ) : null}

          {article.sources.length ? (
            <section className="mt-10 border-t border-canvas/14 pt-8">
              <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent">Research sources</h2>
              <div className="grid gap-3">
                {article.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid min-h-11 gap-2 border border-canvas/14 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-canvas/68 transition-colors hover:border-accent/60 hover:text-canvas sm:grid-cols-[1fr_auto]"
                  >
                    <span>{source.label}</span>
                    <span className="text-accent">Open source</span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath={investmentMemo ? '/markets' : '/research'} tone="dark" />
      </div>
    </main>
  );
}
