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
import {
  austinBenchmarkLimits,
  austinBenchmarkSnapshot,
  austinDiagnosticExamples,
  austinPilotMethod,
  austinSeoSignals,
} from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const AUSTIN_SEO = getSeoRoute('/austin-technical-seo')!;
const austinArtifactItems = austinSeoSignals.slice(0, 4).map((signal, index) => ({
  label: `Signal ${String(index + 1).padStart(2, '0')}`,
  value: signal,
}));
const austinDeliverables = [
  'A short URL-level issue list with observed fields, affected pages, severity, and implementation notes.',
  'A crawlability and source-clarity review covering robots.txt, sitemap, canonicals, structured data, internal links, and page copy.',
  'A local-intent map that pairs each priority query family with the ranking URL, proof block, CTA path, and measurement field.',
  'A practical next-step order for founders, marketers, or developers, with unsupported ranking and traffic claims left out.',
];

const austinBuyerFit = [
  'Austin founders, local service owners, and small growth teams that need to know whether their important pages can be crawled, understood, and measured.',
  'Teams with a site redesign, new service page, local landing page, or migration that needs a technical review before more content is added.',
  'Operators who want a short implementation list, not a broad SEO retainer or vague visibility score.',
];

const austinWhenNotToHire = [
  'You need paid ads, social media management, generic blog production, or guaranteed local rankings.',
  'You cannot make website changes or give a developer enough context to implement the fixes.',
  'The problem is mainly branding, sales process, offer clarity, or operations rather than crawlability, indexation, page structure, or measurement.',
];

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
              Austin technical SEO and search visibility.
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-relaxed text-current/64 lg:mt-10">
              Based in Austin, I run fixed-scope reviews for teams that need crawlability, indexation, structured data, page clarity, and technical search issues checked before broader content or growth work.
            </p>
            <div className="mt-8 max-w-3xl border border-current/14 bg-current/[0.035] p-5">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-current/46">Short answer</p>
              <p className="text-sm leading-relaxed text-current/66">
                Austin technical SEO is the review of whether a local service page can be crawled, understood, trusted, and measured for a specific service intent before anyone publishes more pages or claims visibility gains.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 lg:mt-10">
              <PrimaryCTA href="/contact" className="text-accent hover:text-[var(--page-bg)]">
                Request a fixed-scope review
              </PrimaryCTA>
              <TextLink href="/method" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                Read the technical SEO audit method
              </TextLink>
              <TextLink href="/atlas/sample-crawl" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                See the Atlas open-corpus demonstration
              </TextLink>
              <TextLink href="/research/austin-crawlability-benchmark-pilot.csv" className="text-[10px] uppercase tracking-[0.2em] text-current/68 hover:text-current">
                Download the Austin crawlability pilot
              </TextLink>
            </div>
          </div>

          <DarkProofArtifactPanel
            className="self-center max-md:-mt-4 lg:ml-auto"
            eyebrow="Local audit stack"
            title="Site checks before local SEO claims."
            summary="The page keeps the Austin frame tied to crawlable pages, clear services, and implementation evidence."
            items={austinArtifactItems}
            footer="Public page review first. Analytics and Search Console only when access is available."
          />
        </section>
      </PageFrame>

      <section className="relative z-10 border-y border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Buyer fit" title="Who this is for.">
            This is for teams that need a concrete technical audit before investing in more local pages, content, or outreach.
          </SectionHeader>
          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-3">
            <TechnicalPanel className="min-h-[260px]">
              <p className="mb-7 text-[10px] uppercase tracking-[0.2em] text-current/42">Who this is for</p>
              <ul className="grid gap-3 text-sm leading-relaxed text-current/64">
                {austinBuyerFit.map((item) => (
                  <li key={item} className="border-l border-current/14 pl-4">{item}</li>
                ))}
              </ul>
            </TechnicalPanel>
            <TechnicalPanel className="min-h-[260px]">
              <p className="mb-7 text-[10px] uppercase tracking-[0.2em] text-current/42">What you receive</p>
              <ul className="grid gap-3 text-sm leading-relaxed text-current/64">
                {austinDeliverables.map((item) => (
                  <li key={item} className="border-l border-current/14 pl-4">{item}</li>
                ))}
              </ul>
            </TechnicalPanel>
            <TechnicalPanel className="min-h-[260px]">
              <p className="mb-7 text-[10px] uppercase tracking-[0.2em] text-current/42">When not to hire me</p>
              <ul className="grid gap-3 text-sm leading-relaxed text-current/64">
                {austinWhenNotToHire.map((item) => (
                  <li key={item} className="border-l border-current/14 pl-4">{item}</li>
                ))}
              </ul>
            </TechnicalPanel>
          </SurfaceGrid>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 py-16">
        <section className="grid gap-8 border border-current/14 p-6 md:p-10 lg:grid-cols-[0.44fr_0.56fr]">
          <div>
            <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
              Austin crawlability pilot snapshot.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-current/62">
              The local page is backed by a bounded public fetch sample, not a local-ranking claim. It gives a small public-data baseline for how Austin-area company sites expose crawlability signals.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.22em] text-current/58">
              <TextLink href="/research/austin-crawlability-benchmark-summary.json" className="text-current/68 hover:text-current">
                Open summary JSON
              </TextLink>
              <TextLink href="/research/austin-crawlability-benchmark-pilot.csv" className="text-current/68 hover:text-current">
                Open pilot CSV
              </TextLink>
            </div>
          </div>
          <div className="grid gap-6">
            <figure id="austin-report-example" className="scroll-mt-28 border border-current/14 bg-canvas p-3 text-ink">
              <img
                src="/images/austin-audit-report-example.png"
                alt="Example Austin crawlability report layout showing the June 25, 2026 public pilot cutoff, 12 homepage fetches, 10 sitemap declarations, and six measurement-gap rows."
                className="h-auto w-full"
                loading="lazy"
              />
              <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/14 px-2 pt-3 text-[10px] uppercase tracking-[0.18em] text-ink/60">
                <span>Illustrative report layout · public pilot values</span>
                <a href="/research/austin-crawlability-benchmark-pilot.csv" className="border-b border-ink/30 pb-1 text-ink/70 hover:border-ink hover:text-ink">Open source CSV</a>
              </figcaption>
            </figure>
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-current/14 md:grid-cols-2">
              {austinBenchmarkSnapshot.map((item) => (
                <TechnicalPanel key={item.label} className="min-h-[120px] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-current/42">{item.label}</p>
                  <p className="mt-5 text-sm leading-relaxed text-current/66">{item.value}</p>
                </TechnicalPanel>
              ))}
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-current/44">Pilot method</h3>
              <ul className="mt-5 grid gap-3 text-sm leading-relaxed text-current/58">
                {austinPilotMethod.map((item) => (
                  <li key={item} className="border-l border-current/14 pl-4">{item}</li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-3 text-sm leading-relaxed text-current/58">
              {austinBenchmarkLimits.map((item) => (
                <li key={item} className="border-l border-current/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </PageFrame>

      <PageFrame className="relative z-10 py-16">
        <section className="grid gap-8 border border-current/14 p-6 md:p-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
              Query examples before page expansion.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-current/62">
              The audit starts with concrete Austin service intents, then checks whether the public page, proof, profile signals, and measurement path support that intent.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden border border-current/14 md:grid-cols-2">
            {austinDiagnosticExamples.map((item) => (
              <TechnicalPanel key={item.prompt} className="min-h-[170px] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-current/42">{item.prompt}</p>
                <p className="mt-5 text-sm leading-relaxed text-current/66">{item.review}</p>
              </TechnicalPanel>
            ))}
          </div>
        </section>
      </PageFrame>

      <PageFrame className="relative z-10 py-16">
        <section className="grid gap-8 border border-current/14 p-6 md:p-10 lg:grid-cols-[0.55fr_0.45fr]">
          <div>
            <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
              Built for technical review, not vague local SEO.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-current/62">
              The audit starts with public pages and technical signals. When analytics or Google Search Console access is available, those sources can support prioritization, but they are not guessed from the outside.
            </p>
          </div>
          <div className="grid content-center gap-4 text-[10px] uppercase tracking-[0.2em]">
            <LinkPanel href="https://www.void-agency.com/">
              View Void Agency
            </LinkPanel>
            <LinkPanel href="/method#worked-finding">
              Read the worked finding
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
