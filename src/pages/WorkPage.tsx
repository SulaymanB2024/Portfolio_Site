import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { CONTENT_CLUSTERS } from '../content/contentClusters';
import { buyerDecisionEvidence } from '../content/evidenceLists';
import {
  PROJECT_FAMILY_COUNT,
  getProjectsForCluster,
  isExternalProjectHref,
} from '../content/projectIndex';
import { workProofCards } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const WORK_SEO = getSeoRoute('/work')!;

const supportingArtifacts = [
  {
    label: 'Worked finding example',
    href: '/method#worked-finding',
    description: 'A field → review → rerun example embedded in the audit method, not a client-outcome case study.',
  },
  {
    label: 'Atlas open-corpus run CSV',
    href: '/research/atlas-open-corpus-run-2026-07-16.csv',
    description: 'The dated source table behind the public Atlas demonstration.',
  },
  {
    label: 'Technical SEO audit method',
    href: '/method',
    description: 'Scope, stages, deliverables, inputs, exclusions, and acceptance checks.',
  },
  {
    label: 'Appian assumptions table',
    href: '/research/appian-assumptions-table.csv',
    description: 'A finance-research assumption table with educational-use limits.',
  },
];

function fieldLabel(label: string) {
  return <dt className="text-[10px] uppercase tracking-[0.22em] text-canvas/60">{label}</dt>;
}

