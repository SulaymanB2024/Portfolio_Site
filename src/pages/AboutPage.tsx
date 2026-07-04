import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState, useRef, type ReactNode } from 'react';
import VisibilitySystemMap from '../components/VisibilitySystemMap';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { StaggeredText } from '../components/StaggeredText';
import { ScrambleText } from '../components/ScrambleText';
import { identityReconciliation, sourceMap } from '../content/aiInformation';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import InternalHeader from '../components/InternalHeader';
import InternalFooter from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

const ABOUT_SEO = getSeoRoute('/about')!;

const principles = [
  ['CHECK THE INPUTS', 'Decisions should come from the material, not from a polished summary.'],
  ['SYSTEMS OVER CHECKLISTS', 'I build durable systems that compound over time.'],
  ['SEARCH IS STRUCTURE', 'Visibility depends on whether a site can be crawled, understood, and trusted.'],
  ['IMPACT > ACTIVITY', 'The goal is measurable movement, not more output.'],
];

const experience = [
  {
    role: 'FOUNDER',
    meta: 'VOID Agency · Dec 2025 — Present',
    copy: 'Built an SEO and web systems practice around technical audits, website builds, local search strategy, and search visibility work, with $50K+ collected revenue.',
    details: ['Technical Audits', 'Next.js & Astro', 'Search Visibility']
  },
  {
    role: 'AI PRODUCT MANAGER INTERN',
    meta: 'Chegg · Office of the Chief Product Officer · May 2026 — Aug 2026',
    copy: 'Working on AI product strategy, research, competitive analysis, user workflows, prototype review, and AI-enabled student experiences.',
    details: ['Chat UX', 'Competitive Mapping', 'Research Workflows']
  },
  {
    role: 'TECHNICAL SEO ANALYTICS',
    meta: 'Private SEO engagement · May 2026 — Present',
    copy: 'Supporting website launch analytics, GA4, Google Search Console, SEO baselines, traffic analysis, keyword performance, and prioritized recommendations.',
    details: ['GA4 / GSC Analytics', 'Launch Health Audits', 'Crawl Management']
  },
  {
    role: 'STUDENT ASSOCIATE',
    meta: 'Jon Brumley Texas Venture Labs · Sep 2025 — Present',
    copy: 'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.',
    details: ['Market Discovery', 'Financial Modeling', 'GTM Business Strategy']
  },
];

const skills = [
  ['TECHNICAL SEO', 'Built', 'Screaming Frog, crawl budget, canonical mapping, hreflang'],
  ['SEARCH VISIBILITY', 'Shipped', 'crawler access, structured data, entity clarity, answer-ready pages'],
  ['AI PRODUCT STRATEGY', 'Used in client work', 'Prompt review, RAG workflows, UX mapping, prototypes'],
  ['CRAWL & INDEXATION', 'Built', 'Log-file analysis, server headers, render audits, XML sitemaps'],
  ['DATA ANALYSIS', 'Shipped', 'GA4 APIs, GSC API, Python scripts, SQLite databases'],
  ['PYTHON & AUTOMATION', 'Built', 'Pandas, Beautiful Soup, Playwright scrapers, scheduled checks'],
  ['FINANCIAL MODELING', 'Working knowledge', 'DCF valuation, unit economics, SaaS metrics, GTM models'],
];

const workCards = [
  ['TECHNICAL SEO\nSYSTEMS', 'Crawlability, indexation, metadata, links, and performance.', 'sitemap'],
  ['SEARCH\nVISIBILITY', 'Make brands easier to crawl, understand, and trust.', 'search'],
  ['AI PRODUCT\nSTRATEGY', 'Research, workflows, prototypes, and student AI experiences.', 'cube'],
  ['MARKETS & SEARCH\nANALYTICS', 'Market models, GA4/GSC analysis, and decision-ready recommendations.', 'bars'],
];

const metrics = [
  ['VOID AGENCY', 'Technical SEO and web systems practice'],
  ['SCRAPER ATLAS', 'Python + SQLite audit console'],
  ['CHEGG', 'AI product strategy'],
  ['GA4 + GSC', 'Search analytics and launch tracking'],
  ['TEXAS VENTURE LABS', 'Market validation and financial models'],
];



function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-9 text-[0.72rem] uppercase tracking-[0.28em] text-canvas/46">{children}</h2>;
}

