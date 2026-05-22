import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { useSEO } from '../utils/seo';
import { ScrambleText } from '../components/ScrambleText';
import { RevealText } from '../components/RevealText';
import { ScrollReveal } from '../components/ScrollReveal';
import { SmoothCursor } from '../components/SmoothCursor';
import { ScrollProgress } from '../components/ScrollProgress';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ShutterWipe } from '../components/ShutterWipe';

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

// 1. Navigation Link Component
function NavLink({ href, active, id, children }: { href: string; active?: boolean; id?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      id={id}
      data-cursor-text={typeof children === 'string' ? children : 'VIEW'}
      className={`hover-target relative group overflow-visible px-3 py-1 transition-colors ${active ? 'text-[#f1efe8]' : 'text-[#f1efe8]/58 hover:text-[#f1efe8]'}`}
    >
      <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">{children}</span>
      <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>[</span>
      <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>]</span>
    </a>
  );
}

// Page Header Component
function PageHeader() {
  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
      <div className="grid items-start gap-5 border-b border-[#f1efe8]/12 bg-[#080807]/82 pb-5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr]">
        <a href="/" id="markets-brand-link" className="hover-target" data-cursor-text="HOME">
          <span className="block font-medium text-[#f1efe8]">SULAYMAN BOWLES</span>
          <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">Technical SEO · AI Product · Finance/Data</span>
        </a>
        <nav className="flex flex-wrap items-center gap-3 md:justify-center md:gap-6">
          <NavLink href="/#selected-works" id="markets-nav-work">WORK</NavLink>
          <NavLink href="/method" id="markets-nav-method">METHOD</NavLink>
          <NavLink href="/about" id="markets-nav-about">ABOUT</NavLink>
          <NavLink href="/#contact" id="markets-nav-contact">CONTACT</NavLink>
        </nav>
        <a href="/#contact" id="markets-header-contact" data-cursor-text="CONTACT" className="hover-target flex items-center gap-4 justify-self-start text-[#f1efe8]/75 transition-colors hover:text-[#f1efe8] md:justify-self-end">
          <span className="h-7 w-7 rounded-full border border-[#f1efe8]/28 flex-shrink-0" />
          <span>CONTACT</span>
        </a>
      </div>
    </header>
  );
}

// 2. Interactive Split Research Visual
interface SplitVisualProps {
  hoveredSystem: 'traditional' | 'crypto' | null;
  setHoveredSystem: (val: 'traditional' | 'crypto' | null) => void;
}

