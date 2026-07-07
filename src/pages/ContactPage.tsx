import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useState } from 'react';
import { AuditIntakeForm } from '../components/AuditIntakeForm';
import { InternalHeader } from '../components/InternalHeader';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CONTACT_SEO = getSeoRoute('/contact')!;
const DIRECT_EMAIL = 'sulayman.bowles@gmail.com';
const DIRECT_EMAIL_HREF = `mailto:${DIRECT_EMAIL}`;

const elsewhereLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sulayman-bowles/',
    meta: 'Professional profile',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SulaymanB2024',
    meta: 'Public code',
  },
  {
    label: 'Resume',
    href: '/resume',
    meta: 'Readable profile',
  },
  {
    label: 'Tech Ledger',
    href: 'https://sulayman-bowles.tech/',
    meta: 'Project record',
  },
  {
    label: 'Public Site',
    href: '/',
    meta: 'Home',
  },
];

const briefNotes = [
  'Use the brief for technical SEO, AI-search visibility, crawl evidence, analytics, or source-backed research requests.',
  'Start with the site URL, the suspected problem, and the decision the work needs to support.',
  'Keep passwords, API keys, payment details, unreleased client data, and production secrets out of the form.',
];

function FrameMarks() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 text-canvas/24">
      <span className="absolute left-4 top-4 h-px w-7 bg-current md:left-6 md:top-6" />
      <span className="absolute left-4 top-4 h-7 w-px bg-current md:left-6 md:top-6" />
      <span className="absolute right-4 top-4 h-px w-7 bg-current md:right-6 md:top-6" />
      <span className="absolute right-4 top-4 h-7 w-px bg-current md:right-6 md:top-6" />
      <span className="absolute bottom-4 left-4 h-px w-7 bg-current md:bottom-6 md:left-6" />
      <span className="absolute bottom-4 left-4 h-7 w-px bg-current md:bottom-6 md:left-6" />
      <span className="absolute bottom-4 right-4 h-px w-7 bg-current md:bottom-6 md:right-6" />
      <span className="absolute bottom-4 right-4 h-7 w-px bg-current md:bottom-6 md:right-6" />
    </span>
  );
}

function ContactAction({
  briefOpen,
  onToggleBrief,
}: {
  briefOpen: boolean;
  onToggleBrief: () => void;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-canvas/60">
      <button
        type="button"
        aria-expanded={briefOpen}
        aria-controls="contact-brief-panel"
        onClick={onToggleBrief}
        className="group inline-flex min-h-11 items-center gap-4 border border-canvas/20 px-4 py-3 text-canvas transition-[background-color,border-color,color] duration-200 hover:border-canvas hover:bg-canvas hover:text-ink motion-reduce:transition-none"
      >
        <span>{briefOpen ? 'Brief -' : 'Brief +'}</span>
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={1.5} />
      </button>
      <a href="/method" className="border-b border-canvas/18 pb-1 transition-colors duration-200 hover:border-canvas hover:text-canvas motion-reduce:transition-none">
        Method
      </a>
      <a href="/atlas/sample-crawl" className="border-b border-canvas/18 pb-1 transition-colors duration-200 hover:border-canvas hover:text-canvas motion-reduce:transition-none">
        Sample crawl
      </a>
    </div>
  );
}

