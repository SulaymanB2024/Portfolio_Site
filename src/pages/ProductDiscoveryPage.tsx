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

const PRODUCT_DISCOVERY_SEO = getSeoRoute('/product-discovery-system')!;
const SERVICE_MODULE = getServiceModule('product-discovery');

type ProcessStepProps = {
  index: string;
  title: string;
  copy: string;
  icon: 'template' | 'intent' | 'equity' | 'dup' | 'speed';
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
    title: 'TEMPLATE CHECK',
    icon: 'template',
    copy: 'Inspect collection and product template components to find structural shift issues, rendering bugs, and empty metadata nodes.',
  },
  {
    index: '02',
    title: 'INTENT MAP',
    icon: 'intent',
    copy: 'Map transaction and informational intent queries against catalog structures to ensure page templates match customer interest.',
  },
  {
    index: '03',
    title: 'EQUITY FLOW',
    icon: 'equity',
    copy: 'Audit internal linking paths and page depth structure to direct crawler visibility to highest-revenue clusters.',
  },
  {
    index: '04',
    title: 'DUP REMEDY',
    icon: 'dup',
    copy: 'Resolve indexation waste caused by UTM trackers, query filter variables, sorting lists, and multi-path collection directories.',
  },
  {
    index: '05',
    title: 'SPEED ENHANCE',
    icon: 'speed',
    copy: 'Optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) on high-traffic product detail page viewports.',
  },
];

function ProcessIcon({ type, isHovered }: { type: ProcessStepProps['icon']; isHovered: boolean }) {
  const common = 'stroke-current fill-none';

  if (type === 'template') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <rect className={common} x="14" y="16" width="44" height="40" strokeWidth="1.2" />
        <line className={common} x1="14" y1="28" x2="58" y2="28" strokeWidth="1.2" />
        <rect className={common} x="20" y="34" width="12" height="16" strokeWidth="1" />
        <rect className={common} x="36" y="34" width="16" height="8" strokeWidth="1" />
      </svg>
    );
  }

  if (type === 'intent') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <circle className={common} cx="30" cy="30" r="12" strokeWidth="1.2" />
        <line className={common} x1="39" y1="39" x2="52" y2="52" strokeWidth="1.5" />
        <motion.path 
          className={common} 
          d="M24 30 H36 M30 24 V36" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
        />
      </svg>
    );
  }

  if (type === 'equity') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <path className={common} d="M36 14 V58 M20 30 H52 M24 22 L48 46" strokeWidth="1" opacity="0.3" />
        <circle cx="36" cy="14" r="3.5" fill="currentColor" />
        <circle cx="20" cy="30" r="3.5" fill="currentColor" />
        <circle cx="52" cy="30" r="3.5" fill="currentColor" />
        <circle cx="36" cy="58" r="3.5" fill="currentColor" />
      </svg>
    );
  }

  if (type === 'dup') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <rect className={common} x="16" y="16" width="30" height="30" strokeWidth="1.2" />
        <motion.rect 
          className={common} 
          x="26" 
          y="26" 
          width="30" 
          height="30" 
          strokeWidth="1.2" 
          animate={isHovered ? { x: 28, y: 28 } : { x: 26, y: 26 }}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
      <path className={common} d="M16 48 L28 32 L38 42 L56 22" strokeWidth="1.2" />
      <circle cx="56" cy="22" r="3.5" fill="currentColor" />
      <motion.path 
        className={common} 
        d="M16 56 H56 V16" 
        strokeWidth="1" 
        opacity="0.3" 
      />
    </svg>
  );
}

