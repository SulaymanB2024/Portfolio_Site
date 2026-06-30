import { useEffect, type Key, type ReactNode } from 'react';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESUME_SEO = getSeoRoute('/resume')!;

const navItems = [
  ['Work', '/#selected-works'],
  ['Atlas', '/atlas'],
  ['Research', '/markets'],
  ['Method', '/method'],
  ['About', '/about'],
  ['Resume', '/resume'],
  ['Contact', '/#contact'],
] as const;

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
    role: 'SEO & Digital Marketing Analytics Intern',
    org: 'B2B Semiconductor Company',
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
  { label: 'Atlas technical SEO console', href: '/atlas', meta: 'Product case study' },
  { label: 'Markets research index', href: '/markets', meta: 'Research notes' },
  { label: 'Void Agency method', href: '/method', meta: 'Technical SEO process' },
  { label: 'GitHub', href: 'https://github.com/SulaymanB2024', meta: 'Public code profile' },
  { label: 'Email', href: 'mailto:sulayman.bowles@gmail.com', meta: 'Direct contact' },
];

function NavLink({ href, active, id, children }: { href: string; active?: boolean; id?: string; children: ReactNode; key?: Key }) {
  return (
    <a
      href={href}
      id={id}
      data-cursor-text={typeof children === 'string' ? children : 'VIEW'}
      className={`hover-target relative group overflow-visible px-2 py-1 transition-colors ${active ? 'text-ink' : 'text-ink/58 hover:text-ink'}`}
    >
      <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">{children}</span>
      <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-ink`}>[</span>
      <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-ink`}>]</span>
    </a>
  );
}

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
    <section className="grid gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.3fr_0.7fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/45">{label}</p>
        <h2 className="max-w-sm font-serif text-4xl italic leading-[0.95] tracking-[-0.025em] text-ink">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function ResumePage() {
  const prefersReducedMotion = useReducedMotion();

  useSEO(RESUME_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas md:cursor-none">
      <div className="bg-noise pointer-events-none" />
      <PageTechnicalChrome tone="light" />
      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress tone="dark" />

      <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
        <div className="grid items-start gap-5 border-b border-ink/12 bg-[#f1efe8]/86 pb-5 text-[10px] uppercase tracking-[0.24em] backdrop-blur-sm md:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]">
          <a href="/" id="resume-brand-link" className="hover-target min-w-0" data-cursor-text="HOME">
            <span className="block font-medium text-ink">SULAYMAN BOWLES</span>
            <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-ink/58">
              Technical SEO, Atlas, and finance research.
            </span>
          </a>
          <nav className="flex w-full min-w-0 max-w-[20rem] flex-wrap items-center gap-x-3 gap-y-2 md:max-w-full md:justify-end lg:justify-center" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <NavLink key={href} href={href} active={href === '/resume'} id={`resume-nav-${label.toLowerCase()}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <a
            href="/#contact"
            id="resume-contact-link"
            data-cursor-text="CONTACT"
            className="hover-target hidden justify-self-end text-ink/65 transition-colors hover:text-ink lg:block"
          >
            CONTACT
          </a>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[72vh] items-end gap-12 pb-14 lg:grid-cols-[0.64fr_0.36fr]">
          <div>
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/48">Resume</p>
            <h1 className="font-serif text-[clamp(4.6rem,11vw,12rem)] italic leading-[0.78] tracking-[-0.055em]">
              Sulayman Bowles Resume
            </h1>
            <p className="mt-10 max-w-3xl font-serif text-[clamp(2rem,4.4vw,5rem)] italic leading-[0.94] tracking-[-0.03em] text-ink/68">
              Technical SEO, finance research, AI search, and product/software execution.
            </p>
          </div>

          <aside className="border-l border-ink/14 pl-6">
            <p className="max-w-xl text-base leading-relaxed text-ink/62">
              McCombs School of Business student and Void Agency founder building Atlas, technical SEO audit workflows, research notes, and inspectable web interfaces.
            </p>
            <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.22em]">
              <a href="mailto:sulayman.bowles@gmail.com" className="hover-target border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                sulayman.bowles@gmail.com
              </a>
              <a href="https://github.com/SulaymanB2024" target="_blank" rel="noreferrer" className="hover-target border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/sulayman-bowles/" target="_blank" rel="noreferrer" className="hover-target border border-ink/18 px-4 py-3 transition-colors hover:bg-ink hover:text-canvas">
                LinkedIn
              </a>
              <div className="border border-ink/12 px-4 py-3 text-ink/45">
                PDF resume: TODO - add a site-hosted PDF when the facts are final.
              </div>
            </div>
          </aside>
        </section>

        <Section label="01" title="Profile summary">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-3">
            {[
              ['Builds', 'Atlas, SEO audit pages, React interfaces, research notes, and data workflows.'],
              ['Analyzes', 'Crawl evidence, AI-search readiness, finance assumptions, operating models, and market structure.'],
              ['Proof', 'Public routes, sanitized crawl samples, research artifacts, and source-backed project notes.'],
            ].map(([label, copy]) => (
              <article key={label} className="bg-ink/[0.018] p-6">
                <h3 className="mb-5 text-[10px] uppercase tracking-[0.28em] text-ink/45">{label}</h3>
                <p className="text-sm leading-relaxed text-ink/68">{copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="02" title="Experience">
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
                className="hover-target grid gap-3 border border-ink/14 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-ink/68 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[1fr_auto]"
              >
                <span>{link.label}</span>
                <span className="text-inherit opacity-60">{link.meta}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section label="05" title="Resume TODOs">
          <ul className="grid gap-3 text-sm leading-relaxed text-ink/64">
            {[
              'TODO: Add graduation date, GPA, and coursework only if they should be public.',
              'TODO: Add exact employer names or client names only where disclosure is allowed.',
              'TODO: Add a site-hosted PDF resume when the HTML facts are final.',
              'TODO: Add quantified outcomes only when the source evidence can be linked or described precisely.',
            ].map((item) => (
              <li key={item} className="border border-ink/14 px-5 py-4">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <footer className="grid grid-cols-1 items-start gap-8 border-t border-ink/14 pt-8 text-[10px] uppercase tracking-[0.28em] text-ink/50 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <div className="text-ink">SULAYMAN BOWLES</div>
            <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">HTML-first resume page.</div>
          </div>
          <nav className="flex flex-wrap gap-4">
            {navItems.map(([label, href]) => (
              <NavLink key={href} href={href} active={href === '/resume'} id={`resume-footer-${label.toLowerCase()}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="md:text-right">
            RECRUITER ENTRY PATH
            <br />
            UPDATED 2026
          </div>
        </footer>
      </div>
    </main>
  );
}
