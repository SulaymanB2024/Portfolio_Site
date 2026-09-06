import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { buyerDecisionEvidence } from '../content/evidenceLists';
import { workProofCards } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const WORK_SEO = getSeoRoute('/work')!;

const supportingArtifacts = [
  {
    label: 'Worked finding example',
    href: 'https://www.void-agency.com/tools/technical-seo-audit-checklist',
    description: 'VOID’s worked field → review → rerun example, not a client-outcome case study.',
  },
  {
    label: 'Atlas open-corpus run CSV',
    href: '/research/atlas-open-corpus-run-2026-07-16.csv',
    description: 'The dated source table behind the public Atlas demonstration.',
  },
  {
    label: 'Technical SEO audit method',
    href: 'https://www.void-agency.com/tools/technical-seo-audit-checklist',
    description: 'VOID’s canonical scope, stages, evidence format, prioritization, and acceptance checks.',
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

      <section className="relative z-10 mx-auto grid min-h-[62vh] max-w-[1480px] content-end px-4 pb-16 pt-20 md:px-8 xl:px-10">
        <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">Selected work / six public records</p>
        <h1 className="max-w-5xl font-serif text-[4rem] italic leading-[0.82] tracking-normal md:text-[7.5rem] xl:text-[10rem]">
          Systems I built. Evidence you can inspect.
        </h1>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-canvas/68">
          Each entry names the problem, my ownership, the system, study, or practice I built, its constraints, its current state, and the public record linked to the claim. Product status and public proof are separated; published architecture is not presented as a deployed service.
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
