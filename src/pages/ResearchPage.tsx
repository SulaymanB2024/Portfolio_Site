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
const featuredAssetCount = publicResearchAssets.filter((asset) => asset.featured).length;
const topicCount = new Set(publicResearchAssets.flatMap((asset) => asset.topics)).size;

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
          eyebrow="Research library"
          title="Research, methods, and inspectable artifacts."
          intro={
            <p>
              A public index of long-form analysis, technical notes, datasets, and system examples across infrastructure, search, Atlas, identity, and finance.
            </p>
          }
          aside={
            <div className="grid gap-5 text-sm leading-relaxed">
              <p>
                Start with the Texas toll-road ownership study, then use the source notes and downloadable files to inspect how each conclusion was bounded.
              </p>
              <div className="grid grid-cols-3 gap-px border border-current/14 text-center">
                <Metric label="Assets" value={publicResearchAssets.length} />
                <Metric label="Featured" value={featuredAssetCount} />
                <Metric label="Topics" value={topicCount} />
              </div>
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-5 border-b border-current/12 py-8">
          <PrimaryCTA href="#research-library" id="research-library-link">
            Browse the library
          </PrimaryCTA>
          <TextLink
            href="/research/authority-assets.json"
            id="research-authority-json-link"
            className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current"
          >
            Machine-readable index
          </TextLink>
          <TextLink href="/llms.txt" id="research-llms-link" className="text-[10px] uppercase tracking-[0.2em] text-current/62 hover:text-current">
            LLMs text file
          </TextLink>
        </div>
      </PageFrame>

      <section id="research-library" className="relative z-10 scroll-mt-24 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Research index" title="Start with the evidence.">
            Each entry explains what the work contains, where its supporting files live, and what the evidence does not establish.
          </SectionHeader>

          <SurfaceGrid className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {publicResearchAssets.map((asset) => (
              <TechnicalPanel key={asset.href} className="grid min-h-[390px] content-between gap-8 bg-current/[0.012]">
                <div>
                  <div className="mb-7 flex items-start justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-current/42">
                    <span>{asset.featured ? 'Featured' : 'Research'}</span>
                    <span>{asset.type.replaceAll('_', ' ')}</span>
                  </div>
                  <h2 className="font-serif text-3xl italic leading-[0.95] tracking-normal text-current">
                    <a href={asset.href} className="transition-opacity hover:opacity-70">
                      {asset.name}
                    </a>
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-current/62">{asset.description}</p>
                  {asset.published ? (
                    <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-current/42">Published {asset.published}</p>
                  ) : null}
                </div>

                <div className="grid gap-5 border-t border-current/12 pt-5">
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-current/42">Topics</p>
                    <p className="text-sm leading-relaxed text-current/72">{asset.topics.join(' / ')}</p>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-current/42">Claim boundary</p>
                    <p className="text-sm leading-relaxed text-current/58">{asset.claimBoundary}</p>
                  </div>
                  {asset.supportingAssets.length ? (
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-current/42">Supporting files</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {asset.supportingAssets.map((supportingAsset) => (
                          <TextLink
                            key={supportingAsset.href}
                            href={supportingAsset.href}
                            className="text-[10px] uppercase tracking-[0.14em] text-current/58 hover:text-current"
                          >
                            {supportingAsset.label}
                          </TextLink>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </TechnicalPanel>
            ))}
          </SurfaceGrid>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Public files" title="Downloadable proof.">
            Source maps, datasets, and assumption tables that can be inspected independently of the surrounding page copy.
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
            <h2 className="font-serif text-[clamp(3rem,6vw,7rem)] italic leading-[0.9] tracking-normal">
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
