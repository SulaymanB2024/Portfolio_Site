import AtlasCrawlMap from '../components/AtlasCrawlMap';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { atlasSampleFindings, atlasSampleRows, RESEARCH_ASSETS } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ATLAS_SAMPLE_SEO = getSeoRoute('/atlas/sample-crawl')!;

function getSampleEvidenceState(row: (typeof atlasSampleRows)[number]) {
  if (row.issue === 'none') return 'confirmed_content';
  if (row.indexability === 'noindex' || row.canonical === 'parameterized') return 'held_for_review';
  return 'review_candidate';
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
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-ink/48">Atlas sample crawl</p>
          <h1 className="font-serif text-[3.5rem] md:text-[6rem] xl:text-[8rem] italic leading-[0.84] tracking-normal">
            Sanitized crawl data.
          </h1>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/64">
            This sample run shows how Atlas records URL-level data before recommendations: status, indexability, crawl depth, link counts, canonical state, issue labels, and notes.
          </p>
          <div className="mt-9 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
            <a href={RESEARCH_ASSETS.atlasSampleCsv} className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              Download sanitized crawl CSV
            </a>
            <a href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" target="_blank" rel="noreferrer" className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              View the GitHub repo for the audit CLI
            </a>
            <a href="/contact" className="border-b border-ink/24 pb-1 transition-colors hover:border-ink">
              Request an audit
            </a>
          </div>
        </div>

        <div className="self-center">
          <AtlasCrawlMap className="aspect-[1000/820] w-full" />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-ink/12 px-4 py-16 md:px-8 xl:px-10">
        <div className="mb-9 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[2.8rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.92] tracking-normal">
            What the sample shows.
          </h2>
          <div className="grid gap-3">
            {atlasSampleFindings.map((item) => (
              <p key={item} className="border-l border-ink/16 pl-4 text-sm leading-relaxed text-ink/64">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-ink/14">
          <table className="min-w-[920px] w-full border-collapse text-left text-xs">
            <caption className="sr-only">Sanitized Atlas crawl sample table</caption>
            <thead className="bg-ink text-canvas">
              <tr>
                {['URL', 'Status', 'Indexability', 'Depth', 'Inlinks', 'Outlinks', 'Canonical', 'Issue', 'Evidence note'].map((heading) => (
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
            Use this sample as a compact method example. It is intentionally small and sanitized, so it supports the public explanation without exposing private crawl exports.
          </p>
          <a href="/case-studies/technical-seo-audit" className="text-[10px] uppercase tracking-[0.22em] underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink/70">
            Read the technical SEO audit case study
          </a>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/atlas" tone="light" />
      </div>
    </main>
  );
}
