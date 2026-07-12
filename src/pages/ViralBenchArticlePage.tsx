import { createElement, useMemo, type ReactNode } from 'react';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_MARKDOWN,
  VIRALBENCH_ARTICLE_READ_TIME,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToHtml } from '../utils/markdownToHtml';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute('/viralbench-codex-agent-harness')!;
const ALLOWED_ARTICLE_TAGS = new Set([
  'a', 'blockquote', 'code', 'div', 'em', 'figcaption', 'h2', 'h3', 'h4', 'li', 'ol', 'p',
  'pre', 'strong', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
]);

function articleNodeToReact(node: Node, key: string): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  if (!ALLOWED_ARTICLE_TAGS.has(tag)) {
    return Array.from(element.childNodes).map((child, index) => articleNodeToReact(child, `${key}-${index}`));
  }

  const href = element.getAttribute('href');
  const props: Record<string, unknown> = { key };
  if (element.id) props.id = element.id;
  if (element.className) props.className = element.className;
  if (href && (/^https:\/\//.test(href) || /^\/[a-z0-9]/i.test(href) || /^#/.test(href))) {
    props.href = href;
    if (href.startsWith('https://')) {
      props.target = '_blank';
      props.rel = 'noreferrer';
    }
  }
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) props['aria-label'] = ariaLabel;

  const children = Array.from(element.childNodes).map((child, index) => articleNodeToReact(child, `${key}-${index}`));
  return createElement(tag, props, ...children);
}

function markdownToReact(markdown: string) {
  const document = new DOMParser().parseFromString(markdownToHtml(markdown), 'text/html');
  return Array.from(document.body.childNodes).map((node, index) => articleNodeToReact(node, `article-${index}`));
}

function ArchitectureDiagram() {
  return (
    <figure className="viralbench-architecture" aria-labelledby="viralbench-architecture-caption">
      <div className="viralbench-architecture__rail">
        <span>Live environment</span>
        <span>Independent controls</span>
        <span>Bounded engineering</span>
      </div>
      <div className="viralbench-architecture__nodes">
        <div className="viralbench-node viralbench-node--live">
          <span className="viralbench-node__index">01 / inner loop</span>
          <strong>ViralBench agent</strong>
          <p>Research → create → preview → submit</p>
        </div>
        <ArrowDown className="viralbench-architecture__arrow" aria-hidden="true" size={18} strokeWidth={1.3} />
        <div className="viralbench-node viralbench-node--evidence">
          <span className="viralbench-node__index">02 / evidence spine</span>
          <strong>Immutable trace + evaluator</strong>
          <p>Sources, artifacts, configuration, checks, fixed-window outcomes</p>
        </div>
        <ArrowDown className="viralbench-architecture__arrow" aria-hidden="true" size={18} strokeWidth={1.3} />
        <div className="viralbench-node viralbench-node--codex">
          <span className="viralbench-node__index">03 / outer loop</span>
          <strong>Codex worktree</strong>
          <p>Diagnose → patch → replay → draft canary → promote or revert</p>
        </div>
      </div>
      <figcaption id="viralbench-architecture-caption">
        ViralBench runs the live marketing-agent loop. Codex improves the system through isolated experiments, independent evaluation, and locked deployment gates.
      </figcaption>
    </figure>
  );
}

export default function ViralBenchArticlePage() {
  useSEO(ROUTE);
  const articleContent = useMemo(() => markdownToReact(VIRALBENCH_ARTICLE_MARKDOWN), []);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-ink font-sans text-canvas selection:bg-accent selection:text-ink">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="dark" />

      <article className="viralbench-article relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-20 pt-16 md:px-8 lg:px-10 lg:pt-24">
        <header className="grid gap-12 border-b border-canvas/12 pb-14 lg:grid-cols-[minmax(220px,0.25fr)_minmax(0,0.75fr)] lg:gap-16 lg:pb-20">
          <aside className="order-2 grid content-start gap-8 border-t border-canvas/12 pt-8 text-[10px] uppercase tracking-[0.22em] text-canvas/52 lg:order-1 lg:border-r lg:border-t-0 lg:pr-8 lg:pt-0">
            <a href="/research" className="inline-flex min-h-11 items-center gap-2 text-accent transition-colors hover:text-canvas">
              <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.4} />
              <span>Research notes</span>
            </a>
            <dl className="grid gap-5">
              <div><dt className="text-canvas/30">Category</dt><dd className="mt-1 text-canvas">AI Systems Engineering</dd></div>
              <div><dt className="text-canvas/30">Author</dt><dd className="mt-1"><a href="/about" className="text-canvas hover:text-accent">Sulayman Bowles</a></dd></div>
              <div><dt className="text-canvas/30">Published</dt><dd className="mt-1 text-canvas"><time dateTime={VIRALBENCH_ARTICLE_DATE}>July 9, 2026</time></dd></div>
              <div><dt className="text-canvas/30">Read time</dt><dd className="mt-1 text-canvas">{VIRALBENCH_ARTICLE_READ_TIME}</dd></div>
              <div><dt className="text-canvas/30">Method</dt><dd className="mt-1 normal-case leading-relaxed tracking-normal text-canvas/64">Live methodology, supplied source archive, and code audit at commit <code>5f5f57e</code>.</dd></div>
            </dl>
          </aside>

          <div className="order-1 lg:order-2">
            <p className="mb-7 text-[10px] uppercase tracking-[0.34em] text-accent">ViralBench × Codex / build note 001</p>
            <h1 className="max-w-[13ch] font-serif text-[3.35rem] font-light italic leading-[0.86] tracking-normal text-canvas sm:text-[4.5rem] lg:text-7xl xl:text-8xl">
              {VIRALBENCH_ARTICLE_TITLE}
            </h1>
            <p className="mt-9 max-w-3xl border-l border-accent/55 pl-5 text-lg italic leading-relaxed text-canvas/66 md:text-xl">
              {VIRALBENCH_ARTICLE_DESCRIPTION}
            </p>
          </div>
        </header>

        <div className="grid gap-14 pt-12 lg:grid-cols-[minmax(220px,0.25fr)_minmax(0,0.75fr)] lg:gap-16 lg:pt-16">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border-r border-canvas/12 pr-8 text-[10px] uppercase leading-6 tracking-[0.2em] text-canvas/40">
              <span className="block text-accent/80">Thesis</span>
              <p className="mt-3 normal-case leading-relaxed tracking-normal text-canvas/54">
                The inner agent makes the post. The outer engineering loop improves the system—and never grades or deploys its own work.
              </p>
            </div>
          </aside>

          <div className="min-w-0 max-w-4xl">
            <ArchitectureDiagram />
            <div className="viralbench-prose">{articleContent}</div>
          </div>
        </div>
      </article>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 lg:px-10">
        <InternalFooter activePath="/research" tone="dark" />
      </div>
    </main>
  );
}
