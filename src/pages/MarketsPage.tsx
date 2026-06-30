import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SmoothCursor } from '../components/SmoothCursor';
import { ScrollProgress } from '../components/ScrollProgress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { WireframeGrid } from '../components/WireframeGrid';
import InvestmentResearchMap from '../components/InvestmentResearchMap';
import CandlestickChart from '../components/CandlestickChart';
import { MARKET_THESES } from '../content/marketTheses';
import ArticleReader from '../components/ArticleReader';
import { useSEO } from '../utils/seo';
import { ScrollReveal } from '../components/ScrollReveal';

const MARKETS_SEO = getSeoRoute('/markets')!;

type SurfaceId = 'market-brief' | 'equity-memo' | 'crypto-map' | 'model-workbook';

type Surface = {
  id: SurfaceId;
  number: string;
  label: string;
  title: string;
  summary: string;
  status: string;
  output: string;
  sourceBasis: string[];
  metrics: { label: string; value: string }[];
};

const tickerTape = [
  ['SPX', '5,428.11', '+0.42', [28, 31, 29, 36, 39, 44, 42, 47, 51]],
  ['NDX', '19,102.44', '+0.61', [36, 34, 39, 46, 44, 51, 55, 53, 60]],
  ['BTC', '68,420', '+1.28', [30, 35, 33, 39, 47, 45, 51, 58, 62]],
  ['ETH', '3,720', '+0.84', [24, 28, 31, 29, 38, 41, 40, 45, 49]],
  ['DXY', '104.18', '-0.17', [62, 60, 57, 59, 54, 51, 53, 48, 46]],
  ['10Y', '4.28%', '+0.03', [44, 42, 46, 48, 45, 49, 51, 50, 53]],
] as const;

const researchSurfaces: Surface[] = [
  {
    id: 'market-brief',
    number: '01',
    label: 'General financial report',
    title: 'Monthly Market Brief',
    summary: 'A top-down reporting artifact for macro regime, risk appetite, equity leadership, crypto liquidity, and allocation notes.',
    status: 'Framework mock',
    output: 'Brief / PDF / web note',
    sourceBasis: ['Rates and inflation series', 'Index breadth tape', 'Dollar and liquidity checks', 'Cross-asset risk notes'],
    metrics: [
      { label: 'Cadence', value: 'Monthly' },
      { label: 'Coverage', value: 'Macro / equities / crypto' },
      { label: 'Authority', value: 'Preview data' },
    ],
  },
  {
    id: 'equity-memo',
    number: '02',
    label: 'Equity research',
    title: 'Equity Memo Surface',
    summary: 'Company research framed as artifact: filing notes, comparable valuation, unit economics, scenario range, and thesis breakpoints.',
    status: 'Research draft',
    output: 'Memo / model',
    sourceBasis: ['10-K and 10-Q notes', 'Comparable company table', 'Revenue and margin bridge', 'Bear/base/upside range'],
    metrics: [
      { label: 'Lens', value: 'Quality / valuation' },
      { label: 'Evidence', value: 'Filings' },
      { label: 'Authority', value: 'Draft surface' },
    ],
  },
  {
    id: 'crypto-map',
    number: '03',
    label: 'Crypto research',
    title: 'Protocol Map Surface',
    summary: 'Protocol research for liquidity, incentives, revenue capture, fee pressure, TVL durability, and token-demand structure.',
    status: 'Visual draft',
    output: 'Protocol map / notes',
    sourceBasis: ['Stablecoin supply', 'Protocol revenue', 'TVL retention', 'Exchange flow proxy'],
    metrics: [
      { label: 'Lens', value: 'Liquidity structure' },
      { label: 'Evidence', value: 'On-chain data' },
      { label: 'Authority', value: 'Mock feed' },
    ],
  },
  {
    id: 'model-workbook',
    number: '04',
    label: 'Models and tools',
    title: 'Model Workbook Surface',
    summary: 'Financial models, screeners, valuation bridges, dashboard notes, and source-backed assumptions in a quieter archive form.',
    status: 'Request only',
    output: 'Workbook / dashboard',
    sourceBasis: ['Assumption log', 'Scenario table', 'Sensitivity ranges', 'Export notes'],
    metrics: [
      { label: 'Format', value: 'Workbook' },
      { label: 'State', value: 'Private preview' },
      { label: 'Authority', value: 'Request only' },
    ],
  },
];

