import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  LinkPanel,
  EditorialHeading,
  PageFrame,
  PageShell,
  PrimaryCTA,
  SectionHeader,
  SectionEyebrow,
  SurfaceGrid,
  TechnicalPanel,
  TextLink,
} from '../components/design/Primitives';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESEARCH_ROUTE = getSeoRoute('/research')!;
const RESEARCH_COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';

const featuredResearchNotes = [
  {
    kicker: 'Crawler access',
    title: 'Crawler Policy Comes Before Visibility',
    href: '/markets/ai-search-crawler-policy',
    description:
      'A note on crawler access, redirects, and why discovery has to be settled before visibility claims matter.',
  },
  {
    kicker: 'Public data',
    title: 'Technical SEO as Public Data Infrastructure',
    href: '/markets/technical-seo-public-data-infrastructure',
    description:
      'A practical bridge between crawlability, structured data, provenance, and public records people can inspect.',
  },
  {
    kicker: 'Identity',
    title: 'Canonical Identity for Personal SEO',
    href: '/markets/canonical-identity-personal-seo',
    description:
      'A reconciliation checklist for profiles, stale PDFs, source pages, and external bio consistency.',
  },
  {
    kicker: 'Atlas',
    title: 'Atlas Sample Crawl Run',
    href: '/atlas/sample-crawl',
    description:
      'A sanitized walkthrough of how crawl rows, canonical state, depth, links, and issue labels become reviewable evidence.',
  },
];

const relatedResearchRoutes = [
  {
    label: 'Atlas audit console',
    href: '/atlas',
    description: 'The crawl and evidence workflow behind the audit examples.',
  },
  {
    label: 'Markets research',
    href: '/markets',
    description: 'Finance notes, assumptions, and source-backed market questions.',
  },
  {
    label: 'Selected work',
    href: '/work',
    description: 'Projects, case studies, and public work in one place.',
  },
];

export default function ResearchPage() {
  useSEO(RESEARCH_ROUTE);

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-35" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="light" />

      <PageFrame className="relative z-10">
        <section className="relative grid min-h-[64vh] items-end gap-12 overflow-hidden border-b border-current/12 pb-14 pt-16 md:pt-20 lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
          <div className="relative z-10 min-w-0">
            <SectionEyebrow className="text-ink/48">Research</SectionEyebrow>
            <EditorialHeading className="mt-8">Research notes.</EditorialHeading>
            <div className="mt-8 max-w-3xl text-base leading-relaxed text-current/64">
              <p>
                Selected notes on search systems, crawlability, Atlas, public data, and markets work. Each piece is meant to stand on its own.
              </p>
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none relative z-0 -my-12 hidden min-h-[520px] select-none lg:block">
            <img
              src={RESEARCH_COIN_ART}
              alt=""
              className="absolute left-[-4rem] top-1/2 h-auto w-[min(1120px,72vw)] max-w-none -translate-y-1/2 opacity-60 mix-blend-multiply"
              draggable={false}
            />
          </div>

          <div aria-hidden="true" className="pointer-events-none relative z-0 -mt-8 min-h-[260px] overflow-hidden lg:hidden">
            <img
              src={RESEARCH_COIN_ART}
              alt=""
              className="absolute left-1/2 top-1/2 h-auto w-[min(760px,145vw)] max-w-none -translate-x-[38%] -translate-y-1/2 opacity-40 mix-blend-multiply"
              draggable={false}
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-5 border-b border-current/12 py-8">
          <PrimaryCTA href="/contact" id="research-contact-link">
            Discuss a project
          </PrimaryCTA>
          <TextLink href="/markets" id="research-markets-link" className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current">
            Markets notes
          </TextLink>
          <TextLink href="/atlas" id="research-atlas-link" className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current">
            Atlas work
          </TextLink>
        </div>
      </PageFrame>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Selected notes" title="Readable research.">
            Notes and essays across search systems, crawlability, public data, and markets.
          </SectionHeader>

          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {featuredResearchNotes.map((note) => (
              <TechnicalPanel key={note.href} className="grid min-h-[270px] content-between gap-8 bg-current/[0.012]">
                <div>
                  <p className="mb-7 text-[10px] uppercase tracking-[0.22em] text-current/42">{note.kicker}</p>
                  <h2 className="font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                    <a href={note.href} className="transition-opacity hover:opacity-70">
                      {note.title}
                    </a>
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/62">{note.description}</p>
                </div>

                <a href={note.href} className="w-fit border-b border-current/18 pb-1 text-[10px] uppercase tracking-[0.2em] text-current/58 transition-colors hover:border-current/42 hover:text-current">
                  Read note
                </a>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Related work" title="Project context.">
            The main project pages behind the research notes.
          </SectionHeader>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {relatedResearchRoutes.map((route) => (
              <LinkPanel key={route.href} href={route.href} className="grid min-h-[170px] content-between gap-6">
                <span className="font-serif text-2xl italic leading-tight tracking-normal text-current">{route.label}</span>
                <span className="text-sm normal-case leading-relaxed tracking-normal text-current/58">{route.description}</span>
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
