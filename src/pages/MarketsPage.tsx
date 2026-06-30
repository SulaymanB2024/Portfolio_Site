import { useEffect, type Key, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ResearchBadge, ResearchCard } from '../components/ResearchComponents';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { MARKET_THESES } from '../content/marketTheses';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const MARKETS_SEO = getSeoRoute('/markets')!;

function DarkNoise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.055]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 22% 28%, rgba(241,239,232,0.24) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 64%, rgba(241,239,232,0.16) 0 1px, transparent 1.7px)',
        backgroundSize: '17px 21px, 25px 31px',
      }}
    />
  );
}

function NavLink({ href, active, id, children }: { href: string; active?: boolean; id?: string; children: ReactNode; key?: Key }) {
  return (
    <a
      href={href}
      id={id}
      data-cursor-text={typeof children === 'string' ? children : 'VIEW'}
      className={`hover-target relative group overflow-visible px-2 py-1 transition-colors ${active ? 'text-[#f1efe8]' : 'text-[#f1efe8]/58 hover:text-[#f1efe8]'}`}
    >
      <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">{children}</span>
      <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>[</span>
      <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>]</span>
    </a>
  );
}

const navItems = [
  ['Work', '/#selected-works'],
  ['Atlas', '/atlas'],
  ['Research', '/markets'],
  ['Method', '/method'],
  ['About', '/about'],
  ['Resume', '/resume'],
  ['Contact', '/#contact'],
] as const;

function PageHeader() {
  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
      <div className="grid items-start gap-5 border-b border-[#f1efe8]/12 bg-[#080807]/86 pb-5 text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
        <a href="/" id="markets-brand-link" className="hover-target min-w-0" data-cursor-text="HOME">
          <span className="block font-medium text-[#f1efe8]">SULAYMAN BOWLES</span>
          <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">
            Technical SEO, Atlas, and finance research.
          </span>
        </a>
        <nav className="flex w-full min-w-0 max-w-[20rem] flex-wrap items-center gap-x-3 gap-y-2 md:max-w-full md:justify-end lg:justify-center" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <NavLink key={href} href={href} active={href === '/markets'} id={`markets-nav-${label.toLowerCase()}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <a
          href="/#contact"
          id="markets-header-contact"
          data-cursor-text="CONTACT"
          className="hover-target hidden justify-self-end text-[#f1efe8]/70 transition-colors hover:text-[#f1efe8] lg:block"
        >
          CONTACT
        </a>
      </div>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className="grid w-full grid-cols-1 items-start gap-8 border-t border-[#f1efe8]/12 pt-8 text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/54 md:grid-cols-[1fr_auto_1fr]">
      <div>
        <div className="text-[#f1efe8]">SULAYMAN BOWLES</div>
        <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO, Atlas, and finance research.</div>
      </div>
      <nav className="flex flex-wrap gap-4" id="markets-footer-nav">
        {navItems.map(([label, href]) => (
          <NavLink key={href} href={href} active={href === '/markets'} id={`markets-footer-${label.toLowerCase()}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="md:text-right">
        © 2026 SULAYMAN BOWLES
        <br />
        RESEARCH INDEX
      </div>
    </footer>
  );
}

