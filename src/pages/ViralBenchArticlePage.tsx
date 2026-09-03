import { createElement, useMemo, type ReactNode } from 'react';
import {
  ArticleReader,
  ArticleSectionHeader,
  createArticleNavigation,
  getArticleNavigationIndex,
  type ArticleNavItem,
  type ArticleReaderConfig,
} from '../components/ArticleLayout';
import { getArticleGenerativeArtwork } from '../art/generative/manifest';
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
import { getArticleRelatedLinkLabel, getArticleSearchTarget } from '../seo/articleSearchTargets';
import { getSeoRoute } from '../seo/routes';
import { markdownToHtml } from '../utils/markdownToHtml';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute('/viralbench-codex-agent-harness')!;
const SEARCH_TARGET = getArticleSearchTarget('/viralbench-codex-agent-harness')!;
const EVIDENCE_SECTION_ID = 'the-evidence-layer-comes-before-the-codex-layer';
const HARNESS_SECTION_ID = 'what-i-mean-by-codex-as-a-harness';
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
const ARTICLE_NOTE_REF_COUNTS = new Map<string, number>();
const ARTICLE_MARKUP = new Map(
  [ARTICLE.lede, ...ARTICLE.sections.map((section) => section.markdown)].map((markdown) => [
    markdown,
    markdownToHtml(markdown, { noteRefCounts: ARTICLE_NOTE_REF_COUNTS }),
  ]),
);
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
  let renderedTag = tag;
  if (element.id) props.id = element.id;
  if (element.className) props.className = element.className;
  if (href && (/^https:\/\//.test(href) || /^\/[a-z0-9]/i.test(href) || /^#/.test(href))) {
    props.href = href;
    if (href.startsWith('https://')) {
      props.target = '_blank';
      props.rel = 'noreferrer';
    }
  }
  if (tag === 'pre') props.tabIndex = 0;
  if (tag === 'div' && element.classList.contains('article-table-wrap')) {
    props.tabIndex = 0;
    props.role = 'region';
    props['aria-label'] = element.getAttribute('aria-label') ?? 'Scrollable data table';
  }
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel && !props['aria-label']) props['aria-label'] = ariaLabel;
  if (tag === 'table') {
    const headers = Array.from(element.querySelectorAll('thead th'))
      .map((header) => header.textContent?.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    props['data-responsive-table'] = 'stacked';
    props['aria-label'] = headers.length ? `Data table with fields: ${headers.join(', ')}` : 'Article data table';
  }
  if (tag === 'th' && element.closest('thead')) {
    props.scope = 'col';
  }
  if ((tag === 'td' || tag === 'th') && element.closest('tbody')) {
    const columnIndex = Array.from(element.parentElement?.children ?? []).indexOf(element);
    const header = element.closest('table')?.querySelectorAll('thead th')[columnIndex];
    props['data-label'] = header?.textContent?.replace(/\s+/g, ' ').trim() || `Field ${columnIndex + 1}`;
    if (columnIndex === 0) {
      renderedTag = 'th';
      props.scope = 'row';
    }
  }

  const children = Array.from(element.childNodes).map((child, index) => articleNodeToReact(child, `${key}-${index}`));
  return createElement(renderedTag, props, ...children);
}

function markdownToReact(markdown: string) {
  const document = new DOMParser().parseFromString(
    ARTICLE_MARKUP.get(markdown) ?? markdownToHtml(markdown),
    'text/html',
  );
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
          <span className="viralbench-node__index">02 / measurement spine</span>
          <strong>Immutable trace + evaluator</strong>
          <p>Sources, generated outputs, configuration, checks, fixed-window outcomes</p>
        </div>
        <span className="viralbench-architecture__arrow" aria-hidden="true">↓</span>
        <div className="viralbench-node viralbench-node--codex">
          <span className="viralbench-node__index">03 / outer loop</span>
          <strong>Codex worktree</strong>
          <p>Diagnose → patch → replay → draft canary → promote or revert</p>
        </div>
      </div>
      <figcaption id="viralbench-architecture-caption">
        ViralBench runs the live marketing-agent loop. Codex improves the system through isolated experiments, independent evaluation, and controlled deployment.
      </figcaption>
    </figure>
  );
}

function ViralBenchSection({ section, index }: { section: ArticleSection; index: string }) {
  return (
    <section id={section.id}>
      <ArticleSectionHeader index={index}>
        {section.id === EVIDENCE_SECTION_ID ? 'Measurement comes before autonomous improvement' : section.title}
      </ArticleSectionHeader>
      {section.id === EVIDENCE_SECTION_ID ? <ArticleVisual placement="inline" /> : null}
      <ArticleMarkdown markdown={section.markdown} />
      {section.id === HARNESS_SECTION_ID ? <ArchitectureDiagram /> : null}
    </section>
  );
}

