import { useEffect } from 'react';

import {
  ArticleReader,
  ArticleSectionHeader,
  createArticleNavigation,
  getArticleNavigationIndex,
  type ArticleNavItem,
  type ArticleReaderConfig,
} from '../components/ArticleLayout';
import { getArticleBySlug, getArticlePath } from '../content/articleRegistry';
import {
  isInvestmentMemo,
  type ArticleSection,
  type PublicArticle,
  type ResearchArticle,
} from '../content/articleModels';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getArticleSearchTarget } from '../seo/articleSearchTargets';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

function StructuredArticleSections({
  sections,
  navigation,
}: {
  sections: ArticleSection[];
  navigation: ArticleNavItem[];
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <ArticleSectionHeader index={getArticleNavigationIndex(navigation, section.id)}>
            {section.title}
          </ArticleSectionHeader>

          <div className="article-reader__prose">
            {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
          </div>

          {section.figures?.map((figure) => (
            <figure key={figure.src} className="toll-editorial-plate article-reader__figure">
              <p className="toll-figure-label">{figure.label}</p>
              <img
                src={figure.src}
                alt={figure.alt}
                width={figure.width}
                height={figure.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{figure.caption}</figcaption>
            </figure>
          ))}

          {section.table ? (
            <figure className="toll-data-table research-guide-table">
              <figcaption className="article-reader__table-caption">
                <span>{section.table.caption}</span>
                <small>Scroll horizontally to inspect every field</small>
              </figcaption>
              <div className="toll-data-table__scroll">
                <table>
                  <caption className="sr-only">{section.table.caption}</caption>
                  <thead>
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

function SourceLedger({
  article,
  navigation,
}: {
  article: PublicArticle;
  navigation: ArticleNavItem[];
}) {
  return (
    <section id="source-ledger" className="toll-source-ledger">
      <ArticleSectionHeader index={getArticleNavigationIndex(navigation, 'source-ledger')}>
        Source ledger
      </ArticleSectionHeader>
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

function ArticleResources({
  article,
  navigation,
}: {
  article: PublicArticle;
  navigation: ArticleNavItem[];
}) {
  if (!article.resources?.length) return null;

  return (
    <section id="downloads" className="article-reader__resources">
      <ArticleSectionHeader index={getArticleNavigationIndex(navigation, 'downloads')}>
        Downloads
      </ArticleSectionHeader>
      <p className="article-reader__resources-intro">
        The formatted article is the reading layer. These files preserve the supplied report, live model, and full-resolution figures.
      </p>
      <ul>
        {article.resources.map((resource) => (
          <li key={resource.href}>
            <a href={resource.href} download>
              <span>{resource.format}</span>
              <strong>{resource.label}</strong>
              <small>{resource.description}</small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function articleNav(article: PublicArticle, sections: ArticleSection[] | undefined): ArticleNavItem[] {
  const faqSections = (sections ?? []).filter((section) => section.id.toLowerCase().includes('faq'));
  const numberedSections = (sections ?? []).filter((section) => !section.id.toLowerCase().includes('faq'));

  return createArticleNavigation([
    { kind: 'overview', id: 'overview', label: 'Overview' },
    ...numberedSections.map((section) => ({
      kind: 'section' as const,
      id: section.id,
      label: section.title,
    })),
    ...(isInvestmentMemo(article)
      ? [{ kind: 'section' as const, id: 'decision-frame', label: 'Decision frame' }]
      : []),
    ...(article.resources?.length
      ? [{ kind: 'section' as const, id: 'downloads', label: 'Downloads' }]
      : []),
    ...faqSections.map((section) => ({
      kind: 'faq' as const,
      id: section.id,
      label: section.title,
    })),
    ...(article.sources.length
      ? [{ kind: 'source' as const, id: 'source-ledger', label: 'Source ledger' }]
      : []),
  ]);
}

function articleImage(article: PublicArticle) {
  if (article.artwork.kind !== 'image') return undefined;

  return {
    src: article.artwork.heroSrc,
    alt: article.artwork.alt,
    label: article.artwork.label,
    caption: article.artwork.caption,
    objectPosition: article.artwork.objectPosition,
  };
}

function GenericArticle({
  article,
}: {
  article: PublicArticle;
}) {
  const investmentMemo = isInvestmentMemo(article);
  const backHref = investmentMemo ? '/markets' : '/research';
  const backLabel = investmentMemo ? 'Markets archive' : 'Research archive';
  const boundary = investmentMemo ? article.recommendationBoundary : article.evidenceBoundary;
  const metrics = article.metrics ?? [
    { label: 'Category', value: article.category },
    { label: 'Updated', value: article.dateModified ?? article.date },
    { label: 'Sources', value: String(article.sources.length) },
  ];
  const sections = article.sections;
  const numberedSections = sections?.filter((section) => !section.id.toLowerCase().includes('faq'));
  const faqSections = sections?.filter((section) => section.id.toLowerCase().includes('faq'));
  const navItems = articleNav(article, sections);
  const searchTarget = getArticleSearchTarget(getArticlePath(article));
  const relatedLinks = searchTarget?.relatedPaths.map((path) => ({
    href: path,
    label: getArticleSearchTarget(path)?.primaryQuery ?? path,
  })) ?? [];
  const study = article.artwork.kind === 'study'
    ? {
        label: article.artwork.label,
        note: article.artwork.note,
        variant: article.artwork.variant,
      }
    : undefined;
  const callouts: NonNullable<ArticleReaderConfig['callouts']> = [];

  if (searchTarget) {
    callouts.push({
      label: 'Direct answer',
      title: searchTarget.primaryQuery,
      content: (
        <>
          <p>{searchTarget.directAnswer}</p>
          <p><strong>Original artifact:</strong> {searchTarget.originalArtifact}</p>
        </>
      ),
    });
  }

  if (article.thesis) {
    callouts.push({
      label: investmentMemo ? 'Thesis' : 'Key takeaway',
      title: investmentMemo
        ? 'The decision rests on explicit assumptions.'
        : 'The useful claim is the one the evidence can support.',
      content: <p>{article.thesis}</p>,
    });
  }

  const config: ArticleReaderConfig = {
    activePath: investmentMemo ? '/markets' : '/research',
    mode: 'reference',
    archive: { href: backHref, label: backLabel },
    hero: {
      eyebrow: `${article.category} / ${article.number}`,
      title: article.title,
      deck: article.subtitle,
      image: articleImage(article),
      imagePlaceholder: study,
    },
    publication: {
      subject: article.category,
      published: {
        dateTime: article.date.replaceAll('.', '-'),
        value: article.date,
      },
      updated: {
        dateTime: (article.dateModified ?? article.date).replaceAll('.', '-'),
        value: article.dateModified ?? article.date,
      },
      readTime: article.readTime,
      evidence: `${String(article.sources.length).padStart(2, '0')} sources`,
    },
    metrics: metrics.slice(0, 4).map((metric) => ({
      label: metric.label,
      value: metric.value,
      note: metric.label === 'Sources' ? 'Public source records' : undefined,
    })),
    callouts,
    navigation: { items: navItems },
    boundary: boundary
      ? {
          label: investmentMemo ? 'Recommendation boundary' : 'Evidence boundary',
          content: boundary,
        }
      : undefined,
    endnote: {
      content: (
        <>
          Research cutoff: {article.kind === 'research'
            ? article.lastVerified ?? article.dateModified ?? article.date
            : article.dateModified ?? article.date}.
          {' '}Public evidence and provider behavior can change; verify current sources before acting.
        </>
      ),
      links: investmentMemo
        ? [
            ...relatedLinks,
            { href: backHref, label: backLabel },
            { href: '/research', label: 'Technical SEO and AI systems research' },
            { href: '/about', label: 'About Sulayman Bowles' },
          ]
        : article.cluster === 'financial-systems'
          ? [
              ...relatedLinks,
              { href: '/research', label: 'Research archive' },
              { href: '/markets', label: 'Markets archive' },
              { href: '/about', label: 'About Sulayman Bowles' },
            ]
          : [
              ...relatedLinks,
              { href: '/research', label: 'Technical SEO research' },
              { href: '/atlas', label: 'Atlas technical SEO audit software' },
              { href: '/method', label: 'Technical SEO audit services' },
              { href: '/about', label: 'About Sulayman Bowles' },
            ],
    },
  };

  return (
    <ArticleReader config={config}>
        <section id="overview">
          <ArticleSectionHeader index={getArticleNavigationIndex(navItems, 'overview')}>
            Overview
          </ArticleSectionHeader>
          <div className="article-reader__prose">
            {article.content.map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
          </div>
        </section>

        {numberedSections?.length
          ? <StructuredArticleSections sections={numberedSections} navigation={navItems} />
          : null}

        {investmentMemo ? (
          <section id="decision-frame">
            <ArticleSectionHeader index={getArticleNavigationIndex(navItems, 'decision-frame')}>
              Decision frame
            </ArticleSectionHeader>
            <div className="article-reader__decision-grid">
              <article>
                <span>Formula</span>
                <strong>{article.formula}</strong>
                <p>{article.formulaLabel}</p>
              </article>
              <article>
                <span>Risk</span>
                <strong>What can break the thesis</strong>
                <p>{article.risks}</p>
              </article>
            </div>
          </section>
        ) : null}

        <ArticleResources article={article} navigation={navItems} />

        {faqSections?.length
          ? <StructuredArticleSections sections={faqSections} navigation={navItems} />
          : null}

        {article.sources.length
          ? <SourceLedger article={article} navigation={navItems} />
          : null}
    </ArticleReader>
  );
}

export default function MarketArticlePage({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug) ?? RESEARCH_ARTICLES[0];
  const route = getSeoRoute(getArticlePath(article)) ?? getSeoRoute('/research')!;

  useSEO(route);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (targetId) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, left: 0, behavior: 'auto' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return <GenericArticle article={article} />;
}
