import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import VisibilitySystemMap from '../components/VisibilitySystemMap';
import { WireframeGrid } from '../components/WireframeGrid';
import { PROFILE_FACTS, formatEducation } from '../content/profileFacts';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ABOUT_SEO = getSeoRoute('/about')!;

const currentWork = [
  {
    title: 'Atlas',
    copy: 'I designed the product, crawl evidence contract, review states, persistence, and export paths so every recommendation can be traced to the page, render, source, and run that produced it.',
    href: '/atlas',
  },
  {
    title: 'Void Agency',
    copy: 'I run fixed-scope technical audits, web systems, analytics review, and implementation handoffs through this practice. $50K+ collected revenue as of May 31, 2026.',
    href: '/void-agency',
  },
  {
    title: 'Product work',
    copy: 'AI product research, competitive analysis, workflow mapping, and prototype review through Chegg’s Office of the Chief Product Officer.',
    href: '/resume',
  },
  {
    title: 'Finance and research',
    copy: 'I build source ledgers, ownership models, assumption tables, market validation, unit economics, and financial models through McCombs, Texas Venture Labs, and public research.',
    href: '/research',
  },
];

const operatingPrinciples = [
  ['Inspect the inputs', 'URL records, source and rendered pages, contracts, filings, and user workflows come before the polished answer.'],
  ['Separate fact from inference', 'Observed fields, derived findings, analyst judgment, missing coverage, and recommendations stay distinguishable.'],
  ['Ship the review path', 'A useful system preserves the source, names the owner, defines the acceptance check, and makes the rerun possible.'],
];

export default function AboutPage() {
  useSEO(ABOUT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/about" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-102px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] xl:px-10 xl:pt-20">
        <div className="self-center">
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">About</p>
          <h1 className="font-serif text-[3.8rem] italic leading-[0.9] tracking-normal md:text-[5.6rem] xl:text-[7rem]">
            I build technical systems that make evidence inspectable.
          </h1>
          <div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-canvas/70">
            <p>
              I design and implement crawl, product, and research systems. Atlas is the clearest expression of that work: preserve raw and rendered page states, connect findings to URL-level evidence, and carry reviewed results through persistence and exports.
            </p>
            <p>
              My implementation work spans React and TypeScript interfaces, Python and SQLite workflows, CSV and JSON exports, analytics, and validation gates. At UT Austin, I am pursuing {formatEducation()} through McCombs and the music program. Music remains a live part of how I think about structure, iteration, and whether an underlying system holds together.
            </p>
            <p>
              The work is inspectable rather than assertion-led: the relevant project pages attach sanitized crawl rows, source ledgers, method notes, system designs, public code, and explicit evidence limits.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
            <a href="/work" className="border-b border-canvas/30 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Selected work</a>
            <a href="/resume" className="border-b border-canvas/30 pb-1 text-canvas/72 hover:border-canvas hover:text-canvas">Resume</a>
            <a href="/contact" className="border-b border-accent/45 pb-1 text-accent hover:border-canvas hover:text-canvas">Contact</a>
          </div>
        </div>

        <div className="self-center">
          <VisibilitySystemMap className="aspect-[1000/620] w-full" />
          <div className="mt-4 flex flex-col gap-3 border-b border-canvas/14 pb-4 text-[10px] uppercase tracking-[0.2em] text-canvas/60 sm:flex-row sm:justify-between">
            <span>Inputs: crawl / product / market</span>
            <span>Output: reviewable decision</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-16 md:px-8 xl:px-10 xl:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Current work</p>
            <h2 className="mt-4 font-serif text-[3rem] italic leading-[0.9] md:text-[5rem]">Four connected lanes.</h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-canvas/68">
            The fields differ; the engineering habit does not. Preserve the inputs, make the transformation legible, and ship a result another person can audit or rerun.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {currentWork.map((item, index) => (
            <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} className="min-h-[290px] bg-ink p-6 transition-colors hover:bg-canvas hover:text-ink">
              <p className="text-[10px] uppercase tracking-[0.22em] text-current/60">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-12 font-serif text-3xl italic leading-none tracking-normal text-current">{item.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-current/70">{item.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-14 px-4 py-16 md:px-8 lg:grid-cols-[0.56fr_0.44fr] xl:px-10 xl:py-24">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Experience</p>
          <div className="mt-8 divide-y divide-canvas/14 border-y border-canvas/14">
            {PROFILE_FACTS.experience.map((item) => (
              <article key={`${item.title}-${item.organization}`} className="grid gap-4 py-6 md:grid-cols-[0.34fr_0.66fr]">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-canvas">{item.title}</h3>
                  <p className="mt-2 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-canvas/60">{item.organization}<br />{item.dates}</p>
                </div>
                <p className="text-sm leading-relaxed text-canvas/70">{item.publicSummary}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-canvas/60">Operating principles</p>
          <div className="mt-8 grid gap-4">
            {operatingPrinciples.map(([title, copy], index) => (
              <article key={title} className="border border-canvas/14 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">0{index + 1}</p>
                <h3 className="mt-6 font-serif text-2xl italic tracking-normal text-canvas">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-canvas/68">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-canvas/14 px-4 py-14 md:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <h2 className="font-serif text-[3rem] italic leading-none md:text-[4rem]">Music is current work, too.</h2>
          <div className="max-w-3xl space-y-4 text-base leading-relaxed text-canvas/68">
            <p>
              I am completing a BA in Music alongside the BBA in Finance. Classical bass and composition inform the same questions that show up in product and systems work: how parts relate, how constraints create form, and why a convincing surface cannot substitute for a sound underlying structure.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 pt-12 md:px-8 xl:px-10">
        <InternalFooter activePath="/about" tone="dark" />
      </div>
    </main>
  );
}
