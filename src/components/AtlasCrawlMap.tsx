import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type AtlasCrawlMapProps = {
  className?: string;
};

type ViewMode = 'orbital' | 'constellation' | 'tree';

const cx = 500;
const cy = 410;

function polar(angleDeg: number, radius: number) {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

interface PrimaryNode {
  label: string;
  size: number;
  orbital: { angle: number; radius: number };
  constellation: { x: number; y: number };
  tree: { x: number; y: number };
}

const primaryNodes: PrimaryNode[] = [
  { label: 'HTML', size: 12, orbital: { angle: 12, radius: 305 }, constellation: { x: 220, y: 220 }, tree: { x: 180, y: 410 } },
  { label: 'JS', size: 8, orbital: { angle: 42, radius: 245 }, constellation: { x: 420, y: 180 }, tree: { x: 620, y: 180 } },
  { label: 'CANON', size: 10, orbital: { angle: 76, radius: 290 }, constellation: { x: 300, y: 380 }, tree: { x: 620, y: 300 } },
  { label: 'ROBOTS', size: 7, orbital: { angle: 118, radius: 250 }, constellation: { x: 500, y: 360 }, tree: { x: 400, y: 250 } },
  { label: 'LINKS', size: 11, orbital: { angle: 164, radius: 330 }, constellation: { x: 700, y: 220 }, tree: { x: 620, y: 420 } },
  { label: 'SCHEMA', size: 8, orbital: { angle: 212, radius: 300 }, constellation: { x: 800, y: 420 }, tree: { x: 840, y: 300 } },
  { label: 'CWV', size: 10, orbital: { angle: 248, radius: 245 }, constellation: { x: 600, y: 580 }, tree: { x: 400, y: 570 } },
  { label: 'ENTITY', size: 9, orbital: { angle: 302, radius: 285 }, constellation: { x: 850, y: 600 }, tree: { x: 840, y: 520 } },
];

interface SecondaryNode {
  index: number;
  angle: number;
  radius: number;
  size: number;
  depth: number;
  parentId: string;
}

const secondaryNodes: SecondaryNode[] = Array.from({ length: 148 }, (_, i) => {
  const angle = (i * 137.5) % 360;
  const radius = 75 + ((i * 47) % 295);
  const size = 1.2 + ((i * 7) % 4) * 0.45;
  const depth = 1 + (i % 6);
  const parentNode = primaryNodes[i % primaryNodes.length];
  return { index: i, angle, radius, size, depth, parentId: parentNode.label };
});

const crossLinks = [
  [12, 42],
  [42, 76],
  [76, 118],
  [118, 164],
  [164, 212],
  [212, 248],
  [248, 302],
  [302, 12],
  [12, 118],
  [164, 248],
  [42, 212],
  [76, 302],
];

const nodeStats: Record<string, { value: string; desc1: string; desc2: string }> = {
  HTML: { value: "18,394 INDEXABLE URLS", desc1: "0 critical format syntax errors.", desc2: "Crawl rate: Adaptive 12 req/sec." },
  JS: { value: "4,204 PAGES RENDERED", desc1: "JavaScript bundle size audit complete.", desc2: "Avg script execution: 1.4 seconds." },
  CANON: { value: "7.2% ISSUES DETECTED", desc1: "312 URLs missing self-references.", desc2: "8 canonical chains resolved." },
  ROBOTS: { value: "9,112 URLS EXCLUDED", desc1: "Blocked by robots.txt directive match.", desc2: "0 duplicate search budget loss." },
  LINKS: { value: "204,892 PATHS MAPPED", desc1: "Max crawl depth: 6 hops.", desc2: "Orphan risk threshold: 17.4% low." },
  SCHEMA: { value: "98.4% GRAPH VALIDITY", desc1: "JSON-LD schema nodes verified.", desc2: "3 semantic entity warning logs." },
  CWV: { value: "84% PERFORMANCE PASS", desc1: "Largest Contentful Paint avg: 1.8s.", desc2: "Interaction to Next Paint: 110ms." },
  ENTITY: { value: "4,821 SEMANTIC NODES", desc1: "Entity graph vectors resolved.", desc2: "Citations linked to Wikipedia entities." }
};

const mockLogTemplates = [
  "CRAWL: GET {url} [200 OK] {ms}ms",
  "HTML PARSER: Discovered {count} links on {url}",
  "JS RENDERER: Compiled bundles on {url} in {ms}ms",
  "VALIDATOR: Verified JSON-LD schema graph on {url}",
  "PERFORMANCE: LCP score {lcp}s measured on {url}",
  "ROBOTS: Blocked crawl match on {url} via Robots.txt",
  "CANONICAL: Resolved self-referencing link on {url}",
];

const mockUrls = [
  "/",
  "/blog/seo-systems",
  "/about",
  "/atlas/dashboard",
  "/pricing",
  "/services/ai-integration",
  "/resources/crawl-budget",
  "/blog/hreflang-audit",
  "/case-study/chegg-strategy",
  "/contact"
];

export function AtlasCrawlMap({ className = '' }: AtlasCrawlMapProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('orbital');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING CRAWL LOGS...",
    "CONNECTING TO DOMAIN ENGINE...",
    "RESOLVED TARGET IP: 104.21.36.192"
  ]);

  // Live log simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const template = mockLogTemplates[Math.floor(Math.random() * mockLogTemplates.length)];
      const url = mockUrls[Math.floor(Math.random() * mockUrls.length)];
      const ms = Math.floor(120 + Math.random() * 380);
      const count = Math.floor(12 + Math.random() * 45);
      const lcp = (1.1 + Math.random() * 1.5).toFixed(2);
      
      const log = template
        .replace("{url}", url)
        .replace("{ms}", String(ms))
        .replace("{count}", String(count))
        .replace("{lcp}", lcp);
        
      setLogs((prev) => [log, ...prev].slice(0, 5));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (node: PrimaryNode) => {
    if (viewMode === 'orbital') {
      const angleRad = (node.orbital.angle * Math.PI) / 180;
      return {
        x: cx + Math.cos(angleRad) * node.orbital.radius,
        y: cy + Math.sin(angleRad) * node.orbital.radius
      };
    } else if (viewMode === 'constellation') {
      return node.constellation;
    } else {
      return node.tree;
    }
  };

  const getSecondaryPosition = (sec: SecondaryNode) => {
    const parent = primaryNodes.find(n => n.label === sec.parentId)!;
    const parentPos = getNodePosition(parent);
    
    if (viewMode === 'orbital') {
      const angleRad = (sec.angle * Math.PI) / 180;
      return {
        x: cx + Math.cos(angleRad) * sec.radius,
        y: cy + Math.sin(angleRad) * sec.radius
      };
    } else if (viewMode === 'constellation') {
      const angleRad = (sec.angle * Math.PI) / 180;
      const distance = 25 + (sec.index % 25);
      return {
        x: parentPos.x + Math.cos(angleRad) * distance,
        y: parentPos.y + Math.sin(angleRad) * distance
      };
    } else {
      const offset = 22 + (sec.index % 10) * 10;
      const verticalDeviation = ((sec.index % 5) - 2) * 4;
      return {
        x: parentPos.x + offset,
        y: parentPos.y + verticalDeviation
      };
    }
  };

  const isLinkActive = (fromAngle: number, toAngle: number) => {
    if (!hoveredNode) return false;
    const hoverItem = primaryNodes.find(n => n.label === hoveredNode);
    if (!hoverItem) return false;
    return hoverItem.orbital.angle === fromAngle || hoverItem.orbital.angle === toAngle;
  };

  const getLinkPath = (a: { x: number; y: number }, b: { x: number; y: number }, fromAngle: number, toAngle: number) => {
    if (viewMode === 'orbital') {
      return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
    } else if (viewMode === 'constellation') {
      return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    } else {
      // Orthogonal step line for tree
      const midX = (a.x + b.x) / 2;
      return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    }
  };

  return (
    <div className={`relative overflow-hidden border border-canvas/25 bg-ink p-4 flex flex-col ${className}`}>
      {/* Top View Mode Selectors */}
      <div className="flex items-center justify-between border-b border-canvas/14 pb-3 mb-4 text-[9px] uppercase tracking-[0.25em] z-10">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8] animate-pulse" />
          <span className="text-canvas/50">ENGINE SCAN MODE:</span>
        </div>
        <div className="flex gap-4">
          {(['orbital', 'constellation', 'tree'] as ViewMode[]).map((mode, idx) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`hover-target transition-colors py-1 relative ${viewMode === mode ? 'text-white' : 'text-canvas/42 hover:text-canvas/82'}`}
            >
              [{String(idx + 1).padStart(2, '0')}. {mode}]
              {viewMode === mode && (
                <motion.div 
                  layoutId="activeModeUnderline" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f1efe8]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 min-h-[500px]">
        <svg viewBox="0 0 1000 820" className="absolute inset-0 h-full w-full" role="img" aria-label="Atlas crawl map for example.com">
          <rect width="1000" height="820" fill="#080807" />
          <defs>
            <pattern id="atlas-map-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(241,239,232,0.055)" strokeWidth="1" />
            </pattern>
            <radialGradient id="atlas-node-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f1efe8" stopOpacity="1" />
              <stop offset="45%" stopColor="#f1efe8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#080807" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          <rect width="1000" height="820" fill="url(#atlas-map-grid)" />
          <rect x="28" y="28" width="944" height="764" fill="none" stroke="rgba(241,239,232,0.22)" strokeWidth="1" />

          <g stroke="rgba(241,239,232,0.42)" strokeWidth="2" fill="none">
            <path d="M28 86 V28 H86" />
            <path d="M914 28 H972 V86" />
            <path d="M972 734 V792 H914" />
            <path d="M86 792 H28 V734" />
          </g>

          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background elements specific to Orbital View */}
            {viewMode === 'orbital' && (
              <>
                {[86, 154, 228, 304, 372].map((radius) => (
                  <circle
                    key={radius}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke="rgba(241,239,232,0.12)"
                    strokeWidth="1"
                    strokeDasharray={radius % 2 === 0 ? '5 12' : '2 10'}
                  />
                ))}

                <line x1="120" y1={cy} x2="880" y2={cy} stroke="rgba(241,239,232,0.12)" />
                <line x1={cx} y1="88" x2={cx} y2="730" stroke="rgba(241,239,232,0.12)" />
                
                <circle
                  cx={cx}
                  cy={cy}
                  r="304"
                  fill="none"
                  stroke="rgba(241,239,232,0.26)"
                  strokeWidth="1"
                  strokeDasharray="1 18"
                  opacity="0.24"
                />

                {/* Sweeping radar scanning beam */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="304"
                  fill="none"
                  stroke="rgba(241,239,232,0.035)"
                  strokeWidth="18"
                  strokeDasharray="120 740"
                />

                {/* Polar scale angle ticks */}
                {Array.from({ length: 36 }, (_, i) => {
                  const angle = i * 10;
                  const isMajor = i % 9 === 0;
                  const start = polar(angle, 304);
                  const end = polar(angle, isMajor ? 314 : 308);
                  return (
                    <line
                      key={`tick-${i}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="rgba(241,239,232,0.22)"
                      strokeWidth={isMajor ? 1.2 : 0.6}
                    />
                  );
                })}

                {/* Compass direction indicators */}
                <g opacity="0.48" fill="rgba(241,239,232,0.5)" fontFamily="Inter, sans-serif" fontSize="7.5" letterSpacing="1.4" fontWeight="bold">
                  <text x={cx} y={cy - 318} textAnchor="middle">N 000°</text>
                  <text x={cx + 326} y={cy + 3} textAnchor="start">E 090°</text>
                  <text x={cx} y={cy + 328} textAnchor="middle">S 180°</text>
                  <text x={cx - 326} y={cy + 3} textAnchor="end">W 270°</text>
                </g>
              </>
            )}

            {/* Tree column guide lines in Hierarchical mode */}
            {viewMode === 'tree' && (
              <g stroke="rgba(241,239,232,0.04)" strokeWidth="1" strokeDasharray="3 6">
                <line x1="180" y1="80" x2="180" y2="740" />
                <line x1="400" y1="80" x2="400" y2="740" />
                <line x1="620" y1="80" x2="620" y2="740" />
                <line x1="840" y1="80" x2="840" y2="740" />
              </g>
            )}

            {/* Cross Links between Primary Nodes with Morphing Coordinates */}
            {crossLinks.map(([fromAngle, toAngle], index) => {
              const from = primaryNodes.find((node) => node.orbital.angle === fromAngle)!;
              const to = primaryNodes.find((node) => node.orbital.angle === toAngle)!;
              const a = getNodePosition(from);
              const b = getNodePosition(to);
              const active = isLinkActive(fromAngle, toAngle);
              
              return (
                <motion.path
                  key={`link-${index}`}
                  d={getLinkPath(a, b, fromAngle, toAngle)}
                  fill="none"
                  animate={{ 
                    stroke: active ? "#f1efe8" : "rgba(241,239,232,0.08)",
                    strokeWidth: active ? 1.8 : 0.8
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                />
              );
            })}

            {/* Secondary Nodes (discovered URLs) that morph layout */}
            {secondaryNodes.map((node, index) => {
              const pos = getSecondaryPosition(node);
              const opacity = 0.24 + (node.depth % 4) * 0.09;
              return (
                <circle
                  key={`sec-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={node.size}
                  fill="#f1efe8"
                  fillOpacity={opacity}
                />
              );
            })}

            {/* Primary Nodes (clickable/hoverable layers) */}
            {primaryNodes.map((node) => {
              const pos = getNodePosition(node);
              const isHovered = hoveredNode === node.label;
              return (
                <g 
                  key={`primary-${node.label}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.label)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <line
                    x1={viewMode === 'orbital' ? cx : pos.x}
                    y1={viewMode === 'orbital' ? cy : pos.y}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isHovered ? "rgba(241,239,232,0.48)" : "rgba(241,239,232,0.12)"}
                    strokeWidth={isHovered ? 1.5 : 1}
                  />
                  
                  {/* Node outer outline */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={node.size + (isHovered ? 12 : 10)}
                    fill="none"
                    stroke={isHovered ? "#f1efe8" : "rgba(241,239,232,0.16)"}
                  />

                  {/* Pulse ring on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={node.size + 14}
                        fill="none"
                        stroke="#f1efe8"
                        opacity="0.48"
                      />
                    )}
                  </AnimatePresence>

                  {/* Node core fill */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? node.size * 1.25 : node.size}
                    fill={isHovered ? "#f1efe8" : "rgba(241,239,232,0.68)"}
                    stroke={isHovered ? "#FFFFFF" : "rgba(241,239,232,0.92)"}
                  />

                  {/* Node label text */}
                  <text
                    x={pos.x}
                    y={pos.y - 22}
                    fill={isHovered ? "#FFFFFF" : "rgba(241,239,232,0.52)"}
                    fontFamily="Inter, sans-serif"
                    fontSize="9.5"
                    letterSpacing="2"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Central Map Dial specific to orbital scan */}
            {viewMode === 'orbital' && (
              <>
                <circle cx={cx} cy={cy} r="58" fill="#080807" stroke="rgba(241,239,232,0.34)" strokeWidth="1" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="47"
                  fill="none"
                  stroke="rgba(241,239,232,0.22)"
                  strokeWidth="1"
                  strokeDasharray="4 12"
                />
                <circle cx={cx} cy={cy} r="36" fill="url(#atlas-node-core)" stroke="#f1efe8" strokeWidth="1.4" />
                <circle cx={cx} cy={cy} r="8" fill="#080807" stroke="#f1efe8" strokeWidth="1" />
                <path d="M468 410 H532 M500 378 V442" stroke="#080807" strokeWidth="1.2" />
              </>
            )}
          </motion.g>
        </svg>

        {/* Floating details overlay on top-left */}
        <div className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.25em] text-canvas/50 pointer-events-none select-none">
          <div className="text-canvas text-xs tracking-[0.2em] mb-1 font-sans font-bold">CRAWL RADAR SCAN</div>
          <div>TARGET: example.com</div>
          <div>URLS INDEXED: 52,846</div>
          <div>CRAWL DEPTH LIMIT: 6</div>
        </div>

        {/* Dynamic Detail Card in top-right */}
        <div className="absolute right-6 top-6 w-72 bg-black/82 border border-canvas/14 p-4 font-mono pointer-events-none select-none z-10">
          <div className="text-[9px] uppercase tracking-[0.25em] text-canvas/42 mb-3 border-b border-canvas/12 pb-1.5">
            {hoveredNode ? `${hoveredNode} LAYER STATUS` : "NODE INSPECTOR"}
          </div>
          {hoveredNode ? (
            <div className="space-y-1">
              <div className="text-xs font-bold text-white tracking-[0.05em] mb-1.5">
                {nodeStats[hoveredNode].value}
              </div>
              <div className="text-[9px] text-canvas/66 leading-relaxed">
                {nodeStats[hoveredNode].desc1}
              </div>
              <div className="text-[9px] text-canvas/66 leading-relaxed">
                {nodeStats[hoveredNode].desc2}
              </div>
            </div>
          ) : (
            <div className="text-[9.5px] text-canvas/32 leading-relaxed">
              HOVER NODE TO ENGAGE LOG ANALYSES AND READ TELEMETRY STATISTICS.
            </div>
          )}
        </div>

        {/* Diagnostics Log Console on bottom-left */}
        <div className="absolute left-6 bottom-6 w-80 bg-black/82 border border-canvas/14 p-4 font-mono z-10">
          <div className="text-[9px] uppercase tracking-[0.25em] text-canvas/42 mb-2 border-b border-canvas/12 pb-1.5 flex items-center justify-between">
            <span>LIVE TELEMETRY STREAM</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8] animate-ping" />
          </div>
          <div className="space-y-1.5 min-h-[90px] flex flex-col justify-end text-[8.5px] text-canvas/68">
            {logs.map((log, index) => (
              <div key={index} className="truncate select-none font-mono">
                <span className="text-[#f1efe8]/80 mr-1.5">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>

        {/* Signal Table on bottom-right */}
        <div className="absolute right-6 bottom-6 w-60 bg-black/82 border border-canvas/14 p-4 font-mono z-10">
          <div className="text-[9px] uppercase tracking-[0.25em] text-canvas/42 mb-3 border-b border-canvas/12 pb-1.5">
            SIGNAL MATRIX
          </div>
          <div className="space-y-2 text-[9px] text-canvas/62">
            {[
              ['INDEXABLE RATIO', '34.8%'],
              ['ORPHAN RATE', '17.4%'],
              ['CANONICAL GAPS', '7.2'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span>{label}</span>
                <span className="text-white font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AtlasCrawlMap;
