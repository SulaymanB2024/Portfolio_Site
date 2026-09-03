import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import type { PortfolioCtaId } from '../analytics/portfolioAnalytics';
import { InternalHeader } from '../components/InternalHeader';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CONTACT_SEO = getSeoRoute('/contact')!;

const contactLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sulayman-bowles/',
    external: true,
    ctaId: 'contact_linkedin',
  },
  {
    label: 'Résumé',
    href: '/resume',
    external: false,
    ctaId: 'contact_resume',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/SulaymanB2024',
    external: true,
    ctaId: 'contact_github',
  },
] satisfies ReadonlyArray<{ label: string; href: string; external: boolean; ctaId: PortfolioCtaId }>;

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

export default function ContactPage() {
  useSEO(CONTACT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <InternalHeader activePath="/contact" tone="dark" variant="final-frame" />

      <section aria-labelledby="contact-title" className="relative z-10 mx-auto flex min-h-[calc(100svh-82px)] max-w-[1480px] px-4 pb-12 pt-4 md:px-8 md:pb-16 lg:px-10">
        <div className="relative isolate grid w-full overflow-hidden border border-canvas/14 px-5 py-8 md:px-8 md:py-10 lg:grid-rows-[minmax(0,1fr)_auto] lg:px-10">
          <FrameMarks />

          <div className="relative z-10 flex flex-col justify-center py-10 md:py-16">
            <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-canvas/48">Direct contact</p>
            <h1 id="contact-title" className="max-w-5xl font-serif text-6xl font-light italic leading-[0.8] tracking-normal text-canvas sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem]">
              Contact Sulayman.
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-relaxed text-canvas/64 md:text-base">
              For roles, technical SEO, product systems, or research, email me directly.
            </p>
            <a
              href="mailto:sulayman.bowles@gmail.com"
              data-portfolio-cta="contact_email"
              className="group mt-7 inline-flex min-h-12 w-fit max-w-full items-center gap-3 border-b border-canvas/32 text-sm tracking-[0.05em] text-canvas transition-colors duration-200 hover:border-accent hover:text-accent motion-reduce:transition-none sm:text-base md:text-lg"
            >
              <span className="min-w-0 break-all">sulayman.bowles@gmail.com</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
                strokeWidth={1.4}
              />
            </a>
          </div>

          <nav className="relative z-10 grid border-y border-canvas/14 sm:grid-cols-3" aria-label="Contact links">
            {contactLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                data-portfolio-cta={link.ctaId}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="group flex min-h-20 items-center justify-between gap-5 border-b border-canvas/14 px-4 text-[11px] uppercase tracking-[0.24em] text-canvas/64 transition-colors duration-200 last:border-b-0 hover:bg-canvas hover:text-ink motion-reduce:transition-none sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <span className="flex items-center gap-4">
                  <span className="font-serif text-sm italic tracking-normal text-current/45">{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                </span>
                {link.external ? (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                    strokeWidth={1.4}
                  />
                ) : (
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                    strokeWidth={1.4}
                  />
                )}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
