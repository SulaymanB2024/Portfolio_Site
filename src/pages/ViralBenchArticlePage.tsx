import { createElement, useEffect, useMemo, type ReactNode } from 'react';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_INLINE_IMAGE,
  VIRALBENCH_ARTICLE_MARKDOWN,
  VIRALBENCH_ARTICLE_MODIFIED_DATE,
  VIRALBENCH_ARTICLE_READ_TIME,
  VIRALBENCH_ARTICLE_TITLE,
} from '../content/viralBenchArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToHtml } from '../utils/markdownToHtml';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute('/viralbench-codex-agent-harness')!;
const EVIDENCE_SECTION_ID = 'the-evidence-layer-comes-before-the-codex-layer';
const HARNESS_SECTION_ID = 'what-i-mean-by-codex-as-a-harness';
const RAIL_SECTION_IDS = new Set([
  'viralbench-is-a-live-agent-environment',
  'the-leaderboard-is-a-system-result-not-a-pure-model-score',
  'what-the-code-audit-reveals',
  HARNESS_SECTION_ID,
  EVIDENCE_SECTION_ID,
  'the-evaluator-must-be-independent-of-codex',
  'replay-is-a-test-world-not-a-market-simulator',
  'provenance-and-similarity-have-to-be-first-class',
  'the-first-build-sequence',
  'the-experiments-i-would-run-first',
  'the-durable-asset-is-the-learning-system',
  'frequently-asked-questions',
  'sources-and-technical-notes',
]);
const ALLOWED_ARTICLE_TAGS = new Set([
  'a', 'blockquote', 'code', 'div', 'em', 'figcaption', 'h2', 'h3', 'h4', 'li', 'ol', 'p',
  'pre', 'strong', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
]);

