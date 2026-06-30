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
  const [selectedNode, setSelectedNode] = useState<string>('brand');

  const points = [
    { id: 'brand', label: 'Brand (Void Agency)', x: 116, y: 38, size: 12 },
    { id: 'founder', label: 'Founder (S. Bowles)', x: 180, y: 78, size: 8 },
    { id: 'service', label: 'Service (Technical SEO)', x: 48, y: 82, size: 8 },
    { id: 'citation', label: 'Citation (Research paper)', x: 160, y: 140, size: 8 },
    { id: 'publication', label: 'Publication (Atlas Tech)', x: 74, y: 138, size: 8 },
  ];

  const triples: Record<string, Array<{ p: string; o: string }>> = {
    brand: [
      { p: 'rdf:type', o: 'schema:Organization' },
      { p: 'schema:name', o: '"Void Agency"' },
      { p: 'schema:founder', o: 'https://sulayman-bowles.dev/#person' },
      { p: 'schema:url', o: '"https://void-agency.com"' }
    ],
    founder: [
      { p: 'rdf:type', o: 'schema:Person' },
      { p: 'schema:name', o: '"Sulayman Bowles"' },
      { p: 'schema:affiliation', o: 'https://sulayman-bowles.dev/#void-agency' },
      { p: 'schema:alumniOf', o: '"UT Austin (McCombs)"' }
    ],
    service: [
      { p: 'rdf:type', o: 'schema:Service' },
      { p: 'schema:name', o: '"Technical SEO Audit"' },
      { p: 'schema:provider', o: 'https://sulayman-bowles.dev/#void-agency' }
    ],
    citation: [
      { p: 'rdf:type', o: 'schema:ScholarlyArticle' },
      { p: 'schema:author', o: 'https://sulayman-bowles.dev/#person' },
      { p: 'schema:citation', o: '"https://void-agency.com/method"' }
    ],
    publication: [
      { p: 'rdf:type', o: 'schema:TechArticle' },
      { p: 'schema:publisher', o: 'https://sulayman-bowles.dev/#void-agency' },
      { p: 'schema:about', o: '"Crawl & Indexation Metrics"' }
    ]
  };

  const activeNodeId = hoveredNode || selectedNode;
  const activeTriples = triples[activeNodeId] || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4 items-center w-full">
      <div className="relative w-full">
        <svg viewBox="0 0 230 178" className="w-full h-auto aspect-[230/178] text-current" aria-hidden="true">
          <rect x="1" y="1" width="228" height="176" fill="none" stroke="currentColor" opacity="0.12" />
          <g stroke="currentColor" opacity="0.2">
            <path d="M116 38 L180 78 L160 140 L74 138 L48 82 Z" fill="none" />
            <path d="M116 38 L160 140 M116 38 L74 138 M180 78 L48 82" fill="none" />
          </g>
          {points.map((node) => {
            const isActive = activeNodeId === node.id;
            return (
              <g 
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node.id)}
              >
                <motion.circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.size} 
                  fill="currentColor" 
                  animate={{ 
                    scale: isActive ? 1.25 : 1, 
                    opacity: hoveredNode === null ? (node.id === selectedNode ? 0.9 : 0.42) : isActive ? 0.85 : 0.16 
                  }}
                />
                {isActive && (
                  <text x="115" y="170" fill="currentColor" fontSize="7.5" letterSpacing="1.2" textAnchor="middle" fontWeight="bold">
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="border border-current/10 bg-ink/[0.015] p-3 font-mono text-[8.5px] leading-relaxed self-stretch flex flex-col justify-between h-36 md:h-auto md:aspect-[178/178] overflow-y-auto">
        <div>
          <div className="text-[7.5px] opacity-40 mb-2">// RDF TRIPLES FOR {activeNodeId}</div>
          <div className="space-y-1.5 text-current/80">
            {activeTriples.map((t, idx) => (
              <div key={idx} className="border-b border-current/5 pb-1">
                <div className="text-current/40 text-[7px]">&lt;{activeNodeId}&gt;</div>
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">{t.p}</span>
                  <span className="opacity-60">&rarr;</span>
                  <span className="text-[#c2695e] select-all truncate max-w-[120px] md:max-w-[160px] lg:max-w-none">{t.o}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[7px] opacity-35 text-right mt-2 select-none">CLICK NODES TO LOCK</div>
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 text-[#080807] h-full font-sans">
      <div className="space-y-2 border-r border-[#080807]/12 pr-4">
        <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#080807]/40 mb-4">ENTITY NODES</h4>
        {Object.entries(nodesInfo).map(([id, val]) => (
          <button 
            key={id}
            onClick={() => setSelectedNode(id)}
            className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider font-mono border transition-all duration-200 cursor-pointer ${selectedNode === id ? 'bg-[#080807] text-[#f1efe8] border-[#080807]' : 'text-[#080807]/60 border-[#080807]/12 hover:text-[#080807]'}`}
          >
            {val.label}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="border border-[#080807]/12 p-4 bg-[#080807]/[0.01]">
          <h5 className="font-serif text-lg italic text-[#080807]/90 mb-2">{current.label} ({current.type})</h5>
          <div className="grid gap-2 text-[11px] uppercase tracking-widest text-[#080807]/50 mt-3">
            {Object.entries(current.attributes).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[#080807]/8 pb-1.5">
                <span>{k}</span>
                <span className="text-[#080807]/80 font-mono select-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-[8px] uppercase tracking-widest text-[#080807]/40 block mb-2">JSON-LD REPRESENTATION</span>
          <pre className="bg-[#080807]/[0.02] border border-[#080807]/10 p-4 font-mono text-[10px] text-[#3d5c2e] overflow-x-auto whitespace-pre-wrap select-all">
            {current.schema}
          </pre>
        </div>
      </div>
    </div>
  );
}

function AgentLogsModalContent() {
  const [activeAgentFilter, setActiveAgentFilter] = useState<string>('ALL');
  const [logs, setLogs] = useState<string[]>([
    '[12:20:01] GPTBot GET /robots.txt 200 ok',
    '[12:20:14] ClaudeBot GET /method 200 ok',
    '[12:20:25] PerplexityBot GET /index-sitemap.xml 200 ok',
    '[12:20:41] Google-Extended GET /atlas 200 ok',
    '[12:21:05] Cohere-ai GET /admin/ 403 forbidden',
  ]);

  const agents = [
    { id: 'GPTBot', name: 'GPTBot (OpenAI)', status: 'ALLOWED', crawlRate: '1.2 req/s', lastSeen: 'Just now', rule: 'Disallow: /admin/' },
    { id: 'ClaudeBot', name: 'ClaudeBot (Anthropic)', status: 'ALLOWED', crawlRate: '0.8 req/s', lastSeen: 'Just now', rule: 'Disallow: /checkout/' },
    { id: 'PerplexityBot', name: 'PerplexityBot', status: 'ALLOWED', crawlRate: '2.4 req/s', lastSeen: 'Just now', rule: 'Disallow: /private/' },
    { id: 'Google-Extended', name: 'Google-Extended', status: 'ALLOWED', crawlRate: '4.8 req/s', lastSeen: 'Just now', rule: 'Disallow: /temp/' },
    { id: 'Cohere-ai', name: 'Cohere-ai', status: 'BLOCKED', crawlRate: '0 req/s', lastSeen: '3 days ago', rule: 'Disallow: /' },
  ];

  useEffect(() => {
    const pages = ['/', '/method', '/atlas', '/about', '/resume', '/ai-information', '/markets'];
    const botIds = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];
    
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const randomBot = botIds[Math.floor(Math.random() * botIds.length)];
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      
      const newLog = `[${time}] ${randomBot} GET ${randomPage} 200 ok`;
      setLogs((prev) => [...prev.slice(-15), newLog]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (activeAgentFilter === 'ALL') return true;
    return log.includes(activeAgentFilter);
  });

  return (
    <div className="space-y-6 text-[#080807] font-sans">
      <div className="flex flex-wrap gap-2 border-b border-[#080807]/10 pb-4">
        <button 
          onClick={() => setActiveAgentFilter('ALL')}
          className={`border px-3 py-1.5 text-[8.5px] uppercase tracking-wider font-mono cursor-pointer transition-colors ${activeAgentFilter === 'ALL' ? 'border-[#b7c8a8] text-[#3d5c2e] bg-[#b7c8a8]/15 font-semibold' : 'border-[#080807]/12 text-[#080807]/50 hover:text-[#080807]'}`}
        >
          All Agents
        </button>
        {agents.slice(0, 4).map((ag) => (
          <button 
            key={ag.id}
            onClick={() => setActiveAgentFilter(ag.id)}
            className={`border px-3 py-1.5 text-[8.5px] uppercase tracking-wider font-mono cursor-pointer transition-colors ${activeAgentFilter === ag.id ? 'border-[#b7c8a8] text-[#3d5c2e] bg-[#b7c8a8]/15 font-semibold' : 'border-[#080807]/12 text-[#080807]/50 hover:text-[#080807]'}`}
          >
            {ag.id}
          </button>
        ))}
      </div>

      <div className="border border-[#080807]/12 overflow-x-auto">
        <table className="w-full border-collapse text-left text-[10px] uppercase tracking-[0.16em]">
          <thead>
            <tr className="border-b border-[#080807]/15 text-[#080807]/40">
              <th className="p-3">User Agent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Crawl Rate</th>
              <th className="p-3">Last Seen</th>
              <th className="p-3">Active Directive</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.name} className={`border-b border-[#080807]/10 last:border-0 hover:bg-[#080807]/[0.01] transition-colors ${activeAgentFilter !== 'ALL' && agent.id !== activeAgentFilter ? 'opacity-40' : ''}`}>
                <td className="p-3 font-bold">{agent.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 border text-[8px] font-mono leading-none ${agent.status === 'ALLOWED' ? 'text-[#3d5c2e] border-[#b7c8a8]/40 bg-[#b7c8a8]/15 font-semibold' : 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/8'}`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-3 font-mono">{agent.crawlRate}</td>
                <td className="p-3">{agent.lastSeen}</td>
                <td className="p-3 font-mono text-[#080807]/60">{agent.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#080807]/40 block">LIVE USER-AGENT TRAFFIC STREAM</span>
        <div className="bg-[#080807]/[0.02] border border-[#080807]/12 p-4 font-mono text-[9px] leading-relaxed text-[#3d5c2e] h-40 overflow-y-auto flex flex-col justify-end">
          <div className="overflow-y-auto space-y-1">
            {filteredLogs.map((log, index) => (
              <div key={index} className="opacity-90 select-all border-b border-[#080807]/6 pb-0.5">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RagSimulatorModalContent() {
  const [selectedText, setSelectedText] = useState<number>(0);
  const [activeQuery, setActiveQuery] = useState<string>('Who is the founder of Void Agency?');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);

  const texts = [
    {
      title: 'Founder Entity Outline',
      content: 'Sulayman Bowles is a McCombs student at UT Austin and the founder of Void Agency. He built the Atlas SEO Audit Console [1].',
      source: 'https://sulayman-bowles.dev/#person'
    },
    {
      title: 'Agency Service Outlines',
      content: 'Void Agency is an SEO and web systems agency focused on crawlability sitemaps, indexation audits, and LLM search optimization [2].',
      source: 'https://void-agency.com/method'
    },
    {
      title: 'Console Spec Sheet',
      content: 'Atlas is a technical SEO audit console written in Python and React. It logs crawl evidence, indexes schemas, and validates bots [3].',
      source: 'https://sulayman-bowles.dev/atlas'
    }
  ];

  const queries = [
    'Who is the founder of Void Agency?',
    'What features are built into Atlas SEO Console?',
    'What areas does Void Agency audit?'
  ];

  const handleSimulate = (q: string) => {
    setActiveQuery(q);
    setIsSimulating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const currentText = texts[selectedText];

  // Simulated Cosine Similarity Calculation
  const cosineSim = useMemo(() => {
    if (activeQuery === 'Who is the founder of Void Agency?') {
      return selectedText === 0 ? 0.925 : selectedText === 1 ? 0.412 : 0.184;
    }
    if (activeQuery === 'What features are built into Atlas SEO Console?') {
      return selectedText === 2 ? 0.884 : selectedText === 0 ? 0.521 : 0.231;
    }
    return selectedText === 1 ? 0.908 : selectedText === 2 ? 0.385 : 0.312;
  }, [activeQuery, selectedText]);

  return (
    <div className="space-y-5 text-[#080807] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        
        {/* Left Side: Select context & Query */}
        <div className="space-y-4">
          <div>
            <div className="text-[8.5px] uppercase tracking-widest text-[#080807]/40 mb-2 font-mono">1. Select Reference Document</div>
            <div className="space-y-2">
              {texts.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedText(idx)}
                  className={`w-full text-left p-2.5 border text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${selectedText === idx ? 'border-[#b7c8a8] text-[#3d5c2e] bg-[#b7c8a8]/15 font-bold' : 'border-[#080807]/12 text-[#080807]/50 hover:text-[#080807]'}`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[8.5px] uppercase tracking-widest text-[#080807]/40 mb-2 font-mono">2. Inject Search Query</div>
            <div className="space-y-2">
              {queries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulate(q)}
                  className={`w-full text-left p-2.5 border text-xs leading-tight transition-all cursor-pointer ${activeQuery === q ? 'border-[#b7c8a8] text-[#3d5c2e] bg-[#b7c8a8]/10 font-bold' : 'border-[#080807]/12 text-[#080807]/60 hover:text-[#080807]'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: RAG Telemetry Output */}
        <div className="border border-[#080807]/12 bg-[#080807]/[0.01] p-4 font-mono text-[9px] leading-relaxed flex flex-col justify-between self-stretch">
          <div className="space-y-4">
            <div className="text-[7.5px] opacity-40">// RAG CHUNKER & VECTOR COMPARATOR</div>

            {/* Chunk Box */}
            <div className="border border-[#080807]/8 p-3 space-y-2 bg-[#080807]/[0.015]">
              <div className="text-[7px] text-[#080807]/40">RAW CORPUS CHUNK:</div>
              <div className="text-[#080807]/80 text-[10px] leading-normal font-sans italic">
                "{currentText.content}"
              </div>
              <div className="text-[7.5px] text-[#080807]/30 border-t border-[#080807]/6 pt-1">
                URI SOURCE: {currentText.source}
              </div>
            </div>

            {/* Query Vector */}
            <div className="space-y-1 bg-[#080807]/[0.02] p-2.5 border border-[#080807]/6">
              <div className="flex justify-between text-[7px] text-[#080807]/40">
                <span>QUERY VECTOR</span>
                <span>MATCHING INDEX</span>
              </div>
              <div className="truncate text-[#3d5c2e] font-mono text-[8px]">
                [ 0.128, -0.412, 0.925, 0.048, -0.116, 0.772, 0.314, ... ]
              </div>
            </div>

            {/* Progress / Simulating status */}
            {isSimulating ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px]">
                  <span>COMPUTING COSINE SIMILARITY MATRIX...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-[#080807]/10 h-1">
                  <div className="bg-[#3d5c2e] h-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="border-t border-[#080807]/10 pt-3 space-y-2">
                <div className="flex justify-between border-b border-[#080807]/6 pb-1">
                  <span className="opacity-50">Similarity Score</span>
                  <span className={`font-bold ${cosineSim > 0.8 ? 'text-[#3d5c2e]' : cosineSim > 0.4 ? 'text-ink' : 'text-[#080807]/40'}`}>
                    {cosineSim.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#080807]/6 pb-1">
                  <span className="opacity-50">Retrieval Status</span>
                  <span className={cosineSim > 0.8 ? 'text-[#3d5c2e] font-bold' : 'text-[#c2695e] font-bold'}>
                    {cosineSim > 0.8 ? 'CITED [PASS]' : 'EXCLUDED [FAIL]'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[7.5px] text-[#080807]/30 tracking-widest text-right mt-4 select-none">// RAG_RETRIEVAL_SYS_OK //</div>
        </div>

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
          <div className="group relative border border-ink/12 p-4 md:p-8 bg-ink/[0.015]">
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
              <div key={step.title} className="text-ink bg-ink/[0.015]">
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
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-ink/60 leading-relaxed mb-4">A complete validation of the vectors and crawler hooks required to ensure search engine and LLM retrieval accuracy.</p>
          <div className="border border-[#080807]/12 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#3d5c2e]" />
              <span>Entity Resolution (Sulayman Bowles ↔ Void Agency) - RESOLVED</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#3d5c2e]" />
              <span>HTML Semantic Nesting Hierarchy (h1, h2, h3 validation) - OPTIMAL</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c2695e]" />
              <span>Authoritative Outbound Anchors - MISSING REF LINKS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#3d5c2e]" />
              <span>Structured Data Integration Validation - PASS</span>
            </div>
          </div>
        </div>
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'citations'} onClose={() => setActiveModal(null)} title="04 / RAG RETRIEVAL SIMULATOR">
        <RagSimulatorModalContent />
      </ConsoleModal>

      <ConsoleModal isOpen={activeModal === 'schema'} onClose={() => setActiveModal(null)} title="05 / SCHEMA VALIDATION">
        <div className="space-y-4 text-[#080807] font-sans">
          <p className="text-sm text-ink/60 leading-relaxed">Reviewing the base Person and Organisation graph structures.</p>
          <pre className="bg-[#080807]/[0.02] border border-[#080807]/10 p-4 font-mono text-[10px] text-[#3d5c2e] overflow-x-auto whitespace-pre-wrap select-all">
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
