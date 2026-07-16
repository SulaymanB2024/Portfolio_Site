import { useEffect, type ReactNode } from 'react';

import {
  ArticleBody,
  ArticleCallout,
  ArticleEndnote,
  ArticleHero,
  ArticleMetricStrip,
  ArticlePage,
  ArticleSectionHeader,
  type ArticleImagePlaceholderVariant,
  type ArticleNavItem,
  type ArticleReaderVariant,
} from '../components/ArticleLayout';
import { getArticleBySlug, getArticlePath } from '../content/articleRegistry';
import {
  isInvestmentMemo,
  type ArticleSection,
  type PublicArticle,
  type ResearchArticle,
} from '../content/articleModels';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ARTICLE_PLACEHOLDERS: Record<string, {
  label: string;
  note: string;
  variant: ArticleImagePlaceholderVariant;
}> = {
  'technical-seo-public-data-infrastructure': {
    label: 'Systems essay / pipeline study',
    note: 'Placeholder for the URL → crawl → render → structured record → evidence/export pipeline.',
    variant: 'pipeline',
  },
  'canonical-identity-personal-seo': {
    label: 'Operational playbook / identity graph',
    note: 'Placeholder for the canonical person node, controlled profiles, and redirected stale records.',
    variant: 'identity',
  },
  'archived-research-methodology': {
    label: 'Archive methodology / triptych',
    note: 'Temporary study for the network, compute, and monetary research methods.',
    variant: 'triptych',
  },
};

const ARTICLE_VARIANTS: Record<string, ArticleReaderVariant> = {
  'ai-search-crawler-policy': 'research',
  'technical-seo-public-data-infrastructure': 'wide',
  'canonical-identity-personal-seo': 'chapters',
  'archived-research-methodology': 'research',
};

const ARTICLE_CALLOUT_TITLES: Partial<Record<string, string>> = {
  'ai-search-crawler-policy':
    'The file is a policy switch, not a security boundary.',
  'technical-seo-public-data-infrastructure':
    'A finding is useful only when its lineage survives export.',
  'canonical-identity-personal-seo':
    'One maintained biography should own the present tense.',
};

const ARTICLE_TITLES: Partial<Record<string, ReactNode>> = {
  'ai-search-crawler-policy': (
    <>
      <span>AI Crawler Robots.txt</span>
      <span>Guide</span>
      <span>GPTBot, OAI‑SearchBot,</span>
      <span>ClaudeBot and PerplexityBot</span>
    </>
  ),
  'technical-seo-public-data-infrastructure': (
    <>
      <span>Technical SEO as</span>
      <span>Public Data Infrastructure</span>
    </>
  ),
  'canonical-identity-personal-seo': (
    <>
      <span>Canonical Identity</span>
      <span>Beats More Content</span>
    </>
  ),
  'archived-research-methodology': (
    <>
      <span>Archived Market Research</span>
      <span>Methodology</span>
    </>
  ),
};

const ARTICLE_IMAGE_COPY: Partial<Record<string, {
  alt: string;
  label: string;
  caption: string;
}>> = {
  'ai-search-crawler-policy': {
    alt: 'A vast monochrome compute landscape with illuminated traffic moving between rows of machine infrastructure.',
    label: 'Access layer / 01',
    caption: 'Named crawler policy sits at the edge of a much larger machine-fetching system.',
  },
  'technical-seo-public-data-infrastructure': {
    alt: 'An archive of files and records assembled into transparent layers with visible links between each transformation.',
    label: 'Record pipeline / 01',
    caption: 'Public records become dependable when every transformation preserves its source and lineage.',
  },
  'canonical-identity-personal-seo': {
    alt: 'A central person record connected to many surrounding profiles, documents, credentials, and identity signals.',
    label: 'Identity graph / 01',
    caption: 'One maintained person record reconciles the profiles and documents that describe it.',
  },
};

