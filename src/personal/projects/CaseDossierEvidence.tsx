import { useId, useState } from 'react'
import { atlasSample, describeAtlasRow } from './atlas-evidence'
import payrollRecord from '../../../public/research/payrollpro-system-record.json'

const artifact = (path: string) => `${import.meta.env.BASE_URL}research/${path}`

/** Both retained responses remain visible: this is a comparison, not a simulated crawl. */
export function AtlasSourceComparison() {
  return (
    <figure className="dossier-source-comparison">
      <figcaption className="dossier-figure-heading">
        <span>Two source captures. One response code.</span>
        <span className="mono">16 JUL 2026 / Quotes to Scrape</span>
      </figcaption>
      <div className="dossier-specimens">
        {atlasSample.rows.map((page, index) => {
          const row = describeAtlasRow(index)
          return (
            <div className="dossier-specimen" key={page.url}>
              <div className="dossier-specimen-heading">
                <h3>{index === 0 ? 'Static source' : 'JavaScript source'}</h3>
                <span className="mono">{row.status_code} OK</span>
              </div>
              <a className="dossier-source-path mono" href={row.url} target="_blank" rel="noreferrer">
                quotes.toscrape.com{row.path}
                <span aria-hidden="true">↗</span>
              </a>
              <div className="dossier-source-measure">
                <strong>{String(row.source_quote_card_count).padStart(2, '0')}</strong>
                <span>
                  Quote-card elements
                  <br />
                  in the captured HTML
                </span>
              </div>
              <div className="dossier-source-marks" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} data-present={i < row.source_quote_card_count}>
                    <span />
                    <span />
                    <span />
                  </i>
                ))}
              </div>
              <dl className="dossier-source-fields">
                <div>
                  <dt>Embedded data records</dt>
                  <dd>{row.runtimeRecords ?? 'Not recorded'}</dd>
                </div>
                <div>
                  <dt>Canonical tag</dt>
                  <dd>{row.canonical}</dd>
                </div>
                <div>
                  <dt>Next page discovered</dt>
                  <dd>{new URL(row.discovered_next_url).pathname}</dd>
                </div>
              </dl>
              <p className="dossier-source-reading">{row.explanation}</p>
              <p className="dossier-source-next">
                <span className="mono">Next step</span>
                {row.nextStep}
              </p>
            </div>
          )
        })}
      </div>
      <div className="dossier-evidence-foot">
        <p>
          Saved source HTML, not a live crawl or a rendered-page measurement. The absence of a canonical tag is an observation, not a severity rating. No search-performance claim
          is made.
        </p>
        <div>
          <a href={artifact('atlas-open-corpus-run-2026-07-16.json')} download>
            Inspect JSON <span aria-hidden="true">↓</span>
          </a>
          <a href={artifact('atlas-open-corpus-run-2026-07-16.csv')} download>
            Download CSV <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </figure>
  )
}

const payrollSteps = [
  {
    key: 'schedule',
    label: 'Schedule',
    condition: 'Record the batch',
    title: 'Scheduled batch',
    detail: 'The schedule records a batch identifier, a Merkle root, a release timestamp and the total amount. The frozen flag makes the condition for later changes explicit.',
    record: payrollRecord.sections.payroll_states.scheduled_frozen
  },
  {
    key: 'amend',
    label: 'Amend',
    condition: 'While frozen',
    title: 'Amend while frozen',
    detail: 'An amendment replaces the batch’s Merkle root only while the frozen condition still holds. This is a guard in the inspected code, not an unrestricted edit.',
    record: payrollRecord.sections.payroll_states.amended
  },
  {
    key: 'thaw',
    label: 'Thaw',
    condition: 'After release time',
    title: 'Thaw after the release time',
    detail:
      'The thaw operation requires the release timestamp to have passed before it clears the frozen flag. Thawing is a state change; this record does not establish that a salary payment completed.',
    record: payrollRecord.sections.payroll_states.thawed
  },
  {
    key: 'cancel',
    label: 'Cancel',
    condition: 'Emit an audit event',
    title: 'Cancellation event',
    detail:
      'The documented cancellation operation emits the batch identifier and amount. The retained summary establishes the event; it does not describe an additional cancellation guard or a completed refund.',
    record: payrollRecord.sections.payroll_states.cancelled
  }
]

