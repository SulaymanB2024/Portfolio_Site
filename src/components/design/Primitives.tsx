import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Tone = 'light' | 'dark';

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function PageShell({
  tone = 'light',
  className,
  ...props
}: ComponentPropsWithoutRef<'main'> & { tone?: Tone }) {
  return (
    <main
      className={cx(
        'relative min-h-screen overflow-x-clip font-sans antialiased',
        tone === 'dark' ? 'site-page site-page-dark' : 'site-page site-page-light',
        tone === 'dark'
          ? 'bg-ink text-canvas selection:bg-canvas selection:text-ink'
          : 'bg-canvas text-ink selection:bg-ink selection:text-canvas',
        className,
      )}
      {...props}
    />
  );
}

export function PageFrame({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cx('relative z-10 mx-auto w-full max-w-[1480px] px-4 md:px-8 xl:px-10', className)}
      {...props}
    />
  );
}

export function SectionShell({
  className,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={cx('mx-auto w-full max-w-[1480px] px-4 py-16 md:px-8 md:py-20 xl:px-10', className)}
      {...props}
    />
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  aside,
  tone = 'light',
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <section
      className={cx(
        'grid min-h-[64vh] items-end gap-12 border-b border-current/12 pb-14 pt-16 md:pt-20 lg:grid-cols-[minmax(0,0.64fr)_minmax(260px,0.36fr)]',
        className,
      )}
    >
      <div className="min-w-0">
        <SectionEyebrow className={tone === 'dark' ? 'text-canvas/48' : 'text-ink/48'}>{eyebrow}</SectionEyebrow>
        <EditorialHeading className="mt-8">{title}</EditorialHeading>
        {intro && <div className="mt-8 max-w-3xl text-base leading-relaxed text-current/64">{intro}</div>}
      </div>
      {aside && <aside className="min-w-0 border-l border-current/14 pl-6 text-base leading-relaxed text-current/62">{aside}</aside>}
    </section>
  );
}

export function SectionEyebrow({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cx('text-[10px] uppercase tracking-[0.28em] text-current/64', className)}
      {...props}
    />
  );
}

export function SectionHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('mb-10 grid gap-8 border-b border-current/12 pb-8 lg:grid-cols-[0.42fr_0.58fr]', className)}>
      <div>
        {eyebrow && <SectionEyebrow className="mb-5">{eyebrow}</SectionEyebrow>}
        <h2 className="font-serif text-5xl italic leading-[0.95] tracking-normal text-current md:text-6xl">
          {title}
        </h2>
      </div>
      {children && <div className="self-end text-base leading-relaxed text-current/62">{children}</div>}
    </div>
  );
}

export function EditorialHeading({ className, ...props }: ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={cx('font-serif text-[3.4rem] md:text-[5.75rem] xl:text-[8rem] italic leading-[0.86] tracking-normal', className)}
      {...props}
    />
  );
}

export function SurfaceGrid({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cx('grid gap-px overflow-hidden border border-current/14', className)}
      {...props}
    />
  );
}

export function TechnicalPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      className={cx('border border-current/14 bg-current/[0.015] p-5 transition-colors hover:border-current/30', className)}
      {...props}
    />
  );
}

export function LinkPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('block border border-current/14 p-5 text-current/68 transition-colors hover:bg-current hover:text-[var(--page-bg)]', className)}
      {...props}
    />
  );
}

export function MetricCard({
  label,
  value,
  detail,
  className,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <TechnicalPanel className={cx('grid gap-3', className)}>
      <SectionEyebrow>{label}</SectionEyebrow>
      <div className="font-serif text-3xl italic leading-none">{value}</div>
      {detail && <p className="text-sm leading-relaxed text-current/58">{detail}</p>}
    </TechnicalPanel>
  );
}

export type DarkProofArtifactItem = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  status?: ReactNode;
};

export function CalibrationMarks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-current/28">
      <span className="absolute left-3 top-3 h-px w-5 bg-current" />
      <span className="absolute left-3 top-3 h-5 w-px bg-current" />
      <span className="absolute right-3 top-3 h-px w-5 bg-current" />
      <span className="absolute right-3 top-3 h-5 w-px bg-current" />
      <span className="absolute bottom-3 left-3 h-px w-5 bg-current" />
      <span className="absolute bottom-3 left-3 h-5 w-px bg-current" />
      <span className="absolute bottom-3 right-3 h-px w-5 bg-current" />
      <span className="absolute bottom-3 right-3 h-5 w-px bg-current" />
    </div>
  );
}

