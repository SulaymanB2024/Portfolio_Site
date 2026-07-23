import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { InternalFooter } from './InternalFooter';
import { InternalHeader } from './InternalHeader';
import { ScrollProgress } from './ScrollProgress';
import {
  PageFrame,
  PageShell,
  ReaderPanel,
  SectionEyebrow,
  SurfaceGrid,
  TechnicalPanel,
} from './design/Primitives';

export type ArticleReaderVariant = 'wide' | 'research' | 'chapters';

export type ArticleNavItem = {
  id: string;
  label: string;
  index?: string;
  summary?: string;
};

export type ArticleMetaItem = {
  label: string;
  value: ReactNode;
};

export type ArticleImagePlaceholderVariant = 'default' | 'pipeline' | 'identity' | 'triptych';

type ArticlePageProps = {
  activePath: string;
  variant: ArticleReaderVariant;
  children: ReactNode;
  className?: string;
};

export function ArticlePage({
  activePath,
  variant,
  children,
  className = '',
}: ArticlePageProps) {
  return (
    <PageShell
      id="top"
      tone="light"
      className={`article-reader article-reader--${variant} ${className}`}
    >
      <ScrollProgress />
      <InternalHeader activePath={activePath} tone="light" minimalBrand />
      {children}
      <PageFrame className="pb-8">
        <InternalFooter activePath={activePath} tone="light" />
      </PageFrame>
    </PageShell>
  );
}

type ArticleHeroProps = {
  backHref: string;
  backLabel: string;
  eyebrow: ReactNode;
  title: ReactNode;
  deck: ReactNode;
  metadata: ArticleMetaItem[];
  displayTitle?: ReactNode;
  image?: {
    src: string;
    alt: string;
    label?: ReactNode;
    caption?: ReactNode;
    presentation?: 'editorial' | 'diagram';
  };
  imagePlaceholder?: {
    label?: ReactNode;
    note?: ReactNode;
    variant?: ArticleImagePlaceholderVariant;
  };
  children?: ReactNode;
};

