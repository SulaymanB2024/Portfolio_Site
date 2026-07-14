import { createElement, Fragment, useEffect, useMemo, type ReactNode } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { EditorialArticleHero, EditorialArticlePage } from '../components/articles/EditorialArticle';
import {
  VIRALBENCH_ARTICLE_DATE,
  VIRALBENCH_ARTICLE_DESCRIPTION,
  VIRALBENCH_ARTICLE_HERO_TITLE,
  VIRALBENCH_ARTICLE_IMAGE,
  VIRALBENCH_ARTICLE_MARKDOWN,
  VIRALBENCH_ARTICLE_READ_TIME,
} from '../content/viralBenchArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToHtml } from '../utils/markdownToHtml';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute('/viralbench-codex-agent-harness')!;
const ALLOWED_ARTICLE_TAGS = new Set([
  'a', 'blockquote', 'code', 'div', 'em', 'figcaption', 'h2', 'h3', 'h4', 'li', 'ol', 'p',
  'pre', 'strong', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
]);

type ViralBenchSection = {
  id: string;
  title: string;
  markdown: string;
};

const headlineMetrics = [
  { value: '937', label: 'lines audited', note: 'single TypeScript handoff' },
  { value: '18', label: 'agent rounds', note: 'fixed working budget' },
  { value: '5', label: 'operational tools', note: 'research through publishing' },
  { value: '6', label: 'research calls', note: 'maximum per run' },
] as const;

const toolBudget = [
  { label: 'Agent rounds', value: 18, max: 18, display: '18' },
  { label: 'Operational tools', value: 5, max: 18, display: '5' },
  { label: 'Research calls', value: 6, max: 18, display: '6' },
  { label: 'Viewed references / round', value: 12, max: 18, display: '12' },
] as const;

const systemLayers = [
  { label: 'Model', detail: 'Base reasoning and vision capability' },
  { label: 'Harness', detail: 'Prompt, tool schemas, limits, and memory' },
  { label: 'Creative stack', detail: 'Retrieval, references, image model, renderer' },
  { label: 'Account state', detail: 'History, timing, audience, and prior performance' },
  { label: 'Platform', detail: 'Distribution conditions and delayed feedback' },
] as const;

const auditGaps = [
  { index: '01', label: 'Thin run record', consequence: 'Success and failure cannot be reconstructed' },
  { index: '02', label: 'Prompt-only constraints', consequence: 'Policy is described but not enforced' },
  { index: '03', label: 'Partial visual review', consequence: 'Long carousels can ship unseen slides' },
  { index: '04', label: 'Free-form memory', consequence: 'Belief and evidence collapse into one note' },
  { index: '05', label: 'Attribution edge cases', consequence: 'Caption matching can attach the wrong metrics' },
  { index: '06', label: 'Hidden parallelism', consequence: 'Same-round dependencies are implicit' },
  { index: '07', label: 'Provenance risk', consequence: 'Adaptation and reproduction are not separated' },
  { index: '08', label: 'Install drift', consequence: 'The handoff does not reproduce from its manifest' },
] as const;

const evidenceStages = [
  { index: '01', label: 'Capture', detail: 'Messages, tools, sources, prompts, artifacts, cost, timing' },
  { index: '02', label: 'Evaluate', detail: 'Versioned checks, replay results, fixed-window outcomes' },
  { index: '03', label: 'Change', detail: 'One bounded hypothesis in an isolated worktree' },
  { index: '04', label: 'Release', detail: 'Draft canary, human review, promote or revert' },
] as const;

const trialControls = [
  { label: 'Pair', detail: 'Blocked baseline and treatment accounts' },
  { label: 'Freeze', detail: 'Predeclared metric and measurement windows' },
  { label: 'Separate', detail: 'Locked evaluator outside the builder' },
  { label: 'Gate', detail: 'Human approval before public publishing' },
] as const;

const buildPhases = [
  { index: '0', label: 'Freeze the baseline', output: 'Installable, replayable reference system' },
  { index: '1', label: 'Trace + enforce', output: 'Explainable runs and hard runtime invariants' },
  { index: '2', label: 'Split + replay', output: 'Offline experiments without publishing' },
  { index: '3', label: 'Introduce Codex', output: 'Reviewed patches from isolated worktrees' },
  { index: '4', label: 'Draft canaries', output: 'Online evidence with a rollback point' },
  { index: '5', label: 'Bounded promotion', output: 'Narrow automation earned by reliability' },
] as const;

