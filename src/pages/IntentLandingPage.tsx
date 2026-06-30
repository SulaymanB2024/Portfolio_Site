import { useEffect } from 'react';
import { getIntentPageByPath } from '../content/intentPages';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { SmoothCursor } from '../components/SmoothCursor';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

function PageHeader({ tone, label }: { tone: 'light' | 'dark'; label: string }) {
  const isDark = tone === 'dark';
  const text = isDark ? 'text-[#f1efe8]' : 'text-ink';
  const border = isDark ? 'border-[#f1efe8]/12' : 'border-ink/12';
  const bg = isDark ? 'bg-[#080807]/82' : 'bg-[#f1efe8]/82';
  const muted = isDark ? 'text-[#f1efe8]/58' : 'text-ink/58';
  const linkClass = isDark
    ? 'hover-target transition-colors text-[#f1efe8]/58 hover:text-[#f1efe8]'
    : 'hover-target transition-colors text-ink/58 hover:text-ink';

  return (
    <header className="sticky top-0 z-50 mx-auto w-full max-w-[1480px] px-4 py-6 md:px-8 xl:px-10">
      <div className={`grid items-start gap-5 border-b ${border} ${bg} pb-5 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm grid-cols-2 md:grid-cols-[1fr_auto_1fr]`}>
        <a href="/" id="intent-brand-link" className="hover-target col-span-1 order-1" data-cursor-text="HOME">
          <span className={`block font-medium ${text}`}>SULAYMAN BOWLES</span>
          <span className={`mt-2 block font-serif text-sm italic normal-case tracking-normal ${muted}`}>Technical SEO, Atlas, and finance research.</span>
        </a>
        <nav className="col-span-2 order-3 flex flex-wrap items-center justify-center gap-3 md:col-span-1 md:order-2 md:gap-6">
          <a href="/atlas" className={linkClass}>ATLAS</a>
          <a href="/method" className={linkClass}>METHOD</a>
          <a href="/markets" className={linkClass}>MARKETS</a>
          <a href="/resume" className={linkClass}>RESUME</a>
        </nav>
        <a href="/#contact" id="intent-header-contact" data-cursor-text="CONTACT" className={`hover-target col-span-1 order-2 justify-self-end transition-colors md:col-span-1 md:order-3 ${muted} ${isDark ? 'hover:text-[#f1efe8]' : 'hover:text-ink'}`}>
          CONTACT
        </a>
      </div>
      <div className={`mx-auto mt-3 max-w-[1480px] text-[9px] uppercase tracking-[0.28em] ${muted}`}>{label}</div>
    </header>
  );
}