// Custom icons using clean editorial SVGs
function WorkIcon({ type, isHovered }: { type: string; isHovered: boolean }) {
  const common = 'fill-none stroke-current';
  if (type === 'sitemap') {
    return (
      <svg className="w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 6v6M20 28v6M6 20h6M28 20h6" className={`${common}`} strokeWidth="1" opacity={isHovered ? 0.9 : 0.45} />
        <rect x="17" y="12" width="6" height="16" className={`${common}`} strokeWidth="1" opacity={isHovered ? 1 : 0.65} />
        <rect x="12" y="17" width="16" height="6" className={`${common}`} strokeWidth="1" opacity={isHovered ? 1 : 0.65} />
      </svg>
    );
  }
  if (type === 'search') {
    return (
      <svg className="w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="17" cy="17" r="8" className={`${common}`} strokeWidth="1" opacity={isHovered ? 1 : 0.55} />
        <line x1="23" y1="23" x2="31" y2="31" className={`${common}`} strokeWidth="1" opacity={isHovered ? 0.9 : 0.4} />
        <path d="M12 17h10M17 12v10" className={`${common}`} strokeWidth="0.8" opacity={isHovered ? 0.85 : 0.3} />
      </svg>
    );
  }
  if (type === 'cube') {
    return (
      <svg className="w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 6 L32 13 L32 27 L20 34 L8 27 L8 13 Z" className={`${common}`} strokeWidth="1" opacity={isHovered ? 0.95 : 0.55} />
        <path d="M20 6 L20 34 M8 13 L20 20 L32 13" className={`${common}`} strokeWidth="0.9" opacity={isHovered ? 0.8 : 0.4} />
      </svg>
    );
  }
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="7" y="10" width="26" height="20" className={`${common}`} strokeWidth="1" opacity={isHovered ? 0.9 : 0.5} />
      <line x1="13" y1="24" x2="13" y2="16" className={`${common}`} strokeWidth="1.2" opacity={isHovered ? 1 : 0.65} />
      <line x1="20" y1="24" x2="20" y2="13" className={`${common}`} strokeWidth="1.2" opacity={isHovered ? 1 : 0.65} />
      <line x1="27" y1="24" x2="27" y2="19" className={`${common}`} strokeWidth="1.2" opacity={isHovered ? 1 : 0.65} />
    </svg>
  );
}

