import { createElement, useEffect, useMemo, type ReactNode } from 'react';
import {
  ArticleBody,
  ArticleCallout,
  ArticleEndnote,
  ArticleHero,
  ArticleMetricStrip,
  ArticlePage,
  ArticleSectionHeader,
  type ArticleNavItem,
} from '../components/ArticleLayout';
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
import { canonicalizeKnownExternalLinks } from '../content/canonicalExternalLinks';
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

const ARTICLE = splitArticle(canonicalizeKnownExternalLinks(VIRALBENCH_ARTICLE_MARKDOWN));
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

  return <div className="article-reader__prose">{content}</div>;
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
    <section id={section.id}>
      <ArticleSectionHeader index={sectionMarker(section, index)}>{section.title}</ArticleSectionHeader>
      {section.id === EVIDENCE_SECTION_ID ? <ArticleVisual placement="inline" /> : null}
      <ArticleMarkdown markdown={section.markdown} />
      {section.id === HARNESS_SECTION_ID ? <ArchitectureDiagram /> : null}
    </section>
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

  const railSections = ARTICLE.sections.filter((section) => RAIL_SECTION_IDS.has(section.id));
  const navItems: ArticleNavItem[] = [
    { id: 'overview', label: 'Overview', index: '00', summary: 'The system and the outer loop.' },
    ...railSections.map((section) => {
      const articleIndex = ARTICLE.sections.findIndex((candidate) => candidate.id === section.id);
      return {
        id: section.id,
        label: section.title,
        index: sectionMarker(section, articleIndex),
      };
    }),
  ];

  return (
    <ArticlePage activePath="/research" variant="chapters" className="viralbench-toll-article">
      <ArticleHero
        backHref="/research"
        backLabel="Research notes"
        eyebrow="ViralBench / Codex / agent evaluation"
        title={VIRALBENCH_ARTICLE_TITLE}
        displayTitle="A bounded outer loop for improving a live marketing agent."
        deck={VIRALBENCH_ARTICLE_DESCRIPTION}
        image={{
          src: VIRALBENCH_ARTICLE_IMAGE,
          alt: 'A monochrome gallery of suspended social-media posts receding toward a bright exit.',
          label: 'System view / 01',
          caption: 'The live attention environment surrounding the agent harness.',
        }}
        metadata={[
          { label: 'Subject', value: 'AI systems engineering' },
          { label: 'Published', value: <time dateTime={VIRALBENCH_ARTICLE_DATE}>July 9, 2026</time> },
          { label: 'Updated', value: <time dateTime={VIRALBENCH_ARTICLE_MODIFIED_DATE}>July 14, 2026</time> },
          { label: 'Read time', value: VIRALBENCH_ARTICLE_READ_TIME },
          { label: 'Method', value: <>Live methodology, supplied source archive, and code audit at commit <code>5f5f57e</code>.</> },
        ]}
      />

      <ArticleMetricStrip items={HEADLINE_METRICS.map((metric) => ({ label: metric.label, value: metric.value, note: metric.note }))} />

      <ArticleCallout label="Short answer" title="The benchmark is the system, not only the model.">
        <p>
          The ViralBench agent tries to make a successful post. Codex improves the system that researches, creates, reviews, and publishes it—through isolated patches, replay tests, independent evaluation, and controlled promotion.
        </p>
      </ArticleCallout>

      <ArticleBody
        items={navItems}
        variant="chapters"
        boundary="Codex can diagnose and patch the harness. It cannot grade or deploy its own work."
        boundaryLabel="Build boundary"
      >
        <section id="overview">
          <ArticleSectionHeader index="00">Overview</ArticleSectionHeader>
          <ArticleMarkdown markdown={ARTICLE.lede} />
        </section>
        {ARTICLE.sections.map((section, index) => (
          createElement(ViralBenchSection, { key: section.id, section, index })
        ))}

        <ArticleEndnote
          links={[
            { href: '/research', label: 'Research assets' },
            { href: '/atlas', label: 'Atlas' },
            { href: '/about', label: 'About the author' },
          ]}
        >
          Build note based on the live ViralBench methodology and the supplied standalone handoff at commit 5f5f57e.
        </ArticleEndnote>
      </ArticleBody>
    </ArticlePage>
  );
}
