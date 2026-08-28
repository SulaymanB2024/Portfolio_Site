import { useMemo, useState } from 'react';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  EditorialHeading,
  LinkPanel,
  PageFrame,
  PageShell,
  PrimaryCTA,
  SectionEyebrow,
  SectionHeader,
  SurfaceGrid,
  TechnicalPanel,
  TextLink,
} from '../components/design/Primitives';
import { INVESTMENT_MEMOS } from '../content/marketTheses';
import { PUBLICATION_CATEGORY_SUMMARY, PUBLICATION_INDEX } from '../content/publicationIndex';
import { researchContextLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { formatPublicationDate, normalizePublicationDate } from '../utils/publicationDate';
import { useSEO } from '../utils/seo';

const RESEARCH_ROUTE = getSeoRoute('/research')!;
const RESEARCH_COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';
const ARCHIVED_RESEARCH = INVESTMENT_MEMOS.filter((memo) => memo.indexable === false);
type ResearchCategory = (typeof PUBLICATION_INDEX)[number]['category'];
type ResearchFilter = 'All' | ResearchCategory;
const RESEARCH_FILTERS: readonly ResearchFilter[] = [
  'All',
  'AI systems and products',
  'Search systems',
  'Technical SEO',
  'Markets and investing',
];

function publicationAction(href: string) {
  if (href === '/atlas/sample-crawl') return 'Inspect sample';
  if (href === '/austin-technical-seo') return 'Open pilot';
  if (href === '/viralbench-codex-agent-harness') return 'Read design';
  return 'Read article';
}

export default function ResearchPage() {
  useSEO(RESEARCH_ROUTE);
  const [activeFilter, setActiveFilter] = useState<ResearchFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredPublications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return PUBLICATION_INDEX.filter((note) => {
      const categoryMatches = activeFilter === 'All' || note.category === activeFilter;
      const queryMatches = !normalizedQuery || [note.title, note.description, note.category]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [activeFilter, searchQuery]);
  const filtersActive = activeFilter !== 'All' || searchQuery.trim().length > 0;
  const clearResearchFilters = () => {
    setActiveFilter('All');
    setSearchQuery('');
  };

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/research" tone="light" />

      <PageFrame className="relative z-10">
        <section className="relative grid min-h-[64vh] items-end gap-12 overflow-hidden border-b border-current/12 pb-14 pt-16 md:pt-20 lg:grid-cols-[minmax(0,0.6fr)_minmax(320px,0.4fr)]">
          <div className="relative z-10 min-w-0">
            <SectionEyebrow className="text-ink/60">Research</SectionEyebrow>
            <EditorialHeading className="mt-8">One archive. Clear categories.</EditorialHeading>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-current/68">
              This archive contains crawler-policy analysis, URL-level technical SEO artifacts, AI-system evaluation designs, ownership models, assumption tables, and source-led market research. Each item states its source base, method, evidence limit, and current implementation status; finance-only work remains available as a filtered Markets archive.
            </p>
          </div>

          <div aria-hidden="true" className="pointer-events-none relative z-0 -my-12 hidden min-h-[520px] select-none lg:block">
            <img src={RESEARCH_COIN_ART} alt="" className="absolute left-[-4rem] top-1/2 h-auto w-[min(1120px,72vw)] max-w-none -translate-y-1/2 opacity-55 mix-blend-multiply" draggable={false} />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-5 border-b border-current/12 py-8">
          <PrimaryCTA href="/work" id="research-work-link">View selected work</PrimaryCTA>
          <TextLink href="/markets" id="research-markets-link" className="text-[10px] uppercase tracking-[0.2em] text-current/64 hover:text-current">
            Markets filter
          </TextLink>
          <TextLink href="/atlas" id="research-atlas-link" className="text-[10px] uppercase tracking-[0.2em] text-current/64 hover:text-current">
            Atlas
          </TextLink>
        </div>
      </PageFrame>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Categories" title="Five ways into the work.">
            Each lane has a concrete question, source base, and boundary between observed facts and interpretation.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
            {PUBLICATION_CATEGORY_SUMMARY.map(([title, description], index) => (
              <TechnicalPanel key={title} className="min-h-[210px]">
                <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-10 font-serif text-3xl italic leading-none tracking-normal text-current">{title}</h2>
                <p className="mt-5 text-sm leading-relaxed text-current/64">{description}</p>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Publication index" title="Questions, evidence, limits.">
            {PUBLICATION_INDEX.length} distinct notes and artifacts, with finance terminology reserved for finance work.
          </SectionHeader>

          <div className="mb-8 grid gap-6 border-y border-current/14 py-6 lg:grid-cols-[minmax(17rem,0.58fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <label htmlFor="research-publication-search" className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-ink/60">
                Search the archive
              </label>
              <input
                id="research-publication-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Title, subject, or evidence type"
                autoComplete="off"
                aria-controls="research-publication-grid"
                className="min-h-12 w-full border border-ink/22 bg-ink/[0.018] px-4 text-base text-ink outline-none transition-colors placeholder:text-ink/46 hover:border-ink/36 focus:border-ink"
              />
            </div>

            <fieldset className="min-w-0">
              <legend className="mb-3 text-[10px] uppercase tracking-[0.22em] text-ink/60">Filter by category</legend>
              <div className="flex flex-wrap gap-2" aria-label="Research categories">
                {RESEARCH_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={activeFilter === filter}
                    aria-controls="research-publication-grid"
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-11 border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      activeFilter === filter
                        ? 'border-ink bg-ink text-canvas'
                        : 'border-ink/22 text-ink/64 hover:border-ink/48 hover:text-ink'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mb-5 flex min-h-11 flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-ink/60">
            <p id="research-results-status" aria-live="polite" aria-atomic="true">
              Showing {filteredPublications.length} of {PUBLICATION_INDEX.length} records
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearResearchFilters}
                className="inline-flex min-h-11 items-center border-b border-ink/24 text-ink/68 transition-colors hover:border-ink hover:text-ink"
              >
                Clear filters
              </button>
            )}
          </div>

          <SurfaceGrid id="research-publication-grid" aria-describedby="research-results-status" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredPublications.map((note) => (
              <TechnicalPanel key={note.href} className="grid min-h-[285px] content-between gap-8 bg-current/[0.012]">
                <div>
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/60">
                    <span>{note.category}</span>
                    <time dateTime={normalizePublicationDate(note.date)}>{formatPublicationDate(note.date)}</time>
                  </div>
                  <h2 className="mt-8 font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                    <a href={note.href} className="transition-opacity hover:opacity-70">{note.title}</a>
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/64">{note.description}</p>
                </div>
                <a href={note.href} className="inline-flex min-h-11 w-fit items-center border-b border-current/20 text-[10px] uppercase tracking-[0.2em] text-current/64 transition-colors hover:border-current/45 hover:text-current">
                  {publicationAction(note.href)}
                </a>
              </TechnicalPanel>
            ))}
            {filteredPublications.length === 0 && (
              <div className="col-span-full grid min-h-[260px] place-items-center bg-current/[0.012] p-8 text-center">
                <div>
                  <h2 className="font-serif text-4xl italic leading-none tracking-normal text-current">No matching records.</h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-current/62">Try a broader subject or return to the full publication index.</p>
                  <button
                    type="button"
                    onClick={clearResearchFilters}
                    className="mt-6 inline-flex min-h-11 items-center border border-current px-4 text-[10px] uppercase tracking-[0.2em] text-current transition-colors hover:bg-current hover:text-[var(--page-bg)]"
                  >
                    Show all research
                  </button>
                </div>
              </div>
            )}
          </SurfaceGrid>
        </PageFrame>
      </section>

      {ARCHIVED_RESEARCH.length > 0 && (
        <section className="relative z-10 border-b border-current/12">
          <PageFrame className="py-16 xl:py-24">
            <SectionHeader eyebrow="Archive" title="Retired work, still legible.">
              These records are retained for methodology and provenance. They remain noindexed and are not current recommendations.
            </SectionHeader>
            <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {ARCHIVED_RESEARCH.map((note) => (
                <TechnicalPanel key={note.slug} className="grid min-h-[250px] content-between gap-8 bg-current/[0.012]">
                  <div>
                    <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/60">
                      <span>Archive / noindex</span>
                      <time dateTime={normalizePublicationDate(note.dateModified ?? note.date)}>
                        {formatPublicationDate(note.dateModified ?? note.date)}
                      </time>
                    </div>
                    <h2 className="mt-8 font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                      <a href={`/markets/${note.slug}`} className="transition-opacity hover:opacity-70">{note.title}</a>
                    </h2>
                    <p className="mt-5 text-sm leading-relaxed text-current/64">{note.subtitle}</p>
                  </div>
                  <a href={`/markets/${note.slug}`} className="inline-flex min-h-11 w-fit items-center border-b border-current/20 text-[10px] uppercase tracking-[0.2em] text-current/64 transition-colors hover:border-current/45 hover:text-current">
                    Review methodology
                  </a>
                </TechnicalPanel>
              ))}
            </SurfaceGrid>
          </PageFrame>
        </section>
      )}

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Context" title="From research to implementation.">
            Follow the evidence into the audit software, service process, local study, portfolio, or direct project brief it supports.
          </SectionHeader>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {researchContextLinks.map(({ label, href, description }) => (
              <LinkPanel key={href} href={href} className="grid min-h-[170px] content-between gap-6">
                <span className="font-serif text-2xl italic leading-tight tracking-normal text-current">{label}</span>
                <span className="text-sm normal-case leading-relaxed tracking-normal text-current/64">{description}</span>
              </LinkPanel>
            ))}
          </div>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/research" tone="light" />
      </PageFrame>
    </PageShell>
  );
}
