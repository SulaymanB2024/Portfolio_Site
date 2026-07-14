import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { getArticleBySlug, getArticlePath } from '../content/articleRegistry';
import {
  isInvestmentMemo,
  type ArticleMetric,
  type ArticleSection,
  type ResearchArticle,
} from '../content/articleModels';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

function StructuredArticleSections({ sections }: { sections: ArticleSection[] }) {
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section key={section.id} id={section.id} className="toll-article-section scroll-mt-28">
          <header>
            <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
            <h2>{section.title}</h2>
          </header>

          <div className="toll-article-prose">
            {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </div>

          {section.table ? (
            <figure className="toll-data-table research-guide-table">
              <div className="toll-data-table__scroll">
                <table>
                  <caption>{section.table.caption}</caption>
                  <thead className="bg-canvas/[0.055] text-[9px] uppercase tracking-[0.16em] text-canvas/84">
                    <tr>
                      {section.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join('|')}>
                        {row.map((cell, index) => (
                          index === 0
                            ? <th key={`${index}-${cell}`} scope="row">{cell}</th>
                            : <td key={`${index}-${cell}`} className={index === 1 ? 'research-guide-table__agent' : undefined}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          ) : null}

          {section.codeExamples?.length ? (
            <div className="research-guide-code-list">
              {section.codeExamples.map((example, exampleIndex) => (
                <figure key={example.title} className="research-guide-code">
                  <figcaption>
                    <span>Configuration {String(exampleIndex + 1).padStart(2, '0')}</span>
                    <strong>{example.title}</strong>
                    <p>{example.description}</p>
                  </figcaption>
                  <pre tabIndex={0}><code>{example.code}</code></pre>
                  <p className="research-guide-code__format">Copy-ready {example.language}</p>
                </figure>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </>
  );
}

function StructuredArticleRail({ article, sections }: { article: ResearchArticle; sections: ArticleSection[] }) {
  return (
    <aside className="toll-article-rail">
      <div className="toll-article-rail__sticky">
        <p>Article map</p>
        <nav aria-label="AI crawler guide sections">
          {sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.title}
            </a>
          ))}
          <a href="#source-ledger"><span>S</span>Source ledger</a>
        </nav>
        {article.evidenceBoundary ? (
          <div className="toll-article-rail__boundary">
            <span>Evidence boundary</span>
            <p>{article.evidenceBoundary}</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function StructuredSourceLedger({ article }: { article: ResearchArticle }) {
  return (
    <section id="source-ledger" className="toll-article-section toll-source-ledger scroll-mt-28">
      <header>
        <span>S</span>
        <h2>Source ledger</h2>
      </header>
      <p className="toll-section-intro">
        Provider crawler documentation, robots.txt guidance, and published IP manifests. Verification dates are preserved per source so future policy reviews have a dated baseline.
      </p>
      <ol>
        {article.sources.map((source, index) => (
          <li key={source.href}>
            <span className="toll-source-ledger__id">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{source.label}</strong>
              <p>{source.lastVerified ? `Last verified ${source.lastVerified}.` : 'Supporting reference.'}</p>
              <div className="toll-source-ledger__links">
                <a href={source.href} target="_blank" rel="noreferrer">Open source</a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function StructuredResearchArticlePage({
  article,
  metrics,
  sections,
}: {
  article: ResearchArticle;
  metrics: ArticleMetric[];
  sections: ArticleSection[];
}) {
  const headlineMetrics = [
    ...metrics,
    { label: 'Source records', value: String(article.sources.length).padStart(2, '0') },
  ].slice(0, 4);

  return (
    <main id="top" className="site-page site-page-dark toll-article research-longform min-h-screen overflow-x-hidden font-sans">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="dark" />

      <article className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-24 pt-14 md:px-8 lg:px-10 lg:pt-24">
        <header className="toll-article-hero">
          <aside>
            <a href="/research">← Research assets</a>
            <dl>
              <div><dt>Article</dt><dd>{article.number} / {article.category}</dd></div>
              <div><dt>Published</dt><dd><time dateTime={article.date.replaceAll('.', '-')}>{article.date}</time></dd></div>
              <div><dt>Updated</dt><dd><time dateTime={(article.dateModified ?? article.date).replaceAll('.', '-')}>{article.dateModified ?? article.date}</time></dd></div>
              {article.lastVerified ? <div><dt>Last verified</dt><dd><time dateTime={article.lastVerified.replaceAll('.', '-')}>{article.lastVerified}</time></dd></div> : null}
              <div><dt>Length</dt><dd>{article.readTime}</dd></div>
              <div><dt>Method</dt><dd>Provider documentation, robots policy analysis, IP manifests, and server-log verification.</dd></div>
            </dl>
          </aside>
          <div>
            <p className="toll-article-hero__eyebrow">{article.category} / exact agents / deployable rules</p>
            <h1>{article.title}</h1>
            <p className="toll-article-hero__display-title">Allow AI search without allowing model-training crawlers.</p>
            <p className="toll-article-hero__deck">{article.subtitle}</p>
          </div>
        </header>

        <div className="toll-headline-metrics" aria-label="AI crawler guide headline facts">
          {headlineMetrics.map((metric) => (
            <div key={`${metric.label}-${metric.value}`}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <small>{metric.label === 'Last verified' ? 'Provider guidance and manifests' : 'Guide scope'}</small>
            </div>
          ))}
        </div>

        {article.thesis ? (
          <section className="toll-quick-answer" aria-labelledby="crawler-policy-answer">
            <p>Policy position</p>
            <div>
              <h2 id="crawler-policy-answer">Separate discovery, training, and user-requested access.</h2>
              <p>{article.thesis}</p>
            </div>
          </section>
        ) : null}

        <div className="toll-article-layout">
          <StructuredArticleRail article={article} sections={sections} />
          <div className="min-w-0 max-w-[920px]">
            <section className="toll-article-lede">
              <div className="toll-article-prose">
                {article.content.map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
              </div>
            </section>
            <StructuredArticleSections sections={sections} />
            <StructuredSourceLedger article={article} />

            <footer className="toll-article-endnote">
              <p>Research cutoff: {article.lastVerified ?? article.dateModified ?? article.date}. Crawler behavior and published IP ranges can change; verify the live provider documentation before enforcing a production policy.</p>
              <nav aria-label="Related research">
                <a href="/research">Research assets</a>
                <a href="/research/search-console/technical-seo-public-data-infrastructure">Technical SEO infrastructure</a>
                <a href="/about">About the author</a>
              </nav>
            </footer>
          </div>
        </div>
      </article>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 lg:px-10">
        <InternalFooter activePath="/research" tone="dark" />
      </div>
    </main>
  );
}

export default function MarketArticlePage({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug) ?? RESEARCH_ARTICLES[0];
  const investmentMemo = isInvestmentMemo(article);
  const route = getSeoRoute(getArticlePath(article)) ?? getSeoRoute('/research')!;
  const structuredSections = article.kind === 'research' ? article.sections : undefined;
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

  if (article.kind === 'research' && structuredSections?.length) {
    return <StructuredResearchArticlePage article={article} metrics={metrics} sections={structuredSections} />;
  }

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
              ...(article.kind === 'research' && article.lastVerified ? [['Last verified', article.lastVerified]] : []),
              ['Read time', article.readTime],
              ['Sources', String(article.sources.length)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="mb-1 text-canvas/60">{label}</dt>
                <dd className="text-canvas">{value}</dd>
              </div>
            ))}
          </dl>
          {structuredSections?.length ? (
            <nav aria-label="On this page" className="border-t border-canvas/12 pt-6">
              <p className="mb-3 text-canvas/38">On this page</p>
              <ol className="grid gap-3 normal-case leading-relaxed tracking-normal text-canvas/58">
                {structuredSections.map((section, index) => (
                  <li key={section.id}><a href={`#${section.id}`} className="transition-colors hover:text-accent">{String(index + 1).padStart(2, '0')} · {section.title}</a></li>
                ))}
              </ol>
            </nav>
          ) : null}
        </aside>

        <div className="max-w-4xl select-text">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-accent">{article.category}</p>
          <h1 className={`font-serif italic leading-[0.9] tracking-normal text-canvas ${structuredSections?.length ? 'text-[3rem] md:text-[4.5rem] xl:text-[6rem]' : 'text-[3.25rem] md:text-[5.75rem] xl:text-[8rem]'}`}>
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

          {structuredSections?.length ? <StructuredArticleSections sections={structuredSections} /> : null}

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
              <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-accent">{structuredSections?.length ? 'Source ledger' : 'Research sources'}</h2>
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
                    <span className="text-accent">{source.lastVerified ? `Verified ${source.lastVerified}` : 'Open source'}</span>
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
