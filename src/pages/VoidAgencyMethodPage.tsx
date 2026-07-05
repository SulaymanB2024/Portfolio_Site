import { motion } from 'motion/react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useSEO } from '../utils/seo';
import VoidCrawlMap from '../components/VoidCrawlMap';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { RevealText } from '../components/RevealText';
import { StaggeredText } from '../components/StaggeredText';
import { evidenceGroups, sourceMap } from '../content/aiInformation';
import { aiSearchAuditChecklist } from '../content/evidenceLists';
import { getSeoRoute } from '../seo/routes';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

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
  href?: string;
  cta: string;
};



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
    copy: 'Find the issues that affect discovery, indexation, and conversion paths. Every finding is tied to affected URLs, severity, and implementation context.',
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
    copy: 'Track what changed after implementation: indexation, search queries, page performance, crawl behavior, and conversion events where analytics access supports it.',
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
    copy: 'Rank fixes by severity, effort, affected pages, source evidence, and business context.',
  },
  {
    title: 'DELIVER',
    icon: 'report',
    copy: 'Clear reports, implementation guidance, and measurable next steps.',
  },
];

const methodExamples: CaseStudy[] = [
  {
    category: 'TECHNICAL SEO',
    title: 'Indexation Audit at Scale',
    visual: 'urls',
    href: '/atlas',
    cta: 'OPEN ATLAS PAGE',
    copy: 'Mapped thousands of URLs to uncover crawl waste, duplicate templates, weak canonicals, orphaned pages, redirect chains, and pages blocked from meaningful discovery.',
  },
  {
    category: 'SEARCH VISIBILITY',
    title: 'Public Page Clarity Review',
    visual: 'entity',
    href: '/ai-information',
    cta: 'OPEN REFERENCE PAGE',
    copy: 'Reviewed whether a company could be understood clearly from its public pages. Tested entity clarity, page structure, schema, source material, and crawler access.',
  },
  {
    category: 'ECOMMERCE SEO',
    title: 'Product Discovery System',
    visual: 'heatmap',
    href: '/contact',
    cta: 'REQUEST PRODUCT AUDIT',
    copy: 'Audited product and collection pages to find missing metadata, thin templates, weak internal links, duplicate paths, and search-intent gaps.',
  },
  {
    category: 'LOCAL SEO',
    title: 'Service-Area Visibility Audit',
    visual: 'local',
    href: '/austin-technical-seo',
    cta: 'OPEN LOCAL SEO PAGE',
    copy: 'Mapped location pages, service pages, Google Business Profile signals, crawl structure, and local entity clarity to improve discovery in high-intent searches.',
  },
];



