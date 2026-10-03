import { useRef, type ReactNode } from 'react'
import { caseStudies, chapterId, type CaseStudy } from './case-studies'
import { CaseHeroArtwork } from './CaseHeroArtwork'
import { AtlasSourceComparison, PayrollLifecycle, ViralReviewLoop } from './CaseDossierEvidence'
import { Art } from '../Art'
import payrollRecord from '../../../public/research/payrollpro-system-record.json'
import './case-studies.css'
import './case-dossier.css'
import { useProjectReading } from './useProjectReading'
import { ProjectEndnav } from './ProjectEndnav'

function JumpLink({ slug, index, children, current = false }: { slug: string; index: number; children: ReactNode; current?: boolean }) {
  return (
    <a href={`#/work/${slug}?chapter=${chapterId(index)}`} aria-current={current ? 'location' : undefined}>
      <span className="mono" aria-hidden="true">
        0{index + 1}
      </span>
      {children}
    </a>
  )
}

function Chapter({ index, label, title, copy, children }: { index: number; label: string; title: ReactNode; copy?: ReactNode; children?: ReactNode }) {
  const kind =
    label === 'Source material'
      ? 'sources'
      : index === 0
        ? 'opening'
        : index === 1
          ? 'system'
          : ['Decisions & tradeoffs', 'What the prototype establishes', 'Design boundaries'].includes(label)
            ? 'decisions'
            : 'evidence'
  return (
    <section className={`study-chapter study-chapter-${kind}`} id={chapterId(index)} tabIndex={-1} aria-labelledby={`${chapterId(index)}-title`}>
      <div className="study-chapter-label">
        <span className="mono">{label}</span>
        <span className="mono" aria-hidden="true">
          0{index + 1}
        </span>
      </div>
      <header className="study-dossier-heading">
        <h2 id={`${chapterId(index)}-title`}>{title}</h2>
      </header>
      {kind === 'opening' && copy && <div className="study-chapter-copy">{copy}</div>}
      {children && <div className="study-dossier-body">{children}</div>}
      {kind !== 'opening' && copy && <div className="study-chapter-copy">{copy}</div>}
    </section>
  )
}

