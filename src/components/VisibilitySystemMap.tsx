import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type VisibilitySystemMapProps = {
  className?: string;
};

const messySignals = Array.from({ length: 54 }, (_, index) => {
  const x = 76 + ((index * 37) % 205);
  const y = 140 + ((index * 61) % 330);
  const size = 2 + (index % 5);
  const square = index % 6 === 0;
  return { x, y, size, square };
});

const evidenceRows = Array.from({ length: 16 }, (_, index) => ({
  y: 118 + index * 26,
  width: 46 + ((index * 31) % 100),
}));

const retrievalPoints = Array.from({ length: 34 }, (_, index) => {
  const angle = (index * 47) % 360;
  const radius = 48 + ((index * 29) % 92);
  const theta = (angle * Math.PI) / 180;
  return {
    x: 505 + Math.cos(theta) * radius,
    y: 330 + Math.sin(theta) * radius,
  };
});

const visibilityDots = Array.from({ length: 108 }, (_, index) => ({
  x: 655 + (index % 12) * 18,
  y: 188 + Math.floor(index / 12) * 22,
  opacity: 0.12 + (index % 7) * 0.055,
}));

const clarityRays = Array.from({ length: 9 }, (_, index) => {
  const y = 198 + index * 34;
  return {
    fromX: 814,
    fromY: y,
    controlX: 870,
    controlY: y - 28 + (index % 3) * 18,
    toX: 918,
    toY: 252 + index * 13,
  };
});

const topLabels = [
  { lines: ['MESSY WEB', 'SIGNALS'], x: 58 },
  { lines: ['STRUCTURED', 'CRAWL EVIDENCE'], x: 252 },
  { lines: ['RETRIEVAL', 'LAYER'], x: 462 },
  { lines: ['SEARCH', 'VISIBILITY'], x: 658 },
  { lines: ['BUSINESS', 'CLARITY'], x: 846 },
];

const colDescriptions = [
  {
    title: "MESSY WEB SIGNALS",
    desc: "Raw unstructured inputs from crawlers, JS rendering, redirects, response codes, and sitemaps."
  },
  {
    title: "STRUCTURED CRAWL EVIDENCE",
    desc: "Normalized crawl tables in SQLite databases. Validating canonicals, robots.txt directives, and link flows."
  },
  {
    title: "RETRIEVAL LAYER",
    desc: "Analyzing indexing probability, schema, context relevance, and source retrieval signals."
  },
  {
    title: "SEARCH VISIBILITY",
    desc: "Aligning search signals and technical health so content is crawlable, indexed, and easy to reference."
  },
  {
    title: "BUSINESS CLARITY",
    desc: "Translating crawl diagnostics and indexing data into prioritized backlogs, conversions, and growth."
  }
];