export default function WorkPage() {
  useSEO(WORK_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-clip bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/work" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[54vh] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">Project ledger / {PROJECT_FAMILY_COUNT} verified families</p>
        <h1 className="max-w-5xl font-serif text-[4rem] italic leading-[0.82] tracking-normal md:text-[7.5rem] xl:text-[10rem]">
          Systems I built. Evidence you can inspect.
        </h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-canvas/68">
          Six flagship records show the deepest public proof. The complete ledger below also includes active systems, studies, contributions, prototypes, and archived design families, each with explicit ownership, status, visibility, and a boundary on what the evidence proves.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-px border-y border-canvas/14 bg-canvas/14 px-4 py-16 md:px-8 lg:grid-cols-2 xl:px-10">
        {workProofCards.map((item, index) => {
          const externalProject = item.href.startsWith('http');
          const externalEvidence = item.evidenceHref.startsWith('http');

          return (
            <article key={item.title} className="group relative grid min-h-[610px] content-between gap-10 overflow-hidden bg-ink p-6 transition-colors duration-300 hover:bg-ink/94 md:p-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-canvas/60">
                  <span>{String(index + 1).padStart(2, '0')} / {item.eyebrow}</span>
                  <span className="rounded-full border border-canvas/20 px-3 py-1.5 text-accent">{item.statusLabel}</span>
                </div>

                <h2 className="mt-10 max-w-xl font-serif text-[2.8rem] italic leading-[0.92] tracking-normal text-canvas md:text-[4rem]">
                  <a href={item.href} data-portfolio-cta="work_open_project" target={externalProject ? '_blank' : undefined} rel={externalProject ? 'noreferrer' : undefined} className="transition-opacity hover:opacity-72">
                    {item.title}
                  </a>
                </h2>

                <dl className="mt-10 grid gap-6 text-sm leading-relaxed text-canvas/72 sm:grid-cols-2">
                  <div>
                    {fieldLabel('Problem')}
                    <dd className="mt-2">{item.problem}</dd>
                  </div>
                  <div>
                    {fieldLabel('My role')}
                    <dd className="mt-2">{item.role}</dd>
                  </div>
                  <div>
                    {fieldLabel('What I built')}
                    <dd className="mt-2">{item.built}</dd>
                  </div>
                  <div>
                    {fieldLabel('Constraints')}
                    <dd className="mt-2">{item.constraints}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-canvas/14 pt-6">
                <div className="grid gap-5 md:grid-cols-[0.42fr_0.58fr]">
                  <div>
                    {fieldLabel('Current status')}
                    <p className="mt-2 text-sm leading-relaxed text-canvas/76">{item.status}</p>
                  </div>
                  <div>
                    {fieldLabel('Deliberately not public')}
                    <p className="mt-2 text-sm leading-relaxed text-canvas/66">{item.notPublic}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
                  <a href={item.href} data-portfolio-cta="work_open_project" target={externalProject ? '_blank' : undefined} rel={externalProject ? 'noreferrer' : undefined} className="inline-flex min-h-11 items-center border-b border-canvas/28 text-canvas/74 transition-colors hover:border-canvas hover:text-canvas">
                    {item.projectLabel}
                  </a>
                  <a href={item.evidenceHref} data-portfolio-cta="work_open_evidence" target={externalEvidence ? '_blank' : undefined} rel={externalEvidence ? 'noreferrer' : undefined} className="inline-flex min-h-11 items-center border-b border-accent/40 text-accent transition-colors hover:border-canvas hover:text-canvas">
                    {item.evidenceLabel}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-b border-canvas/14 px-4 py-16 md:px-8 xl:px-10 xl:py-24" aria-labelledby="complete-project-ledger-title">
        <div className="mb-12 grid gap-8 border-b border-canvas/14 pb-9 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/60">Complete project ledger</p>
            <h2 id="complete-project-ledger-title" className="mt-5 font-serif text-[3rem] italic leading-[0.9] tracking-normal md:text-[4.5rem] xl:text-[6rem]">
              Every defensible project family.
            </h2>
          </div>
          <div className="max-w-3xl text-sm leading-relaxed text-canvas/66">
            <p>
              {PROJECT_FAMILY_COUNT} families are grouped by the research question they support. Duplicate clones, superseded copies, upstream workshops, generated worktrees, support folders, and undocumented placeholders are consolidated or excluded rather than inflated into separate projects.
            </p>
            <p className="mt-4 text-canvas/50">
              “Private” means the project is named and bounded here without exposing a repository or claiming a public deployment.
            </p>
          </div>
        </div>

        <div className="grid gap-16">
          {CONTENT_CLUSTERS.map((cluster, clusterIndex) => {
            const projects = getProjectsForCluster(cluster.id);

            return (
              <section key={cluster.id} id={`projects-${cluster.id}`} aria-labelledby={`projects-${cluster.id}-title`}>
                <header className="mb-6 grid gap-5 md:grid-cols-[5rem_minmax(0,1fr)_minmax(180px,0.22fr)] md:items-end">
                  <span className="font-serif text-2xl italic text-accent">{String(clusterIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-canvas/50">{cluster.eyebrow}</p>
                    <h3 id={`projects-${cluster.id}-title`} className="mt-3 font-serif text-4xl italic leading-none tracking-normal text-canvas">{cluster.title}</h3>
                  </div>
                  <a href={cluster.path} className="inline-flex min-h-11 items-center border-b border-canvas/24 text-[10px] uppercase tracking-[0.2em] text-canvas/62 hover:border-accent hover:text-accent md:justify-self-end">
                    {projects.length} families / open cluster
                  </a>
                </header>

                <div className="divide-y divide-canvas/14 border-y border-canvas/14">
                  {projects.map((project, index) => {
                    const external = isExternalProjectHref(project.href);

                    return (
                      <article key={project.id} data-project-family-id={project.id} className="grid gap-6 py-7 md:grid-cols-[4rem_minmax(0,0.62fr)_minmax(260px,0.38fr)] md:px-4">
                        <span className="font-serif text-xl italic text-canvas/40">{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[9px] uppercase tracking-[0.19em] text-canvas/52">
                            <span>{project.statusLabel}</span>
                            <span>{project.visibilityLabel}</span>
                          </div>
                          <h4 className="mt-4 font-serif text-3xl italic leading-[0.95] tracking-normal text-canvas">{project.title}</h4>
                          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-canvas/68">{project.summary}</p>
                        </div>
                        <div className="grid content-between gap-5 border-l border-canvas/14 pl-5">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-canvas/48">Evidence boundary</p>
                            <p className="mt-3 text-xs leading-relaxed text-canvas/58">{project.evidenceBoundary}</p>
                          </div>
                          <div className="flex flex-wrap items-end justify-between gap-4 text-[9px] uppercase tracking-[0.18em]">
                            <span className="text-canvas/48">{project.ownershipLabel}</span>
                            {project.href ? (
                              <a
                                href={project.href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noreferrer' : undefined}
                                data-portfolio-cta="work_open_project"
                                className="border-b border-canvas/24 pb-1 text-canvas/70 hover:border-accent hover:text-accent"
                              >
                                {project.linkLabel ?? 'Open evidence'}
                              </a>
                            ) : (
                              <span className="text-canvas/38">No public link</span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[3rem] italic leading-[0.9] tracking-normal md:text-[4.5rem] xl:text-[6rem]">Supporting artifacts.</h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/68">
            Samples and method files help verify the primary work. They do not replace a real project, research question, or operating artifact.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {supportingArtifacts.map((artifact) => (
            <a key={artifact.href} href={artifact.href} data-portfolio-cta="work_open_artifact" className="group min-h-[220px] border border-canvas/14 p-5 transition-colors hover:bg-canvas hover:text-ink">
              <h3 className="text-xs uppercase leading-relaxed tracking-[0.22em] text-inherit">{artifact.label}</h3>
              <p className="mt-6 text-sm leading-relaxed text-inherit opacity-70">{artifact.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="buyer-decision-title"
        className="relative z-10 mx-auto grid max-w-[1480px] gap-10 border-t border-canvas/14 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] xl:px-10 xl:py-24"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/60">Evidence before intake</p>
          <h2 id="buyer-decision-title" className="mt-5 max-w-xl font-serif text-[3rem] italic leading-[0.9] tracking-normal md:text-[4.5rem]">
            Make three decisions before contact.
          </h2>
          <p className="mt-7 max-w-lg text-sm leading-relaxed text-canvas/64">
            A serious brief should make the standard, the available proof, and the blocked decision inspectable. These public records let you evaluate the first two before sharing a site.
          </p>
        </div>

        <ol className="grid gap-px border border-canvas/14 bg-canvas/14">
          {buyerDecisionEvidence.map((item, index) => (
            <li key={item.question} className="group grid gap-6 bg-ink p-5 transition-colors duration-200 hover:bg-canvas/[0.045] motion-reduce:transition-none sm:grid-cols-[3.5rem_minmax(0,1fr)] md:p-7">
              <span aria-hidden="true" className="text-[10px] uppercase tracking-[0.24em] text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-sm font-medium leading-relaxed text-canvas">{item.question}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-canvas/64">{item.answer}</p>
                <a
                  href={item.href}
                  data-portfolio-cta="work_open_artifact"
                  className="mt-5 inline-flex min-h-11 items-center border-b border-canvas/24 text-[10px] uppercase tracking-[0.2em] text-canvas/70 transition-colors hover:border-accent hover:text-accent"
                >
                  {item.action}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-12 md:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.34fr)] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/60">Decision ready?</p>
            <h2 className="mt-4 max-w-3xl font-serif text-[2.8rem] italic leading-[0.92] tracking-normal md:text-[4rem]">
              Bring one surface, one evidence gap, and the decision it blocks.
            </h2>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-canvas/54" aria-label="Useful brief inputs">
              <li>Site or product surface</li>
              <li>Suspected issue</li>
              <li>Decision and owner</li>
            </ul>
          </div>
          <div>
            <p className="mb-5 max-w-sm text-xs leading-relaxed text-canvas/54">
              Do not send credentials or sensitive client data in the first email. Public method and sample evidence remain open for review.
            </p>
            <a
              href="/contact"
              data-portfolio-cta="work_open_contact"
              className="inline-flex min-h-11 w-fit items-center border border-canvas bg-canvas px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-accent"
            >
              Open direct contact
            </a>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/work" tone="dark" />
      </div>
    </main>
  );
}