function SkillBars() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div className="space-y-6">
      {skills.map(([label, level, details], index) => {
        const isHovered = hoveredIndex === index;
        return (
          <div 
            key={label as string}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group cursor-pointer"
          >
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-canvas/58 transition-colors duration-300 group-hover:text-canvas">
              <span>{label as string}</span>
              <span>{level as string}</span>
            </div>
            <div className="relative h-px bg-canvas/14 transition-colors duration-300 group-hover:bg-canvas/28">
              <motion.div
                className="absolute left-0 top-0 h-px w-full origin-left bg-canvas/52 group-hover:bg-accent transition-colors duration-300"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.8, delay: 0.08 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <motion.div
              initial={false}
              animate={{ 
                height: isHovered ? "auto" : 0, 
                opacity: isHovered ? 1 : 0,
                marginTop: isHovered ? 8 : 0
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden text-[9px] uppercase tracking-[0.16em] text-canvas/45 font-sans"
            >
              {details as string}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function WorkCard({ title, copy, icon }: { title: string; copy: string; icon: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <article 
      className="group min-h-[300px] border border-canvas/12 p-6 transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-canvas/34 hover:bg-canvas/[0.025]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 text-canvas/58 transition-colors group-hover:text-canvas/82">
        <WorkIcon type={icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-6 whitespace-pre-line text-xs uppercase leading-relaxed tracking-[0.3em]">{title}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-canvas/58">{copy}</p>
    </article>
  );
}

function PrincipleCard({ title, copy }: { title: string; copy: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="group grid grid-cols-[34px_1fr] gap-4 border-b border-canvas/10 pb-7 last:border-b-0 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="mt-2 h-px bg-canvas/42 transition-all duration-500 group-hover:w-8 group-hover:bg-canvas/75" />
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-canvas transition-colors group-hover:text-white">
          {isHovered ? <ScrambleText text={title} /> : title}
        </h3>
        <p className="text-sm leading-relaxed text-canvas/56 transition-colors group-hover:text-canvas/82">{copy}</p>
      </div>
    </div>
  );
}

function ExperienceCard({ role, meta, copy, details }: { role: string; meta: string; copy: string; details: string[] }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <article 
      className="relative mb-10 last:mb-0 cursor-pointer group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="absolute -left-[34px] top-1 h-3.5 w-3.5 rounded-full border bg-ink z-10"
        initial={{ scale: 0.8, borderColor: 'rgba(241,239,232,0.3)' }}
        whileInView={{ 
          scale: 1, 
          borderColor: isHovered ? '#b7c8a8' : 'rgba(241,239,232,0.6)',
          backgroundColor: isHovered ? '#b7c8a8' : '#080807'
        }}
        viewport={{ once: false, margin: "-15% 0px -15% 0px" }}
        animate={{ 
          scale: isHovered ? 1.3 : 1, 
          borderColor: isHovered ? '#b7c8a8' : 'rgba(241,239,232,0.6)',
          backgroundColor: isHovered ? '#b7c8a8' : '#080807',
          boxShadow: isHovered ? '0 0 10px rgba(183,200,168,0.7)' : '0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.25 }}
      />
      <h3 className="mb-2 text-[10px] uppercase tracking-[0.24em] text-canvas transition-colors group-hover:text-white">{role}</h3>
      <div className="mb-4 text-[10px] uppercase leading-relaxed tracking-[0.18em] text-canvas/44">{meta}</div>
      <p className="text-sm leading-relaxed text-canvas/58 transition-colors group-hover:text-canvas/82">{copy}</p>
      <motion.div 
        initial={false}
        animate={{ 
          height: isHovered ? "auto" : 0, 
          opacity: isHovered ? 1 : 0,
          marginTop: isHovered ? 12 : 0
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden flex flex-wrap gap-2"
      >
        {details.map((tag) => (
          <span 
            key={tag} 
            className="border border-canvas/14 px-2 py-0.5 text-[8px] uppercase tracking-[0.18em] text-canvas/54"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </article>
  );
}

function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  const scaleY = useSpring(scrollYProgress, { damping: 25, stiffness: 200, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative pl-7">
      {/* Background track line */}
      <div className="absolute left-0 top-1 bottom-1 w-px bg-canvas/12" />
      
      {/* Animated progress indicator line */}
      <motion.div 
        className="absolute left-0 top-1 w-px bg-accent origin-top"
        style={{ scaleY, height: '98%', transformOrigin: 'top' }}
      />

      {experience.map((item) => (
        <div key={item.role}>
          <ExperienceCard 
            role={item.role} 
            meta={item.meta} 
            copy={item.copy} 
            details={item.details} 
          />
        </div>
      ))}
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const subInfos: Record<string, string> = {
    LOCATION: '30.2672° N, 97.7431° W\nAustin Metro',
    EDUCATION: 'BBA Candidate (Finance / AI Systems)\nStudent Associate @ TVL',
    AVAILABILITY: 'Next Project Intake: Q3/Q4 2026\nInquire: sulayman.bowles@gmail.com'
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden border-b border-canvas/12 py-8 px-6 md:border-b-0 md:border-r last:border-r-0 cursor-pointer transition-all duration-500 hover:bg-canvas/[0.015] group"
    >
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-canvas/54 transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-0 w-[1px] bg-canvas/22 transition-all duration-500 group-hover:h-full" />

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-[0.26em] text-canvas/42 transition-colors duration-300 group-hover:text-canvas/90">
          {isHovered ? <ScrambleText text={label} /> : label}
        </h3>
        {label === 'AVAILABILITY' && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
          </span>
        )}
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-canvas/66 transition-colors duration-300 group-hover:text-canvas/90 mb-5 min-h-[3.2rem]">
        {value}
      </p>

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0.28, y: isHovered ? 0 : 2 }}
        transition={{ duration: 0.3 }}
        className="font-sans text-[8.5px] uppercase leading-relaxed tracking-[0.16em] text-canvas/34 group-hover:text-canvas/62 whitespace-pre-line"
      >
        {subInfos[label]}
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  useSEO(ABOUT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />

      <InternalHeader activePath="/about" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-102px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] xl:px-10 xl:pt-20">
        <div className="min-w-0 self-center">
          <div className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/45">ABOUT ME</div>
          <h1
            aria-label="I build systems for visibility."
            className="font-serif text-[3.8rem] md:text-[5.6rem] xl:text-[7rem] italic leading-[0.92] tracking-normal"
          >
            <span className="block">I build systems </span>
            <span className="block italic">for visibility.</span>
          </h1>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-canvas/62">
            <p>I study business at UT Austin and spend most of my working time building practical systems: Atlas for technical SEO audits, Void Agency for client work, and research notes for markets and search problems I want to understand better.</p>
            <p>I like messy inputs: crawl exports, broken templates, search data, financial assumptions, and half-finished product logic. The work is making those inputs clear enough that someone can decide what to fix, ignore, or build next.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.26em] text-canvas/58">
            <a
              href="/simple"
              className="underline decoration-canvas/22 underline-offset-4 transition-colors hover:text-canvas"
            >
              Read the book
            </a>
            <a
              href="/void-agency"
              className="underline decoration-canvas/22 underline-offset-4 transition-colors hover:text-canvas"
            >
              Void Agency technical SEO practice
            </a>
          </div>
        </div>

        <div className="w-full self-center">
          <div className="group">
            <VisibilitySystemMap className="aspect-[1000/620] w-full transition-transform duration-700 group-hover:-translate-y-1" />
            <div className="mt-4 flex flex-col gap-3 border-b border-canvas/12 pb-4 text-[10px] uppercase tracking-[0.24em] text-canvas/44 sm:flex-row sm:items-center sm:justify-between">
              <span>SIGNAL INPUTS: CRAWL / ENTITY / MARKET</span>
              <span>OUTPUT: VISIBILITY SYSTEM</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-y border-canvas/12 px-4 py-16 md:px-8 lg:grid-cols-3 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <SectionLabel>PRINCIPLES</SectionLabel>
          <div className="space-y-9">
            {principles.map(([title, copy]) => (
              <div key={title}>
                <PrincipleCard title={title} copy={copy} />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={18} blur={false} delay={0.08}>
          <SectionLabel>EXPERIENCE</SectionLabel>
          <ExperienceTimeline />
        </ScrollReveal>

        <ScrollReveal yOffset={18} blur={false} delay={0.16}>
          <SectionLabel>SKILLS</SectionLabel>
          <SkillBars />
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <SectionLabel>WHAT I WORK ON</SectionLabel>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workCards.map(([title, copy, icon], index) => (
            <div key={title}>
              <ScrollReveal delay={index * 0.06} yOffset={16} blur={false}>
                <WorkCard title={title} copy={copy} icon={icon} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-10 max-w-3xl">
          <SectionLabel>SUPPORTING LINKS</SectionLabel>
          <p className="text-base leading-relaxed text-canvas/58">
            This site is the main explanation of the work. The links below are the supporting record: code, profiles, Atlas, Void Agency, markets research, and the current resume.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {sourceMap.slice(0, 14).map((source, index) => (
            <div key={`${source.role}-${source.href}`}>
              <ScrollReveal delay={index * 0.025} yOffset={14} blur={false}>
              <a
                href={source.href}
                target={source.href.startsWith('http') ? '_blank' : undefined}
                rel={source.href.startsWith('http') ? 'noreferrer' : undefined}
                className="block min-h-[240px] bg-canvas/[0.012] p-5 transition-colors hover:bg-canvas/[0.035]"
              >
                <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-canvas/42">{source.role}</p>
                <h3 className="mb-5 text-xs uppercase leading-relaxed tracking-[0.26em] text-canvas">{source.label}</h3>
                <p className="text-sm leading-relaxed text-canvas/56">{source.proves}</p>
              </a>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section id="identity-reconciliation" className="mx-auto max-w-[1480px] border-b border-canvas/12 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false} className="mb-10 max-w-4xl">
          <SectionLabel>HISTORICAL SOURCE CONTEXT</SectionLabel>
          <p className="text-base leading-relaxed text-canvas/62">
            {identityReconciliation.copy}
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-2 xl:grid-cols-7">
          {identityReconciliation.links.map((link, index) => (
            <div key={link.href}>
              <ScrollReveal delay={index * 0.025} yOffset={14} blur={false}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="block min-h-[160px] bg-canvas/[0.012] p-5 transition-colors hover:bg-canvas/[0.035]"
                >
                  <h3 className="mb-5 text-xs uppercase leading-relaxed tracking-[0.26em] text-canvas">{link.label}</h3>
                  <p className="text-sm leading-relaxed text-canvas/56">{link.description}</p>
                </a>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 pb-16 md:px-8 xl:px-10 xl:pb-24">
        <div className="grid grid-cols-1 border border-canvas/14 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map(([value, label]) => (
            <motion.div
              key={value}
              className="group border-b border-canvas/12 p-6 transition-colors duration-500 last:border-b-0 hover:bg-canvas/[0.025] md:border-r md:last:border-r-0 xl:border-b-0"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="mb-5 font-serif text-4xl italic leading-none tracking-normal text-canvas">{value}</div>
              <p className="text-[10px] uppercase leading-relaxed tracking-[0.22em] text-canvas/48">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-y border-canvas/12 px-4 py-16 md:px-8 lg:grid-cols-[0.48fr_0.52fr] xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <div className="mb-6 font-serif text-7xl italic leading-none text-canvas/32">“</div>
          <blockquote className="font-serif text-[3rem] md:text-[5rem] xl:text-[6.75rem] italic leading-[0.88] tracking-normal">
            I build systems where search,
            <br />
            data, and product judgment
            <br />
            turn into visibility.
          </blockquote>
        </ScrollReveal>
        <div className="grid grid-cols-1 border-canvas/12 md:grid-cols-3 md:border-l">
          {[
            ['LOCATION', 'Austin, Texas'],
            ['EDUCATION', 'UT Austin · McCombs\nSchool of Business'],
            ['AVAILABILITY', 'Open for select projects, partnerships, and technical SEO work.'],
          ].map(([label, value], index) => (
            <div key={label}>
              <ScrollReveal delay={index * 0.06} yOffset={16} blur={false}>
                <MetaCard label={label} value={value} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <InternalFooter activePath="/about" tone="dark" />
    </main>
  );
}