export function ArticleHero({
  backHref,
  backLabel,
  eyebrow,
  title,
  deck,
  metadata,
  displayTitle,
  image,
  imagePlaceholder,
  children,
}: ArticleHeroProps) {
  return (
    <PageFrame>
      <header className="article-reader__hero">
        <aside className="article-reader__hero-meta">
          <a href={backHref} className="article-reader__back-link">
            <span aria-hidden="true">←</span>
            <span>{backLabel}</span>
          </a>
          <dl>
            {metadata.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="article-reader__hero-main">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h1>{title}</h1>
          {displayTitle ? <p className="article-reader__display-title">{displayTitle}</p> : null}
          <p className="article-reader__deck">{deck}</p>
          {children}
        </div>

        <figure
          className="article-reader__hero-image"
          data-placeholder={image ? undefined : 'true'}
          data-presentation={image?.presentation}
          aria-label={image ? undefined : 'Editorial image placeholder'}
        >
          <figcaption className="article-reader__image-caption">
            <span>{image?.label ?? imagePlaceholder?.label ?? 'Editorial image pending'}</span>
            <small>{image?.caption ?? imagePlaceholder?.note ?? 'Purpose-built artwork will replace this study frame.'}</small>
          </figcaption>
          <div className="article-reader__image-media">
            {image ? (
              <img src={image.src} alt={image.alt} decoding="async" fetchPriority="high" />
            ) : (
              <ArticleImagePlaceholder variant={imagePlaceholder?.variant ?? 'default'} />
            )}
          </div>
        </figure>
      </header>
    </PageFrame>
  );
}

function ArticleImagePlaceholder({
  variant,
}: {
  variant: ArticleImagePlaceholderVariant;
}) {
  if (variant === 'pipeline') {
    return (
      <div className="article-reader__image-placeholder article-reader__image-placeholder--pipeline" aria-hidden="true">
        {['URL', 'CRAWL', 'RENDER', 'RECORD', 'EXPORT'].map((label, index) => (
          <div key={label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'identity') {
    return (
      <div className="article-reader__image-placeholder article-reader__image-placeholder--identity" aria-hidden="true">
        <div className="article-reader__identity-node article-reader__identity-node--center">PERSON</div>
        {['SITE', 'RESUME', 'GITHUB', 'LINKEDIN', 'HISTORY'].map((label) => (
          <div key={label} className="article-reader__identity-node">{label}</div>
        ))}
      </div>
    );
  }

  if (variant === 'triptych') {
    return (
      <div className="article-reader__image-placeholder article-reader__image-placeholder--triptych" aria-hidden="true">
        {[
          ['01', 'NETWORKS'],
          ['02', 'COMPUTE'],
          ['03', 'MONEY'],
        ].map(([index, label]) => (
          <div key={label}>
            <span>{index}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="article-reader__image-placeholder">
      <strong aria-hidden="true">IMAGE STUDY</strong>
    </div>
  );
}

export function ArticleMetricStrip({
  items,
}: {
  items: Array<{ label: string; value: ReactNode; note?: ReactNode }>;
}) {
  return (
    <PageFrame className="article-reader__metric-frame">
      <SurfaceGrid className={`article-reader__metrics article-reader__metrics--${Math.min(items.length, 4)}`}>
        {items.map((item) => (
          <TechnicalPanel key={item.label} className="article-reader__metric">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            {item.note ? <small>{item.note}</small> : null}
          </TechnicalPanel>
        ))}
      </SurfaceGrid>
    </PageFrame>
  );
}

export function ArticleCallout({
  label,
  title,
  children,
}: {
  label: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageFrame>
      <section className="article-reader__callout">
        <SectionEyebrow>{label}</SectionEyebrow>
        <div>
          <h2>{title}</h2>
          <div>{children}</div>
        </div>
      </section>
    </PageFrame>
  );
}

function useActiveSection(items: ArticleNavItem[]) {
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActiveId(next);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.1, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function ArticleUtilities() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="article-reader__utilities" aria-label="Article utilities">
      <button type="button" onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
      <button type="button" onClick={() => window.print()}>Print / PDF</button>
    </div>
  );
}

type ArticleBodyProps = {
  items: ArticleNavItem[];
  boundary?: ReactNode;
  boundaryLabel?: ReactNode;
  children: ReactNode;
  variant: ArticleReaderVariant;
  contentsLabel?: string;
};

export function ArticleBody({
  items,
  boundary,
  boundaryLabel = 'Boundary',
  children,
  variant,
  contentsLabel = variant === 'chapters' ? 'Chapters' : 'Contents',
}: ArticleBodyProps) {
  const activeId = useActiveSection(items);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const progress = items.length ? ((activeIndex + 1) / items.length) * 100 : 0;

  return (
    <PageFrame className="article-reader__body-frame">
      <details className="article-reader__mobile-contents">
        <summary>
          <span>{contentsLabel}</span>
          <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        </summary>
        <nav aria-label={`${contentsLabel} navigation`}>
          {items.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined}>
              <span>{item.index ?? String(index + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </details>

      {variant === 'chapters' ? (
        <div className="article-reader__mobile-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      <div className="article-reader__body-layout">
        <aside className="article-reader__rail">
          <div className="article-reader__rail-sticky">
            <div className="article-reader__rail-heading">
              <SectionEyebrow>{contentsLabel}</SectionEyebrow>
              {variant === 'chapters' ? (
                <span>{String(Math.round(progress)).padStart(2, '0')}%</span>
              ) : null}
            </div>
            {variant === 'chapters' ? (
              <div className="article-reader__rail-progress" aria-hidden="true">
                <span style={{ width: `${progress}%` }} />
              </div>
            ) : null}
            <nav aria-label={`${contentsLabel} navigation`}>
              {items.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? 'location' : undefined}
                >
                  <span>{item.index ?? String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{item.label}</strong>
                    {item.summary ? <small>{item.summary}</small> : null}
                  </span>
                </a>
              ))}
            </nav>
            {boundary ? (
              <div className="article-reader__boundary">
                <SectionEyebrow>{boundaryLabel}</SectionEyebrow>
                <p>{boundary}</p>
              </div>
            ) : null}
            <ArticleUtilities />
          </div>
        </aside>

        <ReaderPanel className="article-reader__content">
          {children}
          {variant === 'chapters' && items.length ? (
            <nav className="article-reader__chapter-nav" aria-label="Chapter navigation">
              {activeIndex > 0 ? (
                <a href={`#${items[activeIndex - 1].id}`}>
                  <span>Previous</span>
                  <strong>{items[activeIndex - 1].label}</strong>
                </a>
              ) : <span />}
              {activeIndex < items.length - 1 ? (
                <a href={`#${items[activeIndex + 1].id}`}>
                  <span>Next</span>
                  <strong>{items[activeIndex + 1].label}</strong>
                </a>
              ) : null}
            </nav>
          ) : null}
        </ReaderPanel>
      </div>
    </PageFrame>
  );
}

export function ArticleSectionHeader({
  index,
  children,
}: {
  index: ReactNode;
  children: ReactNode;
}) {
  return (
    <header className="article-reader__section-heading">
      <span>{index}</span>
      <h2>{children}</h2>
    </header>
  );
}

export function ArticleEndnote({
  children,
  links,
}: {
  children: ReactNode;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <footer className="article-reader__endnote">
      <p>{children}</p>
      <nav aria-label="Related reading">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
    </footer>
  );
}
