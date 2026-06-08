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
        tone === 'dark'
          ? 'bg-ink text-canvas selection:bg-canvas selection:text-ink'
          : 'bg-canvas text-ink selection:bg-ink selection:text-canvas',
        className,
      )}
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

export function SectionEyebrow({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={cx('text-[10px] uppercase tracking-[0.28em] text-current/48', className)}
      {...props}
    />
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

export function PrimaryCTA({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('hover-target inline-flex min-h-11 items-center border border-current px-5 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-current hover:text-canvas', className)}
      {...props}
    />
  );
}

export function TextLink({ className, ...props }: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={cx('hover-target border-b border-current/24 pb-1 transition-colors hover:border-current', className)}
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