function Source({ href, title, children, download = false }: { href: string; title: string; children: ReactNode; download?: boolean }) {
  return (
    <a className="study-source" href={href} {...(download ? { download: true } : href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
      <span aria-hidden="true">{download ? '↓' : href.startsWith('https:') ? '↗' : '→'}</span>
    </a>
  )
}

function AtlasStory() {
  return (
    <>
      <Chapter
        index={0}
        label="The question"
        title={
          <>
            What makes an audit <em>worth acting on?</em>
          </>
        }
        copy={
          <>
            <p>An audit produces findings. A useful product makes the next decision defensible.</p>
            <p>I built Atlas to preserve each finding’s URL, page state and reasoning. Failed measurements remain visible gaps.</p>
          </>
        }
      />
      <Chapter
        index={1}
        label="The system"
        title={<>Follow the evidence all the way through.</>}
        copy={
          <>
            <p>My work spans architecture, crawler behavior, evidence policy and interface design. Observations stay attached from capture to export.</p>
          </>
        }>
        <ol className="study-process">
          {[
            ['Capture', 'Retain the URL, response and observed state.'],
            ['Connect', 'Map links and retain crawl context in SQLite.'],
            ['Review', 'Keep supporting evidence attached to the finding.'],
            ['Export', 'Carry context into structured reports.']
          ].map(([title, detail], index) => (
            <li key={title}>
              <span className="mono">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Chapter>
      <Chapter
        index={2}
        label="Inspect the evidence"
        title={
          <>
            Same response code. <em>Different content states.</em>
          </>
        }
        copy={
          <>
            <p>Both returned 200 OK. Their source markup calls for different next steps.</p>
          </>
        }>
        <AtlasSourceComparison />
      </Chapter>
      <Chapter index={3} label="Decisions & tradeoffs" title={<>The unknowns stay visible.</>}>
        <div className="study-decisions">
          <div>
            <h3>Separate observation from severity.</h3>
            <p>A missing canonical is an observation. This sample assigns no defect or severity.</p>
          </div>
          <div>
            <h3>Keep source and rendered states distinct.</h3>
            <p>Embedded records need a rendering check before judging content coverage.</p>
          </div>
          <div>
            <h3>Make a failed measurement inspectable.</h3>
            <p>Failed fetches and provider gaps stay separate from site findings.</p>
          </div>
        </div>
        <p className="study-status-note">
          Project record, July 2026: the core crawl and evidence workflow had shipped; provider integration and scoring policy remained in development.
        </p>
      </Chapter>
      <Chapter index={4} label="Source material" title="Go to the source.">
        <Source href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" title="The Atlas repository">
          The crawler, audit workflow, run persistence, and documented implementation limits.
        </Source>
        <Source href={`${import.meta.env.BASE_URL}research/atlas-open-corpus-run-2026-07-16.json`} title="The retained sample" download>
          Two source captures from July 16, 2026. The data used in the comparison above.
        </Source>
        <Source href="#/writing/atlas-building-an-evidence-console" title="Building Atlas">
          The product decisions and improvement cycle behind the console.
        </Source>
      </Chapter>
    </>
  )
}

function PayrollStory() {
  return (
    <>
      <Chapter
        index={0}
        label="The question"
        title={
          <>
            Privacy is only <em>part of the problem.</em>
          </>
        }
        copy={
          <>
            <p>Private pay needs shared treasury control and a legible record.</p>
            <p>
              I led a three-person team at the June 2025 OnionDAO Hackathon, combining Token-2022 confidential-transfer mechanics, multisig treasury control and audit visibility in
              a Solana prototype.
            </p>
          </>
        }
      />
      <Chapter
        index={1}
        label="The architecture"
        title={<>A payment has a lifecycle.</>}
        copy={
          <>
            <p>Inspect the frozen flag, release timestamp and documented operations.</p>
          </>
        }>
        <PayrollLifecycle />
      </Chapter>
      <Chapter
        index={2}
        label="What the prototype establishes"
        title={
          <>
            Before production, prove <em>the whole path.</em>
          </>
        }>
        <div className="study-decisions">
          <div>
            <h3>The prototype demonstrated the idea.</h3>
            <p>The teammate recap describes confidential transfers, multisig, Solana Pay and QR payouts. The record documents batch logic.</p>
          </div>
          <div>
            <h3>Production would require more proof.</h3>
            <p>Simplified mint/burn behavior and a skeleton payroll test still need end-to-end testing and deployment documentation.</p>
          </div>
        </div>
        <p className="study-status-note">
          The résumé records first place. A teammate’s public recap corroborates a win; an organizer placement record is not included in the retained sources.
        </p>
      </Chapter>
      <Chapter index={3} label="Source material" title="Go to the source.">
        <Source href={payrollRecord.source_basis[0].source_url!} title="The teammate recap">
          Aayush Baniya’s account of the team, the build, and the result.
        </Source>
        <Source href={`${import.meta.env.BASE_URL}research/payrollpro-system-record.json`} title="The prototype state record" download>
          Payroll states, transfer operations, and implementation limits in a structured artifact.
        </Source>
        <Source href="https://github.com/SulaymanB2024/OnionDAO-Project" title="Confidential-transfer recipes">
          The public cookbook fork used as related technical material. It is not the complete PayrollPro application.
        </Source>
      </Chapter>
    </>
  )
}

function ViralStory() {
  return (
    <>
      <Chapter
        index={0}
        label="The question"
        title={<>What improved: the agent, or its luck?</>}
        copy={
          <>
            <p>In a changing market, a strong post can be luck. More views alone do not establish a better agent.</p>
            <p>I audited ViralBench and designed an outer engineering loop: trace, propose, replay and submit evidence for review.</p>
            <p>The study builds on ViralBench, an existing open-source marketing agent.</p>
          </>
        }
      />
      <Chapter
        index={1}
        label="The improvement loop"
        title={
          <>
            One change. <em>An inspectable experiment.</em>
          </>
        }
        copy={
          <>
            <p>The candidate advances with evidence. Authority remains outside the proposing agent.</p>
          </>
        }>
        <ViralReviewLoop />
      </Chapter>
      <Chapter index={2} label="Design boundaries" title={<>What would count as progress?</>}>
        <div className="study-decisions">
          <div>
            <h3>Improve the system around the output.</h3>
            <p>A better harness needs evidence across the research, creation, review and publishing workflow.</p>
          </div>
          <div>
            <h3>Keep the comparison controlled.</h3>
            <p>Replay and live trials answer different questions. Keep their evidence separate.</p>
          </div>
          <div>
            <h3>Do not let the proposer become the judge.</h3>
            <p>Submit a reviewable candidate. Keep evaluation and release outside the engineering agent’s authority.</p>
          </div>
        </div>
        <p className="study-status-note">
          Published July 2026 as an engineering design. The study distinguishes existing repository behavior from proposed harness work; no deployed evaluation service or measured
          uplift is claimed.
        </p>
      </Chapter>
      <Chapter index={3} label="Source material" title="Go to the source.">
        <Source href="#/writing/viralbench-codex-agent-harness" title="The full engineering study">
          The architecture, source analysis, proposed trace model, and experiment design.
        </Source>
        <Source href="https://github.com/JibranK12345/Viral-Bench/blob/5f5f57e251023ceb37961c0fc2c808f67ceb71eb/marketing-agent.ts" title="The audited agent revision">
          The upstream implementation examined in the article, pinned to a specific revision.
        </Source>
      </Chapter>
    </>
  )
}

export default function CaseStudyPage({ study, dark }: { study: CaseStudy; dark: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [active] = useProjectReading(root, study.slug, '.study-chapter', chapterId(0))
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length]
  return (
    <article ref={root} className={`case-study case-dossier case-study-${study.slug}`}>
      <a className="study-back mono" href="#/work">
        ← All work
      </a>
      <header className="study-hero">
        <div className="study-hero-copy">
          <span className="eyebrow">
            Project study {study.number} / {study.category}
          </span>
          <h1>
            {study.slug === 'viralbench' ? (
              <>
                ViralBench
                <br />
                <em>+ Codex</em>
              </>
            ) : (
              study.name
            )}
            <span className="period">.</span>
          </h1>
          <p className="study-title">{study.title}</p>
          <p className="study-summary">{study.summary}</p>
          <JumpLink slug={study.slug} index={study.slug === 'atlas' ? 2 : 1}>
            {study.slug === 'atlas' ? 'Inspect the sample' : 'Explore the design'}
            <span aria-hidden="true">↓</span>
          </JumpLink>
        </div>
        <figure className="study-hero-figure">
          {study.slug === 'atlas' ? (
            <>
              <Art kind="globe" dark={dark} className="study-glb" idleMotion={false} />
              <figcaption>
                <span className="mono">Fig. {study.number}</span>
                {study.caption}
              </figcaption>
            </>
          ) : (
            <>
              <CaseHeroArtwork kind={study.slug} />
              <figcaption>
                <span className="mono">Fig. {study.number}</span>
                {study.caption}
              </figcaption>
            </>
          )}
        </figure>
      </header>
      <dl className="study-facts">
        {[
          ['My role', study.role],
          ['Period', study.period],
          ['Project state', study.status],
          ['Medium', study.medium]
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="mono">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="study-reading">
        <aside className="study-contents project-reading-bar">
          <span className="eyebrow">In this study</span>
          <nav aria-label="In this study">
            {study.chapters.map((chapter, index) => (
              <JumpLink key={chapter} slug={study.slug} index={index} current={active === chapterId(index)}>
                {chapter}
              </JumpLink>
            ))}
          </nav>
          <a className="study-context-link mono" href="#/resume">
            View résumé →
          </a>
        </aside>
        <div className="study-prose">{study.slug === 'atlas' ? <AtlasStory /> : study.slug === 'payrollpro' ? <PayrollStory /> : <ViralStory />}</div>
      </div>
      <ProjectEndnav next={next} />
    </article>
  )
}
