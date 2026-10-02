import type { MouseEvent, ReactNode } from 'react'
import { caseStudies, chapterId, type CaseStudy } from './case-studies'
import { StudyArtwork } from './StudyArtwork'
import AtlasEvidence from './AtlasEvidence'
import DecisionExplorer from './DecisionExplorer'
import payrollRecord from '../../../public/research/payrollpro-system-record.json'
import './case-studies.css'

function JumpLink({ index, children }: { index: number; children: ReactNode }) {
  function jump(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    const target = document.getElementById(chapterId(index))
    target?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    target?.focus({ preventScroll: true })
  }
  return <a href={`#${chapterId(index)}`} onClick={jump}><span className="mono">0{index+1}</span>{children}</a>
}

function Chapter({ index, label, children }: { index: number; label: string; children: ReactNode }) {
  return <section className="study-chapter" id={chapterId(index)} tabIndex={-1}><div className="study-chapter-label"><span className="mono">0{index+1} / {label}</span><i /></div>{children}</section>
}

function Source({ href, title, children, download = false }: { href: string; title: string; children: ReactNode; download?: boolean }) {
  return <a className="study-source" href={href} {...(download ? { download: true } : href.startsWith('https:') ? { target: '_blank', rel: 'noreferrer' } : {})}><div><h3>{title}</h3><p>{children}</p></div><span aria-hidden="true">{download ? '↓' : href.startsWith('https:') ? '↗' : '→'}</span></a>
}

