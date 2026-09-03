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
import { CONTENT_CLUSTERS, getPublicationsForCluster } from '../content/contentClusters';
import { getProjectsForCluster, isExternalProjectHref } from '../content/projectIndex';
import {
  getProgrammaticPagesByFamily,
  getProgrammaticSeoHub,
  PROGRAMMATIC_SEO_HUBS,
  PROGRAMMATIC_SEO_PAGES,
  type ProgrammaticPageFamily,
} from '../content/programmaticSeo';
import { getSeoRoute } from '../seo/routes';
import { formatPublicationDate, normalizePublicationDate } from '../utils/publicationDate';
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
  const connectedProjects = getProjectsForCluster('technical-seo');
  const clusterPublications = getPublicationsForCluster('technical-seo').filter((item) => item.href !== hub.path);

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
        <PageFrame>
          <nav aria-label="Research clusters" className="grid gap-px border-b border-current/12 bg-current/12 sm:grid-cols-2 xl:grid-cols-4">
            {CONTENT_CLUSTERS.map((cluster, index) => (
              <a key={cluster.id} href={cluster.path} aria-current={cluster.id === 'technical-seo' ? 'page' : undefined} className={`grid min-h-[112px] content-between gap-4 p-4 transition-colors ${cluster.id === 'technical-seo' ? 'bg-ink text-canvas' : 'bg-canvas text-ink/68 hover:bg-ink hover:text-canvas'}`}>
                <span className="text-[9px] uppercase tracking-[0.22em] opacity-58">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-serif text-2xl italic leading-none">{cluster.shortTitle}</span>
              </a>
            ))}
          </nav>
        </PageFrame>
      ) : null}

      {hub.family === 'all' ? (
        <section className="relative z-10 border-b border-current/12">
          <PageFrame className="py-16 xl:py-24">
            <SectionHeader eyebrow="Collections" title="Three paths into the library.">
              Choose a reproducible symptom, a delivery platform, or an audit model. Every guide uses the same diagnostic structure and verification standard.
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
          <SectionHeader eyebrow={hub.family === 'all' ? 'Complete index' : FAMILY_LABEL[hub.family]} title={`${pages.length} technical guides.`}>
            Every entry includes a direct answer, primary sources, an Atlas-compatible example, a diagnostic procedure, false-positive limits, a repair sequence, and a verification check.
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

      {hub.family === 'all' ? (
        <section className="relative z-10 border-b border-current/12">
          <PageFrame className="py-16 xl:py-24">
            <SectionHeader eyebrow="Studies and public artifacts" title={`${clusterPublications.length} cluster records beyond the guide library.`}>
              The diagnostic library is the repeatable repair layer. These articles, crawl samples, and bounded studies provide the broader research and source evidence.
            </SectionHeader>
            <div className="divide-y divide-current/14 border-y border-current/14">
              {clusterPublications.map((item, index) => (
                <a key={item.href} href={item.href} className="grid gap-5 py-7 transition-colors hover:bg-current/[0.025] md:grid-cols-[5rem_minmax(0,1fr)_minmax(150px,0.2fr)] md:items-center md:px-4">
                  <span className="font-serif text-xl italic text-current/52">{String(index + 1).padStart(2, '0')}</span>
                  <span><span className="block text-[11px] uppercase tracking-[0.21em]">{item.title}</span><span className="mt-2 block max-w-3xl text-sm leading-relaxed text-current/62">{item.description}</span></span>
                  <time dateTime={normalizePublicationDate(item.date)} className="text-[10px] uppercase tracking-[0.2em] text-current/54 md:text-right">{formatPublicationDate(item.date)}</time>
                </a>
              ))}
            </div>
          </PageFrame>
        </section>
      ) : null}

      {hub.family === 'all' ? (
        <section className="relative z-10 border-b border-current/12">
          <PageFrame className="py-16 xl:py-24">
            <SectionHeader eyebrow="Connected systems" title={`${connectedProjects.length} project families.`}>
              These public and private systems apply the diagnostic contract. Status and evidence boundaries remain visible even when a repository is not public.
            </SectionHeader>
            <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {connectedProjects.map((project) => {
                const external = isExternalProjectHref(project.href);
                return (
                  <TechnicalPanel key={project.id} data-project-family-id={project.id} className="grid min-h-[260px] content-between gap-7">
                    <div>
                      <div className="flex flex-wrap justify-between gap-3 text-[9px] uppercase tracking-[0.19em] text-current/54"><span>{project.statusLabel}</span><span>{project.visibilityLabel}</span></div>
                      <h2 className="mt-8 font-serif text-3xl italic leading-none">{project.title}</h2>
                      <p className="mt-5 text-sm leading-relaxed text-current/64">{project.summary}</p>
                      <p className="mt-4 border-l border-current/20 pl-4 text-xs leading-relaxed text-current/50">{project.evidenceBoundary}</p>
                    </div>
                    {project.href ? <a href={project.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="text-[10px] uppercase tracking-[0.2em]">{project.linkLabel ?? 'Open evidence'} →</a> : <span className="text-[10px] uppercase tracking-[0.2em] text-current/44">Private working record</span>}
                  </TechnicalPanel>
                );
              })}
            </SurfaceGrid>
          </PageFrame>
        </section>
      ) : null}

      <PageFrame className="relative z-10 pb-8"><InternalFooter activePath="/research" tone="light" /></PageFrame>
    </PageShell>
  );
}
