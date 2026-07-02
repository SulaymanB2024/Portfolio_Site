import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type InvestmentResearchMapProps = {
  className?: string;
};

// Column 0: Market Data — scattered signal points (raw price feeds, filings, on-chain data)
const marketSignals = Array.from({ length: 48 }, (_, i) => {
  const x = 62 + ((i * 31) % 128);
  const y = 128 + ((i * 53) % 360);
  const size = 1.6 + (i % 5) * 0.5;
  const isSquare = i % 7 === 0;
  const isCrypto = i % 3 === 0; // alternating accent colors
  return { x, y, size, isSquare, isCrypto };
});

// Column 1: Evidence Layer — structured horizontal rows (normalized research tables)
const evidenceRows = Array.from({ length: 14 }, (_, i) => ({
  y: 126 + i * 28,
  width: 38 + ((i * 29) % 88),
  indent: i % 3 === 0 ? 12 : 0,
}));

// Column 2: Analysis Core — orbital points around the central thesis engine
const analysisPoints = Array.from({ length: 28 }, (_, i) => {
  const angle = (i * 43) % 360;
  const radius = 42 + ((i * 23) % 86);
  const theta = (angle * Math.PI) / 180;
  return {
    x: 500 + Math.cos(theta) * radius,
    y: 310 + Math.sin(theta) * radius,
  };
});

// Column 3: Risk Map — grid of probability/severity cells
const riskCells = Array.from({ length: 48 }, (_, i) => ({
  col: i % 6,
  row: Math.floor(i / 6),
  intensity: 0.06 + ((i * 7) % 12) * 0.025,
  isHighlight: i === 8 || i === 15 || i === 22 || i === 35 || i === 41,
  isDanger: i === 5 || i === 11 || i === 29,
}));

// Column 4: Investment Output — converging clarity rays to decision node
const outputRays = Array.from({ length: 8 }, (_, i) => {
  const y = 172 + i * 38;
  return {
    fromX: 810,
    fromY: y,
    controlX: 868,
    controlY: y - 24 + (i % 3) * 16,
    toX: 932,
    toY: 268 + i * 11,
  };
});

const topLabels = [
  { lines: ['MARKET', 'DATA'], x: 48 },
  { lines: ['EVIDENCE', 'LAYER'], x: 232 },
  { lines: ['ANALYSIS', 'CORE'], x: 448 },
  { lines: ['RISK', 'MAPPING'], x: 658 },
  { lines: ['INVESTMENT', 'OUTPUT'], x: 842 },
];

const colDescriptions = [
  {
    title: 'MARKET DATA INPUTS',
    desc: 'Price feeds, SEC filings, on-chain flows, protocol metrics, and macro signals aggregated as raw research inputs.',
  },
  {
    title: 'EVIDENCE LAYER',
    desc: 'Normalized research tables: comparable companies, unit economics, token emission schedules, and valuation frameworks.',
  },
  {
    title: 'ANALYSIS CORE',
    desc: 'The thesis-building engine. Testing mispricings against bottom-up models, consensus estimates, and on-chain evidence.',
  },
  {
    title: 'RISK MAPPING',
    desc: 'Quantified risk matrix: tail risks, liquidity gaps, regulatory friction, governance failures, and break-point scenarios.',
  },
  {
    title: 'INVESTMENT OUTPUT',
    desc: 'Decision-ready memos, valuation models, protocol maps, and actionable frameworks built from evidence and assumptions.',
  },
];