const railSections = [
  { id: 'viralbench-is-a-live-agent-environment', label: 'Environment' },
  { id: 'what-the-code-audit-reveals', label: 'Code audit' },
  { id: 'what-i-mean-by-codex-as-a-harness', label: 'Harness design' },
  { id: 'the-evidence-layer-comes-before-the-codex-layer', label: 'Evidence spine' },
  { id: 'offline-replay-should-absorb-most-iteration', label: 'Offline replay' },
  { id: 'live-evaluation-needs-experimental-discipline', label: 'Live trials' },
  { id: 'the-first-build-sequence', label: 'Build sequence' },
  { id: 'the-experiments-i-would-run-first', label: 'Experiments' },
  { id: 'frequently-asked-questions', label: 'Direct answers' },
  { id: 'sources-and-technical-notes', label: 'Sources' },
] as const;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function splitArticleMarkdown(markdown: string) {
  const sectionPattern = /^##\s+(.+)$/gm;
  const matches = Array.from(markdown.matchAll(sectionPattern));
  const firstSectionStart = matches[0]?.index ?? markdown.length;
  const lede = markdown.slice(0, firstSectionStart).trim();
  const sections = matches.map((match, index): ViralBenchSection => {
    const title = match[1].trim();
    const sectionStart = (match.index ?? 0) + match[0].length;
    const sectionEnd = matches[index + 1]?.index ?? markdown.length;

    return {
      id: slugify(title),
      title,
      markdown: markdown.slice(sectionStart, sectionEnd).trim(),
    };
  });

  return { lede, sections };
}

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
  if (tag === 'div' && element.classList.contains('article-table-wrap')) {
    return createElement(
      tag,
      props,
      createElement('span', { className: 'viralbench-table-scroll-hint', 'aria-hidden': true }, 'Scroll horizontally for the full record'),
      ...children,
    );
  }
  return createElement(tag, props, ...children);
}

function markdownToReact(markdown: string) {
  const document = new DOMParser().parseFromString(markdownToHtml(markdown), 'text/html');
  return Array.from(document.body.childNodes).map((node, index) => articleNodeToReact(node, `article-${index}`));
}

function FigureLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="viralbench-figure-label">
      <span>{number}</span>
      <span>{title}</span>
    </div>
  );
}

