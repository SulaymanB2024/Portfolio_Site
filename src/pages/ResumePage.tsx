import { useEffect, type ReactNode } from 'react';
import { ArrowUpRight, Download, Mail, Printer } from 'lucide-react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { WireframeGrid } from '../components/WireframeGrid';
import { PROFILE_FACTS, formatIsoDate } from '../content/profileFacts';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESUME_SEO = getSeoRoute('/resume')!;
const RESUME_PDF_PATH = '/Sulayman_Bowles_Resume.pdf';

const experience = [
  {
    role: 'Founder',
    org: 'Void Agency',
    start: '2025-12',
    end: null,
    dates: 'Dec 2025 — Present',
    summary:
      'Builds fixed-scope technical SEO audits, website systems, local-search reviews, and crawl-access checks with explicit evidence and handoff boundaries.',
  },
  {
    role: 'AI Product Manager Intern',
    org: 'Chegg, Office of the Chief Product Officer',
    start: '2026-05',
    end: '2026-08',
    dates: 'May 2026 — Aug 2026',
    summary:
      'Supports AI product research, competitive analysis, workflow mapping, and prototype review for student-facing product work.',
  },
  {
    role: 'Technical SEO Analytics',
    org: 'Private engagement',
    start: '2026-05',
    end: null,
    dates: 'May 2026 — Present',
    summary:
      'Supports GA4 and Search Console reporting, launch baselines, traffic analysis, keyword tracking, and prioritized site recommendations.',
  },
  {
    role: 'Student Associate',
    org: 'Jon Brumley Texas Venture Labs',
    start: '2025-09',
    end: null,
    dates: 'Sep 2025 — Present',
    summary:
      'Advises early-stage teams on customer discovery, market validation, competitive positioning, unit economics, go-to-market work, and financial models.',
  },
];

const capabilityGroups = [
  ['Technical SEO', 'Crawlability, indexation, canonicals, redirects, robots.txt, sitemaps, internal links, structured data, templates, and rerun checks.'],
  ['Analytics & research', 'GA4, Google Search Console, public-source research, assumption tables, market structure, valuation frames, and claim boundaries.'],
  ['Product & software', 'React, TypeScript, Vite, Python, SQLite, product research, workflow mapping, prototypes, structured reports, and CSV/JSON exports.'],
  ['Operating practice', 'Scoping, evidence review, issue prioritization, implementation handoff, client-safe reporting, and acceptance criteria.'],
];

const profileLinks = [
  { label: 'Selected Work', href: '/work', meta: 'Inspectable public artifacts' },
  { label: 'Research', href: '/research', meta: 'Search, product, and markets notes' },
  { label: 'GitHub', href: PROFILE_FACTS.canonicalLinks.github, meta: 'Public code profile' },
  { label: 'LinkedIn', href: PROFILE_FACTS.canonicalLinks.linkedin, meta: 'Professional profile' },
  { label: 'Contact', href: '/contact', meta: 'Direct email and compact brief' },
];

const selectedEvidence = PROFILE_FACTS.proofClaims.filter((item) => item.label === 'Atlas' || item.label === 'Public research');
const voidRevenue = PROFILE_FACTS.proofClaims.find((item) => item.label === 'Void Agency')!;

