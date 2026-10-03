import AnimatedArtwork from '../editorial/AnimatedArtwork'
import { ArtworkMotionControl, useArtworkMotion } from '../editorial/ArtworkMotion'
import { getArticleGenerativeArtwork } from '../editorial/generative/manifest'
import { ProjectDiagram } from './ProjectDiagrams'
import './narrative-evidence.css'

function SourceRecord() {
  return (
    <figure className="narrative-specimen specimen-record">
      <figcaption className="specimen-caption mono">
        <span>Inside a listing</span>
        <span>Illustrative record / no live role</span>
      </figcaption>
      <div className="record-spread">
        <div className="record-origin">
          <span className="mono">The reference</span>
          <h3>Employer posting</h3>
          <p>The original requirements, eligibility, and application link stay attached to the role.</p>
        </div>
        <dl className="record-definitions">
          <div>
            <dt>Application deadline</dt>
            <dd>The employer’s cutoff. An absent date stays unknown.</dd>
          </div>
          <div>
            <dt>Source verification</dt>
            <dd>When the posting was checked. A new page view does not refresh it.</dd>
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

function PairedAudience() {
  return (
    <figure className="narrative-specimen specimen-audience">
      <figcaption className="specimen-caption mono">
        <span>iPhone Duo / paired pricing</span>
        <span>Published Sapien example</span>
      </figcaption>
      <div className="audience-comparison">
        <div className="audience-definition">
          <span className="mono">Held constant</span>
          <h3>The same modeled audience</h3>
          <p>The buyer profiles stay fixed. The price changes.</p>
        </div>
        <div className="audience-offers" aria-label="Two prices considered by the same modeled profiles">
          <div>
            <span className="mono">Offer A</span>
            <h4>$1,999</h4>
            <p>Responses from the modeled profiles</p>
          </div>
          <div>
            <span className="mono">Offer B</span>
            <h4>$1,599</h4>
            <p>Responses from the same profiles</p>
          </div>
        </div>
        <p className="audience-interpretation">
          <strong>What changes is the offer.</strong> Compare the responses within the audience, then inspect the segments and individual reasoning. Simulated choices are not
          observed sales.
        </p>
      </div>
      <a className="specimen-source mono" href="https://www.asksapien.ai/blog/ai-market-research-tools" target="_blank" rel="noreferrer">
        Read the published example <span aria-hidden="true">↗</span>
      </a>
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
  if (slug === 'sapien') return <PairedAudience />
  if (slug === 'investing-markets') return <RoadRights />
  return (
    <div className="narrative-specimen specimen-material">
      <ProjectDiagram slug={slug} />
    </div>
  )
}

const reading = {
  sapien: {
    title: 'The Shopkeeper in the Machine',
    subtitle: 'What the first AI-operated businesses reveal about the gap between completing a task and keeping a business coherent.',
    href: '#/writing/the-first-ai-managers',
    path: '/research/ai-systems/the-first-ai-managers',
    label: 'A related essay / AI systems'
  },
  'investing-markets': {
    title: 'The state owns the pavement. Who owns the cash flow?',
    subtitle: 'A closer reading of Texas toll roads: ownership, concession rights, operators, and the economics underneath.',
    href: '#/markets/who-owns-texas-toll-roads',
    path: '/markets/who-owns-texas-toll-roads',
    label: 'The research / infrastructure'
  }
}

export function NarrativePractice({ slug }: { slug: string }) {
  const { paused } = useArtworkMotion()
  const essay = reading[slug as keyof typeof reading]
  if (essay) {
    const art = getArticleGenerativeArtwork(essay.path)
    return (
      <aside className="narrative-reading" aria-label="Read the related work">
        <div className="narrative-reading-copy">
          <span className="mono">{essay.label}</span>
          <a href={essay.href}>
            <h3>{essay.title}</h3>
            <p>{essay.subtitle}</p>
            <span className="mono reading-call">
              Read the essay <span aria-hidden="true">→</span>
            </span>
          </a>
        </div>
        <div className="narrative-reading-art">
          <AnimatedArtwork artwork={art} size={400} paused={paused} embedded decorative />
          <div className="narrative-art-credit mono">
            <a href={art.attribution.sourceUrl} target="_blank" rel="noreferrer">
              Art / {art.attribution.artistName} ↗
            </a>
            <ArtworkMotionControl />
          </div>
        </div>
      </aside>
    )
  }
  return null
}
