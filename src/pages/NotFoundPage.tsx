import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { WireframeGrid } from '../components/WireframeGrid';
import { NOT_FOUND_ROUTE } from '../seo/routes';
import { useSEO } from '../utils/seo';

export default function NotFoundPage() {
  useSEO(NOT_FOUND_ROUTE);

  return (
    <main id="top" className="site-page site-page-light relative min-h-screen overflow-hidden bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-35" />
      <PageTechnicalChrome tone="light" />
      <InternalHeader activePath="/404" tone="light" />

      <section className="relative z-10 mx-auto grid min-h-[72vh] max-w-[1480px] content-center px-4 py-20 md:px-8 xl:px-10">
        <p className="text-[10px] uppercase tracking-[0.32em] text-ink/60">404 / Route not found</p>
        <h1 className="mt-8 max-w-5xl font-serif text-[5rem] italic leading-[0.82] tracking-normal md:text-[9rem] xl:text-[12rem]">
          This page is not part of the record.
        </h1>
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/68">
          The address may be old, mistyped, or intentionally unavailable. Use the public work, research, or sitemap paths below.
        </p>
        <nav className="mt-9 flex flex-wrap gap-5 text-[10px] uppercase tracking-[0.22em]" aria-label="404 recovery links">
          <a href="/" className="border-b border-ink/28 pb-1 text-ink/70 hover:border-ink hover:text-ink">Home</a>
          <a href="/work" className="border-b border-ink/28 pb-1 text-ink/70 hover:border-ink hover:text-ink">Work</a>
          <a href="/research" className="border-b border-ink/28 pb-1 text-ink/70 hover:border-ink hover:text-ink">Research</a>
          <a href="/sitemap" className="border-b border-ink/28 pb-1 text-ink/70 hover:border-ink hover:text-ink">HTML sitemap</a>
        </nav>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-8 md:px-8 xl:px-10">
        <InternalFooter activePath="" tone="light" />
      </div>
    </main>
  );
}
