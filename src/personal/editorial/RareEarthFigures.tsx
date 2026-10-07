import { useId, type ReactNode } from 'react'
import type { ArticleFigure } from './types'
import './rare-earth-figures.css'

// Native reading layouts retain the source figures' text, units and boundaries.
// The original SVGs remain available through ResearchFigure's source link.
const sources = {
  'rare-earth-magnet-capacity-maturity.svg': {
    title: 'U.S. rare-earth magnet capacity by maturity',
    description: 'A stacked bar divides 37,750 stated units of disclosed firm-project capacity into 4,000 with commercial shipments, 3,600 in commissioning, ramp, or qualification, and 30,150 in future projects. Mixed source units normalize to 37,584–38,048 metric tonnes.',
  },
  'rare-earth-magnet-demand-denominators.svg': {
    title: 'Demand denominators for U.S. rare-earth magnets',
    description: 'The diagram separates direct domestic magnet purchases, magnets embedded in imported finished goods, replacement demand, and export demand. Only direct domestic purchases are the near-term order book immediately contestable by a new U.S. magnet factory.',
  },
  'rare-earth-magnet-material-flow.svg': {
    title: 'Rare-earth magnet finished capacity versus gross process flow',
    description: 'A process diagram traces oxide and metal through alloy strip, powder, pressing, sintering, machining, coating, internal recycling, and 37,584 to 38,048 tonnes of normalized finished magnet nameplate. Gross process flow is modeled at 46,400 to 70,459 tonnes.',
  },
}
type SourceName = keyof typeof sources

function FigureFrame({ figure, name, children }: { figure: ArticleFigure; name: SourceName; children: ReactNode }) {
  const descriptionId = useId()
  return <div className="rare-earth-figure" role="group" aria-label={figure.alt} aria-describedby={descriptionId}>
    <span className="sr-only">{sources[name].title}</span>
    <p id={descriptionId} className="sr-only">{sources[name].description}</p>
    {children}
  </div>
}

const capacityStages = [
  { label: 'SHIPPING', title: 'Commercial shipments', value: '4,000', detail: 'Disclosed nameplate plus public shipment evidence. Not full utilization.', tone: 'shipping' },
  { label: 'RAMP / QUAL.', title: 'Commissioning / qualification', value: '3,600', detail: 'Installed or starting lines without broad recurring shipment evidence.', tone: 'ramp' },
  { label: 'FUTURE FIRM PROJECTS', title: 'Future projects', value: '30,150', detail: 'Construction, funded expansions, and later phases.', tone: 'future', boundary: '80% of the project stack' },
]

function CapacityMaturity() {
  return <>
    <header className="rare-earth-heading">
      <p className="rare-earth-kicker">FIGURE 01 / PHYSICAL-CAPACITY AUDIT</p>
      <h3><span className="rare-earth-number">37,750</span> stated units is not current supply</h3>
      <p>Mixed source units; normalized total: 37,584–38,048 metric tonnes</p>
    </header>
    <svg className="rare-earth-capacity-bar" viewBox="0 0 1422 42" preserveAspectRatio="none" aria-hidden="true">
      <rect className="rare-earth-bar-shipping" width="150.6" height="42" />
      <rect className="rare-earth-bar-ramp" x="150.6" width="135.6" height="42" />
      <rect className="rare-earth-bar-future" x="286.2" width="1135.8" height="42" />
      <path d="M150.6 0V42M286.2 0V42" className="rare-earth-bar-divider" />
    </svg>
    <dl className="rare-earth-capacity-rows">{capacityStages.map(stage => <div key={stage.label} data-maturity={stage.tone}>
      <dt><span className="rare-earth-stage-label">{stage.label}</span><span>{stage.title}</span></dt>
      <dd><strong className="rare-earth-number">{stage.value}</strong><div><p>{stage.detail}</p>{stage.boundary && <p className="rare-earth-boundary">{stage.boundary}</p>}</div></dd>
    </div>)}</dl>
    <p className="rare-earth-note">Evidence cutoff: 2026-08-17 · Capacity ≠ qualified output · Source: project ledger and cited primary disclosures</p>
  </>
}