function ToneNoise({ tone }: { tone: 'light' | 'dark' }) {
  if (tone === 'light') {
    return <div className="bg-noise pointer-events-none" />;
  }

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

function IntentTable({
  rows,
  tone,
}: {
  rows: Array<{ item: string; evidence: string; action: string }>;
  tone: 'light' | 'dark';
}) {
  const border = tone === 'dark' ? 'border-[#f1efe8]/12' : 'border-ink/14';
  const muted = tone === 'dark' ? 'text-[#f1efe8]/56' : 'text-ink/56';
  const strong = tone === 'dark' ? 'text-[#f1efe8]' : 'text-ink';
  const surface = tone === 'dark' ? 'bg-[#f1efe8]/[0.018]' : 'bg-ink/[0.025]';

  return (
    <div className={`overflow-hidden border ${border} ${surface}`}>
      <div className={`grid grid-cols-3 border-b ${border} px-4 py-4 text-[9px] uppercase tracking-[0.24em] ${muted}`}>
        <span>Check</span>
        <span>Evidence</span>
        <span>Action</span>
      </div>
      {rows.map((row) => (
        <div key={row.item} className={`grid gap-4 border-b ${border} px-4 py-5 text-sm leading-relaxed last:border-b-0 md:grid-cols-3`}>
          <div className={`text-[10px] uppercase tracking-[0.26em] ${strong}`}>{row.item}</div>
          <p className={muted}>{row.evidence}</p>
          <p className={muted}>{row.action}</p>
        </div>
      ))}
    </div>
  );
}

export default function IntentLandingPage({ path }: { path: string }) {
  const page = getIntentPageByPath(path) ?? getIntentPageByPath('/method/technical-seo-audit')!;
  const route = getSeoRoute(page.path) ?? getSeoRoute('/method')!;
  const prefersReducedMotion = useReducedMotion();
  const isDark = page.tone === 'dark';

  useSEO(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  const shell = isDark
    ? 'bg-[#080807] text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]'
    : 'bg-canvas text-ink selection:bg-ink selection:text-canvas';
  const border = isDark ? 'border-[#f1efe8]/12' : 'border-ink/14';
  const muted = isDark ? 'text-[#f1efe8]/58' : 'text-ink/58';
  const faint = isDark ? 'text-[#f1efe8]/38' : 'text-ink/42';
  const accent = page.parent === 'markets' ? 'text-[#c2695e]' : 'text-[#b7c8a8]';
  const button = isDark ? 'border-[#f1efe8]/20 text-[#f1efe8] hover:bg-[#f1efe8] hover:text-[#080807]' : 'border-ink/20 text-ink hover:bg-ink hover:text-canvas';

  return (
    <main className={`min-h-screen font-sans antialiased md:cursor-none ${shell}`}>
      <ToneNoise tone={page.tone} />
      <PageTechnicalChrome tone={page.tone} />
      {!prefersReducedMotion && (
        <div className="hidden md:block">
          <SmoothCursor />
        </div>
      )}
      <ScrollProgress tone={isDark ? 'light' : 'dark'} />
      <PageHeader tone={page.tone} label={page.label} />

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-12 px-4 py-14 md:px-8 lg:grid-cols-[0.52fr_0.48fr] xl:px-10 xl:py-20">
        <div>
          <p className={`mb-8 text-[10px] uppercase tracking-[0.36em] ${accent}`}>{page.label}</p>
          <h1 className="max-w-5xl font-serif text-[clamp(4.2rem,10vw,11rem)] italic leading-[0.8] tracking-[-0.055em]">
            {page.title}
          </h1>
          <p className={`mt-10 max-w-3xl font-serif text-[clamp(2rem,4.4vw,4.8rem)] italic leading-[0.94] tracking-[-0.03em] ${muted}`}>
            {page.deck}
          </p>
        </div>

        <div className={`self-end border-l ${border} pl-6`}>
          <p className={`max-w-xl text-base leading-relaxed ${muted}`}>{page.summary}</p>
          <p className={`mt-8 border-t ${border} pt-6 text-[10px] uppercase leading-loose tracking-[0.24em] ${faint}`}>
            {page.proofLine}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={page.primaryCta.href} className={`hover-target border px-5 py-3 text-[10px] uppercase tracking-[0.24em] transition-colors ${button}`}>
              {page.primaryCta.label}
            </a>
            <a href={page.secondaryCta.href} className={`hover-target border px-5 py-3 text-[10px] uppercase tracking-[0.24em] transition-colors ${button}`}>
              {page.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      <section className={`mx-auto max-w-[1480px] border-y ${border} px-4 py-12 md:px-8 xl:px-10`}>
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div>
            <h2 className={`mb-6 text-[10px] uppercase tracking-[0.34em] ${faint}`}>SEARCH INTENT ANSWERED</h2>
            <p className={`max-w-md text-sm leading-relaxed ${muted}`}>
              This page is built to answer a specific search, then route qualified visitors to the deeper project, method, research, resume, or contact page.
            </p>
          </div>
          <div className="grid gap-px md:grid-cols-2">
            {page.checks.map((check, index) => (
              <div key={check} className={`border ${border} p-5`}>
                <div className={`mb-5 text-[10px] uppercase tracking-[0.28em] ${faint}`}>{String(index + 1).padStart(2, '0')}</div>
                <p className="text-base leading-relaxed">{check}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1480px] grid-cols-1 gap-10 px-4 py-14 md:px-8 lg:grid-cols-[0.42fr_0.58fr] xl:px-10 xl:py-20">
        <div>
          <h2 className="max-w-xl font-serif text-[clamp(3.2rem,6.5vw,7.5rem)] italic leading-[0.86] tracking-[-0.04em]">
            Evidence before recommendations.
          </h2>
          <div className={`mt-9 grid gap-3 text-[10px] uppercase tracking-[0.24em] ${muted}`}>
            {page.deliverables.map((item) => (
              <div key={item} className={`border-b ${border} pb-3`}>{item}</div>
            ))}
          </div>
        </div>
        <IntentTable rows={page.evidenceRows} tone={page.tone} />
      </section>

      <section className={`mx-auto max-w-[1480px] border-t ${border} px-4 py-14 md:px-8 xl:px-10 xl:py-20`}>
        <div className="grid gap-8 md:grid-cols-2">
          {page.sections.map((section) => (
            <article key={section.title} className={`border ${border} p-6 md:p-8`}>
              <h2 className="mb-6 font-serif text-4xl italic leading-none tracking-[-0.02em]">{section.title}</h2>
              <p className={`mb-8 text-sm leading-relaxed ${muted}`}>{section.copy}</p>
              <ul className={`space-y-3 text-[10px] uppercase tracking-[0.22em] ${faint}`}>
                {section.bullets.map((bullet) => (
                  <li key={bullet} className={`border-t ${border} pt-3`}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <footer className={`mx-auto grid max-w-[1480px] grid-cols-1 items-start gap-8 border-t ${border} px-4 py-8 text-[10px] uppercase tracking-[0.3em] ${muted} md:grid-cols-[1fr_auto_1fr] md:px-8 xl:px-10`}>
        <div>
          <div className={isDark ? 'text-[#f1efe8]' : 'text-ink'}>SULAYMAN BOWLES</div>
          <div className="mt-2 font-serif text-sm italic normal-case tracking-normal">Technical SEO, Atlas, and finance research.</div>
        </div>
        <nav className="flex flex-wrap gap-5">
          <a href="/atlas" className="hover-target">ATLAS</a>
          <a href="/method" className="hover-target">METHOD</a>
          <a href="/markets" className="hover-target">MARKETS</a>
          <a href="/resume" className="hover-target">RESUME</a>
          <a href="/#contact" className="hover-target">CONTACT</a>
        </nav>
        <div className="md:text-right">
          {page.label}
          <br />
          SEARCH LANDING PAGE
        </div>
      </footer>
    </main>
  );
}