export default function VisibilitySystemMap({ className = '' }: VisibilitySystemMapProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <div className={`relative overflow-hidden border border-canvas/15 bg-ink ${className}`}>
      <svg viewBox="0 0 1000 620" className="h-full w-full" role="img" aria-label="Visibility system map showing messy web signals transformed into business clarity">
        <defs>
          <pattern id="visibility-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0 H0 V32" fill="none" stroke="rgba(241,239,232,0.045)" />
          </pattern>
          <filter id="visibility-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="visibility-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f1efe8" stopOpacity="0.88" />
            <stop offset="38%" stopColor="#f1efe8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#080807" stopOpacity="0.12" />
          </radialGradient>
        </defs>

        <rect width="1000" height="620" fill="#080807" />
        <rect width="1000" height="620" fill="url(#visibility-grid)" />
        
        {/* Highlighted active column backdrop glow */}
        <AnimatePresence>
          {hoveredCol !== null && (
            <motion.rect
              key={hoveredCol}
              x={hoveredCol === 0 ? 24 : hoveredCol === 1 ? 190 : hoveredCol === 2 ? 410 : hoveredCol === 3 ? 630 : 810}
              y="24"
              width={hoveredCol === 0 ? 166 : hoveredCol === 1 ? 220 : hoveredCol === 2 ? 220 : hoveredCol === 3 ? 180 : 166}
              height="496"
              fill="rgba(241, 241, 239, 0.015)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>

        <rect x="24" y="24" width="952" height="572" fill="none" stroke="rgba(241,239,232,0.15)" />

        <g stroke="rgba(241,239,232,0.3)" strokeWidth="1.2" fill="none">
          <path d="M24 84 V24 H84" />
          <path d="M916 24 H976 V84" />
          <path d="M976 536 V596 H916" />
          <path d="M84 596 H24 V536" />
        </g>

        {/* Labels Group */}
        <g fontFamily="Inter, sans-serif" fontSize="7.5" letterSpacing="1.8" fill="rgba(241,239,232,0.55)">
          {topLabels.map(({ lines, x }, idx) => (
            <motion.g 
              key={lines.join('-')} 
              transform={`translate(${x} 58)`}
              animate={{ 
                opacity: hoveredCol === null || hoveredCol === idx ? 1 : 0.26,
                fill: hoveredCol === idx ? "#f1efe8" : "rgba(241,239,232,0.55)"
              }}
              transition={{ duration: 0.25 }}
            >
              {lines.map((line, index) => (
                <text key={line} y={index * 13}>{line}</text>
              ))}
            </motion.g>
          ))}
        </g>

        {/* MESSY SIGNALS: Column 0 */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 0 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {messySignals.map((point, index) => (
            <g key={index}>
              {point.square ? (
                <rect x={point.x - point.size / 2} y={point.y - point.size / 2} width={point.size} height={point.size} fill="none" stroke="rgba(241,239,232,0.32)" />
              ) : (
                <circle cx={point.x} cy={point.y} r={point.size / 2} fill="rgba(241,239,232,0.38)" />
              )}
              {index % 9 === 0 && <path d={`M ${point.x - 14} ${point.y + 9} H ${point.x + 24}`} stroke="rgba(241,239,232,0.14)" />}
            </g>
          ))}

          {messySignals.filter((_, index) => index % 4 === 0).map((point, index) => (
            <motion.path
              key={index}
              d={`M ${point.x} ${point.y} C 260 ${point.y - 20}, 302 ${122 + index * 24}, 352 ${122 + index * 18}`}
              fill="none"
              stroke="rgba(241,239,232,0.11)"
              strokeWidth="0.8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: index * 0.025, ease: 'easeOut' }}
            />
          ))}
        </motion.g>

        {/* STRUCTURED EVIDENCE: Column 1 */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 1 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          <g transform="translate(336 102)">
            <rect width="108" height="402" fill="rgba(241,239,232,0.01)" stroke="rgba(241,239,232,0.14)" />
            {evidenceRows.map((row, index) => (
              <g key={index} transform={`translate(18 ${row.y - 102})`}>
                <motion.circle 
                  cx="0" 
                  cy="0" 
                  r="2" 
                  fill="rgba(241,239,232,0.42)" 
                  animate={hoveredCol === 1 ? { scale: 1.3, fill: "#f1efe8" } : { scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                />
                <motion.line 
                  x1="12" 
                  y1="0" 
                  x2={row.width} 
                  y2="0" 
                  stroke="rgba(241,239,232,0.24)" 
                  animate={hoveredCol === 1 ? { stroke: "rgba(241,239,232,0.52)" } : { stroke: "rgba(241,239,232,0.24)" }}
                  transition={{ duration: 0.3 }}
                />
              </g>
            ))}
          </g>
        </motion.g>

        {/* AI RETRIEVAL LAYER: Column 2 */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 2 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          <g transform="translate(505 300)">
            {[44, 70, 98, 128].map((radius, index) => (
              <circle key={radius} r={radius} fill="none" stroke="rgba(241,239,232,0.14)" strokeDasharray={index % 2 === 0 ? '2 9' : 'none'} />
            ))}
            {Array.from({ length: 18 }, (_, index) => {
              const angle = (index * 20 * Math.PI) / 180;
              return (
                <line
                  key={index}
                  x1={Math.cos(angle) * 36}
                  y1={Math.sin(angle) * 36}
                  x2={Math.cos(angle) * 137}
                  y2={Math.sin(angle) * 137}
                  stroke="rgba(241,239,232,0.08)"
                />
              );
            })}
            <motion.circle
              r="58"
              fill="none"
              stroke="rgba(241,239,232,0.5)"
              filter="url(#visibility-glow)"
              animate={{ opacity: [0.45, 0.88, 0.45] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle 
              r="36" 
              fill="url(#visibility-core)" 
              stroke="rgba(241,239,232,0.65)"
              animate={hoveredCol === 2 ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <circle r="16" fill="#080807" stroke="rgba(241,239,232,0.6)" />
          </g>

          {retrievalPoints.map((point, index) => (
            <motion.circle 
              key={index} 
              cx={point.x} 
              cy={point.y - 30} 
              r={1.8 + (index % 3) * 0.6} 
              fill="rgba(241,239,232,0.36)" 
              animate={hoveredCol === 2 ? { scale: 1.25, fill: "#f1efe8" } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.g>

        {/* SEARCH VISIBILITY: Column 3 */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 3 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {visibilityDots.map((dot, index) => (
            <motion.circle 
              key={index} 
              cx={dot.x} 
              cy={dot.y - 12} 
              r={index % 11 === 0 ? 2.6 : 1.7} 
              fill="rgba(241,239,232,1)" 
              opacity={dot.opacity} 
              animate={hoveredCol === 3 ? { opacity: dot.opacity + 0.16, scale: 1.15 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.g>

        {/* BUSINESS CLARITY: Column 4 */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 4 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {clarityRays.map((ray, index) => (
            <motion.path
              key={index}
              d={`M ${ray.fromX} ${ray.fromY - 20} C ${ray.controlX} ${ray.controlY - 20}, ${ray.controlX} ${ray.toY - 20}, ${ray.toX} ${ray.toY - 20}`}
              fill="none"
              stroke="rgba(241,239,232,0.22)"
              strokeWidth="0.9"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.08 * index, ease: 'easeOut' }}
            />
          ))}
          <motion.circle 
            cx="918" 
            cy="290" 
            r="8" 
            fill="#f1efe8" 
            opacity="0.82" 
            filter="url(#visibility-glow)" 
            animate={hoveredCol === 4 ? { scale: [1, 1.25, 1], opacity: 1 } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <circle cx="918" cy="290" r="25" fill="none" stroke="rgba(241,239,232,0.18)" />
          <text x="888" y="336" fontFamily="Inter, sans-serif" fontSize="8.5" letterSpacing="2.5" fill="rgba(241,239,232,0.5)">CLEAR SIGNAL</text>
        </motion.g>

        {/* Sleek bottom description bar */}
        <g transform="translate(24, 508)">
          <rect 
            x="0" 
            y="0" 
            width="952" 
            height="64" 
            fill="#080807" 
            fillOpacity="0.85" 
            stroke="rgba(241,239,232,0.14)" 
            strokeWidth="1"
          />
          
          <text 
            x="24" 
            y="24" 
            fill="#f1efe8" 
            fontFamily="Inter, sans-serif" 
            fontSize="8.5" 
            letterSpacing="2.8" 
            fontWeight="bold"
          >
            {hoveredCol !== null ? colDescriptions[hoveredCol].title : "TECHNICAL VISIBILITY MAP"}
          </text>
          
          <text 
            x="24" 
            y="43" 
            fill="rgba(241,239,232,0.58)" 
            fontFamily="Inter, sans-serif" 
            fontSize="8.5" 
            letterSpacing="1.2"
          >
            {hoveredCol !== null ? colDescriptions[hoveredCol].desc : "Hover over columns above to trace technical search signals to business growth."}
          </text>
        </g>

        {/* Invisible Vertical Hover Zones */}
        <g opacity="0">
          <rect x="24" y="24" width="166" height="484" fill="red" pointerEvents="all" onMouseEnter={() => setHoveredCol(0)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="190" y="24" width="220" height="484" fill="green" pointerEvents="all" onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="410" y="24" width="220" height="484" fill="blue" pointerEvents="all" onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="630" y="24" width="180" height="484" fill="yellow" pointerEvents="all" onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="810" y="24" width="166" height="484" fill="purple" pointerEvents="all" onMouseEnter={() => setHoveredCol(4)} onMouseLeave={() => setHoveredCol(null)} />
        </g>
      </svg>
    </div>
  );
}
