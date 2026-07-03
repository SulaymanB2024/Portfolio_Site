import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  DarkProofArtifactPanel,
  LinkPanel,
  PageFrame,
  PageShell,
  SectionHeader,
  SurfaceGrid,
  TechnicalPanel,
} from '../components/design/Primitives';
import { auditCaseStudySteps, auditExampleFindingChain, contextualProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CASE_STUDY_SEO = getSeoRoute('/case-studies/technical-seo-audit')!;
const reviewChain = [
  ['Observed field', 'Status code, crawl depth, inlinks, outlinks, canonical state, and indexability.'],
  ['Interpreted risk', 'Duplicate templates, weak hub copy, missing canonical targets, soft-404 risk, or crawl-depth waste.'],
  ['Implementation action', 'Repair canonicals, strengthen internal links, consolidate pages, update templates, and document ownership.'],
  ['Review package', 'Sanitized CSV, issue list, method page, source notes, and intake path for next review.'],
];

const reviewPanelItems = reviewChain.map(([label, value], index) => ({
  label,
  value,
  status: String(index + 1).padStart(2, '0'),
}));

export default function TechnicalSeoCaseStudyPage() {
  useSEO(CASE_STUDY_SEO);

  return (
    <PageShell id="top" tone="dark">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/work" tone="dark" />

      <article className="relative z-10">
        <PageFrame className="py-16 xl:py-24">
          <header className="grid grid-cols-1 gap-12 border-b border-current/12 pb-14 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[minmax(0,0.48fr)_minmax(340px,0.52fr)]">
            <div className="self-end">
              <p className="mb-8 text-[10px] uppercase tracking-[0.28em] text-current/48">Case study / sanitized</p>
              <h1 className="max-w-6xl font-serif text-[3.7rem] md:text-[6.5rem] xl:text-[9rem] italic leading-[0.84] tracking-normal">
                Technical SEO audit case study.
              </h1>
              <p className="mt-10 max-w-3xl text-base leading-relaxed text-current/64">
                A public case-study frame for turning crawl data into implementation work without exposing private client records or claiming unverified search outcomes.
              </p>
            </div>

            <DarkProofArtifactPanel
              className="self-center lg:ml-auto"
              eyebrow="Review path"
              title="From crawl field to review package."
              summary="The useful audit path is observable field, interpreted risk, implementation action, and review package. Each step stays tied to the crawl table."
              items={reviewPanelItems}
              footer="Sanitized public frame. No private traffic, ranking, revenue, or answer-placement claims."
            />
          </header>

          <section className="border-b border-current/12 py-16">
            <SectionHeader eyebrow="Sanitized process" title="What this case study shows.">
              The case study is a method frame, not a private client outcome report. It keeps observed crawl data separate from interpreted risk and implementation advice.
            </SectionHeader>
            <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {auditCaseStudySteps.map((step, index) => (
                <TechnicalPanel key={step.title} className="min-h-[250px] p-6">
                  <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-current/42">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-xs uppercase leading-relaxed tracking-[0.18em] text-current">{step.title}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/62">{step.copy}</p>
                </TechnicalPanel>
              ))}
            </SurfaceGrid>
          </section>

          <section className="border-b border-current/12 py-16">
            <SectionHeader eyebrow="Sanitized example" title="One finding chain.">
              A useful audit does not jump from a crawl field to a recommendation. It keeps the observed row, interpreted risk, implementation action, and boundary visible.
            </SectionHeader>
            <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {auditExampleFindingChain.map((item, index) => (
                <TechnicalPanel key={item.label} className="min-h-[230px] p-6">
                  <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-current/42">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-xs uppercase leading-relaxed tracking-[0.18em] text-current">{item.label}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/62">{item.value}</p>
                </TechnicalPanel>
              ))}
            </SurfaceGrid>
          </section>

          <section className="py-16">
            <h2 className="mb-8 text-[10px] uppercase tracking-[0.28em] text-current/48">Contextual links</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {contextualProofLinks.map((link) => (
                <LinkPanel
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="min-h-[180px]"
                >
                  <h3 className="text-xs uppercase leading-relaxed tracking-[0.18em] text-inherit">{link.label}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.description}</p>
                </LinkPanel>
              ))}
            </div>
          </section>
        </PageFrame>
      </article>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/work" tone="dark" />
      </PageFrame>
    </PageShell>
  );
}
