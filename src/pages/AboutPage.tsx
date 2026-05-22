import { motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import VisibilitySystemMap from '../components/VisibilitySystemMap';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollReveal } from '../components/ScrollReveal';
import { ShutterWipe } from '../components/ShutterWipe';
import { SmoothCursor } from '../components/SmoothCursor';
import { RevealText } from '../components/RevealText';
import { StaggeredText } from '../components/StaggeredText';
import { ScrambleText } from '../components/ScrambleText';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ABOUT_SEO = getSeoRoute('/about')!;

const principles = [
  ['EVIDENCE FIRST', 'Decisions should be driven by data, not assumptions.'],
  ['SYSTEMS OVER CHECKLISTS', 'I build durable systems that compound over time.'],
  ['SEARCH IS STRUCTURE', 'Visibility depends on whether a site can be crawled, understood, and trusted.'],
  ['IMPACT > ACTIVITY', 'The goal is measurable movement, not more output.'],
];

const experience = [
  {
    role: 'FOUNDER',
    meta: 'VOID Agency · Dec 2025 — Present',
    copy: 'Built an SEO and web systems agency generating $50K+ in collected revenue through technical SEO audits, website builds, local search strategy, and AI-search visibility work.',
    details: ['Technical Audits', 'Next.js & Astro', 'LLM Search Visibility']
  },
  {
    role: 'AI PRODUCT MANAGER INTERN',
    meta: 'Chegg · Office of the Chief Product Officer · May 2026 — Aug 2026',
    copy: 'Working on AI product strategy, research, competitive analysis, user workflows, prototype review, and AI-enabled student experiences.',
    details: ['AI Chat UX', 'Competitive Mapping', 'LLM Workflows']
  },
  {
    role: 'SEO & DIGITAL MARKETING ANALYTICS INTERN',
    meta: 'B2B Semiconductor Company · May 2026 — Present',
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
  ['TECHNICAL SEO', 90, 'Screaming Frog, Crawl Budget, Canonical Mapping, Hreflang'],
  ['AI SEARCH VISIBILITY', 87, 'LLM Index Optimization, Schema Graphs, Citation Relevance'],
  ['AI PRODUCT STRATEGY', 83, 'Prompt Design, RAG Frameworks, UX Workflows, Prototyping'],
  ['CRAWL & INDEXATION', 82, 'Log File Analysis, Server Headers, Render Audits, XML Sitemaps'],
  ['DATA ANALYSIS', 76, 'GA4 APIs, GSC API, Python Scripts, SQLite Databases'],
  ['PYTHON & AUTOMATION', 83, 'Pandas, Beautiful Soup, Playwright Scrapers, Automated Crons'],
  ['FINANCIAL MODELING', 78, 'DCF Valuations, Unit Economics, SaaS Metrics, GTM Models'],
];

const workCards = [
  ['TECHNICAL SEO\nSYSTEMS', 'Crawlability, indexation, metadata, links, and performance.', 'sitemap'],
  ['AI SEARCH\nVISIBILITY', 'Make brands easier to retrieve, cite, and trust.', 'search'],
  ['AI PRODUCT\nSTRATEGY', 'Research, workflows, prototypes, and student AI experiences.', 'cube'],
  ['FINANCE & SEARCH\nANALYTICS', 'Market models, GA4/GSC analysis, and decision-ready recommendations.', 'bars'],
];

const metrics = [
  ['$50K+', 'Collected revenue through VOID Agency'],
  ['SCRAPER ATLAS', 'Python + SQLite audit console'],
  ['CHEGG', 'AI product strategy'],
  ['GA4 + GSC', 'Search analytics and launch tracking'],
  ['TEXAS VENTURE LABS', 'Market validation and financial models'],
];

function DarkNoise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.055]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 22% 28%, rgba(241,239,232,0.24) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 64%, rgba(241,239,232,0.16) 0 1px, transparent 1.7px)',
        backgroundSize: '17px 21px, 25px 31px',
      }}
    />
  );
}

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