const archiveRows = [
  ['001', 'Monthly Market Brief', 'Macro / equities / crypto', 'Preview report', 'market-brief'],
  ['002', 'Enterprise Software Durability', 'Equity memo', 'Research draft', 'equity-memo'],
  ['003', 'Base Liquidity Flywheel', 'Crypto protocol', 'Visual draft', 'crypto-map'],
  ['004', 'Valuation Assumption Ledger', 'Model workbook', 'Request only', 'model-workbook'],
] as const;

const reportChecks = [
  ['Liquidity', 'Dollar, rates, stablecoin impulse', 'Monitor'],
  ['Evidence', 'Filings, peers, protocol revenue', 'Normalize'],
  ['Risk', 'Volatility, thesis breaks, event tape', 'Flag'],
  ['Output', 'Brief, memo, model, protocol map', 'Publish'],
] as const;

const deskRows = [
  ['Macro regime', 'FRED series / Treasury curve / credit spreads', 'Monthly brief', 'Framework mock'],
  ['Equity quality', '10-K notes / peer strip / margin bridge', 'Memo surface', 'Research draft'],
  ['Crypto liquidity', 'Stablecoins / TVL / protocol fees', 'Protocol map', 'Visual draft'],
  ['Risk register', 'Volatility tape / scenario table / breakpoints', 'Risk appendix', 'Preview only'],
] as const;

const evidenceFlowRows = [
  ['01', 'Market data', 'Price tape, macro series, filings, and on-chain observations enter as raw inputs.'],
  ['02', 'Evidence layer', 'Inputs are normalized into comparable tables, source notes, and assumption logs.'],
  ['03', 'Analysis core', 'The thesis is tested against valuation range, liquidity context, and breakpoints.'],
  ['04', 'Risk mapping', 'Tail risk, regime shifts, protocol fragility, and event exposure are separated from narrative.'],
  ['05', 'Research output', 'Briefs, memos, models, and protocol maps leave with preview state clearly labeled.'],
] as const;

const pathFromValues = (values: readonly number[], width = 128, height = 38) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

function Sparkline({ values, isDown = false }: { values: readonly number[]; isDown?: boolean }) {
  return (
    <svg viewBox="0 0 128 40" className="h-10 w-28 text-current" aria-hidden="true">
      <path d="M0 38H128" stroke="currentColor" strokeOpacity="0.12" />
      <path
        d={pathFromValues(values)}
        fill="none"
        stroke={isDown ? '#c2695e' : 'currentColor'}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        opacity="0.78"
      />
    </svg>
  );
}