function ResumeSection({ number, title, intro, children }: { number: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="resume-chapter relative z-10 grid gap-6 border-t border-ink/14 py-10 md:py-14 lg:grid-cols-[minmax(210px,0.28fr)_minmax(0,0.72fr)] lg:gap-14 xl:py-20">
      <header className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start md:block">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/60 md:mb-5">{number}</p>
        <div>
          <h2 className="max-w-sm font-serif text-4xl italic leading-none tracking-normal text-ink md:text-5xl">{title}</h2>
          {intro && <p className="mt-5 hidden max-w-sm text-sm leading-relaxed text-ink/68 md:block">{intro}</p>}
        </div>
      </header>
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
    <main className="resume-page site-page site-page-light relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink antialiased selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/resume" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10">
        <section className="resume-hero grid gap-8 border-b border-ink/14 py-12 md:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(300px,5fr)] lg:items-end lg:gap-16 xl:py-20">
          <div>
            <p className="text-xs uppercase leading-relaxed tracking-[0.16em] text-ink/60">
              Résumé / reviewed <time dateTime={PROFILE_FACTS.lastReviewed}>{formatIsoDate(PROFILE_FACTS.lastReviewed)}</time> / role-tense review <time dateTime={PROFILE_FACTS.nextRoleReview}>{formatIsoDate(PROFILE_FACTS.nextRoleReview)}</time>
            </p>
            <h1 className="mt-8 max-w-full font-serif text-5xl italic leading-[0.82] tracking-normal md:mt-10 md:text-8xl xl:text-9xl">
              Sulayman Bowles
            </h1>
            <p className="mt-6 max-w-4xl font-serif text-2xl italic leading-none tracking-normal text-ink/76 md:mt-8 md:text-5xl">
              Technical SEO, search systems, product, and finance research.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink/72 md:mt-8">
              Builds inspectable systems that keep raw observations separate from analysis, recommendations, and measurement gaps.
            </p>
            <p className="resume-print-contact mt-6 hidden text-sm leading-relaxed">
              sulayman.bowles@gmail.com · sulayman-bowles.dev/resume
            </p>
          </div>

          <aside className="border-t border-ink/14 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/60">Education</p>
            <p className="mt-5 text-xl leading-snug text-ink">{PROFILE_FACTS.education.school}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/72">
              {PROFILE_FACTS.education.degree} in {PROFILE_FACTS.education.field}<br />
              {PROFILE_FACTS.education.institution} · Expected {PROFILE_FACTS.education.graduation}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink/68">
              Coursework includes valuation, quantitative investment, database management, and predictive analytics. Activities include Texas Venture Labs.
            </p>
            <div className="resume-actions mt-6 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.12em] lg:mt-8 lg:grid-cols-1 lg:gap-3 lg:tracking-[0.14em]">
              <a href={RESUME_PDF_PATH} download="Sulayman_Bowles_Resume.pdf" aria-label="Download Sulayman Bowles public resume as a PDF" className="flex min-h-12 items-center justify-between border border-ink/24 bg-ink px-4 text-canvas transition-colors hover:bg-accent hover:text-ink">
                <span><span className="hidden sm:inline">Download </span>PDF</span><Download aria-hidden="true" size={16} strokeWidth={1.5} />
              </a>
              <a href="mailto:sulayman.bowles@gmail.com" className="flex min-h-12 items-center justify-between border border-ink/24 px-4 transition-colors hover:bg-ink hover:text-canvas">
                <span>Email</span><Mail aria-hidden="true" size={16} strokeWidth={1.5} />
              </a>
              <button type="button" onClick={() => window.print()} className="flex min-h-12 cursor-pointer items-center justify-between border border-ink/24 px-4 text-left font-sans text-xs uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-canvas">
                <span>Print / save</span><Printer aria-hidden="true" size={16} strokeWidth={1.5} />
              </button>
            </div>
          </aside>
        </section>

        <ResumeSection number="01" title="Experience" intro="Four operating contexts, edited around the work performed rather than a repeated proof-card inventory.">
          <div className="border-t border-ink/14">
            {experience.map((item, index) => (
              <article key={`${item.role}-${item.org}`} className="resume-experience-row grid grid-cols-[7.5rem_minmax(0,1fr)] gap-5 border-b border-ink/14 py-5 md:grid-cols-[minmax(180px,0.34fr)_minmax(0,0.66fr)] md:gap-10 md:py-7">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-ink/56">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 text-sm uppercase leading-relaxed tracking-[0.16em] text-ink">{item.role}</h3>
                  <p className="mt-2 text-xs uppercase leading-relaxed tracking-[0.14em] text-ink/64">{item.org}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/60">
                    <time dateTime={item.start}>{item.dates.split(' — ')[0]}</time> — {item.end ? <time dateTime={item.end}>{item.dates.split(' — ')[1]}</time> : 'Present'}
                  </p>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/72">{item.summary}</p>
                  {item.org === 'Void Agency' && (
                    <p className="mt-5 border-l border-ink/28 pl-4 text-sm leading-relaxed text-ink/68">
                      <span className="mr-2 text-xs uppercase tracking-[0.14em] text-ink/56">Dated annotation</span>
                      {voidRevenue.claim} as of <time dateTime={voidRevenue.asOf}>{formatIsoDate(voidRevenue.asOf)}</time>.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection number="02" title="Capabilities" intro="A compact view of the systems, analytical methods, and operating practices used across the work.">
          <div className="grid border-l border-t border-ink/14 md:grid-cols-2">
            {capabilityGroups.map(([label, copy], index) => (
              <article key={label} className="resume-capability border-b border-r border-ink/14 p-5 md:min-h-52 md:p-7">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/56">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-5 font-serif text-3xl italic leading-none tracking-normal text-ink md:mt-8">{label}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/70 md:mt-5">{copy}</p>
              </article>
            ))}
          </div>
        </ResumeSection>

        <section className="resume-evidence-band relative z-10 bg-ink px-5 py-10 text-canvas md:px-10 md:py-16 xl:px-14 xl:py-20" aria-labelledby="resume-evidence-heading">
          <div className="grid gap-6 border-b border-canvas/16 pb-8 md:pb-10 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-canvas/56">03 / Selected public evidence</p>
              <h2 id="resume-evidence-heading" className="mt-5 max-w-xl font-serif text-4xl italic leading-none tracking-normal md:text-6xl">Two source-backed artifacts.</h2>
            </div>
            <p className="hidden max-w-2xl text-base leading-relaxed text-canvas/68 md:block lg:justify-self-end">
              Independently navigable proof stays here. Role facts and operating outcomes remain with the experience that gives them context.
            </p>
          </div>

          <div className="grid border-l border-t border-canvas/16 md:grid-cols-2">
            {selectedEvidence.map((item) => (
              <a key={item.label} href={item.publicSource} className="resume-evidence-entry group grid min-h-48 content-between border-b border-r border-canvas/16 p-5 text-canvas transition-colors hover:bg-canvas hover:text-ink focus-visible:bg-canvas focus-visible:text-ink md:min-h-64 md:p-8">
                <span>
                  <span className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-inherit opacity-60">
                    <span>{item.label}</span>
                    <time dateTime={item.asOf}>{formatIsoDate(item.asOf)}</time>
                  </span>
                  <strong className="mt-7 block max-w-xl font-serif text-3xl font-normal italic leading-none tracking-normal text-inherit md:mt-10 md:text-4xl">{item.claim}</strong>
                </span>
                <span className="mt-6 flex items-center justify-between border-t border-current/20 pt-4 text-xs uppercase tracking-[0.14em] text-inherit md:mt-8">
                  <span>Open source</span><ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </span>
              </a>
            ))}
          </div>

          <nav aria-label="Résumé profiles and sources" className="mt-8 md:mt-12">
            <p className="mb-5 text-xs uppercase tracking-[0.16em] text-canvas/56">Profiles and sources</p>
            <div className="divide-y divide-canvas/14 border-y border-canvas/14">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="grid min-h-12 grid-cols-[1fr_24px] items-center gap-3 py-3 text-xs uppercase tracking-[0.14em] text-canvas/72 transition-colors hover:text-canvas focus-visible:text-canvas md:grid-cols-[1fr_auto_24px]"
                >
                  <span>{link.label}</span><span className="hidden normal-case tracking-normal text-inherit opacity-68 md:inline">{link.meta}</span><ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </nav>
        </section>

        <InternalFooter activePath="/resume" tone="light" />
      </div>
    </main>
  );
}