function DemandDenominators() {
  return <>
    <header className="rare-earth-heading">
      <p className="rare-earth-kicker">FIGURE 02 / DEMAND BOUNDARY</p>
      <h3>“U.S. demand” is not one addressable market</h3>
      <p>Strategic exposure is broader than the orders immediately available to a domestic magnet plant</p>
    </header>
    <div className="rare-earth-demand-main">
      <section className="rare-earth-demand-near"><p className="rare-earth-stage-label">NEAR-TERM CONTESTABLE</p><h4>Direct domestic magnet demand</h4><p>Magnets purchased by U.S. motor, component, and system manufacturers.</p></section>
      <p className="rare-earth-demand-bridge"><svg viewBox="0 0 72 16" aria-hidden="true"><path d="M1 8H70M63 1L70 8 63 15" /></svg><span>not automatic</span></p>
      <section><p className="rare-earth-stage-label">STRATEGIC EXPOSURE / LONG-RUN RESHORING</p><h4>Magnets embedded in imported finished goods</h4><p>Capturing this volume may require relocating motor production, redesigning components, or requalifying a complete system.</p></section>
    </div>
    <div className="rare-earth-demand-branches">
      <section><h4>Replacement / aftermarket demand</h4><p>Fragmented, geometry-specific, and often tied to installed equipment.</p></section>
      <section><h4>Export demand</h4><p>Potential utilization subject to qualification, cost, logistics, and trade rules.</p></section>
    </div>
    <p className="rare-earth-note">Do not divide announced domestic nameplate by an embedded-import denominator and call the supply gap closed.</p>
  </>
}

const materialStages = [
  { title: 'Oxide / metal', details: ['NdPr + additives', 'origin and purity matter'] },
  { title: 'Alloy / strip', details: ['chemistry + casting', 'oxygen control'] },
  { title: 'Powder / press', details: ['milling + orientation', 'handling loss'] },
  { title: 'Sinter / machine', details: ['shrinkage + cracking', 'geometry loss'] },
  { title: 'Finished magnets', value: '37.6–38.0 kt', details: ['normalized nameplate'] },
]

function MaterialFlow() {
  return <>
    <header className="rare-earth-heading">
      <p className="rare-earth-kicker">FIGURE 03 / MATERIAL BALANCE</p>
      <h3>Gross flow is not a second capacity total</h3>
      <p>Every disclosure must preserve its chemical form, process stage, unit, and yield boundary</p>
    </header>
    <ol className="rare-earth-flow-stages" aria-label="Material stages from feed to finished magnets">{materialStages.map(stage => <li key={stage.title}>
      <h4>{stage.title}</h4>{stage.value && <strong className="rare-earth-number">{stage.value}</strong>}{stage.details.map(detail => <p key={detail}>{detail}</p>)}
    </li>)}</ol>
    <aside className="rare-earth-scrap-note"><h4>Internal scrap recovery</h4><p>reduces virgin feed but does not erase process loss</p></aside>
    <div className="rare-earth-gross-flow"><p>Modeled gross process flow: <strong className="rare-earth-number">46.4–70.5 kt</strong></p><p>throughput requirement across stages · not additive to finished capacity</p></div>
  </>
}

export function hasRareEarthFigure(src: string) {
  const name = src.split('/').at(-1)
  return name !== undefined && Object.hasOwn(sources, name)
}

export default function RareEarthFigures({ figure }: { figure: ArticleFigure }) {
  const name = figure.src.split('/').at(-1)
  if (!name || !Object.hasOwn(sources, name)) return null
  return <FigureFrame figure={figure} name={name as SourceName}>
    {name === 'rare-earth-magnet-capacity-maturity.svg' ? <CapacityMaturity /> : name === 'rare-earth-magnet-demand-denominators.svg' ? <DemandDenominators /> : <MaterialFlow />}
  </FigureFrame>
}
