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
        'relative min-h-screen overflow-x-hidden font-sans antialiased',
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
      className={cx('text-[10px] uppercase tracking-[0.28em] text-current/48', className)}
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
      className={cx('font-serif text-[clamp(3rem,9vw,8rem)] italic leading-[0.86] tracking-normal', className)}
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
      className={cx('inline-flex min-h-11 items-center border border-current px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-canvas', className)}
      {...props}
    />
  );
}

export function TextLink({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('border-b border-current/24 pb-1 transition-colors hover:border-current', className)}
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
