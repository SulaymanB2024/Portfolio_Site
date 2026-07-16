import { useEffect, type ReactNode } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { PROFILE_FACTS, formatEducation, formatIsoDate } from '../content/profileFacts';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESUME_SEO = getSeoRoute('/resume')!;
const RESUME_PDF_PATH = '/Sulayman_Bowles_Resume.pdf';

const supportingLinks = [
  { label: 'Atlas', href: '/atlas', meta: 'Product and public crawl evidence' },
  { label: 'Selected Work', href: '/work', meta: 'Six inspectable artifacts' },
  { label: 'Research', href: '/research', meta: 'Search, product, and markets notes' },
  { label: 'GitHub', href: PROFILE_FACTS.canonicalLinks.github, meta: 'Public code profile' },
  { label: 'LinkedIn', href: PROFILE_FACTS.canonicalLinks.linkedin, meta: 'Professional profile' },
  { label: 'Contact', href: '/contact', meta: 'Direct email and compact brief' },
];

function Section({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="relative z-10 grid gap-8 border-t border-ink/14 py-12 lg:grid-cols-[0.3fr_0.7fr]">
      <div>
        <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink/60">{label}</p>
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
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/resume" tone="light" />

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 py-14 md:px-8 xl:px-10 xl:py-20">
        <section className="grid min-h-[62vh] items-end gap-12 pb-14 lg:grid-cols-[0.64fr_0.36fr]">
          <div>
            <p className="mb-8 text-[10px] uppercase tracking-[0.36em] text-ink/60">Résumé / reviewed {formatIsoDate(PROFILE_FACTS.lastReviewed)} / role-tense review {formatIsoDate(PROFILE_FACTS.nextRoleReview)}</p>
            <h1 className="max-w-full font-serif text-[3.6rem] italic leading-[0.82] tracking-normal md:text-[7rem] xl:text-[10rem]">
              Sulayman Bowles
            </h1>
            <p className="mt-9 max-w-4xl font-serif text-[1.7rem] italic leading-[1] tracking-normal text-ink/72 md:text-[3.4rem]">
              Technical systems builder working across crawl infrastructure, AI product workflows, analytics, and finance research.
            </p>
          </div>

          <aside className="min-w-0 border-l border-ink/14 pl-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink/60">Education</p>
            <p className="mt-5 text-lg leading-snug text-ink">{PROFILE_FACTS.education.school}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              {formatEducation()}<br />
              {PROFILE_FACTS.education.institution} · Expected {PROFILE_FACTS.education.expectedGraduation}
            </p>
            <div className="mt-8 grid gap-3 text-[10px] uppercase tracking-[0.18em]">
              <a href={RESUME_PDF_PATH} className="flex min-h-12 items-center justify-between border border-ink/24 bg-ink px-4 text-canvas transition-colors hover:bg-accent hover:text-ink">
                <span>Download PDF résumé</span><span aria-hidden="true">↓</span>
              </a>
              <a href="mailto:sulayman.bowles@gmail.com" className="min-h-12 border border-ink/24 px-4 py-4 transition-colors hover:bg-ink hover:text-canvas">
                sulayman.bowles@gmail.com
              </a>
              <button type="button" onClick={() => window.print()} className="min-h-12 cursor-pointer border border-ink/24 px-4 text-left font-sans text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-canvas">
                Print / save this page
              </button>
            </div>
          </aside>
        </section>

        <Section label="01" title="Education & focus">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            <article className="bg-ink/[0.018] p-6">
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-ink/64">UT Austin</h3>
              <p className="mt-5 text-sm font-semibold text-ink">{formatEducation()} · expected {PROFILE_FACTS.education.expectedGraduation}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">Coursework includes {PROFILE_FACTS.education.coursework.join(', ')}.</p>
            </article>
            <article className="bg-ink/[0.018] p-6">
              <h3 className="text-[10px] uppercase tracking-[0.24em] text-ink/64">Current focus</h3>
              <p className="mt-5 text-sm font-semibold text-ink">Atlas, technical SEO, product systems, and source-led research</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">Designs crawl and evidence workflows, React and TypeScript interfaces, Python and SQLite data paths, structured exports, and review gates that keep observations separate from recommendations and measurement gaps.</p>
            </article>
          </div>
        </Section>

        <Section label="02" title="Experience">
          <div className="grid gap-4">
            {PROFILE_FACTS.experience.map((item) => (
              <article key={`${item.title}-${item.organization}`} className="border border-ink/14 p-5">
                <div className="mb-5 grid gap-2 md:grid-cols-[1fr_auto] md:items-start">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-ink">{item.title}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/60">{item.organization} · {item.location}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60 md:text-right">{item.dates}</p>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-ink/70">{item.publicSummary}</p>
                <ul className="mt-4 grid max-w-3xl gap-2 text-sm leading-relaxed text-ink/70">
                  {item.bullets.map((bullet) => <li key={bullet} className="border-l border-ink/16 pl-3">{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section label="03" title="Skill inventory">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            {PROFILE_FACTS.skillGroups.map((group) => (
              <article key={group.label} className="bg-ink/[0.018] p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/64">{group.label}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{group.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="04" title="Awards & leadership">
          <div className="grid gap-4">
            {PROFILE_FACTS.awardsAndLeadership.map((item) => (
              <article key={`${item.organization}-${item.title}`} className="border border-ink/14 p-5">
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-ink">{item.title}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/60">{item.organization} · {item.location}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60 md:text-right">{item.dates}</p>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">{item.detail}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section label="05" title="Additional qualifications">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2">
            <article className="bg-ink/[0.018] p-5">
              <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/64">Certifications</h3>
              <p className="text-sm leading-relaxed text-ink/70">{PROFILE_FACTS.certifications.join(' · ')}</p>
            </article>
            <article className="bg-ink/[0.018] p-5">
              <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink/64">Languages</h3>
              <p className="text-sm leading-relaxed text-ink/70">{PROFILE_FACTS.languages.join(' · ')}</p>
            </article>
          </div>
        </Section>

        <Section label="06" title="Dated public proof">
          <div className="grid gap-px overflow-hidden border border-ink/14 md:grid-cols-2 xl:grid-cols-3">
            {PROFILE_FACTS.proofClaims.map((item) => (
              <a key={item.label} href={item.publicSource} className="min-h-[190px] bg-ink/[0.018] p-5 transition-colors hover:bg-ink hover:text-canvas">
                <span className="text-[10px] uppercase tracking-[0.22em] text-inherit opacity-72">As of {formatIsoDate(item.asOf)}</span>
                <strong className="mt-6 block text-xs uppercase tracking-[0.2em] text-inherit">{item.label}</strong>
                <span className="mt-4 block text-sm leading-relaxed text-inherit opacity-78">{item.claim}</span>
              </a>
            ))}
          </div>
        </Section>

        <Section label="07" title="Supporting links">
          <div className="grid gap-3">
            {supportingLinks.map((link) => (
              <a key={link.href} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined} className="grid gap-3 border border-ink/14 px-5 py-4 text-[10px] uppercase tracking-[0.22em] text-ink/70 transition-colors hover:bg-ink hover:text-canvas md:grid-cols-[1fr_auto]">
                <span>{link.label}</span><span className="text-inherit opacity-72">{link.meta}</span>
              </a>
            ))}
          </div>
        </Section>

        <InternalFooter activePath="/resume" tone="light" />
      </div>
    </main>
  );
}