function ArchitectureDiagram() {
  const nodes = [
    { index: '01', kicker: 'Live inner loop', title: 'ViralBench agent', detail: 'Research, create, preview, submit, learn from delayed outcomes' },
    { index: '02', kicker: 'Independent control', title: 'Trace + evaluator', detail: 'Preserve evidence, run replay, apply fixed checks and windows' },
    { index: '03', kicker: 'Bounded outer loop', title: 'Codex worktree', detail: 'Diagnose, patch, replay, draft canary, promote or revert' },
  ] as const;

  return (
    <figure className="viralbench-flow-figure" aria-labelledby="viralbench-flow-caption">
      <FigureLabel number="Figure 01" title="The two-loop harness" />
      <ol className="viralbench-flow-figure__nodes">
        {nodes.map((node) => (
          <li key={node.index}>
            <span>{node.index} / {node.kicker}</span>
            <strong>{node.title}</strong>
            <p>{node.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption id="viralbench-flow-caption">
        The content agent acts inside the live environment. Evidence and evaluation sit between that loop and any Codex-authored change.
      </figcaption>
    </figure>
  );
}

function ToolBudgetFigure() {
  return (
    <figure className="viralbench-budget-figure" aria-labelledby="viralbench-budget-caption">
      <FigureLabel number="Figure 02" title="Current handoff operating envelope" />
      <div className="viralbench-budget-figure__rows">
        {toolBudget.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <div aria-hidden="true"><span style={{ width: `${(item.value / item.max) * 100}%` }} /></div>
            <strong>{item.display}</strong>
          </div>
        ))}
      </div>
      <figcaption id="viralbench-budget-caption">
        The agent is already bounded. The next system must make those limits observable, replayable, and enforceable rather than leaving important rules in prompt prose.
      </figcaption>
    </figure>
  );
}

function SystemResultFigure() {
  return (
    <figure className="viralbench-stack-figure" aria-labelledby="viralbench-stack-caption">
      <FigureLabel number="Figure 03" title="What the leaderboard actually measures" />
      <div className="viralbench-stack-figure__layers">
        {systemLayers.map((layer, index) => (
          <div key={layer.label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{layer.label}</strong>
            <p>{layer.detail}</p>
          </div>
        ))}
      </div>
      <p className="viralbench-stack-figure__result">Observed result = model + harness + creative stack + account state + platform conditions</p>
      <figcaption id="viralbench-stack-caption">
        ViralBench is a live system benchmark. Model comparisons remain useful, but each result belongs to a versioned model-plus-harness configuration.
      </figcaption>
    </figure>
  );
}

function AuditLedgerFigure() {
  return (
    <figure className="viralbench-audit-figure" aria-labelledby="viralbench-audit-caption">
      <FigureLabel number="Figure 04" title="Eight audit gaps that block trustworthy iteration" />
      <div className="viralbench-audit-figure__grid">
        {auditGaps.map((gap) => (
          <div key={gap.index}>
            <span>{gap.index}</span>
            <strong>{gap.label}</strong>
            <p>{gap.consequence}</p>
          </div>
        ))}
      </div>
      <figcaption id="viralbench-audit-caption">
        These are not arguments against the benchmark. They are the boundary between a working handoff and an experimental system that can support repeatable engineering claims.
      </figcaption>
    </figure>
  );
}

function EvidenceSpineFigure() {
  return (
    <figure className="viralbench-evidence-figure" aria-labelledby="viralbench-evidence-caption">
      <FigureLabel number="Figure 05" title="The evidence spine precedes autonomy" />
      <ol>
        {evidenceStages.map((stage) => (
          <li key={stage.index}>
            <span>{stage.index}</span>
            <strong>{stage.label}</strong>
            <p>{stage.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption id="viralbench-evidence-caption">
        Raw traces remain inspectable. Evaluations are versioned. Codex changes one bounded surface. Release authority stays outside the builder.
      </figcaption>
    </figure>
  );
}

function TrialDesignFigure() {
  return (
    <figure className="viralbench-trial-figure" aria-labelledby="viralbench-trial-caption">
      <FigureLabel number="Figure 06" title="A live trial needs controls before optimization" />
      <div className="viralbench-trial-figure__lanes">
        <div>
          <span>Control lane</span>
          <strong>Frozen baseline</strong>
          <p>Current approved configuration, unchanged during the test window.</p>
        </div>
        <div>
          <span>Treatment lane</span>
          <strong>One bounded change</strong>
          <p>Same evaluator, paired timing, explicit hypothesis, reviewable patch.</p>
        </div>
      </div>
      <div className="viralbench-trial-figure__controls">
        {trialControls.map((control) => (
          <div key={control.label}>
            <strong>{control.label}</strong>
            <span>{control.detail}</span>
          </div>
        ))}
      </div>
      <figcaption id="viralbench-trial-caption">
        Views remain noisy and path-dependent. Pairing, fixed windows, independent evaluation, and publish gates reduce the chance that luck is mistaken for improvement.
      </figcaption>
    </figure>
  );
}

function BuildSequenceFigure() {
  return (
    <figure className="viralbench-build-figure" aria-labelledby="viralbench-build-caption">
      <FigureLabel number="Figure 07" title="The first implementation sequence" />
      <ol>
        {buildPhases.map((phase) => (
          <li key={phase.index}>
            <span>Phase {phase.index}</span>
            <strong>{phase.label}</strong>
            <p>{phase.output}</p>
          </li>
        ))}
      </ol>
      <figcaption id="viralbench-build-caption">
        Autonomy expands only after the trace, replay, review, and canary layers demonstrate reliability on a defined surface.
      </figcaption>
    </figure>
  );
}

function SectionVisual({ sectionId, placement }: { sectionId: string; placement: 'before' | 'after' }) {
  if (placement === 'after' && sectionId === 'viralbench-is-a-live-agent-environment') return <ToolBudgetFigure />;
  if (placement === 'after' && sectionId === 'the-leaderboard-is-a-system-result-not-a-pure-model-score') return <SystemResultFigure />;
  if (placement === 'before' && sectionId === 'what-the-code-audit-reveals') return <AuditLedgerFigure />;
  if (placement === 'before' && sectionId === 'the-evidence-layer-comes-before-the-codex-layer') return <EvidenceSpineFigure />;
  if (placement === 'before' && sectionId === 'live-evaluation-needs-experimental-discipline') return <TrialDesignFigure />;
  if (placement === 'before' && sectionId === 'the-first-build-sequence') return <BuildSequenceFigure />;
  return null;
}

function ArticleRail() {
  return (
    <aside className="viralbench-article-rail">
      <div>
        <p>Article map</p>
        <nav aria-label="ViralBench article sections">
          {railSections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {section.label}
            </a>
          ))}
        </nav>
        <div className="viralbench-article-rail__boundary">
          <span>Boundary</span>
          <p>The builder does not control raw evidence, evaluation, and deployment at the same time.</p>
        </div>
      </div>
    </aside>
  );
}

function ArticleSection({ section, index }: { section: ViralBenchSection; index: number }) {
  const content = useMemo(() => markdownToReact(section.markdown), [section.markdown]);

  return (
    <section id={section.id} className="viralbench-editorial-section scroll-mt-28">
      <header>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h2>{section.title}</h2>
      </header>
      <SectionVisual sectionId={section.id} placement="before" />
      <div className="viralbench-article-prose">{content}</div>
      <SectionVisual sectionId={section.id} placement="after" />
    </section>
  );
}

export default function ViralBenchArticlePage() {
  useSEO(ROUTE);
  const { lede, sections } = useMemo(() => splitArticleMarkdown(VIRALBENCH_ARTICLE_MARKDOWN), []);
  const ledeContent = useMemo(() => markdownToReact(lede), [lede]);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) {
      window.scrollTo(0, 0);
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView();
    });
  }, []);

  return (
    <EditorialArticlePage id="top" activePath="/research" className="viralbench-editorial-article">
      <article className="editorial-article-document">
        <div className="editorial-article-frame">
          <EditorialArticleHero
            dateTime={VIRALBENCH_ARTICLE_DATE}
            published="July 9, 2026"
            kind="Build note"
            readTime={VIRALBENCH_ARTICLE_READ_TIME}
            title={VIRALBENCH_ARTICLE_HERO_TITLE}
            summary={VIRALBENCH_ARTICLE_DESCRIPTION}
            image={{
              src: VIRALBENCH_ARTICLE_IMAGE,
              alt: 'System map connecting a live ViralBench agent, an independent evidence spine, and a bounded Codex engineering worktree.',
              width: 1200,
              height: 630,
            }}
            caption="The live content loop and the engineering loop remain separated by immutable evidence, independent evaluation, and release gates."
          />
        </div>

        <div className="viralbench-article-body">
          <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-24 pt-14 md:px-8 lg:px-10 lg:pt-24">
            <div className="viralbench-headline-metrics" aria-label="ViralBench code-audit headline figures">
              {headlineMetrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.note}</small>
                </div>
              ))}
            </div>

            <section className="viralbench-quick-answer" aria-labelledby="viralbench-quick-answer-title">
              <p>Core distinction</p>
              <div>
                <h2 id="viralbench-quick-answer-title">ViralBench runs the post. Codex improves the system around it.</h2>
                <p>
                  The content agent operates in a live attention market. Codex works outside that loop: reading traces, forming one bounded hypothesis, changing a defined surface, running replay, and producing a reviewable candidate without grading or deploying itself.
                </p>
              </div>
            </section>

            <div className="viralbench-editorial-layout">
              <ArticleRail />
              <div className="min-w-0 max-w-[920px]">
                <section className="viralbench-article-lede">
                  <div className="viralbench-article-prose">{ledeContent}</div>
                  <ArchitectureDiagram />
                </section>
                {sections.map((section, index) => (
                  <Fragment key={section.id}>
                    <ArticleSection section={section} index={index} />
                  </Fragment>
                ))}

                <footer className="viralbench-article-endnote">
                  <p>Article basis: public ViralBench methodology and the supplied repository at commit 5f5f57e. Implementation claims are limited to that reviewed snapshot.</p>
                  <nav aria-label="Related research">
                    <a href="/research">Research index</a>
                    <a href="/atlas">Atlas evidence systems</a>
                    <a href="/method">Operating method</a>
                    <a href="/about">About the author</a>
                  </nav>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="viralbench-article-footer-shell">
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-8 md:px-8 lg:px-10">
          <InternalFooter activePath="/research" tone="light" />
        </div>
      </div>
    </EditorialArticlePage>
  );
}
