import type { ServiceModule } from '../content/serviceModules';
import { getContactHref } from '../content/serviceModules';
import { ScrollReveal } from './ScrollReveal';

type Tone = 'light' | 'dark';

function toneClasses(tone: Tone) {
  const dark = tone === 'dark';
  return {
    text: dark ? 'text-[#f1efe8]' : 'text-ink',
    muted: dark ? 'text-[#f1efe8]/58' : 'text-ink/58',
    faint: dark ? 'text-[#f1efe8]/42' : 'text-ink/42',
    border: dark ? 'border-[#f1efe8]/14' : 'border-ink/14',
    borderStrong: dark ? 'border-[#f1efe8]/22' : 'border-ink/22',
    panel: dark ? 'bg-[#f1efe8]/[0.018]' : 'bg-ink/[0.018]',
    hover: dark ? 'hover:border-[#f1efe8]/34 hover:bg-[#f1efe8]/[0.03]' : 'hover:border-ink/34 hover:bg-ink/[0.03]',
    accent: dark ? 'text-[#b7c8a8]' : 'text-[#4f6f43]',
  };
}

export function SourceBasisLabel({ label, status, sourceBasis, tone = 'light' }: ServiceModule['proof'] & { tone?: Tone }) {
  const c = toneClasses(tone);

  return (
    <div className={`border ${c.border} ${c.panel} p-4`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-[9px] uppercase tracking-[0.22em]">
        <span className={c.faint}>Proof Trail</span>
        <span className={`${c.accent} border ${c.borderStrong} px-2 py-1`}>{status}</span>
      </div>
      <div className={`text-xs uppercase tracking-[0.2em] ${c.text}`}>{label}</div>
      <div className={`mt-3 text-[10px] uppercase leading-relaxed tracking-[0.16em] ${c.muted}`}>
        Source basis: {sourceBasis}
      </div>
    </div>
  );
}

export function ServiceModuleSnapshot({ module, tone = 'light' }: { module: ServiceModule; tone?: Tone }) {
  const c = toneClasses(tone);

  return (
    <section className={`mx-auto max-w-[1480px] border-y ${c.border} px-4 py-14 md:px-8 xl:px-10 xl:py-20`}>
      <ScrollReveal yOffset={18} blur={false} className="grid grid-cols-1 gap-10 lg:grid-cols-[0.42fr_0.58fr]">
        <div>
          <div className={`mb-6 text-[10px] uppercase tracking-[0.3em] ${c.faint}`}>AUDIT MODULE STRUCTURE</div>
          <h2 className={`font-serif text-[clamp(3rem,6vw,6.7rem)] italic leading-[0.9] tracking-normal ${c.text}`}>
            {module.title}
          </h2>
          <p className={`mt-6 max-w-xl text-base leading-relaxed ${c.muted}`}>{module.summary}</p>
          <div className="mt-8">
            <SourceBasisLabel {...module.proof} tone={tone} />
          </div>
        </div>

        <div className={`grid grid-cols-1 border ${c.border} md:grid-cols-3`}>
          <div className={`border-b ${c.border} p-5 md:border-b-0 md:border-r`}>
            <h3 className={`mb-5 text-[10px] uppercase tracking-[0.26em] ${c.faint}`}>Who it is for</h3>
            <p className={`text-sm leading-relaxed ${c.muted}`}>{module.audience}</p>
          </div>
          <div className={`border-b ${c.border} p-5 md:border-b-0 md:border-r`}>
            <h3 className={`mb-5 text-[10px] uppercase tracking-[0.26em] ${c.faint}`}>Signals inspected</h3>
            <ul className={`space-y-3 text-[10px] uppercase leading-relaxed tracking-[0.16em] ${c.muted}`}>
              {module.signals.map((signal) => <li key={signal}>{signal}</li>)}
            </ul>
          </div>
          <div className="p-5">
            <h3 className={`mb-5 text-[10px] uppercase tracking-[0.26em] ${c.faint}`}>What you receive</h3>
            <ul className={`space-y-3 text-[10px] uppercase leading-relaxed tracking-[0.16em] ${c.muted}`}>
              {module.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
            </ul>
            <a
              href={getContactHref(module.intent)}
              className={`hover-target mt-8 inline-flex border-b ${c.borderStrong} pb-2 text-[10px] uppercase tracking-[0.24em] ${c.text}`}
              data-cursor-text="CONTACT"
            >
              {module.cta} -&gt;
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function ServiceModuleComparison({ modules, tone = 'dark' }: { modules: ServiceModule[]; tone?: Tone }) {
  const c = toneClasses(tone);

  return (
    <section id="audit-modules" className={`mx-auto max-w-[1480px] border-b ${c.border} px-4 py-16 md:px-8 xl:px-10 xl:py-24`}>
      <ScrollReveal yOffset={18} blur={false} className="mb-10 flex flex-col justify-between gap-6 border-b border-current/10 pb-8 md:flex-row md:items-end">
        <div>
          <div className={`mb-5 text-[10px] uppercase tracking-[0.34em] ${c.faint}`}>CHOOSE THE AUDIT PATH</div>
          <h2 className={`font-serif text-[clamp(3.5rem,7vw,8rem)] italic leading-none tracking-normal ${c.text}`}>
            Productized modules.
          </h2>
        </div>
        <p className={`max-w-md text-sm leading-relaxed ${c.muted}`}>
          Three focused entry points under the Void Method. Each module keeps the proof trail explicit and the next action specific.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {modules.map((module) => (
          <a
            key={module.slug}
            href={module.path}
            className={`hover-target group flex min-h-[360px] flex-col justify-between border ${c.border} ${c.panel} p-5 transition-colors ${c.hover}`}
            data-cursor-text="VIEW"
          >
            <div>
              <div className={`mb-8 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] ${c.faint}`}>
                <span>{module.index}</span>
                <span>{module.proof.status}</span>
              </div>
              <h3 className={`font-serif text-4xl italic leading-none ${c.text}`}>{module.shortTitle}</h3>
              <p className={`mt-5 text-sm leading-relaxed ${c.muted}`}>{module.summary}</p>
            </div>
            <div className={`mt-10 border-t ${c.border} pt-5`}>
              <div className={`mb-4 text-[9px] uppercase tracking-[0.22em] ${c.faint}`}>Best for</div>
              <p className={`text-xs leading-relaxed ${c.muted}`}>{module.audience}</p>
              <span className={`mt-6 inline-flex text-[10px] uppercase tracking-[0.24em] ${c.accent}`}>
                {module.cta} -&gt;
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
