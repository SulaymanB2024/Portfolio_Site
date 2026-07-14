import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { EditorialArticleHero, EditorialArticlePage } from '../components/articles/EditorialArticle';
import { getArticleBySlug } from '../content/articleRegistry';
import { isInvestmentMemo } from '../content/articleModels';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

type ArticlePresentation = {
  sectionTitles: readonly [string, string, string];
  heroImage: string;
  heroAlt: string;
  figureLabel: string;
  figureTitle: string;
  figureCaption: string;
  figureSteps: readonly { index: string; label: string; detail: string }[];
};

const RESEARCH_PRESENTATIONS: Record<string, ArticlePresentation> = {
  'ai-search-crawler-policy': {
    sectionTitles: ['Access begins with intent', 'Public pages need a policy surface', 'Discovery still stops short of trust'],
    heroImage: '/images/research/crawler-policy-map-light.svg',
    heroAlt: 'Diagram separating search, training, and user-requested crawler intent',
    figureLabel: 'Operating model',
    figureTitle: 'Crawler policy is a sequence, not a switch.',
    figureCaption: 'Each stage is necessary. None of the first three stages guarantees the fourth.',
    figureSteps: [
      { index: '01', label: 'Allow', detail: 'Make the intended public record reachable.' },
      { index: '02', label: 'Identify', detail: 'Separate agents by stated purpose.' },
      { index: '03', label: 'Notify', detail: 'Publish sitemaps and change signals.' },
      { index: '04', label: 'Earn trust', detail: 'Let the page answer clearly with sources.' },
    ],
  },
  'technical-seo-public-data-infrastructure': {
    sectionTitles: ['Treat the page as a record', 'Make meaning explicit', 'Retire conflicting versions'],
    heroImage: '/images/research/public-data-infrastructure-light.svg',
    heroAlt: 'Diagram of access, identity, provenance, and distribution layers',
    figureLabel: 'Reliability stack',
    figureTitle: 'Public reach rests on record quality.',
    figureCaption: 'Distribution sits at the top of a stack whose lower layers must remain coherent.',
    figureSteps: [
      { index: '01', label: 'Access', detail: 'A machine can reach the public page.' },
      { index: '02', label: 'Identity', detail: 'The record keeps a stable address.' },
      { index: '03', label: 'Provenance', detail: 'Claims expose authorship, date, and source.' },
      { index: '04', label: 'Distribution', detail: 'Search and readers can evaluate the result.' },
    ],
  },
  'canonical-identity-personal-seo': {
    sectionTitles: ['Shrink the identity graph', 'Keep schema conservative', 'Reconcile the public record'],
    heroImage: '/images/research/canonical-identity-graph-light.svg',
    heroAlt: 'Canonical person graph connecting aligned pages and isolating stale records',
    figureLabel: 'Reconciliation loop',
    figureTitle: 'One current identity, reinforced everywhere.',
    figureCaption: 'The useful graph is not the largest one. It is the smallest graph that stays current.',
    figureSteps: [
      { index: '01', label: 'Choose', detail: 'Set one preferred host and profile thesis.' },
      { index: '02', label: 'Align', detail: 'Make About, resume, and bios agree.' },
      { index: '03', label: 'Connect', detail: 'Use only strong, matching identity links.' },
      { index: '04', label: 'Retire', detail: 'Redirect or remove conflicting records.' },
    ],
  },
};

const ARCHIVE_PRESENTATION: ArticlePresentation = {
  sectionTitles: ['Historical premise', 'Evidence required', 'Current boundary'],
  heroImage: '/images/research/archive-method-frame-light.svg',
  heroAlt: 'Archived research method separating assumptions, evidence, and claim limits',
  figureLabel: 'Archive protocol',
  figureTitle: 'Preserve the method. Retire the recommendation.',
  figureCaption: 'Archived notes remain useful only when their historical framing and present limit are explicit.',
  figureSteps: [
    { index: '01', label: 'Name', detail: 'State the old assumption without reviving it.' },
    { index: '02', label: 'Require', detail: 'List the evidence a current claim would need.' },
    { index: '03', label: 'Separate', detail: 'Keep measured facts apart from inference.' },
    { index: '04', label: 'Limit', detail: 'Mark the route as context, not guidance.' },
  ],
};

function groupParagraphs(content: string[], sectionTitles: ArticlePresentation['sectionTitles']) {
  const groupSize = Math.ceil(content.length / sectionTitles.length);
  return sectionTitles.map((title, index) => ({
    id: `section-${index + 1}`,
    title,
    paragraphs: content.slice(index * groupSize, (index + 1) * groupSize),
  })).filter((section) => section.paragraphs.length > 0);
}

