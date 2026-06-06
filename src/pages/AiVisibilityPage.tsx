import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
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

const AI_VISIBILITY_SEO = getSeoRoute('/ai-visibility-benchmark')!;
const SERVICE_MODULE = getServiceModule('ai-visibility');

type ProcessStepProps = {
  index: string;
  title: string;
  copy: string;
  icon: 'agent' | 'entity' | 'syntax' | 'ref' | 'audit';
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
    title: 'AGENT AUDIT',
    icon: 'agent',
    copy: 'Inspect robots.txt directives and crawl access logs for LLM bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) to map visibility pathways.',
  },
  {
    index: '02',
    title: 'ENTITY MAPPING',
    icon: 'entity',
    copy: 'Define core corporate entities, founders, core offerings, and research topics to establish authoritative nodes in the search index.',
  },
  {
    index: '03',
    title: 'SYNTAX DESIGN',
    icon: 'syntax',
    copy: 'Optimize HTML layout hierarchy and answer-ready blocks to allow clean vector chunking and direct RAG parsing.',
  },
  {
    index: '04',
    title: 'REFERENCE LINKS',
    icon: 'ref',
    copy: 'Implement authoritative outbound links and citations to reputable industry nodes, verifying outbound entity context.',
  },
  {
    index: '05',
    title: 'ATTRIBUTION',
    icon: 'audit',
    copy: 'Inject verified Schema JSON-LD graphs linking author profiles, publications, and original research databases.',
  },
];

function ProcessIcon({ type, isHovered }: { type: ProcessStepProps['icon']; isHovered: boolean }) {
  const common = 'stroke-current fill-none';

  if (type === 'agent') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <rect className={common} x="16" y="20" width="40" height="32" rx="4" strokeWidth="1.2" />
        <circle className={common} cx="28" cy="36" r="3" strokeWidth="1.2" />
        <circle className={common} cx="44" cy="36" r="3" strokeWidth="1.2" />
        <motion.path 
          className={common} 
          d="M30 44 Q36 48 42 44" 
          strokeWidth="1.2" 
          animate={isHovered ? { pathLength: 1 } : { pathLength: 0.6 }}
        />
        <line className={common} x1="36" y1="12" x2="36" y2="20" strokeWidth="1.2" />
        <circle cx="36" cy="10" r="2" fill="currentColor" />
      </svg>
    );
  }

  if (type === 'entity') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <circle className={common} cx="36" cy="24" r="8" strokeWidth="1.2" />
        <path className={common} d="M20 52 C20 42 28 38 36 38 C44 38 52 42 52 52" strokeWidth="1.2" />
        <circle className={common} cx="36" cy="38" r="14" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (type === 'syntax') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <path className={common} d="M16 22 L28 36 L16 50" strokeWidth="1.2" />
        <motion.line 
          className={common} 
          x1="32" 
          y1="50" 
          x2="52" 
          y2="50" 
          strokeWidth="1.5" 
          animate={isHovered ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.8 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </svg>
    );
  }

  if (type === 'ref') {
    return (
      <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
        <circle className={common} cx="28" cy="44" r="8" strokeWidth="1.2" />
        <circle className={common} cx="44" cy="28" r="8" strokeWidth="1.2" />
        <motion.line 
          className={common} 
          x1="33.6" 
          y1="38.4" 
          x2="38.4" 
          y2="33.6" 
          strokeWidth="1.2" 
          animate={isHovered ? { strokeWidth: 2 } : { strokeWidth: 1.2 }}
        />
        <path className={common} d="M22 22 L24 24 M50 50 L48 48" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
      <path className={common} d="M18 16 H54 V56 H18 Z" strokeWidth="1.2" />
      <motion.path 
        className={common} 
        d="M26 26 L32 32 L46 18" 
        strokeWidth="1.5" 
        animate={isHovered ? { pathLength: 1 } : { pathLength: 0.8 }}
        transition={{ duration: 0.4 }}
      />
      <line className={common} x1="26" y1="40" x2="46" y2="40" strokeWidth="1.2" />
      <line className={common} x1="26" y1="48" x2="38" y2="48" strokeWidth="1.2" />
    </svg>
  );
}