type ArticleSection = {
  id: string;
  markdown: string;
  title: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function splitArticle(markdown: string) {
  const matches = Array.from(markdown.matchAll(/^##\s+(.+)$/gm));
  const firstSectionIndex = matches[0]?.index ?? markdown.length;
  const lede = markdown.slice(0, firstSectionIndex).trim();
  const sections = matches.map((match, index): ArticleSection => {
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    const title = match[1].trim();

    return {
      id: slugify(title),
      markdown: markdown.slice(start, end).trim(),
      title,
    };
  });

  return { lede, sections };
}

const ARTICLE = splitArticle(VIRALBENCH_ARTICLE_MARKDOWN);
const HEADLINE_METRICS = [
  { value: '18', label: 'working rounds', note: 'fixed per agent run' },
  { value: '5', label: 'execution tools', note: 'research through publishing' },
  { value: '6', label: 'research calls', note: 'maximum Lightreel budget' },
  { value: '01', label: 'outer loop', note: 'Codex improves the harness' },
] as const;

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

function ArticleMarkdown({ markdown }: { markdown: string }) {
  const content = useMemo(() => markdownToReact(markdown), [markdown]);

  return <div className="toll-article-prose">{content}</div>;
}

function ArticleVisual({ placement }: { placement: 'hero' | 'inline' }) {
  const isHero = placement === 'hero';

  return (
    <figure className={`viralbench-page-visual viralbench-page-visual--${placement}`}>
      <img
        src={isHero ? VIRALBENCH_ARTICLE_IMAGE : VIRALBENCH_ARTICLE_INLINE_IMAGE}
        width="1672"
        height="941"
        alt={isHero
          ? 'A dark gallery of suspended social-media posts receding toward a bright exit, with a dotted path curving through the space.'
          : 'An abstract monochrome room filled with speech bubbles connected by fine lines and flowing data-like strands.'}
        decoding="async"
        fetchPriority={isHero ? 'high' : 'auto'}
        loading={isHero ? 'eager' : 'lazy'}
      />
    </figure>
  );
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
        <span className="viralbench-architecture__arrow" aria-hidden="true">↓</span>
        <div className="viralbench-node viralbench-node--evidence">
          <span className="viralbench-node__index">02 / evidence spine</span>
          <strong>Immutable trace + evaluator</strong>
          <p>Sources, artifacts, configuration, checks, fixed-window outcomes</p>
        </div>
        <span className="viralbench-architecture__arrow" aria-hidden="true">↓</span>
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

function sectionMarker(section: ArticleSection, index: number) {
  if (section.id === 'frequently-asked-questions') return 'FAQ';
  if (section.id === 'sources-and-technical-notes') return 'S';
  return String(index + 1).padStart(2, '0');
}

function ViralBenchSection({ section, index }: { section: ArticleSection; index: number }) {
  return (
    <section id={section.id} className="toll-article-section scroll-mt-28">
      <header>
        <span>{sectionMarker(section, index)}</span>
        <h2>{section.title}</h2>
      </header>
      {section.id === EVIDENCE_SECTION_ID ? <ArticleVisual placement="inline" /> : null}
      <ArticleMarkdown markdown={section.markdown} />
      {section.id === HARNESS_SECTION_ID ? <ArchitectureDiagram /> : null}
    </section>
  );
}

function ArticleRail() {
  const sections = ARTICLE.sections.filter((section) => RAIL_SECTION_IDS.has(section.id));

  return (
    <aside className="toll-article-rail">
      <div className="toll-article-rail__sticky">
        <p>Article map</p>
        <nav aria-label="ViralBench article sections">
          {sections.map((section) => {
            const articleIndex = ARTICLE.sections.findIndex((candidate) => candidate.id === section.id);
            return (
              <a key={section.id} href={`/viralbench-codex-agent-harness#${section.id}`}>
                <span>{sectionMarker(section, articleIndex)}</span>
                {section.title}
              </a>
            );
          })}
        </nav>
        <div className="toll-article-rail__boundary">
          <span>Build boundary</span>
          <p>Codex can diagnose and patch the harness. It cannot grade or deploy its own work.</p>
        </div>
      </div>
    </aside>
  );
}

export default function ViralBenchArticlePage() {
  useSEO(ROUTE);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      window.scrollTo(0, 0);
      return undefined;
    }

    let frame = 0;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.querySelector<HTMLElement>(`#top #${CSS.escape(targetId)}`);
      const lenis = window.lenis as unknown as {
        resize?: () => void;
        scrollTo: (target: HTMLElement, options: { immediate: boolean }) => void;
      } | undefined;

      if (target && lenis) {
        lenis.resize?.();
        lenis.scrollTo(target, { immediate: true });
        return;
      }

      if (attempts < 4) {
        attempts += 1;
        frame = window.requestAnimationFrame(scrollToTarget);
        return;
      }

      target?.scrollIntoView();
    };

    frame = window.requestAnimationFrame(scrollToTarget);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <main id="top" className="site-page site-page-dark toll-article viralbench-toll-article min-h-screen overflow-x-hidden font-sans">
      <WireframeGrid tone="dark" className="pointer-events-none absolute inset-0 z-0 opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/research" tone="dark" />

      <article className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-24 pt-14 md:px-8 lg:px-10 lg:pt-24">
        <header className="toll-article-hero">
          <aside>
            <a href="/research">← Research notes</a>
            <dl>
              <div><dt>Subject</dt><dd>AI systems engineering</dd></div>
              <div><dt>Published</dt><dd><time dateTime={VIRALBENCH_ARTICLE_DATE}>July 9, 2026</time></dd></div>
              <div><dt>Updated</dt><dd><time dateTime={VIRALBENCH_ARTICLE_MODIFIED_DATE}>July 14, 2026</time></dd></div>
              <div><dt>Length</dt><dd>{VIRALBENCH_ARTICLE_READ_TIME}</dd></div>
              <div><dt>Method</dt><dd>Live methodology, supplied source archive, and code audit at commit <code>5f5f57e</code>.</dd></div>
            </dl>
          </aside>
          <div>
            <p className="toll-article-hero__eyebrow">ViralBench / Codex / agent evaluation</p>
            <h1>{VIRALBENCH_ARTICLE_TITLE}</h1>
            <p className="toll-article-hero__display-title">A bounded outer loop for improving a live marketing agent.</p>
            <p className="toll-article-hero__deck">{VIRALBENCH_ARTICLE_DESCRIPTION}</p>
          </div>
        </header>

        <ArticleVisual placement="hero" />

        <div className="toll-headline-metrics" aria-label="ViralBench harness headline figures">
          {HEADLINE_METRICS.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <small>{metric.note}</small>
            </div>
          ))}
        </div>

        <section className="toll-quick-answer" aria-labelledby="viralbench-quick-answer">
          <p>Short answer</p>
          <div>
            <h2 id="viralbench-quick-answer">The benchmark is the system, not only the model.</h2>
            <p>
              The ViralBench agent tries to make a successful post. Codex improves the system that researches, creates, reviews, and publishes it—through isolated patches, replay tests, independent evaluation, and controlled promotion.
            </p>
          </div>
        </section>

        <div className="toll-article-layout">
          <ArticleRail />
          <div className="min-w-0 max-w-[920px]">
            <section className="toll-article-lede">
              <ArticleMarkdown markdown={ARTICLE.lede} />
            </section>
            {ARTICLE.sections.map((section, index) => (
              createElement(ViralBenchSection, { key: section.id, section, index })
            ))}

            <footer className="toll-article-endnote">
              <p>Build note based on the live ViralBench methodology and the supplied standalone handoff at commit 5f5f57e.</p>
              <nav aria-label="Related research">
                <a href="/research">Research assets</a>
                <a href="/atlas">Atlas</a>
                <a href="/about">About the author</a>
              </nav>
            </footer>
          </div>
        </div>
      </article>

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 lg:px-10">
        <InternalFooter activePath="/research" tone="dark" />
      </div>
    </main>
  );
}
