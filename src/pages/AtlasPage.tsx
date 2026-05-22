import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import AtlasCrawlMap from '../components/AtlasCrawlMap';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { ShutterWipe } from '../components/ShutterWipe';
import { SmoothCursor } from '../components/SmoothCursor';
import { ScrambleText } from '../components/ScrambleText';
import { RevealText } from '../components/RevealText';
import { StaggeredText } from '../components/StaggeredText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ATLAS_SEO = getSeoRoute('/atlas')!;

type ProcessStepProps = {
  index: string;
  title: string;
  copy: string;
  icon: 'crawl' | 'extract' | 'interpret' | 'score' | 'report';
};

type OutputCardProps = {
  title: string;
  copy: string;
  cta: string;
  children: ReactNode;
  id?: string;
  onCtaClick?: () => void;
};

function NavLink({ href, active, id, children }: { href: string; active?: boolean; id?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      id={id}
      data-cursor-text={typeof children === 'string' ? children : 'VIEW'}
      className={`hover-target relative group overflow-visible px-3 py-1 transition-colors ${active ? 'text-ink' : 'text-ink/58 hover:text-ink'}`}
    >
      <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">{children}</span>
      <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-ink`}>[</span>
      <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-ink`}>]</span>
    </a>
  );
}

const processSteps: ProcessStepProps[] = [
  {
    index: '01',
    title: 'CRAWL',
    icon: 'crawl',
    copy: 'High-fidelity crawling with smart rate control, JS rendering, and adaptive discovery to map the site as search engines do.',
  },
  {
    index: '02',
    title: 'EXTRACT',
    icon: 'extract',
    copy: 'Extract content, links, directives, structured data, signals, and performance artifacts from every discovered URL.',
  },
  {
    index: '03',
    title: 'INTERPRET',
    icon: 'interpret',
    copy: 'Normalize and connect signals into an understanding of architecture, intent, and indexation potential.',
  },
  {
    index: '04',
    title: 'SCORE',
    icon: 'score',
    copy: 'Score issues by impact, confidence, and effort using proprietary heuristics and historical patterns.',
  },
  {
    index: '05',
    title: 'REPORT',
    icon: 'report',
    copy: 'Generate operator-ready reports, exports, and task lists with evidence and recommended actions.',
  },
];

const issueRows = [
  ['Blocked by robots.txt', '9.6', 'CRITICAL', 'Crawl engine blocked from accessing valuable, indexable path ranges.'],
  ['Orphaned pages', '8.7', 'HIGH', 'Pages found in sitemap or logs but zero incoming internal crawler links.'],
  ['Missing canonical', '7.2', 'HIGH', 'Pages lacking self-referencing canonicals, risking index dilution.'],
  ['Soft 404', '6.4', 'MEDIUM', 'Pages returning HTTP 200 but presenting empty content or template errors.'],
  ['Duplicate without canon.', '5.9', 'MEDIUM', 'Multiple URL paths serving identical text without canonical directives.'],
];

const indexationRows = [
  ['Indexable', '18,394', '34.8%'],
  ['Noindex', '6,372', '12.1%'],
  ['Blocked', '9,112', '17.2%'],
  ['Other', '19,846', '35.9%'],
];

function ProcessIcon({ type, isHovered }: { type: ProcessStepProps['icon']; isHovered: boolean }) {
  const common = 'stroke-current fill-none';

  if (type === 'crawl') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <circle className={common} cx="36" cy="36" r="7" strokeWidth="1.2" />
        {[12, 64, 36, 19, 54].map((x, index) => {
          const y = [17, 24, 60, 50, 54][index];
          return (
            <g key={x}>
              <motion.line 
                className={common} 
                x1="36" 
                y1="36" 
                x2={x} 
                y2={y} 
                strokeWidth="0.8" 
                animate={isHovered ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0.4, opacity: 0.4 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <motion.circle 
                className={common} 
                cx={x} 
                cy={y} 
                r="3.5" 
                strokeWidth="1" 
                animate={isHovered ? { scale: 1.3, fill: "currentColor" } : { scale: 1, fill: "none" }}
                transition={{ duration: 0.3 }}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  if (type === 'extract') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <motion.rect 
          className={common} 
          x="13" 
          y="14" 
          width="46" 
          height="44" 
          strokeWidth="1.2" 
          animate={isHovered ? { strokeWidth: 1.5, opacity: 1 } : { strokeWidth: 1.2, opacity: 0.8 }}
        />
        <motion.path 
          className={common} 
          d="M22 25 H50 M22 36 H42 M22 47 H33" 
          strokeWidth="1" 
          animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0.7, opacity: 0.6 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path 
          className={common} 
          d="M49 43 L59 53 M59 43 L49 53" 
          strokeWidth="1" 
          animate={isHovered ? { rotate: 45, opacity: 1 } : { rotate: 0, opacity: 0.65 }}
          style={{ transformOrigin: "54px 48px" }}
          transition={{ duration: 0.4 }}
        />
      </svg>
    );
  }

  if (type === 'interpret') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <motion.path 
          className={common} 
          d="M16 18 H32 C42 18 42 31 53 31 H59" 
          strokeWidth="1.1" 
          animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0.6, opacity: 0.6 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path 
          className={common} 
          d="M16 54 H31 C43 54 42 41 53 41 H59" 
          strokeWidth="1.1" 
          animate={isHovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0.6, opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        />
        <motion.circle 
          className={common} 
          cx="16" 
          cy="18" 
          r="4" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.2, strokeWidth: 1.5 } : { scale: 1, strokeWidth: 1 }}
        />
        <motion.circle 
          className={common} 
          cx="16" 
          cy="54" 
          r="4" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.2, strokeWidth: 1.5 } : { scale: 1, strokeWidth: 1 }}
        />
        <motion.circle 
          className={common} 
          cx="59" 
          cy="31" 
          r="4" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.2, fill: "currentColor" } : { scale: 1, fill: "none" }}
        />
        <motion.circle 
          className={common} 
          cx="59" 
          cy="54" 
          r="4" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.2, fill: "currentColor" } : { scale: 1, fill: "none" }}
        />
      </svg>
    );
  }

  if (type === 'score') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <motion.circle 
          className={common} 
          cx="36" 
          cy="36" 
          r="24" 
          strokeWidth="1.2" 
          animate={isHovered ? { r: 26, opacity: 0.95 } : { r: 24, opacity: 0.75 }}
        />
        <motion.path 
          className={common} 
          d="M22 36 C22 28 28 22 36 22 L36 36 L46 46" 
          strokeWidth="1.2" 
          animate={isHovered ? { pathLength: 1, strokeWidth: 1.5 } : { pathLength: 0.8, strokeWidth: 1.2 }}
          transition={{ duration: 0.45 }}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
      <motion.rect 
        className={common} 
        x="16" 
        y="14" 
        width="40" 
        height="44" 
        strokeWidth="1.2" 
        animate={isHovered ? { y: 12 } : { y: 14 }}
      />
      <motion.line 
        className={common} 
        x1="24" 
        y1="23" 
        x2="48" 
        y2="23" 
        strokeWidth="1.2" 
        animate={isHovered ? { opacity: 1 } : { opacity: 0.6 }}
      />
      <motion.line 
        className={common} 
        x1="24" 
        y1="32" 
        x2="48" 
        y2="32" 
        strokeWidth="1.2" 
        animate={isHovered ? { opacity: 1 } : { opacity: 0.6 }}
      />
      <motion.line 
        className={common} 
        x1="24" 
        y1="41" 
        x2="40" 
        y2="41" 
        strokeWidth="1.2" 
        animate={isHovered ? { opacity: 1 } : { opacity: 0.6 }}
      />
    </svg>
  );
}