function StructuredArticleSections({ sections }: { sections: ArticleSection[] }) {
  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section key={section.id} id={section.id}>
          <ArticleSectionHeader index={String(sectionIndex + 1).padStart(2, '0')}>
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

function SourceLedger({ article }: { article: PublicArticle }) {
  return (
    <section id="source-ledger" className="toll-source-ledger">
      <ArticleSectionHeader index="S">Source ledger</ArticleSectionHeader>
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

function articleNav(article: PublicArticle, sections: ArticleSection[] | undefined): ArticleNavItem[] {
  if (sections?.length) {
    return [
      { id: 'overview', label: 'Overview', index: '00' },
      ...sections.map((section, index) => ({
        id: section.id,
        label: section.title,
        index: String(index + 1).padStart(2, '0'),
      })),
      ...(isInvestmentMemo(article) ? [{ id: 'decision-frame', label: 'Decision frame', index: 'D' }] : []),
      ...(article.sources.length ? [{ id: 'source-ledger', label: 'Source ledger', index: 'S' }] : []),
    ];
  }

  return [
    { id: 'overview', label: 'Overview', index: '01' },
    ...(isInvestmentMemo(article) ? [{ id: 'decision-frame', label: 'Decision frame', index: '02' }] : []),
    ...(article.sources.length ? [{ id: 'source-ledger', label: 'Research sources', index: 'S' }] : []),
  ];
}

function articleImage(article: PublicArticle) {
  const copy = ARTICLE_IMAGE_COPY[article.slug];
  const image = article.image !== '/og-default.png'
    ? { src: article.image, alt: copy?.alt ?? `${article.title} editorial artwork.` }
    : undefined;

  return image
    ? {
        ...image,
        label: copy?.label ?? `${article.category} / editorial plate`,
        caption: copy?.caption ?? article.title,
      }
    : undefined;
}

function ArticleHeroBlock({
  article,
  backHref,
  backLabel,
}: {
  article: PublicArticle;
  backHref: string;
  backLabel: string;
}) {
  const placeholder = ARTICLE_PLACEHOLDERS[article.slug] ?? {
    label: `${article.category} / image study pending`,
    note: 'Reserved for a page-specific editorial image.',
    variant: 'default' as const,
  };

  return (
    <ArticleHero
      backHref={backHref}
      backLabel={backLabel}
      eyebrow={`${article.category} / ${article.number}`}
      title={ARTICLE_TITLES[article.slug] ?? article.title}
      titleLabel={article.title}
      deck={article.subtitle}
      lead={<p>{article.content[0]}</p>}
      image={articleImage(article)}
      imagePlaceholder={placeholder}
      metadata={[
        { label: 'Author', value: article.author },
        { label: 'Published', value: <time dateTime={article.date.replaceAll('.', '-')}>{article.date}</time> },
        { label: 'Updated', value: <time dateTime={(article.dateModified ?? article.date).replaceAll('.', '-')}>{article.dateModified ?? article.date}</time> },
        { label: 'Read time', value: article.readTime },
        { label: 'Sources', value: String(article.sources.length).padStart(2, '0') },
      ]}
    />
  );
}

function GenericArticle({
  article,
}: {
  article: PublicArticle;
}) {
  const investmentMemo = isInvestmentMemo(article);
  const backHref = investmentMemo ? '/markets' : '/research';
  const backLabel = investmentMemo ? 'Markets research' : 'Research archive';
  const boundary = investmentMemo ? article.recommendationBoundary : article.evidenceBoundary;
  const metrics = article.metrics ?? [
    { label: 'Category', value: article.category },
    { label: 'Updated', value: article.dateModified ?? article.date },
    { label: 'Sources', value: String(article.sources.length) },
  ];
  const sections = article.sections;
  const variant = ARTICLE_VARIANTS[article.slug] ?? (sections?.length ? 'research' : 'wide');
  const navItems = articleNav(article, sections);

  return (
    <ArticlePage
      activePath={investmentMemo ? '/markets' : '/research'}
      variant={variant}
      className={`article-${article.slug}`}
    >
      <ArticleHeroBlock article={article} backHref={backHref} backLabel={backLabel} />

      <ArticleMetricStrip
        items={metrics.slice(0, 4).map((metric) => ({
          label: metric.label,
          value: metric.value,
          note: metric.label === 'Sources' ? 'Public source records' : undefined,
        }))}
      />

      {article.thesis ? (
        <ArticleCallout
          label={investmentMemo ? 'Thesis' : 'Key takeaway'}
          title={
            ARTICLE_CALLOUT_TITLES[article.slug] ??
            (investmentMemo
              ? 'The decision rests on explicit assumptions.'
              : 'The useful claim is the one the evidence can support.')
          }
        >
          <p>{article.thesis}</p>
        </ArticleCallout>
      ) : null}

      <ArticleBody
        items={navItems}
        boundary={boundary}
        boundaryLabel={investmentMemo ? 'Recommendation boundary' : 'Evidence boundary'}
        variant={variant}
      >
        <section id="overview">
          <ArticleSectionHeader index="00">Overview</ArticleSectionHeader>
          <div className="article-reader__prose">
            {article.content.slice(1).map((paragraph) => <p key={paragraph.slice(0, 72)}>{paragraph}</p>)}
          </div>
        </section>

        {sections?.length ? <StructuredArticleSections sections={sections} /> : null}

        {investmentMemo ? (
          <section id="decision-frame">
            <ArticleSectionHeader index="02">Decision frame</ArticleSectionHeader>
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

        {article.sources.length ? <SourceLedger article={article} /> : null}

        <ArticleEndnote
          links={[
            { href: backHref, label: backLabel },
            { href: '/research', label: 'Research archive' },
            { href: '/about', label: 'About the author' },
          ]}
        >
          Research cutoff: {article.kind === 'research' ? article.lastVerified ?? article.dateModified ?? article.date : article.dateModified ?? article.date}.
          Public evidence and provider behavior can change; verify current sources before acting.
        </ArticleEndnote>
      </ArticleBody>
    </ArticlePage>
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
