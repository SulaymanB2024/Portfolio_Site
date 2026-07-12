import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  LinkPanel,
  PageFrame,
  PageShell,
  SectionEyebrow,
  SectionHeader,
} from '../components/design/Primitives';
import { RESEARCH_ARTICLES } from '../content/researchArticles';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESEARCH_ROUTE = getSeoRoute('/research')!;
const RESEARCH_COIN_ART = '/images/markets/noise-expansion-coin-alpha.png';

const researchNotes = [
  {
    category: 'Product and data',
    title: 'Beyond the Leaderboard: ViralBench + Codex',
    href: '/viralbench-codex-agent-harness',
    description: 'A code-level design for traces, replay, controlled trials, and a bounded engineering loop around a live marketing agent.',
    date: '2026.07.09',
  },
  ...RESEARCH_ARTICLES.map((article) => ({
    category: article.slug === 'technical-seo-public-data-infrastructure' ? 'Technical SEO' : 'Search systems',
    title: article.title,
    href: `/markets/${article.slug}`,
    description: article.subtitle,
    date: article.dateModified ?? article.date,
  })),
  {
    category: 'Markets and investing',
    title: 'Who Owns the Toll Roads in Texas?',
    href: '/markets/who-owns-texas-toll-roads',
    description: 'A statewide ownership map separating public title, private concessions, operators, creditors, revenue rights, and analyst-screening economics.',
    date: '2026.07.11',
  },
  {
    category: 'Technical SEO',
    title: 'Austin Crawlability Pilot',
    href: '/austin-technical-seo',
    description: 'A bounded 12-site public-homepage pilot with explicit data cutoff, measurement gaps, source CSV, and no ranking or site-health claims.',
    date: '2026.06.25',
  },
  {
    category: 'Product and data',
    title: 'Atlas Sample Crawl Run',
    href: '/atlas/sample-crawl',
    description: 'A sanitized walkthrough of how crawl rows, canonical state, depth, links, and issue labels become reviewable evidence.',
    date: '2026.07.12',
  },
];

const researchCategories = [
  {
    id: 'research-search-systems',
    title: 'Search systems',
    description: 'Crawler policy, canonical identity, and public records.',
  },
  {
    id: 'research-technical-seo',
    title: 'Technical SEO',
    description: 'Crawlability, structured data, provenance, and bounded public studies.',
  },
  {
    id: 'research-markets-investing',
    title: 'Markets and investing',
    description: 'Ownership structures, valuation frames, assumptions, and risk.',
  },
  {
    id: 'research-product-data',
    title: 'Product and data',
    description: 'Agent evaluation, Atlas outputs, and inspectable technical artifacts.',
  },
] as const;

