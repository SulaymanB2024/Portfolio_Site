import { motion } from 'motion/react';
import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { PUBLIC_MARKET_THESES } from '../content/marketTheses';
import { RESEARCH_ASSETS } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const MARKETS_SEO = getSeoRoute('/markets')!;
const COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';

const heroLinks = [
  { label: 'Browse case archive', href: '#case-archive' },
  { label: 'View market research types', href: '#research-types' },
  { label: 'Access investment memos', href: '#investment-memos' },
];

const researchTypes = [
  {
    index: '01',
    title: 'Traditional cases',
    copy: 'Equity research, business quality, valuation logic, catalysts, and downside cases.',
  },
  {
    index: '02',
    title: 'Crypto protocols',
    copy: 'Protocol mechanics, token incentives, liquidity structure, governance, and adoption risk.',
  },
  {
    index: '03',
    title: 'Market systems',
    copy: 'Rates, liquidity regimes, volatility, credit stress, commodities, and capital flows.',
  },
  {
    index: '04',
    title: 'Models and memos',
    copy: 'Assumption tables, decision frameworks, source notes, and reviewable research artifacts.',
  },
];

const memoLinks = [
  {
    label: 'Appian educational memo',
    href: RESEARCH_ASSETS.appianMemoPdf,
    meta: 'PDF research sample',
  },
  {
    label: 'Appian assumptions table',
    href: RESEARCH_ASSETS.appianAssumptionsCsv,
    meta: 'CSV source table',
  },
];

function MarketsHero() {
  return (
    <section className="relative min-h-[calc(100svh-88px)] overflow-hidden px-4 pb-10 pt-16 md:px-8 md:pt-24 lg:pt-[236px] xl:px-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-[25%] z-0 hidden w-[min(82vw,1360px)] select-none lg:block"
        initial={{ opacity: 0, x: 22, scale: 0.985 }}
        animate={{ opacity: 0.62, x: 0, scale: 1 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={COIN_ART}
          alt=""
          className="h-auto w-full"
          draggable={false}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[13.5rem] z-0 opacity-38 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.26 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <img
          src={COIN_ART}
          alt=""
          className="mx-auto h-auto w-[min(980px,125vw)] max-w-none"
          draggable={false}
        />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-188px)] w-full max-w-[1480px] flex-col justify-center lg:pl-14">
        <motion.div
          className="max-w-[560px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-10 text-[10px] uppercase tracking-[0.32em] text-ink/54">
            Markets Research
          </p>

          <h1 className="font-serif text-[clamp(4.2rem,4.65vw,5rem)] italic leading-[0.9] text-ink text-balance">
            Separate signal
            <br />
            from noise.
          </h1>

          <p className="mt-8 max-w-[385px] text-[15px] leading-relaxed text-ink/62 md:text-base">
            Evidence-driven research across markets, crypto, and investment strategy.
          </p>

          <a
            href="#case-archive"
            className="mt-8 inline-flex border-b border-ink/28 pb-1 font-serif text-sm italic text-ink/56 transition-colors duration-200 hover:border-ink/55 hover:text-ink"
          >
            Explore our research
          </a>

          <nav className="mt-8 grid max-w-[310px] gap-3" aria-label="Markets page sections">
            {heroLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-ink/12 pb-2 text-[10px] uppercase tracking-[0.24em] text-ink/62 transition-colors duration-200 hover:border-ink/35 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </motion.div>

        <div className="mt-auto hidden items-center gap-5 pb-2 text-ink/62 lg:flex">
          <span className="text-sm tabular-nums">03</span>
          <span className="font-serif text-sm italic">Noise expansion</span>
        </div>
      </div>
    </section>
  );
}

function ResearchTypesSection() {
  return (
    <section id="research-types" className="mx-auto w-full max-w-[1480px] px-4 py-16 md:px-8 md:py-24 xl:px-10">
      <div className="mb-10 flex flex-col gap-3 border-t border-ink/12 pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ink/48">Research types</p>
          <h2 className="font-serif text-[clamp(2.5rem,4.8vw,5.4rem)] italic leading-[0.9] text-ink">
            Four ways into the work.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-ink/58">
          Each lane is built to keep evidence, assumptions, and risk boundaries readable before any conclusion is trusted.
        </p>
      </div>

      <div className="grid gap-px border border-ink/12 bg-ink/12 md:grid-cols-2 lg:grid-cols-4">
        {researchTypes.map((type) => (
          <article key={type.index} className="min-h-[245px] bg-[#f3f1eb] p-6 transition-colors duration-200 hover:bg-[#ebe8df]">
            <span className="font-serif text-lg italic text-ink/42">{type.index}</span>
            <h3 className="mt-12 text-[11px] uppercase tracking-[0.24em] text-ink">{type.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/58">{type.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CaseArchiveSection() {
  return (
    <section id="case-archive" className="mx-auto w-full max-w-[1480px] px-4 py-16 md:px-8 md:py-24 xl:px-10">
      <div className="mb-8 border-t border-ink/12 pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ink/48">Case archive</p>
        <h2 className="font-serif text-[clamp(2.5rem,4.8vw,5.4rem)] italic leading-[0.9] text-ink">
          Notes with source boundaries.
        </h2>
      </div>

      <div className="divide-y divide-ink/12 border-y border-ink/12">
        {PUBLIC_MARKET_THESES.map((thesis, index) => (
          <a
            key={thesis.slug}
            href={`/markets/${thesis.slug}`}
            className="grid gap-4 py-6 text-ink transition-colors duration-200 hover:bg-ink/[0.025] md:grid-cols-[72px_minmax(0,1fr)_minmax(180px,0.28fr)] md:items-center md:px-4"
          >
            <span className="font-serif text-lg italic text-ink/44">{String(index + 1).padStart(2, '0')}</span>
            <span>
              <span className="block text-[11px] uppercase tracking-[0.24em] text-ink">{thesis.title}</span>
              <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-ink/56">{thesis.subtitle}</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-ink/46 md:text-right">
              {thesis.date}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function InvestmentMemosSection() {
  return (
    <section id="investment-memos" className="mx-auto w-full max-w-[1480px] px-4 py-16 md:px-8 md:py-24 xl:px-10">
      <div className="grid gap-10 border-y border-ink/12 py-10 lg:grid-cols-[0.78fr_1fr] lg:items-start">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ink/48">Investment memos</p>
          <h2 className="font-serif text-[clamp(2.5rem,4.8vw,5.4rem)] italic leading-[0.9] text-ink">
            Artifacts, not advice.
          </h2>
        </div>
        <div className="space-y-6">
          <p className="max-w-2xl text-sm leading-relaxed text-ink/60">
            Public materials are educational research samples. They show how assumptions are structured, challenged, and sourced without becoming live recommendations or price targets.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {memoLinks.map((memo) => (
              <a
                key={memo.href}
                href={memo.href}
                className="min-h-[132px] border border-ink/12 bg-ink/[0.018] p-5 transition-colors duration-200 hover:border-ink/28 hover:bg-ink/[0.035]"
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-ink/44">{memo.meta}</span>
                <span className="mt-8 block text-[11px] uppercase tracking-[0.22em] text-ink">{memo.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MarketsPage() {
  useSEO(MARKETS_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#f3f1eb] font-sans text-ink selection:bg-ink selection:text-canvas">
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/markets" tone="light" />
      <MarketsHero />
      <ResearchTypesSection />
      <CaseArchiveSection />
      <InvestmentMemosSection />
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/markets" tone="light" />
      </div>
    </main>
  );
}