export function CalibrationFrame({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx('visual-lab-calibration-frame relative', className)} {...props}>
      <CalibrationMarks />
      <div className="relative">{children}</div>
    </div>
  );
}

export function IndexedSection({
  index,
  title,
  description,
  headingId,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'section'> & {
  index: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  headingId: string;
}) {
  return (
    <section
      aria-labelledby={headingId}
      className={cx('visual-lab-indexed-section', className)}
      {...props}
    >
      <header className="visual-lab-indexed-section__header">
        <SectionEyebrow className="visual-lab-indexed-section__index">{index}</SectionEyebrow>
        <h2 id={headingId} className="visual-lab-indexed-section__title">
          {title}
        </h2>
        {description && (
          <div className="visual-lab-indexed-section__description">
            {description}
          </div>
        )}
      </header>
      <div className="visual-lab-indexed-section__body">{children}</div>
    </section>
  );
}

export function DownloadArrowIcon({
  className,
  ...props
}: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cx('h-4 w-4', className)}
      fill="none"
      {...props}
    >
      <path
        d="M8 2v8m0 0 3-3m-3 3L5 7M3 13h10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function DarkProofArtifactPanel({
  eyebrow,
  title,
  summary,
  items,
  footer,
  className,
  ...props
}: ComponentPropsWithoutRef<'aside'> & {
  eyebrow: ReactNode;
  title: ReactNode;
  summary?: ReactNode;
  items: DarkProofArtifactItem[];
  footer?: ReactNode;
}) {
  return (
    <aside
      className={cx('relative overflow-hidden border border-current/14 bg-current/[0.018] p-5 text-current md:p-6', className)}
      {...props}
    >
      <CalibrationMarks />
      <div className="relative">
        <header className="border-b border-current/12 pb-5">
          <SectionEyebrow className="text-current/48">{eyebrow}</SectionEyebrow>
          <h2 className="mt-4 font-serif text-3xl italic leading-[0.95] tracking-normal text-current md:text-4xl">
            {title}
          </h2>
          {summary && <p className="mt-4 max-w-xl text-sm leading-relaxed text-current/62">{summary}</p>}
        </header>

        <div className="mt-5 grid gap-px overflow-hidden border border-current/12">
          {items.map((item) => (
            <article key={item.label} className="grid min-h-[112px] gap-3 bg-current/[0.018] p-4">
              <div className="flex items-start justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-current/48">
                <span>{item.label}</span>
                {item.status && <span className="text-current/64">{item.status}</span>}
              </div>
              <div className="text-sm leading-relaxed text-current/76">{item.value}</div>
              {item.detail && <p className="text-xs leading-relaxed text-current/52">{item.detail}</p>}
            </article>
          ))}
        </div>

        {footer && (
          <footer className="mt-5 border-t border-current/12 pt-4 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-current/46">
            {footer}
          </footer>
        )}
      </div>
    </aside>
  );
}

export function ReaderPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      className={cx('max-w-3xl select-text text-base leading-relaxed text-current/72', className)}
      {...props}
    />
  );
}

export function ArtifactModal({
  title,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'section'> & { title: string; children: ReactNode }) {
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cx('max-h-[90vh] w-full max-w-5xl overflow-auto border border-current/18 bg-ink p-6 text-canvas', className)}
      {...props}
    >
      <SectionEyebrow>{title}</SectionEyebrow>
      {children}
    </section>
  );
}

export function ModalShell({
  title,
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'section'> & { title: string; children: ReactNode }) {
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cx('max-h-[90vh] w-full max-w-5xl overflow-auto border border-current/18 bg-[var(--page-bg)] p-6 text-[var(--page-fg)] shadow-2xl', className)}
      {...props}
    >
      <SectionEyebrow>{title}</SectionEyebrow>
      {children}
    </section>
  );
}

export function PrimaryCTA({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('inline-flex min-h-11 items-center border border-current px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-[var(--page-bg)]', className)}
      {...props}
    />
  );
}

export function TextLink({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('inline-flex min-h-11 items-center border-b border-current/24 transition-colors hover:border-current', className)}
      {...props}
    />
  );
}

export function DataTable({
  rows,
  className,
}: {
  rows: Array<Array<ReactNode>>;
  className?: string;
}) {
  return (
    <table className={cx('w-full border-collapse text-left text-xs', className)}>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-current/12 last:border-b-0">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-3 pr-4 align-top last:pr-0">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DiagramCaption({ className, ...props }: ComponentPropsWithoutRef<'figcaption'>) {
  return (
    <figcaption
      className={cx('mt-3 text-[10px] uppercase tracking-[0.22em] text-current/44', className)}
      {...props}
    />
  );
}
