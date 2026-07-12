import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { AuditIntakeForm } from '../components/AuditIntakeForm';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CONTACT_SEO = getSeoRoute('/contact')!;
const DIRECT_EMAIL = 'sulayman.bowles@gmail.com';
const DIRECT_EMAIL_HREF = `mailto:${DIRECT_EMAIL}`;

const intakeNotes = [
  'Site URL or product surface',
  'Suspected crawl, visibility, or analytics issue',
  'Decision the work needs to support',
];

function ArrowLink({ children, href }: { children: string; href: string }) {
  return (
    <a
      href={href}
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

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <PageTechnicalChrome tone="dark" />
      <InternalHeader activePath="/contact" tone="dark" variant="final-frame" />

      <section className="relative z-10 mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10">
        <div className="grid min-h-[calc(100svh-72px)] items-end gap-12 border-b border-canvas/14 pb-14 pt-16 lg:min-h-[calc(100svh-82px)] lg:grid-cols-[minmax(0,0.64fr)_minmax(300px,0.36fr)] lg:gap-16 lg:pb-16 lg:pt-20">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-canvas/60">Direct contact</p>
            <h1 className="mt-9 max-w-[8ch] font-serif text-[5rem] italic leading-[0.82] tracking-normal text-canvas sm:text-[6.5rem] md:text-[8rem] lg:text-[9rem] xl:text-[10.5rem]">
              Contact
            </h1>
            <a
              href={DIRECT_EMAIL_HREF}
              className="group mt-8 inline-flex max-w-full items-center gap-3 font-serif text-[1.55rem] italic leading-none text-canvas transition-colors duration-200 hover:text-accent motion-reduce:transition-none sm:text-[2rem] md:text-[2.5rem] xl:text-[3rem]"
            >
              <span className="min-w-0 [overflow-wrap:anywhere]">{DIRECT_EMAIL}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none md:h-8 md:w-8"
                strokeWidth={1.1}
              />
            </a>
          </div>

          <div className="min-w-0 border-l border-canvas/14 pl-6 lg:pb-3 lg:pl-8">
            <p className="max-w-xl text-base leading-relaxed text-canvas/70 md:text-lg">
              Send a short brief for technical SEO, crawl evidence, search visibility, analytics, or source-backed research.
            </p>
            <p className="mt-5 max-w-lg font-serif text-xl italic leading-relaxed text-canvas/62">
              Direct email is the fastest path when the request is still taking shape.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              <ArrowLink href="/method">Read the method</ArrowLink>
              <ArrowLink href="/atlas/sample-crawl">Sample crawl</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 border-b border-canvas/14">
        <div className="mx-auto grid w-full max-w-[1480px] gap-14 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,0.66fr)] lg:gap-16 xl:px-10 xl:py-24">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-canvas/60">What helps</p>
            <h2 className="mt-6 max-w-[10ch] font-serif text-[3rem] italic leading-[0.92] text-canvas md:text-[4rem] xl:text-[5rem]">
              A useful brief starts with the decision.
            </h2>
            <ol className="mt-10 divide-y divide-canvas/14 border-y border-canvas/14">
              {intakeNotes.map((item, index) => (
                <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 text-sm leading-relaxed text-canvas/68">
                  <span aria-hidden="true" className="font-serif text-lg italic leading-none text-accent/80">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-canvas/52">
              Do not include credentials, API keys, payment details, unreleased client data, or production secrets.
            </p>
          </div>

          <div className="min-w-0 border-t border-canvas/16 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-canvas/60">Brief form</p>
            <h2 className="mt-6 font-serif text-[3rem] italic leading-[0.9] text-canvas md:text-[4.5rem] xl:text-[5.5rem]">
              Send the context.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-canvas/66">
              Useful when the site, suspected problem, and decision are clear enough to capture in one pass.
            </p>
            <AuditIntakeForm variant="compact" showProgress={false} submitLabel="SEND BRIEF" className="mt-10 text-left" />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 pt-10 md:px-8 xl:px-10">
        <InternalFooter activePath="/contact" tone="dark" />
      </div>
    </main>
  );
}