export default function ViralBenchArticlePage() {
  useSEO(ROUTE);

  const faqSection = ARTICLE.sections.find((section) => section.id === 'frequently-asked-questions');
  const sourceNotesSection = ARTICLE.sections.find((section) => section.id === 'sources-and-technical-notes');
  const numberedSections = ARTICLE.sections.filter(
    (section) => section !== faqSection && section !== sourceNotesSection,
  );
  const navItems: ArticleNavItem[] = createArticleNavigation([
    {
      kind: 'overview',
      id: 'overview',
      label: 'Overview',
      summary: 'The system and the outer loop.',
    },
    ...numberedSections.map((section) => ({
      kind: 'section' as const,
      id: section.id,
      label: section.id === EVIDENCE_SECTION_ID ? 'Measurement before improvement' : section.title,
    })),
    ...(faqSection
      ? [{
          kind: 'faq' as const,
          id: faqSection.id,
          label: 'Direct answers',
        }]
      : []),
    {
      kind: 'source',
      id: 'source-ledger',
      label: 'Sources',
    },
  ]);
  const config: ArticleReaderConfig = {
    activePath: '/research',
    mode: 'narrative',
    className: 'viralbench-toll-article',
    archive: {
      href: '/research/ai-systems',
      label: 'AI systems cluster',
    },
    hero: {
      eyebrow: 'ViralBench / Codex / agent evaluation',
      title: VIRALBENCH_ARTICLE_TITLE,
      displayTitle: 'A bounded outer loop for improving a live marketing agent.',
      deck: VIRALBENCH_ARTICLE_DESCRIPTION,
      generativeArtwork: getArticleGenerativeArtwork('/viralbench-codex-agent-harness'),
      image: {
        src: VIRALBENCH_ARTICLE_IMAGE,
        alt: 'A monochrome gallery of suspended social-media posts receding toward a bright exit.',
        label: 'System view / 01',
        caption: 'The live attention environment surrounding the agent harness.',
      },
    },
    publication: {
      author: 'Sulayman Bowles',
      subject: 'AI systems engineering',
      published: {
        dateTime: VIRALBENCH_ARTICLE_DATE,
        value: 'July 9, 2026',
      },
      updated: {
        dateTime: VIRALBENCH_ARTICLE_MODIFIED_DATE,
        value: 'July 14, 2026',
      },
      readTime: VIRALBENCH_ARTICLE_READ_TIME,
      evidence: 'Live methodology + code audit',
    },
    metrics: HEADLINE_METRICS.map((metric) => ({
      label: metric.label,
      value: metric.value,
      note: metric.note,
    })),
    callouts: [{
      label: 'Direct answer',
      title: SEARCH_TARGET.primaryQuery,
      content: (
        <>
          <p>{SEARCH_TARGET.directAnswer}</p>
          <p><strong>Research basis:</strong> {SEARCH_TARGET.originalArtifact}</p>
        </>
      ),
    }],
    navigation: {
      items: navItems,
      contentsLabel: 'Chapters',
    },
    boundary: {
      label: 'Build boundary',
      content: 'Codex can diagnose and patch the harness. It cannot grade or deploy its own work.',
    },
    endnote: {
      label: 'Build conclusion',
      title: 'The harness determines whether the agent can learn',
      content: 'ViralBench supplies a live multimodal environment; the durable advantage is a measurement layer that makes each change replayable, reviewable, and independently evaluated before promotion.',
      note: 'Build note based on the live ViralBench methodology and the supplied standalone handoff at commit 5f5f57e.',
      links: [
        { href: '/research/ai-systems', label: 'AI systems research cluster' },
        ...SEARCH_TARGET.relatedPaths.map((path) => ({
          href: path,
          label: getArticleRelatedLinkLabel(ROUTE.path, path),
        })),
        { href: '/research', label: 'Research archive' },
        { href: '/atlas', label: 'Atlas' },
        { href: '/about', label: 'About the author' },
      ],
    },
  };

  return (
    <ArticleReader config={config}>
        <section id="overview">
          <ArticleSectionHeader index={getArticleNavigationIndex(navItems, 'overview')}>
            Overview
          </ArticleSectionHeader>
          <ArticleMarkdown markdown={ARTICLE.lede} />
        </section>
        {numberedSections.map((section) => (
          createElement(ViralBenchSection, {
            key: section.id,
            section,
            index: getArticleNavigationIndex(navItems, section.id),
          })
        ))}
        {faqSection
          ? createElement(ViralBenchSection, {
              key: faqSection.id,
              section: faqSection,
              index: getArticleNavigationIndex(navItems, faqSection.id),
            })
          : null}

        <section id="source-ledger">
          <ArticleSectionHeader index={getArticleNavigationIndex(navItems, 'source-ledger')}>
            Sources
          </ArticleSectionHeader>
          {sourceNotesSection ? (
            <div id={sourceNotesSection.id}>
              <ArticleMarkdown markdown={sourceNotesSection.markdown} />
            </div>
          ) : null}
          <div className="article-reader__prose">
            <ul>
              <li><a href="https://viralbench.ai/" target="_blank" rel="noreferrer" aria-label="ViralBench live methodology (opens in a new tab)">ViralBench live methodology</a></li>
              <li><a href="https://github.com/JibranK12345/Viral-Bench" target="_blank" rel="noreferrer" aria-label="ViralBench public repository (opens in a new tab)">ViralBench public repository</a></li>
              <li><a href="https://openai.com/index/harness-engineering/" target="_blank" rel="noreferrer" aria-label="OpenAI harness engineering (opens in a new tab)">OpenAI harness engineering</a></li>
              <li><a href="https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" target="_blank" rel="noreferrer" aria-label="OpenAI agent improvement loop (opens in a new tab)">OpenAI agent improvement loop</a></li>
              <li><a href="https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content" target="_blank" rel="noreferrer" aria-label="TikTok AI-generated content policy (opens in a new tab)">TikTok AI-generated content policy</a></li>
            </ul>
          </div>
        </section>

    </ArticleReader>
  );
}