export default function InvestmentResearchMap({ className = '' }: InvestmentResearchMapProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <div className={`relative overflow-hidden border border-canvas/15 bg-ink ${className}`}>
      <svg
        viewBox="0 0 1000 620"
        className="h-full w-full"
        role="img"
        aria-label="Investment research signal flow showing market data transformed into investment output"
      >
        <defs>
          <pattern id="research-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0 H0 V32" fill="none" stroke="rgba(241,239,232,0.045)" />
          </pattern>
          <filter id="research-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="research-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f1efe8" stopOpacity="0.88" />
            <stop offset="38%" stopColor="#f1efe8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#080807" stopOpacity="0.12" />
          </radialGradient>
          {/* Subtle green glow for traditional data accents */}
          <radialGradient id="research-green-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b7c8a8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#080807" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base layer */}
        <rect width="1000" height="620" fill="#080807" />
        <rect width="1000" height="620" fill="url(#research-grid)" />

        {/* Column hover backdrop glow */}
        <AnimatePresence>
          {hoveredCol !== null && (
            <motion.rect
              key={hoveredCol}
              x={hoveredCol === 0 ? 24 : hoveredCol === 1 ? 200 : hoveredCol === 2 ? 400 : hoveredCol === 3 ? 620 : 810}
              y="24"
              width={hoveredCol === 0 ? 176 : hoveredCol === 1 ? 200 : hoveredCol === 2 ? 220 : hoveredCol === 3 ? 190 : 166}
              height="496"
              fill="rgba(241,239,232,0.015)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>

        {/* Border frame */}
        <rect x="24" y="24" width="952" height="572" fill="none" stroke="rgba(241,239,232,0.15)" />

        {/* Corner registration marks */}
        <g stroke="rgba(241,239,232,0.3)" strokeWidth="1.2" fill="none">
          <path d="M24 84 V24 H84" />
          <path d="M916 24 H976 V84" />
          <path d="M976 536 V596 H916" />
          <path d="M84 596 H24 V536" />
        </g>

        {/* Column labels */}
        <g fontFamily="Inter, sans-serif" fontSize="7.5" letterSpacing="1.8" fill="rgba(241,239,232,0.55)">
          {topLabels.map(({ lines, x }, idx) => (
            <motion.g
              key={lines.join('-')}
              transform={`translate(${x} 58)`}
              animate={{
                opacity: hoveredCol === null || hoveredCol === idx ? 1 : 0.26,
                fill: hoveredCol === idx ? '#f1efe8' : 'rgba(241,239,232,0.55)',
              }}
              transition={{ duration: 0.25 }}
            >
              {lines.map((line, i) => (
                <text key={line} y={i * 13}>
                  {line}
                </text>
              ))}
            </motion.g>
          ))}
        </g>

        {/* ─── COLUMN 0: MARKET DATA ─── */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 0 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {/* Scattered signal dots */}
          {marketSignals.map((sig, i) => (
            <g key={`sig-${i}`}>
              {sig.isSquare ? (
                <rect
                  x={sig.x - sig.size / 2}
                  y={sig.y - sig.size / 2}
                  width={sig.size}
                  height={sig.size}
                  fill="none"
                  stroke={sig.isCrypto ? 'rgba(194,105,94,0.45)' : 'rgba(183,200,168,0.45)'}
                />
              ) : (
                <circle
                  cx={sig.x}
                  cy={sig.y}
                  r={sig.size / 2}
                  fill={sig.isCrypto ? 'rgba(194,105,94,0.38)' : 'rgba(241,239,232,0.36)'}
                />
              )}
              {i % 8 === 0 && (
                <path
                  d={`M ${sig.x - 12} ${sig.y + 8} H ${sig.x + 18}`}
                  stroke="rgba(241,239,232,0.12)"
                />
              )}
            </g>
          ))}

          {/* Flow paths from signals → evidence */}
          {marketSignals
            .filter((_, i) => i % 5 === 0)
            .map((sig, i) => (
              <motion.path
                key={`flow-${i}`}
                d={`M ${sig.x} ${sig.y} C 220 ${sig.y - 16}, 270 ${132 + i * 26}, 320 ${132 + i * 22}`}
                fill="none"
                stroke="rgba(241,239,232,0.1)"
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.03, ease: 'easeOut' }}
              />
            ))}

          {/* Small accent labels */}
          <g fontFamily="Inter, sans-serif" fontSize="6.5" letterSpacing="1.4" fill="rgba(241,239,232,0.28)">
            <text x="52" y="142">SEC_10K</text>
            <text x="130" y="196">PRICE_FEED</text>
            <text x="68" y="312">ON_CHAIN</text>
            <text x="120" y="410">TOKEN_FLOW</text>
            <text x="56" y="468">MACRO_RATE</text>
          </g>
        </motion.g>

        {/* ─── COLUMN 1: EVIDENCE LAYER ─── */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 1 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          <g transform="translate(310 102)">
            {/* Evidence container box */}
            <rect width="112" height="406" fill="rgba(241,239,232,0.01)" stroke="rgba(241,239,232,0.14)" />

            {/* Structured data rows */}
            {evidenceRows.map((row, i) => (
              <g key={`ev-${i}`} transform={`translate(${16 + row.indent} ${row.y - 102})`}>
                <motion.circle
                  cx="0"
                  cy="0"
                  r="2"
                  fill={i % 4 === 0 ? 'rgba(183,200,168,0.6)' : 'rgba(241,239,232,0.42)'}
                  animate={
                    hoveredCol === 1
                      ? { scale: 1.3, fill: i % 4 === 0 ? '#b7c8a8' : '#f1efe8' }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                />
                <motion.line
                  x1="12"
                  y1="0"
                  x2={row.width}
                  y2="0"
                  stroke="rgba(241,239,232,0.24)"
                  animate={
                    hoveredCol === 1
                      ? { stroke: 'rgba(241,239,232,0.52)' }
                      : { stroke: 'rgba(241,239,232,0.24)' }
                  }
                  transition={{ duration: 0.3 }}
                />
              </g>
            ))}

            {/* Section dividers inside the container */}
            <line x1="0" y1="140" x2="112" y2="140" stroke="rgba(241,239,232,0.08)" strokeDasharray="2 4" />
            <line x1="0" y1="260" x2="112" y2="260" stroke="rgba(241,239,232,0.08)" strokeDasharray="2 4" />

            {/* Internal mini-labels */}
            <g fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.2" fill="rgba(241,239,232,0.22)">
              <text x="8" y="20">COMPS</text>
              <text x="8" y="154">UNIT_ECON</text>
              <text x="8" y="274">EMISSIONS</text>
            </g>
          </g>

          {/* Flow paths from evidence → analysis */}
          {evidenceRows
            .filter((_, i) => i % 3 === 0)
            .map((row, i) => (
              <motion.path
                key={`ev-flow-${i}`}
                d={`M 422 ${row.y} C 440 ${row.y}, 460 ${280 + i * 18}, 480 ${295 + i * 10}`}
                fill="none"
                stroke="rgba(241,239,232,0.1)"
                strokeWidth="0.8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
              />
            ))}
        </motion.g>

        {/* ─── COLUMN 2: ANALYSIS CORE ─── */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 2 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {/* Orbital rings */}
          <g transform="translate(500 310)">
            {[40, 66, 94, 124].map((radius, i) => (
              <circle
                key={radius}
                r={radius}
                fill="none"
                stroke="rgba(241,239,232,0.14)"
                strokeDasharray={i % 2 === 0 ? '2 9' : 'none'}
              />
            ))}

            {/* Radial axes */}
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              return (
                <line
                  key={`axis-${i}`}
                  x1={Math.cos(angle) * 32}
                  y1={Math.sin(angle) * 32}
                  x2={Math.cos(angle) * 132}
                  y2={Math.sin(angle) * 132}
                  stroke="rgba(241,239,232,0.06)"
                />
              );
            })}

            {/* Slow rotating outer emphasis ring */}
            <motion.circle
              r="94"
              fill="none"
              stroke="rgba(241,239,232,0.28)"
              strokeWidth="1"
              strokeDasharray="2 18"
              animate={{ rotate: 360, opacity: [0.18, 0.38, 0.18] }}
              transition={{
                rotate: { duration: 48, repeat: Infinity, ease: 'linear' },
                opacity: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ transformOrigin: '0px 0px' }}
            />

            {/* Pulsing glow ring */}
            <motion.circle
              r="54"
              fill="none"
              stroke="rgba(241,239,232,0.5)"
              filter="url(#research-glow)"
              animate={{ opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Core layers */}
            <motion.circle
              r="34"
              fill="url(#research-core)"
              stroke="rgba(241,239,232,0.65)"
              animate={hoveredCol === 2 ? { scale: 1.06 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <circle r="14" fill="#080807" stroke="rgba(241,239,232,0.6)" />

            {/* Inner crosshair */}
            <line x1="-8" y1="0" x2="8" y2="0" stroke="rgba(241,239,232,0.3)" strokeWidth="0.8" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="rgba(241,239,232,0.3)" strokeWidth="0.8" />
          </g>

          {/* Orbital data points */}
          {analysisPoints.map((pt, i) => (
            <motion.circle
              key={`ap-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={1.6 + (i % 3) * 0.5}
              fill={i % 5 === 0 ? 'rgba(183,200,168,0.55)' : 'rgba(241,239,232,0.34)'}
              animate={hoveredCol === 2 ? { scale: 1.2, fillOpacity: 0.8 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}

          {/* Accent label at the core */}
          <text
            x="500"
            y="430"
            fontFamily="Inter, sans-serif"
            fontSize="7"
            letterSpacing="1.8"
            fill="rgba(241,239,232,0.3)"
            textAnchor="middle"
          >
            THESIS ENGINE
          </text>
        </motion.g>

        {/* ─── COLUMN 3: RISK MAPPING ─── */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 3 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {/* Risk matrix grid */}
          <g transform="translate(646 158)">
            {/* Grid container */}
            <rect
              width="156"
              height="216"
              fill="none"
              stroke="rgba(241,239,232,0.12)"
            />

            {/* Axis labels */}
            <g fontFamily="Inter, sans-serif" fontSize="5.5" letterSpacing="1" fill="rgba(241,239,232,0.25)">
              <text x="78" y="-6" textAnchor="middle">PROBABILITY →</text>
              <text
                x="-8"
                y="108"
                textAnchor="middle"
                transform="rotate(-90 -8 108)"
              >
                SEVERITY →
              </text>
            </g>

            {/* Grid cells */}
            {riskCells.map((cell, i) => (
              <motion.rect
                key={`risk-${i}`}
                x={cell.col * 26}
                y={cell.row * 27}
                width="26"
                height="27"
                fill={
                  cell.isDanger
                    ? 'rgba(194,105,94,0.35)'
                    : cell.isHighlight
                      ? 'rgba(183,200,168,0.2)'
                      : `rgba(241,239,232,${cell.intensity})`
                }
                stroke="rgba(241,239,232,0.06)"
                strokeWidth="0.5"
                animate={
                  hoveredCol === 3
                    ? {
                        fill: cell.isDanger
                          ? 'rgba(194,105,94,0.55)'
                          : cell.isHighlight
                            ? 'rgba(183,200,168,0.35)'
                            : `rgba(241,239,232,${cell.intensity + 0.04})`,
                      }
                    : {}
                }
                transition={{ duration: 0.3, delay: i * 0.008 }}
              />
            ))}

            {/* Highlight indicators */}
            <circle cx="148" cy="27" r="3" fill="#c2695e" opacity="0.7" />
            <circle cx="122" cy="135" r="2.5" fill="#c2695e" opacity="0.5" />
          </g>

          {/* Risk category labels */}
          <g fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.2" fill="rgba(241,239,232,0.24)">
            <text x="650" y="400">TAIL_RISK</text>
            <text x="720" y="420">LIQUIDITY_GAP</text>
            <text x="660" y="440">GOVERNANCE</text>
            <text x="730" y="460">REGULATORY</text>
          </g>

          {/* Dashed boundary lines */}
          <line
            x1="640"
            y1="382"
            x2="810"
            y2="382"
            stroke="rgba(194,105,94,0.2)"
            strokeWidth="0.8"
            strokeDasharray="3 5"
          />

          {/* Flow paths from risk → output */}
          {[0, 1, 2, 3].map((i) => (
            <motion.path
              key={`risk-flow-${i}`}
              d={`M 802 ${200 + i * 52} C 820 ${200 + i * 52}, 830 ${220 + i * 36}, 840 ${240 + i * 24}`}
              fill="none"
              stroke="rgba(241,239,232,0.1)"
              strokeWidth="0.8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
            />
          ))}
        </motion.g>

        {/* ─── COLUMN 4: INVESTMENT OUTPUT ─── */}
        <motion.g
          animate={{ opacity: hoveredCol === null || hoveredCol === 4 ? 1 : 0.22 }}
          transition={{ duration: 0.3 }}
        >
          {/* Converging clarity rays */}
          {outputRays.map((ray, i) => (
            <motion.path
              key={`ray-${i}`}
              d={`M ${ray.fromX} ${ray.fromY} C ${ray.controlX} ${ray.controlY}, ${ray.controlX} ${ray.toY}, ${ray.toX} ${ray.toY}`}
              fill="none"
              stroke="rgba(241,239,232,0.22)"
              strokeWidth="0.9"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.08 * i, ease: 'easeOut' }}
            />
          ))}

          {/* Decision node with glow */}
          <motion.circle
            cx="932"
            cy="310"
            r="8"
            fill="#f1efe8"
            opacity="0.82"
            filter="url(#research-glow)"
            animate={
              hoveredCol === 4
                ? { scale: [1, 1.25, 1], opacity: 1 }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <circle cx="932" cy="310" r="24" fill="none" stroke="rgba(241,239,232,0.18)" />
          <circle cx="932" cy="310" r="38" fill="none" stroke="rgba(241,239,232,0.08)" strokeDasharray="2 6" />

          {/* Output label */}
          <text
            x="932"
            y="362"
            fontFamily="Inter, sans-serif"
            fontSize="7"
            letterSpacing="2"
            fill="rgba(241,239,232,0.4)"
            textAnchor="middle"
          >
            RESEARCH FRAME
          </text>

          {/* Output type labels */}
          <g fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1" fill="rgba(241,239,232,0.2)">
            <text x="860" y="170" textAnchor="end">MEMO</text>
            <text x="860" y="206" textAnchor="end">MODEL</text>
            <text x="860" y="242" textAnchor="end">MAP</text>
            <text x="860" y="382" textAnchor="end">THESIS</text>
            <text x="860" y="418" textAnchor="end">FRAMEWORK</text>
          </g>
        </motion.g>

        {/* ─── CROSS-COLUMN FLOW SPINE ─── */}
        <motion.path
          d="M 190 310 C 240 310, 280 310, 310 310"
          fill="none"
          stroke="rgba(241,239,232,0.08)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M 422 310 C 445 310, 465 310, 485 310"
          fill="none"
          stroke="rgba(241,239,232,0.08)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
        />
        <motion.path
          d="M 620 310 C 630 310, 638 310, 646 310"
          fill="none"
          stroke="rgba(241,239,232,0.08)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
        />

        {/* ─── BOTTOM DESCRIPTION BAR ─── */}
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
            {hoveredCol !== null ? colDescriptions[hoveredCol].title : 'RESEARCH SIGNAL FLOW'}
          </text>

          <text
            x="24"
            y="43"
            fill="rgba(241,239,232,0.58)"
            fontFamily="Inter, sans-serif"
            fontSize="8.5"
            letterSpacing="1.2"
          >
            {hoveredCol !== null
              ? colDescriptions[hoveredCol].desc
              : 'Hover over columns above to trace investment research from raw data to assumption-backed output.'}
          </text>
        </g>

        {/* Invisible Vertical Hover Zones */}
        <g opacity="0">
          <rect x="24" y="24" width="176" height="484" fill="red" pointerEvents="all" onMouseEnter={() => setHoveredCol(0)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="200" y="24" width="200" height="484" fill="green" pointerEvents="all" onMouseEnter={() => setHoveredCol(1)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="400" y="24" width="220" height="484" fill="blue" pointerEvents="all" onMouseEnter={() => setHoveredCol(2)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="620" y="24" width="190" height="484" fill="yellow" pointerEvents="all" onMouseEnter={() => setHoveredCol(3)} onMouseLeave={() => setHoveredCol(null)} />
          <rect x="810" y="24" width="166" height="484" fill="purple" pointerEvents="all" onMouseEnter={() => setHoveredCol(4)} onMouseLeave={() => setHoveredCol(null)} />
        </g>
      </svg>
    </div>
  );
}
