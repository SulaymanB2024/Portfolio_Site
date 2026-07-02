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
  PrimaryCTA,
  SectionHeader,
  SurfaceGrid,
  TechnicalPanel,
  TextLink,
} from '../components/design/Primitives';
import { publicDataDownloads, publicResearchAssets, researchClaimBoundaries } from '../content/researchAssets';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESEARCH_ROUTE = getSeoRoute('/research')!;
const priorityOneAssets = publicResearchAssets.filter((asset) => asset.priority === 1);
const audienceCount = new Set(publicResearchAssets.flatMap((asset) => asset.audiences)).size;

export default function ResearchPage() {
  useSEO(RESEARCH_ROUTE);

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-35" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="light" />

      <PageFrame className="relative z-10">
        <PageHero
          eyebrow="Research assets"
          title="Citation surfaces, not empty claims."
          intro={
            <p>
              A public index of technical SEO, AI-search, Atlas, crawlability, identity, and finance/data artifacts. Each item is meant to be inspectable before it is cited, pitched, or used in outreach.
            </p>
          }
          aside={
            <div className="grid gap-5 text-sm leading-relaxed">
              <p>
                The hub gives editors, profile owners, technical SEO writers, and AI-search researchers one clean URL for source-backed assets instead of a loose set of raw files.
              </p>
              <div className="grid grid-cols-3 gap-px border border-current/14 text-center">
                <Metric label="Assets" value={publicResearchAssets.length} />
                <Metric label="P1" value={priorityOneAssets.length} />
                <Metric label="Audiences" value={audienceCount} />
              </div>
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-5 border-b border-current/12 py-8">
          <PrimaryCTA href="/contact" id="research-contact-link">
            Discuss an audit
          </PrimaryCTA>
          <TextLink
            href="/research/authority-assets.json"
            id="research-authority-json-link"
            className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current"
          >
            Authority asset JSON
          </TextLink>
          <TextLink href="/llms.txt" id="research-llms-link" className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current">
            LLMs text file
          </TextLink>
        </div>
      </PageFrame>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Citation targets" title="Assets worth linking to.">
            These are the best public targets for earned links, profile updates, source citations, newsletter submissions, and editorial conversations. Priority reflects campaign usefulness, not proof of authority.
          </SectionHeader>

          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {publicResearchAssets.map((asset) => (
              <TechnicalPanel key={asset.href} className="grid min-h-[330px] content-between gap-8 bg-current/[0.012]">
                <div>
                  <div className="mb-7 flex items-start justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/42">
                    <span>P{asset.priority}</span>
                    <span>{asset.type.replaceAll('_', ' ')}</span>
                  </div>
                  <h2 className="font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                    <a href={asset.href} className="transition-opacity hover:opacity-70">
                      {asset.name}
                    </a>
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/62">{asset.pitchAngle}</p>
                </div>

                <div className="grid gap-5 border-t border-current/12 pt-5">
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-current/42">Preferred anchor</p>
                    <p className="text-sm leading-relaxed text-current/72">{asset.preferredAnchor}</p>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-current/42">Audience</p>
                    <p className="text-sm leading-relaxed text-current/58">{asset.audiences.join(' / ')}</p>
                  </div>
                </div>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Public files" title="Downloadable proof.">
            These files support the public pages above. They are useful for citation, review, and outreach because the source rows can be inspected directly.
          </SectionHeader>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {publicDataDownloads.map((download) => (
              <LinkPanel key={download.href} href={download.href} className="grid min-h-[170px] content-between gap-6">
                <span className="font-serif text-2xl italic leading-tight tracking-normal text-current">{download.label}</span>
                <span className="text-sm normal-case leading-relaxed tracking-normal text-current/58">{download.description}</span>
              </LinkPanel>
            ))}
          </div>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 py-16 xl:py-24">
        <section className="grid gap-10 border border-current/14 p-6 md:p-10 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.28em] text-current/48">Claim boundaries</p>
            <h2 className="font-serif text-[3rem] md:text-[5rem] xl:text-[6.75rem] italic leading-[0.9] tracking-normal">
              Evidence stays separate from outcomes.
            </h2>
          </div>
          <div className="grid gap-4">
            {researchClaimBoundaries.map((boundary, index) => (
              <article key={boundary} className="border border-current/12 p-5">
                <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-current/38">{String(index + 1).padStart(2, '0')}</p>
                <p className="text-sm leading-relaxed text-current/64">{boundary}</p>
              </article>
            ))}
          </div>
        </section>
      </PageFrame>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/research" tone="light" />
      </PageFrame>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid min-h-24 content-center gap-2 bg-current/[0.018] p-4">
      <span className="font-serif text-3xl italic leading-none">{value}</span>
      <span className="text-[9px] uppercase tracking-[0.18em] text-current/42">{label}</span>
    </div>
  );
}
