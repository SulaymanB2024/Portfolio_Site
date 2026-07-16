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
    <main id="top" className="site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/atlas" tone="light" />

      <section className="relative z-10 mx-auto grid min-h-[66vh] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-16 pt-20 md:px-8 lg:grid-cols-[0.46fr_0.54fr] xl:px-10">
        <div className="self-end">
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-ink/48">Atlas public demonstration · {ATLAS_OPEN_CORPUS_RUN.capturedAt.slice(0, 10)}</p>
          <h1 className="font-serif text-[3.5rem] md:text-[6rem] xl:text-[8rem] italic leading-[0.84] tracking-normal">
            Open-corpus evidence.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/64">
            A dated, bounded capture of {ATLAS_OPEN_CORPUS_RUN.corpusName} shows how source state, rendered-state questions, discovered paths, confidence, and exportable evidence stay connected before any recommendation is made.
          </p>
          <div className="mt-9 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
            <a href={RESEARCH_ASSETS.atlasSampleCsv} className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              Download run CSV
            </a>
            <a href={RESEARCH_ASSETS.atlasSampleManifest} className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              Open run manifest
            </a>
            <a href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" target="_blank" rel="noreferrer" className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              View the GitHub repo for the audit CLI
            </a>
            <a href="/contact" className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              Request an audit
            </a>
          </div>
        </div>

        <div className="self-center border border-ink/14 bg-ink p-6 text-canvas md:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/54">Run metadata</p>
          <h2 className="mt-7 font-serif text-4xl italic leading-none tracking-normal">{ATLAS_OPEN_CORPUS_RUN.id}</h2>
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

        <div className="overflow-x-auto border border-ink/14">
          <table className="min-w-[920px] w-full border-collapse text-left text-xs">
            <caption className="sr-only">Atlas open-corpus demonstration table</caption>
            <thead className="bg-ink text-canvas">
              <tr>
                {['URL', 'Status', 'Indexability', 'Depth', 'Inlinks', 'Outlinks', 'Canonical', 'Observed state', 'Render state', 'Confidence', 'Evidence note'].map((heading) => (
                  <th key={heading} scope="col" className="px-4 py-3 text-[10px] uppercase tracking-[0.18em] font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atlasSampleRows.map((row) => (
                <tr key={row.url} className="group border-t border-ink/10 transition-colors duration-200 hover:bg-ink/[0.035]">
                  <td className="max-w-[260px] px-4 py-3 font-mono text-[11px] text-ink/70 transition-colors group-hover:text-ink">{row.url}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.indexability}</td>
                  <td className="px-4 py-3">{row.depth}</td>
                  <td className="px-4 py-3">{row.inlinks}</td>
                  <td className="px-4 py-3">{row.outlinks}</td>
                  <td className="px-4 py-3">{row.canonical}</td>
                  <td className="px-4 py-3">
                    <span className="block">{row.issue}</span>
                    <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-ink/38 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {getSampleEvidenceState(row)}
                    </span>
                  </td>
                  <td className="max-w-[240px] px-4 py-3 text-ink/62">{row.renderState}</td>
                  <td className="px-4 py-3 text-ink/62">{row.confidence}</td>
                  <td className="px-4 py-3 text-ink/62">{row.note}</td>
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
          <a href="/method#worked-finding" className="text-[10px] uppercase tracking-[0.22em] underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink/70">
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