export default function MarketArticlePage({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug) ?? RESEARCH_ARTICLES[0];
  const investmentMemo = isInvestmentMemo(article);
  const route = getSeoRoute(`/markets/${article.slug}`) ?? getSeoRoute('/research')!;
  const activePath = investmentMemo ? '/markets' : '/research';
  const backHref = activePath;
  const backLabel = investmentMemo ? 'Markets archive' : 'Research index';
  const boundary = investmentMemo ? article.recommendationBoundary : article.evidenceBoundary;
  const presentation = RESEARCH_PRESENTATIONS[article.slug] ?? ARCHIVE_PRESENTATION;
  const sections = groupParagraphs(article.content, presentation.sectionTitles);
  const metrics = article.metrics ?? [
    { label: 'Category', value: article.category },
    { label: 'Updated', value: article.dateModified ?? article.date },
    { label: 'Sources', value: String(article.sources.length) },
  ];

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <EditorialArticlePage
      id="top"
      activePath={activePath}
      className={`market-editorial-article ${investmentMemo ? 'market-editorial-article--archive' : ''}`}
    >
      <div className="editorial-article-frame">
        <a className="market-editorial-back" href={backHref}>
          <span aria-hidden="true">←</span>
          <span>{backLabel}</span>
        </a>

        <EditorialArticleHero
          dateTime={article.date.replaceAll('.', '-')}
          published={article.date}
          kind={article.category}
          readTime={article.readTime}
          title={article.title}
          summary={article.subtitle}
          image={{ src: presentation.heroImage, alt: presentation.heroAlt, width: 1200, height: 630 }}
          caption={`${presentation.figureLabel} · ${presentation.figureCaption}`}
        />

        <section className="market-editorial-metrics" aria-label="Article details">
          {metrics.map((metric) => (
            <div key={`${metric.label}-${metric.value}`}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </section>

        <section className="market-editorial-answer" aria-labelledby="article-thesis">
          <p>{investmentMemo ? 'Archive status' : 'Core thesis'}</p>
          <div>
            <h2 id="article-thesis">{investmentMemo ? 'Historical context, with the claim boundary intact.' : article.thesis}</h2>
            {boundary ? <p>{boundary}</p> : null}
          </div>
        </section>

        <div className="market-editorial-layout">
          <aside className="market-editorial-rail" aria-label="Article outline">
            <div>
              <p>Article outline</p>
              <nav>
                {sections.map((section, index) => (
                  <a key={section.id} href={`#${section.id}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </a>
                ))}
                {investmentMemo ? <a href="#method-frame"><span>04</span>Method frame</a> : null}
                {article.sources.length ? <a href="#sources"><span>{investmentMemo ? '05' : '04'}</span>Sources</a> : null}
              </nav>
              {boundary ? (
                <div className="market-editorial-rail__boundary">
                  <span>{investmentMemo ? 'Not advice' : 'Evidence limit'}</span>
                  <p>{boundary}</p>
                </div>
              ) : null}
            </div>
          </aside>

          <article className="market-editorial-copy">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="market-editorial-section">
                <header>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h2>{section.title}</h2>
                </header>
                <div className="market-editorial-prose">
                  {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
                </div>

                {index === 0 ? (
                  <figure className="market-editorial-system-figure">
                    <div className="market-editorial-figure-label">
                      <span>{presentation.figureLabel}</span>
                      <span>Four-stage view</span>
                    </div>
                    <h3>{presentation.figureTitle}</h3>
                    <ol>
                      {presentation.figureSteps.map((step) => (
                        <li key={step.index}>
                          <span>{step.index}</span>
                          <strong>{step.label}</strong>
                          <p>{step.detail}</p>
                        </li>
                      ))}
                    </ol>
                    <figcaption>{presentation.figureCaption}</figcaption>
                  </figure>
                ) : null}
              </section>
            ))}

            {investmentMemo ? (
              <section id="method-frame" className="market-editorial-method">
                <p>{article.formulaLabel}</p>
                <h2>{article.formula}</h2>
                <div>
                  <span>Key risk vector</span>
                  <p>{article.risks}</p>
                </div>
              </section>
            ) : null}

            {article.sources.length ? (
              <section id="sources" className="market-editorial-sources">
                <p>Research sources</p>
                <div>
                  {article.sources.map((source, index) => (
                    <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{source.label}</strong>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="market-editorial-endnote">
              <span>{article.author}</span>
              <span>Published {article.date}</span>
              <span>Updated {article.dateModified ?? article.date}</span>
            </div>
          </article>
        </div>
      </div>

      <div className="market-editorial-footer-shell">
        <InternalFooter activePath={activePath} tone="light" />
      </div>
    </EditorialArticlePage>
  );
}
