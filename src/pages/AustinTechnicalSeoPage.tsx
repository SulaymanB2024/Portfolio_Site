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
  PrimaryCTA,
  SectionHeader,
  SurfaceGrid,
  TechnicalPanel,
  TextLink,
} from '../components/design/Primitives';
import { austinSeoSignals } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const AUSTIN_SEO = getSeoRoute('/austin-technical-seo')!;
const austinArtifactItems = austinSeoSignals.slice(0, 4).map((signal, index) => ({
  label: `Signal ${String(index + 1).padStart(2, '0')}`,
  value: signal,
}));

export default function AustinTechnicalSeoPage() {
  useSEO(AUSTIN_SEO);

  return (
    <PageShell id="top" tone="dark">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/method" tone="dark" />

      <PageFrame className="relative z-10">
        <section className="grid grid-cols-1 gap-8 pb-20 pt-12 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[minmax(0,0.48fr)_minmax(340px,0.52fr)] lg:gap-12 lg:pt-16 xl:pt-20">
          <div className="self-end">
            <p className="mb-8 text-[10px] uppercase tracking-[0.28em] text-current/48">Austin technical SEO</p>
            <h1 className="max-w-6xl font-serif text-[3.8rem] md:text-[6.5rem] xl:text-[9rem] italic leading-[0.84] tracking-normal">
              Austin technical SEO and AI-search visibility.
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-current/64 lg:mt-10">
              A local service page for Austin teams that need crawlability, indexation, structured data, source clarity, and technical search evidence reviewed before broader content or growth work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 lg:mt-10">
              <PrimaryCTA href="/contact" className="text-accent hover:text-[var(--page-bg)]">
                Request an audit
              </PrimaryCTA>
              <TextLink href="/method" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                Read the technical SEO audit method
              </TextLink>
              <TextLink href="/atlas/sample-crawl" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                See an Atlas sample crawl run
              </TextLink>
              <TextLink href="/research/austin-crawlability-benchmark-pilot.csv" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                Download the Austin crawlability pilot
              </TextLink>
            </div>
          </div>

          <DarkProofArtifactPanel
            className="self-center max-md:-mt-4 lg:ml-auto"
            eyebrow="Local proof stack"
            title="Evidence before local SEO claims."
            summary="The page keeps the Austin frame tied to crawlable surfaces, source clarity, and implementation evidence."
            items={austinArtifactItems}
            footer="Public page review first. Analytics and Search Console only when access is available."
          />
        </section>
      </PageFrame>

      <section className="relative z-10 border-y border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Review surfaces" title="What gets checked.">
            The local frame is useful only when it is backed by crawlable pages, real source signals, and implementation detail. This page does not claim local rankings, traffic movement, or AI citations.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {austinSeoSignals.map((signal, index) => (
              <TechnicalPanel key={signal} className="min-h-[150px]">
                <p className="mb-7 text-[10px] uppercase tracking-[0.2em] text-current/42">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-sm leading-relaxed text-current/72">{signal}</h3>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 py-16">
        <section className="grid gap-8 border border-current/14 p-6 md:p-10 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
              Built for evidence, not vague local SEO.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-current/62">
              The audit starts with public pages and technical signals. When analytics or Google Search Console access is available, those sources can support prioritization, but they are not invented into the public claim.
            </p>
          </div>
          <div className="grid content-center gap-4 text-[10px] uppercase tracking-[0.2em]">
            <LinkPanel href="/void-agency">
              View Void Agency proof
            </LinkPanel>
            <LinkPanel href="/case-studies/technical-seo-audit">
              Read the technical SEO case study
            </LinkPanel>
          </div>
        </section>
      </PageFrame>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/method" tone="dark" />
      </PageFrame>
    </PageShell>
  );
}
