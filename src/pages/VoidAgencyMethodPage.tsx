import { motion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useSEO } from '../utils/seo';
import VoidCrawlMap from '../components/VoidCrawlMap';
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

const METHOD_SEO = getSeoRoute('/method')!;

type MethodColumn = {
  number: string;
  title: string;
  copy: string;
  visual: 'crawl' | 'diagnose' | 'repair' | 'measure';
};

type ProcessStep = {
  title: string;
  copy: string;
  icon: 'crawl' | 'stack' | 'target' | 'report';
};

type CaseStudy = {
  category: string;
  title: string;
  copy: string;
  visual: 'urls' | 'entity' | 'heatmap' | 'local';
  href: string;
};

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

const methodColumns: MethodColumn[] = [
  {
    number: '01',
    title: 'CRAWL',
    visual: 'crawl',
    copy: 'Map the site as search engines see it. Inspect indexable URLs, crawl depth, sitemaps, robots rules, redirects, canonicals, metadata, templates, and internal links.',
  },
  {
    number: '02',
    title: 'DIAGNOSE',
    visual: 'diagnose',
    copy: 'Find the issues that actually affect discovery, ranking, AI retrieval, and conversion. Every finding is tied to evidence, affected URLs, severity, and likely business impact.',
  },
  {
    number: '03',
    title: 'REPAIR',
    visual: 'repair',
    copy: 'Turn the audit into implementation work: fix architecture, consolidate weak pages, improve metadata, strengthen schema, clean internal links, correct crawl waste, and improve page speed.',
  },
  {
    number: '04',
    title: 'MEASURE',
    visual: 'measure',
    copy: 'Track what changed after implementation: indexation, search queries, rankings, page performance, crawl behavior, AI visibility, and conversion events.',
  },
];

const processSteps: ProcessStep[] = [
  {
    title: 'CRAWL',
    icon: 'crawl',
    copy: 'Custom crawlers, sitemap checks, and page extraction.',
  },
  {
    title: 'ANALYZE',
    icon: 'stack',
    copy: 'Indexation, architecture, links, metadata, speed, and schema.',
  },
  {
    title: 'PRIORITIZE',
    icon: 'target',
    copy: 'Rank fixes by severity, effort, affected pages, and revenue risk.',
  },
  {
    title: 'DELIVER',
    icon: 'report',
    copy: 'Clear reports, implementation guidance, and measurable next steps.',
  },
];

const caseStudies: CaseStudy[] = [
  {
    category: 'TECHNICAL SEO',
    title: 'Indexation Audit at Scale',
    visual: 'urls',
    href: '/atlas',
    copy: 'Mapped thousands of URLs to uncover crawl waste, duplicate templates, weak canonicals, orphaned pages, redirect chains, and pages blocked from meaningful discovery.',
  },
  {
    category: 'AI SEARCH',
    title: 'AI Visibility Benchmark',
    visual: 'entity',
    href: '#case-studies',
    copy: 'Reviewed whether a company could be clearly understood and cited by AI systems. Tested entity, clarity, answer-ready pages, schema, source structure, and crawler access.',
  },
  {
    category: 'ECOMMERCE SEO',
    title: 'Product Discovery System',
    visual: 'heatmap',
    href: '#case-studies',
    copy: 'Audited product and collection pages to find missing metadata, thin templates, weak internal links, duplicate paths, and search-intent gaps.',
  },
  {
    category: 'LOCAL SEO',
    title: 'Service-Area Visibility Audit',
    visual: 'local',
    href: '#case-studies',
    copy: 'Mapped location pages, service pages, Google Business Profile signals, crawl structure, and local entity clarity to improve discovery in high-intent searches.',
  },
];

function DarkNoise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.055]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 24% 20%, rgba(241,239,232,0.24) 0 1px, transparent 1.6px), radial-gradient(circle at 78% 70%, rgba(241,239,232,0.14) 0 1px, transparent 1.8px)',
        backgroundSize: '17px 19px, 23px 29px',
      }}
    />
  );
}