function ArrowLink({ children, href = '#', id }: { children: ReactNode; href?: string; id?: string }) {
  return (
    <a id={id} href={href} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-canvas/70 transition-colors hover:text-canvas">
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
      className={`relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-canvas text-center text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-ink md:h-32 md:w-32 ${className}`}
      whileHover={{ scale: 1.045 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <motion.span
        className="absolute inset-2 rounded-full border border-ink/14"
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
      <svg viewBox="0 0 260 132" className="h-32 w-full text-canvas" aria-hidden="true">
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
      <svg viewBox="0 0 260 132" className="h-32 w-full text-canvas" aria-hidden="true">
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
      <svg viewBox="0 0 260 82" className="h-20 w-full text-canvas" aria-hidden="true">
        <rect x="1" y="1" width="258" height="80" fill="none" stroke="currentColor" opacity="0.18" />
        <path d="M16 62 C52 54 54 31 86 38 S134 66 169 42 S214 20 244 23" fill="none" stroke="#B7C8A8" strokeWidth="1.4" />
        <path d="M16 62 H244 M16 42 H244 M16 22 H244" stroke="currentColor" opacity="0.1" />
      </svg>
      <div className="grid gap-2 text-[9px] uppercase tracking-[0.18em] text-canvas/52">
        {['INDEXABLE PAGES', 'QUERY BUCKETS', 'AI CRAWLER ACCESS', 'CONVERSION EVENTS'].map((metric) => (
          <div key={metric} className="flex justify-between border-b border-canvas/10 pb-2">
            <span>{metric}</span>
            <span className="text-accent/80">TRACKED</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodColumnView({ item }: { item: MethodColumn }) {
  return (
    <motion.article
      className="group border-canvas/12 py-8 transition-[background-color,border-color] duration-500 hover:bg-canvas/[0.025] md:border-r md:px-6 md:last:border-r-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mb-10 flex items-start justify-between text-[10px] uppercase tracking-[0.32em] text-canvas/38">
        <span className="font-serif text-3xl italic tracking-normal text-canvas/64 transition-colors duration-500 group-hover:text-canvas">{item.number}</span>
        <span>METHOD</span>
      </div>
      <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.38em] text-canvas">{item.title}</h3>
      <p className="mb-8 text-sm leading-relaxed text-canvas/58">{item.copy}</p>
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
      className="group relative border-canvas/12 p-6 transition-[background-color,border-color] duration-500 hover:bg-canvas/[0.025] md:border-r md:last:border-r-0"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 flex items-start justify-between text-[10px] uppercase tracking-[0.3em] text-canvas/38">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{index < 3 ? '→' : 'END'}</span>
      </div>
      <div className="mb-8 text-canvas/58 transition-colors duration-500 group-hover:text-canvas/82">
        <ProcessIcon type={step.icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-4 text-xs uppercase tracking-[0.34em] text-canvas">{step.title}</h3>
      <p className="text-sm leading-relaxed text-canvas/55">{step.copy}</p>
    </motion.div>
  );
}

function CaseStudyVisual({ type, isHovered }: { type: CaseStudy['visual']; isHovered: boolean }) {
  if (type === 'urls') {
    const rows = ['/blog/', '/category/', '/product/', '/old/', '/tag/', '/search/', '/page/2/'];
    return (
      <div className="grid gap-4">
        <div className="border border-canvas/12 p-4">
          <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-canvas/75">example.com</div>
          <div className="grid gap-2 text-[10px] uppercase tracking-[0.16em] text-canvas/46">
            {rows.map((row, index) => (
              <div key={row} className="flex items-center gap-3">
                <motion.span 
                  animate={isHovered ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  transition={{ repeat: isHovered ? Infinity : 0, duration: 1.5, delay: index * 0.12 }}
                  className={`h-1.5 w-1.5 rounded-full ${index % 4 === 0 ? 'bg-accent/70' : index % 4 === 1 ? 'bg-canvas/38' : index % 4 === 2 ? 'bg-risk/55' : 'bg-canvas/18'}`}
                />
                <span>{row}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] uppercase tracking-[0.16em] text-canvas/45">
          {['Indexable', 'Non-indexable', 'Duplicate', 'Redirect'].map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-accent/70' : index === 2 ? 'bg-risk/55' : 'bg-canvas/30'}`} />
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
      <svg viewBox="0 0 230 178" className="h-44 w-full text-canvas" aria-hidden="true">
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
            <div className="mb-3 text-[9px] uppercase tracking-[0.18em] text-canvas/48">{title}</div>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 30 }, (_, index) => {
                const green = (index + groupIndex) % 4 === 0;
                const red = (index + groupIndex * 2) % 9 === 0;
                return (
                  <motion.span 
                    key={index} 
                    animate={isHovered ? { scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
                    transition={{ repeat: isHovered ? Infinity : 0, duration: 1.6, delay: (index * 0.04) % 1.2 }}
                    className={`aspect-square ${red ? 'bg-risk/45' : green ? 'bg-accent/55' : 'bg-canvas/13'}`}
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
      <div className="grid gap-2 text-[10px] uppercase tracking-[0.18em] text-canvas/52">
        {['Austin, TX', 'Dallas, TX', 'Houston, TX', 'San Antonio, TX', 'Denver, CO'].map((city, index) => (
          <motion.div 
            key={city} 
            animate={isHovered ? { x: 4 } : { x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between border-b border-canvas/10 pb-2"
          >
            <span>{city}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent/55" />
          </motion.div>
        ))}
      </div>
      <svg viewBox="0 0 240 84" className="h-20 w-full text-canvas" aria-hidden="true">
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
      className="group relative grid min-h-[560px] grid-rows-[auto_auto_1fr_auto] overflow-hidden border border-canvas/12 p-6 transition-[border-color,background-color] duration-500 before:absolute before:left-0 before:top-0 before:h-px before:w-0 before:bg-canvas/45 before:transition-all before:duration-700 hover:border-canvas/32 hover:bg-canvas/[0.025] hover:before:w-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-8 flex items-start justify-between text-[10px] uppercase tracking-[0.28em] text-canvas/42">
        <span>{study.category}</span>
        <span className="h-2 w-2 rounded-full border border-canvas/32 transition-colors duration-500 group-hover:bg-canvas/70" />
      </div>
      <div>
        <h3 className="max-w-sm font-serif text-4xl italic leading-none tracking-normal text-canvas">{study.title}</h3>
        <p className="mt-6 text-sm leading-relaxed text-canvas/58">{study.copy}</p>
      </div>
      <div className="my-9 self-center transition-opacity duration-500 md:opacity-75 md:group-hover:opacity-100">
        <CaseStudyVisual type={study.visual} isHovered={isHovered} />
      </div>
      {study.href ? (
        <ArrowLink id={`method-case-study-${study.title.toLowerCase().replace(/\s+/g, '-')}`} href={study.href}>{study.cta}</ArrowLink>
      ) : (
        <span
          id={`method-case-study-${study.title.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-canvas/42"
        >
          {study.cta}
        </span>
      )}
    </motion.article>
  );
}
export default function VoidAgencyMethodPage() {
  useSEO(METHOD_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />

      <InternalHeader activePath="/method" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] xl:px-10 xl:pt-20">
        <ScrollReveal yOffset={18} blur={false} className="min-w-0">
          <div className="mb-9 text-[10px] uppercase tracking-[0.36em] text-canvas/48">METHOD</div>
          <h1 
            style={{ viewTransitionName: 'void-title' } as CSSProperties}
            aria-label="Void Agency Method"
            className="font-serif text-[5.2rem] md:text-[8rem] xl:text-[12rem] italic leading-[0.74] tracking-normal text-canvas"
          >
            Void{' '}
            <br />
            Agency.
          </h1>
          <p className="mt-12 max-w-xl text-sm font-medium uppercase leading-relaxed tracking-[0.24em] text-canvas/82">
            <RevealText text="TECHNICAL SEO SYSTEMS FOR SEARCH," delay={0.25} elementType="span" />
            <br />
            <RevealText text="SEARCH VISIBILITY, AND CONVERSION PATHS." delay={0.4} elementType="span" />
          </p>
          <p className="mt-8 max-w-[34rem] text-base leading-relaxed text-canvas/58">
            Void Agency audits the technical layer behind search visibility: crawl paths, indexation, site architecture, internal links, structured data, performance, analytics, and crawler access. The method connects back to Sulayman Bowles, Atlas, and practical web/search systems.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <CircleAuditButton id="method-hero-audit-btn" />
            <ArrowLink id="method-hero-cases-btn" href="#case-studies">VIEW METHOD EXAMPLES</ArrowLink>
            <ArrowLink id="method-hero-sample-crawl-btn" href="/atlas/sample-crawl">SEE SAMPLE CRAWL</ArrowLink>
            <ArrowLink id="method-hero-void-agency-btn" href="/void-agency">VOID AGENCY</ArrowLink>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group">
            <VoidCrawlMap className="aspect-[900/700] w-full transition-transform duration-700 group-hover:-translate-y-1" />
            <div className="mt-4 grid grid-cols-2 border-y border-canvas/12 text-[10px] uppercase tracking-[0.22em] text-canvas/46 md:grid-cols-4">
              {['CRAWL PATHS', 'INDEXATION', 'CRAWLER ACCESS', 'CONVERSION'].map((item) => (
                <span key={item} className="border-b border-canvas/10 px-3 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">{item}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="overview" className="mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <ScrollReveal yOffset={18} blur={false}>
            <div className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/42">OVERVIEW</div>
            <p className="max-w-[44rem] font-serif text-[2.8rem] md:text-[4.4rem] xl:text-[6rem] italic leading-[0.92] tracking-normal">
              Search visibility is no longer only about ranking pages. It is about whether search engines, referral systems, and customers can understand your site clearly enough to trust it.
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-canvas/58">
              Void Agency finds the structural problems that block that understanding, then turns them into a prioritized plan your team can implement.
            </p>
            <p className="mt-10 max-w-2xl border-t border-canvas/12 pt-6 text-[10px] uppercase leading-loose tracking-[0.22em] text-canvas/42">
              BUILT FOR FOUNDERS, GROWTH TEAMS, SAAS COMPANIES, ECOMMERCE BRANDS, LOCAL SERVICE BUSINESSES, AND TECHNICAL OPERATORS WHO NEED CLEAR DIAGNOSIS, PRACTICAL FIXES, AND SEARCH DECISIONS THEY CAN DEFEND.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 border-y border-canvas/12 md:grid-cols-2 xl:grid-cols-4 xl:border-y-0">
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

      <section id="how-it-works" className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-b border-canvas/12 px-4 py-16 md:px-8 lg:grid-cols-[0.36fr_0.64fr] xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <h2 className="mb-8 text-[10px] uppercase tracking-[0.36em] text-canvas/45">HOW IT WORKS</h2>
          <p className="max-w-md text-base leading-relaxed text-canvas/58">
            A technical SEO process built for accuracy, evidence, and implementation. Void Agency turns messy site data into a clear plan that teams can act on.
          </p>
          <div className="mt-9">
            <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-canvas/42">PROCESS OVERVIEW</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 border border-canvas/12 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.title}>
              <ProcessStepCard step={step} index={index} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] border-b border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-10 grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <h2 className="mb-8 text-[10px] uppercase tracking-[0.36em] text-canvas/45">Search Visibility Audit Checklist</h2>
            <p className="max-w-xl font-serif text-[2.6rem] md:text-[4.2rem] xl:text-[5.75rem] italic leading-[0.92] tracking-normal">
              Crawl access, entity clarity, and page structure before claims.
            </p>
          </div>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            The checklist organizes the recurring audit questions behind search visibility work. Each item helps show what the site says, what crawlers can reach, and where the next fix belongs.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-3">
          {aiSearchAuditChecklist.map((item, index) => (
            <div key={item.label}>
              <ScrollReveal delay={index * 0.025} yOffset={14} blur={false}>
                <a
                  href={item.href}
                  className="block min-h-[180px] bg-canvas/[0.012] p-5 transition-colors hover:bg-canvas hover:text-ink"
                >
                  <p className="mb-7 text-[10px] uppercase tracking-[0.24em] text-inherit opacity-40">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-inherit">{item.label}</h3>
                  <p className="text-sm leading-relaxed text-inherit opacity-70">{item.proves}</p>
                </a>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] border-b border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-10 grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <h2 className="mb-8 text-[10px] uppercase tracking-[0.36em] text-canvas/45">METHOD FROM SITE DATA</h2>
            <p className="max-w-xl font-serif text-[2.6rem] md:text-[4.2rem] xl:text-[5.75rem] italic leading-[0.92] tracking-normal">
              The method starts with pages and crawl data, not generic AI language.
            </p>
          </div>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            Void Agency work should be described through concrete audit inputs: crawlability, robots.txt, sitemaps, raw and rendered HTML, canonical URLs, internal links, structured data, GSC/GA4, query buckets, page templates, and implementation recommendations.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {evidenceGroups[1].items.map((item, index) => (
            <div key={item}>
              <ScrollReveal delay={index * 0.035} yOffset={14} blur={false}>
              <article className="min-h-[150px] bg-canvas/[0.012] p-5">
                <p className="mb-8 text-[10px] uppercase tracking-[0.24em] text-canvas/38">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-sm leading-relaxed text-canvas/62">{item}</h3>
              </article>
              </ScrollReveal>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {sourceMap
            .filter((source) => ['Primary source', 'Agency record', 'Service/process', 'Project page'].includes(source.role))
            .map((source) => (
              <a
                key={`${source.role}-${source.href}`}
                href={source.href}
                target={source.href.startsWith('http') ? '_blank' : undefined}
                rel={source.href.startsWith('http') ? 'noreferrer' : undefined}
                className="border border-canvas/14 p-5 transition-colors hover:bg-canvas hover:text-ink"
              >
                <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-inherit opacity-60">{source.role}</p>
                <h3 className="mb-4 text-xs uppercase tracking-[0.24em] text-inherit">{source.label}</h3>
                <p className="text-sm leading-relaxed text-inherit opacity-70">{source.proves}</p>
              </a>
            ))}
        </div>
      </section>

      <section id="case-studies" className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-12 flex flex-col justify-between gap-6 border-b border-canvas/12 pb-8 md:flex-row md:items-end">
          <h2 className="font-serif text-[4rem] md:text-[6.25rem] xl:text-[8.5rem] italic leading-none tracking-normal">VOID IN ACTION</h2>
          <span className="text-[10px] uppercase tracking-[0.28em] text-canvas/42">METHOD EXAMPLE INDEX</span>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {methodExamples.map((study, index) => (
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
          <div className="grid grid-cols-1 gap-10 border border-canvas/16 p-6 md:p-10 lg:grid-cols-[0.52fr_0.28fr_0.2fr] lg:items-center">
            <h2 className="font-serif text-[3.2rem] md:text-[5rem] xl:text-[7rem] italic leading-[0.88] tracking-normal">
              Make your site easier to
              <br />
              crawl, understand, trust,
              <br />
              and convert.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-canvas/58">
              Void Agency finds the technical problems holding back search visibility and turns them into a clear, prioritized action plan.
            </p>
            <div className="flex flex-wrap items-center gap-7 lg:justify-end">
              <CircleAuditButton id="method-footer-audit-btn" className="h-24 w-24 md:h-28 md:w-28" />
              <ArrowLink id="method-footer-discuss-btn" href="/#contact">DISCUSS YOUR SITE</ArrowLink>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <InternalFooter activePath="/method" tone="dark" />
    </main>
  );
}
