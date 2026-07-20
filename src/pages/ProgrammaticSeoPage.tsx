import { useEffect } from 'react';

import {
  ArticleBody,
  ArticleCallout,
  ArticleEndnote,
  ArticleHero,
  ArticleMetricStrip,
  ArticlePage,
  ArticleSectionHeader,
} from '../components/ArticleLayout';
import {
  getProgrammaticSeoPage,
  programmaticPageWordCount,
  type ProgrammaticSeoSection,
} from '../content/programmaticSeo';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

function GuideSection({ section, index }: { section: ProgrammaticSeoSection; index: number; key?: string }) {
  return (
    <section id={section.id}>
      <ArticleSectionHeader index={String(index + 1).padStart(2, '0')}>{section.title}</ArticleSectionHeader>
      <div className="article-reader__prose">
        {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 96)}>{paragraph}</p>)}
        {section.bullets?.length ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
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
              <thead><tr>{section.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
              <tbody>
                {section.table.rows.map((row) => (
                  <tr key={row.join('|')}>
                    {row.map((cell, cellIndex) => cellIndex === 0
                      ? <th key={cell} scope="row">{cell}</th>
                      : <td key={cell}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      ) : null}
      {section.codeExamples?.map((example) => (
        <figure key={example.title} className="research-guide-code">
          <figcaption><span>Reproduction fixture</span><strong>{example.title}</strong><p>{example.description}</p></figcaption>
          <pre tabIndex={0}><code>{example.code}</code></pre>
          <p className="research-guide-code__format">Copy-ready {example.language}</p>
        </figure>
      ))}
    </section>
  );
}

export default function ProgrammaticSeoPage({ path }: { path: string }) {
  const page = getProgrammaticSeoPage(path);
  const route = getSeoRoute(path) ?? getSeoRoute('/research/technical-seo')!;
  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!page) return null;

  const familyHub = `/research/technical-seo/${page.family === 'issue' ? 'issues' : page.family === 'platform' ? 'platforms' : 'checklists'}`;
  const navItems = [
    { id: 'direct-answer', label: 'Direct answer', index: '00' },
    ...page.sections.map((section, index) => ({ id: section.id, label: section.title, index: String(index + 1).padStart(2, '0') })),
    { id: 'sources', label: 'Source ledger', index: 'S' },
  ];

  return (
    <ArticlePage activePath="/research" variant="research">
      <ArticleHero
        backHref={familyHub}
        backLabel={`${page.family} guides`}
        eyebrow={`Technical SEO / ${page.family}`}
        title={page.title}
        deck={page.directAnswer}
        metadata={[
          { label: 'Primary query', value: page.primaryQuery },
          { label: 'Published', value: page.datePublished },
          { label: 'Updated', value: page.dateModified },
          { label: 'Length', value: `${programmaticPageWordCount(page).toLocaleString()} words` },
          { label: 'Sources', value: String(page.sources.length).padStart(2, '0') },
        ]}
        imagePlaceholder={{ label: `${page.family} diagnostic / evidence plate`, note: page.evidenceArtifact.label, variant: 'pipeline' }}
      />

      <ArticleMetricStrip items={[
        { label: 'Evidence state', value: 'Fixture', note: 'Illustrative; replace before a live claim' },
        { label: 'Diagnostic steps', value: page.diagnosticProcedure.length },
        { label: 'Repair steps', value: page.repairSteps.length },
        { label: 'Rerun gates', value: page.rerunAcceptanceCheck.length },
      ]} />

      <ArticleCallout label="Direct answer" title={page.primaryQuery}>
        <p>{page.directAnswer}</p>
        <p><strong>Evidence boundary:</strong> {page.evidenceArtifact.description}</p>
      </ArticleCallout>

      <ArticleBody items={navItems} boundary={page.falsePositiveBoundary} boundaryLabel="False-positive boundary" variant="research">
        <section id="direct-answer">
          <ArticleSectionHeader index="00">Answer and scope</ArticleSectionHeader>
          <div className="article-reader__prose">
            <p>{page.directAnswer}</p>
            <p><strong>Supporting queries:</strong> {page.supportingQueries.join('; ')}.</p>
            <p><strong>Fixture fields:</strong> {page.evidenceArtifact.fields.join(', ')}.</p>
          </div>
        </section>

        {page.sections.map((section, index) => <GuideSection key={section.id} section={section} index={index} />)}

        <section id="sources" className="toll-source-ledger">
          <ArticleSectionHeader index="S">Source ledger</ArticleSectionHeader>
          <ol>
            {page.sources.map((source, index) => (
              <li key={source.href}>
                <span className="toll-source-ledger__id">{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{source.label}</strong><p>Last verified {source.lastVerified}.</p><a href={source.href} target="_blank" rel="noreferrer">Open source</a></div>
              </li>
            ))}
          </ol>
        </section>

        <ArticleEndnote links={[
          { href: familyHub, label: `${page.family} guide collection` },
          { href: '/research/technical-seo', label: 'Technical SEO diagnostic library' },
          ...page.relatedPaths.map((relatedPath) => ({ href: relatedPath, label: getSeoRoute(relatedPath)?.h1 ?? relatedPath })),
          { href: '/method', label: 'Technical SEO audit method' },
          { href: '/contact', label: page.cta.label },
        ]}>
          This guide uses an explicitly labeled fixture. Replace it with a dated crawl before making a production claim; rankings and traffic remain external outcomes.
        </ArticleEndnote>
      </ArticleBody>
    </ArticlePage>
  );
}
