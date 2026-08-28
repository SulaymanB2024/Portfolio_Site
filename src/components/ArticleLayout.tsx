import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

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

export type ArticleReadingMode = 'reference' | 'narrative';

export type ArticleNavItem = {
  id: string;
  label: string;
  index?: string;
  summary?: string;
};

type ArticleMetaItem = {
  label: string;
  value: ReactNode;
};

export type ArticleImagePlaceholderVariant = 'default' | 'pipeline' | 'identity' | 'triptych';

export type ArticlePublicationMeta = {
  author: ReactNode;
  subject: ReactNode;
  published: {
    dateTime: string;
    value: ReactNode;
  };
  updated?: {
    dateTime: string;
    value: ReactNode;
  };
  readTime: ReactNode;
  evidence: ReactNode;
};

export type ArticleReaderConfig = {
  activePath: string;
  mode: ArticleReadingMode;
  className?: string;
  archive: {
    href: string;
    label: string;
  };
  hero: {
    eyebrow: ReactNode;
    title: ReactNode;
    deck: ReactNode;
    displayTitle?: ReactNode;
    image?: {
      src: string;
      alt: string;
      label?: ReactNode;
      caption?: ReactNode;
      presentation?: 'editorial' | 'diagram';
      objectPosition?: string;
    };
    imagePlaceholder?: {
      label?: ReactNode;
      note?: ReactNode;
      variant?: ArticleImagePlaceholderVariant;
    };
  };
  publication: ArticlePublicationMeta;
  metrics?: Array<{ label: string; value: ReactNode; note?: ReactNode }>;
  callouts?: Array<{
    label: ReactNode;
    title: ReactNode;
    content: ReactNode;
  }>;
  navigation: {
    items: ArticleNavItem[];
    contentsLabel?: string;
  };
  boundary?: {
    label: ReactNode;
    content: ReactNode;
  };
  endnote?: {
    label: ReactNode;
    title: ReactNode;
    content: ReactNode;
    note?: ReactNode;
    links: Array<{ href: string; label: string }>;
  };
};

export type ArticleNavigationSeed = Omit<ArticleNavItem, 'index'> & {
  kind: 'overview' | 'section' | 'faq' | 'source';
};

export function createArticleNavigation(seeds: ArticleNavigationSeed[]): ArticleNavItem[] {
  let sectionIndex = 0;

  return seeds.map((seed) => {
    const { kind, ...item } = seed;

    if (kind === 'overview') return { ...item, index: '00' };
    if (kind === 'faq') return { ...item, index: 'FAQ' };
    if (kind === 'source') return { ...item, index: 'S' };

    sectionIndex += 1;
    return { ...item, index: String(sectionIndex).padStart(2, '0') };
  });
}

export function getArticleNavigationIndex(items: ArticleNavItem[], id: string) {
  return items.find((item) => item.id === id)?.index ?? '—';
}

type ArticlePageProps = {
  activePath: string;
  mode: ArticleReadingMode;
  children: ReactNode;
  className?: string;
};