function AtlasProcessStep({ index, title, copy, icon }: ProcessStepProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFinalStep = index === processSteps[processSteps.length - 1]?.index;

  return (
    <motion.article
      className="group relative min-h-[320px] border-b border-ink/14 p-5 transition-[background-color,border-color] duration-500 hover:bg-ink/[0.025] md:border-r md:last:border-r-0 lg:border-b-0"
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

function AtlasOutputCard({ title, copy, cta, children, id, onCtaClick }: OutputCardProps) {
  return (
    <motion.article
      className="group relative flex min-h-[420px] flex-col overflow-hidden border border-canvas/20 p-5 text-canvas transition-[border-color,background-color] duration-500 before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-canvas/45 before:transition-all before:duration-700 hover:border-canvas/40 hover:bg-canvas/[0.025] hover:before:w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-canvas/15 pb-5">
        <div>
          <h3 className="text-[10px] font-medium uppercase tracking-[0.32em] text-canvas/88">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-canvas/55">{copy}</p>
        </div>
        <span className="mt-1 block h-2 w-2 rounded-full border border-canvas/50 transition-colors duration-500 group-hover:bg-canvas/70" />
      </div>
      <div className="flex flex-1 items-center">{children}</div>
      <button 
        id={id}
        onClick={onCtaClick}
        className="hover-target mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-canvas/74 text-left"
      >
        {cta}
        <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
      </button>
    </motion.article>
  );
}

function MetricTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  return (
    <div className="w-full">
      <table className="w-full border-collapse text-left text-[11px] uppercase tracking-[0.13em]">
        <tbody>
          {issueRows.map(([label, score, severity, desc], index) => {
            const isHovered = hoveredRow === index;
            const severityColor = 
              severity === 'CRITICAL' ? 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/10' :
              severity === 'HIGH' ? 'text-[#c2695e] border-[#c2695e]/20 bg-[#c2695e]/5' :
              'text-[#f1efe8]/60 border-[#f1efe8]/15 bg-transparent';

            return (
              <tr 
                key={label} 
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className="border-b border-canvas/12 last:border-b-0 cursor-pointer group transition-colors duration-200 hover:bg-canvas/[0.03]"
              >
                <td className="py-3 pr-2 text-canvas/55 group-hover:text-canvas transition-colors duration-200">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{label}</span>
                      {isHovered && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-[8px] px-1.5 py-0.5 border font-mono tracking-normal leading-none ${severityColor}`}
                        >
                          {severity}
                        </motion.span>
                      )}
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                      className="overflow-hidden text-[9.5px] tracking-normal normal-case text-canvas/42 font-sans"
                    >
                      {desc}
                    </motion.div>
                  </div>
                </td>
                <td className="py-3 text-right font-medium text-canvas/82 group-hover:text-white transition-colors duration-200 align-top">
                  {score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MiniGraph() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = [
    { x: 32, y: 42, label: "Home (Depth 0)", size: 5 },
    { x: 74, y: 24, label: "Blog (Depth 1)", size: 3 },
    { x: 118, y: 45, label: "About (Depth 1)", size: 3 },
    { x: 162, y: 30, label: "Services (Depth 1)", size: 3 },
    { x: 205, y: 58, label: "Contact (Depth 1)", size: 3 },
    { x: 70, y: 92, label: "Case Study A (Depth 2)", size: 3 },
    { x: 130, y: 104, label: "Case Study B (Depth 2)", size: 3 },
    { x: 188, y: 112, label: "Landing Page (Depth 2)", size: 3 },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [0, 5],
    [0, 7]
  ];

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 240 150" className="w-full text-canvas" aria-hidden="true">
        <rect x="1" y="1" width="238" height="148" fill="none" stroke="currentColor" opacity="0.16" />
        
        {edges.map(([fromIdx, toIdx], index) => {
          const fromNode = nodes[fromIdx];
          const toNode = nodes[toIdx];
          const isActive = hoveredNode === fromIdx || hoveredNode === toIdx;
          return (
            <motion.line 
              key={index} 
              x1={fromNode.x} 
              y1={fromNode.y} 
              x2={toNode.x} 
              y2={toNode.y} 
              stroke="currentColor" 
              animate={{ 
                opacity: hoveredNode === null ? 0.22 : isActive ? 0.65 : 0.05,
                strokeWidth: isActive ? 1.4 : 0.8
              }}
              transition={{ duration: 0.25 }}
            />
          );
        })}

        <motion.path 
          d="M32 42 C90 18 118 118 188 112" 
          fill="none" 
          stroke="currentColor" 
          animate={{ 
            opacity: hoveredNode === null ? 0.18 : (hoveredNode === 0 || hoveredNode === 7) ? 0.6 : 0.04,
            strokeWidth: (hoveredNode === 0 || hoveredNode === 7) ? 1.5 : 1
          }}
          transition={{ duration: 0.25 }}
        />

        {nodes.map((node, index) => {
          const isHovered = hoveredNode === index;
          return (
            <g 
              key={index}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(index)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size} 
                fill="currentColor" 
                animate={{ 
                  scale: isHovered ? 1.35 : 1,
                  opacity: hoveredNode === null ? (index % 3 === 0 ? 0.72 : 0.42) : isHovered ? 0.95 : 0.16
                }}
                transition={{ duration: 0.25 }}
              />
              {isHovered && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 4}
                  fill="none"
                  stroke="currentColor"
                  initial={{ scale: 0.6, opacity: 1 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </g>
          );
        })}

        <g transform="translate(12, 138)" className="pointer-events-none">
          <text 
            fill="currentColor" 
            opacity={hoveredNode !== null ? 0.8 : 0.32} 
            fontFamily="Inter, sans-serif" 
            fontSize="7" 
            letterSpacing="1.2"
          >
            {hoveredNode !== null ? `INSPECTING: ${nodes[hoveredNode].label}` : "INSPECT INTERNAL LINK GRAPH"}
          </text>
        </g>
      </svg>
    </div>
  );
}

function MiniDonut() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  return (
    <div className="grid w-full gap-6">
      <div className="relative h-36 w-36 mx-auto">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90 text-canvas" aria-hidden="true">
          <circle cx="70" cy="70" r="43" fill="none" stroke="currentColor" strokeWidth="16" opacity="0.08" />
          {[
            ['94 270', 0, 0.78, 0],
            ['33 270', -100, 0.5, 1],
            ['46 270', -140, 0.32, 2],
            ['97 270', -191, 0.18, 3],
          ].map(([dash, offset, opacity, sliceIndex]) => {
            const isHovered = hoveredSlice === sliceIndex;
            return (
              <motion.circle
                key={String(dash)}
                cx="70"
                cy="70"
                r="43"
                fill="none"
                stroke="currentColor"
                strokeWidth={isHovered ? 20 : 16}
                strokeDasharray={String(dash)}
                strokeDashoffset={Number(offset)}
                opacity={isHovered ? 1 : Number(opacity)}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="cursor-pointer transition-[stroke-width,opacity] duration-200"
                onMouseEnter={() => setHoveredSlice(Number(sliceIndex))}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[7.5px] uppercase tracking-[0.16em] text-canvas/50">
            {hoveredSlice !== null ? indexationRows[hoveredSlice][0] : "TOTAL URLS"}
          </span>
          <span className="text-[12px] font-bold text-[#E8E6E1] tracking-[0.05em] leading-tight">
            {hoveredSlice !== null ? indexationRows[hoveredSlice][1] : "53,724"}
          </span>
          <span className="text-[8px] text-canvas/78 mt-0.5">
            {hoveredSlice !== null ? indexationRows[hoveredSlice][2] : "100%"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {indexationRows.map(([label, count, pct], index) => {
          const isHovered = hoveredSlice === index;
          return (
            <div 
              key={label} 
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`grid grid-cols-[1fr_auto_auto] gap-3 text-[10px] uppercase tracking-[0.16em] cursor-pointer transition-colors duration-200 ${isHovered ? 'text-[#E8E6E1]' : 'text-canvas/58'}`}
            >
              <span>{label}</span>
              <span>{count}</span>
              <span className={isHovered ? 'text-white font-medium' : 'text-canvas/82'}>{pct}</span>
            </div>
          );
        })}
      </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-md p-4 md:p-8 xl:p-12 font-sans"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full max-h-[640px] w-full max-w-[1100px] flex-col border border-[#f1efe8]/15 bg-[#080807] text-[#f1efe8]"
          >
            {/* Grid Pattern Backdrop */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,rgba(241,239,232,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,239,232,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />

            {/* Corner Registration Marks */}
            <div className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-[#f1efe8]/30" />
            <div className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-[#f1efe8]/30" />
            <div className="absolute -left-2 -bottom-2 h-4 w-4 border-l border-b border-[#f1efe8]/30" />
            <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r border-b border-[#f1efe8]/30" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#f1efe8]/12 px-6 py-4 font-mono text-[9px] uppercase tracking-[0.32em] z-10">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f1efe8]/80" />
                <span className="font-bold">{title}</span>
              </div>
              <button 
                id="modal-close-btn"
                onClick={onClose} 
                className="hover-target text-[#f1efe8]/50 transition-colors hover:text-[#f1efe8]"
              >
                [ CLOSE ESC ]
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IssuesModalContent() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const allIssues = [
    { label: "BLOCKED BY ROBOTS.TXT", score: "9.6", severity: "CRITICAL", desc: "19,846 pages matching admin/checkout checkout templates are excluded from crawl budget.", fix: "Refactor disallow rules inside /robots.txt to support dynamic querying exclusions." },
    { label: "HTTPS REDIRECT LOOP", score: "9.2", severity: "CRITICAL", desc: "Redirect loops on 42 core localization URLs preventing search engine indexation.", fix: "Configure absolute paths in Nginx rewrite rules and prevent HTTP-to-HTTPS circular headers." },
    { label: "ORPHANED PAGES", score: "8.7", severity: "HIGH", desc: "8,342 nodes discovered via sitemaps have zero incoming hyperlinks in the link graph.", fix: "Map these orphans to category landing hubs and add them to internal HTML index grids." },
    { label: "MISSING CANONICAL", score: "7.2", severity: "HIGH", desc: "312 pages missing self-referencing canonical tags, causing duplicate candidate cluster risk.", fix: "Inject native <link rel=\"canonical\"> tags dynamically using Next.js head configuration." },
    { label: "SLOW LCP IMAGES", score: "7.8", severity: "HIGH", desc: "Hero banners lack fetchpriority=\"high\" and display layouts shift on mobile viewports.", fix: "Add fetchpriority=\"high\" attributes and define explicit width/height dimensions on images." },
    { label: "SOFT 404 DETECTED", score: "6.4", severity: "HIGH", desc: "18 pages returning 200 OK status codes on empty templates or search result pages.", fix: "Configure fallback handlers to send true 404 HTTP headers for empty listings." },
    { label: "DUPLICATE WITHOUT CANONICAL", score: "5.9", severity: "MEDIUM", desc: "UTM tracking parameters causing duplicated indexation of core articles.", fix: "Set parameter handling rules inside GSC or use self-referencing canonical tags on query parameters." },
  ];

  const filtered = allIssues.filter(item => activeTab === 'ALL' || item.severity === activeTab);

  return (
    <div className="flex flex-col gap-6 h-full text-[#f1efe8] font-sans">
      <div className="flex gap-2 border-b border-[#f1efe8]/12 pb-3">
        {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(tab => (
          <button
            key={tab}
            id={`issues-tab-${tab.toLowerCase()}`}
            onClick={() => setActiveTab(tab)}
            className={`hover-target px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] border transition-colors duration-200 ${activeTab === tab ? 'bg-[#f1efe8] text-[#080807] border-[#f1efe8]' : 'text-[#f1efe8]/50 border-[#f1efe8]/15 hover:text-[#f1efe8]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filtered.map(issue => {
          const isExpanded = expandedRow === issue.label;
          const severityColor = 
            issue.severity === 'CRITICAL' ? 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/10' :
            issue.severity === 'HIGH' ? 'text-[#c2695e] border-[#c2695e]/20 bg-[#c2695e]/5' :
            'text-[#f1efe8]/60 border-[#f1efe8]/15 bg-transparent';

          return (
            <div 
              key={issue.label}
              id={`issues-row-${issue.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setExpandedRow(isExpanded ? null : issue.label)}
              className="border border-[#f1efe8]/12 p-4 cursor-pointer hover:bg-white/[0.015] transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] group-hover:text-[#f1efe8] transition-colors">{issue.label}</span>
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 border leading-none ${severityColor}`}>{issue.severity}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif italic text-[#f1efe8]/58">SCORE: {issue.score}</span>
                  <span className="font-mono text-[9px] text-[#f1efe8]/30 group-hover:text-[#f1efe8]/60">{isExpanded ? '[-]' : '[+]'}</span>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                className="overflow-hidden text-xs text-[#f1efe8]/62 leading-relaxed"
              >
                <div className="pt-4 border-t border-[#f1efe8]/10 mt-3 space-y-3">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#f1efe8]/70 block mb-1">CRAWLER EVIDENCE</span>
                    <p className="normal-case">{issue.desc}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#b7c8a8] block mb-1">REMEDIATION STEPS</span>
                    <p className="normal-case text-[#f1efe8]/82">{issue.fix}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GraphModalContent() {
  const [selectedNode, setSelectedNode] = useState<string>('/');

  const nodes = [
    { id: '/', label: 'Home Page', type: 'core', depth: 0, authority: 98, inlinks: 1240, outlinks: 56, cwv: 'PASS' },
    { id: '/blog', label: 'Blog Index', type: 'category', depth: 1, authority: 72, inlinks: 340, outlinks: 48, cwv: 'PASS' },
    { id: '/about', label: 'About Page', type: 'article', depth: 1, authority: 65, inlinks: 120, outlinks: 12, cwv: 'PASS' },
    { id: '/services', label: 'Services Index', type: 'category', depth: 1, authority: 70, inlinks: 290, outlinks: 32, cwv: 'FAIL' },
    { id: '/contact', label: 'Contact Portal', type: 'article', depth: 1, authority: 55, inlinks: 95, outlinks: 8, cwv: 'PASS' },
    { id: '/blog/seo', label: 'SEO Systems Post', type: 'article', depth: 2, authority: 58, inlinks: 45, outlinks: 6, cwv: 'PASS' },
    { id: '/blog/render', label: 'JS Rendering Post', type: 'article', depth: 2, authority: 60, inlinks: 48, outlinks: 5, cwv: 'PASS' },
    { id: '/pricing', label: 'Pricing Calculator', type: 'article', depth: 2, authority: 62, inlinks: 82, outlinks: 14, cwv: 'FAIL' },
  ];

  const links = [
    { from: '/', to: '/blog' },
    { from: '/', to: '/about' },
    { from: '/', to: '/services' },
    { from: '/', to: '/contact' },
    { from: '/blog', to: '/blog/seo' },
    { from: '/blog', to: '/blog/render' },
    { from: '/services', to: '/pricing' },
    { from: '/pricing', to: '/contact' },
  ];

  const nodeCoords: Record<string, { x: number; y: number }> = {
    '/': { x: 250, y: 250 },
    '/blog': { x: 400, y: 150 },
    '/about': { x: 400, y: 250 },
    '/services': { x: 400, y: 350 },
    '/contact': { x: 550, y: 250 },
    '/blog/seo': { x: 550, y: 90 },
    '/blog/render': { x: 550, y: 170 },
    '/pricing': { x: 550, y: 410 },
  };

  const activeNodeInfo = nodes.find(n => n.id === selectedNode)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 h-full font-sans text-[#f1efe8]">
      {/* SVG Canvas */}
      <div className="relative border border-[#f1efe8]/12 bg-black/40 flex items-center justify-center p-4 min-h-[300px]">
        <svg viewBox="0 0 700 480" className="w-full h-full text-[#f1efe8]" aria-hidden="true">
          {links.map((link, idx) => {
            const fromPos = nodeCoords[link.from];
            const toPos = nodeCoords[link.to];
            const isActive = selectedNode === link.from || selectedNode === link.to;

            return (
              <motion.line
                key={idx}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={isActive ? '#f1efe8' : 'rgba(241,239,232,0.12)'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? '5 5' : undefined}
                animate={isActive ? { strokeDashoffset: [0, -10] } : undefined}
                transition={isActive ? { repeat: Infinity, ease: 'linear', duration: 0.8 } : undefined}
              />
            );
          })}

          {nodes.map(node => {
            const pos = nodeCoords[node.id];
            const isSelected = selectedNode === node.id;
            
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id)}
              >
                {isSelected && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={node.type === 'core' ? 24 : 18}
                    fill="none"
                    stroke="#f1efe8"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={node.type === 'core' ? 14 : 10}
                  fill={isSelected ? '#f1efe8' : '#080807'}
                  stroke={isSelected ? '#f1efe8' : 'rgba(241,239,232,0.4)'}
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x}
                  y={pos.y - 18}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="8.5"
                  fill={isSelected ? '#f1efe8' : 'rgba(241,239,232,0.45)'}
                  letterSpacing="1.2"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-4 left-4 font-mono text-[8px] tracking-[0.2em] text-[#f1efe8]/45">
          CLICK NODES TO TRACE INTRALINK RELATIONSHIPS
        </div>
      </div>

      {/* Node Sidebar Info */}
      <div className="border border-[#f1efe8]/12 p-6 bg-black/30 flex flex-col justify-between font-mono">
        <div>
          <div className="text-[10px] text-[#f1efe8]/45 uppercase tracking-[0.3em] mb-4 border-b border-[#f1efe8]/12 pb-2">
            NODE INSPECTOR
          </div>
          <div className="text-xs font-bold text-[#f1efe8] mb-6 uppercase tracking-[0.1em]">
            {activeNodeInfo.label}
          </div>
          <div className="space-y-4 text-[9px] text-[#f1efe8]/60">
            <div className="flex justify-between">
              <span>PATH:</span>
              <span className="text-[#f1efe8]">{activeNodeInfo.id}</span>
            </div>
            <div className="flex justify-between">
              <span>DEPTH LEVEL:</span>
              <span className="text-[#f1efe8]">{activeNodeInfo.depth}</span>
            </div>
            <div className="flex justify-between">
              <span>PAGE AUTHORITY:</span>
              <span className="text-[#f1efe8]">{activeNodeInfo.authority}/100</span>
            </div>
            <div className="flex justify-between">
              <span>INCOMING LINKS:</span>
              <span className="text-[#f1efe8]">{activeNodeInfo.inlinks}</span>
            </div>
            <div className="flex justify-between">
              <span>OUTGOING LINKS:</span>
              <span className="text-[#f1efe8]">{activeNodeInfo.outlinks}</span>
            </div>
            <div className="flex justify-between">
              <span>CORE WEB VITALS:</span>
              <span className={activeNodeInfo.cwv === 'PASS' ? 'text-[#b7c8a8] font-bold' : 'text-[#c2695e] font-bold'}>{activeNodeInfo.cwv}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f1efe8]/10 pt-4 mt-6 text-[8px] text-[#f1efe8]/30 leading-relaxed uppercase">
          [PAGE FLOW: REPRESENTING INTRA-LINK PATHWAYS TRANSMITTING INTERNAL LINK EQUITY MATRIX]
        </div>
      </div>
    </div>
  );
}

function DonutModalContent() {
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  const breakdowns = [
    { label: "INDEXABLE", count: "18,394", pct: "34.8%", status: "Valid sitemap entries. Search engines can index normally.", urls: ["/", "/about", "/pricing", "/services", "/blog"] },
    { label: "NOINDEX HEADER", count: "6,372", pct: "12.1%", status: "HTTP header X-Robots-Tag contains noindex directive.", urls: ["/api/v1/auth", "/admin/login", "/checkout/callback", "/cart/clear"] },
    { label: "CANONICAL GAP", count: "9,112", pct: "17.2%", status: "Excluded due to duplicate cluster parameters.", urls: ["/catalog?sort=price", "/catalog?sort=rating", "/item?id=381&source=ad", "/home"] },
    { label: "ROBOTS BLOCKED", count: "19,846", pct: "35.9%", status: "Blocked by disallow patterns in /robots.txt.", urls: ["/checkout/payment", "/admin/dashboard", "/user/profile", "/temp/cache"] },
  ];

  const activeInfo = selectedSlice !== null ? breakdowns[selectedSlice] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full font-sans text-[#f1efe8]">
      {/* Visual Chart Panel */}
      <div className="border border-[#f1efe8]/12 p-6 flex flex-col items-center justify-center bg-black/30">
        <svg viewBox="0 0 200 200" className="w-40 h-40 -rotate-90 text-[#f1efe8] mb-6" aria-hidden="true">
          <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="22" opacity="0.06" />
          {[
            ['143 408', 0, 0.78, 0],
            ['50 408', -143, 0.5, 1],
            ['70 408', -193, 0.32, 2],
            ['145 408', -263, 0.18, 3],
          ].map(([dash, offset, opacity, sliceIndex]) => {
            const isHovered = selectedSlice === sliceIndex;
            return (
              <motion.circle
                key={sliceIndex}
                cx="100"
                cy="100"
                r="65"
                fill="none"
                stroke="currentColor"
                strokeWidth={isHovered ? 26 : 22}
                strokeDasharray={String(dash)}
                strokeDashoffset={Number(offset)}
                opacity={isHovered ? 1 : Number(opacity)}
                className="cursor-pointer transition-[stroke-width,opacity] duration-200"
                onClick={() => setSelectedSlice(Number(sliceIndex))}
              />
            );
          })}
        </svg>
        <div className="space-y-2 w-full">
          {breakdowns.map((item, idx) => (
            <div
              key={item.label}
              onClick={() => setSelectedSlice(idx)}
              className={`grid grid-cols-[1fr_auto_auto] gap-4 text-[9px] uppercase tracking-[0.2em] py-2 px-3 border border-transparent cursor-pointer transition-all duration-200 ${selectedSlice === idx ? 'border-[#f1efe8]/20 bg-white/[0.03] text-[#f1efe8]' : 'text-[#f1efe8]/50 hover:text-[#f1efe8]'}`}
            >
              <span>{item.label}</span>
              <span>{item.count}</span>
              <span>{item.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Details Panel */}
      <div className="border border-[#f1efe8]/12 p-6 bg-black/30 flex flex-col justify-between font-mono">
        {activeInfo ? (
          <div>
            <div className="text-[10px] text-[#f1efe8]/45 uppercase tracking-[0.3em] mb-4 border-b border-[#f1efe8]/12 pb-2">
              INDEXATION SEGMENT DETAILS
            </div>
            <div className="text-xs font-bold text-[#f1efe8] mb-2 uppercase tracking-[0.1em]">
              {activeInfo.label}
            </div>
            <div className="text-[11px] text-[#f1efe8]/72 leading-relaxed mb-6 font-sans normal-case">
              {activeInfo.status}
            </div>
            <div className="text-[9px] text-[#f1efe8]/70 uppercase tracking-[0.2em] mb-3">
              SAMPLE MATCHING URLS:
            </div>
            <div className="space-y-1.5">
              {activeInfo.urls.map(url => (
                <div key={url} className="text-[9.5px] text-[#f1efe8]/54 normal-case border-b border-[#f1efe8]/8 pb-1 font-mono">
                  {url}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-[#f1efe8]/32 text-[10px] uppercase tracking-[0.2em]">
            SELECT A SEGMENT SLICE OR LIST ITEM TO AUDIT SPECIFIC EXCLUSION LISTS.
          </div>
        )}

        <div className="border-t border-[#f1efe8]/10 pt-4 mt-6 text-[8px] text-[#f1efe8]/30 leading-relaxed uppercase">
          [TOTAL INDEXABLE RATIO: 34.8% OPTIMAL COVERAGE LEVEL REACHED]
        </div>
      </div>
    </div>
  );
}

function FindingsModalContent() {
  const [activeFinding, setActiveFinding] = useState<number>(0);

  const findings = [
    {
      title: "MISSING CANONICAL TAGS",
      severity: "HIGH IMPACT",
      pages: "312 PAGES EFFECTED",
      problem: "Pages load multiple parameter variations in duplicate slots without specifying search anchor indexes.",
      badCode: `<!-- index.html -->\n<html>\n<head>\n  <title>Blog Post Title</title>\n</head>\n<body>...`,
      goodCode: `<!-- index.html -->\n<html>\n<head>\n  <link rel="canonical" href="https://example.com/blog/title" />\n  <title>Blog Post Title</title>\n</head>\n<body>...`
    },
    {
      title: "REDIRECT CHAIN SEQUENCES",
      severity: "CRITICAL IMPACT",
      pages: "42 LOOPS REGISTERED",
      problem: "HTTP redirects bounce through intermediate protocols, generating high latency spikes for crawl bots.",
      badCode: `Request: GET /about -> HTTP 301 /about-us\nRequest: GET /about-us -> HTTP 301 /about-us/\nRequest: GET /about-us/ -> HTTP 200 OK`,
      goodCode: `Request: GET /about -> HTTP 301 /about-us/\nRequest: GET /about-us/ -> HTTP 200 OK`
    },
    {
      title: "SCHEMA DISCONNECTION",
      severity: "MEDIUM IMPACT",
      pages: "8 WARNING LOGS",
      problem: "Semantic schema graphs contain disconnected parent nodes, hindering AI semantic relation audits.",
      badCode: `<!-- JSON-LD snippet missing linking references -->\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "Void Agency"\n}`,
      goodCode: `<!-- Connected schema nodes via @id links -->\n{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "WebSite",\n      "@id": "https://example.com/#website",\n      "name": "Void Agency"\n    },\n    {\n      "@type": "Organization",\n      "@id": "https://example.com/#org",\n      "name": "Void Agency"\n    }\n  ]\n}`
    }
  ];

  const current = findings[activeFinding];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 h-full font-sans text-[#f1efe8]">
      {/* Category selector */}
      <div className="space-y-3 border-r border-[#f1efe8]/12 pr-4">
        {findings.map((item, idx) => (
          <div
            key={item.title}
            onClick={() => setActiveFinding(idx)}
            className={`cursor-pointer p-4 border transition-all duration-200 ${activeFinding === idx ? 'border-[#f1efe8] bg-white/5 text-[#f1efe8]' : 'border-[#f1efe8]/12 text-[#f1efe8]/58 hover:bg-white/[0.015] hover:text-[#f1efe8]'}`}
          >
            <div className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold mb-1.5">
              {item.title}
            </div>
            <div className="text-[8px] uppercase tracking-[0.15em] font-mono opacity-60">
              {item.severity}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison block */}
      <div className="flex flex-col justify-between h-full font-mono text-[9.5px]">
        <div>
          <div className="mb-4 text-[11px] font-bold text-[#f1efe8] uppercase tracking-[0.1em]">
            {current.title}
          </div>
          <p className="text-[#f1efe8]/72 font-sans normal-case mb-6 leading-relaxed max-w-2xl text-xs">
            {current.problem}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] uppercase text-[#c2695e] tracking-[0.2em] mb-2 font-bold">
                [ INCORRECT MARKUP ]
              </div>
              <pre className="bg-[#0f0f0f] border border-[#c2695e]/20 p-4 overflow-x-auto text-[8.5px] leading-relaxed text-[#f1efe8]/60 font-mono select-all">
                {current.badCode}
              </pre>
            </div>
            <div>
              <div className="text-[9px] uppercase text-[#b7c8a8] tracking-[0.2em] mb-2 font-bold">
                [ REMEDIATED MARKUP ]
              </div>
              <pre className="bg-[#0f0f0f] border border-[#b7c8a8]/20 p-4 overflow-x-auto text-[8.5px] leading-relaxed text-[#f1efe8] font-mono select-all">
                {current.goodCode}
              </pre>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f1efe8]/10 pt-4 mt-6 text-[8px] text-[#f1efe8]/30 uppercase">
          [COMPARED USING CRAWLER DIAGNOSTIC SOURCE HEADERS AND INLINE HTML DOM TARGETS]
        </div>
      </div>
    </div>
  );
}

function ExportsModalContent() {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV' | 'PARQUET'>('PDF');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const startExport = () => {
    setExporting(true);
    setProgress(0);
    setToastMessage(null);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setToastMessage(`SYSTEM EXPORT COMPLETED: ${selectedFormat} PACKAGE GENERATED SUCCESSFULLY`);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 5);
      });
    }, 100);
  };

  return (
    <div className="flex flex-col justify-between h-full font-mono text-[9.5px] text-[#f1efe8] tracking-[0.1em]">
      <div className="space-y-6 max-w-xl">
        <div>
          <div className="text-[10px] text-[#f1efe8]/45 uppercase tracking-[0.3em] mb-4 border-b border-[#f1efe8]/12 pb-2">
            EXPORT EXCLUSION CONTROLS
          </div>
          <p className="font-sans text-[#f1efe8]/66 normal-case text-xs leading-relaxed mb-6">
            Configure report parameters, database structures, and target layouts. Export evidence-backed technical SEO metrics.
          </p>
        </div>

        <div>
          <div className="text-[9px] uppercase text-[#f1efe8]/45 tracking-[0.2em] mb-3">
            SELECT DOWNLOAD FILE FORMAT:
          </div>
          <div className="flex gap-4">
            {(['PDF', 'CSV', 'PARQUET'] as const).map(fmt => (
              <button
                key={fmt}
                id={`exports-format-${fmt.toLowerCase()}`}
                onClick={() => setSelectedFormat(fmt)}
                className={`hover-target px-4 py-2 border transition-all duration-200 ${selectedFormat === fmt ? 'border-[#f1efe8] bg-[#f1efe8] text-[#080807] font-bold' : 'border-[#f1efe8]/15 text-[#f1efe8]/54 hover:border-[#f1efe8]/30 hover:text-[#f1efe8]'}`}
              >
                {fmt} REPORT
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-[#f1efe8]/60">
          <div className="text-[9px] uppercase text-[#f1efe8]/45 tracking-[0.2em] mb-3">
            MODULES INCLUDED IN PACKAGE:
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-[#f1efe8]/60" />
            <span>01. COMPLETE CRAWL SYSTEM GRAPH PATHS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-[#f1efe8]/60" />
            <span>02. SEVERITY RANKED ISSUE DIAGNOSTICS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-[#f1efe8]/60" />
            <span>03. CORE WEB VITALS TELEMETRY LOGS</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#f1efe8]/12">
        {exporting ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[9px] text-[#f1efe8]/80">
              <span>COMPILING EVIDENCE DATABASE MODULES...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-[#f1efe8]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {toastMessage && (
              <div className="p-3 bg-[#b7c8a8]/10 border border-[#b7c8a8]/30 text-[#b7c8a8] text-[9px]">
                {toastMessage}
              </div>
            )}
            <button
              id="exports-trigger-btn"
              onClick={startExport}
              className="hover-target w-full py-3 bg-[#f1efe8] text-[#080807] font-bold uppercase tracking-[0.3em] hover:bg-[#f1efe8]/90 hover:text-[#080807] transition-colors"
            >
              [ RUN SYSTEM EXPORT & DOWNLOAD ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AtlasPage() {
  useSEO(ATLAS_SEO);

  const prefersReducedMotion = useReducedMotion();
  const [activeModal, setActiveModal] = useState<'issues' | 'graph' | 'donut' | 'findings' | 'exports' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-canvas text-ink selection:bg-ink selection:text-canvas md:cursor-none">
      <ShutterWipe />
      <div className="bg-noise pointer-events-none" />
      <PageTechnicalChrome tone="light" />
      {!prefersReducedMotion && <div className="hidden md:block">
        <SmoothCursor />
      </div>}
      <ScrollProgress tone="dark" />

      <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
        <div className="grid items-start gap-5 border-b border-ink/12 bg-[#f1efe8]/82 pb-5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr]">
          <a href="/" id="atlas-brand-link" className="hover-target" data-cursor-text="HOME">
            <span className="block font-medium text-ink">SULAYMAN BOWLES</span>
            <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-ink/54">Technical SEO · AI Search · Finance/Data</span>
          </a>
          <nav className="flex flex-wrap items-center gap-3 md:justify-center md:gap-6">
            <NavLink href="/#selected-works" id="atlas-nav-work">WORK</NavLink>
            <NavLink href="/method" id="atlas-nav-method">METHOD</NavLink>
            <NavLink href="/about" id="atlas-nav-about">ABOUT</NavLink>
            <NavLink href="/#contact" id="atlas-nav-contact">CONTACT</NavLink>
          </nav>
          <a href="/#contact" id="atlas-header-contact" data-cursor-text="CONTACT" className="hover-target flex items-center gap-4 justify-self-start text-ink/75 transition-colors hover:text-ink md:justify-self-end">
            <span className="h-7 w-7 rounded-full border border-ink/28 flex-shrink-0" />
            <span>CONTACT</span>
          </a>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-screen w-full max-w-[1480px] grid-cols-1 gap-12 px-4 pb-16 pt-32 md:px-8 lg:grid-cols-12 xl:px-10 lg:pb-24 lg:pt-40">
        <ScrollReveal className="lg:col-span-4">
          <div className="mb-8 text-xs uppercase tracking-[0.36em] text-ink/48">( 02 )</div>
          <h1 
            style={{ viewTransitionName: 'atlas-title' } as CSSProperties}
            className="font-serif text-[clamp(4.6rem,10vw,10.75rem)] italic leading-[0.82] tracking-[-0.055em]"
          >
            <ScrambleText text="ATLAS" trigger="once" />
          </h1>
          <p className="mt-10 max-w-[25rem] font-serif text-[clamp(2rem,4vw,4.25rem)] italic leading-[0.92] tracking-[-0.025em]">
            <RevealText text="Crawl-based evidence engine for search." delay={0.25} />
          </p>
          <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ink/62">
            Atlas is a technical SEO audit system that crawls, interprets, and scores websites to surface what search engines see across architecture, indexation, performance, and AI-search readiness.
          </p>
          <dl className="mt-12 grid max-w-[30rem] grid-cols-[0.6fr_1fr] gap-x-8 gap-y-5 border-t border-ink/20 pt-6 text-[10px] uppercase tracking-[0.24em]">
            <dt className="text-ink/45">ROLE</dt>
            <dd>BUILDER / OPERATOR</dd>
            <dt className="text-ink/45">OUTPUT</dt>
            <dd>CRAWL DATA, ISSUE LOGIC, INSIGHTS, REPORTS</dd>
          </dl>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-8" delay={0.1} yOffset={18} blur={false}>
          <div className="group">
            <AtlasCrawlMap className="aspect-[1000/820] w-full transition-transform duration-700 group-hover:-translate-y-1" />
          </div>
          <div className="mt-4 flex items-center justify-between border-b border-ink/15 pb-4 text-[10px] uppercase tracking-[0.28em] text-ink/55">
            <span>SAMPLE DATASET: EXAMPLE.COM</span>
            <span>DEMO CRAWL VIEW: APR 18, 2024</span>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-y border-ink/12 px-4 py-16 md:px-8 lg:grid-cols-12 xl:px-10 xl:py-24">
        <ScrollReveal className="border-l border-ink/22 pl-6 lg:col-span-4">
          <blockquote className="max-w-[420px] font-serif text-[clamp(2rem,3.6vw,4.8rem)] italic leading-[0.95] tracking-[-0.025em]">
            I built Atlas to turn raw crawl data into structured, defensible evidence. Not just what's wrong - but why it matters.
          </blockquote>
        </ScrollReveal>
        <div className="grid gap-10 md:grid-cols-3 lg:col-span-8">
          {[
            ['BEYOND BASIC CRAWLS', 'Atlas goes deeper than surface reports. It interprets signals, correlates patterns, and prioritizes issues by impact on indexation and visibility.'],
            ['AI-SEARCH AWARE', 'Atlas evaluates content and structure for AI-search discoverability: entity clarity, source signals, freshness, and retrievability.'],
            ['BUILT FOR OPERATORS', 'Designed for SEO operators and technical teams who need reliable evidence, clear logic, and exportable outputs to drive decisions.'],
          ].map(([title, copy], index) => (
            <div key={title}>
              <ScrollReveal delay={index * 0.08} yOffset={18} blur={false}>
                <div className="mb-6 h-px w-10 bg-ink/35" />
                <h2 className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em]">{title}</h2>
                <p className="text-sm leading-relaxed text-ink/62">{copy}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal>
          <div className="border border-ink/18">
            <div className="flex items-center justify-between border-b border-ink/18 px-5 py-5 text-[10px] uppercase tracking-[0.32em]">
              <h2>THE ATLAS PROCESS</h2>
              <span className="text-ink/45">SYSTEM PATH</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((step) => (
                <div key={step.index} className="contents">
                  <AtlasProcessStep {...step} />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-ink px-4 py-16 text-canvas md:px-10 lg:px-14 lg:py-24">
        <div className="mx-auto max-w-[1480px]">
          <ScrollReveal className="mb-10 flex flex-col justify-between gap-5 border-b border-canvas/18 pb-6 md:flex-row md:items-end" blur={false}>
            <div>
              <div className="mb-5 h-px w-16 bg-canvas/45" />
              <h2 className="font-serif text-[clamp(3rem,7vw,8rem)] italic leading-none tracking-[-0.04em]">EVIDENCE &amp; OUTPUTS</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-canvas/55">
              Structured artifacts that make crawler observations reviewable, exportable, and defensible across technical teams.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <AtlasOutputCard title="ISSUE DETECTION" id="atlas-card-issues" copy="Prioritized technical issues with impact scoring." cta="VIEW ALL" onCtaClick={() => setActiveModal('issues')}>
              <MetricTable />
            </AtlasOutputCard>

            <AtlasOutputCard title="INTERNAL LINK GRAPH" id="atlas-card-graph" copy="Understand flow, depth, and orphan risk." cta="EXPLORE GRAPH" onCtaClick={() => setActiveModal('graph')}>
              <MiniGraph />
            </AtlasOutputCard>

            <AtlasOutputCard title="INDEXATION OVERVIEW" id="atlas-card-donut" copy="Crawlable vs. indexable at a glance." cta="VIEW BREAKDOWN" onCtaClick={() => setActiveModal('donut')}>
              <MiniDonut />
            </AtlasOutputCard>

            <AtlasOutputCard title="TECHNICAL FINDINGS" id="atlas-card-findings" copy="Examples with evidence and remediation." cta="VIEW DETAILS" onCtaClick={() => setActiveModal('findings')}>
              <div className="w-full border border-canvas/18 p-4">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.26em] text-canvas/82">Missing Canonical</h4>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-canvas/48">312 pages</p>
                  </div>
                  <span className="text-xl font-serif italic text-canvas/58">7.2</span>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-canvas/58">Multiple pages missing self-referencing canonicals.</p>
                <div className="space-y-2 border-t border-[#f1efe8]/12 pt-4 text-[10px] uppercase tracking-[0.15em] text-canvas/48">
                  <div>Affected URLs:</div>
                  <div>/blog/how-to-audit</div>
                  <div>/pricing/plans</div>
                  <div>/resources/seo-tools</div>
                </div>
              </div>
            </AtlasOutputCard>

            <AtlasOutputCard title="EXPORTS & DASHBOARDS" id="atlas-card-exports" copy="Shareable reports and operator dashboards." cta="OPEN DASHBOARD" onCtaClick={() => setActiveModal('exports')}>
              <ul className="w-full space-y-4 text-[11px] uppercase tracking-[0.18em] text-canvas/62">
                {['Executive Summary (PDF)', 'Technical Audit (PDF)', 'Issue Export (CSV)', 'Crawl Data (Parquet)', 'Looker Studio Dashboard'].map((item) => (
                  <li key={item} className="flex items-center justify-between border-b border-canvas/12 pb-3">
                    <span>{item}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-canvas/45" />
                  </li>
                ))}
              </ul>
            </AtlasOutputCard>
          </div>
        </div>
      </section>

      <section id="next-steps" className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-12 xl:px-10 xl:py-24">
        <ScrollReveal className="lg:col-span-4">
          <h2 className="max-w-[32rem] font-serif text-[clamp(3.5rem,8vw,9rem)] italic leading-[0.84] tracking-[-0.045em]">
            System intelligence you can act on.
          </h2>
          <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ink/62">
            Atlas turns complexity into clarity - so teams can fix what matters and prove the impact.
          </p>
          <a href="/#contact" aria-label="Contact Sulayman Bowles" data-cursor-text="CONTACT" className="hover-target mt-10 block h-12 w-12 rounded-full border border-ink/35 transition-colors hover:bg-ink hover:text-canvas" />
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-5" delay={0.1} blur={false}>
          <div className="border-y border-ink/16 py-6 text-[10px] uppercase tracking-[0.32em] text-ink/48">NEXT STEPS</div>
          <div className="grid gap-0 md:grid-cols-2">
            {[
              ['01', 'VIEW RELATED WORK', 'See other projects in SEO, finance, and data.'],
              ['02', 'WORK WITH ME', "Let's build systems that move the needle."],
            ].map(([index, title, copy]) => (
              <a key={title} href={index === '01' ? '/#selected-works' : '/#contact'} data-cursor-text={index === '01' ? 'WORK' : 'CONTACT'} className="hover-target group border-b border-ink/16 py-8 md:border-r md:pr-8 md:last:border-r-0 md:last:pl-8">
                <div className="mb-8 text-[10px] uppercase tracking-[0.28em] text-ink/42">{index}</div>
                <h3 className="mb-4 text-xs uppercase tracking-[0.3em]">{title}</h3>
                <p className="mb-7 text-sm leading-relaxed text-ink/62">{copy}</p>
                <span className="inline-block text-xs tracking-[0.28em] transition-transform group-hover:translate-x-1">-&gt;</span>
              </a>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-3" delay={0.16} blur={false}>
          <div className="border border-ink/18 p-5 text-[10px] uppercase tracking-[0.28em]">
            <div className="mb-10 flex items-center justify-between border-b border-ink/14 pb-5">
              <span className="text-ink/45">PROJECT</span>
              <span>02 / 06</span>
            </div>
            <a href="/#systems" data-cursor-text="PREV" className="hover-target mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">PREV</span>
              <span>01 / FINANCE</span>
              <span>UP</span>
            </a>
            <a href="/method" data-cursor-text="NEXT" className="hover-target grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">NEXT</span>
              <span>03 / VOID</span>
              <span>DOWN</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <footer className="mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-8 border-t border-ink/12 px-4 py-8 text-[10px] uppercase tracking-[0.3em] text-ink/54 md:grid-cols-[1fr_auto_1fr_auto] md:px-8 xl:px-10">
        <div>
          <div className="text-ink">SULAYMAN BOWLES</div>
          <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO · AI Search · Finance/Data</div>
        </div>
        <nav className="flex flex-wrap gap-5" id="atlas-footer-nav">
          <NavLink href="/#selected-works" id="atlas-footer-work">WORK</NavLink>
          <NavLink href="/method" id="atlas-footer-method">METHOD</NavLink>
          <NavLink href="/about" id="atlas-footer-about">ABOUT</NavLink>
          <NavLink href="/#contact" id="atlas-footer-contact">CONTACT</NavLink>
        </nav>
        <div className="md:text-right">
          © 2026 SULAYMAN BOWLES
          <br />
          ALL RIGHTS RESERVED
        </div>
        <a href="#top" id="atlas-back-to-top" aria-label="Back to top" data-cursor-text="TOP" className="hover-target h-9 w-9 rounded-full border border-ink/26 transition-colors hover:bg-ink hover:text-canvas" />
      </footer>

      {/* Interactive Console Modals */}
      <ConsoleModal 
        isOpen={activeModal === 'issues'} 
        onClose={() => setActiveModal(null)} 
        title="01 / PRIORITY ISSUE INSPECTOR"
      >
        <IssuesModalContent />
      </ConsoleModal>

      <ConsoleModal 
        isOpen={activeModal === 'graph'} 
        onClose={() => setActiveModal(null)} 
        title="02 / INTERNAL LINK GRAPH CONSOLE"
      >
        <GraphModalContent />
      </ConsoleModal>

      <ConsoleModal 
        isOpen={activeModal === 'donut'} 
        onClose={() => setActiveModal(null)} 
        title="03 / INDEXATION AUDIT CONSOLE"
      >
        <DonutModalContent />
      </ConsoleModal>

      <ConsoleModal 
        isOpen={activeModal === 'findings'} 
        onClose={() => setActiveModal(null)} 
        title="04 / CODE REMEDIATION WORKSPACE"
      >
        <FindingsModalContent />
      </ConsoleModal>

      <ConsoleModal 
        isOpen={activeModal === 'exports'} 
        onClose={() => setActiveModal(null)} 
        title="05 / DATABASE EXPORT CONTROLS"
      >
        <ExportsModalContent />
      </ConsoleModal>
    </main>
  );
}
