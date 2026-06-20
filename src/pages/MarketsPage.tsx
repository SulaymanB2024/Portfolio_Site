import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useSEO } from '../utils/seo';

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
import { MARKET_THESES } from '../content/marketTheses';
import ArticleReader from '../components/ArticleReader';

const MARKETS_SEO = getSeoRoute('/markets')!;

// Mini spinning Compass/Reticle Icon for Page Header
function HeaderReticle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="text-[#f1efe8]/40 animate-spin-slow" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.5" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 2. Hero Section
function HeroSection() {
  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-[72px] items-center py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 relative z-10">
      {/* Left Column: Thesis Info */}
      <div className="space-y-9">
        <div className="flex items-center justify-between text-[10px] tracking-[0.18em] text-[#f1efe8]/45 uppercase font-mono">
          <span>INVESTMENT RESEARCH</span>
          <span>CASE ARCHIVE</span>
        </div>

        <h1
          aria-label="Traditional Cases, Crypto Research, and Market Reasoning"
          className="font-serif text-[clamp(42px,5.2vw,74px)] leading-[0.98] tracking-[-0.03em] text-[#f1efe8]"
        >
          Traditional Cases,{' '}<br />
          Crypto Research,{' '}<br />
          <span className="italic font-light opacity-95 text-[#b7c8a8]/90">&amp; Market Reasoning</span>
        </h1>

        <p className="font-sans text-sm text-[#f1efe8]/70 leading-relaxed max-w-lg">
          A collection of equity cases, sector theses, crypto protocol research, market structure work, and investment memos built around evidence, risk, valuation, and asymmetric opportunity.
        </p>
        <p className="max-w-lg border-l border-[#b7c8a8]/35 pl-4 text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/42">
          Public page note: research cards and modeled metrics are illustrative portfolio artifacts, not investment advice.
        </p>

        {/* Focus Areas list */}
        <div className="space-y-2 border-t border-[#f1efe8]/10 pt-6">
          <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/42 uppercase mb-3 font-mono">Focus Areas</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              'Public equities',
              'Private markets',
              'Crypto protocols',
              'Token economics',
              'Market structure'
            ].map((focus, i) => (
              <div key={focus} className="flex items-center gap-2 text-xs text-[#f1efe8]/80 font-mono">
                <span className="text-[#b7c8a8] text-[9px]">0{i + 1}</span>
                <span>{focus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Row */}
        <div className="grid grid-cols-3 gap-6 border-t border-[#f1efe8]/10 pt-6">
          <div>
            <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/42 uppercase mb-1.5 font-mono">RESEARCH TYPES</div>
            <div className="text-xs text-[#f1efe8]/80 font-mono">Equity / Crypto</div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/42 uppercase mb-1.5 font-mono">COVERAGE AREAS</div>
            <div className="text-xs text-[#f1efe8]/80 font-mono">Markets / Protocols</div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/42 uppercase mb-1.5 font-mono">OUTPUTS</div>
            <div className="text-xs text-[#f1efe8]/80 font-mono">Memos / Models / Theses</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['EQUITY RESEARCH', 'CRYPTO', 'VALUATION', 'MARKET STRUCTURE', 'TOKENOMICS'].map(tag => (
            <span key={tag} className="text-[8px] tracking-[0.16em] uppercase font-mono px-2.5 py-1 border border-[#f1efe8]/12 text-[#f1efe8]/60 bg-[#f1efe8]/[0.02]">
              [{tag}]
            </span>
          ))}
        </div>
      </div>

      {/* Right Column: Interactive Research Signal Flow */}
      <div className="w-full">
        <div className="group">
          <InvestmentResearchMap className="aspect-[1000/620] w-full transition-transform duration-700 group-hover:-translate-y-1" />
          <div className="mt-4 flex flex-col gap-3 border-b border-[#f1efe8]/12 pb-4 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/44 sm:flex-row sm:items-center sm:justify-between">
            <span>SIGNAL INPUTS: MARKET DATA / FILINGS / ON-CHAIN</span>
            <span>OUTPUT: CONVICTION-BACKED RESEARCH</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Research Lanes / Categories Band
function ResearchLanes() {
  const lanes = [
    {
      num: '01',
      title: 'Traditional Cases',
      desc: 'Public equity and private-market style memos focused on business quality, valuation, catalysts, and risk.'
    },
    {
      num: '02',
      title: 'Crypto Protocols',
      desc: 'Research on protocols, token economics, governance, liquidity, adoption, and market structure.'
    },
    {
      num: '03',
      title: 'Market & Macro',
      desc: 'Work connecting price behavior, liquidity regimes, rates, credit, risk appetite, and capital flows.'
    },
    {
      num: '04',
      title: 'Models & Tools',
      desc: 'Financial models, valuation frameworks, dashboards, screeners, and analytical tooling.'
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 relative z-10">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono mb-8">
        RESEARCH LANES
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {lanes.map((lane) => (
          <div 
            key={lane.num} 
            className="flex flex-col justify-between h-full p-6 border border-[#f1efe8]/12 bg-[#f1efe8]/[0.01] transition-all duration-500 hover:bg-[#f1efe8]/[0.025] hover:-translate-y-1 hover:border-[#f1efe8]/30 relative group overflow-hidden before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-[#f1efe8]/45 before:transition-all before:duration-700 hover:before:w-full"
          >
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />

            <div className="text-[14px] font-serif italic text-[#b7c8a8]/60 mb-6 group-hover:text-[#b7c8a8] transition-colors pt-2">
              {lane.num}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-mono text-[#f1efe8] mb-3">
                {lane.title}
              </h4>
              <p className="text-xs text-[#f1efe8]/54 leading-relaxed font-sans mb-2">
                {lane.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 4. Featured Cases Section
function FeaturedCases({ onOpenArtifact }: { onOpenArtifact: (id: string) => void }) {
  const cases = [
    {
      id: 'pdf-memo',
      num: 'CASE 01',
      tag: 'TRADITIONAL EQUITY',
      asset: 'ASSET: APPIAN GROUP (NASDAQ: APPN)',
      title: 'Mispricing of Enterprise Software Durability',
      desc: "Thesis: Appian's low-code workflow integration establishes structural lock-in that the market is discounting due to short-term cyclical tech spend deceleration.",
      horizon: '12-18 Months / Completed',
      question: 'Is durable recurring revenue being mispriced as transactional?',
      cta: 'VIEW VALUATION MEMO'
    },
    {
      id: 'protocol-map',
      num: 'CASE 02',
      tag: 'CRYPTO PROTOCOL',
      asset: 'PROTOCOL: AERODROME FINANCE (BASE)',
      title: 'Dominant Liquidity Engine & ve(3,3) Flywheel',
      desc: "Thesis: Aerodrome has successfully cornered Base liquidity. Its ve-token mechanics align trader fees and voter bribes, creating a durable fee generation loop.",
      horizon: 'Tokenomics / In Progress',
      question: 'Are emissions structural vs reflexive speculation?',
      cta: 'EXPLORE FLYWHEEL MAP'
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
        FEATURED CASES
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cases.map((c) => (
          <div 
            key={c.num}
            onClick={() => onOpenArtifact(c.id)}
            className="hover-target border border-[#f1efe8]/12 p-6 bg-[#080807] relative group flex flex-col justify-between min-h-[340px] hover:border-[#f1efe8]/30 hover:bg-[#f1efe8]/[0.015] hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-[#f1efe8]/45 before:transition-all before:duration-700 hover:before:w-full"
          >
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />

            {/* Standard Header Row */}
            <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/42 font-mono pt-2">
              <span>{c.num}</span>
              <span className={c.id === 'pdf-memo' ? 'text-[#b7c8a8]' : 'text-[#c2695e]'}>{c.tag}</span>
            </div>

            <div className="space-y-4 pt-6">
              <div className="text-[10px] tracking-widest text-[#f1efe8]/40 font-mono uppercase">{c.asset}</div>
              <h3 className="font-serif text-2xl lg:text-3xl text-[#f1efe8] leading-tight group-hover:text-[#b7c8a8] transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-[#f1efe8]/60 leading-relaxed font-sans max-w-lg">
                {c.desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#f1efe8]/10 pt-4 mt-6 font-mono text-[9px] text-[#f1efe8]/50 uppercase">
              <div>
                <span className="block text-[#f1efe8]/30">Horizon / Status</span>
                <span className="text-[11px] text-[#f1efe8]/80 font-sans tracking-normal font-medium">{c.horizon}</span>
              </div>
              <div>
                <span className="block text-[#f1efe8]/30">Core Question</span>
                <span className="text-[9.5px] text-[#f1efe8]/80 tracking-tight lowercase first-letter:uppercase font-sans font-medium">{c.question}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[9px] uppercase tracking-wider font-mono text-[#b7c8a8] border-t border-[#f1efe8]/5">
              <span>{c.cta}</span>
              <span>↗</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 5. Traditional Investment Cases Section (Detailed Folder Foldouts)
interface Artifact {
  id: string;
  tag: string;
  title: string;
  summary: string;
  date: string;
  status: string;
  author: string;
  highlights: string[];
  metrics: { key: string; val: string }[];
}

function TraditionalCasesSection({ onOpenArtifact }: { onOpenArtifact: (id: string) => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const cases = [
    {
      company: 'Appian Group / Enterprise Software',
      thesis: 'Low-code system orchestration has high lock-in with a market discounting duration risk.',
      drivers: [
        'Revenue durability through high customer retention',
        'Margin expansion as implementation partner mix normalizes',
        'Multiple rerating from oversold SaaS multiples',
        'Optimal capital allocation focusing on organic R&D'
      ],
      evidence: [
        '10-K & 10-Q filing analysis showing cohort stickiness',
        'Comparable company tables (peer valuation ranges)',
        'Unit economics (CAC recovery under 18 months)',
        'Management transcripts on partner program transition'
      ],
      outputs: ['Full Memo', 'Valuation Model', 'Risk Table']
    },
    {
      company: 'Critical Infrastructure Supply / Industrial Supply Chain',
      thesis: 'Public procurement and reshoring incentives can create a structural domestic CapEx cycle, insulating leader margin structures.',
      drivers: [
        'CapEx cycle expansion supported by public funding',
        'Specialized operating scale protecting pricing power',
        'Supplier concentration insulating critical inputs',
        'Margin preservation via pass-through contract structures'
      ],
      evidence: [
        'Federal funding maps and award application data',
        'OEM backlog analysis and long-lead equipment timelines',
        'Supplier revenue dependencies and raw material flows',
        'Geopolitical risk matrix modeling export blocks'
      ],
      outputs: ['Sector Briefing', 'Valuation Model', 'Supply Chain Map']
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="space-y-2">
        <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
          TRADITIONAL INVESTMENT CASES
        </div>
        <p className="text-xs text-[#f1efe8]/50 font-sans max-w-xl">
          Equity research, business analysis, valuation work, and market-facing investment reasoning.
        </p>
      </div>

      <div className="space-y-4">
        {cases.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div 
              key={idx} 
              className="border border-[#f1efe8]/12 bg-[#080807] transition-all duration-300 overflow-hidden relative group"
            >
              {/* Folder tab trigger */}
              <button 
                id={`trad-case-btn-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                aria-expanded={isExpanded}
                aria-controls={`trad-case-panel-${idx}`}
                className="w-full flex items-center justify-between p-5 hover-target text-left font-mono uppercase text-xs tracking-wider"
                data-cursor-text={isExpanded ? 'CLOSE' : 'OPEN'}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#b7c8a8] font-semibold">0{idx + 1}</span>
                  <span className="text-[#f1efe8]">{item.company}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#f1efe8]/40">
                  <span>{isExpanded ? 'COLLAPSE [-]' : 'EXPAND CASE [+]'}</span>
                </div>
              </button>

              {/* Collapsible folder contents */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div 
                    id={`trad-case-panel-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-[#f1efe8]/12"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-[#f1efe8]/70">
                      
                      {/* Column 1: Thesis & Drivers */}
                      <div className="space-y-4 border-r border-[#f1efe8]/12 pr-6 last:border-r-0">
                        <div className="text-[9px] tracking-[0.18em] text-[#b7c8a8] font-mono uppercase">Mispricing Thesis</div>
                        <p className="font-serif italic text-sm text-[#f1efe8]/90">{item.thesis}</p>
                        
                        <div className="space-y-2 pt-2">
                          <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/40 font-mono uppercase">Core Drivers</div>
                          <ul className="list-disc list-inside space-y-1 text-[#f1efe8]/60 font-sans">
                            {item.drivers.map((drv, i) => (
                              <li key={i} className="pl-1 text-[11.5px]">{drv}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Column 2: Evidence */}
                      <div className="space-y-4 border-r border-[#f1efe8]/12 pr-6 last:border-r-0">
                        <div className="text-[9px] tracking-[0.18em] text-[#b7c8a8] font-mono uppercase">Evidence &amp; Analysis</div>
                        <ul className="space-y-2.5 font-sans">
                          {item.evidence.map((ev, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-[#b7c8a8] font-mono text-[9px] mt-0.5">▪</span>
                              <span className="text-[11.5px]">{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Output References */}
                      <div className="space-y-4">
                        <div className="text-[9px] tracking-[0.18em] text-[#b7c8a8] font-mono uppercase">Research Outputs</div>
                        <div className="space-y-2">
                          {item.outputs.map((out, i) => {
                            let targetId = '';
                            if (out === 'Full Memo') targetId = 'pdf-memo';
                            else if (out === 'Valuation Model') targetId = 'valuation-model';

                            return (
                              <button 
                                key={i} 
                                onClick={() => targetId && onOpenArtifact(targetId)}
                                className={`w-full border border-[#f1efe8]/12 px-4 py-2.5 flex items-center justify-between text-[10px] tracking-wider uppercase font-mono bg-[#f1efe8]/[0.01] hover:bg-[#f1efe8]/[0.03] hover:border-[#f1efe8]/30 hover:text-[#b7c8a8] transition-all duration-300 ${targetId ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                                data-cursor-text={targetId ? 'PREVIEW' : undefined}
                              >
                                <span>{out}</span>
                                <span className="text-[8px] opacity-40">{targetId ? '⤓ PREVIEW' : 'ACCESS REQUIRED'}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-[#f1efe8]/40 font-mono pt-2">
                          SECURE REPOSITORY ACCESS CODE: AUTH.TRAD.04
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 6. Crypto Research Section
function CryptoResearchSection({ onOpenArtifact }: { onOpenArtifact: (id: string) => void }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const cases = [
    {
      protocol: 'Aerodrome Finance / Base Liquidity Engine',
      thesis: 'VE(3,3) token incentives align fees and voter bribes, creating a permanent liquidity moat.',
      questions: [
        { q: 'What creates value?', a: 'DEX swap volumes generating trading fees and protocol votes.' },
        { q: 'Who captures value?', a: 'veAERO locker votes capturing 100% of fees and ecosystem bribes.' },
        { q: 'Is token demand structural?', a: 'Structural from protocols buying to vote-direct emissions; reflexive from yield buyers.' },
        { q: 'Where can the thesis break?', a: 'High inflation decay outpacing swap fees; sudden migration of Base activity to L3s.' }
      ],
      evidence: [
        'Weekly protocol fee & bribe efficiency telemetry',
        'TVL retention metrics relative to competitor emissions',
        'Token locker distributions and lock duration trends',
        'Governance voter concentration indexes'
      ],
      outputs: ['Protocol Memo', 'Token Economics Map', 'Locker Dashboard']
    },
    {
      protocol: 'Ethereum L2 Blob-Space / Scaling Economics',
      thesis: 'EIP-4844 decreases L2 costs, boosting sequencer margin profiles before fee competition compresses them.',
      questions: [
        { q: 'What creates value?', a: 'Sequencer gas margins (L2 user fees minus L1 data publication costs).' },
        { q: 'Who captures value?', a: 'L2 rollup treasuries and protocol token structures.' },
        { q: 'Is token demand structural?', a: 'Fee-based and sequencer stake requirements.' },
        { q: 'Where can the thesis break?', a: 'Blob-space supply glut causing fee race to bottom; rapid L2 fragmentation.' }
      ],
      evidence: [
        'Blob gas price and transaction density on L1',
        'Sequencer profit margins pre and post EIP-4844',
        'L2 active addresses and user retention data',
        'Rollup code bases and fee allocation metrics'
      ],
      outputs: ['On-chain Notes', 'Data Cost Model']
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="space-y-2">
        <div className="text-[10px] tracking-[0.24em] uppercase text-[#c2695e] font-mono">
          CRYPTO RESEARCH
        </div>
        <p className="text-xs text-[#f1efe8]/50 font-sans max-w-xl">
          Protocol design, token economics, on-chain dynamics, and structural liquidity evaluations.
        </p>
      </div>

      <div className="space-y-4">
        {cases.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div 
              key={idx} 
              className="border border-[#f1efe8]/12 bg-[#080807] transition-all duration-300 overflow-hidden relative group"
            >
              {/* Folder tab trigger */}
              <button 
                id={`crypto-case-btn-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                aria-expanded={isExpanded}
                aria-controls={`crypto-case-panel-${idx}`}
                className="w-full flex items-center justify-between p-5 hover-target text-left font-mono uppercase text-xs tracking-wider"
                data-cursor-text={isExpanded ? 'CLOSE' : 'OPEN'}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[#c2695e] font-semibold">0{idx + 1}</span>
                  <span className="text-[#f1efe8]">{item.protocol}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#f1efe8]/40">
                  <span>{isExpanded ? 'COLLAPSE [-]' : 'EXPAND CASE [+]'}</span>
                </div>
              </button>

              {/* Collapsible folder contents */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div 
                    id={`crypto-case-panel-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-[#f1efe8]/12"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-[#f1efe8]/70">
                      
                      {/* Column 1: Thesis & Core Questions */}
                      <div className="space-y-4 border-r border-[#f1efe8]/12 pr-6 last:border-r-0">
                        <div className="text-[9px] tracking-[0.18em] text-[#c2695e] font-mono uppercase">Thesis &amp; Economic Value</div>
                        <p className="font-serif italic text-sm text-[#f1efe8]/90">{item.thesis}</p>
                        
                        <div className="space-y-3 pt-2">
                          <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/40 font-mono uppercase font-semibold">Core Questions</div>
                          <div className="space-y-2">
                            {item.questions.map((q, i) => (
                              <div key={i} className="text-[11px] font-sans">
                                <span className="block font-mono text-[8.5px] text-[#c2695e]/80 uppercase">{q.q}</span>
                                <span className="text-[#f1efe8]/70">{q.a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: On-Chain Evidence */}
                      <div className="space-y-4 border-r border-[#f1efe8]/12 pr-6 last:border-r-0">
                        <div className="text-[9px] tracking-[0.18em] text-[#c2695e] font-mono uppercase">On-Chain Evidence</div>
                        <ul className="space-y-2.5 font-sans">
                          {item.evidence.map((ev, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-[#c2695e] font-mono text-[9px] mt-0.5">▪</span>
                              <span className="text-[11.5px]">{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Outputs */}
                      <div className="space-y-4">
                        <div className="text-[9px] tracking-[0.18em] text-[#c2695e] font-mono uppercase">Protocol Artifacts</div>
                        <div className="space-y-2">
                          {item.outputs.map((out, i) => {
                            let targetId = '';
                            if (out === 'Protocol Memo' || out === 'Token Economics Map') targetId = 'protocol-map';
                            else if (out === 'On-chain Notes') targetId = 'on-chain-notes';
                            else if (out === 'Locker Dashboard') targetId = 'market-dashboard';
                            else if (out === 'Data Cost Model') targetId = 'valuation-model';

                            return (
                              <button 
                                key={i} 
                                onClick={() => targetId && onOpenArtifact(targetId)}
                                className={`w-full border border-[#f1efe8]/12 px-4 py-2.5 flex items-center justify-between text-[10px] tracking-wider uppercase font-mono bg-[#f1efe8]/[0.01] hover:bg-[#f1efe8]/[0.03] hover:border-[#f1efe8]/30 hover:text-[#c2695e] transition-all duration-300 ${targetId ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                                data-cursor-text={targetId ? 'PREVIEW' : undefined}
                              >
                                <span>{out}</span>
                                <span className="text-[8px] opacity-40">{targetId ? '⤓ PREVIEW' : 'ACCESS REQUIRED'}</span>
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-[#f1efe8]/40 font-mono pt-2">
                          SECURE REPOSITORY ACCESS CODE: AUTH.CRYPT.08
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 7. Research Process Section
function ResearchProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Frame the Question',
      desc: 'Isolate the core investment query. Determine what measurable variables would prove the thesis wrong.'
    },
    {
      num: '02',
      title: 'Build the Base Case',
      desc: 'Understand business fundamentals, protocol mechanics, market constraints, and competitive maps.'
    },
    {
      num: '03',
      title: 'Test the Mispricing',
      desc: 'Contrast consensus expectations against bottom-up modeling, on-chain flows, and pricing power.'
    },
    {
      num: '04',
      title: 'Map the Risk',
      desc: 'Quantify systemic break-points: tail risks, regulatory friction, liquidity gaps, and key person risks.'
    },
    {
      num: '05',
      title: 'Produce the Output',
      desc: 'Translate analysis into actionable items: memos, spreadsheets, code-bases, or decision-ready frameworks.'
    }
  ];

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
        RESEARCH METHOD
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {steps.map((step) => (
          <div key={step.num} className="space-y-3 relative group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-serif italic text-[#b7c8a8]">{step.num}</span>
              <div className="h-[1px] bg-[#f1efe8]/10 flex-1 hidden md:block group-last:hidden" />
            </div>
            <h4 className="text-[10px] uppercase tracking-widest font-mono text-[#f1efe8]">{step.title}</h4>
            <p className="text-[11px] text-[#f1efe8]/50 leading-relaxed font-sans">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 7.5 Research Theses & Memos Section
function ResearchMemosSection({ onReadThesis }: { onReadThesis: (idx: number) => void }) {
  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="space-y-2">
        <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
          RESEARCH MEMOS &amp; ARTICLES
        </div>
        <p className="text-xs text-[#f1efe8]/50 font-sans max-w-xl">
          Research examples, technical SEO articles, AI-search infrastructure notes, and structural market logic.
        </p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/38 font-sans max-w-xl">
          Research pages are portfolio artifacts for method and writing review; verify assumptions and sources before relying on any thesis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MARKET_THESES.map((thesis, idx) => {
          const primaryMetric = thesis.metrics?.[0] ?? { label: 'Conviction', value: thesis.conviction };

          return (
            <div
              key={thesis.slug}
              className="flex flex-col justify-between h-full p-6 border border-[#f1efe8]/12 bg-[#f1efe8]/[0.01] hover:bg-[#f1efe8]/[0.025] hover:-translate-y-1 hover:border-[#f1efe8]/30 transition-all duration-500 relative group overflow-hidden before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-[#f1efe8]/45 before:transition-all before:duration-700 hover:before:w-full"
            >
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />

            <div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/42 font-mono pt-2 mb-4">
                <span>MEMO 0{thesis.number}</span>
                <span>{thesis.readTime}</span>
              </div>
              
              <h3 className="font-serif italic text-2xl text-[#f1efe8] leading-tight group-hover:text-[#b7c8a8] transition-colors mb-3">
                {thesis.title.replace('On the ', '').replace('Computational ', '')}
              </h3>
              
              <p className="text-xs text-[#f1efe8]/60 leading-relaxed font-sans mb-8">
                {thesis.subtitle}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#f1efe8]/8">
              <div className="flex justify-between font-mono text-[9px] uppercase">
                <span className="text-[#f1efe8]/30">{primaryMetric.label}</span>
                <span className="text-[#b7c8a8]">{primaryMetric.value}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onReadThesis(idx)}
                  className="flex-1 hover-target border border-[#f1efe8]/15 px-3 py-2 text-[9px] uppercase tracking-[0.2em] font-mono text-[#f1efe8]/80 hover:text-[#b7c8a8] hover:border-[#b7c8a8] hover:bg-[#f1efe8]/5 transition-all text-center"
                  data-cursor-text="READ"
                >
                  READ MEMO
                </button>
                <a
                  href={`/markets/${thesis.slug}`}
                  className="flex-1 hover-target border border-[#f1efe8]/15 px-3 py-2 text-[9px] uppercase tracking-[0.2em] font-mono text-[#f1efe8]/60 hover:text-[#f1efe8] hover:border-[#f1efe8]/30 text-center flex items-center justify-center gap-1"
                  data-cursor-text="OPEN"
                >
                  <span>PAGE</span> <span>↗</span>
                </a>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// 8. Artifact Section (With highly designed functional modals)
function ArtifactSection({ 
  activeArtifact, 
  setActiveArtifact, 
  artifacts 
}: { 
  activeArtifact: Artifact | null; 
  setActiveArtifact: (art: Artifact | null) => void; 
  artifacts: Artifact[];
}) {
  const containerRef = useFocusTrap(!!activeArtifact);

  useEffect(() => {
    if (activeArtifact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArtifact(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeArtifact, setActiveArtifact]);

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-16 md:py-20 lg:py-24 border-b border-[#f1efe8]/12 space-y-8 relative z-10">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
        RESEARCH ARTIFACTS
      </div>

      <div className="flex flex-wrap gap-3">
        {artifacts.map((art) => (
          <button 
            key={art.id}
            id={`markets-artifact-btn-${art.id}`}
            onClick={() => setActiveArtifact(art)}
            className="hover-target border border-[#f1efe8]/12 px-5 py-3 text-[10px] uppercase font-mono tracking-widest text-[#f1efe8]/80 bg-[#f1efe8]/[0.01] hover:border-[#f1efe8]/24 hover:bg-[#f1efe8]/[0.03] transition-all duration-300 relative group"
            data-cursor-text="PREVIEW"
          >
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/15 group-hover:border-[#b7c8a8] transition-colors" />
            <span>[{art.tag}]</span>
          </button>
        ))}
      </div>

      {/* Styled Interactive Modals */}
      <AnimatePresence>
        {activeArtifact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080807]/80 backdrop-blur-sm">
            {/* Backdrop Close Click */}
            <div className="absolute inset-0" onClick={() => setActiveArtifact(null)} />
            
            {/* Modal Body */}
            <motion.div 
              ref={containerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="artifact-modal-title"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#080807] border border-[#f1efe8]/20 p-6 md:p-8 space-y-6 z-10 overflow-hidden shadow-2xl"
            >
              {/* Corner Indicators (Real CSS Borders) */}
              <div className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 border-l border-t border-[#f1efe8]/30" />
              <div className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 border-r border-t border-[#f1efe8]/30" />
              <div className="absolute -left-1.5 -bottom-1.5 h-3.5 w-3.5 border-l border-b border-[#f1efe8]/30" />
              <div className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 border-r border-b border-[#f1efe8]/30" />

              {/* Technical telemetry string headers */}
              <div className="absolute top-3 left-4 text-[8px] text-[#f1efe8]/20 font-mono tracking-widest">// PREVIEW_TELEMETRY_SYS</div>
              <div className="absolute bottom-3 right-4 text-[8px] text-[#f1efe8]/20 font-mono tracking-widest">// AUTH_SYS_OK</div>

              {/* Close Button */}
              <button 
                id="artifact-modal-close-btn"
                onClick={() => setActiveArtifact(null)}
                className="absolute top-4 right-4 hover-target font-mono text-[9px] uppercase tracking-widest text-[#f1efe8]/40 hover:text-[#f1efe8] transition-colors px-2 py-1 border border-[#f1efe8]/10 bg-[#080807] z-20"
                data-cursor-text="CLOSE"
              >
                CLOSE [X]
              </button>

              <div className="space-y-4 pt-4">
                <div className="text-[9px] tracking-[0.24em] text-[#b7c8a8] font-mono uppercase font-semibold">
                  {activeArtifact.tag}
                </div>
                
                <h3 id="artifact-modal-title" className="font-serif text-2xl lg:text-3xl text-[#f1efe8] leading-tight">
                  {activeArtifact.title}
                </h3>
                
                <p className="text-xs text-[#f1efe8]/70 leading-relaxed font-sans select-text">
                  {activeArtifact.summary}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-[#f1efe8]/10 py-4 text-[9px] font-mono uppercase text-[#f1efe8]/50">
                <div>
                  <span className="block text-[#f1efe8]/30">Published</span>
                  <span className="text-[10px] text-[#f1efe8]/80 font-sans tracking-normal">{activeArtifact.date}</span>
                </div>
                <div>
                  <span className="block text-[#f1efe8]/30">Artifact State</span>
                  <span className="text-[10px] text-[#f1efe8]/80 font-sans tracking-normal">{activeArtifact.status}</span>
                </div>
                <div>
                  <span className="block text-[#f1efe8]/30">Author</span>
                  <span className="text-[10px] text-[#f1efe8]/80 font-sans tracking-normal">{activeArtifact.author}</span>
                </div>
              </div>

              {/* Detail insights / Key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 text-xs leading-relaxed">
                {/* Highlights list */}
                <div className="space-y-3">
                  <div className="text-[9px] tracking-[0.18em] text-[#b7c8a8] font-mono uppercase font-semibold">Key Insights</div>
                  <ul className="space-y-2 font-sans text-[#f1efe8]/60">
                    {activeArtifact.highlights.map((hl, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-[#b7c8a8] font-mono text-[9px] mt-0.5">▪</span>
                        <span className="text-[11px]">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantitative statistics */}
                <div className="space-y-3 bg-[#f1efe8]/[0.01] border border-[#f1efe8]/8 p-4">
                  <div className="text-[9px] tracking-[0.18em] text-[#f1efe8]/40 font-mono uppercase">Metrics / Models</div>
                  <div className="space-y-2">
                    {activeArtifact.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between font-mono text-[10px] uppercase border-b border-[#f1efe8]/6 pb-1.5 last:border-b-0 last:pb-0">
                        <span className="text-[#f1efe8]/45">{m.key}</span>
                        <span className="text-[#f1efe8] font-medium">{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action area */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f1efe8]/10">
                <div className="font-mono text-[8px] text-[#f1efe8]/30 tracking-widest">
                  PUBLIC PREVIEW: FULL FILE NOT BUNDLED
                </div>
                
                <a
                  id="artifact-request-btn"
                  href={`mailto:sulayman.bowles@gmail.com?subject=${encodeURIComponent(`Research artifact request: ${activeArtifact.title}`)}`}
                  className="hover-target w-full sm:w-auto bg-[#f1efe8] text-[#080807] font-mono text-[10px] font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-[#f1efe8]/90 transition-colors disabled:opacity-50 text-center"
                  data-cursor-text="REQUEST"
                >
                  REQUEST FULL FILE
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Case/Memo Utilities Component
function CaseUtilities() {
  const copyCurrentUrl = () => {
    void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  return (
    <section className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9.5px] uppercase tracking-[0.2em] font-mono text-[#f1efe8]/42 border-b border-[#f1efe8]/12 relative z-10">
      {/* Left: Statement */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border border-[#f1efe8]/20 flex items-center justify-center text-[8px] text-[#b7c8a8]">
          ◈
        </div>
        <span>Start with the thesis. Build with conviction.</span>
      </div>

      {/* Center: Share */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[8px] text-[#f1efe8]/30">ARCHIVE</span>
        <a href="/markets/network-monopolies" className="hover-target inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">MEMO 01</a>
        <a href="/markets/computational-commodity-systems" className="hover-target inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">MEMO 02</a>
        <a href="/markets/fiat-horizon" className="hover-target inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-[#f1efe8]" data-cursor-text="READ">MEMO 03</a>
        <button className="hover-target inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-[#f1efe8]" data-cursor-text="COPY" onClick={copyCurrentUrl}>COPY</button>
      </div>

      {/* Right: Export */}
      <button 
        onClick={() => window.print()}
        className="hover-target flex min-h-11 items-center gap-2 border border-[#f1efe8]/12 bg-[#080807] px-3 py-1.5 transition-colors hover:text-[#f1efe8]"
        data-cursor-text="EXPORT"
      >
        <span>Print / Save PDF</span>
        <span className="text-[8px] opacity-60">⤓</span>
      </button>
    </section>
  );
}

// Main Page Export
export default function MarketsPage() {
  useSEO(MARKETS_SEO);

  const prefersReducedMotion = useReducedMotion();
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [activeThesisId, setActiveThesisId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const artifacts: Artifact[] = [
    {
      id: 'pdf-memo',
      tag: 'PDF MEMO',
      title: 'Appian Group (NASDAQ: APPN) Valuation Memo',
      summary: 'A 24-page deep dive reviewing workflow orchestration durability, recurring contract structures, and competitive moats in low-code platforms.',
      date: 'May 14, 2026',
      status: 'Preview only',
      author: 'Sulayman Bowles',
      highlights: [
        'Contract lock-in modeling showing less than 1.5% churn in core enterprise tier.',
        'Gross margins expansion profile from 73.1% to 76.5% over three years.',
        'Downside sensitivity analysis assuming a 15% discount to consensus market rate.'
      ],
      metrics: [
        { key: 'Target Multiple', val: '14.0x EV/Sales' },
        { key: 'Upside Potential', val: '+45%' },
        { key: 'Margin of Safety', val: '28%' }
      ]
    },
    {
      id: 'valuation-model',
      tag: 'VALUATION MODEL',
      title: 'Appian DCF & LBO Financial Spreadsheet',
      summary: 'Granular financial model containing a multi-stage Discounted Cash Flow and leveraged buyout scenario matrix built for valuation testing.',
      date: 'May 12, 2026',
      status: 'Available on request',
      author: 'Sulayman Bowles',
      highlights: [
        'Fully dynamic WACC calculations responding to sovereign interest rate shifts.',
        'Downside scenario toggle mapping revenue contraction vs capital allocation.',
        'Comparable metrics engine polling historical enterprise tech exits.'
      ],
      metrics: [
        { key: 'Base Case IRR', val: '19.4%' },
        { key: 'Bear Case IRR', val: '7.8%' },
        { key: 'WACC Estimate', val: '8.25%' }
      ]
    },
    {
      id: 'protocol-map',
      tag: 'PROTOCOL MAP',
      title: 'Aerodrome ve(3,3) Flywheel Mechanics',
      summary: 'System architecture map detail diagraming token emission decays, fee distributions, and structural voting alignments.',
      date: 'May 16, 2026',
      status: 'Preview only',
      author: 'Sulayman Bowles',
      highlights: [
        'Vector paths of token routing from liquidity pools back to governance lockers.',
        'Bribe efficiency ratios mapping costs per dollar of voter incentives.',
        'Inflation schedule calculations including decay parameters.'
      ],
      metrics: [
        { key: 'Fee Capture Rate', val: '100%' },
        { key: 'Emissions Decay', val: '-1.8% / wk' },
        { key: 'Avg Lock Duration', val: '3.6 Yrs' }
      ]
    },
    {
      id: 'market-dashboard',
      tag: 'MARKET DASHBOARD',
      title: 'Global Liquidity & Volatility Analytics',
      summary: 'Interactive database covering sovereign balance sheets, yield curves, credit spreads, and local compression signals.',
      date: 'May 18, 2026',
      status: 'Framework preview',
      author: 'Sulayman Bowles',
      highlights: [
        'M2 money supply velocity charts across USA, EU, and China.',
        'Credit volatility indices relative to historical regime averages.',
        'Local range boundary indicators for currency swap bands.'
      ],
      metrics: [
        { key: 'M2 Growth (Global)', val: '+2.4%' },
        { key: 'Credit Volatility', val: 'Low (14.2)' },
        { key: 'Regime Classification', val: 'Compression' }
      ]
    },
    {
      id: 'on-chain-notes',
      tag: 'ON-CHAIN NOTES',
      title: 'Ethereum L2 Blob-Space Cost Analysis',
      summary: 'On-chain telemetry mapping transaction costs, data publication rates, and sequencer profits after the Dencun upgrade.',
      date: 'May 15, 2026',
      status: 'Framework preview',
      author: 'Sulayman Bowles',
      highlights: [
        'Data publishing margins across Arbitrum, Optimism, and Base.',
        'Blob gas limit density analysis (capacity vs usage).',
        'Sequencer fee extraction models under competitive rollup scenarios.'
      ],
      metrics: [
        { key: 'Avg Blob Gas Cost', val: '< 0.01 Gwei' },
        { key: 'Sequencer Profit Margin', val: '64.2%' },
        { key: 'Total Rollup TVL', val: '$14.2B' }
      ]
    }
  ];

  const handleOpenArtifact = (id: string) => {
    const art = artifacts.find(a => a.id === id);
    if (art) setActiveArtifact(art);
  };

  return (
    <main id="top" className="min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased overflow-x-hidden">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />

      {!prefersReducedMotion && <div className="hidden md:block">
        <SmoothCursor />
      </div>}
      <ScrollProgress />

      <InternalHeader activePath="/markets" tone="dark" />

      {/* Sub-header status banner */}
      <div className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 pt-4 pb-4 border-b border-[#f1efe8]/8 relative z-10">
        <div className="w-full flex items-center justify-between text-[10px] tracking-[0.18em] uppercase font-mono">
          <div className="flex items-center gap-3">
            <HeaderReticle />
            <span className="text-[#f1efe8]/40">// SYSTEM: INVESTMENT & COMPASS ARCHIVE</span>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className="text-[#f1efe8]/42 font-sans text-[8px]">ACTIVE TARGET:</span>
            <span className="font-serif italic normal-case tracking-tight text-xs text-[#f1efe8] flex items-center gap-1">
              Next: Protocol Research / Equity Memo <span className="font-sans ml-1 text-[10px]">→</span>
            </span>
          </div>
        </div>
      </div>

      <HeroSection />

      <ResearchLanes />

      <FeaturedCases onOpenArtifact={handleOpenArtifact} />

      <TraditionalCasesSection onOpenArtifact={handleOpenArtifact} />

      <CryptoResearchSection onOpenArtifact={handleOpenArtifact} />

      <ResearchProcessSection />

      <ResearchMemosSection onReadThesis={(idx) => setActiveThesisId(idx)} />

      <ArtifactSection 
        activeArtifact={activeArtifact} 
        setActiveArtifact={setActiveArtifact} 
        artifacts={artifacts} 
      />

      <CaseUtilities />

      <div className="mx-auto max-w-[1480px] w-full px-4 md:px-8 xl:px-10 pb-8 relative z-10">
        <InternalFooter activePath="/markets" tone="dark" />
      </div>

      {/* Slide-out long-form memo reader */}
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
