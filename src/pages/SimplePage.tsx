import { SIMPLE_BOOK_CHAPTERS, SIMPLE_BOOK_DESCRIPTION, SIMPLE_BOOK_H1, SIMPLE_BOOK_LINKS } from '../content/simpleBook';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const SIMPLE_SEO = getSeoRoute('/simple')!;

export default function SimplePage() {
  useSEO(SIMPLE_SEO);

  return (
    <main
      id="top"
      className="site-page site-page-light site-page-book relative min-h-screen overflow-x-hidden bg-canvas font-sans text-ink selection:bg-ink selection:text-canvas"
    >
      <img
        src="/art/roman-toga/roman-toga-lines.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed right-[-12rem] top-8 z-0 hidden h-[92vh] max-h-[980px] w-auto opacity-[0.035] mix-blend-multiply lg:block"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] gap-12 px-4 py-6 md:px-8 lg:grid-cols-[220px_minmax(0,76ch)] lg:gap-16 lg:py-10 xl:px-10">
        <header className="border-b border-ink/14 pb-8 lg:col-span-2">
          <nav
            aria-label="View switch"
            className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.26em] text-ink/54"
          >
            <a href="/" className="underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink">
              Designed site
            </a>
            <span aria-current="page" className="text-ink">
              Book
            </span>
          </nav>

          <section className="grid min-h-[68vh] content-end gap-12 pt-20 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-ink/45">Sulayman Bowles / Book</p>
              <h1 className="mt-10 max-w-4xl font-serif text-[clamp(4rem,13vw,10rem)] italic leading-[0.84] tracking-normal">
                {SIMPLE_BOOK_H1}
              </h1>
            </div>
            <aside className="self-end border-t border-ink/14 pt-5 lg:border-l lg:border-t-0 lg:pl-6">
              <p className="font-serif text-xl leading-snug text-ink/72 md:text-2xl">
                I keep this page quiet because some work is easier to understand as a sequence of paragraphs.
              </p>
              <p className="mt-5 text-[10px] uppercase leading-relaxed tracking-[0.24em] text-ink/44">
                Technical SEO / AI search / finance research / software systems
              </p>
            </aside>
          </section>
        </header>

        <nav
          aria-label="Book table of contents"
          className="border-b border-ink/14 pb-8 lg:hidden"
        >
          <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-ink/45">Contents</p>
          <ol className="grid gap-3">
            {SIMPLE_BOOK_CHAPTERS.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`/simple#${chapter.id}`}
                  className="grid grid-cols-[2.5rem_1fr] gap-3 text-sm text-ink/70 underline decoration-ink/18 underline-offset-4 hover:text-ink"
                >
                  <span className="font-serif italic text-ink/48">{chapter.numeral}</span>
                  <span>{chapter.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <aside className="relative z-10 hidden lg:block">
          <nav
            aria-label="Book table of contents"
            className="sticky top-8 border-t border-ink/14 pt-5 text-[10px] uppercase tracking-[0.22em] text-ink/44"
          >
            <p className="mb-5 text-ink/58">Contents</p>
            <ol className="grid gap-3">
              {SIMPLE_BOOK_CHAPTERS.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`/simple#${chapter.id}`}
                    className="grid grid-cols-[2rem_1fr] gap-3 leading-relaxed underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/24"
                  >
                    <span className="font-serif text-sm italic normal-case tracking-normal text-ink/42">
                      {chapter.numeral}
                    </span>
                    <span>{chapter.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="book-prose relative z-10 max-w-[76ch] pb-20 font-serif text-[1.15rem] leading-[1.78] text-ink/78 md:text-[1.22rem]">
          <p className="lead">
            {SIMPLE_BOOK_DESCRIPTION}
          </p>

          {SIMPLE_BOOK_CHAPTERS.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="scroll-mt-24 border-t border-ink/14 py-12 md:py-16">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-ink/42">
                {chapter.numeral} / {chapter.eyebrow}
              </p>
              <h2 className="mt-5 font-serif text-[clamp(2.4rem,6vw,4.6rem)] italic leading-[0.95] tracking-normal text-ink">
                {chapter.title}
              </h2>
              <div className="mt-8">
                {chapter.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {chapter.links && (
                <ul className="mt-8 grid gap-3 border-t border-ink/12 pt-6 font-sans text-[10px] uppercase tracking-[0.22em]">
                  {chapter.links.map((link) => (
                    <li key={`${chapter.id}-${link.href}`}>
                      <a
                        href={link.href}
                        className="inline underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                      <span className="ml-3 normal-case tracking-normal text-ink/48">{link.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        <footer className="border-t border-ink/14 py-8 text-[10px] uppercase tracking-[0.26em] text-ink/48 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <a href="/simple#top" className="underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink">
              Top
            </a>
            <nav aria-label="Book links" className="flex flex-wrap gap-x-5 gap-y-3">
              {SIMPLE_BOOK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="underline decoration-ink/24 underline-offset-4 transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