function AtlasStory() {
  return <>
    <Chapter index={0} label="The question"><h2>What makes an audit<br /><em>worth acting on?</em></h2><p>A technical audit can produce hundreds of findings. The difficult part is deciding which ones deserve attention, and being able to explain why.</p><p>I built Atlas around that decision. A finding should retain the URL, the observed page state, and the reasoning behind the recommendation. If a provider fails or a page cannot be measured, the system should keep that uncertainty visible.</p></Chapter>
    <Chapter index={1} label="The system"><h2>Follow the evidence<br />all the way through.</h2><p>My work spans product architecture, crawler behavior, evidence policy, the review workflow, and interface design. The core connects crawl records, raw and rendered page states, canonical and indexability checks, internal links, and structured exports.</p><ol className="study-process">{[
      ['Capture', 'Retain the URL and page response, including the state in which an observation was made.'],
      ['Connect', 'Map internal links and preserve crawl context in a SQLite-backed run.'],
      ['Review', 'Move from an observation to a finding with its supporting evidence still attached.'],
      ['Export', 'Carry that context into structured reports and implementation work.'],
    ].map(([title,detail],index)=><li key={title}><span className="mono">0{index+1}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}</ol></Chapter>
    <Chapter index={2} label="Inspect the evidence"><h2>Same response code.<br /><em>Different content states.</em></h2><p>These two retained pages from Quotes to Scrape make the distinction tangible. Select a page to inspect what was actually present in its source.</p><AtlasEvidence /></Chapter>
    <Chapter index={3} label="Decisions & tradeoffs"><h2>The unknowns stay visible.</h2><div className="study-decisions"><div><h3>Separate observation from severity.</h3><p>A missing canonical tag is an observation. Its significance depends on the page and the site. The demonstration records the absence without assigning a defect.</p></div><div><h3>Keep source and rendered states distinct.</h3><p>The JavaScript sample contains data records without quote-card markup. That is a reason to render the page before judging coverage.</p></div><div><h3>Make a failed measurement inspectable.</h3><p>Provider gaps and failed fetches remain gaps. Keeping them separate from site findings makes the review more useful.</p></div></div><p className="study-status-note">Project record, July 2026: the core crawl and evidence workflow had shipped; provider integration and scoring policy remained in development.</p></Chapter>
    <Chapter index={4} label="Source material"><Source href="https://github.com/SulaymanB2024/Thick-Scraper-VOID-" title="The Atlas repository">The crawler, audit workflow, run persistence, and documented implementation limits.</Source><Source href={`${import.meta.env.BASE_URL}research/atlas-open-corpus-run-2026-07-16.json`} title="The retained sample" download>Two source captures from July 16, 2026. The data used in the explorer above.</Source><Source href="#/writing/atlas-building-an-evidence-console" title="Building Atlas">The product decisions and improvement cycle behind the console.</Source></Chapter>
  </>
}

function PayrollStory() {
  const states = payrollRecord.sections.payroll_states
  return <>
    <Chapter index={0} label="The question"><h2>Privacy is only<br /><em>part of the problem.</em></h2><p>Payroll has several audiences. The recipient needs a payment. The organization needs control over its treasury. A reviewer needs a record of what happened. Those needs should be designed together.</p><p>At the OnionDAO Hackathon in June 2025, I led a three-person team building PayrollPro: a Solana prototype combining Token-2022 confidential-transfer mechanics, multisig treasury controls, and audit visibility.</p><div className="study-pullquote"><p>Protect the amount.<br />Make the authority explicit.<br /><em>Keep the record.</em></p></div></Chapter>
    <Chapter index={1} label="The architecture"><h2>A payment has a lifecycle.</h2><p>The retained system record describes payroll batches and the conditions for changing them. Explore the states below to see how release timing and modification rules fit together.</p><DecisionExplorer label="Prototype state model" steps={[
      { label:'Schedule',title:'Create a frozen batch.',detail:'The schedule holds the payroll definition until its release time. The record includes a batch identifier, a Merkle root, a timestamp, and the total amount.',output:states.scheduled_frozen },
      { label:'Amend',title:'Change the definition while frozen.',detail:'The batch’s root can be replaced while the frozen condition still holds. The amendment has an explicit state requirement.',output:states.amended },
      { label:'Thaw',title:'Respect the release time.',detail:'The thaw operation checks the timestamp before changing the frozen state. This describes a condition in the inspected code.',output:states.thawed },
      { label:'Cancel',title:'Leave a cancellation record.',detail:'The documented cancellation operation emits the batch identifier and amount so that the cancelled batch remains identifiable.',output:states.cancelled },
    ]} note="A code-derived explanation of the prototype. Selecting a state reads the record; it does not execute a payment." /></Chapter>
    <Chapter index={2} label="What the prototype establishes"><h2>A focused build.<br /><em>A defined next step.</em></h2><p>I led the prototype build and brought privacy, treasury control, and auditability into one design.</p><div className="study-decisions"><div><h3>The prototype demonstrated the idea.</h3><p>The public recap describes confidential transfers, multisig, Solana Pay, and QR payouts. The retained record makes the payroll state logic inspectable.</p></div><div><h3>Production would require more proof.</h3><p>The inspected code marks confidential mint and burn behavior as simplified, and the payroll test is a skeleton. End-to-end transaction tests and deployment documentation remain necessary.</p></div></div><p className="study-status-note">The résumé records first place. A teammate’s public recap corroborates a win; an organizer placement record is not included in the retained sources.</p></Chapter>
    <Chapter index={3} label="Source material"><Source href={payrollRecord.source_basis[0].source_url!} title="The teammate recap">Aayush Baniya’s account of the team, the build, and the result.</Source><Source href={`${import.meta.env.BASE_URL}research/payrollpro-system-record.json`} title="The prototype state record" download>Payroll states, transfer operations, and implementation limits in a structured artifact.</Source><Source href="https://github.com/SulaymanB2024/OnionDAO-Project" title="Confidential-transfer recipes">The public cookbook fork used as related technical material. It is not the complete PayrollPro application.</Source></Chapter>
  </>
}

function ViralStory() {
  return <>
    <Chapter index={0} label="The question"><h2>What improved:<br />the agent, or its luck?</h2><p>A live marketing agent works in a changing environment. It researches, creates, publishes, and receives delayed feedback. A higher view count alone cannot explain which part of the system improved.</p><p>I audited ViralBench’s agent implementation and designed an outer engineering loop around it: use traces to understand a failure, propose a bounded change, replay past conditions, and submit the evidence for review.</p><p>The study builds on ViralBench, an existing open-source marketing agent.</p></Chapter>
    <Chapter index={1} label="The improvement loop"><h2>One change.<br /><em>An inspectable experiment.</em></h2><p>The proposed loop gives the engineering agent a specific job at each stage. The evidence required to advance matters as much as the patch.</p><DecisionExplorer label="Proposed improvement loop" outputLabel="Expected output" steps={[
      {label:'Trace',title:'Reconstruct the decision.',detail:'Retain the tool calls, inputs, outputs, artifacts, and failure context needed to understand a run. Start with what the agent actually observed.',output:'A trace and a narrow failure hypothesis.'},
      {label:'Propose',title:'Change a bounded part of the system.',detail:'Ask Codex to improve a defined part of the harness. The output is a reviewable candidate, with the experiment and its assumptions made explicit.',output:'A patch, its scope, and a testable expectation.'},
      {label:'Replay',title:'Test against retained conditions.',detail:'Replay past inputs to inspect behavioral changes and regressions before considering a controlled live trial. Keep offline evidence distinct from market results.',output:'A comparison against the baseline and a record of regressions.'},
      {label:'Review',title:'Keep release authority separate.',detail:'The engineering agent submits its candidate with the evidence. It does not grade its own patch or grant itself permission to deploy.',output:'An accept, reject, or revise decision outside the proposing agent.'},
    ]} note="An interactive explanation of the published design, not a running agent or a report of completed trials." /></Chapter>
    <Chapter index={2} label="Design boundaries"><h2>Make progress<br />possible to explain.</h2><div className="study-decisions"><div><h3>Improve the system around the output.</h3><p>The target is the agent’s research, creation, review, and publishing workflow. A single strong post is not enough to establish a better harness.</p></div><div><h3>Keep the comparison controlled.</h3><p>Replay and bounded live trials answer different questions. The design keeps their inputs, assumptions, and outcomes separate.</p></div><div><h3>Do not let the proposer become the judge.</h3><p>Evaluation and release gates sit outside the engineering agent’s authority. A candidate must remain reviewable before it advances.</p></div></div><p className="study-status-note">Published July 2026 as an engineering design. The study distinguishes existing repository behavior from proposed harness work; no deployed evaluation service or measured uplift is claimed.</p></Chapter>
    <Chapter index={3} label="Source material"><Source href="#/writing/viralbench-codex-agent-harness" title="The full engineering study">The architecture, source analysis, proposed trace model, and experiment design.</Source><Source href="https://github.com/JibranK12345/Viral-Bench/blob/5f5f57e251023ceb37961c0fc2c808f67ceb71eb/marketing-agent.ts" title="The audited agent revision">The upstream implementation examined in the article, pinned to a specific revision.</Source></Chapter>
  </>
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = caseStudies[(caseStudies.indexOf(study)+1)%caseStudies.length]
  return <article className={`case-study case-study-${study.slug}`}>
    <a className="study-back mono" href="#/work">← All work</a>
    <header className="study-hero"><div className="study-hero-copy"><span className="eyebrow">Project study {study.number} / {study.category}</span><h1>{study.slug==='viralbench' ? <>ViralBench<br /><em>+ Codex</em></> : study.name}<span className="period">.</span></h1><p className="study-title">{study.title}</p><p className="study-summary">{study.summary}</p><JumpLink index={study.slug==='atlas' ? 2 : 1}>{study.slug==='atlas' ? 'Inspect the sample' : 'Explore the design'}<span aria-hidden="true">↓</span></JumpLink></div><figure className="study-hero-figure"><StudyArtwork kind={study.slug} /><figcaption><span className="mono">Fig. {study.number}</span>{study.caption}</figcaption></figure></header>
    <dl className="study-facts">{[['My role',study.role],['Period',study.period],['Project state',study.status],['Medium',study.medium]].map(([label,value])=><div key={label}><dt className="mono">{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="study-reading"><aside className="study-contents"><span className="eyebrow">In this study</span><nav aria-label="In this study">{study.chapters.map((chapter,index)=><JumpLink key={chapter} index={index}>{chapter}</JumpLink>)}</nav><a className="study-context-link mono" href="#/resume">View résumé ↗</a></aside><div className="study-prose">{study.slug==='atlas' ? <AtlasStory /> : study.slug==='payrollpro' ? <PayrollStory /> : <ViralStory />}</div></div>
    <a className="study-next" href={`#/work/${next.slug}`}><div><span className="eyebrow">Next study / {next.category}</span><h2>{next.name}</h2></div><span aria-hidden="true">→</span></a>
  </article>
}