function ArticlePage({
  activePath,
  mode,
  children,
  className = '',
}: ArticlePageProps) {
  useEffect(() => {
    let currentTarget: HTMLElement | null = null;
    let frame = 0;

    const markHashTarget = (moveFocus = false) => {
      currentTarget?.removeAttribute('data-article-target');
      currentTarget = null;

      let id = '';
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }

      if (!id) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return true;
      }
      const nextTarget = document.getElementById(id);
      if (!nextTarget) return false;

      nextTarget.setAttribute('data-article-target', 'true');
      currentTarget = nextTarget;
      const stickyClearance = [
        document.querySelector<HTMLElement>('header'),
        document.querySelector<HTMLElement>('.article-reader__mobile-contents'),
      ].reduce((clearance, element) => {
        if (!element) return clearance;

        const styles = window.getComputedStyle(element);
        if (
          styles.display === 'none' ||
          styles.visibility === 'hidden' ||
          !['fixed', 'sticky'].includes(styles.position)
        ) {
          return clearance;
        }

        const stickyTop = Number.parseFloat(styles.top);
        const top = Number.isFinite(stickyTop) ? stickyTop : 0;
        return Math.max(clearance, top + element.getBoundingClientRect().height);
      }, 0);
      const scrollOffset = Math.ceil(stickyClearance + 16);
      const lenis = (window as unknown as {
        lenis?: {
          resize?: () => void;
          scrollTo: (
            target: HTMLElement,
            options: { immediate: boolean; offset: number },
          ) => void;
        };
      }).lenis;

      if (lenis) {
        lenis.resize?.();
        lenis.scrollTo(nextTarget, { immediate: true, offset: -scrollOffset });
      } else {
        const top = nextTarget.getBoundingClientRect().top + window.scrollY - scrollOffset;
        window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
      }
      if (moveFocus) {
        if (!nextTarget.hasAttribute('tabindex')) nextTarget.setAttribute('tabindex', '-1');
        nextTarget.focus({ preventScroll: true });
      }
      return true;
    };
    const scheduleHashTarget = (moveFocus = false) => {
      window.cancelAnimationFrame(frame);
      let attempts = 0;
      let settleAttempts = 0;
      const restoreTarget = () => {
        const foundTarget = markHashTarget(moveFocus && settleAttempts === 0);
        if (foundTarget) {
          if (settleAttempts >= 2) return;
          settleAttempts += 1;
        } else {
          if (attempts >= 8) return;
          attempts += 1;
        }
        frame = window.requestAnimationFrame(restoreTarget);
      };
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(restoreTarget);
      });
    };
    const handleHashClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
        : null;
      if (!anchor) return;

      const moveFocus = Boolean(
        anchor.closest(
          '.article-citation, .article-note-ref, .article-note-backlinks, .article-note-backlink',
        ) ||
        anchor.classList.contains('article-reader__skip-link'),
      );
      scheduleHashTarget(moveFocus);
    };
    const handleLocationChange = () => scheduleHashTarget(false);

    scheduleHashTarget(false);
    document.addEventListener('click', handleHashClick, true);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.cancelAnimationFrame(frame);
      currentTarget?.removeAttribute('data-article-target');
      document.removeEventListener('click', handleHashClick, true);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <PageShell
      id="top"
      tabIndex={-1}
      tone="light"
      className={`article-reader article-reader--${mode} ${className}`}
    >
      <a className="article-reader__skip-link" href="#article-body">
        Skip to article
      </a>
      <ScrollProgress tone="dark" />
      <InternalHeader activePath={activePath} tone="light" minimalBrand />
      {children}
      <PageFrame className="article-reader__site-footer-frame pb-8">
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
    objectPosition?: string;
  };
  imagePlaceholder?: {
    label?: ReactNode;
    note?: ReactNode;
    variant?: ArticleImagePlaceholderVariant;
  };
  children?: ReactNode;
};

