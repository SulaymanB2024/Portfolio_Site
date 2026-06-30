import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useMemo, type CSSProperties, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { SmoothCursor } from '../components/SmoothCursor';
import { ScrambleText } from '../components/ScrambleText';
import { RevealText } from '../components/RevealText';
import { StaggeredText } from '../components/StaggeredText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import InternalHeader from '../components/InternalHeader';
import InternalFooter from '../components/InternalFooter';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { WireframeGrid } from '../components/WireframeGrid';
import { ServiceModuleSnapshot } from '../components/ServiceModulePanels';
import { getContactHref, getServiceModule } from '../content/serviceModules';

const LOCAL_VISIBILITY_SEO = getSeoRoute('/service-area-visibility-audit')!;
const SERVICE_MODULE = getServiceModule('local-visibility');

type ProcessStepProps = {
  index: string;
  title: string;
  copy: string;
  icon: 'territory' | 'gbp' | 'nap' | 'crawl' | 'reviews';
};

type OutputCardProps = {
  title: string;
  copy: string;
  cta: string;
  children: ReactNode;
  id?: string;
  onCtaClick?: () => void;
};

const processSteps: ProcessStepProps[] = [
  {
    index: '01',
    title: 'TERRITORY OUTLINE',
    icon: 'territory',
    copy: 'Map operational service territories and ensure target locations are represented by high-intent, unique URL structures.',
  },
  {
    index: '02',
    title: 'GBP MATCHING',
    icon: 'gbp',
    copy: 'Optimize Google Business Profile categories, description text, and exact address structures to match corresponding landing page nodes.',
  },
  {
    index: '03',
    title: 'NAP RECONCILE',
    icon: 'nap',
    copy: 'Audit and reconcile Name, Address, and Phone number (NAP) citations across primary local directory indexes.',
  },
  {
    index: '04',
    title: 'CRAWL FLOW',
    icon: 'crawl',
    copy: 'Verify sitemap configurations and internal links to ensure location landing pages remain within three crawl hops of the homepage.',
  },
  {
    index: '05',
    title: 'LOCAL REVIEW',
    icon: 'reviews',
    copy: 'Verify local review integrations, customer reviews schemas, and location-specific authority signals.',
  },
];

function ProcessIcon({ type, isHovered }: { type: ProcessStepProps['icon']; isHovered: boolean }) {
  const common = 'stroke-current fill-none';

  if (type === 'territory') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <path className={common} d="M16 36 H56 M36 16 V56" strokeWidth="1.2" />
        <circle className={common} cx="36" cy="36" r="14" strokeWidth="1.2" />
        <motion.circle 
          className={common} 
          cx="36" 
          cy="36" 
          r="6" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
        />
      </svg>
    );
  }

  if (type === 'gbp') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <rect className={common} x="16" y="24" width="40" height="32" strokeWidth="1.2" />
        <path className={common} d="M14 24 H58 M24 24 V16 M48 24 V16" strokeWidth="1.2" />
        <circle cx="36" cy="40" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (type === 'nap') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <path className={common} d="M18 20 H54 M18 36 H54 M18 52 H40" strokeWidth="1.2" />
        <motion.circle 
          cx="48" 
          cy="52" 
          r="4" 
          fill="currentColor" 
          animate={isHovered ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.8 }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      </svg>
    );
  }

  if (type === 'crawl') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <rect className={common} x="28" y="12" width="16" height="12" strokeWidth="1.2" />
        <rect className={common} x="14" y="44" width="16" height="12" strokeWidth="1.2" />
        <rect className={common} x="42" y="44" width="16" height="12" strokeWidth="1.2" />
        <path className={common} d="M36 24 V34 M36 34 H22 V44 M36 34 H50 V44" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
      <path className={common} d="M20 22 H52 M20 34 H52 M20 46 H40" strokeWidth="1.2" />
      <motion.path 
        className={common} 
        d="M48 40 L52 44 L60 34" 
        strokeWidth="1.5" 
        animate={isHovered ? { pathLength: 1 } : { pathLength: 0.8 }}
        transition={{ duration: 0.4 }}
      />
    </svg>
  );
}

