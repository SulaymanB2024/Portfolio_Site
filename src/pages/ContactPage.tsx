import { AuditIntakeForm } from '../components/AuditIntakeForm';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { contextualProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CONTACT_SEO = getSeoRoute('/contact')!;

const projectTypes = [
  'Technical SEO and search visibility audit',
  'Atlas-style crawl data review',
  'GA4/GSC search analytics and launch baseline',
];

const typicalDeliverables = [
  'Crawl findings tied to affected URLs and source notes',
  'Indexation, canonical, internal-link, and structured-data review',
  'GSC/GA4 review where access is available',
  'Prioritized implementation notes for the next fixes',
];

const fitNotes = [
  {
    title: 'Best fit',
    copy: 'Startups, local businesses, B2B sites, technical websites, and content-heavy sites that need crawlability, indexation, page structure, or search visibility reviewed.',
  },
  {
    title: 'Not a fit',
    copy: 'Generic content packages, paid ads management, social media management, or work that depends on private credentials before scope is clear.',
  },
];

const usefulBriefDetails = [
  'The canonical site URL, the pages or templates that feel underperforming, and whether the issue is crawlability, indexation, visibility, conversion, or reporting.',
  'Any available Search Console, GA4, CMS, sitemap, crawl export, or analytics context that can be reviewed after scope is agreed.',
  'The decision the audit should support: what to fix first, what to stop doing, what evidence is missing, or what handoff an engineer or owner needs.',
];

const intakeBoundaries = [
  'Do not send passwords, API keys, payment details, unreleased client data, or production credentials through the public form.',
  'The first pass can use public pages and crawl evidence. Private analytics or Search Console data should only enter after the project scope is clear.',
  'The output should separate observations from interpretation, then turn the evidence into a short implementation path.',
];

const contactProofLinks = [
  ...contextualProofLinks.slice(0, 2),
  {
    label: 'Void Agency page',
    href: '/void-agency',
    description: 'Service-practice page for the Void Agency technical SEO work.',
  },
];

function CornerMarks() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 text-current/28 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <span className="absolute left-3 top-3 h-px w-4 bg-current" />
      <span className="absolute left-3 top-3 h-4 w-px bg-current" />
      <span className="absolute bottom-3 right-3 h-px w-4 bg-current" />
      <span className="absolute bottom-3 right-3 h-4 w-px bg-current" />
    </span>
  );
}

export default function ContactPage() {
  useSEO(CONTACT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/contact" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[0.46fr_0.54fr] xl:px-10 xl:pt-20">
        <div className="self-end">
          <p className="mb-9 text-[10px] uppercase tracking-[0.36em] text-canvas/48">Audit intake</p>
          <h1 className="font-serif text-[4.4rem] md:text-[7rem] xl:text-[9.5rem] italic leading-[0.82] tracking-normal">
            Request a technical SEO audit.
          </h1>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-canvas/62">
            Use this form for technical SEO audits, crawl reviews, analytics, markets research, or other projects that need the source material checked before the recommendation.
          </p>
          <div className="mt-10 grid gap-3 text-[10px] uppercase tracking-[0.22em] text-canvas/58">
            <a href="/atlas/sample-crawl" className="underline decoration-canvas/18 underline-offset-4 transition-colors hover:text-canvas">
              See an Atlas sample crawl run
            </a>
            <a href="/method" className="underline decoration-canvas/18 underline-offset-4 transition-colors hover:text-canvas">
              Read the technical SEO audit method
            </a>
            <a href="/void-agency" className="underline decoration-canvas/18 underline-offset-4 transition-colors hover:text-canvas">
              Void Agency technical SEO practice
            </a>
          </div>
        </div>

        <div className="self-center border border-canvas/14 p-5 md:p-8">
          <AuditIntakeForm className="max-w-none" />
          <p className="mt-8 max-w-2xl text-[10px] uppercase leading-relaxed tracking-[0.18em] text-canvas/42">
            Submissions go through the same Formspree endpoint as the homepage brief form. Do not include private credentials, unreleased client data, payment details, or production secrets.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
            What to request.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            The useful request names the site, the business problem, the suspected visibility issue, and the decision you need the audit to support.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 lg:grid-cols-3">
          <div className="bg-canvas/[0.012] p-5">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Project types</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {projectTypes.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-canvas/[0.012] p-5">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Typical output</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {typicalDeliverables.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-px bg-canvas/14">
            {fitNotes.map((note) => (
              <div key={note.title} className="bg-ink p-5">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">{note.title}</h3>
                <p className="mt-6 text-sm leading-relaxed text-canvas/62">{note.copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-canvas/58">
          <a href="#contact-name" className="border border-canvas bg-canvas px-5 py-3 text-ink transition-colors hover:bg-transparent hover:text-canvas">
            Send the brief
          </a>
          <a href="mailto:sulayman.bowles@gmail.com" className="underline decoration-canvas/18 underline-offset-4 transition-colors hover:text-canvas">
            Direct contact: sulayman.bowles@gmail.com
          </a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
          <h2 className="font-serif text-[3rem] md:text-[4.5rem] xl:text-[6rem] italic leading-[0.9] tracking-normal">
            What makes the brief usable.
          </h2>
          <p className="max-w-3xl self-end text-base leading-relaxed text-canvas/58">
            A useful audit request gives enough source material to inspect the problem without guessing. The first exchange should define the site, the evidence available, and the decision the work needs to support.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 lg:grid-cols-2">
          <div className="bg-canvas/[0.012] p-5">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Include</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {usefulBriefDetails.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-canvas/[0.012] p-5">
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-canvas/44">Keep out of the form</h3>
            <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-canvas/62">
              {intakeBoundaries.map((item) => (
                <li key={item} className="border-l border-canvas/14 pl-4">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/12 px-4 py-16 md:px-8 xl:px-10">
        <h2 className="mb-8 text-[10px] uppercase tracking-[0.32em] text-canvas/45">Before you send</h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-canvas/14 md:grid-cols-3">
          {contactProofLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group relative min-h-[170px] overflow-hidden bg-canvas/[0.012] p-5 transition-colors hover:bg-canvas hover:text-ink"
            >
              <CornerMarks />
              <h3 className="text-xs uppercase tracking-[0.22em] text-inherit">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/contact" tone="dark" />
      </div>
    </main>
  );
}
