import { type ReactNode, useEffect } from 'react';
import { getMarketThesisBySlug } from '../content/marketTheses';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ShutterWipe } from '../components/ShutterWipe';

function DarkNoise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.055]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 22% 28%, rgba(241,239,232,0.24) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 64%, rgba(241,239,232,0.16) 0 1px, transparent 1.7px)',
        backgroundSize: '17px 21px, 25px 31px',
      }}
    />
  );
}

function NavLink({ href, active, id, children }: { href: string; active?: boolean; id?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      id={id}
      data-cursor-text={typeof children === 'string' ? children : 'VIEW'}
      className={`hover-target relative group overflow-visible px-3 py-1 transition-colors ${active ? 'text-[#f1efe8]' : 'text-[#f1efe8]/58 hover:text-[#f1efe8]'}`}
    >
      <span className="block transition-transform duration-500 will-change-transform group-hover:px-2">{children}</span>
      <span className={`absolute left-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>[</span>
      <span className={`absolute right-0 top-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>]</span>
    </a>
  );
}

// Page Footer Component
function PageFooter() {
  return (
    <footer className="w-full border-t border-[#f1efe8]/12 pt-8 text-[10px] uppercase tracking-[0.3em] text-[#f1efe8]/54 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto_1fr_auto]">
      <div>
        <div className="text-[#f1efe8]">SULAYMAN BOWLES</div>
        <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO · AI Product · Finance/Data</div>
      </div>
      <nav className="flex flex-wrap gap-5" id="market-article-footer-nav">
        <NavLink href="/#selected-works" id="market-article-footer-work">WORK</NavLink>
        <NavLink href="/method" id="market-article-footer-method">METHOD</NavLink>
        <NavLink href="/about" id="market-article-footer-about">ABOUT</NavLink>
        <NavLink href="/#contact" id="market-article-footer-contact">CONTACT</NavLink>
      </nav>
      <div className="md:text-right">
        © 2026 SULAYMAN BOWLES
        <br />
        ALL RIGHTS RESERVED
      </div>
      <a href="#top" id="market-article-back-to-top" aria-label="Back to top" data-cursor-text="TOP" className="hover-target h-9 w-9 rounded-full border border-[#f1efe8]/28 transition-colors hover:bg-[#f1efe8] hover:text-[#080807] flex-shrink-0" />
    </footer>
  );
}

export default function MarketArticlePage({ slug }: { slug: string }) {
  const prefersReducedMotion = useReducedMotion();
  const thesis = getMarketThesisBySlug(slug) ?? getMarketThesisBySlug('network-monopolies')!;
  const route = getSeoRoute(`/markets/${thesis.slug}`) ?? getSeoRoute('/markets')!;

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="top" className="min-h-screen w-full bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807] font-sans relative antialiased md:cursor-none">
      <ShutterWipe />
      <PageTechnicalChrome tone="dark" />
      <DarkNoise />

      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress />

      <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
        <div className="grid items-start gap-5 border-b border-[#f1efe8]/12 bg-[#080807]/82 pb-5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr]">
          <a href="/" id="market-article-brand-link" className="hover-target" data-cursor-text="HOME">
            <span className="block font-medium text-[#f1efe8]">SULAYMAN BOWLES</span>
            <span className="mt-2 block font-serif text-sm italic normal-case tracking-normal text-[#f1efe8]/54">Technical SEO · AI Product · Finance/Data</span>
          </a>
          <nav className="flex flex-wrap items-center gap-3 md:justify-center md:gap-6">
            <NavLink href="/#selected-works" id="market-article-nav-work">WORK</NavLink>
            <NavLink href="/method" id="market-article-nav-method">METHOD</NavLink>
            <NavLink href="/about" id="market-article-nav-about">ABOUT</NavLink>
            <NavLink href="/#contact" id="market-article-nav-contact">CONTACT</NavLink>
          </nav>
          <a href="/markets" id="market-article-back-link" data-cursor-text="MARKETS" className="hover-target justify-self-start text-[#f1efe8]/75 transition-colors hover:text-[#f1efe8] md:justify-self-end">
            MARKETS ARCHIVE
          </a>
        </div>
      </header>

      <article className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-16 md:px-8 lg:grid-cols-[0.32fr_0.68fr] xl:px-10 xl:py-24">
        <aside className="space-y-8 border-b border-[#f1efe8]/12 pb-10 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/54 lg:border-b-0 lg:border-r lg:pr-8">
          <a href="/markets" className="hover-target inline-flex text-[#b7c8a8]" data-cursor-text="BACK">
            Back to Markets
          </a>
          <dl className="grid gap-5">
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Memo</dt>
              <dd className="text-[#f1efe8]">{thesis.number}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Category</dt>
              <dd className="text-[#f1efe8]">{thesis.category}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Published</dt>
              <dd className="text-[#f1efe8]">{thesis.date}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[#f1efe8]/34">Read Time</dt>
              <dd className="text-[#f1efe8]">{thesis.readTime}</dd>
            </div>
          </dl>
        </aside>

        <div className="max-w-4xl">
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-[#b7c8a8]">{thesis.category}</p>
          <h1 className="font-serif text-[clamp(3.25rem,8vw,8.5rem)] italic leading-[0.86] tracking-[-0.045em] text-[#f1efe8]">
            {thesis.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-[#f1efe8]/24 pl-5 text-lg italic leading-relaxed text-[#f1efe8]/68">
            {thesis.subtitle}
          </p>

          <div className="my-12 grid gap-4 border-y border-[#f1efe8]/10 py-6 text-[10px] uppercase tracking-[0.2em] text-[#f1efe8]/54 md:grid-cols-3">
            <div>
              <span className="block text-[#f1efe8]/32">Conviction</span>
              <span className="mt-2 block text-[#b7c8a8]">{thesis.conviction}</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/32">Horizon</span>
              <span className="mt-2 block text-[#f1efe8]/82">{thesis.horizon}</span>
            </div>
            <div>
              <span className="block text-[#f1efe8]/32">Allocation</span>
              <span className="mt-2 block text-[#f1efe8]/82">{thesis.allocation}</span>
            </div>
          </div>

          <div className="space-y-8 text-base leading-relaxed text-[#f1efe8]/72">
            {thesis.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="my-12 border border-[#f1efe8]/12 bg-[#f1efe8]/[0.015] p-6 font-mono">
            <div className="mb-4 text-center text-[8px] uppercase tracking-[0.24em] text-[#f1efe8]/45">
              {thesis.formulaLabel}
            </div>
            <div className="overflow-x-auto border-y border-[#f1efe8]/8 py-6 text-center text-sm text-[#f1efe8] md:text-base">
              <span className="select-all">{thesis.formula}</span>
            </div>
          </div>

          <section className="border-t border-[#f1efe8]/12 pt-8">
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#c2695e]/80">Key Risk Vector</h2>
            <p className="text-sm leading-relaxed text-[#f1efe8]/58">{thesis.risks}</p>
          </section>
        </div>
      </article>

      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10 pb-8 relative z-10">
        <PageFooter />
      </div>
    </main>
  );
}