function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-9 text-[0.72rem] uppercase tracking-[0.28em] text-[#f1efe8]/46">{children}</h2>;
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
      {skills.map(([label, value, details], index) => {
        const isHovered = hoveredIndex === index;
        return (
          <div 
            key={label as string}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group cursor-pointer"
          >
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/58 transition-colors duration-300 group-hover:text-[#f1efe8]">
              <span>{label as string}</span>
              <span>{value as number}%</span>
            </div>
            <div className="relative h-px bg-[#f1efe8]/14 transition-colors duration-300 group-hover:bg-[#f1efe8]/24">
              <motion.div
                className="absolute left-0 top-0 h-px origin-left bg-[#f1efe8]/38 group-hover:bg-[#f1efe8]/70 transition-colors duration-300"
                style={{ width: `${value}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 1.1, delay: 0.08 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-[#f1efe8]/70 bg-[#080807] group-hover:border-[#f1efe8] group-hover:scale-110 transition-[border-color,transform] duration-300"
                style={{ left: `calc(${value}% - 5px)` }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.7, delay: 0.42 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
              className="overflow-hidden text-[9px] uppercase tracking-[0.16em] text-[#f1efe8]/45 font-sans"
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
      className="group min-h-[300px] border border-[#f1efe8]/12 p-6 transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-[#f1efe8]/34 hover:bg-[#f1efe8]/[0.025]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-12 text-[#f1efe8]/58 transition-colors group-hover:text-[#f1efe8]/82">
        <WorkIcon type={icon} isHovered={isHovered} />
      </div>
      <h3 className="mb-6 whitespace-pre-line text-xs uppercase leading-relaxed tracking-[0.3em]">{title}</h3>
      <p className="max-w-xs text-sm leading-relaxed text-[#f1efe8]/58">{copy}</p>
    </article>
  );
}

function PrincipleCard({ title, copy }: { title: string; copy: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="group grid grid-cols-[34px_1fr] gap-4 border-b border-[#f1efe8]/10 pb-7 last:border-b-0 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="mt-2 h-px bg-[#f1efe8]/42 transition-all duration-500 group-hover:w-8 group-hover:bg-[#f1efe8]/75" />
      <div>
        <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8] transition-colors group-hover:text-white">
          {isHovered ? <ScrambleText text={title} /> : title}
        </h3>
        <p className="text-sm leading-relaxed text-[#f1efe8]/56 transition-colors group-hover:text-[#f1efe8]/82">{copy}</p>
      </div>
    </div>
  );
}

function ExperienceCard({ role, meta, copy, details }: { role: string; meta: string; copy: string; details: string[] }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <article 
      className="relative mb-10 last:mb-0 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="absolute -left-[34px] top-1 h-3.5 w-3.5 rounded-full border bg-[#080807]"
        animate={{ 
          scale: isHovered ? 1.25 : 1, 
          borderColor: isHovered ? '#f1efe8' : 'rgba(241,239,232,0.6)',
          backgroundColor: isHovered ? '#f1efe8' : '#080807'
        }}
        transition={{ duration: 0.25 }}
      />
      <h3 className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8] transition-colors group-hover:text-white">{role}</h3>
      <div className="mb-4 text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#f1efe8]/44">{meta}</div>
      <p className="text-sm leading-relaxed text-[#f1efe8]/58 transition-colors group-hover:text-[#f1efe8]/82">{copy}</p>
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
            className="border border-[#f1efe8]/14 px-2 py-0.5 text-[8px] uppercase tracking-[0.18em] text-[#f1efe8]/54"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </article>
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
      className="relative overflow-hidden border-b border-[#f1efe8]/12 py-8 px-6 md:border-b-0 md:border-r last:border-r-0 cursor-pointer transition-all duration-500 hover:bg-[#f1efe8]/[0.015] group"
    >
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-[#f1efe8]/54 transition-all duration-500 group-hover:w-full" />
      <div className="absolute bottom-0 right-0 h-0 w-[1px] bg-[#f1efe8]/22 transition-all duration-500 group-hover:h-full" />

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-[0.26em] text-[#f1efe8]/42 transition-colors duration-300 group-hover:text-[#f1efe8]/90">
          {isHovered ? <ScrambleText text={label} /> : label}
        </h3>
        {label === 'AVAILABILITY' && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b7c8a8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#b7c8a8]"></span>
          </span>
        )}
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-[#f1efe8]/66 transition-colors duration-300 group-hover:text-[#f1efe8]/90 mb-5 min-h-[3.2rem]">
        {value}
      </p>

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0.28, y: isHovered ? 0 : 2 }}
        transition={{ duration: 0.3 }}
        className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.16em] text-[#f1efe8]/34 group-hover:text-[#f1efe8]/62 whitespace-pre-line"
      >
        {subInfos[label]}
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  useSEO(ABOUT_SEO);
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
          <a href="/" id="about-brand-link" className="hover-target" data-cursor-text="HOME">
            <span className="block font-medium text-[#f1efe8]">SULAYMAN BOWLES</span>
            <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">Technical SEO · AI Product · Finance/Data</span>
          </a>
          <nav className="flex flex-wrap items-center gap-3 md:justify-center md:gap-6">
            <NavLink href="/#selected-works" id="about-nav-work">WORK</NavLink>
            <NavLink href="/method" id="about-nav-method">METHOD</NavLink>
            <NavLink href="/about" active id="about-nav-about">ABOUT</NavLink>
            <NavLink href="/#contact" id="about-nav-contact">CONTACT</NavLink>
          </nav>
          <a href="/#contact" id="about-header-contact" data-cursor-text="CONTACT" className="hover-target flex items-center gap-4 justify-self-start text-[#f1efe8]/75 transition-colors hover:text-[#f1efe8] md:justify-self-end">
            <span className="h-7 w-7 rounded-full border border-[#f1efe8]/28 flex-shrink-0" />
            <span>CONTACT</span>
          </a>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-102px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] xl:px-10 xl:pt-20">
        <ScrollReveal yOffset={18} blur={false} className="min-w-0 self-center">
          <div className="mb-8 text-[10px] uppercase tracking-[0.34em] text-[#f1efe8]/45">ABOUT ME</div>
          <h1 className="font-serif text-[clamp(3.8rem,6.4vw,7.1rem)] italic leading-[0.92] tracking-[-0.045em]">
            <span className="block"><RevealText text="I build systems" delay={0.1} /></span>
            <span className="block italic"><RevealText text="for visibility." delay={0.3} /></span>
          </h1>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-[#f1efe8]/62">
            <p>Sulayman Bowles is a McCombs School of Business student at UT Austin, founder of Void Agency, and builder of Atlas, a technical SEO audit console focused on crawl evidence, indexation, structured data, AI-search visibility, and finance/data systems.</p>
            <p>My work turns crawl data, site architecture, search signals, and market research into clearer systems for discovery, citation, conversion, and decision-making.</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} yOffset={18} blur={false} className="w-full self-center">
          <div className="group">
            <VisibilitySystemMap className="aspect-[1000/620] w-full transition-transform duration-700 group-hover:-translate-y-1" />
            <div className="mt-4 flex flex-col gap-3 border-b border-[#f1efe8]/12 pb-4 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/44 sm:flex-row sm:items-center sm:justify-between">
              <span>SIGNAL INPUTS: CRAWL / ENTITY / MARKET</span>
              <span>OUTPUT: VISIBILITY SYSTEM</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 lg:grid-cols-3 xl:px-10 xl:py-24">
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
          <div className="relative border-l border-[#f1efe8]/18 pl-7">
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

      <section className="mx-auto max-w-[1480px] px-4 pb-16 md:px-8 xl:px-10 xl:pb-24">
        <div className="grid grid-cols-1 border border-[#f1efe8]/14 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map(([value, label]) => (
            <motion.div
              key={value}
              className="group border-b border-[#f1efe8]/12 p-6 transition-colors duration-500 last:border-b-0 hover:bg-[#f1efe8]/[0.025] md:border-r md:last:border-r-0 xl:border-b-0"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="mb-5 font-serif text-4xl italic leading-none tracking-[-0.02em] text-[#f1efe8]">{value}</div>
              <p className="text-[10px] uppercase leading-relaxed tracking-[0.22em] text-[#f1efe8]/48">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 lg:grid-cols-[0.48fr_0.52fr] xl:px-10 xl:py-24">
        <ScrollReveal yOffset={18} blur={false}>
          <div className="mb-6 font-serif text-7xl italic leading-none text-[#f1efe8]/32">“</div>
          <blockquote className="font-serif text-[clamp(3rem,5.8vw,7rem)] italic leading-[0.88] tracking-[-0.04em]">
            I build systems where search,
            <br />
            data, and product judgment
            <br />
            turn into visibility.
          </blockquote>
        </ScrollReveal>
        <div className="grid grid-cols-1 border-[#f1efe8]/12 md:grid-cols-3 md:border-l">
          {[
            ['LOCATION', 'Austin, Texas'],
            ['EDUCATION', 'UT Austin · McCombs\nSchool of Business'],
            ['AVAILABILITY', 'Open for select projects, partnerships, and technical SEO / AI-search work.'],
          ].map(([label, value], index) => (
            <div key={label}>
              <ScrollReveal delay={index * 0.06} yOffset={16} blur={false}>
                <MetaCard label={label} value={value} />
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-8 px-4 py-8 text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/54 md:grid-cols-[1fr_auto_1fr_auto] md:px-8 xl:px-10">
        <div>
          <div className="text-[#f1efe8]">SULAYMAN BOWLES</div>
          <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO · AI Product · Finance/Data</div>
        </div>
        <nav className="flex flex-wrap gap-5" id="about-footer-nav">
          <NavLink href="/#selected-works" id="about-footer-work">WORK</NavLink>
          <NavLink href="/method" id="about-footer-method">METHOD</NavLink>
          <NavLink href="/about" id="about-footer-about" active>ABOUT</NavLink>
          <NavLink href="/#contact" id="about-footer-contact">CONTACT</NavLink>
        </nav>
        <div className="md:text-right">
          © 2026 SULAYMAN BOWLES
          <br />
          ALL RIGHTS RESERVED
        </div>
        <a href="#top" id="about-back-to-top" aria-label="Back to top" data-cursor-text="TOP" className="hover-target h-9 w-9 rounded-full border border-[#f1efe8]/26 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]" />
      </footer>
    </main>
  );
}