function ArrowLink({ children, href = '#', id }: { children: ReactNode; href?: string; id?: string }) {
  return (
    <a id={id} href={href} data-cursor-text={typeof children === 'string' ? children : 'VIEW'} className="hover-target inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/70 transition-colors hover:text-[#f1efe8]">
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function CircleAuditButton({ className = '', id }: { className?: string; id?: string }) {
  return (
    <motion.a
      href="/#contact"
      id={id}
      data-cursor-text="AUDIT"
      className={`hover-target relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-[#f1efe8] text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-[#080807] md:h-32 md:w-32 ${className}`}
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <motion.span
        className="absolute inset-2 rounded-full border border-[#080807]/14"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10">
        START
        <br />
        AN AUDIT
      </span>
    </motion.a>
  );
}

function MethodVisual({ type }: { type: MethodColumn['visual'] }) {
  if (type === 'crawl') {
    return (
      <svg viewBox="0 0 260 132" className="h-32 w-full text-[#f1efe8]" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.48">
          <rect x="96" y="10" width="68" height="24" />
          <rect x="20" y="82" width="58" height="24" />
          <rect x="101" y="82" width="58" height="24" />
          <rect x="183" y="82" width="58" height="24" />
          <path d="M130 34 V58 M130 58 H49 V82 M130 58 V82 M130 58 H212 V82" />
        </g>
        <g fill="currentColor" opacity="0.5">
          <circle cx="130" cy="58" r="2" />
          <circle cx="49" cy="82" r="2" />
          <circle cx="130" cy="82" r="2" />
          <circle cx="212" cy="82" r="2" />
        </g>
      </svg>
    );
  }

  if (type === 'diagnose') {
    const bars = [
      ['CRITICAL', '12', 176, 'rgba(194,105,94,0.7)'],
      ['HIGH', '38', 134, 'rgba(241,239,232,0.48)'],
      ['MEDIUM', '72', 96, 'rgba(241,239,232,0.32)'],
      ['LOW', '106', 58, 'rgba(183,200,168,0.48)'],
    ];
    return (
      <svg viewBox="0 0 260 132" className="h-32 w-full" aria-hidden="true">
        {bars.map(([label, value, width, fill], index) => (
          <g key={label} transform={`translate(0 ${12 + index * 29})`}>
            <text x="0" y="10" fill="rgba(241,239,232,0.48)" fontSize="8" letterSpacing="2" fontFamily="Inter, sans-serif">{label}</text>
            <rect x="82" y="2" width="150" height="9" fill="rgba(241,239,232,0.08)" />
            <rect x="82" y="2" width={Number(width) * 0.72} height="9" fill={String(fill)} />
            <text x="252" y="10" textAnchor="end" fill="rgba(241,239,232,0.72)" fontSize="8" letterSpacing="2" fontFamily="Inter, sans-serif">{value}</text>
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'repair') {
    return (
      <svg viewBox="0 0 260 132" className="h-32 w-full text-[#f1efe8]" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.28">
          <path d="M20 28 L64 18 L88 50 L48 70 L94 100 L22 112" />
          <path d="M20 96 L70 72 L105 110" />
          <path d="M136 66 H160" />
          <path d="M154 58 L162 66 L154 74" />
          <path d="M182 28 H230 M182 56 H230 M182 84 H230 M182 112 H230" />
          <path d="M182 28 V112 M206 28 V112 M230 28 V112" />
        </g>
        <g fill="currentColor">
          {[20, 64, 88, 48, 94, 22, 70, 105].map((x, index) => (
            <circle key={`${x}-${index}`} cx={x} cy={[28, 18, 50, 70, 100, 112, 72, 110][index]} r="3" opacity="0.48" />
          ))}
          {[182, 206, 230].map((x) => [28, 56, 84, 112].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" opacity="0.5" />))}
        </g>
      </svg>
    );
  }

  return (
    <div className="grid gap-4">
      <svg viewBox="0 0 260 82" className="h-20 w-full text-[#f1efe8]" aria-hidden="true">
        <rect x="1" y="1" width="258" height="80" fill="none" stroke="currentColor" opacity="0.18" />
        <path d="M16 62 C52 54 54 31 86 38 S134 66 169 42 S214 20 244 23" fill="none" stroke="#B7C8A8" strokeWidth="1.4" />
        <path d="M16 62 H244 M16 42 H244 M16 22 H244" stroke="currentColor" opacity="0.1" />
      </svg>
      <div className="grid gap-2 text-[9px] uppercase tracking-[0.18em] text-[#f1efe8]/52">
        {['INDEXABLE PAGES +28%', 'IMPRESSIONS +41%', 'AI VISIBILITY +27%', 'CONVERSIONS +18%'].map((metric) => (
          <div key={metric} className="flex justify-between border-b border-[#f1efe8]/10 pb-2">
            <span>{metric.split(' +')[0]}</span>
            <span className="text-[#b7c8a8]/80">+{metric.split(' +')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodColumnView({ item }: { item: MethodColumn }) {
  return (
    <motion.article
      className="group border-[#f1efe8]/12 py-8 transition-[background-color,border-color] duration-500 hover:bg-[#f1efe8]/[0.025] md:border-r md:px-6 md:last:border-r-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-10 flex items-start justify-between text-[10px] uppercase tracking-[0.32em] text-[#f1efe8]/38">
        <span className="font-serif text-3xl italic tracking-normal text-[#f1efe8]/64 transition-colors duration-500 group-hover:text-[#f1efe8]">{item.number}</span>
        <span>METHOD</span>
      </div>
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.38em] text-[#f1efe8]">{item.title}</h3>
      <p className="mb-8 text-sm leading-relaxed text-[#f1efe8]/58">{item.copy}</p>
      <div className="transition-opacity duration-500 group-hover:opacity-100 md:opacity-75">
        <MethodVisual type={item.visual} />
      </div>
    </motion.article>
  );
}

function ProcessIcon({ type, isHovered }: { type: ProcessStep['icon']; isHovered: boolean }) {
  const common = 'fill-none stroke-current';
  if (type === 'crawl') {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
        <motion.rect 
          className={common} 
          x="10" 
          y="10" 
          width="31" 
          height="31" 
          strokeWidth="1" 
          strokeDasharray="3 4" 
          animate={isHovered ? { strokeDashoffset: -20 } : { strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
        />
        <motion.g
          animate={isHovered ? { scale: 1.15, x: 2, y: 2 } : { scale: 1, x: 0, y: 0 }}
          style={{ transformOrigin: "28px 28px" }}
          transition={{ duration: 0.3 }}
        >
          <circle className={common} cx="28" cy="28" r="9" strokeWidth="1.2" />
          <path className={common} d="M35 35 L48 48" strokeWidth="1.2" />
        </motion.g>
        <circle cx="16" cy="18" r="1.8" fill="currentColor" opacity="0.55" />
        <circle cx="37" cy="17" r="1.8" fill="currentColor" opacity="0.45" />
      </svg>
    );
  }
  if (type === 'stack') {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
        <motion.path 
          className={common} 
          d="M14 20 L32 10 L50 20 L32 30 Z" 
          strokeWidth="1.2" 
          animate={isHovered ? { y: -6 } : { y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path 
          className={common} 
          d="M14 32 L32 42 L50 32" 
          strokeWidth="1.2" 
          animate={isHovered ? { y: -3 } : { y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path 
          className={common} 
          d="M14 44 L32 54 L50 44" 
          strokeWidth="1.2" 
          animate={isHovered ? { y: 0 } : { y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
    );
  }
  if (type === 'target') {
    return (
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
        <motion.circle 
          className={common} 
          cx="32" 
          cy="32" 
          r="22" 
          strokeWidth="1" 
          opacity="0.5" 
          animate={isHovered ? { rotate: 180, scale: 1.05 } : { rotate: 0, scale: 1 }}
          style={{ transformOrigin: "32px 32px" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.circle 
          className={common} 
          cx="32" 
          cy="32" 
          r="12" 
          strokeWidth="1.2" 
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          style={{ transformOrigin: "32px 32px" }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle 
          cx="32" 
          cy="32" 
          r="3" 
          fill="currentColor" 
          animate={isHovered ? { scale: 1.4, opacity: 1 } : { scale: 1, opacity: 0.72 }}
          transition={{ duration: 0.3 }}
        />
        <motion.path 
          className={common} 
          d="M32 6 V14 M32 50 V58 M6 32 H14 M50 32 H58" 
          strokeWidth="1" 
          animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
          style={{ transformOrigin: "32px 32px" }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <motion.path 
        className={common} 
        d="M18 10 H42 L50 18 V54 H18 Z" 
        strokeWidth="1.2" 
        animate={isHovered ? { strokeWidth: 1.4 } : { strokeWidth: 1.2 }}
      />
      <motion.path 
        className={common} 
        d="M42 10 V19 H50 M26 30 H42 M26 38 H42 M26 46 H36" 
        strokeWidth="1.2" 
        animate={isHovered ? { pathLength: 1 } : { pathLength: 0.8 }}
        transition={{ duration: 0.4 }}
      />
    </svg>
  );
}

function ProcessStepCard({ step, index }: { step: ProcessStep; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="group relative border-[#f1efe8]/12 p-6 transition-[background-color,border-color] duration-500 hover:bg-[#f1efe8]/[0.025] md:border-r md:last:border-r-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 flex items-start justify-between text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/38">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{index < 3 ? '→' : 'END'}</span>
      </div>
      <div className="mb-8 text-[#f1efe8]/58 transition-colors duration-500 group-hover:text-[#f1efe8]/82">
        <ProcessIcon type={step.icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-4 text-xs uppercase tracking-[0.34em] text-[#f1efe8]">{step.title}</h3>
      <p className="text-sm leading-relaxed text-[#f1efe8]/55">{step.copy}</p>
    </motion.div>
  );
}

function CaseStudyVisual({ type, isHovered }: { type: CaseStudy['visual']; isHovered: boolean }) {
  if (type === 'urls') {
    const rows = ['/blog/', '/category/', '/product/', '/old/', '/tag/', '/search/', '/page/2/'];
    return (
      <div className="grid gap-4">
        <div className="border border-[#f1efe8]/12 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/75">example.com</div>
          <div className="grid gap-2 text-[10px] uppercase tracking-[0.16em] text-[#f1efe8]/46">
            {rows.map((row, index) => (
              <div key={row} className="flex items-center gap-3">
                <motion.span 
                  animate={isHovered ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ repeat: isHovered ? Infinity : 0, duration: 1.5, delay: index * 0.12 }}
                  className={`h-1.5 w-1.5 rounded-full ${index % 4 === 0 ? 'bg-[#b7c8a8]/70' : index % 4 === 1 ? 'bg-[#f1efe8]/38' : index % 4 === 2 ? 'bg-[#c2695e]/55' : 'bg-[#f1efe8]/18'}`} 
                />
                <span>{row}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] uppercase tracking-[0.16em] text-[#f1efe8]/45">
          {['Indexable', 'Non-indexable', 'Duplicate', 'Redirect'].map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[#b7c8a8]/70' : index === 2 ? 'bg-[#c2695e]/55' : 'bg-[#f1efe8]/30'}`} />
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'entity') {
    const points = [
      ['Brand', 116, 38],
      ['Product', 48, 83],
      ['Founder', 176, 82],
      ['Category', 73, 138],
      ['Case Study', 158, 140],
      ['Problem', 116, 105],
    ];
    return (
      <svg viewBox="0 0 230 178" className="h-44 w-full text-[#f1efe8]" aria-hidden="true">
        <g stroke="currentColor" opacity="0.18">
          <motion.path 
            d="M116 38 L48 83 L73 138 L116 105 L158 140 L176 82 Z M48 83 L116 105 L176 82 M73 138 L158 140" 
            fill="none" 
            animate={isHovered ? { pathLength: 1, opacity: 0.3 } : { pathLength: 0.8, opacity: 0.18 }}
            transition={{ duration: 0.8 }}
          />
        </g>
        {points.map(([label, x, y], index) => (
          <g key={String(label)}>
            <motion.circle 
              cx={Number(x)} 
              cy={Number(y)} 
              r={index === 0 ? 12 : 8} 
              fill="currentColor" 
              animate={isHovered ? { scale: index === 0 ? 1.15 : 1.25, opacity: index === 0 ? 0.65 : 0.45 } : { scale: 1, opacity: index === 0 ? 0.52 : 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            />
            <text x={Number(x)} y={Number(y) + 24} fill="rgba(241,239,232,0.52)" fontSize="8" letterSpacing="1.8" fontFamily="Inter, sans-serif" textAnchor="middle">
              {label}
            </text>
          </g>
        ))}
      </svg>
    );
  }

  if (type === 'heatmap') {
    return (
      <div className="grid grid-cols-2 gap-5">
        {['COLLECTION PAGES', 'PRODUCT PAGES'].map((title, groupIndex) => (
          <div key={title}>
            <div className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#f1efe8]/48">{title}</div>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 30 }, (_, index) => {
                const green = (index + groupIndex) % 4 === 0;
                const red = (index + groupIndex * 2) % 9 === 0;
                return (
                  <motion.span 
                    key={index} 
                    animate={isHovered ? { scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
                    transition={{ repeat: isHovered ? Infinity : 0, duration: 1.6, delay: (index * 0.04) % 1.2 }}
                    className={`aspect-square ${red ? 'bg-[#c2695e]/45' : green ? 'bg-[#b7c8a8]/55' : 'bg-[#f1efe8]/13'}`} 
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-2 text-[10px] uppercase tracking-[0.18em] text-[#f1efe8]/52">
        {['Austin, TX', 'Dallas, TX', 'Houston, TX', 'San Antonio, TX', 'Denver, CO'].map((city, index) => (
          <motion.div 
            key={city} 
            animate={isHovered ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between border-b border-[#f1efe8]/10 pb-2"
          >
            <span>{city}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a8]/55" />
          </motion.div>
        ))}
      </div>
      <svg viewBox="0 0 240 84" className="h-20 w-full text-[#f1efe8]" aria-hidden="true">
        <g fill="none" stroke="currentColor" opacity="0.28">
          <motion.rect x="82" y="8" width="76" height="18" animate={isHovered ? { strokeWidth: 1.5, opacity: 0.6 } : { strokeWidth: 1, opacity: 0.28 }} />
          <motion.rect x="18" y="58" width="58" height="18" animate={isHovered ? { strokeWidth: 1.5, opacity: 0.6 } : { strokeWidth: 1, opacity: 0.28 }} />
          <motion.rect x="91" y="58" width="58" height="18" animate={isHovered ? { strokeWidth: 1.5, opacity: 0.6 } : { strokeWidth: 1, opacity: 0.28 }} />
          <motion.rect x="164" y="58" width="58" height="18" animate={isHovered ? { strokeWidth: 1.5, opacity: 0.6 } : { strokeWidth: 1, opacity: 0.28 }} />
          <motion.path 
            d="M120 26 V42 M120 42 H47 V58 M120 42 V58 M120 42 H193 V58" 
            animate={isHovered ? { pathLength: 1 } : { pathLength: 0.7 }}
            transition={{ duration: 0.5 }}
          />
        </g>
      </svg>
    </div>
  );
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.article
      className="group relative grid min-h-[560px] grid-rows-[auto_auto_1fr_auto] overflow-hidden border border-[#f1efe8]/12 p-6 transition-[border-color,background-color] duration-500 before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-[#f1efe8]/45 before:transition-all before:duration-700 hover:border-[#f1efe8]/32 hover:bg-[#f1efe8]/[0.025] hover:before:w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-8 flex items-start justify-between text-[10px] uppercase tracking-[0.28em] text-[#f1efe8]/42">
        <span>{study.category}</span>
        <span className="h-2 w-2 rounded-full border border-[#f1efe8]/32 transition-colors duration-500 group-hover:bg-[#f1efe8]/70" />
      </div>
      <div>
        <h3 className="max-w-sm font-serif text-4xl italic leading-none tracking-[-0.02em] text-[#f1efe8]">{study.title}</h3>
        <p className="mt-6 text-sm leading-relaxed text-[#f1efe8]/58">{study.copy}</p>
      </div>
      <div className="my-9 self-center transition-opacity duration-500 md:opacity-75 md:group-hover:opacity-100">
        <CaseStudyVisual type={study.visual} isHovered={isHovered} />
      </div>
      <ArrowLink id={`method-case-study-${study.title.toLowerCase().replace(/\s+/g, '-')}`} href={study.href}>VIEW CASE STUDY</ArrowLink>
    </motion.article>
  );
}
export default function VoidAgencyMethodPage() {
  useSEO(METHOD_SEO);
  const prefersReducedMotion = useReducedMotion();

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] md:cursor-none">
      <ShutterWipe />
      <DarkNoise />
      <PageTechnicalChrome tone="dark" />
      {!prefersReducedMotion && <div className="hidden md:block">
        <SmoothCursor />
      </div>}
      <ScrollProgress />

      <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
        <div className="grid items-start gap-5 border-b border-[#f1efe8]/12 bg-[#080807]/82 pb-5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr]">
          <a href="/" id="method-brand-link" className="hover-target" data-cursor-text="HOME">
            <span className="block font-medium text-[#f1efe8]">VOID AGENCY</span>
            <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">Technical SEO · AI Search · Web Visibility</span>
          </a>
          <nav className="flex flex-wrap items-center gap-3 md:justify-center md:gap-6">
            <NavLink href="/#selected-works" id="method-nav-work">WORK</NavLink>
            <NavLink href="/method" active id="method-nav-method">METHOD</NavLink>
            <NavLink href="/about" id="method-nav-about">ABOUT</NavLink>
            <NavLink href="/#contact" id="method-nav-contact">CONTACT</NavLink>
          </nav>
          <a href="/#contact" id="method-header-contact" data-cursor-text="CONTACT" className="hover-target flex items-center gap-4 justify-self-start text-[#f1efe8]/75 transition-colors hover:text-[#f1efe8] md:justify-self-end">
            <span className="h-7 w-7 rounded-full border border-[#f1efe8]/28" />
            <span>CONTACT</span>
          </a>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] xl:px-10 xl:pt-20">
        <ScrollReveal yOffset={18} blur={false} className="min-w-0">
          <div className="mb-9 text-[10px] uppercase tracking-[0.36em] text-[#f1efe8]/48">METHOD</div>
          <h1 
            style={{ viewTransitionName: 'void-title' } as CSSProperties}
            className="font-serif text-[clamp(5.2rem,12vw,12.4rem)] italic leading-[0.74] tracking-[-0.055em] text-[#f1efe8]"
          >
            <ScrambleText text="VOID" trigger="once" />
            <br />
            <ScrambleText text="AGENCY." trigger="once" />
          </h1>
          <p className="mt-12 max-w-xl text-sm font-medium uppercase leading-relaxed tracking-[0.24em] text-[#f1efe8]/82">
            <RevealText text="TECHNICAL SEO SYSTEMS FOR SEARCH," delay={0.25} />
            <br />
            <RevealText text="AI VISIBILITY, AND CONVERSION." delay={0.4} />
          </p>
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-[#f1efe8]/58">
            Void Agency audits the technical layer behind search visibility: crawl paths, indexation, site architecture, internal links, structured data, performance, analytics, and AI crawler access. The goal is simple: make your site easier to find, understand, cite, and act on.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <CircleAuditButton id="method-hero-audit-btn" />
            <ArrowLink id="method-hero-cases-btn" href="#case-studies">VIEW CASE STUDIES</ArrowLink>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group">
            <VoidCrawlMap className="aspect-[900/700] w-full transition-transform duration-700 group-hover:-translate-y-1" />
            <div className="mt-4 grid grid-cols-2 border-y border-[#f1efe8]/12 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/46 md:grid-cols-4">
              {['CRAWL PATHS', 'INDEXATION', 'AI ACCESS', 'CONVERSION'].map((item) => (
                <span key={item} className="border-b border-[#f1efe8]/10 px-3 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">{item}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="overview" className="mx-auto max-w-[1480px] border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <ScrollReveal yOffset={18} blur={false}>
            <div className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#f1efe8]/42">OVERVIEW</div>
            <p className="max-w-[44rem] font-serif text-[clamp(2.8rem,5.4vw,6.2rem)] italic leading-[0.92] tracking-[-0.035em]">
              Search visibility is no longer only about ranking pages. It is about whether Google, AI systems, and customers can understand your site clearly enough to trust it.
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[#f1efe8]/58">
              Void Agency finds the structural problems that block that understanding, then turns them into a prioritized plan your team can implement.
            </p>
            <p className="mt-10 max-w-2xl border-t border-[#f1efe8]/12 pt-6 text-[10px] uppercase leading-loose tracking-[0.22em] text-[#f1efe8]/42">
              BUILT FOR FOUNDERS, GROWTH TEAMS, SAAS COMPANIES, ECOMMERCE BRANDS, LOCAL SERVICE BUSINESSES, AND TECHNICAL OPERATORS WHO NEED CLEAR DIAGNOSIS, PRACTICAL FIXES, AND MEASURABLE SEARCH IMPROVEMENT.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 border-y border-[#f1efe8]/12 md:grid-cols-2 xl:grid-cols-4 xl:border-y-0">
            {methodColumns.map((item, index) => (
              <div key={item.number}>
                <ScrollReveal delay={index * 0.06} yOffset={16} blur={false}>
                  <MethodColumnView item={item} />
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-b border-[#f1efe8]/12 px-4 py-16 md:px-8 lg:grid-cols-[0.36fr_0.64fr] xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <h2 className="mb-8 text-[10px] uppercase tracking-[0.36em] text-[#f1efe8]/45">HOW IT WORKS</h2>
          <p className="max-w-md text-base leading-relaxed text-[#f1efe8]/58">
            A technical SEO process built for accuracy, evidence, and implementation. Void Agency turns messy site data into a clear plan that teams can act on.
          </p>
          <div className="mt-9">
            <ArrowLink href="#how-it-works">VIEW TECH STACK</ArrowLink>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 border border-[#f1efe8]/12 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.title}>
              <ProcessStepCard step={step} index={index} />
            </div>
          ))}
        </div>
      </section>

      <section id="case-studies" className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-12 flex flex-col justify-between gap-6 border-b border-[#f1efe8]/12 pb-8 md:flex-row md:items-end">
          <h2 className="font-serif text-[clamp(4rem,8vw,9rem)] italic leading-none tracking-[-0.045em]">VOID IN ACTION</h2>
          <ArrowLink href="#case-studies">VIEW ALL CASE STUDIES</ArrowLink>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {caseStudies.map((study, index) => (
            <div key={study.title}>
              <ScrollReveal delay={index * 0.07} yOffset={18} blur={false}>
                <CaseStudyCard study={study} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 pb-16 md:px-8 xl:px-10 xl:pb-24">
        <ScrollReveal yOffset={18} blur={false}>
          <div className="grid grid-cols-1 gap-10 border border-[#f1efe8]/16 p-6 md:p-10 lg:grid-cols-[0.52fr_0.28fr_0.2fr] lg:items-center">
            <h2 className="font-serif text-[clamp(3.2rem,6.4vw,7.5rem)] italic leading-[0.88] tracking-[-0.04em]">
              Make your site easier to
              <br />
              crawl, understand, cite,
              <br />
              and convert.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-[#f1efe8]/58">
              Void Agency finds the technical problems holding back search visibility and turns them into a clear, prioritized action plan.
            </p>
            <div className="flex flex-wrap items-center gap-7 lg:justify-end">
              <CircleAuditButton id="method-footer-audit-btn" className="h-24 w-24 md:h-28 md:w-28" />
              <ArrowLink id="method-footer-discuss-btn" href="/#contact">DISCUSS YOUR SITE</ArrowLink>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-8 border-t border-[#f1efe8]/12 px-4 py-8 text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/54 md:grid-cols-[1fr_auto_1fr_auto] md:px-8 xl:px-10">
        <div>
          <div className="text-[#f1efe8]">VOID AGENCY</div>
          <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO · AI Search · Web Visibility</div>
        </div>
        <nav className="flex flex-wrap gap-5" id="method-footer-nav">
          <NavLink href="/#selected-works" id="method-footer-work">WORK</NavLink>
          <NavLink href="/method" id="method-footer-method" active>METHOD</NavLink>
          <NavLink href="/about" id="method-footer-about">ABOUT</NavLink>
          <NavLink href="/#contact" id="method-footer-contact">CONTACT</NavLink>
        </nav>
        <div className="md:text-right">
          © 2026 VOID AGENCY
          <br />
          ALL RIGHTS RESERVED
        </div>
        <a href="#top" id="method-back-to-top" aria-label="Back to top" data-cursor-text="TOP" className="hover-target h-9 w-9 rounded-full border border-[#f1efe8]/26 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]" />
      </footer>
    </main>
  );
}