function HeroSection({ onOpen }: { onOpen: (surface: SurfaceId) => void }) {
  return (
    <section className="relative z-10 bg-ink px-4 py-8 text-canvas md:px-8 md:py-12 xl:px-10">
      <div className="mx-auto max-w-[1480px] border-b border-canvas/12 pb-8 md:pb-10">
        <div className="grid gap-7 lg:grid-cols-12 lg:items-center">
          <div className="space-y-7 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-canvas/12 pb-4 text-[10px] uppercase tracking-[0.24em] text-canvas/42">
              <span>Markets</span>
              <span>Research desk</span>
            </div>

            <ScrollReveal blur={false}>
              <h1 className="max-w-[11ch] font-serif text-[clamp(4rem,7.4vw,8rem)] font-light uppercase leading-[0.78] tracking-normal">
                Markets
                <span className="block italic text-canvas/62">observed.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.08} blur={false}>
              <p className="max-w-xl font-serif text-[clamp(1.9rem,3vw,3.75rem)] italic leading-tight text-canvas/86">
                Financial evidence, arranged before narrative.
              </p>
            </ScrollReveal>

            <p className="max-w-lg text-sm leading-relaxed text-canvas/54">
              A reporting surface for macro context, equity memos, crypto protocol notes, and model workbooks. Every preview state is labeled before it looks authoritative.
            </p>
          </div>

          <div className="space-y-4 lg:col-span-6">
          <button
            type="button"
            onClick={() => onOpen('market-brief')}
            className="hover-target group relative grid min-h-[430px] w-full overflow-hidden border border-canvas/16 bg-[#050504] text-left md:min-h-[560px] xl:min-h-[620px]"
            data-cursor-text="BRIEF"
          >
            <CandlestickChart className="absolute inset-0 opacity-78 transition-transform duration-[1600ms] group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.06),rgba(8,8,7,0.64)_88%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/54 to-transparent" />
            <div className="absolute left-4 top-4 h-6 w-6 border-l border-t border-canvas/45" />
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-canvas/45" />
            <div className="absolute left-5 right-5 top-5 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-canvas/42">
              <span>Candlestick surface</span>
              <span>Simulated tape</span>
            </div>
            <div className="absolute bottom-5 left-5 max-w-xl md:bottom-7 md:left-7">
              <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/42">Primary artifact</p>
              <p className="mt-4 font-serif text-4xl italic leading-none text-canvas md:text-6xl xl:text-7xl">Market brief surface</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-canvas/58">
                Market structure context for the report. Values are placeholders, not live quotes.
              </p>
            </div>
            <div className="absolute right-5 top-20 hidden w-48 border-l border-canvas/14 pl-5 text-[10px] uppercase tracking-[0.22em] text-canvas/42 xl:block">
              {reportChecks.map(([label, source, state]) => (
                <div key={label} className="border-b border-canvas/10 py-4 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-canvas/70">{label}</span>
                    <span>{state}</span>
                  </div>
                  <p className="mt-3 normal-case leading-relaxed tracking-normal text-canvas/46">{source}</p>
                </div>
              ))}
            </div>
          </button>
          </div>
        </div>

        <div className="mt-6 grid gap-px border border-canvas/12 bg-canvas/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Coverage', 'Macro / equity / crypto / risk'],
            ['Inputs', 'Market data / filings / on-chain / macro'],
            ['Outputs', 'Reports / memos / models / maps'],
            ['State', 'Mock surfaces visibly labeled'],
          ].map(([label, value]) => (
            <div key={label} className="bg-ink p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-canvas/38">{label}</p>
              <p className="mt-3 text-sm leading-relaxed text-canvas/72">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReportMiniature() {
  return (
    <div className="relative overflow-hidden border border-ink/18 bg-canvas p-5">
      <div className="mb-6 flex items-center justify-between border-b border-ink/14 pb-5 text-[10px] uppercase tracking-[0.28em] text-ink/42">
        <span>Monthly market brief</span>
        <span>Preview packet</span>
      </div>

      <div className="grid gap-6 md:grid-cols-[0.54fr_0.46fr]">
        <div>
          <p className="font-serif text-4xl italic leading-none md:text-5xl">Signal before narrative.</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/58">
            Regime read, evidence basis, source checks, and report state in one controlled surface.
          </p>
          <div className="mt-7 border-t border-ink/12">
            {reportChecks.map(([label, source, state], index) => (
              <div key={label} className="grid grid-cols-[2.5rem_1fr_5.5rem] gap-4 border-b border-ink/10 py-3.5">
                <span className="font-serif text-2xl italic text-ink/35">0{index + 1}</span>
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-ink/42">{label}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink/62">{source}</span>
                </span>
                <span className="self-start text-right text-[10px] uppercase tracking-[0.2em] text-ink/42">{state}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-between gap-5">
          <svg viewBox="0 0 360 260" className="h-full min-h-[260px] w-full text-ink" aria-hidden="true">
            <rect x="0.5" y="0.5" width="359" height="259" fill="none" stroke="currentColor" opacity="0.16" />
            {[56, 104, 152, 200].map((y) => (
              <path key={y} d={`M24 ${y}H336`} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="2 8" />
            ))}
            {[26, 42, 34, 66, 72, 92, 86, 118, 141, 132, 162, 184, 176].map((value, index) => {
              const x = 28 + index * 24;
              const y = 226 - value;
              const isFilled = index % 3 === 0;

              return (
                <g key={`${value}-${index}`}>
                  <line x1={x + 4} x2={x + 4} y1={y - 22} y2={y + 32} stroke="currentColor" strokeOpacity="0.28" />
                  <rect x={x} y={y} width="8" height={28} fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" opacity={0.42 + index * 0.028} />
                </g>
              );
            })}
            <text x="24" y="32" fill="currentColor" opacity="0.46" fontSize="9" letterSpacing="2.4" fontFamily="Inter, sans-serif">
              REGIME TRACE / PLACEHOLDER
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-px bg-ink/12 text-[10px] uppercase tracking-[0.2em] text-ink/48">
            {[
              ['Report state', 'Framework mock'],
              ['Authority', 'Preview data'],
              ['Output', 'PDF / web brief'],
              ['Next layer', 'Models'],
            ].map(([label, value]) => (
              <div key={label} className="bg-canvas p-4">
                <p>{label}</p>
                <p className="mt-3 text-ink/72">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TickerTape() {
  return (
    <section className="relative z-10 bg-ink px-4 text-canvas md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1480px] border-b border-canvas/12 py-5">
        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-canvas/38">
          <span>Ticker tape</span>
          <span>Mock data / visual reference</span>
        </div>
        <div className="flex overflow-x-auto border-y border-canvas/10">
          {tickerTape.map(([label, value, change, values]) => {
            const isDown = change.startsWith('-');
            return (
              <div key={label} className="min-w-[14rem] border-r border-canvas/10 px-4 py-4 last:border-r-0">
                <div className="mb-4 flex items-start justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-canvas/42">
                  <span>{label}</span>
                  <span className={isDown ? 'text-[#c2695e]' : 'text-canvas/62'}>{change}</span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <span className="font-serif text-2xl italic leading-none text-canvas">{value}</span>
                  <Sparkline values={values} isDown={isDown} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DeskModules() {
  return (
    <section className="relative z-10 bg-canvas px-4 py-14 text-ink md:px-8 md:py-20 xl:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-8 border-b border-ink/14 pb-8 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-4" blur={false}>
            <h2 className="font-serif text-[clamp(3.25rem,6vw,6.75rem)] italic leading-[0.82] tracking-normal">
              Research desk.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="max-w-2xl text-sm leading-relaxed text-ink/68 lg:col-span-5 lg:col-start-8 lg:self-end" delay={0.08} blur={false}>
            <p>
              Calm modules for separating conditions, evidence, and output state. The structure is financial, but the hierarchy remains editorial.
            </p>
          </ScrollReveal>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="border-y border-ink/16">
            {deskRows.map(([title, basis, output, state], index) => (
              <article key={title} className="grid gap-5 border-b border-ink/12 py-[1.375rem] last:border-b-0 md:grid-cols-[4rem_1fr]">
                <p className="font-serif text-3xl italic text-ink/35">0{index + 1}</p>
                <div>
                  <div className="flex flex-col gap-3 border-b border-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="font-serif text-3xl italic leading-none md:text-4xl">{title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-ink/42">{state}</span>
                  </div>
                  <div className="mt-5 grid gap-4 text-sm leading-relaxed text-ink/62 sm:grid-cols-[1fr_0.54fr]">
                    <p>{basis}</p>
                    <p className="border-l border-ink/12 pl-4 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ink/48">{output}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <ReportMiniature />
        </div>
      </div>
    </section>
  );
}

function SurfaceProofStrip({ surface }: { surface: Surface }) {
  return (
    <div className="mt-5 grid border-t border-canvas/10 pt-4 text-[10px] uppercase tracking-[0.18em] text-canvas/46 sm:grid-cols-3">
      {surface.sourceBasis.slice(0, 3).map((basis) => (
        <span key={basis} className="border-b border-canvas/8 py-2 pr-4 sm:border-b-0 sm:border-r sm:last:border-r-0">
          {basis}
        </span>
      ))}
    </div>
  );
}

function SurfaceGlyph({ surfaceId }: { surfaceId: SurfaceId }) {
  const label = {
    'market-brief': 'Brief packet',
    'equity-memo': 'Memo stack',
    'crypto-map': 'Protocol map',
    'model-workbook': 'Workbook',
  }[surfaceId];

  return (
    <span className="hidden min-h-28 border border-canvas/12 p-3 text-canvas/48 md:block">
      <svg viewBox="0 0 160 96" className="h-24 w-full" aria-hidden="true">
        <rect x="0.5" y="0.5" width="159" height="95" fill="none" stroke="currentColor" opacity="0.28" />
        {surfaceId === 'market-brief' && (
          <>
            {[20, 42, 64, 86, 108, 130].map((x, index) => (
              <g key={x}>
                <line x1={x} x2={x} y1={24 + (index % 2) * 4} y2={74 - (index % 3) * 5} stroke="currentColor" opacity="0.26" />
                <rect x={x - 4} y={42 - index * 2} width="8" height={20 + (index % 2) * 9} fill={index % 2 ? 'currentColor' : 'none'} stroke="currentColor" opacity="0.46" />
              </g>
            ))}
            <path d="M14 76H146" stroke="currentColor" opacity="0.14" />
          </>
        )}
        {surfaceId === 'equity-memo' && (
          <>
            {[18, 30, 42, 60].map((y) => (
              <path key={y} d={`M20 ${y}H112`} stroke="currentColor" opacity={y === 18 ? 0.46 : 0.22} />
            ))}
            <rect x="20" y="66" width="96" height="12" fill="none" stroke="currentColor" opacity="0.24" />
            <path d="M124 18V78M136 30V78" stroke="currentColor" opacity="0.18" />
          </>
        )}
        {surfaceId === 'crypto-map' && (
          <>
            {[
              [38, 28],
              [78, 48],
              [124, 24],
              [116, 72],
              [42, 70],
            ].map(([cx, cy], index, nodes) => (
              <g key={`${cx}-${cy}`}>
                {index > 0 && <path d={`M${nodes[index - 1][0]} ${nodes[index - 1][1]}L${cx} ${cy}`} stroke="currentColor" opacity="0.18" />}
                <circle cx={cx} cy={cy} r={index === 1 ? 8 : 5} fill={index === 1 ? 'currentColor' : 'none'} stroke="currentColor" opacity={index === 1 ? 0.42 : 0.3} />
              </g>
            ))}
          </>
        )}
        {surfaceId === 'model-workbook' && (
          <>
            {[18, 36, 54, 72].map((y) => (
              <path key={y} d={`M16 ${y}H144`} stroke="currentColor" opacity="0.16" />
            ))}
            {[44, 76, 108].map((x) => (
              <path key={x} d={`M${x} 14V82`} stroke="currentColor" opacity="0.16" />
            ))}
            <rect x="76" y="36" width="32" height="18" fill="currentColor" opacity="0.16" />
            <rect x="108" y="54" width="36" height="18" fill="currentColor" opacity="0.22" />
          </>
        )}
      </svg>
      <span className="mt-2 block border-t border-canvas/10 pt-3 text-[10px] uppercase tracking-[0.22em] text-canvas/42">
        {label}
      </span>
    </span>
  );
}

function ResearchSurfaces({ onOpen }: { onOpen: (surface: SurfaceId) => void }) {
  return (
    <section className="relative z-10 bg-ink px-4 py-14 text-canvas md:px-8 md:py-20 xl:px-10">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
        <div className="border-t border-canvas/14 pt-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/42">Research surfaces</p>
          <h2 className="mt-8 font-serif text-[clamp(3.5rem,6vw,6.75rem)] italic leading-[0.8]">
            Research artifacts.
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-canvas/58">
            Each surface names the output, the source basis, and the proof state. The desk stays sparse so the evidence language can carry trust.
          </p>
        </div>

        <div className="border-y border-canvas/14">
          {researchSurfaces.map((surface) => (
            <button
              key={surface.id}
              type="button"
              onClick={() => onOpen(surface.id)}
              className="hover-target group grid w-full gap-5 border-b border-canvas/10 py-6 text-left outline-none transition-colors hover:bg-canvas/[0.015] focus-visible:bg-canvas/[0.025] focus-visible:ring-1 focus-visible:ring-canvas/20 last:border-b-0 md:grid-cols-[3.25rem_minmax(0,1fr)_11rem_2rem] xl:grid-cols-[3.5rem_minmax(0,1fr)_12rem_2rem]"
              data-cursor-text="OPEN"
            >
              <span className="font-serif text-3xl italic text-canvas/36">{surface.number}</span>
              <span>
                <span className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.22em] text-canvas/42 md:flex-row md:items-start md:justify-between">
                  <span>{surface.label}</span>
                  <span className="md:text-right">{surface.status} / {surface.output}</span>
                </span>
                <span className="mt-4 block font-serif text-4xl leading-none text-canvas md:text-5xl">{surface.title}</span>
                <span className="mt-4 block max-w-2xl text-sm leading-relaxed text-canvas/54">{surface.summary}</span>
                <SurfaceProofStrip surface={surface} />
              </span>
              <SurfaceGlyph surfaceId={surface.id} />
              <span className="justify-self-start text-canvas/46 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:justify-self-end">
                <ArrowUpRight size={15} strokeWidth={1.4} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function EvidenceMap() {
  return (
    <section className="relative z-10 bg-ink px-4 pb-16 text-canvas md:px-8 md:pb-20 xl:px-10">
      <div className="mx-auto max-w-[1480px] border-t border-canvas/14 pt-10">
        <div className="mb-7 grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/42">Financial evidence engine</p>
            <h2 className="mt-5 font-serif text-[clamp(3rem,5.4vw,6.25rem)] italic leading-[0.82]">
              Source to thesis.
            </h2>
          </div>
          <div className="grid gap-5 text-sm leading-relaxed text-canvas/56 lg:self-end">
            <p className="max-w-2xl">
              The market page should not imply live authority. This map is the visual contract: inputs become normalized evidence, evidence becomes analysis, and output remains labeled by proof state.
            </p>
            <div className="grid gap-px border border-canvas/10 bg-canvas/10 text-[10px] uppercase tracking-[0.2em] text-canvas/42 sm:grid-cols-4">
              {['Market data', 'Filings', 'On-chain', 'Risk mapping'].map((item) => (
                <span key={item} className="bg-ink p-3">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <InvestmentResearchMap className="aspect-[1000/620] w-full" />
        </div>
        <div className="grid border-y border-canvas/14 md:hidden">
          {evidenceFlowRows.map(([number, title, description]) => (
            <div key={title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-canvas/10 py-5 last:border-b-0">
              <span className="font-serif text-2xl italic text-canvas/36">{number}</span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-canvas/56">{title}</span>
                <span className="mt-3 block text-sm leading-relaxed text-canvas/58">{description}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchiveSection({ onOpen, onReadThesis }: { onOpen: (surface: SurfaceId) => void; onReadThesis: (idx: number) => void }) {
  return (
    <section className="relative z-10 bg-canvas px-4 py-16 text-ink md:px-8 md:py-24 xl:px-10">
      <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.34fr_0.66fr]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink/42">Archive</p>
          <h2 className="mt-8 font-serif text-[clamp(3.8rem,7vw,8rem)] italic leading-[0.82]">
            Reports with memory.
          </h2>
        </div>
        <div>
          <div className="border-y border-ink/14">
            {archiveRows.map(([number, title, scope, state, target]) => (
              <button
                key={number}
                type="button"
                onClick={() => onOpen(target)}
                className="hover-target grid w-full gap-4 border-b border-ink/10 py-6 text-left last:border-b-0 md:grid-cols-[4rem_1fr_12rem_10rem_3rem]"
                data-cursor-text="OPEN"
              >
                <span className="font-serif text-2xl italic text-ink/36">{number}</span>
                <span className="font-serif text-3xl leading-none">{title}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink/42">{scope}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink/42">{state}</span>
                <ArrowUpRight size={14} strokeWidth={1.4} />
              </button>
            ))}
          </div>

          <div className="mt-10 border border-ink/14">
            <div className="flex items-center justify-between border-b border-ink/12 px-5 py-4 text-[10px] uppercase tracking-[0.26em] text-ink/42">
              <span>Long-form thesis index</span>
              <BookOpen size={14} strokeWidth={1.5} />
            </div>
            {MARKET_THESES.map((thesis, idx) => (
              <article key={thesis.slug} className="grid gap-5 border-b border-ink/10 p-5 last:border-b-0 md:grid-cols-[4rem_1fr_13rem]">
                <p className="font-serif text-2xl italic text-ink/36">{thesis.number}</p>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink/42">{thesis.category} / {thesis.horizon}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-none md:text-4xl">{thesis.title}</h3>
                </div>
                <div className="flex items-end gap-4 text-[10px] uppercase tracking-[0.22em] md:justify-end">
                  <button type="button" onClick={() => onReadThesis(idx)} className="hover-target border-b border-ink/22 pb-2 hover:border-ink" data-cursor-text="READ">
                    Read memo
                  </button>
                  <a href={`/markets/${thesis.slug}`} className="hover-target border-b border-ink/22 pb-2 hover:border-ink" data-cursor-text="PAGE">
                    Page
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SurfaceModal({
  surface,
  onClose,
}: {
  surface: Surface | null;
  onClose: () => void;
}) {
  const ref = useFocusTrap(surface !== null);

  useEffect(() => {
    if (!surface) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [surface, onClose]);

  return (
    <AnimatePresence>
      {surface && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/84 px-4 py-8 text-canvas backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="surface-title"
        >
          <motion.div
            ref={ref}
            className="relative grid max-h-[88vh] w-full max-w-6xl overflow-auto border border-canvas/18 bg-ink shadow-2xl md:grid-cols-[1fr_0.42fr]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="hover-target absolute right-4 top-4 z-10 text-[10px] uppercase tracking-[0.28em] text-canvas/58 hover:text-canvas"
              data-cursor-text="CLOSE"
            >
              Close
            </button>
            <div className="p-6 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-canvas/42">{surface.label} / {surface.status}</p>
              <h3 id="surface-title" className="mt-8 max-w-3xl font-serif text-5xl leading-[0.92] md:text-7xl">
                {surface.title}
              </h3>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-canvas/62">{surface.summary}</p>
              <div className="mt-10 border-t border-canvas/12 pt-6">
                <p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-canvas/42">Source basis</p>
                <ul className="grid gap-4 text-sm leading-relaxed text-canvas/62">
                  {surface.sourceBasis.map((item) => (
                    <li key={item} className="border-b border-canvas/8 pb-3">- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <aside className="border-t border-canvas/14 p-6 md:border-l md:border-t-0 md:p-8">
              <div className="mb-8 border border-canvas/12 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/38">Artifact state</p>
                <p className="mt-5 font-serif text-4xl italic leading-none">{surface.output}</p>
                <p className="mt-5 text-sm leading-relaxed text-canvas/54">Preview surface. Not a live-data claim.</p>
              </div>
              <div className="grid gap-5">
                {surface.metrics.map((metric) => (
                  <div key={metric.label} className="border-t border-canvas/12 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-canvas/38">{metric.label}</p>
                    <p className="mt-2 font-serif text-3xl italic leading-none">{metric.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MarketsPage() {
  useSEO(MARKETS_SEO);
  const prefersReducedMotion = useReducedMotion();
  const [activeSurfaceId, setActiveSurfaceId] = useState<SurfaceId | null>(null);
  const [activeThesisId, setActiveThesisId] = useState<number | null>(null);

  const activeSurface = useMemo(
    () => researchSurfaces.find((surface) => surface.id === activeSurfaceId) ?? null,
    [activeSurfaceId],
  );

  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas antialiased selection:bg-canvas selection:text-ink md:cursor-none">
      <WireframeGrid tone="dark" className="pointer-events-none fixed inset-0 z-0 opacity-[0.08]" />
      <PageTechnicalChrome tone="dark" />

      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />
      <HeroSection onOpen={setActiveSurfaceId} />
      <TickerTape />
      <DeskModules />
      <ResearchSurfaces onOpen={setActiveSurfaceId} />
      <EvidenceMap />
      <ArchiveSection onOpen={setActiveSurfaceId} onReadThesis={(idx) => setActiveThesisId(idx)} />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] bg-ink px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/markets" tone="dark" />
      </div>

      <SurfaceModal surface={activeSurface} onClose={() => setActiveSurfaceId(null)} />

      <AnimatePresence>
        {activeThesisId !== null && (
          <ArticleReader
            isOpen={activeThesisId !== null}
            onClose={() => setActiveThesisId(null)}
            thesisId={activeThesisId}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default MarketsPage;