export default function ResearchPage() {
  useSEO(RESEARCH_ROUTE);

  return (
    <PageShell id="top" tone="light">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35" />
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/research" tone="light" />

      <PageFrame className="relative z-10">
        <section className="research-hero relative flex items-center overflow-hidden border-b border-current/12 py-12 md:py-14">
          <div aria-hidden="true" className="research-hero-copy-scrim" />
          <img
            src={RESEARCH_COIN_ART}
            alt=""
            aria-hidden="true"
            className="research-coin-art pointer-events-none select-none mix-blend-multiply"
            draggable={false}
          />
          <div className="relative z-10 max-w-3xl">
            <SectionEyebrow className="text-ink/64">Research</SectionEyebrow>
            <h1 className="mt-7 max-w-3xl font-serif text-5xl italic leading-[0.86] tracking-normal text-current md:text-8xl xl:text-9xl">
              One archive. Clear categories.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-current/72">
              Search systems, technical SEO, markets, infrastructure, product, and data work now live in one research hub. Finance-only material remains available as a filtered Markets archive.
            </p>
          </div>
        </section>

        <nav aria-label="Research categories" className="border-b border-current/12 py-6 md:py-8">
          <div className="mb-6 grid gap-4 md:grid-cols-[0.42fr_0.58fr] md:items-end">
            <div>
              <SectionEyebrow className="mb-4 text-current/60">Categories</SectionEyebrow>
              <h2 className="font-serif text-4xl italic leading-none tracking-normal md:text-5xl">Four ways into the work.</h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-current/68 md:justify-self-end">
              Each lane has a concrete question, source base, and boundary between observed facts and interpretation.
            </p>
          </div>
          <div className="grid border-l border-t border-current/14 md:grid-cols-2 xl:grid-cols-4">
            {researchCategories.map((category, index) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="group grid min-h-40 content-between border-b border-r border-current/14 p-5 text-current transition-colors hover:bg-current hover:text-canvas focus-visible:bg-current focus-visible:text-canvas"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-inherit opacity-64">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-serif text-3xl italic leading-none tracking-normal md:text-4xl">{category.title}</span>
                  <span className="mt-4 block text-sm leading-relaxed text-inherit opacity-72">{category.description}</span>
                  <span aria-hidden="true" className="mt-5 block h-px w-10 bg-current transition-all duration-300 group-hover:w-20 group-focus-visible:w-20" />
                </span>
              </a>
            ))}
          </div>
        </nav>
      </PageFrame>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Publication index" title="Questions, evidence, limits.">
            Seven distinct notes and artifacts, grouped by the question they help answer. Finance terminology remains reserved for finance work.
          </SectionHeader>

          <div className="divide-y divide-current/14 border-y border-current/14">
            {researchCategories.map((category, categoryIndex) => {
              const notes = researchNotes.filter((note) => note.category === category.title);

              return (
                <section
                  key={category.id}
                  id={category.id}
                  aria-labelledby={`${category.id}-heading`}
                  className="scroll-mt-28 py-12 lg:grid lg:grid-cols-[minmax(220px,0.28fr)_minmax(0,0.72fr)] lg:gap-12 lg:scroll-mt-36 xl:py-16"
                >
                  <header className="mb-8 lg:mb-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-current/60">{String(categoryIndex + 1).padStart(2, '0')} / 04</p>
                    <h3 id={`${category.id}-heading`} className="mt-5 max-w-sm font-serif text-4xl italic leading-none tracking-normal md:text-5xl">
                      {category.title}
                    </h3>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-current/68">{category.description}</p>
                  </header>

                  <div className="grid gap-px border border-current/14 md:grid-cols-2">
                    {notes.map((note) => (
                      <a
                        key={note.href}
                        href={note.href}
                        className="group grid min-h-64 content-between bg-current/[0.018] p-5 text-current transition-colors hover:bg-current hover:text-canvas focus-visible:bg-current focus-visible:text-canvas md:p-6"
                      >
                        <span>
                          <span className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-inherit opacity-64">
                            <span>{note.category}</span>
                            <time>{note.date}</time>
                          </span>
                          <h4 className="mt-8 font-serif text-3xl italic leading-none tracking-normal md:text-4xl">{note.title}</h4>
                          <span className="mt-5 block text-sm leading-relaxed text-inherit opacity-72">{note.description}</span>
                        </span>
                        <span className="mt-8 w-fit border-b border-current/30 pb-1 text-xs uppercase tracking-[0.16em] text-inherit">
                          Open artifact
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </PageFrame>
      </section>

      <section className="relative z-10 border-b border-current/12">
        <PageFrame className="py-16 xl:py-24">
          <SectionHeader eyebrow="Context" title="From note to artifact.">
            Research should connect back to the product, source file, or public work it helps explain.
          </SectionHeader>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['Atlas audit console', '/atlas', 'The crawl and evidence workflow behind the audit examples.'],
              ['Selected work', '/work', 'Six public artifacts with role, constraints, status, and evidence links.'],
              ['Markets filter', '/markets', 'Finance and infrastructure-investing material only.'],
            ].map(([label, href, description]) => (
              <LinkPanel key={href} href={href} className="grid min-h-44 content-between gap-6">
                <span className="font-serif text-3xl italic leading-tight tracking-normal text-current">{label}</span>
                <span className="text-sm normal-case leading-relaxed tracking-normal text-current/68">{description}</span>
              </LinkPanel>
            ))}
          </div>
        </PageFrame>
      </section>

      <PageFrame className="relative z-10 pb-8">
        <InternalFooter activePath="/research" tone="light" />
      </PageFrame>
    </PageShell>
  );
}
