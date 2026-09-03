import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import VisibilitySystemMap from '../components/VisibilitySystemMap';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  CalibrationFrame,
  IndexedSection,
  PageFrame,
  PageShell,
  SectionEyebrow,
} from '../components/design/Primitives';
import { PROFILE_FACTS, formatEducation } from '../content/profileFacts';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ABOUT_SEO = getSeoRoute('/about')!;

const currentWork = [
  {
    title: 'Atlas',
    copy: 'I designed the product, crawl model, review workflow, persistence layer, and exports. The public sample shows bounded source capture and a render-review case; it does not imply that every planned capability is public or complete.',
    href: '/atlas',
  },
  {
    title: 'Void Agency',
    copy: 'I run fixed-scope technical audits, web systems, analytics review, and implementation handoffs through this practice. $50K+ collected revenue as of May 31, 2026.',
    href: 'https://www.void-agency.com/',
  },
  {
    title: 'Product work',
    copy: 'AI product research, competitive analysis, workflow mapping, and prototype review through Chegg’s Office of the Chief Product Officer.',
    href: '/resume',
  },
  {
    title: 'Finance and research',
    copy: 'I build ownership maps, assumption tables, market studies, unit-economics analyses, and financial models through McCombs, Texas Venture Labs, and independent research.',
    href: '/research',
  },
];

const operatingPrinciples = [
  ['Inspect the inputs', 'URL records, source and rendered pages, contracts, filings, and user workflows come before the polished answer.'],
  ['Separate fact from inference', 'Observed fields, derived findings, analyst judgment, missing coverage, and recommendations stay distinguishable.'],
  ['Make the decision usable', 'A useful finding points to its source, names an owner, defines what success means, and leaves a clear way to verify the change.'],
];

export default function AboutPage() {
  useSEO(ABOUT_SEO);

  return (
    <PageShell id="top" tone="dark" className="visual-lab-page about-visual">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/about" tone="dark" />

      <PageFrame className="about-visual__frame">
        <section className="about-visual__hero" aria-labelledby="about-title">
          <div className="about-visual__hero-copy">
            <SectionEyebrow className="about-visual__eyebrow">About</SectionEyebrow>
            <h1 id="about-title" className="visual-lab-display about-visual__title">
              I build systems that make complex decisions legible.
            </h1>
            <div className="about-visual__intro">
              <p>
                I work where messy technical systems meet consequential decisions: crawl software, product workflows, analytics, and financial research. Atlas is the clearest expression of that work. It connects source and rendered pages to specific findings and repair priorities, while its public page distinguishes what is working now from what remains partial or in development.
              </p>
              <p>
                My implementation work spans React and TypeScript interfaces, Python and SQLite workflows, CSV and JSON exports, analytics, and validation logic. At UT Austin, I am pursuing {formatEducation()} through McCombs and the music program. Music remains a live part of how I think about structure, iteration, and whether an underlying system holds together.
              </p>
              <p>
                Readers can examine the method behind the work through sanitized crawl rows, research tables, system designs, public code, and clearly stated limits. The point is not documentation for its own sake. It is to make judgment legible enough to challenge, improve, and use.
              </p>
            </div>
            <nav className="visual-lab-text-links" aria-label="About page actions">
              <a href="/work">Selected work</a>
              <a href="/resume">Resume</a>
              <a href="/contact" className="text-accent">Contact</a>
            </nav>
          </div>

          <figure className="about-visual__map">
            <CalibrationFrame className="about-visual__map-frame">
              <VisibilitySystemMap className="aspect-[1000/620] w-full" />
            </CalibrationFrame>
            <figcaption className="about-visual__map-caption">
              <span>Inputs: crawl / product / market</span>
              <span>Output: reviewable decision</span>
            </figcaption>
          </figure>
        </section>

        <IndexedSection
          index="01 / Current work"
          title="Four connected lanes."
          headingId="about-current-work"
          description="The fields differ; the underlying discipline does not. Understand the inputs, make the reasoning legible, and produce something another person can challenge or extend."
        >
          <ol className="visual-lab-record-index about-visual__work-index">
            {currentWork.map((item, index) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="visual-lab-record-link"
                >
                  <span className="visual-lab-record-link__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="visual-lab-record-link__content">
                    <h3>{item.title}</h3>
                    <span>{item.copy}</span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="visual-lab-record-link__arrow" fill="none">
                    <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        </IndexedSection>

        <IndexedSection
          index="02 / Experience"
          title="Experience"
          headingId="about-experience"
        >
          <div className="visual-lab-record-stack">
            {PROFILE_FACTS.experience.map((item) => (
              <article key={`${item.title}-${item.organization}`} className="visual-lab-experience-row">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.organization}<br />{item.dates}</p>
                </div>
                <p>{item.publicSummary}</p>
              </article>
            ))}
          </div>
        </IndexedSection>

        <IndexedSection
          index="03 / Operating principles"
          title="Operating principles"
          headingId="about-principles"
        >
          <ol className="visual-lab-principles">
            {operatingPrinciples.map(([title, copy], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </IndexedSection>

        <IndexedSection
          index="04 / Music"
          title="Music is current work, too."
          headingId="about-music"
          className="about-visual__music"
        >
          <p className="visual-lab-reading-measure">
            I am completing a BA in Music alongside the BBA in Finance. Classical bass and composition inform the same questions that show up in product and systems work: how parts relate, how constraints create form, and why a convincing surface cannot substitute for a sound underlying structure.
          </p>
        </IndexedSection>

        <div className="about-visual__footer">
          <InternalFooter activePath="/about" tone="dark" />
        </div>
      </PageFrame>
    </PageShell>
  );
}