function LVProcessStep({ index, title, copy, icon }: ProcessStepProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFinalStep = index === processSteps[processSteps.length - 1]?.index;

  return (
    <motion.article
      className="group relative min-h-[320px] border-b border-ink/12 p-5 transition-[background-color,border-color] duration-500 hover:bg-ink/[0.02] md:border-r md:last:border-r-0 lg:border-b-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 flex items-start justify-between text-[10px] uppercase tracking-[0.3em] text-ink/42">
        <span>{index}</span>
        <span>{isFinalStep ? 'END' : '->'}</span>
      </div>
      <div className="mb-8 text-ink/55 transition-colors duration-500 group-hover:text-ink/86">
        <ProcessIcon type={icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-4 text-xs uppercase tracking-[0.34em] text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink/62">{copy}</p>
    </motion.article>
  );
}

function LVOutputCard({ title, copy, cta, children, id, onCtaClick }: OutputCardProps) {
  return (
    <motion.article
      className="group relative flex min-h-[420px] flex-col overflow-hidden border border-ink/20 p-5 text-ink transition-[border-color,background-color] duration-500 before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-ink/35 before:transition-all before:duration-700 hover:border-ink/45 hover:bg-ink/[0.025] hover:before:w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-ink/15 pb-5">
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink/88">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/55">{copy}</p>
        </div>
        <span className="mt-1 block h-2 w-2 rounded-full border border-ink/35 transition-colors duration-500 group-hover:bg-ink/65" />
      </div>
      <div className="flex flex-1 items-center">{children}</div>
      <button 
        id={id}
        onClick={onCtaClick}
        className="hover-target mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-ink/74 text-left cursor-pointer"
      >
        {cta}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
      </button>
    </motion.article>
  );
}

function LocalCitiesConsole() {
  const [activeCity, setActiveCity] = useState('Austin, TX');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cities = ['Austin, TX', 'Dallas, TX', 'Houston, TX', 'San Antonio, TX', 'Denver, CO'];

  const cityRanks: Record<string, number[]> = {
    'Austin, TX': [1, 1, 2, 1, 3, 2, 4, 3, 7],
    'Dallas, TX': [2, 3, 4, 1, 2, 3, 5, 8, 12],
    'Houston, TX': [1, 2, 1, 3, 5, 2, 4, 6, 9],
    'San Antonio, TX': [4, 6, 8, 3, 5, 7, 9, 12, 16],
    'Denver, CO': [3, 4, 5, 2, 3, 6, 5, 7, 11]
  };

  const activeRanks = cityRanks[activeCity] || cityRanks['Austin, TX'];

  const gridData = useMemo(() => {
    return activeRanks.map((rank, i) => {
      const row = Math.floor(i / 3) - 1; // -1, 0, 1
      const col = (i % 3) - 1; // -1, 0, 1
      const dirX = col === 0 ? '' : col > 0 ? 'E' : 'W';
      const dirY = row === 0 ? '' : row > 0 ? 'S' : 'N';
      const displacement = `${Math.abs(row || col) * 1.5}mi ${dirY}${dirX}`.trim() || 'Center HQ';
      
      let statusColor = 'bg-[#b7c8a8] text-[#080807]'; // #1-3 (optimal)
      if (rank > 3 && rank <= 8) statusColor = 'bg-[#f1efe8]/30 text-ink'; // #4-8 (warning)
      if (rank > 8) statusColor = 'bg-[#c2695e]/80 text-white'; // #9+ (critical)

      return {
        rank,
        displacement,
        statusColor,
        competitor: rank === 1 ? 'Void Agency' : rank <= 3 ? 'Local SEO Pros' : 'Legacy Directory Corp'
      };
    });
  }, [activeRanks]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-ink/10 pb-2">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            className={`px-2 py-1 text-[8px] font-mono tracking-wider transition-colors cursor-pointer ${activeCity === city ? 'bg-ink text-canvas font-bold' : 'text-ink/60 hover:text-ink'}`}
          >
            {city.split(',')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-ink/5 border border-ink/10">
          {gridData.map((cell, idx) => (
            <motion.div
              key={idx}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-[9px] font-bold font-mono cursor-pointer ${cell.statusColor}`}
              whileHover={{ scale: 1.15 }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {cell.rank}
            </motion.div>
          ))}
        </div>

        <div className="font-mono text-[8px] text-ink/70 leading-relaxed min-h-[50px] flex flex-col justify-center border-l border-ink/10 pl-3">
          {hoveredIndex !== null ? (
            <>
              <div className="font-bold text-ink">// GRID NODE {hoveredIndex + 1}</div>
              <div>Dist: {gridData[hoveredIndex].displacement}</div>
              <div className="truncate">Pos #1: {gridData[hoveredIndex].competitor}</div>
              <div className="text-[#c2695e]">Rank: {gridData[hoveredIndex].rank}</div>
            </>
          ) : (
            <div className="opacity-50">HOVER GEO-GRID NODES FOR PROXIMITY TELEMETRY</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CrawlTreeVisual() {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 240 84" className="w-full h-auto aspect-[240/84] text-ink" aria-hidden="true">
        <g fill="none" stroke="currentColor" opacity="0.28">
          <rect x="82" y="8" width="76" height="18" />
          <rect x="18" y="58" width="58" height="18" />
          <rect x="91" y="58" width="58" height="18" />
          <rect x="164" y="58" width="58" height="18" />
          <path d="M120 26 V42 M120 42 H47 V58 M120 42 V58 M120 42 H193 V58" />
        </g>
        <g fill="currentColor">
          <circle cx="120" cy="17" r="2" />
          <circle cx="47" cy="67" r="2" />
          <circle cx="120" cy="67" r="2" />
          <circle cx="193" cy="67" r="2" />
        </g>
      </svg>
    </div>
  );
}

function ConsoleModal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: ReactNode 
}) {
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#080807]/15 backdrop-blur-sm p-4 md:p-8 xl:p-12 font-sans"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full max-h-[640px] w-full max-w-[1100px] flex-col border border-[#080807]/15 bg-[#f1efe8] text-[#080807]"
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,rgba(8,8,7,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,8,7,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-[#080807]/30" />
            <div className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-[#080807]/30" />
            <div className="absolute -left-2 -bottom-2 h-4 w-4 border-l border-b border-[#080807]/30" />
            <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r border-b border-[#080807]/30" />

            <div className="flex items-center justify-between border-b border-[#080807]/12 px-6 py-4 font-mono text-[9px] uppercase tracking-[0.32em] z-10">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#080807]/80" />
                <span id="modal-title" className="font-bold">{title}</span>
              </div>
              <button 
                id="modal-close-btn"
                onClick={onClose} 
                className="hover-target text-[#080807]/50 transition-colors hover:text-[#080807] cursor-pointer"
              >
                [ CLOSE ESC ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LocalMonitorModalContent() {
  const [activeTab, setActiveTab] = useState('Austin, TX');

  const locationData: Record<string, { gbpScore: string; citations: string; napConsistency: string; reviewsCount: string }> = {
    'Austin, TX': { gbpScore: '96%', citations: '124 citations', napConsistency: '98%', reviewsCount: '412 reviews' },
    'Dallas, TX': { gbpScore: '92%', citations: '118 citations', napConsistency: '96%', reviewsCount: '348 reviews' },
    'Houston, TX': { gbpScore: '94%', citations: '132 citations', napConsistency: '98%', reviewsCount: '492 reviews' },
    'San Antonio, TX': { gbpScore: '88%', citations: '94 citations', napConsistency: '92%', reviewsCount: '218 reviews' },
    'Denver, CO': { gbpScore: '90%', citations: '105 citations', napConsistency: '95%', reviewsCount: '280 reviews' },
  };

  const current = locationData[activeTab] || locationData['Austin, TX'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 text-[#080807] h-full font-sans">
      <div className="space-y-2 border-r border-[#080807]/12 pr-4">
        <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#080807]/40 mb-4 font-bold">TERRITORY LOCATIONS</h4>
        {Object.keys(locationData).map((city) => (
          <button 
            key={city}
            onClick={() => setActiveTab(city)}
            className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-mono border transition-all duration-200 cursor-pointer ${activeTab === city ? 'bg-[#080807] text-[#f1efe8] border-[#080807]' : 'text-[#080807]/60 border-[#080807]/12 hover:text-[#080807]'}`}
          >
            {city}
          </button>
        ))}
      </div>
      <div className="border border-[#080807]/12 p-5 font-mono text-xs space-y-4 bg-[#080807]/[0.01]">
        <h5 className="font-serif text-lg italic text-[#080807]/90 pb-3 border-b border-[#080807]/10">{activeTab} Local Diagnostics</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#080807]/10 p-3">
            <span className="text-[#080807]/40 text-[9px] uppercase tracking-wider block">GBP Signals Quality</span>
            <span className="text-xl font-bold text-[#3d5c2e] mt-1 block">{current.gbpScore}</span>
          </div>
          <div className="border border-[#080807]/10 p-3">
            <span className="text-[#080807]/40 text-[9px] uppercase tracking-wider block">Local Citation Count</span>
            <span className="text-xl font-bold mt-1 block">{current.citations}</span>
          </div>
          <div className="border border-[#080807]/10 p-3">
            <span className="text-[#080807]/40 text-[9px] uppercase tracking-wider block">NAP Consistency</span>
            <span className="text-xl font-bold text-[#3d5c2e] mt-1 block">{current.napConsistency}</span>
          </div>
          <div className="border border-[#080807]/10 p-3">
            <span className="text-[#080807]/40 text-[9px] uppercase tracking-wider block">Google Reviews</span>
            <span className="text-xl font-bold mt-1 block">{current.reviewsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalHierarchyModalContent() {
  const treeNodes = [
    { page: '/', depth: '0', links: '142', role: 'Root Homepage' },
    { page: '/locations/', depth: '1', links: '34', role: 'Territory Hub' },
    { page: '/locations/austin-seo', depth: '2', links: '18', role: 'Austin landing page' },
    { page: '/locations/dallas-seo', depth: '2', links: '14', role: 'Dallas landing page' },
    { page: '/locations/denver-seo', depth: '2', links: '12', role: 'Denver landing page' },
  ];

  return (
    <div className="space-y-6 text-[#080807] font-sans">
      <div className="border border-[#080807]/12">
        <table className="w-full border-collapse text-left text-[10px] uppercase tracking-[0.16em]">
          <thead>
            <tr className="border-b border-[#080807]/15 text-[#080807]/40">
              <th className="p-3">Page Node</th>
              <th className="p-3">Crawl Depth</th>
              <th className="p-3">Inlinks count</th>
              <th className="p-3">Folder Role</th>
            </tr>
          </thead>
          <tbody>
            {treeNodes.map((node) => (
              <tr key={node.page} className="border-b border-[#080807]/10 last:border-0 hover:bg-[#080807]/[0.01]">
                <td className="p-3 font-mono font-bold">{node.page}</td>
                <td className="p-3 font-mono">{node.depth}</td>
                <td className="p-3 font-mono">{node.links}</td>
                <td className="p-3 normal-case text-ink/60">{node.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CrawlTreeVisual />
    </div>
  );
}

function NapVerifierModalContent() {
  const [selectedBranch, setSelectedBranch] = useState<'austin' | 'dallas' | 'denver'>('austin');

  const branches = {
    austin: {
      name: 'Void Agency Austin',
      address: '701 Congress Ave, Austin, TX 78701',
      phone: '512-555-0199',
      directories: [
        { platform: 'Google Maps', name: 'Void Agency Austin', address: '701 Congress Ave, Austin, TX 78701', phone: '512-555-0199', status: 'MATCH' },
        { platform: 'Apple Maps', name: 'Void Agency Austin', address: '701 Congress Ave, Austin, TX 78701', phone: '512-555-0199', status: 'MATCH' },
        { platform: 'Yelp Listings', name: 'Void Agency (Austin)', address: '701 Congress Ave., Austin, TX 78701', phone: '512-555-0199', status: 'DISCREPANCY' }
      ]
    },
    dallas: {
      name: 'Void Agency Dallas',
      address: '2200 Ross Ave, Dallas, TX 75201',
      phone: '214-555-0211',
      directories: [
        { platform: 'Google Maps', name: 'Void Agency Dallas', address: '2200 Ross Ave, Dallas, TX 75201', phone: '214-555-0211', status: 'MATCH' },
        { platform: 'Apple Maps', name: 'Void Agency (Dallas HQ)', address: '2200 Ross Avenue, Dallas, TX 75201', phone: '214-555-0211', status: 'DISCREPANCY' },
        { platform: 'Yelp Listings', name: 'Void Agency Dallas', address: '2200 Ross Ave, Dallas, TX 75201', phone: '214-555-0211', status: 'MATCH' }
      ]
    },
    denver: {
      name: 'Void Agency Denver',
      address: '1700 Lincoln St, Denver, CO 80203',
      phone: '303-555-0314',
      directories: [
        { platform: 'Google Maps', name: 'Void Agency Denver', address: '1700 Lincoln St, Denver, CO 80203', phone: '303-555-0314', status: 'MATCH' },
        { platform: 'Apple Maps', name: 'Void Agency Denver', address: '1700 Lincoln Street, Denver, CO 80203', phone: '303-555-0314', status: 'DISCREPANCY' },
        { platform: 'Yelp Listings', name: 'Void Agency Denver Node', address: '1700 Lincoln St, Denver, CO 80203', phone: '303-555-0314', status: 'DISCREPANCY' }
      ]
    }
  };

  const current = branches[selectedBranch];

  const handleCopySchema = () => {
    const schema = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "${current.name}",
  "telephone": "${current.phone}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${current.address.split(',')[0]}",
    "addressLocality": "${current.address.split(',')[1].trim()}",
    "addressRegion": "${current.address.split(',')[2].trim().split(' ')[0]}",
    "postalCode": "${current.address.split(',')[2].trim().split(' ')[1]}",
    "addressCountry": "US"
  }
}`;
    navigator.clipboard.writeText(schema);
  };

  return (
    <div className="space-y-6 text-[#080807] font-sans">
      <div className="flex gap-2 border-b border-[#080807]/10 pb-3">
        {(['austin', 'dallas', 'denver'] as const).map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBranch(b)}
            className={`border px-3 py-1.5 text-[8.5px] uppercase tracking-wider font-mono cursor-pointer transition-colors ${selectedBranch === b ? 'border-[#b7c8a8] text-[#3d5c2e] bg-[#b7c8a8]/15 font-bold' : 'border-[#080807]/12 text-[#080807]/50 hover:text-[#080807]'}`}
          >
            {b} Branch
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="text-[8.5px] uppercase tracking-widest text-[#080807]/40 font-mono">// DIRECTORY SYNC STATS</div>
        <div className="border border-[#080807]/12 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[9px] uppercase tracking-wider font-mono">
            <thead>
              <tr className="border-b border-[#080807]/15 text-[#080807]/40">
                <th className="p-3">Platform</th>
                <th className="p-3">Name</th>
                <th className="p-3">Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {current.directories.map((dir, idx) => (
                <tr key={idx} className="border-b border-[#080807]/10 last:border-0 hover:bg-[#080807]/[0.01]">
                  <td className="p-3 font-bold">{dir.platform}</td>
                  <td className={dir.name !== current.name ? 'p-3 text-[#c2695e]' : 'p-3 opacity-80'}>{dir.name}</td>
                  <td className={dir.address !== current.address ? 'p-3 text-[#c2695e]' : 'p-3 opacity-80'}>{dir.address}</td>
                  <td className={dir.phone !== current.phone ? 'p-3 text-[#c2695e]' : 'p-3 opacity-80'}>{dir.phone}</td>
                  <td className="p-3">
                    <span className={`px-1.5 py-0.5 border text-[7.5px] leading-none ${dir.status === 'MATCH' ? 'text-[#3d5c2e] border-[#b7c8a8]/40 bg-[#b7c8a8]/15 font-semibold' : 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/8 font-semibold'}`}>
                      {dir.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#080807]/10">
          <div className="text-[7.5px] text-[#080807]/40 tracking-widest font-mono">
            URI SCHEMA SYNC TARGET: SCHEMA.LOCALBUSINESS.{selectedBranch.toUpperCase()}
          </div>
          <button
            onClick={handleCopySchema}
            className="hover-target w-full sm:w-auto bg-[#080807] text-[#f1efe8] font-mono text-[9px] font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#080807]/90 transition-colors cursor-pointer"
          >
            COPY SYNC SCHEMA
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LocalVisibilityPage() {
  useSEO(LOCAL_VISIBILITY_SEO);
  const prefersReducedMotion = useReducedMotion();
  const [activeModal, setActiveModal] = useState<'monitor' | 'hierarchy' | 'nap' | 'schema' | 'insights' | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-canvas text-ink selection:bg-ink selection:text-canvas md:cursor-none">
      <ScrollProgress />
      <PageTechnicalChrome tone="light" />
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      
      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}

      <InternalHeader activePath="/method" tone="light" />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] xl:px-10 xl:pt-20">
        <ScrollReveal yOffset={18} blur={false} className="min-w-0">
          <div className="mb-9 text-[10px] uppercase tracking-[0.36em] text-ink/48">VOID CASE STUDY ( 04 )</div>
          <h1 
            style={{ viewTransitionName: 'local-visibility-title' } as CSSProperties}
            className="font-serif text-[clamp(4.2rem,10vw,10.2rem)] italic leading-[0.82] tracking-[-0.045em] text-ink"
          >
            <ScrambleText text="LOCAL" trigger="once" />
            <br />
            <ScrambleText text="VISIBILITY" trigger="once" />
          </h1>
          <p className="mt-12 max-w-xl text-sm font-medium uppercase leading-relaxed tracking-[0.24em] text-ink/82">
            <RevealText text="TERRITORY MAPPING FOR LOCATION SEARCH," delay={0.25} elementType="span" />
            <br />
            <RevealText text="GBP OPTIMIZATION, AND CITATIONS." delay={0.4} elementType="span" />
          </p>
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-ink/60">
            Local search performance is driven by directory NAP consistency, Google Business Profile optimizations, and local authority hubs. We audit folder hierarchies and citations to secure visibility in target territories.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/14 pt-8 text-left uppercase tracking-widest text-ink/48">
            <div>
              <div className="text-[10px] opacity-60">GBP DISCOVERY</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">+35%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">NAP CONSISTENCY</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">98%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">FOLDER INDEXATION</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">100%</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group relative border border-ink/12 p-4 md:p-8 bg-ink/[0.015]">
            <CrawlTreeVisual />
            <div className="mt-4 grid grid-cols-3 border-t border-ink/12 text-[9px] uppercase tracking-[0.22em] text-ink/46 pt-4">
              <span>LOCATION GRAPH</span>
              <span>NAP PASS</span>
              <span>GBP SYNCHRONIZED</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Overview Section */}
      <section id="overview" className="mx-auto max-w-[1480px] border-y border-ink/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal yOffset={18} blur={false}>
            <div className="mb-8 text-[10px] uppercase tracking-[0.34em] text-ink/42">OVERVIEW</div>
            <p className="max-w-[44rem] font-serif text-[clamp(2.4rem,4.8vw,5.4rem)] italic leading-[0.94] tracking-[-0.035em]">
              Boilerplate territory landing pages risk duplicate template penalties, while misaligned business names dilute location proximity authority.
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/58">
              We align Name, Address, and Phone data across global maps directories, map folder hierarchies, inject custom schemas, and audit local business signal values.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 border-y border-ink/12 md:grid-cols-2 xl:grid-cols-5 xl:border-y-0">
            {processSteps.map((step) => (
              <div key={step.title} className="text-ink bg-ink/[0.015]">
                <LVProcessStep {...step} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceModuleSnapshot module={SERVICE_MODULE} tone="light" />

      {/* Evidence & Outputs section */}
      <section className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-12">
          <div className="text-[10px] uppercase tracking-[0.34em] text-ink/42">EVIDENCE &amp; OUTPUTS</div>
          <h2 className="mt-6 font-serif text-[clamp(3rem,6vw,7rem)] italic leading-none tracking-[-0.04em]">LOCAL AUDIT PANELS</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <LVOutputCard 
            title="LOCATION MONITOR" 
            copy="Check local business citations and reviews by city." 
            cta="VIEW CITATIONS" 
            onCtaClick={() => setActiveModal('monitor')}
          >
            <LocalCitiesConsole />
          </LVOutputCard>

          <LVOutputCard 
            title="LOCAL CRAWL TREE" 
            copy="Map folder structure depths for service pages." 
            cta="INSPECT HIERARCHY" 
            onCtaClick={() => setActiveModal('hierarchy')}
          >
            <CrawlTreeVisual />
          </LVOutputCard>

          <LVOutputCard 
            title="NAP CITATION CHECK" 
            copy="Verify matching Name-Address-Phone directory profiles." 
            cta="CHECK DIRECTORIES" 
            onCtaClick={() => setActiveModal('nap')}
          >
            <div className="w-full space-y-3 text-[10px] uppercase tracking-[0.16em] text-ink/60">
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Google Maps</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Apple Maps</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Bing Places</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between">
                <span>Yelp Listings</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#c2695e]" />
              </div>
            </div>
          </LVOutputCard>

          <LVOutputCard 
            title="LOCAL SCHEMA" 
            copy="Inspect LocalBusiness JSON-LD markup blocks." 
            cta="VIEW SCHEMA" 
            onCtaClick={() => setActiveModal('schema')}
          >
            <div className="border border-ink/15 p-3 w-full font-mono text-[9px] text-ink/70 leading-relaxed bg-ink/[0.01] overflow-hidden whitespace-pre">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Void Agency Austin",
  "telephone": "512-555-0199"
}`}
            </div>
          </LVOutputCard>

          <LVOutputCard 
            title="GBP MAP INSIGHTS" 
            copy="Examine customer maps directions conversion trends." 
            cta="VIEW CONVERSIONS" 
            onCtaClick={() => setActiveModal('insights')}
          >
            <div className="w-full space-y-2 text-[10px] uppercase tracking-[0.18em] text-ink/62">
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Maps Direction calls</span>
                <span className="text-[#b7c8a8] font-bold">+28%</span>
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Phone call actions</span>
                <span className="text-[#b7c8a8] font-bold">+14%</span>
              </div>
              <div className="flex justify-between">
                <span>Website clicks</span>
                <span className="text-[#b7c8a8] font-bold">+42%</span>
              </div>
            </div>
          </LVOutputCard>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-12 xl:px-10 xl:py-24 border-t border-ink/12">
        <ScrollReveal className="lg:col-span-6">
          <h2 className="max-w-[32rem] font-serif text-[clamp(3.5rem,7vw,8rem)] italic leading-[0.84] tracking-[-0.045em]">
            Clean location signals that rank proximity.
          </h2>
          <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ink/62">
            Audit Name, Address, and Phone listings across key directory services to secure local presence.
          </p>
          <a href={getContactHref(SERVICE_MODULE.intent)} className="hover-target mt-10 inline-flex border-b border-ink/28 pb-2 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-ink/70" data-cursor-text="CONTACT">
            {SERVICE_MODULE.cta} -&gt;
          </a>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delay={0.16} blur={false}>
          <div className="border border-ink/18 p-5 text-[10px] uppercase tracking-[0.28em]">
            <div className="mb-10 flex items-center justify-between border-b border-ink/14 pb-5">
              <span className="text-ink/45">CASE STUDY</span>
              <span>04 / 04</span>
            </div>
            <a href="/product-discovery-system" className="hover-target mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">PREV</span>
              <span>03 / PRODUCT SYSTEM</span>
              <span>UP</span>
            </a>
            <a href="/method" className="hover-target grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">INDEX</span>
              <span>00 / VOID METHOD</span>
              <span>DOWN</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <InternalFooter activePath="/method" tone="light" />

      {/* Interactive Modals */}
      <ConsoleModal isOpen={activeModal === 'monitor'} onClose={() => setActiveModal(null)} title="01 / LOCATION COVERAGE MONITOR">
        <LocalMonitorModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'hierarchy'} onClose={() => setActiveModal(null)} title="02 / LOCAL DIRECTORY CRAWL DEPTH">
        <LocalHierarchyModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'nap'} onClose={() => setActiveModal(null)} title="03 / NAP CITATION VERIFIER">
        <NapVerifierModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'schema'} onClose={() => setActiveModal(null)} title="04 / LOCAL BUSINESS SCHEMA VALIDATOR">
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-ink/60 leading-relaxed">Verify LocalBusiness JSON-LD markup schema block syntax.</p>
          <pre className="bg-[#080807]/[0.02] border border-[#080807]/10 p-4 font-mono text-[10px] text-[#3d5c2e] overflow-x-auto whitespace-pre-wrap select-all">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://sulayman-bowles.dev/locations/austin-seo#local",
  "name": "Void Agency Austin",
  "url": "https://sulayman-bowles.dev/locations/austin-seo",
  "telephone": "512-555-0199",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "701 Congress Ave.",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "postalCode": "78701",
    "addressCountry": "US"
  }
}`}
          </pre>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'insights'} onClose={() => setActiveModal(null)} title="05 / GBP IMPRESSIONS CONVERSION REPORT">
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-ink/60 leading-relaxed">Calculated customer direction conversion rates pre and post GBP territory audit.</p>
          <div className="border border-[#080807]/12 p-4 font-mono text-xs space-y-2 text-ink/80">
            <div>Pre-Audit Direction Conversions: 1,240 clicks / month</div>
            <div>Post-Audit Direction Conversions: 1,587 clicks / month</div>
            <div className="text-[#3d5c2e] font-bold">Impressions Delta: +27.9% growth</div>
          </div>
        </div>
      </ConsoleModal>
    </main>
  );
}
