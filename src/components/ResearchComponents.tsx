import type { Key, ReactNode } from 'react';
import type { Counterargument, MarketThesis, ResearchAssumption, EvidenceLedgerItem } from '../content/marketTheses';

const tone = {
  line: 'border-[#f1efe8]/12',
  text: 'text-[#f1efe8]',
  muted: 'text-[#f1efe8]/58',
  faint: 'text-[#f1efe8]/34',
  accent: 'text-[#b7c8a8]',
  panel: 'bg-[#f1efe8]/[0.012]',
};

export function ResearchBadge({ children }: { children: ReactNode; key?: Key }) {
  return (
    <span className={`inline-flex border ${tone.line} px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] ${tone.muted}`}>
      {children}
    </span>
  );
}

export function ResearchMetaStrip({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className={`grid gap-px overflow-hidden border ${tone.line} text-[10px] uppercase tracking-[0.2em] sm:grid-cols-2 lg:grid-cols-4`}>
      {items.map(([label, value]) => (
        <div key={label} className={`${tone.panel} p-4`}>
          <dt className={`mb-2 ${tone.faint}`}>{label}</dt>
          <dd className={`${tone.text} normal-case leading-snug tracking-normal md:uppercase md:tracking-[0.16em]`}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ResearchCard({ thesis }: { thesis: MarketThesis; key?: Key }) {
  return (
    <a
      href={`/markets/${thesis.slug}`}
      className={`hover-target group flex min-h-[430px] flex-col justify-between border ${tone.line} ${tone.panel} p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-[#f1efe8]/28 hover:bg-[#f1efe8]/[0.025]`}
      data-cursor-text="READ"
    >
      <div>
        <div className="mb-8 flex items-start justify-between gap-4 text-[9px] uppercase tracking-[0.24em]">
          <span className={tone.accent}>{thesis.number}</span>
          <span className={`${tone.faint} text-right`}>{thesis.status}</span>
        </div>
        <h2 className="font-serif text-3xl leading-[0.95] tracking-[-0.025em] text-[#f1efe8] md:text-4xl">
          {thesis.title}
        </h2>
        <p className={`mt-5 text-sm leading-relaxed ${tone.muted}`}>{thesis.thesis}</p>
      </div>

      <div className="mt-10 space-y-5">
        <div className={`border-t ${tone.line} pt-5 text-xs leading-relaxed ${tone.muted}`}>
          <span className={`mb-2 block text-[9px] uppercase tracking-[0.22em] ${tone.faint}`}>Mechanism</span>
          {thesis.mechanism.causalChain[0]}
        </div>
        <div className={`border-t ${tone.line} pt-5 text-xs leading-relaxed ${tone.muted}`}>
          <span className={`mb-2 block text-[9px] uppercase tracking-[0.22em] ${tone.faint}`}>Evidence base</span>
          {thesis.evidenceBase}
        </div>
        <div className="grid gap-3 text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/50 md:grid-cols-2">
          <div>
            <span className="block text-[#f1efe8]/30">Depth</span>
            <span className="mt-1 block normal-case tracking-normal text-[#f1efe8]/70">{thesis.depth}</span>
          </div>
          <div>
            <span className="block text-[#f1efe8]/30">Updated</span>
            <span className="mt-1 block text-[#f1efe8]/70">{thesis.lastUpdated}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {thesis.tags.slice(0, 4).map((tag) => (
            <ResearchBadge key={tag}>{tag}</ResearchBadge>
          ))}
        </div>
      </div>
    </a>
  );
}

export function ReportHeader({ thesis }: { thesis: MarketThesis }) {
  return (
    <header className="space-y-9 border-b border-[#f1efe8]/12 pb-12">
      <div className="flex flex-wrap items-center gap-2">
        <ResearchBadge>{thesis.category}</ResearchBadge>
        <ResearchBadge>{thesis.status}</ResearchBadge>
        <ResearchBadge>{thesis.depth}</ResearchBadge>
      </div>
      <div className="grid gap-10 lg:grid-cols-[0.68fr_0.32fr] lg:items-end">
        <div>
          <p className="mb-7 text-[10px] uppercase tracking-[0.36em] text-[#b7c8a8]">Research Artifact {thesis.number}</p>
          <h1 className="font-serif text-[clamp(3.4rem,8vw,8.8rem)] italic leading-[0.84] tracking-[-0.045em] text-[#f1efe8]">
            {thesis.title}
          </h1>
          <p className="mt-8 max-w-3xl border-l border-[#f1efe8]/24 pl-5 text-lg italic leading-relaxed text-[#f1efe8]/70">
            {thesis.thesis}
          </p>
        </div>
        <ResearchMetaStrip
          items={[
            ['Status', thesis.status],
            ['Depth', thesis.depth],
            ['Last updated', thesis.lastUpdated],
            ['Horizon', thesis.horizon],
          ]}
        />
      </div>
    </header>
  );
}

export function ReportSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 gap-8 border-b border-[#f1efe8]/12 py-12 lg:grid-cols-[0.28fr_0.72fr]">
      <div>
        <p className="mb-4 text-[9px] uppercase tracking-[0.28em] text-[#b7c8a8]">{label}</p>
        <h2 className="max-w-sm font-serif text-4xl italic leading-[0.95] tracking-[-0.025em] text-[#f1efe8]">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function ExecutiveBrief({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3">
      {items.map((item, index) => (
        <li key={item} className={`grid gap-4 border ${tone.line} ${tone.panel} p-4 text-sm leading-relaxed text-[#f1efe8]/72 md:grid-cols-[44px_1fr]`}>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/38">{String(index + 1).padStart(2, '0')}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function MechanismMap({ mechanism }: { mechanism: MarketThesis['mechanism'] }) {
  const groups = [
    ['Actors', mechanism.actors],
    ['Incentives', mechanism.incentives],
    ['Leverage points', mechanism.leveragePoints],
    ['Causal chain', mechanism.causalChain],
  ] as const;

  return (
    <div className="grid gap-px overflow-hidden border border-[#f1efe8]/12 md:grid-cols-2">
      {groups.map(([label, items]) => (
        <div key={label} className={`${tone.panel} p-5`}>
          <h3 className="mb-5 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/42">{label}</h3>
          <ol className="space-y-3 text-sm leading-relaxed text-[#f1efe8]/68">
            {items.map((item, index) => (
              <li key={item} className="grid grid-cols-[28px_1fr] gap-3">
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#b7c8a8]/75">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export function EvidenceLedger({ items }: { items: EvidenceLedgerItem[] }) {
  return (
    <div className="max-w-full overflow-x-auto border border-[#f1efe8]/12">
      <table className="min-w-[760px] w-full border-collapse text-left">
        <thead className="text-[9px] uppercase tracking-[0.22em] text-[#f1efe8]/40">
          <tr className="border-b border-[#f1efe8]/12">
            <th className="p-4 font-normal">Item</th>
            <th className="p-4 font-normal">Implication</th>
            <th className="p-4 font-normal">Confidence</th>
            <th className="p-4 font-normal">Source / TODO</th>
          </tr>
        </thead>
        <tbody className="text-sm leading-relaxed text-[#f1efe8]/66">
          {items.map((item) => (
            <tr key={item.item} className="border-b border-[#f1efe8]/8 last:border-b-0">
              <td className="p-4 align-top text-[#f1efe8]/86">{item.item}</td>
              <td className="p-4 align-top">{item.implication}</td>
              <td className="p-4 align-top uppercase tracking-[0.16em] text-[#b7c8a8]">{item.confidence}</td>
              <td className="p-4 align-top text-[#f1efe8]/52">{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AssumptionTable({ items }: { items: ResearchAssumption[] }) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article key={item.assumption} className={`border ${tone.line} ${tone.panel} p-5`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="max-w-2xl text-sm uppercase tracking-[0.18em] text-[#f1efe8]">{item.assumption}</h3>
            <ResearchBadge>{item.confidence} confidence</ResearchBadge>
          </div>
          <div className="grid gap-5 text-sm leading-relaxed text-[#f1efe8]/64 md:grid-cols-2">
            <p>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/36">Importance</span>
              {item.importance}
            </p>
            <p>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/36">What weakens it</span>
              {item.weakens}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CounterargumentTable({ items }: { items: Counterargument[] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-[#f1efe8]/12">
      {items.map((item, index) => (
        <article key={item.view} className={`${tone.panel} p-5`}>
          <div className="mb-5 text-[9px] uppercase tracking-[0.24em] text-[#b7c8a8]">Counterargument {String(index + 1).padStart(2, '0')}</div>
          <h3 className="mb-5 text-lg font-serif italic leading-snug text-[#f1efe8]">{item.view}</h3>
          <div className="grid gap-5 text-sm leading-relaxed text-[#f1efe8]/64 md:grid-cols-2">
            <p>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/36">Why it may be right</span>
              {item.whyRight}
            </p>
            <p>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-[#f1efe8]/36">Deciding evidence</span>
              {item.decidingEvidence}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ImplicationsGrid({ implications }: { implications: MarketThesis['implications'] }) {
  const items = [
    ['Investment', implications.investment],
    ['Operator / Company', implications.operator],
    ['Product / Strategy', implications.product],
    ['Technical / Data', implications.technical],
  ];

  return (
    <div className="grid gap-px overflow-hidden border border-[#f1efe8]/12 md:grid-cols-2">
      {items.map(([label, copy]) => (
        <article key={label} className={`${tone.panel} p-5`}>
          <h3 className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#f1efe8]/42">{label}</h3>
          <p className="text-sm leading-relaxed text-[#f1efe8]/68">{copy}</p>
        </article>
      ))}
    </div>
  );
}

export function OpenQuestions({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className={`border ${tone.line} px-4 py-3 text-sm leading-relaxed text-[#f1efe8]/68`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function RelatedLinks({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Related pages">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="hover-target border border-[#f1efe8]/12 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/68 transition-colors hover:border-[#f1efe8]/36 hover:text-[#f1efe8]"
          data-cursor-text="OPEN"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
