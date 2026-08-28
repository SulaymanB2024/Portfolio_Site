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
} from '../components/design/Primitives';
import {
  getProgrammaticPagesByFamily,
  getProgrammaticSeoHub,
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
  type ProgrammaticPageFamily,
} from '../content/programmaticSeo';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const FAMILY_LABEL: Record<ProgrammaticPageFamily, string> = {
  issue: 'Issue guides',
  platform: 'Platform guides',
  checklist: 'Audit checklists',
};

export default function ProgrammaticSeoHubPage({ path }: { path: string }) {
  const hub = getProgrammaticSeoHub(path) ?? PROGRAMMATIC_SEO_HUBS[0];
  const route = getSeoRoute(hub.path)!;
  useSEO(route);
  const pages = hub.family === 'all' ? PROGRAMMATIC_SEO_PAGES : getProgrammaticPagesByFamily(hub.family);

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="light" />
      <PageFrame className="relative z-10">
        <header className="grid min-h-[62vh] content-end border-b border-current/12 pb-14 pt-16 md:pt-20">
          <SectionEyebrow>Research / Technical SEO / {hub.family === 'all' ? 'Library' : hub.family}</SectionEyebrow>
          <EditorialHeading className="mt-8 max-w-[12ch]">{hub.title}</EditorialHeading>
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-current/68">{hub.directAnswer}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryCTA href="/method">Review the audit method</PrimaryCTA>
            <PrimaryCTA href="/contact">Discuss an audit</PrimaryCTA>
          </div>
        </header>
      </PageFrame>

      {hub.family === 'all' ? (
        <section className="relative z-10 border-b border-current/12">
          <PageFrame className="py-16 xl:py-24">
            <SectionHeader eyebrow="Collections" title="Three governed entry points.">
              Choose a reproducible symptom, a delivery platform, or an audit model; each leaf retains the same evidence and rerun contract.
            </SectionHeader>
            <SurfaceGrid className="grid grid-cols-1 md:grid-cols-3">
              {PROGRAMMATIC_SEO_HUBS.filter((item) => item.family !== 'all').map((item) => (
                <TechnicalPanel key={item.path} className="grid min-h-[230px] content-between gap-8">
                  <div><SectionEyebrow>{item.family}</SectionEyebrow><h2 className="mt-8 font-serif text-3xl italic leading-tight"><a href={item.path}>{item.title}</a></h2><p className="mt-5 text-sm leading-relaxed text-current/64">{item.description}</p></div>
                  <a href={item.path} className="text-[10px] uppercase tracking-[0.2em]">Open collection →</a>
                </TechnicalPanel>
              ))}
            </SurfaceGrid>
          </PageFrame>
        </section>
      ) : null}

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow={hub.family === 'all' ? 'Complete index' : FAMILY_LABEL[hub.family]} title={`${pages.length} evidence-backed guides.`}>
            Every entry includes a direct answer, authoritative sources, an Atlas-compatible fixture, diagnostic procedure, false-positive boundary, repair sequence, and rerun gate.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {pages.map((page) => (
              <LinkPanel key={page.path} href={page.path} className="grid min-h-[250px] content-between gap-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-current/60">{FAMILY_LABEL[page.family]}</span>
                  <h2 className="mt-7 font-serif text-3xl italic leading-[0.95] tracking-normal">{page.title}</h2>
                  <p className="mt-5 text-sm normal-case leading-relaxed tracking-normal text-current/64">{page.description}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em]">Diagnose {page.primaryQuery} →</span>
              </LinkPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 pb-8"><InternalFooter activePath="/research" tone="light" /></PageFrame>
    </PageShell>
  );
}