function ResearchStandards() {
  const standards = [
    ['Draft note', 'Early thesis. Useful framing, but primary-source evidence is still incomplete.'],
    ['Research memo', 'Structured argument with mechanism, assumptions, counterarguments, and a source ledger.'],
    ['Market report', 'Primary-source backed report with complete evidence, dated data, and stronger downside work.'],
    ['Developed essay', 'Long-form synthesis where the source base and countercase are strong enough to stand alone.'],
  ];

  return (
    <section className="grid gap-8 border-y border-[#f1efe8]/12 py-12 lg:grid-cols-[0.32fr_0.68fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#b7c8a8]">Research status</p>
        <h2 className="font-serif text-4xl italic leading-[0.95] tracking-[-0.025em] text-[#f1efe8]">
          Thin notes are staged, not packaged as finished research.
        </h2>
      </div>
      <div className="grid gap-px overflow-hidden border border-[#f1efe8]/12 md:grid-cols-2">
        {standards.map(([label, copy]) => (
          <article key={label} className="bg-[#f1efe8]/[0.012] p-5">
            <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]">{label}</h3>
            <p className="text-sm leading-relaxed text-[#f1efe8]/62">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArtifactLinks() {
  const artifacts = [
    {
      label: 'Appian memo',
      meta: 'PDF / available',
      href: '/research/appian-enterprise-software-durability-memo.pdf',
    },
    {
      label: 'Appian assumptions table',
      meta: 'CSV / available',
      href: '/research/appian-assumptions-table.csv',
    },
    {
      label: 'Atlas sanitized crawl sample',
      meta: 'CSV / available',
      href: '/research/atlas-sanitized-crawl-sample.csv',
    },
  ];

  return (
    <section className="grid gap-8 border-b border-[#f1efe8]/12 py-12 lg:grid-cols-[0.32fr_0.68fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#b7c8a8]">Proof files</p>
        <h2 className="font-serif text-4xl italic leading-[0.95] tracking-[-0.025em] text-[#f1efe8]">
          Real downloadable artifacts stay separated from staged notes.
        </h2>
      </div>
      <div className="grid gap-3">
        {artifacts.map((artifact) => (
          <a
            key={artifact.href}
            href={artifact.href}
            className="hover-target grid gap-3 border border-[#f1efe8]/12 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/68 transition-colors hover:border-[#f1efe8]/32 hover:text-[#f1efe8] md:grid-cols-[1fr_auto]"
            data-cursor-text="OPEN"
          >
            <span>{artifact.label}</span>
            <span className="text-[#f1efe8]/42">{artifact.meta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function MarketsPage() {
  useSEO(MARKETS_SEO);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="relative min-h-screen w-full bg-[#080807] font-sans text-[#f1efe8] antialiased selection:bg-[#f1efe8] selection:text-[#080807] md:cursor-none">
      <PageTechnicalChrome tone="dark" />
      <DarkNoise />
      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress />

      <PageHeader />

      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-col gap-12 px-4 pb-8 pt-4 md:px-8 xl:px-10">
        <section className="grid min-h-[72vh] items-end gap-12 border-b border-[#f1efe8]/12 pb-12 pt-16 lg:grid-cols-[0.68fr_0.32fr]">
          <ScrollReveal yOffset={18} blur={false}>
            <div className="mb-7 flex flex-wrap gap-2">
              <ResearchBadge>Markets Research</ResearchBadge>
              <ResearchBadge>Finance / data analysis</ResearchBadge>
              <ResearchBadge>Source-led notes</ResearchBadge>
            </div>
            <h1 className="font-serif text-[clamp(4.4rem,10vw,11rem)] italic leading-[0.82] tracking-[-0.055em] text-[#f1efe8]">
              Research index.
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[#f1efe8]/68">
              Market notes on platform power, AI compute infrastructure, money, debt, currency trust, valuation logic, and data analysis. Each entry states the thesis, mechanism, evidence status, assumptions, counterarguments, and what is still missing.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08} yOffset={18} blur={false}>
            <div className="border border-[#f1efe8]/12 p-5 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/58">
              <div className="mb-8 flex items-center justify-between border-b border-[#f1efe8]/10 pb-5">
                <span>Current archive</span>
                <span className="text-[#b7c8a8]">{MARKET_THESES.length} reports</span>
              </div>
              <div className="grid gap-4">
                <a href="/markets/network-monopolies" className="hover-target transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">Network monopolies</a>
                <a href="/markets/computational-commodity-systems" className="hover-target transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">Computational commodity systems</a>
                <a href="/markets/fiat-horizon" className="hover-target transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">Fiat horizon</a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ScrollReveal yOffset={18} blur={false}>
          <section aria-labelledby="research-cards-heading" className="space-y-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#b7c8a8]">Research artifacts</p>
                <h2 id="research-cards-heading" className="font-serif text-4xl italic leading-none tracking-[-0.025em] text-[#f1efe8] md:text-6xl">
                  Structured notes, not finished-looking placeholders.
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-[#f1efe8]/58">
                Cards show thesis, mechanism, evidence base, status, depth, and update date so unfinished work reads honestly.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {MARKET_THESES.map((thesis) => (
                <ResearchCard key={thesis.slug} thesis={thesis} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal yOffset={18} blur={false}>
          <ResearchStandards />
        </ScrollReveal>

        <ScrollReveal yOffset={18} blur={false}>
          <ArtifactLinks />
        </ScrollReveal>

        <PageFooter />
      </div>
    </main>
  );
}