function ArticleHero({
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
  const titleLength = typeof title === 'string' ? title.trim().length : 0;
  const compactMetadata = metadata
    .filter((item) => {
      const label = item.label.toLowerCase();
      return label === 'published' || label === 'read time' || label === 'length';
    })
    .map((item) => ({
      ...item,
      label: item.label.toLowerCase() === 'length' ? 'Read time' : item.label,
      value: item.label.toLowerCase() === 'length' && typeof item.value === 'string'
        ? item.value.split('/')[0].trim()
        : item.value,
    }));

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
          <div className="article-reader__mobile-prelude">
            <a href={backHref} className="article-reader__back-link">
              <span aria-hidden="true">←</span>
              <span>{backLabel}</span>
            </a>
            <div className="article-reader__mobile-publication" aria-label="Publication summary">
              {compactMetadata.map((item) => (
                <span key={item.label}>
                  <strong>{item.label}</strong>
                  {item.value}
                </span>
              ))}
            </div>
          </div>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h1 data-title-scale={titleLength > 58 ? 'long' : 'standard'}>{title}</h1>
          {displayTitle ? <p className="article-reader__display-title">{displayTitle}</p> : null}
          <p className="article-reader__deck">{deck}</p>
          {children}
          <details className="article-reader__hero-details">
            <summary>
              <span>Article details</span>
              <span aria-hidden="true">+</span>
            </summary>
            <dl>
              {metadata.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>

        <figure
          className="article-reader__hero-image"
          data-visual={image ? 'image' : 'diagram'}
          data-presentation={image?.presentation}
          aria-label={image ? undefined : 'Editorial concept diagram'}
        >
          <figcaption className="article-reader__image-caption">
            <span>{image?.label ?? imagePlaceholder?.label ?? 'Editorial plate'}</span>
            <small>{image?.caption ?? imagePlaceholder?.note ?? 'A visual index of the article’s core system.'}</small>
          </figcaption>
          <div className="article-reader__image-media">
            {image ? (
              <img
                src={image.src}
                alt={image.alt}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
              />
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
    <div className="article-reader__image-placeholder article-reader__image-placeholder--default" aria-hidden="true">
      {['Question', 'Evidence', 'Decision'].map((label, index) => (
        <div key={label}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{label}</strong>
        </div>
      ))}
    </div>
  );
}

function ArticleMetricStrip({
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

function ArticleCallout({
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

function publicationItems(publication: ArticlePublicationMeta): ArticleMetaItem[] {
  const items: ArticleMetaItem[] = [
    { label: 'Author', value: publication.author },
    { label: 'Subject', value: publication.subject },
    {
      label: 'Published',
      value: <time dateTime={publication.published.dateTime}>{publication.published.value}</time>,
    },
  ];

  if (publication.updated && publication.updated.dateTime !== publication.published.dateTime) {
    items.push({
      label: 'Updated',
      value: <time dateTime={publication.updated.dateTime}>{publication.updated.value}</time>,
    });
  }

  items.push(
    { label: 'Read time', value: publication.readTime },
    { label: 'Evidence', value: publication.evidence },
  );

  return items;
}

export function ArticleReader({
  config,
  children,
}: {
  config: ArticleReaderConfig;
  children: ReactNode;
}) {
  return (
    <ArticlePage
      activePath={config.activePath}
      mode={config.mode}
      className={config.className}
    >
      <ArticleHero
        backHref={config.archive.href}
        backLabel={config.archive.label}
        eyebrow={config.hero.eyebrow}
        title={config.hero.title}
        deck={config.hero.deck}
        displayTitle={config.hero.displayTitle}
        image={config.hero.image}
        imagePlaceholder={config.hero.imagePlaceholder}
        metadata={publicationItems(config.publication)}
      />

      {config.metrics?.length ? <ArticleMetricStrip items={config.metrics} /> : null}

      {config.callouts?.map((callout, index) => (
        <Fragment key={`${String(callout.label)}-${index}`}>
          <ArticleCallout label={callout.label} title={callout.title}>
            {callout.content}
          </ArticleCallout>
        </Fragment>
      ))}

      <ArticleBody
        items={config.navigation.items}
        boundary={config.boundary?.content}
        boundaryLabel={config.boundary?.label}
        mode={config.mode}
        contentsLabel={config.navigation.contentsLabel}
      >
        {children}
        {config.endnote ? (
          <ArticleEndnote
            label={config.endnote.label}
            title={config.endnote.title}
            note={config.endnote.note}
            boundary={config.boundary?.content}
            boundaryLabel={config.boundary?.label}
            links={config.endnote.links}
          >
            {config.endnote.content}
          </ArticleEndnote>
        ) : null}
      </ArticleBody>
    </ArticlePage>
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

    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = Math.min(Math.max(window.innerHeight * 0.24, 140), 260);
      let current = nodes.find((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
      }) ?? [...nodes].reverse().find((node) => node.getBoundingClientRect().top <= marker) ?? nodes[0];

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = nodes.at(-1) ?? current;
      }

      setActiveId((previous) => previous === current.id ? previous : current.id);
    };
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('hashchange', scheduleUpdate);
    };
  }, [ids]);

  return activeId;
}

function moveArticleNavFocus(
  event: KeyboardEvent<HTMLElement>,
  orientation: 'horizontal' | 'vertical',
) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const backwardsKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
  const forwardsKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  if (
    event.key !== backwardsKey &&
    event.key !== forwardsKey &&
    event.key !== 'Home' &&
    event.key !== 'End'
  ) {
    return;
  }

  const target = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
  if (!(target instanceof HTMLAnchorElement)) return;

  const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const currentIndex = links.indexOf(target);
  if (currentIndex === -1 || !links.length) return;

  let nextIndex = currentIndex;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = links.length - 1;
  if (event.key === backwardsKey) nextIndex = (currentIndex - 1 + links.length) % links.length;
  if (event.key === forwardsKey) nextIndex = (currentIndex + 1) % links.length;

  event.preventDefault();
  links[nextIndex]?.focus();
}

function ArticleUtilities({
  activeItem,
  onSourceClick,
  sourceItem,
}: {
  activeItem?: ArticleNavItem;
  onSourceClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  sourceItem?: ArticleNavItem;
}) {
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const resetTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(resetTimerRef.current);
  }, []);

  const copyLink = async () => {
    const url = new URL(window.location.href);
    if (activeItem?.id) url.hash = activeItem.id;

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setCopyStatus(`${activeItem?.label ?? 'Article'} link copied to clipboard.`);
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        setCopyStatus('');
      }, 1800);
    } catch {
      setCopied(false);
      setCopyStatus('Unable to copy the article link.');
    }
  };

  return (
    <div className="article-reader__utilities" role="group" aria-label="Article utilities">
      {sourceItem ? (
        <a href={`#${sourceItem.id}`} onClick={onSourceClick}>{sourceItem.label}</a>
      ) : null}
      <button
        type="button"
        aria-label={`Copy link to ${activeItem?.label ?? 'this article'}`}
        onClick={copyLink}
      >
        {copied ? 'Copied' : 'Copy section'}
      </button>
      <button type="button" onClick={() => window.print()}>Print / PDF</button>
      <span className="sr-only" role="status" aria-live="polite">{copyStatus}</span>
    </div>
  );
}