function SplitResearchVisual({ hoveredSystem, setHoveredSystem }: SplitVisualProps) {
  return (
    <div className="border border-[#f1efe8]/14 p-5 bg-[#080807] relative group w-full overflow-hidden select-none">
      {/* Corner indicators */}
      <div className="absolute top-2 left-2 text-[8px] text-[#f1efe8]/20 font-mono">⌜ RESEARCH CORE ⌝</div>
      <div className="absolute top-2 right-2 text-[8px] text-[#f1efe8]/20 font-mono">MODEL.SYS.V2</div>
      <div className="absolute bottom-2 left-2 text-[8px] text-[#f1efe8]/20 font-mono">⌞ CRITERIA ⌟</div>
      <div className="absolute bottom-2 right-2 text-[8px] text-[#f1efe8]/20 font-mono">SYS_COORD_04</div>

      {/* Main Interactive Container */}
      <div className="grid grid-cols-2 w-full aspect-[16/11] bg-[#080807] relative border border-[#f1efe8]/8">
        
        {/* Left Interactive Zone (Traditional Finance) */}
        <div 
          className="absolute inset-y-0 left-0 w-1/2 z-20 cursor-pointer"
          onMouseEnter={() => setHoveredSystem('traditional')}
          onMouseLeave={() => setHoveredSystem(null)}
        />
        
        {/* Right Interactive Zone (Crypto) */}
        <div 
          className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-pointer"
          onMouseEnter={() => setHoveredSystem('crypto')}
          onMouseLeave={() => setHoveredSystem(null)}
        />

        {/* The SVG Artwork */}
        <svg viewBox="0 0 700 480" className="absolute inset-0 w-full h-full text-[#f1efe8] pointer-events-none">
          {/* Background Grid */}
          <g stroke="rgba(241,239,232,0.02)" strokeWidth="0.8">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="480" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 48} x2="700" y2={i * 48} />
            ))}
          </g>

          {/* Central Divider */}
          <line x1="350" y1="20" x2="350" y2="460" stroke="rgba(241,239,232,0.12)" strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="350" cy="240" r="4" fill="#080807" stroke="rgba(241,239,232,0.3)" strokeWidth="1" />
          
          {/* Coordinate Marks along central divider */}
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={`tick-${i}`} d={`M 347 ${60 + i * 60} L 353 ${60 + i * 60}`} stroke="rgba(241,239,232,0.24)" strokeWidth="0.8" />
          ))}

          {/* LEFT SYSTEM: TRADITIONAL FINANCE */}
          <g className="transition-all duration-500" style={{ opacity: hoveredSystem === 'crypto' ? 0.25 : 1 }}>
            {/* Background system label */}
            <text x="40" y="420" fill="rgba(241,239,232,0.03)" fontSize="48" fontFamily="serif" italic>Traditional</text>
            
            {/* Filing Review (Node connection network) */}
            <g className="transition-all duration-300">
              <line x1="60" y1="80" x2="160" y2="80" stroke="rgba(241,239,232,0.14)" strokeWidth="0.8" />
              <line x1="160" y1="80" x2="220" y2="140" stroke="rgba(241,239,232,0.14)" strokeWidth="0.8" />
              <line x1="160" y1="80" x2="110" y2="150" stroke="rgba(241,239,232,0.14)" strokeWidth="0.8" />
              <circle cx="60" cy="80" r="3" fill="#b7c8a8" />
              <circle cx="160" cy="80" r="3" fill="#b7c8a8" />
              <circle cx="220" cy="140" r="3.5" fill="#b7c8a8" className="animate-pulse" />
              <circle cx="110" cy="150" r="2.5" fill="#b7c8a8" />
              <text x="60" y="70" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1">SEC_FILING_REVIEW // D.10K</text>
            </g>

            {/* Valuation Range (Bell curve / brackets) */}
            <g className="transition-all duration-300">
              <path d="M 60 260 Q 140 160 220 260" fill="none" stroke="rgba(241,239,232,0.3)" strokeWidth="1" />
              <path d="M 100 260 Q 140 180 180 260" fill="rgba(183, 200, 168, 0.08)" stroke="rgba(183, 200, 168, 0.2)" strokeWidth="0.8" strokeDasharray="2 3" />
              <line x1="140" y1="180" x2="140" y2="260" stroke="rgba(241,239,232,0.15)" strokeWidth="0.8" strokeDasharray="1 2" />
              <line x1="60" y1="260" x2="220" y2="260" stroke="rgba(241,239,232,0.15)" strokeWidth="0.8" />
              <text x="140" y="275" fill="rgba(241,239,232,0.5)" fontSize="7" fontFamily="monospace" letterSpacing="1" textAnchor="middle">VALUATION RANGE (BASE_CASE)</text>
              <circle cx="140" cy="210" r="2" fill="#b7c8a8" />
            </g>

            {/* Catalyst Map (Vector arrows) */}
            <g className="transition-all duration-300">
              <path d="M 60 340 L 120 340 L 160 380" fill="none" stroke="rgba(241,239,232,0.24)" strokeWidth="0.8" />
              <path d="M 120 340 L 150 310 L 220 310" fill="none" stroke="rgba(241,239,232,0.24)" strokeWidth="0.8" />
              <polygon points="220,310 215,308 215,312" fill="rgba(241,239,232,0.6)" />
              <polygon points="160,380 158,375 162,375" fill="rgba(241,239,232,0.6)" />
              <text x="60" y="332" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1">CATALYST MAP // STAGES</text>
            </g>

            {/* Downside Case (Stress boundary) */}
            <g className="transition-all duration-300">
              <line x1="40" y1="180" x2="280" y2="180" stroke="rgba(194, 105, 94, 0.25)" strokeWidth="0.8" strokeDasharray="4 4" />
              <rect x="230" y="168" width="50" height="24" fill="#080807" stroke="rgba(194, 105, 94, 0.4)" strokeWidth="0.8" />
              <text x="255" y="182" fill="#c2695e" fontSize="6.5" fontFamily="monospace" letterSpacing="1" textAnchor="middle">DOWNSIDE_STRESS</text>
            </g>

            {/* Visual HUD Readout */}
            <g transform="translate(60, 20)" className="font-mono text-[8px] fill-[#b7c8a8] opacity-70">
              <text x="0" y="10">TRAD_FIN // REGIME_01</text>
              <text x="0" y="20">EV/EBITDA : 11.4X</text>
              <text x="0" y="30">WACC : 8.75%</text>
            </g>
          </g>

          {/* RIGHT SYSTEM: CRYPTO RESEARCH */}
          <g className="transition-all duration-500" style={{ opacity: hoveredSystem === 'traditional' ? 0.25 : 1 }}>
            {/* Background system label */}
            <text x="460" y="420" fill="rgba(241,239,232,0.03)" fontSize="48" fontFamily="serif" italic>Crypto</text>
            
            {/* Token Supply Curve */}
            <g className="transition-all duration-300">
              <path d="M 380 140 Q 420 140 480 80 T 640 60" fill="none" stroke="rgba(241,239,232,0.3)" strokeWidth="1" />
              <circle cx="480" cy="80" r="3" fill="#c2695e" className="animate-pulse" />
              <circle cx="560" cy="70" r="2.5" fill="#f1efe8" />
              <text x="640" y="52" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1" textAnchor="end">TOKEN SUPPLY // EMISSIONS</text>
            </g>

            {/* Protocol Fees Bar Graph */}
            <g className="transition-all duration-300">
              {[
                { x: 380, h: 40 },
                { x: 405, h: 60 },
                { x: 430, h: 50 },
                { x: 455, h: 90 },
                { x: 480, h: 110 },
                { x: 505, h: 80 }
              ].map((bar, i) => (
                <rect 
                  key={i} 
                  x={bar.x} 
                  y={260 - bar.h} 
                  width="18" 
                  height={bar.h} 
                  fill="none" 
                  stroke="rgba(241, 239, 232, 0.24)" 
                  strokeWidth="0.8" 
                />
              ))}
              <line x1="370" y1="260" x2="530" y2="260" stroke="rgba(241,239,232,0.15)" strokeWidth="0.8" />
              <text x="380" y="275" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1">PROTOCOL_FEES_DAILY</text>
            </g>

            {/* TVL & Liquidity Depth */}
            <g className="transition-all duration-300">
              <path d="M 500 350 C 530 350, 550 310, 590 310 S 610 380, 640 380" fill="none" stroke="rgba(183, 200, 168, 0.35)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="590" cy="310" r="3" fill="#b7c8a8" />
              <text x="640" y="392" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1" textAnchor="end">TVL &amp; LIQUIDITY DEPTH</text>
            </g>

            {/* Governance Risk (Matrix grid node) */}
            <g className="transition-all duration-300">
              <rect x="520" y="140" width="100" height="80" fill="none" stroke="rgba(241,239,232,0.1)" strokeWidth="0.8" />
              <line x1="570" y1="140" x2="570" y2="220" stroke="rgba(241,239,232,0.1)" strokeWidth="0.8" />
              <line x1="520" y1="180" x2="620" y2="180" stroke="rgba(241,239,232,0.1)" strokeWidth="0.8" />
              <circle cx="550" cy="160" r="4" fill="#c2695e" />
              <circle cx="590" cy="200" r="2.5" fill="#f1efe8" opacity="0.5" />
              <text x="520" y="132" fill="rgba(241,239,232,0.4)" fontSize="7" fontFamily="monospace" letterSpacing="1">GOVERNANCE_RISK_MAP</text>
            </g>

            {/* Visual HUD Readout */}
            <g transform="translate(640, 20)" className="font-mono text-[8px] fill-[#c2695e] opacity-70" textAnchor="end">
              <text x="0" y="10">CRYPT_ARCH // VE_FLYHWL</text>
              <text x="0" y="20">FEE_APR : 42.1%</text>
              <text x="0" y="30">EMISSION_DECAY : -2.5% / WK</text>
            </g>
          </g>

          {/* Interactive feedback banners */}
          <g transform="translate(350, 450)" textAnchor="middle" className="font-mono text-[8px] tracking-[0.15em]">
            {hoveredSystem === 'traditional' && (
              <text fill="#b7c8a8" className="animate-pulse">SELECTING: TRADITIONAL PORTFOLIO MEMOS</text>
            )}
            {hoveredSystem === 'crypto' && (
              <text fill="#c2695e" className="animate-pulse">SELECTING: DECENTRALIZED PROTOCOL THESES</text>
            )}
            {hoveredSystem === null && (
              <text fill="rgba(241,239,232,0.2)">HOVER SYSTEM REGIONS TO QUERY PARAMETERS</text>
            )}
          </g>
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-between text-[8px] font-mono tracking-widest text-[#f1efe8]/40">
        <span>GRID COORDINATES: 40.7128° N, 74.0060° W</span>
        <span>LATENCY STREAM: ACTIVE (04ms)</span>
      </div>
    </div>
  );
}