export default function ContactPage() {
  const [briefOpen, setBriefOpen] = useState(false);
  const [elsewhereOpen, setElsewhereOpen] = useState(false);

  useSEO(CONTACT_SEO);

  const toggleBrief = () => {
    if (!briefOpen) {
      setElsewhereOpen(false);
    }
    setBriefOpen(!briefOpen);
  };

  const openBrief = () => {
    setElsewhereOpen(false);
    setBriefOpen(true);
  };

  const toggleElsewhere = () => {
    if (!elsewhereOpen) {
      setBriefOpen(false);
    }
    setElsewhereOpen(!elsewhereOpen);
  };

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <InternalHeader activePath="/contact" tone="dark" variant="final-frame" />

      <section className="relative z-10 mx-auto min-h-[calc(100svh-92px)] max-w-[1480px] px-4 pb-8 pt-4 md:px-8 md:pb-10 lg:px-10">
        <div className="relative isolate min-h-[calc(100svh-132px)] overflow-hidden border border-canvas/14 px-5 py-6 md:px-8 md:py-8 lg:min-h-[calc(100svh-144px)] lg:px-10">
          <FrameMarks />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-[29%] h-px bg-canvas/[0.07] md:inset-x-8 lg:inset-x-10" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-24 left-5 right-5 h-px bg-canvas/[0.08] md:left-8 md:right-8 lg:left-10 lg:right-10" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-24 top-8 hidden w-px bg-canvas/[0.08] lg:right-[36%] lg:block" />

          <div className="relative z-10 grid min-h-[inherit] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(340px,0.38fr)]">
            <div className="flex min-h-[58svh] flex-col justify-between py-7 md:min-h-[64svh] lg:min-h-0 lg:py-10">
              <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-canvas/45">
                <span>Direct contact</span>
                <span aria-hidden="true">/ final frame</span>
              </div>

              <div>
                <h1 className="font-serif text-[5.6rem] italic leading-[0.76] tracking-normal text-canvas sm:text-[7rem] md:text-[10rem] xl:text-[13rem] 2xl:text-[15rem]">
                  Contact
                </h1>
                <a
                  href={DIRECT_EMAIL_HREF}
                  className="group mt-8 inline-flex max-w-full items-center gap-2 font-serif text-[1.35rem] italic leading-none text-canvas transition-colors duration-200 hover:text-accent motion-reduce:transition-none sm:gap-4 sm:text-[2.1rem] md:text-[2.6rem] xl:text-[3.2rem]"
                >
                  <span className="min-w-0 break-words">{DIRECT_EMAIL}</span>
                  <ArrowUpRight aria-hidden="true" className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none md:h-8 md:w-8" strokeWidth={1.1} />
                </a>
                <p className="mt-8 max-w-xl text-sm leading-relaxed text-canvas/58 md:text-base">
                  For technical SEO, AI-search visibility, crawl evidence, analytics, or source-backed research. Start with the direct email or send a short brief.
                </p>
                <ContactAction briefOpen={briefOpen} onToggleBrief={toggleBrief} />
              </div>

              <div className="grid max-w-2xl grid-cols-1 gap-3 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-canvas/44 sm:grid-cols-3">
                <span>Technical SEO</span>
                <span>AI search</span>
                <span>Finance research</span>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 py-0 lg:py-10">
              <aside
                id="contact-brief-panel"
                className="border border-canvas/14 bg-ink/76 p-5 text-canvas md:p-6"
              >
                {briefOpen ? (
                  <>
                    <div className="mb-6 flex items-start justify-between gap-4 border-b border-canvas/12 pb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/45">Brief form</p>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-canvas/58">
                          Send the site, the issue, and the decision the audit should support.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBriefOpen(false)}
                        className="min-h-10 border border-canvas/14 px-3 text-[10px] uppercase tracking-[0.2em] text-canvas/58 transition-colors duration-200 hover:border-canvas hover:text-canvas motion-reduce:transition-none"
                      >
                        Close
                      </button>
                    </div>
                    <AuditIntakeForm variant="compact" showProgress={false} submitLabel="SEND BRIEF" className="text-left" />
                    <p className="mt-5 text-[9px] uppercase leading-relaxed tracking-[0.16em] text-canvas/38">
                      Same Formspree endpoint as the homepage brief form. Do not include credentials, payment details, unreleased client data, or production secrets.
                    </p>
                  </>
                ) : (
                  <div className="grid gap-7">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/45">Brief panel</p>
                      <p className="mt-5 max-w-sm text-sm leading-relaxed text-canvas/60">
                        The form is available, but it is secondary to direct contact. Open it only when you already have the site and request shape ready.
                      </p>
                    </div>
                    <ul className="grid gap-4 text-sm leading-relaxed text-canvas/58">
                      {briefNotes.map((item) => (
                        <li key={item} className="border-l border-canvas/14 pl-4">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      aria-expanded={briefOpen}
                      aria-controls="contact-brief-panel"
                      onClick={openBrief}
                      className="group inline-flex min-h-11 w-fit items-center gap-4 border border-canvas/20 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-canvas transition-[background-color,border-color,color] duration-200 hover:border-canvas hover:bg-canvas hover:text-ink motion-reduce:transition-none"
                    >
                      <span>Brief +</span>
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </aside>

              <div className="justify-self-end text-right lg:relative lg:flex lg:flex-col lg:items-end">
                <button
                  type="button"
                  aria-expanded={elsewhereOpen}
                  aria-controls="contact-elsewhere-index"
                  onClick={toggleElsewhere}
                  className="min-h-11 border border-canvas/14 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-canvas/58 transition-colors duration-200 hover:border-canvas hover:text-canvas motion-reduce:transition-none"
                >
                  {elsewhereOpen ? 'Elsewhere -' : 'Elsewhere +'}
                </button>
                {elsewhereOpen && (
                  <nav id="contact-elsewhere-index" className="mt-4 grid gap-px border border-canvas/12 bg-canvas/12 text-left lg:absolute lg:bottom-14 lg:right-0 lg:mt-0 lg:min-w-[470px]" aria-label="Elsewhere links">
                    {elsewhereLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="group grid grid-cols-[1fr_auto] gap-6 bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-canvas/58 transition-colors duration-200 hover:bg-canvas hover:text-ink motion-reduce:transition-none"
                      >
                        <span>{link.label}</span>
                        <span className="text-right opacity-55">{link.meta}</span>
                      </a>
                    ))}
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
