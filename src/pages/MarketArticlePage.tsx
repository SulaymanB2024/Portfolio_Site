import { useEffect, type Key, type ReactNode } from 'react';
import { getMarketThesisBySlug } from '../content/marketTheses';
import {
  AssumptionTable,
  CounterargumentTable,
  EvidenceLedger,
  ExecutiveBrief,
  ImplicationsGrid,
  MechanismMap,
  OpenQuestions,
  RelatedLinks,
  ReportHeader,
  ReportSection,
  ResearchBadge,
} from '../components/ResearchComponents';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

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
        <a href="/" id="market-article-brand-link" className="hover-target min-w-0" data-cursor-text="HOME">
          <span className="block font-medium text-[#f1efe8]">SULAYMAN BOWLES</span>
          <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">
            Technical SEO, Atlas, and finance research.
          </span>
        </a>
        <nav className="flex w-full min-w-0 max-w-[20rem] flex-wrap items-center gap-x-3 gap-y-2 md:max-w-full md:justify-end lg:justify-center" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <NavLink key={href} href={href} active={href === '/markets'} id={`market-article-nav-${label.toLowerCase()}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <a
          href="/markets"
          id="market-article-back-link"
          data-cursor-text="MARKETS"
          className="hover-target hidden justify-self-end text-[#f1efe8]/70 transition-colors hover:text-[#f1efe8] lg:block"
        >
          MARKETS INDEX
        </a>
      </div>
    </header>
  );
}

function ReportFooter({
  status,
  strengthen,
  relatedPages,
}: {
  status: string;
  strengthen: string[];
  relatedPages: Array<{ label: string; href: string }>;
}) {
  return (
    <footer className="grid gap-8 border-t border-[#f1efe8]/12 py-10 lg:grid-cols-[0.34fr_0.66fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#b7c8a8]">Footer note</p>
        <h2 className="font-serif text-4xl italic leading-[0.95] tracking-[-0.025em] text-[#f1efe8]">Status and next proof.</h2>
      </div>
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          <ResearchBadge>Status: {status}</ResearchBadge>
          <ResearchBadge>Not investment advice</ResearchBadge>
        </div>
        <div>
          <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/42">What would strengthen it</h3>
          <ul className="grid gap-3">
            {strengthen.map((item) => (
              <li key={item} className="border border-[#f1efe8]/12 px-4 py-3 text-sm leading-relaxed text-[#f1efe8]/66">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <RelatedLinks links={relatedPages} />
      </div>
    </footer>
  );
}

export default function MarketArticlePage({ slug }: { slug: string }) {
  const prefersReducedMotion = useReducedMotion();
  const thesis = getMarketThesisBySlug(slug) ?? getMarketThesisBySlug('network-monopolies')!;
  const route = getSeoRoute(`/markets/${thesis.slug}`) ?? getSeoRoute('/markets')!;

  useSEO(route);

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

      <article className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-12 md:px-8 xl:px-10 xl:py-20">
        <a href="/markets" className="hover-target mb-10 inline-flex text-[10px] uppercase tracking-[0.26em] text-[#b7c8a8]" data-cursor-text="BACK">
          Back to research index
        </a>

        <ReportHeader thesis={thesis} />

        <ReportSection label="01" title="Executive brief">
          <ExecutiveBrief items={thesis.executiveBrief} />
        </ReportSection>

        <ReportSection label="02" title="Mechanism">
          <MechanismMap mechanism={thesis.mechanism} />
        </ReportSection>

        <ReportSection label="03" title="Evidence ledger">
          <EvidenceLedger items={thesis.evidenceLedger} />
        </ReportSection>

        <ReportSection label="04" title="Assumptions">
          <AssumptionTable items={thesis.assumptions} />
        </ReportSection>

        <ReportSection label="05" title="Counterarguments">
          <CounterargumentTable items={thesis.counterarguments} />
        </ReportSection>

        <ReportSection label="06" title="Implications">
          <ImplicationsGrid implications={thesis.implications} />
        </ReportSection>

        <ReportSection label="07" title="Open questions">
          <OpenQuestions items={thesis.openQuestions} />
        </ReportSection>

        <ReportFooter status={thesis.status} strengthen={thesis.strengthen} relatedPages={thesis.relatedPages} />
      </article>
    </main>
  );
}