// 2. Hero Section
interface HeroSectionProps {
  hoveredSystem: 'traditional' | 'crypto' | null;
  setHoveredSystem: (val: 'traditional' | 'crypto' | null) => void;
}

function HeroSection({ hoveredSystem, setHoveredSystem }: HeroSectionProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-12 lg:gap-[72px] items-center pt-12 pb-11 border-b border-[#f1efe8]/14">
      {/* Left Column: Thesis Info */}
      <div className="space-y-9">
        <div className="flex items-center justify-between text-[10px] tracking-[0.18em] text-[#f1efe8]/45 uppercase font-mono">
          <span>INVESTMENT RESEARCH</span>
          <span>CASE ARCHIVE</span>
        </div>

        <h1 className="font-serif text-[clamp(42px,5.2vw,74px)] leading-[0.98] tracking-[-0.03em] text-[#f1efe8]">
          Traditional Cases,<br />
          Crypto Research,<br />
          <span className="italic font-light opacity-95 text-[#b7c8a8]/90">&amp; Market Reasoning</span>
        </h1>

        <p className="font-sans text-sm text-[#f1efe8]/70 leading-relaxed max-w-lg">
          A collection of equity cases, sector theses, crypto protocol research, market structure work, and investment memos built around evidence, risk, valuation, and asymmetric opportunity.
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

      {/* Right Column: Hero Split Interactive visual */}
      <div className="w-full">
        <SplitResearchVisual hoveredSystem={hoveredSystem} setHoveredSystem={setHoveredSystem} />
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
    <section className="py-12 border-b border-[#f1efe8]/14">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono mb-8">
        RESEARCH LANES
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {lanes.map((lane) => (
          <div 
            key={lane.num} 
            className="flex flex-col justify-between h-full p-5 border border-[#f1efe8]/10 bg-[#f1efe8]/[0.01] hover:border-[#f1efe8]/20 transition-all duration-300 relative group"
          >
            {/* Corner Indicators */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#f1efe8]/20" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#f1efe8]/20" />

            <div className="text-[14px] font-serif italic text-[#b7c8a8]/60 mb-4 group-hover:text-[#b7c8a8] transition-colors">
              {lane.num}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-mono text-[#f1efe8] mb-3">
                {lane.title}
              </h4>
              <p className="text-xs text-[#f1efe8]/54 leading-relaxed font-sans">
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
function FeaturedCases() {
  return (
    <section className="py-12 border-b border-[#f1efe8]/14 space-y-8">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
        FEATURED CASES
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CASE 01: Traditional */}
        <div className="border border-[#f1efe8]/14 p-6 bg-[#080807] relative group flex flex-col justify-between h-[340px] hover:border-[#f1efe8]/24 transition-colors">
          <div className="absolute top-2 left-2 text-[8px] text-[#f1efe8]/20 font-mono">CASE 01</div>
          <div className="absolute top-2 right-2 text-[8px] text-[#b7c8a8] font-mono">TRADITIONAL EQUITY</div>

          <div className="space-y-4 pt-4">
            <div className="text-[10px] tracking-widest text-[#f1efe8]/40 font-mono uppercase">ASSET: APPIAN GROUP (NASDAQ: APPN)</div>
            <h3 className="font-serif text-2xl lg:text-3xl text-[#f1efe8] leading-tight">
              Mispricing of Enterprise Software Durability
            </h3>
            <p className="text-xs text-[#f1efe8]/60 leading-relaxed font-sans max-w-lg">
              Thesis: Appian's low-code workflow integration establishes structural lock-in that the market is discounting due to short-term cyclical tech spend deceleration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#f1efe8]/10 pt-4 font-mono text-[9px] text-[#f1efe8]/50 uppercase">
            <div>
              <span className="block text-[#f1efe8]/30">Horizon / Status</span>
              <span className="text-xs text-[#f1efe8]/80 font-sans tracking-normal font-medium">12-18 Months / Completed</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/30">Core Question</span>
              <span className="text-[9.5px] text-[#f1efe8]/80 tracking-tight lowercase first-letter:uppercase font-sans font-medium">Is durable recurring revenue being mispriced as transactional?</span>
            </div>
          </div>
        </div>

        {/* CASE 02: Crypto */}
        <div className="border border-[#f1efe8]/14 p-6 bg-[#080807] relative group flex flex-col justify-between h-[340px] hover:border-[#f1efe8]/24 transition-colors">
          <div className="absolute top-2 left-2 text-[8px] text-[#f1efe8]/20 font-mono">CASE 02</div>
          <div className="absolute top-2 right-2 text-[8px] text-[#c2695e] font-mono">CRYPTO PROTOCOL</div>

          <div className="space-y-4 pt-4">
            <div className="text-[10px] tracking-widest text-[#f1efe8]/40 font-mono uppercase">PROTOCOL: AERODROME FINANCE (BASE)</div>
            <h3 className="font-serif text-2xl lg:text-3xl text-[#f1efe8] leading-tight">
              Dominant Liquidity Engine &amp; ve(3,3) Flywheel
            </h3>
            <p className="text-xs text-[#f1efe8]/60 leading-relaxed font-sans max-w-lg">
              Thesis: Aerodrome has successfully cornered Base liquidity. Its ve-token mechanics align trader fees and voter bribes, creating a durable fee generation loop.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#f1efe8]/10 pt-4 font-mono text-[9px] text-[#f1efe8]/50 uppercase">
            <div>
              <span className="block text-[#f1efe8]/30">Focus / Status</span>
              <span className="text-xs text-[#f1efe8]/80 font-sans tracking-normal font-medium">Tokenomics / In Progress</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/30">Core Question</span>
              <span className="text-[9.5px] text-[#f1efe8]/80 tracking-tight lowercase first-letter:uppercase font-sans font-medium">Are emissions structural vs reflexive speculation?</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Traditional Investment Cases Section (Detailed Folder Foldouts)
function TraditionalCasesSection() {
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
      company: 'Sovereign Chip Supply / Semiconductor Supply Chain',
      thesis: 'Sovereign spending subsidies will create a structural domestic CapEx cycle, insulating leader margin structures.',
      drivers: [
        'CapEx cycle expansion supported by public funds',
        'Leading-edge yield dominance protecting pricing power',
        'Supplier concentration insulating critical inputs',
        'Margin preservation via pass-through contract structures'
      ],
      evidence: [
        'Sovereign CHIPS Act funding maps & application data',
        'ASML shipping backlogs and extreme ultraviolet (EUV) lead times',
        'Supplier revenue dependencies and raw material flows',
        'Geopolitical risk matrix modeling export blocks'
      ],
      outputs: ['Sector Briefing', 'Valuation Model', 'Supply Chain Map']
    }
  ];

  return (
    <section className="py-12 border-b border-[#f1efe8]/14 space-y-8">
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
              className="border border-[#f1efe8]/10 bg-[#080807] transition-all duration-300"
            >
              {/* Folder tab trigger */}
              <button 
                id={`trad-case-btn-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
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
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-[#f1efe8]/8"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-[#f1efe8]/70">
                      
                      {/* Column 1: Thesis & Drivers */}
                      <div className="space-y-4 border-r border-[#f1efe8]/6 pr-6 last:border-r-0">
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
                      <div className="space-y-4 border-r border-[#f1efe8]/6 pr-6 last:border-r-0">
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
                          {item.outputs.map((out, i) => (
                            <div 
                              key={i} 
                              className="border border-[#f1efe8]/10 px-4 py-2 flex items-center justify-between text-[10px] tracking-wider uppercase font-mono bg-[#f1efe8]/[0.01] hover:bg-[#f1efe8]/[0.03] transition-colors"
                            >
                              <span>{out}</span>
                              <span className="text-[8px] opacity-40">⤓ REFERENCE</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-[#f1efe8]/40 font-mono">
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
function CryptoResearchSection() {
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
    <section className="py-12 border-b border-[#f1efe8]/14 space-y-8">
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
              className="border border-[#f1efe8]/10 bg-[#080807] transition-all duration-300"
            >
              {/* Folder tab trigger */}
              <button 
                id={`crypto-case-btn-${idx}`}
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
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
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-[#f1efe8]/8"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-[#f1efe8]/70">
                      
                      {/* Column 1: Thesis & Core Questions */}
                      <div className="space-y-4 border-r border-[#f1efe8]/6 pr-6 last:border-r-0">
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
                      <div className="space-y-4 border-r border-[#f1efe8]/6 pr-6 last:border-r-0">
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
                          {item.outputs.map((out, i) => (
                            <div 
                              key={i} 
                              className="border border-[#f1efe8]/10 px-4 py-2 flex items-center justify-between text-[10px] tracking-wider uppercase font-mono bg-[#f1efe8]/[0.01] hover:bg-[#f1efe8]/[0.03] transition-colors"
                            >
                              <span>{out}</span>
                              <span className="text-[8px] opacity-40">⤓ TELEMETRY</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-[#f1efe8]/40 font-mono">
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
    <section className="py-12 border-b border-[#f1efe8]/14 space-y-8">
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

// 8. Artifact Section (With highly designed functional modals)
interface Artifact {
  id: string;
  tag: string;
  title: string;
  summary: string;
  date: string;
  size: string;
  author: string;
  highlights: string[];
  metrics: { key: string; val: string }[];
}

function ArtifactSection() {
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveArtifact(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const artifacts: Artifact[] = [
    {
      id: 'pdf-memo',
      tag: 'PDF MEMO',
      title: 'Appian Group (NASDAQ: APPN) Valuation Memo',
      summary: 'A 24-page deep dive reviewing workflow orchestration durability, recurring contract structures, and competitive moats in low-code platforms.',
      date: 'May 14, 2026',
      size: '2.4 MB',
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
      size: '1.8 MB',
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
      size: '780 KB',
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
      size: '450 KB',
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
      size: '1.2 MB',
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

  const handleDownload = (id: string) => {
    setDownloading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            setProgress(0);
            alert(`File "${id}" simulated download complete.`);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  return (
    <section className="py-12 border-b border-[#f1efe8]/14 space-y-8">
      <div className="text-[10px] tracking-[0.24em] uppercase text-[#b7c8a8] font-mono">
        RESEARCH ARTIFACTS
      </div>

      <div className="flex flex-wrap gap-3">
        {artifacts.map((art) => (
          <button 
            key={art.id}
            id={`markets-artifact-btn-${art.id}`}
            onClick={() => setActiveArtifact(art)}
            className="hover-target border border-[#f1efe8]/10 px-5 py-3 text-[10px] uppercase font-mono tracking-widest text-[#f1efe8]/80 bg-[#f1efe8]/[0.01] hover:border-[#f1efe8]/24 hover:bg-[#f1efe8]/[0.03] transition-all duration-300 relative group"
            data-cursor-text="PREVIEW"
          >
            {/* Corner marks */}
            <span className="absolute top-0 left-0 text-[7px] text-[#f1efe8]/20 font-sans pointer-events-none group-hover:text-[#b7c8a8] transition-colors">⌜</span>
            <span className="absolute bottom-0 right-0 text-[7px] text-[#f1efe8]/20 font-sans pointer-events-none group-hover:text-[#b7c8a8] transition-colors">⌟</span>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#080807] border border-[#f1efe8]/20 p-6 md:p-8 space-y-6 z-10 overflow-hidden shadow-2xl"
            >
              {/* Corner Indicators */}
              <div className="absolute top-3 left-3 text-[8px] text-[#f1efe8]/20 font-mono">⌜ PREVIEW_TELEMETRY ⌝</div>
              <div className="absolute bottom-3 right-3 text-[8px] text-[#f1efe8]/20 font-mono">⌞ AUTH_SYS_OK ⌟</div>

              {/* Close Button */}
              <button 
                id="artifact-modal-close-btn"
                onClick={() => setActiveArtifact(null)}
                className="absolute top-4 right-4 hover-target font-mono text-[9px] uppercase tracking-widest text-[#f1efe8]/40 hover:text-[#f1efe8] transition-colors px-2 py-1 border border-[#f1efe8]/10"
                data-cursor-text="CLOSE"
              >
                CLOSE [X]
              </button>

              <div className="space-y-4 pt-4">
                <div className="text-[9px] tracking-[0.24em] text-[#b7c8a8] font-mono uppercase font-semibold">
                  {activeArtifact.tag}
                </div>
                
                <h3 className="font-serif text-2xl lg:text-3xl text-[#f1efe8] leading-tight">
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
                  <span className="block text-[#f1efe8]/30">File Size</span>
                  <span className="text-[10px] text-[#f1efe8]/80 font-sans tracking-normal">{activeArtifact.size}</span>
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

              {/* Action area / Download simulation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f1efe8]/10">
                <div className="font-mono text-[8px] text-[#f1efe8]/30 tracking-widest">
                  SYS_SECURITY: SHA-256 CHECKED &amp; SIGNED
                </div>
                
                <button
                  id="artifact-download-btn"
                  onClick={() => handleDownload(activeArtifact.id)}
                  disabled={downloading}
                  className="hover-target w-full sm:w-auto bg-[#f1efe8] text-[#080807] font-mono text-[10px] font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-[#f1efe8]/90 transition-colors disabled:opacity-50"
                  data-cursor-text={downloading ? 'FETCHING' : 'SECURE DOWNLOAD'}
                >
                  {downloading ? `DOWNLOADING ${progress}%` : 'DOWNLOAD MEMO FILE'}
                </button>
              </div>

              {/* simulated download progress bar */}
              {downloading && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-[#f1efe8]/10">
                  <motion.div 
                    className="h-full bg-[#b7c8a8]" 
                    style={{ width: `${progress}%` }} 
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Case Utilities Component
function CaseUtilities() {
  return (
    <div className="w-full border-t border-[#f1efe8]/12 mt-12 pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-[9.5px] uppercase tracking-[0.2em] font-mono text-[#f1efe8]/42">
      {/* Left: Statement */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border border-[#f1efe8]/20 flex items-center justify-center text-[8px] text-[#b7c8a8]">
          ◈
        </div>
        <span>Start with the thesis. Build with conviction.</span>
      </div>

      {/* Center: Share */}
      <div className="flex items-center gap-5">
        <span className="text-[8px] text-[#f1efe8]/30">ARCHIVE</span>
        <a href="/markets/network-monopolies" className="hover:text-[#f1efe8] transition-colors hover-target" data-cursor-text="READ">MEMO 01</a>
        <a href="/markets/computational-commodity-systems" className="hover:text-[#f1efe8] transition-colors hover-target" data-cursor-text="READ">MEMO 02</a>
        <a href="/markets/fiat-horizon" className="hover:text-[#f1efe8] transition-colors hover-target" data-cursor-text="READ">MEMO 03</a>
        <button className="hover:text-[#f1efe8] transition-colors hover-target" data-cursor-text="COPY" onClick={() => navigator.clipboard.writeText(window.location.href)}>COPY</button>
      </div>

      {/* Right: Export */}
      <button 
        onClick={() => window.print()}
        className="flex items-center gap-2 hover:text-[#f1efe8] transition-colors border border-[#f1efe8]/12 px-3 py-1.5 hover-target"
        data-cursor-text="EXPORT"
      >
        <span>EXPORT PDF</span>
        <span className="text-[8px] opacity-60">⤓</span>
      </button>
    </div>
  );
}

// 9. Page Footer Component
function PageFooter() {
  return (
    <footer className="w-full border-t border-[#f1efe8]/12 pt-8 text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/54 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto_1fr_auto]">
      <div>
        <div className="text-[#f1efe8]">SULAYMAN BOWLES</div>
        <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO · AI Product · Finance/Data</div>
      </div>
      <nav className="flex flex-wrap gap-5" id="markets-footer-nav">
        <NavLink href="/#selected-works" id="markets-footer-work">WORK</NavLink>
        <NavLink href="/method" id="markets-footer-method">METHOD</NavLink>
        <NavLink href="/about" id="markets-footer-about">ABOUT</NavLink>
        <NavLink href="/#contact" id="markets-footer-contact">CONTACT</NavLink>
      </nav>
      <div className="md:text-right">
        © 2026 SULAYMAN BOWLES
        <br />
        ALL RIGHTS RESERVED
      </div>
      <a href="#top" id="markets-back-to-top" aria-label="Back to top" data-cursor-text="TOP" className="hover-target h-9 w-9 rounded-full border border-[#f1efe8]/28 transition-colors hover:bg-[#f1efe8] hover:text-[#080807] flex-shrink-0" />
    </footer>
  );
}

// Main Page Export
export default function MarketsPage() {
  useSEO(MARKETS_SEO);

  const [hoveredSystem, setHoveredSystem] = useState<'traditional' | 'crypto' | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased md:cursor-none">
      <ShutterWipe />
      <PageTechnicalChrome tone="dark" />
      <DarkNoise />

      {!prefersReducedMotion && <div className="hidden md:block">
        <SmoothCursor />
      </div>}
      <ScrollProgress />

      <PageHeader />

      {/* 1480px Centered Container */}
      <div className="max-w-[1480px] mx-auto w-full px-4 md:px-8 xl:px-10 pt-4 pb-8 flex flex-col gap-9 relative z-10">
        
        {/* Sub-header status banner */}
        <div className="w-full flex items-center justify-between text-[10px] tracking-[0.18em] uppercase font-mono border-b border-[#f1efe8]/8 pb-4">
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

        <HeroSection hoveredSystem={hoveredSystem} setHoveredSystem={setHoveredSystem} />

        <ResearchLanes />

        <FeaturedCases />

        <TraditionalCasesSection />

        <CryptoResearchSection />

        <ResearchProcessSection />

        <ArtifactSection />

        <CaseUtilities />

        <PageFooter />

      </div>
    </main>
  );
}