export function PayrollLifecycle() {
  const [selected, setSelected] = useState(0)
  const detailId = useId()
  const step = payrollSteps[selected]
  return (
    <figure className="dossier-lifecycle">
      <figcaption className="dossier-figure-heading">
        <span>Payroll batch operations</span>
        <span className="mono">Code-derived prototype / 9d38b02</span>
      </figcaption>
      <div className="dossier-payroll-map dossier-operation-strip" role="group" aria-label="Inspect a documented payroll operation">
        {payrollSteps.map((item, index) => (
          <button type="button" className="dossier-operation" key={item.key} aria-pressed={selected === index} aria-controls={detailId} onClick={() => setSelected(index)}>
            <span className="mono" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="dossier-node-copy">
              <strong>{item.label}</strong>
              <small>{item.condition}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="dossier-operation-reading" id={detailId} aria-live="polite" aria-atomic="true">
        <div>
          <span className="mono">{step.condition}</span>
          <h3>{step.title}</h3>
          <p>{step.detail}</p>
        </div>
        <div className="dossier-record">
          <span className="mono">Retained code summary</span>
          <p>{step.record}</p>
          <a href={artifact('payrollpro-system-record.json')} download>
            Read the state record <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <p className="dossier-method-note">Select an operation to inspect its recorded condition. Code summary at revision 9d38b02.</p>
    </figure>
  )
}

const reviewSteps = [
  {
    label: 'Trace',
    verb: 'Observe',
    title: 'Recorded run evidence',
    detail: 'Retain the tool calls, inputs, outputs, artifacts and failure context needed to understand a run. Start with what the agent actually observed.',
    output: 'A trace and a narrow failure hypothesis.'
  },
  {
    label: 'Propose',
    verb: 'Change',
    title: 'Patch and experiment manifest',
    detail: 'Ask Codex to improve a defined part of the harness. The candidate includes a reviewable patch, the experiment and its assumptions.',
    output: 'A patch, its scope and a testable expectation.'
  },
  {
    label: 'Replay',
    verb: 'Compare',
    title: 'Baseline replay and regression checks',
    detail: 'Replay past inputs to inspect behavioral changes and regressions before considering a controlled live trial. Offline evidence stays distinct from market results.',
    output: 'A baseline comparison and a record of regressions.'
  },
  {
    label: 'Review',
    verb: 'Decide',
    title: 'Independent evaluation and release',
    detail:
      'The engineering agent submits its candidate with the evidence. Evaluation and release gates sit outside its authority; it cannot grade its own patch or grant itself permission to deploy.',
    output: 'An accept, reject or revise decision outside the proposing agent.'
  }
]

export function ViralReviewLoop() {
  const [selected, setSelected] = useState(3)
  const detailId = useId()
  const step = reviewSteps[selected]
  return (
    <figure className="dossier-review-loop">
      <figcaption className="dossier-figure-heading">
        <span>Proposed engineering and review stages</span>
        <span className="mono">Published design / JUL 2026</span>
      </figcaption>
      <div className="dossier-review-map dossier-review-strip" role="group" aria-label="Inspect a stage of the proposed engineering loop">
        <div className="dossier-candidate-stages">
          <span className="dossier-map-label mono">Engineering candidate</span>
          {reviewSteps.slice(0, 3).map((item, index) => (
            <button type="button" className="dossier-review-stage" key={item.label} aria-pressed={selected === index} aria-controls={detailId} onClick={() => setSelected(index)}>
              <span className="mono" aria-hidden="true">
                0{index + 1}
              </span>
              <strong>{item.label}</strong>
              <small>{item.verb}</small>
            </button>
          ))}
        </div>
        <div className="dossier-review-authority">
          <span className="dossier-map-label mono">Separate authority</span>
          <button type="button" className="dossier-review-stage" aria-pressed={selected === 3} aria-controls={detailId} onClick={() => setSelected(3)}>
            <span className="mono" aria-hidden="true">
              04
            </span>
            <strong>Review</strong>
            <small>Accept / reject / revise</small>
          </button>
        </div>
      </div>
      <div className="dossier-operation-reading" id={detailId} aria-live="polite" aria-atomic="true">
        <div>
          <span className="mono">{step.label} / Proposed loop</span>
          <h3>{step.title}</h3>
          <p>{step.detail}</p>
        </div>
        <div className="dossier-record">
          <span className="mono">Proposed output</span>
          <p>{step.output}</p>
          <a href="#/writing/viralbench-codex-agent-harness">
            Read the engineering design <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <p className="dossier-method-note">Published engineering proposal, July 2026.</p>
    </figure>
  )
}
