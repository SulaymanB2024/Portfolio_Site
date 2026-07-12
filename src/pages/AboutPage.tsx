import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import VisibilitySystemMap from '../components/VisibilitySystemMap';
import { WireframeGrid } from '../components/WireframeGrid';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ABOUT_SEO = getSeoRoute('/about')!;

const currentWork = [
  {
    title: 'Atlas',
    copy: 'A technical SEO crawl and evidence system built because audit recommendations should be traceable to the page, render, source, and review state that produced them.',
    href: '/atlas',
  },
  {
    title: 'Void Agency',
    copy: 'The operating practice around technical audits, web systems, analytics, and implementation. $50K+ collected revenue as of May 31, 2026.',
    href: '/void-agency',
  },
  {
    title: 'Product work',
    copy: 'AI product research, competitive analysis, workflow mapping, and prototype review through the Office of the Chief Product Officer at Chegg.',
    href: '/resume',
  },
  {
    title: 'Finance and research',
    copy: 'Ownership, operating logic, source tables, market validation, unit economics, and financial models through McCombs, Texas Venture Labs, and public research.',
    href: '/research',
  },
];

const experience = [
  ['Founder', 'Void Agency', 'Dec 2025 — Present', 'Technical SEO audits, web systems, analytics, scoping, and delivery.'],
  ['AI Product Manager Intern', 'Chegg · Office of the Chief Product Officer', 'May 2026 — Aug 2026', 'AI product research, competitive analysis, user workflows, and prototype review.'],
  ['Technical SEO Analytics', 'Private engagement', 'May 2026 — Present', 'GA4, Search Console, launch baselines, traffic analysis, keyword performance, and prioritized recommendations.'],
  ['Student Associate', 'Jon Brumley Texas Venture Labs', 'Sep 2025 — Present', 'Market validation, customer discovery, unit economics, go-to-market strategy, and financial models.'],
];

const operatingPrinciples = [
  ['Inspect the inputs', 'Crawl rows, source pages, contracts, filings, and user workflows come before the polished answer.'],
  ['Separate fact from inference', 'Observed fields, analyst judgment, missing information, and recommendations should never blur together.'],
  ['Ship the review path', 'A useful system shows what changed, who owns the next action, and how the result will be checked again.'],
];

export default function AboutPage() {
  useSEO(ABOUT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-canvas selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <InternalHeader activePath="/about" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-82px)] max-w-[1480px] grid-cols-1 items-start gap-14 px-4 pb-16 pt-16 md:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14 xl:px-10">
        <div className="min-w-0">
          <p className="mb-8 text-[10px] uppercase tracking-[0.34em] text-canvas/60">About</p>
          <h1 className="max-w-[10.5ch] font-serif text-[4.25rem] italic leading-[0.88] tracking-normal md:text-[5.5rem] xl:text-[6.5rem]">
            I build systems for messy evidence.
          </h1>
          <div className="mt-9 max-w-[58ch] space-y-5 text-base leading-[1.7] text-canvas/72 md:text-[17px]">
            <p>
              I am a UT Austin McCombs student working across technical SEO, product, software, and finance research. Atlas is the clearest expression of that mix: collect the source material, preserve what actually happened, and turn it into a decision someone can review.
            </p>
            <p>
              Technical SEO and finance feel related to me because both punish vague inputs. A crawl audit needs URL-level evidence; an investment or operating question needs ownership, cash-flow, assumptions, and missing facts kept separate.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]">
            <a href="/work" className="inline-flex min-h-11 items-center border-b border-canvas/30 text-canvas/72 hover:border-canvas hover:text-canvas">Selected work</a>
            <a href="/resume" className="inline-flex min-h-11 items-center border-b border-canvas/30 text-canvas/72 hover:border-canvas hover:text-canvas">Resume</a>
            <a href="/contact" className="inline-flex min-h-11 items-center border-b border-accent/45 text-accent hover:border-canvas hover:text-canvas">Contact</a>
          </div>
        </div>

        <div className="min-w-0">
          <VisibilitySystemMap className="w-full" />
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
            The work shares one operating habit: trace the conclusion back to the source material and keep the limit visible.
          </p>
        </div>
        <div className="grid gap-px border border-canvas/14 bg-canvas/14 md:grid-cols-2 xl:grid-cols-4">
          {currentWork.map((item, index) => (
            <a key={item.title} href={item.href} className="min-h-[290px] bg-ink p-6 transition-colors hover:bg-canvas hover:text-ink">
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
            {experience.map(([role, org, dates, copy]) => (
              <article key={`${role}-${org}`} className="grid gap-4 py-6 md:grid-cols-[0.34fr_0.66fr]">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-canvas">{role}</h3>
                  <p className="mt-2 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-canvas/60">{org}<br />{dates}</p>
                </div>
                <p className="text-sm leading-relaxed text-canvas/70">{copy}</p>
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
          <h2 className="font-serif text-[3rem] italic leading-none md:text-[4rem]">Before business.</h2>
          <div className="max-w-3xl space-y-4 text-base leading-relaxed text-canvas/68">
            <p>
              I studied classical bass and composition before moving toward business, technology, and product work. Music still affects how I think about structure, iteration, and the difference between a convincing surface and a sound underlying system.
            </p>
            <p className="text-sm text-canvas/62">
              Historical music references belong here as background—not as the primary description of what I do now.
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