function AIProcessStep({ index, title, copy, icon }: ProcessStepProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isFinalStep = index === processSteps[processSteps.length - 1]?.index;

  return (
    <motion.article
      className="group relative min-h-[320px] border-b border-[#f1efe8]/14 p-5 transition-[background-color,border-color] duration-500 hover:bg-[#f1efe8]/[0.025] md:border-r md:last:border-r-0 lg:border-b-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 flex items-start justify-between text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/42">
        <span>{index}</span>
        <span>{isFinalStep ? 'END' : '->'}</span>
      </div>
      <div className="mb-8 text-[#f1efe8]/55 transition-colors duration-500 group-hover:text-[#f1efe8]/86">
        <ProcessIcon type={icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-4 text-xs uppercase tracking-[0.34em] text-[#f1efe8]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#f1efe8]/62">{copy}</p>
    </motion.article>
  );
}

function AIOutputCard({ title, copy, cta, children, id, onCtaClick }: OutputCardProps) {
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

function InteractiveEntityVisual() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const points = [
    { id: 'brand', label: 'Brand (Void Agency)', x: 116, y: 38, size: 12 },
    { id: 'founder', label: 'Founder (S. Bowles)', x: 180, y: 78, size: 8 },
    { id: 'service', label: 'Service (Technical SEO)', x: 48, y: 82, size: 8 },
    { id: 'citation', label: 'Citation (Research paper)', x: 160, y: 140, size: 8 },
    { id: 'publication', label: 'Publication (Atlas Tech)', x: 74, y: 138, size: 8 },
  ];

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 230 178" className="h-44 w-full text-ink" aria-hidden="true">
        <rect x="1" y="1" width="228" height="176" fill="none" stroke="currentColor" opacity="0.12" />
        <g stroke="currentColor" opacity="0.2">
          <path d="M116 38 L180 78 L160 140 L74 138 L48 82 Z" fill="none" />
          <path d="M116 38 L160 140 M116 38 L74 138 M180 78 L48 82" fill="none" />
        </g>
        {points.map((node) => {
          const isHovered = hoveredNode === node.id;
          return (
            <g 
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size} 
                fill="currentColor" 
                animate={{ 
                  scale: isHovered ? 1.25 : 1, 
                  opacity: hoveredNode === null ? 0.42 : isHovered ? 0.85 : 0.16 
                }}
              />
              {isHovered && (
                <text x="115" y="170" fill="currentColor" fontSize="8" letterSpacing="1.2" textAnchor="middle">
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MiniBotLogs() {
  return (
    <div className="w-full font-mono text-[9px] text-ink/70 leading-relaxed border border-ink/15 p-3 h-32 overflow-hidden flex flex-col justify-end">
      <div className="opacity-40">[03:14:22] GPTBot GET /robots.txt 200</div>
      <div className="opacity-50">[03:14:23] PerplexityBot GET /method 200</div>
      <div className="opacity-70">[03:14:26] Google-Extended GET /atlas 200</div>
      <div className="text-ink font-bold animate-pulse">[03:14:29] ClaudeBot GET /about 200</div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 backdrop-blur-md p-4 md:p-8 xl:p-12 font-sans"
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
            className="relative flex h-full max-h-[640px] w-full max-w-[1100px] flex-col border border-[#f1efe8]/15 bg-[#080807] text-[#f1efe8]"
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[linear-gradient(to_right,rgba(241,239,232,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,239,232,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="absolute -left-2 -top-2 h-4 w-4 border-l border-t border-[#f1efe8]/30" />
            <div className="absolute -right-2 -top-2 h-4 w-4 border-r border-t border-[#f1efe8]/30" />
            <div className="absolute -left-2 -bottom-2 h-4 w-4 border-l border-b border-[#f1efe8]/30" />
            <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r border-b border-[#f1efe8]/30" />

            <div className="flex items-center justify-between border-b border-[#f1efe8]/12 px-6 py-4 font-mono text-[9px] uppercase tracking-[0.32em] z-10">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f1efe8]/80" />
                <span id="modal-title" className="font-bold">{title}</span>
              </div>
              <button 
                id="modal-close-btn"
                onClick={onClose} 
                className="hover-target text-[#f1efe8]/50 transition-colors hover:text-[#f1efe8] cursor-pointer"
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

function EntityModalContent() {
  const [selectedNode, setSelectedNode] = useState('brand');

  const nodesInfo: Record<string, { label: string; type: string; attributes: Record<string, string>; schema: string }> = {
    brand: {
      label: 'Void Agency',
      type: 'Organization',
      attributes: {
        '@id': 'https://sulayman-bowles.dev/#void-agency',
        name: 'Void Agency',
        url: 'https://void-agency.com',
      },
      schema: `{
  "@type": "Organization",
  "@id": "https://sulayman-bowles.dev/#void-agency",
  "name": "Void Agency",
  "url": "https://void-agency.com",
  "founder": {
    "@id": "https://sulayman-bowles.dev/#person"
  }
}`
    },
    founder: {
      label: 'Sulayman Bowles',
      type: 'Person',
      attributes: {
        '@id': 'https://sulayman-bowles.dev/#person',
        name: 'Sulayman Bowles',
        affiliation: 'Void Agency, UT Austin',
      },
      schema: `{
  "@type": "Person",
  "@id": "https://sulayman-bowles.dev/#person",
  "name": "Sulayman Bowles",
  "url": "https://sulayman-bowles.dev"
}`
    },
    service: {
      label: 'Technical SEO Audit',
      type: 'Service',
      attributes: {
        '@id': 'https://sulayman-bowles.dev/method#service',
        name: 'Technical SEO and AI Search Visibility Audit',
        provider: 'Void Agency',
      },
      schema: `{
  "@type": "Service",
  "@id": "https://sulayman-bowles.dev/method#service",
  "name": "Technical SEO Audit",
  "provider": {
    "@id": "https://sulayman-bowles.dev/#void-agency"
  }
}`
    }
  };

  const current = nodesInfo[selectedNode] || nodesInfo.brand;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 text-[#f1efe8] h-full font-sans">
      <div className="space-y-2 border-r border-[#f1efe8]/12 pr-4">
        <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#f1efe8]/40 mb-4">ENTITY NODES</h4>
        {Object.entries(nodesInfo).map(([id, val]) => (
          <button 
            key={id}
            onClick={() => setSelectedNode(id)}
            className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-mono border transition-all duration-200 cursor-pointer ${selectedNode === id ? 'bg-[#f1efe8] text-[#080807] border-[#f1efe8]' : 'text-[#f1efe8]/60 border-[#f1efe8]/12 hover:text-[#f1efe8]'}`}
          >
            {val.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-[#f1efe8]/12 p-4">
          <h5 className="font-serif text-lg italic text-[#f1efe8]/90 mb-2">{current.label} ({current.type})</h5>
          <div className="grid gap-2 text-[11px] uppercase tracking-widest text-[#f1efe8]/50 mt-3">
            {Object.entries(current.attributes).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#f1efe8]/8 pb-1.5">
                <span>{k}</span>
                <span className="text-[#f1efe8]/80 font-mono select-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-[8px] uppercase tracking-widest text-[#f1efe8]/40 block mb-2">JSON-LD REPRESENTATION</span>
          <pre className="bg-white/[0.02] border border-[#f1efe8]/10 p-4 font-mono text-[10px] text-[#b7c8a8] overflow-x-auto whitespace-pre-wrap select-all">
            {current.schema}
          </pre>
        </div>
      </div>
    </div>
  );
}

function AgentLogsModalContent() {
  const agents = [
    { name: 'GPTBot (OpenAI)', status: 'ALLOWED', crawlRate: '1.2 req/s', lastSeen: '2 min ago', rule: 'Disallow: /admin/' },
    { name: 'ClaudeBot (Anthropic)', status: 'ALLOWED', crawlRate: '0.8 req/s', lastSeen: '14 min ago', rule: 'Disallow: /checkout/' },
    { name: 'PerplexityBot', status: 'ALLOWED', crawlRate: '2.4 req/s', lastSeen: 'Just now', rule: 'Disallow: /private/' },
    { name: 'Google-Extended', status: 'ALLOWED', crawlRate: '4.8 req/s', lastSeen: '12 sec ago', rule: 'Disallow: /temp/' },
    { name: 'Cohere-ai', status: 'BLOCKED', crawlRate: '0 req/s', lastSeen: '3 days ago', rule: 'Disallow: /' },
  ];

  return (
    <div className="space-y-6 text-[#f1efe8] font-sans">
      <div className="border border-[#f1efe8]/12">
        <table className="w-full border-collapse text-left text-[10px] uppercase tracking-[0.16em]">
          <thead>
            <tr className="border-b border-[#f1efe8]/15 text-[#f1efe8]/40">
              <th className="p-3">User Agent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Crawl Rate</th>
              <th className="p-3">Last Seen</th>
              <th className="p-3">Active Directive</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.name} className="border-b border-[#f1efe8]/10 last:border-0 hover:bg-white/[0.01]">
                <td className="p-3 font-bold">{agent.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 border text-[8px] font-mono leading-none ${agent.status === 'ALLOWED' ? 'text-[#b7c8a8] border-[#b7c8a8]/30 bg-[#b7c8a8]/10' : 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/10'}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-3 font-mono">{agent.crawlRate}</td>
                <td className="p-3">{agent.lastSeen}</td>
                <td className="p-3 font-mono text-[#f1efe8]/60">{agent.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2">
        <span className="font-mono text-[8px] uppercase tracking-widest text-[#f1efe8]/40 block">DYNAMO ROBOTS.TXT PREVIEW</span>
        <pre className="bg-white/[0.02] border border-[#f1efe8]/10 p-4 font-mono text-[10px] text-[#f1efe8]/80">
{`# AI Crawlers Configuration
User-agent: GPTBot
Disallow: /admin/
Crawl-delay: 1

User-agent: ClaudeBot
Disallow: /checkout/

User-agent: PerplexityBot
Disallow: /private/

User-agent: Cohere-ai
Disallow: /`}
        </pre>
      </div>
    </div>
  );
}

export default function AiVisibilityPage() {
  useSEO(AI_VISIBILITY_SEO);
  const prefersReducedMotion = useReducedMotion();
  const [activeModal, setActiveModal] = useState<'entity' | 'agents' | 'readiness' | 'citations' | 'schema' | null>(null);

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
          <div className="mb-9 text-[10px] uppercase tracking-[0.36em] text-ink/48">VOID CASE STUDY ( 02 )</div>
          <h1 
            style={{ viewTransitionName: 'ai-visibility-title' } as CSSProperties}
            className="font-serif text-[clamp(4.2rem,10vw,10.2rem)] italic leading-[0.82] tracking-[-0.045em] text-ink"
          >
            <ScrambleText text="AI VISIBILITY" trigger="once" />
            <br />
            <ScrambleText text="BENCHMARK" trigger="once" />
          </h1>
          <p className="mt-12 max-w-xl text-sm font-medium uppercase leading-relaxed tracking-[0.24em] text-ink/82">
            <RevealText text="EVALUATING SITES FOR LLM DISCOVERY," delay={0.25} elementType="span" />
            <br />
            <RevealText text="RAG CITATIONS, AND GRAPH SEARCH." delay={0.4} elementType="span" />
          </p>
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-ink/60">
            AI search engines require sites to present unambiguous entities, clean DOM outlines, and verified authority credentials. This benchmark audits your retrieval footprint and enables citation readiness.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/14 pt-8 text-left uppercase tracking-widest text-ink/48">
            <div>
              <div className="text-[10px] opacity-60">LLM CITATION</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">+64%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">AGENT CRAWL</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">92%</div>
            </div>
            <div>
              <div className="text-[10px] opacity-60">SCHEMA NODES</div>
              <div className="mt-2 font-serif text-3xl italic text-ink font-light">100%</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group relative border border-ink/12 p-8 bg-ink/[0.015]">
            <InteractiveEntityVisual />
            <div className="mt-4 grid grid-cols-3 border-t border-ink/12 text-[9px] uppercase tracking-[0.22em] text-ink/46 pt-4">
              <span>ENTITY MAP</span>
              <span>SYNTAX OK</span>
              <span>SCHEMA PASS</span>
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
              AI models construct answer layers using entities they extract from web crawls. If your company details are fragmented, your products will remain uncited.
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ink/58">
              We audit site properties against active RAG patterns to verify indexation, content block formatting, crawl budgets, and entity declarations.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 border-y border-ink/12 md:grid-cols-2 xl:grid-cols-5 xl:border-y-0">
            {processSteps.map((step) => (
              <div key={step.title} className="text-[#f1efe8] bg-ink">
                <AIProcessStep {...step} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceModuleSnapshot module={SERVICE_MODULE} tone="light" />

      {/* Outputs & Evidence section */}
      <section className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-12">
          <div className="text-[10px] uppercase tracking-[0.34em] text-ink/42">EVIDENCE &amp; OUTPUTS</div>
          <h2 className="mt-6 font-serif text-[clamp(3rem,6vw,7rem)] italic leading-none tracking-[-0.04em]">BENCHMARK ARTIFACTS</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AIOutputCard 
            title="ENTITY GRAPH" 
            copy="Inspect relationship mapping of your core brand." 
            cta="INSPECT GRAPH" 
            onCtaClick={() => setActiveModal('entity')}
          >
            <InteractiveEntityVisual />
          </AIOutputCard>

          <AIOutputCard 
            title="BOT CRAWL LOGS" 
            copy="Monitor live user-agent response logs." 
            cta="VIEW AGENTS" 
            onCtaClick={() => setActiveModal('agents')}
          >
            <MiniBotLogs />
          </AIOutputCard>

          <AIOutputCard 
            title="RETRIEVAL CHECKLIST" 
            copy="Inspect key parameters for search engines." 
            cta="CHECK STATUS" 
            onCtaClick={() => setActiveModal('readiness')}
          >
            <div className="w-full space-y-3 text-[10px] uppercase tracking-[0.16em] text-ink/60">
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Entity Linking</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>DOM Outline</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
              <div className="flex justify-between border-b border-ink/12 pb-2">
                <span>Outbound Citation</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#c2695e]" />
              </div>
              <div className="flex justify-between">
                <span>Schema Validation</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]" />
              </div>
            </div>
          </AIOutputCard>

          <AIOutputCard 
            title="CITATION HOOKS" 
            copy="Verify markdown reference blocks." 
            cta="VIEW HOOKS" 
            onCtaClick={() => setActiveModal('citations')}
          >
            <div className="border border-ink/15 p-3 w-full font-mono text-[9px] text-ink/70 leading-relaxed bg-ink/[0.01]">
              <div className="font-bold text-ink">## Core Method</div>
              <div>Void Agency crawls indexes to establish crawl evidence [1].</div>
              <div className="border-t border-ink/10 mt-3 pt-1 text-[8px] opacity-50">
                [1] https://void-agency.com/method
              </div>
            </div>
          </AIOutputCard>

          <AIOutputCard 
            title="SCHEMA INTEGRATOR" 
            copy="Verify organization &amp; founder JSON-LD." 
            cta="VIEW SCHEMA" 
            onCtaClick={() => setActiveModal('schema')}
          >
            <div className="w-full border border-ink/15 p-3 text-[8.5px] font-mono text-[#c2695e] bg-ink/[0.01] overflow-hidden whitespace-pre">
{`{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sulayman Bowles",
  "affiliation": {
    "@type": "Organization",
    "name": "Void Agency"
  }
}`}
            </div>
          </AIOutputCard>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className="relative z-10 mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-12 xl:px-10 xl:py-24 border-t border-ink/12">
        <ScrollReveal className="lg:col-span-6">
          <h2 className="max-w-[32rem] font-serif text-[clamp(3.5rem,7vw,8rem)] italic leading-[0.84] tracking-[-0.045em]">
            Prepare your site for the next search era.
          </h2>
          <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ink/62">
            Get an in-depth audit of your brand’s citation footprint across all LLM systems.
          </p>
          <a href={getContactHref(SERVICE_MODULE.intent)} className="hover-target mt-10 inline-flex border-b border-ink/28 pb-2 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-ink/70" data-cursor-text="CONTACT">
            {SERVICE_MODULE.cta} -&gt;
          </a>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-6" delay={0.16} blur={false}>
          <div className="border border-ink/18 p-5 text-[10px] uppercase tracking-[0.28em]">
            <div className="mb-10 flex items-center justify-between border-b border-ink/14 pb-5">
              <span className="text-ink/45">CASE STUDY</span>
              <span>02 / 04</span>
            </div>
            <a href="/atlas" className="hover-target mb-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">PREV</span>
              <span>01 / INDEX AUDIT</span>
              <span>UP</span>
            </a>
            <a href="/product-discovery-system" className="hover-target grid grid-cols-[auto_1fr_auto] items-center gap-4 transition-opacity hover:opacity-70">
              <span className="text-ink/42">NEXT</span>
              <span>03 / PRODUCT SYSTEM</span>
              <span>DOWN</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      <InternalFooter activePath="/method" tone="light" />

      {/* Interactive Console Modals */}
      <ConsoleModal isOpen={activeModal === 'entity'} onClose={() => setActiveModal(null)} title="01 / ENTITY EXPLORER">
        <EntityModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'agents'} onClose={() => setActiveModal(null)} title="02 / CRAWL AGENT MANAGEMENT">
        <AgentLogsModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'readiness'} onClose={() => setActiveModal(null)} title="03 / RETRIEVAL QUALITY STATUS">
        <div className="space-y-4 text-[#f1efe8] font-sans">
          <p className="text-sm text-[#f1efe8]/60 leading-relaxed mb-4">A complete validation of the vectors and crawler hooks required to ensure search engine and LLM retrieval accuracy.</p>
          <div className="border border-[#f1efe8]/12 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#b7c8a8]" />
              <span>Entity Resolution (Sulayman Bowles ↔ Void Agency) - RESOLVED</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#b7c8a8]" />
              <span>HTML Semantic Nesting Hierarchy (h1, h2, h3 validation) - OPTIMAL</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c2695e]" />
              <span>Authoritative Outbound Anchors - MISSING REF LINKS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#b7c8a8]" />
              <span>Structured Data Integration Validation - PASS</span>
            </div>
          </div>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'citations'} onClose={() => setActiveModal(null)} title="04 / CITATION HOOK WRITER">
        <div className="space-y-4 text-[#f1efe8] font-sans">
          <p className="text-sm text-[#f1efe8]/60 leading-relaxed">Formatting content components for easy referencing by RAG engines.</p>
          <pre className="bg-white/[0.02] border border-[#f1efe8]/10 p-4 font-mono text-[10px] text-[#b7c8a8] overflow-x-auto whitespace-pre-wrap select-all">
{`# Content Structuring Best Practice
<h2>1. What is Void Agency's Technical SEO audit?</h2>
<p>
  Void Agency executes high-fidelity crawls to find structural issues in a website's code [1]. 
  The analysis covers indexation, sitemaps, internal links, and speed.
</p>
<p>
  [1] Void Agency Method: https://sulayman-bowles.dev/method
</p>`}
          </pre>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'schema'} onClose={() => setActiveModal(null)} title="05 / SCHEMA VALIDATION">
        <div className="space-y-4 text-[#f1efe8] font-sans">
          <p className="text-sm text-[#f1efe8]/60 leading-relaxed">Reviewing the base Person and Organisation graph structures.</p>
          <pre className="bg-white/[0.02] border border-[#f1efe8]/10 p-4 font-mono text-[10px] text-[#b7c8a8] overflow-x-auto whitespace-pre-wrap select-all">
{`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sulayman-bowles.dev/#person",
      "name": "Sulayman Bowles",
      "jobTitle": "Technical SEO Consultant"
    },
    {
      "@type": "Organization",
      "@id": "https://sulayman-bowles.dev/#void-agency",
      "name": "Void Agency",
      "founder": {
        "@id": "https://sulayman-bowles.dev/#person"
      }
    }
  ]
}`}
          </pre>
        </div>
      </ConsoleModal>
    </main>
  );
}
