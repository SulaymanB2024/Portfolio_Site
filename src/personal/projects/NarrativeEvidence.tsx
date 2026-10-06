import { ProjectDiagram } from './ProjectDiagrams'
import { SapienComparison } from './SapienComparison'
import './narrative-evidence.css'

function SourceRecord() {
  return (
    <figure className="narrative-specimen specimen-record">
      <figcaption className="specimen-caption mono">
        <span>NVIDIA / public listing excerpt</span>
        <span>Historical check / September 11, 2026</span>
      </figcaption>
      <div className="record-spread">
        <div className="record-origin">
          <span className="mono">Spring 2027 / Santa Clara</span>
          <h3>Developer and Performance Technology</h3>
          <p>The employer posting remains the application reference. This excerpt does not assert current availability.</p>
        </div>
        <dl className="record-definitions">
          <div>
            <dt>Application deadline</dt>
            <dd>Unconfirmed; no deadline substituted from the program term.</dd>
          </div>
          <div>
            <dt>Source verification</dt>
            <dd>September 11, 2026. Viewing this record does not refresh the check.</dd>
          </div>
          <div className="record-personal">
            <dt>Personal target</dt>
            <dd>A date chosen by the student, separate from the application deadline.</dd>
          </div>
        </dl>
      </div>
    </figure>
  )
}

function RoadRights() {
  return (
    <figure className="narrative-specimen specimen-rights">
      <figcaption className="specimen-caption mono">
        <span>SH 288 / Houston, Texas</span>
        <span>At concession termination</span>
      </figcaption>
      <div className="payment-order">
        <div className="payment-origin">
          <span className="mono">The proceeds</span>
          <h3>Debt before equity.</h3>
        </div>
        <ol>
          <li>
            <span className="mono" aria-hidden="true">
              01
            </span>
            <div>
              <h4>Repay outstanding debt</h4>
              <p>Including the federal TIFIA loan.</p>
            </div>
          </li>
          <li>
            <span className="mono" aria-hidden="true">
              02
            </span>
            <div>
              <h4>Distribute the remainder</h4>
              <p>The residual proceeds are available to shareholders.</p>
            </div>
          </li>
        </ol>
      </div>
      <a className="specimen-source mono" href="https://www.transportation.gov/buildamerica/projects/state-highway-sh-288-toll-lanes-project" target="_blank" rel="noreferrer">
        Federal financing record <span aria-hidden="true">↗</span>
      </a>
    </figure>
  )
}

export function NarrativeSystem({ slug }: { slug: string }) {
  if (slug === 'internshipdeadlines') return <SourceRecord />
  if (slug === 'sapien') return <SapienComparison />
  if (slug === 'investing-markets') return <RoadRights />
  return (
    <div className="narrative-specimen specimen-material">
      <ProjectDiagram slug={slug} />
    </div>
  )
}
