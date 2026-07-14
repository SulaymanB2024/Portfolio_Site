import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { InternalHeader } from '../InternalHeader';
import { ScrollProgress } from '../ScrollProgress';

type EditorialArticlePageProps = Omit<ComponentPropsWithoutRef<'main'>, 'children'> & {
  activePath: string;
  children: ReactNode;
};

export function EditorialArticlePage({
  activePath,
  children,
  className = '',
  ...props
}: EditorialArticlePageProps) {
  return (
    <main
      className={`site-page site-page-light editorial-article-page min-h-screen overflow-x-hidden font-sans ${className}`.trim()}
      {...props}
    >
      <ScrollProgress />
      <InternalHeader activePath={activePath} tone="light" />
      {children}
    </main>
  );
}

type EditorialArticleHeroProps = {
  dateTime: string;
  published: string;
  kind: string;
  readTime: string;
  title: ReactNode;
  summary: ReactNode;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  caption?: ReactNode;
};

export function EditorialArticleHero({
  dateTime,
  published,
  kind,
  readTime,
  title,
  summary,
  image,
  caption,
}: EditorialArticleHeroProps) {
  return (
    <header className="editorial-article-hero">
      <div className="editorial-article-hero__copy">
        <p className="editorial-article-hero__meta">
          <time dateTime={dateTime}>{published}</time>
          <span aria-hidden="true">·</span>
          <span>{kind}</span>
          <span aria-hidden="true">·</span>
          <span>{readTime} read</span>
        </p>
        <h1>{title}</h1>
        <span className="editorial-article-hero__rule" aria-hidden="true">—</span>
        <p className="editorial-article-hero__summary">{summary}</p>
      </div>

      <figure className="editorial-article-hero__media">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </header>
  );
}
