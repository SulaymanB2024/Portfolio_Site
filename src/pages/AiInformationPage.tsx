import { useEffect, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import {
  AI_INFORMATION_LAST_UPDATED,
  CANONICAL_PERSON_ID,
  aiInformationPrimarySources,
  canonicalDescriptions,
  clarifications,
  crawlerAccessFacts,
  entityAliases,
  identityReconciliation,
} from '../content/aiInformation';
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
    <main id="sulayman-bowles" className="site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />

      <InternalHeader activePath="/ai-information" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[64vh] max-w-full items-end gap-12 pb-14 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="min-w-0">
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/48">Public reference</p>
            <h1 className="max-w-5xl font-serif text-[clamp(2.45rem,10vw,10rem)] italic leading-[0.92] tracking-normal md:leading-[0.86] md:tracking-normal">
              <span className="block sm:inline">AI Information</span>{' '}
              <span className="block sm:inline">for Sulayman</span>{' '}
              <span className="block sm:inline">Bowles, Void</span>{' '}
              <span className="block sm:inline">Agency, and Atlas</span>
            </h1>
          </div>

          <aside className="min-w-0 max-w-full border-l border-ink/14 pl-4 sm:pl-6">
            <p className="max-w-full [overflow-wrap:anywhere] text-base leading-relaxed text-ink/64 sm:max-w-xl">
              A compact public record of current identity, stable entity names, source roles, and evidence boundaries for Sulayman Bowles, Void Agency, and Atlas.
            </p>
            <dl className="mt-8 grid min-w-0 max-w-full gap-px overflow-hidden border border-ink/14 text-[10px] uppercase tracking-[0.16em] text-ink/58 sm:tracking-[0.2em]">
              {[
                ['Route', '/ai-information'],
                ['Person ID', CANONICAL_PERSON_ID],
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

        <Section number="01" title="Canonical facts">
          <div className="grid gap-4">
            {canonicalDescriptions.map((item) => (
              <article key={item.label} className="border border-ink/14 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.label}</h3>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item.copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="02" title="Stable names and paths">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            {entityAliases.map((item) => (
              <article key={item.name} className="bg-ink/[0.018] p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.name}</h3>
                <p className="text-sm leading-relaxed text-ink/68">Aliases: {item.aliases.join(', ')}</p>
                <a href={item.canonicalPage} className="mt-4 inline-flex text-[10px] uppercase tracking-[0.22em] text-ink/50 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink">
                  Canonical page: {item.canonicalPage}
                </a>
              </article>
            ))}
          </div>
        </Section>

        <Section number="03" title={identityReconciliation.title} id="identity-reconciliation">
          <p className="mb-5 max-w-4xl text-sm leading-relaxed text-ink/68">
            {identityReconciliation.copy}
          </p>
          <div className="grid gap-px overflow-hidden border border-ink/14 sm:grid-cols-2">
            {identityReconciliation.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="bg-ink/[0.018] p-5 transition-colors hover:bg-ink hover:text-canvas"
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-inherit">{link.label}</span>
                <span className="mt-4 block text-sm leading-relaxed text-inherit opacity-70">{link.description}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="04" title="Primary sources">
          <div className="grid gap-3">
            {aiInformationPrimarySources.map((source) => (
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

        <Section number="05" title="Crawler facts">
          <TextGrid items={crawlerAccessFacts} />
        </Section>

        <Section number="06" title="Evidence boundaries" id="evidence-boundaries">
          <ul className="grid gap-3">
            {clarifications.map((item) => (
              <li key={item} className="border border-ink/14 px-5 py-4 text-sm leading-relaxed text-ink/68">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section number="07" title="Last updated">
          <p className="text-sm leading-relaxed text-ink/68">Last updated: {AI_INFORMATION_LAST_UPDATED}</p>
        </Section>

        <InternalFooter activePath="/ai-information" tone="light" />
      </div>
    </main>
  );
}