function ArticleOverviewBand({
  items,
  activeId,
}: {
  items: ArticleNavItem[];
  activeId?: string;
}) {
  return (
    <section className="article-reader__overview-band" aria-labelledby="article-overview-title">
      <header>
        <SectionEyebrow>Reading map</SectionEyebrow>
        <p id="article-overview-title">
          <strong>{String(items.length).padStart(2, '0')}</strong>
          <span>{items.length === 1 ? 'section' : 'sections'}</span>
        </p>
      </header>
      <nav
        aria-label="Article overview"
        onKeyDown={(event) => moveArticleNavFocus(event, 'horizontal')}
      >
        <ol>
          {items.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined}>
                <span>{item.index ?? String(index + 1).padStart(2, '0')}</span>
                <strong>{item.label}</strong>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}

type ArticleBodyProps = {
  items: ArticleNavItem[];
  boundary?: ReactNode;
  boundaryLabel?: ReactNode;
  children: ReactNode;
  mode: ArticleReadingMode;
  contentsLabel?: string;
};

function ArticleBody({
  items,
  boundary,
  boundaryLabel = 'Boundary',
  children,
  mode,
  contentsLabel = mode === 'narrative' ? 'Chapters' : 'Contents',
}: ArticleBodyProps) {
  const activeId = useActiveSection(items);
  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const activeItem = items[activeIndex];
  const sourceItem = items.find((item) => item.id === 'source-ledger' || item.index === 'S');
  const progress = items.length ? ((activeIndex + 1) / items.length) * 100 : 0;
  const positionLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  const closeMobileContents = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const details = event.currentTarget.closest('details');
    if (!details) return;

    details.open = false;
    window.requestAnimationFrame(() => {
      details.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
    });
  };
  const handleMobileContentsKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key !== 'Escape' || !event.currentTarget.open) return;

    event.preventDefault();
    event.currentTarget.open = false;
    event.currentTarget.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
  };

  return (
    <PageFrame className="article-reader__body-frame">
      <ArticleOverviewBand items={items} activeId={activeId} />

      <details
        className="article-reader__mobile-contents"
        onKeyDown={handleMobileContentsKeyDown}
      >
        <summary>
          <span className="article-reader__mobile-contents-label">
            <small>{contentsLabel}</small>
            <strong>{activeItem?.label ?? 'Overview'}</strong>
          </span>
          <span className="article-reader__mobile-contents-status">
            <span className="article-reader__mobile-contents-count">
              {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <span className="article-reader__mobile-contents-toggle" aria-hidden="true">+</span>
          </span>
        </summary>
        <nav
          aria-label={`${contentsLabel} navigation`}
          onKeyDown={(event) => moveArticleNavFocus(event, 'vertical')}
        >
          {items.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'location' : undefined}
              onClick={closeMobileContents}
            >
              <span>{item.index ?? String(index + 1).padStart(2, '0')}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <ArticleUtilities
          activeItem={activeItem}
          onSourceClick={closeMobileContents}
          sourceItem={sourceItem}
        />
      </details>

      <div
        className="article-reader__mobile-progress"
        role="progressbar"
        aria-label={`${contentsLabel} position`}
        aria-valuemin={1}
        aria-valuemax={Math.max(1, items.length)}
        aria-valuenow={activeIndex + 1}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="article-reader__body-layout">
        <aside className="article-reader__rail">
          <div className="article-reader__rail-sticky">
            <div className="article-reader__rail-heading">
              <SectionEyebrow>{contentsLabel}</SectionEyebrow>
              <span>{positionLabel}</span>
            </div>
            <div className="article-reader__rail-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <nav
              aria-label={`${contentsLabel} navigation`}
              onKeyDown={(event) => moveArticleNavFocus(event, 'vertical')}
            >
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
            <ArticleUtilities activeItem={activeItem} sourceItem={sourceItem} />
          </div>
        </aside>

        <ReaderPanel id="article-body" className="article-reader__content" tabIndex={-1}>
          {children}
          {mode === 'narrative' && items.length > 1 ? (
            <nav
              className={`article-reader__chapter-nav ${
                activeIndex === 0 || activeIndex === items.length - 1
                  ? 'article-reader__chapter-nav--single'
                  : ''
              }`}
              aria-label="Chapter navigation"
            >
              {activeIndex > 0 ? (
                <a href={`#${items[activeIndex - 1].id}`} data-direction="previous">
                  <span>Previous</span>
                  <strong>{items[activeIndex - 1].label}</strong>
                </a>
              ) : null}
              {activeIndex < items.length - 1 ? (
                <a href={`#${items[activeIndex + 1].id}`} data-direction="next">
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

function ArticleEndnote({
  children,
  label,
  title,
  note,
  boundary,
  boundaryLabel = 'Evidence boundary',
  links,
}: {
  children: ReactNode;
  label: ReactNode;
  title: ReactNode;
  note?: ReactNode;
  boundary?: ReactNode;
  boundaryLabel?: ReactNode;
  links: Array<{ href: string; label: string }>;
}) {
  const uniqueLinks = links.filter(
    (link, index) => links.findIndex((candidate) => candidate.href === link.href) === index,
  );

  return (
    <footer
      id="article-conclusion"
      className="article-reader__endnote"
      aria-labelledby="article-conclusion-title"
    >
      <div className="article-reader__endnote-copy">
        <span>{label}</span>
        <h2 id="article-conclusion-title">{title}</h2>
        <p>{children}</p>
      </div>
      {boundary || note ? (
        <div className="article-reader__endnote-evidence" aria-label="Evidence status">
          {boundary ? (
            <div>
              <span>{boundaryLabel}</span>
              <p>{boundary}</p>
            </div>
          ) : null}
          {note ? (
            <div>
              <span>Evidence currency</span>
              <p>{note}</p>
            </div>
          ) : null}
        </div>
      ) : null}
      <nav aria-label="Continue reading">
        <span aria-hidden="true">Continue reading</span>
        {uniqueLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
    </footer>
  );
}
