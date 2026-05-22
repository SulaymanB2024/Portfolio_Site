import { motion } from 'motion/react';

type VoidCrawlMapProps = {
  className?: string;
};

const cx = 455;
const cy = 350;

function polar(angleDeg: number, radius: number) {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

const rings = Array.from({ length: 16 }, (_, index) => 28 + index * 18);
const axes = Array.from({ length: 12 }, (_, index) => index * 30);

const nodes = Array.from({ length: 132 }, (_, index) => {
  const angle = (index * 41 + (index % 9) * 7) % 360;
  const radius = 54 + ((index * 37) % 244);
  const size = 1.3 + (index % 5) * 0.42;
  const signal = index % 19 === 0;
  return { angle, radius, size, signal };
});

const paths = Array.from({ length: 34 }, (_, index) => {
  const start = nodes[(index * 7) % nodes.length];
  const end = nodes[(index * 11 + 19) % nodes.length];
  return { start, end };
});

const labelGroups = [
  { x: 58, y: 78, title: 'CRAWL MAP', rows: ['42,618 URLS', 'DEPTH 5'], anchor: 'start' },
  { x: 684, y: 168, title: 'VOID', rows: ['AGENCY'], anchor: 'start' },
  { x: 706, y: 274, title: 'INDEXABLE', rows: ['31,245'], anchor: 'start' },
  { x: 704, y: 378, title: 'NON-INDEXABLE', rows: ['11,373'], anchor: 'start' },
  { x: 96, y: 566, title: 'SCHEMA', rows: ['186 PAGES'], anchor: 'start' },
  { x: 644, y: 600, title: 'INTERNAL LINKS', rows: ['24,317'], anchor: 'start' },
];

const callouts = [
  { from: polar(220, 205), to: { x: 164, y: 548 } },
  { from: polar(18, 244), to: { x: 674, y: 178 } },
  { from: polar(336, 214), to: { x: 694, y: 290 } },
  { from: polar(3, 164), to: { x: 692, y: 390 } },
  { from: polar(82, 202), to: { x: 632, y: 584 } },
];

export function VoidCrawlMap({ className = '' }: VoidCrawlMapProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 900 700" className="h-full w-full" role="img" aria-label="Void Agency crawl intelligence map">
        <defs>
          <radialGradient id="void-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F1EFE8" stopOpacity="0.95" />
            <stop offset="32%" stopColor="#F1EFE8" stopOpacity="0.18" />
            <stop offset="78%" stopColor="#0A0A09" stopOpacity="0.2" />
          </radialGradient>
          <filter id="void-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="900" height="700" fill="rgba(10,10,9,0)" />

        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <rect x="28" y="28" width="844" height="644" fill="none" stroke="rgba(241,239,232,0.12)" />

          {rings.map((ring, index) => (
            <circle
              key={ring}
              cx={cx}
              cy={cy}
              r={ring}
              fill="none"
              stroke="rgba(241,239,232,0.13)"
              strokeWidth={index === 5 || index === 11 ? 1 : 0.7}
              strokeDasharray={index % 3 === 0 ? '2 8' : index % 4 === 0 ? '12 18' : 'none'}
            />
          ))}
          <motion.circle
            cx={cx}
            cy={cy}
            r="282"
            fill="none"
            stroke="rgba(183,200,168,0.28)"
            strokeWidth="1"
            strokeDasharray="2 22"
            animate={{ rotate: 360, opacity: [0.15, 0.36, 0.15] }}
            transition={{ rotate: { duration: 56, repeat: Infinity, ease: 'linear' }, opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />

          {axes.map((angle) => {
            const inner = polar(angle, 42);
            const outer = polar(angle, 304);
            return (
              <line
                key={angle}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(241,239,232,0.1)"
                strokeWidth="0.8"
              />
            );
          })}

          {paths.map((path, index) => {
            const start = polar(path.start.angle, path.start.radius);
            const end = polar(path.end.angle, path.end.radius);
            const control = polar((path.start.angle + path.end.angle) / 2 + index * 3, 54 + (index % 8) * 20);
            return (
              <motion.path
                key={index}
                d={`M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`}
                fill="none"
                stroke="rgba(241,239,232,0.105)"
                strokeWidth="0.75"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.03 * (index % 12), ease: 'easeOut' }}
              />
            );
          })}

          {nodes.map((node, index) => {
            const position = polar(node.angle, node.radius);
            return (
              <circle
                key={index}
                cx={position.x}
                cy={position.y}
                r={node.size}
                fill={node.signal ? '#B7C8A8' : '#F1EFE8'}
                fillOpacity={node.signal ? 0.7 : 0.24 + (index % 6) * 0.075}
              />
            );
          })}

          <motion.circle
            cx={cx}
            cy={cy}
            r="78"
            fill="none"
            stroke="rgba(241,239,232,0.45)"
            strokeWidth="1.2"
            filter="url(#void-soft-glow)"
            animate={{ opacity: [0.55, 0.88, 0.55] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx={cx} cy={cy} r="56" fill="#080807" stroke="rgba(241,239,232,0.34)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="34" fill="url(#void-core-glow)" stroke="rgba(241,239,232,0.76)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="17" fill="#080807" stroke="rgba(241,239,232,0.62)" strokeWidth="1" />

          {callouts.map((callout, index) => (
            <path
              key={index}
              d={`M ${callout.from.x} ${callout.from.y} L ${callout.to.x} ${callout.to.y}`}
              fill="none"
              stroke="rgba(241,239,232,0.18)"
              strokeWidth="0.8"
              strokeDasharray="3 7"
            />
          ))}

          {labelGroups.map((label) => (
            <g key={label.title} transform={`translate(${label.x} ${label.y})`}>
              <text fill="rgba(241,239,232,0.82)" fontFamily="Inter, sans-serif" fontSize="10" letterSpacing="3.2" textAnchor={label.anchor}>
                {label.title}
              </text>
              {label.rows.map((row, index) => (
                <text
                  key={row}
                  y={23 + index * 19}
                  fill="rgba(241,239,232,0.48)"
                  fontFamily="Inter, sans-serif"
                  fontSize="9"
                  letterSpacing="2.2"
                  textAnchor={label.anchor}
                >
                  {row}
                </text>
              ))}
            </g>
          ))}

          <g stroke="rgba(241,239,232,0.28)" strokeWidth="1.1" fill="none">
            <path d="M28 92 V28 H92" />
            <path d="M808 28 H872 V92" />
            <path d="M872 608 V672 H808" />
            <path d="M92 672 H28 V608" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

export default VoidCrawlMap;
