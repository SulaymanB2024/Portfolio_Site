import { useEffect, type Key, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import {
  AI_INFORMATION_LAST_UPDATED,
  AI_INFORMATION_TITLE,
  atlasCapabilities,
  canonicalDescriptions,
  clarifications,
  crawlerAccessFacts,
  entityAliases,
  entitySummaries,
  evidenceGroups,
  expertiseAreas,
  identityReconciliation,
  providerDiscoveryPlan,
  shortDescriptions,
  sourceLinks,
  sourceMap,
  voidAgencyServices,
} from '../content/aiInformation';
import { fanOutQueryMap, publicSourceGraph } from '../content/evidenceLists';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

const AI_INFORMATION_SEO = getSeoRoute('/ai-information')!;

function Section({ number, title, children, id }: { number: string; title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="relative z-10 grid min-w-0 gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.28fr_0.72fr]">
      <div className="min-w-0">
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/45">{number}</p>
        <h2 className="max-w-md font-serif text-4xl italic leading-[0.95] tracking-normal text-ink">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function TextGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-px overflow-hidden border border-ink/14 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="bg-ink/[0.018] p-5 text-sm leading-relaxed text-ink/68 [overflow-wrap:anywhere]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AiInformationPage() {
  useSEO(AI_INFORMATION_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />

      <InternalHeader activePath="/ai-information" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[64vh] max-w-full items-end gap-12 pb-14 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="min-w-0">
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/48">Public reference</p>
            <h1 className="max-w-5xl font-serif text-[2.45rem] md:text-[6rem] xl:text-[9rem] italic leading-[0.92] tracking-normal md:leading-[0.86] md:tracking-normal">
              <span className="block sm:inline">AI Information</span>{' '}
              <span className="block sm:inline">for Sulayman</span>{' '}
              <span className="block sm:inline">Bowles, Void</span>{' '}
              <span className="block sm:inline">Agency, and Atlas</span>
            </h1>
          </div>

          <aside className="min-w-0 max-w-full border-l border-ink/14 pl-4 sm:pl-6">
            <p className="max-w-full [overflow-wrap:anywhere] text-base leading-relaxed text-ink/64 sm:max-w-xl">
              This is the reference page for my current public work: Sulayman Bowles, Void Agency, and Atlas SEO Audit Console. It keeps descriptions, source links, and older background in one place so people and search systems do not have to piece it together from stale snippets.
            </p>
            <dl className="mt-8 grid min-w-0 max-w-full gap-px overflow-hidden border border-ink/14 text-[10px] uppercase tracking-[0.16em] text-ink/58 sm:tracking-[0.2em]">
              {[
                ['Route', '/ai-information'],
                ['Indexability', 'Crawlable and indexable'],
                ['Updated', AI_INFORMATION_LAST_UPDATED],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 bg-ink/[0.018] p-4 sm:grid-cols-[0.35fr_0.65fr]">
                  <dt>{label}</dt>
                  <dd className="text-ink/78">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <Section number="01" title="Current Descriptions">
          <div className="grid gap-4">
            {canonicalDescriptions.map((item) => (
              <article key={item.label} className="border border-ink/14 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.label}</h3>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4">
            {shortDescriptions.map((item) => (
              <article key={item} className="border border-ink/14 p-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink/45">Short description</p>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="02" title={identityReconciliation.title} id="identity-reconciliation">
          <p className="mb-5 max-w-4xl text-sm leading-relaxed text-ink/68">
            {identityReconciliation.copy}
          </p>
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2 xl:grid-cols-7">
            {identityReconciliation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="bg-ink/[0.018] p-5 transition-colors hover:bg-ink hover:text-canvas"
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-inherit">{link.label}</span>
                <span className="mt-4 block text-sm leading-relaxed text-inherit opacity-70">{link.description}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="03" title="Entity Names and Aliases">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            {entityAliases.map((item) => (
              <article key={item.name} className="bg-ink/[0.018] p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.name}</h3>
                <p className="text-sm leading-relaxed text-ink/68">Aliases: {item.aliases.join(', ')}</p>
                <a href={item.canonicalPage} className="mt-4 inline-flex text-[10px] uppercase tracking-[0.22em] text-ink/50 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink">
                  Reference page: {item.canonicalPage}
                </a>
              </article>
            ))}
          </div>
        </Section>

        <Section number="04" title="Public Source List">
          <div className="grid gap-3">
            {publicSourceGraph.map((source) => (
              <a
                key={`${source.category}-${source.href}`}
                href={source.href}
                target={source.href.startsWith('http') ? '_blank' : undefined}
                rel={source.href.startsWith('http') ? 'noreferrer' : undefined}
                className="grid gap-3 border border-ink/14 px-5 py-4 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[0.22fr_0.24fr_0.54fr]"
              >
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit opacity-60">{source.category}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit">{source.label}</span>
                <span className="text-sm leading-relaxed text-inherit opacity-70">{source.proves}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="05" title="Likely Search Questions">
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-ink/62">
            This map organizes likely follow-up questions around existing evidence pages. It is not a plan to create separate pages for every query variation.
          </p>
          <div className="min-w-0 max-w-full overflow-x-auto border border-ink/14">
            <table className="min-w-[920px] w-full border-collapse text-left text-sm">
              <thead className="bg-ink/[0.035] text-[10px] uppercase tracking-[0.18em] text-ink/55">
                <tr>
                  {['Original query', 'Likely fan-out queries', 'Best page to satisfy them', 'Missing content', 'Recommended edit'].map((heading) => (
                    <th key={heading} className="border-b border-r border-ink/12 p-4 align-top last:border-r-0">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fanOutQueryMap.map((item) => (
                  <tr key={item.originalQuery} className="border-b border-ink/12 last:border-b-0">
                    <td className="w-[16%] border-r border-ink/12 p-4 align-top font-medium text-ink/78">{item.originalQuery}</td>
                    <td className="w-[22%] border-r border-ink/12 p-4 align-top text-ink/64">
                      <ul className="space-y-2">
                        {item.likelyFanOutQueries.map((query) => (
                          <li key={query}>{query}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="w-[16%] border-r border-ink/12 p-4 align-top">
                      <a href={item.href} className="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink">
                        {item.bestPage}
                      </a>
                    </td>
                    <td className="w-[22%] border-r border-ink/12 p-4 align-top text-ink/64">{item.missingContent}</td>
                    <td className="w-[24%] p-4 align-top text-ink/64">{item.recommendedEdit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section number="06" title="Source List">
          <div className="grid gap-3">
            {sourceMap.map((source) => (
              <a
                key={`${source.role}-${source.href}`}
                href={source.href}
                target={source.href.startsWith('http') ? '_blank' : undefined}
                rel={source.href.startsWith('http') ? 'noreferrer' : undefined}
                className="grid gap-3 border border-ink/14 px-5 py-4 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[0.24fr_0.24fr_0.52fr]"
              >
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit opacity-60">{source.role}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit">{source.label}</span>
                <span className="text-sm leading-relaxed text-inherit opacity-70">{source.proves}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="07" title="Crawler and Indexation Signals">
          <TextGrid items={crawlerAccessFacts} />
        </Section>

        <Section number="08" title="Provider Discovery Plan">
          <div className="grid gap-3">
            {providerDiscoveryPlan.map((item) => (
              <article key={item.provider} className="border border-ink/14 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink">{item.provider}</h3>
                <p className="mb-3 max-w-4xl text-sm leading-relaxed text-ink/68">
                  <span className="font-medium text-ink/82">Current signal:</span> {item.currentSignal}
                </p>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">
                  <span className="font-medium text-ink/82">Next action:</span> {item.nextAction}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="09" title="What the Evidence Supports">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-3">
            {evidenceGroups.map((group) => (
              <article key={group.title} className="bg-ink/[0.018] p-5">
                <h3 className="mb-5 text-[10px] uppercase tracking-[0.24em] text-ink/50">{group.title}</h3>
                <ul className="space-y-3 text-sm leading-relaxed text-ink/68">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section number="10" title="Official Entity Summaries">
          <div className="grid gap-4">
            {entitySummaries.map((item) => (
              <article key={item.name} className="border border-ink/14 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.name}</h3>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item.copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="11" title="What Void Agency Does">
          <TextGrid items={voidAgencyServices} />
        </Section>

        <Section number="12" title="What Atlas SEO Audit Console Does">
          <TextGrid items={atlasCapabilities} />
        </Section>

        <Section number="13" title="Relevant Expertise">
          <TextGrid items={expertiseAreas} />
        </Section>

        <Section number="14" title="What Not to Infer" id="what-not-to-infer">
          <ul className="grid gap-3">
            {clarifications.map((item) => (
              <li key={item} className="border border-ink/14 px-5 py-4 text-sm leading-relaxed text-ink/68">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section number="15" title="Evidence and Source Links">
          <div className="grid gap-3">
            {sourceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="grid gap-3 border border-ink/14 px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-ink/68 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[1fr_auto]"
              >
                <span>{link.label}</span>
                <span className="text-inherit opacity-60">{link.description}</span>
                <span className="text-sm normal-case leading-relaxed tracking-normal text-inherit opacity-65 md:col-span-2">{link.proves}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="16" title="How to Use This Page">
          <p className="max-w-4xl text-sm leading-relaxed text-ink/68">
            Use this page as the main reference, then check the linked public sources for corroboration: GitHub for code evidence, LinkedIn for professional corroboration, Void Agency for the agency branch, UT/McCombs sources for academic context, Atlas for the software/project page, Markets Research for valuation and market reasoning, and the HTML resume for the current profile.
          </p>
        </Section>

        <Section number="17" title="Last Updated">
          <p className="text-sm leading-relaxed text-ink/68">Last updated: {AI_INFORMATION_LAST_UPDATED}</p>
        </Section>

        <InternalFooter activePath="/ai-information" tone="light" />
      </div>
    </main>
  );
}
