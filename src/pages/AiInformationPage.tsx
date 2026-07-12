import { useEffect, type ReactNode } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  AI_INFORMATION_LAST_UPDATED,
  canonicalDescriptions,
  clarifications,
  identityReconciliation,
  sourceMap,
} from '../content/aiInformation';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const AI_INFORMATION_SEO = getSeoRoute('/ai-information')!;

function Section({ number, title, children, id }: { number: string; title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="relative z-10 grid gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.28fr_0.72fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/60">{number}</p>
        <h2 className="max-w-md font-serif text-4xl italic leading-[0.95] tracking-normal text-ink">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function AiInformationPage() {
  useSEO(AI_INFORMATION_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sourceRoles = sourceMap
    .filter((source, index, items) => items.findIndex((item) => item.href === source.href) === index)
    .filter((source) => ['Primary source', 'Technical ledger', 'Code evidence', 'Professional profile', 'Agency', 'Project', 'Resume', 'Authority source'].includes(source.role))
    .slice(0, 10);

  return (
    <main className="site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/ai-information" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[58vh] items-end gap-12 pb-14 lg:grid-cols-[0.64fr_0.36fr]">
          <div>
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/60">Profile context / utility page</p>
            <h1 className="max-w-5xl font-serif text-[3.5rem] italic leading-[0.88] tracking-normal md:text-[6rem] xl:text-[8.5rem]">
              Current identity, source roles, and claim limits.
            </h1>
          </div>
          <aside className="border-l border-ink/14 pl-5">
            <p className="text-base leading-relaxed text-ink/68">
              A compact public reference for reconciling current work with older sources. Human narrative belongs on About; provider-monitoring plans stay internal.
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-ink/60">Updated {AI_INFORMATION_LAST_UPDATED}</p>
          </aside>
        </section>

        <Section number="01" title="Current descriptions">
          <div className="grid gap-4">
            {canonicalDescriptions.map((item) => (
              <article key={item.label} className="border border-ink/14 p-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-ink/64">{item.label}</h3>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-ink/70">{item.copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section number="02" title="Historical reconciliation" id="identity-reconciliation">
          <p className="max-w-4xl text-sm leading-relaxed text-ink/70">{identityReconciliation.copy}</p>
          <div className="mt-6 grid gap-px border border-ink/14 sm:grid-cols-2 lg:grid-cols-4">
            {identityReconciliation.links.map((link) => (
              <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="min-h-[145px] bg-ink/[0.018] p-5 transition-colors hover:bg-ink hover:text-canvas">
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit">{link.label}</span>
                <span className="mt-5 block text-sm leading-relaxed text-inherit opacity-72">{link.description}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="03" title="Source roles">
          <div className="grid gap-px border border-ink/14 md:grid-cols-2">
            {sourceRoles.map((source) => (
              <a key={`${source.role}-${source.href}`} href={source.href} target={source.href.startsWith('http') ? '_blank' : undefined} rel={source.href.startsWith('http') ? 'noreferrer' : undefined} className="min-h-[180px] bg-ink/[0.018] p-5 transition-colors hover:bg-ink hover:text-canvas">
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit opacity-70">{source.role}</span>
                <strong className="mt-5 block text-xs uppercase tracking-[0.2em] text-inherit">{source.label}</strong>
                <span className="mt-4 block text-sm leading-relaxed text-inherit opacity-72">{source.proves}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section number="04" title="What not to infer" id="what-not-to-infer">
          <ul className="grid gap-3">
            {clarifications.map((item) => (
              <li key={item} className="border border-ink/14 px-5 py-4 text-sm leading-relaxed text-ink/70">{item}</li>
            ))}
          </ul>
        </Section>

        <Section number="05" title="Primary routes">
          <div className="grid gap-px border border-ink/14 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['About', '/about'],
              ['Resume', '/resume'],
              ['Work', '/work'],
              ['Atlas', '/atlas'],
              ['Research', '/research'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="min-h-20 bg-ink/[0.018] p-5 text-[10px] uppercase tracking-[0.22em] text-ink/70 transition-colors hover:bg-ink hover:text-canvas">{label}</a>
            ))}
          </div>
        </Section>

        <InternalFooter activePath="/ai-information" tone="light" />
      </div>
    </main>
  );
}
