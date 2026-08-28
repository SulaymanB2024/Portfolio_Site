import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useEffect } from 'react';
import { AuditIntakeForm } from '../components/AuditIntakeForm';
import { InternalHeader } from '../components/InternalHeader';
import {
  contactBuyerQuestions as buyerQuestions,
  contactDecisionProtocol as decisionProtocol,
  contactIntakeNotes as intakeNotes,
  contactResponsePaths as responsePaths,
} from '../content/evidenceLists';
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

function ArrowLink({
  children,
  href,
  external = false,
}: {
  children: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group inline-flex min-h-11 items-center gap-3 border-b border-canvas/18 pb-1 text-sm leading-none text-canvas/72 transition-colors duration-200 hover:border-canvas hover:text-canvas motion-reduce:transition-none"
    >
      <span>{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
        strokeWidth={1.5}
      />
    </a>
  );
}

export default function ContactPage() {
  useSEO(CONTACT_SEO);

  useEffect(() => {
    if (window.location.hash !== '#contact-brief-panel') {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      document.getElementById('contact-brief-panel')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-clip bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <InternalHeader activePath="/contact" tone="dark" variant="final-frame" />

      <section className="relative z-10 mx-auto max-w-[1480px] px-4 pb-12 pt-4 md:px-8 md:pb-16 lg:px-10">
        <div className="relative isolate overflow-hidden border border-canvas/14 px-5 py-8 md:px-8 md:py-10 lg:px-10">
          <FrameMarks />
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-28 h-px bg-canvas/[0.07] md:inset-x-8 lg:inset-x-10" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-28 left-5 right-5 h-px bg-canvas/[0.08] md:left-8 md:right-8 lg:left-10 lg:right-10" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-10 top-10 hidden w-px bg-canvas/[0.08] lg:right-[42%] lg:block" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(480px,0.6fr)] lg:items-start xl:gap-16">
            <div className="grid min-h-[560px] content-between gap-12 py-4 lg:sticky lg:top-24 lg:min-h-[calc(100svh-190px)]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-canvas/48">
                  <span>Direct contact</span>
                  <span aria-hidden="true">Final frame</span>
                </div>

                <h1 className="mt-12 max-w-[8ch] font-serif text-[5rem] italic leading-[0.82] tracking-normal text-canvas sm:text-[6.6rem] md:text-[8.4rem] lg:text-[9.5rem] xl:text-[11.5rem]">
                  SEO audit contact.
                </h1>

                <a
                  href={DIRECT_EMAIL_HREF}
                  className="group mt-7 inline-flex max-w-full items-center gap-3 font-serif text-[1.45rem] italic leading-none text-canvas transition-colors duration-200 hover:text-accent motion-reduce:transition-none sm:text-[2rem] md:text-[2.6rem] xl:text-[3rem]"
                >
                  <span className="min-w-0 break-words">{DIRECT_EMAIL}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none md:h-8 md:w-8"
                    strokeWidth={1.1}
                  />
                </a>

                <p className="mt-8 max-w-2xl text-base leading-relaxed text-canvas/64 md:text-lg">
                  I work on bounded technical SEO and AI-system evidence problems: crawlability, indexation, rendering, internal links, structured data, analytics, evaluation traces, and implementation validation. Typical outputs connect an observation to its source, owner, acceptance check, and rerun path—not an opaque score or unsupported outcome claim.
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-canvas/56">
                  Direct email is the fastest path when the request is still taking shape. If the site, suspected issue, and decision are already clear, the brief form preserves that context in one pass.
                </p>

                <div className="mt-8 flex flex-wrap gap-5">
                  <ArrowLink href={DIRECT_EMAIL_HREF}>Email directly</ArrowLink>
                  <ArrowLink href="#contact-brief-panel">Send a structured brief</ArrowLink>
                  <ArrowLink href="/method">Technical SEO audit method</ArrowLink>
                  <ArrowLink href="/atlas/sample-crawl">Atlas crawl example</ArrowLink>
                </div>
              </div>

              <div className="grid max-w-3xl gap-px overflow-hidden border border-canvas/12 bg-canvas/12 sm:grid-cols-2">
                {responsePaths.map((item) => (
                  <div key={item.label} className="bg-ink px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-canvas/48">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-canvas/68">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:py-4">
              <aside id="contact-brief-panel" className="scroll-mt-28 border border-canvas/16 bg-canvas/[0.035] p-5 text-canvas md:p-7">
                <div className="border-b border-canvas/12 pb-5">
                  <p className="text-xs text-canvas/48">Structured evidence brief</p>
                  <h2 className="mt-4 font-serif text-4xl italic leading-none text-canvas md:text-5xl">
                    Send the decision context.
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-canvas/62">
                    Useful when the surface, suspected problem, and decision are clear enough to capture in one pass. A public URL helps, but is not required for a private or pre-launch system.
                  </p>
                </div>

                <AuditIntakeForm variant="compact" showProgress={false} submitLabel="SEND BRIEF" className="mt-6 text-left" />

                <div className="mt-6 border-t border-canvas/12 pt-5">
                  <p className="text-xs text-canvas/48">Include</p>
                  <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-canvas/62">
                    {intakeNotes.map((item) => (
                      <li key={item.label} className="border-l border-canvas/16 pl-4">
                        <span className="font-medium text-canvas/82">{item.label} — </span>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs leading-relaxed text-canvas/42">
                    Do not include credentials, API keys, payment details, unreleased client data, or production secrets.
                  </p>
                </div>
              </aside>

              <section aria-labelledby="decision-protocol-title" className="border border-canvas/12 p-5 md:p-7">
                <p className="text-xs text-canvas/48">Before scope expands</p>
                <h2 id="decision-protocol-title" className="mt-4 font-serif text-3xl italic leading-none text-canvas md:text-4xl">
                  Three decision gates.
                </h2>
                <ol className="mt-6 grid gap-px border border-canvas/12 bg-canvas/12">
                  {decisionProtocol.map((item) => (
                    <li key={item.label} className="bg-ink p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent">{item.label}</p>
                      <h3 className="mt-3 text-sm font-medium leading-relaxed text-canvas">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-canvas/60">{item.description}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="buyer-questions-title" className="border border-canvas/12 p-5 md:p-7">
                <p className="text-xs text-canvas/48">Buyer Q/A</p>
                <h2 id="buyer-questions-title" className="mt-4 font-serif text-3xl italic leading-none text-canvas md:text-4xl">
                  Questions to settle before access.
                </h2>
                <div className="mt-6 border-t border-canvas/12">
                  {buyerQuestions.map((item) => (
                    <details key={item.question} className="group border-b border-canvas/12">
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-5 py-4 text-sm leading-relaxed text-canvas/76 marker:content-none">
                        <span>{item.question}</span>
                        <span aria-hidden="true" className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none">
                          +
                        </span>
                      </summary>
                      <p className="max-w-xl pb-5 pr-8 text-sm leading-relaxed text-canvas/60">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <nav className="border border-canvas/12" aria-label="Elsewhere links">
                {elsewhereLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-canvas/12 px-5 py-4 text-sm text-canvas/62 transition-colors duration-200 last:border-b-0 hover:bg-canvas hover:text-ink motion-reduce:transition-none"
                  >
                    <span>{link.label}</span>
                    <span className="flex items-center gap-3 text-right text-xs text-current/60">
                      {link.meta}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" strokeWidth={1.5} />
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
