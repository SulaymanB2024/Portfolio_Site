import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { atlasSampleFindings, atlasSampleRows, RESEARCH_ASSETS } from '../content/seoExpansion';
import { ATLAS_OPEN_CORPUS_RUN } from '../content/atlasOpenCorpus';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ATLAS_SAMPLE_SEO = getSeoRoute('/atlas/sample-crawl')!;

function getSampleEvidenceState(row: (typeof atlasSampleRows)[number]) {
  if (row.issue === 'render-dependent quote output') return 'render_review_required';
  if (row.issue === 'static quote cards observed') return 'confirmed_source_content';
  return 'observation_only';
}

export default function AtlasSampleCrawlPage() {
  useSEO(ATLAS_SAMPLE_SEO);

  return (
    <main id="top" className="site-page site-page-light relative min-h-screen overflow-x-clip bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/atlas" tone="light" />

      <section className="relative z-10 mx-auto grid min-h-[66vh] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-16 pt-20 md:px-8 lg:grid-cols-[0.46fr_0.54fr] xl:px-10">
        <div className="self-end">
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-ink/48">Atlas public demonstration · {ATLAS_OPEN_CORPUS_RUN.capturedAt.slice(0, 10)}</p>
          <h1 className="font-serif text-[3.5rem] md:text-[6rem] xl:text-[8rem] italic leading-[0.84] tracking-normal">
            Inside an Atlas crawl.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/64">
            A dated, bounded crawl of {ATLAS_OPEN_CORPUS_RUN.corpusName} shows how source pages, rendering questions, discovered paths, confidence, and downloadable outputs stay connected before any recommendation is made.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.2em]">
            <a href={RESEARCH_ASSETS.atlasSampleCsv} className="inline-flex min-h-11 items-center border-b border-ink/24 text-[11px] transition-colors hover:border-ink">
              Download run CSV
            </a>
            <a href={RESEARCH_ASSETS.atlasSampleManifest} className="inline-flex min-h-11 items-center border-b border-ink/24 text-[11px] transition-colors hover:border-ink">
              Open run manifest
            </a>
            <a href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center border-b border-ink/24 text-[11px] transition-colors hover:border-ink">
              View the GitHub repo for the audit CLI
            </a>
            <a href="/contact" className="inline-flex min-h-11 items-center border-b border-ink/24 text-[11px] transition-colors hover:border-ink">
              Request an audit
            </a>
          </div>
        </div>

        <div className="self-center border border-ink/14 bg-ink p-6 text-canvas md:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/54">Run metadata</p>
          <h2 className="mt-4 font-sans text-xl md:text-2xl font-light tracking-[0.06em] text-canvas/90 break-all">{ATLAS_OPEN_CORPUS_RUN.id}</h2>
          <dl className="mt-10 grid gap-px border border-canvas/14 bg-canvas/14 sm:grid-cols-2">
            {[
              ['Corpus', ATLAS_OPEN_CORPUS_RUN.corpusName],
              ['Seed set', '2 public pages'],
              ['Captured', ATLAS_OPEN_CORPUS_RUN.capturedAt],
              ['Outputs', 'CSV + JSON manifest'],
            ].map(([label, value]) => (
              <div key={label} className="bg-ink p-5">
                <dt className="text-[10px] uppercase tracking-[0.2em] text-canvas/52">{label}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-canvas/78">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-7 text-sm leading-relaxed text-canvas/62">{ATLAS_OPEN_CORPUS_RUN.scope}</p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-ink/12 px-4 py-16 md:px-8 xl:px-10">
        <div className="mb-9 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[2.8rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.92] tracking-normal">
            What the sample shows.
          </h2>
          <div className="grid gap-3">
            {atlasSampleFindings.map((item) => (
              <article key={item.label} className="border-l border-ink/16 pl-4 text-sm leading-relaxed text-ink/64">
                <h3 className="text-[10px] uppercase tracking-[0.18em] text-ink/48">{item.label} · {item.confidence}</h3>
                <p className="mt-2">{item.observation}</p>
                <p className="mt-2 text-ink/52">Derived from: {item.derivation}</p>
                <p className="mt-2 text-ink/52">Next check: {item.action}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-ink/14 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-ink/64">Captured URL records</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/64">
              Crawl, indexability, rendering, and source notes stay grouped so each row can be understood without overstating what the sample shows.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/64">{atlasSampleRows.length} records / 6 review groups</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:hidden" aria-label="Atlas open-corpus demonstration records">
          {atlasSampleRows.map((row, index) => (
            <article key={row.url} className="border border-ink/16 bg-canvas">
              <header className="border-b border-ink/14 bg-ink px-4 py-4 text-canvas">
                <p className="text-[9px] uppercase tracking-[0.22em] text-canvas/66">Record {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 break-all font-mono text-[11px] font-normal leading-relaxed">{row.url}</h3>
              </header>

              <dl className="grid grid-cols-2 gap-px bg-ink/12">
                {[
                  ['HTTP', row.status],
                  ['Depth', row.depth],
                  ['Inlinks', row.inlinks],
                  ['Outlinks', row.outlinks],
                ].map(([label, value]) => (
                  <div key={label} className="bg-canvas p-4">
                    <dt className="text-[9px] uppercase tracking-[0.18em] text-ink/64">{label}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/78">{value}</dd>
                  </div>
                ))}
              </dl>

              <dl className="grid gap-0 px-4">
                {[
                  ['Indexability', row.indexability],
                  ['Canonical', row.canonical],
                  ['Observed state', row.issue],
                  ['Rendered state', row.renderState],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-ink/12 py-4 last:border-b-0">
                    <dt className="text-[9px] uppercase tracking-[0.18em] text-ink/64">{label}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink/74">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-ink/14 bg-ink/[0.035] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.18em] text-ink/68">
                  <span>{row.confidence} confidence</span>
                  <span>{getSampleEvidenceState(row)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{row.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div
          className="hidden overflow-x-auto border border-ink/14 xl:block"
          role="region"
          aria-label="Atlas open-corpus demonstration table"
          tabIndex={0}
        >
          <table className="w-full min-w-[1120px] table-fixed border-collapse text-left text-xs leading-relaxed">
            <caption className="sr-only">Atlas open-corpus demonstration table grouped into six review columns</caption>
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[13%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
              <col className="w-[17%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead className="bg-ink text-canvas">
              <tr>
                {['URL', 'Crawl state', 'Indexability', 'Observed state', 'Rendered state', 'Source notes'].map((heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.18em]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atlasSampleRows.map((row) => (
                <tr key={row.url} className="border-t border-ink/10 align-top transition-colors duration-200 hover:bg-ink/[0.035]">
                  <td className="break-all px-4 py-4 font-mono text-[11px] text-ink/74">{row.url}</td>
                  <td className="px-4 py-4 text-ink/72">
                    <span className="block font-medium text-ink">{row.status} response</span>
                    <span className="mt-2 block">Depth {row.depth}</span>
                    <span className="mt-2 block">{row.inlinks} inlinks / {row.outlinks} outlinks</span>
                  </td>
                  <td className="px-4 py-4 text-ink/72">
                    <span className="block">{row.indexability}</span>
                    <span className="mt-3 block break-words font-mono text-[11px] text-ink/64">Canonical: {row.canonical}</span>
                  </td>
                  <td className="px-4 py-4 text-ink/72">
                    <span className="block">{row.issue}</span>
                    <span className="mt-3 block text-[9px] uppercase tracking-[0.14em] text-ink/64">{getSampleEvidenceState(row)}</span>
                  </td>
                  <td className="px-4 py-4 text-ink/72">{row.renderState}</td>
                  <td className="px-4 py-4 text-ink/72">
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-ink/68">{row.confidence} confidence</span>
                    <span className="mt-3 block">{row.note}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10">
        <div className="grid gap-5 border border-ink/14 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-3xl text-sm leading-relaxed text-ink/64">
            {ATLAS_OPEN_CORPUS_RUN.captureMethod} {ATLAS_OPEN_CORPUS_RUN.claimLimit}
          </p>
          <a href="/method#worked-finding" className="inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.2em] underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink/70">
            Read the worked finding
          </a>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/atlas" tone="light" />
      </div>
    </main>
  );
}
