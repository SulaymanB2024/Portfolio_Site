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
import { PUBLICATION_CATEGORY_SUMMARY, PUBLICATION_INDEX } from '../content/publicationIndex';
import { researchContextLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESEARCH_ROUTE = getSeoRoute('/research')!;
const RESEARCH_COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';

export default function ResearchPage() {
  useSEO(RESEARCH_ROUTE);

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress />
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
          <SectionHeader eyebrow="Categories" title="Four ways into the work.">
            Each lane has a concrete question, source base, and boundary between observed facts and interpretation.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
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
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {PUBLICATION_INDEX.map((note) => (
              <TechnicalPanel key={note.href} className="grid min-h-[285px] content-between gap-8 bg-current/[0.012]">
                <div>
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/60">
                    <span>{note.category}</span>
                    <time>{note.date}</time>
                  </div>
                  <h2 className="mt-8 font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                    <a href={note.href} className="transition-opacity hover:opacity-70">{note.title}</a>
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/64">{note.description}</p>
                </div>
                <a href={note.href} className="w-fit border-b border-current/20 pb-1 text-[10px] uppercase tracking-[0.2em] text-current/64 transition-colors hover:border-current/45 hover:text-current">
                  Open artifact
                </a>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

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
