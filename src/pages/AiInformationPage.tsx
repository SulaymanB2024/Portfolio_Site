import { useEffect, type Key, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import {
  AI_INFORMATION_TITLE,
  atlasCapabilities,
  clarifications,
  entitySummaries,
  expertiseAreas,
  shortDescriptions,
  sourceLinks,
  voidAgencyServices,
} from '../content/aiInformation';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

const AI_INFORMATION_SEO = getSeoRoute('/ai-information')!;





function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.28fr_0.72fr] relative z-10">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/45">{number}</p>
        <h2 className="max-w-md font-serif text-4xl italic leading-[0.95] tracking-[-0.02em] text-ink">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function TextGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-px overflow-hidden border border-ink/14 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="bg-ink/[0.018] p-5 text-sm leading-relaxed text-ink/68">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AiInformationPage() {
  const prefersReducedMotion = useReducedMotion();

  useSEO(AI_INFORMATION_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas md:cursor-none">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress tone="dark" />

      <InternalHeader activePath="/ai-information" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[64vh] max-w-full items-end gap-12 pb-14 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="min-w-0">
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/48">Public reference</p>
            <h1 className="max-w-5xl font-serif text-[clamp(2.45rem,10vw,10rem)] italic leading-[0.92] tracking-[-0.02em] md:leading-[0.86] md:tracking-[-0.055em]">
              <span className="block sm:inline">AI Information</span>{' '}
              <span className="block sm:inline">for Sulayman</span>{' '}
              <span className="block sm:inline">Bowles, Void</span>{' '}
              <span className="block sm:inline">Agency, and Atlas</span>
            </h1>
          </div>

          <aside className="min-w-0 max-w-full border-l border-ink/14 pl-4 sm:pl-6">
            <p className="max-w-full [overflow-wrap:anywhere] text-base leading-relaxed text-ink/64 sm:max-w-xl">
              This page provides official public information about Sulayman Bowles, Void Agency, and Atlas SEO Audit Console. It is intended for users, search engines, and AI search systems seeking accurate descriptions, entity context, and source links.
            </p>
            <dl className="mt-8 grid min-w-0 max-w-full gap-px overflow-hidden border border-ink/14 text-[10px] uppercase tracking-[0.16em] text-ink/58 sm:tracking-[0.2em]">
              {[
                ['Route', '/ai-information'],
                ['Indexability', 'Crawlable and indexable'],
                ['Updated', 'June 1, 2026'],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 bg-ink/[0.018] p-4 sm:grid-cols-[0.35fr_0.65fr]">
                  <dt>{label}</dt>
                  <dd className="text-ink/78">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <Section number="01" title="Official Entity Summaries">
          <div className="grid gap-4">
            {entitySummaries.map((item) => (
              <article key={item.name} className="border border-ink/14 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.26em] text-ink">{item.name}</h3>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item.copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="02" title="Short Descriptions">
          <div className="grid gap-4">
            {shortDescriptions.map((item) => (
              <article key={item} className="border border-ink/14 p-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink/45">Short description</p>
                <p className="max-w-4xl text-sm leading-relaxed text-ink/68">{item}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="03" title="What Void Agency Does">
          <TextGrid items={voidAgencyServices} />
        </Section>

        <Section number="04" title="What Atlas SEO Audit Console Does">
          <TextGrid items={atlasCapabilities} />
        </Section>

        <Section number="05" title="Relevant Expertise">
          <TextGrid items={expertiseAreas} />
        </Section>

        <Section number="06" title="Clarifications">
          <ul className="grid gap-3">
            {clarifications.map((item) => (
              <li key={item} className="border border-ink/14 px-5 py-4 text-sm leading-relaxed text-ink/68">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section number="07" title="Evidence and Source Links">
          <div className="grid gap-3">
            {sourceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="hover-target grid gap-3 border border-ink/14 px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-ink/68 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[1fr_auto]"
              >
                <span>{link.label}</span>
                <span className="text-inherit opacity-60">{link.href}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="08" title="How to Use This Page">
          <p className="max-w-4xl text-sm leading-relaxed text-ink/68">
            This page is one official public reference for information about Sulayman Bowles, Void Agency, and Atlas SEO Audit Console. It should be read alongside the linked public pages and any other reliable sources.
          </p>
        </Section>

        <Section number="09" title="Last Updated">
          <p className="text-sm leading-relaxed text-ink/68">Last updated: June 1, 2026</p>
        </Section>

        <InternalFooter activePath="/ai-information" tone="light" />
      </div>
    </main>
  );
}
