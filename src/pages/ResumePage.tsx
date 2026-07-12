import { useEffect, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { InternalHeader } from '../components/InternalHeader';
import { InternalFooter } from '../components/InternalFooter';
import { WireframeGrid } from '../components/WireframeGrid';

const RESUME_SEO = getSeoRoute('/resume')!;
const RESUME_PDF_PATH = '/Sulayman_Bowles_Resume.pdf';



const experience = [
  {
    role: 'Founder',
    org: 'VOID Agency',
    dates: 'Dec 2025 - Present',
    summary:
      'Built Void Agency around technical SEO audits, website builds, local search work, and crawler-access checks. $50K+ in collected client revenue as of May 2026.',
  },
  {
    role: 'AI Product Manager Intern',
    org: 'Chegg, Office of the Chief Product Officer',
    dates: 'May 2026 - Aug 2026',
    summary:
      'Supporting AI product research, competitive analysis, workflow mapping, and prototype review for student-facing tools.',
  },
  {
    role: 'Technical SEO Analytics',
    org: 'Private SEO Engagement',
    dates: 'May 2026 - Present',
    summary:
      'Supporting launch analytics, GA4/GSC reporting, SEO baselines, traffic analysis, keyword tracking, and prioritized site recommendations.',
  },
  {
    role: 'Student Associate',
    org: 'Jon Brumley Texas Venture Labs',
    dates: 'Sep 2025 - Present',
    summary:
      'Advising early-stage companies on market validation, customer discovery, competitive positioning, unit economics, go-to-market strategy, and financial models.',
  },
];

const skillGroups = [
  ['Technical SEO', 'Crawler access, indexability, canonicals, internal links, schema, templates, performance inputs.'],
  ['AI Search / Product', 'AI product research, competitive mapping, workflow analysis, prompt and prototype review.'],
  ['Finance / Data', 'Valuation research, operating analysis, GA4/GSC reporting, market notes, assumptions tables.'],
  ['Software Execution', 'React/Vite interfaces, Python scripts, audit dashboards, structured reports, source-backed artifacts.'],
];

const proofLinks = [
  { label: 'Atlas technical SEO console', href: '/atlas', meta: 'Project overview' },
  { label: 'Markets research index', href: '/markets', meta: 'Research notes' },
  { label: 'Void Agency method', href: '/method', meta: 'Technical SEO process' },
  { label: 'GitHub', href: 'https://github.com/SulaymanB2024', meta: 'Public code profile' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sulayman-bowles/', meta: 'Professional profile' },
  { label: 'AI information', href: '/ai-information', meta: 'Canonical source map' },
  { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', meta: 'Direct contact' },
];



function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.3fr_0.7fr] relative z-10">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/45">{label}</p>
        <h2 className="max-w-sm font-serif text-4xl italic leading-[0.95] tracking-normal text-ink">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function ResumePage() {
  useSEO(RESUME_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="absolute inset-0 z-0 pointer-events-none opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />

      <InternalHeader activePath="/resume" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[72vh] items-end gap-12 pb-14 lg:grid-cols-[0.64fr_0.36fr]">
          <div>
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/48">Selected experience</p>
            <h1 className="max-w-full font-serif text-[clamp(3.2rem,16vw,12rem)] italic leading-[0.82] tracking-normal md:leading-[0.78] md:tracking-normal">
              <span className="block sm:inline">Sulayman</span>{' '}
              <span className="block sm:inline">Bowles</span>{' '}
              <span className="block sm:inline">Resume</span>
            </h1>
            <p className="mt-10 max-w-3xl [overflow-wrap:anywhere] font-serif text-[clamp(1.38rem,6vw,5rem)] italic leading-[1] tracking-normal text-ink/68 md:leading-[0.94] md:tracking-normal">
              Technical SEO, Atlas, finance/data research, and product/software execution.
            </p>
          </div>

          <aside className="min-w-0 border-l border-ink/14 pl-6">
            <p className="max-w-xl [overflow-wrap:anywhere] text-base leading-relaxed text-ink/62">
              UT Austin McCombs student and Void Agency founder building Atlas, technical SEO audit workflows, research notes, and inspectable web interfaces.
            </p>
            <p className="mt-4 max-w-xl [overflow-wrap:anywhere] text-sm leading-relaxed text-ink/48">
              This page highlights selected experience. The linked PDF contains the full one-page resume.
            </p>
            <div className="mt-8 grid min-w-0 gap-3 break-words text-[10px] uppercase tracking-[0.14em] [overflow-wrap:anywhere] sm:tracking-[0.22em]">
              <a href="mailto:sulayman.bowles@gmail.com" className="min-w-0 border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                sulayman.bowles@gmail.com
              </a>
              <a href="https://github.com/SulaymanB2024" target="_blank" rel="noreferrer" className="min-w-0 border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/sulayman-bowles/" target="_blank" rel="noreferrer" className="min-w-0 border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                LinkedIn
              </a>
              <a href={RESUME_PDF_PATH} className="min-w-0 border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                Download Full PDF Resume
              </a>
              <button 
                onClick={() => window.print()}
                className="text-left min-w-0 border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.22em] font-medium cursor-pointer"
              >
                <span>Print / Save PDF Resume</span>
                <span className="text-xs">⤓</span>
              </button>
            </div>
          </aside>
        </section>

        <Section label="01" title="Profile summary">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-3">
            {[
              ['Builds', 'Atlas, SEO audit pages, React interfaces, research notes, and data workflows.'],
              ['Analyzes', 'Crawl evidence, AI-search readiness, finance assumptions, operating models, and market structure.'],
              ['Proof', 'Static HTML pages, canonical URLs, JSON-LD, sitemap entries, public code, and source-backed project pages.'],
            ].map(([label, copy]) => (
              <article key={label} className="bg-ink/[0.018] p-6">
                <h3 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-ink/45">{label}</h3>
                <p className="text-sm leading-relaxed text-ink/68">{copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="02" title="Selected experience">
          <div className="grid gap-4">
            {experience.map((item) => (
              <article key={`${item.role}-${item.org}`} className="border border-ink/14 p-5">
                <div className="mb-5 grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-ink">{item.role}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/48">{item.org}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/48 md:text-right">{item.dates}</p>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-ink/64">{item.summary}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="03" title="Skills">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            {skillGroups.map(([label, copy]) => (
              <article key={label} className="bg-ink/[0.018] p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/50">{label}</h3>
                <p className="text-sm leading-relaxed text-ink/68">{copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="04" title="Proof and entry paths">
          <div className="grid gap-3">
            {proofLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="grid gap-3 border border-ink/14 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-ink/68 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[1fr_auto]"
              >
                <span>{link.label}</span>
                <span className="text-inherit opacity-60">{link.meta}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section label="05" title="Academic & Ventures">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            <article className="bg-ink/[0.018] p-5">
              <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/50">UT Austin — McCombs</h3>
              <p className="text-sm font-semibold text-ink">BBA Candidate in Finance & MIS</p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink/68">
                <li>• Key Coursework: Financial Valuation, Quantitative Investment, Database Management (SQL), Predictive Analytics</li>
                <li>• Honours & Activities: Dean's List, Texas Venture Labs Associate</li>
              </ul>
            </article>
            <article className="bg-ink/[0.018] p-5">
              <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/50">Ventures & System Audits</h3>
              <p className="text-sm font-semibold text-ink">Selected Milestones</p>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink/68">
                <li>• Void Agency: Built crawl audit models and website systems for commercial engagements ($50K+ in collected client revenue as of May 2026)</li>
                <li>• Scraper Atlas: Python and SQLite crawler for crawl-state diagnostics; public sample assets are illustrative</li>
              </ul>
            </article>
          </div>
        </Section>

        <InternalFooter activePath="/resume" tone="light" />
      </div>
    </main>
  );
}
