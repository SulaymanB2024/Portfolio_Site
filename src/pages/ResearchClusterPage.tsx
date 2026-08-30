import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  LinkPanel,
  PageFrame,
  PageHero,
  PageShell,
  SectionEyebrow,
  SectionHeader,
  SurfaceGrid,
  TechnicalPanel,
} from '../components/design/Primitives';
import {
  CONTENT_CLUSTERS,
  getContentClusterByPath,
  getPublicationsForCluster,
} from '../content/contentClusters';
import { getProjectsForCluster, isExternalProjectHref } from '../content/projectIndex';
import { getSeoRoute } from '../seo/routes';
import { formatPublicationDate, normalizePublicationDate } from '../utils/publicationDate';
import { useSEO } from '../utils/seo';

export default function ResearchClusterPage({ path }: { path: string }) {
  const cluster = getContentClusterByPath(path);
  const route = getSeoRoute(path);
  useSEO(route ?? getSeoRoute('/research')!);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!cluster || !route) return null;

  const publications = getPublicationsForCluster(cluster);
  const projects = getProjectsForCluster(cluster.id);
  const featured = cluster.featuredPaths
    .map((featuredPath) => publications.find((item) => item.href === featuredPath))
    .filter((item): item is (typeof publications)[number] => Boolean(item));

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-28" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/research" tone="light" />

      <PageFrame>
        <PageHero
          eyebrow={`Research cluster / ${cluster.eyebrow}`}
          title={cluster.title}
          intro={cluster.description}
          aside={(
            <div className="grid gap-6">
              <p>{cluster.directAnswer}</p>
              <dl className="grid grid-cols-2 gap-px border border-current/14 bg-current/14 text-center">
                <div className="bg-canvas p-4">
                  <dt className="text-[9px] uppercase tracking-[0.2em] text-current/52">Published records</dt>
                  <dd className="mt-2 font-serif text-3xl italic">{publications.length}</dd>
                </div>
                <div className="bg-canvas p-4">
                  <dt className="text-[9px] uppercase tracking-[0.2em] text-current/52">Project families</dt>
                  <dd className="mt-2 font-serif text-3xl italic">{projects.length}</dd>
                </div>
              </dl>
            </div>
          )}
          className="min-h-[58vh]"
        />

        <nav aria-label="Research clusters" className="grid gap-px border-b border-current/12 bg-current/12 sm:grid-cols-2 xl:grid-cols-4">
          {CONTENT_CLUSTERS.map((item, index) => (
            <a
              key={item.id}
              href={item.path}
              aria-current={item.id === cluster.id ? 'page' : undefined}
              className={`grid min-h-[112px] content-between gap-4 p-4 transition-colors ${
                item.id === cluster.id
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas text-ink/68 hover:bg-ink hover:text-canvas'
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.22em] opacity-58">{String(index + 1).padStart(2, '0')}</span>
              <span className="font-serif text-2xl italic leading-none">{item.shortTitle}</span>
            </a>
          ))}
        </nav>
      </PageFrame>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Start here" title={`${featured.length} useful entry points.`}>
            Begin with the strongest overview, then follow the source ledger and neighboring records instead of reading the archive chronologically.
          </SectionHeader>
          <SurfaceGrid className={`grid grid-cols-1 ${featured.length > 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {featured.map((item, index) => (
              <LinkPanel key={item.href} href={item.href} className="grid min-h-[280px] content-between gap-8">
                <div>
                  <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/56">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <time dateTime={normalizePublicationDate(item.date)}>{formatPublicationDate(item.date)}</time>
                  </div>
                  <h2 className="mt-10 font-serif text-4xl italic leading-[0.92] tracking-normal">{item.title}</h2>
                  <p className="mt-5 text-sm normal-case leading-relaxed tracking-normal text-current/64">{item.description}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em]">Open record →</span>
              </LinkPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Cluster contract" title="The questions hold it together.">
            A cluster earns its own route when the same decision can be investigated across multiple articles and project systems.
          </SectionHeader>
          <ol className="divide-y divide-current/14 border-y border-current/14">
            {cluster.questions.map((question, index) => (
              <li key={question} className="grid gap-5 py-7 md:grid-cols-[5rem_minmax(0,1fr)] md:items-start md:px-4">
                <span className="font-serif text-2xl italic text-current/48">Q{index + 1}</span>
                <p className="max-w-4xl text-xl leading-relaxed text-current/78">{question}</p>
              </li>
            ))}
          </ol>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Complete cluster index" title={`${publications.length} published records.`}>
            Every current publication assigned to this cluster appears below. Dates describe the public record; they are not a freshness claim about an underlying external source.
          </SectionHeader>
          <div className="divide-y divide-current/14 border-y border-current/14">
            {publications.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="group grid gap-5 py-7 transition-colors hover:bg-current/[0.025] md:grid-cols-[5rem_minmax(0,1fr)_minmax(150px,0.2fr)] md:items-center md:px-4"
              >
                <span className="font-serif text-xl italic text-current/52">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.21em] text-current">{item.title}</span>
                  <span className="mt-2 block max-w-3xl text-sm leading-relaxed text-current/62">{item.description}</span>
                </span>
                <time dateTime={normalizePublicationDate(item.date)} className="text-[10px] uppercase tracking-[0.2em] text-current/54 md:text-right">
                  {formatPublicationDate(item.date)}
                </time>
              </a>
            ))}
          </div>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Connected systems" title="Research meets implementation.">
            These project families produce, test, apply, or constrain the ideas in this cluster. Private status is shown explicitly and never replaced with a public link that does not exist.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const external = isExternalProjectHref(project.href);
              return (
                <TechnicalPanel key={project.id} data-project-family-id={project.id} className="grid min-h-[300px] content-between gap-8 bg-current/[0.012]">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-current/56">
                      <span>{project.statusLabel}</span>
                      <span>{project.visibilityLabel}</span>
                    </div>
                    <h2 className="mt-8 font-serif text-3xl italic leading-[0.94] tracking-normal">{project.title}</h2>
                    <p className="mt-5 text-sm leading-relaxed text-current/68">{project.summary}</p>
                    <p className="mt-4 border-l border-current/20 pl-4 text-xs leading-relaxed text-current/52">{project.evidenceBoundary}</p>
                  </div>
                  <div className="flex flex-wrap items-end justify-between gap-4 text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-current/54">{project.ownershipLabel}</span>
                    {project.href ? (
                      <a href={project.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="border-b border-current/24 pb-1 text-current/74 hover:text-current">
                        {project.linkLabel ?? 'Open evidence'}
                      </a>
                    ) : (
                      <span className="text-current/46">No public link</span>
                    )}
                  </div>
                </TechnicalPanel>
              );
            })}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/research" tone="light" />
      </PageFrame>
    </PageShell>
  );
}
