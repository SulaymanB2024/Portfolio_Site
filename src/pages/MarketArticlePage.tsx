import { useState } from 'react';

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
import { getArticleRelatedLinkLabel, getArticleSearchTarget } from '../seo/articleSearchTargets';
import { getSeoRoute, NOT_FOUND_ROUTE } from '../seo/routes';
import { formatPublicationDate, normalizePublicationDate } from '../utils/publicationDate';
import { useSEO } from '../utils/seo';
import NotFoundPage from './NotFoundPage';

function ArticleCodeExample({
  example,
  index,
}: {
  key?: string;
  example: NonNullable<ArticleSection['codeExamples']>[number];
  index: number;
}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <figure className="research-guide-code">
      <figcaption>
        <span>Configuration {String(index + 1).padStart(2, '0')}</span>
        <strong>{example.title}</strong>
        <p>{example.description}</p>
        <button
          type="button"
          className="article-reader__code-copy"
          onClick={copyCode}
          aria-label={`Copy ${example.title} code`}
        >
          {copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy code'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copyStatus === 'copied'
            ? `${example.title} copied to the clipboard.`
            : copyStatus === 'failed'
              ? `${example.title} could not be copied.`
              : ''}
        </span>
      </figcaption>
      <pre tabIndex={0}><code>{example.code}</code></pre>
      <p className="research-guide-code__format">Review before release · {example.language}</p>
    </figure>
  );
}

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
                <small>
                  <span className="md:hidden">Fields are grouped by record below</span>
                  <span className="hidden md:inline">Scroll horizontally to inspect every field</span>
                </small>
              </figcaption>
              <div
                className="toll-data-table__scroll"
                role="region"
                aria-label={`${section.table.caption}. Scroll horizontally to inspect every field.`}
                tabIndex={0}
              >
                <table data-responsive-table="stacked">
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
                            ? <th key={`${index}-${cell}`} scope="row" data-label={section.table?.columns[index] ?? 'Record'}>{cell}</th>
                            : <td key={`${index}-${cell}`} data-label={section.table?.columns[index] ?? `Field ${index + 1}`} className={index === 1 ? 'research-guide-table__agent' : undefined}>{cell}</td>
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
                <ArticleCodeExample key={example.title} example={example} index={exampleIndex} />
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
        {article.sources.map((source, index) => {
          const isExternal = /^https?:\/\//.test(source.href);

          return (
            <li key={source.href}>
              <span className="toll-source-ledger__id">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{source.label}</strong>
                <p>
                  {source.lastVerified
                    ? `Last verified ${formatPublicationDate(source.lastVerified)}.`
                    : 'Verification date not recorded in this web edition.'}
                </p>
                <div className="toll-source-ledger__links">
                  <a
                    href={source.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                    className={isExternal ? 'article-reader__external-link' : undefined}
                    aria-label={`Open ${source.label}${isExternal ? ' in a new tab' : ''}`}
                  >
                    Open source
                  </a>
                </div>
              </div>
            </li>
          );
        })}
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
        These downloads contain the reports, datasets, models, or figures available for this article.
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
  const modifiedDate = article.dateModified ?? article.date;
  const hasDistinctModifiedDate = normalizePublicationDate(modifiedDate) !== normalizePublicationDate(article.date);
  const metrics = article.metrics ?? [
    { label: 'Category', value: article.category },
    { label: hasDistinctModifiedDate ? 'Updated' : 'Published', value: formatPublicationDate(modifiedDate) },
    { label: 'Sources', value: String(article.sources.length) },
  ];
  const sections = article.sections;
  const numberedSections = sections?.filter((section) => !section.id.toLowerCase().includes('faq'));
  const faqSections = sections?.filter((section) => section.id.toLowerCase().includes('faq'));
  const navItems = articleNav(article, sections);
  const searchTarget = getArticleSearchTarget(getArticlePath(article));
  const articlePath = getArticlePath(article);
  const relatedLinks = searchTarget?.relatedPaths.map((path) => ({
    href: path,
    label: getArticleRelatedLinkLabel(articlePath, path),
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
      author: article.author,
      subject: article.category,
      published: {
        dateTime: normalizePublicationDate(article.date),
        value: formatPublicationDate(article.date),
      },
      updated: hasDistinctModifiedDate
        ? {
            dateTime: normalizePublicationDate(modifiedDate),
            value: formatPublicationDate(modifiedDate),
          }
        : undefined,
      readTime: article.readTime,
      evidence: `${article.sources.length} public source ${article.sources.length === 1 ? 'record' : 'records'}`,
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
      label: investmentMemo ? 'Decision frame' : 'Conclusion',
      title: article.conclusion.title,
      content: article.conclusion.content,
      note: (
        <>
          Research cutoff: {article.kind === 'research'
            ? formatPublicationDate(article.lastVerified ?? modifiedDate)
            : formatPublicationDate(modifiedDate)}.
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
              { href: 'https://www.void-agency.com/tools/technical-seo-audit-checklist', label: 'VOID technical SEO audit kit' },
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
  const article = getArticleBySlug(slug);
  const route = article
    ? getSeoRoute(getArticlePath(article)) ?? getSeoRoute('/research')!
    : NOT_FOUND_ROUTE;

  useSEO(route);

  if (!article) return <NotFoundPage />;

  return <GenericArticle article={article} />;
}