function PDProcessStep({ index, title, copy, icon }: ProcessStepProps) {
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

function PDOutputCard({ title, copy, cta, children, id, onCtaClick }: OutputCardProps) {
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

function DiscoveryHeatmapGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(2);

  const tiles = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const isCritical = index % 7 === 0;
      const isWarning = index % 5 === 1;
      const status = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'OPTIMAL';
      const path = index % 2 === 0 ? `/collections/outerwear-p${index}` : `/products/running-shoe-${index}`;
      const lcp = isCritical ? '3.4s' : isWarning ? '2.1s' : '1.1s';
      return { index, isCritical, isWarning, status, path, lcp };
    });
  }, []);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const currentTile = tiles[activeIndex];

  return (
    <div className="grid w-full gap-3 font-mono text-[9px] uppercase tracking-wider">
      <div className="grid grid-cols-6 gap-1.5 p-1 bg-ink/5 border border-ink/10">
        {tiles.map((tile) => (
          <motion.div 
            key={tile.index}
            onMouseEnter={() => setHoveredIndex(tile.index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelectedIndex(tile.index)}
            className={`aspect-square border border-ink/12 cursor-pointer transition-all ${
              tile.isCritical ? 'bg-[#c2695e]/60' : tile.isWarning ? 'bg-ink/20' : 'bg-[#b7c8a8]/60'
            } ${selectedIndex === tile.index ? 'ring-1 ring-ink scale-110' : ''}`}
            animate={{ scale: hoveredIndex === tile.index ? 1.15 : 1 }}
          />
        ))}
      </div>
      <div className="border-t border-ink/10 pt-2 space-y-1 text-ink/70">
        <div className="flex justify-between">
          <span className="opacity-50">URL:</span>
          <span className="text-ink font-semibold truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[320px] md:max-w-none lg:max-w-[140px] xl:max-w-[200px] lowercase select-all">{currentTile.path}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">LCP:</span>
          <span className={currentTile.isCritical ? 'text-[#c2695e] font-bold' : 'text-ink'}>{currentTile.lcp}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-50">STATUS:</span>
          <span className={currentTile.isCritical ? 'text-[#c2695e]' : currentTile.isWarning ? 'text-ink' : 'text-[#3d5c2e] font-bold'}>
            {currentTile.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function IntentGapList() {
  const gaps = [
    { query: 'waterproof raincoats', volume: '18.4K', rank: '12', state: 'CRITICAL' },
    { query: 'mens trail running shoes', volume: '42.1K', rank: '8', state: 'WARNING' },
    { query: 'insulated winter boots', volume: '22.8K', rank: '3', state: 'OPTIMAL' },
  ];

  return (
    <div className="w-full space-y-2.5 text-[10px] uppercase tracking-[0.16em]">
      {gaps.map((gap) => (
        <div key={gap.query} className="flex justify-between items-center border-b border-ink/10 pb-2">
          <div className="flex flex-col">
            <span className="font-bold text-ink">{gap.query}</span>
            <span className="text-ink/40 text-[8px] mt-0.5">Vol: {gap.volume}</span>
          </div>
          <span className={`text-[8.5px] px-1.5 py-0.5 border leading-none font-mono ${gap.state === 'CRITICAL' ? 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/5' : gap.state === 'WARNING' ? 'text-ink/60 border-ink/20' : 'text-[#b7c8a8] border-[#b7c8a8]/30 bg-[#b7c8a8]/5'}`}>
            R:{gap.rank}
          </span>
        </div>
      ))}
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

function HeatmapModalContent() {
  const [selectedCell, setSelectedCell] = useState(0);

  const mockDiagnostics = [
    { path: '/collections/mens-outerwear', status: 'CRITICAL', issues: ['Missing canonical directive', 'Thin template description content', 'Cumulative Layout Shift (CLS) on mobile'] },
    { path: '/products/apex-running-shoes', status: 'OPTIMAL', issues: ['Zero diagnostic errors', 'LCP under 1.2s'] },
    { path: '/collections/womens-footwear', status: 'WARNING', issues: ['Missing alt tags on hero images', 'Weak internal link authority flow'] },
  ];

  const current = mockDiagnostics[selectedCell % mockDiagnostics.length];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 text-[#080807] font-sans h-full">
      <div className="space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#080807]/40 mb-4 font-bold">DISCOVERY MATRIX GRID EXPLORER</h4>
        <div className="grid grid-cols-10 gap-3">
          {Array.from({ length: 30 }).map((_, index) => {
            const isSel = selectedCell === index;
            const status = index % 3 === 0 ? 'bg-[#c2695e]/60' : index % 3 === 2 ? 'bg-[#080807]/15' : 'bg-[#b7c8a8]/60';
            return (
              <button 
                key={index} 
                onClick={() => setSelectedCell(index)}
                className={`aspect-square border border-[#080807]/12 cursor-pointer transition-all ${status} ${isSel ? 'ring-2 ring-[#080807] scale-110' : ''}`}
              />
            );
          })}
        </div>
        <div className="bg-[#080807]/[0.015] border border-[#080807]/12 p-5 font-mono text-xs mt-6">
          <div className="flex justify-between border-b border-[#080807]/10 pb-2 mb-3">
            <span className="text-[#080807]/40">URL PATH</span>
            <span className="text-[#080807]/90">{current.path}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-[#080807]/40">AUDIT SCORE</span>
            <span className={current.status === 'CRITICAL' ? 'text-[#c2695e] font-bold' : current.status === 'WARNING' ? 'text-[#080807] font-bold' : 'text-[#3d5c2e] font-bold'}>
              {current.status}
            </span>
          </div>
        </div>
      </div>
      <div className="border-l border-[#080807]/12 pl-6 space-y-4">
        <h5 className="font-mono text-[9px] uppercase tracking-widest text-[#080807]/40 font-bold">TEMPLATE ISSUES</h5>
        <ul className="space-y-3">
          {current.issues.map((issue, idx) => (
            <li key={idx} className="text-xs leading-relaxed flex items-start gap-3">
              <span className={`h-1.5 w-1.5 rounded-full mt-1.5 ${current.status === 'CRITICAL' ? 'bg-[#c2695e]' : current.status === 'WARNING' ? 'bg-[#080807]/50' : 'bg-[#3d5c2e]'}`} />
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IntentModalContent() {
  const tableData = [
    { keyword: 'waterproof running shoes', vol: '18,400', rank: '14', page: '/collections/trail-shoes', target: 'Create localized sub-collection template' },
    { keyword: 'lightweight rain jacket', vol: '22,100', rank: '8', page: '/collections/mens-jackets', target: 'Audit content layout & header outlines' },
    { keyword: 'merino wool socks', vol: '12,900', rank: '1', page: '/collections/accessories', target: 'Optimal. Maintain link equity flows' },
    { keyword: 'breathable windbreaker', vol: '8,400', rank: '32', page: '/products/windbreaker', target: 'Redirect to parent category collections' },
  ];

  return (
    <div className="space-y-6 text-[#080807] font-sans">
      <div className="border border-[#080807]/12">
        <table className="w-full border-collapse text-left text-[10px] uppercase tracking-[0.16em]">
          <thead>
            <tr className="border-b border-[#080807]/15 text-[#080807]/40">
              <th className="p-3">Search Term</th>
              <th className="p-3">Monthly Vol</th>
              <th className="p-3">Current Rank</th>
              <th className="p-3">Mapped Landing Page</th>
              <th className="p-3">Required Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.keyword} className="border-b border-[#080807]/10 last:border-0 hover:bg-[#080807]/[0.015]">
                <td className="p-3 font-bold">{row.keyword}</td>
                <td className="p-3 font-mono">{row.vol}</td>
                <td className="p-3 font-mono">{row.rank}</td>
                <td className="p-3 font-mono text-[#080807]/60">{row.page}</td>
                <td className="p-3 normal-case text-[#3d5c2e] font-medium">{row.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeduplicationRulesConfigContent() {
  const [serverType, setServerType] = useState<'nginx' | 'apache' | 'vercel'>('nginx');
  const [removeUtm, setRemoveUtm] = useState(true);
  const [removeSort, setRemoveSort] = useState(true);
  const [slashRedirect, setSlashRedirect] = useState(false);

  const generatedConfig = useMemo(() => {
    if (serverType === 'nginx') {
      let rules = `# Nginx Redirection Rules\n`;
      if (removeUtm) {
        rules += `if ($args ~* "(.*)utm_(.*)") {\n  rewrite ^(.*)$ $uri? permanent;\n}\n`;
      }
      if (removeSort) {
        rules += `if ($args ~* "(.*)sort=(.*)") {\n  rewrite ^(.*)$ $uri? permanent;\n}\n`;
      }
      if (slashRedirect) {
        rules += `rewrite ^/(.*)/$ /$1 permanent;\n`;
      }
      return rules;
    }
    if (serverType === 'apache') {
      let rules = `RewriteEngine On\n# Apache Redirects\n`;
      if (removeUtm) {
        rules += `RewriteCond %{QUERY_STRING} (.*)utm_(.*)\nRewriteRule ^(.*)$ /$1? [R=301,L]\n`;
      }
      if (removeSort) {
        rules += `RewriteCond %{QUERY_STRING} (.*)sort=(.*)\nRewriteRule ^(.*)$ /$1? [R=301,L]\n`;
      }
      if (slashRedirect) {
        rules += `RewriteRule ^(.*)/$ /$1 [R=301,L]\n`;
      }
      return rules;
    }
    // vercel
    let redirects: any[] = [];
    if (removeUtm) {
      redirects.push({ source: '/(.*)\\?.*utm_.*', destination: '/$1', permanent: true });
    }
    if (removeSort) {
      redirects.push({ source: '/(.*)\\?.*sort=.*', destination: '/$1', permanent: true });
    }
    if (slashRedirect) {
      redirects.push({ source: '/:path+/', destination: '/:path', permanent: true });
    }
    return JSON.stringify({ redirects }, null, 2);
  }, [serverType, removeUtm, removeSort, slashRedirect]);

  return (
    <div className="space-y-5 text-[#080807] font-sans">
      <div className="flex gap-2 border-b border-[#080807]/10 pb-3">
        {(['nginx', 'apache', 'vercel'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setServerType(type)}
            className={`border px-3 py-1.5 text-[8.5px] uppercase tracking-wider font-mono cursor-pointer transition-colors ${serverType === type ? 'border-[#3d5c2e] text-[#3d5c2e] bg-[#3d5c2e]/10 font-bold' : 'border-[#080807]/12 text-[#080807]/50 hover:text-[#080807]'}`}
          >
            {type} config
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <div className="space-y-3 font-mono text-[9px] uppercase tracking-wider">
          <div className="text-[8.5px] text-[#080807]/40 mb-1">// CONFIG TOGGLES</div>
          
          <label className="flex items-center gap-3 border border-[#080807]/10 p-2.5 bg-[#080807]/[0.025] hover:bg-[#080807]/[0.05] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeUtm}
              onChange={(e) => setRemoveUtm(e.target.checked)}
              className="accent-[#3d5c2e]"
            />
            <span>Remove UTM query</span>
          </label>

          <label className="flex items-center gap-3 border border-[#080807]/10 p-2.5 bg-[#080807]/[0.025] hover:bg-[#080807]/[0.05] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeSort}
              onChange={(e) => setRemoveSort(e.target.checked)}
              className="accent-[#3d5c2e]"
            />
            <span>Remove Sort parameters</span>
          </label>

          <label className="flex items-center gap-3 border border-[#080807]/10 p-2.5 bg-[#080807]/[0.025] hover:bg-[#080807]/[0.05] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={slashRedirect}
              onChange={(e) => setSlashRedirect(e.target.checked)}
              className="accent-[#3d5c2e]"
            />
            <span>Strip trailing slash</span>
          </label>
        </div>

        <div className="space-y-2">
          <div className="text-[8.5px] text-[#080807]/40 font-mono">// GENERATED CONFIG PAYLOAD</div>
          <pre className="bg-[#080807]/[0.02] border border-[#080807]/10 p-4 font-mono text-[9.5px] text-[#3d5c2e] overflow-x-auto whitespace-pre select-all h-40">
            {generatedConfig}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function ProductDiscoveryPage() {
  useSEO(PRODUCT_DISCOVERY_SEO);
  const prefersReducedMotion = useReducedMotion();
  const [activeModal, setActiveModal] = useState<'heatmap' | 'intent' | 'budget' | 'diagnostics' | 'rules' | null>(null);

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
          <div className="mb-9 text-[10px] uppercase tracking-[0.36em] text-ink/48">VOID CASE STUDY ( 03 )</div>
          <h1 
            style={{ viewTransitionName: 'product-discovery-title' } as CSSProperties}
            className="font-serif text-[clamp(4.2rem,10vw,10.2rem)] italic leading-[0.82] tracking-[-0.045em] text-ink"
          >
            <ScrambleText text="PRODUCT" trigger="once" />
            <br />
            <ScrambleText text="DISCOVERY" trigger="once" />
          </h1>
          <p className="mt-12 max-w-xl text-sm font-medium uppercase leading-relaxed tracking-[0.24em] text-ink/82">
            <RevealText text="AUDITING CATALOG INDEXABILITY," delay={0.25} elementType="span" />
            <br />
            <RevealText text="TEMPLATE ERRORS, AND SEARCH INTENT." delay={0.4} elementType="span" />
          </p>
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-ink/60">
            E-commerce platforms serving large catalogs frequently dilute crawl budgets with filters, parameters, and weak links. We map product and collection paths to build structured discovery pathways.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/14 pt-8 text-left uppercase tracking-widest text-ink/48">
            <div>
              <div className="text-[10px] opacity-60">CRAWL WASTE</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">-42%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">ORGANIC COVERAGE</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">+28%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">AVERAGE LCP</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">1.4s</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group relative border border-ink/12 p-4 md:p-8 bg-ink/[0.015]">
            <DiscoveryHeatmapGrid />
            <div className="mt-4 grid grid-cols-3 border-t border-ink/12 text-[9px] uppercase tracking-[0.22em] text-ink/46 pt-4">
              <span>CATALOG MATRIX</span>
              <span>FILTERS CONSOLIDATED</span>
              <span>TEMPLATES PASS</span>
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
              Product catalogs suffer when search crawlers waste resources parsing infinite filter loops instead of indexing high-intent collections.
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/58">
              We audit templates to eliminate redundant canonical configurations, resolve intent gaps, optimize internal link allocations, and speed up LCP rendering.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 border-y border-ink/12 md:grid-cols-2 xl:grid-cols-5 xl:border-y-0">
            {processSteps.map((step) => (
              <div key={step.title} className="text-ink bg-ink/[0.015]">
                <PDProcessStep {...step} />
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
          <h2 className="mt-6 font-serif text-[clamp(3rem,6vw,7rem)] italic leading-none tracking-[-0.04em]">SYSTEM DIAGNOSTICS</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <PDOutputCard 
            title="DISCOVERY MATRIX" 
            copy="Grid overview of category vs product page templates." 
            cta="EXPLORE HEATMAP" 
            onCtaClick={() => setActiveModal('heatmap')}
          >
            <DiscoveryHeatmapGrid />
          </PDOutputCard>

          <PDOutputCard 
            title="INTENT GAP LIST" 
            copy="Map transactional keywords to collections." 
            cta="VIEW ALL GAPS" 
            onCtaClick={() => setActiveModal('intent')}
          >
            <IntentGapList />
          </PDOutputCard>

          <PDOutputCard 
            title="CRAWL BUDGET CHECK" 
            copy="Verify canonical structures against filter parameters." 
            cta="INSPECT LAWS" 
            onCtaClick={() => setActiveModal('budget')}
          >
            <div className="w-full space-y-3 text-[10px] uppercase tracking-[0.16em] text-ink/60">
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Filter Consolidate</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Trailing Slash Rules</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Direct canonical flow</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between">
                <span>Sorting Duplication</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#c2695e]" />
              </div>
            </div>
          </PDOutputCard>

          <PDOutputCard 
            title="TEMPLATE CHECKS" 
            copy="Audit product template DOM structure." 
            cta="VIEW METRICS" 
            onCtaClick={() => setActiveModal('diagnostics')}
          >
            <div className="border border-ink/15 p-3 w-full font-mono text-[9px] text-ink/70 leading-relaxed bg-ink/[0.01]">
              <div className="font-bold text-ink">## diagnostics logs</div>
              <div>product-detail.tsx: OK</div>
              <div>LCP Element Priority: fetchpriority=high</div>
              <div>CLS Score: 0.02 (PASS)</div>
            </div>
          </PDOutputCard>

          <PDOutputCard 
            title="CONSOLIDATION RULES" 
            copy="Inspect active redirects and canonical parameter matches." 
            cta="VIEW RULES" 
            onCtaClick={() => setActiveModal('rules')}
          >
            <div className="w-full border border-ink/15 p-3 text-[8.5px] font-mono text-[#c2695e] bg-ink/[0.01] overflow-hidden whitespace-pre">
{`RewriteCond %{QUERY_STRING} (.*)utm_source(.*)
RewriteRule ^(.*)$ /$1? [R=301,L]

# Redirect multi-category paths
Redirect 301 /products/shoes /collections/shoes`}
            </div>
          </PDOutputCard>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-12 xl:px-10 xl:py-24 border-t border-ink/12">
        <ScrollReveal className="lg:col-span-6">
          <h2 className="max-w-[32rem] font-serif text-[clamp(3.5rem,7vw,8rem)] italic leading-[0.84] tracking-[-0.045em]">
            Clean structures that scale catalogs.
          </h2>
          <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ink/62">
            Audit catalog structures to eliminate index duplication and direct search crawlers to revenue-generating collections.
          </p>
          <a href={getContactHref(SERVICE_MODULE.intent)} className="hover-target mt-10 inline-flex border-b border-ink/28 pb-2 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-ink/70" data-cursor-text="CONTACT">
            {SERVICE_MODULE.cta} -&gt;
          </a>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delay={0.16} blur={false}>
          <div className="border border-ink/18 p-5 text-[10px] uppercase tracking-[0.28em]">
            <div className="mb-10 flex items-center justify-between border-b border-ink/14 pb-5">
              <span className="text-ink/45">CASE STUDY</span>
              <span>03 / 04</span>
            </div>
            <a href="/ai-visibility-benchmark" className="hover-target mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">PREV</span>
              <span>02 / AI VISIBILITY</span>
              <span>UP</span>
            </a>
            <a href="/service-area-visibility-audit" className="hover-target grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">NEXT</span>
              <span>04 / SERVICE AUDIT</span>
              <span>DOWN</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <InternalFooter activePath="/method" tone="light" />

      {/* Interactive Modals */}
      <ConsoleModal isOpen={activeModal === 'heatmap'} onClose={() => setActiveModal(null)} title="01 / HEATMAP DIAGNOSTICS WORKSPACE">
        <HeatmapModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'intent'} onClose={() => setActiveModal(null)} title="02 / SEARCH INTENT GAP EXPLORER">
        <IntentModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'budget'} onClose={() => setActiveModal(null)} title="03 / CRAWL BUDGET &amp; DUPLICATE INSPECT">
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-[#080807]/60 leading-relaxed">Verification of standard rules cleanups preventing crawl budget loss from infinite parameters.</p>
          <div className="border border-[#080807]/12 p-4 font-mono text-xs space-y-2.5 bg-[#080807]/[0.01]">
            <div className="flex justify-between items-center border-b border-[#080807]/6 pb-1.5">
              <span className="opacity-70">UTM Tracking Query Filters &rarr; CONSOLIDATED</span>
              <span className="text-[#3d5c2e] font-bold">PASS</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#080807]/6 pb-1.5">
              <span className="opacity-70">Pagination (e.g. ?p=2) &rarr; REL-NEXT DIRECTIVES</span>
              <span className="text-[#3d5c2e] font-bold">PASS</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#080807]/6 pb-1.5">
              <span className="opacity-70">Sort queries (e.g. ?sort=price) &rarr; CANONICALS SET</span>
              <span className="text-[#3d5c2e] font-bold">PASS</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">Trailing slash inconsistencies &rarr; REDIRECTS</span>
              <span className="text-[#c2695e] font-bold">WARNING (23 PENDING)</span>
            </div>
          </div>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'diagnostics'} onClose={() => setActiveModal(null)} title="04 / Core Web Vitals Metrics">
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-[#080807]/60 leading-relaxed">Diagnostic audit scores for e-commerce template files.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#080807]/12 p-4 bg-[#080807]/[0.01]">
              <div className="text-[10px] text-[#080807]/50 uppercase tracking-widest font-bold">Largest Contentful Paint</div>
              <div className="text-2xl font-serif italic text-[#3d5c2e] mt-2 font-bold">1.4s (PASS)</div>
            </div>
            <div className="border border-[#080807]/12 p-4 bg-[#080807]/[0.01]">
              <div className="text-[10px] text-[#080807]/50 uppercase tracking-widest font-bold">Cumulative Layout Shift</div>
              <div className="text-2xl font-serif italic text-[#3d5c2e] mt-2 font-bold">0.02 (PASS)</div>
            </div>
          </div>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'rules'} onClose={() => setActiveModal(null)} title="05 / DEDUPLICATION RULES CONFIG">
        <DeduplicationRulesConfigContent />
      </ConsoleModal>
    </main>
  );
}
